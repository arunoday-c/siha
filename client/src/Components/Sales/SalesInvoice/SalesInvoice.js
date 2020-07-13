import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./SalesInvoice.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
// import ReceiptItemList from "./ReceiptItemList/ReceiptItemList";
// import GlobalVariables from "../../../utils/GlobalVariables.json";

import {
  ClearData,
  SaveInvoiceEnrty,
  getCtrlCode,
  SalesOrderSearch,
  texthandle,
  PostSalesInvoice,
  generateSalesInvoiceReport,
} from "./SalesInvoiceEvents";
import { AlgaehActions } from "../../../actions/algaehActions";
// import SalesInvoiceInp from "../../../Models/SalesInvoice";
import MyContext from "../../../utils/MyContext";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import { MainContext } from "algaeh-react-components";
import InvoiceListService from "./InvoiceListService/InvoiceListService";
import InvoiceItemList from "./InvoiceItemList/InvoiceItemList";
import SalesInvoiceIO from "../../../Models/SalesInvoice";

class SalesInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let IOputs = SalesInvoiceIO.inputParam();
    this.setState(IOputs);
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.props.getOrganizations({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      redux: {
        type: "ORGS_GET_DATA",
        mappingName: "organizations",
      },
    });

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

    this.props.getDivisionProject({
      uri: "/projectjobcosting/getDivisionProject",
      module: "hrManagement",
      method: "GET",
      data: {
        division_id: userToken.hims_d_hospital_id,
      },
      redux: {
        type: "PROJECT_GET_DATA",
        mappingName: "projects",
      },
    });
  }

  render() {
    const class_finder = this.state.dataExitst === true ? " disableFinder" : "";

    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Invoice Entry", align: "ltr" }}
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
                  label={{ forceLabel: "Invoice Entry", align: "ltr" }}
                />
              ),
            },
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "Invoice Number", returnText: true }}
              />
            ),
            value: this.state.invoice_number,
            selectValue: "invoice_number",
            events: {
              onChange: getCtrlCode.bind(this, this),
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Sales.SalesInvoice",
            },
            searchName: "SalesInvoice",
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Invoice Date",
                  }}
                />
                <h6>
                  {this.state.invoice_date
                    ? moment(this.state.invoice_date).format(Options.dateFormat)
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          printArea={
            this.state.hims_f_sales_invoice_header_id !== null
              ? {
                  menuitems: [
                    {
                      label: "Print Invoice",
                      events: {
                        onClick: () => {
                          generateSalesInvoiceReport(this.state);
                        },
                      },
                    },
                  ],
                }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div className="hims-receipt-entry">
          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <div className="col-2">
                  <label>Invoice Mode</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="I"
                        name="sales_invoice_mode"
                        checked={
                          this.state.sales_invoice_mode === "I" ? true : false
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
                        name="sales_invoice_mode"
                        checked={
                          this.state.sales_invoice_mode === "S" ? true : false
                        }
                        onChange={texthandle.bind(this, this)}
                        disabled={this.state.dataExitst}
                      />
                      <span>Service</span>
                    </label>
                  </div>
                </div>

                <div className="col">
                  <div className="row">
                    <div className={"col-3 globalSearchCntr" + class_finder}>
                      <AlgaehLabel label={{ forceLabel: "Search Order No." }} />
                      <h6 onClick={SalesOrderSearch.bind(this, this)}>
                        {this.state.sales_order_number
                          ? this.state.sales_order_number
                          : "Order No."}
                        <i className="fas fa-search fa-lg"></i>
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel label={{ forceLabel: "Customer" }} />
                      <h6>
                        {this.state.customer_name
                          ? this.state.customer_name
                          : "------"}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel label={{ forceLabel: "Branch" }} />
                      <h6>
                        {this.state.hospital_name
                          ? this.state.hospital_name
                          : "------"}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel label={{ forceLabel: "Project" }} />
                      <h6>
                        {this.state.project_name
                          ? this.state.project_name
                          : "------"}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel label={{ forceLabel: "Payment Terms" }} />
                      <h6>
                        {this.state.payment_terms
                          ? this.state.payment_terms + " days"
                          : "0 days"}
                      </h6>
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
            {this.state.sales_invoice_mode === "S" ? (
              <div className="row">
                <InvoiceListService SALESInvoiceIOputs={this.state} />
              </div>
            ) : (
              <InvoiceItemList SALESInvoiceIOputs={this.state} />
            )}
          </MyContext.Provider>

          <div className="row">
            <div className="col-3"></div>
            <div className="col-9" style={{ textAlign: "right" }}>
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Sub Total",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.sub_total)}</h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Discount Amount",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.discount_amount)}</h6>
                </div>

                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Net Total",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.net_total)}</h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Tax",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.total_tax)}</h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Net Receivable",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.net_payable)}</h6>
                </div>
              </div>
            </div>
          </div>

          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={SaveInvoiceEnrty.bind(this, this)}
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
                  disabled={this.state.ClearDisable}
                  onClick={ClearData.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Clear", returnText: true }}
                  />
                </button>
                <button
                  type="button"
                  className="btn btn-other"
                  disabled={this.state.postEnable}
                  onClick={PostSalesInvoice.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Post",
                      returnText: true,
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    customer_data: state.customer_data,
    organizations: state.organizations,
    projects: state.projects,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCustomerMaster: AlgaehActions,
      getOrganizations: AlgaehActions,
      getDivisionProject: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SalesInvoice)
);
