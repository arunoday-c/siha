import React, { Component } from 'react';
import './LabSection.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AlagehFormGroup, AlgaehDataGrid, AlagehAutoComplete, AlgaehLabel } from '../../Wrapper/algaehWrapper';
import GlobalVariables from '../../../utils/GlobalVariables';

import { changeTexts, onchangegridcol, insertLabSection, deleteLabSection, updateLabSection } from './LabSectionEvents';
import { AlgaehActions } from '../../../actions/algaehActions';
import { getCookie } from '../../../utils/algaehApiCall.js';
import Options from '../../../Options.json';
import moment from 'moment';

class LabSection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hims_d_lab_section_id: '',
			description: '',
			selectedLang: 'en'
		};
		this.baseState = this.state;
	}

	componentDidMount() {
		let prevLang = getCookie('Language');

		this.setState({
			selectedLang: prevLang
		});
		if (this.props.labsection === undefined || this.props.labsection.length === 0) {
			this.props.getLabsection({
				uri: '/labmasters/selectSection',
				module: 'laboratory',
				method: 'GET',
				redux: {
					type: 'SECTION_GET_DATA',
					mappingName: 'labsection'
				}
			});
		}
	}

	dateFormater(date) {
		if (date !== null) {
			return moment(date).format(Options.dateFormat);
		}
	}

	render() {
		return (
			<div className="lab_section">
				<div className="container-fluid">
					<form>
						<div className="row">
							<AlagehFormGroup
								div={{ className: 'col-lg-3' }}
								label={{
									fieldName: 'type_desc',
									isImp: true
								}}
								textBox={{
									className: 'txt-fld',
									name: 'description',
									value: this.state.description,
									events: {
										onChange: changeTexts.bind(this, this)
									}
								}}
							/>
							<div className="col-lg-2 align-middle" style={{ paddingTop: 21 }}>
								<button onClick={insertLabSection.bind(this, this)} className="btn btn-primary">
									Add to List
								</button>
							</div>
						</div>
					</form>

					<div className="row form-details">
						<div className="col" data-validate="labSecDiv">
							<AlgaehDataGrid
								datavalidate="data-validate='labSecDiv'"
								id="visa_grd"
								columns={[
									{
										fieldName: 'SecDescription',
										label: <AlgaehLabel label={{ fieldName: 'type_desc' }} />,
										editorTemplate: (row) => {
											return (
												<AlagehFormGroup
													div={{}}
													textBox={{
														value: row.SecDescription,
														className: 'txt-fld',
														name: 'description',
														events: {
															onChange: onchangegridcol.bind(this, this, row)
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
										fieldName: 'created_by',
										label: <AlgaehLabel label={{ fieldName: 'created_by' }} />,
										displayTemplate: (row) => {
											let display =
												this.props.userdrtails === undefined
													? []
													: this.props.userdrtails.filter(
															(f) => f.algaeh_d_app_user_id === row.created_by
														);

											return (
												<span>
													{display !== null && display.length !== 0 ? (
														display[0].username
													) : (
														''
													)}
												</span>
											);
										},
										editorTemplate: (row) => {
											let display =
												this.props.userdrtails === undefined
													? []
													: this.props.userdrtails.filter(
															(f) => f.algaeh_d_app_user_id === row.created_by
														);

											return (
												<span>
													{display !== null && display.length !== 0 ? (
														display[0].username
													) : (
														''
													)}
												</span>
											);
										}
									},
									{
										fieldName: 'created_date',
										label: <AlgaehLabel label={{ fieldName: 'created_date' }} />,
										displayTemplate: (row) => {
											return <span>{this.dateFormater(row.created_date)}</span>;
										},
										editorTemplate: (row) => {
											return <span>{this.dateFormater(row.created_date)}</span>;
										}
									},
									{
										fieldName: 'section_status',
										label: <AlgaehLabel label={{ fieldName: 'inv_status' }} />,
										displayTemplate: (row) => {
											return row.section_status === 'A' ? 'Active' : 'Inactive';
										},
										editorTemplate: (row) => {
											return (
												<AlagehAutoComplete
													selector={{
														name: 'section_status',
														className: 'select-fld',
														value: row.section_status,
														dataSource: {
															textField: 'name',
															valueField: 'value',
															data: GlobalVariables.FORMAT_STATUS
														},
														others: {
															errormessage: 'Status - cannot be blank',
															required: true
														},
														onChange: onchangegridcol.bind(this, this, row)
													}}
												/>
											);
										}
									}
								]}
								keyId="hims_d_lab_section_id"
								dataSource={{
									data: this.props.labsection === undefined ? [] : this.props.labsection
								}}
								isEditable={true}
								filter={true}
								paging={{ page: 0, rowsPerPage: 10 }}
								events={{
									onDelete: deleteLabSection.bind(this, this),
									onEdit: (row) => {},
									onDone: updateLabSection.bind(this, this)
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		labsection: state.labsection,
		userdrtails: state.userdrtails
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getLabsection: AlgaehActions
		},
		dispatch
	);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LabSection));
