import React, { useContext } from "react";
import { PermissionContext } from "../../Permission";

export default function CheckElement(props) {
  const context = useContext(PermissionContext);
  const { permission, disabled } = props;
  if (context.permissions.includes(permission)) {
    if (disabled) {
      return <fieldset disabled={true}>{props.children}</fieldset>;
    } else {
      return null;
    }
  } else {
    return <>{props.children}</>;
  }
}
