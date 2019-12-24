import React, { createContext, useState } from "react";

export const PermissionContext = createContext(null);

export function PermissionProvider({ children }) {
  const intial = [];
  const permissionList = [
    "businesssetup-bankmaster",
    "businesssetup-branch-add"
  ];
  const [permissions, setPermissions] = useState(permissionList);

  return (
    <PermissionContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </PermissionContext.Provider>
  );
}
