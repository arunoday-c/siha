import React, { Component } from "react";
import { AlgaehModalPopUp } from "../../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";

class MonthlyModify extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open === true) {
      this.setState(nextProps.data);
    }
  }

  updateMonthlyAttendance() {
    algaehApiCall({
      uri: "/attendance/updateMonthlyAttendance",
      method: "PUT",
      data: {
        shortage_hours: this.state.shortage_hours,
        ot_work_hours: this.state.ot_work_hours,
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

  render() {
    return (
      <AlgaehModalPopUp
        title="Edit Monthly Detail"
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose
        }}
      >
        <div className="row">
          <div className="col-lg-12">{JSON.stringify(this.state)}</div>
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
