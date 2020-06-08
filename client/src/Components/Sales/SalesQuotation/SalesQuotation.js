import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import {
  datehandle,
  changeTexts,
  customerTexthandle,
  ClearData,
  SaveSalesQuotation,
  getCtrlCode,
  dateValidate,
  getSalesOptions,
  employeeSearch,
  addToTermCondition,
  deleteComment,
  generateSalesQuotation,
  CancelQuotation,
} from "./SalesQuotationEvents";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import "./SalesQuotation.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";

import GlobalVariables from "../../../utils/GlobalVariables.json";
import SalesListItems from "./SalesListItems/SalesListItems";
import SalesListService from "./SalesListService/SalesListService";

import MyContext from "../../../utils/MyContext";
import Options from "../../../Options.json";
import { MainContext } from "algaeh-react-components/context";

class SalesQuotation extends Component {
  constructor(props) {
    super(props);

    this.HRMNGMT_Active = false;

    this.state = {
      hims_f_sales_quotation_id: null,
      sales_quotation_number: null,
      sales_quotation_date: new Date(),
      sales_quotation_mode: "I",
      reference_number: null,
      customer_id: null,
      quote_validity: null,
      sales_man: null,
      payment_terms: null,
      service_terms: null,
      other_terms: null,
      sub_total: null,
      discount_amount: null,
      net_total: null,
      total_tax: null,
      net_payable: null,
      narration: null,
      delivery_date: null,
      no_of_days_followup: 0,

      // tax_percentage: null,

      sales_quotation_items: [],
      sales_quotation_services: [],
      decimal_place: null,
      saveEnable: true,
      dataExists: false,
      comments: null,
      terms_conditions: null,
      services_required: "N",
      sales_person_id: null,
      employee_name: null,
      hospital_id: null,
      hims_f_terms_condition_id: null,
      selected_terms_conditions: "",
      comment_list: [],
      qotation_status: "G",
      log_sales_person_id: null,
      log_employee_name: null,
      cancelEnable: true,
      detele_services: [],
      detele_items: [],
      edit_mode: false,
    };
    getSalesOptions(this, this);
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.setState({
      decimal_place: userToken.decimal_places,
      hospital_id: userToken.hims_d_hospital_id,
      sales_person_id: userToken.employee_id,
      employee_name: userToken.full_name,
      log_sales_person_id: userToken.employee_id,
      log_employee_name: userToken.full_name,
    });

    this.HRMNGMT_Active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HRMS" ||
      userToken.product_type === "HRMS_ERP" ||
      userToken.product_type === "FINANCE_ERP"
        ? true
        : false;

    if (
      this.props.opitemlist === undefined ||
      this.props.opitemlist.length === 0
    ) {
      this.props.getItems({
        uri: "/inventory/getItemMaster",
        module: "inventory",
        data: { item_status: "A" },
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "opitemlist",
        },
      });
    }

    if (
      this.props.customer_data === undefined ||
      this.props.customer_data.length === 0
    ) {
      this.props.getCustomerMaster({
        uri: "/customer/getCustomerMaster",
        module: "masterSettings",
        data: { customer_status: "A" },
        method: "GET",
        redux: {
          type: "CUSTOMER_GET_DATA",
          mappingName: "customer_data",
        },
      });
    }

