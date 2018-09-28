import React, { Component } from "react";
import VisitDetails from "./VisitDetails.js";
import "./DisplayVisitDetails.scss";

export default class VisitForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="hptl-display-visit-details">
        <VisitDetails BillingIOputs={this.props.BillingIOputs} />
      </div>
    );
  }
}
