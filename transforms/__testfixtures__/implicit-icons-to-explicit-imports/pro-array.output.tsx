import * as React from "react";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelopeClosed } from "@fortawesome/pro-light-svg-icons";
import { faEnvelope } from "@fortawesome/pro-solid-svg-icons";
import { faEnvelopeOpen } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Component = () => {
  return (
    <div>
      <FontAwesomeIcon icon={faEnvelopeOpen} />
      <FontAwesomeIcon icon={faEnvelope} />
      <FontAwesomeIcon icon={faEnvelopeClosed} />
      <FontAwesomeIcon icon={faTwitter} />
    </div>
  );
};
