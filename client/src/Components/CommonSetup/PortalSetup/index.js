import React from "react";
import { PortalProvider } from "./PortalSetupContext";
import PortalSetupComponent from "./PortalSetup";

export function PortalSetup() {
  return (
    <PortalProvider>
      <PortalSetupComponent />
    </PortalProvider>
  );
}
