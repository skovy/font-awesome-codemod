import * as React from "react";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const someVar = "wat";

const Component = () => {
  return (
    <div>
      <FontAwesomeIcon icon={someVar} />
      <FontAwesomeIcon icon={faMinusCircle} />
      <FontAwesomeIcon icon={["fas", someVar]} />
    </div>
  );
};
