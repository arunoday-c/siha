import React, { createContext, useReducer } from "react";
// import React from "react";
// import { EmployeeMasterContext } from "./EmployeeMasterContext";
// import { EmployeeMasterIndex } from "./EmployeeMasterIndexBeta";

// export default function EmployeeMaster() {
//   return (
//     <EmployeeMasterContext>
//       <EmployeeMasterIndex />
//     </EmployeeMasterContext>
//   );
// }
import { useForm } from "react-hook-form";
const formControlPersonal = useForm({
  shouldFocusError: true,
  defaultValues: {},
});

const formControlOfficial = useForm({
  shouldFocusError: true,
  defaultValues: {
    employee_status: "A",
  },
});
const formControlFamily = useForm({
  shouldFocusError: true,
  defaultValues: {},
});
const formControlRules = useForm({
  shouldFocusError: true,
  // defaultValues: {},
});

const baseState = {
  dropdownData: {
    employee_code_placeHolder: [],
    relegions: [],
    countries: [],
    nationalities: [],
    idtypes: [],
    eosReasons: [],
    agency_list: [],
    banks: [],
    companyaccount: [],
    all_employees: [],
    designations: [],
    emp_groups: [],
    overTime: [],
    branches: [],
    // depservices:[],
    subdepartment: [],
  },
  employee_id: null,
  personalDetails: {
    emloyeeInsertOrUpdateData: [],
  },
  OfficalDetails: {},
  formControlPersonal: formControlPersonal,
  formControlOfficial: formControlOfficial,
  formControlFamily: formControlFamily,
  formControlRules: formControlRules,
};

export const EmployeeMasterContext = createContext(baseState);

const TYPES = {
  setDropDownData: "setDropDownData",
  setEmployee_id: "setEmployee_id",
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
    case TYPES.setDropDownData:
      return { ...state, dropdownData: { ...payload } };
    case TYPES.setPersonalDetails:
      return { ...state, personalDetails: payload };
    case TYPES.setEmployee_id:
      return { ...state, employee_id: payload };
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
    setDropDownData(e) {
      dispatch({
        type: TYPES.setDropDownData,
        payload: { ...state.dropdownData, ...e },
      });
    },
    setPersonalDetails(e) {
      dispatch({ type: TYPES.setPersonalDetails, payload: e });
    },
    setEmployee_id(e) {
      dispatch({ type: TYPES.setEmployee_id, payload: e });
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
