import React, { memo, useContext, useEffect, useState } from "react";
import { AppointmentContext } from "../AppointmentContext";
import DoctorSlotHeader from "./doctorSlotHeader";
import DoctorInLeave from "./doctorInLeave";
import DoctorSlots from "./doctorSlotBody";

export default memo(function Schedules(props) {
  const { doctors_schedule } = useContext(AppointmentContext);
  const [width, setWidth] = useState(0);
  const [isChanges, setIsChanges] = useState(false);

  useEffect(() => {
    const _WIDTH = 318 * doctors_schedule?.length ?? 0;
    setWidth(isNaN(_WIDTH) ? 0 : _WIDTH);
    if (Array.isArray(doctors_schedule)) {
      setIsChanges(!isChanges);
    }

    console.log("Doc schedule changed===>", doctors_schedule);
  }, [doctors_schedule]);
  return (
    <div className="portlet-body">
      <div className="appointment-outer-cntr">
        <div className="appointment-inner-cntr" style={{ width: width }}>
          {doctors_schedule?.map((data, index) => (
            <table key={data.provider_id} className="tg">
              <thead>
                <DoctorSlotHeader {...data} />
              </thead>
              <tbody>
                {data.modified === "L" ? (
                  <DoctorInLeave />
                ) : (
                  <DoctorSlots {...data} isChanges={isChanges} />
                )}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </div>
  );
});
