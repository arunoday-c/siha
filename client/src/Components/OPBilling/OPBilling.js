import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import extend from "extend";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PatientDetails from "./PatientDisDetails/PatientDetails.js";
import DisplayVisitDetails from "./VisitDetails/DisplayVisitDetails.js";
import OPBillingDetails from "./OPBilling/OPBillingDetails";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import "./OPBilling.css";
import MyContext from "../../utils/MyContext.js";
import AlgaehLabel from "../Wrapper/label.js";
import BillingIOputs from "../../Models/Billing";
import PatRegIOputs from "../../Models/RegistrationPatient";
import { getCookie } from "../../utils/algaehApiCall";
import { ClearData } from "./OPBillingEvents";
import { AlgaehActions } from "../../actions/algaehActions";
import { successfulMessage } from "../../utils/GlobalFunctions";
import { AlgaehDateHandler } from "../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../utils/algaehApiCall.js";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import Enumerable from "linq";
import AlgaehReport from "../Wrapper/printReports";

import moment from "moment";
import Options from "../../Options.json";
var intervalId;

class PatientDisplayDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en",
      s_service_type: null,
      s_service: null,
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
      advance: 0
    };
  }

  componentWillMount() {
    let IOputs = extend(PatRegIOputs.inputParam(), BillingIOputs.inputParam());
    this.setState({ ...this.state, ...IOputs });
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    this.setState({
      selectedLang: prevLang
    });

    if (this.props.genbill !== undefined && this.props.genbill.length !== 0) {
      this.props.initialbillingCalculations({
        redux: {
          type: "BILL_HEADER_GEN_GET_DATA",
          mappingName: "genbill",
          data: {}
        }
      });
    }

    if (
      this.props.patienttype === undefined ||
      this.props.patienttype.length === 0
    ) {
      this.props.getPatientType({
        uri: "/patientType/getPatientType",
        method: "GET",
        redux: {
          type: "PATIENT_TYPE_GET_DATA",
          mappingName: "patienttype"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    debugger;
    let output = {};
    let billOut = {};
    if (
      nextProps.existinsurance !== undefined &&
      nextProps.existinsurance.length !== 0
    ) {
      output = nextProps.existinsurance[0];
    }
    if (nextProps.genbill !== undefined && nextProps.genbill.length !== 0) {
      nextProps.genbill.patient_payable_h = nextProps.genbill.patient_payable;
      nextProps.genbill.saveEnable = false;
      billOut = nextProps.genbill;
    }

    this.setState({ ...this.state, ...billOut, ...output });
  }

  getPatientDetails($this, output) {
    debugger;
    clearInterval(intervalId);
    // let patient_type = "";
    intervalId = setInterval(() => {
      AlgaehLoader({ show: true });
      this.props.getPatientDetails({
        uri: "/frontDesk/get",
        method: "GET",
        printInput: true,
        data: { patient_code: this.state.patient_code || output.patient_code },
        redux: {
          type: "PAT_GET_DATA",
          mappingName: "patients"
        },
        afterSuccess: data => {
          debugger;
          if ($this.state.visit_id !== null) {
            for (let i = 0; i < data.visitDetails.length; i++) {
              if (
                data.visitDetails[i].hims_f_patient_visit_id ===
                $this.state.visit_id
              ) {
                data.visitDetails[i].radioselect = 1;
              }
            }
            AlgaehLoader({ show: false });
          }
          debugger;
          let x = Enumerable.from($this.props.patienttype)
            .where(
              w =>
                w.hims_d_patient_type_id ==
                data.patientRegistration.patient_type
            )
            .toArray();

          if (x != null && x.length > 0) {
            data.patientRegistration.patient_type = x[0].patitent_type_desc;
          } else {
            data.patientRegistration.patient_type = "Not Selected";
          }

          data.patientRegistration.visitDetails = data.visitDetails;
          data.patientRegistration.patient_id =
            data.patientRegistration.hims_d_patient_id;
          data.patientRegistration.mode_of_pay = "None";
          //Insurance
          data.patientRegistration.insurance_provider_name = null;
          data.patientRegistration.sub_insurance_provider_name = null;
          data.patientRegistration.network_type = null;
          data.patientRegistration.policy_number = null;
          data.patientRegistration.card_number = null;
          data.patientRegistration.effective_end_date = null;
          //Sec
          data.patientRegistration.secondary_insurance_provider_name = null;
          data.patientRegistration.secondary_sub_insurance_provider_name = null;
          data.patientRegistration.secondary_network_type = null;
          data.patientRegistration.secondary_policy_number = null;
          data.patientRegistration.card_number = null;
          data.patientRegistration.secondary_effective_end_date = null;

          this.setState(data.patientRegistration);
          AlgaehLoader({ show: false });
        }
      });
      clearInterval(intervalId);
    }, 500);
  }

  getCtrlCode(billcode) {
    let $this = this;

    AlgaehLoader({ show: true });
    this.props.getBIllDetails({
      uri: "/opBilling/get",
      method: "GET",
      printInput: true,
      data: { bill_number: billcode },
      redux: {
        type: "BILLS_GET_DATA",
        mappingName: "bills"
      },
      afterSuccess: data => {
        debugger;
        data.saveEnable = true;
        $this.setState(data, () => {
          this.getPatientDetails(this, data);
        });
      }
    });
  }

  GenerateReciept(callback) {
    if (this.state.total_amount > 0) {
      let obj = [];

      if (this.state.cash_amount > 0) {
        obj.push({
          hims_f_receipt_header_id: null,
          card_check_number: null,
          expiry_date: null,
          pay_type: this.state.pay_cash,
          amount: this.state.cash_amount,
          updated_date: null,
          card_type: null
        });
      }
      if (this.state.card_amount > 0) {
        obj.push({
          hims_f_receipt_header_id: null,
          card_check_number: this.state.card_check_number,
          expiry_date: this.state.card_date,
          pay_type: this.state.pay_card,
          amount: this.state.card_amount,
          updated_date: null,
          card_type: null
        });
      }
      if (this.state.cheque_amount > 0) {
        obj.push({
          hims_f_receipt_header_id: null,
          card_check_number: this.state.cheque_number,
          expiry_date: this.state.cheque_date,
          pay_type: this.state.pay_cheque,
          amount: this.state.cheque_amount,
          updated_date: null,
          card_type: null
        });
      }

      this.setState(
        {
          receiptdetails: obj
        },
        () => {
          callback(this);
        }
      );
    }
  }

  SaveBill(e) {
    this.GenerateReciept($this => {
      let Inputobj = $this.state;
      debugger;
      Inputobj.patient_payable = $this.state.patient_payable_h;
      AlgaehLoader({ show: true });
      algaehApiCall({
        uri: "/opBilling/addOpBIlling",
        data: Inputobj,
        method: "POST",
        onSuccess: response => {
          AlgaehLoader({ show: false });
          if (response.data.success) {
            $this.setState({
              bill_number: response.data.records.bill_number,
              receipt_number: response.data.records.receipt_number,
              saveEnable: true
            });
            successfulMessage({
              message: "Done Successfully",
              title: "Success",
              icon: "success"
            });
          }
        },
        onFailure: error => {
          AlgaehLoader({ show: false });
          successfulMessage({
            message: error.message,
            title: "Error",
            icon: "error"
          });
        }
      });
    });
  }

  render() {
    return (
      <div className="" style={{ marginBottom: "50px" }}>
        <BreadCrumb
          //   width={this.state.breadCrumbWidth}
          title={
            <AlgaehLabel
              label={{ fieldName: "form_opbilling", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
              )
            },
            {
              pageName: <AlgaehLabel label={{ fieldName: "bill_number" }} />
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ fieldName: "bill_number", returnText: true }}
              />
            ),
            value: this.state.bill_number,
            events: {
              onChange: this.getCtrlCode.bind(this)
            },
            selectValue: "bill_number",
            searchName: "bills",
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "billing.opBilling"
            }
          }}
          userArea={
            <AlgaehDateHandler
              div={{ className: "col" }}
              label={{
                forceLabel: <AlgaehLabel label={{ fieldName: "bill_date" }} />,
                className: "internal-label"
              }}
              textBox={{
                className: "txt-fld",
                name: "bread_bill_date"
              }}
              disabled={true}
              events={{
                onChange: null
              }}
              value={this.state.bill_date}
            />
          }
          printArea={{
            menuitems: [
              {
                label: "Print Receipt",
                events: {
                  onClick: () => {
                    debugger;
                    AlgaehReport({
                      report: {
                        fileName: "printreceipt"
                      },
                      data: {
                        patient_code: this.state.patient_code,
                        full_name: this.state.full_name,
                        advance_amount: this.state.advance_amount,
                        bill_date: moment(this.state.bill_date).format(
                          Options.dateFormat
                        ),
                        receipt_number: this.state.receipt_number,
                        doctor_name: this.state.doctor_name,
                        bill_details: this.state.billdetails
                      }
                    });
                  }
                }
              }
            ]
          }}
          selectedLang={this.state.selectedLang}
        />
        <div className="spacing-push">
          <MyContext.Provider
            value={{
              state: this.state,
              updateState: obj => {
                this.setState({ ...this.state, ...obj }, () => {
                  Object.keys(obj).map(key => {
                    if (key === "patient_code") {
                      this.getPatientDetails(this, {});
                    }
                  });
                });
              }
            }}
          >
            <PatientDetails BillingIOputs={this.state} />
            <DisplayVisitDetails BillingIOputs={this.state} />
            {/* <DisplayInsuranceDetails BillingIOputs={this.state} /> */}
            <OPBillingDetails BillingIOputs={this.state} />
          </MyContext.Provider>
        </div>

        <div className="hptl-phase1-footer">
          <AppBar position="static" className="main">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.SaveBill.bind(this)}
                  disabled={this.state.saveEnable}
                >
                  {/* <AlgaehLabel
                    label={{ fieldName: "btn_save", returnText: true }}
                  /> */}
                  Save
                </button>

                <button
                  type="button"
                  className="btn btn-default"
                  onClick={ClearData.bind(this, this)}
                >
                  {/* <AlgaehLabel
                    label={{ fieldName: "btn_clear", returnText: true }}
                  /> */}
                  Clear
                </button>
              </div>
            </div>
          </AppBar>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    genbill: state.genbill,
    patients: state.patients,
    existinsurance: state.existinsurance,
    patienttype: state.patienttype
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientDetails: AlgaehActions,
      getBIllDetails: AlgaehActions,
      initialbillingCalculations: AlgaehActions,
      getPatientType: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientDisplayDetails)
);
