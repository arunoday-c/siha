import React, { useReducer } from "react";
import moment from "moment";
import { reducer, AppointmentContext, TYPES } from "./AppointmentContext";
// import Appointment from "./Appointment";
import BookAppointment from "./components";
export default function AppointmentContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, {
    appointmentDate: moment(),
  });
  const dispatches = {
    setAppointmentDate(payload) {
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
    <AppointmentContext.Provider value={{ ...state, ...dispatches }}>
      <BookAppointment {...props} />
    </AppointmentContext.Provider>
  );
}
