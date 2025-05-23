import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../actions/algaehActions";

import "./LeaveYearlyProcess.scss";
import moment from "moment";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  // AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { getYears } from "../../../../utils/GlobalFunctions";
import YearlyLeaveDetail from "./YearlyLeaveDetail/YearlyLeaveDetail";
import {
  MainContext,
  RawSecurityComponent,
  AlgaehSecurityElement,
  AlgaehDataGrid,
} from "algaeh-react-components";

class LeaveYearlyProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospital_id: "",
      year: moment().year(),
      leaves: [],
      leave_data: [],
      loading: false,
      open: false,
      employee_name: null,
      hims_d_employee_id: null,
      employee_group_id: null,
      hospitals: [],
    };
    this.getLeaveMaster();
  }
  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState({
      hospital_id: userToken.hims_d_hospital_id,
    });
    this.getLeaveData();
    this.getHospitals();

    if (
      this.props.emp_groups === undefined ||
      this.props.emp_groups.length === 0
    ) {
      this.props.getEmpGroups({
        uri: "/hrsettings/getEmployeeGroups",
        module: "hrManagement",
        method: "GET",
        data: { record_status: "A" },
        redux: {
          type: "EMP_GROUP_GET",
          mappingName: "emp_groups",
        },
      });
    }
  }

  getHospitals() {
    RawSecurityComponent({ componentCode: "YER_LEV_ALL_BRNH" }).then(
      (result) => {
        debugger;
        if (result === "show") {
          algaehApiCall({
            uri: "/organization/getOrganizationByUser",
            method: "GET",
            onSuccess: (res) => {
              if (res.data.success) {
                res.data.records.push({
                  hims_d_hospital_id: -1,
                  hospital_name: "All",
                });
                this.setState({
                  hospitals: res.data.records,
                });
              }
            },
            onFailure: (err) => {},
          });
        } else {
          algaehApiCall({
            uri: "/organization/getOrganizationByUser",
            method: "GET",
            onSuccess: (res) => {
              if (res.data.success) {
                this.setState({
                  hospitals: res.data.records,
                });
              }
            },
            onFailure: (err) => {},
          });
        }
      }
    );
  }

  getLeaveData() {
    this.setState(
      {
        loading: true,
      },
      () => {
        let inputObj = {
          year: this.state.year,
        };
        if (this.state.employee_group_id !== null) {
          inputObj.employee_group_id = this.state.employee_group_id;
        }

        if (this.state.hims_d_employee_id !== null) {
          inputObj.employee_id = this.state.hims_d_employee_id;
        }
        if (this.state.hospital_id === -1) {
          const all_branches = this.state.hospitals.map((item) => {
            return item.hims_d_hospital_id;
          });
          inputObj.hospital_id = all_branches;
        } else {
          inputObj.hospital_id = this.state.hospital_id;
        }

        algaehApiCall({
          uri: "/leave/getYearlyLeaveData",
          method: "GET",
          module: "hrManagement",
          data: inputObj,
          onSuccess: (res) => {
            if (res.data.success) {
              this.setState({
                leave_data: res.data.records,
                loading: false,
              });
            }
          },
          onFailure: (err) => {
            swalMessage({
              title: err.message,
              type: "error",
            });
            this.setState({
              loading: false,
            });
          },
        });
      }
    );
  }

  processYearlyLeave() {
    if (this.state.hospital_id > 0) {
      this.setState(
        {
          loading: true,
        },
        () => {
          let inputObj = {
            year: this.state.year,
            hospital_id: this.state.hospital_id,
          };
          if (this.state.employee_group_id !== null) {
            inputObj.employee_group_id = this.state.employee_group_id;
          }

          if (this.state.hims_d_employee_id !== null) {
            inputObj.employee_id = this.state.hims_d_employee_id;
          }

          if (this.state.leave_id !== null) {
            inputObj.leave_id = this.state.leave_id;
          }
          algaehApiCall({
            uri: "/leave/processYearlyLeave",
            method: "GET",
            module: "hrManagement",
            data: inputObj,
            onSuccess: (res) => {
              if (res.data.success) {
                swalMessage({
                  title: "Leaves processed successfully",
                  type: "success",
                });
                this.getLeaveData();
                this.setState({
                  loading: false,
                });
              } else if (!res.data.success) {
                swalMessage({
                  title: res.data.records.message,
                  type: "warning",
                });
                this.setState({
                  loading: false,
                });
              }
            },
            onFailure: (err) => {
              swalMessage({
                title: err.message,
                type: "error",
              });
              this.setState({
                loading: false,
              });
            },
          });
        }
      );
    } else {
      swalMessage({
        title:
          "You can't Process leave for all Branch, Please select single branch",
        type: "warning",
      });
    }
  }

  clearState() {
    this.setState(
      {
        hospital_id: "",
        hims_d_employee_id: null,
        employee_name: null,
        year: moment().year(),
        leave_id: null,
        employee_group_id: null,
      },
      () => {
        this.getLeaveData();
      }
    );
  }

  getLeaveMaster() {
    algaehApiCall({
      uri: "/selfService/getLeaveMaster",
      method: "GET",
      module: "hrManagement",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            leaves: res.data.records,
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

  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee,
      },
      searchName: "employee_branch_wise",
      uri: "/gloabelSearch/get",
      inputs: "hospital_id = " + this.state.hospital_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        this.setState(
          {
            employee_name: row.full_name,
            hims_d_employee_id: row.hims_d_employee_id,
          },
          () => {
            this.getLeaveData();
          }
        );
      },
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
    });
  }

  textHandler(e) {
    switch (e.target.name) {
      case "year":
        if (e.target.value.length >= 4) {
          this.setState(
            {
              [e.target.name]: e.target.value,
            },
            () => {
              this.getLeaveData();
            }
          );
        } else {
          this.setState({
            [e.target.name]: e.target.value,
          });
        }

        break;
      default:
        break;
    }
  }

  closePopup() {
    this.setState({
      open: false,
    });
  }

  render() {
    let allYears = getYears();

    return (
      <div className="leave_en_auth row">
        <YearlyLeaveDetail
          open={this.state.open}
          onClose={this.closePopup.bind(this)}
          year={this.state.send_year}
          employee_id={this.state.send_Emp_id}
        />
        <div className="col-12">
          <div className="row inner-top-search">
            <AlagehAutoComplete
              div={{ className: "col-1 form-group mandatory" }}
              label={{
                fieldName: "year",
                isImp: true,
              }}
              selector={{
                name: "year",
                className: "select-fld",
                value: this.state.year,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: allYears,
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    year: null,
                  });
                },
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-2  form-group mandatory" }}
              label={{
                forceLabel: "Branch.",
                isImp: true,
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.state.hospitals,
                },
                //onChange: texthandler.bind(this, this),
                onChange: this.dropDownHandler.bind(this),

                onClear: () => {
                  this.setState({
                    hospital_id: null,
                  });
                },
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-2" }}
              label={{
                fieldName: "employeeGroup",
                isImp: false,
              }}
              selector={{
                name: "employee_group_id",
                className: "select-fld",
                value: this.state.employee_group_id,
                dataSource: {
                  textField: "group_description",
                  valueField: "hims_d_employee_group_id",
                  data: this.props.emp_groups,
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    employee_group_id: null,
                  });
                },
              }}
            />
            <div className="col globalSearchCntr">
              <AlgaehLabel label={{ fieldName: "searchEmployee" }} />
              <h6 onClick={this.employeeSearch.bind(this)}>
                {this.state.employee_name
                  ? this.state.employee_name
                  : "--Select Employee--"}
                <i className="fas fa-search fa-lg" />
              </h6>
            </div>
            <div className="col form-group">
              <button
                onClick={this.clearState.bind(this)}
                style={{ marginTop: 20 }}
                className="btn btn-default"
              >
                CLEAR
              </button>
              <button
                onClick={this.getLeaveData.bind(this)}
                style={{ marginTop: 20, marginLeft: 5 }}
                className="btn btn-default"
              >
                {!this.state.loading ? (
                  "Load"
                ) : (
                  <i className="fas fa-spinner fa-spin" />
                )}
              </button>
            </div>
            <AlagehAutoComplete
              div={{ className: "col-2 form-group " }}
              label={{
                forceLabel: "Select a Leave Type",
                isImp: false,
              }}
              selector={{
                name: "leave_id",
                value: this.state.leave_id,
                className: "select-fld",
                dataSource: {
                  textField: "leave_description",
                  valueField: "hims_d_leave_id",
                  data: this.state.leaves,
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    leave_id: null,
                  });
                },
              }}
            />

            <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
              <div className="col form-group">
                <button
                  onClick={this.processYearlyLeave.bind(this)}
                  style={{ marginTop: 20 }}
                  className="btn btn-primary"
                >
                  {!this.state.loading ? (
                    "PROCESS"
                  ) : (
                    <i className="fas fa-spinner fa-spin" />
                  )}
                </button>
              </div>{" "}
            </AlgaehSecurityElement>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Leave Process Details</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="LeaveYearlyProcessGrid_Cntr">
                  <AlgaehDataGrid
                    id="LeaveYearlyProcessGrid"
                    datavalidate="LeaveYearlyProcessGrid"
                    columns={[
                      {
                        fieldName: "actions",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Details" }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <i
                              className="fas fa-eye"
                              onClick={() => {
                                this.setState({
                                  open: true,
                                  send_Emp_id: row.employee_id,
                                  send_year: row.year,
                                });
                              }}
                            />
                          );
                        },
                        others: {
                          maxWidth: 55,
                          filterable: false,
                          fixed: "left",
                        },
                      },
                      {
                        fieldName: "year",
                        label: <AlgaehLabel label={{ fieldName: "year" }} />,
                        others: {
                          maxWidth: 70,
                        },
                        filterable: true,
                      },
                      {
                        fieldName: "employee_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Emp. Code" }} />
                        ),
                        others: {
                          maxWidth: 120,
                        },
                        filterable: true,
                      },
                      {
                        fieldName: "employee_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Name" }}
                          />
                        ),
                        others: {
                          style: { textAlign: "left" },
                        },
                        filterable: true,
                      },
                      {
                        fieldName: "group_description",
                        label: (
                          <AlgaehLabel label={{ fieldName: "employeeGroup" }} />
                        ),
                        filterable: true,
                        others: {
                          maxWidth: 150,
                        },
                      },
                      {
                        fieldName: "department_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Department Name" }}
                          />
                        ),
                        filterable: true,
                        others: {
                          maxWidth: 150,
                        },
                      },
                      {
                        fieldName: "sub_department_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Sub Dept. Name" }}
                          />
                        ),
                        filterable: true,
                        others: {
                          maxWidth: 150,
                        },
                      },
                    ]}
                    keyId="hims_f_employee_monthly_leave_id"
                    data={this.state.leave_data}
                    pagination={true}
                    isFilterable={true}
                    loading={this.state.loading}
                    // paging={{ page: 0, rowsPerPage: 10 }}
                    // events={{}}
                    // others={{}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    emp_groups: state.emp_groups,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getEmpGroups: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LeaveYearlyProcess)
);
