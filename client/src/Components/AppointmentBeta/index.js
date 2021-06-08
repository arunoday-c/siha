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
    // setEditState(e) {
    //   dispatch({ type: TYPES.setEditState, payload: e });
    // },
    // clearState() {
    //   dispatch({ type: TYPES.clearState });
    // },
  };

  return (
    <AppointmentContext.Provider value={{ ...state, ...dispatches }}>
      <BookAppointment {...props} />
    </AppointmentContext.Provider>
  );
}

// function DummyComponent(props) {
//   const { setParentState, setSlotData } = useContext(AppointmentContext);
//   return <Appointment {...{ setParentState, setSlotData, ...props }} />;
// }
