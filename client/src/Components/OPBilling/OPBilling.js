import React, { Component } from "react";
import AppBar from "material-ui/AppBar";
import extend from "extend";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PatientDetails from "./PatientDisDetails/PatientDetails.js";
import DisplayInsuranceDetails from "./DisplayInsuranceDetails/DisplayInsuranceDetails.js";
import DisplayVisitDetails from "./VisitDetails/DisplayVisitDetails.js";
import OPBillingDetails from "./OPBilling/OPBillingDetails";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import "./OPBilling.css";
import MyContext from "../../utils/MyContext.js";
import AlgaehLabel from "../Wrapper/label.js";
import BillingIOputs from "../../Models/Billing";
import PatRegIOputs from "../../Models/RegistrationPatient";
import { getPatientDetails } from "../../actions/RegistrationPatient/Registrationactions";
import { getCookie } from "../../utils/algaehApiCall";

var intervalId;

class PatientDisplayDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en",
      s_service_type: null,
      s_service: null,
      mode_of_pay: 1,
      pay_cash: "CA",
      pay_card: "CD",
      pay_cheque: "CH",
      cash_amount: 0,
      card_number: "",
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
  }

  componentWillReceiveProps(nextProps) {
    // this.setState(nextProps.patients[0]);
  }

  getPatientDetails() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      this.props.getPatientDetails(this.state.patient_code, data => {
        data.patientRegistration.visitDetails = data.visitDetails;
        data.patientRegistration.patient_id =
          data.patientRegistration.hims_d_patient_id;
        this.setState(data.patientRegistration);
      });
      clearInterval(intervalId);
    }, 500);
  }

  getCtrlCode(data) {
    this.setState({
      bill_number: data
    });
  }

  render() {
    return (
      <div className="">
        <BreadCrumb
          //   width={this.state.breadCrumbWidth}
          title={
            <AlgaehLabel
              label={{ fieldName: "form_opbilling", align: "ltr" }}
            />
          }
          ctrlName={<AlgaehLabel label={{ fieldName: "bill_number" }} />}
          screenName={
            <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
          }
          dateLabel={<AlgaehLabel label={{ fieldName: "bill_date" }} />}
          HideHalfbread={true}
          ctrlCode={this.state.bill_number}
          ctrlDate={this.state.bill_date}
          ControlCode={this.getCtrlCode.bind(this)}
          selectedLang={this.state.selectedLang}
        />
        <div className="spacing-push">
          <MyContext.Provider
            value={{
              state: this.state,
              updateState: obj => {
                this.setState({ ...this.state, ...obj }, () => {
                  Object.keys(obj).map(key => {
                    if (key == "patient_code") {
                      this.getPatientDetails();
                    }
                  });
                });
              }
            }}
          >
            <PatientDetails BillingIOputs={this.state} />
            <DisplayInsuranceDetails BillingIOputs={this.state} />
            <DisplayVisitDetails BillingIOputs={this.state} />
            <OPBillingDetails BillingIOputs={this.state} />
          </MyContext.Provider>
        </div>

        <div className="hptl-op-billing-footer">
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
                    // onClick={this.ClearData.bind(this)}
                  >
                    Clear
                  </button>
                </div>
                <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 order-12">
                  <button
                    className="htpl1-phase1-btn-primary"
                    // onClick={this.SavePatientDetails.bind(this)}
                    // disabled={this.state.saveEnable}
                  >
                    Save
                  </button>
                </div>
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
    patients: state.patients.patients
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientDetails: getPatientDetails
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
