import React, { memo, useEffect, useState } from "react";
import TdCell from "./patientCell";
import CurrentTime from "./currentTime";
import { generateDoctorSlots } from "./events";
import moment from "moment";
export default memo(function DoctorSlots(props) {
  const [timeSlot, setTimeSlot] = useState([]);
  const [changeTime, setChangeTime] = useState(undefined);
  useEffect(() => {
    const _SLOTS = generateDoctorSlots(props);
    setTimeSlot([..._SLOTS]);
    const parameters = new URLSearchParams(window.location.search);
    const selectedDate = parameters.get("appointmentDate");
    const todayDate = moment().format("YYYY-MM-DD");

    let interval = undefined;

    if (
      !changeTime &&
      props.slot &&
      props.slot !== "" &&
      selectedDate === todayDate
    ) {
      const slot = parseInt(props.slot, 10);
      if (!changeTime) setChangeTime(moment().format("HH:mm"));
      interval = setInterval(() => {
        setChangeTime(moment().format("HH:mm"));
      }, 1000 * 60 * slot);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [props.isChanges]);
  return timeSlot.map((item) => (
    <React.Fragment key={item.time}>
      <tr>
        <CurrentTime
          changeTime={changeTime}
          slotTime={item.time}
          slot={props.slot}
        />
      </tr>
      <tr style={{ cursor: "pointer" }}>
        <TdCell {...item} />
      </tr>
    </React.Fragment>
  ));
});
