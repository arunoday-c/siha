import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./PurchaseOrderEntry.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import MyContext from "../../../utils/MyContext";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import POItemList from "./POItemList/POItemList";
import POServiceList from "./POServiceList/POServiceList";
// import newAxios from "algaeh-utilities/axios";
import {
  vendortexthandle,
  loctexthandle,
  texthandle,
  poforhandle,
  RequisitionSearch,
  ClearData,
  SavePOEnrty,
  getCtrlCode,
  AuthorizePOEntry,
  getVendorMaster,
  generatePOReceipt,
  // generatePOReceiptNoPrice,
  clearItemDetails,
  VendorQuotationSearch,
  getPOOptions,
  getData,
  CancelPOEntry,
  getCostCenters,
  getReportForMail,
  POClose,
} from "./PurchaseOrderEntryEvents";
import { AlgaehActions } from "../../../actions/algaehActions";
import POEntry from "../../../Models/POEntry";
import Enumerable from "linq";
import { MainContext, AlgaehModal } from "algaeh-react-components";
import {
  AlgaehSecurityComponent,
  RawSecurityComponent,
  AlgaehButton,
} from "algaeh-react-components";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";

class PurchaseOrderEntry extends Component {
  constructor(props) {
    super(props);
    this.FIN_Active = false;
    this.state = {
      decimal_places: null,
      po_services_req: "N",
      cost_projects: [],
      mailSend: false,
      visible: false,
      email_id_1: "",
      from_mail: "",
      body_mail: "",
      send_attachment: true,
      vendorDetails: [],
      close_pop_visible: false,
      // po_auth_level: "1"
    };
    getVendorMaster(this, this);
    getPOOptions(this, this);
  }

