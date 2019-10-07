import * as React from "react";
import { faEnvelope as faEnvelopeFas, faTree } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Component = () => {
  return (
    <div>
      <FontAwesomeIcon icon={faEnvelope} />
      <FontAwesomeIcon icon={faEnvelopeFas} />
      <FontAwesomeIcon icon={faTree} />
    </div>
  );
};
