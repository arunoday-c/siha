import React, { useState, useEffect } from "react";
import moment from "moment";
import { IcdCodeForChronic } from "../Subjective/SubjectiveHandler";
import { algaehApiCall } from "../../../utils/algaehApiCall";
export default function () {
  const { current_patient, visit_id } = Window.global;
  const [data, setData] = useState([]);
  useEffect(() => {
    console.log("visit_id", visit_id);
    chronicList();
  }, []);

  function chronicList() {
    if (current_patient) {
      algaehApiCall({
        uri: "/doctorsWorkBench/getChronic",
        method: "GET",
        data: {
          patient_id: current_patient,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            setData(response.data.records);
          }
        },
        onCatch: (error) => {
          console.error("error", error);
        },
      });
    }
  }
  function addChronic(input) {
    if (current_patient && visit_id) {
      algaehApiCall({
        uri: "/doctorsWorkBench/addChronic",
        method: "POST",
        data: {
          ...input,
          patient_id: current_patient,
          visit_id,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            chronicList();
          }
        },
        onCatch: (error) => {
          console.error("error", error);
        },
      });
    }
  }

  function clickChronicAdd() {
    IcdCodeForChronic((result) => {
      addChronic({
        chronic_inactive: false,
        icd_code_id: result.hims_d_icd_id,
      });
      // setData(result);
    });
  }
  function clickToActiveOrInactiveChronic(item) {
    addChronic({
      chronic_inactive: item.chronic_inactive === "N" ? true : false,
      hims_f_chronic_id: item.hims_f_chronic_id,
    });
  }
  return (
    <>
      <div className="actions">
        <button
          className="btn btn-primary btn-circle active"
          onClick={clickChronicAdd}
        >
          <i className="fas fa-plus" />
        </button>
      </div>
      <div className="listofADDWrapper">
        <table className="listofADDTable">
          <thead>
            <tr>
              <th>
                <b>Status</b>
              </th>
              <th>
                <b>Chronic Conditions</b>
              </th>
              <th>
                <b>Recorded By & Date</b>
              </th>
              <th>
                <b>Updated By & Date</b>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>
                  <button
                    onClick={() => {
                      clickToActiveOrInactiveChronic(item);
                    }}
                    className={item.chronic_inactive === "N" ? "red" : "green"}
                  >
                    {item.chronic_inactive === "N" ? "ACTIVE" : "INACTIVE"}
                  </button>
                </td>
                <td>{item.icd_description}</td>
                <td>
                  {item.added_by} /{" "}
                  {moment(item.created_date).format("DD-MM-YYYY HH:mm:ss")}
                </td>
                <td>
                  {item.updated_by} /{" "}
                  {moment(item.updated_date).format("DD-MM-YYYY HH:mm:ss")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
