import React, { memo } from "react";
import DisplayItem from "./DisplayItem";
import DeleteItem from "./DeleteItem";
// import { AlgaehDataGrid, AlgaehLabel } from "algaeh-react-components";

export default memo(function DisplayComponent({ item, deleteState }) {
  return (
    <li>
      <DisplayItem item={item} />
      <DeleteItem item={item} deleteState={deleteState} />
    </li>
  );
});
