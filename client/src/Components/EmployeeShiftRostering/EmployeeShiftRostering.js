import React, { Component } from 'react';
import './EmployeeShiftRostering.css';
import {
	AlgaehDataGrid,
	AlgaehDateHandler,
	AlagehAutoComplete,
	AlagehFormGroup,
	AlgaehLabel
} from '../Wrapper/algaehWrapper';
export default class EmployeeShiftRostering extends Component {
	render() {
		return (
			<div className="EmpShiftRost_Screen">
				<div className="row  inner-top-search">
					<AlagehAutoComplete
						div={{ className: 'col form-group' }}
						label={{
							forceLabel: 'Year',
							isImp: false
						}}
						selector={{
							name: '',
							className: 'select-fld',
							dataSource: {},
							others: {}
						}}
					/>
					<AlagehAutoComplete
						div={{ className: 'col form-group' }}
						label={{
							forceLabel: 'Month',
							isImp: false
						}}
						selector={{
							name: '',
							className: 'select-fld',
							dataSource: {},
							others: {}
						}}
					/>
					<AlagehAutoComplete
						div={{ className: 'col form-group' }}
						label={{
							forceLabel: 'Rostering Group',
							isImp: false
						}}
						selector={{
							name: '',
							className: 'select-fld',
							dataSource: {},
							others: {}
						}}
					/>
					<AlagehAutoComplete
						div={{ className: 'col form-group' }}
						label={{
							forceLabel: 'Department',
							isImp: false
						}}
						selector={{
							name: '',
							className: 'select-fld',
							dataSource: {},
							others: {}
						}}
					/>

					<div className="col-3" style={{ marginTop: 10 }}>
						<div
							className="row"
							style={{
								border: ' 1px solid #ced4d9',
								borderRadius: 5,
								marginLeft: 0
							}}
						>
							<div className="col">
								<AlgaehLabel label={{ forceLabel: 'Select a Employee.' }} />
								<h6>----</h6>
							</div>
							<div className="col-lg-3" style={{ borderLeft: '1px solid #ced4d8' }}>
								<i
									className="fas fa-search fa-lg"
									style={{
										paddingTop: 17,
										paddingLeft: 3,
										cursor: 'pointer'
									}}
								/>
							</div>
						</div>
					</div>

					<div className="col form-group">
						<button style={{ marginTop: 21 }} className="btn btn-primary">
							Load
						</button>
						<button
							//  onClick={this.clearState.bind(this)}
							style={{ marginTop: 21, marginLeft: 5 }}
							className="btn btn-default"
						>
							Clear
						</button>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="portlet portlet-bordered margin-bottom-15">
							<div className="portlet-title">
								<div className="caption">
									<h3 className="caption-subject">Shift Roasting List</h3>
								</div>
								<div className="actions">
									<span style={{ background: "#3f9c62" }} className="legends">Weekly Off (WO)</span>
									<span style={{ background: "#3f789c" }} className="legends">Holiday (H)</span>
									<span style={{ background: "#879c3f" }} className="legends">Leave Authorized (LV)</span>
									<span style={{ background: "#9c7d3f" }} className="legends">Leave Applied (LA)</span></div>
							</div>
							<div className="portlet-body">
								<div className="col-12" id="shiftRosterTable">
									<div className="row">
										<table>
											<thead>
												<tr>
													<th>Employee Code</th>
													<th>Employee Name</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Fri 01/01</th>
													<th>Joining Date</th>
													<th>Exit Date</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
												<tr>
													<td>Emp 34754534</td>
													<td>Mr. Donald Broad - Regional Managing Director</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td style={{ background: "lightgray" }}>C1</td>
													<td />
													<td />
													<td />
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="portlet portlet-bordered margin-bottom-15">

							<div className="portlet-body">
								<div className="row">
									<div className="col">
										{/* <label>Calculation Method</label> */}
										<div className="customCheckbox">
											<label className="checkbox inline">
												<input
													type="checkbox"
													value=""
													name=""
												/>
												<span>Swap Employee</span>
											</label>
										</div>
									</div>

									<AlgaehDateHandler
										div={{ className: "col" }}
										label={{
											forceLabel: "Start date",
											isImp: false
										}}
										textBox={{
											className: "txt-fld",
											name: ""
										}}
										maxDate={new Date()}
										events={{}}
									/>

									<AlgaehDateHandler
										div={{ className: "col" }}
										label={{
											forceLabel: "To date",
											isImp: false
										}}
										textBox={{
											className: "txt-fld",
											name: ""
										}}
										maxDate={new Date()}
										events={{}}
									/>


									<div className="col-3" style={{ marginTop: 10 }}>
										<div
											className="row"
											style={{
												border: ' 1px solid #ced4d9',
												borderRadius: 5,
												marginLeft: 0,
												marginRight: 0
											}}
										>
											<div className="col">
												<AlgaehLabel label={{ forceLabel: 'Select From Employee.' }} />
												<h6>----</h6>
											</div>
											<div className="col-lg-3" style={{ borderLeft: '1px solid #ced4d8' }}>
												<i
													className="fas fa-search fa-lg"
													style={{
														paddingTop: 17,
														paddingLeft: 3,
														cursor: 'pointer'
													}}
												/>
											</div>
										</div>
									</div>

									<div className="col-3" style={{ marginTop: 10 }}>
										<div
											className="row"
											style={{
												border: ' 1px solid #ced4d9',
												borderRadius: 5,
												marginLeft: 0,
												marginRight: 0
											}}
										>
											<div className="col">
												<AlgaehLabel label={{ forceLabel: 'Select to Employee.' }} />
												<h6>----</h6>
											</div>
											<div className="col-lg-3" style={{ borderLeft: '1px solid #ced4d8' }}>
												<i
													className="fas fa-search fa-lg"
													style={{
														paddingTop: 17,
														paddingLeft: 3,
														cursor: 'pointer'
													}}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div></div></div>


			</div>
		);
	}
}
