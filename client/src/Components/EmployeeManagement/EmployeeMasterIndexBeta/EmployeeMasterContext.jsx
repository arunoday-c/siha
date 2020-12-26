import React, { createContext, useReducer } from "react";

const baseState = {
  personalDetails: {},
};

export const EmployeeMasterContext = createContext(baseState);

const TYPES = {
  setPersonalDetails: "setPersonalDetails",
  setOfficialDetails: "setOfficialDetails",
  setFamilyAndIdentificationDetails: "setFamilyAndIdentificationDetails",
  setPayrollDetails: "setPayrollDetails",
  setRolesDetails: "setRolesDetails",
  setCommonSetup: "setCommonSetup",
  clearState: "clearState",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case TYPES.setPersonalDetails:
      return { ...state, personalDetails: payload };
    case TYPES.setOfficialDetails:
      return { ...state, OfficalDetails: { ...payload } };
    case TYPES.setFamilyAndIdentificationDetails:
      return { ...state, setFamilyAndIdentificationDetails: { ...payload } };
    case TYPES.setPayrollDetails:
      return { ...state, PayRollDetails: { ...payload } };
    case TYPES.setRolesDetails:
      return { ...state, rolesDetails: { ...payload } };
    case TYPES.setCommonSetup:
      return { ...state, commonSetup: payload };
    case TYPES.clearState:
      return { ...baseState };
    default:
      return state;
  }
}

export const FProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {});

  const dispatches = {
    setPersonalDetails(e) {
      dispatch({ type: TYPES.setPersonalDetails, payload: e });
    },
    setOfficialDetails(e) {
      dispatch({ type: TYPES.setOfficialDetails, payload: e });
    },
    setFamilyAndIdentificationDetails(e) {
      dispatch({ type: TYPES.setFamilyAndIdentificationDetails, payload: e });
    },
    setPayrollDetails(e) {
      dispatch({ type: TYPES.setPayrollDetails, payload: e });
    },
    setRolesDetails(e) {
      dispatch({ type: TYPES.setRolesDetails, payload: e });
    },
    setCommonSetup(e) {
      dispatch({ type: TYPES.setCommonSetup, payload: e });
    },
    clearState(e) {
      dispatch({ type: TYPES.clearState, payload: e });
    },
  };
  return (
    <EmployeeMasterContext.Provider value={{ ...state, ...dispatches }}>
      {children}
    </EmployeeMasterContext.Provider>
  );
};
