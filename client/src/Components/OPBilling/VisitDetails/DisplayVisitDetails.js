import React, { Component } from "react";
import "./../../../styles/site.css";
import "./DisplayVisitDetails.css";
import DisplayVisitDetails from "./DisplayVisitDetails/DisplayVisitDetails";

export default class DisVisitDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="hptl-display-visit-details-frame margin-top-15">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li className={"nav-item tab-button active"}>
              <label className="style_Label ">Visit Details</label>
            </li>
          </ul>
        </div>
        <div className="visitdetails-section">
          <DisplayVisitDetails BillingIOputs={this.props.BillingIOputs} />
        </div>
      </div>
    );
  }
}
