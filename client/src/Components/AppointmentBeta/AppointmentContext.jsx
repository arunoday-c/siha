import React, { createContext, useReducer } from "react";

const baseState = {
  editState: {
    edit_appointment_status_id: null,
    edit_appt_date: null,
    edit_appt_time: null,
    edit_contact_number: null,
    edit_tel_code: null,
    edit_patient_name: null,
    edit_arabic_name: null,
    edit_date_of_birth: null,
    edit_age: null,
    edit_gender: null,
    edit_email: null,
    edit_appointment_remarks: null,
    edit_appointment_id: null,
    edit_provider_id: null,
    edit_patient_id: null,
    edit_from_time: "",
    edit_sub_dep_id: null,
    edit_appointment_date: "",
    patient_code: "",
    edit_no_of_slots: null,
    edit_is_stand_by: "",
    edit_title_id: null,
    timeSlots: [],
    schAvailable: false,
  },
};

export const AppointmentContext = createContext(baseState);

const TYPES = {
  setEditState: "setEditState",
  clearState: "clearState",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case TYPES.setEditState:
      debugger;
      return { ...state, editState: { ...payload } };
    case TYPES.clearState:
      return { ...baseState };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {});

  const dispatches = {
    setEditState(e) {
      dispatch({ type: TYPES.setEditState, payload: e });
    },
    clearState() {
      dispatch({ type: TYPES.clearState });
    },
  };
  return (
    <AppointmentContext.Provider value={{ ...state, ...dispatches }}>
      {children}
    </AppointmentContext.Provider>
  );
};
