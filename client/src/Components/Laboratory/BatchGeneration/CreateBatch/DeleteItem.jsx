import React, { memo } from "react";
// import { AlgaehDataGrid, AlgaehLabel } from "algaeh-react-components";

export default memo(function DeleteItem({ item, deleteState }) {
  const onDelete = () => {
    deleteState(item);
  };
  return (
    <div className="itemAction">
      <button className="btn btn-sm btn-edit-list" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
});
