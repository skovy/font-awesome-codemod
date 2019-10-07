# font-awesome-codemod

This repository contains a codemod script to use with [jscodeshift](https://github.com/facebook/jscodeshift).

## :hammer_and_wrench: Setup & Run

```sh
yarn add -g jscodeshift
git clone https://github.com/skovy/font-awesome-codemod
jscodeshift -t font-awesome-codemod/transforms/implicit-icons-to-explicit-imports.ts <file>
```

Use the `-d` option for a dry-run and use `-p` to print the output for comparison.

## :gear: Options:

All options have a default but can be set with the following options:

### `--componentName`:

**Type**: `string`

**Default**: `FontAwesomeIcon`

**Example**: `--componentName=Icon`

The name of the component to update the icon usage

### `--propName`

**Type**: `string`

**Default**: `icon`

**Example**: `--propName=iconProp`

The name of the prop on the component to update the icon usage.

### `--type`

**Type**: `"free" | "pro"`

**Default**: `free`

**Example**: `--type=pro`

The type of packages (imports) to replace the icons usages.

## :mag: Example

### :arrow_right: Input

```tsx
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Component = () => {
  return <FontAwesomeIcon icon="minus-circle" />;
};
```

### ️ :arrow_left: Output

```tsx
import * as React from "react";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Component = () => {
  return <FontAwesomeIcon icon={faMinusCircle} />;
};
```
