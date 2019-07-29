import React, { Component } from "react";
import extend from "extend";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PatientDetails from "./PatientDisDetails/PatientDetails.js";
// import DisplayVisitDetails from "./VisitDetails/DisplayVisitDetails.js";
import OPBillingDetails from "./OPBilling/OPBillingDetails";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import "./OPBilling.css";
import MyContext from "../../utils/MyContext.js";
import AlgaehLabel from "../Wrapper/label.js";
import BillingIOputs from "../../Models/Billing";
import PatRegIOputs from "../../Models/RegistrationPatient";
import { getCookie } from "../../utils/algaehApiCall";
import {
  ClearData,
  Validations,
  getCashiersAndShiftMAP,
  generateReceipt,
  selectVisit,
  ShowOrderPackage,
  ClosePackage,
  getPatientDetails,
  ShowPackageUtilize,
  ClosePackageUtilize
} from "./OPBillingEvents";
import { AlgaehActions } from "../../actions/algaehActions";
import { successfulMessage } from "../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall.js";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import Enumerable from "linq";
import AlgaehReport from "../Wrapper/printReports";
import moment from "moment";
import Options from "../../Options.json";
import OrderingPackages from "../PatientProfile/Assessment/OrderingPackages/OrderingPackages";
import PackageUtilize from "../PatientProfile/PackageUtilize/PackageUtilize";

