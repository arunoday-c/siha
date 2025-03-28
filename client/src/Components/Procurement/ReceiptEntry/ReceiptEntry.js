import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./ReceiptEntry.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import ReceiptItemList from "./ReceiptItemList/ReceiptItemList";
import ReceiptServiceList from "./ReceiptServiceList";
import { newAlgaehApi } from "../../../hooks";
import { Upload, Modal } from "antd";
import { swalMessage } from "../../../utils/algaehApiCall";
// import AlgaehLoader from "../../Wrapper/fullPageLoader";
import {
  texthandle,
  ClearData,
  SaveReceiptEnrty,
  getCtrlCode,
  getDocuments,
  PostReceiptEntry,
  PurchaseOrderSearch,
  datehandle,
  textEventhandle,
  generateReceiptEntryReport,
  getPOOptions,
  RevertReceiptEntry,
} from "./ReceiptEntryEvent";
import { AlgaehActions } from "../../../actions/algaehActions";
import ReceiptEntryInp from "../../../Models/ReceiptEntry";
import MyContext from "../../../utils/MyContext";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
const { Dragger } = Upload;
const { confirm } = Modal;
class ReceiptEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      po_services_req: "N",
    };
    getPOOptions(this, this);
  }

  UNSAFE_componentWillMount() {
    let IOputs = ReceiptEntryInp.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    // if (
    //   this.props.delivery_note_number !== undefined &&
    //   this.props.delivery_note_number.length !== 0
    // ) {
    //   getCtrlCode(this, this.props.delivery_note_number);
    // }

    const queryParams = new URLSearchParams(this.props.location.search);
    if (queryParams.get("grn_number")) {
      getCtrlCode(this, queryParams.get("grn_number"));
    }
  }
  // getDocuments = () => {
  //
  //   newAlgaehApi({
  //     uri: "/getReceiptEntryDoc",
  //     module: "documentManagement",
  //     method: "GET",
  //     data: {
  //       grn_number: this.state.grn_number,
  //     },
  //   })
  //     .then((res) => {
  //       if (res.data.success) {
  //         let { data } = res.data;
  //         this.setState(
  //           {
  //             receipt_docs: data,
  //             recepit_files: [],
  //             saveEnable: this.state.saveEnable,
  //             docChanged: false,
  //           },
  //           () => {
  //             AlgaehLoader({ show: false });
  //           }
  //         );
  //       }
  //     })
  //     .catch((e) => {
  //       AlgaehLoader({ show: false });
  //       swalMessage({
  //         title: e.message,
  //         type: "error",
  //       });
  //     });
  // };

  saveDocument = (files = [], number, id) => {
    if (this.state.grn_number) {
      const formData = new FormData();
      formData.append("doc_number", this.state.grn_number);
      formData.append("mainFolderName", "ReceiptEntryDocuments");
      if (files.length) {
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file, file.name);
        });
      } else {
        this.state.recepit_files.forEach((file, index) => {
          formData.append(`file_${index}`, file, file.name);
        });
      }

      // files.forEach((file, index) => {
      //   formData.append(`file_${index}`, file, file.name);
      //   formData.append("fileName", file.name);
      // });

      newAlgaehApi({
        uri: "/uploadDocument",
        data: formData,
        extraHeaders: { "Content-Type": "multipart/form-data" },
        method: "POST",
        module: "documentManagement",
      })
        .then((value) => getDocuments(this))
        .catch((e) => console.log(e));
      // const formData = new FormData();
      // formData.append("grn_number", number || this.state.grn_number);
      // formData.append(
      //   "hims_f_procurement_grn_header_id",
      //   id || this.state.hims_f_procurement_grn_header_id
      // );
      // if (files.length) {
      //   files.forEach((file, index) => {
      //     formData.append(`file_${index}`, file, file.name);
      //   });
      // } else {
      //   this.state.recepit_files.forEach((file, index) => {
      //     formData.append(`file_${index}`, file, file.name);
      //   });
      // }
      // newAlgaehApi({
      //   uri: "/saveReceiptEntryDoc",
      //   data: formData,
      //   extraHeaders: { "Content-Type": "multipart/form-data" },
      //   method: "POST",
      //   module: "documentManagement",
      // })
      //   .then((value) => getDocuments(this))
      //   .catch((e) => console.log(e));
    } else {
      swalMessage({
        title: "Can't upload attachments for unsaved Receipt Entry",
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
    // newAlgaehApi({
    //   uri: "/deleteReceiptEntryDoc",
    //   method: "DELETE",
    //   module: "documentManagement",
    //   data: { id: doc._id },
    // }).then((res) => {
    //   if (res.data.success) {
    //     this.setState((state) => {
    //       const receipt_docs = state.receipt_docs.filter(
    //         (item) => this.state._id !== doc._id
    //       );
    //       return { receipt_docs };
    //     });
    //   }
    // });
  };

  render() {
    const class_finder = this.state.dataExitst === true ? " disableFinder" : "";

    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Receipt Entry", align: "ltr" }}
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
          //         label={{ forceLabel: "Receipt Entry", align: "ltr" }}
          //       />
          //     ),
          //   },
          // ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "Receipt Number", returnText: true }}
              />
            ),
            value: this.state.grn_number,
            selectValue: "grn_number",
            events: {
              onChange: getCtrlCode.bind(this, this),
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Receipt.ReceiptEntry",
            },
            searchName: "ReceiptEntry",
          }}
          userArea={
            <div className="row">
              <div className="col-3">
                <AlgaehLabel
                  label={{
                    forceLabel: "Receipt Date",
                  }}
                />
                <h6>
                  {this.state.grn_date
                    ? moment(this.state.grn_date).format(Options.dateFormat)
                    : Options.dateFormat}
                </h6>
              </div>
              {this.state.dataExitst === true ? (
                <div className="col-3 createdUserCntr">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Receipt Status",
                    }}
                  />
                  <h6>
                    {this.state.is_revert === "Y" ? (
                      <span className="badge badge-danger">Reverted</span>
                    ) : this.state.posted === "N" ? (
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
            this.state.hims_f_procurement_po_header_id !== null
              ? {
                  menuitems: [
                    {
                      label: "Receipt Entry Report",
                      events: {
                        onClick: () => {
                          generateReceiptEntryReport(this.state);
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
                {this.state.po_services_req === "Y" ? (
                  <div className="col-2 form-group">
                    <label>Receipt Mode</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="I"
                          name="receipt_mode"
                          checked={
                            this.state.receipt_mode === "I" ? true : false
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
                          name="receipt_mode"
                          checked={
                            this.state.receipt_mode === "S" ? true : false
                          }
                          onChange={texthandle.bind(this, this)}
                          disabled={this.state.dataExitst}
                        />
                        <span>Service</span>
                      </label>
                    </div>
                  </div>
                ) : null}
                <div
                  className={"col-2 globalSearchCntr mandatory" + class_finder}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Search Purchase Order No." }}
                  />
                  <h6 onClick={PurchaseOrderSearch.bind(this, this)}>
                    {this.state.purchase_number
                      ? this.state.purchase_number
                      : "Purchase Order No."}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>

                {this.state.receipt_mode === "I" ? (
                  <div className="col-6">
                    <div className="row">
                      <div className="col">
                        <AlgaehLabel label={{ forceLabel: "Receipt For" }} />
                        <h6>
                          {this.state.grn_for
                            ? this.state.grn_for === "INV"
                              ? "Inventory"
                              : "Pharmacy"
                            : "------"}
                        </h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel label={{ forceLabel: "Location" }} />
                        <h6>
                          {this.state.location_name
                            ? this.state.location_name
                            : "------"}
                        </h6>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-6">
                    <div className="row">
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
                          {this.state.project_desc
                            ? this.state.project_desc
                            : "------"}
                        </h6>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Vendor" }} />
                  <h6>
                    {this.state.vendor_name ? this.state.vendor_name : "------"}
                  </h6>
                  {this.state.vendor_name ? (
                    <div className="hoverVendor">
                      <i className="fas fa-eye"></i>
                      <div className="vendorDetCntr animated slideInDown faster">
                        <div className="row">
                          <div className="col">
                            <table>
                              <tbody>
                                <tr>
                                  <td colSpan="2" className="hdr">
                                    <span>Vendor Details:-</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Vendor Code:</td>
                                  <td>{this.state.vendor_code}</td>
                                </tr>
                                <tr>
                                  <td>Vendor Name:</td>
                                  <td>{this.state.vendor_name}</td>
                                </tr>
                                <tr>
                                  <td>BUSINESS REG. NO.</td>
                                  <td>{this.state.business_registration_no}</td>
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
                                  <td>IBAN Number</td>
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

                <AlagehFormGroup
                  div={{ className: "col-2  form-group" }}
                  label={{
                    forceLabel: "Payment Terms in Days",
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
                      disabled: this.state.postEnable,
                    },
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-2 mandatory" }}
                  label={{
                    forceLabel: "Invoice No.",
                    isImp: true,
                  }}
                  textBox={{
                    value: this.state.inovice_number,
                    className: "txt-fld",
                    name: "inovice_number",

                    events: {
                      onChange: textEventhandle.bind(this, this),
                    },
                    others: {
                      disabled: this.state.dataPosted,
                    },
                  }}
                />
                <AlgaehDateHandler
                  div={{ className: "col-2 mandatory" }}
                  label={{ forceLabel: "Invoice Date", isImp: true }}
                  textBox={{
                    className: "txt-fld",
                    name: "invoice_date",
                  }}
                  // minDate={new Date()}
                  disabled={this.state.dataExitst}
                  events={{
                    onChange: datehandle.bind(this, this),
                    // onBlur: dateValidate.bind(this, this)
                  }}
                  value={this.state.invoice_date}
                />

                {/*    <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ forceLabel: "Expected Arrival" }}
                  textBox={{
                    className: "txt-fld",
                    name: "expiry_date"
                  }}
                  minDate={new Date()}
                  disabled={true}
                  events={{
                    onChange: null
                  }}
                  value={this.state.expiry_date}
                />
                <div
                  className="customCheckbox col-lg-3"
                  style={{ border: "none", marginTop: "28px" }}
                >
                  <label className="checkbox" style={{ color: "#212529" }}>
                    <input
                      type="checkbox"
                      name="Multiple PO"
                      checked={this.state.Cashchecked}
                      onChange={null}
                    />

                    <span style={{ fontSize: "0.8rem" }}>From Multiple PO</span>
                  </label>
                </div> */}
              </div>
            </div>
          </div>

          {this.state.is_revert === "Y" ? (
            <div className="alert alert-danger">
              <div className="row">
                <div className="col">
                  {" "}
                  <p>
                    Reason:<b>{this.state.revert_reason}</b>
                  </p>
                </div>
                <div className="col-4">
                  {" "}
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
            {this.state.receipt_mode === "S" ? (
              <div className="row">
                {" "}
                <ReceiptServiceList ReceiptEntryInp={this.state} />
              </div>
            ) : (
              <ReceiptItemList ReceiptEntryInp={this.state} />
            )}
          </MyContext.Provider>

          <div className="col-12">
            <div className="row" style={{ marginBottom: 55 }}>
              <div className="col">
                <div className="row">
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
                            accept=".doc,.docx,application/msword,.pdf"
                            name="contract_file"
                            multiple={false}
                            onRemove={() => {
                              this.setState((state) => {
                                return {
                                  recepit_files: [],
                                  docChanged: false,
                                  // saveEnable: state.dataExists && !newFileList.length,
                                };
                              });
                            }}
                            beforeUpload={(file) => {
                              this.setState((state) => ({
                                recepit_files: [file],
                                docChanged: true,

                                // saveEnable: false,
                              }));
                              return false;
                            }}
                            fileList={this.state.recepit_files}
                          >
                            <p className="upload-drag-icon">
                              <i className="fas fa-file-upload"></i>
                            </p>
                            <p className="ant-upload-text">
                              {this.state.contract_file
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
                                {this.state.receipt_docs.length ? (
                                  this.state.receipt_docs.map((doc) => (
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
              </div>
              <div className="col-lg-5" style={{ textAlign: "right" }}>
                <div className="row">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Sub Total",
                      }}
                    />
                    <h6>{GetAmountFormart(this.state.sub_total)}</h6>
                  </div>
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Discount Amount",
                      }}
                    />
                    <h6>{GetAmountFormart(this.state.detail_discount)}</h6>
                  </div>

                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Tax",
                      }}
                    />
                    <h6>{GetAmountFormart(this.state.total_tax)}</h6>
                  </div>

                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Net Payable",
                      }}
                    />
                    <h6>{GetAmountFormart(this.state.net_payable)}</h6>
                  </div>
                </div>
              </div>
            </div>
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
                      <button
                        className="btn btn-primary"
                        onClick={RevertReceiptEntry.bind(this, this)}
                      >
                        Revert Receipt
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>

          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                {this.state.docChanged && this.state.grn_number ? (
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
                    onClick={SaveReceiptEnrty.bind(this, this)}
                    disabled={this.state.saveEnable}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Save",
                        returnText: true,
                      }}
                    />
                  </button>
                )}

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

                <button
                  type="button"
                  className="btn btn-other"
                  disabled={this.state.postEnable}
                  onClick={PostReceiptEntry.bind(this, this)}
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
    receiptitemlist: state.receiptitemlist,
    receiptlocations: state.receiptlocations,
    receiptitemcategory: state.receiptitemcategory,
    receiptitemgroup: state.receiptitemgroup,
    receiptitemuom: state.receiptitemuom,
    receiptrequisitionentry: state.receiptrequisitionentry,
    // receiptentry: state.receiptentry
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
      getVendorMaster: AlgaehActions,
      // getReceiptEntry: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ReceiptEntry)
);
