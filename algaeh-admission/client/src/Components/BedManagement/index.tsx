// import React from "react";
import { BedContextProvider } from "./BedMangementContext";
import BedManagement from "./BedManagement";

export default function BedManage() {
  return (
    <BedContextProvider>
      <BedManagement />
    </BedContextProvider>
  );
}
