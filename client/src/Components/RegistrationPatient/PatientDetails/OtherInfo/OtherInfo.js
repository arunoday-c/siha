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
import AlagehFormGroup from "../../../Wrapper/formGroup.js";
import AlgaehLabel from "../../../Wrapper/label.js";
import AlgaehSelector from "../../../Wrapper/selector.js";


const FORMAT_DEFAULT = [
    { name: 'CSV', value: "CSV" },
    { name: 'XML', value: "XML" },
    { name: 'XLS', value: "XLS" }
];
const MobileFormat = "+91 (###)-## #####";
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
		if (this.props.visatypes.length === 0) {
			this.props.getVisatypes();
		}
		this.setState({...this.state});
	}

	componentWillReceiveProps(nextProps){    

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
								<AlagehFormGroup
									div={{ className: "col-lg-3" , id:"widthDate"}}
									label={{
										fieldName: "secondary_contact_number",
									}}
									textBox={{
									value: this.state.secondary_contact_number,
									className: "txt-fld",
									name: "secondary_contact_number",
									mask: {
										format:MobileFormat,
									},
									events: {
										onChange: AddPatientOtherHandlers(this, context).numbertexthandle.bind(this)
									}                            
									}}									
								/>								
								
								<AlagehFormGroup
									div={{ className: "col-lg-3" , id:"widthDate"}}
									label={{
										fieldName: "emergency_contact_number"
									}}
									textBox={{
									value: this.state.emergency_contact_number,
									className: "txt-fld",
									name: "emergency_contact_number",
									mask: {
										format:MobileFormat,
									},
									events: {
										onChange: AddPatientOtherHandlers(this, context).numbertexthandle.bind(this)
									}                            
									}}								
								/>

								<AlagehFormGroup
									div={{ className: "col-lg-3" , id:"widthDate"}}
									label={{
										fieldName: "emergency_contact_name",
									}}
									textBox={{
										value: this.state.emergency_contact_name,
										className: "txt-fld",
										name: "emergency_contact_name",										
										events: {
											onChange: AddPatientOtherHandlers(this, context).texthandle.bind(this)
										}
									}}								
								/>

								<AlagehFormGroup
									div={{ className: "col-lg-3" , id:"widthDate"}}
									label={{
										fieldName: "relationship_with_patient",
									}}
									textBox={{
									value: this.state.relationship_with_patient,
									className: "txt-fld",
									name: "relationship_with_patient",									
									events: {
										onChange: AddPatientOtherHandlers(this, context).texthandle.bind(this)
									}                            
									}}									
								/>								
							</div>
							<div className = "row">
								<AlagehFormGroup
									div={{ className: "col-lg-3" , id:"widthDate"}}
									label={{
										fieldName: "email",
									}}
									textBox={{
									value: this.state.email,
									className: "txt-fld",
									name: "email",									
									events: {
										onChange: AddPatientOtherHandlers(this, context).texthandle.bind(this)
									}                            
									}}								
								/>

								<AlgaehSelector
									div={{ className: "col-lg-3" }}
									label={{
										fieldName: "visa_type_id",
									}}
									selector={{
									name: "visa_type_id",
									className: "select-fld",
									value: "0",
									dataSource: {
										textField: "visa_desc",
										valueField: "hims_d_visa_type_id",
										data: this.props.visatypes
									},									
									onChange: AddPatientOtherHandlers(
										this,
										context
									).selectedHandeler.bind(this)
									}}
								/>																
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

	return{
		handle:(val)=>{

			state.setState({
				value: val
			})		
		},

		numbertexthandle: (ctrl, e)=>  {
          
            state.setState({
                [e.target.name]: e.target.value
            });

            if(context!=null){
                context.updateState({[e.target.name]: e.target.value});
            }            
        },

		
		texthandle:(e)=>{

			state.setState({
				[e.target.name]: e.target.value
			});
	
			if(context!=null){
				context.updateState({[e.target.name]: e.target.value});
			}   
		},

		selectedHandeler:(e)=>{
        
            state.setState({
                [e.name]: e.value
            });            
            if(context!=null){
                context.updateState({[e.name]: e.value});
            }   
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