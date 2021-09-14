// import React from "react";
import { BedContextProvider } from "./BedMangementContext";
import BedManagement from "./BedManagement";

export default function BedManage(props: { fromAdmission: boolean }) {
  return (
    <BedContextProvider>
      <BedManagement fromAdmission={props.fromAdmission} />
    </BedContextProvider>
  );
}
