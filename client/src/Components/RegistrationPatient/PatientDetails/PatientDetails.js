import React, { Component } from "react";
import PatientForm from "./PatientForm/PatientForm.js";
import OtherInfo from "./OtherInfo/OtherInfo.js";
import style from "./../../../styles/site.css";
import styles from "./PatientDetails.css";
import TextField from 'material-ui/TextField';
import extend from 'extend';
import { postPatientDetails, getPatientDetails } from "../../../actions/RegistrationPatient/Registrationactions.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from 'moment';

var intervalId;

class PatientDetails extends Component{
	constructor(props){
		super(props);		
		
		this.state = {
			actionPatientDesign: true,
			actionInformationDesign: true
		};
	}

	openTab(dataValue){
		if(dataValue === "patient-details"){
			this.setState({
				actionPatientDesign: true,
				actionInformationDesign: true
			})
		} else if(dataValue === "other-information"){
			this.setState({
				actionInformationDesign: false,
				actionPatientDesign: false
			})
		}
	}
	texthandle(e){		
		this.setState({
			[e.target.name]: e.target.value
		});		
	}

	patcodehandle(e) {
		this.setState(
		  {
			patient_code: e.target.value
		  },
		  () => {
			clearInterval(intervalId);
			intervalId = setInterval(()=> {
			  this.getSinglePatientDetails(e);
			  clearInterval(intervalId);
			} , 500);
		  }
		);
	}

	// componentWillReceiveProps(nextProps){
	// 	debugger;
	// 	if(nextProps.patCode !== null)
	// 	{
	// 		this.setState({...this.state,nextProps})
	// 	}
	// }

	render() {
		let patientSelect = (this.state.actionPatientDesign) ? "active" : "";
		let informationSelect = (this.state.actionInformationDesign) ? "" : "active";
		return (	
			<div className="hptl-phase1-patient-details">
				
				{/* <div className="row">
					<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
						<label>PATIENT CODE</label><br />
						< TextField className="text_field" name="patient_code" 
							onChange={this.patcodehandle.bind(this)} 
							value={this.state.patient_code}						
						/>
					</div>

					<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
						<label>REGESTRATION DATE</label><br />
						< TextField className="text_field" name="registration_date" 							
							value={this.state.registration_date}							
							type="date"
							disabled = {true}
						/>
					</div>
				</div> */}
				<div className="tab-container toggle-section">
					<ul className="nav">
						<li className={"nav-item tab-button " + patientSelect} 
							id="PatientForm" onClick={this.openTab.bind(this, "patient-details")}>
							PATIENT DETAILS
						</li>
						<li className={"nav-item tab-button " + informationSelect} 
							id="OtherInfo" onClick={this.openTab.bind(this, "other-information")}>
							OTHER INFORMATION
						</li>
					</ul>
				</div>
				<div className="patient-section">					
					{(this.state.actionPatientDesign)?
						<PatientForm PatRegIOputs={this.props.PatRegIOputs}/>:
						null}
					{(this.state.actionInformationDesign)?
						null:
						<OtherInfo PatRegIOputs={this.props.PatRegIOputs}/>}					
				</div>
			</div>		

		);
	}
}



function mapStateToProps(state) {
	return {
		patients: state.patients.patients
	};
  }
  
  function mapDispatchToProps(dispatch) {
	return bindActionCreators({ postPatientDetails: postPatientDetails, getPatientDetails: getPatientDetails }, dispatch);
  }
  
  export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(PatientDetails)
  );
  