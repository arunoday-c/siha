import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import { AlgaehDataGrid } from "algaeh-react-components";
import {
  AlagehFormGroup,
  AlgaehDateHandler,
} from "../../../Wrapper/algaehWrapper";
import "./FollowUp.scss";
import "../../../../styles/site.scss";

import {
  texthandle,
  addFollowUp,
  datehandle,
  radioChange,
  dateValidate,
  getPatientFollowUps,
  updateSameFollowUp,
} from "./FollowUpEvents";

class FollowUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      followup_comments: null,
      followup_type: "OP",
      followup_days: 0,
      followup_date: null,
      patientFollowUps: [],
      radioOP: true,
      radioIP: false,
      him_f_patient_followup_id: null,
      updateFollowUp: false,
    };
  }
  componentDidMount() {
    const { visit_id } = Window.global;
    algaehApiCall({
      uri: "/doctorsWorkBench/checkFollowUPofVisit",
      method: "GET",
      data: { visit_id: visit_id },
      onSuccess: (response) => {
        if (response.data.success) {
          debugger;
          const data = response.data.records;
          if (data.length > 0) {
            this.setState(
              {
                followup_comments: data[0].reason,
                followup_type: data[0].followup_type,
                // followup_days: 0,
                him_f_patient_followup_id: data[0].him_f_patient_followup_id,
                updateFollowUp: true,
                followup_date: data[0].followup_date,
                radioOP: data[0].followup_type === "OP" ? true : false,
                radioIP: data[0].followup_type === "IP" ? true : false,
              },
              () => {
                getPatientFollowUps(this);
              }
            );
          }
        } else {
          getPatientFollowUps(this);
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
  // componentWillUnmount() {
  //   this.setState({
  //     followup_comments: null,
  //     followup_type: "OP",
  //     followup_days: 0,
  //     followup_date: null,
  //     radioOP: true,
  //     radioIP: false,
  //     patientFollowUps: [],
  //     updateFollowUp: false,
  //   });
  // }
  render() {
    return (
      <div className="hptl-follow-up-form">
        <div className="col-lg-12">
          <div className="row">
            <div className="customRadio">
              <label className="radio inline">
                <input
                  type="radio"
                  name="followup_type"
                  value="OP"
                  checked={this.state.radioOP}
                  onChange={radioChange.bind(this, this)}
                />
                <span>OP Patient</span>
              </label>
              <label className="radio inline">
                <input
                  type="radio"
                  name="followup_type"
                  value="IP"
                  checked={this.state.radioIP}
                  onChange={radioChange.bind(this, this)}
                />
                <span>IP Patient</span>
              </label>
            </div>
          </div>
        </div>
        <div className="row" style={{ paddingBottom: "10px" }}>
          <AlagehFormGroup
            div={{ className: "col-lg-12" }}
            label={{
              forceLabel: "Reason",
            }}
            textBox={{
              className: "txt-fld",
              name: "followup_comments",
              value: this.state.followup_comments,
              events: {
                onChange: texthandle.bind(this, this),
              },
            }}
          />
        </div>

        <div className="row">
          <AlagehFormGroup
            div={{ className: "col-lg-4" }}
            label={{
              forceLabel: "Next Visit After",
            }}
            textBox={{
              className: "txt-fld",
              name: "followup_days",
              value: this.state.followup_days,
              events: {
                onChange: texthandle.bind(this, this),
              },
            }}
          />
          <span style={{ paddingTop: "4vh" }}>Days</span>
          <AlgaehDateHandler
            div={{ className: "col-lg-5" }}
            label={{ forceLabel: "New Visit Date" }}
            textBox={{ className: "txt-fld", name: "followup_date" }}
            minDate={new Date()}
            events={{
              onChange: datehandle.bind(this, this),
              onBlur: dateValidate.bind(this, this),
            }}
            value={this.state.followup_date}
          />
          <div className="actions" style={{ paddingTop: "3.5vh" }}>
            {!this.state.updateFollowUp ? (
              <button
                className="btn btn-primary btn-circle active"
                onClick={addFollowUp.bind(this, this)}
              >
                <i className="fas fa-plus" />
              </button>
            ) : (
              <button
                className="btn btn-primary "
                onClick={updateSameFollowUp.bind(this, this)}
              >
                Update Follow Up
              </button>
            )}
          </div>
        </div>
        <div className="portlet-body">
          <AlgaehDataGrid
            className="PatientFollowups"
            columns={[
              {
                fieldName: "followup_type",
                label: "FollowUP type",
                sortable: true,
                displayTemplate: (row) => {
                  return row.followup_type === "OP"
                    ? "OP Patient"
                    : "IP Patient";
                },
              },
              {
                fieldName: "reason",
                label: "Reason",
                sortable: true,
              },
              {
                fieldName: "followup_date",
                label: "Follow Up date",
                sortable: true,
              },

              {
                fieldName: "employee_name",
                label: "Doctor Name",
                sortable: true,
              },
              {
                fieldName: "followup_status",
                label: "Follow up Status ",
                sortable: true,
                displayTemplate: (row) => {
                  return row.followup_status === "P" ? "Pending" : "Visited";
                },
              },
            ]}
            loading={false}
            // isEditable="onlyDelete"
            height="34vh"
            data={
              this.state.patientFollowUps ? this.state.patientFollowUps : []
            }
            rowUnique="hims_f_patient_followup_id"
            events={{}}
            others={{}}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    deptanddoctors: state.deptanddoctors,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsandDoctors: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FollowUp)
);
