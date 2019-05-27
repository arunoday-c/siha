import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../actions/algaehActions";

// import moment from "moment";
// import Options from "../../../../Options.json";
import {
  AlagehFormGroup,
  AlagehAutoComplete
  // AlgaehDataGrid,
  // AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import "./Referal.css";
import "../../../../styles/site.css";

import {
  texthandle,
  DeptselectedHandeler,
  addReferal,
  doctorselectedHandeler,
  radioChange
} from "./ReferalEvents";

class Referal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sub_department_id: null,
      doctor_id: null,
      referral_type: "I",
      hospital_name: null,
      reason: null,
      departments: [],
      doctors: [],
      radioInternal: true,
      radioExternal: false
    };
  }

  componentDidMount() {
    this.props.getDepartmentsandDoctors({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "DEPT_DOCTOR_GET_DATA",
        mappingName: "deptanddoctors"
      },
      afterSuccess: data => {
        this.setState({
          departments: data.departmets,
          doctors: data.doctors
        });
      }
    });
  }

  render() {
    return (
      <div className="hptl-referal-doctor-form">
        <div className="col-lg-12">
          <div className="row">
            <div className="customRadio">
              <label className="radio inline">
                <input
                  type="radio"
                  name="referral_type"
                  value="I"
                  checked={this.state.radioInternal}
                  onChange={radioChange.bind(this, this)}
                />
                <span>Internal</span>
              </label>
              <label className="radio inline">
                <input
                  type="radio"
                  name="referral_type"
                  value="E"
                  checked={this.state.radioExternal}
                  onChange={radioChange.bind(this, this)}
                />
                <span>External</span>
              </label>
            </div>
          </div>
        </div>
        <div className="row" style={{ paddingBottom: "10px" }}>
          <AlagehAutoComplete
            div={{ className: "col-lg-5" }}
            label={{
              forceLabel: "Department"
            }}
            selector={{
              name: "sub_department_id",
              className: "select-fld",
              value: this.state.sub_department_id,
              dataSource: {
                textField: "sub_department_name",
                valueField: "sub_department_id",
                data: this.state.departments
              },

              onChange: DeptselectedHandeler.bind(this, this)
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-lg-5" }}
            label={{
              forceLabel: "Doctor"
            }}
            selector={{
              name: "doctor_id",
              className: "select-fld",
              value: this.state.doctor_id,
              dataSource: {
                textField: "full_name",
                valueField: "employee_id",
                data: this.state.doctors
              },
              others: {
                disabled: this.state.radioExternal
              },

              onChange: doctorselectedHandeler.bind(this, this)
            }}
          />

          <div className="actions" style={{ paddingTop: "3.5vh" }}>
            <a
              // href="javascript"
              className="btn btn-primary btn-circle active"
              onClick={addReferal.bind(this, this)}
            >
              <i className="fas fa-plus" />
            </a>
          </div>
        </div>

        <div className="row">
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Hospital Name"
            }}
            textBox={{
              className: "txt-fld",
              name: "hospital_name",
              value: this.state.hospital_name,
              events: {
                onChange: texthandle.bind(this, this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Reason"
            }}
            textBox={{
              className: "txt-fld",
              name: "reason",
              value: this.state.reason,
              events: {
                onChange: texthandle.bind(this, this)
              }
            }}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    deptanddoctors: state.deptanddoctors
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
  )(Referal)
);
