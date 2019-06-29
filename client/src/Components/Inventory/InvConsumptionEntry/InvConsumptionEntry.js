import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AlgaehLabel, AlagehAutoComplete } from '../../Wrapper/algaehWrapper';
import moment from 'moment';

import BreadCrumb from '../../common/BreadCrumb/BreadCrumb.js';
import ConsumptionItemsEvents from './InvConsumptionEntryEvents';
import './InvConsumptionEntry.css';
import '../../../styles/site.css';
import { AlgaehActions } from '../../../actions/algaehActions';

import ConsumptionItems from './ConsumptionItems/ConsumptionItems';
import MyContext from '../../../utils/MyContext';
import ConsumptionIOputs from '../../../Models/InventoryConsumption';
import Options from '../../../Options.json';
import AlgaehReport from '../../Wrapper/printReports';
import _ from 'lodash';
import { AlgaehOpenContainer } from '../../../utils/GlobalFunctions';

class InvConsumptionEntry extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentWillMount() {
		let IOputs = ConsumptionIOputs.inputParam();
		this.setState(IOputs);
	}

	componentDidMount() {
		const hospital = JSON.parse(AlgaehOpenContainer(sessionStorage.getItem('CurrencyDetail')));
		if (this.props.inventoryitemlist === undefined || this.props.inventoryitemlist.length === 0) {
			this.props.getItems({
				uri: '/inventory/getItemMaster',
				module: 'inventory',
				method: 'GET',
				redux: {
					type: 'ITEM_GET_DATA',
					mappingName: 'inventoryitemlist'
				}
			});
		}
		if (this.props.inventoryreqlocations === undefined || this.props.inventoryreqlocations.length === 0) {
			this.props.getLocation({
				uri: '/inventory/getInventoryLocation',
				module: 'inventory',
				method: 'GET',
				redux: {
					type: 'LOCATIOS_GET_DATA',
					mappingName: 'inventoryreqlocations'
				}
			});
		}

		if (this.props.invuserwiselocations === undefined || this.props.invuserwiselocations.length === 0) {
			this.props.getUserLocationPermission({
				uri: '/inventoryGlobal/getUserLocationPermission',
				module: 'inventory',
				method: 'GET',
				data: {
					location_status: 'A',
					hospital_id: hospital.hims_d_hospital_id
				},
				redux: {
					type: 'LOCATIOS_GET_DATA',
					mappingName: 'invuserwiselocations'
				}
			});
		}

		if (this.props.consumption_number !== undefined && this.props.consumption_number.length !== 0) {
			ConsumptionItemsEvents().getCtrlCode(this, this.props.consumption_number);
		}
	}

	componentWillUnmount() {
		ConsumptionItemsEvents().ClearData(this);
	}

	LocationchangeTexts(e) {
		ConsumptionItemsEvents().LocationchangeTexts(this, e);
	}
	SaveConsumptionEntry() {
		ConsumptionItemsEvents().SaveConsumptionEntry(this);
	}
	getCtrlCode(docNumber) {
		ConsumptionItemsEvents().getCtrlCode(this, docNumber);
	}
	ClearData() {
		ConsumptionItemsEvents().ClearData(this);
	}

	render() {
		const from_location_name =
			this.state.from_location_id !== null
				? _.filter(this.props.invuserwiselocations, (f) => {
						return f.hims_d_inventory_location_id === this.state.from_location_id;
					})
				: [];

		return (
			<React.Fragment>
				<div>
					<BreadCrumb
						title={<AlgaehLabel label={{ forceLabel: 'Consumption Entry', align: 'ltr' }} />}
						breadStyle={this.props.breadStyle}
						pageNavPath={[
							{
								pageName: (
									<AlgaehLabel
										label={{
											forceLabel: 'Home',
											align: 'ltr'
										}}
									/>
								)
							},
							{
								pageName: <AlgaehLabel label={{ forceLabel: 'Consumption Entry', align: 'ltr' }} />
							}
						]}
						soptlightSearch={{
							label: <AlgaehLabel label={{ forceLabel: 'Consumption Number', returnText: true }} />,
							value: this.state.consumption_number,
							selectValue: 'consumption_number',
							events: {
								onChange: this.getCtrlCode.bind(this)
							},
							jsonFile: {
								fileName: 'spotlightSearch',
								fieldName: 'ConsumptionEntry.InvConsEntry'
							},
							searchName: 'InvConsEntry'
						}}
						userArea={
							<div className="row">
								<div className="col">
									<AlgaehLabel
										label={{
											forceLabel: 'Consumption Date'
										}}
									/>
									<h6>
										{this.state.consumption_date ? (
											moment(this.state.consumption_date).format(Options.dateFormat)
										) : (
											Options.dateFormat
										)}
									</h6>
								</div>
							</div>
						}
						printArea={
							this.state.hims_f_inventory_consumption_header_id !== null ? (
								{
									menuitems: [
										{
											label: 'Print Receipt',
											events: {
												onClick: () => {
													ConsumptionItemsEvents().generateConsumptionRecpt(this);
												}
											}
										}
									]
								}
							) : (
								''
							)
						}
						selectedLang={this.state.selectedLang}
					/>

					<div className="row  inner-top-search" style={{ marginTop: 76, paddingBottom: 10 }}>
						{/* Patient code */}
						<div className="col-lg-8">
							<div className="row">
								<AlagehAutoComplete
									div={{ className: 'col-lg-4' }}
									label={{ forceLabel: 'Location' }}
									selector={{
										name: 'location_id',
										className: 'select-fld',
										value: this.state.location_id,
										dataSource: {
											textField: 'location_description',
											valueField: 'hims_d_inventory_location_id',
											data: this.props.invuserwiselocations
										},
										others: {
											disabled: this.state.addedItem
										},
										onChange: this.LocationchangeTexts.bind(this)
									}}
								/>

								<div className="col-lg-4">
									<AlgaehLabel
										label={{
											forceLabel: 'Location Type'
										}}
									/>
									<h6>
										{this.state.location_type ? this.state.location_type === 'WH' ? (
											'Warehouse'
										) : this.state.location_type === 'MS' ? (
											'Main Store'
										) : (
											'Sub Store'
										) : (
											'Location Type'
										)}
									</h6>
								</div>
							</div>
						</div>
					</div>

					<div className="hptl-phase1-Consumption-form">
						<MyContext.Provider
							value={{
								state: this.state,
								updateState: (obj) => {
									this.setState({ ...obj });
								}
							}}
						>
							<ConsumptionItems ConsumptionIOputs={this.state} />
						</MyContext.Provider>

						<div className="hptl-phase1-footer">
							<div className="row">
								<div className="col-lg-12">
									<button
										type="button"
										className="btn btn-primary"
										onClick={this.SaveConsumptionEntry.bind(this)}
										disabled={this.state.saveEnable}
									>
										<AlgaehLabel label={{ forceLabel: 'Save', returnText: true }} />
									</button>

									<button
										type="button"
										className="btn btn-default"
										onClick={this.ClearData.bind(this)}
										disabled={this.state.ClearDisable}
									>
										<AlgaehLabel label={{ forceLabel: 'Clear', returnText: true }} />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

function mapStateToProps(state) {
	return {
		inventoryitemlist: state.inventoryitemlist,
		inventoryreqlocations: state.inventoryreqlocations,
		inventoryrequisitionentry: state.inventoryrequisitionentry,
		invuserwiselocations: state.invuserwiselocations
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getItems: AlgaehActions,
			getLocation: AlgaehActions,
			getRequisitionEntry: AlgaehActions,
			getUserLocationPermission: AlgaehActions
		},
		dispatch
	);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InvConsumptionEntry));
