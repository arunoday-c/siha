import React, { Component } from "react";
import "./appointment_status.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";
import GlobalVariables from "../../../utils/GlobalVariables.json";

class AppointmentStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmentStatus: [],
      color_code: "#FFFFFF",
      color_code_error: false,
      color_code_error_text: "",

      description: "",
      description_error: false,
      description_error_text: "",

      default_status: "",
      default_status_error: false,
      default_status_error_text: ""
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

  deleteAppointmentStatus(data) {
    swal({
      title: "Are you sure you want to delete this Status?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
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
              swal("Record deleted successfully . .", {
                icon: "success",
                buttons: false,
                timer: 2000
              });
              this.getAppointmentStatus();
            }
          },
          onFailure: error => {
            swal(error.message, {
              buttons: false,
              icon: "danger",
              timer: 2000
            });
          }
        });
      } else {
        swal("Delete request cancelled");
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
          swal("Record updated successfully . .", {
            icon: "success",
            buttons: false,
            timer: 2000
          });
          this.getAppointmentStatus();
        }
      },
      onFailure: error => {
        swal(error.message, {
          buttons: false,
          icon: "danger",
          timer: 2000
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
        swal(error.message, {
          buttons: false,
          icon: "danger",
          timer: 2000
        });
      }
    });
  }

  componentDidMount() {
    this.getAppointmentStatus();
  }

  addAppointmentStatus(e) {
    e.preventDefault();

    if (this.state.color_code === "#FFFFFF") {
      this.setState({
        color_code_error: true,
        color_code_error_text: "Color Code cannot be empty"
      });
    } else if (this.state.description.length === 0) {
      this.setState({
        description_error: true,
        description_error_text: "Description cannot be empty"
      });
    } else if (this.state.default_status.length === 0) {
      this.setState({
        default_status_error: true,
        default_status_error_text: "Status cannot be empty"
      });
    } else {
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
            swal("Record added successfully", {
              buttons: false,
              icon: "success",
              timer: 2000
            });
            this.resetState();
            this.getAppointmentStatus();
          }
        },
        onFailure: error => {}
      });
    }
  }

  render() {
    return (
      <div className="appointment_status">
        <div className="col-lg-12">
          <div className="row">
            {/* <div className="col-lg-3">
              <div className="row">
                <div
                  className="col"
                  style={{
                    backgroundColor: "" + this.state.color_code,
                    width: "100px",
                    height: "20px",
                    margin: "auto"
                  }}
                  value={this.state.color_code}
                />
                <i
                  className="fas fa-palette col"
                  style={{ cursor: "pointer" }}
                  name="color_code"
                  onChange={this.changeTexts.bind(this)}
                />
              </div>
            </div> */}
            <div className="col-lg-3">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-lg-11" }}
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
                      type: "color"
                    },

                    error: this.state.color_code_error,
                    helperText: this.state.color_code_error_text
                  }}
                />
                <span className="color-picker-icon col-lg-1">
                  <i className="fas fa-palette" />
                </span>
              </div>
            </div>
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
                },

                error: this.state.description_error,
                helperText: this.state.description_error_text
              }}
            />
            {/* <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "default_status",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "default_status",
                value: this.state.default_status,
                events: {
                  onChange: this.changeTexts.bind(this)
                },

                error: this.state.default_status_error,
                helperText: this.state.default_status_error_text
              }}
            /> */}

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "default_status"
              }}
              selector={{
                name: "default_status",
                className: "select-fld",
                value: this.state.default_status,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.FORMAT_YESNO
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <div className="col-lg-3 margin-top-15">
              <button
                onClick={this.addAppointmentStatus.bind(this)}
                type="button"
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>
          <div className="form-details">
            <AlgaehDataGrid
              id="appt-status-grid"
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
                              type: "color"
                            },

                            error: row.color_code_error,
                            helperText: row.color_code_error_text
                          }}
                        />
                        <span className="color-picker-icon col-lg-1">
                          <i className="fas fa-palette" />
                        </span>
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
                    return row.default_status === "Y" ? "Yes" : "No";
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
                            data: GlobalVariables.FORMAT_YESNO
                          },
                          onChange: this.changeGridEditors.bind(this, row)
                        }}
                      />
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
                onDelete: this.deleteAppointmentStatus.bind(this),
                onDone: this.updateAppointmentStatus.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AppointmentStatus;
