import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import IconButton from "@material-ui/core/IconButton";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  Tooltip
} from "../../../Wrapper/algaehWrapper";

import {
  texthandle,
  ProcessService,
  deleteServices,
  SaveOrdersServices
} from "./OrderMedicationEvents";
import "./OrderMedication.css";
import "../../../../styles/site.css";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { getCookie } from "../../../../utils/algaehApiCall";

class OrderMedication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      s_service_type: null,
      s_service: null,
      selectedLang: "en",

      patient_id: Window.global["current_patient"],
      visit_id: Window.global["visit_id"],
      doctor_id: null,

      // patient_id: Window.global["current_patient"],
      //   episode_id: Window.global["episode_id"]

      insured: null,
      insurance_provider_id: null,
      hims_d_insurance_network_office_id: null,
      sub_insurance_provider_id: null,
      policy_number: null,
      network_id: null,
      sec_insured: null,
      secondary_insurance_provider_id: null,
      sec_sub_insurance_provider_id: null,
      sec_policy_number: null,
      secondary_network_id: null,
      secondary_network_office_id: null,
      orderservicesdata: [],
      approval_amt: 0,
      preapp_limit_amount: 0,
      preserviceInput: [],
      dummy_company_payble: 0,
      approval_limit_yesno: "N",
      insurance_service_name: null,
      saved: false
    };
  }

  playclick() {
    debugger;
  }

  render() {
    let orderedList =
      this.state.orderservicesdata === undefined
        ? [{}]
        : this.state.orderservicesdata;

    return (
      <div className="hptl-phase1-order-medication-form">
        <div className="col-lg-12">
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{ forceLabel: "Item Name" }}
              selector={{
                name: "diet_id",
                className: "select-fld",
                value: this.state.diet_id,
                dataSource: {
                  textField: "hims_d_diet_description",
                  valueField: "hims_d_diet_master_id",
                  data: this.props.dietmaster
                },
                onChange: texthandle.bind(this, this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{ forceLabel: "Frequency" }}
              selector={{
                name: "diet_id",
                className: "select-fld",
                value: this.state.diet_id,
                dataSource: {
                  textField: "hims_d_diet_description",
                  valueField: "hims_d_diet_master_id",
                  data: this.props.dietmaster
                },
                onChange: texthandle.bind(this, this)
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "No.Of Days"
              }}
              textBox={{
                className: "txt-fld",
                name: "followup_comments",
                value: this.state.followup_comments,
                events: {
                  onChange: texthandle.bind(this, this)
                }
              }}
            />

            <div className="col-lg-1">
              <Tooltip id="tooltip-icon" title="Process">
                <IconButton className="go-button" color="primary">
                  <PlayCircleFilled onClick={ProcessService.bind(this, this)} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row">
              <AlgaehDataGrid
                id="Order_Medication"
                columns={[
                  {
                    fieldName: "service_type_id",
                    label: <AlgaehLabel label={{ forceLabel: "Item Name" }} />,
                    displayTemplate: row => {
                      let display =
                        this.props.servicetype === undefined
                          ? []
                          : this.props.servicetype.filter(
                              f =>
                                f.hims_d_service_type_id === row.service_type_id
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
                    disabled: true
                  },

                  {
                    fieldName: "services_id",
                    label: <AlgaehLabel label={{ forceLabel: "Frequency" }} />,
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
                    disabled: true
                  },
                  {
                    fieldName: "quantity",
                    label: <AlgaehLabel label={{ forceLabel: "No.Of Days" }} />
                  }
                ]}
                keyId="item_id"
                dataSource={{
                  data: orderedList
                }}
                // isEditable={true}
                paging={{ page: 0, rowsPerPage: 3 }}
                events={{
                  onDelete: deleteServices.bind(this, this),
                  onEdit: row => {}
                  // onDone: this.updateBillDetail.bind(this)
                }}
              />
            </div>
          </div>
        </div>
        <div
          className="container-fluid"
          style={{ marginBottom: "1vh", marginTop: "1vh" }}
        >
          <div className="row" position="fixed">
            <div className="col-lg-12">
              <span className="float-right">
                <button
                  style={{ marginRight: "15px" }}
                  className="htpl1-phase1-btn-primary"
                  onClick={SaveOrdersServices.bind(this, this)}
                  disabled={this.state.saved}
                >
                  <AlgaehLabel label={{ fieldName: "btnsave" }} />
                </button>
              </span>
            </div>
          </div>
        </div>
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
    serviceslist: state.serviceslist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServiceTypes: AlgaehActions,
      getServices: AlgaehActions,
      generateBill: AlgaehActions,
      getPatientInsurance: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderMedication)
);
