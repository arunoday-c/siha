import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import {
//   PRESCRIPTION_FREQ_PERIOD,
//   PRESCRIPTION_FREQ_TIME,
//   PRESCRIPTION_FREQ_DURATION
// } from "../../../../utils/GlobalVariables.json";

import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";

import "./MedicationHistory.css";
import "../../../../styles/site.css";
import { AlgaehActions } from "../../../../actions/algaehActions";

class MedicationHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderservicesdata: []
    };
  }

  render() {
    return (
      <div className="hptl-phase1-medication-history-form">
          <div className="row">
        <div className="col-lg-12">
            <AlgaehDataGrid
              id="Order_Medication"
              columns={[
                {
                  fieldName: "quantity",
                  label: <AlgaehLabel label={{ forceLabel: "Generic Name" }} />
                },
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
                  fieldName: "quantity",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Frequency Period" }} />
                  )
                },
                {
                  fieldName: "quantity",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Frequency Duration" }} />
                  )
                },
                {
                  fieldName: "quantity",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Frequency Type" }} />
                  )
                },
                {
                  fieldName: "quantity",
                  label: <AlgaehLabel label={{ forceLabel: "Dosage" }} />
                },
                {
                  fieldName: "quantity",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Duration (Days)" }} />
                  )
                }
              ]}
              keyId="item_id"
              dataSource={{
                data: this.state.orderservicesdata
              }}
              paging={{ page: 0, rowsPerPage: 3 }}
            />
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
  )(MedicationHistory)
);
