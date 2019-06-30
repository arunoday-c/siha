import React, { Component } from 'react';
import PatientDetails from './PatientDetails/PatientDetails.js';

import './registration.css';
import PatRegIOputs from '../../Models/UpdatePatientDetails';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import BreadCrumb from '../common/BreadCrumb/BreadCrumb.js';
import MyContext from '../../utils/MyContext.js';
import { Validations } from './FrontdeskValidation.js';
import AlgaehLabel from '../Wrapper/label.js';

import { algaehApiCall, swalMessage, getCookie } from '../../utils/algaehApiCall.js';

import { imageToByteArray } from '../../utils/GlobalFunctions';
import { setGlobal } from '../../utils/GlobalFunctions';
import { AlgaehActions } from '../../actions/algaehActions';
import AlgaehReport from '../Wrapper/printReports';
import AlgaehLoader from '../Wrapper/fullPageLoader';
import moment from 'moment';
import Options from '../../Options.json';
import { ClearData, generateIdCard } from './UpdatePatientDetailsEvent';
import { SetBulkState } from '../../utils/GlobalFunctions';

class UpdatePatientDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			AdvanceOpen: false,
			RefundOpen: false,
			visittypeselect: true,
			clearEnable: false
		};
	}

	componentWillMount() {
		let IOputs = PatRegIOputs.inputParam();
		this.setState(IOputs);
		setGlobal({ selectedLang: 'en' });
	}

	componentDidMount() {
		let prevLang = getCookie('Language');
		setGlobal({ selectedLang: prevLang });

		let IOputs = PatRegIOputs.inputParam();
		IOputs.selectedLang = prevLang;
		this.setState(IOputs);
	}

	componentWillReceiveProps() {
		let prevLang = getCookie('Language');
		if (prevLang !== this.state.selectedLang) {
			setGlobal({ selectedLang: prevLang });
			let IOputs = PatRegIOputs.inputParam();

			IOputs.visittypeselect = true;
			IOputs.age = 0;
			IOputs.AGEMM = 0;
			IOputs.AGEDD = 0;
			IOputs.selectedLang = getCookie('Language');

			this.setState(IOputs);
		}
	}

	SavePatientDetails(e) {
		SetBulkState({
			state: this,
			callback: () => {
				const err = Validations(this);

				if (!err) {
					AlgaehLoader({ show: true });

					let patientdata = {};

					if (this.state.filePreview !== null) {
						patientdata = {
							...this.state,
							patient_Image: imageToByteArray(this.state.filePreview)
						};
					} else {
						patientdata = this.state;
					}
					const _patImage = this.state.patientImage;
					const _patientIdCard = this.state.patientIdCard;

					delete patientdata.patSecInsuranceFrontImg;
					delete patientdata.patientIdCard;
					delete patientdata.patInsuranceFrontImg;
					delete patientdata.patInsuranceBackImg;
					delete patientdata.patSecInsuranceBackImg;
					delete patientdata.patientImage;
					delete patientdata.countrystates;
					delete patientdata.cities;

					algaehApiCall({
						uri: '/patientRegistration/updatePatientData',
						module: 'frontDesk',
						data: patientdata,
						method: 'PUT',
						onSuccess: (response) => {
							// AlgaehLoader({ show: false });
							if (response.data.success) {
								let _arrayImages = [];
								if (_patImage !== undefined) {
									_arrayImages.push(
										new Promise((resolve, reject) => {
											_patImage.SavingImageOnServer(
												undefined,
												undefined,
												undefined,
												this.state.patient_code,
												() => {
													resolve();
												}
											);
										})
									);
								}
								if (_patientIdCard !== undefined) {
									_arrayImages.push(
										new Promise((resolve, reject) => {
											_patientIdCard.SavingImageOnServer(
												undefined,
												undefined,
												undefined,
												this.state.primary_id_no,
												() => {
													resolve();
												}
											);
										})
									);
								}

								Promise.all(_arrayImages).then((result) => {
									AlgaehLoader({ show: false });
									this.setState({
										bill_number: response.data.records.bill_number,
										receipt_number: response.data.records.receipt_number,
										saveEnable: true,
										insuranceYes: true,
										sec_insuranceYes: true,
										ProcessInsure: true
									});

									swalMessage({
										title: 'Done Successfully',
										type: 'success'
									});
								});
							}
						},
						onFailure: (error) => {
							AlgaehLoader({ show: false });
							swalMessage({
								title: error.message,
								type: 'error'
							});
						}
					});
				}
			}
		});
	}

	handleClose = () => {
		this.setState({ open: false });
	};

	getCtrlCode(patcode) {
		let $this = this;

		AlgaehLoader({ show: true });

		algaehApiCall({
			uri: '/frontDesk/get',
			module: 'frontDesk',
			method: 'GET',
			data: { patient_code: patcode },
			onSuccess: (response) => {
				if (response.data.success) {
					let data = response.data.records;

					//Appoinment End

					data.patientRegistration.filePreview = 'data:image/png;base64, ' + data.patient_Image;
					data.patientRegistration.arabic_name = data.patientRegistration.arabic_name || 'No Name';

					data.patientRegistration.date_of_birth = moment(data.patientRegistration.date_of_birth)._d;
					data.patientRegistration.saveEnable = false;
					delete data.visitDetails;
					$this.setState(data.patientRegistration);
				}
				AlgaehLoader({ show: false });
			},
			onFailure: (error) => {
				AlgaehLoader({ show: false });
				swalMessage({
					title: error.message,
					type: 'error'
				});
			}
		});
	}

	//Render Page Start Here

	render() {
		return (
			<div id="attach" style={{ marginBottom: '50px' }}>
				{/* <Barcode value='PAT-A-000017'/> */}
				<BreadCrumb
					title={<AlgaehLabel label={{ fieldName: 'form_patregister', align: 'ltr' }} />}
					breadStyle={this.props.breadStyle}
					//breadWidth={this.props.breadWidth}
					pageNavPath={[
						{
							pageName: (
								<AlgaehLabel
									label={{
										fieldName: 'form_home',
										align: 'ltr'
									}}
								/>
							)
						},
						{
							pageName: <AlgaehLabel label={{ fieldName: 'form_name', align: 'ltr' }} />
						}
					]}
					soptlightSearch={{
						label: <AlgaehLabel label={{ fieldName: 'patient_code', returnText: true }} />,
						value: this.state.patient_code,
						selectValue: 'patient_code',
						events: {
							onChange: this.getCtrlCode.bind(this)
						},
						jsonFile: {
							fileName: 'spotlightSearch',
							fieldName: 'frontDesk.patients'
						},
						searchName: 'patients'
					}}
					userArea={
						<div className="row">
							<div className="col">
								<AlgaehLabel
									label={{
										fieldName: 'registered_date'
									}}
								/>
								<h6>
									{this.state.registration_date ? (
										moment(this.state.registration_date).format(Options.dateFormat)
									) : (
										Options.dateFormat
									)}
								</h6>
							</div>
						</div>
					}
					printArea={{
						menuitems: [
							// {
							//   label: "Print Bar Code",
							//   events: {
							//     onClick: () => {
							//       AlgaehReport({
							//         report: {
							//           fileName: "patientRegistrationBarcode",
							//           barcode: {
							//             parameter: "patient_code",
							//             options: {
							//               format: "",
							//               lineColor: "#0aa",
							//               width: 4,
							//               height: 40
							//             }
							//           }
							//         },
							//         data: {
							//           patient_code: this.state.patient_code
							//         }
							//       });
							//     }
							//   }
							// }
							{
								label: 'ID Card',
								events: {
									onClick: () => {
										generateIdCard(this, this);
									}
								}
							}
						]
					}}
					selectedLang={this.state.selectedLang}
				/>
				<div className="spacing-push">
					<MyContext.Provider
						value={{
							state: this.state,
							updateState: (obj) => {
								this.setState({ ...obj });
							}
						}}
					>
						<div className="row">
							<div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-8">
								<PatientDetails PatRegIOputs={this.state} clearData={this.state.clearData} />
							</div>
						</div>
						<div className="hptl-phase1-footer">
							<div className="row">
								<div className="col-lg-12">
									<button
										type="button"
										className="btn btn-primary"
										onClick={this.SavePatientDetails.bind(this)}
										disabled={this.state.saveEnable}
									>
										<AlgaehLabel label={{ fieldName: 'btn_save', returnText: true }} />
									</button>

									<button
										type="button"
										className="btn btn-default"
										onClick={ClearData.bind(this, this)}
										disabled={this.state.clearEnable}
									>
										<AlgaehLabel label={{ fieldName: 'btn_clear', returnText: true }} />
									</button>
								</div>
							</div>
						</div>
					</MyContext.Provider>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		patients: state.patients,
		countries: state.countries
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getPatientDetails: AlgaehActions,
			getCountries: AlgaehActions
		},
		dispatch
	);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UpdatePatientDetails));
