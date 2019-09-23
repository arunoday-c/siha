import React, { Component } from "react";
import AddOPBillingForm from "./AddOPBillingForm.js";
import "./AddOPBillingForm.scss";

export default class BillingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="hptl-op-phase1-billing-form">
        <AddOPBillingForm />
      </div>
    );
  }
}
