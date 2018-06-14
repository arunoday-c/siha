import React, { Component } from "react";
import Header from "./../common/Header/Header.js";
import SideMenuBar from "./../common/SideMenuBar/SideMenuBar.js";
import PatientDetails from "./PatientDetails/PatientDetails.js";
import ConsultationDetails from "./ConsultationDetails/ConsultationDetails.js";
import InsuranceDetails from "./InsuranceDetails/InsuranceDetails.js";
import Billing from "./Billing/BillingDetails";
import "./registration.css";
import PatRegIOputs from "../../Models/RegistrationPatient.js";
import Button from "material-ui/Button";
import extend from "extend";
import {
  postPatientDetails,
  getPatientDetails,
  initialStatePatientData
} from "../../actions/RegistrationPatient/Registrationactions";

import { postVisitDetails } from "../../actions/RegistrationPatient/Visitactions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AppBar from "material-ui/AppBar";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import MyContext from "../../utils/MyContext.js";
import AHSnackbar from "../common/Inputs/AHSnackbar.js";
import { Validations } from "./FrontdeskValidation.js";
import AlgaehLabel from "../Wrapper/label.js";
import Dialog, { DialogActions, DialogTitle } from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";
import { getCookie } from "../../utils/algaehApiCall";

// import Barcode from "../Experiment";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

var intervalId;
class RegistrationPatient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widthImg: "",
      open: false,
      vertical: null,
      horizontal: null,
      DialogOpen: false,
      sideBarOpen: false,
      sidBarOpen: true,
      selectedLang: "en",
      chnageLang: false,
      AGEMM: 0,
      AGEDD: 0,
      breadCrumbWidth: null,
      saveEnable: false,
      clearData: ""
    };
  }

  componentWillMount() {
    let IOputs = PatRegIOputs.inputParam();
    this.setState({ ...this.state, ...IOputs });
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
    this.setState({ saveEnable: false, clearData: true });
    let data = this.state;

    this.props.initialStatePatientData();
    let IOputs = PatRegIOputs.inputParam();
    extend(data, IOputs);
    this.setState(data);
  }

  SavePatientDetails(e) {
    debugger;
    const err = Validations(this);

    if (!err) {
      if (this.state.hims_d_patient_id <= 0) {
        this.props.postPatientDetails(this.state, data => {
          this.setState({
            patient_code: data.patient_code,
            visit_code: data.visit_code,
            DialogOpen: true,
            saveEnable: true
          });
        });
      } else {
        this.props.postVisitDetails(this.state, data => {
          this.setState({
            visit_code: data.visit_code,
            DialogOpen: true,
            saveEnable: true
          });
        });
      }
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  DialoghandleClose = () => {
    this.setState({ DialogOpen: false });
  };

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen,
      breadCrumbWidth: sidOpen === true ? null : "98%"
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log("", this.props.SelectLanguage);
  }

  SelectLanguage(secLang) {
    this.setState({
      selectedLang: secLang,
      chnageLang: !this.state.chnageLang
    });
  }

  getCtrlCode(data) {
    this.setState(
      {
        patient_code: data
      },
      () => {
        debugger;
        clearInterval(intervalId);
        intervalId = setInterval(() => {
          this.props.getPatientDetails(this.state.patient_code, data => {
            this.setState(PatRegIOputs.inputParam(data.patientRegistration));
            this.setState({
              visitDetails: data.visitDetails,
              patient_id: this.state.hims_d_patient_id
            });
          });
          clearInterval(intervalId);
        }, 500);
      }
    );
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
    patients: state.patients.patients
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      postPatientDetails: postPatientDetails,
      getPatientDetails: getPatientDetails,
      initialStatePatientData: initialStatePatientData,
      postVisitDetails: postVisitDetails
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
