import React from "react";
import moment from "moment";
import {
  Collapse,

  // AlgaehButton,
  // Spin,
  // AlgaehMessagePop,
} from "algaeh-react-components";
import DiagnosisTable from "./DiagnosisTable";
import TreatmentTable from "./TreatmentTable";
import PrescriptionHistory from "./PrescriptionHistoryTable";
import DietPlanHistory from "./DietPlanHistory";
import AllergyHistory from "./AllergyHistory";
import InvestigationTable from "./InvestigationTable";
const { Panel } = Collapse;

// function useDidUpdate(callback, deps) {
//   const hasMount = useRef(false);

//   useEffect(() => {
//     if (hasMount.current) {
//       callback();
//     } else {
//       hasMount.current = true;
//     }
//   }, deps);
// }
export default function AccordionComponent({
  columns,
  display_date,
  user_display_name,
  listOfDetails,
  componentsName,
}) {
  return (
    <>
      <Collapse className="accCntr">
        <Panel
          header={
            <div style={{ display: "inline-block", width: "95%" }}>
              <b>
                {display_date &&
                  moment(display_date).format("DD-MM-YYYY HH:mm:ss")}
              </b>{" "}
              <small>By {user_display_name}</small>
            </div>
          }
          key="1"
        >
          {listOfDetails?.length > 0 &&
            (componentsName === "Diagnosis" ? (
              <DiagnosisTable
                columnsArray={columns}
                columnData={listOfDetails}
              />
            ) : componentsName === "Treatments" ? (
              <TreatmentTable
                columnsArray={columns}
                columnData={listOfDetails}
              />
            ) : componentsName === "Medication" ? (
              <PrescriptionHistory
                columnsArray={columns}
                columnData={listOfDetails}
              />
            ) : componentsName === "Diet" ? (
              <DietPlanHistory
                columnsArray={columns}
                columnData={listOfDetails}
              />
            ) : componentsName === "Allergies" ? (
              <AllergyHistory
                columnsArray={columns}
                columnData={listOfDetails}
              />
            ) : componentsName === "Investigations" ? (
              <InvestigationTable
                columnsArray={columns}
                columnData={listOfDetails}
              />
            ) : null)}
        </Panel>
      </Collapse>
    </>
  );
}
