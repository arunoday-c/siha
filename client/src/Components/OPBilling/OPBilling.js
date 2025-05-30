import React, { Component } from "react";
import extend from "extend";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PatientDetails from "./PatientDisDetails/PatientDetails.js";
// import DisplayVisitDetails from "./VisitDetails/DisplayVisitDetails.js";
import OPBillingDetails from "./OPBilling/OPBillingDetails";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import "./OPBilling.scss";
import MyContext from "../../utils/MyContext.js";
import AlgaehLabel from "../Wrapper/label.js";
import BillingIOputs from "../../Models/Billing";
import PatRegIOputs from "../../Models/RegistrationPatient";
import { getCookie } from "../../utils/algaehApiCall";
import { PricingModals } from "../PatientRegistrationNew/PricingModal";
import {
  ClearData,
  Validations,
  getCashiersAndShiftMAP,
  generateReceipt,
  generateReceiptSmall,
  // selectVisit,
  ShowOrderPackage,
  ClosePackage,
  getPatientDetails,
  ShowPackageUtilize,
  ClosePackageUtilize,
  getAdmissionDetails,
} from "./OPBillingEvents";
import { AlgaehActions } from "../../actions/algaehActions";
import { successfulMessage } from "../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall.js";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import Enumerable from "linq";
// import AlgaehReport from "../Wrapper/printReports";
import moment from "moment";
// import Options from "../../Options.json";
import OrderingPackages from "../PatientProfile/Assessment/OrderingPackages/OrderingPackages";
import PackageUtilize from "../PatientProfile/PackageUtilize/PackageUtilize";
import {
  MainContext,
  AlgaehSecurityComponent,
  RawSecurityComponent,
} from "algaeh-react-components";
import sockets from "../../sockets";
import swal from "sweetalert2";
import _ from "lodash";
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
      isPackOpen: false,
      userToken: {},
      priceModalVisible: false,
    };
    this.smallRecipt = [
      {
        label: "Print Receipt",
        events: {
          onClick: () => {
            generateReceipt(this, this);
          },
        },
      },
    ];
  }
  static contextType = MainContext;

  UNSAFE_componentWillMount() {
    let IOputs = extend(PatRegIOputs.inputParam(), BillingIOputs.inputParam());

    const userToken = this.context.userToken;
    IOputs.hospital_id = userToken.hims_d_hospital_id;
    IOputs.Cashchecked = userToken.default_pay_type === "CH" ? true : false;
    IOputs.Cardchecked = userToken.default_pay_type === "CD" ? true : false;
    IOputs.default_pay_type = userToken.default_pay_type;
    IOputs.userToken = this.context.userToken;
    IOputs.service_dis_percentage = userToken.service_dis_percentage;
    IOputs.service_credit_percentage = userToken.service_credit_percentage;
    IOputs.portal_exists = userToken.portal_exists;

    this.setState({ ...this.state, ...IOputs });
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    this.setState({
      selectedLang: prevLang,
    });
    this.props.getPatientPackage({
      redux: {
        type: "Package_GET_DATA",
        mappingName: "PatientPackageList",
        data: [],
      },
    });

    this.props.getPatientInsurance({
      redux: {
        type: "EXIT_INSURANCE_GET_DATA",
        mappingName: "existinsurance",
        data: [],
      },
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
          mappingName: "patienttype",
        },
      });
    }

    // this.props.getDepartmentsandDoctors({
    //   uri: "/department/get/get_All_Doctors_DepartmentWise",
    //   module: "masterSettings",
    //   method: "GET",
    //   redux: {
    //     type: "DEPT_DOCTOR_GET_DATA",
    //     mappingName: "deptanddoctors",
    //   },
    // });

    // let _screenName = getCookie("ScreenName").replace("/", "");
    // algaehApiCall({
    //   uri: "/userPreferences/get",
    //   data: {
    //     screenName: _screenName,
    //     identifier: "Counter",
    //   },
    //   method: "GET",
    //   onSuccess: (response) => {
    //     this.setState({
    //       counter_id: response.data.records.selectedValue,
    //     });
    //   },
    // });
    getCashiersAndShiftMAP(this, this);
    const queryParams = new URLSearchParams(this.props.location.search);
    if (queryParams.get("bill_code")) {
      this.getCtrlCode(queryParams.get("bill_code"));
    } else if (queryParams.get("patient_code")) {
      getPatientDetails(this, queryParams.get("patient_code"));
    }

    if (
      this.props.patient_code !== undefined &&
      this.props.patient_code.length !== 0
    ) {
      getPatientDetails(this, this.props.patient_code);
    }

    RawSecurityComponent({ componentCode: "OP_SML_PRNT" }).then((result) => {
      if (result === "show") {
        this.smallRecipt.push({
          label: "Print Receipt Small",
          events: {
            onClick: () => {
              generateReceiptSmall(this, this);
            },
          },
        });
      }
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let prevLang = getCookie("Language");
    let output = {};

    if (prevLang !== this.state.selectedLang) {
      let _screenName = getCookie("ScreenName").replace("/", "");
      let counter_id = 0;
      algaehApiCall({
        uri: "/userPreferences/get",
        data: {
          screenName: _screenName,
          identifier: "Counter",
        },
        method: "GET",
        onSuccess: (response) => {
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
        },
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
      onSuccess: (response) => {
        if (response.data.success) {
          let data = response.data.records;

          let x = Enumerable.from($this.props.patienttype)
            .where((w) => w.hims_d_patient_type_id === data.patient_type)
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
              data.Cashchecked =
                data.receiptdetails[i].pay_type === "CA" ? true : false;
              data.cash_amount =
                data.receiptdetails[i].pay_type === "CA"
                  ? data.receiptdetails[i].amount
                  : 0;

              data.Cardchecked =
                data.receiptdetails[i].pay_type === "CD" ? true : false;
              data.card_amount =
                data.receiptdetails[i].pay_type === "CD"
                  ? data.receiptdetails[i].amount
                  : 0;
              data.card_check_number =
                data.receiptdetails[i].pay_type === "CD"
                  ? data.receiptdetails[i].card_check_number
                  : null;
              data.selectedCard =
                data.receiptdetails[i].pay_type === "CD"
                  ? { hims_d_bank_card_id: data.receiptdetails[i].bank_card_id }
                  : null;
              // data.Cashchecked = false;
              // data.Cardchecked = false;
              // if (data.receiptdetails[i].pay_type === "CA") {
              //   data.Cashchecked = true;
              //   data.cash_amount = data.receiptdetails[i].amount;
              // }

              // if (data.receiptdetails[i].pay_type === "CD") {
              //   data.Cardchecked = true;
              //   data.card_amount = data.receiptdetails[i].amount;
              // }

              // if (data.receiptdetails[i].pay_type === "CH") {
              //   data.Checkchecked = true;
              //   data.cheque_amount = data.receiptdetails[i].amount;
              // }
            }
          }

          data.billDetails = false;
          data.company_payble = data.company_payable;

          if (data.insured === "Y") {
            $this.props.getPatientInsurance({
              uri: "/patientRegistration/getPatientInsurance",
              module: "frontDesk",
              method: "GET",
              data: {
                patient_id: data.patient_id,
                patient_visit_id: data.visit_id,
              },
              redux: {
                type: "EXIT_INSURANCE_GET_DATA",
                mappingName: "existinsurance",
              },
            });
          }

          $this.setState(data);
          AlgaehLoader({ show: false });
        }
      },
      onFailure: (error) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
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
        icon: "error",
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
          card_type: null,
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
          card_type: null,
          bank_card_id: this.state.selectedCard?.hims_d_bank_card_id,
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
          card_type: null,
        });
      }

      this.setState(
        {
          receiptdetails: obj,
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
        swal({
          title: "Are you sure you want to Save?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          confirmButtonColor: "#44b8bd",
          cancelButtonColor: "#d33",
          cancelButtonText: "No",
        }).then((willSave) => {
          if (willSave.value) {
            this.GenerateReciept(($this) => {
              let Inputobj = $this.state;
              if (Inputobj.insurance_yesno === "Y") {
                if (Inputobj.creidt_limit_req === "Y") {
                  const creidt_amount_till =
                    parseFloat(Inputobj.creidt_amount_till) +
                    parseFloat(Inputobj.company_payable);
                  if (
                    parseFloat(creidt_amount_till) >
                    parseFloat(Inputobj.creidt_limit)
                  ) {
                    successfulMessage({
                      message:
                        "You have reached your credit limit. Please collect payment and proceed.",
                      title: "Error",
                      icon: "error",
                    });
                    return;
                  }
                }
              }

              Inputobj.patient_payable = $this.state.patient_payable_h;
              Inputobj.company_payable = $this.state.company_payble;
              Inputobj.insurance_yesno = $this.state.insured;
              Inputobj.primary_sub_id = $this.state.sub_insurance_provider_id;
              Inputobj.ScreenCode = "BL0001";
              Inputobj.source = Inputobj.ip_id > 0 ? "I" : "O";

              const package_exists = Inputobj.billdetails.filter(
                (f) => f.service_type_id === 14
              );

              // debugger;

              if (Inputobj.portal_exists === "Y") {
                Inputobj.portal_data = _.chain(Inputobj.billdetails)
                  .filter(
                    (f) =>
                      parseInt(f.service_type_id) === 5 ||
                      parseInt(f.service_type_id) === 11
                  )
                  .map((m, key) => {
                    return {
                      service_id: m.services_id,
                      service_name: m.service_name,
                      service_category: m.service_type,
                      visit_code: Inputobj.visit_code,
                      patient_identity: Inputobj.primary_id_no,
                      pay_type:
                        m.insurance_yesno === "Y" ? "INSURANCE" : "CASH",
                      service_amount: m.patient_resp,
                      service_vat: m.patient_tax,
                      hospital_id: Inputobj.hospital_id,
                      report_download:
                        parseFloat(Inputobj.credit_amount) > 0 ? "N" : "Y",
                    };
                  })
                  .value();
              }

              Inputobj.package_exists = package_exists;
              AlgaehLoader({ show: true });
              algaehApiCall({
                uri: "/opBilling/addOpBIlling",
                module: "billing",
                data: Inputobj,
                method: "POST",
                onSuccess: (response) => {
                  if (response.data.success) {
                    AlgaehLoader({ show: false });
                    $this.setState({
                      bill_number: response.data.records.bill_number,
                      receipt_number: response.data.records.receipt_number,
                      hims_f_billing_header_id:
                        response.data.records.hims_f_billing_header_id,
                      saveEnable: true,
                    });

                    this.setState({
                      addNewService: true,
                      Billexists: true,
                    });
                    if (sockets.connected) {
                      sockets.emit("opBill_add", {
                        billdetails: Inputobj.billdetails,
                        bill_date: Inputobj.bill_date,
                      });
                    }
                    successfulMessage({
                      message: "Done Successfully",
                      title: "Success",
                      icon: "success",
                    });
                  } else {
                    AlgaehLoader({ show: false });
                    swalMessage({
                      type: "error",
                      title: response.data.records.message,
                    });
                  }
                },
                onFailure: (error) => {
                  AlgaehLoader({ show: false });
                  successfulMessage({
                    message: error.response.data.message || error.message,
                    title: "Error",
                    icon: "error",
                  });
                },
              });
            });
          }
        });
      } else {
        successfulMessage({
          message: "Please collect the amount.",
          title: "Error",
          icon: "error",
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
          // pageNavPath={[
          //   {
          //     pageName: (
          //       <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
          //     ),
          //   },
          //   {
          //     pageName: <AlgaehLabel label={{ fieldName: "bill_number" }} />,
          //   },
          // ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ fieldName: "bill_number", returnText: true }}
              />
            ),
            value: this.state.bill_number,
            events: {
              onChange: this.getCtrlCode.bind(this),
            },
            selectValue: "bill_number",
            searchName: "bills",
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "billing.opBilling",
            },
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    fieldName: "bill_date",
                  }}
                />
                <h6>
                  {this.state.bill_date
                    ? moment(this.state.bill_date).format("DD-MM-YYYY")
                    : "DD/MM/YYYY"}
                </h6>
              </div>
              {this.state.Billexists === true ? (
                <div className="col">
                  {this.state.adjusted === "Y" ? (
                    <div className="row">
                      <div className="col">
                        <AlgaehLabel
                          label={{ forceLabel: "Bill Adjusted By" }}
                        />
                        <h6> {this.state.adjusted_name}</h6>
                      </div>
                    </div>
                  ) : this.state.cancelled === "Y" ? (
                    <div className="row">
                      <div className="col">
                        <AlgaehLabel
                          label={{ forceLabel: "Bill Cancelled By" }}
                        />
                        <h6>{this.state.cancelled_name}</h6>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <AlgaehLabel label={{ forceLabel: "Bill Created By" }} />
                      <h6>{this.state.created_name}</h6>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          }
          printArea={
            // parseFloat(this.state.patient_payable_h) > 0 &&
            // this.state.patient_payable_h !== null &&
            this.state.bill_number !== null
              ? {
                  menuitems: this.smallRecipt,
                }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div style={{ marginTop: 75 }}>
          <MyContext.Provider
            value={{
              state: this.state,
              updateState: (obj) => {
                this.setState({ ...this.state, ...obj }, () => {
                  Object.keys(obj).forEach((key) => {
                    if (key === "patient_code") {
                      getPatientDetails(this, this.state.patient_code);
                    } else if (key === "admission_number") {
                      getAdmissionDetails(this, this.state.admission_number);
                    }
                  });
                });
              },
            }}
          >
            <PricingModals
              onClose={() => {
                this.setState({
                  priceModalVisible: false,
                });
              }}
              visible={this.state.priceModalVisible}
            />
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
          existinsurance={this.props.existinsurance}
          from="Billing"
        />

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-4 leftBtnGroup">
              <AlgaehSecurityComponent componentCode="OP_VEW_PRS_LST">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => {
                    this.setState({ priceModalVisible: true });
                  }}
                >
                  View Price List
                </button>
              </AlgaehSecurityComponent>
            </div>
            <div className="col">
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

              {this.props.from_list_auth === true ? null : (
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
              )}
              {this.props.from_list_auth === true ? null : (
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={ClearData.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{ fieldName: "btn_clear", returnText: true }}
                  />
                </button>
              )}

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
    PatientPackageList: state.PatientPackageList,
    orderedList: state.orderedList,
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
      getPatientPackage: AlgaehActions,
      getOrderList: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OPBilling)
);
