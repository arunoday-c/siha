import React, { Component } from "react";
import "./EmployeeShiftRostering.css";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel
} from "../Wrapper/algaehWrapper";
import AlgaehSearch from "../Wrapper/globalSearch";
import { getYears } from "../../utils/GlobalFunctions";
import { MONTHS } from "../../utils/GlobalVariables.json";
import Employee from "../../Search/Employee.json";
import moment from "moment";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";

export default class EmployeeShiftRostering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      year: moment().year(),
      month: moment(new Date()).format("M"),
      formatingString: this.monthFormatorString(moment().startOf("month"))
    };
    this.getSubDepartments();
  }

  employeeSearch(e) {
    if (
      this.state.sub_department_id === null ||
      this.state.sub_department_id === undefined
    ) {
      swalMessage({
        title: "Please Select a department",
        type: "warning"
      });
    } else {
      AlgaehSearch({
        searchGrid: {
          columns: Employee
        },
        searchName: "users",
        uri: "/gloabelSearch/get",
        inputs: " E.sub_department_id=" + this.state.sub_department_id,
        onContainsChange: (text, serchBy, callBack) => {
          callBack(text);
        },
        onRowSelect: row => {
          let arr = this.state.employees;
          arr.push(row);

          this.setState({
            hims_d_employee_id: row.hims_d_employee_id,
            emp_name: row.full_name,
            employees: arr
          });
        }
      });
    }
  }

  getSubDepartments() {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      method: "GET",
      module: "masterSettings",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            sub_depts: res.data.records
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

  monthFormatorString(yearAndMonth) {
    const _start = moment(yearAndMonth)
      .startOf("month")
      .format("MMM DD YYYY");
    const _end = moment(yearAndMonth)
      .endOf("month")
      .format("MMM DD YYYY");

    return _start + " - " + _end;
  }

  getStartandMonthEnd() {
    let yearMonth = this.state.year + "-" + this.state.month + "-01";
    let startDate = moment(yearMonth)
      .startOf("month")
      .format("MMM DD YYYY");
    let endDate = moment(yearMonth)
      .endOf("month")
      .format("MMM DD YYYY");

    this.setState({
      formatingString: startDate + " - " + endDate
    });
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "month":
        this.setState(
          {
            [value.name]: value.value
          },
          () => {
            this.getStartandMonthEnd();
          }
        );
        break;
      case "year":
        this.setState(
          {
            [value.name]: value.value
          },
          () => {
            this.getStartandMonthEnd();
          }
        );
        break;

      default:
        this.setState({
          [value.name]: value.value
        });
        break;
    }
  }

  getDaysOfMonth() {
    var dates = [];
    let yearMonth = this.state.year + "-" + this.state.month + "-01";

    var currDate = moment(yearMonth)
      .startOf("month")
      .format("MMM DD YYYY");
    var lastDate = moment(yearMonth)
      .endOf("month")
      .format("MMM DD YYYY");

    var now = moment(currDate).clone(),
      dates = [];

    while (now.isSameOrBefore(lastDate)) {
      dates.push(
        <th>
          <span> {now.format("ddd")}</span> {now.format("ddd d/MMM")}
        </th>
      );
      now.add(1, "days");
    }
    return dates;
  }

  render() {
    let allYears = getYears();
    return (
      <div className="EmpShiftRost_Screen">
        <div className="row  inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Select a Year.",
              isImp: true
            }}
            selector={{
              name: "year",
              className: "select-fld",
              value: this.state.year,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: allYears
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  year: null
                });
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Select a Month.",
              isImp: true
            }}
            selector={{
              sort: "off",
              sort: "off",
              name: "month",
              className: "select-fld",
              value: this.state.month,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: MONTHS
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  month: null
                });
              }
            }}
          />
          {/* <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Rostering Group",
              isImp: false
            }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          /> */}
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Department", isImp: true }}
            selector={{
              name: "sub_department_id",
              value: this.state.sub_department_id,
              className: "select-fld",
              dataSource: {
                textField: "sub_department_name",
                valueField: "hims_d_sub_department_id",
                data: this.state.sub_depts
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  hims_d_sub_department_id: null
                });
              }
            }}
          />

          <div className="col-3" style={{ marginTop: 10 }}>
            <div
              className="row"
              style={{
                border: " 1px solid #ced4d9",
                borderRadius: 5,
                marginLeft: 0
              }}
            >
              <div className="col">
                <AlgaehLabel label={{ forceLabel: "Select a Employee." }} />
                <h6> {this.state.emp_name ? this.state.emp_name : "------"}</h6>
              </div>
              <div
                className="col-lg-3"
                style={{ borderLeft: "1px solid #ced4d8" }}
              >
                <i
                  className="fas fa-search fa-lg"
                  style={{
                    paddingTop: 17,
                    paddingLeft: 3,
                    cursor: "pointer"
                  }}
                  onClick={this.employeeSearch.bind(this)}
                />
              </div>
            </div>
          </div>

          <div className="col form-group">
            <button style={{ marginTop: 21 }} className="btn btn-primary">
              Load
            </button>
            <button
              //  onClick={this.clearState.bind(this)}
              style={{ marginTop: 21, marginLeft: 5 }}
              className="btn btn-default"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Shift Roasting List{" "}
                    <b style={{ color: "#33b8bc" }}>
                      {this.state.formatingString}
                    </b>
                  </h3>
                </div>
                <div className="actions">
                  <span style={{ background: "#3f9c62" }} className="legends">
                    Weekly Off (WO)
                  </span>
                  <span style={{ background: "#3f789c" }} className="legends">
                    Holiday (H)
                  </span>
                  <span style={{ background: "#879c3f" }} className="legends">
                    Leave Authorized (LV)
                  </span>
                  <span style={{ background: "#9c7d3f" }} className="legends">
                    Leave Applied (LA)
                  </span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="col-12" id="shiftRosterTable">
                  <div className="row">
                    <table>
                      <thead>
                        <tr>
                          <th>Employee Code</th>
                          <th>Employee Name</th>
                          {this.getDaysOfMonth()}
                          <th>Joining Date</th>
                          <th>Exit Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <td>Emp 34754534</td>
                          <td>Mr. Donald Broad - Regional Managing Director</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td style={{ background: "lightgray" }}>C1</td>
                          <td />
                          <td />
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col">
                    {/* <label>Calculation Method</label> */}
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input type="checkbox" value="" name="" />
                        <span>Swap Employee</span>
                      </label>
                    </div>
                  </div>

                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Start date",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: ""
                    }}
                    maxDate={new Date()}
                    events={{}}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "To date",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: ""
                    }}
                    maxDate={new Date()}
                    events={{}}
                  />

                  <div className="col-3" style={{ marginTop: 10 }}>
                    <div
                      className="row"
                      style={{
                        border: " 1px solid #ced4d9",
                        borderRadius: 5,
                        marginLeft: 0,
                        marginRight: 0
                      }}
                    >
                      <div className="col">
                        <AlgaehLabel
                          label={{ forceLabel: "Select From Employee." }}
                        />
                        <h6>----</h6>
                      </div>
                      <div
                        className="col-lg-3"
                        style={{ borderLeft: "1px solid #ced4d8" }}
                      >
                        <i
                          className="fas fa-search fa-lg"
                          style={{
                            paddingTop: 17,
                            paddingLeft: 3,
                            cursor: "pointer"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-3" style={{ marginTop: 10 }}>
                    <div
                      className="row"
                      style={{
                        border: " 1px solid #ced4d9",
                        borderRadius: 5,
                        marginLeft: 0,
                        marginRight: 0
                      }}
                    >
                      <div className="col">
                        <AlgaehLabel
                          label={{ forceLabel: "Select to Employee." }}
                        />
                        <h6>----</h6>
                      </div>
                      <div
                        className="col-lg-3"
                        style={{ borderLeft: "1px solid #ced4d8" }}
                      >
                        <i
                          className="fas fa-search fa-lg"
                          style={{
                            paddingTop: 17,
                            paddingLeft: 3,
                            cursor: "pointer"
                          }}
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
    );
  }
}
