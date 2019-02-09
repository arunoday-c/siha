import React, { Component } from "react";
import "./doctor_workbench.css";

const MyDaypanel = React.memo(React.lazy(() => import("./Myday")));
const Loading = React.memo(React.lazy(() => import("../Wrapper/loading")));
const PatientDashboad = React.memo(
  React.lazy(() => import("./PatientDashboard"))
);
class DoctorsWorkbench extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPatientDetails: undefined
    };
  }
  onUpdateMainState(data) {
    this.setState({
      ...data
    });
  }
  render() {
    return (
      <div className="row clinicalDeskScreen">
        <React.Suspense fallback={<Loading />}>
          <MyDaypanel onupdatingdata={this.onUpdateMainState.bind(this)} />
          <PatientDashboad dashboard_state={this.state} />
        </React.Suspense>
      </div>
    );
  }
}

export default DoctorsWorkbench;