    this.props.getTermsConditions({
      uri: "/salseSetup/getTermsConditions",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "TERMS_COND_GET_DATA",
        mappingName: "terms_conditions",
      },
    });

    if (
      this.props.sales_quotation_number !== undefined &&
      this.props.sales_quotation_number.length !== 0
    ) {
      getCtrlCode(this, this.props.sales_quotation_number);
    }
  }

  EditQuotation(e) {
    this.setState({
      dataExists: false,
      saveEnable: false,
      edit_mode: true,
      cancelEnable: true,
    });
  }

  render() {
    const class_finder = this.state.dataExists === true ? " disableFinder" : "";
    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Sales Quotation", align: "ltr" }}
              />
            }
            breadStyle={this.props.breadStyle}
            pageNavPath={[
              {
                pageName: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Home",
                      align: "ltr",
                    }}
                  />
                ),
              },
              {
                pageName: (
                  <AlgaehLabel
                    label={{ forceLabel: "Sales Quotation", align: "ltr" }}
                  />
                ),
              },
            ]}
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Sales Quotation Number",
                    returnText: true,
                  }}
                />
              ),
              value: this.state.sales_quotation_number,
              selectValue: "sales_quotation_number",
              events: {
                onChange: getCtrlCode.bind(this, this),
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "Sales.SalesQuotation",
              },
              searchName: "SalesQuotation",
            }}
            userArea={
              <div className="row">
                <div className="col-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Sales Quotation Date",
                    }}
                  />
                  <h6>
                    {this.state.sales_quotation_date
                      ? moment(this.state.sales_quotation_date).format(
                          Options.dateFormat
                        )
                      : Options.dateFormat}
                  </h6>
                </div>

                {this.state.dataExists === true ? (
                  <div className="col-6">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Quotation Status",
                      }}
                    />
                    <h6>
                      {this.state.qotation_status === "G" ? (
                        <span className="badge badge-warning">
                          Quotation Generated
                        </span>
                      ) : this.state.qotation_status === "O" ? (
                        <span className="badge badge-info">Order Created</span>
                      ) : this.state.qotation_status === "CL" ? (
                        <span className="badge badge-danger">
                          Quotation Cancelled
                        </span>
                      ) : (
                        <span className="badge badge-success">Closed</span>
                      )}
                    </h6>
                  </div>
                ) : null}
              </div>
            }
            printArea={
              this.state.sales_quotation_number !== null
                ? {
                    menuitems: [
                      {
                        label: "Print Quotation",
                        events: {
                          onClick: () => {
                            generateSalesQuotation(this, this.state);
                          },
                        },
                      },
                    ],
                  }
                : ""
            }
            selectedLang={this.state.selectedLang}
          />
          <div
            className="row  inner-top-search"
            data-validate="HeaderDiv"
            style={{ marginTop: 76, paddingBottom: 10 }}
          >
            {/* Patient code */}
            <div className="col-lg-12">
              <div className="row">
                {/* <div className="col">
                  <label>Quotation Mode</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="I"
                        name="sales_quotation_mode"
                        disabled={this.state.dataExists}
                        checked={
                          this.state.sales_quotation_mode === "I" ? true : false
                        }
                        onChange={changeTexts.bind(this, this)}
                      />
                      <span>Item</span>
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="S"
                        name="sales_quotation_mode"
                        disabled={this.state.dataExists}
                        checked={
                          this.state.sales_quotation_mode === "S" ? true : false
                        }
                        onChange={changeTexts.bind(this, this)}
                      />
                      <span>Service</span>
                    </label>
                  </div>
                </div> */}

                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{ forceLabel: "Customer", isImp: true }}
                  selector={{
                    name: "customer_id",
                    className: "select-fld",
                    value: this.state.customer_id,
                    dataSource: {
                      textField: "customer_name",
                      valueField: "hims_d_customer_id",
                      data: this.props.customer_data,
                    },
                    onChange: customerTexthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        customer_id: null,
                      });
                    },
                    autoComplete: "off",
                    others: {
                      disabled:
                        this.state.dataExists === false
                          ? this.state.edit_mode
                          : true,
                    },
                  }}
                />

                {this.HRMNGMT_Active ? (
                  <div className={"col globalSearchCntr" + class_finder}>
                    <AlgaehLabel
                      label={{ forceLabel: "Sales Person", isImp: true }}
                    />
                    <h6
                      className="mandatory"
                      onClick={employeeSearch.bind(this, this)}
                    >
                      {this.state.employee_name
                        ? this.state.employee_name
                        : "Search Employee"}
                      <i className="fas fa-search fa-lg" />
                    </h6>
                  </div>
                ) : (
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Name of Sales Person",
                      isImp: false,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "sales_man",
                      value: this.state.sales_man,
                      events: {
                        onChange: changeTexts.bind(this, this),
                      },
                      others: {
                        disabled: this.state.dataExists,
                      },
                    }}
                  />
                )}
                <AlgaehDateHandler
                  div={{ className: "col mandatory" }}
                  label={{ forceLabel: "quote validity", isImp: true }}
                  textBox={{
                    className: "txt-fld",
                    name: "quote_validity",
                  }}
                  minDate={new Date()}
                  events={{
                    onChange: datehandle.bind(this, this),
                    onBlur: dateValidate.bind(this, this),
                  }}
                  disabled={this.state.dataExists}
                  value={this.state.quote_validity}
                />

                <AlgaehDateHandler
                  div={{ className: "col mandatory" }}
                  label={{ forceLabel: "Delivery Date", isImp: true }}
                  textBox={{
                    className: "txt-fld",
                    name: "delivery_date",
                  }}
                  minDate={new Date()}
                  events={{
                    onChange: datehandle.bind(this, this),
                    onBlur: dateValidate.bind(this, this),
                  }}
                  disabled={this.state.dataExists}
                  value={this.state.delivery_date}
                />

                <AlagehFormGroup
                  div={{ className: "col form-group" }}
                  label={{
                    forceLabel: "Days To Follow Up",
                  }}
                  textBox={{
                    number: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    className: "txt-fld",
                    name: "no_of_days_followup",
                    value: this.state.no_of_days_followup,
                    dontAllowKeys: ["-", "e", "."],
                    events: {
                      onChange: changeTexts.bind(this, this),
                    },
                    others: {
                      disabled: this.state.dataExists,
                    },
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{ forceLabel: "Payment Terms", isImp: true }}
                  selector={{
                    sort: "off",
                    name: "payment_terms",
                    className: "select-fld",
                    value: this.state.payment_terms,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.PAYMENT_TERMS,
                    },
                    others: {
                      disabled: this.state.dataExists,
                    },
                    onChange: changeTexts.bind(this, this),
                    onClear: () => {
                      this.setState({
                        payment_terms: null,
                      });
                    },
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Ref No.",
                    isImp: false,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "reference_number",
                    value: this.state.reference_number,
                    events: {
                      onChange: changeTexts.bind(this, this),
                    },
                    others: {
                      disabled: this.state.dataExists,
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="">
            <div className="row">
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-3">
                            <label className="style_Label ">
                              Total Item Amount
                            </label>
                            <h6>0.00</h6>
                          </div>{" "}
                          <i className="fas fa-plus calcSybmbol"></i>{" "}
                          <div className="col-3">
                            <label className="style_Label ">
                              Total Service Amount
                            </label>
                            <h6>0.00</h6>
                          </div>{" "}
                          <i className="fas fa-equals calcSybmbol"></i>{" "}
                          <div className="col-3">
                            <label className="style_Label ">
                              Total Quotation Amount
                            </label>
                            <h6>0.00</h6>
                          </div>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <MyContext.Provider
                value={{
                  state: this.state,
                  updateState: (obj) => {
                    this.setState({ ...obj });
                  },
                }}
              >
                <SalesListItems SALESIOputs={this.state} />
                {this.state.services_required === "Y" ? (
                  <SalesListService SALESIOputs={this.state} />
                ) : null}
              </MyContext.Provider>

              <div className="col-12">
                <div
                  className="portlet portlet-bordered margin-bottom-15"
                  style={{ marginBottom: 60 }}
                >
                  <div className="row">
                    <div className="col-4">
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col-12  form-group mandatory" }}
                          label={{ forceLabel: "Select T&C", isImp: true }}
                          selector={{
                            name: "hims_f_terms_condition_id",
                            className: "select-fld",
                            value: this.state.hims_f_terms_condition_id,
                            dataSource: {
                              textField: "short_name",
                              valueField: "hims_f_terms_condition_id",
                              data: this.props.terms_conditions,
                            },
                            onChange: changeTexts.bind(this, this),
                            onClear: () => {
                              this.setState({
                                hims_f_terms_condition_id: null,
                                selected_terms_conditions: "",
                              });
                            },
                            autoComplete: "off",
                            others: {
                              disabled: this.state.dataExists,
                            },
                          }}
                        />

                        <div className="col-12 form-group">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Enter T&C",
                            }}
                          />

                          <textarea
                            value={this.state.selected_terms_conditions}
                            name="selected_terms_conditions"
                            onChange={changeTexts.bind(this, this)}
                            disabled={this.state.dataExists}
                          />
                        </div>
                        {this.state.dataExists ? null : (
                          <div className="col" style={{ textAlign: "right" }}>
                            {" "}
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={addToTermCondition.bind(this, this)}
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-4">
                      <label>Preview Terms & Conditions</label>
                      <ol className="ViewTC">
                        {this.state.comment_list.length > 0
                          ? this.state.comment_list.map((row, index) => {
                              return (
                                <React.Fragment key={index}>
                                  <li key={index}>
                                    <span>{row}</span>
                                    {this.state.dataExists ? null : (
                                      <i
                                        className="fas fa-times"
                                        onClick={deleteComment.bind(
                                          this,
                                          this,
                                          row
                                        )}
                                      ></i>
                                    )}
                                  </li>
                                </React.Fragment>
                              );
                            })
                          : null}
                      </ol>
                    </div>
                    <div className="col-4">
                      <div className="row">
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Narration",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "narration",
                            value: this.state.narration,
                            events: {
                              onChange: changeTexts.bind(this, this),
                            },
                            others: {
                              multiline: true,
                              disabled: this.state.dataExists,
                              rows: "4",
                            },
                          }}
                        />

                        {this.props.requisition_auth ? (
                          <AlagehFormGroup
                            div={{ className: "col-12  form-group" }}
                            label={{
                              forceLabel: "Comments",
                              isImp: false,
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "comments",
                              value: this.state.comments,
                              events: {
                                onChange: changeTexts.bind(this, this),
                              },
                              others: {
                                multiline: true,
                                rows: "8",
                              },
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Sub Total"
                      }}
                    />
                    <h6>{getAmountFormart(this.state.sub_total)}</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Discount Amount"
                      }}
                    />
                    <h6>{getAmountFormart(this.state.discount_amount)}</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Net Total"
                      }}
                    />
                    <h6>{getAmountFormart(this.state.net_total)}</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total Tax"
                      }}
                    />
                    <h6>{getAmountFormart(this.state.total_tax)}</h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Net Payable"
                      }}
                    />
                    <h6>{getAmountFormart(this.state.net_payable)}</h6>
                  </div> */}
            </div>

            <div className="hptl-phase1-footer">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={SaveSalesQuotation.bind(this, this)}
                    disabled={this.state.saveEnable}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Save",
                        returnText: true,
                      }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={ClearData.bind(this, this)}
                    disabled={this.props.requisition_auth ? true : false}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Clear", returnText: true }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={CancelQuotation.bind(this, this)}
                    disabled={this.state.cancelEnable}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Cancel",
                        returnText: true,
                      }}
                    />
                  </button>

                  {this.props.requisition_auth ? (
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={SaveSalesQuotation.bind(this, this)}
                      disabled={
                        this.state.qotation_status === "G"
                          ? this.state.edit_mode
                          : true
                      }
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Update", returnText: true }}
                      />
                    </button>
                  ) : null}

                  {this.props.requisition_auth ? (
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={this.EditQuotation.bind(this, this)}
                      disabled={this.state.edit_mode === true ? true : false}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Edit", returnText: true }}
                      />
                    </button>
                  ) : null}
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
    opitemlist: state.opitemlist,
    customer_data: state.customer_data,
    terms_conditions: state.terms_conditions,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getCustomerMaster: AlgaehActions,
      getTermsConditions: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SalesQuotation)
);
