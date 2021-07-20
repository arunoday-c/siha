import React, { memo } from "react";

export default memo(function DisplayItem({ item }) {
  return (
    <p className="valueSec">
      <span>{item.patient_name}</span>
      <span>{item.description}</span>
      <span>{item.lab_id_number}</span>
      <span>{item.primary_id_no}</span>
    </p>
  );
});
