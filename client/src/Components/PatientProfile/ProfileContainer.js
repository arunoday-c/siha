import React, { Component } from "react";
import { Button } from "antd";
import { withRouter } from "react-router-dom";
import PatientProfile from "./PatientProfile";

class ProfileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log(error, "from derived error");
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo, "errors");
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <h1>Sorry, Please go back to Clinical Desk</h1>
          <Button
            icon="arrow-left"
            onClick={
              // () => console.log(this.props, "location")
              () => this.props.history.push("/DoctorsWorkBench")
            }
          >
            Go Back
          </Button>
        </>
      );
    }
    return <PatientProfile />;
  }
}

export default withRouter(ProfileContainer);
