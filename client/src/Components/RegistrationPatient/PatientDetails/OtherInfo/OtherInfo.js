import React, { Component } from "react";
import styles from "./OtherInfo.css";
import SelectFieldDrop from "../../../common/Inputs/SelectField.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SelectFiledData } from "../../../../utils/algaehApiCall.js";
import TextField from 'material-ui/TextField';
import { postPatientDetails } from "../../../../actions/RegistrationPatient/Registrationactions.js";
import MyContext from "../../../../utils/MyContext.js";
import frontLanguage from "../../Language.json";
import PatRegIOputs from "../../../../Models/RegistrationPatient.js";
import { getVisatypes } from "../../../../actions/CommonSetup/Visatype.js";

const FORMAT_DEFAULT = [
    { name: 'CSV', value: "CSV" },
    { name: 'XML', value: "XML" },
    { name: 'XLS', value: "XLS" }
];

class OtherInfo extends Component{
		constructor(props){
		super(props);	
		
		let InputOutput = this.props.PatRegIOputs;

		if(this.props.patients.length > 0){
			InputOutput = PatRegIOputs.inputParam(this.props.patients[0]);
    	}

		this.state = InputOutput;
	}
	
	componentDidMount(){
		debugger;
		if (this.props.visatypes.length === 0) {
			this.props.getVisatypes();
		}
	}

	componentWillReceiveProps(nextProps){    
		debugger;
		if(nextProps.patients.length >0 )
		{
		  this.setState(PatRegIOputs.inputParam(nextProps.patients[0]));
		}		  
	}

	render() {
		return (
			<MyContext.Consumer>
				{context => (
					<div className="hptl-phase1-add-other-form">
						<div className="container-fluid">
							<div className="row">
								<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
									<label>Secondary Contact Number<mark>*</mark></label><br />
									<TextField className="text_field" 
										name="secondary_contact_number" 
										onChange={AddPatientOtherHandlers(this, context).texthandle.bind(this)} 
										value={this.state.secondary_contact_number}
										style={{width:"100%"}}
									/>							
								</div>

								<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
									<label>EMERG.CONTACT NO<mark>*</mark></label><br />
									<TextField className="text_field" 
										name="emergency_contact_number" 
										onChange={AddPatientOtherHandlers(this, context).texthandle.bind(this)} 
										value={this.state.emergency_contact_number}
										style={{width:"100%"}}
									/>
								</div>

								<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
									<label>EMERG.CONTACT PERSON<mark>*</mark></label><br />
									<TextField className="text_field" 
										name="emergency_contact_name" 
										onChange={AddPatientOtherHandlers(this, context).texthandle.bind(this)} 
										value={this.state.emergency_contact_name}
										style={{width:"100%"}}
									/>
								</div>
								<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
									<label>RELATION WITH PATIENT<mark>*</mark></label><br />
									<TextField className="text_field" 
										name="relationship_with_patient" 
										onChange={AddPatientOtherHandlers(this, context).texthandle.bind(this)} 
										value={this.state.relationship_with_patient}
										style={{width:"100%"}}
									/>
								</div>
							</div>
							<div className = "row">
								<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
									<label>EMAIL ADDRESS</label>
									<br />
									<TextField
									className="text_field"
									name="email"
									onChange={AddPatientOtherHandlers(this, context).texthandle.bind(this)}
									value={this.state.email}
									/>
								</div>

								<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
									<label>VISA TYPE</label>
									<br />
									<SelectFieldDrop
									children={SelectFiledData({
										textField: "visa_desc",
										valueField: "hims_d_visa_type_id",
										payload: this.props.visatypes
									})}
									selected={AddPatientOtherHandlers(this, context).visatyphandle.bind(
										this
									)}
									displayValue={this.state.visa_type_id}
									width="180px"
									/>
								</div>
							</div>
							<br />							
						</div>
					</div>		
				)}
			</MyContext.Consumer>	
		);
	}
}

function AddPatientOtherHandlers(state,context){
	context = context || null;
	debugger;
	return{
		handle:(val)=>{
			debugger;
			state.setState({
				value: val
			})		
		},

	
		texthandle:(e)=>{
			debugger;
			state.setState({
				[e.target.name]: e.target.value
			});
	
			if(context!=null){
				context.updateState({[e.target.name]: e.target.value});
			}   
		},

		visatyphandle: (selectval)=>{
			state.setState({
				visa_type_id: selectval
			}, () =>{
				if(context!=null){
					context.updateState({"visa_type_id": selectval});
				}
			});
		}
	}
}

function mapStateToProps(state) {    
    return {
		patients: state.patients.patients,
		visatypes: state.visatypes.visatypes,
    };  
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({postPatientDetails: postPatientDetails, getVisatypes: getVisatypes}, dispatch);
}
  
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(OtherInfo)
);