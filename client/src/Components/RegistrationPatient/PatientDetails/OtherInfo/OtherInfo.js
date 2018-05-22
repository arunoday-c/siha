import React, { Component } from "react";
import styles from "./OtherInfo.css";
import SelectFieldDrop from "../../../common/Inputs/SelectField.js";
//import TextFieldData from "../common/TextField.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import { getCities } from "../../../../actions/Masters/City.js";
// import { getCountries } from "../../../../actions/Masters/Country.js";
// import { getStates } from "../../../../actions/Masters/State.js";
import { SelectFiledData } from "../../../../utils/algaehApiCall.js";
//import PatRegIOputs from "../../../../Models/RegistrationPatient/PatientForm.js";
import TextField from 'material-ui/TextField';

const FORMAT_DEFAULT = [
    { name: 'CSV', value: "CSV" },
    { name: 'XML', value: "XML" },
    { name: 'XLS', value: "XLS" }
];

export default class OtherInfo extends Component{
		constructor(props){
		super(props);
		let dataExists = window.localStorage.getItem("Patient Details");
		let InputOutput = this.props.PatRegIOputs;

		if(dataExists!=null && dataExists!=""){
			InputOutput = JSON.parse(dataExists);
		}

		this.state = InputOutput;
	}

	handle(val){
		debugger;
		this.setState({
			value: val
		})
		console.log("Pat Title", val);
	}

	componentWillUpdate(nextProps, nextState){		
		//Others
		localStorage.setItem('Patient Details', JSON.stringify(this.state));
	}

	componentDidMount(){		
		// this.props.getCities();
        // this.props.getCountries();
        // this.props.getStates();	
	}
	
	texthandle(e){
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	render() {
		return (
			<div className="hptl-phase1-add-other-form">
				<div className="container-fluid">
					<div className="row">
						<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
							<label>Secondary Contact Number<mark>*</mark></label><br />
							<TextField className="text_field" 
								name="secondary_contact_number" 
								onChange={this.texthandle.bind(this)} 
								value={this.state.secondary_contact_number}
								style={{width:"100%"}}
							/>							
						</div>

						<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
							<label>EMERG.CONTACT NO<mark>*</mark></label><br />
							<TextField className="text_field" 
								name="emergency_contact_number" 
								onChange={this.texthandle.bind(this)} 
								value={this.state.emergency_contact_number}
								style={{width:"100%"}}
							/>
						</div>

						<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
							<label>EMERG.CONTACT PERSON<mark>*</mark></label><br />
							<TextField className="text_field" 
								name="emergency_contact_name" 
								onChange={this.texthandle.bind(this)} 
								value={this.state.emergency_contact_name}
								style={{width:"100%"}}
							/>
						</div>
						<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
							<label>RELATION WITH PATIENT<mark>*</mark></label><br />
							<TextField className="text_field" 
								name="relationship_with_patient" 
								onChange={this.texthandle.bind(this)} 
								value={this.state.relationship_with_patient}
								style={{width:"100%"}}
							/>
						</div>
					</div>
					<br />							
				</div>
			</div>			
		);
	}
}


// function mapStateToProps(state) {
    
//     return {        
//         cities: state.cities.cities,
//         countries: state.countries.countries,
//         countrystates: state.countrystates.countrystates
//     };  
// }
  
// function mapDispatchToProps(dispatch) {

//     return bindActionCreators({getCities: getCities, 
//         getCountries: getCountries, getStates: getStates}, dispatch);

// }
  
// export default withRouter(
//     connect(mapStateToProps, mapDispatchToProps)(OtherInfo)
// );