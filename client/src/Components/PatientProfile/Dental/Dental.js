import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./Dental.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehModalPopUp,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import moment from "moment";

let teeth = [];
let my_send_obj = {};

class Dental extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDentalModal: false,
      standard_fee: 0,
      procedures: [],
      consult_date: new Date(),
      treatements: [],
      dentalTreatments: []
    };
    this.getProcedures();
    this.getTreatementPlans();
  }

  clearSaveState() {
    this.setState({
      plan_name: "",
      remarks: "",
      consult_date: new Date()
    });
  }

  getProcedures() {
    algaehApiCall({
      uri: "/serviceType/getService",
      data: {
        procedure_type: "DN"
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            procedures: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
      standard_fee: value.selected.standard_fee
    });
  }

  textHandle(e) {
    switch (e.target.name) {
      case "quantity":
        this.setState({
          [e.target.name]: e.target.value,
          total_price: e.target.value * this.state.standard_fee
        });

        break;

      default:
        this.setState({
          [e.target.name]: e.target.value
        });
        break;
    }
  }

  markAllSurface(e) {
    debugger;
  }

  getTreatementPlans() {
    algaehApiCall({
      uri: "/dental/getTreatmentPlan",
      method: "GET",
      data: {
        episode_id: Window.global["episode_id"]
      },
      onSuccess: response => {
        if (response.data.records) {
          this.setState({
            treatements: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  markTeethSurface(e) {
    e.currentTarget.classList.contains("mark-active")
      ? e.currentTarget.classList.remove("mark-active")
      : e.currentTarget.classList.add("mark-active");

    let my_obj = {
      teeth_number: parseInt(
        e.currentTarget.parentElement.previousElementSibling.innerText,
        10
      ),
      surface: e.currentTarget.innerText.toString()
    };

    let my_item = Enumerable.from(teeth)
      .where(
        w =>
          w.teeth_number === my_obj.teeth_number && w.surface === my_obj.surface
      )
      .firstOrDefault();

    if (my_item !== undefined) {
      teeth.splice(teeth.indexOf(my_item), 1);
      // console.log("Teeth Selected", teeth);
    } else {
      teeth.push(my_obj);
      // console.log("Teeth Selected", teeth);
    }

    let send_teeth = Enumerable.from(teeth)
      .groupBy("$.teeth_number", null, (k, g) => {
        let teeth = Enumerable.from(g.getSource()).firstOrDefault()
          .teeth_number;
        return {
          teeth_number: teeth,
          details: g.getSource()
        };
      })
      .toArray();

    my_send_obj = {
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"],
      treatment_plan_id: this.state.hims_f_treatment_plan_id,
      service_id: this.state.hims_d_services_id,
      scheduled_date: this.state.scheduled_date,
      treatment_status: "PL"
    };

    my_send_obj.send_teeth = send_teeth;
    //console.log("Send Teeth", JSON.stringify(my_send_obj));

    this.setState(
      {
        quantity: send_teeth.length
      },
      () => {
        this.setState({
          total_price: this.state.quantity * this.state.standard_fee
        });
      }
    );
  }

  addDentalPlan() {
    AlgaehValidation({
      querySelector: "data-validate='addDentalPlanDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/dental/addDentalTreatment",
          method: "POST",
          data: my_send_obj,
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Added Successfully",
                type: "success"
              });
            }
          },
          onError: error => {
            swalMessage({
              title: error.message,
              type: "success"
            });
          }
        });
      }
    });
  }

  addTreatementPlan() {
    AlgaehValidation({
      querySelector: "data-validate='addTreatementDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/dental/addTreatmentPlan",
          method: "POST",
          data: {
            plan_name: this.state.plan_name,
            patient_id: Window.global["current_patient"],
            episode_id: Window.global["episode_id"],
            visit_id: Window.global["visit_id"],
            remarks: this.state.remarks,
            consult_date: this.state.consult_date
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Added Successfully",
                type: "success"
              });
              this.clearSaveState();
              this.getTreatementPlans();
            }
          },
          onError: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  generateToothUpperLeftSet() {
    let plot = [];
    for (let i = 1; i < 9; i++) {
      plot.push(
        <div
          key={i}
          className={
            "col tooth-sec up-side " +
            (i <= 3
              ? "molar-up-"
              : i <= 5
              ? "premolar-up-"
              : i === 6
              ? "canine-up-"
              : "incisors-up-up-") +
            i
          }
        >
          <span>{i}</span>
          <div className="surface-Marking">
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="top-surface"
            >
              <span>D</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="right-surface"
            >
              <span>L</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="bottom-surface"
            >
              <span>I</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="left-surface"
            >
              <span>P</span>
            </div>
            {i >= 6 ? null : (
              <div
                onClick={this.markTeethSurface.bind(this)}
                className="middle-surface"
              >
                <span>M</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return plot;
  }
  generateToothUpperRightSet() {
    let plot = [];
    for (let i = 9; i < 17; i++) {
      plot.push(
        <div
          key={i}
          className={
            "col tooth-sec up-side " +
            (i <= 10
              ? "incisors-up-up-"
              : i === 11
              ? "canine-up-"
              : i <= 13
              ? "premolar-up-"
              : "i molar-up-") +
            i
          }
        >
          <span>{i}</span>
          <div className="surface-Marking">
            <div
              surface="distal='Y'"
              onClick={this.markTeethSurface.bind(this)}
              className="top-surface"
            >
              <span>D</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="right-surface"
            >
              <span>L</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="bottom-surface"
            >
              <span>I</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="left-surface"
            >
              <span>P</span>
            </div>
            {i >= 12 ? (
              <div
                onClick={this.markTeethSurface.bind(this)}
                className="middle-surface"
              >
                <span>M</span>
              </div>
            ) : null}
          </div>
        </div>
      );
    }
    return plot;
  }

  generateToothLowerLeftSet() {
    let plot = [];
    let counter = 1;

    for (let i = 32; i >= 25; i--) {
      plot.push(
        <div
          onClick={this.markAllSurface.bind(this)}
          key={i}
          className={
            "col tooth-sec down-side " +
            (counter <= 3
              ? "molar-down-"
              : counter <= 5
              ? "premolar-down-"
              : counter === 6
              ? "canine-down-"
              : "incisors-down-") +
            counter
          }
        >
          <span>{i}</span>
          <div className="surface-Marking">
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="top-surface"
            >
              <span>D</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="right-surface"
            >
              <span>L</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="bottom-surface"
            >
              <span>I</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="left-surface"
            >
              <span>P</span>
            </div>
            {counter >= 6 ? null : (
              <div
                onClick={this.markTeethSurface.bind(this)}
                className="middle-surface"
              >
                <span>M</span>
              </div>
            )}
          </div>
        </div>
      );
      counter++;
    }
    return plot;
  }

  getTreatementsGrid(data) {
    debugger;

    algaehApiCall({
      uri: "/dental/getDentalTreatment",
      data: {
        treatment_plan_id: data.hims_f_treatment_plan_id
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            dentalTreatments: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });

    return (
      <div className="col-lg-12">
        <AlgaehDataGrid
          id="shift-grid"
          datavalidate="data-validate='shiftDiv'"
          columns={[
            {
              fieldName: "actions",
              label: "Actions",
              displayTemplate: row => {
                return (
                  <span
                    onClick={() => {
                      this.setState({
                        openDentalModal: true
                      });
                    }}
                  >
                    <i className="fas fa-trash" />
                  </span>
                );
              }
            },
            {
              fieldName: "teeth_number",
              label: "Tooth",
              disabled: true
            },
            {
              fieldName: "distal",
              label: "Surfaces",
              displayTemplate: row => {
                return (
                  <span>
                    {row.distal === "Y" ? "D " : ""}
                    {row.incisal === "Y" ? "I " : ""}
                    {row.mesial === "Y" ? "M " : ""}
                    {row.palatal === "Y" ? "P " : ""}
                    {row.labial === "Y" ? "L " : ""}
                  </span>
                );
              }
            },
            {
              fieldName: "scheduled_date",
              label: "Date",
              displayTemplate: row => {
                return (
                  <span>{moment(row.scheduled_date).format("DD-MM-YYYY")}</span>
                );
              }
            },
            {
              fieldName: "treatment_status",
              label: "Status",
              displayTemplate: row => {
                return (
                  <span>
                    {row.treatment_status === "PL"
                      ? "Planned"
                      : row.treatment_status === "WIP"
                      ? "Work in Progress"
                      : row.treatment_status === "CP"
                      ? "Completed"
                      : null}
                  </span>
                );
              }
            }
          ]}
          keyId="algaeh_app_screens_id"
          dataSource={{
            data: this.state.dentalTreatments
          }}
          paging={{ page: 0, rowsPerPage: 5 }}
          events={{
            onEdit: () => {},
            onDelete: () => {},
            onDone: () => {}
          }}
        />
      </div>
    );
  }

  generateToothLowerRightSet() {
    let plot = [];
    let counter = 9;

    for (let i = 24; i >= 17; i--) {
      plot.push(
        <div
          key={i}
          className={
            "col tooth-sec down-side " +
            (counter <= 10
              ? "incisors-down-"
              : counter === 11
              ? "canine-down-"
              : counter < 14
              ? "premolar-down-"
              : "i molar-down-") +
            counter
          }
        >
          <span>{i}</span>
          <div className="surface-Marking">
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="top-surface"
            >
              <span>D</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="right-surface"
            >
              <span>L</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="bottom-surface"
            >
              <span>I</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="left-surface"
            >
              <span>P</span>
            </div>
            {counter >= 21 ? (
              <div
                onClick={this.markTeethSurface.bind(this)}
                className="middle-surface"
              >
                <span>M</span>
              </div>
            ) : null}
          </div>
        </div>
      );
      counter++;
    }
    return plot;
  }

  openAddModal(data) {
    this.setState({
      openDentalModal: true,
      selected_treatement_plan: data.plan_name,
      hims_f_treatment_plan_id: data.hims_f_treatment_plan_id
    });
  }

  render() {
    return (
      <div id="dentalTreatment">
        <AlgaehModalPopUp
          events={{
            onClose: () => {
              teeth = [];
              this.setState({
                openDentalModal: false,
                hims_d_services_id: null,
                quantity: 0,
                standard_fee: 0,
                total_price: 0,
                hims_f_treatment_plan_id: null
              });
            }
          }}
          openPopup={this.state.openDentalModal}
          title="Dental Plan"
        >
          <div
            className="col-lg-12 margin-bottom-15"
            data-validate="addDentalPlanDiv"
          >
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Treatment Plan",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "treatement_plan",
                  value: this.state.selected_treatement_plan,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  others: {
                    disabled: true,
                    placeholder: "Enter Treatment Name"
                  }
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Select a Procedure",
                  isImp: true
                }}
                selector={{
                  name: "hims_d_services_id",
                  className: "select-fld",
                  value: this.state.hims_d_services_id,
                  dataSource: {
                    textField: "service_name",
                    valueField: "hims_d_services_id",
                    data: this.state.procedures
                  },
                  onChange: this.dropDownHandler.bind(this)
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-1" }}
                label={{
                  forceLabel: "Unit Price",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "standard_fee",
                  value: this.state.standard_fee,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  others: {
                    disabled: true,
                    min: 0,
                    type: "number"
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-1" }}
                label={{
                  forceLabel: "Quantity",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "quantity",
                  value: this.state.quantity,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  others: {
                    min: 0,
                    type: "number"
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-1" }}
                label={{
                  forceLabel: "Total Price",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "total_price",
                  value: this.state.total_price,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  others: {
                    disabled: true,
                    min: 0,
                    type: "number"
                  }
                }}
              />

              <AlgaehDateHandler
                div={{ className: "col-lg-2" }}
                label={{ forceLabel: "Scheduled Date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "scheduled_date"
                }}
                minDate={new Date()}
                events={{
                  onChange: selectedDate => {
                    this.setState({
                      scheduled_date: selectedDate
                    });
                  }
                }}
                value={this.state.scheduled_date}
              />
            </div>
          </div>

          <div className="col-lg-12" id="dentalTreatment">
            <div className="row top-teeth-sec">
              <div className="col-lg-6 teeth-sec">
                <h6>Upper Left</h6>
                <div className="row">{this.generateToothUpperLeftSet()}</div>
              </div>
              <div className="col-lg-6 teeth-sec">
                <h6>Upper Right</h6>
                <div className="row">{this.generateToothUpperRightSet()}</div>
              </div>
            </div>

            <div className="row bottom-teeth-sec">
              <div className="col-lg-6 teeth-sec">
                <div className="row">{this.generateToothLowerLeftSet()}</div>
                <h6>Lower Left</h6>
              </div>
              <div className="col-lg-6 teeth-sec">
                <div className="row">{this.generateToothLowerRightSet()}</div>
                <h6>Lower Right</h6>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 margin-bottom-15">
              <button
                onClick={this.addDentalPlan.bind(this)}
                className="btn btn-primary"
                style={{ float: "right" }}
              >
                Add to List
              </button>
            </div>
          </div>
        </AlgaehModalPopUp>

        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title" data-validate="addTreatementDiv">
            <div className="col-lg-12 margin-bottom-15">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    forceLabel: "Treatment Plan",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "plan_name",
                    value: this.state.plan_name,
                    events: {
                      onChange: this.textHandle.bind(this)
                    },
                    others: {
                      placeholder: "Enter Treatment Name"
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-4" }}
                  label={{
                    forceLabel: "Remarks",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "remarks",
                    value: this.state.remarks,
                    events: {
                      onChange: this.textHandle.bind(this)
                    },
                    others: {
                      placeholder: "Enter Remarks"
                    }
                  }}
                />

                <AlgaehDateHandler
                  div={{ className: "col-lg-2" }}
                  label={{ forceLabel: "Consult Date", isImp: false }}
                  textBox={{
                    className: "txt-fld",
                    name: "consult_date"
                  }}
                  minDate={new Date()}
                  events={{
                    onChange: selectedDate => {
                      this.setState({
                        consult_date: selectedDate
                      });
                    }
                  }}
                  value={this.state.consult_date}
                />

                <div className="col-lg-2 margin-top-15">
                  <button
                    onClick={this.addTreatementPlan.bind(this)}
                    className="btn btn-primary"
                  >
                    Add Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="portlet-body">
            <AlgaehDataGrid
              id="shift-grid"
              datavalidate="data-validate='shiftDiv'"
              columns={[
                {
                  fieldName: "actions",
                  label: "Actions",
                  displayTemplate: row => {
                    return (
                      <div className="row">
                        <span className="col">
                          <i
                            className="fas fa-check"
                            style={{
                              pointerEvents:
                                row.approved_status === "Y" ? " none" : null,
                              opacity:
                                row.approved_status === "Y" ? "0.1" : null
                            }}
                          />

                          <i
                            style={{
                              pointerEvents:
                                row.approved_status === "Y" ? " none" : null,
                              opacity:
                                row.approved_status === "Y" ? "0.1" : null
                            }}
                            className="fas fa-times"
                          />

                          <i
                            onClick={this.openAddModal.bind(this, row)}
                            className="fas fa-plus"
                          />
                        </span>
                      </div>
                    );
                  }
                },
                {
                  fieldName: "consult_date",
                  label: "Date"
                },
                {
                  fieldName: "plan_name",
                  label: "Treatement Plan"
                },
                {
                  fieldName: "remarks",
                  label: "Remarks",
                  disabled: true
                },
                {
                  fieldName: "approved_status",
                  label: "Approval Status",
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.approved_status === "Y"
                          ? "Plan Approved"
                          : "Plan Not Approved"}
                      </span>
                    );
                  }
                },
                {
                  fieldName: "plan_status",
                  label: "Plan Status",
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.plan_status === "O"
                          ? "Open"
                          : row.plan_status === "C"
                          ? "Closed"
                          : null}
                      </span>
                    );
                  }
                }
              ]}
              keyId="algaeh_app_screens_id"
              dataSource={{
                data: this.state.treatements
              }}
              filter={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              expanded={{
                detailTemplate: row => {
                  return <div>{this.getTreatementsGrid(row)}</div>;
                }
              }}
              events={{
                onEdit: () => {},
                onDelete: () => {},
                onDone: () => {}
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_summary: state.patient_summary,
    patient_profile: state.patient_profile
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientSummary: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dental)
);
