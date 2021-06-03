import React, { createContext, useReducer } from "react";

const baseState = {
  output: {
    hims_d_employee_id: null,
    employee_code: null,
    services_id: null,
    title_id: null,
    nationality: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    full_name: null,
    arabic_name: null,
    employee_designation_id: null,
    license_number: null,
    sex: null,
    probation_date: null,
    date_of_birth: null,
    date_of_joining: null,
    date_of_resignation: null,
    category_id: null,
    speciality_id: null,
    employee_id: null,
    address: null,
    address2: null,
    pincode: null,
    city_id: null,
    state_id: null,
    country_id: null,
    Applicable: false,
    same_address: false,
    primary_contact_no: null,
    secondary_contact_number: null,
    email: null,
    emergancy_contact_person: null,
    emergancy_contact_no: 0,
    blood_group: null,
    sub_department_id: null,
    religion_id: null,
    overtime_group_id: null,

    appointment_type: null,
    employee_type: null,
    employee_bank_name: null,
    employee_bank_ifsc_code: null,
    employee_account_number: null,
    masked_bank_account: "",
    employee_bank_id: null,
    company_bank_id: null,
    mode_of_payment: null,
    inactive_date: null,
    employee_group_id: null,

    isdoctor: "N",
    employee_status: "A",

    servTypeCommission: [],
    serviceComm: [],

    deptDetails: [],
    dataPayrolExists: false,
    dataFamIdsExists: false,

    idDetails: [],
    dependentDetails: [],

    insertearnComp: [],
    insertDeductionComp: [],
    insertContributeComp: [],
    insertDependentDetails: [],
    insertdeptDetails: [],
    insertIdDetails: [],
    insertserviceComm: [],
    insertservTypeCommission: [],

    updateearnComp: [],
    updateDeductionComp: [],
    updateContributeComp: [],
    updateDependentDetails: [],
    updatedeptDetails: [],
    updateIdDetails: [],
    updateserviceComm: [],
    updateservTypeCommission: [],

    deleteearnComp: [],
    deleteDeductionComp: [],
    deleteContributeComp: [],
    deleteIdDetails: [],
    deleteDependentDetails: [],

    leave_salary_process: "N",
    late_coming_rule: "N",
    airfare_process: "N",
    exclude_machine_data: "N",
    gratuity_applicable: "N",
    suspend_salary: "N",

    selectedLang: "en",
    present_country_id: null,
    present_state_id: null,
    present_city_id: null,
    department_name: null,
    employeeImage: undefined,
    reporting_to_id: null,
    entitled_daily_ot: "N",
    employee_category: null,
    gratuity_encash: 0,
    identity_type_id: null,
    identity_no: null,
    service_dis_percentage: 100,
    service_credit_percentage: 100,
  },
};

export const EmployeeMasterContextForEmployee = createContext(baseState);

const TYPES = {
  setEmployeeUpdateDetails: "setEmployeeUpdateDetails",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case TYPES.setEmployeeUpdateDetails:
      return { ...state, output: { ...payload } };

    case TYPES.clearState:
      return { ...baseState };
    default:
      return state;
  }
}

export const ContextProviderForEmployee = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {});

  const dispatches = {
    setEmployeeUpdateDetails(e) {
      dispatch({
        type: TYPES.setEmployeeUpdateDetails,
        payload: { ...state.output, ...e },
      });
    },

    clearState() {
      dispatch({ type: TYPES.clearState });
    },
  };
  return (
    <EmployeeMasterContextForEmployee.Provider
      value={{ ...state, ...dispatches }}
    >
      {children}
    </EmployeeMasterContextForEmployee.Provider>
  );
};
