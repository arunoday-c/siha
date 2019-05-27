import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../actions/algaehActions";

import {
  AlagehAutoComplete,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";

import "./../../../../styles/site.css";
import "./PatientDetails.css";

class PatientDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  SubmitRequest(e) {
    this.props.onClose && this.props.onClose(e);
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  componentDidMount() {
    let InputOutput = this.props.selected_services;
    this.setState({ ...this.state, ...InputOutput });

    if (
      this.props.deptanddoctors === undefined ||
      this.props.deptanddoctors.length === 0
    ) {
      this.props.getDepartmentsandDoctors({
        uri: "/department/get/get_All_Doctors_DepartmentWise",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "DEPT_DOCTOR_GET_DATA",
          mappingName: "deptanddoctors"
        }
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <h6 className="popSubHdg">Patient Details</h6>
          <div className="row">
            {/* Patient code */}
            <div className="col">
              <AlgaehLabel
                label={{
                  fieldName: "patient_code"
                }}
              />
              <h6>
                {this.state.patient_code
                  ? this.state.patient_code
                  : "Patient Code"}
              </h6>
            </div>
            <div className="col">
              <AlgaehLabel
                label={{
                  fieldName: "date"
                }}
              />
              <h6>
                {this.state.created_date
                  ? this.state.created_date
                  : "Created Date"}
              </h6>
            </div>
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                fieldName: "doctor_id"
              }}
              selector={{
                name: "doctor_id",
                className: "select-fld",
                value: this.state.doctor_id,
                dataSource: {
                  textField: "full_name",
                  valueField: "employee_id",
                  data:
                    this.props.deptanddoctors === undefined
                      ? []
                      : this.props.deptanddoctors.doctors
                },
                others: {
                  disabled: true
                },
                onChange: null
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                fieldName: "insurance_id"
              }}
              selector={{
                name: "insurance_provider_id",
                className: "select-fld",
                value: this.state.insurance_provider_id,
                dataSource: {
                  textField: "insurance_provider_name",
                  valueField: "hims_d_insurance_provider_id",
                  data:
                    this.props.insurarProviders === undefined
                      ? []
                      : this.props.insurarProviders
                },
                others: {
                  disabled: true
                },
                onChange: null
              }}
            />{" "}
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                fieldName: "department_id"
              }}
              selector={{
                name: "department_id",
                className: "select-fld",
                value: this.state.department_id,
                dataSource: {
                  textField: "insurance_provider_name",
                  valueField: "hims_d_insurance_provider_id",
                  data:
                    this.props.insurarProviders === undefined
                      ? []
                      : this.props.insurarProviders
                },
                others: {
                  disabled: true
                },
                onChange: null
              }}
            />
            <div className="col">
              <AlgaehLabel
                label={{
                  fieldName: "card_no"
                }}
              />
              <h6>{this.state.card_no ? this.state.card_no : "Card No."}</h6>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    deptanddoctors: state.deptanddoctors,
    insurarProviders: state.insurarProviders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsandDoctors: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientDetails)
);
