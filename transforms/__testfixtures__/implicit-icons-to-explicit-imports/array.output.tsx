import * as React from "react";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faEnvelopeOpen } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Component = () => {
  return (
    <div>
      <FontAwesomeIcon icon={faEnvelopeOpen} />
      <FontAwesomeIcon icon={faEnvelope} />
      <FontAwesomeIcon icon={faTwitter} />
    </div>
  );
};