  UNSAFE_componentWillMount() {
    let IOputs = POEntry.inputParam();
    this.setState(IOputs);
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState({
      decimal_places: userToken.decimal_places,
    });
    const queryParams = new URLSearchParams(this.props.location.search);

    if (
      this.props.purchase_number !== undefined &&
      this.props.purchase_number.length !== 0
    ) {
      getCtrlCode(this, this.props.purchase_number);
    } else if (queryParams.get("purchase_number")) {
      getCtrlCode(this, queryParams.get("purchase_number"));
    } else {
      let po_from = "",
        bothExisits = true;
      RawSecurityComponent({ componentCode: "PUR_ORD_INVENTORY" }).then(
        (result) => {
          if (result === "show") {
            po_from = "INV";
            bothExisits = false;
          }
        }
      );

      RawSecurityComponent({ componentCode: "PUR_ORD_PHARMACY" }).then(
        (result) => {
          if (result === "show") {
            getData(this, "PHR");
            po_from = "PHR";
            bothExisits = bothExisits === false ? false : true;
          } else {
            getData(this, "INV");
            bothExisits = true;
          }
          this.setState({
            po_from: po_from,
            bothExisits: bothExisits,
          });
        }
      );
    }
    this.FIN_Active =
      userToken.product_type === "HIMS_ERP" ||
        userToken.product_type === "FINANCE_ERP" ||
        userToken.product_type === "HRMS_ERP"
        ? true
        : false;

    if (this.FIN_Active === true) {
      getCostCenters(this);
    }
    this.props.getHospitalDetails({
      uri: "/organization/getOrganization",
      method: "GET",
      redux: {
        type: "HOSPITAL_DETAILS_GET_DATA",
        mappingName: "hospitaldetails",
      },
    });
  }
  // changeTexts(e) {
  //   this.setState({ [e.target.name]: e.target.value });
  // }
  textAreaEvent(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value,
    });
  }
  changeChecks(e) {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  }
  render() {
    const _mainStore =
      this.state.po_from === null
        ? []
        : Enumerable.from(this.props.polocations)
          .where((w) => w.location_type === "WH")
          .toArray();

    const class_finder =
      this.state.dataFinder === true
        ? " disableFinder"
        : this.state.ReqData === true
          ? " disableFinder"
          : "";
    return (
      <div>
        <AlgaehModal
          title={`Send mail Confirmation`}
          visible={this.state.visible}
          destroyOnClose={true}
          // okText="Confirm"
          // onOk={() => {
          footer={[
            <AlgaehButton
              className="btn btn-other"
              onClick={() => {
                this.setState({
                  visible: false,
                });
              }}
            >
              Cancel
            </AlgaehButton>,
            <AlgaehButton
              loading={this.state.mailSend}
              className="btn btn-primary"
              onClick={() => {
                this.setState({ mailSend: true }, () => {
                  getReportForMail(this.state, this.props.povendors)
                    .then(() => {
                      this.setState({
                        mailSend: false,
                        visible: false,

                        body_mail: "",
                      });
                    })
                    .catch(() => {
                      this.setState({
                        mailSend: false,
                        visible: false,

                        body_mail: "",
                      });
                    });
                });
              }}
            >
              <AlgaehLabel
                label={{
                  forceLabel: "Send PO Via Email",
                  returnText: true,
                }}
              />
            </AlgaehButton>,
          ]}
          onCancel={() => {
            // finance_voucher_header_id = "";
            // rejectText = "";
            this.setState({
              visible: false,
            });
          }}
        >
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{ forceLabel: "Vendor Name" }}
              selector={{
                name: "vendor_id",
                className: "select-fld",
                value: this.state.vendor_id,
                dataSource: {
                  textField: "vendor_name",
                  valueField: "hims_d_vendor_id",
                  data: this.props.povendors,
                },
                others: {
                  disabled:
                    this.state.po_entry_detail.length > 0 ? true : false,
                },
                onChange: vendortexthandle.bind(this, this),
                onClear: () => {
                  this.setState({
                    vendor_id: null,
                  });
                },
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-10 form-group" }}
              label={{
                forceLabel: "To Mail Id",
                // isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "app_group_code",
                value: this.state.email_id_1,
                // events: {
                //   onChange: this.changeTexts.bind(this),
                // },
                others: {
                  tabIndex: "1",
                  placeholder: "vendor email",
                  disabled: true,
                },
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-10 form-group" }}
              label={{
                forceLabel: "From Mail Id",
                // isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "from_mail",
                value: this.state.from_mail,
                // events: {
                //   onChange: this.changeTexts.bind(this),
                // },
                others: {
                  tabIndex: "1",
                  placeholder: "Organisation email",
                  disabled: true,
                },
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-10 form-group" }}
              label={{
                forceLabel: "Vendor Quotation No.",
                // isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "vendor_quotation_number",
                value: this.state.vendor_quotation_number,
                // events: {
                //   onChange: this.changeTexts.bind(this),
                // },
                others: {
                  tabIndex: "1",
                  placeholder: " Quotation Number",
                  disabled: true,
                },
              }}
            />
            <div className="col-12">
              <AlgaehLabel
                label={{
                  forceLabel: "Enter Body of the mail",
                }}
              />

              <textarea
                value={this.state.body_mail}
                name="body_mail"
                onChange={this.textAreaEvent.bind(this)}
              />
              <label className="checkbox inline">
                <input
                  type="checkbox"
                  name="send_attachment"
                  checked={this.state.send_attachment}
                  onChange={this.changeChecks.bind(this)}
                />

                <span>Send Email with Attachment</span>
              </label>
            </div>
          </div>
        </AlgaehModal>

        <AlgaehModal
          title={`Reason For Close -${this.state.purchase_number}`}
          visible={this.state.close_pop_visible}
          destroyOnClose={true}
          okText="Proceed"
          onOk={POClose.bind(this, this)}
          onCancel={() => {
            this.setState({ close_pop_visible: false });
          }}
        >
          <div className="col-12">
            <AlgaehLabel label={{ forceLabel: "Close Reason" }} />
            <textarea
              value={this.state.po_close_reason}
              name="po_close_reason"
              onChange={texthandle.bind(this, this)}
            />
          </div>
        </AlgaehModal>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Purchase Order Entry", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "PO Number", returnText: true }}
              />
            ),
            value: this.state.purchase_number,
            selectValue: "purchase_number",
            events: {
              onChange: getCtrlCode.bind(this, this),
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Purchase.POEntry",
            },
            searchName: "POEntry",
          }}
          userArea={
            <div className="row">
              <div className="col-3">
                <AlgaehLabel
                  label={{
                    forceLabel: "PO Date",
                  }}
                />
                <h6>
                  {this.state.po_date
                    ? moment(this.state.po_date).format(Options.dateFormat)
                    : Options.dateFormat}
                </h6>
              </div>

              {this.state.dataExitst === true ? (
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "PO Status",
                    }}
                  />

                  <h6>
                    {this.state.cancelled === "Y" ? (
                      <span className="badge badge-danger">Rejected</span>
                    ) : this.state.is_posted === "N" &&
                      this.state.is_revert === "N" ? (
                          <span className="badge badge-danger">
                            Send for Authorization Pending
                          </span>
                        ) : this.state.is_posted === "N" &&
                          this.state.is_revert === "Y" ? (
                            <span className="badge badge-danger">
                              Send for Authorization Pending/Re-Generate
                            </span>
                          ) : this.state.authorize1 === "Y" &&
                            this.state.authorize2 === "Y" &&
                            this.state.is_completed === "N" ? (
                              <span className="badge badge-success">
                                Delivery Pending
                              </span>
                            ) : this.state.is_completed === "Y" && this.state.receipt_generated === "N" ? (
                              <span className="badge badge-success">
                                Receipt Generation Pending
                              </span>
                            ) : this.state.authorize1 === "Y" &&
                              this.state.authorize2 === "N" ? (
                                  <span className="badge badge-danger">
                                    Pending For Authorize
                                  </span>
                                ) : this.state.authorize1 === "N" &&
                                  this.state.authorize2 === "N" ? (
                                    <span className="badge badge-danger">
                                      Pending For Authorize
                                    </span>
                                  ) : this.state.receipt_generated === "Y" ? (
                                    <span className="badge badge-success">PO Closed</span>
                                  ) : (
                                      <span className="badge badge-danger">
                                        Pending For Authorize
                                      </span>
                                    )}
                  </h6>
                </div>
              ) : this.state.dataExitst === false &&
                this.state.purchase_number !== null ? (
                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "PO Status",
                        }}
                      />

                      <h6>
                        {this.state.is_posted === "N" &&
                          this.state.is_revert === "Y" ? (
                            <span className="badge badge-danger">
                              Not Posted/Re-Generate
                            </span>
                          ) : (
                            <span className="badge badge-danger">
                              Send for Authorization pending
                            </span>
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
            this.state.purchase_number !== null
              ? {
                menuitems: [
                  {
                    label: "Print PO",
                    events: {
                      onClick: () => {
                        generatePOReceipt(this.state);
                      },
                    },
                  },
                  // {
                  //   label: "Receipt for Vendor",
                  //   events: {
                  //     onClick: () => {
                  //       generatePOReceiptNoPrice(this.state);
                  //     },
                  //   },
                  // },
                ],
              }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div className="hims-purchase-order-entry">
          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                {this.state.po_services_req === "Y" ? (
                  <div className="col-2 ">
                    <label>PO Mode</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="I"
                          name="po_mode"
                          checked={this.state.po_mode === "I" ? true : false}
                          onChange={texthandle.bind(this, this)}
                          disabled={this.state.dataExists}
                        />
                        <span>Item</span>
                      </label>
                      <label className="radio inline">
                        <input
                          type="radio"
                          value="S"
                          name="po_mode"
                          checked={this.state.po_mode === "S" ? true : false}
                          onChange={texthandle.bind(this, this)}
                          disabled={this.state.dataExists}
                        />
                        <span>Service</span>
                      </label>
                    </div>
                  </div>
                ) : null}

                {this.state.po_mode === "I" ? (
                  <div className="col">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-4 mandatory" }}
                        label={{ forceLabel: "PO Type" }}
                        selector={{
                          name: "po_type",
                          className: "select-fld",
                          value: this.state.po_type,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.PO_TYPE,
                          },
                          others: {
                            disabled:
                              this.state.po_entry_detail.length > 0
                                ? true
                                : false,
                          },
                          onChange: texthandle.bind(this, this),
                          onClear: () => {
                            this.setState({
                              po_type: "D",
                            });
                          },
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-4 mandatory" }}
                        label={{ forceLabel: "PO For" }}
                        selector={{
                          name: "po_from",
                          className: "select-fld",
                          value: this.state.po_from,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.PO_FROM,
                          },
                          others: {
                            disabled: this.state.bothExisits,
                          },
                          onChange: poforhandle.bind(this, this),
                          onClear: () => {
                            clearItemDetails(this, this);
                            this.setState({
                              po_from: null,
                              ReqData: true,
                              pharmcy_location_id: null,
                              inventory_location_id: null,
                            });
                          },
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-4 mandatory" }}
                        label={{ forceLabel: "Location Code" }}
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
                            data: _mainStore,
                          },
                          others: {
                            disabled:
                              this.state.po_entry_detail.length > 0
                                ? true
                                : false,
                          },
                          onChange: loctexthandle.bind(this, this),
                          onClear: () => {
                            this.setState({
                              location_description: null,
                            });
                          },
                        }}
                      />
                    </div>
                  </div>
                ) : (
                    <div className="col">
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col-6 form-group mandatory" }}
                          label={{
                            forceLabel: "Select Project",
                            isImp: true,
                          }}
                          selector={{
                            name: "project_id",
                            className: "select-fld",
                            value: this.state.project_id,
                            dataSource: {
                              textField: "cost_center",
                              valueField: "cost_center_id",
                              data: this.state.cost_projects,
                            },
                            onChange: texthandle.bind(this, this),
                            others: {
                              disabled: this.state.dataExists,
                            },
                            onClear: () => {
                              this.setState({
                                project_id: null,
                                hospital_id: null,
                                organizations: [],
                              });
                            },
                          }}
                        />

                        <AlagehAutoComplete
                          div={{ className: "col-6 mandatory" }}
                          label={{
                            forceLabel: "Select Branch",
                            isImp: true,
                          }}
                          selector={{
                            name: "hospital_id",
                            className: "select-fld",
                            value: this.state.hospital_id,
                            dataSource: {
                              textField: "hospital_name",
                              valueField: "hims_d_hospital_id",
                              data: this.state.organizations,
                            },
                            onChange: texthandle.bind(this, this),
                            others: {
                              disabled: this.state.dataExists,
                            },
                            onClear: () => {
                              this.setState({
                                hospital_id: null,
                              });
                            },
                          }}
                        />
                      </div>
                    </div>
                  )}
                <div className="col-3">
                  <div className="row hoverVendor">
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{ forceLabel: "Vendor Name" }}
                      selector={{
                        name: "vendor_id",
                        className: "select-fld",
                        value: this.state.vendor_id,
                        dataSource: {
                          textField: "vendor_name",
                          valueField: "hims_d_vendor_id",
                          data: this.props.povendors,
                        },
                        others: {
                          disabled:
                            this.state.po_entry_detail.length > 0
                              ? true
                              : false,
                        },
                        onChange: vendortexthandle.bind(this, this),
                        onClear: () => {
                          this.setState({
                            vendor_id: null,
                            vendorDetails: [],
                          });
                        },
                      }}
                    />
                    {this.state.vendorDetails.length > 0
                      ? this.state.vendorDetails.map((item) => {
                        return (
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
                                      <td>{item.vendor_code}</td>
                                    </tr>
                                    <tr>
                                      <td>Vendor Name:</td>
                                      <td>{item.vendor_name}</td>
                                    </tr>
                                    <tr>
                                      <td>BUSINESS REG. NO.</td>
                                      <td>{item.business_registration_no}</td>
                                    </tr>
                                    <tr>
                                      <td colSpan="2" className="hdr">
                                        <span>Contact Details:-</span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>CONTACT NUMBER</td>
                                      <td>{item.contact_number}</td>
                                    </tr>
                                    <tr>
                                      <td>Email Address Primary</td>
                                      <td>{item.email_id_1}</td>
                                    </tr>
                                    <tr>
                                      <td>Email Address Secondary</td>
                                      <td>
                                        {item.email_id_2
                                          ? item.email_id_2
                                          : "---"}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Address</td>
                                      <td>{item.address}</td>
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
                                      <td>{item.payment_terms}</td>
                                    </tr>
                                    <tr>
                                      <td>PAYMENT MODE</td>
                                      <td>{item.payment_mode}</td>
                                    </tr>
                                    <tr>
                                      <td>VAT NUMBER</td>
                                      <td>{item.vat_number}</td>
                                    </tr>
                                    <tr>
                                      <td>BANK NAME</td>
                                      <td>{item.bank_name}</td>
                                    </tr>
                                    <tr>
                                      <td>ACCOUNT NUMBER</td>
                                      <td>{item.bank_account_no}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        );
                      })
                      : null}
                  </div>
                </div>

                {this.state.po_type === "MR" || this.state.po_type === "PR" ? (
                  <div className={"col-2 globalSearchCntr" + class_finder}>
                    <AlgaehLabel
                      label={{ forceLabel: "Search Requisition No." }}
                    />
                    <h6 onClick={RequisitionSearch.bind(this, this)}>
                      {this.state.material_requisition_number
                        ? this.state.material_requisition_number
                        : "Requisition No."}
                      <i className="fas fa-search fa-lg"></i>
                    </h6>
                  </div>
                ) : this.state.po_type === "VQ" ? (
                  <div className={"col-2 globalSearchCntr" + class_finder}>
                    <AlgaehLabel
                      label={{ forceLabel: "Search Vendor Quotation No." }}
                    />
                    <h6 onClick={VendorQuotationSearch.bind(this, this)}>
                      {this.state.vendor_quotation_number
                        ? this.state.vendor_quotation_number
                        : "Vendor Quotation No."}
                      <i className="fas fa-search fa-lg"></i>
                    </h6>
                  </div>
                ) : null}

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
                      disabled:
                        this.state.is_revert === "Y"
                          ? false
                          : this.state.po_entry_detail.length > 0
                            ? true
                            : false,
                    },
                  }}
                />
                {/* <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "Payment Terms" }}
                  selector={{
                    name: "payment_terms",
                    className: "select-fld",
                    value: this.state.payment_terms,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.PAYMENT_TERMS,
                    },
                    others: {
                      disabled:
                        this.state.po_entry_detail.length > 0 ? true : false,
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        payment_terms: null,
                      });
                    },
                    autoComplete: "off",
                  }}
                /> */}
              </div>
            </div>
          </div>
          {this.state.cancelled === "Y" || this.state.is_revert === "Y" ? (
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
            {this.state.po_mode === "S" ? (
              <POServiceList POEntry={this.state} />
            ) : (
                <POItemList POEntry={this.state} />
              )}
          </MyContext.Provider>
          <div className="row">
            <div className="col-lg-12">
              <div style={{ marginBottom: 73 }}>
                <div className="row">
                  <div className="col" />

                  <div className="col-lg-6" style={{ textAlign: "right" }}>
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
                            forceLabel: "Tax Amount",
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
              </div>
            </div>
          </div>
        </div>

        <AlgaehSecurityComponent componentCode="PUR_ORD_MAINT">
          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-4 leftBtnGroup">
                <AlgaehSecurityComponent componentCode="PUR_AUT_AUTH1">
                  {this.state.purchase_auth === true ? (
                    <button
                      type="button"
                      className="btn btn-other"
                      disabled={
                        this.state.authBtnEnable === true
                          ? true
                          : this.state.authorize1 === "Y" ||
                            this.state.cancelled === "Y"
                            ? true
                            : false
                      }
                      onClick={AuthorizePOEntry.bind(
                        this,
                        this,
                        this.state.authorize1 === "N"
                          ? "authorize1"
                          : "authorize2"
                      )}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "Authorize 1",
                          returnText: true,
                        }}
                      />
                    </button>
                  ) : null}
                </AlgaehSecurityComponent>
                <AlgaehSecurityComponent componentCode="PUR_AUT_AUTH2">
                  {this.state.purchase_auth === true ? (
                    <button
                      type="button"
                      className="btn btn-other"
                      disabled={
                        this.state.authBtnEnable === true
                          ? true
                          : this.state.authorize2 === "Y" ||
                            this.state.cancelled === "Y"
                            ? true
                            : false
                      }
                      onClick={AuthorizePOEntry.bind(
                        this,
                        this,
                        this.state.authorize1 === "N"
                          ? "authorize1"
                          : "authorize2"
                      )}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "Authorize 2",
                          returnText: true,
                        }}
                      />
                    </button>
                  ) : null}
                </AlgaehSecurityComponent>

                {this.state.purchase_auth === true ? (
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={
                      (this.state.is_posted === "N"
                        ? true
                        : this.state.authorize2 === "Y" &&
                        this.state.authorize2 === "Y") ||
                        this.state.cancelled === "Y"
                        ? true
                        : false
                    }
                    onClick={CancelPOEntry.bind(this, this)}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Reject",
                        returnText: true,
                      }}
                    />
                  </button>
                ) : null}
              </div>
              <div className="col-8">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={SavePOEnrty.bind(this, this, "S")}
                  disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Save Purchase Order",
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
                  disabled={this.state.dataPosted}
                  onClick={SavePOEnrty.bind(this, this, "P")}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Send for Authorization",
                      returnText: true,
                    }}
                  />
                </button>
                {this.state.po_closed === true ? (
                  <AlgaehSecurityComponent componentCode="PO_CLOSE">
                    <AlgaehButton
                      loading={this.state.mailSend}
                      className="btn btn-other"
                      disabled={
                        this.state.receipt_generated === "Y" ||
                          this.state.is_completed === "Y"
                          ? true
                          : false
                      }
                      onClick={() => {
                        this.setState({
                          close_pop_visible: true,
                        });
                      }}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "PO Close",
                          returnText: true,
                        }}
                      />
                    </AlgaehButton>
                  </AlgaehSecurityComponent>
                ) : null}

                <AlgaehSecurityComponent componentCode="PO_VIA_EMAIL">
                  <AlgaehButton
                    loading={this.state.mailSend}
                    className="btn btn-other"
                    onClick={() => {
                      this.setState({
                        visible: true,
                      });
                    }}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Send PO Via Email",
                        returnText: true,
                      }}
                    />
                  </AlgaehButton>
                </AlgaehSecurityComponent>
              </div>
            </div>
          </div>
        </AlgaehSecurityComponent>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    polocations: state.polocations,
    povendors: state.povendors,
    hospitaldetails: state.hospitaldetails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions,
      getVendorMaster: AlgaehActions,
      getHospitalDetails: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderEntry)
);
