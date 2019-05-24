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
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";

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

  getPatientMedications() {
    algaehApiCall({
      uri: "/orderMedication/getPatientMedications",
      data: { patient_id: Window.global["current_patient"] },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          debugger;
          this.setState({
            latest_mediction: response.data.records.latest_mediction,
            all_mediction: response.data.records.all_mediction
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }
  componentDidMount() {
    this.getPatientMedications();
  }

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
              </ul>
            </div>

            {this.state.pageDisplay === "OrderMedication" ? (
              <OrderMedication
                vat_applicable={this.props.vat_applicable}
                onclosePopup={e => {
                  this.setState({ pageDisplay: "OrderMedication" }, () => {
                    this.props.onClose && this.props.onClose(e);
                  });
                }}
              />
            ) : this.state.pageDisplay === "ActiveMedication" ? (
              <ActiveMedication
                onclosePopup={e => {
                  this.setState({ pageDisplay: "OrderMedication" }, () => {
                    this.props.onClose && this.props.onClose(e);
                  });
                }}
                latest_mediction={this.state.latest_mediction}
              />
            ) : this.state.pageDisplay === "MedicationHistory" ? (
              <MedicationHistory
                onclosePopup={e => {
                  this.setState({ pageDisplay: "OrderMedication" }, () => {
                    this.props.onClose && this.props.onClose(e);
                  });
                }}
                all_mediction={this.state.all_mediction}
              />
            ) : null}
          </AlgaehModalPopUp>
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
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Refer To</h3>
                      </div>
                    </div>
                    <div className="portlet-body">
                      <Referal />
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
          class="dietPopupWidth"
          events={{
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
      </div>
    );
  }
}

export default Plan;
