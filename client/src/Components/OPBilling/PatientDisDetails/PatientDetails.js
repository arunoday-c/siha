import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AlgaehActions } from '../../../actions/algaehActions';
import './PatientDetails.css';
import { AlgaehLabel, AlagehAutoComplete } from '../../Wrapper/algaehWrapper';
import MyContext from '../../../utils/MyContext.js';
import { PatientSearch, selectVisit } from './DisPatientHandlers';

import moment from 'moment';
class DisPatientForm extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount() {
		let InputOutput = this.props.BillingIOputs;
		this.setState({ ...this.state, ...InputOutput });
	}

	componentDidMount() {
		if (this.props.patienttype === undefined || this.props.patienttype.length === 0) {
			this.props.getPatientType({
				uri: '/patientType/getPatientType',
				module: 'masterSettings',
				method: 'GET',
				redux: {
					type: 'PATIENT_TYPE_GET_DATA',
					mappingName: 'patienttype'
				}
			});
		}

		if (this.props.deptanddoctors === undefined || this.props.deptanddoctors.length === 0) {
			this.props.getDepartmentsandDoctors({
				uri: '/department/get/get_All_Doctors_DepartmentWise',
				module: 'masterSettings',
				method: 'GET',
				redux: {
					type: 'DEPT_DOCTOR_GET_DATA',
					mappingName: 'deptanddoctors'
				}
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.BillingIOputs);
	}

	render() {
		return (
			<React.Fragment>
				<MyContext.Consumer>
					{(context) => (
						<div className="hptl-phase1-display-patient-form">
							<div className="row inner-top-search" style={{ paddingTop: 10, paddingBottom: 10 }}>
								{/* Patient code */}
								<div className="col-lg-3">
									<div
										className="row"
										style={{
											border: ' 1px solid #ced4d9',
											borderRadius: 5,
											marginLeft: 0,
											height: 50
										}}
									>
										<div className="col">
											<AlgaehLabel label={{ fieldName: 'patient_code' }} />
											<h6>{this.state.patient_code ? this.state.patient_code : '----------'}</h6>
										</div>
										<div className="col-lg-3" style={{ borderLeft: '1px solid #ced4d8' }}>
											<i
												className="fas fa-search fa-lg"
												style={{
													paddingTop: 17,
													paddingLeft: 3,
													cursor: 'pointer',
													pointerEvents:
														this.state.Billexists === true
															? 'none'
															: this.state.patient_code ? 'none' : ''
												}}
												onClick={PatientSearch.bind(this, this, context)}
											/>
										</div>
									</div>
								</div>
								<div className="col-lg-9">
									<div className="row">
										<AlagehAutoComplete
											div={{ className: 'col' }}
											label={{
												fieldName: 'select_visit',
												isImp: true
											}}
											selector={{
												name: 'visit_id',
												className: 'select-fld',
												autoComplete: 'off',
												value: this.state.visit_id,
												dataSource: {
													textField: 'visit_code',
													valueField: 'hims_f_patient_visit_id',
													data: this.state.visitDetails
												},
												others: { disabled: this.state.Billexists },
												onChange: selectVisit.bind(this, this, context),
												template: (item) => (
													<div className="multiInfoList">
														<h5>
															{item.visit_date ? (
																moment(item.visit_date).format('DD/MM/YYYY, hh:mm A')
															) : (
																'DD/MM/YYYY'
															)}
														</h5>
														<h6>{item.visit_code}</h6>
														<p>{item.full_name}</p>
														<p>{item.sub_department_name}</p>
													</div>
												)
											}}
										/>
										<div className="col">
											<AlgaehLabel
												label={{
													fieldName: 'full_name'
												}}
											/>
											<h6>{this.state.full_name ? this.state.full_name : '--------'}</h6>
										</div>

										<div className="col">
											<AlgaehLabel
												label={{
													fieldName: 'patient_type'
												}}
											/>
											<h6>{this.state.patient_type ? this.state.patient_type : '--------'}</h6>
										</div>

										<div className="col">
											<AlgaehLabel
												label={{
													fieldName: 'mode_of_pay'
												}}
											/>
											<h6>{this.state.mode_of_pay ? this.state.mode_of_pay : '--------'}</h6>
										</div>

										{this.state.Billexists === true ? (
											<div className="col">
												<AlgaehLabel label={{ forceLabel: 'Bill Status' }} />
												{this.state.cancelled === 'Y' ? (
													<h6 style={{ color: 'red' }}> Cancelled </h6>
												) : this.state.balance_credit > 0 ? (
													<h6 style={{ color: 'red' }}> Not Settled </h6>
												) : (
													<h6 style={{ color: 'green' }}> Settled </h6>
												)}
											</div>
										) : null}
									</div>
								</div>
							</div>
						</div>
					)}
				</MyContext.Consumer>
			</React.Fragment>
		);
	}
}

function mapStateToProps(state) {
	return {
		patienttype: state.patienttype,
		deptanddoctors: state.deptanddoctors,
		existinsurance: state.existinsurance
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getPatientType: AlgaehActions,
			getDepartmentsandDoctors: AlgaehActions,
			getPatientInsurance: AlgaehActions
		},
		dispatch
	);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DisPatientForm));
