import React, { PureComponent } from "react";
import PatientDetails from "./PatientDetails/PatientDetails.js";
import ConsultationDetails from "./ConsultationDetails/ConsultationDetails.js";
import InsuranceDetails from "./InsuranceDetails/InsuranceDetails.js";
import Billing from "./Billing/BillingDetails";
import "./registration.css";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";
import extend from "extend";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AppBar from "@material-ui/core/AppBar";
import AHSnackbar from "../common/Inputs/AHSnackbar.js";
import {
  postPatientDetails,
  postVisitDetails
} from "../../actions/RegistrationPatient/Registrationactions";

import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import MyContext from "../../utils/MyContext.js";
import { Validations } from "./FrontdeskValidation.js";
import AlgaehLabel from "../Wrapper/label.js";
import { getCookie } from "../../utils/algaehApiCall";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall.js";
import AddAdvanceModal from "../Advance/AdvanceModal";
import { imageToByteArray } from "../../utils/GlobalFunctions";
import { setGlobal } from "../../utils/GlobalFunctions";
import { AlgaehActions } from "../../actions/algaehActions";
import AlgaehReport from "../Wrapper/printReports";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import moment from "moment";
import Options from "../../Options.json";
import {
  generateBillDetails,
  ShowRefundScreen,
  ClearData,
  ShowAdvanceScreen
} from "./RegistrationPatientEvent";
const emptyObject = extend(
  PatRegIOputs.inputParam(),
  BillingIOputs.inputParam()
);

