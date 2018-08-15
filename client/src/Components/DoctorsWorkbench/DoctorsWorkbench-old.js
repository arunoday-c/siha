import React, { Component } from "react";
import "./doctor_workbench.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MyDay from "./MyDay/MyDay";
import PatientChart from "./PatientChart/PatientChart";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";

class DoctorsWorkbench extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      date: new Date()
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };
  onChange = date => this.setState({ date });

  render() {
    return (
      <div className="doctor_workbench">
        <div
          className="fixed-top"
          style={{
            height: "50px",
            backgroundColor: "#ffffff",
            position: "relative"
          }}
        >
          {/* <label
            style={{ marginTop: "10px", marginLeft: "10px", fontSize: "1rem" }}
          >
            {" "}
            Doctor's Workbench{" "}
          </label> */}
          <Tabs
            value={this.state.value}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleChange}
          >
            <Tab
              label={
                <AlgaehLabel
                  label={{
                    fieldName: "my_day"
                  }}
                />
              }
            />
            <Tab
              label={
                <AlgaehLabel
                  label={{
                    fieldName: "patient_chart"
                  }}
                />
              }
            />
            <Tab
              label={
                <AlgaehLabel
                  label={{
                    fieldName: "checked_in_patient_summary"
                  }}
                />
              }
            />
            <Tab
              label={
                <AlgaehLabel
                  label={{
                    fieldName: "visit_and_admission_history"
                  }}
                />
              }
            />
          </Tabs>
        </div>
        <div>
          {this.state.value === 0 ? (
            <MyDay />
          ) : this.state.value === 1 ? (
            <PatientChart />
          ) : null}
        </div>
      </div>
    );
  }
}

export default DoctorsWorkbench;
