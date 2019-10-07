import { defineTest } from "jscodeshift/dist/testUtils";

import { TransformOptions } from "../implicit-icons-to-explicit-imports";

// List of all test fixtures with an input and output pair for each.
const TEST_FIXTURES = [
  "array",
  "basic",
  "custom-component-and-prop",
  "dot-notation",
  "duplicate-names-from-multiple-packages",
  "existing-import",
  "multiple-props",
  "pro-array",
  "pro-duplicate-names-from-multiple-packages"
] as const;

type TestFixtures = (typeof TEST_FIXTURES)[number];
type TestFixtureOptions = { [Test in TestFixtures]?: TransformOptions };

// All options are optional, but some of the fixtures require specific options.
const TEST_FIXTURE_OPTIONS: TestFixtureOptions = {
  "custom-component-and-prop": {
    componentName: "Button",
    propName: "iconProp"
  },
  "dot-notation": { componentName: "Dot.Notation" },
  "pro-array": { type: "pro" },
  "pro-duplicate-names-from-multiple-packages": { type: "pro" }
};

describe("implicit-icons-to-explicit-imports", () => {
  TEST_FIXTURES.forEach(test =>
    defineTest(
      __dirname,
      "implicit-icons-to-explicit-imports",
      TEST_FIXTURE_OPTIONS[test],
      `implicit-icons-to-explicit-imports/${test}`,
      { parser: "tsx" }
    )
  );

  describe("icons with variables", () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(console, "error").mockImplementation();
    });

    afterEach(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenLastCalledWith(
        expect.stringContaining(
          `expected: icon={[StringLiteral, StringLiteral]}\nreceived: icon={[StringLiteral, Identifier]}\nManually update:`
        )
      );
    });

    defineTest(
      __dirname,
      "implicit-icons-to-explicit-imports",
      null,
      `implicit-icons-to-explicit-imports/variables`,
      { parser: "tsx" }
    );
  });
});
