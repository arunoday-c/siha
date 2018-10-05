import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./PosListItems.css";
import "./../../../../styles/site.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";

import {
  discounthandle,
  changeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle
} from "./PosListItemsEvents";
import ReciptForm from "./ReciptDetails/AddReciptForm";
import { AlgaehActions } from "../../../../actions/algaehActions";
import Paper from "@material-ui/core/Paper";

class PosListItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-op-add-billing-form">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col-4" }}
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
                            onChange: itemchangeText.bind(this, this)
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col" }}
                          label={{ forceLabel: "UOM", isImp: true }}
                          selector={{
                            name: "uom_id",
                            className: "select-fld",
                            value: this.state.uom_id,
                            dataSource: {
                              textField: "uom_description",
                              valueField: "hims_d_pharmacy_uom_id",
                              data: this.props.itemuom
                            },
                            others: {
                              disabled: true
                            },
                            onChange: itemchangeText.bind(this, this)
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Batch No."
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "batch_no",
                            value: this.state.batch_no,
                            events: {
                              onChange: changeTexts.bind(this, this)
                            }
                          }}
                        />
                        <AlgaehDateHandler
                          div={{ className: "col" }}
                          label={{ forceLabel: "Expiry Date" }}
                          textBox={{
                            className: "txt-fld",
                            name: "expirt_date"
                          }}
                          minDate={new Date()}
                          events={{
                            onChange: datehandle.bind(this, this)
                          }}
                          value={this.state.expirt_date}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Quantity"
                          }}
                          textBox={{
                            number: {
                              allowNegative: false,
                              thousandSeparator: ","
                            },
                            className: "txt-fld",
                            name: "quantity",
                            value: this.state.quantity,
                            events: {
                              onChange: numberchangeTexts.bind(this, this)
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Unit Cost"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.unit_cost,
                            className: "txt-fld",
                            name: "unit_cost",
                            events: {
                              onChange: numberchangeTexts.bind(this, this)
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 subFooter-btn">
                        <button
                          className="btn btn-primary"
                          onClick={AddItems.bind(this, this)}
                        >
                          Add Item
                        </button>
                        <button
                          className="btn btn-default"
                          //   onClick={processItems.bind(this, this)}
                        >
                          Select Batch
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                      <div className="row">
                        <div className="col-lg-12">
                          <AlgaehDataGrid
                            id="POS_items"
                            columns={[
                              {
                                fieldName: "generic_id",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Generic Name" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  let display =
                                    this.props.genericlist === undefined
                                      ? []
                                      : this.props.genericlist.filter(
                                          f =>
                                            f.hims_d_item_generic_id ===
                                            row.generic_id
                                        );

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].generic_name
                                        : ""}
                                    </span>
                                  );
                                }
                              },
                              {
                                fieldName: "item_id",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Item Name" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  let display =
                                    this.props.itemlist === undefined
                                      ? []
                                      : this.props.itemlist.filter(
                                          f =>
                                            f.hims_d_item_master_id ===
                                            row.item_id
                                        );

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].item_description
                                        : ""}
                                    </span>
                                  );
                                },
                                disabled: true
                              },
                              {
                                fieldName: "frequency",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Frequency" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return row.frequency == "0"
                                    ? "1-0-1"
                                    : row.frequency == "1"
                                      ? "1-0-0"
                                      : row.frequency == "2"
                                        ? "0-0-1"
                                        : row.frequency == "3"
                                          ? "0-1-0"
                                          : row.frequency == "4"
                                            ? "1-1-0"
                                            : row.frequency == "5"
                                              ? "0-1-1"
                                              : row.frequency == "6"
                                                ? "1-1-1"
                                                : null;
                                }
                              },
                              {
                                fieldName: "frequency_type",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Frequency Type" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return row.frequency_type == "PD"
                                    ? "Per Day"
                                    : row.frequency_type == "PH"
                                      ? "Per Hour"
                                      : row.frequency_type == "PW"
                                        ? "Per Week"
                                        : row.frequency_type == "PM"
                                          ? "Per Month"
                                          : row.frequency_type == "AD"
                                            ? "Alternate Day"
                                            : null;
                                }
                              },
                              {
                                fieldName: "frequency_time",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Frequency Time" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return row.frequency_time == "BM"
                                    ? "Before Meals"
                                    : row.frequency_time == "AM"
                                      ? "After Meals"
                                      : null;
                                }
                              },
                              {
                                fieldName: "dosage",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Dosage" }}
                                  />
                                )
                              },
                              {
                                fieldName: "no_of_days",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Duration (Days)" }}
                                  />
                                )
                              },
                              {
                                fieldName: "start_date",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Start Date" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {this.dateFormater(row.start_date)}
                                    </span>
                                  );
                                }
                              }
                            ]}
                            keyId="item_id"
                            dataSource={{
                              data: this.state.itemlist
                            }}
                            paging={{ page: 0, rowsPerPage: 5 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="row">
                  <div className="col-lg-7" />
                  <div className="col-lg-5" style={{ textAlign: "right" }}>
                    <div className="row">
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Sub Total Amount"
                          }}
                        />
                        <h6>
                          {this.state.sub_total_amount
                            ? "₹" + this.state.sub_total_amount
                            : "₹0.00"}
                        </h6>
                      </div>
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Discount Amount"
                          }}
                        />
                        <h6>
                          {this.state.discount_amount
                            ? "₹" + this.state.discount_amount
                            : "₹0.00"}
                        </h6>
                      </div>

                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "net_total"
                          }}
                        />
                        <h6>
                          {this.state.net_total
                            ? "₹" + this.state.net_total
                            : "₹0.00"}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="row">
                  <div className="col-lg-4">
                    <Paper className="Paper">
                      <div className="row">
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Copay Amount"
                            }}
                          />
                          <h6>
                            {this.state.copay_amount
                              ? "₹" + this.state.copay_amount
                              : "₹0.00"}
                          </h6>
                        </div>
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Deductable Amount"
                            }}
                          />
                          <h6>
                            {this.state.deductable_amount
                              ? "₹" + this.state.deductable_amount
                              : "₹0.00"}
                          </h6>
                        </div>
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Sec Copay Amount"
                            }}
                          />
                          <h6>
                            {this.state.sec_copay_amount
                              ? "₹" + this.state.sec_copay_amount
                              : "₹0.00"}
                          </h6>
                        </div>
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Sec Deductable Amount"
                            }}
                          />
                          <h6>
                            {this.state.sec_deductable_amount
                              ? "₹" + this.state.sec_deductable_amount
                              : "₹0.00"}
                          </h6>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12 patientRespo">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Patient"
                            }}
                          />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Responsibility"
                                }}
                              />
                              <h6>
                                {this.state.patient_res
                                  ? "₹" + this.state.patient_res
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Tax"
                                }}
                              />
                              <h6>
                                {this.state.patient_tax
                                  ? "₹" + this.state.patient_tax
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Payable"
                                }}
                              />
                              <h6>
                                {this.state.patient_payable_h
                                  ? "₹" + this.state.patient_payable_h
                                  : "₹0.00"}
                              </h6>
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-lg-1"> &nbsp; </div> */}

                        <div className="col-lg-12">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Company"
                            }}
                          />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Responsibility"
                                }}
                              />
                              <h6>
                                {this.state.company_res
                                  ? "₹" + this.state.company_res
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Tax"
                                }}
                              />
                              <h6>
                                {this.state.company_tax
                                  ? "₹" + this.state.company_tax
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Payable"
                                }}
                              />
                              <h6>
                                {this.state.company_payble
                                  ? "₹" + this.state.company_payble
                                  : "₹0.00"}
                              </h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Secondary Company"
                            }}
                          />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Responsibility"
                                }}
                              />
                              <h6>
                                {this.state.sec_company_res
                                  ? "₹" + this.state.sec_company_res
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Tax"
                                }}
                              />
                              <h6>
                                {this.state.sec_company_tax
                                  ? "₹" + this.state.sec_company_tax
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Payable"
                                }}
                              />
                              <h6>
                                {this.state.sec_company_paybale
                                  ? "₹" + this.state.sec_company_paybale
                                  : "₹0.00"}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Paper>
                  </div>

                  <div className="col-lg-8">
                    <Paper className="Paper">
                      <div className="row secondary-box-container">
                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            forceLabel: "discount %"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_percentage,
                            className: "txt-fld",
                            name: "sheet_discount_percentage",

                            events: {
                              onChange: discounthandle.bind(this, this, context)
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            forceLabel: "Discount Amount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_amount,
                            className: "txt-fld",
                            name: "sheet_discount_amount",

                            events: {
                              onChange: discounthandle.bind(this, this, context)
                            }
                          }}
                        />
                      </div>

                      <hr />
                      <div
                        className="row secondary-box-container"
                        style={{ marginBottom: "10px" }}
                      >
                        {/* <div className="col-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "advance_amount"
                            }}
                          />
                          <h6>
                            {this.state.company_payble
                              ? "₹" + this.state.advance_amount
                              : "₹0.00"}
                          </h6>
                        </div> */}

                        <div className="col-3">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Net Amount"
                            }}
                          />
                          <h6>
                            {this.state.net_amount
                              ? "₹" + this.state.net_amount
                              : "₹0.00"}
                          </h6>
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            forceLabel: "Credit Amount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.credit_amount,
                            className: "txt-fld",
                            name: "state_credit_amount",

                            events: {
                              onChange: null
                            }
                          }}
                        />

                        <div
                          className="col-3"
                          style={{
                            background: " #44b8bd",
                            color: " #fff"
                          }}
                        >
                          <AlgaehLabel
                            label={{
                              fieldName: "Receiveable Amount"
                            }}
                          />
                          <h4>
                            {this.state.receiveable_amount
                              ? "₹" + this.state.receiveable_amount
                              : "₹0.00"}
                          </h4>
                        </div>
                      </div>
                      <ReciptForm />
                    </Paper>
                  </div>
                </div>
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
    servicetype: state.servicetype,
    services: state.services,
    genbill: state.genbill,
    serviceslist: state.serviceslist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      generateBill: AlgaehActions,
      billingCalculations: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PosListItems)
);
