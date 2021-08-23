import React, { useReducer } from "react";
import moment from "moment";
import { reducer, ClinicalDeskContext, TYPES } from "./ClinicalDeskContext";
// import Appointment from "./Appointment";
import DoctorWorkbench from "./components";
export default function ClinicalDeskContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, {
    workBenchDate: moment(),
  });
  const dispatches = {
    setWorkBenchDate(payload) {
      dispatch({ type: TYPES.SELECTED_DATE, payload });
    },
    setDepartment(payload) {
      dispatch({ type: TYPES.SELECTED_DEPT, payload });
    },
    setDoctor(payload) {
      dispatch({ type: TYPES.SELECTED_DOCTOR, payload });
    },
    setDoctorSchedules(payload) {
      dispatch({ type: TYPES.DOCTORS_SCHEDULE, payload });
    },
    setAppointmentDateHeader(payload) {
      dispatch({ type: TYPES.SELECTED_DATE_HEADER, payload });
    },
    setAppointmentStatus(payload) {
      dispatch({ type: TYPES.APP_STATUS, payload });
    },
    setDepartmentData(payload) {
      dispatch({ type: TYPES.DEPARTMENT_DATA, payload });
    },
    setPatientRecallData(payload) {
      dispatch({ type: TYPES.PATIENT_RECALL_DATA, payload });
    },
  };

  return (
    <ClinicalDeskContext.Provider value={{ ...state, ...dispatches }}>
      <DoctorWorkbench {...props} />
    </ClinicalDeskContext.Provider>
  );
}
