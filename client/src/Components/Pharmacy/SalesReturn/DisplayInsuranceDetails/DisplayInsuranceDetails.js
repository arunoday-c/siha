import React, { Component } from "react";
import PrimaryInsurance from "./PrimaryInsurance/DisInsuranceDetails.js";
// import SecondaryInsurance from "./SecondaryInsurance/DisplaySecondaryInsurance.js";
import "./DisplayInsuranceDetails.scss";
import "./../../../../styles/site.scss";
import { AlgaehModalPopUp } from "../../../Wrapper/algaehWrapper";

export default class DisplayInsuranceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <AlgaehModalPopUp
        events={{
          onClose: this.onClose.bind(this)
        }}
        title="Insurance Details"
        openPopup={this.props.show}
      >
        <div className="popupInner">
          <div className="col-12 popRightDiv">
            <PrimaryInsurance
              SALESRETURNIOputs={this.props.SALESRETURNIOputs}
            />
          </div>
        </div>

        <div className="popupFooter">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-4"> &nbsp;</div>
              <div className="col-lg-8">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={e => {
                    this.onClose(e);
                  }}
                >
                  <label className="style_Label ">Close</label>
                </button>
              </div>
            </div>
          </div>
        </div>
      </AlgaehModalPopUp>
    );
  }
}
