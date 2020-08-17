import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./PurchaseOrderEntry.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import MyContext from "../../../utils/MyContext";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import POItemList from "./POItemList/POItemList";
import POServiceList from "./POServiceList/POServiceList";
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
} from "./PurchaseOrderEntryEvents";
import { AlgaehActions } from "../../../actions/algaehActions";
import POEntry from "../../../Models/POEntry";
import Enumerable from "linq";
import { MainContext } from "algaeh-react-components";
import {
  AlgaehSecurityComponent,
  RawSecurityComponent,
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
    console.log("data:", this.props.povendors);
    const userToken = this.context.userToken;
    this.setState({
      decimal_places: userToken.decimal_places,
    });
    if (
      this.props.purchase_number !== undefined &&
      this.props.purchase_number.length !== 0
    ) {
      getCtrlCode(this, this.props.purchase_number);
    } else {
      let po_from = "",
        bothExisits = true;
      RawSecurityComponent({ componentCode: "PUR_ORD_INVENTORY" }).then(
        (result) => {
          if (result === "show") {
            getData(this, "INV");
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
              <div className="col">
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
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "PO Status",
                    }}
                  />

                  <h6>
                    {this.state.is_posted === "N" ? (
                      <span className="badge badge-danger">Not Posted</span>
                    ) : this.state.cancelled === "Y" ? (
                      <span className="badge badge-danger">Rejected</span>
                    ) : this.state.receipt_generated === "Y" ? (
                      <span className="badge badge-success">PO Closed</span>
                    ) : this.state.authorize1 === "Y" &&
                      this.state.authorize2 === "Y" ? (
                      <span className="badge badge-success">Authorized</span>
                    ) : this.state.authorize1 === "Y" &&
                      this.state.authorize2 === "N" ? (
                      <span className="badge badge-danger">
                        Posted/Pending For Authorize
                      </span>
                    ) : this.state.authorize1 === "N" &&
                      this.state.authorize2 === "N" ? (
                      <span className="badge badge-danger">
                        Posted/Pending For Authorize
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        Posted/Pending For Authorize
                      </span>
                    )}
                  </h6>
                </div>
              ) : this.state.dataExitst === false &&
                this.state.purchase_number !== null ? (
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "PO Status",
                    }}
                  />

                  <h6>
                    <span className="badge badge-danger">
                      Send for Authorization pending
                    </span>
                  </h6>
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
                        div={{ className: "col mandatory" }}
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
                        div={{ className: "col mandatory" }}
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
                        div={{ className: "col mandatory" }}
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
                        div={{ className: "col form-group mandatory" }}
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
                        div={{ className: "col mandatory" }}
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

                <AlagehAutoComplete
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
                />
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
                  {this.props.purchase_auth === true ? (
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
                  {this.props.purchase_auth === true ? (
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

                {this.props.purchase_auth === true ? (
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={
                      (this.state.authorize2 === "Y" &&
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
                <button
                  type="button"
                  className="btn btn-other"
                  // disabled={
                  //   this.state.authBtnEnable === true
                  //     ? true
                  //     : this.state.authorize2 === "Y" ||
                  //       this.state.cancelled === "Y"
                  //       ? true
                  //       : false
                  // }
                  onClick={() => {
                    getReportForMail(this.state, this.props.povendors);
                  }}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Send Email With report",
                      returnText: true,
                    }}
                  />
                </button>
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
