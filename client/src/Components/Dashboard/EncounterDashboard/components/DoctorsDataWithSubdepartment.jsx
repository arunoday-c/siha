import React, { memo, useContext } from "react";
import SingleDoctorCard from "./SingleDoctorCard";
import { EncounterDashboardContext } from "../EncounterDashboardContext";

export default memo(function DoctorsDataWithSubdepartment(props) {
  const { encounterData } = useContext(EncounterDashboardContext);

  return (
    <div className="row encounterDashCards">
      {encounterData?.map((item, index) => {
        return (
          <SingleDoctorCard key={index} data={item} />

          // <div key={item.sub_department_id}>
          //   <div className="row">
          //     <div className="col-12">
          //       <h4>
          //         Sub Department Name - <b>{item.sub_department_name}</b>
          //       </h4>
          //       <hr style={{ paddingBottom: 5 }} />
          //     </div>
          //   </div>

          // </div>
        );
      })}
    </div>
  );
});
