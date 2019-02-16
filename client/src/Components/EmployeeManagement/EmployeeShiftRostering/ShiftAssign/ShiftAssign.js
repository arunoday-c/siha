import React, { Component } from "react";
import AlgaehModalPopUp from "../../../Wrapper/modulePopUp";
import { AlgaehDateHandler } from "../../../Wrapper/algaehWrapper";
import "./ShiftAssign.css";
class ShiftAssign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      shifts: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps.data
    });
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
                    tabIndex: "6"
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
                    tabIndex: "6"
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
                maxDate={new Date()}
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
                        row={JSON.stringify(data)}
                        //onChange={this.checkHandle.bind(this)}
                        type="checkbox"
                      />
                      <span
                        style={{
                          width: "80%"
                        }}
                      >
                        {data.employee_name}
                      </span>
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
                        row={JSON.stringify(data)}
                        // onChange={this.checkHandle.bind(this)}
                        type="checkbox"
                      />
                      <span
                        style={{
                          width: "80%"
                        }}
                      >
                        {data.shift_description}
                      </span>
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
                  // onClick={this.saveMaster.bind(this)}
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
