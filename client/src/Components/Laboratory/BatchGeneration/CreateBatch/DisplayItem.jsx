import React, { memo } from "react";

export default memo(function DisplayItem({ item }) {
  return (
    <div className="itemReq">
      <h6>{item.id_number}</h6>
    </div>
  );
});
