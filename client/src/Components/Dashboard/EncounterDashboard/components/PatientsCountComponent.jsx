import React, { memo, useContext } from "react";
import { EncounterDashboardContext } from "../EncounterDashboardContext";
import "../../dashboard.scss";
export default memo(function PatientsCountComponent(patientCountData) {
  const { totalPatientsLength, newPatientCount, followUpPatientCount } =
    useContext(EncounterDashboardContext);
  return (
    <div className="row card-deck">
      <div className="card animated fadeInUp faster">
        <div className="content">
          <div className="row">
            {/* <div className="col-4">
                <div className="icon-big text-center">
                  <i className="fas fa-calendar-check" />
                </div>
              </div> */}
            <div className="col-12">
              <div className="numbers">
                <p>Total Patients</p>
                {totalPatientsLength ? totalPatientsLength : 0.0}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card animated fadeInUp faster">
        <div className="content">
          <div className="row">
            {/* <div className="col-4">
                <div className="icon-big text-center">
                  <i className="fas fa-walking" />
                </div>
              </div> */}
            <div className="col-12">
              <div className="numbers">
                <p>Total New Patients</p>
                {newPatientCount ? totalPatientsLength : 0.0}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card animated fadeInUp faster">
        <div className="content">
          <div className="row">
            {/* <div className="col-4">
                <div className="icon-big text-center">
                  <i className="fas fa-credit-card" />
                </div>
              </div> */}
            <div className="col-12">
              <div className="numbers">
                <p>Total Follow Up Patients</p>
                {followUpPatientCount ? followUpPatientCount : 0.0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="card animated fadeInUp faster">
    //   <div className="content">
    //     <div className="row">
    //       {/* <div className="col-4">
    //           <div className="icon-big text-center">
    //             <i className="fas fa-calendar-check" />
    //           </div>
    //         </div> */}
    //       <div className="col-12">
    //         <div className="numbers">
    //           {/* {patientCountData.map((item) => (
    //             <>
    //               <p>{item.description}</p>
    //               {item.count}
    //             </>
    //           ))} */}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
});
