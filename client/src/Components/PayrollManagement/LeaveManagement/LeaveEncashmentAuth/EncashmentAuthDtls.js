import React, { Component } from "react";

import "./LeaveEncashmentAuth.scss";
import { AuthorizeLEaveEncash } from "./LeaveEncashmentAuthEvents.js";

import { AlgaehLabel, AlgaehModalPopUp } from "../../../Wrapper/algaehWrapper";
import {
  getAmountFormart,
  AlgaehOpenContainer
} from "../../../../utils/GlobalFunctions";

export default class EncashmentAuthDtls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      encashment_date: null,
      encashment_number: null,
      employee_code: null,
      full_name: null,
      leave_description: null,
      leave_days: null,
      total_amount: null,
      leave_encash_level: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("hrOptions"))
      ).leave_encash_level,
      hims_f_leave_encash_header_id: null
    };
  }

  componentWillReceiveProps(newProps) {

    this.setState({ ...newProps.EncashDetailPer });
  }

  render() {
    return (
      <AlgaehModalPopUp
        class="leaveEncashAuthModal"
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose
        }}
        title="Encashment Request Details"
      >
        <div className="popupInner LeaveAuthPopup" styl={{ marginTop: 15 }}>
          <div className="popRightDiv">
            <div className="leave_en_auth row">
              <div className="col-6 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Encashment Date"
                  }}
                />
                <h6>{this.state.encashment_date}</h6>
              </div>
              <div className="col-6 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Encashment No."
                  }}
                />
                <h6>{this.state.encashment_number}</h6>
              </div>
              <div className="col-6 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Employee Code"
                  }}
                />
                <h6>{this.state.employee_code}</h6>
              </div>
              <div className="col-6 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Employee Name"
                  }}
                />
                <h6>{this.state.full_name}</h6>
              </div>
              <div className="col-6 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Leave Description"
                  }}
                />
                <h6>{this.state.leave_description}</h6>
              </div>
              <div className="col-6 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Applied Days"
                  }}
                />
                <h6>{this.state.leave_days}</h6>
              </div>
              <div className="col-6 form-group">
                <AlgaehLabel
                  label={{
                    forceLabel: "Encashment Amount"
                  }}
                />
                <h6>{getAmountFormart(this.state.total_amount)}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="popupFooter">
          <div className="col-12">
            <button
              onClick={AuthorizeLEaveEncash.bind(this, this, "APR")}
              className="btn btn-primary"
            >
              Authorize
            </button>
            <button
              onClick={AuthorizeLEaveEncash.bind(this, this, "REJ")}
              className="btn btn-default"
            >
              Reject
            </button>
            <button onClick={this.props.onClose} className="btn btn-default">
              Close
            </button>
          </div>
        </div>
      </AlgaehModalPopUp>
    );
  }
}
