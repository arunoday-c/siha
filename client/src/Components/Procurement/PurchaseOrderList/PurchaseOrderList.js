import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "linq";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import { setGlobal } from "../../../utils/GlobalFunctions";
import "./PurchaseOrderList.css";
import "./../../../styles/site.css";
import GlobalVariables from "../../../utils/GlobalVariables.json";

import {
  LocationchangeTexts,
  dateFormater,
  texthandle,
  poforhandle
} from "./PurchaseOrderListEvent";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";

class PurchaseOrderList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      po_from: null,
      to_location_id: null,
      requisition_list: [],

      authorize1: "Y"
    };
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
                label={{ forceLabel: "Purchase List", align: "ltr" }}
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
                    label={{ forceLabel: "Purchase List", align: "ltr" }}
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

                    onChange: poforhandle.bind(this, this),
                    onClear: texthandle.bind(this, this)
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
                                className="fas fa-flask"
                                onClick={() => {
                                  setGlobal({
                                    "RQ-STD": "PurchaseOrderEntry",
                                    purchase_number: row.purchase_number
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
                          style: { textAlign: "left" }
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
                          style: { textAlign: "center" }
                        }
                      }
                    ]}
                    keyId="purchase_number"
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
