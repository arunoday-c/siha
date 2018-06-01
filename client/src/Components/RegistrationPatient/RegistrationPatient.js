import React, { Component } from "react";
import Header from "./../common/Header/Header.js";
import SideMenuBar from "./../common/SideMenuBar/SideMenuBar.js";
import PatientDetails from "./PatientDetails/PatientDetails.js";
import ConsultationDetails from "./ConsultationDetails/ConsultationDetails.js";
import InsuranceDetails from "./InsuranceDetails/InsuranceDetails.js";
import Billing from "./Billing/BillingDetails";
import Paper from "material-ui/Paper";
import styles from "./registration.css";
import PatRegIOputs from "../../Models/RegistrationPatient.js";
import Button from "material-ui/Button";
import extend from "extend";
import { postPatientDetails, getPatientDetails } from "../../actions/RegistrationPatient/Registrationactions.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Snackbar from "material-ui/Snackbar";
import VisitDetails from "../../Models/VisitDetails.js";
import IconButton from "material-ui/IconButton";
import Close from "@material-ui/icons/Close";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import MyContext from "../../utils/MyContext.js";
import { algaehApiCall } from "../../utils/algaehApiCall.js";
import AHSnackbar from "../common/Inputs/AHSnackbar.js";
import {Validations} from "./FrontdeskValidation.js";
import AlgaehLabel from "../Wrapper/label.js";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";

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
      selectedLang: "lang_en",
      chnageLang: false
    }
  }

  componentDidMount() {
    var width = document.getElementById("attach").offsetHeight;    
    this.setState({
      widthImg: width
    });
    let IOputs = PatRegIOputs.inputParam()
    this.setState({...this.state, ...IOputs})
    debugger;
  }

  ClearData(e) {
    this.setState (PatRegIOputs.inputParam());
  }

  SavePatientDetails(e) {
    debugger;
    const err = Validations(this);
    console.log(err);    
    if (!err) {
      this.props.postPatientDetails(this.state,
        data => {
          this.setState({
            patient_code: data.patient_code,
            visit_code: data.visit_code,
            DialogOpen: true
          });
        }
      );
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  DialoghandleClose = () => {
    this.setState({ DialogOpen: false });
  };

  SideMenuBarOpen(sidOpen) {
    debugger;
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  SelectLanguage(secLang){
    debugger;
    this.setState({
      selectedLang: secLang,
      chnageLang: !this.state.chnageLang
    });
    // this.forceUpdate();
  }

  getCtrlCode(data) {
    debugger;
    this.setState({
      patient_code: data
    },()=>{
      clearInterval(intervalId);
        intervalId = setInterval(()=> {
          this.props.getPatientDetails(this.state.patient_code,
            data => {
              debugger;
              this.setState({
                patient_code: data.patient_code,
                visit_code: data.visit_code,
                DialogOpen: true
              });
            });
          clearInterval(intervalId);
        } , 500);
    });
  }

  
  render() {
    let margin = this.state.sidBarOpen ? "200px" : "";
    return (
      <div id="attach" style={{ overflow: "visible" }}>
        {this.state.sidBarOpen === true ? (
          <div>
            <SideMenuBar />
          </div>
        ) : null}

        <div style={{ marginLeft: margin }}>
          <Header
            height={this.state.widthImg}
            title={<AlgaehLabel label={{fieldName: "form_name"}}/>}
            SideMenuBarOpen={this.SideMenuBarOpen.bind(this)}
            SelectLanguage = {this.SelectLanguage.bind(this)}
          />
          
          <BreadCrumb
            title={<AlgaehLabel label={{fieldName: "form_patregister",}}/>}
            ctrlName={<AlgaehLabel label={{fieldName: "patient_code",}}/>}                    
            screenName={<AlgaehLabel label={{fieldName: "form_name",}}/>}
            dateLabel={<AlgaehLabel label={{fieldName: "registration_date",}}/>}
            HideHalfbread={true}
            ctrlCode={this.state.patient_code}
            ctrlDate = {this.state.registration_date}
            ControlCode = {this.getCtrlCode.bind(this)}
          />
          <div>
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: (obj) => {
                  debugger;
                  this.setState(obj);                  
                }
              }}>
              <PatientDetails PatRegIOputs={this.state} />
              <ConsultationDetails PatRegIOputs={this.state} />
              <InsuranceDetails PatRegIOputs={this.state}/>
              <Billing PatRegIOputs={this.state}/>
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
                          onClick={this.ClearData}
                        >
                          Clear
                        </button>
                      </div>
                      <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 order-12">
                        <button
                          className="htpl1-phase1-btn-primary"
                          onClick={this.SavePatientDetails.bind(this)}
                        >
                          Save
                        </button>

                        <AHSnackbar                          
                          open={this.state.open}
                          handleClose={this.handleClose}
                          MandatoryMsg= {this.state.MandatoryMsg}
                        />
                      </div>
                    </div>
                  </div>
                </AppBar>
              </div>
            </MyContext.Provider>
          </div>
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

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

function mapStateToProps(state) {
  return {
    patients: state.patients.patients
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { postPatientDetails: postPatientDetails, getPatientDetails: getPatientDetails },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RegistrationPatient)
);
