import React, { Component } from "react";
import {
  AlgaehModalPopUp,
  AlagehFormGroup,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";
import moment from "moment";

class MonthlyModify extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.open === true) {
      this.setState(nextProps.data);
    }
  }

  updateMonthlyAttendance() {
    algaehApiCall({
      uri: "/attendance/updateMonthlyAttendance",
      method: "PUT",
      data: {
        shortage_hours: this.state.shortage_hours
          ? this.state.shortage_hours
          : 0,
        ot_work_hours: this.state.ot_work_hours ? this.state.ot_work_hours : 0,
        hims_f_attendance_monthly_id: this.state.hims_f_attendance_monthly_id
      },
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record Updated Successfully",
            type: "success"
          });
          this.props.onClose();
        } else if (!res.data.success) {
          swalMessage({
            title: res.data.result.message,
            type: "warning"
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

  textHandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <AlgaehModalPopUp
        title="Edit Monthly Detail"
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose
        }}
      >
        <div className="popupInner">
          <div className="col-12 margin-top-15">
            <div className="row">
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Employee Code"
                  }}
                />
                <h6>{this.state.employee_code}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Employee Name"
                  }}
                />
                <h6>{this.state.employee_name}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Year"
                  }}
                />
                <h6>{this.state.year}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Month"
                  }}
                />
                <h6>{moment(this.state.month, "M").format("MMMM")}</h6>
              </div>{" "}
            </div>{" "}
            <div className="row">
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Days"
                  }}
                />
                <h6>{this.state.total_days}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Work Days"
                  }}
                />
                <h6>{this.state.total_work_days}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Present Days"
                  }}
                />
                <h6>{this.state.display_present_days}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Absent Days"
                  }}
                />
                <h6>{this.state.absent_days}</h6>
              </div>{" "}
              {/* <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Work Days"
                  }}
                />
                <h6>{this.state.total_work_days}</h6>
              </div>{" "} */}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Weekoff Days"
                  }}
                />
                <h6>{this.state.total_weekoff_days}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Holidays"
                  }}
                />
                <h6>{this.state.total_holidays}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Leave(s)"
                  }}
                />
                <h6>{this.state.total_leave}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Paid Leave(s)"
                  }}
                />
                <h6>{this.state.paid_leave}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Unpaid Leave(s)"
                  }}
                />
                <h6>{this.state.unpaid_leave}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Paid Days"
                  }}
                />
                <h6>{this.state.total_paid_days}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Pending Unpaid Leave(s)"
                  }}
                />
                <h6>{this.state.pending_unpaid_leave}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Hours"
                  }}
                />
                <h6>{this.state.total_hours}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Working Hours"
                  }}
                />
                <h6>{this.state.total_working_hours}</h6>
              </div>{" "}
              <div className="col-2 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "OT Weekoff Hours"
                  }}
                />
                <h6>
                  {this.state.ot_weekoff_hours
                    ? this.state.ot_weekoff_hours
                    : 0}
                </h6>
              </div>{" "}
              <AlagehFormGroup
                div={{ className: "col-2 form-group form-group" }}
                label={{
                  forceLabel: "Shortage Hours",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "shortage_hours",
                  value: this.state.shortage_hours,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  decimal: {
                    allowNegative: false,
                    thousandSeparator: ","
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-2 form-group form-group" }}
                label={{
                  forceLabel: "OT Work Hours",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "ot_work_hours",
                  value: this.state.ot_work_hours,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  decimal: {
                    allowNegative: false,
                    thousandSeparator: ","
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="popupFooter">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-4"> &nbsp;</div>

              <div className="col-lg-8">
                <button
                  onClick={this.updateMonthlyAttendance.bind(this)}
                  type="button"
                  className="btn btn-primary"
                >
                  UPDATE
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

export default MonthlyModify;
