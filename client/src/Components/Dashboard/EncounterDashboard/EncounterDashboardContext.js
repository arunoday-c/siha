import { createContext } from "react";

const baseState = {};

export const EncounterDashboardContext = createContext(baseState);

export const TYPES = {
  HOSPITAL_DATA: "HOSPITAL_DATA",
  DOCTOR_DATA: "DOCTOR_DATA",
  ENCOUNTER_DATA: "ENCOUNTER_DATA",
  FOLLOWUP_LENGTH: "FOLLOWUP_LENGTH",
  NEW_PATIENT_LENGTH: "NEW_PATIENT_LENGTH",
  SUB_DEPARTMENT_DATA: "SUB_DEPARTMENT_DATA",
  TOTAL_PATIENT_LENGTH: "TOTAL_PATIENT_LENGTH",
};

export function reducer(state, { type, payload }) {
  switch (type) {
    case TYPES.HOSPITAL_DATA:
      return { ...state, hospitalData: payload };
    case TYPES.ENCOUNTER_DATA:
      return { ...state, encounterData: payload };
    case TYPES.DOCTOR_DATA:
      return { ...state, doctorData: payload };
    case TYPES.FOLLOWUP_LENGTH:
      return { ...state, followUpPatientCount: payload };
    case TYPES.NEW_PATIENT_LENGTH:
      return { ...state, newPatientCount: payload };
    case TYPES.SUB_DEPARTMENT_DATA:
      return { ...state, subDepartmentData: payload };
    case TYPES.TOTAL_PATIENT_LENGTH:
      return { ...state, totalPatientsLength: payload };
    default:
      return state;
  }
}
