import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./SalesInvoice.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
// import Options from "../../../Options.json";
// import moment from "moment";
// import ReceiptItemList from "./ReceiptItemList/ReceiptItemList";
// import GlobalVariables from "../../../utils/GlobalVariables.json";

import {
  ClearData,
  SaveInvoiceEnrty,
  // getDocuments,
  getCtrlCode,
  SalesOrderSearch,
  texthandle,
  PostSalesInvoice,
  generateSalesInvoiceReport,
  RevertSalesInvoice,
  CancelSalesInvoice,
  SaveNarration,
  dateValidate,
  datehandle,
  SaveDeliveryDate,
} from "./SalesInvoiceEvents";
import { AlgaehActions } from "../../../actions/algaehActions";
import { Upload } from "antd";
// import SalesInvoiceInp from "../../../Models/SalesInvoice";
import MyContext from "../../../utils/MyContext";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import InvoiceListService from "./InvoiceListService/InvoiceListService";
import InvoiceItemList from "./InvoiceItemList/InvoiceItemList";
import SalesInvoiceIO from "../../../Models/SalesInvoice";
import {
  AlgaehSecurityComponent,
  Modal,
  AlgaehButton,
  MainContext,
} from "algaeh-react-components";
import TransationDetails from "../../Finance/DayEndProcess/TransationDetails";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import { newAlgaehApi } from "../../../hooks";
const { Dragger } = Upload;
const { confirm } = Modal;
class SalesInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sales_invoice_files: [],
      invoice_docs: [],
    };
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

    const queryParams = new URLSearchParams(this.props.location.search);
    if (queryParams.get("invoice_number")) {
      getCtrlCode(this, false, queryParams.get("invoice_number"));
    }
  }

  onOpenPreviewPopUP() {
    try {
      const queryParams = new URLSearchParams(this.props.location.search);
      const finance_day_end_header_id = queryParams.get(
        "finance_day_end_header_id"
      );
      algaehApiCall({
        uri: "/finance/previewDayEndEntries",
        data: { day_end_header_id: finance_day_end_header_id },
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          const { result, success, message } = response.data;
          if (success === true) {
            this.setState({
              popUpRecords: result,
              openPopup: true,
              finance_day_end_header_id: finance_day_end_header_id,
            });
          } else {
            this.setState({ popUpRecords: {}, openPopup: false });
            swalMessage({ title: message, type: "error" });
          }
        },
        onCatch: (error) => {
          swalMessage({ title: error, type: "error" });
        },
      });
    } catch (e) {
      swalMessage({ title: e, type: "error" });
      console.error(e);
    }
  }
  getDocuments = () => {
    // newAlgaehApi({
    //   uri: "/getReceiptEntryDoc",
    //   module: "documentManagement",
    //   method: "GET",
    //   data: {
    //     grn_number: this.state.invoice_number,
    //   },
    // })
    debugger;
    newAlgaehApi({
      uri: "/moveOldFiles",
      module: "documentManagement",
      method: "GET",
      data: {
        mainFolderName: "SalesInvoiceDocuments",
        doc_number: this.state.invoice_number,
        hasUniqueId: true,
        contract_no: this.state.invoice_number,
        fromModule: "Receipt",
        completePath: `SalesInvoiceDocuments/${this.state.invoice_number}/`,
      },
    })
      .then((res) => {
        if (res.data.success) {
          let { data } = res.data;
          this.setState(
            {
              invoice_docs: data,
              sales_invoice_files: [],
              saveEnable: this.state.saveEnable,
              docChanged: false,
            },
            () => {
              AlgaehLoader({ show: false });
            }
          );
        }
      })
      .catch((e) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: e.message,
          type: "error",
        });
      });
  };
  saveDocument = (files = [], number, id) => {
    if (this.state.invoice_number) {
      // const formData = new FormData();
      // formData.append("grn_number", number || this.state.invoice_number);
      // formData.append(
      //   "hims_f_procurement_grn_header_id",
      //   id || this.state.hims_f_sales_invoice_header_id
      // );
      // if (files.length) {
      //   files.forEach((file, index) => {
      //     formData.append(`file_${index}`, file, file.name);
      //   });
      // } else {
      //   this.state.sales_invoice_files.forEach((file, index) => {
      //     formData.append(`file_${index}`, file, file.name);
      //   });
      // }
      const formData = new FormData();
      formData.append("doc_number", this.state.invoice_number);
      formData.append("mainFolderName", "SalesInvoiceDocuments");
      if (files.length) {
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file, file.name);
        });
      } else {
        this.state.sales_invoice_files.forEach((file, index) => {
          formData.append(`file_${index}`, file, file.name);
        });
      }
      // newAlgaehApi({
      //   uri: "/saveReceiptEntryDoc",
      //   data: formData,
      //   extraHeaders: { "Content-Type": "multipart/form-data" },
      //   method: "POST",
      //   module: "documentManagement",
      // })
      newAlgaehApi({
        uri: "/uploadDocument",
        data: formData,
        extraHeaders: { "Content-Type": "multipart/form-data" },
        method: "POST",
        module: "documentManagement",
      })
        .then((value) => this.getDocuments(number))
        .catch((e) => console.log(e));
    } else {
      swalMessage({
        title: "Can't upload attachments for unsaved sales Invoice",
        type: "error",
      });
    }
  };
  downloadDoc(doc, isPreview) {
    // const fileUrl = `data:${doc.filetype};base64,${doc.document}`;
    // const link = document.createElement("a");
    // if (!isPreview) {
    //   link.download = doc.filename;
    //   link.href = fileUrl;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // } else {
    //   fetch(fileUrl)
    //     .then((res) => res.blob())
    //     .then((fblob) => {
    //       const newUrl = URL.createObjectURL(fblob);
    //       window.open(newUrl);
    //     });
    // }
    newAlgaehApi({
      uri: "/downloadFromPath",
      module: "documentManagement",
      method: "GET",
      extraHeaders: {
        Accept: "blob",
      },
      others: {
        responseType: "blob",
      },
      data: {
        fileName: doc.value,
      },
    })
      .then((resp) => {
        const urlBlob = URL.createObjectURL(resp.data);
        if (isPreview) {
          window.open(urlBlob);
        } else {
          const link = document.createElement("a");
          link.download = doc.name;
          link.href = urlBlob;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        // setPDFLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // setPDFLoading(false);
      });
  }

  deleteDoc = (doc) => {
    const self = this;
    confirm({
      title: `Are you sure you want to delete this file?`,
      content: `${doc.filename}`,
      icon: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        self.onDelete(doc);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  onDelete = (doc) => {
    // newAlgaehApi({
    //   uri: "/deleteReceiptEntryDoc",
    //   method: "DELETE",
    //   module: "documentManagement",
    //   data: { id: doc._id },
    // }).then((res) => {
    //   if (res.data.success) {
    //     this.setState((state) => {
    //       const invoice_docs = state.invoice_docs.filter(
    //         (item) => item._id !== doc._id
    //       );
    //       return { invoice_docs };
    //     });
    //   }
    // });
    newAlgaehApi({
      uri: "/deleteDocs",
      method: "DELETE",
      module: "documentManagement",
      data: { completePath: doc.value },
    }).then((res) => {
      if (res.data.success) {
        this.setState((state) => {
          const receipt_docs = state.receipt_docs.filter(
            (item) => item.name !== doc.name
          );
          return { receipt_docs };
        });
      }
    });
  };

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
          // pageNavPath={[
          //   {
          //     pageName: (
          //       <AlgaehLabel
          //         label={{
          //           forceLabel: "Home",
          //           align: "ltr",
          //         }}
          //       />
          //     ),
          //   },
          //   {
          //     pageName: (
          //       <AlgaehLabel
          //         label={{ forceLabel: "Invoice Entry", align: "ltr" }}
          //       />
          //     ),
          //   },
          // ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "Invoice Number", returnText: true }}
              />
            ),
            value: this.state.invoice_number,
            selectValue: "invoice_number",
            events: {
              onChange: getCtrlCode.bind(this, this, false),
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Sales.SalesInvoice",
            },
            searchName: "SalesInvoice",
          }}
          userArea={
            <div className="row" style={{ marginTop: -10 }}>
              <AlgaehDateHandler
                div={{ className: "col-3 mandatory" }}
                label={{
                  forceLabel: "Invoice Date",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "invoice_date",
                }}
                maxDate={new Date()}
                events={{
                  onChange: datehandle.bind(this, this),
                  onBlur: dateValidate.bind(this, this),
                }}
                disabled={this.state.dateEditable}
                value={this.state.invoice_date}
              />
              {/* <div className="col">
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
              </div> */}
              {this.state.dataExitst === true ? (
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Invoice Status",
                    }}
                  />
                  <h6>
                    {this.state.is_cancelled === "Y" ? (
                      <span className="badge badge-danger">Cancelled</span>
                    ) : this.state.is_revert === "Y" ? (
                      <span className="badge badge-danger">Reverted</span>
                    ) : this.state.is_posted === "N" ? (
                      <span className="badge badge-danger">Not Posted</span>
                    ) : (
                      <span className="badge badge-success">Posted</span>
                    )}
                  </h6>
                </div>
              ) : null}
              {this.state.dataExitst === true ? (
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
                    <div className={"col-2 globalSearchCntr" + class_finder}>
                      <AlgaehLabel label={{ forceLabel: "Search Order No." }} />
                      <h6 onClick={SalesOrderSearch.bind(this, this)}>
                        {this.state.sales_order_number
                          ? this.state.sales_order_number
                          : "Order No."}
                        <i className="fas fa-search fa-lg"></i>
                      </h6>
                    </div>

                    <AlgaehButton
                      className="btn btn-default"
                      style={{ marginTop: 21 }}
                      onClick={() => {
                        this.props.history.push(
                          `/SalesOrder?sales_order_number=${
                            this.state.sales_order_number
                          }&disable_all=${true}`
                        );
                      }}
                      disabled={this.state.sales_order_number ? false : true}
                    >
                      View Order
                    </AlgaehButton>

                    <div className="col">
                      <AlgaehLabel label={{ forceLabel: "Customer" }} />
                      <h6>
                        {this.state.customer_name
                          ? this.state.customer_name
                          : "------"}
                      </h6>
                      {this.state.customer_name ? (
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
                                      <td>{this.state.customer_code}</td>
                                    </tr>
                                    <tr>
                                      <td>Customer Name:</td>
                                      <td>{this.state.customer_name}</td>
                                    </tr>
                                    <tr>
                                      <td>BUSINESS REG. NO.</td>
                                      <td>
                                        {this.state.business_registration_no}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colSpan="2" className="hdr">
                                        <span>Contact Details:-</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>CONTACT NUMBER</td>
                                      <td>{this.state.contact_number}</td>
                                    </tr>
                                    <tr>
                                      <td>Email Address Primary</td>
                                      <td>{this.state.email_id_1}</td>
                                    </tr>
                                    <tr>
                                      <td>Email Address Secondary</td>
                                      <td>
                                        {this.state.email_id_2
                                          ? this.state.email_id_2
                                          : "---"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Address</td>
                                      <td>{this.state.address}</td>
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
                                      <td>{this.state.payment_terms}</td>
                                    </tr>
                                    <tr>
                                      <td>PAYMENT MODE</td>
                                      <td>{this.state.payment_mode}</td>
                                    </tr>
                                    <tr>
                                      <td>VAT NUMBER</td>
                                      <td>{this.state.vat_number}</td>
                                    </tr>
                                    <tr>
                                      <td>BANK NAME</td>
                                      <td>{this.state.bank_name}</td>
                                    </tr>
                                    <tr>
                                      <td>ACCOUNT NUMBER</td>
                                      <td>{this.state.bank_account_no}</td>
                                    </tr>
                                    <tr>
                                      <td>IBAN NUMBER</td>
                                      <td>{this.state.iban_number}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="col">
                      <AlgaehLabel label={{ fieldName: "branch" }} />
                      <h6>
                        {this.state.hospital_name
                          ? this.state.hospital_name
                          : "------"}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel label={{ fieldName: "project" }} />
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
                          ? this.state.payment_terms + " Days"
                          : "0 Days"}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.state.is_revert === "Y" ? (
            <div className="alert alert-danger">
              <div className="row">
                <div className="col">
                  <p>
                    Reason:<b>{this.state.revert_reason}</b>
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
            <div className="col-6">
              <div
                className="portlet portlet-bordered"
                style={{ marginBottom: 60 }}
              >
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Attachments</h3>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-3">
                      {" "}
                      <Dragger
                        // disabled={!this.state.saveEnable}
                        accept=".doc,.docx,application/msword,.pdf,.png,.jpg"
                        name="sales_invoice_files"
                        multiple={false}
                        onRemove={() => {
                          this.setState((state) => {
                            return {
                              sales_invoice_files: [],
                              docChanged: false,
                              // saveEnable: state.dataExists && !newFileList.length,
                            };
                          });
                        }}
                        beforeUpload={(file) => {
                          this.setState((state) => ({
                            sales_invoice_files: [file],
                            docChanged: true,

                            // saveEnable: false,
                          }));
                          return false;
                        }}
                        fileList={this.state.sales_invoice_files}
                      >
                        <p className="upload-drag-icon">
                          <i className="fas fa-file-upload"></i>
                        </p>
                        <p className="ant-upload-text">
                          {this.state.sales_invoice_files
                            ? `Click or Drag a file to replace the current file`
                            : `Click or Drag a file to this area to upload`}
                        </p>
                      </Dragger>
                    </div>
                    <div className="col-3"></div>
                    <div className="col-6">
                      <div className="row">
                        <div className="col-12">
                          <ul className="receiptEntryAttachment">
                            {this.state.invoice_docs?.length ? (
                              this.state.invoice_docs.map((doc) => (
                                <li>
                                  <b> {doc.name} </b>
                                  <span>
                                    <i
                                      className="fas fa-download"
                                      onClick={() => this.downloadDoc(doc)}
                                    ></i>
                                    <i
                                      className="fas fa-eye"
                                      onClick={() =>
                                        this.downloadDoc(doc, true)
                                      }
                                    ></i>
                                    {!this.state.postEnable ? (
                                      <i
                                        className="fas fa-trash"
                                        onClick={() => this.deleteDoc(doc)}
                                      ></i>
                                    ) : null}
                                  </span>
                                </li>
                              ))
                            ) : (
                              <div className="col-12 noAttachment" key={1}>
                                <p>No Attachments Available</p>
                              </div>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6" style={{ textAlign: "right" }}>
              <div className="row">
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Sub Total",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.sub_total)}</h6>
                </div>
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Discount Amount",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.discount_amount)}</h6>
                </div>

                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Net Total",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.net_total)}</h6>
                </div>
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Tax",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.total_tax)}</h6>
                </div>
                <AlagehFormGroup
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Retention amt",
                    isImp: false,
                  }}
                  textBox={{
                    decimal: { allowNegative: false },
                    className: "txt-fld",
                    name: "retention_amt",
                    value: this.state.retention_amt,
                    events: {
                      onChange: texthandle.bind(this, this),
                    },
                    others: {
                      disabled: this.state.dataExitst,
                    },
                  }}
                />
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Net Receivable",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.net_payable)}</h6>
                </div>
                <AlgaehDateHandler
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Customer Delivery Date",
                    isImp:
                      this.state.hims_f_sales_invoice_header_id === null
                        ? false
                        : true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "delivery_date",
                  }}
                  minDate={new Date()}
                  events={{
                    onChange: datehandle.bind(this, this),
                    // onBlur: dateValidate.bind(this, this),
                  }}
                  // disabled={this.state.dateEditable}
                  value={this.state.delivery_date}
                />
                {this.state.sales_invoice_mode === "I" ? (
                  <AlgaehDateHandler
                    div={{ className: "col-3" }}
                    label={{
                      forceLabel: "Customer Goods Recv. Date",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "cust_good_rec_date",
                    }}
                    minDate={new Date()}
                    events={{
                      onChange: datehandle.bind(this, this),
                    }}
                    disabled={this.state.dataExitst}
                    value={this.state.cust_good_rec_date}
                  />
                ) : null}

                <AlagehFormGroup
                  div={{ className: "col-12 textAreaLeft" }}
                  label={{
                    forceLabel: "Enter Narration",
                    isImp: false,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "narration",
                    value: this.state.narration,
                    events: {
                      onChange: texthandle.bind(this, this),
                    },
                    others: {
                      // disabled: this.state.dataExitst,
                      multiline: true,
                      rows: "3",
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-4 leftBtnGroup">
                {this.state.hims_f_sales_invoice_header_id > 0 ? (
                  <button
                    type="button"
                    className="btn btn-other"
                    onClick={SaveNarration.bind(this, this)}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Save Narration",
                        returnText: true,
                      }}
                    />
                  </button>
                ) : null}
                {this.state.hims_f_sales_invoice_header_id > 0 &&
                this.state.is_posted === "Y" ? (
                  <AlgaehSecurityComponent componentCode="SALE_INV_SAV_DELDATE">
                    <button
                      type="button"
                      className="btn btn-other"
                      onClick={SaveDeliveryDate.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "Save Delivery Date",
                          returnText: true,
                        }}
                      />
                    </button>
                  </AlgaehSecurityComponent>
                ) : null}
              </div>
              <div className="col-8">
                <AlgaehSecurityComponent componentCode="SALES_INV_MAIN">
                  {this.state.docChanged && this.state.invoice_number ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.saveDocument}
                      disabled={!this.state.docChanged}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "Upload Documents",
                          returnText: true,
                        }}
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={SaveInvoiceEnrty.bind(this, this)}
                      disabled={this.state.saveEnable}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "Generate",
                          returnText: true,
                        }}
                      />
                    </button>
                  )}
                </AlgaehSecurityComponent>
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
                <AlgaehSecurityComponent componentCode="SALES_INV_RVT">
                  {/* {this.state.sales_invoice_mode === "S" ? ( */}
                  <button
                    type="button"
                    className="btn btn-other"
                    disabled={this.state.dataRevert}
                    onClick={() => this.setState({ revert_visible: true })}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Revert",
                        returnText: true,
                      }}
                    />
                  </button>
                  {/* ) : null} */}
                </AlgaehSecurityComponent>
                <AlgaehSecurityComponent componentCode="SALE_INV_POST">
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
                </AlgaehSecurityComponent>
                <AlgaehSecurityComponent componentCode="SALE_INV_POST">
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={this.state.cancelEnable}
                    onClick={() => this.setState({ cancel_visible: true })}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Cancel Invoice",
                        returnText: true,
                      }}
                    />
                  </button>
                </AlgaehSecurityComponent>
              </div>
              <Modal
                title="Invoice Cancellation"
                visible={this.state.cancel_visible}
                footer={null}
                onCancel={() => this.setState({ cancel_visible: false })}
                className={`row algaehNewModal invoiceCancellationModal`}
              >
                <AlagehFormGroup
                  div={{ className: "col-12" }}
                  label={{
                    forceLabel: "Enter reason for invoice cancellation",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "cancel_reason",
                    value: this.state.cancel_reason,
                    events: {
                      onChange: (e) => {
                        this.setState({ cancel_reason: e.target.value });
                      },
                    },
                  }}
                />

                <div className="popupFooter">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-12">
                        <AlgaehButton
                          className="btn btn-primary"
                          onClick={CancelSalesInvoice.bind(this, this)}
                        >
                          Cancel Invoice
                        </AlgaehButton>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>

              <Modal
                title="Invoice Revert"
                visible={this.state.revert_visible}
                width={1080}
                footer={null}
                onCancel={() => this.setState({ revert_visible: false })}
                className={`row algaehNewModal invoiceRevertModal`}
              >
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Enter reason for invoice reversal",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "revert_reason",
                    value: this.state.revert_reason,
                    events: {
                      onChange: (e) => {
                        this.setState({ revert_reason: e.target.value });
                      },
                    },
                  }}
                />

                <div className="popupFooter">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-12">
                        <AlgaehButton
                          className="btn btn-primary"
                          onClick={RevertSalesInvoice.bind(this, this)}
                        >
                          Revert Invoice
                        </AlgaehButton>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
              <TransationDetails
                openPopup={this.state.openPopup}
                popUpRecords={this.state.popUpRecords}
                finance_day_end_header_id={this.state.finance_day_end_header_id}
              />
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
