import React, { Component } from "react";
import styles from "./AddReciptForm.css";
//import SelectFieldDrop from "../../common/SelectField.js";
import SelectFieldDrop from "../../../common/Inputs/SelectField.js";
import TextFieldData from "../../common/TextField.js";


const FORMAT_DEFAULT = [
    { name: 'CSV', value: "CASH" },
    { name: 'XML', value: "CARD" },
    { name: 'XLS', value: 2 }
];

export default class AddReciptForm extends Component{
		constructor(props){
		super(props);
		this.state = {

		};
	}

	render() {
		return (
			<div className="hptl-phase1-add-recipts-form">
				<div className="container-fluid">
					<div className="row form-details">				

						<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
							<label>RECEIPT NUMBER<mark>*</mark></label><br />
							<TextFieldData disabled={true}/>
						</div>

						<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
							<label>COUNTER<mark>*</mark></label><br />
							<SelectFieldDrop
								children={FORMAT_DEFAULT}								
								width="130px"
							/>
						</div>

						<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
							<label>SHIFT<mark>*</mark></label><br />
							<SelectFieldDrop
								children={FORMAT_DEFAULT}								
								width="130px"
							/>
						</div>
					</div>
					<div className="row form-details">
						<div className="col table-responsive">
							<table className="table-striped table-details table-hover">
								<thead style={{background: "#b4e2df"}}>
									<tr>
									<th scope="col">ACTION</th>
										<th scope="col">#</th>
										<th scope="col">Mode Of Payment</th>
										<th scope="col">Card Number</th>
										<th scope="col">Expiry Date</th>
										<th scope="col">Currency Code</th>										
										<th scope="col">Amount</th>										
									</tr>
								</thead>

								<tbody>
									<tr>
										<td>
											<button className="htpl1-phase1-btn-primary">ADD</button>
										</td>
										<td></td>
										<td><SelectFieldDrop children={FORMAT_DEFAULT} width="130px"/></td>
										<td><TextFieldData/></td>										
										<td><TextFieldData type="date"/></td>
										<td><TextFieldData/></td>
										<td><TextFieldData/></td>

									</tr>							       
								</tbody>

								<tbody>
									<tr>
										<td>
											<span className="glyphicon glyphicon-trash" style={{paddingRight: "24px"}}></span>	
											<span className="glyphicon glyphicon-pencil"></span>
										</td>
										<td>1</td>
										<td>Otto</td>
										<td>@mdo</td>																				
										<td></td>
										<td>USD</td>
										<td>190.00</td>
									</tr>
										<tr>
										<td>
											<span className="glyphicon glyphicon-trash" style={{paddingRight: "24px"}}></span>	
											<span className="glyphicon glyphicon-pencil"></span>
										</td>
										<td>2</td>
										<td>Otto</td>
										<td>@mdo</td>																				
										<td></td>
										<td>USD</td>
										<td>200.00</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	}
}