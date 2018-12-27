import React, { Component } from "react";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import {
  algaehApiCall,
  swalMessage,
  dateFomater
} from "../../../../utils/algaehApiCall";
import moment from "moment";

export default class MonthlyAttendance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      department: {
        loader: false,
        sub_department_id: null,
        data: []
      },
      branch: {
        hospital_id: null,
        loader: false,
        data: []
      },
      attandance: {
        loader: false,
        data: []
      },
      hims_d_employee_id: null,
      yearAndMonth: moment().startOf("month")._d,
      formatingString: this.monthFormatorString(moment().startOf("month"))
    };
  }
  monthFormatorString(yearAndMonth) {
    const _start = moment(yearAndMonth)
      .startOf("month")
      .format("MMM DD YYYY");
    const _end = moment(yearAndMonth)
      .endOf("month")
      .format("MMM DD YYYY");
    return _start + " - " + _end;
  }
  componentDidMount() {
    this.getDepartment();
    this.getOrganization();
  }
  getDepartment() {
    const that = this;
    that.setState({ department: { loader: true } });
    algaehApiCall({
      uri: "/department/get",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          that.setState({
            department: {
              loader: false,
              data: response.data.records
            }
          });
        }
      },
      onFailure: error => {
        that.setState({
          department: {
            loader: false
          }
        });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getOrganization() {
    const that = this;
    that.setState({ branch: { loader: true } });
    algaehApiCall({
      uri: "/organization/getOrganization",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          that.setState({
            branch: {
              loader: false,
              data: response.data.records
            }
          });
        }
      },
      onFailure: error => {
        that.setState({
          branch: {
            loader: false
          }
        });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  monthSelectionHandler(e) {
    this.setState({
      yearAndMonth: moment(e).startOf("month")._d
    });
  }
  onDropDownClearHandler(e) {
    const _stateOf = this["ref_" + e];
    const _getType = _stateOf.getAttribute("stateof");

    this.setState({
      [_getType]: {
        ...this.state[_getType],
        [e]: null
      }
    });
  }

  dropDownHandle(e) {
    const _stateOf = this["ref_" + e.name];
    const _getType = _stateOf.getAttribute("stateof");

    this.setState({
      [_getType]: {
        [e.name]: e.value,
        ...this.state[_getType]
      }
    });
  }
  processAttandance() {
    const that = this;
    const _empdtl =
      that.state.hims_d_employee_id !== null &&
      that.state.hims_d_employee_id !== ""
        ? { hims_d_employee_id: that.state.hims_d_employee_id }
        : {};
    const _branch =
      that.state.branch.hospital_id !== null &&
      that.state.branch.hospital_id !== ""
        ? { hospital_id: that.state.branch.hospital_id }
        : {};

    const _depatment =
      that.state.department.sub_department_id !== null &&
      that.state.department.sub_department_id !== ""
        ? { sub_department_id: that.state.department.sub_department_id }
        : {};

    that.setState({ attandance: { loader: true } });
    algaehApiCall({
      uri: "/attendance/processAttendance",
      method: "GET",
      module: "hrManagement",
      data: {
        yearAndMonth: that.state.yearAndMonth,
        ..._empdtl,
        ..._branch,
        ..._depatment
      },
      onSuccess: response => {
        if (response.data.success) {
          that.setState({
            attandance: {
              loader: false,
              data: response.data.result
            }
          });
        }
      },
      onFailure: error => {
        that.setState({
          attandance: {
            loader: false
          }
        });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div className="monthly_attendance">
        <div className="row inner-top-search">
          <AlgaehDateHandler
            div={{ className: "col mandatory" }}
            label={{ forceLabel: "Select Month & Year", isImp: true }}
            textBox={{
              className: "txt-fld",
              name: "yearAndMonth"
            }}
            maxDate={new Date()}
            events={{
              onChange: this.monthSelectionHandler.bind(this)
            }}
            others={{
              type: "month"
            }}
            value={dateFomater(this.state.yearAndMonth)}
          />
          <AlagehAutoComplete
            div={{ className: "col " }}
            label={{
              forceLabel: "Filter by Dept.",
              isImp: false
            }}
            selector={{
              name: "sub_department_id",
              className: "select-fld",
              value: this.state.department.sub_department_id,
              dataSource: {
                textField: "department_name",
                valueField: "hims_d_department_id",
                data: this.state.department.data
              },
              others: {
                ref: c => {
                  this.ref_sub_department_id = c;
                },
                stateof: "department"
              },
              onChange: this.dropDownHandle.bind(this),
              onClear: this.onDropDownClearHandler.bind(this)
            }}
            showLoading={this.state.department.loader}
          />

          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Filter by Branch",
              isImp: false
            }}
            selector={{
              name: "hospital_id",
              className: "select-fld",
              value: this.state.branch.hospital_id,
              dataSource: {
                textField: "hospital_name",
                valueField: "organization_id",
                data: this.state.branch.data
              },
              others: {
                ref: c => {
                  this.ref_hospital_id = c;
                },
                stateof: "branch"
              },
              onChange: this.dropDownHandle.bind(this),
              onClear: this.onDropDownClearHandler.bind(this)
            }}
            showLoading={this.state.branch.loader}
          />

          <div className="col form-group">
            <button
              onClick={this.processAttandance.bind(this)}
              style={{ marginTop: 21 }}
              disabled={this.state.attandance.loader}
              className="btn btn-primary"
            >
              {!this.state.attandance.loader ? (
                <span>Process Attendance</span>
              ) : (
                <i className="fas fa-spinner fa-spin" />
              )}
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">
                Employee Time Sheet:{" "}
                <b style={{ color: "#33b8bc" }}>{this.state.formatingString}</b>
              </h3>
            </div>
          </div>
          <div className="portlet-body">
            <div data-validate="erngsDdctnsGrid" id="TimeSheetGrid_Cntr">
              <AlgaehDataGrid
                id="employee-attandance-grid"
                noDataText="Attendance process has no records"
                columns={[
                  {
                    fieldName: "employee_name",

                    label: (
                      <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                    ),
                    others: {
                      capitalize: true
                    }
                  },
                  {
                    fieldName: "employee_code",

                    label: (
                      <AlgaehLabel label={{ forceLabel: "Employee Code" }} />
                    )
                  },
                  {
                    fieldName: "total_days",
                    label: <AlgaehLabel label={{ forceLabel: "Total Days" }} />
                  },
                  {
                    fieldName: "present_days",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Present Days" }} />
                    )
                  },
                  {
                    fieldName: "absent_days",
                    label: <AlgaehLabel label={{ forceLabel: "Absent Days" }} />
                  },
                  {
                    fieldName: "paid_leave",
                    label: <AlgaehLabel label={{ forceLabel: "Paid Leaves" }} />
                  },
                  {
                    fieldName: "unpaid_leave",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Unpaid Leaves" }} />
                    )
                  },
                  {
                    fieldName: "pending_unpaid_leaves",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Pending Unpaid Leaves" }}
                      />
                    )
                  }
                ]}
                dataSource={{
                  data: this.state.attandance.data
                }}
                filterable
                paging={{ page: 0, rowsPerPage: 10 }}
                loading={this.state.attandance.loader}
              />
            </div>
          </div>
        </div>
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">
                Selected Employee Leave Balance
              </h3>
            </div>
          </div>
          <div className="portlet-body">
            <div data-validate="erngsDdctnsGrid" id="EmployeeLeaveBalance_Cntr">
              <AlgaehDataGrid
                columns={[
                  {
                    fieldName: "earning_deduction_code",
                    label: <AlgaehLabel label={{ forceLabel: "Leave Code" }} />
                  },
                  {
                    fieldName: "earning_deduction_description",
                    label: <AlgaehLabel label={{ forceLabel: "Description" }} />
                  },
                  {
                    fieldName: "short_desc",
                    label: <AlgaehLabel label={{ forceLabel: "Available" }} />
                  },
                  {
                    fieldName: "component_category",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Present Days" }} />
                    )
                  },
                  {
                    fieldName: "calculation_method",
                    label: <AlgaehLabel label={{ forceLabel: "Absent Days" }} />
                  },
                  {
                    fieldName: "component_frequency",
                    label: <AlgaehLabel label={{ forceLabel: "Paid Leaves" }} />
                  },
                  {
                    fieldName: "calculation_type",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Unpaid Leaves" }} />
                    )
                  },
                  {
                    fieldName: "component_type",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Pending Unpaid Leaves" }}
                      />
                    )
                  }
                ]}
                keyId="hims_d_employee_group_id"
                dataSource={{
                  data: this.state.earning_deductions
                }}
                isEditable={false}
                paging={{ page: 0, rowsPerPage: 10 }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
