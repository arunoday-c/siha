import React, { Component } from "react";
import "./SelfService.css";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import AlgaehFile from "../../Wrapper/algaehFileUpload";
import SelfPersonalDetails from "./SelfPersonalDetails/SelfPersonalDetails";
import AttendanceRegularization from "./AttendanceRegularization/AttendanceRegularization";
import ApplyLeave from "./ApplyLeave/ApplyLeave";
import LoanRequest from "./LoanRequest/LoanRequest";
import LeaveEncashment from "./LeaveEncashmemnt/LeaveEncashment";

import HolidayListSelf from "./HolidayListSelf/HolidayListSelf";
import TimeSheetSelf from "./TimeSheetSelf/TimeSheetSelf";

import employeeProfileImg from "../../../assets/images/employee_profile_img.webp";
import { algaehApiCall } from "../../../utils/algaehApiCall";

export default class SelfService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "SelfPersonalDetails"
    };
    this.getEmployeeDetails();
  }

  getEmployeeDetails() {
    algaehApiCall({
      uri: "/selfService/getEmployeeBasicDetails",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employee_details: res.data.records[0]
          });
        }
      },
      onFailure: err => {}
    });
  }

  openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var specified = e.currentTarget.getAttribute("algaehtabs");
    this.setState({
      pageDisplay: specified
    });
  }
  render() {
    let empDetails =
      this.state.employee_details !== undefined
        ? this.state.employee_details
        : {};
    return (
      <div className="selfServiceModule">
        <button
          className="d-none"
          id="ep-dl"
          onClick={this.getEmployeeDetails.bind(this)}
        />
        <div className="row EmployeeProfile">
          <div className="EmployeeInfo-Top box-shadow-normal">
            <div className="EmployeeImg">
              {/* <img alt="Algaeh-HIS" src={employeeProfileImg} /> */}

              <AlgaehFile
                name="attach_photo"
                accept="image/*"
                textAltMessage={empDetails.full_name}
                showActions={false}
                serviceParameters={{
                  uniqueID: empDetails.employee_code,
                  destinationName: empDetails.employee_code,
                  fileType: "Employees"
                }}
              />
            </div>
            <div className="EmployeeName">
              {/* <h6>SYED ADIL FAWAD NIZAMI</h6> */}
              <h6>{empDetails.full_name}</h6>
              <p>
                {" "}
                <b>{empDetails.designation}</b>
              </p>
              <p>{empDetails.sub_department_name}</p>
            </div>
            <div className="EmployeeDemographic">
              <span>
                {/* <i className="fas fa-user-tie" /> <b>EMP378456</b> */}
                <i className="fas fa-user-tie" />{" "}
                <b>{empDetails.employee_code}</b>
              </span>
              <span>
                {/* <i className="fas fa-mobile" /> <b>+96 34765738465</b> */}
                <i className="fas fa-mobile" />{" "}
                <b>{empDetails.primary_contact_no}</b>
              </span>
              <span>
                <i className="fas fa-envelope" />{" "}
                {/* <b>fawad.nizami@hospital.com</b> */}
                <b>{empDetails.email}</b>
              </span>
              <span>
                <i className="fas fa-globe-asia" />{" "}
                <b>
                  {empDetails.present_city_name},{empDetails.present_state_name}
                  ,{empDetails.present_country_name}
                </b>
              </span>
            </div>
            <div className="EmployeeDemographic">
              <span>
                Joining Date:{" "}
                <b>
                  {empDetails.date_of_joining !== null
                    ? empDetails.date_of_joining
                    : "------"}
                </b>
              </span>
              <span>
                Reporting to:{" "}
                <b>
                  {empDetails.reporting_to_name !== null
                    ? empDetails.reporting_to_name
                    : "------"}
                </b>
              </span>
              {empDetails.license_number !== null ? (
                <span>
                  License No.:{" "}
                  <b>
                    {empDetails.license_number !== null
                      ? empDetails.license_number
                      : "------"}
                  </b>
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="row EmployeeTopNav box-shadow-normal">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"SelfPersonalDetails"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Personal Info"
                    }}
                  />
                }
              </li>

              <li
                algaehtabs={"TimeSheetSelf"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Time Sheet"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"AttendanceRegularization"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Attendance Regularization"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"ApplyLeave"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Apply Leave"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"LoanRequest"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Loan/ Advance Request"
                    }}
                  />
                }
              </li>

              <li
                algaehtabs={"HolidayListSelf"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Holiday List"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="selfService-setion">
          {this.state.pageDisplay === "SelfPersonalDetails" ? (
            <SelfPersonalDetails empData={this.state.employee_details} />
          ) : this.state.pageDisplay === "AttendanceRegularization" ? (
            <AttendanceRegularization empData={this.state.employee_details} />
          ) : this.state.pageDisplay === "ApplyLeave" ? (
            <ApplyLeave empData={this.state.employee_details} />
          ) : this.state.pageDisplay === "LoanRequest" ? (
            <LoanRequest empData={this.state.employee_details} />
          ) : this.state.pageDisplay === "LeaveEncashment" ? (
            <LeaveEncashment />
          ) : this.state.pageDisplay === "TimeSheetSelf" ? (
            <TimeSheetSelf />
          ) : this.state.pageDisplay === "HolidayListSelf" ? (
            <HolidayListSelf />
          ) : null}
        </div>
      </div>
    );
  }
}
