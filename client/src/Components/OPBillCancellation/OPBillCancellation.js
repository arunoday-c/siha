import React, { Component } from "react";
import extend from "extend";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PatientVisitDetails from "./PatientVisitDetails/PatientVisitDetails.js";

import OPBillingDetails from "./OPBilling/OPBillingDetails";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import "./OPBillCancellation.scss";
import MyContext from "../../utils/MyContext.js";
import AlgaehLabel from "../Wrapper/label.js";
import BillingIOputs from "../../Models/BillCancellation";
import PatRegIOputs from "../../Models/RegistrationPatient";
import sockets from "../../sockets";
import {
  ClearData,
  Validations,
  getCashiersAndShiftMAP,
  getBillDetails,
  getCtrlCode,
  generateReceipt,
} from "./OPBillCancellationEvents";
import { AlgaehActions } from "../../actions/algaehActions";
import {
  swalMessage,
  algaehApiCall,
  getCookie,
} from "../../utils/algaehApiCall.js";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import moment from "moment";
import { RawSecurityComponent, MainContext } from "algaeh-react-components";
import swal from "sweetalert2";
import _ from "lodash";

class OPBillCancellation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en",

      mode_of_pay: "None",
      pay_cash: "CA",
      pay_card: "CD",
      pay_cheque: "CH",
      cash_amount: 0,
      card_check_number: "",
      card_date: null,
      card_amount: 0,
      cheque_number: "",
      cheque_date: null,
      cheque_amount: 0,
      advance: 0,
      cancel_remarks: null,
      cancel_checkin: "N",
      sendAppEnable: true,
    };
  }

  static contextType = MainContext;
  UNSAFE_componentWillMount() {
    let IOputs = extend(PatRegIOputs.inputParam(), BillingIOputs.inputParam());
    const userToken = this.context.userToken;
    IOputs.portal_exists = userToken.portal_exists;
    IOputs.bill_cancel_approval_required =
      userToken.bill_cancel_approval_required;

    this.setState({ ...this.state, ...IOputs });
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    this.setState({
      selectedLang: prevLang,
    });

    if (
      this.props.patienttype === undefined ||
      this.props.patienttype.length === 0
    ) {
      this.props.getPatientType({
        uri: "/patientType/getPatientType",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "PATIENT_TYPE_GET_DATA",
          mappingName: "patienttype",
        },
      });
    }

    let _screenName = getCookie("ScreenName").replace("/", "");
    algaehApiCall({
      uri: "/userPreferences/get",
      data: {
        screenName: _screenName,
        identifier: "Counter",
      },
      method: "GET",
      onSuccess: (response) => {
        this.setState({
          counter_id: response.data.records.selectedValue,
        });
      },
    });
    const queryParams = new URLSearchParams(this.props.location.search);
    if (queryParams.get("bill_cancel_number")) {
      getCtrlCode(this, queryParams.get("bill_cancel_number"));
    }

    RawSecurityComponent({ componentCode: "OP_CAL_CON" }).then((result) => {
      if (result === "show") {
        getCashiersAndShiftMAP(this, "Y");
      } else {
        getCashiersAndShiftMAP(this, "N");
      }
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let output = {};

    if (
      nextProps.existinsurance !== undefined &&
      nextProps.existinsurance.length !== 0
    ) {
      output = nextProps.existinsurance[0];
    }

    this.setState({ ...this.state, ...output });
  }

  GenerateReciept(callback) {
    let obj = [];

    if (
      this.state.Cashchecked === false &&
      this.state.Cardchecked === false &&
      this.state.Checkchecked === false
    ) {
      swalMessage({
        title: "Please select receipt type.",
        type: "error",
      });
    } else {
      if (this.state.cash_amount > 0 || this.state.Cashchecked === true) {
        obj.push({
          hims_f_receipt_header_id: null,
          card_check_number: null,
          expiry_date: null,
          pay_type: this.state.pay_cash,
          amount: this.state.cash_amount,
          updated_date: null,
          card_type: null,
        });
      }

      if (this.state.card_amount > 0 || this.state.Cardchecked === true) {
        obj.push({
          hims_f_receipt_header_id: null,
          card_check_number: this.state.card_check_number,
          expiry_date: this.state.card_date,
          pay_type: this.state.pay_card,
          amount: this.state.card_amount,
          updated_date: null,
          card_type: null,
        });
      }
      if (this.state.cheque_amount > 0 || this.state.Checkchecked === true) {
        obj.push({
          hims_f_receipt_header_id: null,
          card_check_number: this.state.cheque_number,
          expiry_date: this.state.cheque_date,
          pay_type: this.state.pay_cheque,
          amount: this.state.cheque_amount,
          updated_date: null,
          card_type: null,
        });
      }

      this.setState(
        {
          receiptdetails: obj,
        },
        () => {
          callback(this);
        }
      );
    }
  }
  SendForApproval() {
    swal({
      title: "Are you sure you want to Send For Approval?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willSave) => {
      if (willSave.value) {
        algaehApiCall({
          uri: "/opBillCancellation/addSendForApproval",
          module: "billing",
          data: { billing_header_id: this.state.from_bill_id },
          method: "POST",
          onSuccess: (response) => {
            AlgaehLoader({ show: false });

            if (response.data.success) {
              ClearData(this);

              swalMessage({
                title: "Sent Successfully",
                type: "success",
              });
            } else {
              swalMessage({
                title: response.data.records.message,
                type: "error",
              });
            }
          },
          onFailure: (error) => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.response.data.message || error.message,
              type: "error",
            });
          },
        });
      }
    });
  }

  CancelOPBill(e) {
    const err = Validations(this);
    if (!err) {
      swal({
        title: "Are you sure you want to Cancel?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No",
      }).then((willSave) => {
        if (willSave.value) {
          this.GenerateReciept(($this) => {
            let Inputobj = $this.state;
            // debugger;
            // return;
            Inputobj.patient_payable = $this.state.patient_payable_h;
            Inputobj.payable_amount = $this.state.receiveable_amount;
            Inputobj.pay_type = "P";
            Inputobj.ScreenCode = "BL0003";
            AlgaehLoader({ show: true });
            // let _services_id = [];
            // Inputobj.billdetails.map((o) => {
            //   _services_id.push(o.services_id);
            //   return null;
            // });

            const package_exists = Inputobj.billdetails.filter(
              (f) => f.service_type_id === 14
            );
            Inputobj.package_exists = package_exists;
            Inputobj.delete_data = true;

            if (Inputobj.portal_exists === "Y") {
              Inputobj.portal_data = _.chain(Inputobj.billdetails)
                .filter(
                  (f) =>
                    parseInt(f.service_type_id) === 5 ||
                    parseInt(f.service_type_id) === 11
                )
                .map((m, key) => {
                  return {
                    service_id: m.services_id,
                    visit_code: this.state.visit_code,
                    patient_identity: this.state.primary_id_no,
                    delete_data: true,
                  };
                })
                .value();
            }

            algaehApiCall({
              uri: "/opBillCancellation/addOpBillCancellation",
              module: "billing",
              data: Inputobj,
              method: "POST",
              onSuccess: (response) => {
                AlgaehLoader({ show: false });

                if (response.data.success) {
                  $this.setState({
                    bill_cancel_number: response.data.records.bill_number,
                    receipt_number: response.data.records.receipt_number,
                    hims_f_bill_cancel_header_id:
                      response.data.records.hims_f_bill_cancel_header_id,
                    saveEnable: true,
                  });
                  if (sockets.connected) {
                    sockets.emit("opBill_cancel", {
                      billdetails: Inputobj.billdetails,
                      bill_date: Inputobj.bill_date,
                    });
                  }

                  swalMessage({
                    title: "Cancelled Successfully",
                    type: "success",
                  });
                } else {
                  swalMessage({
                    title: response.data.records.message,
                    type: "error",
                  });
                }
              },
              onFailure: (error) => {
                AlgaehLoader({ show: false });
                swalMessage({
                  title: error.response.data.message || error.message,
                  type: "error",
                });
              },
            });
          });
        }
      });
    }
  }

  render() {
    return (
      <div className="" style={{ marginBottom: "50px" }}>
        <BreadCrumb
          //   width={this.state.breadCrumbWidth}
          title={
            <AlgaehLabel
              label={{ fieldName: "form_opbilling_cancel", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          // pageNavPath={[
          //   {
          //     pageName: (
          //       <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
          //     ),
          //   },
          //   {
          //     pageName: <AlgaehLabel label={{ fieldName: "bill_number" }} />,
          //   },
          // ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ fieldName: "bill_cancel_number", returnText: true }}
              />
            ),
            value: this.state.bill_cancel_number,
            events: {
              onChange: getCtrlCode.bind(this, this),
            },
            selectValue: "bill_cancel_number",
            searchName: "cancelbills",
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "cancelbills.opBillCancel",
            },
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    fieldName: "bill_cancel_date",
                  }}
                />
                <h6>
                  {this.state.bill_cancel_date
                    ? moment(this.state.bill_cancel_date).format("DD-MM-YYYY")
                    : "DD/MM/YYYY"}
                </h6>
              </div>

              {this.state.bill_cancel_number !== null ? (
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Cancelled By",
                    }}
                  />
                  <h6>{this.state.created_name}</h6>
                </div>
              ) : null}
            </div>
          }
          printArea={
            this.state.bill_cancel_number !== null
              ? {
                  menuitems: [
                    {
                      label: "Print Receipt",
                      events: {
                        onClick: () => {
                          generateReceipt(this, this);
                        },
                      },
                    },
                  ],
                }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div style={{ marginTop: 75 }}>
          <MyContext.Provider
            value={{
              state: this.state,
              updateState: (obj) => {
                this.setState({ ...this.state, ...obj }, () => {
                  Object.keys(obj).forEach((key) => {
                    if (key === "bill_number") {
                      getBillDetails(this, this);
                    }
                  });
                });
              },
            }}
          >
            <PatientVisitDetails BillingIOputs={this.state} />
            <OPBillingDetails BillingIOputs={this.state} />
          </MyContext.Provider>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-danger"
                onClick={this.CancelOPBill.bind(this)}
                disabled={this.state.saveEnable}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Cancel Bill", returnText: true }}
                />
              </button>

              {this.state.bill_cancel_approval_required ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.SendForApproval.bind(this)}
                  disabled={this.state.sendAppEnable || this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Send For Approval",
                      returnText: true,
                    }}
                  />
                </button>
              ) : null}

              <button
                type="button"
                className="btn btn-default"
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_clear", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    existinsurance: state.existinsurance,
    patienttype: state.patienttype,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientType: AlgaehActions,
      getPatientInsurance: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OPBillCancellation)
);
