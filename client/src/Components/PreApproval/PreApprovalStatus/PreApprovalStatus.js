import React, { PureComponent } from "react";

import PatientDetails from "./PatientDetails/PatientDetails";
import RequestDetails from "./RequestDetails/RequestDetails";
import ApprovalDetails from "./ApprovalDetails/ApprovalDetails";
import Attachments from "./Attachments/Attachments";
import { AlgaehModalPopUp } from "../../Wrapper/algaehWrapper";
import "./../../../styles/site.scss";
import "./PreApprovalStatus.scss";
import MyContext from "../../../utils/MyContext.js";
import { UpdatePreApproval } from "./PreApprovalStatusEvent";
import _ from "lodash";

export default class PreApprovalStatus extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      update_pre_approval_service: []
    };
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
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
                  <PatientDetails
                    selected_services={this.props.selected_services}
                  />
                  <RequestDetails
                    selected_services={this.props.selected_services}
                  />
                  <ApprovalDetails
                    selected_services={this.props.selected_services}
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
