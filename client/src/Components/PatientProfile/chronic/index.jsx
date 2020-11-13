import React, { useState, useEffect } from "react";
import moment from "moment";
import "./chronic.scss";
import { IcdCodeForChronic } from "../Subjective/SubjectiveHandler";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import MyContext from "../../../utils/MyContext";
// import { message } from "algaeh-react-components";
export default function ({ checkChronicExists, updateChronic }) {
  const { current_patient, visit_id } = Window.global;
  // const { state } = useContext(MyContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    // console.log("state?.updateChronic", state?.updateChronic);
    chronicList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateChronic]);

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
            const checkExists = response.data.records.filter(
              (f) => f.chronic_inactive === "N"
            );

            checkChronicExists(checkExists.length > 0 ? true : false);
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
            swalMessage({
              title: "Chronic added successfully",
              type: "success",
            });
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
    <div className="cronicCntr">
      <div className="cronicActions">
        <button className="cronicBtn" onClick={clickChronicAdd}>
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
          {data.filter((item) => {
            return item["chronic_category"] === "D";
          }).length > 0 ? (
            <tbody>
              {data.map((item, index) => {
                return item["chronic_category"] === "D" ? (
                  <tr key={index}>
                    <td>
                      <button
                        onClick={() => {
                          clickToActiveOrInactiveChronic(item);
                        }}
                        className={
                          item.chronic_inactive === "N"
                            ? "btn btn-small btn-red"
                            : "btn btn-small btn-green"
                        }
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
                ) : null;
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colspan="4">No Chronic Conditions Found</td>
              </tr>
            </tbody>
          )}
        </table>
        <table className="listofADDTable">
          <thead>
            <tr>
              <th>
                <b>Status</b>
              </th>
              <th>
                <b>Medication Name</b>
              </th>
              <th>
                <b>Medication Category</b>
              </th>
              <th>
                <b>Recorded By & Date</b>
              </th>
              <th>
                <b>Updated By & Date</b>
              </th>
            </tr>
          </thead>
          {data.filter((item) => {
            return item["chronic_category"] === "M";
          }).length > 0 ? (
            <tbody>
              {data.map((item, index) => {
                return item["chronic_category"] === "M" ? (
                  <tr key={index}>
                    <td>
                      <button
                        onClick={() => {
                          clickToActiveOrInactiveChronic(item);
                        }}
                        className={
                          item.chronic_inactive === "N"
                            ? "btn btn-small btn-red"
                            : "btn btn-small btn-green"
                        }
                      >
                        {item.chronic_inactive === "N" ? "ACTIVE" : "INACTIVE"}
                      </button>
                    </td>
                    <td>{item.item_description}</td>
                    <td>
                      {item.chronic_category === "E" ? "External" : "Internal"}
                    </td>
                    <td>
                      {item.added_by} /{" "}
                      {moment(item.created_date).format("DD-MM-YYYY HH:mm:ss")}
                    </td>
                    <td>
                      {item.updated_by} /{" "}
                      {moment(item.updated_date).format("DD-MM-YYYY HH:mm:ss")}
                    </td>
                  </tr>
                ) : null;
              })}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colspan="5">No Chronic Mecdication Found</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
