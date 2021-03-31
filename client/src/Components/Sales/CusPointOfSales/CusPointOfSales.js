import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup,
  // AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";

import {
  ClearData,
  SaveCashSalesInvoice,
  // closePopup,
  changeTexts,
  getCtrlCode,
  // datehandle,
  // dateValidate,
  generateSalesInvoiceReport,
  getCostCenters,
  PostSalesInvoice,
  getCashCustomer,
  employeeSearch,
  // CancelSalesInvoice,
} from "./CusPointOfSalesEvent";
// import "./CusPointOfSales.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
// import ReactDOM from "react-dom";
import MyContext from "../../../utils/MyContext";
import moment from "moment";
import Options from "../../../Options.json";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import SalesListItems from "./SalesListItems/SalesListItems";
import CashSaleInvIOputs from "../../../Models/CashSaleInv";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import { MainContext } from "algaeh-react-components";
// import {
//   AlgaehSecurityComponent,
//   Modal,
//   AlgaehButton,
//   MainContext,
// } from "algaeh-react-components";
class CusPointOfSales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cost_projects: [],
      customer_id: null,
    };
  }

  UNSAFE_componentWillMount() {
    let IOputs = CashSaleInvIOputs.inputParam();
    this.setState(IOputs);
  }

  static contextType = MainContext;
  componentDidMount() {
    getCostCenters(this);
    getCashCustomer(this);

    if (
      this.props.oplocations === undefined ||
      this.props.oplocations.length === 0
    ) {
      this.props.getLocation({
        uri: "/inventoryGlobal/getUserLocationPermission",
        module: "inventory",
        data: { allow_pos: "Y" },
        method: "GET",
        redux: {
          type: "LOCATIOS_GET_DATA",
          mappingName: "oplocations",
        },
      });
    }
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

    const userToken = this.context.userToken;

    this.setState({
      decimal_place: userToken.decimal_places,
    });
  }

  // onKeyPress(e) {
  //   if (e.ctrlKey && e.keyCode === 9) {
  //     const element = ReactDOM.findDOMNode(
  //       document.getElementById("root")
  //     ).querySelector("input[name='item_id']");
  //     element.focus();
  //   }

  //   if (e.ctrlKey && e.keyCode === 14) {
  //     ClearData(this);
  //     const element = ReactDOM.findDOMNode(
  //       document.getElementById("root")
  //     ).querySelector("input[name='item_id']");
  //     element.focus();
  //   }
  // }

  // componentWillUnmount() {
  //   document.removeEventListener("keypress", this.onKeyPress, false);
  // }

  // onKeyPress={this.onKeyPress}
  render() {
    const class_finder = this.state.dataExitst === true ? " disableFinder" : "";
    return (
      <React.Fragment>
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
                onChange: getCtrlCode.bind(this, this),
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "Sales.SalesInvoiceCash",
              },
              searchName: "SalesInvoiceCash",
            }}
            userArea={
              <div className="row" style={{ marginTop: -10 }}>
                {/* <AlgaehDateHandler
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
                /> */}
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Invoice Date",
                    }}
                  />
                  <h6>
                    {this.state.invoice_date
                      ? moment(this.state.invoice_date).format(
                          Options.dateFormat
                        )
                      : Options.dateFormat}
                  </h6>
                </div>
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
          <div
            className="row  inner-top-search"
            style={{ marginTop: 76, paddingBottom: 10 }}
          >
            {/* Patient code */}
            <div className="col-lg-3">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{ forceLabel: "Location", isImp: true }}
                  selector={{
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_inventory_location_id",
                      data: this.props.oplocations,
                    },
                    onChange: changeTexts.bind(this, this),
                    onClear: () => {
                      this.setState({
                        location_id: null,
                      });
                    },
                    autoComplete: "off",
                    others: {
                      disabled: this.state.dataExitst,
                    },
                  }}
                />
              </div>
            </div>

            <AlagehFormGroup
              div={{ className: "col mandatory" }}
              label={{
                forceLabel: "Customer",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "customer_name",
                value: this.state.customer_name,
                events: {
                  onChange: changeTexts.bind(this, this),
                },
                others: {
                  disabled: this.state.dataExitst,
                },
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-2 form-group mandatory" }}
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
                onChange: changeTexts.bind(this, this),
                others: {
                  disabled: this.state.dataExitst,
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
              div={{ className: "col-2 mandatory" }}
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
                onChange: changeTexts.bind(this, this),
                others: {
                  disabled: this.state.dataExitst,
                },
                onClear: () => {
                  this.setState({
                    hospital_id: null,
                  });
                },
              }}
            />
            <div
              className={
                "col globalSearchCntr form-group mandatory" + class_finder
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
          </div>

          <div className="hptl-phase1-pos-form">
            <div className="row">
              <MyContext.Provider
                value={{
                  state: this.state,
                  updateState: (obj) => {
                    this.setState({ ...obj });
                  },
                }}
              >
                <SalesListItems CashSaleInvIOputs={this.state} />
              </MyContext.Provider>
            </div>
          </div>
          <div className="row">
            {/* <div className="col-6">
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
                                  <b> {doc.filename} </b>
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
            </div> */}
            <div className="col-12">
              <div className="row">
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Sub Total",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.sub_total)}</h6>
                </div>
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Discount Amount",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.discount_amount)}</h6>
                </div>

                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Net Total",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.net_total)}</h6>
                </div>
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Tax",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.total_tax)}</h6>
                </div>
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Net Receivable",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.net_payable)}</h6>
                </div>

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
                      onChange: changeTexts.bind(this, this),
                    },
                    others: {
                      // disabled: this.state.dataExitst,
                      // multiline: true,
                      rows: "3",
                    },
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
                  onClick={SaveCashSalesInvoice.bind(this, this)}
                  disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Generate",
                      returnText: true,
                    }}
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

                {/* <button
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
                </button> */}

                <button
                  type="button"
                  className="btn btn-default"
                  onClick={ClearData.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Clear", returnText: true }}
                  />
                </button>
                {/* 
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
                </Modal> */}
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
    oplocations: state.oplocations,
    hospitaldetails: state.hospitaldetails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions,
      getHospitalDetails: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CusPointOfSales)
);
