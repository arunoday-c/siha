import React, { Component } from "react";
import AddBillingForm from "./AddBillingForm.js";

export default class BillingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="hptl-phase1-billing-form">
        <AddBillingForm PatRegIOputs={this.props.PatRegIOputs} />
      </div>
    );
  }
}
