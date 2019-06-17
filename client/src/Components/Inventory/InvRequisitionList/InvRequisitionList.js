import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "linq";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import { setGlobal } from "../../../utils/GlobalFunctions";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import "./InvRequisitionList.css";
import "./../../../styles/site.css";

import {
  LocationchangeTexts,
  dateFormater,
  radioChange,
  getRequisitionList,
  datehandle,
  changeEventHandaler
} from "./InvRequisitionListEvent";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import { AlgaehActions } from "../../../actions/algaehActions";

class InvRequisitionList extends Component {
  constructor(props) {
    super(props);
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    this.state = {
      to_date: new Date(),
      from_date: moment("01" + month + year, "DDMMYYYY")._d,
      from_location_id: null,
      to_location_id: null,
      requisition_list: [],
      radioYes: true,
      authorize1: "Y",
      status: "1"
    };
    getRequisitionList(this);
  }

  componentDidMount() {
    this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      method: "GET",
      redux: {
        type: "INV_LOCATIOS_GET_DATA",
        mappingName: "inventorylocations"
      }
    });
  }

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
            pageNavPath={[
              {
                pageName: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Home",
                      align: "ltr"
                    }}
                  />
                )
              },
              {
                pageName: (
                  <AlgaehLabel
                    label={{ forceLabel: "Requisition Auth List", align: "ltr" }}
                  />
                )
              }
            ]}
          />
          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ forceLabel: "From Date" }}
                  textBox={{ className: "txt-fld", name: "from_date" }}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.from_date}
                />
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ forceLabel: "To Date" }}
                  textBox={{ className: "txt-fld", name: "to_date" }}
                  events={{
                    onChange: datehandle.bind(this, this)
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
                      data: this.props.inventorylocations
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState({
                        from_location_id: null
                      });
                    }
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
                      data: this.props.inventorylocations
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState({
                        to_location_id: null
                      });
                    }
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
                      data: GlobalVariables.REQUSITION_STATUS
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState({
                        status: null
                      });
                    }
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
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                style={{
                                  pointerEvents:
                                    row.cancel === "Y" ? "none" : "",
                                  opacity: row.cancel === "Y" ? "0.1" : ""
                                }}
                                className="fas fa-flask"
                                onClick={() => {
                                  setGlobal({
                                    "RQ-STD": "InvRequisitionEntry",
                                    material_requisition_number:
                                      row.material_requisition_number
                                  });
                                  document.getElementById("rq-router").click();
                                }}
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 100,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
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
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "requistion_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requistion Date" }}
                          />
                        ),
                        displayTemplate: row => {
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
                          style: { textAlign: "left" }
                        }
                      },
                      {
                        fieldName: "from_location_id",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "From Location" }}
                          />
                        ),

                        displayTemplate: row => {
                          let x;
                          if (
                            this.props.inventorylocations !== undefined &&
                            this.props.inventorylocations.length !== 0
                          ) {
                            x = Enumerable.from(this.props.inventorylocations)
                              .where(
                                w =>
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
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "to_location_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "To Location" }} />
                        ),

                        displayTemplate: row => {
                          let x;
                          if (
                            this.props.inventorylocations !== undefined &&
                            this.props.inventorylocations.length !== 0
                          ) {
                            x = Enumerable.from(this.props.inventorylocations)
                              .where(
                                w =>
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
                          style: { textAlign: "center" }
                        }
                      }
                    ]}
                    keyId="material_requisition_number"
                    dataSource={{
                      data: this.state.requisition_list
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
    inventoryrequisitionlist: state.inventoryrequisitionlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions,
      getRequisitionList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvRequisitionList)
);
