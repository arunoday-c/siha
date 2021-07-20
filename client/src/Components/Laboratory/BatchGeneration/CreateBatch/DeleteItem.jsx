import React, { memo } from "react";
// import { AlgaehDataGrid, AlgaehLabel } from "algaeh-react-components";

export default memo(function DeleteItem({ item, deleteState }) {
  const onDelete = () => {
    deleteState(item);
  };
  return (
    <p className="actionSec" onClick={onDelete}>
      <i className="fas fa-trash-alt"></i>
    </p>
  );
});
