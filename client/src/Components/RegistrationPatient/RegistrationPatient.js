import React, { Component } from "react";
import { CSSTransition } from "react-transition-group";
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
import {
  imageToByteArray,
  AlgaehValidation
} from "../../utils/GlobalFunctions";
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
  getCashiersAndShiftMAP,
  closePopup,
  generateIdCard,
  generateReceipt,
  getCtrlCode,
  ShowPackageUtilize,
  ClosePackageUtilize,
  UpdatePatientDetail
} from "./RegistrationPatientEvent";
import { SetBulkState } from "../../utils/GlobalFunctions";
import PackageUtilize from "../PatientProfile/PackageUtilize/PackageUtilize";
import UpdatePatientPopup from "../UpdatePatientDetails/UpdatePatientPopup";

const emptyObject = extend(
  PatRegIOputs.inputParam(),
  BillingIOputs.inputParam()
);

class RegistrationPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AdvanceOpen: false,
      RefundOpen: false,
      visittypeselect: true,
      clearEnable: false,
      isPackUtOpen: false,
      UpdatepatientDetail: false
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
      getCtrlCode(this, this.props.patient_code);
      getCashiersAndShiftMAP(this, "NA");
    } else {
      getCashiersAndShiftMAP(this, "A");
    }

    this.props.setSelectedInsurance({
      redux: {
        type: "PRIMARY_INSURANCE_DATA",
        mappingName: "primaryinsurance",
        data: []
      }
    });

    this.props.getPatientPackage({
      redux: {
        type: "Package_GET_DATA",
        mappingName: "PatientPackageList",
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

    this.props.getVisittypes({
      uri: "/visitType/get",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "VISITTYPE_GET_DATA",
        mappingName: "visittypes"
      }
    });
  }

  CloseRefundScreen(e) {
    this.setState(
      {
        RefundOpen: !this.state.RefundOpen
      },
      () => {
        getCtrlCode(this, this.state.patient_code);
      }
    );
  }

  CloseAdvanceScreen(e) {
    this.setState(
      {
        AdvanceOpen: !this.state.AdvanceOpen
      },
      () => {
        getCtrlCode(this, this.state.patient_code);
      }
    );
  }

  CloseUpdatePatientDetail(e) {
    AlgaehLoader({ show: true });
    this.setState(
      {
        UpdatepatientDetail: !this.state.UpdatepatientDetail
      },
      () => {
        getCtrlCode(this, this.state.patient_code);
      }
    );
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

  componentWillReceiveProps() {
    let prevLang = getCookie("Language");
    if (prevLang !== this.state.selectedLang) {
      setGlobal({ selectedLang: prevLang });
      let IOputs = emptyObject;
      let counter_id = null;
      IOputs.visittypeselect = true;
      IOputs.age = 0;
      IOputs.AGEMM = 0;
      IOputs.AGEDD = 0;

      // let prevLang = getCookie("Language");

      IOputs.selectedLang = getCookie("Language");

      let _screenName = getCookie("ScreenName").replace("/", "");
      let $this = this;
      algaehApiCall({
        uri: "/userPreferences/get",
        data: {
          screenName: _screenName,
          identifier: "Counter"
        },
        method: "GET",
        onSuccess: response => {
          counter_id = response.data.records.selectedValue;

          if (
            $this.props.hospitaldetails !== undefined ||
            $this.props.hospitaldetails.length !== 0
          ) {
            IOputs.vat_applicable =
              $this.props.hospitaldetails[0].local_vat_applicable;
            IOputs.nationality_id =
              $this.props.hospitaldetails[0].default_nationality;
            IOputs.country_id = $this.props.hospitaldetails[0].default_country;
            IOputs.patient_type =
              $this.props.hospitaldetails[0].default_patient_type;
          }

          if (counter_id !== null) {
            IOputs.counter_id = counter_id;
          }

          IOputs.forceRefresh = true;
          IOputs.Rerender = true;
          $this.setState(IOputs, () => {
            $this.props.setSelectedInsurance({
              redux: {
                type: "PRIMARY_INSURANCE_DATA",
                mappingName: "primaryinsurance",
                data: []
              }
            });

            $this.props.setSelectedInsurance({
              redux: {
                type: "SECONDARY_INSURANCE_DATA",
                mappingName: "secondaryinsurance",
                data: []
              }
            });
          });
        }
      });
    }
  }

  SavePatientDetails(e) {
    let primary_policy_num = this.state.primary_policy_num;
    SetBulkState({
      state: this,
      callback: () => {
        AlgaehValidation({
          alertTypeIcon: "warning",
          querySelector: "data-validate='demographicDetails'",
          onSuccess: () => {
            const err = Validations(this);

            if (!err) {
              AlgaehLoader({ show: true });
              if (this.state.unbalanced_amount === 0) {
                this.GenerateReciept($this => {
                  let patientdata = {};

                  if ($this.state.filePreview !== null) {
                    patientdata = {
                      ...$this.state,
                      patient_Image: imageToByteArray($this.state.filePreview)
                    };
                  } else {
                    patientdata = $this.state;
                  }
                  const _patImage = $this.state.patientImage;
                  const _patientIdCard = $this.state.patientIdCard;
                  const _patInsuranceFrontImg =
                    $this.state.patInsuranceFrontImg;
                  const _patInsuranceBackImg = $this.state.patInsuranceBackImg;
                  const _patSecInsuranceFrontImg =
                    $this.state.patSecInsuranceFrontImg;
                  const _patSecInsuranceBackImg =
                    $this.state.patSecInsuranceBackImg;
                  delete patientdata.patSecInsuranceFrontImg;
                  delete patientdata.patientIdCard;
                  delete patientdata.patInsuranceFrontImg;
                  delete patientdata.patInsuranceBackImg;
                  delete patientdata.patSecInsuranceBackImg;
                  delete patientdata.patientImage;
                  delete patientdata.countrystates;
                  delete patientdata.cities;
                  delete patientdata.doctors;

                  if ($this.state.hims_d_patient_id === null) {
                    algaehApiCall({
                      uri: "/frontDesk/add",
                      module: "frontDesk",
                      data: patientdata,
                      method: "POST",
                      onSuccess: response => {
                        // AlgaehLoader({ show: false });
                        if (response.data.success) {
                          AlgaehLoader({ show: false });
                          let _arrayImages = [];
                          if (_patImage !== undefined) {
                            _arrayImages.push(
                              new Promise((resolve, reject) => {
                                _patImage.SavingImageOnServer(
                                  undefined,
                                  undefined,
                                  undefined,
                                  response.data.records.patient_code,
                                  () => {
                                    resolve();
                                  }
                                );
                              })
                            );
                          }
                          if (_patientIdCard !== undefined) {
                            _arrayImages.push(
                              new Promise((resolve, reject) => {
                                _patientIdCard.SavingImageOnServer(
                                  undefined,
                                  undefined,
                                  undefined,
                                  $this.state.primary_id_no,
                                  () => {
                                    resolve();
                                  }
                                );
                              })
                            );
                          }

                          if (
                            _patInsuranceFrontImg !== undefined &&
                            this.state.insured === "Y"
                          ) {
                            _arrayImages.push(
                              new Promise((resolve, reject) => {
                                _patInsuranceFrontImg.SavingImageOnServer(
                                  undefined,
                                  undefined,
                                  undefined,
                                  $this.state.primary_card_number + "_front",
                                  () => {
                                    resolve();
                                  }
                                );
                              })
                            );
                          }
                          if (
                            _patInsuranceBackImg !== undefined &&
                            this.state.insured === "Y"
                          ) {
                            _arrayImages.push(
                              new Promise((resolve, reject) => {
                                _patInsuranceBackImg.SavingImageOnServer(
                                  undefined,
                                  undefined,
                                  undefined,
                                  $this.state.primary_card_number + "_back",
                                  () => {
                                    resolve();
                                  }
                                );
                              })
                            );
                          }

                          Promise.all(_arrayImages).then(result => {
                            AlgaehLoader({ show: false });

                            $this.setState(
                              {
                                patient_code:
                                  response.data.records.patient_code,
                                bill_number: response.data.records.bill_number,
                                receipt_number:
                                  response.data.records.receipt_number,
                                hims_d_patient_id:
                                  response.data.records.hims_d_patient_id,
                                patient_visit_id:
                                  response.data.records.patient_visit_id,
                                hims_f_billing_header_id:
                                  response.data.records
                                    .hims_f_billing_header_id,

                                saveEnable: true,
                                insuranceYes: true,
                                hideInsurance: true,
                                sec_insuranceYes: true,
                                ProcessInsure: true,
                                existingPatient: true,
                                popUpGenereted: true,
                                advanceEnable: false,
                                savedData: true,
                                primary_policy_num: primary_policy_num
                              },
                              () => {
                                if (
                                  typeof $this.props.updateAppointmentStatus ===
                                  "function"
                                ) {
                                  $this.props.updateAppointmentStatus();
                                }
                              }
                            );
                            swalMessage({
                              title: "Done Successfully",
                              type: "success"
                            });
                          });
                        } else {
                          AlgaehLoader({ show: false });
                          swalMessage({
                            type: "error",
                            title: response.data.records.message
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
                      data: patientdata,
                      method: "POST",
                      onSuccess: response => {
                        // AlgaehLoader({ show: false });
                        if (response.data.success) {
                          AlgaehLoader({ show: false });
                          let _arrayImages = [];
                          if (_patImage !== undefined) {
                            _arrayImages.push(
                              new Promise((resolve, reject) => {
                                _patImage.SavingImageOnServer(
                                  undefined,
                                  undefined,
                                  undefined,
                                  $this.state.patient_code,
                                  () => {
                                    resolve();
                                  }
                                );
                              })
                            );
                          }
                          if (_patientIdCard !== undefined) {
                            _arrayImages.push(
                              new Promise((resolve, reject) => {
                                _patientIdCard.SavingImageOnServer(
                                  undefined,
                                  undefined,
                                  undefined,
                                  $this.state.primary_id_no,
                                  () => {
                                    resolve();
                                  }
                                );
                              })
                            );
                          }

                          if (
                            _patInsuranceFrontImg !== undefined &&
                            this.state.insured === "Y"
                          ) {
                            _arrayImages.push(
                              new Promise((resolve, reject) => {
                                _patInsuranceFrontImg.SavingImageOnServer(
                                  undefined,
                                  undefined,
                                  undefined,
                                  $this.state.primary_card_number + "_front",
                                  () => {
                                    resolve();
                                  }
                                );
                              })
                            );
                          }
                          if (
                            _patInsuranceBackImg !== undefined &&
                            this.state.insured === "Y"
                          ) {
                            _arrayImages.push(
                              new Promise((resolve, reject) => {
                                _patInsuranceBackImg.SavingImageOnServer(
                                  undefined,
                                  undefined,
                                  undefined,
                                  $this.state.primary_card_number + "_back",
                                  () => {
                                    resolve();
                                  }
                                );
                              })
                            );
                          }

                          Promise.all(_arrayImages).then(result => {
                            AlgaehLoader({ show: false });

                            $this.setState(
                              {
                                bill_number: response.data.records.bill_number,
                                receipt_number:
                                  response.data.records.receipt_number,
                                patient_visit_id:
                                  response.data.records.patient_visit_id,
                                hims_f_billing_header_id:
                                  response.data.records
                                    .hims_f_billing_header_id,

                                saveEnable: true,
                                insuranceYes: true,
                                hideInsurance: true,
                                sec_insuranceYes: true,
                                ProcessInsure: true,
                                existingPatient: true,
                                popUpGenereted: true,
                                savedData: true,
                                primary_policy_num: primary_policy_num
                              },
                              () => {
                                if (
                                  typeof $this.props.updateAppointmentStatus ===
                                  "function"
                                ) {
                                  $this.props.updateAppointmentStatus();
                                }
                              }
                            );
                            swalMessage({
                              title: "Done Successfully",
                              type: "success"
                            });
                          });
                        } else {
                          AlgaehLoader({ show: false });
                          swalMessage({
                            type: "error",
                            title: response.data.records.message
                          });
                          this.setState({
                            primary_policy_num: primary_policy_num
                          });
                        }
                      },
                      onFailure: error => {
                        this.setState({
                          primary_policy_num: primary_policy_num
                        });
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
                  title: "Please receive the amount.",
                  type: "error"
                });
                this.setState({ primary_policy_num: primary_policy_num });
              }
            } else {
              this.setState({ primary_policy_num: primary_policy_num });
            }
          },
          onCatch: () => {
            this.setState({ primary_policy_num: primary_policy_num });
          }
        });
      }
    });
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  printBarCodeHandler(e) {
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

  //Render Page Start Here

  render() {
    const Package_Exists =
      this.props.PatientPackageList === undefined
        ? []
        : this.props.PatientPackageList;
    return (
      <div id="attach">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ fieldName: "form_patregister", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
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
              onChange: ClearData.bind(this, this, "pat_code")
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
          editData={{
            events: {
              onClick: UpdatePatientDetail.bind(this, this)
            }
          }}
          printArea={{
            menuitems: [
              {
                label: "ID Card",
                events: {
                  onClick: () => {
                    generateIdCard(this, this);
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
                <InsuranceDetails PatRegIOputs={this.state} />
                <ConsultationDetails PatRegIOputs={this.state} />
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
                  {this.props.fromAppoinment === true ? null : (
                    <div className="">
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
                        disabled={
                          this.state.advance_amount === null
                            ? true
                            : this.state.advanceEnable
                        }
                      >
                        <AlgaehLabel
                          label={{
                            fieldName: "btn_refund",
                            returnText: true
                          }}
                        />
                      </button>
                      <button
                        type="button"
                        className="btn btn-other"
                        onClick={ShowAdvanceScreen.bind(this, this)}
                        disabled={this.state.advanceEnable}
                      >
                        <AlgaehLabel
                          label={{
                            fieldName: "btn_advance",
                            returnText: true
                          }}
                        />
                      </button>

                      {Package_Exists.length > 0 ? (
                        <div className="col">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={ShowPackageUtilize.bind(this, this)}
                          >
                            View Package
                          </button>
                        </div>
                      ) : null}
                      <PackageUtilize
                        open={this.state.isPackUtOpen}
                        onClose={ClosePackageUtilize.bind(this, this)}
                        package_detail={this.state.package_detail}
                        from="frontDesk"
                        from_billing={true}
                        patient_id={this.state.patient_id}
                      />
                    </div>
                  )}

                  <AddAdvanceModal
                    show={this.state.RefundOpen}
                    onClose={this.CloseRefundScreen.bind(this)}
                    selectedLang={this.state.selectedLang}
                    HeaderCaption={
                      <AlgaehLabel
                        label={{
                          fieldName: "refund_caption",
                          align: "ltr"
                        }}
                      />
                    }
                    Advance={false}
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

                  <AddAdvanceModal
                    show={this.state.AdvanceOpen}
                    onClose={this.CloseAdvanceScreen.bind(this)}
                    selectedLang={this.state.selectedLang}
                    HeaderCaption={
                      <AlgaehLabel
                        label={{
                          fieldName: "advance_caption",
                          align: "ltr"
                        }}
                      />
                    }
                    Advance={true}
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

                  <UpdatePatientPopup
                    show={this.state.UpdatepatientDetail}
                    onClose={this.CloseUpdatePatientDetail.bind(this)}
                    patient_code={this.state.patient_code}
                  />
                </div>
              </div>
            </div>
          </MyContext.Provider>
        </div>
        <CSSTransition
          in={this.state.popUpGenereted}
          classNames={{
            enterActive: "editFloatCntr animated slideInUp faster",
            enterDone: "editFloatCntr",
            exitActive: "editFloatCntr animated slideOutDown faster",
            exitDone: "editFloatCntr"
          }}
          unmountOnExit
          appear={false}
          timeout={500}
          mountOnEnter
        >
          <div className={"col-12"}>
            {/* <h5>Edit Basic Details</h5> */}
            <div className="row">
              <div className="col-3">
                <AlgaehLabel
                  label={{
                    forceLabel: "Patient Code"
                  }}
                />
                <h6>{this.state.patient_code}</h6>
              </div>

              <div className="col-3">
                <AlgaehLabel
                  label={{
                    forceLabel: "Bill Number"
                  }}
                />
                <h6>{this.state.bill_number}</h6>
              </div>

              <div className="col-3">
                <AlgaehLabel
                  label={{
                    forceLabel: "Receipt Number"
                  }}
                />
                <h6>{this.state.receipt_number}</h6>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={generateReceipt.bind(this, this)}
                >
                  Print Receipt
                </button>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={closePopup.bind(this, this)}
                >
                  Close
                </button>
                <button
                  className="btn btn-default"
                  onClick={generateIdCard.bind(this, this)}
                >
                  Print Card
                </button>

                {/* <button
                className="btn btn-default"
                // onClick={closePopup.bind(this, this, "")}
              >
                Print Barcode
              </button> */}
              </div>
            </div>
          </div>
        </CSSTransition>
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
    hospitaldetails: state.hospitaldetails,
    PatientPackageList: state.PatientPackageList,
    visittypes: state.visittypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientDetails: AlgaehActions,
      initialStatePatientData: AlgaehActions,
      getVisittypes: AlgaehActions,
      initialStateBillGen: AlgaehActions,
      getPatientInsurance: AlgaehActions,
      getCountries: AlgaehActions,
      setSelectedInsurance: AlgaehActions,
      getHospitalDetails: AlgaehActions,
      getPatientPackage: AlgaehActions
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
