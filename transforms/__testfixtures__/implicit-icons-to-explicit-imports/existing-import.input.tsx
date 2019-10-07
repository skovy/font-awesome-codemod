import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faHammer } from "@fortawesome/free-solid-svg-icons";

const Component = () => {
  return (
    <div>
      <FontAwesomeIcon icon="check-circle" />
      <FontAwesomeIcon icon={faTwitter} />
      <FontAwesomeIcon icon="minus-circle" />
      <FontAwesomeIcon icon="minus-circle" />
      <FontAwesomeIcon icon={faHammer} />
    </div>
  );
};
