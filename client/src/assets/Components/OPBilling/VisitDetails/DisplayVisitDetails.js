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
      <div className="hptl-display-visit-details-frame">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li className={"nav-item tab-button active"}>Visit Details</li>
          </ul>
        </div>
        <div className="visitdetails-section">
          <DisplayVisitDetails BillingIOputs={this.props.BillingIOputs} />
        </div>
      </div>
    );
  }
}
