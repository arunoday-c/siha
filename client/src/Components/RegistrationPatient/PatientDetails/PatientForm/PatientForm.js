import React, { Component } from "react";
import AddPatientForm from "./AddPatientForm.js";
import "./PatientForm.css";

export default class PatientForm extends Component{
		constructor(props){
		super(props);
		// debugger;
		this.state = {

		};
	}
	render() {
		return (
			<div className="hptl-phase1-patient-form">
				<AddPatientForm PatRegIOputs={this.props.PatRegIOputs}/>				
			</div>
			
		);
	}
}