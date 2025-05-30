import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "linq";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import "./InvRequisitionList.scss";
import "./../../../styles/site.scss";

import {
  // LocationchangeTexts,
  dateFormater,
  // radioChange,
  getRequisitionList,
  datehandle,
  changeEventHandaler,
} from "./InvRequisitionListEvent";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import { AlgaehActions } from "../../../actions/algaehActions";

class InvRequisitionList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    //to load the same list when user come back from whatever screen they went.
    if (this.props.backToAuth) {
      const {
        from_date,
        to_date,
        from_location_id,
        to_location_id,
        status,
      } = this.props.prev;
      this.setState(
        {
          from_date,
          to_date,
          from_location_id,
          to_location_id,
          status,
        },
        () => getRequisitionList(this)
      );
    } else {
      this.setState(
        {
          to_date: new Date(),
          from_date: moment("01" + month + year, "DDMMYYYY")._d,
          from_location_id: null,
          to_location_id: null,
          requisition_list: [],
          radioYes: true,
          authorize1: "Y",
          status: "1",
        },
        () => getRequisitionList(this)
      );
    }

    this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      method: "GET",
      redux: {
        type: "INV_LOCATIOS_GET_DATA",
        mappingName: "inventorylocations",
      },
    });
  }

  ourOwnMiniNavigator = (obj) => {
    const { requisition_list, radioYes, authorize1, ...rest } = this.state;
    let sendObj = Object.assign(rest, obj);
    this.props.new_routeComponents(sendObj);
  };

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-requisition-list-form">
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Requisition Auth List", align: "ltr" }}
              />
            }
            breadStyle={this.props.breadStyle}
            // pageNavPath={[
            //   {
            //     pageName: (
            //       <AlgaehLabel
            //         label={{
            //           forceLabel: "Home",
            //           align: "ltr"
            //         }}
            //       />
            //     )
            //   },
            //   {
            //     pageName: (
            //       <AlgaehLabel
            //         label={{
            //           forceLabel: "Requisition Auth List",
            //           align: "ltr"
            //         }}
            //       />
            //     )
            //   }
            // ]}
          />
          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ fieldName: "from_date" }}
                  textBox={{ className: "txt-fld", name: "from_date" }}
                  events={{
                    onChange: datehandle.bind(this, this),
                  }}
                  value={this.state.from_date}
                />
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ fieldName: "to_date" }}
                  textBox={{ className: "txt-fld", name: "to_date" }}
                  events={{
                    onChange: datehandle.bind(this, this),
                  }}
                  value={this.state.to_date}
                />
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Location" }}
                  selector={{
                    name: "from_location_id",
                    className: "select-fld",
                    value: this.state.from_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_inventory_location_id",
                      data: this.props.inventorylocations,
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState(
                        {
                          from_location_id: null,
                        },
                        () => getRequisitionList(this)
                      );
                    },
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Requested Location" }}
                  selector={{
                    name: "to_location_id",
                    className: "select-fld",
                    value: this.state.to_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_inventory_location_id",
                      data: this.props.inventorylocations,
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState(
                        {
                          to_location_id: null,
                        },
                        () => getRequisitionList(this)
                      );
                    },
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Status" }}
                  selector={{
                    name: "status",
                    className: "select-fld",
                    value: this.state.status,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.REQUSITION_STATUS,
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState(
                        {
                          status: null,
                        },
                        () => getRequisitionList(this)
                      );
                    },
                  }}
                />

                {/*
                <div className="col-lg-4" style={{ paddingTop: "25px" }}>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          name="insured"
                          value="1"
                          checked={this.state.radioYes}
                          onChange={radioChange.bind(this, this)}
                        />
                        <span>Authorize 1</span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          name="insured"
                          value="2"
                          checked={this.state.radioNo}
                          onChange={radioChange.bind(this, this)}
                        />
                        <span>Authorize 2</span>
                      </label>
                    </div>
                  </div>*/}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-body" id="Inv_RequisitionListCntr">
                  <AlgaehDataGrid
                    id="Inv_RequisitionList_grid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                        displayTemplate: (row) => {
                          return (
                            <span>
                              <i
                                style={{
                                  pointerEvents:
                                    row.cancel === "Y" ? "none" : "",
                                  opacity: row.cancel === "Y" ? "0.1" : "",
                                }}
                                className="fas fa-check"
                                onClick={() => {
                                  this.ourOwnMiniNavigator({
                                    RQ_Screen: "InvRequisitionEntry",
                                    material_requisition_number:
                                      row.material_requisition_number,
                                  });
                                }}
                              />
                              {row.trans_pending === true &&
                              row.requistion_type === "MR" ? (
                                <i
                                  className="fa fa-exchange-alt"
                                  onClick={() => {
                                    this.ourOwnMiniNavigator({
                                      RQ_Screen: "InvTransferEntry",
                                      hims_f_inventory_material_header_id:
                                        row.hims_f_inventory_material_header_id,
                                      from_location: row.to_location_id,
                                    });
                                  }}
                                />
                              ) : null}
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 100,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "status",
                        label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                        displayTemplate: (row) => {
                          return (row.is_completed &&
                            row.requistion_type === "MR") === "Y" ? (
                            <span className="badge badge-success">
                              Transfer Completed
                            </span>
                          ) : row.is_completed === "Y" &&
                            row.requistion_type === "PR" ? (
                            <span className="badge badge-success">
                              PO Generated
                            </span>
                          ) : row.authorize1 === "Y" &&
                            row.authorie2 === "Y" &&
                            row.is_completed === "N" &&
                            row.requistion_type === "MR" ? (
                            <span className="badge badge-warning">
                              Transfer Pending
                            </span>
                          ) : row.authorize1 === "Y" &&
                            row.authorie2 === "Y" &&
                            row.is_completed === "N" &&
                            row.requistion_type === "PR" ? (
                            <span className="badge badge-warning">
                              PO Not Generated
                            </span>
                          ) : row.authorize1 === "N" &&
                            row.authorie2 === "N" ? (
                            <span className="badge badge-danger">
                              Auth 1 Pending
                            </span>
                          ) : row.authorize1 === "Y" &&
                            row.authorie2 === "N" ? (
                            <span className="badge badge-danger">
                              Auth 2 Pending
                            </span>
                          ) : row.status === null ? (
                            <span className="badge badge-danger">
                              Send for Authorization pending
                            </span>
                          ) : null;
                        },

                        others: {
                          maxWidth: 150,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "material_requisition_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requisition Number" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "req_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requisition Type" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },

                      {
                        fieldName: "requistion_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requistion Date" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {dateFormater(this, row.requistion_date)}
                            </span>
                          );
                        },

                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "left" },
                        },
                      },
                      {
                        fieldName: "from_location_id",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "From Location" }}
                          />
                        ),

                        displayTemplate: (row) => {
                          let x;
                          if (
                            this.props.inventorylocations !== undefined &&
                            this.props.inventorylocations.length !== 0
                          ) {
                            x = Enumerable.from(this.props.inventorylocations)
                              .where(
                                (w) =>
                                  w.hims_d_inventory_location_id ===
                                  row.from_location_id
                              )
                              .firstOrDefault();
                          }
                          return (
                            <span>
                              {x !== undefined ? x.location_description : ""}
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "to_location_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "To Location" }} />
                        ),

                        displayTemplate: (row) => {
                          let x;
                          if (
                            this.props.inventorylocations !== undefined &&
                            this.props.inventorylocations.length !== 0
                          ) {
                            x = Enumerable.from(this.props.inventorylocations)
                              .where(
                                (w) =>
                                  w.hims_d_inventory_location_id ===
                                  row.to_location_id
                              )
                              .firstOrDefault();
                          }
                          return (
                            <span>
                              {x !== undefined ? x.location_description : ""}
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                    ]}
                    keyId="material_requisition_number"
                    dataSource={{
                      data: this.state.requisition_list,
                    }}
                    noDataText="No data available for location"
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
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
    inventorylocations: state.inventorylocations,
    inventoryrequisitionlist: state.inventoryrequisitionlist,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions,
      getRequisitionList: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InvRequisitionList)
);
