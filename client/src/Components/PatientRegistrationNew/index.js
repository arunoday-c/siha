// export { PatientRegistration as default } from "./PatientRegistration";
import React from "react";
import { FProvider } from "./FrontdeskContext";
import { PatientRegistration } from "./PatientRegistration";

export default function Frontdesk() {
  return (
    <FProvider>
      <PatientRegistration />
    </FProvider>
  );
}
