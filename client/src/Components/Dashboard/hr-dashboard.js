import React, { Component } from "react";
import "./dashboard.scss";
import { HorizontalBar } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
import { GetAmountFormart } from "../../utils/GlobalFunctions";
import DashBoardEvents, {
  chartLegends,
  chartOptionsHorizontal,
} from "./DashBoardEvents";
import { newAlgaehApi } from "../../hooks";
import { algaehApiCall } from "../../utils/algaehApiCall";
import { MainContext, Menu, Dropdown } from "algaeh-react-components";
import { AlagehAutoComplete } from "../Wrapper/algaehWrapper";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  // AlgaehMessagePop,
  AlgaehModal,
  AlgaehFormGroup,
  AlgaehButton,
  AlgaehLabel,
  Spin,
} from "algaeh-react-components";
import moment from "moment";
import swal from "sweetalert2";
const dashEvents = DashBoardEvents();

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidBarOpen: true,
      showDetails: "d-none",
      no_of_employees: 0,
      total_company_salary: 0,
      total_staff_count: 0,
      total_labour_count: 0,
      total_staff_salary: 0,
      total_labor_salary: 0,
      total_localite_count: 0,
      total_expatriate_count: 0,
      projectEmployee: {},
      projectEmployeeData: [],
      Dept_Employee: {},
      Dept_Employee_data: [],
      Desig_Employee: {},
      Desig_Employee_data: [],
      reportParams: {
        reportName: "",
        MailName: "",
        paramName1: "",
        paramValue1: "",
        paramName2: "",
        paramValue2: "",
      },
      visible: false,
      body_mail: "",
      loading: false,
      to_mail_id: "",
      no_of_emp_join: [],
      avg_salary: 0,
      no_of_projects: 0,
      hospital_id: "",
      dateRange: [moment().startOf("month"), moment().endOf("month")],
      dateRangeEmployee: [moment().startOf("month"), moment().endOf("month")],
      documentExipryData: [],
      employeeJoinedThisMonth: [],
    };
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.props.getOrganizations({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      redux: {
        type: "ORGS_GET_DATA",
        mappingName: "organizations",
      },
    });

    this.setState(
      {
        hospital_id: userToken.hims_d_hospital_id,
      },
      () => {
        dashEvents.getEmployeeList(this);
        dashEvents.getEmployeeDepartmentsWise(this);
        dashEvents.getEmployeeDesignationWise(this);
        dashEvents.getProjectList(this);
        dashEvents.getEmployeeProjectWise(this);
        dashEvents.getDocumentExpiryCurrentMonth(this);
        dashEvents.getEmployeeCurrentMonth(this);
      }
    );
  }

  showDetailHandler(event) {
    this.setState({
      showDetails: this.state.showDetails === "d-block" ? "d-none" : "d-block",
    });
  }

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen,
    });
  }

  eventHandaler(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState(
      {
        [name]: value,
      },
      () => {
        dashEvents.getEmployeeList(this);
        dashEvents.getEmployeeDepartmentsWise(this);
        dashEvents.getEmployeeDesignationWise(this);
        dashEvents.getProjectList(this);
        dashEvents.getEmployeeProjectWise(this);
        dashEvents.getDocumentExpiryCurrentMonth(this);
        dashEvents.getEmployeeCurrentMonth(this);
      }
    );
  }
  printHRDashboardReport1({ reportName, paramName, paramValue }) {
    this.setState({ loading: true });
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: reportName,
          pageSize: "A4",
          pageOrentation: "portrait",
          reportParams: [
            {
              name: paramName,
              value: paramValue,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        this.setState({ loading: false });
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
        window.open(origin);
      },
      onFailure: (error) => {
        this.setState({ loading: false });
      },
    });
  }
  printHRDashboardReport({
    reportName,
    paramName1,
    paramValue1,
    paramName2,
    paramValue2,
    paramName3,
    paramValue3,
  }) {
    this.setState({ loading: true });
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: reportName,
          pageSize: "A4",
          pageOrentation: "portrait",
          reportParams: [
            {
              name: paramName1,
              value: paramValue1,
            },
            {
              name: paramName2,
              value: paramValue2,
            },
            {
              name: paramName3,
              value: paramValue3,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        this.setState({ loading: false });
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
        window.open(origin);
      },
      onFailure: (error) => {
        this.setState({ loading: false });
      },
    });
  }
  async HRDashBoardWithAttachment(reportParams) {
    this.setState(
      {
        loading: true,
      }
      // async () => {

      // }
    );
    if (this.state.to_mail_id) {
      const result = await newAlgaehApi({
        uri: "/employee/HRDashBoardWithAttachment",
        module: "hrManagement",
        method: "GET",
        data: {
          ...reportParams,
        },
      });
      return result?.data?.records;
    } else {
      swal({
        title: "Email cannot be Empty",
        type: "warning",
      });
    }
  }

  render() {
    const noOfEmployeesByProject = (
      <Menu>
        <Menu.Item key="1">
          <span
            onClick={() => {
              this.printHRDashboardReport1({
                reportName: "EmployeesByProject",
                paramName: "result",
                paramValue: this.state.projectEmployeeData,
              });
            }}
          >
            Export Data as PDF
          </span>
        </Menu.Item>
        <Menu.Item key="2">
          <span
            onClick={() => {
              this.setState({
                visible: true,
                reportParams: {
                  reportName: "EmployeesByProject",
                  MailName: "HR Dashboard Employee By Category Report",
                  paramName1: "result",
                  paramValue1: this.state.projectEmployeeData,
                },
              });
            }}
          >
            Send as an E-mail
          </span>
        </Menu.Item>
      </Menu>
    );
    const noOfEmployeesByDept = (
      <Menu>
        <Menu.Item key="1">
          <span
            onClick={() => {
              this.printHRDashboardReport1({
                reportName: "EmployeesByDept",
                paramName: "result",
                paramValue: this.state.Dept_Employee_data,
              });
            }}
          >
            Export Data as PDF
          </span>
        </Menu.Item>
        <Menu.Item key="2">
          <span
            onClick={() => {
              this.setState({
                visible: true,
                reportParams: {
                  reportName: "EmployeesByDept",
                  MailName: "HR Dashboard Employee By department Report",
                  paramName1: "result",
                  paramValue1: this.state.Dept_Employee_data,
                },
              });
            }}
          >
            Send as an E-mail
          </span>
        </Menu.Item>
      </Menu>
    );
    const noOfEmployeesByDesignation = (
      <Menu>
        <Menu.Item key="1">
          <span
            onClick={() => {
              this.printHRDashboardReport1({
                reportName: "EmployeesByDesignation",
                paramName: "hospital_id",
                paramValue: this.state.hospital_id,
              });
            }}
          >
            Export Data as PDF
          </span>
        </Menu.Item>
        <Menu.Item key="2">
          <span
            onClick={() => {
              this.setState({
                visible: true,
                reportParams: {
                  reportName: "EmployeesByDesignation",
                  MailName: "HR Dashboard Employee By Designation Report",
                  paramName1: "hospital_id",
                  paramValue1: this.state.hospital_id,
                },
              });
            }}
          >
            Send as an E-mail
          </span>
        </Menu.Item>
      </Menu>
    );
    const documentExpiry = (
      <Menu>
        <Menu.Item key="1">
          <span
            onClick={() => {
              let from_date = moment(this.state.dateRange[0]._d).format(
                "YYYY-MM-DD"
              );
              let to_date = moment(this.state.dateRange[1]._d).format(
                "YYYY-MM-DD"
              );
              this.printHRDashboardReport({
                reportName: "DocumentExpiryReport",
                paramName1: "from_date",
                paramValue1: from_date,
                paramName2: "to_date",
                paramValue2: to_date,
                paramName3: "hospital_id",
                paramValue3: this.state.hospital_id,
              });
            }}
          >
            Export Data as PDF
          </span>
        </Menu.Item>
        <Menu.Item key="2">
          <span
            onClick={() => {
              let from_date = moment(this.state.dateRange[0]._d).format(
                "YYYY-MM-DD"
              );
              let to_date = moment(this.state.dateRange[1]._d).format(
                "YYYY-MM-DD"
              );
              this.setState({
                visible: true,
                reportParams: {
                  MailName: "HR Dashboard Employee By Designation Report",
                  reportName: "DocumentExpiryReport",
                  paramName1: "from_date",
                  paramValue1: from_date,
                  paramName2: "to_date",
                  paramValue2: to_date,
                  paramName3: "hospital_id",
                  paramValue3: this.state.hospital_id,
                },
              });
            }}
          >
            Send as an E-mail
          </span>
        </Menu.Item>
      </Menu>
    );
    const employeeJoinedThisMonth = (
      <Menu>
        <Menu.Item key="1">
          <span
            onClick={() => {
              this.printHRDashboardReport1({
                reportName: "EmployeeJoinedThisMonth",
                paramName: "result",
                paramValue: this.state.employeeJoinedThisMonth,
              });
            }}
          >
            Export Data as PDF
          </span>
        </Menu.Item>
        <Menu.Item key="2">
          <span
            onClick={() => {
              this.setState({
                visible: true,
                reportParams: {
                  reportName: "EmployeeJoinedThisMonth",
                  MailName: "HR Dashboard Employee Joined This month Report",
                  paramName1: "result",
                  paramValue1: this.state.employeeJoinedThisMonth,
                },
              });
            }}
          >
            Send as an E-mail
          </span>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="dashboard hr-dash">
        <AlgaehModal
          title={`Send as an E-mail`}
          visible={this.state.visible}
          destroyOnClose={true}
          // okText="Confirm"
          // onOk={() => {
          footer={[
            <AlgaehButton
              loading={this.state.loading}
              className="btn btn-primary"
              onClick={() => {
                this.HRDashBoardWithAttachment({
                  ...this.state.reportParams,
                  to_mail_id: this.state.to_mail_id,
                  body_mail: this.state.body_mail,
                })
                  .then(() => {
                    this.setState({
                      visible: false,
                      body_mail: "",
                      loading: false,
                      to_mail_id: "",
                    });
                    swal({
                      title: "Successfully Sent",
                      type: "success",
                    });
                  })
                  .catch((error) => {
                    swal({
                      title: error.message,
                      type: "error",
                    });
                    this.setState({
                      visible: false,
                      body_mail: "",
                      loading: false,
                      to_mail_id: "",
                    });
                  });
              }}
            >
              <AlgaehLabel
                label={{
                  forceLabel: "Send",
                  returnText: true,
                }}
              />
            </AlgaehButton>,
            <AlgaehButton
              className="btn btn-default"
              onClick={() => {
                this.setState({
                  visible: false,
                });
              }}
            >
              Cancel
            </AlgaehButton>,
            ,
          ]}
          onCancel={() => {
            // finance_voucher_header_id = "";
            // rejectText = "";
            this.setState({
              visible: false,
            });
          }}
          className={`row algaehNewModal dashboardEmailSend`}
        >
          {/* <form onSubmit={() => this.onSubmit}> */}
          <AlgaehFormGroup
            div={{ className: "col form-group mandatory" }}
            label={{
              forceLabel: "To Email Address",
              isImp: true,
            }}
            textBox={{
              onChange: (e) => {
                this.setState({ to_mail_id: e.target.value });
              },
              value: this.state.to_mail_id,
              className: "txt-fld",
              name: "to_mail_id",
            }}
          />

          <div className="col-12">
            <AlgaehLabel
              label={{
                forceLabel: "Message",
              }}
            />

            <textarea
              value={this.state.body_mail}
              name="body_mail"
              onChange={(e) => {
                this.setState({
                  body_mail: e.target.value,
                });
              }}
            />
          </div>
          <div className="col-12">
            <small style={{ float: "right" }}>
              Attention! Mail will send with an attachment
            </small>
          </div>
          {/* </form> */}
        </AlgaehModal>
        <Spin spinning={this.state.loading}>
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col-lg-3 col-md-3 col-sm-12  form-group" }}
              label={{
                fieldName: "branch",
                isImp: true,
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.props.organizations,
                },
                onChange: this.eventHandaler.bind(this),
                onClear: () => {
                  this.setState({
                    hospital_id: null,
                  });
                },
                autoComplete: "off",
              }}
            />
          </div>
          <div className="row card-deck">
            <div className="card animated fadeInUp faster">
              <div className="content">
                <div className="row">
                  {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-building" />
                  </div>
                </div> */}
                  <div className="col-12">
                    <div className="text">
                      <p>Total Project</p>
                      {this.state.no_of_projects}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card animated fadeInUp faster">
              <div className="content">
                <div className="row">
                  {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-building" />
                  </div>
                </div> */}
                  <div className="col-12">
                    <div className="text">
                      <p>Total Staff</p>
                      {this.state.total_staff_count}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card animated fadeInUp faster">
              <div className="content">
                <div className="row">
                  {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-building" />
                  </div>
                </div> */}
                  <div className="col-12">
                    <div className="text">
                      <p>Total Labour</p>
                      {this.state.total_labour_count}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card animated fadeInUp faster">
              <div className="content">
                <div className="row">
                  {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-building" />
                  </div>
                </div> */}
                  <div className="col-12">
                    <div className="text">
                      <p>Total Localite</p>
                      {this.state.total_localite_count}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card animated fadeInUp faster">
              <div className="content">
                <div className="row">
                  {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-building" />
                  </div>
                </div> */}
                  <div className="col-12">
                    <div className="text">
                      <p>Total Expatriate</p>
                      {this.state.total_expatriate_count}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card animated fadeInUp faster">
              <div className="content">
                <div className="row">
                  {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-building" />
                  </div>
                </div> */}
                  <div className="col-12">
                    <div className="text">
                      <p>Staff Cost</p>
                      {GetAmountFormart(this.state.total_staff_salary)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card animated fadeInUp faster">
              <div className="content">
                <div className="row">
                  {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-users" />
                  </div>
                </div> */}
                  <div className="col-12">
                    <div className="text">
                      <p>Labour Cost</p>
                      {GetAmountFormart(this.state.total_labor_salary)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="row">
                {" "}
                <div className="col-sm-12 col-md-4 col-lg-4">
                  <div className="card animated fadeInUp faster">
                    <h6>No. of Employee by Projects</h6>
                    <div className="dashboardChartsCntr">
                      <HorizontalBar
                        data={this.state.projectEmployee}
                        legend={chartLegends}
                        options={chartOptionsHorizontal}
                      />
                      <Dropdown overlay={noOfEmployeesByProject}>
                        <i className="fas fa-bars dashPortletDrop" />
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12 col-md-4 col-lg-4">
                  <div className="card animated fadeInUp faster">
                    <h6>No. of Employee by Department</h6>
                    <div className="dashboardChartsCntr">
                      <HorizontalBar
                        data={this.state.Dept_Employee}
                        legend={chartLegends}
                        options={chartOptionsHorizontal}
                      />
                      <Dropdown overlay={noOfEmployeesByDept}>
                        <i className="fas fa-bars dashPortletDrop" />
                      </Dropdown>
                    </div>
                  </div>
                </div>{" "}
                <div className="col-sm-12 col-md-4 col-lg-4">
                  <div className="card animated fadeInUp faster">
                    <h6>No. of Employee by Designation</h6>
                    <div className="dashboardChartsCntr">
                      <HorizontalBar
                        data={this.state.Desig_Employee}
                        legend={chartLegends}
                        options={chartOptionsHorizontal}
                      />
                      <Dropdown overlay={noOfEmployeesByDesignation}>
                        <i className="fas fa-bars dashPortletDrop" />
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card animated fadeInUp faster">
                    <h6>New Employee Joined</h6>
                    <div className="row dashboardGridCntr">
                      <div className="col">
                        {" "}
                        <div className="col">
                          <div className="row">
                            {" "}
                            <AlgaehDateHandler
                              type={"range"}
                              div={{
                                className: "col-6 form-group",
                              }}
                              label={{
                                forceLabel: "Select Date Range",
                              }}
                              textBox={{
                                name: "selectRange",
                                value: this.state.dateRangeEmployee,
                              }}
                              // maxDate={new date()}
                              events={{
                                onChange: (dateSelected) => {
                                  // const months = moment(dateSelected[1]).diff(
                                  //   dateSelected[0],
                                  //   "months"
                                  // );
                                  // if (months <= 11) {
                                  this.setState(
                                    { dateRange: dateSelected },
                                    () => {
                                      dashEvents.getEmployeeCurrentMonth(this);
                                    }
                                  );
                                  // } else {
                                  //   AlgaehMessagePop({
                                  //     title: "error",
                                  //     display: "you can select maximum one year.",
                                  //   });
                                  // }
                                },
                              }}
                              // others={{
                              //   ...format,
                              // }}
                            />
                            <Dropdown overlay={employeeJoinedThisMonth}>
                              <i className="fas fa-bars dashPortletDrop" />
                            </Dropdown>
                            <div className="col-12">
                              <AlgaehDataGrid
                                className="dashboardGrd"
                                columns={[
                                  {
                                    fieldName: "row_num",
                                    label: "Sl.no",
                                  },
                                  {
                                    fieldName: "date_of_joining",
                                    label: "Join Date",
                                  },
                                  {
                                    fieldName: "employee_code",
                                    label: "Employee Code",
                                  },
                                  {
                                    fieldName: "full_name",
                                    label: "Employee Name",
                                  },
                                  {
                                    fieldName: "sex",
                                    label: "Gender",
                                  },
                                  {
                                    fieldName: "designation",
                                    label: "Designation",
                                  },
                                  {
                                    fieldName: "sub_department_name",
                                    label: "Sub Department",
                                  },
                                ]}
                                // height="40vh"
                                rowUnique="finance_voucher_id"
                                data={
                                  this.state.employeeJoinedThisMonth
                                    ? this.state.employeeJoinedThisMonth
                                    : []
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card animated fadeInUp faster">
                    <h6>Document Expiry</h6>
                    <Dropdown overlay={documentExpiry}>
                      <i className="fas fa-bars dashPortletDrop" />
                    </Dropdown>
                    <div className="row dashboardGridCntr">
                      <div className="col">
                        {" "}
                        <div className="col">
                          <div className="row">
                            {" "}
                            <AlgaehDateHandler
                              type={"range"}
                              div={{
                                className: "col-6 form-group",
                              }}
                              label={{
                                forceLabel: "Select Date Range",
                              }}
                              textBox={{
                                name: "selectRange",
                                value: this.state.dateRange,
                              }}
                              // maxDate={new date()}
                              events={{
                                onChange: (dateSelected) => {
                                  // const months = moment(dateSelected[1]).diff(
                                  //   dateSelected[0],
                                  //   "months"
                                  // );
                                  // if (months <= 11) {
                                  this.setState(
                                    { dateRange: dateSelected },
                                    () => {
                                      dashEvents.getDocumentExpiryCurrentMonth(
                                        this
                                      );
                                    }

                                    //     });
                                    //   } else {
                                    //     AlgaehMessagePop({
                                    //       title: "error",
                                    //       display: "you can select maximum one year.",
                                    //     });
                                    //   }
                                  );
                                },
                              }}
                              // others={{
                              //   ...format,
                              // }}
                            />
                            <div className="col-12">
                              <AlgaehDataGrid
                                className="dashboardGrd"
                                columns={[
                                  {
                                    fieldName: "row_num",
                                    label: "Sl.no",
                                  },
                                  {
                                    fieldName: "employee_code",
                                    label: "Employee Code",
                                  },
                                  {
                                    fieldName: "full_name",
                                    label: "Employee Name",
                                  },
                                  {
                                    fieldName: "identity_document_name",
                                    label: "Document Type",
                                  },
                                  {
                                    fieldName: "valid_upto",
                                    label: "Valid Upto",
                                  },
                                ]}
                                // height="40vh"
                                rowUnique="identity_documents_id"
                                data={
                                  this.state.documentExpiryData
                                    ? this.state.documentExpiryData
                                    : []
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    hospitaldetails: state.hospitaldetails,
    organizations: state.organizations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getHospitalDetails: AlgaehActions,
      getOrganizations: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