class RegistrationPatient extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      AdvanceOpen: false,
      RefundOpen: false,
      visittypeselect: true,
      clearEnable: false
    };
  }

  componentWillMount() {
    let IOputs = emptyObject;
    this.setState(IOputs);
    setGlobal({ selectedLang: "en" });
  }
  componentDidMount() {
    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });

    let IOputs = emptyObject;
    IOputs.selectedLang = prevLang;
    this.setState(IOputs);
    if (this.state.saveEnable === "clear") {
      this.props.initialStatePatientData({
        redux: {
          type: "PAT_INIT_DATA",
          mappingName: "patients",
          data: {}
        }
      });
    }

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
      this.props.patient_code !== undefined &&
      this.props.patient_code.length !== 0
    ) {
      this.getCtrlCode(this.props.patient_code);
    } else if (this.props.patient_details !== undefined) {
      debugger;

      this.setState(
        {
          full_name: this.props.patient_details.patient_name,
          arabic_name: this.props.patient_details.arabic_patient_name,
          date_of_birth: this.props.patient_details.date_of_birth,
          age: this.props.patient_details.patient_age,
          gender: this.props.patient_details.patient_gender,
          contact_number: this.props.patient_details.patient_phone,
          email: this.props.patient_details.patient_email,
          sub_department_id: this.props.sub_department_id,
          department_id: this.props.department_id,
          provider_id: this.props.provider_id,
          doctor_id: this.props.provider_id,
          visit_type: this.props.visit_type,
          hims_d_services_id: this.props.hims_d_services_id,
          saveEnable: false,
          clearEnable: true,
          consultation: "Y",
          appointment_patient: "Y",
          billdetail: false,
          hims_f_patient_appointment_id: this.state
            .hims_f_patient_appointment_id
        },
        () => {
          if (this.props.fromAppoinment === true) {
            generateBillDetails(this, this);
          }
        }
      );
    }
  }

  GenerateReciept(callback) {
    let obj = [];

    if (
      this.state.Cashchecked === false &&
      this.state.Cardchecked === false &&
      this.state.Checkchecked === false
    ) {
      swalMessage({
        title: "Invalid Input. Please select receipt type.",
        type: "error"
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
          card_type: null
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
          card_type: null
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

  SavePatientDetails(e) {
    const err = Validations(this);

    if (!err) {
      if (this.state.unbalanced_amount === 0) {
        this.GenerateReciept($this => {
          AlgaehLoader({ show: true });
          debugger;
          if ($this.state.hims_d_patient_id === null) {
            let patientdata = {};

            if ($this.state.filePreview !== null) {
              patientdata = {
                ...$this.state,
                patient_Image: imageToByteArray(this.state.filePreview)
              };
            } else {
              patientdata = $this.state;
            }
            algaehApiCall({
              uri: "/frontDesk/add",
              data: patientdata,
              method: "POST",
              onSuccess: response => {
                AlgaehLoader({ show: false });
                if (response.data.success) {
                  $this.setState({
                    patient_code: response.data.records.patient_code,
                    bill_number: response.data.records.bill_number,
                    receipt_number: response.data.records.receipt_number,
                    saveEnable: true
                  });
                  swalMessage({
                    title: "Done Successfully",
                    type: "success"
                  });
                }
              },
              onFailure: error => {
                AlgaehLoader({ show: false });
                swalMessage({
                  title: error.message,
                  type: "error"
                });
              }
            });
          } else {
            algaehApiCall({
              uri: "/frontDesk/update",
              data: $this.state,
              method: "POST",
              onSuccess: response => {
                AlgaehLoader({ show: false });
                if (response.data.success) {
                  $this.setState({
                    bill_number: response.data.records.bill_number,
                    receipt_number: response.data.records.receipt_number,
                    saveEnable: true
                  });
                  swalMessage({
                    title: "Done Successfully",
                    type: "success"
                  });
                }
              },
              onFailure: error => {
                AlgaehLoader({ show: false });
                swalMessage({
                  title: error.message,
                  type: "error"
                });
              }
            });
          }
        });
      } else {
        swalMessage({
          title: "Invalid Input. Please recive the amount.",
          type: "error"
        });
      }
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.genbill !== undefined &&
      nextProps.genbill.length !== 0 &&
      this.state.doctor_id !== null
    ) {
      this.setState({ ...this.state, ...nextProps.genbill });
    }
    AlgaehLoader({ show: false });
  }

  getCtrlCode(patcode) {
    let $this = this;
    let provider_id = this.props.provider_id || null;
    let sub_department_id = this.props.sub_department_id || null;
    let visit_type = this.props.visit_type || null;
    let hims_d_services_id = this.props.hims_d_services_id || null;
    let fromAppoinment =
      this.props.fromAppoinment === undefined
        ? false
        : this.props.fromAppoinment;

    let department_id = this.props.department_id || null;
    let hims_f_patient_appointment_id =
      this.props.hims_f_patient_appointment_id || null;
    AlgaehLoader({ show: true });
    this.props.getPatientDetails({
      uri: "/frontDesk/get",
      method: "GET",
      printInput: true,
      data: { patient_code: patcode },
      redux: {
        type: "PAT_GET_DATA",
        mappingName: "patients"
      },
      afterSuccess: data => {
        if (data.response === undefined) {
          data.patientRegistration.visitDetails = data.visitDetails;
          data.patientRegistration.patient_id =
            data.patientRegistration.hims_d_patient_id;
          data.patientRegistration.existingPatient = true;

          //Appoinment Start

          if (fromAppoinment === true) {
            data.patientRegistration.provider_id = provider_id;
            data.patientRegistration.doctor_id = provider_id;
            data.patientRegistration.sub_department_id = sub_department_id;

            data.patientRegistration.visit_type = visit_type;
            data.patientRegistration.saveEnable = false;
            data.patientRegistration.clearEnable = true;
            data.patientRegistration.hims_d_services_id = hims_d_services_id;
            data.patientRegistration.department_id = department_id;
            data.patientRegistration.billdetail = false;
            data.patientRegistration.consultation = "Y";
            data.patientRegistration.appointment_patient = "Y";
            data.patientRegistration.hims_f_patient_appointment_id = hims_f_patient_appointment_id;
          }
          //Appoinment End
          data.patientRegistration.filePreview =
            "data:image/png;base64, " + data.patient_Image;
          $this.setState(data.patientRegistration, () => {
            if (fromAppoinment === true) {
              generateBillDetails(this, this);
            }
          });

          $this.props.getPatientInsurance({
            uri: "/insurance/getPatientInsurance",
            method: "GET",
            data: { patient_id: data.patientRegistration.hims_d_patient_id },
            redux: {
              type: "EXIT_INSURANCE_GET_DATA",
              mappingName: "existinsurance"
            }
          });
        } else {
          if (data.response.data.success === true) {
            data.patientRegistration.visitDetails = data.visitDetails;
            data.patientRegistration.patient_id =
              data.patientRegistration.hims_d_patient_id;
            data.patientRegistration.existingPatient = true;

            //Appoinment Start
            if (fromAppoinment === true) {
              data.patientRegistration.provider_id = provider_id;
              data.patientRegistration.doctor_id = provider_id;
              data.patientRegistration.sub_department_id = sub_department_id;

              data.patientRegistration.visit_type = visit_type;
              data.patientRegistration.saveEnable = false;
              data.patientRegistration.clearEnable = true;
              data.patientRegistration.hims_d_services_id = hims_d_services_id;
              data.patientRegistration.department_id = department_id;
              data.patientRegistration.billdetail = false;
              data.patientRegistration.consultation = "Y";
              data.patientRegistration.appointment_patient = "Y";
              data.patientRegistration.hims_f_patient_appointment_id = hims_f_patient_appointment_id;
            }
            //Appoinment End
            data.patientRegistration.filePreview =
              "data:image/png;base64, " + data.patient_Image;
            data.patientRegistration.arabic_name = "No Name";
            $this.setState(data.patientRegistration, () => {
              if (fromAppoinment === true) {
                generateBillDetails(this, this);
              }
            });

            $this.props.getPatientInsurance({
              uri: "/insurance/getPatientInsurance",
              method: "GET",
              data: {
                patient_id: data.patientRegistration.hims_d_patient_id
              },
              redux: {
                type: "EXIT_INSURANCE_GET_DATA",
                mappingName: "existinsurance"
              }
            });
          } else {
            swalMessage({
              title: data.response.data.message,
              type: "error"
            });

            let IOputs = emptyObject;
            this.setState(IOputs);
          }
        }
        AlgaehLoader({ show: false });
      }
    });
  }

  //Render Page Start Here

  render() {
    return (
      <div id="attach" style={{ marginBottom: "50px" }}>
        {/* <Barcode value='PAT-A-000017'/> */}
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ fieldName: "form_patregister", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          //breadWidth={this.props.breadWidth}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "form_home",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ fieldName: "patient_code", returnText: true }}
              />
            ),
            value: this.state.patient_code,
            selectValue: "patient_code",
            events: {
              onChange: this.getCtrlCode.bind(this)
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "frontDesk.patients"
            },
            searchName: "patients"
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    fieldName: "registered_date"
                  }}
                />
                <h6>
                  {this.state.registration_date
                    ? moment(this.state.registration_date).format(
                        Options.dateFormat
                      )
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          printArea={{
            menuitems: [
              {
                label: "Print Bar Code",
                events: {
                  onClick: () => {
                    AlgaehReport({
                      report: {
                        fileName: "patientRegistrationBarcode",
                        barcode: {
                          parameter: "patient_code",
                          options: {
                            format: "",
                            lineColor: "#0aa",
                            width: 4,
                            height: 40
                          }
                        }
                      },
                      data: {
                        patient_code: this.state.patient_code
                      }
                    });
                  }
                }
              },
              {
                label: "Print Receipt",
                events: {
                  onClick: () => {
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
                this.setState({ ...obj });
              }
            }}
          >
            <PatientDetails
              PatRegIOputs={this.state}
              clearData={this.state.clearData}
            />
            <ConsultationDetails PatRegIOputs={this.state} />
            <InsuranceDetails PatRegIOputs={this.state} />
            <Billing PatRegIOputs={this.state} loader={true} />
            <div className="hptl-phase1-footer">
              <AppBar position="static" className="main">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.SavePatientDetails.bind(this)}
                      disabled={this.state.saveEnable}
                    >
                      <AlgaehLabel
                        label={{ fieldName: "btn_save", returnText: true }}
                      />
                    </button>

                    <AHSnackbar
                      open={this.state.open}
                      handleClose={this.handleClose}
                      MandatoryMsg={this.state.MandatoryMsg}
                    />
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={ClearData.bind(this, this)}
                      disabled={this.state.clearEnable}
                    >
                      <AlgaehLabel
                        label={{ fieldName: "btn_clear", returnText: true }}
                      />
                    </button>

                    <button
                      type="button"
                      className="btn btn-other"
                      onClick={ShowRefundScreen.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{
                          fieldName: "btn_refund",
                          returnText: true
                        }}
                      />
                    </button>

                    <AddAdvanceModal
                      show={this.state.RefundOpen}
                      onClose={ShowRefundScreen.bind(this, this)}
                      selectedLang={this.state.selectedLang}
                      HeaderCaption={
                        <AlgaehLabel
                          label={{
                            fieldName: "refund_caption",
                            align: "ltr"
                          }}
                        />
                      }
                      NumberLabel="payment_number"
                      DateLabel="payment_date"
                      inputsparameters={{
                        patient_code: this.state.patient_code,
                        full_name: this.state.full_name,
                        hims_f_patient_id: this.state.hims_d_patient_id,
                        transaction_type: "RF",
                        pay_type: "P",
                        advance_amount: this.state.advance_amount
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-other"
                      onClick={ShowAdvanceScreen.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{
                          fieldName: "btn_advance",
                          returnText: true
                        }}
                      />
                    </button>

                    <AddAdvanceModal
                      show={this.state.AdvanceOpen}
                      onClose={ShowAdvanceScreen.bind(this, this)}
                      selectedLang={this.state.selectedLang}
                      HeaderCaption={
                        <AlgaehLabel
                          label={{
                            fieldName: "advance_caption",
                            align: "ltr"
                          }}
                        />
                      }
                      NumberLabel="receipt_number"
                      DateLabel="receipt_date"
                      inputsparameters={{
                        patient_code: this.state.patient_code,
                        full_name: this.state.full_name,
                        hims_f_patient_id: this.state.hims_d_patient_id,
                        transaction_type: "AD",
                        pay_type: "R",
                        advance_amount: this.state.advance_amount
                      }}
                    />
                  </div>
                </div>
              </AppBar>
            </div>
          </MyContext.Provider>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patients: state.patients,
    genbill: state.genbill,
    existinsurance: state.existinsurance,
    countries: state.countries
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      postPatientDetails: postPatientDetails,
      getPatientDetails: AlgaehActions,
      initialStatePatientData: AlgaehActions,
      postVisitDetails: postVisitDetails,
      generateBill: AlgaehActions,
      initialStateBillGen: AlgaehActions,
      getPatientInsurance: AlgaehActions,
      initialbillingCalculations: AlgaehActions,
      billingCalculations: AlgaehActions,
      getCountries: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RegistrationPatient)
);
