import React, { Component } from "react";
import PrimaryInsurance from "./PrimaryInsurance/DisInsuranceDetails.js";
// import SecondaryInsurance from "./SecondaryInsurance/DisplaySecondaryInsurance.js";
import "./DisplayInsuranceDetails.css";
import "./../../../../styles/site.css";
import { AlgaehModalPopUp } from "../../../Wrapper/algaehWrapper";
export default class DisplayInsuranceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

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
            <PrimaryInsurance POSIOputs={this.props.POSIOputs} />
            {/* <h6
              style={{
                borderBottom: " 1px solid #d0d0d0",
                fontSize: "0.9rem",
                paddingBottom: 5
              }}
            >
              Secondary Insurance
            </h6>
            <SecondaryInsurance POSIOputs={this.props.POSIOputs} /> */}
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
