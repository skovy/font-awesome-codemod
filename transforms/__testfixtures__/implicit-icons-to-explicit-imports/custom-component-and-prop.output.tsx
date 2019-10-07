import * as React from "react";
import { faMinusCircle as faMinusCircleFas } from "@fortawesome/free-solid-svg-icons";
import { faMinusCircle } from "@fortawesome/free-regular-svg-icons";
import { Button } from "custom-design-system";

const Component = () => {
  return (
    <div>
      <Button iconProp={faMinusCircleFas} />
      <Button iconProp={faMinusCircle} />
    </div>
  );
};
