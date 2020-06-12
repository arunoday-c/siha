import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import PackageDetail from "./PackageDetail";
import {
  serviceHandeler,
  ProcessService,
  deleteServices,
  SaveOrdersServices,
  updateBillDetail,
  EditGrid,
  ClosePackageMaster,
  ShowPackageMaster
} from "./OrderingPackagesHandaler";
import "./OrderingPackages.scss";
import "../../../../styles/site.scss";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { getCookie } from "../../../../utils/algaehApiCall";
// import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import ButtonType from "../../../Wrapper/algaehButton";
import _ from "lodash";
import NewPackage from "../../../PackageSetup/NewPackage/NewPackage";

class OrderingPackages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      s_service_type: null,
      s_service: null,
      selectedLang: "en",

      patient_id: this.props.patient_id,
      visit_id: this.props.visit_id,
      doctor_id: this.props.provider_id,
      vat_applicable: this.props.vat_applicable,
      provider_id: this.props.provider_id,

      orderpackagedata: [],
      approval_amt: 0,
      preapp_limit_amount: 0,
      preserviceInput: [],
      dummy_company_payble: 0,
      approval_limit_yesno: "N",
      insurance_service_name: null,
      saved: true,

      insured: "N",
      primary_insurance_provider_id: null,
      primary_network_office_id: null,
      primary_network_id: null,
      sec_insured: "N",
      secondary_insurance_provider_id: null,
      secondary_network_id: null,
      secondary_network_office_id: null,
      test_type: "R",
      addNew: true,

      patient_payable: null,
      company_payble: null,
      sec_company_paybale: null,
      sub_total_amount: null,
      discount_amount: null,
      net_total: null,
      addNewService: false,
      package_detail: null,
      hims_d_package_header_id: null,
      package_visit_type: null,
      package_type: null,
      isOpenItems: false,
      isOpen: false,
      expiry_date: null
    };
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });

    if (
      this.props.servicetype === undefined ||
      this.props.servicetype.length === 0
    ) {
      this.props.getServiceTypes({
        uri: "/serviceType",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVIES_TYPES_GET_DATA",
          mappingName: "servicetype"
        }
      });
    }

    if (
      this.props.serviceslist === undefined ||
      this.props.serviceslist.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "serviceslist"
        }
      });
    }
    this.getPatientInsurance();
  }

  getPatientInsurance() {
    this.props.getPatientInsurance({
      uri: "/patientRegistration/getPatientInsurance",
      module: "frontDesk",
      method: "GET",
      data: {
        patient_id: this.state.patient_id,
        patient_visit_id: this.state.visit_id
      },
      redux: {
        type: "EXIT_INSURANCE_GET_DATA",
        mappingName: "existinginsurance"
      },
      afterSuccess: data => {
        if (data.length > 0) {
          this.setState({
            insured: "Y",
            primary_insurance_provider_id: data[0].insurance_provider_id,
            primary_network_office_id:
              data[0].hims_d_insurance_network_office_id,
            primary_network_id: data[0].network_id,
            sec_insured: data[0].sec_insured,
            secondary_insurance_provider_id:
              data[0].secondary_insurance_provider_id,
            secondary_network_id: data[0].secondary_network_id,
            secondary_network_office_id: data[0].secondary_network_office_id
          });

          this.props.getServices({
            uri: "/serviceType/getServiceInsured",
            module: "masterSettings",
            method: "GET",
            data: { insurance_id: data[0].insurance_provider_id },
            redux: {
              type: "SERVICES_INS_GET_DATA",
              mappingName: "services"
            }
          });
        } else {
          this.setState({
            insured: "N",
            primary_insurance_provider_id: null,
            primary_network_office_id: null,
            primary_network_id: null,
            sec_insured: null,
            secondary_insurance_provider_id: null,
            secondary_network_id: null,
            secondary_network_office_id: null
          });
          this.props.getServices({
            uri: "/serviceType/getService",
            module: "masterSettings",
            method: "GET",
            redux: {
              type: "SERVICES_GET_DATA",
              mappingName: "services"
            }
          });
        }
      }
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.existinginsurance !== undefined &&
      nextProps.existinginsurance.length !== 0
    ) {
      let output = nextProps.existinginsurance[0];
      output.insured = "Y";
      output.patient_id = this.props.patient_id;
      output.visit_id = this.props.visit_id;
      output.doctor_id = this.props.provider_id;
      output.provider_id = this.props.provider_id;
      output.vat_applicable = this.props.vat_applicable;
      this.setState({ ...output });
    } else {
      this.setState({
        insured: "N",
        patient_id: this.props.patient_id,
        visit_id: this.props.visit_id,
        doctor_id: this.props.provider_id,
        provider_id: this.props.provider_id,
        vat_applicable: this.props.vat_applicable
      });
    }
  }

  ClosePackageDetail(e) {
    let orderpackagedata = this.state.orderpackagedata;

    orderpackagedata[this.state.selected_row_index] = e;
    this.setState({
      isOpenItems: !this.state.isOpenItems,
      package_detail: null,
      select_package_type: null,
      selected_row_index: null,
      orderpackagedata: orderpackagedata
    });
  }

  ShowPackageDetail(row) {    
    this.setState({
      isOpenItems: !this.state.isOpenItems,
      package_detail: row,
      selected_row_index: row.selected_row_index
    });
  }

  onClose = e => {
    this.setState(
      {
        s_service_type: null,
        s_service: null,
        selectedLang: "en",

        patient_id: this.props.patient_id,
        visit_id: this.props.visit_id,
        doctor_id: this.props.provider_id,
        provider_id: this.props.provider_id,
        vat_applicable: this.props.vat_applicable,

        orderpackagedata: [],
        approval_amt: 0,
        preapp_limit_amount: 0,
        preserviceInput: [],
        dummy_company_payble: 0,
        approval_limit_yesno: "N",
        insurance_service_name: null,
        service_name: "",
        saved: true,

        insured: "N",
        primary_insurance_provider_id: null,
        primary_network_office_id: null,
        primary_network_id: null,
        sec_insured: "N",
        secondary_insurance_provider_id: null,
        secondary_network_id: null,
        secondary_network_office_id: null,
        test_type: "R",
        addNew: false,
        patient_payable: null,
        company_payble: null,
        sec_company_paybale: null,
        sub_total_amount: null,
        discount_amount: null,
        net_total: null,
        package_detail: null,
        hims_d_package_header_id: null,
        package_visit_type: null,
        package_type: null
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };
  render() {
    const insurance_id = this.state.insurance_provider_id;
    const hideSomeDate = this.props.from === "Billing" ? true : false;
    return (
      <div className="hptl-phase1-ordering-services-form">
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Order Packages"
          openPopup={this.props.open}
        >
          <div className="popupInner">
            <div className="col-lg-12">
              {this.state.insured === "Y" ? (
                <div className="row legendCntr">
                  <div className="col">
                    <small>
                      <span className="legendSpan orange_Y_Y" />
                      <span>
                        Ins. Covered: <b>Yes</b>, Pre Approval: <b>Yes</b>
                      </span>
                      <span className="legendSpan green_Y_N" />
                      <span>
                        Ins. Covered: <b>Yes</b>, Pre Approval: <b>No</b>
                      </span>
                      <span className="legendSpan red_N_N" />
                      <span>
                        Ins. Covered: <b>No</b>, Pre Approval: <b>--</b>
                      </span>
                    </small>
                  </div>
                  <hr />
                </div>
              ) : null}
              <div className="row">
                <AlgaehAutoSearch
                  div={{ className: "col customServiceSearch" }}
                  label={{ forceLabel: "Search Package" }}
                  title="Search Package"
                  id="service_id_search"
                  template={({
                    covered,
                    pre_approval,
                    service_name,
                    service_type,
                    p_visit_type,
                    package_code,
                    p_type
                  }) => {
                    let properStyle;
                    if (this.state.insured === "Y") {
                      if (covered === "Y") {
                        if (pre_approval === "Y") {
                          properStyle = "orange_Y_Y";
                        } else {
                          properStyle = "green_Y_N";
                        }
                      } else {
                        properStyle = "red_N_N";
                      }
                    } else {
                      properStyle = "white_N_N";
                    }
                    return (
                      <div className={`row resultSecStyles ${properStyle}`}>
                        <div className="col-12 padd-10">
                          <h4 className="title">
                            {_.startCase(_.toLower(service_name))}
                          </h4>
                          <p className="searchMoreDetails">
                            {/* ({_.startCase(_.toLower(service_type))}) */}
                            <span>
                              Package Code:{" "}
                              <b>{_.startCase(_.toLower(package_code))}</b>
                            </span>{" "}
                            <span>
                              Package Type:{" "}
                              <b> {_.startCase(_.toLower(p_type))}</b>
                            </span>{" "}
                            <span>
                              Visit Type:{" "}
                              <b> {_.startCase(_.toLower(p_visit_type))}</b>
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  }}
                  name="s_service"
                  columns={spotlightSearch.Services.servicemaster}
                  displayField="service_name"
                  value={this.state.service_name}
                  extraParameters={{
                    insurance_id: insurance_id
                  }}
                  searchName="inspackagemaster"
                  onClick={serviceHandeler.bind(this, this)}
                  ref={attReg => {
                    this.attReg = attReg;
                  }}
                />

                <div className="col-4">
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 19 }}
                    onClick={ProcessService.bind(this, this)}
                    disabled={this.state.addNewService}
                  >
                    Add to List
                  </button>{" "}
                  {hideSomeDate === false ? (
                    <button
                      className="btn btn-default"
                      style={{ marginTop: 19 }}
                      onClick={ShowPackageMaster.bind(this, this)}
                    >
                      Create New Package
                    </button>
                  ) : null}
                </div>

                <NewPackage
                  open={this.state.isOpen}
                  onClose={ClosePackageMaster.bind(this, this)}
                  from="doctor"
                />
              </div>

              <div className="row">
                <div className="col-md-10 col-lg-12" id="doctorOrder">
                  <AlgaehDataGrid
                    id="Services_Ordering"
                    columns={[
                      {
                        fieldName: "actions",
                        label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                onClick={deleteServices.bind(this, this, row)}
                                className="fas fa-trash-alt"
                              />

                              <i
                                onClick={this.ShowPackageDetail.bind(this, row)}
                                className="fas fa-eye"
                              />
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "service_type_id",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "service_type_id" }}
                          />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.servicetype === undefined
                              ? []
                              : this.props.servicetype.filter(
                                f =>
                                  f.hims_d_service_type_id ===
                                  row.service_type_id
                              );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].service_type
                                  : display[0].arabic_service_type
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.servicetype === undefined
                              ? []
                              : this.props.servicetype.filter(
                                f =>
                                  f.hims_d_service_type_id ===
                                  row.service_type_id
                              );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].service_type
                                  : display[0].arabic_service_type
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "package_code",
                        label: (
                          <AlgaehLabel label={{ fieldName: "package_code" }} />
                        ),

                        others: {
                          minWidth: 200
                        }
                      },
                      {
                        fieldName: "services_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "services_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.serviceslist === undefined
                              ? []
                              : this.props.serviceslist.filter(
                                f => f.hims_d_services_id === row.services_id
                              );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].service_name
                                  : display[0].arabic_service_name
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.serviceslist === undefined
                              ? []
                              : this.props.serviceslist.filter(
                                f => f.hims_d_services_id === row.services_id
                              );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].service_name
                                  : display[0].arabic_service_name
                                : ""}
                            </span>
                          );
                        },
                        others: {
                          minWidth: 400
                        }
                      },

                      {
                        fieldName: "net_amout",
                        label: (
                          <AlgaehLabel label={{ fieldName: "net_amout" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "insurance_yesno",
                        label: (
                          <AlgaehLabel label={{ fieldName: "insurance" }} />
                        ),
                        displayTemplate: row => {
                          return row.insurance_yesno === "Y"
                            ? "Covered"
                            : "Not Covered";
                        },
                        editorTemplate: row => {
                          return row.insurance_yesno === "Y"
                            ? "Covered"
                            : "Not Covered";
                        }
                      },
                      {
                        fieldName: "pre_approval",
                        label: (
                          <AlgaehLabel label={{ fieldName: "pre_approval" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.pre_approval === "Y"
                                ? "Required"
                                : "Not Required"}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>
                              {row.pre_approval === "Y"
                                ? "Required"
                                : "Not Required"}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "total_tax",
                        label: (
                          <AlgaehLabel label={{ fieldName: "total_tax" }} />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 80
                        }
                      },
                      {
                        fieldName: "patient_payable",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "patient_payable" }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "company_payble",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "company_payble" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 80
                        }
                      }
                    ]}
                    keyId="service_type_id"
                    dataSource={{
                      data: this.state.orderpackagedata
                    }}
                    // isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    byForceEvents={true}
                    events={{
                      onDelete: deleteServices.bind(this, this),
                      onEdit: EditGrid.bind(this, this),
                      onCancel: EditGrid.bind(this, this),
                      onDone: updateBillDetail.bind(this, this)
                    }}
                  />
                </div>
              </div>
              <PackageDetail
                show={this.state.isOpenItems}
                onClose={this.ClosePackageDetail.bind(this)}
                package_detail={this.state.package_detail}
                select_package_type={this.state.select_package_type}
              />
              <div className="row GridTotalDetails">
                <div className="col-lg-5" style={{ textAlign: "right" }}>
                  <div className="row">
                    <div className="col" style={{ textAlign: "right" }}>
                      <AlgaehLabel
                        label={{
                          fieldName: "net_ttl"
                        }}
                      />
                      <h5>{GetAmountFormart(this.state.net_total)}</h5>
                    </div>
                  </div>
                </div>

                <div className="col-lg-7">
                  <div className="row">
                    <div className="col" style={{ textAlign: "right" }}>
                      <AlgaehLabel
                        label={{
                          fieldName: "pat_payable"
                        }}
                      />
                      <h5>{GetAmountFormart(this.state.patient_payable)}</h5>
                    </div>
                    <div className="col" style={{ textAlign: "right" }}>
                      <AlgaehLabel
                        label={{
                          fieldName: "co_payable"
                        }}
                      />
                      <h5>{GetAmountFormart(this.state.company_payble)}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
            </div>
            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <span className="float-right">
                      <ButtonType
                        classname="btn-primary"
                        onClick={SaveOrdersServices.bind(this, this)}
                        label={{
                          forceLabel: "Order",
                          returnText: true
                        }}
                        others={{ disabled: this.state.saved }}
                      />
                      <button
                        className="btn btn-default"
                        onClick={this.onClose.bind(this)}
                      >
                        Cancel
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    servicetype: state.servicetype,
    services: state.services,
    orderservices: state.orderservices,
    existinginsurance: state.existinginsurance,
    serviceslist: state.serviceslist,
    pakageList: state.pakageList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      generateBill: AlgaehActions,
      getPatientInsurance: AlgaehActions,
      billingCalculations: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderingPackages)
);
