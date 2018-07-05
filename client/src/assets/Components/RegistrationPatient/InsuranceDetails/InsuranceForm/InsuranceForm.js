import React, { Component } from "react";
import AddInsuranceForm from "./AddInsuranceForm.js";
import styles from "./InsuranceForm.css";

export default class InsuranceForm extends Component{
		constructor(props){
		super(props);
		this.state = {

		};
	}

	render() {
		return (
			<div className="hptl-phase1-insurance-form">
				<AddInsuranceForm />
			</div>
		); 
	}
}