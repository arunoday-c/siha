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
    "Nursing Notes",
    "Diagnosis",
    "Diet",
    "Allergies",
    "Treatments",
    "Medication",
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
                >
                  <span className={componentIndex === 0 ? "active" : ""}>
                    Vitals
                  </span>
                </li>
                <li
                  onClick={() => {
                    setComponentIndex(1);
                  }}
                >
                  <span className={componentIndex === 1 ? "active" : ""}>
                    Nursing Notes
                  </span>
                </li>
                <li
                  onClick={() => {
                    setComponentIndex(2);
                  }}
                >
                  <span className={componentIndex === 2 ? "active" : ""}>
                    Diagnosis
                  </span>
                </li>{" "}
                <li
                  onClick={() => {
                    setComponentIndex(3);
                  }}
                >
                  <span className={componentIndex === 3 ? "active" : ""}>
                    Diet Plan
                  </span>
                </li>{" "}
                <li
                  onClick={() => {
                    setComponentIndex(4);
                  }}
                >
                  <span className={componentIndex === 4 ? "active" : ""}>
                    Allergies
                  </span>
                </li>
                <li
                  onClick={() => {
                    setComponentIndex(5);
                  }}
                >
                  <span className={componentIndex === 5 ? "active" : ""}>
                    Treatments/ Procedure
                  </span>
                </li>
                <li
                  onClick={() => {
                    setComponentIndex(6);
                  }}
                >
                  <span className={componentIndex === 6 ? "active" : ""}>
                    Medication
                  </span>
                </li>
                <li
                  onClick={() => {
                    setComponentIndex(7);
                  }}
                >
                  <span className={componentIndex === 7 ? "active" : ""}>
                    Investigations
                  </span>
                </li>
                {/* <li
                  onClick={() => {
                    setComponentIndex(6);
                  }}
                  value={"Payments"}
                >
                  <span className="active">Payment History</span>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="col-9">
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">
                History Details - {componentsName[componentIndex]}
              </h3>
            </div>
          </div>
          <div className="portlet-body historyDetailsCntr">
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
              <CategoryComponent componentsName={"Diet"} />
            ) : componentIndex === 4 ? (
              <CategoryComponent componentsName={"Allergies"} />
            ) : componentIndex === 5 ? (
              <CategoryComponent componentsName={"Treatments"} />
            ) : componentIndex === 6 ? (
              <CategoryComponent componentsName={"Medication"} />
            ) : componentIndex === 7 ? (
              <CategoryComponent componentsName={"Investigations"} />
            ) : componentIndex === 8 ? (
              <CategoryComponent componentsName={"Payments"} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoricalDataComponent;
