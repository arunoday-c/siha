import React, { memo, useContext } from "react";
import { PortalSetupContext } from "./PortalSetupContext";
import "./PortalSetup.scss";
import { updatePortal } from "./events";
export default memo(function PortalActive(
  {
    //   setIsDirty,
    //   portal_exists,
    //   setPortal_exists,
  }
) {
  const onRadioChange = (e) => {
    setPortalState({
      ...portalState,
      // isDirty: true,
      portal_exists: e.target.value,
    });

    // if (portalState?.isDirty) {
    updatePortal({ portal_exists: e.target.value });
  };
  const { portalState, setPortalState } = useContext(PortalSetupContext);
  return (
    <div className="col-3 form-group">
      <label>Portal Active</label>
      <div className="customRadio">
        <label className="radio inline">
          <input
            type="radio"
            value="Y"
            checked={portalState?.portal_exists === "Y"}
            onChange={(e) => {
              onRadioChange(e);
            }}
            name="portal_exists"
          />
          <span>Yes</span>
        </label>{" "}
        <label className="radio inline">
          <input
            type="radio"
            value="N"
            checked={portalState?.portal_exists === "N"}
            onChange={(e) => {
              onRadioChange(e);
            }}
            name="portal_exists"
          />
          <span>No</span>
        </label>
      </div>
    </div>
  );
});
