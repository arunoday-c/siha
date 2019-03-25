import React, { PureComponent } from "react";
import PatientDetails from "./PatientDetails/PatientDetails.js";
import ConsultationDetails from "./ConsultationDetails/ConsultationDetails.js";
import InsuranceDetails from "./InsuranceDetails/InsuranceDetails.js";
import Billing from "./Billing/AddBillingForm";
import "./registration.css";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";
import extend from "extend";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  postPatientDetails,
  postVisitDetails
} from "../../actions/RegistrationPatient/Registrationactions";

import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import MyContext from "../../utils/MyContext.js";
import { Validations } from "./FrontdeskValidation.js";
import AlgaehLabel from "../Wrapper/label.js";

import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../utils/algaehApiCall.js";
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
  ShowAdvanceScreen,
  getHospitalDetails,
  getCashiersAndShiftMAP
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

    if (
      this.props.patient_code !== undefined &&
      this.props.patient_code.length !== 0
    ) {
      this.getCtrlCode(this.props.patient_code);
    } else if (this.props.patient_details !== undefined) {
      this.setState(
        {
          full_name: this.props.patient_details.patient_name,
          arabic_name: this.props.patient_details.arabic_patient_name,
          date_of_birth: this.props.patient_details.date_of_birth,
          age: this.props.patient_details.patient_age,
          gender: this.props.patient_details.patient_gender,
          contact_number: this.props.patient_details.patient_phone,
          email: this.props.patient_details.patient_email,
          title_id: this.props.patient_details.title_id,
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
          appointment_id: this.state.hims_f_patient_appointment_id
        },
        () => {
          if (this.props.fromAppoinment === true) {
            generateBillDetails(this, this);
          }
        }
      );
    }

    this.props.setSelectedInsurance({
      redux: {
        type: "PRIMARY_INSURANCE_DATA",
        mappingName: "primaryinsurance",
        data: []
      }
    });

    this.props.setSelectedInsurance({
      redux: {
        type: "SECONDARY_INSURANCE_DATA",
        mappingName: "secondaryinsurance",
        data: []
      }
    });

    if (
      this.props.hospitaldetails === undefined ||
      this.props.hospitaldetails.length === 0
    ) {
      getHospitalDetails(this, this);
    } else {
      if (
        this.props.hospitaldetails !== undefined ||
        this.props.hospitaldetails.length !== 0
      ) {
        this.setState({
          vat_applicable: this.props.hospitaldetails[0].local_vat_applicable,
          nationality_id: this.props.hospitaldetails[0].default_nationality,
          country_id: this.props.hospitaldetails[0].default_country,
          patient_type: this.props.hospitaldetails[0].default_patient_type
        });
      }
    }

    getCashiersAndShiftMAP(this, this);

    let _screenName = getCookie("ScreenName").replace("/", "");
    algaehApiCall({
      uri: "/userPreferences/get",
      data: {
        screenName: _screenName,
        identifier: "Counter"
      },
      method: "GET",
      onSuccess: response => {
        this.setState({
          counter_id: response.data.records.selectedValue
        });
      }
    });
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

            delete patientdata.countrystates;
            delete patientdata.cities;
            algaehApiCall({
              uri: "/frontDesk/add",
              module: "frontDesk",
              data: patientdata,
              method: "POST",
              onSuccess: response => {
                AlgaehLoader({ show: false });
                if (response.data.success) {
                  $this.setState({
                    patient_code: response.data.records.patient_code,
                    bill_number: response.data.records.bill_number,
                    receipt_number: response.data.records.receipt_number,
                    saveEnable: true,
                    insuranceYes: true,
                    sec_insuranceYes: true,
                    ProcessInsure: true
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
              module: "frontDesk",
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
          title: "Please recive the amount.",
          type: "error"
        });
      }
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

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
    let appointment_id = this.props.hims_f_patient_appointment_id || null;
    let title_id = Window.global["appt-title-id"] || null;

    AlgaehLoader({ show: true });

    algaehApiCall({
      uri: "/frontDesk/get",
      module: "frontDesk",
      method: "GET",
      data: { patient_code: patcode },
      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records;

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
            data.patientRegistration.appointment_id = appointment_id;
            data.patientRegistration.title_id = title_id;
          }
          //Appoinment End
          data.patientRegistration.filePreview =
            "data:image/png;base64, " + data.patient_Image;
          data.patientRegistration.arabic_name =
            data.patientRegistration.arabic_name || "No Name";

          data.patientRegistration.date_of_birth = moment(
            data.patientRegistration.date_of_birth
          )._d;
          $this.setState(data.patientRegistration, () => {
            if (fromAppoinment === true) {
              generateBillDetails(this, this);
            }
          });

          $this.props.getPatientInsurance({
            // uri: "/insurance/getPatientInsurance",
            uri: "/patientRegistration/getPatientInsurance",
            module: "frontDesk",
            method: "GET",
            data: {
              patient_id: data.patientRegistration.hims_d_patient_id
            },
            redux: {
              type: "EXIT_INSURANCE_GET_DATA",
              mappingName: "existinsurance"
            }
          });
        }
        AlgaehLoader({ show: false });
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
                          Options.datetimeFormat
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
            <div className="row">
              <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-8">
                <PatientDetails
                  PatRegIOputs={this.state}
                  clearData={this.state.clearData}
                />

                <ConsultationDetails PatRegIOputs={this.state} />
                <InsuranceDetails PatRegIOputs={this.state} />
              </div>
              <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-4">
                <Billing PatRegIOputs={this.state} loader={true} />
              </div>
            </div>
            <div className="hptl-phase1-footer">
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
    existinsurance: state.existinsurance,
    countries: state.countries,
    primaryinsurance: state.primaryinsurance,
    secondaryinsurance: state.secondaryinsurance,
    hospitaldetails: state.hospitaldetails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      postPatientDetails: postPatientDetails,
      getPatientDetails: AlgaehActions,
      initialStatePatientData: AlgaehActions,
      postVisitDetails: postVisitDetails,
      initialStateBillGen: AlgaehActions,
      getPatientInsurance: AlgaehActions,
      getCountries: AlgaehActions,
      setSelectedInsurance: AlgaehActions,
      getHospitalDetails: AlgaehActions
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
