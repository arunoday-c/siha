import React, { Component } from "react";
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
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
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
import AddAdvanceModal from "../Advance/AdvanceModal";
import { successfulMessage } from "../../utils/GlobalFunctions";
import { setGlobal } from "../../utils/GlobalFunctions";
import { AlgaehActions } from "../../actions/algaehActions";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const emptyObject = extend(
  PatRegIOputs.inputParam(),
  BillingIOputs.inputParam()
);
var intervalId;
class RegistrationPatient extends Component {
  constructor(props) {
    super(props);

    this.state = { AdvanceOpen: false, RefundOpen: false };
  }

  componentWillMount() {
    let IOputs = emptyObject;
    this.setState(IOputs);

    setGlobal({ selectedLang: "en" });
  }
  componentDidMount() {
    var width = document.getElementById("attach").offsetHeight;
    this.setState({
      widthImg: width
    });
    if (this.state.saveEnable === "clear") {
      this.props.initialStatePatientData({
        redux: {
          type: "PAT_INIT_DATA",
          mappingName: "patients",
          data: {}
        }
      });
    }

    let prevLang = getCookie("Language");

    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
    });
  }

  ClearData(e) {
    this.props.initialStatePatientData({
      redux: {
        type: "PAT_INIT_DATA",
        mappingName: "patients",
        data: {}
      }
    });

    let IOputs = emptyObject;

    this.setState(IOputs);
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
          created_by: getCookie("UserID"),
          created_date: new Date(),
          updated_by: null,
          updated_date: null,
          card_type: null
        });
      }
      if (this.state.card_amount > 0) {
        obj.push({
          hims_f_receipt_header_id: null,
          card_check_number: this.state.card_number,
          expiry_date: this.state.card_date,
          pay_type: this.state.pay_card,
          amount: this.state.card_amount,
          created_by: getCookie("UserID"),
          created_date: new Date(),
          updated_by: null,
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
          created_by: getCookie("UserID"),
          created_date: new Date(),
          updated_by: null,
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
      this.GenerateReciept($this => {
        if ($this.state.hims_d_patient_id == null) {
          $this.props.postPatientDetails($this.state, data => {
            $this.setState({
              patient_code: data.patient_code,
              bill_number: data.bill_number,
              receipt_number: data.receipt_number,
              saveEnable: true
            });
            successfulMessage({
              message: "Done Successfully",
              title: "Success",
              icon: "success"
            });
          });
        } else {
          $this.props.postVisitDetails($this.state, data => {
            $this.setState({
              bill_number: data.bill_number,
              receipt_number: data.receipt_number,
              saveEnable: true
            });
            successfulMessage({
              message: "Done Successfully",
              title: "Success",
              icon: "success"
            });
          });
        }
      });
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  ShowAdvanceScreen(e) {
    if (this.state.patient_code != null && this.state.patient_code != "") {
      this.setState({
        ...this.state,
        AdvanceOpen: !this.state.AdvanceOpen
      });
    } else {
      successfulMessage({
        message: "Select Patient",
        title: "Error",
        icon: "error"
      });
    }
  }

  ShowRefundScreen(e) {
    if (this.state.patient_code != null && this.state.patient_code != "") {
      this.setState({
        ...this.state,
        RefundOpen: !this.state.RefundOpen
      });
    } else {
      successfulMessage({
        message: "Select Patient",
        title: "Warning",
        icon: "error"
      });
    }
  }

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen,
      breadCrumbWidth: sidOpen === true ? null : "98%"
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.genbill !== undefined && nextProps.genbill.length !== 0) {
      this.setState({ ...this.state, ...nextProps.genbill });
    }
  }
  getCtrlCode(patcode) {
    let $this = this;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
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
          data.patientRegistration.visitDetails = data.visitDetails;
          data.patientRegistration.patient_id =
            data.patientRegistration.hims_d_patient_id;
          data.patientRegistration.existingPatient = true;
          $this.setState(data.patientRegistration);

          $this.props.getPatientInsurance({
            uri: "/insurance/getPatientInsurance",
            method: "GET",
            data: { patient_id: data.patientRegistration.hims_d_patient_id },
            redux: {
              type: "EXIT_INSURANCE_GET_DATA",
              mappingName: "existinsurance"
            }
          });
        }
      });
      clearInterval(intervalId);
    }, 500);
  }

  render() {
    return (
      <div id="attach">
        {/* <Barcode value='PAT-A-000017'/> */}
        <BreadCrumb
          width={this.state.breadCrumbWidth}
          title={
            <AlgaehLabel
              label={{ fieldName: "form_patregister", align: "ltr" }}
            />
          }
          ctrlName={<AlgaehLabel label={{ fieldName: "patient_code" }} />}
          screenName={
            <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
          }
          dateLabel={<AlgaehLabel label={{ fieldName: "registration_date" }} />}
          HideHalfbread={true}
          ctrlCode={this.state.patient_code}
          ctrlDate={this.state.registration_date}
          ControlCode={this.getCtrlCode.bind(this)}
          selectedLang={this.state.selectedLang}
          searchName="patients"
        />
        <div className="spacing-push">
          <MyContext.Provider
            value={{
              state: this.state,
              updateState: obj => {
                // extend(this.state, obj);
                this.setState({ ...this.state, ...obj });
              }
            }}
          >
            <PatientDetails
              PatRegIOputs={this.state}
              clearData={this.state.clearData}
            />
            <ConsultationDetails PatRegIOputs={this.state} />
            <InsuranceDetails PatRegIOputs={this.state} />
            <Billing PatRegIOputs={this.state} />
            <div className="hptl-phase1-footer">
              <br /> <br />
              <AppBar position="static" className="main">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 order-9">
                      <button
                        className="htpl1-phase1-btn-others"
                        onClick={this.ShowAdvanceScreen.bind(this)}
                      >
                        Advance
                      </button>

                      <AddAdvanceModal
                        show={this.state.AdvanceOpen}
                        onClose={this.ShowAdvanceScreen.bind(this)}
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

                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 order-10">
                      <button
                        className="htpl1-phase1-btn-others"
                        onClick={this.ShowRefundScreen.bind(this)}
                      >
                        Refund
                      </button>

                      <AddAdvanceModal
                        show={this.state.RefundOpen}
                        onClose={this.ShowRefundScreen.bind(this)}
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
                    </div>
                    <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
                      &nbsp;
                    </div>
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 order-11">
                      <button
                        className="htpl1-phase1-btn-secondary"
                        onClick={this.ClearData.bind(this)}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 order-12">
                      <button
                        className="htpl1-phase1-btn-primary"
                        onClick={this.SavePatientDetails.bind(this)}
                        disabled={this.state.saveEnable}
                      >
                        Save
                      </button>

                      <AHSnackbar
                        open={this.state.open}
                        handleClose={this.handleClose}
                        MandatoryMsg={this.state.MandatoryMsg}
                      />
                    </div>
                  </div>
                </div>
              </AppBar>
            </div>
          </MyContext.Provider>
        </div>

        {/* <div>
          <Dialog
            open={this.state.DialogOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              Succefully Done.
            </DialogTitle>

            <DialogActions>
              <Button onClick={this.DialoghandleClose} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patients: state.patients,
    genbill: state.genbill,
    existinsurance: state.existinsurance
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
      getPatientInsurance: AlgaehActions
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
