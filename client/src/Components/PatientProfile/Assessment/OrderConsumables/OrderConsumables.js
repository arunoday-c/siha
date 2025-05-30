import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp,
} from "../../../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import _ from "lodash";
import {
  selectItemHandeler,
  ProcessService,
  deleteServices,
  SaveOrdersServices,
  calculateAmount,
  updateBillDetail,
  EditGrid,
  ItemChargable,
  makeZeroIngrid,
  texthandle,
} from "./OrderConsumablesHandaler";
import "./OrderConsumables.scss";
import "../../../../styles/site.scss";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { getCookie } from "../../../../utils/algaehApiCall";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
class OrderConsumables extends Component {
  constructor(props) {
    super(props);
    const { current_patient, visit_id, source, ip_id } = Window.global;
    this.state = {
      s_service_type: null,
      s_service: null,
      selectedLang: "en",

      patient_id: current_patient, //Window.global["current_patient"],
      visit_id: visit_id, // Window.global["visit_id"],
      source: source,
      ip_id: ip_id,
      doctor_id: null,
      vat_applicable: this.props.vat_applicable,

      orderconsumabledata: [],
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
      inventory_location_id: this.props.inventory_location_id,
      item_notchargable: "N",
      instructions: null,
      itemchargable: false,
    };
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang,
    });

    this.getPatientInsurance();
  }

  getPatientInsurance() {
    if (this.state.source === "I") {
      this.props.getPatientInsurance({
        uri: "/patientRegistration/getPatientInsurance",
        module: "frontDesk",
        method: "GET",
        data: {
          source: this.state.source,
          ip_id: this.state.ip_id,
        },
        redux: {
          type: "EXIT_INSURANCE_GET_DATA",
          mappingName: "existinginsurance",
        },
        afterSuccess: (data) => {
          this.setState({
            insured: data[0].insurance_yesno,
            primary_insurance_provider_id: data[0].insurance_provider_id,
            primary_network_office_id:
              data[0].hims_d_insurance_network_office_id,
            primary_network_id: data[0].network_id,
            sec_insured: data[0].sec_insured,
            secondary_insurance_provider_id:
              data[0].secondary_insurance_provider_id,
            secondary_network_id: data[0].secondary_network_id,
            secondary_network_office_id: data[0].secondary_network_office_id,
          });
        },
      });
    } else {
      this.props.getPatientInsurance({
        uri: "/patientRegistration/getPatientInsurance",
        module: "frontDesk",
        method: "GET",
        data: {
          patient_id: this.state.patient_id,
          patient_visit_id: this.state.visit_id,
        },
        redux: {
          type: "EXIT_INSURANCE_GET_DATA",
          mappingName: "existinginsurance",
        },
        afterSuccess: (data) => {
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
              secondary_network_office_id: data[0].secondary_network_office_id,
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
              secondary_network_office_id: null,
            });
          }
        },
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let Location_name =
      this.props.inventorylocations !== undefined &&
      this.props.inventorylocations.length > 0
        ? _.filter(this.props.inventorylocations, (f) => {
            return (
              f.hims_d_inventory_location_id === nextProps.inventory_location_id
            );
          })
        : [];

    if (
      nextProps.existinginsurance !== undefined &&
      nextProps.existinginsurance.length !== 0
    ) {
      let output = nextProps.existinginsurance[0];
      output.insured = this.state.source === "I" ? output.insurance_yesno : "Y";
      output.approval_amt = nextProps.approval_amt;
      output.approval_limit_yesno = nextProps.approval_limit_yesno;
      output.preserviceInput = [];
      if (Location_name.length > 0) {
        output.inventory_location_id = nextProps.inventory_location_id;
        output.location_name = Location_name[0].location_description;
        output.location_type = Location_name[0].location_type;
      }
      this.setState({ ...output });
    } else {
      if (Location_name.length > 0) {
        this.setState({
          inventory_location_id: nextProps.inventory_location_id,
          location_name: Location_name[0].location_description,
          location_type: Location_name[0].location_type,
          insured: "N",
        });
      }
    }
  }

  onClose = (e) => {
    const { current_patient, visit_id } = Window.global;
    this.setState(
      {
        s_service_type: null,
        s_service: null,
        selectedLang: "en",

        patient_id: current_patient, //Window.global["current_patient"],
        visit_id: visit_id, //Window.global["visit_id"],
        doctor_id: null,
        vat_applicable: this.props.vat_applicable,

        orderconsumabledata: [],
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
        addNew: false,
        patient_payable: null,
        company_payble: null,
        sec_company_paybale: null,
        sub_total_amount: null,
        discount_amount: null,
        net_total: null,
        item_notchargable: "N",
        instructions: null,
        itemchargable: false,
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };
  render() {
    return (
      <div className="hptl-phase1-ordering-services-form">
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this),
          }}
          title="Order Consumable"
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
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Location Name",
                    }}
                  />
                  <h6>
                    {this.state.location_name
                      ? this.state.location_name
                      : "Location Name"}
                  </h6>
                </div>
                <AlgaehAutoSearch
                  div={{ className: "col AlgaehAutoSearch" }}
                  label={{ forceLabel: "Search Consumables" }}
                  title="Search Consumables"
                  id="service_id_search"
                  template={({
                    item_description,
                    barcode,
                    expirydt,
                    qtyhand,
                    covered,
                    pre_approval,
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
                      <section className="resultSecStyles">
                        <div className={`row resultSecStyles ${properStyle}`}>
                          <div className="col">
                            <h4 className="title">
                              {_.startCase(_.toLower(item_description))}
                            </h4>
                            <p className="searchMoreDetails">
                              <span>
                                Barcode:
                                <b>
                                  {barcode === null ? "No Barcode" : barcode}
                                </b>
                              </span>
                              <span>
                                Expiry Date:
                                <b>
                                  {expirydt === null ? "No Expiry" : expirydt}
                                </b>
                              </span>
                              <span>
                                Qty in Hand:
                                <b>{qtyhand}</b>
                              </span>
                              <span>
                                Covered:
                                <b>{covered === "Y" ? "Yes" : "No"}</b>
                              </span>
                              <span>
                                Pre Approval:
                                <b>{pre_approval === "Y" ? "Yes" : "No"}</b>
                              </span>
                            </p>
                          </div>
                        </div>
                      </section>
                    );
                  }}
                  name="item_id"
                  columns={spotlightSearch.Items.InvItems}
                  displayField="item_description"
                  value={this.state.item_description}
                  extraParameters={{
                    insurance_id: this.state.insurance_provider_id,
                    inventory_location_id: this.state.inventory_location_id,
                  }}
                  searchName="insitemmaster"
                  onClick={selectItemHandeler.bind(this, this)}
                  ref={(attReg) => {
                    this.attReg = attReg;
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Instructions",
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "instructions",
                    value: this.state.instructions,
                    events: {
                      onChange: texthandle.bind(this, this),
                    },
                  }}
                />

                <div
                  className="customCheckbox col-2"
                  style={{ border: "none", marginTop: "19px" }}
                >
                  <label className="checkbox" style={{ color: "#212529" }}>
                    <input
                      type="checkbox"
                      name="item_notchargable"
                      checked={this.state.itemchargable}
                      onChange={ItemChargable.bind(this, this)}
                    />
                    <span style={{ fontSize: "0.8rem" }}>Not Chargable</span>
                  </label>
                </div>

                <div className="col-2">
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 20 }}
                    onClick={ProcessService.bind(this, this)}
                    disabled={this.state.addNewService}
                  >
                    Add to List
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-10 col-lg-12" id="doctorOrder">
                  <AlgaehDataGrid
                    id="Services_Ordering"
                    columns={[
                      {
                        fieldName: "actions",
                        label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                        displayTemplate: (row) => {
                          return (
                            <span>
                              <i
                                onClick={deleteServices.bind(this, this, row)}
                                className="fas fa-trash-alt"
                              />
                            </span>
                          );
                        },
                      },
                      {
                        fieldName: "service_type",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "service_type_id" }}
                          />
                        ),
                      },

                      {
                        fieldName: "service_name",
                        label: (
                          <AlgaehLabel label={{ fieldName: "services_id" }} />
                        ),
                        others: {
                          minWidth: 250,
                        },
                      },
                      {
                        fieldName: "instructions",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Instructions" }} />
                        ),
                      },
                      {
                        fieldName: "batchno",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                        ),
                        others: {
                          minWidth: 200,
                        },
                        disabled: true,
                      },
                      {
                        fieldName: "expirydt",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                        ),
                        disabled: true,
                      },
                      {
                        fieldName: "unit_cost",
                        label: (
                          <AlgaehLabel label={{ fieldName: "unit_cost" }} />
                        ),
                        disabled: true,
                      },
                      {
                        fieldName: "quantity",
                        label: (
                          <AlgaehLabel label={{ fieldName: "quantity" }} />
                        ),
                        disabled: true,
                      },

                      {
                        fieldName: "gross_amount",
                        label: (
                          <AlgaehLabel label={{ fieldName: "gross_amount" }} />
                        ),
                        disabled: true,
                        others: {
                          minWidth: 90,
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
                                  ),
                                },
                                others: {
                                  disabled:
                                    this.state.insured === "Y" ? true : false,
                                  onBlur: makeZeroIngrid.bind(this, this, row),
                                },
                              }}
                            />
                          );
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
                                  ),
                                },
                                others: {
                                  disabled:
                                    this.state.insured === "Y" ? true : false,
                                  onBlur: makeZeroIngrid.bind(this, this, row),
                                },
                              }}
                            />
                          );
                        },
                      },

                      {
                        fieldName: "net_amout",
                        label: (
                          <AlgaehLabel label={{ fieldName: "net_amout" }} />
                        ),
                        disabled: true,
                      },
                      {
                        fieldName: "insurance_yesno",
                        label: (
                          <AlgaehLabel label={{ fieldName: "insurance" }} />
                        ),
                        displayTemplate: (row) => {
                          return row.insurance_yesno === "Y"
                            ? "Covered"
                            : "Not Covered";
                        },
                        editorTemplate: (row) => {
                          return row.insurance_yesno === "Y"
                            ? "Covered"
                            : "Not Covered";
                        },
                      },
                      {
                        fieldName: "pre_approval",
                        label: (
                          <AlgaehLabel label={{ fieldName: "pre_approval" }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.pre_approval === "Y"
                                ? "Required"
                                : "Not Required"}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <span>
                              {row.pre_approval === "Y"
                                ? "Required"
                                : "Not Required"}
                            </span>
                          );
                        },
                      },
                      {
                        fieldName: "total_tax",
                        label: (
                          <AlgaehLabel label={{ fieldName: "total_tax" }} />
                        ),
                        disabled: true,
                      },
                      {
                        fieldName: "patient_payable",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "patient_payable" }}
                          />
                        ),
                        disabled: true,
                      },
                      {
                        fieldName: "company_payble",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "company_payble" }}
                          />
                        ),
                        disabled: true,
                      },
                    ]}
                    keyId="service_type_id"
                    dataSource={{
                      data: this.state.orderconsumabledata,
                    }}
                    // isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    byForceEvents={true}
                    events={{
                      onDelete: deleteServices.bind(this, this),
                      onEdit: EditGrid.bind(this, this),
                      onCancel: EditGrid.bind(this, this),
                      onDone: updateBillDetail.bind(this, this),
                    }}
                  />
                </div>
              </div>

              <div className="row GridTotalDetails">
                <div className="col-lg-5" style={{ textAlign: "right" }}>
                  <div className="row">
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "sub_ttl",
                        }}
                      />
                      <h5>{GetAmountFormart(this.state.sub_total_amount)}</h5>
                    </div>
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "dsct_amt",
                        }}
                      />
                      <h5>{GetAmountFormart(this.state.discount_amount)}</h5>
                    </div>

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "net_ttl",
                        }}
                      />
                      <h5>{GetAmountFormart(this.state.net_total)}</h5>
                    </div>
                  </div>
                </div>

                <div className="col-lg-7">
                  <div className="row">
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "pat_payable",
                        }}
                      />
                      <h5>{GetAmountFormart(this.state.patient_payable)}</h5>
                    </div>
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "co_payable",
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
                      <button
                        className="btn btn-primary"
                        onClick={SaveOrdersServices.bind(this, this)}
                        disabled={this.state.saved}
                      >
                        Save
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
    orderservices: state.orderservices,
    existinginsurance: state.existinginsurance,
    serviceslist: state.serviceslist,
    orderedList: state.orderedList,
    inventorylocations: state.inventorylocations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      generateBill: AlgaehActions,
      getPatientInsurance: AlgaehActions,
      billingCalculations: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OrderConsumables)
);
