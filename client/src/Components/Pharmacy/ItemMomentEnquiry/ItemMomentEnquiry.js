import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  changeTexts,
  dateFormater,
  datehandle,
  ProcessItemMoment
} from "./ItemMomentEnquiryEvents";
import "./ItemMomentEnquiry.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import AHSnackbar from "../../common/Inputs/AHSnackbar.js";

class ItemMomentEnquiry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ListItems: [],
      location_id: null,
      item_id: null,
      from_date: null,
      to_date: null,
      SnackbarOpen: false,
      MandatoryMsg: ""
    };
  }

  componentDidMount() {
    this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "itemlist"
      }
    });

    this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "locations"
      }
    });

    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
      this.props.getItemUOM({
        uri: "/pharmacy/getPharmacyUom",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "itemuom"
        }
      });
    }
  }

  handleClose = () => {
    this.setState({ SnackbarOpen: false });
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Item Moment Enquiry", align: "ltr" }}
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
                    label={{ forceLabel: "Item Moment Enquiry", align: "ltr" }}
                  />
                )
              }
            ]}
          />

          <div className="hptl-phase1-item-moment-enquiry-form">
            <div
              className="row inner-top-search"
              style={{ marginTop: 76, paddingBottom: 10 }}
            >
              <div className="col-lg-12">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{ forceLabel: "Location" }}
                    selector={{
                      name: "location_id",
                      className: "select-fld",
                      value: this.state.location_id,
                      dataSource: {
                        textField: "location_description",
                        valueField: "hims_d_pharmacy_location_id",
                        data: this.props.locations
                      },

                      onChange: changeTexts.bind(this, this)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{ forceLabel: "Item Name" }}
                    selector={{
                      name: "item_id",
                      className: "select-fld",
                      value: this.state.item_id,
                      dataSource: {
                        textField: "item_description",
                        valueField: "hims_d_item_master_id",
                        data: this.props.itemlist
                      },
                      onChange: changeTexts.bind(this, this)
                    }}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-lg-2" }}
                    label={{ forceLabel: "From Date" }}
                    textBox={{ className: "txt-fld", name: "from_date" }}
                    events={{
                      onChange: datehandle.bind(this, this)
                    }}
                    value={this.state.from_date}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-lg-2" }}
                    label={{ forceLabel: "To Date" }}
                    textBox={{ className: "txt-fld", name: "to_date" }}
                    events={{
                      onChange: datehandle.bind(this, this)
                    }}
                    maxDate={new Date()}
                    value={this.state.to_date}
                  />
                  <div className="col-lg-2" style={{ paddingTop: "3vh" }}>
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={ProcessItemMoment.bind(this, this)}
                    >
                      Process
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Investigation Lists</h3>
            </div>
            <div className="actions">
            </div>
          </div> */}
              <div className="portlet-body" id="initialStock_Cntr">
                <AlgaehDataGrid
                  id="initial_stock"
                  columns={[
                    {
                      fieldName: "transaction_type",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Transaction Type" }}
                        />
                      )
                    },
                    {
                      fieldName: "transaction_date",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Transaction Date" }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>{dateFormater(row.transaction_date)}</span>
                        );
                      }
                    },
                    {
                      fieldName: "transaction_uom",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Unit of Measure" }}
                        />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.itemuom === undefined
                            ? []
                            : this.props.itemuom.filter(
                                f =>
                                  f.hims_d_pharmacy_uom_id ===
                                  row.transaction_uom
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].uom_description
                              : ""}
                          </span>
                        );
                      }
                    },

                    {
                      fieldName: "batchno",
                      label: <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                    },
                    {
                      fieldName: "expiry_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                      ),
                      displayTemplate: row => {
                        return <span>{dateFormater(row.expiry_date)}</span>;
                      }
                    },
                    {
                      fieldName: "transaction_qty",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                    },
                    {
                      fieldName: "transaction_cost",
                      label: <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                    }
                  ]}
                  keyId="item_id"
                  dataSource={{
                    data:
                      this.props.itemmoment === undefined
                        ? []
                        : this.props.itemmoment
                  }}
                  paging={{ page: 0, rowsPerPage: 20 }}
                />
              </div>
            </div>
            <AHSnackbar
              open={this.state.SnackbarOpen}
              handleClose={this.handleClose}
              MandatoryMsg={this.state.MandatoryMsg}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemlist: state.itemlist,
    locations: state.locations,
    itemmoment: state.itemmoment,
    itemuom: state.itemuom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemMoment: AlgaehActions,
      getItemUOM: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemMomentEnquiry)
);
