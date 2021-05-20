import React from "react";
import _ from "lodash";
import moment from "moment";
import "./vitals.scss";

function VitalsHistory({ _vitalsGroup }) {
  return (
    <div className="col vitalsTimeLineSec">
      <h6 className="margin-top-15">Vitals History</h6>
      <hr />
      <div className="timeline">
        {_vitalsGroup.map((data, index) => (
          <div key={index} className="timelineContainer right">
            <div className="content">
              <p className="dateStamp">
                Recorded by:<span>{data.recorded_by}</span>
                Recorded on:{" "}
                <span>{moment(data.recorded_date).format("DD-MM-YYYY")}</span>
                Created on:
                <span>
                  {moment(data.dateTime).format("DD-MM-YYYY hh:mm:ss A")}
                </span>
              </p>
              <div className="vitalsCntr">
                <ul className="vitals-box">
                  {_.orderBy(data.list, (o) => o.sequence_order).map(
                    (vitals, ind) => (
                      <li className="each-vitals-box" key={ind}>
                        <p>{vitals.vital_short_name}</p>
                        <span className="vitalsText">{vitals.vital_value}</span>
                        <span>{vitals.formula_value}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VitalsHistory;
