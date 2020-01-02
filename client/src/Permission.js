import React, { createContext, useState } from "react";

export const PermissionContext = createContext(null);

export function PermissionProvider({ children }) {
  const intial = [];
  const permissionList = [
    "businesssetup-bankmaster",
    "businesssetup-branch-add"
  ];
  const [permissions, setPermissions] = useState(permissionList);
  const [algaehObject, setAlgaehObject] = useState({});
  function setAlgaehObj(data) {
    setAlgaehObject(result => {
      return { ...result, ...data };
    });
  }
  return (
    <PermissionContext.Provider
      value={{
        permissions,
        setPermissions,
        algaehGlobal: algaehObject,
        setAlgaehGlobal: setAlgaehObj
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}
