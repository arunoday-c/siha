import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RadTemplate from '../RadTemplate/RadTemplate';
import './RadInvestigation.css';
import './../../../styles/site.css';
import { AlagehAutoComplete, AlgaehLabel, AlgaehDataGrid } from '../../Wrapper/algaehWrapper';
import {
	texthandle,
	ShowTemplate,
	CloseTemplate,
	ViewEditTemplate,
	deleteRadInvestigation,
	updateRadInvestigation,
	deleteRadTemplate
} from './RadInvestigationEvent';
import variableJson from '../../../utils/GlobalVariables.json';
import { AlgaehActions } from '../../../actions/algaehActions';
import MyContext from '../../../utils/MyContext.js';
// import { successfulMessage } from "../../../utils/GlobalFunctions";
// import { getCookie } from "../../../utils/algaehApiCall";

class RadInvestigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openTemplate: false,
			radTempobj: null
		};
	}

	componentWillMount() {
		let InputOutput = this.props.InvestigationIOputs;
		this.setState({ ...this.state, ...InputOutput });
	}
	componentDidMount() {
		if (this.props.testcategory === undefined || this.props.testcategory.length === 0) {
			this.props.getTestCategory({
				uri: '/labmasters/selectTestCategory',
				module: 'laboratory',
				method: 'GET',
				redux: {
					type: 'TESTCATEGORY_GET_DATA',
					mappingName: 'testcategory'
				}
			});
		}
	}

	render() {
		return (
			<React.Fragment>
				<MyContext.Consumer>
					{(context) => (
						<div className="row hptl-phase1-add-rad-investigation-form">
							<div className="col-12">
								<div className="row ">
									<AlagehAutoComplete
										div={{ className: 'col-3 mandatory' }}
										label={{
											fieldName: 'category_id',
											isImp: true
										}}
										selector={{
											name: 'category_id',
											className: 'select-fld',
											value: this.state.category_id,
											dataSource: {
												textField: 'category_name',
												valueField: 'hims_d_test_category_id',
												data: this.props.testcategory
											},
											onChange: texthandle.bind(this, this, context),
											others: {
												tabIndex: '2'
											}
										}}
									/>
									<AlagehAutoComplete
										div={{ className: 'col-3 mandatory' }}
										label={{
											fieldName: 'film_category',
											isImp: true
										}}
										selector={{
											name: 'film_category',
											className: 'select-fld',
											value: this.state.film_category,
											dataSource: {
												textField: this.state.selectedLang === 'en' ? 'name' : 'arabic_name',
												valueField: 'value',
												data: variableJson.FORMAT_FILMCATEGORY
											},
											onChange: texthandle.bind(this, this, context)
										}}
									/>{' '}
									<AlagehAutoComplete
										div={{ className: 'col-3 mandatory' }}
										label={{
											fieldName: 'film_used',
											isImp: true
										}}
										selector={{
											name: 'film_used',
											className: 'select-fld',
											value: this.state.film_used,
											dataSource: {
												textField: this.state.selectedLang === 'en' ? 'name' : 'arabic_name',
												valueField: 'value',
												data: variableJson.FORMAT_YESNO
											},
											onChange: texthandle.bind(this, this, context),
											others: {
												tabIndex: '3'
											}
										}}
									/>
									<AlagehAutoComplete
										div={{ className: 'col-3' }}
										label={{
											fieldName: 'screening_test'
										}}
										selector={{
											name: 'screening_test',
											className: 'select-fld',
											value: this.state.screening_test,
											dataSource: {
												textField: this.state.selectedLang === 'en' ? 'name' : 'arabic_name',
												valueField: 'value',
												data: variableJson.FORMAT_YESNO
											},
											onChange: texthandle.bind(this, this, context)
										}}
									/>
								</div>
								<div className="Paper">
									<div className="row ">
										<div className="col-12">
											<button className="btn btn-primary" onClick={ShowTemplate.bind(this, this)}>
												Add New Template
											</button>
										</div>
									</div>
									<div className="row ">
										<div className="col-12">
											<AlgaehDataGrid
												id="template_grid"
												columns={[
													{
														fieldName: 'action',
														label: <AlgaehLabel label={{ fieldName: 'action' }} />,
														displayTemplate: (row) => {
															return (
																<span>
																	<i
																		className="fas fa-pen"
																		onClick={ViewEditTemplate.bind(this, this, row)}
																	/>
																	<i
																		className="fas fa-trash-alt"
																		onClick={deleteRadTemplate.bind(
																			this,
																			this,
																			context,
																			row
																		)}
																	/>
																</span>
															);
														},
														others: {
															maxWidth: 90,
															resizable: false,
															style: { textAlign: 'center' }
														}
													},
													{
														fieldName: 'template_name',
														label: <AlgaehLabel label={{ fieldName: 'template_name' }} />
													}
												]}
												keyId="analyte_id"
												dataSource={{
													data: this.state.RadTemplate
												}}
												isEditable={false}
												paging={{ page: 0, rowsPerPage: 4 }}
												events={{
													onDelete: deleteRadTemplate.bind(this, this, context),
													onEdit: (row) => {},

													onDone: updateRadInvestigation.bind(this, this)
												}}
											/>
										</div>
									</div>
								</div>
								<MyContext.Provider
									value={{
										state: this.state,
										updateState: (obj) => {
											this.setState({ ...obj });
										}
									}}
								>
									<RadTemplate
										openTemplate={this.state.openTemplate}
										onClose={CloseTemplate.bind(this, this)}
										radTempobj={this.state.radTempobj}
									/>
								</MyContext.Provider>
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
		testcategory: state.testcategory
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getTestCategory: AlgaehActions
		},
		dispatch
	);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RadInvestigation));
