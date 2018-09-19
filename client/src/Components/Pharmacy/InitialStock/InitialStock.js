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
import { getCtrlCode } from "./InitialStockEvents";
import "./InitialStock.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";

class InitialStock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderservicesdata: []
    };
  }

  componentDidMount() {
    this.props.getItems({
      uri: "/itemmaster/getItems",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "itemlist"
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Initial Stock", align: "ltr" }}
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
                    label={{ forceLabel: "Initial Stock", align: "ltr" }}
                  />
                )
              }
            ]}
          />

          <div className="hptl-phase1-initial-stock-form">
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
                      textField: "hims_d_diet_description",
                      valueField: "hims_d_diet_master_id",
                      data: this.props.dietmaster
                    },
                    onChange: null
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
                    onChange: null
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    forceLabel: "Batch No."
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "batch_no",
                    value: this.state.batch_no,
                    events: {
                      onChange: null
                    }
                  }}
                />

                <AlgaehDateHandler
                  div={{ className: "col-lg-3" }}
                  label={{ forceLabel: "Expiry Date" }}
                  textBox={{ className: "txt-fld", name: "expirt_date" }}
                  maxDate={new Date()}
                  events={{
                    onChange: null
                  }}
                  value={this.state.expirt_date}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    forceLabel: "Quantity"
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "quantity",
                    value: this.state.quantity,
                    events: {
                      onChange: null
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-4" }}
                  label={{
                    forceLabel: "Unit Cost"
                  }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unit_cost,
                    className: "txt-fld",
                    name: "unit_cost",
                    events: {
                      onChange: null
                    }
                  }}
                />

                <div className="col-lg-3">
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "24px" }}
                  >
                    Add Item
                  </button>
                </div>
              </div>

              <div className="row form-group">
                <AlgaehDataGrid
                  id="initial_stock"
                  columns={[
                    {
                      fieldName: "service_type_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.servicetype === undefined
                            ? []
                            : this.props.servicetype.filter(
                                f =>
                                  f.hims_d_service_type_id ===
                                  row.service_type_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? this.state.selectedLang === "en"
                                ? display[0].service_type
                                : display[0].arabic_service_type
                              : ""}
                          </span>
                        );
                      },
                      disabled: true
                    },
                    {
                      fieldName: "quantity",
                      label: <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                    },
                    {
                      fieldName: "quantity",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                      )
                    },
                    {
                      fieldName: "quantity",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                    },
                    {
                      fieldName: "quantity",
                      label: <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                    }
                  ]}
                  keyId="item_id"
                  dataSource={{
                    data: this.state.orderservicesdata
                  }}
                  // isEditable={true}
                  paging={{ page: 0, rowsPerPage: 3 }}
                  events={{
                    //   onDelete: deleteServices.bind(this, this),
                    onEdit: row => {}
                    // onDone: this.updateBillDetail.bind(this)
                  }}
                />
              </div>
            </div>
            <div
              className="container-fluid"
              style={{ marginBottom: "1vh", marginTop: "1vh" }}
            >
              <div className="row" position="fixed">
                <div className="col-lg-12">
                  <span className="float-right">
                    <button
                      style={{ marginRight: "15px" }}
                      className="htpl1-phase1-btn-primary"
                      //   onClick={SaveOrdersServices.bind(this, this)}
                      //   disabled={this.state.saved}
                    >
                      <AlgaehLabel label={{ forceLabel: "Save" }} />
                    </button>
                  </span>
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
    itemlist: state.itemlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InitialStock)
);
