import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
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
import { getCookie } from "../../utils/algaehApiCall";

import { AlgaehActions } from "../../actions/algaehActions";
import { postBillDetsils } from "../../actions/RegistrationPatient/Billingactions";
import { successfulMessage } from "../../utils/GlobalFunctions";
import { AlgaehDateHandler } from "../Wrapper/algaehWrapper";
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
    //this.setState(nextProps.patients[0]);

    let output = {};
    let billOut = {};
    if (
      nextProps.existinsurance !== undefined &&
      nextProps.existinsurance.length !== 0
    ) {
      output = nextProps.existinsurance[0];
    }
    if (nextProps.genbill !== undefined && nextProps.genbill.length !== 0) {
      billOut = nextProps.genbill;
    }

    this.setState({ ...this.state, ...billOut, ...output });
  }

  getPatientDetails() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      this.props.getPatientDetails({
        uri: "/frontDesk/get",
        method: "GET",
        printInput: true,
        data: { patient_code: this.state.patient_code },
        redux: {
          type: "PAT_GET_DATA",
          mappingName: "patients"
        },
        afterSuccess: data => {
          data.patientRegistration.visitDetails = data.visitDetails;
          data.patientRegistration.patient_id =
            data.patientRegistration.hims_d_patient_id;
          this.setState(data.patientRegistration);
        }
      });
      clearInterval(intervalId);
    }, 500);
  }

  // getCtrlCode(data) {
  //   this.setState({
  //     bill_number: data
  //   });
  // }

  getCtrlCode(billcode) {
    let $this = this;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      this.props.getPatientDetails({
        uri: "/opBilling/get",
        method: "GET",
        printInput: true,
        data: { bill_number: billcode },
        redux: {
          type: "BILLS_GET_DATA",
          mappingName: "bills"
        },
        afterSuccess: data => {
          $this.setState(data);
        }
      });
      clearInterval(intervalId);
    }, 500);
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

  SaveBill(e) {
    this.GenerateReciept($this => {
      $this.props.postBillDetsils($this.state, data => {
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
          printArea={true}
          // ctrlName={<AlgaehLabel label={{ fieldName: "bill_number" }} />}
          // screenName={
          //   <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
          // }
          //  dateLabel={<AlgaehLabel label={{ fieldName: "bill_date" }} />}
          //  HideHalfbread={true}
          // ctrlCode={this.state.bill_number}
          //  ctrlDate={this.state.bill_date}
          // ControlCode={this.getCtrlCode.bind(this)}
          selectedLang={this.state.selectedLang}
          // searchName="bills"
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
            <DisplayVisitDetails BillingIOputs={this.state} />
            <DisplayInsuranceDetails BillingIOputs={this.state} />
            <OPBillingDetails BillingIOputs={this.state} />
          </MyContext.Provider>
        </div>

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
                    // onClick={this.ClearData.bind(this)}
                  >
                    Clear
                  </button>
                </div>
                <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 order-12">
                  <button
                    className="htpl1-phase1-btn-primary"
                    onClick={this.SaveBill.bind(this)}
                    disabled={this.state.saveEnable}
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
    genbill: state.genbill,
    patients: state.patients,
    existinsurance: state.existinsurance
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientDetails: AlgaehActions,
      postBillDetsils: postBillDetsils
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
