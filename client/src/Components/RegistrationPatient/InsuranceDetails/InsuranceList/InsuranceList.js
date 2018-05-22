import React, { Component } from "react";
import Dropzone from 'react-dropzone';
import styles from "./InsuranceList.css";
import style from "./../../../../styles/site.css";

export default class InsuranceList extends Component{
		constructor(props){
		super(props);
		this.state = {
			filePreview: ""
		};
	}

	render() {
		return (
			<div className="htpl-phase1-primary-insurancelist-form secinsurance-section">
				<div className="container-fluid">											
					<div className="row form-details">
						<table className="table table-striped table-details table-hover">
							<thead style={{background: "#b4e2df"}}>
							<tr>
								<th scope="col">ACTION</th>
								<th scope="col">#</th>
								<th scope="col">INSURANCE COMPANY</th>
								<th scope="col">PLAN DESCRIPTION</th>
								<th scope="col">POLICY NO</th>
								<th scope="col">START DATE</th>
								<th scope="col">EXP DATE</th>
								<th scope="col">SEC. INSURANCE</th>
								<th scope="col">SEC. INSURANCE COMPANY</th>
								<th scope="col">SEC. PLAN DESCRIPTION</th>
								<th scope="col">SEC. POLICY NO</th>
								<th scope="col">SEC. START DATE</th>
								<th scope="col">SEC. EXP DATE</th>

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

								<td>YES</td>
								<td>sample</td>
								<td>Otto</td>
								<td>@mdo</td>
								<td>sample</td>
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
								<td>YES</td>
								<td>sample</td>
								<td>Otto</td>
								<td>@mdo</td>
								<td>sample</td>
								<td>sample</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}