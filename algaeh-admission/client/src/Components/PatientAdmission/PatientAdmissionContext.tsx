import React, { createContext, useReducer } from "react";

const baseState: any = {
  department_id: null,
  sub_department_id: null,
  doctor_id: null,
  selectedBedData: [],
  insuranceInfo: {
    primary_insurance_provider_id: null,
    primary_network_office_id: null,
    primary_network_id: null,
  },
  savedPatient: null,
  disableAfterAdmission: false,
};

export const PatAdmissionContext = createContext(baseState);

const TYPES = {
  setSelectedBedData: "setSelectedBedData",
  setInsuranceInfo: "setInsuranceInfo",
  setDisableAfterAdmission: "setDisableAfterAdmission",
  setServiceInfo: "setServiceInfo",
  setSavedPatient: "setSavedPatient",
  clearState: "clearState",
};

function reducer(
  state: any,
  { type, payload }: { type: string; payload: any }
) {
  switch (type) {
    case TYPES.setServiceInfo:
      if (payload === null) {
        return {
          ...state,
          sub_department_id: null,
          doctor_id: null,
        };
      } else {
        const [sub_department_id, doctor_id] = payload?.split("-");
        return {
          ...state,
          sub_department_id,
          doctor_id,
        };
      }
    case TYPES.setSavedPatient:
      return { ...state, savedPatient: payload };
    case TYPES.setDisableAfterAdmission:
      return { ...state, disableAfterAdmission: payload };
    case TYPES.setSelectedBedData:
      if (payload === null) {
        return { ...state, selectedBedData: {} };
      } else {
        return { ...state, selectedBedData: { ...payload } };
      }
    case TYPES.setInsuranceInfo:
      if (payload === null) {
        return { ...state, insuranceInfo: {} };
      } else {
        return { ...state, insuranceInfo: { ...payload } };
      }
    case TYPES.clearState:
      return { ...baseState };
    default:
      return state;
  }
}

export const PatAdmissionContextProvider = ({
  children,
}: {
  children: any;
}) => {
  const [state, dispatch] = useReducer(reducer, {});

  const dispatches = {
    setServiceInfo(e: any) {
      dispatch({ type: TYPES.setServiceInfo, payload: e });
    },
    setSelectedBedData(e: any) {
      dispatch({ type: TYPES.setSelectedBedData, payload: e });
    },
    setInsuranceInfo(e: any) {
      dispatch({ type: TYPES.setInsuranceInfo, payload: e });
    },
    clearState() {
      dispatch({ type: TYPES.clearState, payload: "" });
    },
    setSavedPatient(e: any) {
      dispatch({ type: TYPES.setSavedPatient, payload: e });
    },
    setDisableAfterAdmission(e: any) {
      dispatch({ type: TYPES.setDisableAfterAdmission, payload: e });
    },
  };
  return (
    <PatAdmissionContext.Provider value={{ ...state, ...dispatches }}>
      {children}
    </PatAdmissionContext.Provider>
  );
};
