import { Transform, Core, JSCodeshift, ImportSpecifier } from "jscodeshift";
import { camel, pascal } from "change-case";

/**
 * The default name of the icon component provided by Font Awesome React. It's
 * possible it's aliased or wrapped in another component which can be configured
 * via the `componentName` option.
 */
const DEFAULT_COMPONENT = "FontAwesomeIcon";

/**
 * The default name of the icon prop that the name (or value) of the icon is
 * passed to. By default, Font Awesome React exposes this as the `icon` prop
 * but it's possible it's wrapped or passed to another component. This can be
 * configured via the `propName` option.
 */
const DEFAULT_PROP = "icon";

/**
 * The default package types to use. Font Awesome provides both free and pro
 * icons. This can be configured via the `type` option.
 */
const DEFAULT_PACKAGE_KEY = "free";

// Assume the brand icons are both free and pro because there is only a single
// icon package for brand icons.
const BRAND_ICONS = "@fortawesome/free-brands-svg-icons";

const PACKAGES = {
  pro: {
    fab: BRAND_ICONS,
    fal: "@fortawesome/pro-light-svg-icons",
    far: "@fortawesome/pro-regular-svg-icons",
    fas: "@fortawesome/pro-solid-svg-icons"
  },
  free: {
    fab: BRAND_ICONS,
    far: "@fortawesome/free-regular-svg-icons",
    fas: "@fortawesome/free-solid-svg-icons"
  }
};

type FontStyle = keyof (typeof PACKAGES)["pro"];

/**
 * Options accepted by this transform to customize the behavior.
 */
export interface TransformOptions {
  /**
   * The name of the component to update it's icon prop with an explicit import.
   * This can also accept a sub-component referenced with dot-notation. For
   * example, `Dot.Notation` if it's used as `<Dot.Notation icon="..." />`.
   *
   * @default FontAwesomeIcon
   */
  componentName?: string;

  /**
   * The name of the component's prop name to update with an explicit import.
   *
   * @default icon
   */
  propName?: string;

  /**
   * The type of icons being used, either "free" or "pro".
   *
   * @default free
   */
  type?: "free" | "pro";
}

/**
 * Transform the string icon name to a valid Font Awesome icon definition.
 *
 * @example `user` -> `faUser`
 * @param icon the string representation of the icon
 */
const transformName = (icon: string) => camel(`fa-${icon}`);

/**
 * Find all uses of a given component in the root.
 *
 * @param componentName the name of the icon component
 * @param root the parsed source
 * @param j the jscodeshift library
 */
const findComponents = (
  componentName: string,
  root: ReturnType<Core>,
  j: JSCodeshift
) => {
  // Check if the component being referenced is using dot notation
  // (eg: `Dot.Notation`). It needs to be handled slightly differently.
  const IS_DOT_NOTATION = componentName.indexOf(".") !== -1;

  if (IS_DOT_NOTATION) {
    const [objectName, propertyName] = componentName.split(".");

    // Find all icon components by querying for the dot-notation
    return root.find(j.JSXElement, {
      openingElement: {
        name: { object: { name: objectName }, property: { name: propertyName } }
      }
    });
  } else {
    // Find all icon components directly finding the element
    return root.findJSXElements(componentName);
  }
};

/**
 * Given two import specifiers, determine which should be first.
 *
 * @param firstImportSpecifier the first element to compare.
 * @param secondImportSpecifier the second element to compare.
 */
const sortImportSpecifiers = (
  { imported: { name: firstName } }: ImportSpecifier,
  { imported: { name: secondName } }: ImportSpecifier
) => {
  if (firstName < secondName) return -1;
  if (firstName > secondName) return 1;
  return 0;
};

/**
 * The custom transform adhering to the jscodeshift API.
 */
