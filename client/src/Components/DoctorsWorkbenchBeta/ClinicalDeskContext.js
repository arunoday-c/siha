import { createContext } from "react";

const baseState = {};

export const ClinicalDeskContext = createContext(baseState);

export const TYPES = {
  SELECTED_DATE: "SELECTED_DATE",
  SELECTED_DOCTOR: "SELECTED_DOCTOR",
  SELECTED_DEPT: "SELECTED_DEPT",
  DOCTORS_SCHEDULE: "DOCTORS_SCHEDULE",
  APP_STATUS: "APP_STATUS",
  DEPARTMENT_DATA: "DEPARTMENT_DATA",
  PATIENT_RECALL_DATA: "PATIENT_RECALL_DATA",
};

export function reducer(state, { type, payload }) {
  switch (type) {
    case TYPES.SELECTED_DATE:
      return { ...state, workBenchDate: payload };
    case TYPES.SELECTED_DEPT:
      return { ...state, sub_department_id: payload };
    case TYPES.SELECTED_DOCTOR:
      return { ...state, provider_id: payload };
    case TYPES.DOCTORS_SCHEDULE:
      return { ...state, doctors_schedule: payload };
    case TYPES.APP_STATUS:
      return { ...state, app_status: payload };
    case TYPES.DEPARTMENT_DATA:
      return { ...state, departmentData: payload };
    case TYPES.PATIENT_RECALL_DATA:
      return { ...state, patientRecallData: payload };
    default:
      return state;
  }
}
