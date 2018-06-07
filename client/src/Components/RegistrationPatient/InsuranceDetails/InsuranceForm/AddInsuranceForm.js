import React, { Component } from "react";
//import SelectFieldDrop from "../common/SelectField.js";
import SelectFieldDrop from "../../../common/Inputs/SelectField.js";
import TextField from 'material-ui/TextField';
import Dropzone from 'react-dropzone';
import "./InsuranceForm.css";
import "./../../../../styles/site.css";

const FORMAT_DEFAULT = [
    { name: 'CSV', value: 0 },
    { name: 'XML', value: 1 },
    { name: 'XLS', value: 2 }
];

const INSURANCE_DECISION = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' }
];

export default class AddInsuranceForm extends Component{
		constructor(props){
		super(props);
		this.state = {
			filePreview: ""
		};
	}

	handle(val){

	}

	onDrop(file){

		this.setState({
			filePreview: file[0].name
		})
	}

	selectedValueInsurance(){

	}

	render() {
		return (
			<div className="htpl-phase1-primary-insurance-form">
				<div className="container-fluid">
						<div className="row">
							<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 ">
								<label>INSURANCE<mark>*</mark></label><br />
							<div className="row">
								{INSURANCE_DECISION.map((data, idx) => {
									return (
										<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3" key={"index_value" + idx}>
											 <input type="radio" name="INSURANCE_DECISION"
	        		                            className="htpl-phase1-radio-btn"
	        		                            value={data.value}
	        		                            onChange={this.selectedValueInsurance.bind(this, data.value)}
	        		                            defaultChecked={(data.value === "No") ? true : false} 
											/>
										   <label className="radio-design">{data.label}</label>
		                        		</div>
									);
								})}
							  </div>
							</div>
							<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
								<label>INSURANCE COMPANY<mark>*</mark></label><br />
								<SelectFieldDrop
									children={FORMAT_DEFAULT}
									onChange={this.handle.bind(this)}
									width="200px"
								/>
							</div>
							<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
								<label>PLAN DESCRIPTION<mark>*</mark></label><br />
								<SelectFieldDrop
									children={FORMAT_DEFAULT}
									onChange={this.handle.bind(this)}
									width="200px"
								/>
							</div>
							<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
								<label>POLICY NO<mark>*</mark></label><br />
								<TextField />
							</div>
						</div>

						<div className="row">
							<div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
								<label>STRAT DATE<mark>*</mark></label><br />
								<TextField
									id="date"									
									type="date"									
								/>
							</div>
							<div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
								<label>END DATE<mark>*</mark></label><br />
								<TextField
									id="date"									
									type="date"									
								/>
							</div>
							<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
								<div className="image-drop-area refactor-design" style={{marginTop: "38px"}}>
									<Dropzone onDrop={this.onDrop.bind(this)} className="dropzone">
										<div>											
											<button className="htpl1-phase1-btn-primary"
											style={{float: "right" }}>BROWSE</button>
										</div>       
									</Dropzone>
									<label className="file-name-upload">{this.state.filePreview}</label>
								</div>
							</div>
							<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3" style={{marginTop: "38px"}}>
									<button className="htpl1-phase1-btn-primary"
                                        style={{float: "left"}}>ADD TO LIST</button>
							</div>
						</div>
						{/* <div className="row form-details">
							<table className="table table-bordered table-details">
							  <thead style={{background: "#b4e2df"}}>
							    <tr>
							     <th scope="col">ACTION</th>
							      <th scope="col">#</th>
							      <th scope="col">INSURANCE COMPANY</th>
							      <th scope="col">PLAN DESCRIPTION</th>
							      <th scope="col">POLICY NO</th>
							      <th scope="col">START DATE</th>
							      <th scope="col">EXP</th>
							    </tr>
							  </thead>
							  <tbody>
							    <tr>
							      <td>
							      	<span className="glyphicon glyphicon-trash" style={{paddingRight: "24px"}}></span>	
							      	<span className="glyphicon glyphicon-pencil"></span>
							      </td>
							      <td>Otto</td>
							      <td>@mdo</td>
							      <td>sample</td>
							      <td>Otto</td>
							      <td>@mdo</td>
							      <td>sample</td>
							    </tr>
							       <tr>
							      <td>
							      	<span className="glyphicon glyphicon-trash" style={{paddingRight: "24px"}}></span>	
							      	<span className="glyphicon glyphicon-pencil"></span>
							      </td>
							      <td>Otto</td>
							      <td>@mdo</td>
							      <td>sample</td>
							      <td>Otto</td>
							      <td>@mdo</td>
							      <td>sample</td>
							    </tr>
							  </tbody>
							</table>

						</div> */}
				</div>
			</div>
		);
	}
}