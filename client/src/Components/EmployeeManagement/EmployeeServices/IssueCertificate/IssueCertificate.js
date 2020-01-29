import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../actions/algaehActions";

import "./IssueCertificate.scss";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
// import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import {
  AlgaehValidation,
  AlgaehOpenContainer
} from "../../../../utils/GlobalFunctions";
import Enumerable from "linq";
import swal from "sweetalert2";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

class IssueCertificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      extra: {},
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      loading_Process: false,
      certificate_type: null
    };
  }

  componentWillUnmount() {
    this.clearState();
  }

  getDateRange(startDate, endDate) {
    var dates = [];

    var currDate = moment(startDate).startOf("day");
    var lastDate = moment(endDate).startOf("day");

    var now = currDate.clone();

    while (now.isSameOrBefore(lastDate)) {
      dates.push(now.format("YYYYMMDD"));
      now.add(1, "days");
    }
    return dates;
  }

  componentDidMount() {
    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganizationByUser",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations"
        }
      });
    }
  }

  employeeSearch() {
    this.clearState();
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee
      },
      searchName: "employee_branch_wise",
      uri: "/gloabelSearch/get",
      inputs: "hospital_id = " + this.state.hospital_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        this.setState(
          {
            employee_name: row.full_name,
            employee_id: row.hims_d_employee_id
          },
          () => this.getEmployees()
        );
      }
    });
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  clearState() {
    this.setState({
      employee_name: null,
      full_name: null,
      loading_Process: false
    });
  }

  IssueCertificate() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='apply-leave-div'",
      onSuccess: () => {
        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/leave/applyEmployeeLeave",
          method: "POST",
          module: "hrManagement",
          data: {
            employee_id: this.state.employee_id,
            sub_department_id: this.state.sub_department_id,
            hospital_id: this.state.hospital_id,
            ...this.state.extra
          },
          onSuccess: res => {
            AlgaehLoader({ show: false });
            if (res.data.success) {
              swalMessage({
                title: "Leave Applied Successfully",
                type: "success"
              });
              this.setState({ loading_Process: false });
              this.getEmployeeLeaveHistory();
              this.clearState();
            } else if (!res.data.success) {
              this.setState({ loading_Process: false }, () => {
                swalMessage({
                  title: res.data.records.message,
                  type: "error"
                });
              });
            }
          },
          onCatch: err => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: err.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  getEmployees() {
    algaehApiCall({
      uri: "/employee/get",
      module: "hrManagement",
      data: {
        hims_d_employee_id: this.state.employee_id
      },
      method: "GET",
      onSuccess: res => {
        this.setState(
          {
            employee: res.data.records[0]
          },
          () => {}
        );
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  searchSelect(data) {
    console.log(data);
    this.setState(
      {
        employee_id: data.hims_d_employee_id,
        full_name: data.full_name,
        display_name: data.full_name,
        sub_department_id: data.sub_department_id
      },
      () => this.getEmployees()
    );
  }

  render() {
    // let leaveData = this.state.emp_leaves_data
    //   ? this.state.emp_leaves_data
    //   : [];
    return (
      <React.Fragment>
        <div className="row apply_leave">
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Issue Certificate Direct</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-12 form-group  mandatory" }}
                    label={{
                      forceLabel: "Select Branch",
                      isImp: true
                    }}
                    selector={{
                      name: "hospital_id",
                      className: "select-fld",
                      value: this.state.hospital_id,
                      dataSource: {
                        textField: "hospital_name",
                        valueField: "hims_d_hospital_id",
                        data: this.props.organizations
                      },
                      //                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          hospital_id: null
                        });
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-12 form-group mandatory" }}
                    label={{
                      forceLabel: "Select Certificate Type",
                      isImp: true
                    }}
                    selector={{
                      name: "certificate_type",
                      className: "select-fld",
                      value: this.state.certificate_type,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: [
                          {
                            name: "Experience Certificate",
                            value: "1"
                          },
                          {
                            name: "Employement Certificate",
                            value: "2"
                          },
                          {
                            name: "Educational Form",
                            value: "3"
                          }
                        ]
                      }
                    }}
                  />
                  <div className="col-12 globalSearchCntr form-group mandatory">
                    <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
                    <h6 onClick={this.employeeSearch.bind(this)}>
                      {this.state.employee_name
                        ? this.state.employee_name
                        : "Search Employee"}
                      <i className="fas fa-search fa-lg" />
                    </h6>
                  </div>
                  <div className="col-12" style={{ textAlign: "right" }}>
                    <button
                      // onClick={this.clearState.bind(this)}
                      type="button"
                      className="btn btn-default"
                      style={{ marginRight: 15 }}
                    >
                      Clear
                    </button>
                    <button
                      // onClick={this.applyLeave.bind(this)}
                      type="button"
                      className="btn btn-primary"
                      disabled={this.state.Request_enable}
                    >
                      Generate Certificate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Issue Certificate on request
                  </h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" style={{ minHeight: "55vh" }}>
                    <AlgaehDataGrid
                      id="employeeFormTemplate"
                      columns={[
                        {
                          fieldName: "employee_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Emp. ID" }} />
                          ),
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "employee_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          ),
                          others: {
                            style: {
                              textAlign: "left"
                            }
                          }
                        },
                        {
                          fieldName: "requestDate",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Requested Date" }}
                            />
                          ),
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "requestedFor",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Requested For" }}
                            />
                          )
                        },
                        {
                          fieldName: "url",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Print / Issue" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <div>
                                {" "}
                                <button className="">Issue</button>/
                                <button className="">Print</button>
                              </div>
                            );
                          },
                          others: {
                            maxWidth: 150
                          }
                        }
                      ]}
                      keyId=""
                      dataSource={{
                        data: [
                          {
                            employee_id: "10045",
                            employee_name: "Aboobacker Sidhiqe",
                            requestDate: "07-01-2020",
                            requestedFor: "Salary Certificate",
                            url: "https://google.com"
                          }
                        ]
                      }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    organizations: state.organizations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrganizations: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(IssueCertificate)
);
