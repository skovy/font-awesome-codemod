import * as React from "react";
import { faEnvelope as faEnvelopeFal } from "@fortawesome/pro-light-svg-icons";
import { faEnvelope as faEnvelopeFas, faTree } from "@fortawesome/pro-solid-svg-icons";
import { faEnvelope } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Component = () => {
  return (
    <div>
      <FontAwesomeIcon icon={faEnvelope} />
      <FontAwesomeIcon icon={faEnvelopeFas} />
      <FontAwesomeIcon icon={faTree} />
      <FontAwesomeIcon icon={faEnvelopeFal} />
    </div>
  );
};
