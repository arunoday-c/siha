import React, { memo, useEffect, useState } from "react";
import TdCell from "./patientCell";
import { generateDoctorSlots } from "./events";
export default memo(function DoctorSlots(props) {
  const [timeSlot, setTimeSlot] = useState([]);
  useEffect(() => {
    const _SLOTS = generateDoctorSlots(props);
    setTimeSlot([..._SLOTS]);
  }, [props.isChanges]);
  return timeSlot.map((item) => (
    <tr key={item.time} style={{ cursor: "pointer" }}>
      <TdCell {...item} />
    </tr>
  ));
});
