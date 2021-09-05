import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./DentalOrder.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import MyContext from "../../../utils/MyContext";
import { swalMessage } from "../../../utils/algaehApiCall";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

// import Options from "../../../Options.json";
// import moment from "moment";
// import GlobalVariables from "../../../utils/GlobalVariables.json";
import { newAlgaehApi } from "../../../hooks";
import {
  customerTexthandle,
  texthandle,
  // SalesQuotationSearch,
  ClearData,
  SaveDentalOrderEnrty,
  getCtrlCode,
  generateDentalOrderReport,
  getSalesOptions,
  // employeeSearch,
  dateValidate,
  datehandle,
  AuthorizeOrderEntry,
  CancelSalesServiceOrder,
  getCostCenters,
  // ContractSearch,
  RejectSalesServiceOrder,
} from "./DentalOrderEvents";
// import { Upload, Modal } from "antd";
import { AlgaehActions } from "../../../actions/algaehActions";
// import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import { MainContext } from "algaeh-react-components";
import DentalOrderService from "./DentalOrdListService/DentalOrdListService";
import { AlgaehSecurityComponent } from "algaeh-react-components";
import { AlgaehModal } from "algaeh-react-components";

class DentalOrder extends Component {
  constructor(props) {
    super(props);

    this.HRMNGMT_Active = false;

    this.state = {
      invoice_files: [],
      invoice_docs: [],
      hims_f_sales_order_id: null,
      sales_quotation_number: null,
      sales_quotation_id: null,
      sales_order_number: null,
      sales_order_date: new Date(),
      sales_order_mode: "I",
      reference_number: null,
      customer_id: null,
      customerDetails: null,
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
      docChanged: false,
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
      cost_projects: [],
      contract_number: null,
      contract_id: null,
      delete_sales_order_items: [],
      delete_sales_order_services: [],
      dataPosted: true,
      itemAdd: false,
      canceled_reason_sales: "",
      rejectVisible: false,
      cancelVisible: false,
      loading: false,
      is_posted: "N",
      is_revert: "N",
      edit_price: false,
      revertDisable: true,
    };
  }

  static contextType = MainContext;
  componentDidMount() {
    getSalesOptions(this);
    const userToken = this.context.userToken;

    this.setState({
      decimal_place: userToken.decimal_places,
      // hospital_id: userToken.hims_d_hospital_id
    });

    this.HRMNGMT_Active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HRMS" ||
      userToken.product_type === "HRMS_ERP" ||
      userToken.product_type === "FINANCE_ERP" ||
      userToken.product_type === "NO_FINANCE"
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
          mappingName: "itemlist",
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

    getCostCenters(this);

    if (
      this.props.hospitaldetails === undefined ||
      this.props.hospitaldetails.length === 0
    ) {
      this.props.getHospitalDetails({
        uri: "/organization/getOrganization",
        method: "GET",
        redux: {
          type: "HOSPITAL_DETAILS_GET_DATA",
          mappingName: "hospitaldetails",
        },
      });
    }

    if (
      this.props.sales_order_number !== undefined &&
      this.props.sales_order_number.length !== 0
    ) {
      const saveDoc = false;
      getCtrlCode(this, saveDoc, this.props.sales_order_number);
    }

    const queryParams = new URLSearchParams(this.props.location.search);
    if (queryParams.get("sales_order_number")) {
      getCtrlCode(this, false, queryParams.get("sales_order_number"));
      this.getDocuments(queryParams.get("sales_order_number"));
    }
  }

  getDocuments = (number) => {
    this.setState({ loading: true }, () => {
      newAlgaehApi({
        uri: "/getInvoiceDoc",
        module: "documentManagement",
        method: "GET",
        data: {
          serial_no: this.state.sales_order_number
            ? this.state.sales_order_number
            : number,
        },
      })
        .then((res) => {
          if (res.data.success) {
            let { data } = res.data;
            this.setState(
              {
                invoice_docs: data,
                invoice_files: [],
                saveEnable: this.state.saveEnable,
                docChanged: false,
                loading: false,
              },
              () => {
                AlgaehLoader({ show: false });
              }
            );
          }
        })
        .catch((e) => {
          this.setState(
            {
              loading: false,
            },
            () => {
              AlgaehLoader({ show: false });
            }
          );

          swalMessage({
            title: e.message,
            type: "error",
          });
        });
    });
  };

