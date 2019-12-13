import React, { Component } from "react";
import "./SelfService.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import AlgaehFile from "../../Wrapper/algaehFileUpload";
import ActivityFeed from "./ActivityFeed/ActivityFeed";
import SelfPersonalDetails from "./PersonalDetails/SelfPersonalDetails";
import AttendanceRegularization from "./AttendanceRegularization/AttendanceRegularization";
import ApplyLeave from "./ApplyLeave/ApplyLeave";
import LoanRequest from "./LoanRequest/LoanRequest";
import LeaveEncashment from "./LeaveEncashmemnt/LeaveEncashment";
import HolidayListSelf from "./HolidayListSelf/HolidayListSelf";
import TimeSheetSelf from "./TimeSheetSelf/TimeSheetSelf";
import LeaveEncashmentProcess from ".././LeaveEncashmentProcess/LeaveEncashmentProcess";
import ApplyLeaveEncashment from ".././EmployeeServices/ApplyLeaveEncashment/ApplyLeaveEncashment";

// import employeeProfileImg from "../../../assets/images/employee_profile_img.webp";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

export default class SelfService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "ApplyLeave",
      regularize: {},
      leave: {},
      employee_details: {}
    };
    this.getEmployeeDetails();
    this.getLeaveSalaryOptions();
  }

  getLeaveSalaryOptions() {
    algaehApiCall({
      uri: "/payrollOptions/getLeaveSalaryOptions",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            basic_earning_component: res.data.result[0].basic_earning_component
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  getEmployeeDetails() {
    algaehApiCall({
      uri: "/selfService/getEmployeeBasicDetails",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employee_details: res.data.records[0]
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
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

  ChangeRenderTabs(options) {

    if (options.pageDisplay === "AttendanceRegularization") {
      this.attReg.click();
    } else if (options.pageDisplay === "ApplyLeave") {
      this.attlv.click();
    }

    this.setState({
      ...this.state,
      ...options
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
              <h6>{empDetails.full_name}</h6>
            </div>
            <div className="EmployeeDemographic">
              <span>
                <i className="fas fa-user-tie" />
                <b>{empDetails.employee_code}</b>
              </span>
              <span>
                <i className="fas fa-mobile" />
                <b>{empDetails.primary_contact_no}</b>
              </span>
              <span>
                <i className="fas fa-envelope" /> <b>{empDetails.email}</b>
              </span>
            </div>
            <div className="EmployeeDemographic">
              <span>
                Designation: <b>{empDetails.designation}</b>
              </span>
              <span>
                Sub Department: <b>{empDetails.sub_department_name}</b>
              </span>
            </div>
            <div className="EmployeeDemographic">
              <span>
                Joining Date:
                <b>
                  {empDetails.date_of_joining !== null
                    ? empDetails.date_of_joining
                    : "------"}
                </b>
              </span>
              <span>
                Reporting to:
                <b>
                  {empDetails.reporting_to_name !== null
                    ? empDetails.reporting_to_name
                    : "------"}
                </b>
              </span>
              {empDetails.license_number !== null ? (
                <span>
                  License No.:
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
              {/* <li
                algaehtabs={"ActivityFeed"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Activity Feed"
                    }}
                  />
                }
              </li> */}
              {/* <li
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
              </li> */}
              {/* <li
                algaehtabs={"AttendanceRegularization"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
                ref={attReg => {
                  this.attReg = attReg;
                }}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Attendance Regularization"
                    }}
                  />
                }
              </li> */}
              <li
                algaehtabs={"ApplyLeave"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
                ref={attlv => {
                  this.attlv = attlv;
                }}
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
                      forceLabel: "Loan / Advance Request"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"ApplyLeaveEncashment"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              // ref={attReg => {
              //   this.attReg = attReg;
              // }}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Request Leave Encashment"
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
              <li
                algaehtabs={"SelfPersonalDetails"}
                className={"nav-item tab-button"}
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
            </ul>
          </div>
        </div>
        <div className="selfService-setion">
          {this.state.pageDisplay === "ActivityFeed" ? (
            <ActivityFeed parent={this} empData={this.state.employee_details} />
          ) : this.state.pageDisplay === "SelfPersonalDetails" ? (
            <SelfPersonalDetails empData={this.state.employee_details} />
          ) : this.state.pageDisplay === "AttendanceRegularization" ? (
            <AttendanceRegularization
              regularize={this.state.regularize}
              empData={this.state.employee_details}
            />
          ) : this.state.pageDisplay === "ApplyLeave" ? (
            <ApplyLeave
              leave={this.state.leave}
              empData={this.state.employee_details}
            />
          ) : this.state.pageDisplay === "LoanRequest" ? (
            <LoanRequest
              empData={this.state.employee_details}
              basic_earning_component={this.state.basic_earning_component}
            />
          ) : this.state.pageDisplay === "LeaveEncashment" ? (
            <LeaveEncashment />
          ) : this.state.pageDisplay === "TimeSheetSelf" ? (
            <TimeSheetSelf />
          ) : this.state.pageDisplay === "HolidayListSelf" ? (
            <HolidayListSelf />
          ) : this.state.pageDisplay === "LeaveEncashmentProcess" ? (
            <LeaveEncashmentProcess empData={this.state.employee_details} />
          ) : this.state.pageDisplay === "ApplyLeaveEncashment" ? (
            <ApplyLeaveEncashment
              from_screen="SS"
              empData={this.state.employee_details}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
