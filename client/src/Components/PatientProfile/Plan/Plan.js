import React, { Component } from "react";
import "./plan.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import DietAdvice from "./DietAdvice/DietAdvice";
import Referal from "./Referal/Referal";
import FollowUp from "./FollowUp/FollowUp";
import OrderMedication from "./OrderMedication/OrderMedication";
import ActiveMedication from "./ActiveMedication/ActiveMedication";
import MedicationHistory from "./MedicationHistory/MedicationHistory";
import OwnMedication from "./OwnMedication/OwnMedication";

class Plan extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "OrderMedication", sidBarOpen: true };
  }

  openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var specified = e.currentTarget.getAttribute("algaehtabs");
    this.setState({
      pageDisplay: specified
    });
  }

  textHandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onClose = e => {
    this.setState({ pageDisplay: "OrderMedication" }, () => {
      this.props.onClose && this.props.onClose(e);
    });
  };

  render() {
    return (
      <div className="plan">
        <div className="row">
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title="Medication"
            openPopup={this.props.openMedication}
          >
          <div className="col tab-container toggle-section toggleBorder">
            <ul className="nav">
              <li
                algaehtabs={"OrderMedication"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Order Medication"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"ActiveMedication"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Active Medication"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"MedicationHistory"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Medication History"
                    }}
                  />
                }
              </li>
              {/* <li
                algaehtabs={"OwnMedication"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Own Medication"
                    }}
                  />
                }
              </li> */}
            </ul>
          </div>

                {/*  {<this.state.pageDisplay />} */}
              

                {this.state.pageDisplay === "OrderMedication" ? (
                  <OrderMedication vat_applicable={this.props.vat_applicable} 
                  onclosePopup={(e)=>{
                    this.setState({ pageDisplay: "OrderMedication" }, () => {
                      this.props.onClose && this.props.onClose(e);
                    });
                    
                  }} />
                ) : this.state.pageDisplay === "ActiveMedication" ? (
                  <ActiveMedication onclosePopup={(e)=>{
                    this.setState({ pageDisplay: "OrderMedication" }, () => {
                      this.props.onClose && this.props.onClose(e);
                    });
                    
                  }}/>
                ) : this.state.pageDisplay === "MedicationHistory" ? (
                  <MedicationHistory onclosePopup={(e)=>{
                    this.setState({ pageDisplay: "OrderMedication" }, () => {
                      this.props.onClose && this.props.onClose(e);
                    });
                    
                  }}/>
                ) : null}
          </AlgaehModalPopUp>
          <div className="col-lg-6">
            {/* BEGIN Portlet PORTLET */}
            {/* <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Follow Up</h3>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <FollowUp />
                  </div>
                </div> */}
            {/* END Portlet PORTLET */}
          </div>
          <div className="col-lg-6">
            {/* BEGIN Portlet PORTLET */}
            {/* <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Refer To</h3>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <Referal />
                  </div>
                </div> */}
            {/* END Portlet PORTLET */}
          </div>
        </div>

        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Other Details"
          openPopup={this.props.openMedicaldata}
        >
          <div className="popupInner">
            <div className="popRightDiv">
              <div className="row">
                <div className="col-6">
                  {" "}
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Follow Up</h3>
                      </div>
                    </div>
                    <div className="portlet-body">
                      <FollowUp />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  {" "}
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Refer To</h3>
                      </div>
                    </div>
                    <div className="portlet-body">
                      <Referal />
                    </div>
                  </div>{" "}
                </div>
              </div>
            </div>

            {/* <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Patient Alert</h3>
                </div>
                <div className="actions">
                  <a
                    // href="javascript"
                    className="btn btn-primary btn-circle active"
                  >
                    <i className="fas fa-plus" />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <input type="checkbox" value="Front Desk" />
                    <span>Front Desk</span>
                  </label>
                  <label className="checkbox inline">
                    <input type="checkbox" value="Doctor" />
                    <span>Doctor</span>
                  </label>
                  <label className="checkbox inline">
                    <input type="checkbox" value="Nurse" />
                    <span>Nurse</span>
                  </label>
                  <label className="checkbox inline">
                    <input type="checkbox" value="Physician" />
                    <span>Physician</span>
                  </label>
                </div>
                <div className="row" />
              </div>
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "alert_messgae",
                    value: this.state.alert_messgae,
                    others: {
                      multiline: true,
                      rows: "6"
                    },
                    events: {
                      onChange: this.textHandle.bind(this)
                    }
                  }}
                />
              </div>
            </div> */}

            <div className="popupFooter">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={e => {
                    this.onClose(e);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>

        <AlgaehModalPopUp
          events={{
            //onClose: this.onClose.bind(this)
            onClose: () => {
              this.props.onClose();
            }
          }}
          title="Diet Plan"
          openPopup={this.props.openDiet}
        >
          <div className="popupInner">
            <div className="popRightDiv">
              <DietAdvice />
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-default"
                onClick={e => {
                  this.onClose(e);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </AlgaehModalPopUp>

        <div className="col-lg-4">
          <div className="row">
            <div className="col-lg-12">
              {/* BEGIN Portlet PORTLET */}
              {/* <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Diet Advice</h3>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <DietAdvice />
                  </div>
                </div> */}
              {/* END Portlet PORTLET */}
            </div>

            <div className="col-lg-12">
              {/* BEGIN Portlet PORTLET */}
              {/* <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Patient Alert</h3>
                    </div>
                    <div className="actions">
                      <a
                        // href="javascript"
                        className="btn btn-primary btn-circle active"
                      >
                        <i className="fas fa-plus" />
                      </a>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input type="checkbox" value="Front Desk" />
                        <span>Front Desk</span>
                      </label>
                      <label className="checkbox inline">
                        <input type="checkbox" value="Doctor" />
                        <span>Doctor</span>
                      </label>
                      <label className="checkbox inline">
                        <input type="checkbox" value="Nurse" />
                        <span>Nurse</span>
                      </label>
                      <label className="checkbox inline">
                        <input type="checkbox" value="Physician" />
                        <span>Physician</span>
                      </label>
                    </div>
                    <div className="row">

                    </div>
                  </div>
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "alert_messgae",
                        value: this.state.alert_messgae,
                        others: {
                          multiline: true,
                          rows: "6"
                        },
                        events: {
                          onChange: this.textHandle.bind(this)
                        }
                      }}
                    />
                  </div>
                </div> */}
              {/* END Portlet PORTLET */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Plan;
