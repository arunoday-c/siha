import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

import {
  texthandle,
  serviceHandeler,
  ProcessService,
  deleteServices,
  SaveOrdersServices,
  calculateAmount,
  updateBillDetail,
  EditGrid,
  makeZeroIngrid,
  openFavouriteOrder,
  getFavouriteServices,
  selectToProcess,
  ProcessFromFavourite,
  openViewFavouriteOrder,
  closeViewFavouriteOrder
} from "./OrderingServicesHandaler";
import "./OrderingServices.scss";
import "../../../../styles/site.scss";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { getCookie } from "../../../../utils/algaehApiCall";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import _ from "lodash";
import sockets from "../../../../sockets";
import FavouriteOrder from "../../../FavouriteOrderList/FavouriteOrder/FavouriteOrder";
import ViewFavouriteOrder from "./ViewFavouriteOrder";

class OrderingServices extends PureComponent {
  constructor(props) {
    super(props);
    this.serviceSocket = sockets;
    this.state = {
      s_service_type: null,
      s_service: null,
      selectedLang: "en",
      isFavOpen: false,
      isOpen: false,

      patient_id: Window.global["current_patient"],
      visit_id: Window.global["visit_id"],
      doctor_id: null,
      vat_applicable: this.props.vat_applicable,
      date_of_birth: this.props.date_of_birth,
      gender: this.props.gender,

      orderservicesdata: [],
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
      loading_saveOrderService: false,
      loading_ProcessService: false,
      loading_bulk_Service: false,
      patient_payable: null,
      company_payble: null,
      sec_company_paybale: null,
      sub_total_amount: null,
      discount_amount: null,
      net_total: null,
      addNewService: false,
      all_favouriteservices: [],
      add_to_list: true,
      all_favourites: [],
      deleteserviceInput: []
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
    getFavouriteServices(this);
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

  componentWillReceiveProps(nextProps) {


    let saved = true
    const orderservicesdata = _.filter(
      nextProps.orderedList,
      f => {
        return f.trans_package_detail_id === null;
      }
    );
    if (orderservicesdata.length > 0) {
      saved = false
    }
    if (
      nextProps.existinginsurance !== undefined &&
      nextProps.existinginsurance.length !== 0
    ) {
      let output = nextProps.existinginsurance[0];
      output.insured = "Y";
      output.approval_amt = nextProps.approval_amt;
      output.approval_limit_yesno = nextProps.approval_limit_yesno
      output.orderservicesdata = orderservicesdata
      output.preserviceInput = nextProps.preserviceInput
      output.saved = saved

      this.setState({ ...output });
    } else {

      this.setState({
        insured: "N",
        approval_amt: nextProps.approval_amt,
        orderservicesdata: orderservicesdata,
        preserviceInput: nextProps.preserviceInput,
        approval_limit_yesno: nextProps.approval_limit_yesno,
        saved: saved
      });
    }
  }

  onClose = e => {
    getFavouriteServices(this);
    this.setState(
      {
        s_service_type: null,
        s_service: null,
        selectedLang: "en",

        patient_id: Window.global["current_patient"],
        visit_id: Window.global["visit_id"],
        doctor_id: null,
        vat_applicable: this.props.vat_applicable,

        orderservicesdata: [],
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
        add_to_list: true,
        deleteserviceInput: []
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };
  render() {
    const insurance_id = this.state.insurance_provider_id;

    return (
      <div className="hptl-phase1-ordering-services-form">
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Order Investigation"
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
                  label={{ forceLabel: "Search Investigation" }}
                  title="Search Investigation"
                  id="service_id_search"
                  template={({
                    covered,
                    pre_approval,
                    service_name,
                    service_type
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
                          </h4>{" "}
                          <p className="searchMoreDetails">
                            <span>
                              Service Type:{" "}
                              <b>{_.startCase(_.toLower(service_type))}</b>
                            </span>{" "}
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
                  searchName="insservicemaster"
                  onClick={serviceHandeler.bind(this, this)}
                  ref={attReg => {
                    this.attReg = attReg;
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{
                    fieldName: "tst_type"
                  }}
                  selector={{
                    name: "test_type",
                    className: "select-fld",
                    value: this.state.test_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.FORMAT_PRIORITY
                    },
                    onChange: texthandle.bind(this, this),
                    autoComplete: "off"
                  }}
                />

                <div className="col" style={{ paddingTop: 19 }}>
                  {/* <ButtonType
                    classname="btn-primary"
                    loading={this.state.loading_ProcessService}
                    onClick={ProcessService.bind(this, this, "")}
                    label={{
                      forceLabel: "Add to list",
                      returnText: true
                    }}
                    others={{ disabled: this.state.addNewService }}
                  /> */}
                  <button
                    className="btn btn-primary"
                    style={{ marginLeft: 10 }}
                    onClick={ProcessService.bind(this, this, "")}
                    disabled={this.state.addNewService}
                  >
                    Add to List
                  </button>

                  <button
                    className="btn btn-default"
                    style={{ marginLeft: 10 }}
                    onClick={ProcessService.bind(this, this, "F")}
                  >
                    Add to List & Favourite
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-8" id="doctorOrder">
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
                                style={{
                                  pointerEvents:
                                    row.billed === "N" ? "" : "none",
                                  opacity: row.billed === "N" ? "" : "0.1"
                                }}
                                onClick={deleteServices.bind(this, this, row)}
                                className="fas fa-trash-alt"
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
                        fieldName: "unit_cost",
                        label: (
                          <AlgaehLabel label={{ fieldName: "unit_cost" }} />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 80
                        }
                      },

                      {
                        fieldName: "discount_percentage",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "discount_percentage" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: row.discount_percentage,
                                className: "txt-fld",
                                name: "discount_percentage",
                                events: {
                                  onChange: calculateAmount.bind(
                                    this,
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  disabled:
                                    this.state.insured === "Y" ? true : false,
                                  onBlur: makeZeroIngrid.bind(this, this, row),
                                  onFocus: e => {
                                    e.target.oldvalue = e.target.value;
                                  }
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "discount_amout",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "discount_amout" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: row.discount_amout,
                                className: "txt-fld",
                                name: "discount_amout",
                                events: {
                                  onChange: calculateAmount.bind(
                                    this,
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  disabled:
                                    this.state.insured === "Y" ? true : false,
                                  onBlur: makeZeroIngrid.bind(this, this, row),
                                  onFocus: e => {
                                    e.target.oldvalue = e.target.value;
                                  }
                                }
                              }}
                            />
                          );
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
                      data: this.state.orderservicesdata
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

                <div className="col-4" id="favouriteOrder">
                  <AlgaehDataGrid
                    id="FAV_Services_Ordering"
                    columns={[
                      {
                        fieldName: "SalaryPayment_checkBox",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Select"
                            }}
                          />
                        ),

                        displayTemplate: row => {
                          return (
                            <span>
                              <input
                                type="checkbox"
                                value="Front Desk"
                                onChange={selectToProcess.bind(this, this, row)}
                                checked={
                                  row.select_to_process === "Y" ? true : false
                                }
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 50,
                          filterable: false
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
                        others: {
                          maxWidth: 120,
                          filterable: false
                        }
                      },
                      {
                        fieldName: "services_id",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Favourite Service" }}
                          />
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
                        }
                      }
                    ]}
                    keyId="service_type_id"
                    dataSource={{
                      data: this.state.all_favouriteservices
                    }}
                    filter={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    byForceEvents={true}
                    events={{
                      onDelete: deleteServices.bind(this, this),
                      onEdit: EditGrid.bind(this, this),
                      onCancel: EditGrid.bind(this, this),
                      onDone: updateBillDetail.bind(this, this)
                    }}
                  />

                  {/* <ButtonType
                    className="btn btn-default"
                    loading={this.state.loading_bulk_Service}
                    onClick={ProcessFromFavourite.bind(this, this, "Services")}
                    label={{
                      forceLabel: "Add to list",
                      returnText: true
                    }}
                    others={{
                      disabled: this.state.add_to_list,
                      style: { float: "right", marginTop: 10 }
                    }}
                  /> */}
                  <button
                    className="btn btn-default"
                    style={{ float: "right", marginTop: 10 }}
                    onClick={ProcessFromFavourite.bind(this, this, "Services")}
                    disabled={this.state.add_to_list}
                  >
                    Add to List
                  </button>
                </div>
              </div>

              <hr />
              <div
                className="row GridTotalDetails margin-bottom-15"
                style={{ textAlign: "right" }}
              >
                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "sub_ttl"
                    }}
                  />
                  <h5>{getAmountFormart(this.state.sub_total_amount)}</h5>
                </div>
                <div className="col" style={{ textAlign: "right" }}>
                  <AlgaehLabel
                    label={{
                      fieldName: "dsct_amt"
                    }}
                  />
                  <h5>{getAmountFormart(this.state.discount_amount)}</h5>
                </div>

                <div className="col" style={{ textAlign: "right" }}>
                  <AlgaehLabel
                    label={{
                      fieldName: "net_ttl"
                    }}
                  />
                  <h5>{getAmountFormart(this.state.net_total)}</h5>
                </div>
                <div className="col" style={{ textAlign: "right" }}>
                  <AlgaehLabel
                    label={{
                      fieldName: "pat_payable"
                    }}
                  />
                  <h5>{getAmountFormart(this.state.patient_payable)}</h5>
                </div>
                <div className="col" style={{ textAlign: "right" }}>
                  <AlgaehLabel
                    label={{
                      fieldName: "co_payable"
                    }}
                  />
                  <h5>{getAmountFormart(this.state.company_payble)}</h5>
                </div>
              </div>
            </div>
            <FavouriteOrder
              HeaderCaption="Add Service to Favourite"
              show={this.state.isOpen}
              onClose={openFavouriteOrder.bind(this, this)}
              from="ClinicalDesk"
              doctor_id={Window.global["provider_id"]}
            />

            <ViewFavouriteOrder
              HeaderCaption="View Favourite Services"
              show={this.state.isFavOpen}
              onClose={closeViewFavouriteOrder.bind(this, this)}
              all_favourites={this.state.all_favourites}
            />

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <span className="float-right">
                      {/* <ButtonType
                        classname="btn-primary"
                        loading={this.state.loading_saveOrderService}
                        onClick={SaveOrdersServices.bind(this, this)}
                        label={{
                          forceLabel: "Save Service",
                          returnText: true
                        }}
                        others={{ disabled: this.state.saved }}
                      /> */}
                      <button
                        className="btn btn-primary"
                        onClick={SaveOrdersServices.bind(this, this)}
                        disabled={this.state.saved}
                      >
                        Save Service
                      </button>
                      <button
                        className="btn btn-default"
                        onClick={this.onClose.bind(this)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-default"
                        onClick={openViewFavouriteOrder.bind(this, this)}
                      >
                        View Favourite Order
                      </button>
                      <button
                        className="btn btn-default"
                        onClick={openFavouriteOrder.bind(this, this)}
                      >
                        Add Order to Favourite
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
    orderedList: state.orderedList
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
  )(OrderingServices)
);
