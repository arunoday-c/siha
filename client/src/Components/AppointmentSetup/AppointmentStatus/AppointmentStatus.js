import React, { Component } from "react";
import "./appointment_status.scss";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import Enumerable from "linq";

class AppointmentStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmentStatus: [],
      color_code: "#FFFFFF",
      description: "",
      default_status: "",
      isEditable: true,
      disableAdd: null
    };

    this.baseState = this.state;
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    if (name === "description") {
      row["statusDesc"] = value
    }
    row[name] = value;
    row.update();
  }

  resetState() {
    this.setState(this.baseState);
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.name === "description") {
      this.setState({ steps: this.state.appointmentStatus.length + 1 });
    }

    if (e.target.name === "steps" && e.target.value === "1") {
      this.setState({ default_status: "Y" });
    }
  }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      this.state.default_status === "Y"
        ? this.setState({ steps: 1 })
        : this.setState({
            steps: this.state.appointmentStatus.length + 1
          });
    });
  }

  hasDuplicates(array) {
    var valuesSoFar = Object.create(null);
    for (var i = 0; i < array.length; ++i) {
      var value = array[i];
      if (value in valuesSoFar) {
        return true;
      }
      valuesSoFar[value] = true;
    }
    return false;
  }

  authorizeApptStatus() {
    this.state.appointmentStatus.length > 0
      ? swal({
          title:
            "This is a one time setup, are you sure you want to authorize the Status for Appointment set?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          confirmButtonColor: "#44b8bd",
          cancelButtonColor: "#d33",
          cancelButtonText: "No"
        }).then(willDelete => {
          if (willDelete.value) {
            this.hasDuplicates(this.state.steps_list)
              ? swalMessage({
                  title:
                    "There are repeated values, please re-check the status",
                  type: "warning",
                  timer: 5000
                })
              : algaehApiCall({
                  uri: "/appointment/appointmentStatusAuthorized",
                  module: "frontDesk",
                  method: "PUT",
                  onSuccess: response => {
                    if (response.data.success) {
                      this.setState({
                        isEditable: false
                      });
                      swalMessage({
                        title: "Status Authorized successfully . .",
                        type: "success"
                      });
                      this.getAppointmentStatus();
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
            swalMessage({
              title: "Not authorized",
              type: "error"
            });
          }
        })
      : swalMessage({
          title: "Please add the status first and then authorize"
        });
  }

  deleteAppointmentStatus(data) {
    swal({
      title: "Are you sure you want to delete this Status?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/appointment/updateAppointmentStatus",
          module: "frontDesk",
          data: {
            hims_d_appointment_status_id: data.hims_d_appointment_status_id,
            color_code: data.color_code,
            description: data.description,
            default_status: data.default_status,
            record_status: "I"
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getAppointmentStatus();
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
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  updateAppointmentStatus(data) {
    algaehApiCall({
      uri: "/appointment/updateAppointmentStatus",
      module: "frontDesk",
      data: {
        hims_d_appointment_status_id: data.hims_d_appointment_status_id,
        color_code: data.color_code,
        description: data.description,
        default_status: data.default_status,
        steps: data.steps,
        record_status: "A"
      },
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });

          this.getAppointmentStatus();
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "error"
        });
        this.getAppointmentStatus();
      }
    });
  }

  getAppointmentStatus() {
    algaehApiCall({
      uri: "/appointment/getAppointmentStatus",
      module: "frontDesk",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState(
            {
              appointmentStatus: response.data.records
            },
            () => {
              this.setState({
                //steps: this.state.appointmentStatus.length + 1,
                min_steps: this.state.appointmentStatus.length + 1
              });

              let steps_list = Enumerable.from(this.state.appointmentStatus)
                .select(w => w.steps)
                .toArray();

              this.setState({ steps_list: steps_list });

              let authCount = Enumerable.from(this.state.appointmentStatus)
                .where(w => w.authorized === "Y")
                .toArray().length;

              if (
                authCount > 0 &&
                authCount === this.state.appointmentStatus.length
              ) {
                this.setState(
                  {
                    isEditable: false,
                    disableAdd: "none"
                  },
                  () => {}
                );
              }
            }
          );
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

  componentDidMount() {
    this.getAppointmentStatus();
  }

  addAppointmentStatus(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        this.state.steps_list.includes(parseInt(this.state.steps, 10))
          ? swalMessage({
              title:
                "Order already exists please select a unique order number?",
              type: "warning"
            })
          : algaehApiCall({
              uri: "/appointment/addAppointmentStatus",
              module: "frontDesk",
              method: "POST",
              data: {
                color_code: this.state.color_code,
                description: this.state.description,
                default_status: this.state.default_status,
                steps: this.state.steps
              },
              onSuccess: response => {
                if (response.data.success) {
                  swalMessage({
                    title: "Record added successfully",
                    type: "success"
                  });

                  this.resetState();
                  this.getAppointmentStatus();
                }
              },
              onFailure: error => {}
            });
      }
    });
  }

  render() {
    return (
      <div className="appointment_status">
        <div className="col-lg-12">
          <div className="row" style={{ display: this.state.disableAdd }}>
            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
              label={{
                fieldName: "color_code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "color_code",
                value: this.state.color_code,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "color",
                  required: true,
                  checkvalidation: "$value === #ffffff",
                  errormessage: "Please Select a color"
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
              label={{
                fieldName: "description",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "description",
                value: this.state.description,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{
                fieldName: "default_status",
                isImp: true
              }}
              selector={{
                name: "default_status",
                className: "select-fld",
                value: this.state.default_status,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.FORMAT_APPT_STATUS
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-1" }}
              label={{
                fieldName: "steps",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "steps",
                value: this.state.steps,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "number",
                  disabled: true,
                  min: this.state.min_steps
                }
              }}
            />

            <div className="col-lg-2">
              <button
                style={{ marginTop: 21, pointerEvents: this.state.disableAdd }}
                onClick={this.addAppointmentStatus.bind(this)}
                type="button"
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
            <div className="col" style={{ textAlign: "right", marginTop: 21 }}>
              <button
                onClick={this.authorizeApptStatus.bind(this)}
                className="btn btn-default"
              >
                Authorize Status
              </button>
            </div>
          </div>
          <div className="row">
            <div
              className="col-lg-12"
              data-validate="apptStatusDiv"
              id="apptStatusDivCntr"
            >
              <AlgaehDataGrid
                id="appt-status-grid"
                datavalidate="data-validate='apptStatusDiv'"
                columns={[
                  {
                    fieldName: "color_code",
                    label: <AlgaehLabel label={{ fieldName: "color_code" }} />,
                    displayTemplate: row => {
                      return (
                        <div
                          className="col"
                          style={{
                            backgroundColor: "" + row.color_code,
                            height: "20px",
                            margin: "auto"
                          }}
                        />
                      );
                    },
                    editorTemplate: row => {
                      return (
                        <div className="row">
                          <AlagehFormGroup
                            div={{ className: "col-lg-11" }}
                            textBox={{
                              className: "txt-fld",
                              name: "color_code",
                              value: row.color_code,
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              },
                              others: {
                                type: "color",
                                checkvalidation: "#ffffff",
                                errormessage: "Please Select a color",
                                required: true
                              }
                            }}
                          />
                        </div>
                      );
                    }
                  },
                  {
                    fieldName: "statusDesc",
                    label: <AlgaehLabel label={{ fieldName: "description" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          textBox={{
                            className: "txt-fld",
                            name: "description",
                            value: row.statusDesc,
                            events: {
                              onChange: this.changeGridEditors.bind(this, row)
                            },
                            others: {
                              errormessage: "Description - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "default_status",
                    label: (
                      <AlgaehLabel label={{ fieldName: "default_status" }} />
                    ),
                    displayTemplate: row => {
                      return row.default_status === "Y"
                        ? "Yes"
                        : row.default_status === "N"
                        ? "No"
                        : row.default_status === "RS"
                        ? "Re-Schedule"
                        : row.default_status === "C"
                        ? "Create Visit"
                        : "----------";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{ className: "col" }}
                          selector={{
                            name: "default_status",
                            className: "select-fld",
                            value: row.default_status,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_APPT_STATUS
                            },
                            onChange: this.changeGridEditors.bind(this, row),
                            others: {
                              errormessage: "Cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "steps",

                    label: <AlgaehLabel label={{ forceLabel: "Steps" }} />,

                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          textBox={{
                            className: "txt-fld",
                            name: "steps",
                            value: row.steps,
                            events: {
                              onChange: this.changeGridEditors.bind(this, row)
                            },
                            others: {
                              type: "number",
                              errormessage: "Cannot be blank",
                              required: true,
                              max: this.state.appointmentStatus.length,
                              min: 1
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "authorized",

                    label: <AlgaehLabel label={{ forceLabel: "Authorized" }} />,

                    disabled: false,
                    displayTemplate: row => {
                      return (
                        <span>{row.authorized === "Y" ? "Yes" : "No"}</span>
                      );
                    },
                    editorTemplate: row => {
                      return (
                        <span>{row.authorized === "Y" ? "Yes" : "No"}</span>
                      );
                    }
                  }
                ]}
                keyId="hims_d_appointment_status_id"
                dataSource={{
                  data: this.state.appointmentStatus
                }}
                isEditable={this.state.isEditable}
                filter={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onEdit: () => {},
                  onDelete:
                    this.state.disableAdd === null
                      ? this.deleteAppointmentStatus.bind(this)
                      : () => {
                          swalMessage({
                            title: "Already Authorized Cannot Edit/Delete",
                            type: "error"
                          });
                        },
                  onDone:
                    this.state.disableAdd === null
                      ? this.updateAppointmentStatus.bind(this)
                      : () => {
                          swalMessage({
                            title: "Already Authorized Cannot Edit/Delete",
                            type: "error"
                          });
                          this.getAppointmentStatus();
                        }
                }}
              />
            </div>
            {/* <div className="col-lg-12" style={{ textAlign: "right" }}>
              <button
                onClick={this.authorizeApptStatus.bind(this)}
                style={{ margin: "10px 0" }}
                className="btn btn-primary"
              >
                Authorize
              </button>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default AppointmentStatus;
