import * as React from "react";
import { Dot } from "custom-design-system";

const Component = () => {
  return (
    <div>
      <Dot.Notation icon="minus-circle" />
      <Dot.Notation icon={["far", "minus-circle"]} />
    </div>
  );
};
