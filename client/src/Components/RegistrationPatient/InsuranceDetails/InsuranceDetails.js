import React, { Component } from "react";
import InsuranceForm from "./InsuranceForm/InsuranceForm.js";
import SecondaryInsurance from "./SecondaryInsurance/SecondaryInsurance.js";
import InsuranceList from "./InsuranceList/InsuranceList.js";
// import styles from "./InsuranceDetails.css";
// import style from "./../../../styles/site.css";

export default class InsuranceDetails extends Component{
	
	constructor(props){
		super(props);
		this.state = {
			actionPrimaryDesign: true,
			actionSecondaryDesign: true,
		};
	}

	openTab(dataValue){
		if(dataValue === "primary-insurance"){
			this.setState({
				actionPrimaryDesign: true,
				actionSecondaryDesign: true
			})
		} else if(dataValue === "secondary-insurance"){
			this.setState({
				actionSecondaryDesign: false,
				actionPrimaryDesign: false
			})
		}
	}

	render() {
		let primaryInsurance = (this.state.actionPrimaryDesign) ? "active" : "";
		let secondaryInsurance = (this.state.actionSecondaryDesign) ? "" : "active";
		return (
				<div className="hptl-phase1-insurance-details">
			
				<div className="tab-container toggle-section">
				<ul className="nav">
				  <li className={"nav-item tab-button " + primaryInsurance} onClick={this.openTab.bind(this, "primary-insurance")}>
				    PRIMARY INSURANCE DETAILS
				  </li>
				  <li className={"nav-item tab-button " + secondaryInsurance} onClick={this.openTab.bind(this, "secondary-insurance")}>
				    SECONDARY INSURANCE DETAILS
				  </li>
				</ul>
				</div>
	                <div className="insurance-section">
		                {(this.state.actionPrimaryDesign)?
		                <InsuranceForm />:
		                null}
		                {(this.state.actionSecondaryDesign)?
		                null:
		                <SecondaryInsurance />}
	                </div>
					<div>
						<InsuranceList />
					</div>
				</div>



		);
	}
}