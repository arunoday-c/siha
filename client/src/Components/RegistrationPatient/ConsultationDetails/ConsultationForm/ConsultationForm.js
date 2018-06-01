import React, { Component } from "react";
import AddConsultationForm from "./AddConsultationForm.js";
import styles from "./ConsultationForm.css";

export default class ConsultationForm extends Component{
		constructor(props){
		super(props);
		this.state = {
			visitcode:"",
		};
	}

	componentWillReceiveProps(nextProps){
		// debugger;
		console.log("Visit Code", nextProps.visitcode);
		this.setState({
			visitcode:nextProps.visitcode
		});
	}
	
	render() {
		return (
			<div className="hptl-phase1-patient-form">
				<AddConsultationForm PatRegIOputs={this.props.PatRegIOputs}/>
			</div>
		);
	}
}




