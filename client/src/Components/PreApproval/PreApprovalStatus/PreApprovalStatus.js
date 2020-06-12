import React, { Component } from "react";

// import PatientDetails from "./PatientDetails/PatientDetails";
import RequestDetails from "./RequestDetails/RequestDetails";
import ApprovalDetails from "./ApprovalDetails/ApprovalDetails";
import Attachments from "./Attachments/Attachments";
import { AlgaehModalPopUp, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import "./../../../styles/site.scss";
import "./PreApprovalStatus.scss";
import MyContext from "../../../utils/MyContext.js";
import { UpdatePreApproval } from "./PreApprovalStatusEvent";
import _ from "lodash";
import Options from "../../../Options.json";
import moment from "moment";

export default class PreApprovalStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update_pre_approval_service: [],
      services_details: []
    };
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.selected_services !== null) {
      let InputOutput = newProps.selected_services;
      this.setState({ ...this.state, ...InputOutput });
    }
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  render() {
    let services_details =
      this.props.selected_services !== null
        ? _.filter(this.props.selected_services.services_details, f => {
          return f.billing_updated === "N";
        })
        : [];

    let billing_Verefird = services_details.length > 0 ? false : true;
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title="Details for Pre Approval"
            openPopup={this.props.open}
          >
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: obj => {
                  this.setState({ ...obj });
                }
              }}
            >
              <div className="col-lg-12 popupInner" style={{ height: "75vh" }}>
                <div className="main_div" position="fixed">
                  <div>
                    <h6 className="popSubHdg">Patient Details</h6>
                    <div className="row">
                      {/* Patient code */}
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "patient_code"
                          }}
                        />
                        <h6>
                          {this.state.patient_code
                            ? this.state.patient_code
                            : "Patient Code"}
                        </h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "date"
                          }}
                        />
                        <h6>
                          {this.state.created_date
                            ? this.state.created_date
                            : "Created Date"}
                        </h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "doctor_id"
                          }}
                        />
                        <h6>
                          {this.state.doctor_name
                            ? this.state.doctor_name
                            : "Doctor Name"}
                        </h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "insurance_id"
                          }}
                        />
                        <h6>
                          {this.state.insurance_provider_name
                            ? this.state.insurance_provider_name
                            : "Insurance Name"}
                        </h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "department_id"
                          }}
                        />
                        <h6>
                          {this.state.sub_department_name
                            ? this.state.sub_department_name
                            : "--------"}
                        </h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "card_no"
                          }}
                        />
                        <h6>
                          {this.state.card_no ? this.state.card_no : "--------"}
                        </h6>
                      </div>
                    </div>
                  </div>

                  <RequestDetails selected_services={this.state} />
                  <ApprovalDetails
                    selected_services={this.state}
                    openFrom={this.props.openFrom}
                  />
                  <Attachments />
                </div>
              </div>
              <div className=" popupFooter">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-12">
                      <button
                        className="btn btn-primary"
                        onClick={UpdatePreApproval.bind(this, this)}
                        disabled={billing_Verefird === true ? true : false}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-default"
                        onClick={e => {
                          this.onClose(e);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </MyContext.Provider>
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}
