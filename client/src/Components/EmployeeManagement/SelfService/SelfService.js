import React, { Component } from "react";
import "./SelfService.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import AlgaehFile from "../../Wrapper/algaehFileUpload";
import ActivityFeed from "./ActivityFeed/ActivityFeed";
import SelfPersonalDetails from "./PersonalDetails/SelfPersonalDetails";
import AttendanceRegularization from "./AttendanceRegularization/AttendanceRegularization";
import ApplyLeave from "./ApplyLeave/ApplyLeave";
import LoanRequest from "./LoanRequest/LoanRequest";

import HolidayListSelf from "./HolidayListSelf/HolidayListSelf";
import TimeSheetSelf from "./TimeSheetSelf/TimeSheetSelf";
import ApplyLeaveEncashment from ".././EmployeeServices/ApplyLeaveEncashment/ApplyLeaveEncashment";

// import employeeProfileImg from "../../../assets/images/employee_profile_img.webp";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehTabs } from "algaeh-react-components";
export default class SelfService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "ApplyLeave",
      regularize: {},
      leave: {},
      employee_details: {},
      loading: false,
    };
  }

  componentDidMount() {
    this.getEmployeeDetails();
    this.getLeaveSalaryOptions();
  }

  getLeaveSalaryOptions() {
    algaehApiCall({
      uri: "/payrollOptions/getLeaveSalaryOptions",
      method: "GET",
      module: "hrManagement",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            basic_earning_component: res.data.result[0].basic_earning_component,
          });
        }
      },
      onFailure: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }

  getEmployeeDetails = () => {
    const { loading } = this.state;
    AlgaehLoader({ loading });
    algaehApiCall({
      uri: "/selfService/getEmployeeBasicDetails",
      method: "GET",
      module: "hrManagement",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState(
            {
              employee_details: res.data.records[0],
              loading: false,
            },
            () => {
              AlgaehLoader({ loading });
            }
          );
        }
      },
      onFailure: (err) => {
        this.setState({ loading: false });
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  };

  // openTab(e) {
  //   var element = document.querySelectorAll("[algaehtabs]");
  //   for (var i = 0; i < element.length; i++) {
  //     element[i].classList.remove("active");
  //   }
  //   e.currentTarget.classList.add("active");
  //   var specified = e.currentTarget.getAttribute("algaehtabs");

  //   this.setState({
  //     pageDisplay: specified
  //   });
  // }

  // ChangeRenderTabs(options) {
  //   if (options.pageDisplay === "AttendanceRegularization") {
  //     this.attReg.click();
  //   } else if (options.pageDisplay === "ApplyLeave") {
  //     this.attlv.click();
  //   }

  //   this.setState({
  //     ...this.state,
  //     ...options
  //   });
  // }

  render() {
    let empDetails =
      this.state.employee_details !== undefined
        ? this.state.employee_details
        : {};
    if (this.state.loading) {
      return null;
    }
    return (
      <div className="selfServiceModule">
        {/* <button
          className="d-none"
          id="ep-dl"
          onClick={this.getEmployeeDetails.bind(this)}
        /> */}
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
                  fileType: "Employees",
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
                Joining Date:{" "}
                <b>
                  {empDetails.date_of_joining !== null
                    ? empDetails.date_of_joining
                    : "------"}
                </b>
              </span>
              <span>
                Reporting to:
                <b>
                  {" "}
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
        <AlgaehTabs
          tabClass="EmployeeTopNav"
          removeCommonSection={true}
          customRenderTag={() => {}}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Activity Feed",
                  }}
                />
              ),
              children: (
                <ActivityFeed
                  parent={this}
                  empData={this.state.employee_details}
                />
              ),
              componentCode: "SEL_ACT_FED",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Request Leave",
                  }}
                />
              ),
              children: (
                <ApplyLeave
                  leave={this.state.leave}
                  empData={this.state.employee_details}
                />
              ),
              componentCode: "SEL_APP_LEV",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Loan/ Advance Request",
                  }}
                />
              ),
              children: (
                <LoanRequest
                  empData={this.state.employee_details}
                  basic_earning_component={this.state.basic_earning_component}
                />
              ),
              componentCode: "SEL_LON_ADV_REQ",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Leave Encashment Request",
                  }}
                />
              ),
              children: (
                <ApplyLeaveEncashment
                  from_screen="SS"
                  empData={this.state.employee_details}
                />
              ),
              componentCode: "SEL_LEV_ENC_REQ",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Attendance Regularisation",
                  }}
                />
              ),
              children: (
                <AttendanceRegularization
                  regularize={this.state.regularize}
                  empData={this.state.employee_details}
                />
              ),
              componentCode: "SEL_ATT_REG",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Personal Info",
                  }}
                />
              ),
              children: (
                <SelfPersonalDetails
                  empData={this.state.employee_details}
                  refreshEmp={this.getEmployeeDetails}
                />
              ),
              componentCode: "SEL_PER_INF",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Holiday List",
                  }}
                />
              ),
              children: (
                <HolidayListSelf empData={this.state.employee_details} />
              ),
              componentCode: "SEL_HOL_LST",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Self Timesheet",
                  }}
                />
              ),
              children: <TimeSheetSelf />,
              componentCode: "SEL_TIM_SHE",
            },
          ]}
          renderClass="selfServiceSection"
        />
      </div>
    );
  }
}
