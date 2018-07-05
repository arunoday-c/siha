import React, { Component } from "react";
import PatientDetails from "./PatientDetails/PatientDetails.js";
import ConsultationDetails from "./ConsultationDetails/ConsultationDetails.js";
import InsuranceDetails from "./InsuranceDetails/InsuranceDetails.js";
import Billing from "./Billing/BillingDetails";
import "./registration.css";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";
import Button from "material-ui/Button";
import extend from "extend";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Dialog, { DialogActions, DialogTitle } from "material-ui/Dialog";
import { Slide } from "material-ui";
import AppBar from "material-ui/AppBar";
import AHSnackbar from "../common/Inputs/AHSnackbar.js";
import {
  postPatientDetails,
  getPatientDetails,
  initialStatePatientData
} from "../../actions/RegistrationPatient/Registrationactions";
import { postVisitDetails } from "../../actions/RegistrationPatient/Visitactions";
import { generateBill } from "../../actions/RegistrationPatient/Billingactions";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import MyContext from "../../utils/MyContext.js";
import { Validations } from "./FrontdeskValidation.js";
import AlgaehLabel from "../Wrapper/label.js";
import { getCookie } from "../../utils/algaehApiCall";
import swal from "sweetalert";

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

    this.state = {};
  }

  componentWillMount() {
    debugger;
    let IOputs = emptyObject;
    this.setState(IOputs);
  }
  componentDidMount() {
    var width = document.getElementById("attach").offsetHeight;
    this.setState({
      widthImg: width
    });
    if (this.state.saveEnable === "clear") {
      this.props.initialStatePatientData();
    }

    let prevLang = getCookie("Language");
    this.setState({
      selectedLang: prevLang
    });
  }

  ClearData(e) {
    this.props.initialStatePatientData();
    let IOputs = emptyObject;

    this.setState(IOputs);
  }

  successfulMessage(message, title) {
    swal({
      title: title,
      text: message,
      icon: "error",
      button: true,
      timer: 2500
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
          created_by: getCookie("UserID"),
          created_date: moment(String(new Date())).format("YYYY-MM-DD"),
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
          created_date: moment(String(new Date())).format("YYYY-MM-DD"),
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
          created_date: moment(String(new Date())).format("YYYY-MM-DD"),
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
            this.successfulMessage("Done Successfully", "Success");
          });
        } else {
          $this.props.postVisitDetails($this.state, data => {
            $this.setState({
              bill_number: data.bill_number,
              receipt_number: data.receipt_number,
              saveEnable: true
            });
            this.successfulMessage("Done Successfully", "Success");
          });
        }
      });
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  // DialoghandleClose = () => {
  //   this.setState({ DialogOpen: false });
  // };

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen,
      breadCrumbWidth: sidOpen === true ? null : "98%"
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.genbill.length != 0) {
      this.setState({ ...this.state, ...nextProps.genbill });
    }
  }
  getCtrlCode(patcode) {
    let $this = this;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      this.props.getPatientDetails(patcode, data => {
        data.patientRegistration.visitDetails = data.visitDetails;
        data.patientRegistration.patient_id =
          data.patientRegistration.hims_d_patient_id;
        data.patientRegistration.existingPatient = true;
        $this.setState(data.patientRegistration);
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
                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xl-10">
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

        <div>
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
        </div>
      </div>
    );
  }
}

// function TransitionUp(props) {
//   return <Slide {...props} direction="up" />;
// }

function mapStateToProps(state) {
  return {
    patients: state.patients.patients,
    genbill: state.genbill.genbill
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      postPatientDetails: postPatientDetails,
      getPatientDetails: getPatientDetails,
      initialStatePatientData: initialStatePatientData,
      postVisitDetails: postVisitDetails,
      generateBill: generateBill
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
