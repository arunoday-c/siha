import React, { PureComponent } from "react";
import Typography from "@material-ui/core/Typography";

import PatientDetails from "./PatientDetails/PatientDetails";
import RequestDetails from "./RequestDetails/RequestDetails";
import ApprovalDetails from "./ApprovalDetails/ApprovalDetails";
import Attachments from "./Attachments/Attachments";
import { AlgaehLabel, Modal } from "../../Wrapper/algaehWrapper";
import "./../../../styles/site.css";
import "./PreApprovalStatus.css";
import MyContext from "../../../utils/MyContext.js";
import { UpdatePreApproval } from "./PreApprovalStatusEvent";

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
    return (
      <React.Fragment>
        <div>
          <Modal
            open={this.props.open}
          >
            <div className="algaeh-modal">
              <MyContext.Provider
                value={{
                  state: this.state,
                  updateState: obj => {
                    this.setState({ ...obj });
                  }
                }}
              >  
                          <div className="popupHeader"><div className="row">
                  <div className="col-lg-8">
                    <h4>{this.props.HeaderCaption}</h4>
                  </div>
                  <div className="col-lg-4">
                    <button
                      type="button"
                      className=""
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      <i className="fas fa-times-circle" />
                    </button>
                  </div>
                </div></div>
                <div className="col-lg-12 popupInner" style={{height:"60vh"}}>
                  <div className="main_div" position="fixed">
                    <PatientDetails
                      selected_services={this.props.selected_services}
                    />
                    <RequestDetails
                      selected_services={this.props.selected_services}
                    />
                    <ApprovalDetails
                      selected_services={this.props.selected_services}
                    />
                    <Attachments />
                  </div>
                  <div className="row" position="fixed">
                    <div className="col-lg-12">
                      <span className="float-left">
                        <button
                          className="htpl1-phase1-btn-others"
                          onClick={e => {
                            this.onClose(e);
                          }}
                        >
                          <AlgaehLabel label={{ fieldName: "btnclose" }} />
                        </button>
                      </span>

                      <span className="float-right">
                        <button
                          style={{ marginRight: "15px" }}
                          className="htpl1-phase1-btn-primary"
                          onClick={UpdatePreApproval.bind(this, this)}
                        >
                          <AlgaehLabel label={{ fieldName: "btnupdate" }} />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className=" popupFooter">
                <div className="col-lg-12">
                <div className="row">
                <div className="col-lg-12">
                <button className="btn btn-default"><label className="style_Label ">Close</label></button>
                </div>
                </div>
                </div>
                </div>
                
              </MyContext.Provider>
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}