const transform: Transform = (
  file,
  api,
  {
    componentName = DEFAULT_COMPONENT,
    propName = DEFAULT_PROP,
    type = DEFAULT_PACKAGE_KEY
  }: TransformOptions
) => {
  // Alias the jscodeshift API for ease of use.
  const j = api.jscodeshift;

  // Convert the entire file source into a collection of nodes paths.
  const root = j(file.source);

  // Find the very first import statement (assuming there must be one to be
  // using a Font Awesome React component). This is used as a reference to
  // insert all new imports that need to be added to explicitly import icons.
  const FIRST_IMPORT = root.find(j.ImportDeclaration).at(0);

  // Keep track if any updates get made. If not, no need to update.
  let hasModifications = false;

  /**
   * Given an icon name (eg: `user`), transform that to the proper name
   * (eg: `faUser`) and add an import. This also accounts for naming collisions
   * if an icon by the same name is imported from multiple packages.
   *
   * @returns the icon definition that is imported and that should be used.
   *
   * @param iconName the icon name to import, eg: `user`.
   * @param fontStyle the icon's font style, if blank it's assumed to be `fas`.
   */
  const updateImports = (
    iconName: string,
    fontStyle: FontStyle = "fas"
  ): string => {
    const pkg = PACKAGES[type][fontStyle];
    const iconDefinition = transformName(iconName);
    let localIconDefinition = iconDefinition;

    // Find imports that already have this icon identifer that are not in the
    // same package. If it's the same package we deduplicate later. However, if
    // it's a different package an alias needs to be used to avoid naming
    // collisions with the same icon being imported from different packages.
    // Unique-ify by appending the icon font style and assuming that's
    // sufficient.
    const duplicateIcons = root
      // All import statements...
      .find(j.ImportDeclaration)
      // from another package...
      .filter(imported => imported.node.source.value !== pkg)
      // that match this icon's definition
      .find(j.ImportSpecifier, {
        imported: {
          type: "Identifier",
          name: iconDefinition
        }
      });

    // If the icon definition is already imported from a different package
    // create a unique name specific to this icon and package's font style.
    if (duplicateIcons.size() > 0) {
      localIconDefinition = `${iconDefinition}${pascal(fontStyle)}`;
    }

    const existingImport = root
      // All import statements...
      .find(j.ImportDeclaration)
      // from this same package...
      .filter(imported => imported.node.source.value === pkg)
      // that is the first (should only be one)
      .at(0);

    // First, check for an already existing import and insert the new import
    // into this existing import
    if (existingImport.size() > 0) {
      const existingSpecifiers = existingImport
        // All the specifiers (other imported values)...
        .find(j.ImportSpecifier)
        // as nodes (not the node paths)
        .nodes();

      // Add our new icon definition to the existing list of imported values.
      const specifiers = [
        j.importSpecifier(
          j.identifier(iconDefinition),
          j.identifier(localIconDefinition)
        ),
        ...existingSpecifiers
      ]
        // Enforce deterministic sorting to ease testing.
        .sort(sortImportSpecifiers)
        // Ensure the import values are unique (in case there were already
        // duplicates or the new one already exists).
        .filter(
          (specifier, index, self) =>
            self.findIndex(
              otherSpecifier =>
                otherSpecifier.imported.name === specifier.imported.name
            ) === index
        );

      // Construct a new import statement to replace the existing one
      const updatedImport = j.importDeclaration(
        specifiers,
        j.stringLiteral(pkg),
        "value"
      );

      existingImport.replaceWith(updatedImport);
    } else {
      // Otherwise, insert and create a new import statement since one for this
      // package didn't already exist.
      FIRST_IMPORT.insertAfter(
        j.importDeclaration(
          [
            j.importSpecifier(
              j.identifier(iconDefinition),
              j.identifier(localIconDefinition)
            )
          ],
          j.stringLiteral(pkg),
          "value"
        )
      );
    }

    // The caller needs to use this value to update any usages.
    return localIconDefinition;
  };

  const iconComponents = findComponents(componentName, root, j);

  // Find all the JSX attributes that are an `icon` with an array value
  iconComponents
    .find(j.JSXAttribute, {
      name: {
        type: "JSXIdentifier",
        name: propName
      },
      value: {
        type: "JSXExpressionContainer",
        expression: {
          type: "ArrayExpression"
        }
      }
    })
    .find(j.ArrayExpression)
    .filter(nodePath => {
      const [iconType, iconName] = nodePath.node.elements;

      // Validate that we can actually modify the array value and it has two
      // string values. If both aren't strings, it can't be handled so print
      // an error message.
      if (
        iconType.type !== "StringLiteral" ||
        iconName.type !== "StringLiteral"
      ) {
        console.error(
          `expected: icon={[StringLiteral, StringLiteral]}\nreceived: icon={[${iconType.type}, ${iconName.type}]}\nManually update: ${file.path}`
        );

        // Remove this element from the replace action, the array is invalid
        // and we don't know how to auto-magically update this variable.
        return false;
      } else {
        // Continue with the replace action, the array is valid.
        return true;
      }
    })
    .replaceWith(nodePath => {
      const [iconType, iconName] = nodePath.node.elements;

      // This check has already been performed but it's necessary for TS to
      // properly narrow the types. This `return` code path should never be hit.
      if (
        iconType.type !== "StringLiteral" ||
        iconName.type !== "StringLiteral"
      ) {
        return;
      }

      // Reassign incase the import had to modify the icon name to avoid a
      // collision.
      const iconDefinition = updateImports(
        iconName.value,
        iconType.value as FontStyle
      );

      // Replace the array with a JSX expression value with the now
      // import font name.
      const newNode = j.identifier(iconDefinition);

      hasModifications = true;
      return newNode;
    });

  // Find all the JSX attributes that are an `icon` with a string value
  iconComponents
    .find(j.JSXAttribute, {
      name: {
        type: "JSXIdentifier",
        name: propName
      },
      value: {
        type: "StringLiteral"
      }
    })
    // Find the `icon` props with a string value and replace with a JSX
    // expression, eg: "fa-twitter" -> {faTwitter}
    .find(j.StringLiteral)
    .replaceWith(nodePath => {
      const { node } = nodePath;

      // Reassign incase the import had to modify the icon name to avoid a
      // collision.

      // Update the imports to allow use
      const iconDefinition = updateImports(node.value);

      // Replace the string value with a JSX expression value with the now
      // import font name.
      const newNode = j.jsxExpressionContainer(j.identifier(iconDefinition));

      hasModifications = true;
      return newNode;
    });

  return hasModifications ? root.toSource() : null;
};

export default transform;
