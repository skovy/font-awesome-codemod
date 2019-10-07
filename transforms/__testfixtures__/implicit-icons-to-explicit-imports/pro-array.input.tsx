import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Component = () => {
  return (
    <div>
      <FontAwesomeIcon icon={["far", "envelope-open"]} />
      <FontAwesomeIcon icon={["fas", "envelope"]} />
      <FontAwesomeIcon icon={["fal", "envelope-closed"]} />
      <FontAwesomeIcon icon={["fab", "twitter"]} />
    </div>
  );
};