class OPBilling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en",
      s_service_type: null,
      s_service: null,
      mode_of_pay: "None",
      pay_cash: "CA",
      pay_card: "CD",
      pay_cheque: "CH",
      cash_amount: 0,
      card_check_number: "",
      card_date: null,
      card_amount: 0,
      cheque_number: "",
      cheque_date: null,
      cheque_amount: 0,
      advance: 0,
      addNewService: false,
      isPackOpen: false
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

    if (
      this.props.patienttype === undefined ||
      this.props.patienttype.length === 0
    ) {
      this.props.getPatientType({
        uri: "/patientType/getPatientType",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "PATIENT_TYPE_GET_DATA",
          mappingName: "patienttype"
        }
      });
    }

    this.props.getDepartmentsandDoctors({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "DEPT_DOCTOR_GET_DATA",
        mappingName: "deptanddoctors"
      }
    });

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
    getCashiersAndShiftMAP(this, this);
  }

  componentWillReceiveProps(nextProps) {
    let prevLang = getCookie("Language");
    let output = {};

    if (prevLang !== this.state.selectedLang) {
      let _screenName = getCookie("ScreenName").replace("/", "");
      let counter_id = 0;
      algaehApiCall({
        uri: "/userPreferences/get",
        data: {
          screenName: _screenName,
          identifier: "Counter"
        },
        method: "GET",
        onSuccess: response => {
          counter_id = response.data.records.selectedValue;

          let IOputs = extend(
            PatRegIOputs.inputParam(),
            BillingIOputs.inputParam()
          );
          IOputs.patient_payable_h = 0;
          IOputs.counter_id = counter_id;
          IOputs.s_service_type = null;
          IOputs.s_service = null;
          IOputs.Rerender = true;
          IOputs.selectedLang = prevLang;
          // $this.setState({ ...$this.state, ...IOputs });
          if (
            nextProps.existinsurance !== undefined &&
            nextProps.existinsurance.length !== 0
          ) {
            output = nextProps.existinsurance[0];
          }
          this.setState({ ...this.state, ...output, ...IOputs });
        }
      });
    } else {
      if (
        nextProps.existinsurance !== undefined &&
        nextProps.existinsurance.length !== 0
      ) {
        output = nextProps.existinsurance[0];
      }

      this.setState({ ...this.state, ...output });
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  getCtrlCode(billcode) {
    let $this = this;

    AlgaehLoader({ show: true });

    algaehApiCall({
      uri: "/opBilling/get",
      module: "billing",
      method: "GET",
      data: { bill_number: billcode },
      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records;

          let x = Enumerable.from($this.props.patienttype)
            .where(w => w.hims_d_patient_type_id === data.patient_type)
            .toArray();

          if (x !== undefined && x.length > 0) {
            data.patient_type = x[0].patitent_type_desc;
          } else {
            data.patient_type = "Not Selected";
          }

          let visitDetails = data;

          // visitDetails.radioselect = 1;
          data.visitDetails = [visitDetails];
          data.mode_of_pay = data.insured === "Y" ? "Insured" : "Self";
          // data.doctor_name = data.doctor_name;
          data.Billexists = true;
          data.saveEnable = true;
          // data.visit_id = data.hims_f_patient_visit_id;
          if (data.receiptdetails.length !== 0) {
            for (let i = 0; i < data.receiptdetails.length; i++) {
              if (data.receiptdetails[i].pay_type === "CA") {
                data.Cashchecked = true;
                data.cash_amount = data.receiptdetails[i].amount;
              }

              if (data.receiptdetails[i].pay_type === "CD") {
                data.Cardchecked = true;
                data.card_amount = data.receiptdetails[i].amount;
              }

              if (data.receiptdetails[i].pay_type === "CH") {
                data.Checkchecked = true;
                data.cheque_amount = data.receiptdetails[i].amount;
              }
            }
          }

          data.billDetails = false;

          if (data.insured === "Y") {
            $this.props.getPatientInsurance({
              uri: "/patientRegistration/getPatientInsurance",
              module: "frontDesk",
              method: "GET",
              data: {
                patient_id: data.patient_id,
                patient_visit_id: data.visit_id
              },
              redux: {
                type: "EXIT_INSURANCE_GET_DATA",
                mappingName: "existinsurance"
              }
            });
          }

          $this.setState(data);
          AlgaehLoader({ show: false });
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

  GenerateReciept(callback) {
    let obj = [];

    if (
      this.state.Cashchecked === false &&
      this.state.Cardchecked === false &&
      this.state.Checkchecked === false
    ) {
      successfulMessage({
        message: "Please select receipt type.",
        title: "Error",
        icon: "error"
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

  SaveBill(e) {
    const err = Validations(this);
    if (!err) {
      if (this.state.unbalanced_amount === 0) {
        this.GenerateReciept($this => {
          let Inputobj = $this.state;

          Inputobj.patient_payable = $this.state.patient_payable_h;
          Inputobj.company_payable = $this.state.company_payble;
          Inputobj.insurance_yesno = $this.state.insured;
          AlgaehLoader({ show: true });
          algaehApiCall({
            uri: "/opBilling/addOpBIlling",
            module: "billing",
            data: Inputobj,
            method: "POST",
            onSuccess: response => {
              if (response.data.success) {
                AlgaehLoader({ show: false });
                $this.setState({
                  bill_number: response.data.records.bill_number,
                  receipt_number: response.data.records.receipt_number,
                  hims_f_billing_header_id:
                    response.data.records.hims_f_billing_header_id,
                  saveEnable: true
                });
                this.setState({
                  addNewService: true,
                  Billexists: true
                });
                successfulMessage({
                  message: "Done Successfully",
                  title: "Success",
                  icon: "success"
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
              successfulMessage({
                message: error.response.data.message || error.message,
                title: "Error",
                icon: "error"
              });
            }
          });
        });
      } else {
        successfulMessage({
          message: "Please collect the amount.",
          title: "Error",
          icon: "error"
        });
      }
    }
  }

  render() {
    let Package_Exists =
      this.props.PatientPackageList === undefined
        ? []
        : this.props.PatientPackageList;
    return (
      <div className="" style={{ marginBottom: "50px" }}>
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
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    fieldName: "bill_date"
                  }}
                />
                <h6>
                  {this.state.bill_date
                    ? moment(this.state.bill_date).format("DD-MM-YYYY")
                    : "DD/MM/YYYY"}
                </h6>
              </div>
            </div>
          }
          printArea={
            this.state.bill_number !== null
              ? {
                  menuitems: [
                    {
                      label: "Print Receipt",
                      events: {
                        onClick: () => {
                          generateReceipt(this, this);
                        }
                      }
                    }
                  ]
                }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div style={{ marginTop: 75 }}>
          <MyContext.Provider
            value={{
              state: this.state,
              updateState: obj => {
                this.setState({ ...this.state, ...obj }, () => {
                  Object.keys(obj).map(key => {
                    if (key === "patient_code") {
                      getPatientDetails(this, this);
                    }
                  });
                });
              }
            }}
          >
            <PatientDetails BillingIOputs={this.state} />
            {/* <DisplayVisitDetails BillingIOputs={this.state} /> */}
            {/* <DisplayInsuranceDetails BillingIOputs={this.state} /> */}
            <OPBillingDetails BillingIOputs={this.state} />
          </MyContext.Provider>
        </div>

        <OrderingPackages
          open={this.state.isPackOpen}
          onClose={ClosePackage.bind(this, this)}
          vat_applicable={this.state.vat_applicable}
          addNew={true}
          patient_id={this.state.patient_id}
          visit_id={this.state.visit_id}
          provider_id={this.state.incharge_or_provider}
          from="Billing"
        />

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.SaveBill.bind(this)}
                disabled={this.state.saveEnable}
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_save", returnText: true }}
                />
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={ShowOrderPackage.bind(this, this)}
                disabled={
                  this.state.patient_id === null
                    ? true
                    : this.state.Billexists === true
                    ? true
                    : false
                }
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_order_package", returnText: true }}
                />
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_clear", returnText: true }}
                />
              </button>

              {Package_Exists.length > 0 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={ShowPackageUtilize.bind(this, this)}
                >
                  View Package
                </button>
              ) : null}

              <PackageUtilize
                open={this.state.isPackUtOpen}
                onClose={ClosePackageUtilize.bind(this, this)}
                package_detail={this.state.package_detail}
                from_billing={true}
                patient_id={this.state.patient_id}
                visit_id={this.state.visit_id}
                doctor_id={this.state.incharge_or_provider}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patients: state.patients,
    existinsurance: state.existinsurance,
    patienttype: state.patienttype,
    networkandplans: state.networkandplans,
    deptanddoctors: state.deptanddoctors,
    PatientPackageList: state.PatientPackageList,
    orderedList: state.orderedList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientDetails: AlgaehActions,
      getBIllDetails: AlgaehActions,
      getPatientType: AlgaehActions,
      getPatientInsurance: AlgaehActions,
      getNetworkPlans: AlgaehActions,
      getDepartmentsandDoctors: AlgaehActions,
      getPatientPackage: AlgaehActions,
      getOrderList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OPBilling)
);
