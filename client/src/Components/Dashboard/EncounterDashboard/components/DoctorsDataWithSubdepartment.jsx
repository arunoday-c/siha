import React, { memo, useContext } from "react";
import SingleDoctorCard from "./SingleDoctorCard";
import { EncounterDashboardContext } from "../EncounterDashboardContext";

export default memo(function DoctorsDataWithSubdepartment(props) {
  debugger;
  const { encounterData } = useContext(EncounterDashboardContext);

  return (
    <>
      {encounterData?.map((item, index) => (
        <div key={item.sub_department_id}>
          <div className="col-12">
            <h4>
              Sub Department Name - <b>{item.sub_department_name}</b>
            </h4>
            <hr style={{ paddingBottom: 5 }} />
          </div>
          <div className="col-3">
            <SingleDoctorCard key={index} data={item} />
          </div>
        </div>
      ))}
    </>
  );
});
