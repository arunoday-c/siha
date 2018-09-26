import React, { Component } from "react";
import AddConsultationForm from "./AddConsultationForm.js";
import styles from "./ConsultationForm.css";

export default class ConsultationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitcode: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visitcode: nextProps.visitcode
    });
  }

  render() {
    return (
      <div className="hptl-phase1-patient-ar-form">
        <AddConsultationForm PatRegIOputs={this.props.PatRegIOputs} />
      </div>
    );
  }
}
