import React, { PureComponent } from "react";
import AlgaehModalPopUp from "../../../Wrapper/modulePopUp";
import {
  AlgaehDateHandler,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import "./ShiftAssign.scss";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
class ShiftAssign extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      employeeList: [],
      employees: [],
      shifts: [],
      shiftEmp: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open === true) {
      let myArray = this.state.shiftEmp;
      myArray.push(nextProps.sendRow);
      this.setState({
        shiftEmp: myArray,
        ...nextProps.data
      });
    } else {
      this.setState({
        shiftEmp: [],
        employeeList: this.state.employees
      });
    }
  }

  shiftHandler(data, e) {
    this.setState({
      shift_id: data.hims_d_shift_id,
      shift_end_day: data.shift_end_day,
      shift_start_time: data.in_time1,
      shift_end_time: data.out_time1,
      shift_time: data.shift_time
    });
  }

  SearchHandler(e) {
    switch (e.target.name) {
      case "searchEmployees":
        let search = e.target.value.toLowerCase(),
          employees = this.state.employees.filter(el => {
            let searchValue = el.employee_name.toLowerCase();
            return searchValue.indexOf(search) !== -1;
          });

        this.setState({
          employeeList: employees
        });
        break;

      default:
        let ShiftSearch = e.target.value.toLowerCase(),
          shifts = this.state.shifts.filter(el => {
            let searchValue = el.shift_description.toLowerCase();
            return searchValue.indexOf(ShiftSearch) !== -1;
          });

        this.setState({
          shiftList: shifts
        });
        break;
    }
  }

  addEmployees(row) {
    let myArray = this.state.shiftEmp;

    if (myArray.includes(row)) {
      myArray.pop(row);
    } else {
      myArray.push(row);
    }

    this.setState(
      {
        shiftEmp: myArray
      },
      () => {
      }
    );
  }

  processAssignment() {
    if (this.state.shift_id === undefined || this.state.shift_id === null) {
      swalMessage({
        title: "Please Select a shift to assign",
        type: "warning"
      });
    } else if (
      this.state.shiftEmp.length === 0 ||
      this.state.shiftEmp === undefined
    ) {
      swalMessage({
        title: "Please select atleast one employee to asssign shift",
        type: "warning"
      });
    } else if (
      moment(this.state.from_date).format("YYYYMMDD") >
      moment(this.state.to_date).format("YYYYMMDD")
    ) {
      swalMessage({
        title: "Please select a proper Date Range",
        type: "warning"
      });
    } else {
      let x = moment.duration(
        moment(this.state.shift_end_time, "HH:mm:ss").diff(
          moment(this.state.shift_start_time, "HH:mm:ss")
        )
      );

      let hours = x._data.hours;
      let mins = x._data.minutes;

      let sendData = {
        from_date: moment(this.state.from_date).format("YYYY-MM-DD"),
        to_date: moment(this.state.to_date).format("YYYY-MM-DD"),
        shift_id: this.state.shift_id,
        employees: this.state.shiftEmp,
        shift_end_day: this.state.shift_end_day,
        shift_start_time: this.state.shift_start_time,
        shift_end_time: this.state.shift_end_time,
        shift_time: hours + "." + mins,
        hospital_id: this.state.hospital_id
      };

      algaehApiCall({
        uri: "/shift_roster/addShiftRoster",
        method: "POST",
        data: sendData,
        module: "hrManagement",
        onSuccess: res => {
          if (res.data.success) {
            swalMessage({
              title: "Record Added Successfully",
              type: "success"
            });
            document.getElementById("clsSftAsgn").click();
          }
        },
        onFailure: err => {
          swalMessage({
            title: err.message,
            type: "error"
          });
        }
      });

      // console.log("SEND DATA:", JSON.stringify(sendData));
    }
  }

  render() {
    const _employeeList =
      this.state.employeeList.length === 0
        ? this.state.employees
        : this.state.employeeList;

    // const _shiftList =
    //   this.state.shiftList.length === 0
    //     ? this.state.shifts
    //     : this.state.shiftList;

    return (
      <AlgaehModalPopUp
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose
        }}
        className="col-lg-12 ShiftAssign"
      >
        <div className="popupInner" data-validate="LvEdtGrd">
          <div className="col-12">
            <div className="row">
              <AlgaehDateHandler
                div={{ className: "col-3 margin-bottom-15" }}
                label={{
                  forceLabel: "From Date",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "from_date",
                  others: {
                    tabIndex: "1"
                  }
                }}
                events={{
                  onChange: selDate => {
                    this.setState({
                      from_date: selDate
                    });
                  }
                }}
                maxDate={new Date()}
                value={this.state.from_date}
              />
              <AlgaehDateHandler
                div={{ className: "col-3 margin-bottom-15" }}
                label={{
                  forceLabel: "To Date",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "to_date",
                  others: {
                    tabIndex: "2"
                  }
                }}
                events={{
                  onChange: selDate => {
                    this.setState({
                      to_date: selDate
                    });
                  }
                }}
                minDate={this.state.from_date}
                value={this.state.to_date}
              />
            </div>
            <div style={{ maxHeight: "400px" }} className="row">
              <div className="col-8">
                <h6>SHIFTS</h6>
                {/* <input
                  type="text"
                  autoComplete="off"
                  name="searchShifts"
                  className="rosterSrch"
                  placeholder="Search Shifts"
                  value={this.state.searchShifts}
                  onChange={this.SearchHandler.bind(this)}
                /> */}
                {/* <ul className="shiftList">
                  {_shiftList.map((data, index) => (
                    <li key={index}>
                      <input
                        id={data.shift_code}
                        name="shift_id"
                        value={data}
                        onChange={this.shiftHandler.bind(this, data)}
                        type="radio"
                      />
                      <label
                        htmlFor={data.shift_code}
                        style={{
                          width: "80%"
                        }}
                      >
                        <span>
                          {data.shift_description +
                            " (" +
                            data.shift_abbreviation +
                            ") "}
                        </span>
                        In time:
                        <span>
                          {" "}
                          {moment(data.in_time1, "HH:mm:ss").isValid()
                            ? moment(data.in_time1, "HH:mm:ss").format(
                                "hh:mm a"
                              )
                            : "----"}
                        </span>{" "}
                        Out Time:
                        <span>
                          {" "}
                          {moment(data.out_time1, "HH:mm:ss").isValid()
                            ? moment(data.out_time1, "HH:mm:ss").format(
                                "hh:mm a"
                              )
                            : "----"}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul> */}
                <AlgaehDataGrid
                  id="shftMstrList_grid"
                  columns={[
                    {
                      fieldName: "actions",
                      label: <AlgaehLabel label={{ forceLabel: "Actions" }} />,
                      displayTemplate: row => {
                        return (
                          <input
                            id={row.shift_code}
                            value={row}
                            onChange={this.shiftHandler.bind(this, row)}
                            type="radio"
                            checked={
                              row.hims_d_shift_id === this.state.shift_id
                            }
                          />
                        );
                      }
                    },
                    {
                      fieldName: "shift_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Shift Code" }} />
                      )
                    },
                    {
                      fieldName: "shift_description",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Shift Description" }}
                        />
                      )
                    },
                    {
                      fieldName: "shift_abbreviation",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Shift Abbr." }} />
                      )
                    },
                    {
                      fieldName: "in_time1",
                      label: <AlgaehLabel label={{ forceLabel: "In Time" }} />,
                      displayTemplate: row => {
                        return moment(row.in_time1, "HH:mm:ss").isValid()
                          ? moment(row.in_time1, "HH:mm:ss").format("hh:mm a")
                          : "----";
                      }
                    },
                    {
                      fieldName: "out_time1",
                      label: <AlgaehLabel label={{ forceLabel: "Out Time" }} />,
                      displayTemplate: row => {
                        return moment(row.out_time1, "HH:mm:ss").isValid()
                          ? moment(row.out_time1, "HH:mm:ss").format("hh:mm a")
                          : "----";
                      }
                    }
                  ]}
                  keyId="hims_d_shift_id"
                  dataSource={{
                    data: this.state.shifts
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onEdit: () => {}
                    // onDelete: this.deleteLoanMaster.bind(this),
                    // onDone: this.updateLoanMater.bind(this)
                  }}
                />
              </div>
              <div className="col-4">
                <h6>EMPLOYEES</h6>
                <input
                  type="text"
                  autoComplete="off"
                  name="searchEmployees"
                  className="rosterSrch"
                  placeholder="Search Employees"
                  value={this.state.searchEmployees}
                  onChange={this.SearchHandler.bind(this)}
                />
                <ul className="shiftEmployeeList">
                  {_employeeList.map((data, index) => (
                    <li key={index}>
                      <input
                        id={data.employee_code}
                        value={JSON.stringify(data)}
                        type="checkbox"
                        checked={this.state.shiftEmp.includes(data)}
                        onChange={this.addEmployees.bind(this, data)}
                      />
                      <label
                        htmlFor={data.employee_code}
                        style={{
                          width: "80%"
                        }}
                      >
                        {data.employee_name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>{" "}
            </div>
          </div>
        </div>

        <div className="popupFooter">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-4"> &nbsp;</div>

              <div className="col-lg-8">
                <button
                  onClick={this.processAssignment.bind(this)}
                  type="button"
                  className="btn btn-primary"
                >
                  PROCESS
                </button>

                <button
                  onClick={this.props.onClose}
                  type="button"
                  className="btn btn-default"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default ShiftAssign;
