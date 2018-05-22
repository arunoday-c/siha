import React, { Component } from "react";
//import SelectFieldDrop from "../common/SelectField.js";
import SelectFieldDrop from "../../../common/Inputs/SelectField.js";
//import TextFieldData from "./common/TextField.js";
import TextField from 'material-ui/TextField';
import styles from "./ConsultationForm.css";
import style from "./../../../../styles/site.css";
import extend from 'extend';
import { getSubDepartments } from "../../../../actions/CommonSetup/Department.js";
import { getVisittypes } from "../../../../actions/CommonSetup/VisitTypeactions.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SelectFiledData } from "../../../../utils/algaehApiCall.js";

const FORMAT_DEFAULT = [
    { name: 'Mohammed', value: 1 },
    { name: 'Raheem', value: 2 },
    { name: 'Rahaman', value: 3 }
];
const MATERNITY_PATIENT = [
    { label: 'Yes', value: 'Y' },
    { label: 'No', value: 'N' }
];

class AddConsultationForm extends Component{
		constructor(props){
		super(props);
		let dataExists = window.localStorage.getItem("Patient Details");
		let InputOutput = this.props.PatRegIOputs;

		if(dataExists!=null && dataExists!=""){
			InputOutput = JSON.parse(dataExists);
		}
		this.state = extend({
			value: ""
		}, InputOutput);
	}

	handle(val){
		console.log("~~~~", val);
		this.setState({
			value: val
		})
	}

	componentWillUpdate(nextProps, nextState){				
		localStorage.setItem('Patient Details', JSON.stringify(this.state));
	}

	selectedValue(){

	}

	subdeptshandle(selectval){
		this.setState({
			sub_department_id: selectval
		});
	}

	visittypehandle(selectval){
		this.setState({
			visa_type_id: selectval
		});
	}

	componentDidMount() {
		this.props.getSubDepartments();
		this.props.getVisittypes();
	}

	componentWillReceiveProps(nextProps){
		debugger;
		console.log("Visit Code", nextProps.visitcode);
		this.setState({
			visit_code:nextProps.visitcode
		});
	}

	render() {
		return (
			<div className="hptl-phase1-add-consultation-form">
				<div className="container-fluid">
					<div className="row">

						<div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 primary-details">
							<div className="row primary-box-container">
								<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
									<label>VISIT ID<mark>*</mark></label><br />
									<TextField disabled={true} value={this.state.visit_code}/>
								</div>
								<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
									<label>VISIT TYPE<mark>*</mark></label><br />

									<SelectFieldDrop
										children={SelectFiledData({textField:"visit_type", 
										valueField:"hims_d_visit_type_id", payload:this.props.visittypes										
										})}										
										selected={this.visittypehandle.bind(this)}																				
									/>
								</div>								
							</div>
							<div className="row primary-box-container">
								<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
									<label>DEPARTMENT<mark>*</mark></label><br />
									<SelectFieldDrop
										children={SelectFiledData({textField:"sub_department_name", 
										valueField:"hims_d_sub_department_id", payload:this.props.subdepartments										
										})}										
										selected={this.subdeptshandle.bind(this)}										
									/>
								</div>
								<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
									<label>DOCTOR NAME<mark>*</mark></label><br />
									<SelectFieldDrop
										children={FORMAT_DEFAULT}
										onChange={this.handle.bind(this)}
										width="130px"
									/>
								</div>
								
							</div>
							<div className="row primary-box-container">
								<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
									<label>DATE OF CONSULT<mark>*</mark></label><br />
									<TextField type="date" disabled={true} value={this.state.visit_date}/>
								</div>
								<div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
									<label>MATERNITY PATIENT<mark>*</mark></label><br />
									<div className="row">
										{MATERNITY_PATIENT.map((data, idx) => {
											return (
												<div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4" key={"index_value" + idx}>
												 <input type="radio" name="MATERNITY_PATIENT"
			        		                            className="htpl-phase1-radio-btn"
			        		                            value={data.value}
			        		                            onChange={this.selectedValue.bind(this, data.value)}
			        		                            defaultChecked={(data.value === "N") ? true : false} />
			                                        <label className="radio-design">{data.label}</label>
				                        		</div>
											);
										})}
									</div>
								</div>								
							</div>
						</div>
						<div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 secondary-details">
							<table className="table table-striped table-details table-hover">
							  <thead style={{background: "#B4E2DF"}}>
							    <tr>
							      <th scope="col">#</th>
							      <th scope="col">VISIT CODE</th>
							      <th scope="col">VISIT DATE</th>
							      <th scope="col">VISIT TYPE</th>
							      <th scope="col">BILL NO.</th>
							      <th scope="col">DEPT. NAME</th>
							      <th scope="col">DEPT. CODE</th>
							      <th scope="col">IN-CHARGE NAME</th>
							    </tr>
							  </thead>
							  <tbody>
							  {/* {this.props.VisitDetails.map((row, index) => (
								<tr key={index}>
									<tr>{row.visit_date}</tr>
									<tr>{row.visit_type}</tr>
									<tr></tr>
									<tr>{row.sub_department_id}</tr>
									<tr>{row.sub_department_id}</tr>
									<tr>{row.sub_department_id}</tr>									
								</tr>
								))} */}
							  </tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


function mapStateToProps(state) {
    return {
		subdepartments: state.subdepartments.subdepartments,
		visittypes: state.visittypes.visittypes,
    };  
}
  
function mapDispatchToProps(dispatch) {
	return bindActionCreators({ getSubDepartments: getSubDepartments,getVisittypes: getVisittypes }, dispatch);
}
  
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AddConsultationForm)
);