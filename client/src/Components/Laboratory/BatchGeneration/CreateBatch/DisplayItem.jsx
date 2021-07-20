import React, { memo } from "react";

export default memo(function DisplayItem({ item }) {
  return (
    <p className="valueSec">
      <span>
        <b>Aboobacker Sidhiqe</b>
      </span>
      <span>
        {item.id_number}
        <small>Lab ID No.</small>
      </span>
      <span>
        AXQPA2534G<small>Primary ID No.</small>
      </span>
    </p>
  );
});
