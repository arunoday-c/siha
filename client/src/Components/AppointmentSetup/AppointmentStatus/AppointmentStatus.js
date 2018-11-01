import React, { Component } from "react";
import "./appointment_status.css";
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

class AppointmentStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmentStatus: [],
      color_code: "#FFFFFF",
      description: "",
      default_status: "N"
    };

    this.baseState = this.state;
  }

  refreshState() {
    this.setState({ ...this.state });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    this.refreshState();
  }

  resetState() {
    this.setState(this.baseState);
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value });
  }

  authorizeApptStatus() {
    swal({
      title:
        "Are you sure you want to authorize the Status for Appointment set?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        // algaehApiCall({
        //   uri: "/appointment/updateAppointmentStatus",
        //   data: {
        //     hims_d_appointment_status_id: data.hims_d_appointment_status_id,
        //     color_code: data.color_code,
        //     description: data.description,
        //     default_status: data.default_status,
        //     record_status: "I"
        //   },
        //   method: "PUT",
        //   onSuccess: response => {
        //     if (response.data.success) {
        //       swalMessage({
        //         title: "Record deleted successfully . .",
        //         type: "success"
        //       });
        //       this.getAppointmentStatus();
        //     }
        //   },
        //   onFailure: error => {
        //     swalMessage({
        //       title: error.message,
        //       type: "error"
        //     });
        //   }
        // });

        swalMessage({
          title: "Authorized Successful",
          type: "success"
        });
      } else {
        swalMessage({
          title: "Not authorized",
          type: "error"
        });
      }
    });
  }

  deleteAppointmentStatus(data) {
    swal({
      title: "Are you sure you want to delete this Status?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/appointment/updateAppointmentStatus",
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
      data: {
        hims_d_appointment_status_id: data.hims_d_appointment_status_id,
        color_code: data.color_code,
        description: data.description,
        default_status: data.default_status,
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
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getAppointmentStatus() {
    algaehApiCall({
      uri: "/appointment/getAppointmentStatus",
      method: "GET",
      data: {},
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ appointmentStatus: response.data.records });
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
      //querySelector: "", //"data-validate='InsuranceProvider'", //if require section level
      alertTypeIcon: "warning", // error icon
      onCatch: value => {
        //alert(value);
      },
      onSuccess: () => {
        algaehApiCall({
          uri: "/appointment/addAppointmentStatus",
          method: "POST",
          data: {
            color_code: this.state.color_code,
            description: this.state.description,
            default_status: this.state.default_status
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
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
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
                  checkvalidation: "#ffffff",
                  errormessage: "Please Select a color"
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-3" }}
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

            <div className="col-lg-3">
              <button
                style={{ marginTop: 21 }}
                onClick={this.addAppointmentStatus.bind(this)}
                type="button"
                className="btn btn-primary"
              >
                Add to List
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
                    fieldName: "description",
                    label: <AlgaehLabel label={{ fieldName: "description" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          textBox={{
                            className: "txt-fld",
                            name: "description",
                            value: row.description,
                            events: {
                              onChange: this.changeGridEditors.bind(this, row)
                            },
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
                    fieldName: "default_status",
                    label: (
                      <AlgaehLabel label={{ fieldName: "default_status" }} />
                    ),
                    displayTemplate: row => {
                      return row.default_status === "Y"
                        ? "Yes"
                        : row.default_status === "N"
                          ? "No"
                          : "Create Visit";
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
                    label: "Steps"
                  },
                  {
                    fieldName: "authorized",
                    label: "Authorized",
                    disabled: true,
                    displayTemplate: row => {
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
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onEdit: () => {},
                  onDelete: this.deleteAppointmentStatus.bind(this),
                  onDone: this.updateAppointmentStatus.bind(this)
                }}
              />
            </div>
            <div className="col-lg-12" style={{ textAlign: "right" }}>
              <button
                onClick={this.authorizeApptStatus.bind(this)}
                style={{ margin: "10px 0" }}
                className="btn btn-primary"
              >
                Authorize
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AppointmentStatus;
