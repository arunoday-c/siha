import React, { Component } from "react";
import AddReciptForm from "./AddReciptForm.js";
import styles from "./AddReciptForm.css";

export default class BillingForm extends Component{
		constructor(props){
		super(props);
		this.state = {

		};
	}

	render() {
		return (
			<div className="hptl-phase1-billing-form">
				<AddReciptForm />
			</div>
		);
	}
}