  render() {
    // const class_finder =
    //   this.state.selectedData === true ? " disableFinder" : "";

    // const class_emp_finder =
    //   this.state.selectedData === true ? " disableFinder" : "";
    return (
      <div>
        <AlgaehModal
          title={`Reason For Rejection -${this.state.sales_order_number}`}
          visible={this.state.rejectVisible}
          destroyOnClose={true}
          okText="Proceed"
          onOk={RejectSalesServiceOrder.bind(this, this)}
          onCancel={() => {
            this.setState({ rejectVisible: false });
          }}
        >
          <div className="col-12">
            <AlgaehLabel label={{ forceLabel: "comments" }} />
            <textarea
              value={this.state.reject_reason_sales}
              name="reject_reason_sales"
              onChange={texthandle.bind(this, this)}
            />
          </div>
        </AlgaehModal>
        <AlgaehModal
          title={`Reason For Cancelling -${this.state.sales_order_number}`}
          visible={this.state.cancelVisible}
          destroyOnClose={true}
          okText="Proceed"
          onOk={CancelSalesServiceOrder.bind(this, this)}
          onCancel={() => {
            this.setState({ cancelVisible: false });
          }}
        >
          <div className="col-12">
            <AlgaehLabel label={{ forceLabel: "comments" }} />
            <textarea
              value={this.state.canceled_reason_sales}
              name="canceled_reason_sales"
              onChange={texthandle.bind(this, this)}
            />
          </div>
        </AlgaehModal>
        <BreadCrumb
          title={
            <AlgaehLabel label={{ forceLabel: "Dental Order", align: "ltr" }} />
          }
          breadStyle={this.props.breadStyle}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "DO Number", returnText: true }}
              />
            ),
            value: this.state.sales_order_number,
            selectValue: "sales_order_number",
            events: {
              onChange: getCtrlCode.bind(this, this, false),
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Sales.DentalOrder",
            },
            searchName: "DentalOrder",
          }}
          userArea={
            <div className="row" style={{ marginTop: -10 }}>
              <AlgaehDateHandler
                div={{ className: "col-3 mandatory" }}
                label={{
                  forceLabel: "Order Date",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "sales_order_date",
                }}
                maxDate={new Date()}
                events={{
                  onChange: datehandle.bind(this, this),
                  onBlur: dateValidate.bind(this, this),
                }}
                disabled={this.state.selectedData}
                value={this.state.sales_order_date}
              />
              {/* <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "SO Date",
                  }}
                />
                <h6>
                  {this.state.sales_order_date
                    ? moment(this.state.sales_order_date).format(
                      Options.dateFormat
                    )
                    : Options.dateFormat}
                </h6>
              </div> */}

              {this.state.selectedData === true ? (
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Order Status",
                    }}
                  />
                  <h6>
                    {this.state.cancelled === "Y" ? (
                      <span className="badge badge-danger">Cancelled</span>
                    ) : this.state.is_reject === "Y" ? (
                      <span className="badge badge-danger">Rejected</span>
                    ) : this.state.is_posted === "N" &&
                      this.state.is_revert === "N" ? (
                      <span className="badge badge-danger">Not Posted</span>
                    ) : this.state.is_posted === "N" &&
                      this.state.is_revert === "Y" ? (
                      <span className="badge badge-danger">
                        Not Posted/Re-Generate
                      </span>
                    ) : this.state.authorize1 === "Y" &&
                      this.state.authorize2 === "Y" &&
                      this.state.is_completed === "N" ? (
                      this.state.sales_order_mode === "S" ? (
                        <span className="badge badge-success">Authorized</span>
                      ) : (
                        <span className="badge badge-success">
                          Authorized / Dispatch Pending
                        </span>
                      )
                    ) : this.state.authorize1 === "Y" &&
                      this.state.authorize2 === "N" ? (
                      <span className="badge badge-danger">
                        Authorized 2 Pending
                      </span>
                    ) : this.state.authorize1 === "N" &&
                      this.state.authorize2 === "N" ? (
                      <span className="badge badge-danger">
                        Posted/Pending For Authorize
                      </span>
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
              {this.state.dataExists === true ? (
                <div className="col-6 createdUserCntr">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Created By",
                    }}
                  />
                  <h6>{this.state.created_name}</h6>
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
                          generateDentalOrderReport(this.state);
                        },
                      },
                    },
                  ],
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
                      data: this.props.customer_data,
                    },
                    onChange: customerTexthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        customer_id: null,
                        customerDetails: null,
                      });
                    },
                    autoComplete: "off",
                    others: {
                      disabled: this.state.selectedData,
                    },
                  }}
                />

                {this.state.customerDetails !== null ? (
                  <div className="hoverCustomer">
                    <i className="fas fa-eye"></i>
                    <div className="customerDetCntr animated slideInDown faster">
                      <div className="row">
                        <div className="col">
                          <table>
                            <tbody>
                              <tr>
                                <td colSpan="2" className="hdr">
                                  <span>Customer Details:-</span>
                                </td>
                              </tr>
                              <tr>
                                <td>Customer Code:</td>
                                <td>
                                  {this.state.customerDetails.customer_code}
                                </td>
                              </tr>
                              <tr>
                                <td>Customer Name:</td>
                                <td>
                                  {this.state.customerDetails.customer_name}
                                </td>
                              </tr>
                              <tr>
                                <td>BUSINESS REG. NO.</td>
                                <td>
                                  {
                                    this.state.customerDetails
                                      .business_registration_no
                                  }
                                </td>
                              </tr>
                              <tr>
                                <td colSpan="2" className="hdr">
                                  <span>Contact Details:-</span>
                                </td>
                              </tr>
                              <tr>
                                <td>CONTACT NUMBER</td>
                                <td>
                                  {this.state.customerDetails.contact_number}
                                </td>
                              </tr>
                              <tr>
                                <td>Email Address Primary</td>
                                <td>{this.state.customerDetails.email_id_1}</td>
                              </tr>
                              <tr>
                                <td>Email Address Secondary</td>
                                <td>
                                  {this.state.customerDetails.email_id_2
                                    ? this.state.customerDetails.email_id_2
                                    : "---"}
                                </td>
                              </tr>
                              <tr>
                                <td>Address</td>
                                <td>{this.state.customerDetails.address}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col">
                          <table>
                            <tbody>
                              <tr>
                                <td colSpan="2" className="hdr">
                                  <span>Payment Information:-</span>
                                </td>
                              </tr>
                              <tr>
                                <td>PAYMENT TERMS IN DAYS</td>
                                <td>
                                  {this.state.customerDetails.payment_terms}
                                </td>
                              </tr>
                              <tr>
                                <td>PAYMENT MODE</td>
                                <td>
                                  {this.state.customerDetails.payment_mode}
                                </td>
                              </tr>
                              <tr>
                                <td>VAT NUMBER</td>
                                <td>{this.state.customerDetails.vat_number}</td>
                              </tr>
                              <tr>
                                <td>BANK NAME</td>
                                <td>{this.state.customerDetails.bank_name}</td>
                              </tr>
                              <tr>
                                <td>ACCOUNT NUMBER</td>
                                <td>
                                  {this.state.customerDetails.bank_account_no}
                                </td>
                              </tr>
                              <tr>
                                <td>IBAN NUMBER</td>
                                <td>
                                  {this.state.customerDetails.iban_number}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <AlagehAutoComplete
                  div={{ className: "col form-group mandatory" }}
                  label={{ forceLabel: "Ordered By", isImp: true }}
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
                        customerDetails: null,
                      });
                    },
                    autoComplete: "off",
                    others: {
                      disabled: this.state.selectedData,
                    },
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-2  form-group mandatory" }}
                  label={{
                    forceLabel: "Payment Terms in Days",
                    isImp: true,
                  }}
                  textBox={{
                    number: {
                      allowNegative: false,
                      thousandSeparator: ",",
                    },
                    dontAllowKeys: ["-", "e", "."],
                    value: this.state.payment_terms,
                    className: "txt-fld",
                    name: "payment_terms",
                    events: {
                      onChange: texthandle.bind(this, this),
                    },
                    others: {
                      placeholder: "0",
                      disabled: this.state.selectedData,
                    },
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-2 mandatory" }}
                  label={{
                    forceLabel: "Customer PO No.",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "customer_po_no",
                    value: this.state.customer_po_no,
                    events: {
                      onChange: texthandle.bind(this, this),
                    },
                    others: {
                      disabled: this.state.is_posted === "Y" ? true : false,
                    },
                  }}
                />
              </div>
            </div>
          </div>
          {this.state.cancelled === "Y" ? (
            <div className="alert alert-danger">
              <div className="row">
                <div className="col">
                  <p>
                    Cancelled Reason:<b>{this.state.canceled_reason_sales}</b>
                  </p>
                </div>
                <div className="col-4">
                  <p>
                    Cancelled By:<b>{this.state.cancelled_name}</b>
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          {this.state.is_revert === "Y" ? (
            <div className="alert alert-danger">
              <div className="row">
                <div className="col">
                  <p>
                    Reverted Reason:<b>{this.state.revert_reason}</b>
                  </p>
                </div>
                <div className="col-4">
                  <p>
                    Reverted By:<b>{this.state.reverted_name}</b>
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          {this.state.is_reject === "Y" ? (
            <div className="alert alert-danger">
              <div className="row">
                <div className="col">
                  <p>
                    Reject Reason:<b>{this.state.revert_reason}</b>
                  </p>
                </div>
                <div className="col-4">
                  <p>
                    Rejected By:<b>{this.state.rejected_name}</b>
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          <div className="row">
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: (obj) => {
                  this.setState({ ...obj });
                },
              }}
            >
              <DentalOrderService SALESIOputs={this.state} />
            </MyContext.Provider>
          </div>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              {this.state.dataExists &&
              this.state.docChanged &&
              this.state.is_completed !== "Y" ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.saveDocument}
                  disabled={!this.state.docChanged}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Update Documents",
                      returnText: true,
                    }}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={SaveDentalOrderEnrty.bind(this, this, "S")}
                  disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Save Order",
                      returnText: true,
                    }}
                  />
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={SaveDentalOrderEnrty.bind(this, this, "P")}
                disabled={this.state.dataPosted}
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Send For AUthorize",
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

              {this.state.order_auth === true ? (
                <div>
                  <AlgaehSecurityComponent componentCode="SALES_ORD_REJECT">
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={this.state.revertDisable}
                      onClick={() => {
                        this.setState({ rejectVisible: true });
                      }}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Reject", returnText: true }}
                      />
                    </button>
                  </AlgaehSecurityComponent>

                  <AlgaehSecurityComponent componentCode="SALES_ORD_CANCEL">
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={this.state.cancelDisable}
                      onClick={() => {
                        this.setState({ cancelVisible: true });
                      }}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Cancel", returnText: true }}
                      />
                    </button>
                  </AlgaehSecurityComponent>

                  {this.state.invoice_generated === "N" ? (
                    <AlgaehSecurityComponent componentCode="SALES_ORD_EDIT_PRICE">
                      <button
                        type="button"
                        className="btn btn-other"
                        disabled={this.state.edit_price}
                        onClick={() => {
                          this.setState({
                            edit_price: true,
                            saveEnable: false,
                          });
                        }}
                      >
                        <AlgaehLabel
                          label={{ forceLabel: "Edit Price", returnText: true }}
                        />
                      </button>
                    </AlgaehSecurityComponent>
                  ) : null}

                  <AlgaehSecurityComponent componentCode="SALE_LST_AUTH1">
                    {this.state.cancelled === "N" &&
                    this.state.is_posted === "Y" ? (
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
                            returnText: true,
                          }}
                        />
                      </button>
                    ) : null}
                  </AlgaehSecurityComponent>
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
    customer_data: state.customer_data,
    hospitaldetails: state.hospitaldetails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getItemUOM: AlgaehActions,
      getCustomerMaster: AlgaehActions,
      getHospitalDetails: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DentalOrder)
);
