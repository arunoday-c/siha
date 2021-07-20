import React, { memo } from "react";

export default memo(function DisplayItem({ item }) {
  return (
    <p className="valueSec">
      <span>
        <b>{item.patient_name}</b>
      </span>
      <span>
        {item.lab_id_number}
        <small>Lab ID No.</small>
      </span>
      <span>
        {item.primary_id_no}
        <small>Primary ID No.</small>
      </span>
    </p>
  );
});
