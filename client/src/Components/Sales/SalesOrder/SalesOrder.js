import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./SalesOrder.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import MyContext from "../../../utils/MyContext";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import {
  customerTexthandle,
  texthandle,
  SalesQuotationSearch,
  ClearData,
  SaveSalesOrderEnrty,
  getCtrlCode,
  generateSalesOrderReport,
  getSalesOptions,
  employeeSearch,
  dateValidate,
  datehandle,
  AuthorizeOrderEntry,
  CancelSalesServiceOrder,
  getCostCenters
} from "./SalesOrderEvents";
import { AlgaehActions } from "../../../actions/algaehActions";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import { MainContext } from "algaeh-react-components/context";
import SalesOrdListItems from "./SalesOrdListItems/SalesOrdListItems";
import SalesOrdListService from "./SalesOrdListService/SalesOrdListService";

class SalesOrder extends Component {
  constructor(props) {
    super(props);

    this.HRMNGMT_Active = false;

    this.state = {
      hims_f_sales_order_id: null,
      sales_quotation_number: null,
      sales_quotation_id: null,
      sales_order_number: null,
      sales_order_date: new Date(),
      sales_order_mode: "I",
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
      project_id: null,
      customer_po_no: null,
      // tax_percentage: null,
      selectedData: false,
      sales_order_items: [],
      sales_order_services: [],
      decimal_place: null,
      saveEnable: true,
      dataExists: false,
      hospital_id: null,
      services_required: "N",
      sales_person_id: null,
      employee_name: null,
      delivery_date: null,
      sales_order_auth_level: "1",
      grid_edit: false,
      cancelDisable: false,
      organizations: [],
      cost_projects: []
    };
    getSalesOptions(this, this);
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.setState({
      decimal_place: userToken.decimal_places
      // hospital_id: userToken.hims_d_hospital_id
    });

    this.HRMNGMT_Active =
      userToken.product_type === "HIMS_ERP" ||
        userToken.product_type === "HRMS" ||
        userToken.product_type === "HRMS_ERP" ||
        userToken.product_type === "FINANCE_ERP"
        ? true
        : false;
    if (this.props.itemlist === undefined || this.props.itemlist.length === 0) {
      this.props.getItems({
        uri: "/inventory/getItemMaster",
        module: "inventory",
        data: { item_status: "A" },
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "itemlist"
        }
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
          mappingName: "customer_data"
        }
      });
    }

    // this.props.getDivisionProject({
    //   uri: "/projectjobcosting/getDivisionProject",
    //   module: "hrManagement",
    //   method: "GET",
    //   data: {
    //     division_id: userToken.hims_d_hospital_id
    //   },
    //   method: "GET",
    //   redux: {
    //     type: "PROJECT_GET_DATA",
    //     mappingName: "projects"
    //   }
    // });

    getCostCenters(this);
    if (
      this.props.sales_order_number !== undefined &&
      this.props.sales_order_number.length !== 0
    ) {
      getCtrlCode(this, this.props.sales_order_number);
    }
  }

  render() {
    const class_finder = this.state.dataExists === true ? " disableFinder" : "";

    const class_emp_finder =
      this.state.selectedData === true ? " disableFinder" : "";
    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel label={{ forceLabel: "Sales Order", align: "ltr" }} />
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
                  label={{ forceLabel: "Sales Order", align: "ltr" }}
                />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "SO Number", returnText: true }}
              />
            ),
            value: this.state.sales_order_number,
            selectValue: "sales_order_number",
            events: {
              onChange: getCtrlCode.bind(this, this)
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Sales.SalesOrder"
            },
            searchName: "SalesOrder"
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "SO Date"
                  }}
                />
                <h6>
                  {this.state.sales_order_date
                    ? moment(this.state.sales_order_date).format(
                      Options.dateFormat
                    )
                    : Options.dateFormat}
                </h6>
              </div>

              {this.state.dataExists === true ? (
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Order Status"
                    }}
                  />
                  <h6>
                    {this.state.cancelled === "Y" ? (
                      <span className="badge badge-danger">Cancelled</span>
                    ) : this.state.authorize1 === "Y" &&
                      this.state.authorize2 === "Y" &&
                      this.state.is_completed === "N" ? (
                          <span className="badge badge-success">
                            Authorized / Dispatch Pending
                      </span>
                        ) : this.state.authorize1 === "Y" &&
                          this.state.authorize2 === "N" ? (
                            <span className="badge badge-danger">
                              Authorized 2 Pending
                      </span>
                          ) : this.state.authorize1 === "N" &&
                            this.state.authorize2 === "N" ? (
                              <span className="badge badge-danger">Pending</span>
                            ) : this.state.is_completed === "Y" &&
                              this.state.invoice_generated === "N" ? (
                                <span className="badge badge-danger">
                                  Invoice Generation Pending
                      </span>
                              ) : this.state.invoice_generated === "Y" ? (
                                <span className="badge badge-success">
                                  Invoice Generated
                      </span>
                              ) : (
                                  <span className="badge badge-danger">Pending</span>
                                )}
                  </h6>
                </div>
              ) : null}
            </div>
          }
          printArea={
            this.state.sales_order_number !== null
              ? {
                menuitems: [
                  {
                    label: "Sales Order Report",
                    events: {
                      onClick: () => {
                        generateSalesOrderReport(this.state);
                      }
                    }
                  }
                ]
              }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div className="hims-purchase-order-entry">
          <div
            className="row  inner-top-search"
            data-validate="HeaderDiv"
            style={{ marginTop: 76, paddingBottom: 10 }}
          >
            {/* Patient code */}
            <div className="col-lg-12">
              <div className="row">
                {this.state.services_required === "Y" ? (
                  <div className="col ">
                    <label>Order Mode</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="I"
                          name="sales_order_mode"
                          checked={
                            this.state.sales_order_mode === "I" ? true : false
                          }
                          onChange={texthandle.bind(this, this)}
                          disabled={this.state.dataExitst}
                        />
                        <span>Item</span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="S"
                          name="sales_order_mode"
                          checked={
                            this.state.sales_order_mode === "S" ? true : false
                          }
                          onChange={texthandle.bind(this, this)}
                          disabled={this.state.dataExitst}
                        />
                        <span>Service</span>
                      </label>
                    </div>
                  </div>
                ) : null}

                <div className={"col-2 globalSearchCntr" + class_finder}>
                  <AlgaehLabel
                    label={{ forceLabel: "Search by Quotation No." }}
                  />
                  <h6 onClick={SalesQuotationSearch.bind(this, this)}>
                    {this.state.sales_quotation_number
                      ? this.state.sales_quotation_number
                      : "Quotation No."}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>

                <AlagehAutoComplete
                  div={{ className: "col form-group mandatory" }}
                  label={{ forceLabel: "Customer", isImp: true }}
                  selector={{
                    name: "customer_id",
                    className: "select-fld",
                    value: this.state.customer_id,
                    dataSource: {
                      textField: "customer_name",
                      valueField: "hims_d_customer_id",
                      data: this.props.customer_data
                    },
                    onChange: customerTexthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        customer_id: null
                      });
                    },
                    autoComplete: "off",
                    others: {
                      disabled: this.state.selectedData
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col mandatory  form-group " }}
                  label={{ forceLabel: "Payment Terms", isImp: true }}
                  selector={{
                    sort: "off",
                    name: "payment_terms",
                    className: "select-fld",
                    value: this.state.payment_terms,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.PAYMENT_TERMS
                    },
                    others: {
                      disabled: this.state.selectedData
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        payment_terms: null
                      });
                    }
                  }}
                />

                {this.HRMNGMT_Active ? (
                  <div
                    className={
                      "col globalSearchCntr form-group mandatory" +
                      class_emp_finder
                    }
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Sales Person", isImp: true }}
                    />
                    <h6 onClick={employeeSearch.bind(this, this)}>
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
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "sales_man",
                        value: this.state.sales_man,
                        events: {
                          onChange: texthandle.bind(this, this)
                        },
                        others: {
                          disabled: this.state.dataExists
                        }
                      }}
                    />
                  )}
              </div>
              <div className="row">
                <AlgaehDateHandler
                  div={{ className: "col mandatory" }}
                  label={{ forceLabel: "Delivery Date", isImp: true }}
                  textBox={{
                    className: "txt-fld",
                    name: "delivery_date"
                  }}
                  minDate={new Date()}
                  events={{
                    onChange: datehandle.bind(this, this),
                    onBlur: dateValidate.bind(this, this)
                  }}
                  disabled={this.state.dataExists}
                  value={this.state.delivery_date}
                />

                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Ref No.",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "reference_number",
                    value: this.state.reference_number,
                    events: {
                      onChange: texthandle.bind(this, this)
                    },
                    others: {
                      disabled: this.state.dataExists
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-2 form-group mandatory" }}
                  label={{
                    forceLabel: "Select Project",
                    isImp: true
                  }}
                  selector={{
                    name: "project_id",
                    className: "select-fld",
                    value: this.state.project_id,
                    dataSource: {
                      textField: "cost_center",
                      valueField: "cost_center_id",
                      data: this.state.cost_projects
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      disabled: this.state.dataExists
                    },
                    onClear: () => {
                      this.setState({
                        project_id: null,
                        hospital_id: null,
                        organizations: []
                      });
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-2 mandatory" }}
                  label={{
                    forceLabel: "Select Branch",
                    isImp: true
                  }}
                  selector={{
                    name: "hospital_id",
                    className: "select-fld",
                    value: this.state.hospital_id,
                    dataSource: {
                      textField: "hospital_name",
                      valueField: "hims_d_hospital_id",
                      data: this.state.organizations
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      disabled: this.state.dataExists
                    },
                    onClear: () => {
                      this.setState({
                        hospital_id: null
                      });
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-2 mandatory" }}
                  label={{
                    forceLabel: "Customer PO No.",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "customer_po_no",
                    value: this.state.customer_po_no,
                    events: {
                      onChange: texthandle.bind(this, this)
                    },
                    others: {
                      disabled: this.state.dataExists
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: obj => {
                  this.setState({ ...obj });
                }
              }}
            >
              {this.state.sales_order_mode === "S" ? (
                <SalesOrdListService SALESIOputs={this.state} />
              ) : (
                  <SalesOrdListItems
                    SALESIOputs={this.state}
                    sales_order_number={this.props.sales_order_number}
                  />
                )}
            </MyContext.Provider>
          </div>
        </div>

        <div className="row">
          <div className="col-3"></div>
          <div className="col-9" style={{ textAlign: "right" }}>
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Sub Total"
                  }}
                />
                <h6>{GetAmountFormart(this.state.sub_total)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Discount Amount"
                  }}
                />
                <h6>{GetAmountFormart(this.state.discount_amount)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Net Total"
                  }}
                />
                <h6>{GetAmountFormart(this.state.net_total)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Tax"
                  }}
                />
                <h6>{GetAmountFormart(this.state.total_tax)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Net Total"
                  }}
                />
                <h6>{GetAmountFormart(this.state.net_payable)}</h6>
              </div>
              <AlagehFormGroup
                div={{ className: "col-3 textAreaLeft" }}
                label={{
                  forceLabel: "Narration",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "narration",
                  value: this.state.narration,
                  events: {
                    onChange: texthandle.bind(this, this)
                  },
                  others: {
                    disabled: this.state.dataExists,
                    multiline: true,
                    rows: "4"
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={SaveSalesOrderEnrty.bind(this, this)}
                disabled={this.state.saveEnable}
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Save Order",
                    returnText: true
                  }}
                />
              </button>

              <button
                type="button"
                className="btn btn-default"
                disabled={this.state.ClearDisable}
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>

              {this.props.order_auth === true ? (
                <div>
                  {this.state.sales_order_mode === "S" ? (
                    <button
                      type="button"
                      className="btn btn-default"
                      disabled={this.state.cancelDisable}
                      onClick={CancelSalesServiceOrder.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Cancel", returnText: true }}
                      />
                    </button>
                  ) : null}

                  {this.state.cancelled === "N" ? (
                    <button
                      type="button"
                      className="btn btn-other"
                      disabled={
                        this.state.authBtnEnable === true
                          ? true
                          : this.state.authorize1 === "Y" &&
                            this.state.authorize2 === "Y"
                            ? true
                            : false
                      }
                      onClick={AuthorizeOrderEntry.bind(
                        this,
                        this,
                        this.state.authorize1 === "N"
                          ? "authorize1"
                          : "authorize2"
                      )}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel:
                            this.state.authorize1 === "N"
                              ? "Authorize 1"
                              : this.state.sales_order_auth_level === "2"
                                ? "Authorize 2"
                                : "Authorize 1",
                          returnText: true
                        }}
                      />
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemlist: state.itemlist,
    itemuom: state.itemuom,
    customer_data: state.customer_data
    // cost_projects: state.cost_projects
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getItemUOM: AlgaehActions,
      getCustomerMaster: AlgaehActions
      // getDivisionProject: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SalesOrder)
);
