import React, { useState } from "react";
// import AccordionComponent from "./AccordionComponent";
import CategoryComponent from "./CategoryComponent";
import VitalsComponent from "./VitalsComponent";
import NursesNotes from "../../../PatientProfile/Examination/NursesNotes";
function HistoricalDataComponent() {
  //   const [historicalDataComponent, setHistoricalDataComponent] = useState(
  //   0
  //   );
  const [componentIndex, setComponentIndex] = useState(0);
  const componentsName = [
    "Vitals",
    "NursingNotes",
    "Diagnosis",
    "Treatments",
    "Prescription",
    "Investigations",
    "Payments",
  ];

  return (
    <div className="row">
      <div className="col-3">
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">History Category</h3>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <ul className="historyCategoryList">
                <li
                  onClick={() => {
                    setComponentIndex(0);
                  }}
                  value={"Vitals"}
                >
                  <span className="active">Vitals</span>
                </li>

                <li
                  onClick={() => {
                    setComponentIndex(1);
                  }}
                  value={"NursingNotes"}
                >
                  <span>Nursing Notes</span>
                </li>
                <li
                  onClick={() => {
                    setComponentIndex(2);
                  }}
                  value={"NursingNotes"}
                >
                  <span>Diagnosis</span>
                </li>
                <li
                  onClick={() => {
                    setComponentIndex(3);
                  }}
                  value={"Treatments"}
                >
                  <span>Treatments/ Procedure</span>
                </li>
                <li
                  onClick={() => {
                    setComponentIndex(4);
                  }}
                  value={"Prescription"}
                >
                  <span>Prescription History</span>
                </li>
                <li
                  onClick={() => {
                    setComponentIndex(5);
                  }}
                  value={"Investigations"}
                >
                  <span>Investigations</span>
                </li>
                <li
                  onClick={() => {
                    setComponentIndex(6);
                  }}
                  value={"Payments"}
                >
                  <span>Payment History</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="col-9">
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">History Details - [Vitals]</h3>
            </div>
          </div>
          <div className="portlet-body historyDetailsCntr">
            {" "}
            {componentIndex === 0 ? (
              <VitalsComponent
                componentsName={componentsName[componentIndex]}
              />
            ) : componentIndex === 1 ? (
              <NursesNotes
                patient_id={Window?.global?.mrd_patient}
                viewOnly={true}
              />
            ) : componentIndex === 2 ? (
              <CategoryComponent componentsName={"Diagnosis"} />
            ) : componentIndex === 3 ? (
              <CategoryComponent componentsName={"Treatments"} />
            ) : componentIndex === 4 ? (
              <CategoryComponent componentsName={"Prescription"} />
            ) : componentIndex === 5 ? (
              <CategoryComponent componentsName={"Investigations"} />
            ) : componentIndex === 6 ? (
              <CategoryComponent componentsName={"Payments"} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoricalDataComponent;
