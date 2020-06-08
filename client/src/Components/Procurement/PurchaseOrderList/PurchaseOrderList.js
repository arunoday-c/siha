import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "linq";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import { setGlobal } from "../../../utils/GlobalFunctions";
import "./PurchaseOrderList.scss";
import "./../../../styles/site.scss";
import GlobalVariables from "../../../utils/GlobalVariables.json";

import {
  LocationchangeTexts,
  dateFormater,
  poforhandle,
  datehandle,
  changeEventHandaler,
  getPurchaseOrderList,
  getData
} from "./PurchaseOrderListEvent";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  RawSecurityComponent
} from "algaeh-react-components";

class PurchaseOrderList extends Component {
  constructor(props) {
    super(props);
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    this.state = {
      to_date: new Date(),
      from_date: moment("01" + month + year, "DDMMYYYY")._d,
      po_from: null,
      to_location_id: null,
      purchase_list: [],

      authorize1: "Y",
      poSelected: true,
      status: "1"
    };

    RawSecurityComponent({ componentCode: "PUR_AUTH_INVENTORY" }).then((result) => {
      if (result === "show") {
        this.setState({
          po_from: "INV", poSelected: false
        }, () => {
          getData(this);
          getPurchaseOrderList(this);
        })
      }
    });

    RawSecurityComponent({ componentCode: "PUR_AUTH_PHARMACY" }).then((result) => {
      if (result === "show") {
        this.setState({
          po_from: "PHR", poSelected: false
        }, () => {
          getData(this);
          getPurchaseOrderList(this);
        })
      }
    });
  }

  render() {
    const _mainStore = Enumerable.from(this.props.polocations)
      .where(w => w.location_type === "WH")
      .toArray();
    return (
      <React.Fragment>
        <div className="hptl-phase1-requisition-list-form">
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Purchase Auth List", align: "ltr" }}
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
                    label={{ forceLabel: "Purchase Auth List", align: "ltr" }}
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
                  div={{ className: "col-3" }}
                  label={{ forceLabel: "PO For" }}
                  selector={{
                    name: "po_from",
                    className: "select-fld",
                    value: this.state.po_from,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.PO_FROM
                    },
                    others: {
                      disabled: true
                    },
                    onChange: poforhandle.bind(this, this),
                    onClear: poforhandle.bind(this, this)
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
                      data: GlobalVariables.PO_STATUS
                    },
                    onChange: changeEventHandaler.bind(this, this),
                    onClear: () => {
                      this.setState({
                        status: null
                      });
                    },
                    others: {
                      disabled: this.state.poSelected
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-3" }}
                  label={{ forceLabel: "Location" }}
                  selector={{
                    name:
                      this.state.po_from === "PHR"
                        ? "pharmcy_location_id"
                        : "inventory_location_id",
                    className: "select-fld",
                    value:
                      this.state.po_from === "PHR"
                        ? this.state.pharmcy_location_id
                        : this.state.inventory_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField:
                        this.state.po_from === "PHR"
                          ? "hims_d_pharmacy_location_id"
                          : "hims_d_inventory_location_id",
                      data: _mainStore
                    },
                    onChange: LocationchangeTexts.bind(this, this),
                    onClear: LocationchangeTexts.bind(this, this)
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-body" id="purchaseOrderListCntr">
                  <AlgaehDataGrid
                    id="PurchaseOrderList_grid"
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
                                  setGlobal({
                                    "RQ-STD": "PurchaseOrderEntry",
                                    purchase_number: row.purchase_number
                                  });
                                  document.getElementById("rq-router").click();
                                }}
                              />

                              {row.delivery_pending === true ? (
                                <i
                                  className="fa fa-exchange-alt"
                                  onClick={() => {
                                    setGlobal({
                                      "RQ-STD": "DeliveryNoteEntry",
                                      purchase_number: row.purchase_number
                                    });
                                    document
                                      .getElementById("rq-router")
                                      .click();
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
                          filterable: false
                        }
                      },
                      {
                        fieldName: "purchase_number",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "PO Number" }} />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "vendor_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Vendor Name" }} />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "po_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "PO Date" }} />
                        ),
                        displayTemplate: row => {
                          return <span>{dateFormater(this, row.po_date)}</span>;
                        },

                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "left" },
                          filterable: false
                        }
                      },
                      {
                        fieldName: "location_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Location" }} />
                        ),

                        displayTemplate: row => {
                          let display;

                          this.state.po_from === "PHR"
                            ? (display =
                              this.props.polocations === undefined
                                ? []
                                : this.props.polocations.filter(
                                  f =>
                                    f.hims_d_pharmacy_location_id ===
                                    row.pharmcy_location_id
                                ))
                            : (display =
                              this.props.polocations === undefined
                                ? []
                                : this.props.polocations.filter(
                                  f =>
                                    f.hims_d_inventory_location_id ===
                                    row.inventory_location_id
                                ));

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].location_description
                                : ""}
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" },
                          filterable: false
                        }
                      }
                    ]}
                    keyId="purchase_number"
                    dataSource={{
                      data: this.state.purchase_list
                    }}
                    filter={true}
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
    polocations: state.polocations,
    purchaseorderlist: state.purchaseorderlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions,
      getPurchaseOrderList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PurchaseOrderList)
);
