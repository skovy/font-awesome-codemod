import * as React from "react";
import { faMinusCircle as faMinusCircleFas } from "@fortawesome/free-solid-svg-icons";
import { faMinusCircle } from "@fortawesome/free-regular-svg-icons";
import { Dot } from "custom-design-system";

const Component = () => {
  return (
    <div>
      <Dot.Notation icon={faMinusCircleFas} />
      <Dot.Notation icon={faMinusCircle} />
    </div>
  );
};
