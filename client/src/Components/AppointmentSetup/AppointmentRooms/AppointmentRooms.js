import React, { Component } from 'react';
import './appointment_rooms.css';
import { AlagehFormGroup, AlgaehDataGrid, AlgaehLabel, AlagehAutoComplete } from '../../Wrapper/algaehWrapper';
import { algaehApiCall, swalMessage } from '../../../utils/algaehApiCall';
import swal from 'sweetalert2';
import moment from 'moment';
import GlobalVariables from '../../../utils/GlobalVariables.json';
import { AlgaehValidation } from '../../../utils/GlobalFunctions';

class AppointmentRooms extends Component {
	constructor(props) {
		super(props);
		this.state = {
			appointmentRooms: [],
			description: ''
		};
		this.baseState = this.state;
	}

	deleteApptRooms(data) {
		swal({
			title: 'Are you sure you want to delete this Room?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes!',
			confirmButtonColor: '#44b8bd',
			cancelButtonColor: '#d33',
			cancelButtonText: 'No'
		}).then((willDelete) => {
			if (willDelete.value) {
				algaehApiCall({
					uri: '/appointment/deleteAppointmentRoom',
					module: 'frontDesk',
					data: {
						hims_d_appointment_room_id: data.hims_d_appointment_room_id
					},
					method: 'DELETE',
					onSuccess: (response) => {
						if (response.data.success) {
							swalMessage({
								title: 'Record deleted successfully . .',
								type: 'success'
							});

							this.getAppointmentRooms();
						} else if (!response.data.success) {
							swalMessage({
								title: response.data.records.message,
								type: 'error'
							});
						}
					},
					onFailure: (error) => {
						swalMessage({
							title: error.message,
							type: 'error'
						});
					}
				});
			} else {
				swalMessage({
					title: 'Delete request cancelled',
					type: 'error'
				});
			}
		});
	}

	updateApptRooms(data) {
		algaehApiCall({
			uri: '/appointment/updateAppointmentRoom',
			module: 'frontDesk',
			method: 'PUT',
			data: {
				record_status: 'A',
				hims_d_appointment_room_id: data.hims_d_appointment_room_id,
				description: data.description,
				room_active: data.room_active
			},
			onSuccess: (response) => {
				if (response.data.success) {
					swalMessage({
						title: 'Record updated successfully',
						type: 'success'
					});

					this.getAppointmentRooms();
				}
			},
			onFailure: (error) => {
				swalMessage({
					title: error.message,
					type: 'error'
				});
			}
		});
	}

	componentDidMount() {
		this.getAppointmentRooms();
	}

	changeGridEditors(row, e) {
		let name = e.name || e.target.name;
		let value = e.value || e.target.value;
		if (name === 'description') {
			row['roomDesc'] = value;
		}
		row[name] = value;
		row.update();
	}

	resetState() {
		this.setState(this.baseState);
	}

	changeTexts(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	getAppointmentRooms() {
		algaehApiCall({
			uri: '/appointment/getAppointmentRoom',
			module: 'frontDesk',
			method: 'GET',
			onSuccess: (response) => {
				if (response.data.success) {
					this.setState({ appointmentRooms: response.data.records });
				}
			},
			onFailure: (error) => {
				swalMessage({
					title: error.message,
					type: 'error'
				});
			}
		});
	}

	addAppointmentRooms(e) {
		e.preventDefault();

		AlgaehValidation({
			alertTypeIcon: 'warning',
			onSuccess: () => {
				algaehApiCall({
					uri: '/appointment/addAppointmentRoom',
					module: 'frontDesk',
					method: 'POST',
					data: {
						description: this.state.description
					},
					onSuccess: (response) => {
						if (response.data.success) {
							swalMessage({
								title: 'Record added successfully',
								type: 'success'
							});
							this.resetState();
							this.getAppointmentRooms();
						}
					},
					onFailure: (error) => {
						swalMessage({
							title: error.message,
							type: 'error'
						});
					}
				});
			}
		});
	}

	render() {
		return (
			<div className="appointment_rooms">
				<div className="col-lg-12">
					<div className="row">
						<AlagehFormGroup
							div={{ className: 'col-lg-3' }}
							label={{
								fieldName: 'roomName',
								isImp: true
							}}
							textBox={{
								className: 'txt-fld',
								name: 'description',
								value: this.state.description,
								events: {
									onChange: this.changeTexts.bind(this)
								}
							}}
						/>

						<div className="col-lg-3">
							<button
								style={{ marginTop: 21 }}
								onClick={this.addAppointmentRooms.bind(this)}
								type="button"
								className="btn btn-primary"
							>
								Add to List
							</button>
						</div>
					</div>
				</div>
				<div className="col-lg-12" style={{ marginTop: 10 }} data-validate="apptRoomsDiv" id="apptRoomsDivCntr">
					<AlgaehDataGrid
						datavalidate="data-validate='apptRoomsDiv'"
						id="appt-room-grid"
						columns={[
							{
								fieldName: 'roomDesc',
								label: <AlgaehLabel label={{ fieldName: 'description' }} />,
								editorTemplate: (row) => {
									return (
										<AlagehFormGroup
											div={{}}
											textBox={{
												value: row.roomDesc,
												className: 'txt-fld',
												name: 'description',
												events: {
													onChange: this.changeGridEditors.bind(this, row)
												},
												others: {
													errormessage: 'Description - cannot be blank',
													required: true
												}
											}}
										/>
									);
								}
							},
							{
								fieldName: 'created_date',
								label: <AlgaehLabel label={{ fieldName: 'created_date' }} />,
								displayTemplate: (row) => {
									return <span>{moment(row.created_date).format('DD-MM-YYYY')}</span>;
								},
								editorTemplate: (row) => {
									return <span>{moment(row.created_date).format('DD-MM-YYYY')}</span>;
								}
							},
							{
								fieldName: 'room_active',
								label: <AlgaehLabel label={{ fieldName: 'room_status' }} />,
								displayTemplate: (row) => {
									return row.room_active === 'Y' ? 'Active' : 'Inactive';
								},
								editorTemplate: (row) => {
									return (
										<AlagehAutoComplete
											div={{}}
											selector={{
												name: 'room_active',
												className: 'select-fld',
												value: row.room_active,
												dataSource: {
													textField: 'name',
													valueField: 'value',
													data: GlobalVariables.FORMAT_ACT_INACT
												},
												others: {
													errormessage: 'Status - cannot be blank',
													required: true
												},
												onChange: this.changeGridEditors.bind(this, row)
											}}
										/>
									);
								}
							}
						]}
						keyId="hims_d_appointment_room_id"
						dataSource={{
							data: this.state.appointmentRooms
						}}
						filter={true}
						isEditable={true}
						paging={{ page: 0, rowsPerPage: 10 }}
						events={{
							onEdit: () => {},
							onDelete: this.deleteApptRooms.bind(this),
							onDone: this.updateApptRooms.bind(this)
						}}
					/>
				</div>
			</div>
		);
	}
}

export default AppointmentRooms;
