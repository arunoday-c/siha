import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "linq";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import GlobalVariables from "../../../utils/GlobalVariables.json";

import "./InvAcknowledgeList.scss";
import "./../../../styles/site.scss";

import {
  // LocationchangeTexts,
  dateFormater,
  // radioChange,
  getTransList,
  datehandle,
  changeEventHandaler
} from "./InvAcknowledgeListEvent";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import { AlgaehActions } from "../../../actions/algaehActions";

class InvAcknowledgeList extends Component {
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
        ack_done
      } = this.props.prev;
      this.setState(
        {
          from_date,
          to_date,
          from_location_id,
          to_location_id,
          ack_done
        },
        () => getTransList(this)
      );
    } else {
      this.setState(
        {
          to_date: new Date(),
          from_date: moment("01" + month + year, "DDMMYYYY")._d,
          from_location_id: null,
          to_location_id: null,
          requisition_list: [],
          ack_done: null
        },
        () => getTransList(this)
      );
    }

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

  ourOwnMiniNavigator = obj => {
    const { requisition_list, ...rest } = this.state;
    let sendObj = Object.assign(rest, obj);
    this.props.new_routeComponents(sendObj);
  };

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-acknowledge-list-form">
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Acknowledge List", align: "ltr" }}
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
                    label={{
                      forceLabel: "Acknowledge List",
                      align: "ltr"
                    }}
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
                      this.setState(
                        {
                          to_location_id: null
                        },
                        () => getTransList(this)
                      );
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Ack Status" }}
                  selector={{
                    name: "ack_done",
                    className: "select-fld",
                    value: this.state.ack_done,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.ACK_STATUS
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState(
                        {
                          ack_done: null
                        },
                        () => getTransList(this)
                      );
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-body" id="InvAcknowledgeListCntr">
                  <AlgaehDataGrid
                    id="InvAcknowledgeList_grid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                className="fas fa-check"
                                onClick={() => {
                                  this.ourOwnMiniNavigator({
                                    RQ_Screen: "InvTransferEntry",
                                    transfer_number: row.transfer_number,
                                    from_location_id: row.from_location_id,
                                    to_location_id: row.to_location_id
                                  });
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
                        fieldName: "transfer_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Transfer Number" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "transfer_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Transfer Date" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>{dateFormater(this, row.transfer_date)}</span>
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
                        fieldName: "ack_done",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Ack Status" }} />
                        ),
                        displayTemplate: row => {
                          return row.ack_done === "Y" ? "Yes" : "No";
                        }
                      },
                      {
                        fieldName: "from_location_id",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Transferred Location" }}
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
                          <AlgaehLabel
                            label={{ forceLabel: "Receiving Location" }}
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
                    keyId="transfer_number"
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
    inventorylocations: state.inventorylocations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvAcknowledgeList)
);
