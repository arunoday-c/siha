import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../actions/algaehActions";
import "./PatientVisitDetails.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import MyContext from "../../../utils/MyContext.js";
import { BillSearch } from "./PatientVisitDetailsEvent";
import moment from "moment";
import Enumerable from "linq";
class PatientVisitDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.BillingIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
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

    if (
      this.props.opcacelproviders === undefined ||
      this.props.opcacelproviders.length === 0
    ) {
      this.props.getProviderDetails({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",
        redux: {
          type: "DOCTOR_GET_DATA",
          mappingName: "opcacelproviders"
        },
        afterSuccess: data => {
          this.setState({
            doctors: data
          });
        }
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.BillingIOputs);
  }

  render() {
    let provider_name = null;
    if (this.state.incharge_or_provider !== null) {
      provider_name = Enumerable.from(this.props.opcacelproviders)
        .where(w => w.hims_d_employee_id === this.state.incharge_or_provider)
        .select(s => s.full_name)
        .firstOrDefault();
    }

    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-display-patient-form">
              <div
                className="row inner-top-search"
                style={{ paddingTop: 10, paddingBottom: 10 }}
              >
                {/* Patient code */}


                <div
                  className="col-3 globalSearchCntr"
                  style={{
                    cursor: "pointer",
                    pointerEvents:
                      this.state.Billexists === true
                        ? "none"
                        : this.state.patient_code
                          ? "none"
                          : ""
                  }}
                >
                  <AlgaehLabel label={{ fieldName: "bill_number" }} />
                  <h6 onClick={BillSearch.bind(this, this, context)}>
                    {this.state.bill_number
                      ? this.state.bill_number
                      : <AlgaehLabel label={{ fieldName: "bill_number" }} />}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>

                <div className="col-lg-9">
                  <div className="row">
                    <div className="col">
                      <AlgaehLabel label={{ fieldName: "bill_date" }} />
                      <h6>
                        {this.state.bill_date
                          ? moment(this.state.bill_date).format("DD-MM-YYYY")
                          : "--------"}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel label={{ fieldName: "visit_code" }} />
                      <h6>
                        {this.state.visit_code
                          ? this.state.visit_code
                          : "--------"}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel
                        label={{ fieldName: "incharge_or_provider" }}
                      />
                      <h6>{provider_name ? provider_name : "--------"}</h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel label={{ fieldName: "patient_code" }} />
                      <h6>
                        {this.state.patient_code
                          ? this.state.patient_code
                          : "--------"}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "full_name"
                        }}
                      />
                      <h6>
                        {this.state.full_name
                          ? this.state.full_name
                          : "--------"}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "patient_type"
                        }}
                      />
                      <h6>
                        {this.state.patient_type
                          ? this.state.patient_type
                          : "--------"}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "mode_of_pay"
                        }}
                      />
                      <h6>
                        {this.state.mode_of_pay
                          ? this.state.mode_of_pay
                          : "--------"}
                      </h6>
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
    patienttype: state.patienttype,
    opcacelproviders: state.opcacelproviders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientType: AlgaehActions,
      getProviderDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientVisitDetails)
);
