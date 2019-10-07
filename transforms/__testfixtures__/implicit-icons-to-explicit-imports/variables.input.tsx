import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const someVar = "wat";

const Component = () => {
  return (
    <div>
      <FontAwesomeIcon icon={someVar} />
      <FontAwesomeIcon icon="minus-circle" />
      <FontAwesomeIcon icon={["fas", someVar]} />
    </div>
  );
};
