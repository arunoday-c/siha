import React, { Component } from 'react';
import './mrd_list.css';
import { algaehApiCall, swalMessage } from '../../../utils/algaehApiCall';
import { AlgaehDataGrid, AlgaehLabel } from '../../Wrapper/algaehWrapper';
import algaehLoader from '../../Wrapper/fullPageLoader';
// import moment from "moment";
import { setGlobal } from '../../../utils/GlobalFunctions';

class MRDList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			date_of_birth: null,
			registration_date: null,
			patientData: []
		};
		this.getPatientMrdList();
		this.baseState = this.state;
	}

	changeTexts(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	getPatientMrdList(e) {
		if (e !== undefined) e.preventDefault();
		algaehLoader({ show: true });

		// let reg_date = moment(this.state.registration_date).isValid()
		//   ? this.state.registration_date
		//   : null;
		// let dob = moment(this.state.date_of_birth).isValid()
		//   ? this.state.date_of_birth
		//   : null;

		//   data: {
		//     full_name: this.state.full_name !== "" ? this.state.full_name : null,
		//     patient_code:
		//       this.state.patient_code !== "" ? this.state.patient_code : null,
		//     registration_date: reg_date,
		//     date_of_birth: dob,
		//     contact_number:
		//       this.state.contact_number !== "" ? this.state.contact_number : null
		//   },

		algaehApiCall({
			uri: '/mrd/getPatientMrdList',
			method: 'GET',
			module: 'MRD',
			onSuccess: (response) => {
				algaehLoader({ show: false });
				if (response.data.success) {
					if (response.data.records.length === 0) {
						swalMessage({
							title: 'No records Found',
							type: 'warning'
						});
					}

					this.setState({ patientData: response.data.records });
				}
			},
			onFailure: (error) => {
				algaehLoader({ show: false });
				swalMessage({
					title: error.message,
					type: 'error'
				});
			}
		});
	}

	render() {
		return (
			<div className="mrd-list">
				{/* <div className="row inner-top-search">
          <form onSubmit={this.getPatientMrdList.bind(this)}>
            <div className="row padding-10">
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Patient Code",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "patient_code",
                  value: this.state.patient_code,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Patient Name",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "full_name",
                  value: this.state.full_name,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Phone Number",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "contact_number",
                  value: this.state.contact_number,
                  others: {
                    type: "number"
                  },
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "Date of Birth", isImp: false }}
                textBox={{
                  className: "txt-fld",
                  name: "date_of_birth"
                }}
                maxDate={new Date()}
                events={{
                  onChange: selectedDate => {
                    this.setState({
                      date_of_birth: selectedDate
                    });
                  }
                }}
                value={this.state.date_of_birth}
              />

              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "Registration Date", isImp: false }}
                textBox={{
                  className: "txt-fld",
                  name: "registration_date"
                }}
                maxDate={new Date()}
                events={{
                  onChange: selectedDate => {
                    this.setState({
                      registration_date: selectedDate
                    });
                  }
                }}
                value={this.state.registration_date}
              />

              <div className="col-lg-1">
                <button
                  style={{
                    cursor: "pointer",
                    fontSize: " 1.4rem",
                    margin: " 24px 0 0",
                    padding: 0,
                    background: "none",
                    border: "none"
                  }}
                  type="submit"
                  className="fas fa-search fa-2x"
                />
              </div>
            </div>
          </form>
        </div> */}
				<div className="portlet portlet-bordered margin-top-15">
					<div className="portlet-title">
						<div className="caption">
							<h3 className="caption-subject">Patient List</h3>
						</div>
					</div>
					<div className="portlet-body" id="mrdListCntr">
						<div className="row">
							<div className="col-lg-12">
								<AlgaehDataGrid
									id="mrdListGrid"
									columns={[
										{
											fieldName: 'registration_date',
											label: <AlgaehLabel label={{ forceLabel: 'Registration Date' }} />,

											others: {
												resizable: false,
												style: { textAlign: 'center' }
											}
										},
										{
											fieldName: 'patient_code',
											//label: "Patient Code",
											label: <AlgaehLabel label={{ forceLabel: 'Patient code' }} />,
											displayTemplate: (row) => {
												return (
													<span
														onClick={() => {
															setGlobal({
																'MRD-STD': 'PatientMRD',
																mrd_patient: row.hims_d_patient_id,
																nationality: row.nationality,
																primary_id: row.primary_document_name,
																primary_id_number: row.primary_id_no,
																gender: row.gender,
																age: row.age,
																date_of_birth: row.date_of_birth,
																patient_code: row.patient_code,
																contact_number: row.contact_number,
																pat_name: row.full_name
															});
															document.getElementById('mrd-router').click();
														}}
														className="pat-code"
													>
														{row.patient_code}
													</span>
												);
											},
											others: {
												resizable: false,
												style: { textAlign: 'center' }
											},
											className: (drow) => {
												return 'greenCell';
											}
										},
										{
											fieldName: 'full_name',
											label: <AlgaehLabel label={{ forceLabel: 'Patient Name' }} />,

											others: { resizable: false, style: { textAlign: 'left' } }
										},
										{
											fieldName: 'gender',
											label: <AlgaehLabel label={{ forceLabel: 'Gender' }} />,

											others: {
												resizable: false,
												style: { textAlign: 'center' }
											}
										},
										{
											fieldName: 'date_of_birth',
											label: <AlgaehLabel label={{ forceLabel: 'Date of Birth' }} />,

											others: {
												resizable: false,
												style: { textAlign: 'center' }
											}
										},
										{
											fieldName: 'age',
											label: <AlgaehLabel label={{ forceLabel: 'Age' }} />,

											others: {
												resizable: false,
												style: { textAlign: 'center' }
											}
										},
										{
											fieldName: 'contact_number',
											label: <AlgaehLabel label={{ forceLabel: 'Phone Number' }} />,

											others: {
												resizable: false,
												style: { textAlign: 'center' }
											}
										}
									]}
									keyId="mrdListGrid"
									dataSource={{
										data: this.state.patientData
									}}
									filter={true}
									isEditable={false}
									paging={{ page: 0, rowsPerPage: 20 }}
									// events={{
									//   onDelete: row => {},
									//   onEdit: row => {},
									//   onDone: row => {}
									// }}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default MRDList;
