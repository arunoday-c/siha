import PatientAdmission from "./PatientAdmission";
import { PatAdmissionContextProvider } from "./PatientAdmissionContext";

function PatAdmission(props: any) {
  debugger;
  return (
    <PatAdmissionContextProvider>
      <PatientAdmission props={props} />
    </PatAdmissionContextProvider>
  );
}

export default PatAdmission;
