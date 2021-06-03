import { createContext } from "react";

const baseState = {
  // editState: {
  //   edit_appointment_status_id: null,
  //   edit_appt_date: null,
  //   edit_appt_time: null,
  //   edit_contact_number: null,
  //   edit_tel_code: null,
  //   edit_patient_name: null,
  //   edit_arabic_name: null,
  //   edit_date_of_birth: null,
  //   edit_age: null,
  //   edit_gender: null,
  //   edit_email: null,
  //   edit_appointment_remarks: null,
  //   edit_appointment_id: null,
  //   edit_provider_id: null,
  //   edit_patient_id: null,
  //   edit_from_time: "",
  //   edit_sub_dep_id: null,
  //   edit_appointment_date: "",
  //   patient_code: "",
  //   edit_no_of_slots: null,
  //   edit_is_stand_by: "",
  //   edit_title_id: null,
  //   timeSlots: [],
  //   schAvailable: false,
  // },
};

export const AppointmentContext = createContext(baseState);

export const TYPES = {
  // setEditState: "setEditState",
  // clearState: "clearState",
  SELECTED_DATE: "SELECTED_DATE",
  SELECTED_DOCTOR: "SELECTED_DOCTOR",
  SELECTED_DEPT: "SELECTED_DEPT",
  DOCTORS_SCHEDULE: "DOCTORS_SCHEDULE",
  APP_STATUS: "APP_STATUS",
};

export function reducer(state, { type, payload }) {
  switch (type) {
    case TYPES.SELECTED_DATE:
      return { ...state, appointmentDate: payload };
    case TYPES.SELECTED_DEPT:
      return { ...state, sub_department_id: payload };
    case TYPES.SELECTED_DOCTOR:
      return { ...state, provider_id: payload };
    case TYPES.DOCTORS_SCHEDULE:
      return { ...state, doctors_schedule: payload };
    case TYPES.APP_STATUS:
      return { ...state, app_status: payload };

    // case TYPES.setEditState:
    //   return { ...state, editState: { ...payload } };
    // case TYPES.clearState:
    //   return { ...baseState };
    default:
      return state;
  }
}

// export const AppProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(reducer, {});

//   const dispatches = {
//     setEditState(e) {
//       dispatch({ type: TYPES.setEditState, payload: e });
//     },
//     clearState() {
//       dispatch({ type: TYPES.clearState });
//     },
//   };
//   return (
//     <AppointmentContext.Provider value={{ ...state, ...dispatches }}>
//       {children}
//     </AppointmentContext.Provider>
//   );
// };
