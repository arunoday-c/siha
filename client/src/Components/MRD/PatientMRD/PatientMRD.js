import React, { Component } from 'react';
import './patient_mrd.css';
import { setGlobal } from '../../../utils/GlobalFunctions';
import AlgaehFile from '../../Wrapper/algaehFileUpload';
import Encounters from './Encounters/Encounters';
import HistoricalData from './HistoricalData/HistoricalData';
import moment from 'moment';
import Enumerable from 'linq';
import { algaehApiCall } from '../../../utils/algaehApiCall';

class PatientMRD extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pageDisplay: 'encounters',
			patientAllergies: []
		};
		this.changeTabs = this.changeTabs.bind(this);
	}

	getPatientAllergies() {
		algaehApiCall({
			uri: '/doctorsWorkBench/getPatientAllergies',
			method: 'GET',
			data: { patient_id: Window.global['mrd_patient'] },
			onSuccess: (response) => {
				let data = response.data.records;
				let _allergies = Enumerable.from(data)
					.groupBy('$.allergy_type', null, (k, g) => {
						return {
							allergy_type: k,
							allergy_type_desc:
								k === 'F'
									? 'Food'
									: k === 'A'
										? 'Airborne'
										: k === 'AI' ? 'Animal  &  Insect' : k === 'C' ? 'Chemical & Others' : '',
							allergyList: g.getSource()
						};
					})
					.toArray();
				this.setState({ patientAllergies: _allergies });
			},
			onError: (error) => {}
		});
	}

	componentDidMount() {
		if (this.props.fromClinicalDesk === undefined) this.getPatientAllergies();
	}

	changeTabs(e) {
		var element = document.querySelectorAll('[algaehmrd]');
		for (var i = 0; i < element.length; i++) {
			element[i].classList.remove('active');
		}
		e.currentTarget.classList.add('active');
		var page = e.currentTarget.getAttribute('algaehmrd');
		this.setState({
			pageDisplay: page
		});
	}

	render() {
		return (
			// Main Render Start
			<div className="patient-mrd">
				{/* Top Bar Start */}
				<div className="row patientProfile">
					{this.props.fromClinicalDesk === undefined ? (
						<div className="patientInfo-Top box-shadow-normal">
							<div className="backBtn">
								<button id="btn-outer-component-load" className="d-none" />
								<button
									onClick={() => {
										setGlobal({ 'MRD-STD': 'MRDList' });
										document.getElementById('mrd-router').click();
									}}
									type="button"
									className="btn btn-outline-secondary btn-sm"
								>
									<i className="fas fa-angle-double-left fa-lg" />
									Back
								</button>
							</div>
							<div className="patientImg">
								<AlgaehFile
									name="attach_photo"
									accept="image/*"
									textAltMessage={Window.global['pat_name']}
									showActions={false}
									serviceParameters={{
										uniqueID: Window.global['patient_code'],
										destinationName: Window.global['patient_code'],
										fileType: 'Patients'
									}}
								/>
							</div>
							<div className="patientName">
								<h6>
									{Window.global['pat_name'] !== undefined ? (
										Window.global['pat_name']
									) : (
										'Loading . . .'
									)}
								</h6>
								<p>
									{Window.global['gender'] !== undefined ? Window.global['gender'] : ''}
									, {Window.global['age'] !== undefined ? Window.global['age'] : 0}
									Y{' '}
								</p>
							</div>
							<div className="patientDemographic">
								<span>
									DOB:
									<b>
										{moment(
											Window.global['date_of_birth'] !== undefined
												? Window.global['date_of_birth']
												: ''
										).format('DD-MM-YYYY')}
										{/* DD-MM-YYYY */}
									</b>
								</span>
								<span>
									Mobile:{' '}
									<b>
										{Window.global['contact_number'] !== undefined ? (
											Window.global['contact_number']
										) : (
											''
										)}
									</b>
								</span>
								<span>
									Nationality:{' '}
									<b>
										{Window.global['nationality'] !== undefined ? Window.global['nationality'] : ''}
									</b>
								</span>
							</div>
							<div className="patientHospitalDetail">
								<span>
									MRN:{' '}
									<b>
										{Window.global['patient_code'] !== undefined ? (
											Window.global['patient_code']
										) : (
											'Loading . .'
										)}
									</b>
								</span>
								<span>
									Primary ID Type:{' '}
									<b>
										{Window.global['primary_id'] !== undefined ? (
											Window.global['primary_id']
										) : (
											'Loading . .'
										)}
									</b>
								</span>
								<span>
									Primary ID Number:{' '}
									<b>
										{Window.global['primary_id_number'] !== undefined ? (
											Window.global['primary_id_number']
										) : (
											'Loading . .'
										)}
									</b>
								</span>
							</div>

							<div className="moreAction">
								<button type="button" className="btn btn-outline-secondary btn-sm">
									<img src={require('../../../assets/images/print.webp')} alt="Print icon" />
								</button>
							</div>
						</div>
					) : null}

					{/* Top Bar End */}
					{/* Tabs Start */}
					<div
						className={
							'patientTopNav box-shadow-normal ' +
							(this.props.fromClinicalDesk === undefined ? '' : ' mrdClinicalDeskTopMenu')
						}
					>
						<ul className="nav">
							<li className="nav-item">
								<span onClick={this.changeTabs} algaehmrd="encounters" className="nav-link active">
									Encounters
								</span>
							</li>

							<li className="nav-item">
								<span onClick={this.changeTabs} algaehmrd="histrorical_data" className="nav-link">
									Historical Data
								</span>
							</li>

							{/* <ul className="float-right patient-quick-info">
                <li>
                  <i className="fas fa-allergies" />

                  <section>
                    <b className="top-nav-sec-hdg">Allergies:</b>
                    <p>
                      {this.state.patientAllergies.map((data, index) => (
                        <React.Fragment key={index}>
                          <b>{data.allergy_type_desc}</b>
                          {data.allergyList.map((allergy, aIndex) => (
                            <span
                              key={aIndex}
                              className={
                                "listofA-D-D " +
                                (allergy.allergy_inactive === "Y" ? "red" : "")
                              }
                              title={
                                "Onset Date : " +
                                allergy.onset_date +
                                "\n Comment : " +
                                allergy.comment +
                                "\n Severity : " +
                                allergy.severity
                              }
                            >
                              {allergy.allergy_name}
                            </span>
                          ))}
                        </React.Fragment>
                      ))}
                    </p>
                  </section>
                </li>
              </ul> */}
						</ul>
					</div>
					{/* Tabs End */}

					{/* Bottom Body Start */}
					<div
						className={
							'componentRenderArea' +
							(this.props.fromClinicalDesk === undefined ? '' : ' mrdClinicalDeskContent')
						}
					>
						{this.state.pageDisplay === 'encounters' ? (
							<Encounters />
						) : this.state.pageDisplay === 'histrorical_data' ? (
							<HistoricalData />
						) : null}
					</div>
				</div>
			</div>
			//Main Render End
		);
	}
}

export default PatientMRD;
