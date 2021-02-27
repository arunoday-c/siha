import React, { createContext, useReducer } from "react";
debugger;
const baseState = {
  department_id: null,
  sub_department_id: null,
  services_id: null,
  doctor_id: null,
  department_type: null,
  service_type_id: null,
  primary_network_office_id: null,
  billData: null,
  cardData: {
    card_name: "",
    card_number: "",
    hims_d_bank_card_id: null,
  },
  billInfo: {
    advance_adjust: 0,
    card_amount: 0,
    cash_amount: 0,
    cheque_amount: 0,
    company_payble: 0,
    company_res: 0,
    company_tax: 0,
    copay_amount: 0,
    deductable_amount: 0,
    discount_amount: 0,
    gross_total: 0,
    net_amount: 0,
    net_total: 0,
    patient_payable: 0,
    patient_res: 0,
    patient_tax: 0,
    receiveable_amount: 0,
    s_patient_tax: 0,
    sec_company_paybale: 0,
    sec_company_res: 0,
    sec_company_tax: 0,
    sec_copay_amount: 0,
    sec_deductable_amount: 0,
    sheet_discount_amount: 0,
    sheet_discount_percentage: 0,
    sub_total_amount: 0,
    total_amount: 0,
    total_tax: 0,
    unbalanced_amount: 0,
  },
  consultationInfo: {
    hims_d_visit_type_id: null,
    visit_type_code: null,
    visit_type_desc: "",
    visit_status: "",
    arabic_visit_type_desc: "",
    consultation: "",
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
  },
  disabled: false,
  savedPatient: null,
  from_package: false,
};

export const FrontdeskContext = createContext(baseState);

const TYPES = {
  setServiceInfo: "setServiceInfo",
  setInsuranceInfo: "setInsuranceInfo",
  setBillInfo: "setBillInfo",
  setBillData: "setBillData",
  setCardDataGlobal: "setCardDataGlobal",
  setConsultationInfo: "setConsultationInfo",
  setDisable: "setDisable",
  setSavedPatient: "setSavedPatient",
  clearState: "clearState",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case TYPES.setServiceInfo:
      if (payload === null) {
        return {
          ...state,
          sub_department_id: null,
          services_id: null,
          doctor_id: null,
          department_type: null,
          department_id: null,
          service_type_id: null,
        };
      } else {
        const [
          sub_department_id,
          services_id,
          doctor_id,
          department_type,
          department_id,
          service_type_id,
        ] = payload?.split("-");
        return {
          ...state,
          sub_department_id,
          services_id,
          doctor_id,
          department_type,
          department_id,
          service_type_id,
        };
      }
    case TYPES.setInsuranceInfo:
      return { ...state, primary_network_office_id: payload };
    case TYPES.setBillInfo:
      return { ...state, billInfo: { ...payload } };
    case TYPES.setCardDataGlobal:
      return { ...state, cardData: { ...payload } };
    case TYPES.setBillData:
      return { ...state, billData: { ...payload } };
    case TYPES.setConsultationInfo:
      return { ...state, consultationInfo: { ...payload } };
    case TYPES.setDisable:
      return { ...state, disabled: payload };
    case TYPES.setSavedPatient:
      return { ...state, savedPatient: payload };
    case TYPES.clearState:
      return { ...baseState };
    default:
      return state;
  }
}

export const FProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    sub_department_id: null,
    services_id: null,
    doctor_id: null,
    department_type: null,
    primary_network_office_id: null,
  });

  const dispatches = {
    setServiceInfo(e) {
      dispatch({ type: TYPES.setServiceInfo, payload: e });
    },
    setInsuranceInfo(e) {
      dispatch({ type: TYPES.setInsuranceInfo, payload: e });
    },
    setBillInfo(e) {
      dispatch({ type: TYPES.setBillInfo, payload: e });
    },
    setBillData(e) {
      dispatch({ type: TYPES.setBillData, payload: e });
    },
    setCardDataGlobal(e) {
      dispatch({ type: TYPES.setCardDataGlobal, payload: e });
    },
    setConsultationInfo(e) {
      dispatch({ type: TYPES.setConsultationInfo, payload: e });
    },
    setSavedPatient(e) {
      dispatch({ type: TYPES.setSavedPatient, payload: e });
    },
    setDisable() {
      dispatch({ type: TYPES.setDisable, payload: true });
    },
    clearDisable() {
      dispatch({ type: TYPES.setDisable, payload: false });
    },
    clearState() {
      dispatch({ type: TYPES.clearState });
    },
  };
  return (
    <FrontdeskContext.Provider value={{ ...state, ...dispatches }}>
      {children}
    </FrontdeskContext.Provider>
  );
};
