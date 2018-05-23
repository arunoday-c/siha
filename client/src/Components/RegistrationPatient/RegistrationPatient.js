import React, { Component } from "react";
import Header from "./../common/Header/Header.js";
import SideMenuBar from "./../common/SideMenuBar/SideMenuBar.js";
// import Footer from "./../common/Footer/Footer.js";
import PatientDetails from "./PatientDetails/PatientDetails.js";
import ConsultationDetails from "./ConsultationDetails/ConsultationDetails.js";
import InsuranceDetails from "./InsuranceDetails/InsuranceDetails.js";
import Billing from "./Billing/BillingDetails";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Paper from "material-ui/Paper";
import styles from "./registration.css";
import PatRegIOputs from "../../Models/RegistrationPatient.js";
import Button from "material-ui/Button";
import extend from "extend";
import { postPatientDetails } from "../../actions/RegistrationPatient/Registrationactions.js";
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


const FrontDeskContext = React.createContext();

class RegistrationPatient extends Component {
  constructor(props) {
    super(props);
    debugger;
    localStorage.clear();
    let dataExists = window.localStorage.getItem("Patient Details");
    let InputOutput = PatRegIOputs.inputParam();

    if (dataExists != null && dataExists != "") {
      InputOutput = JSON.parse(dataExists);
    }

    this.state = extend(
      {
        widthImg: "",
        open: false,
        vertical: null,
        horizontal: null,
        DialogOpen: false,
        sideBarOpen: false,
        sidBarOpen: false
      },
      PatRegIOputs.inputParam()
    );
  }

  componentDidMount() {
    var width = document.getElementById("attach").offsetHeight;
    console.log("width", width);
    this.setState({
      widthImg: width
    });
  }

  Validations = () => {
    let isError = false;
    let frontDeskDetails = JSON.parse(localStorage.getItem("Patient Details"));
    if (frontDeskDetails.first_name.length <= 0) {
      isError = true;
      this.setState({
        open: true,
        MandatoryMsg: "Invalid. First Name Cannot be blank."
      });
    }
    return isError;
  };

  ClearData(e) {
    debugger;
    localStorage.clear();
  }
  SavePatientDetails(e) {
    debugger;

    console.log("", FrontDeskContext);
    return
    
    const err = this.Validations();
    console.log(err);
    if (!err) {
      this.props.postPatientDetails(
        JSON.parse(localStorage.getItem("Patient Details")),
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
  PatRegIOputs(value){
    debugger;
    console.log("", value);
    // this.setState({
    //   state: value
    // });
  }

  render() {
    let addcls = "";
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
            title="Front Desk"
            SideMenuBarOpen={this.SideMenuBarOpen.bind(this)}
          />
          
          <BreadCrumb title="Patient Registration"  ctrlName="Patient Code" 
          screenName="Front Desk" dateLabel="Registration" HideHalfbread = {true}/>
          {/* <br/> <br/><br/> <br/> */}
          <div id="main">
            <FrontDeskContext.Provider>
              <PatientDetails
                PatRegIOputs={PatRegIOputs.inputParam()}
                patientcode={this.state.patient_code}
              />
              <ConsultationDetails
                PatRegIOputs={PatRegIOputs.inputParam()}
                visitcode={this.state.visit_code}
              />
              <InsuranceDetails />
              <Billing />
              <div className="hptl-phase1-footer">
                <br/> <br/>
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

                        <Snackbar                          
                          open={this.state.open}
                          onClose={this.handleClose}
                          ContentProps={{
                            "aria-describedby": "message-id"
                          }}
                          message={
                            <span id="message-id" style={{ color: "red" }}>
                              {this.state.MandatoryMsg}
                            </span>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </AppBar>
              </div>
              </FrontDeskContext.Provider>
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

function mapStateToProps(state) {
  return {
    patients: state.patients.patients
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { postPatientDetails: postPatientDetails },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RegistrationPatient)
);
