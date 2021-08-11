import React, { useReducer } from "react";
import moment from "moment";
import {
  reducer,
  EncounterDashboardContext,
  TYPES,
} from "./EncounterDashboardContext";
// import Appointment from "./Appointment";
import EncounterDashboard from "./components";
export default function EncounterDashboardContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, {
    appointmentDate: moment(),
  });
  const dispatches = {
    setHospitalData(payload) {
      dispatch({ type: TYPES.HOSPITAL_DATA, payload });
    },
    setDepartment(payload) {
      dispatch({ type: TYPES.SELECTED_DEPT, payload });
    },
    setDoctorData(payload) {
      dispatch({ type: TYPES.DOCTOR_DATA, payload });
    },
    setEncounterData(payload) {
      dispatch({ type: TYPES.ENCOUNTER_DATA, payload });
    },
    setFollowUpPatientCount(payload) {
      dispatch({ type: TYPES.FOLLOWUP_LENGTH, payload });
    },
    setNewPatientCount(payload) {
      dispatch({ type: TYPES.NEW_PATIENT_LENGTH, payload });
    },
    setSubDepartmentData(payload) {
      dispatch({ type: TYPES.SUB_DEPARTMENT_DATA, payload });
    },
    setTotalPatientsLength(payload) {
      dispatch({ type: TYPES.TOTAL_PATIENT_LENGTH, payload });
    },
  };

  return (
    <EncounterDashboardContext.Provider value={{ ...state, ...dispatches }}>
      <EncounterDashboard {...props} />
    </EncounterDashboardContext.Provider>
  );
}
