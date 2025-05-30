import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./AddOPBillingForm.scss";
import "./../../../../styles/site.scss";
// import extend from "extend";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  // AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import DisplayOPBilling from "../../../BillDetails/BillDetails";
import {
  serviceHandeler,
  discounthandle,
  adjustadvance,
  credittexthandle,
  EditGrid,
  CancelGrid,
  ondiscountgridcol,
  makeZero,
  makeDiscountZero,
  makeZeroIngrid,
  ApplyPromo,
} from "./AddOPBillingHandaler";
import ReciptForm from "../ReciptDetails/AddReciptForm";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { successfulMessage } from "../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import Enumerable from "linq";
import _ from "lodash";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import swal from "sweetalert2";

class AddOPBillingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isPackUtOpen: false,
    };
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.BillingIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.BillingIOputs);
  }

  ShowBillDetails(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
    });
  }

  ProcessToBill(context, e) {
    let $this = this;
    algaehApiCall({
      uri: "/billing/checkServiceExists",
      module: "billing",
      method: "POST",
      data: {
        services_id: this.state.s_service,
        visit_id: this.state.visit_id,
        service_type_id: this.state.s_service_type,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          // let DataAdd = true
          if (response.data.records.exists === true) {
            swal({
              title: "Service already ordered!",
              html:
                "<b>" +
                this.state.service_name +
                "</b> ordered to this visit previously. <br/>Do you wish to order again?",
              type: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes",
              confirmButtonColor: "#44b8bd",
              cancelButtonColor: "#d33",
              cancelButtonText: "No",
            }).then((willDelete) => {
              if (willDelete.value) {
                let SelectedService = Enumerable.from(this.state.billdetails)
                  .where(
                    (w) =>
                      w.service_type_id === $this.state.s_service_type &&
                      w.services_id === $this.state.s_service
                  )
                  .toArray();

                if (SelectedService.length === 0) {
                  if (
                    this.state.patient_id !== null &&
                    this.state.visit_id !== null
                  ) {
                    if (
                      this.state.s_service_type !== null &&
                      this.state.s_service !== null
                    ) {
                      AlgaehLoader({ show: true });
                      let applydiscount = false;
                      let serviceInput = [
                        {
                          insured: this.state.insured,
                          vat_applicable: this.state.vat_applicable,
                          hims_d_services_id: this.state.s_service,
                          primary_insurance_provider_id:
                            this.state.insurance_provider_id,
                          primary_network_office_id:
                            this.state.hims_d_insurance_network_office_id,
                          primary_network_id: this.state.network_id,
                          sec_insured: this.state.sec_insured,
                          secondary_insurance_provider_id:
                            this.state.secondary_insurance_provider_id,
                          secondary_network_id: this.state.secondary_network_id,
                          secondary_network_office_id:
                            this.state.secondary_network_office_id,
                          test_id: this.state.test_id,
                        },
                      ];

                      algaehApiCall({
                        uri: "/billing/getBillDetails",
                        module: "billing",
                        method: "POST",
                        data: serviceInput,
                        onSuccess: (response) => {
                          if (response.data.success) {
                            let data = response.data.records;

                            if (data.billdetails[0].pre_approval === "Y") {
                              AlgaehLoader({ show: false });
                              successfulMessage({
                                message:
                                  "Pre-approval required for selected service, Please approve before billing.",
                                title: "Warning",
                                icon: "warning",
                              });
                            } else {
                              let existingservices = $this.state.billdetails;

                              if (data.billdetails.length !== 0) {
                                data.billdetails[0].created_date = new Date();
                                data.billdetails[0].send_out_test =
                                  this.state.send_out_test;
                                existingservices.splice(
                                  0,
                                  0,
                                  data.billdetails[0]
                                );
                              }

                              if (this.state.mode_of_pay === "Insurance") {
                                applydiscount = true;
                              }
                              if (context !== null) {
                                context.updateState({
                                  billdetails: existingservices,
                                  applydiscount: applydiscount,
                                  // s_service_type: null,
                                  s_service: null,
                                  service_name: "",
                                  saveEnable: false,
                                  promo_code: null,
                                });
                              }

                              algaehApiCall({
                                uri: "/billing/billingCalculations",
                                module: "billing",
                                method: "POST",
                                data: { billdetails: existingservices },
                                onSuccess: (response) => {
                                  if (response.data.success) {
                                    if (context !== null) {
                                      response.data.records.patient_payable_h =
                                        response.data.records.patient_payable ||
                                        $this.state.patient_payable;

                                      response.data.records.billDetails = false;
                                      if (
                                        this.state.default_pay_type === "CD"
                                      ) {
                                        response.data.records.card_amount =
                                          response.data.records.receiveable_amount;
                                        response.data.records.cash_amount = 0;
                                      }

                                      context.updateState({
                                        ...response.data.records,
                                      });
                                      AlgaehLoader({ show: false });
                                    }
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
                    } else {
                      successfulMessage({
                        message: "Please select the service and Service Type.",
                        title: "Warning",
                        icon: "warning",
                      });
                    }
                  } else {
                    successfulMessage({
                      message: "Please select the patient and visit.",
                      title: "Warning",
                      icon: "warning",
                    });
                  }
                } else {
                  successfulMessage({
                    message: "Selected service already exists.",
                    title: "Warning",
                    icon: "warning",
                  });
                }
              }
            });
          } else {
            let SelectedService = Enumerable.from(this.state.billdetails)
              .where(
                (w) =>
                  w.service_type_id === $this.state.s_service_type &&
                  w.services_id === $this.state.s_service
              )
              .toArray();

            if (SelectedService.length === 0) {
              if (
                this.state.patient_id !== null &&
                this.state.visit_id !== null
              ) {
                if (
                  this.state.s_service_type !== null &&
                  this.state.s_service !== null
                ) {
                  AlgaehLoader({ show: true });
                  let applydiscount = false;
                  let serviceInput = [
                    {
                      insured: this.state.insured,
                      vat_applicable: this.state.vat_applicable,
                      hims_d_services_id: this.state.s_service,
                      primary_insurance_provider_id:
                        this.state.insurance_provider_id,
                      primary_network_office_id:
                        this.state.hims_d_insurance_network_office_id,
                      primary_network_id: this.state.network_id,
                      sec_insured: this.state.sec_insured,
                      secondary_insurance_provider_id:
                        this.state.secondary_insurance_provider_id,
                      secondary_network_id: this.state.secondary_network_id,
                      secondary_network_office_id:
                        this.state.secondary_network_office_id,
                      test_id: this.state.test_id,
                    },
                  ];

                  algaehApiCall({
                    uri: "/billing/getBillDetails",
                    module: "billing",
                    method: "POST",
                    data: serviceInput,
                    onSuccess: (response) => {
                      if (response.data.success) {
                        let data = response.data.records;

                        if (data.billdetails[0].pre_approval === "Y") {
                          AlgaehLoader({ show: false });
                          successfulMessage({
                            message:
                              "Pre-approval required for selected service, Please approve before billing.",
                            title: "Warning",
                            icon: "warning",
                          });
                        } else {
                          let existingservices = $this.state.billdetails;

                          if (data.billdetails.length !== 0) {
                            data.billdetails[0].created_date = new Date();
                            data.billdetails[0].send_out_test =
                              this.state.send_out_test;
                            existingservices.splice(0, 0, data.billdetails[0]);
                          }

                          if (this.state.mode_of_pay === "Insurance") {
                            applydiscount = true;
                          }
                          if (context !== null) {
                            context.updateState({
                              billdetails: existingservices,
                              applydiscount: applydiscount,
                              // s_service_type: null,
                              s_service: null,
                              service_name: "",
                              saveEnable: false,
                              promo_code: null,
                            });
                          }

                          algaehApiCall({
                            uri: "/billing/billingCalculations",
                            module: "billing",
                            method: "POST",
                            data: { billdetails: existingservices },
                            onSuccess: (response) => {
                              if (response.data.success) {
                                if (context !== null) {
                                  response.data.records.patient_payable_h =
                                    response.data.records.patient_payable ||
                                    $this.state.patient_payable;

                                  response.data.records.billDetails = false;
                                  if (this.state.default_pay_type === "CD") {
                                    response.data.records.card_amount =
                                      response.data.records.receiveable_amount;
                                    response.data.records.cash_amount = 0;
                                  }

                                  context.updateState({
                                    ...response.data.records,
                                  });
                                  AlgaehLoader({ show: false });
                                }
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
                } else {
                  successfulMessage({
                    message: "Please select the service and Service Type.",
                    title: "Warning",
                    icon: "warning",
                  });
                }
              } else {
                successfulMessage({
                  message: "Please select the patient and visit.",
                  title: "Warning",
                  icon: "warning",
                });
              }
            } else {
              successfulMessage({
                message: "Selected service already exists.",
                title: "Warning",
                icon: "warning",
              });
            }
          }
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

  updateBillDetail(context, row, e) {
    algaehApiCall({
      uri: "/billing/billingCalculations",
      module: "billing",
      method: "POST",
      data: { billdetails: this.state.billdetails },
      onSuccess: (response) => {
        if (response.data.success) {
          response.data.records.patient_payable_h =
            response.data.records.patient_payable || this.state.patient_payable;
          response.data.records.saveEnable = false;
          response.data.records.addNewService = false;
          if (this.state.default_pay_type === "CD") {
            response.data.records.card_amount =
              response.data.records.receiveable_amount;
            response.data.records.cash_amount = 0;
          }

          if (context !== null) {
            context.updateState({ ...response.data.records });
          }
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  deleteBillDetail(context, row) {
    debugger;

    if (row.service_type_id === 14) {
      swal({
        title: "Delete Package Service",
        html:
          "Do you want to delete <b>" +
          row.service_name +
          "</b> package service?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete Permanent",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#44b8bd",
        cancelButtonText: "Delete Temporary",
        showCloseButton: true,
      }).then((willProceed) => {
        if (willProceed.value) {
          algaehApiCall({
            uri: "/billing/deletePackageData",
            module: "billing",
            method: "POST",
            data: { hims_f_package_header_id: row.ordered_package_id },
            onSuccess: (response) => {
              if (response.data.success) {
                this.clearData(context, row);
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
        } else if (willProceed.dismiss === "cancel") {
          this.clearData(context, row);
        }
      });
    } else {
      this.clearData(context, row);
    }
  }

  clearData(context, row) {
    let serviceDetails = this.state.billdetails;
    let _index = serviceDetails.indexOf(row);
    serviceDetails.splice(_index, 1);
    if (serviceDetails.length === 0) {
      if (context !== undefined) {
        context.updateState({
          billdetails: serviceDetails,
          advance_amount: 0,
          discount_amount: 0,
          sub_total_amount: 0,
          total_tax: 0,
          net_total: 0,
          copay_amount: 0,
          sec_copay_amount: 0,
          deductable_amount: 0,
          sec_deductable_amount: 0,
          gross_total: 0,
          sheet_discount_amount: 0,
          sheet_discount_percentage: 0,
          net_amount: 0,
          patient_res: 0,
          company_res: 0,
          sec_company_res: 0,
          patient_payable: 0,
          patient_payable_h: 0,
          company_payable: 0,
          sec_company_payable: 0,
          patient_tax: 0,
          company_tax: 0,
          sec_company_tax: 0,
          net_tax: 0,
          credit_amount: 0,
          receiveable_amount: 0,

          cash_amount: 0,
          card_number: "",
          card_date: null,
          card_amount: 0,
          cheque_number: "",
          cheque_date: null,
          cheque_amount: 0,
          total_amount: 0,
          unbalanced_amount: 0,
          saveEnable: true,
          billDetails: true,
          applydiscount: true,
        });
      }
    } else {
      algaehApiCall({
        uri: "/billing/billingCalculations",
        module: "billing",
        method: "POST",
        data: { billdetails: serviceDetails },
        onSuccess: (response) => {
          if (response.data.success) {
            response.data.records.patient_payable_h =
              response.data.records.patient_payable ||
              this.state.patient_payable;

            if (this.state.default_pay_type === "CD") {
              response.data.records.card_amount =
                response.data.records.receiveable_amount;
              response.data.records.cash_amount = 0;
            }
            if (context !== null) {
              context.updateState({ ...response.data.records });
            }
          }
        },
        onFailure: (error) => {
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });

      if (context !== undefined) {
        context.updateState({
          billdetails: serviceDetails,
        });
      }
    }
  }
  render() {
    let Package_Exists =
      this.props.PatientPackageList === undefined
        ? []
        : this.props.PatientPackageList;

    let insurance_type =
      this.props.existinsurance === undefined
        ? []
        : this.props.existinsurance.length > 0
        ? this.props.existinsurance[0].insurance_type
        : [];
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {(context) => (
            <div className="row">
              <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-8">
                <div className="screenCardStyle">
                  <div className="row">
                    <div className="col-12">
                      <div className="row">
                        <AlgaehAutoSearch
                          div={{
                            className:
                              "col customServiceSearch AlgaehAutoSearch",
                          }}
                          label={{ forceLabel: "Search Investigation" }}
                          title="Search Investigation"
                          id="service_id_search"
                          template={({
                            covered,
                            pre_approval,
                            service_name,
                            service_type,
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
                              <div
                                className={`row resultSecStyles ${properStyle}`}
                              >
                                <div className="col-12 padd-10">
                                  <h4 className="title">
                                    {_.startCase(_.toLower(service_name))}
                                  </h4>
                                  <p className="searchMoreDetails">
                                    <span>
                                      Service Type:
                                      <b>
                                        {_.startCase(_.toLower(service_type))}
                                      </b>
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
                            insurance_id: this.state.insurance_provider_id,
                          }}
                          searchName="insservicemaster"
                          onClick={serviceHandeler.bind(this, this, context)}
                          onClear={() => {
                            context.updateState({
                              s_service: null,
                              service_name: "",
                              s_service_type: null,
                            });
                          }}
                          ref={(attReg) => {
                            this.attReg = attReg;
                          }}
                        />
                        <div className="col-lg-2">
                          <button
                            className="btn btn-primary"
                            style={{ marginTop: "21px" }}
                            onClick={this.ProcessToBill.bind(this, context)}
                            disabled={this.state.addNewService}
                          >
                            <AlgaehLabel
                              label={{
                                fieldName: "add_new_service",
                                align: "ltr",
                                returnText: true,
                              }}
                            />
                          </button>
                        </div>

                        <div className="col-lg-2">
                          <button
                            className="btn btn-default"
                            style={{ marginTop: "21px" }}
                            onClick={this.ShowBillDetails.bind(this)}
                            disabled={this.state.billDetails}
                          >
                            <AlgaehLabel
                              label={{
                                fieldName: "view_bill_details",
                                align: "ltr",
                                returnText: true,
                              }}
                            />
                          </button>

                          <DisplayOPBilling
                            HeaderCaption={
                              <AlgaehLabel
                                label={{
                                  fieldName: "bill_details",
                                  align: "ltr",
                                }}
                              />
                            }
                            BillingIOputs={{
                              selectedLang: this.state.selectedLang,
                              billdetails: this.state.billdetails,
                            }}
                            show={this.state.isOpen}
                            onClose={this.ShowBillDetails.bind(this)}
                          />
                        </div>
                        {Package_Exists.length > 0 ? (
                          <div className="col">
                            <div
                              className="alert alert-warning animated flash slow infinite"
                              role="alert"
                              style={{
                                margin: "18px 0 0",
                                padding: 5,
                                textAlign: "center",
                              }}
                            >
                              Package Exists
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-12" id="opBillingGrid_Cntr">
                      <AlgaehDataGrid
                        id="Bill_details"
                        columns={[
                          {
                            fieldName: "actions",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Action" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  <i
                                    style={{
                                      pointerEvents: this.state.Billexists
                                        ? "none"
                                        : "",
                                      opacity: this.state.Billexists
                                        ? "0.1"
                                        : "",
                                    }}
                                    onClick={this.deleteBillDetail.bind(
                                      this,
                                      context,
                                      row
                                    )}
                                    className="fas fa-trash-alt"
                                  />
                                </span>
                              );
                            },
                            others: {
                              width: 60,
                            },
                          },
                          {
                            fieldName: "service_type",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Type" }} />
                            ),
                            others: {
                              width: 120,
                            },
                          },

                          {
                            fieldName: "service_name",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "services_id" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              let package_service =
                                row.trans_package_detail_id > 0
                                  ? "(Package Service)"
                                  : "";

                              return (
                                <span>
                                  <b>{row.service_name}</b>
                                  <small className="packageAvail">
                                    {package_service}
                                  </small>
                                </span>
                              );
                            },
                            others: {
                              // width: 90,
                              style: { textAlign: "left" },
                            },
                          },

                          {
                            fieldName: "insurance_yesno",
                            label: (
                              <AlgaehLabel label={{ fieldName: "insurance" }} />
                            ),
                            displayTemplate: (row) => {
                              return row.insurance_yesno === "N" ? (
                                <span className="badge badge-danger">
                                  Not Covered
                                </span>
                              ) : (
                                <span className="badge badge-success">
                                  Covered
                                </span>
                              );
                            },
                            disabled: true,
                            others: {
                              width: 100,
                            },
                          },
                          {
                            fieldName: "unit_cost",
                            label: (
                              <AlgaehLabel label={{ fieldName: "unit_cost" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {GetAmountFormart(row.unit_cost, {
                                    appendSymbol: false,
                                  })}
                                </span>
                              );
                            },
                            disabled: true,
                            others: {
                              width: 90,
                              style: { textAlign: "right" },
                            },
                          },
                          {
                            fieldName: "quantity",
                            label: (
                              <AlgaehLabel label={{ fieldName: "quantity" }} />
                            ),
                            disabled: true,
                            others: {
                              width: 90,
                            },
                          },

                          {
                            fieldName: "gross_amount",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "gross_amount" }}
                              />
                            ),
                            disabled: true,
                            others: {
                              width: 120,
                              style: { textAlign: "right" },
                            },
                          },
                          {
                            fieldName: "discount_percentage",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "discount_percentage" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return row.insurance_yesno === "Y" &&
                                insurance_type === "I" ? (
                                row.discount_percentage
                              ) : (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    decimal: { allowNegative: false },
                                    value: row.discount_percentage,
                                    className: "txt-fld",
                                    name: "discount_percentage",
                                    events: {
                                      onChange: ondiscountgridcol.bind(
                                        this,
                                        this,
                                        context,
                                        row
                                      ),
                                    },
                                    others: {
                                      placeholder: "0.00",
                                      disabled:
                                        row.trans_package_detail_id > 0
                                          ? true
                                          : this.state.Billexists,
                                      onBlur: makeZeroIngrid.bind(
                                        this,
                                        this,
                                        context,
                                        row
                                      ),
                                      onFocus: (e) => {
                                        e.target.oldvalue = e.target.value;
                                      },
                                    },
                                  }}
                                />
                              );
                              // return (
                              //   <AlagehFormGroup
                              //     div={{}}
                              //     textBox={{
                              //       decimal: { allowNegative: false },
                              //       value: row.discount_percentage,
                              //       className: "txt-fld",
                              //       name: "discount_percentage",
                              //       events: {
                              //         onChange: ondiscountgridcol.bind(
                              //           this,
                              //           this,
                              //           context,
                              //           row
                              //         ),
                              //       },
                              //       others: {
                              //         placeholder: "0.00",
                              //         disabled: this.state.Billexists,
                              //         // this.state.insurance_yesno === "Y"
                              //         //   ? true
                              //         //   : row.trans_package_detail_id > 0
                              //         //     ? true
                              //         //     : this.state.Billexists,
                              //         onBlur: makeZeroIngrid.bind(
                              //           this,
                              //           this,
                              //           context,
                              //           row
                              //         ),
                              //         onFocus: (e) => {
                              //           e.target.oldvalue = e.target.value;
                              //         },
                              //       },
                              //     }}
                              //   />
                              // );
                            },
                            others: {
                              width: 100,
                              style: { textAlign: "right" },
                            },
                          },
                          {
                            fieldName: "discount_amout",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "discount_amout" }}
                              />
                            ),

                            displayTemplate: (row) => {
                              return row.insurance_yesno === "Y" &&
                                insurance_type === "I" ? (
                                row.discount_amout
                              ) : (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    decimal: { allowNegative: false },
                                    value: row.discount_amout,
                                    className: "txt-fld",
                                    name: "discount_amout",
                                    events: {
                                      onChange: ondiscountgridcol.bind(
                                        this,
                                        this,
                                        context,
                                        row
                                      ),
                                    },
                                    others: {
                                      placeholder: "0.00",
                                      disabled:
                                        row.trans_package_detail_id > 0
                                          ? true
                                          : this.state.Billexists,
                                      onBlur: makeZeroIngrid.bind(
                                        this,
                                        this,
                                        context,
                                        row
                                      ),
                                      onFocus: (e) => {
                                        e.target.oldvalue = e.target.value;
                                      },
                                    },
                                  }}
                                />
                              );
                            },
                            others: {
                              width: 120,
                              style: { textAlign: "right" },
                            },
                          },

                          {
                            fieldName: "net_amout",
                            label: (
                              <AlgaehLabel label={{ fieldName: "net_amout" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {GetAmountFormart(row.net_amout, {
                                    appendSymbol: false,
                                  })}
                                </span>
                              );
                            },
                            disabled: true,
                            others: {
                              width: 100,
                              style: { textAlign: "right" },
                            },
                          },
                        ]}
                        keyId="service_type_id"
                        dataSource={{
                          data: this.state.billdetails,
                        }}
                        // isEditable={!this.state.Billexists}
                        actions={{
                          allowEdit: !this.state.Billexists,
                          allowDelete: !this.state.Billexists,
                        }}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        byForceEvents={true}
                        events={{
                          onDelete: this.deleteBillDetail.bind(this, context),
                          onEdit: EditGrid.bind(this, this, context),
                          onCancel: CancelGrid.bind(this, this, context),
                          onDone: this.updateBillDetail.bind(this, context),
                        }}
                        forceRender={this.state.Rerender}
                      />
                    </div>
                    <div className="col-lg-7" />
                    <div className="col-lg-5" style={{ textAlign: "right" }}>
                      <div className="row">
                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "sub_total_amount",
                            }}
                          />
                          <h6>
                            {GetAmountFormart(this.state.sub_total_amount)}
                          </h6>
                        </div>
                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "discount_amount",
                            }}
                          />
                          <h6>
                            {GetAmountFormart(this.state.discount_amount)}
                          </h6>
                        </div>

                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "net_total",
                            }}
                          />
                          <h6>{GetAmountFormart(this.state.net_total)}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-4">
                <div className="row">
                  <div className="algaeh-md-4 algaeh-lg-4 algaeh-xl-12 ">
                    <div className="screenCardStyle">
                      <div className="row">
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "copay_amount",
                            }}
                          />
                          <h6>{GetAmountFormart(this.state.copay_amount)}</h6>
                        </div>
                        {this.state.deductable_amount === 0 ? null : (
                          <div className="col-lg-6">
                            <AlgaehLabel
                              label={{
                                fieldName: "deductable_amount",
                              }}
                            />
                            <h6>
                              {GetAmountFormart(this.state.deductable_amount)}
                            </h6>
                          </div>
                        )}
                        {/* <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "seco_copay_amount"
                            }}
                          />
                          <h6>
                            {GetAmountFormart(this.state.sec_copay_amount)}
                          </h6>
                        </div>
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "sec_deductable_amount"
                            }}
                          />
                          <h6>
                            {GetAmountFormart(this.state.sec_deductable_amount)}
                          </h6>
                        </div> */}
                      </div>
                      <div className="row">
                        <div className="col-lg-12 patientRespo">
                          <AlgaehLabel
                            label={{
                              fieldName: "patient_lbl",
                            }}
                          />
                          <hr style={{ marginTop: 0, marginBottom: 5 }} />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  fieldName: "responsibility_lbl",
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.patient_res)}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  fieldName: "tax_lbl",
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.patient_tax)}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  fieldName: "payable_lbl",
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.patient_payable_h)}
                              </h6>
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-lg-1"> &nbsp; </div> */}

                        <div className="col-lg-12">
                          <AlgaehLabel
                            label={{
                              fieldName: "company_lbl",
                            }}
                          />
                          <hr style={{ marginTop: 0, marginBottom: 5 }} />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  fieldName: "responsibility_lbl",
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.company_res)}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  fieldName: "tax_lbl",
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.company_tax)}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  fieldName: "payable_lbl",
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.company_payble)}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="algaeh-md-8 algaeh-lg-8 algaeh-xl-12  primary-details ">
                    <div className="screenCardStyle">
                      <div className="row secondary-box-container">
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "advance_adjust",
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.advance_adjust,
                            className: "txt-fld",
                            name: "advance_adjust",

                            events: {
                              onChange: adjustadvance.bind(this, this, context),
                            },
                            others: {
                              placeholder: "0.00",
                              onBlur: makeZero.bind(this, this, context),
                              onFocus: (e) => {
                                e.target.oldvalue = e.target.value;
                              },
                              disabled:
                                parseFloat(this.state.advance_amount) === 0
                                  ? true
                                  : this.state.Billexists,
                            },
                          }}
                        />

                        {Package_Exists.length > 0 ? (
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              forceLabel: "adjust package",
                            }}
                            textBox={{
                              decimal: { allowNegative: false },
                              value: this.state.pack_advance_adjust,
                              className: "txt-fld",
                              name: "pack_advance_adjust",

                              events: {
                                onChange: adjustadvance.bind(
                                  this,
                                  this,
                                  context
                                ),
                              },
                              others: {
                                placeholder: "0.00",
                                onBlur: makeZero.bind(this, this, context),
                                onFocus: (e) => {
                                  e.target.oldvalue = e.target.value;
                                },
                                disabled:
                                  parseFloat(this.state.pack_advance_amount) ===
                                  0
                                    ? true
                                    : this.state.Billexists,
                              },
                            }}
                          />
                        ) : null}
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "sheet_discount_percentage",
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_percentage,
                            className: "txt-fld",
                            name: "sheet_discount_percentage",

                            events: {
                              onChange: discounthandle.bind(
                                this,
                                this,
                                context
                              ),
                            },
                            others: {
                              //sidhiqe - disabled this due to issue in income report when we give sheet level discount
                              disabled: true,
                              // this.state.Billexists === true
                              //   ? true
                              //   : this.state.applydiscount,
                              placeholder: "0.00",
                              onBlur: makeDiscountZero.bind(
                                this,
                                this,
                                context
                              ),
                              onFocus: (e) => {
                                e.target.oldvalue = e.target.value;
                              },
                            },
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "sheet_discount_amount",
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_amount,
                            className: "txt-fld",
                            name: "sheet_discount_amount",
                            events: {
                              onChange: discounthandle.bind(
                                this,
                                this,
                                context
                              ),
                            },
                            others: {
                              //sidhiqe - disabled this due to issue in income report when u give sheet level discount
                              disabled: true,
                              // this.state.Billexists === true
                              //   ? true
                              //   : this.state.applydiscount,
                              placeholder: "0.00",

                              onFocus: (e) => {
                                e.target.oldvalue = e.target.value;
                              },
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{
                            className: "col ",
                          }}
                          label={{
                            fieldName: "Enter Promo Code",
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "promo_code",
                            value: this.state.promo_code,
                            events: {
                              onChange: (e) => {
                                this.setState({
                                  [e.target.name]: e.target.value,
                                });
                                context.updateState({
                                  [e.target.name]: e.target.value,
                                });
                              },
                            },
                          }}
                        />
                        <div className="col">
                          <button
                            className="btn btn-default"
                            style={{ marginTop: "19px" }}
                            onClick={ApplyPromo.bind(this, this, context)}
                          >
                            <AlgaehLabel
                              label={{
                                forceLabel: "Apply Promo",
                                align: "ltr",
                                returnText: true,
                              }}
                            />
                          </button>
                        </div>
                      </div>

                      <hr />
                      <div
                        className="row secondary-box-container"
                        style={{ marginBottom: "10px" }}
                      >
                        <div className="col">
                          <AlgaehLabel
                            label={{
                              fieldName: "advance_amount",
                            }}
                          />
                          <h6>{GetAmountFormart(this.state.advance_amount)}</h6>
                        </div>

                        {Package_Exists.length > 0 ? (
                          <div className="col">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Package Avilable Advance",
                              }}
                            />
                            <h6>
                              {GetAmountFormart(this.state.pack_advance_amount)}
                            </h6>
                          </div>
                        ) : null}

                        <div className="col">
                          <AlgaehLabel
                            label={{
                              fieldName: "net_amount",
                            }}
                          />
                          <h6>{GetAmountFormart(this.state.net_amount)}</h6>
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "credit_amount",
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.credit_amount,
                            className: "txt-fld",
                            name: "credit_amount",
                            events: {
                              onChange: credittexthandle.bind(
                                this,
                                this,
                                context
                              ),
                            },
                            others: {
                              placeholder: "0.00",
                              onBlur: makeZero.bind(this, this, context),
                              disabled:
                                this.state.Billexists === true ? true : false,
                            },
                          }}
                        />

                        <div className="col highlightGreen">
                          <AlgaehLabel
                            label={{
                              fieldName: "receiveable_amount",
                            }}
                          />
                          <h4>
                            {GetAmountFormart(this.state.receiveable_amount)}
                          </h4>
                        </div>
                        <div className="col highlightGrey">
                          <AlgaehLabel
                            label={{
                              fieldName: "balance_due",
                            }}
                          />

                          <h6>{GetAmountFormart(this.state.balance_credit)}</h6>
                        </div>
                      </div>
                      <ReciptForm BillingIOputs={this.props.BillingIOputs} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    PatientPackageList: state.PatientPackageList,
    existinsurance: state.existinsurance,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientPackage: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddOPBillingForm)
);
