import React, { Component } from "react";
import AlgaehModalPopUp from "../../../Wrapper/modulePopUp";
import { AlgaehDateHandler } from "../../../Wrapper/algaehWrapper";
import "./ShiftAssign.css";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
class ShiftAssign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      shifts: [],
      shiftEmp: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open === true) {
      debugger;
      let myArray = this.state.shiftEmp;
      myArray.push(nextProps.sendRow);
      this.setState({
        ...nextProps.data,
        shiftEmp: myArray
      });
    } else {
      this.setState({
        shiftEmp: []
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
        //console.log("Data:", this.state.shiftEmp);
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
          }
        },
        onFailure: err => {
          swalMessage({
            title: err.message,
            type: "error"
          });
        }
      });

      console.log("SEND DATA:", JSON.stringify(sendData));
    }
  }

  render() {
    return (
      <AlgaehModalPopUp
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose
        }}
        className="col-lg-12"
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
              <div className="col-6">
                <h6>EMPLOYEES</h6>
                <ul className="shiftEmployeeList">
                  {this.state.employees.map((data, index) => (
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
              </div>
              <div className="col-6">
                <h6>SHIFTS</h6>
                <ul className="shiftList">
                  {this.state.shifts.map((data, index) => (
                    <li key={index}>
                      <input
                        id={data.hims_d_shift_id}
                        name="shift_id"
                        value={data}
                        onChange={this.shiftHandler.bind(this, data)}
                        type="radio"
                      />
                      <label
                        htmlFor={data.hims_d_shift_id}
                        style={{
                          width: "80%"
                        }}
                      >
                        {data.shift_description +
                          " (" +
                          data.shift_abbreviation +
                          ")"}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
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
