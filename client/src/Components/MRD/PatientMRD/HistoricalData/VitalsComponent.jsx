import React, { useEffect, useState } from "react";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { Spin } from "algaeh-react-components";
import _ from "lodash";
function VitalsComponent() {
  const [patientVitals, setPatientVitals] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getPatientVitals();
  }, []);
  const getPatientVitals = () => {
    setLoading(true);
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientVitals",
      method: "GET",
      data: {
        patient_id: Window.global["mrd_patient"],
      },
      cancelRequestId: "getPatientVitals1",
      onSuccess: (response) => {
        if (response.data.success) {
          setLoading(false);
          setPatientVitals(response.data.records);
        } else {
          setLoading(false);
        }
      },
      onFailure: (error) => {
        setLoading(false);
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  return (
    <Spin spinning={loading}>
      <div className="row">
        <div className="col-12 vitalsTimeLineSec">
          <div className="timeline">
            {patientVitals.length > 0 ? (
              patientVitals.map((data, index) => (
                <div key={index} className="timelineContainer right">
                  <div className="content">
                    <p className="dateStamp">
                      Recorded by:<span>{data.recorded_by}</span>
                      Recorded on: <span>{data.dateTime}</span>
                    </p>
                    <div className="vitalsCntr">
                      <ul className="vitals-box">
                        {_.orderBy(data.list, (o) => o.sequence_order).map(
                          (vitals, ind) => (
                            <li className="each-vitals-box" key={ind}>
                              <p>{vitals.vital_short_name}</p>
                              <span className="vitalsText">
                                {vitals.vital_value}
                              </span>
                              <span>{vitals.formula_value}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No vitals found</p>
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
}

export default VitalsComponent;
