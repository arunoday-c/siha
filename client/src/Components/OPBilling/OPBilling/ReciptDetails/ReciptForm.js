import React, { Component } from "react";
import AddReciptForm from "./AddReciptForm.js";
import styles from "./AddReciptForm.scss";

export default class ReciptForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="hptl-phase1-recipt-form">
        <AddReciptForm BillingIOputs={this.props.BillingIOputs} />
      </div>
    );
  }
}
