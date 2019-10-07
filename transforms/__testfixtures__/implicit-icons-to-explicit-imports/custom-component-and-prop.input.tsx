import * as React from "react";
import { Button } from "custom-design-system";

const Component = () => {
  return (
    <div>
      <Button iconProp="minus-circle" />
      <Button iconProp={["far", "minus-circle"]} />
    </div>
  );
};
