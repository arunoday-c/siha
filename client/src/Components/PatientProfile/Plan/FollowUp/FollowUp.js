import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../actions/algaehActions";
// import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import { AlgaehTable, AlgaehLabel } from "algaeh-react-components";
import {
  AlagehFormGroup,
  AlgaehDateHandler,
} from "../../../Wrapper/algaehWrapper";
import "./FollowUp.scss";
import "../../../../styles/site.scss";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import {
  texthandle,
  addFollowUp,
  datehandle,
  radioChange,
  dateValidate,
  getPatientFollowUps,
  updateSameFollowUp,
} from "./FollowUpEvents";
import swal from "sweetalert2";
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
    // const { visit_id } = Window.global;
    // algaehApiCall({
    //   uri: "/doctorsWorkBench/checkFollowUPofVisit",
    //   method: "GET",
    //   data: { visit_id: visit_id },
    //   onSuccess: (response) => {
    //     if (response.data.success) {
    //       const data = response.data.records;
    //       if (data.length > 0) {
    //         this.setState(
    //           {
    //             followup_comments: data[0].reason,
    //             followup_type: data[0].followup_type,
    //             // followup_days: 0,
    //             him_f_patient_followup_id: data[0].him_f_patient_followup_id,
    //             updateFollowUp: true,
    //             followup_date: data[0].followup_date,
    //             radioOP: data[0].followup_type === "OP" ? true : false,
    //             radioIP: data[0].followup_type === "IP" ? true : false,
    //           },
    //           () => {
    //         getPatientFollowUps(this);
    //       }
    //     );
    //   }
    // } else {
    getPatientFollowUps(this);
    // }
    //   },
    //   onFailure: (error) => {
    //     swalMessage({
    //       title: error.message,
    //       type: "error",
    //     });
    //   },
    // });
  }
  deleteFollowUp(row) {
    swal({
      title: "Are you Sure you want to Delete FollowUp?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willUpdate) => {
      if (willUpdate.value) {
        algaehApiCall({
          uri: "/doctorsWorkBench/deleteFollowUp",
          method: "Delete",
          data: { him_f_patient_followup_id: row.him_f_patient_followup_id },
          onSuccess: (response) => {
            if (response.data.success) {
              getPatientFollowUps(this);
              swalMessage({
                title: "Deleted Succesfully...",
                type: "success",
              });
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
        <div className="portlet-body PatientFollowups">
          <AlgaehTable
            columns={[
              {
                fieldName: "Actions",
                label: <AlgaehLabel label={{ fieldName: "Action" }} />,
                sortable: true,
                displayTemplate: (row) => {
                  return (
                    <>
                      <i
                        className="fas fa-pen"
                        onClick={() => {
                          this.setState({
                            followup_comments: row.reason,
                            followup_type: row.followup_type,
                            // followup_days: 0,
                            him_f_patient_followup_id:
                              row.him_f_patient_followup_id,
                            updateFollowUp: true,
                            followup_date: row.followup_date,
                            radioOP: row.followup_type === "OP" ? true : false,
                            radioIP: row.followup_type === "IP" ? true : false,
                          });
                        }}
                      >
                        {" "}
                      </i>
                      <i
                        className="fas fa-trash"
                        onClick={() => {
                          this.deleteFollowUp(row);
                        }}
                      >
                        {" "}
                      </i>
                    </>
                  );
                },
              },
              {
                fieldName: "followup_type",
                label: <AlgaehLabel label={{ fieldName: "Type" }} />,
                sortable: true,
                displayTemplate: (row) => {
                  return row.followup_type === "OP"
                    ? "OP Patient"
                    : "IP Patient";
                },
              },

              {
                fieldName: "reason",
                label: <AlgaehLabel label={{ fieldName: "Reason" }} />,
                sortable: true,
              },
              {
                fieldName: "followup_date",
                label: <AlgaehLabel label={{ fieldName: "Date" }} />,
                sortable: true,
              },

              {
                fieldName: "employee_name",
                label: <AlgaehLabel label={{ fieldName: "Doctor" }} />,
                sortable: true,
              },
              {
                fieldName: "followup_status",
                label: <AlgaehLabel label={{ fieldName: "Status" }} />,
                sortable: true,
                displayTemplate: (row) => {
                  return row.followup_status === "P" ? "Pending" : "Visited";
                },
              },
            ]}
            // loading={false}
            data={
              this.state.patientFollowUps ? this.state.patientFollowUps : []
            }
            rowUnique="hims_f_patient_followup_id"
            pagination={true}
            isFilterable={true}
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
