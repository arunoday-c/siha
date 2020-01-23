import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./AddPackageBilling.scss";
import "./../../../../styles/site.scss";
import extend from "extend";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import DisplayOPBilling from "../../../BillDetails/BillDetails";
import {
  serviceHandeler,
  discounthandle,
  adjustadvance,
  billheaderCalculation,
  onchangegridcol,
  credittexthandle,
  EditGrid,
  CancelGrid
} from "./AddPackageBillingHandaler";
import ReciptForm from "../ReciptDetails/AddReciptForm";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { successfulMessage } from "../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import Enumerable from "linq";
import PackageList from "../PackageList/PackageList";
import _ from "lodash";

class AddPackageBilling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      packOpen: false
    };
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.BillingIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.BillingIOputs);
  }

  componentDidMount() {
    if (
      this.props.packbilservices === undefined ||
      this.props.packbilservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        data: { service_type_id: 14 },
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "packbilservices"
        }
      });
    }
  }

  ShowBillDetails(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen
    });
  }

  ShowPackList(row, e) {
    let package_List = this.state.package_List;
    let packages = _.filter(
      package_List,
      f => f.package_service_id === row.services_id
    );

    this.setState({
      ...this.state,
      packOpen: !this.state.packOpen,
      packages: packages
    });
  }

  ClosePackList(e) {
    this.setState({
      packOpen: !this.state.packOpen
    });
  }

  ProcessToBill(context, e) {
    let $this = this;

    let SelectedService = Enumerable.from(this.state.billdetails)
      .where(w => w.services_id === $this.state.s_service)
      .toArray();

    let package_List = $this.state.package_List;
    if (SelectedService.length === 0) {
      if (this.state.patient_id !== null && this.state.visit_id !== null) {
        if (this.state.s_service !== null) {
          let applydiscount = false;
          let serviceInput = [
            {
              insured: this.state.insured,
              vat_applicable: this.state.vat_applicable,
              hims_d_services_id: this.state.s_service,
              primary_insurance_provider_id: this.state.insurance_provider_id,
              primary_network_office_id: this.state
                .hims_d_insurance_network_office_id,
              primary_network_id: this.state.network_id,
              sec_insured: this.state.sec_insured,
              secondary_insurance_provider_id: this.state
                .secondary_insurance_provider_id,
              secondary_network_id: this.state.secondary_network_id,
              secondary_network_office_id: this.state
                .secondary_network_office_id
            }
          ];

          algaehApiCall({
            uri: "/billing/getBillDetails",
            module: "billing",
            method: "POST",
            data: serviceInput,
            onSuccess: response => {
              if (response.data.success) {
                let data = response.data.records;

                if (data.billdetails[0].pre_approval === "Y") {
                  successfulMessage({
                    message:
                      "Selected Service is Pre-Approval required, you don't have rights to bill.",
                    title: "Warning",
                    icon: "warning"
                  });
                } else {
                  let existingservices = $this.state.billdetails;

                  if (data.billdetails.length !== 0) {
                    data.billdetails[0].created_date = new Date();
                    existingservices.splice(0, 0, data.billdetails[0]);
                  }

                  if (this.state.mode_of_pay === "Insurance") {
                    applydiscount = true;
                  }
                  if (context !== null) {
                    context.updateState({
                      billdetails: existingservices,
                      applydiscount: applydiscount,
                      saveEnable: false
                    });
                  }

                  algaehApiCall({
                    uri: "/billing/billingCalculations",
                    module: "billing",
                    method: "POST",
                    data: { billdetails: existingservices },
                    onSuccess: response => {
                      if (response.data.success) {
                        if (context !== null) {
                          response.data.records.patient_payable_h =
                            response.data.records.patient_payable ||
                            $this.state.patient_payable;

                          response.data.records.billDetails = false;
                          context.updateState({ ...response.data.records });
                        }
                      }
                    },
                    onFailure: error => {
                      swalMessage({
                        title: error.message,
                        type: "error"
                      });
                    }
                  });

                  algaehApiCall({
                    uri: "/billing/getPakageDetails",
                    module: "billing",
                    method: "GET",
                    data: { package_service_id: $this.state.s_service },
                    onSuccess: response => {
                      if (response.data.success) {
                        if (context !== null) {
                          // package_List.splice(0, 0, response.data.records);
                          if (package_List.length === 0) {
                            package_List = response.data.records;
                          } else {
                            package_List = package_List.concat(
                              response.data.records
                            );
                          }
                          context.updateState({
                            package_List: package_List,
                            s_service: null
                          });
                        }
                      }
                    },
                    onFailure: error => {
                      swalMessage({
                        title: error.message,
                        type: "error"
                      });
                    }
                  });
                }
              }
            },
            onFailure: error => {
              swalMessage({
                title: error.message,
                type: "error"
              });
            }
          });
        } else {
          successfulMessage({
            message: "Please select the Service and Service Type.",
            title: "Warning",
            icon: "warning"
          });
        }
      } else {
        successfulMessage({
          message: "Please select the patient and visit.",
          title: "Warning",
          icon: "warning"
        });
      }
    } else {
      successfulMessage({
        message: "Selected Service already exists.",
        title: "Warning",
        icon: "warning"
      });
    }
  }
  //Calculate Row Detail
  calculateAmount(row, ctrl, e) {
    e = e || ctrl;
    if (e.target.value !== e.target.oldvalue) {
      let $this = this;
      let billdetails = this.state.billdetails;

      row[e.target.name] = parseFloat(
        e.target.value === "" ? 0 : e.target.value
      );
      let inputParam = [
        {
          hims_d_services_id: row.services_id,
          vat_applicable: this.state.vat_applicable,
          quantity: row.quantity,
          discount_amout:
            e.target.name === "discount_percentage" ? 0 : row.discount_amout,
          discount_percentage:
            e.target.name === "discount_amout" ? 0 : row.discount_percentage,

          insured: this.state.insured,
          primary_insurance_provider_id: this.state.insurance_provider_id,
          primary_network_office_id: this.state
            .hims_d_insurance_network_office_id,
          primary_network_id: this.state.network_id,
          sec_insured: this.state.sec_insured,
          secondary_insurance_provider_id: this.state
            .secondary_insurance_provider_id,
          secondary_network_id: this.state.secondary_network_id,
          secondary_network_office_id: this.state.secondary_network_office_id
        }
      ];

      algaehApiCall({
        uri: "/billing/getBillDetails",
        module: "billing",
        method: "POST",
        data: inputParam,
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;

            extend(row, data.billdetails[0]);
            billdetails[row.rowIdx] = row;
            $this.setState({ billdetails: billdetails });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  }

  updateBillDetail(context, row, e) {
    algaehApiCall({
      uri: "/billing/billingCalculations",
      module: "billing",
      method: "POST",
      data: { billdetails: this.state.billdetails },
      onSuccess: response => {
        if (response.data.success) {
          response.data.records.patient_payable_h =
            response.data.records.patient_payable || this.state.patient_payable;
          response.data.records.saveEnable = false;
          response.data.records.addNewService = false;
          if (context !== null) {
            context.updateState({ ...response.data.records });
          }
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  deleteBillDetail(context, row) {
    let serviceDetails = this.state.billdetails;
    serviceDetails.splice(row.rowIdx, 1);

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
          applydiscount: true
        });
      }
    } else {
      algaehApiCall({
        uri: "/billing/billingCalculations",
        module: "billing",
        method: "POST",
        data: { billdetails: serviceDetails },
        onSuccess: response => {
          if (response.data.success) {
            response.data.records.patient_payable_h =
              response.data.records.patient_payable ||
              this.state.patient_payable;

            if (context !== null) {
              context.updateState({ ...response.data.records });
            }
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });

      if (context !== undefined) {
        context.updateState({
          billdetails: serviceDetails
        });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-op-add-billing-form">
              <div className="container-fluid">
                <div className="row margin-top-15">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "select_service"
                    }}
                    selector={{
                      name: "s_service",
                      className: "select-fld",
                      value: this.state.s_service,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "service_name"
                            : "arabic_service_name",
                        valueField: "hims_d_services_id",
                        data: this.props.packbilservices
                      },
                      others: { disabled: this.state.Billexists },
                      onChange: serviceHandeler.bind(this, this, context),
                      onClear: () => {
                        this.setState({
                          s_service: null
                        });
                      }
                    }}
                  />

                  <div className="col-lg-4">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: "24px" }}
                      onClick={this.ProcessToBill.bind(this, context)}
                      disabled={this.state.addNewService}
                    >
                      Add New Service
                    </button>
                  </div>

                  <div className="col-lg-5">
                    <button
                      className="btn btn-default"
                      style={{ marginTop: "24px" }}
                      onClick={this.ShowBillDetails.bind(this)}
                      disabled={this.state.billDetails}
                    >
                      View Bill Details
                    </button>

                    <DisplayOPBilling
                      HeaderCaption={
                        <AlgaehLabel
                          label={{
                            fieldName: "bill_details",
                            align: "ltr"
                          }}
                        />
                      }
                      BillingIOputs={{
                        selectedLang: this.state.selectedLang,
                        billdetails: this.state.billdetails
                      }}
                      show={this.state.isOpen}
                      onClose={this.ShowBillDetails.bind(this)}
                    />

                    <PackageList
                      HeaderCaption={
                        <AlgaehLabel
                          label={{
                            fieldName: "pack_list",
                            align: "ltr"
                          }}
                        />
                      }
                      PackageIOputs={{
                        selectedLang: this.state.selectedLang,
                        packages: this.state.packages
                      }}
                      open={this.state.packOpen}
                      onClose={this.ClosePackList.bind(this)}
                    />
                  </div>
                </div>
                <div className="row" style={{ marginTop: "10px" }}>
                  <div className="col-lg-12">
                    <AlgaehDataGrid
                      id="Bill_details"
                      columns={[
                        {
                          fieldName: "view_package_list",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "view_package_list" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <React.Fragment>
                                <i
                                  className="fas fa-eye"
                                  onClick={this.ShowPackList.bind(this, row)}
                                />
                              </React.Fragment>
                            );
                          },
                          others: {
                            maxWidth: 105,
                            fixed: "left"
                          }
                        },
                        {
                          fieldName: "services_id",
                          label: (
                            <AlgaehLabel label={{ fieldName: "services_id" }} />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.packbilservices === undefined
                                ? []
                                : this.props.packbilservices.filter(
                                    f =>
                                      f.hims_d_services_id === row.services_id
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
                              this.props.packbilservices === undefined
                                ? []
                                : this.props.packbilservices.filter(
                                    f =>
                                      f.hims_d_services_id === row.services_id
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
                        },
                        {
                          fieldName: "unit_cost",
                          label: (
                            <AlgaehLabel label={{ fieldName: "unit_cost" }} />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "quantity",
                          label: (
                            <AlgaehLabel label={{ fieldName: "quantity" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.quantity,
                                  className: "txt-fld",
                                  name: "quantity",
                                  events: {
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    placeholder: "0.00",
                                    onBlur: this.calculateAmount.bind(
                                      this,
                                      row
                                    ),
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
                          fieldName: "gross_amount",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "gross_amount" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "discount_percentage",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "discount_percentage" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  decimal: { allowNegative: false },
                                  value: row.discount_percentage,
                                  className: "txt-fld",
                                  name: "discount_percentage",
                                  events: {
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    placeholder: "0.00",
                                    onBlur: this.calculateAmount.bind(
                                      this,
                                      row
                                    ),
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
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  decimal: { allowNegative: false },
                                  value: row.discount_amout,
                                  className: "txt-fld",
                                  name: "discount_amout",
                                  events: {
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    placeholder: "0.00",
                                    onBlur: this.calculateAmount.bind(
                                      this,
                                      row
                                    ),
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
                        }
                      ]}
                      keyId="service_type_id"
                      dataSource={{
                        data: this.state.billdetails
                      }}
                      isEditable={!this.state.Billexists}
                      actions={{
                        allowEdit: !this.state.Billexists,
                        allowDelete: !this.state.Billexists
                      }}
                      paging={{ page: 0, rowsPerPage: 5 }}
                      byForceEvents={true}
                      events={{
                        onDelete: this.deleteBillDetail.bind(this, context),
                        onEdit: EditGrid.bind(this, this, context),
                        onCancel: CancelGrid.bind(this, this, context),
                        onDone: this.updateBillDetail.bind(this, context)
                      }}
                    />
                  </div>
                </div>

                {/*<div className="row">
                  <div className="col-lg-7" />
                  <div className="col-lg-5" style={{ textAlign: "right" }}>
                    <div className="row">
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "sub_total_amount"
                          }}
                        />
                        <h6>{getAmountFormart(this.state.sub_total_amount)}</h6>
                      </div>
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "discount_amount"
                          }}
                        />
                        <h6>{getAmountFormart(this.state.discount_amount)}</h6>
                      </div>

                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            fieldName: "net_total"
                          }}
                        />
                        <h6>{getAmountFormart(this.state.net_total)}</h6>
                      </div>
                    </div>
                  </div>
                </div>*/}

                {/*<div className="row">
                  <div className="col-lg-4">
                    <div
                      style={{
                        margin: "15px 0",
                        border: "1px solid #acaaaa",
                        padding: 15,
                        borderRadius: 10
                      }}
                    >
                      <div className="row">
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "copay_amount"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.copay_amount)}</h6>
                        </div>
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "deductable_amount"
                            }}
                          />
                          <h6>
                            {getAmountFormart(this.state.deductable_amount)}
                          </h6>
                        </div>

                      </div>
                      <div className="row">
                        <div className="col-lg-12 patientRespo">
                          <AlgaehLabel
                            label={{
                              fieldName: "patient_lbl"
                            }}
                          />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  fieldName: "responsibility_lbl"
                                }}
                              />
                              <h6>
                                {getAmountFormart(this.state.patient_res)}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  fieldName: "tax_lbl"
                                }}
                              />
                              <h6>
                                {getAmountFormart(this.state.patient_tax)}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  fieldName: "payable_lbl"
                                }}
                              />
                              <h6>
                                {getAmountFormart(this.state.patient_payable_h)}
                              </h6>
                            </div>
                          </div>
                        </div>


                        <div className="col-lg-12">
                          <AlgaehLabel
                            label={{
                              fieldName: "company_lbl"
                            }}
                          />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  fieldName: "responsibility_lbl"
                                }}
                              />
                              <h6>
                                {getAmountFormart(this.state.company_res)}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  fieldName: "tax_lbl"
                                }}
                              />
                              <h6>
                                {getAmountFormart(this.state.company_tax)}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  fieldName: "payable_lbl"
                                }}
                              />
                              <h6>
                                {getAmountFormart(this.state.company_payble)}
                              </h6>
                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div
                      style={{
                        margin: "15px 0",
                        border: "1px solid #acaaaa",
                        padding: 15,
                        borderRadius: 10
                      }}
                    >
                      <div className="row secondary-box-container">
                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            fieldName: "advance_adjust"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.advance_adjust,
                            className: "txt-fld",
                            name: "advance_adjust",

                            events: {
                              onChange: adjustadvance.bind(this, this, context)
                            },
                            others: {
                              placeholder: "0.00",
                              onBlur: billheaderCalculation.bind(
                                this,
                                this,
                                context
                              ),
                              onFocus: e => {
                                e.target.oldvalue = e.target.value;
                              },
                              disabled:
                                this.state.advance_amount === 0
                                  ? true
                                  : this.state.Billexists
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            fieldName: "sheet_discount_percentage"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_percentage,
                            className: "txt-fld",
                            name: "sheet_discount_percentage",

                            events: {
                              onChange: discounthandle.bind(this, this, context)
                            },
                            others: {
                              disabled:
                                this.state.Billexists === true
                                  ? true
                                  : this.state.applydiscount,
                              placeholder: "0.00",
                              onBlur: billheaderCalculation.bind(
                                this,
                                this,
                                context
                              ),
                              onFocus: e => {
                                e.target.oldvalue = e.target.value;
                              }
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            fieldName: "sheet_discount_amount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_amount,
                            className: "txt-fld",
                            name: "sheet_discount_amount",
                            events: {
                              onChange: discounthandle.bind(this, this, context)
                            },
                            others: {
                              disabled:
                                this.state.Billexists === true
                                  ? true
                                  : this.state.applydiscount,
                              placeholder: "0.00",
                              onBlur: billheaderCalculation.bind(
                                this,
                                this,
                                context
                              ),
                              onFocus: e => {
                                e.target.oldvalue = e.target.value;
                              }
                            }
                          }}
                        />
                      </div>

                      <hr />
                      <div
                        className="row secondary-box-container"
                        style={{ marginBottom: "10px" }}
                      >
                        <div className="col">
                          <AlgaehLabel
                            label={{
                              fieldName: "advance_amount"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.advance_amount)}</h6>
                        </div>

                        <div className="col">
                          <AlgaehLabel
                            label={{
                              fieldName: "net_amount"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.net_amount)}</h6>
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "credit_amount"
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
                              )
                            },
                            others: {
                              placeholder: "0.00",
                              disabled:
                                this.state.Billexists === true ? true : false

                            }
                          }}
                        />

                        <div
                          className="col"
                          style={{
                            background: " #44b8bd",
                            color: " #fff"
                          }}
                        >
                          <AlgaehLabel
                            label={{
                              fieldName: "receiveable_amount"
                            }}
                          />
                          <h4>
                            {getAmountFormart(this.state.receiveable_amount)}
                          </h4>
                        </div>
                        <div className="col highlightGrey">
                          <AlgaehLabel
                            label={{
                              fieldName: "balance_due"
                            }}
                          />

                          <h6>{getAmountFormart(this.state.balance_credit)}</h6>
                        </div>
                      </div>
                      <ReciptForm BillingIOputs={this.props.BillingIOputs} />
                    </div>
                  </div>
                </div>*/}
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
    packbilservices: state.packbilservices
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServices: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddPackageBilling)
);
