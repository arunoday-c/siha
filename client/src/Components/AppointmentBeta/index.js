import React, { useContext } from "react";
import { AppProvider, AppointmentContext } from "./AppointmentContext";
import Appointment from "./Appointment";

export default function AppointmentContextProvider(props) {
  return (
    <AppProvider>
      <DummyComponent {...props} />
    </AppProvider>
  );
}

function DummyComponent(props) {
  const { setParentState, setSlotData } = useContext(AppointmentContext);
  return <Appointment {...{ setParentState, setSlotData, ...props }} />;
}
