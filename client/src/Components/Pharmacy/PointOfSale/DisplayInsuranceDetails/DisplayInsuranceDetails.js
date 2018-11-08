import React, { Component } from "react";
import PrimaryInsurance from "./PrimaryInsurance/DisInsuranceDetails.js";
import SecondaryInsurance from "./SecondaryInsurance/DisplaySecondaryInsurance.js";
import "./DisplayInsuranceDetails.css";
import "./../../../../styles/site.css";
import { Modal } from "../../../Wrapper/algaehWrapper";
export default class DisplayInsuranceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actionPrimaryDesign: true,
      actionSecondaryDesign: true
    };
  }

  componentDidMount() {
    debugger;
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <div>
        <Modal
          className="model-set"
          open={this.props.show}
          onClose={e => {
            this.onClose(e);
          }}
        >
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Insurance Details</h4>
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
              </div>
            </div>
            <div className="algaeh-modal">
              <PrimaryInsurance POSIOputs={this.props.POSIOputs} />
              <SecondaryInsurance POSIOputs={this.props.POSIOputs} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
