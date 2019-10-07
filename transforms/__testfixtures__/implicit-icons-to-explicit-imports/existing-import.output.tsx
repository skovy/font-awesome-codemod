import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faCheckCircle, faHammer, faMinusCircle } from "@fortawesome/free-solid-svg-icons";

const Component = () => {
  return (
    <div>
      <FontAwesomeIcon icon={faCheckCircle} />
      <FontAwesomeIcon icon={faTwitter} />
      <FontAwesomeIcon icon={faMinusCircle} />
      <FontAwesomeIcon icon={faMinusCircle} />
      <FontAwesomeIcon icon={faHammer} />
    </div>
  );
};
