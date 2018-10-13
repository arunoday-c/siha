import React, { Component } from "react";
import "./appointment_rooms.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import moment from "moment";
import GlobalVariables from "../../../utils/GlobalVariables.json";

class AppointmentRooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmentRooms: [],
      description: "",
      description_error: false,
      description_error_text: ""
    };
    this.baseState = this.state;
  }

  deleteApptRooms(data) {
    swal({
      title: "Are you sure you want to delete this Room?",
      type: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        algaehApiCall({
          uri: "/appointment/updateAppointmentRoom",
          data: {
            record_status: "I",
            hims_d_appointment_room_id: data.hims_d_appointment_room_id,
            description: data.description,
            room_active: data.room_active
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getAppointmentRooms();
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
          type: "success"
        });
      }
    });
  }

  updateApptRooms(data) {
    algaehApiCall({
      uri: "/appointment/updateAppointmentRoom",
      method: "PUT",
      data: {
        record_status: "A",
        hims_d_appointment_room_id: data.hims_d_appointment_room_id,
        description: data.description,
        room_active: data.room_active
      },
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });

          this.getAppointmentRooms();
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
    this.getAppointmentRooms();
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

  getAppointmentRooms() {
    algaehApiCall({
      uri: "/appointment/getAppointmentRoom",
      method: "GET",
      data: {},
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ appointmentRooms: response.data.records });
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

  addAppointmentRooms(e) {
    e.preventDefault();

    if (this.state.description.length === 0) {
      this.setState({
        description_error: true,
        description_error_text: "Description cannot be empty"
      });
    } else {
      algaehApiCall({
        uri: "/appointment/addAppointmentRoom",
        method: "POST",
        data: {
          description: this.state.description
        },
        onSuccess: response => {
          if (response.data.success) {
            swalMessage({
              title: "Record added successfully",
              type: "success"
            });
            this.resetState();
            this.getAppointmentRooms();
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
  }

  render() {
    return (
      <div className="appointment_rooms">
        <div className="col-lg-12">
          <div className="row">
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

            <div className="col-lg-3 margin-top-15">
              <button
                onClick={this.addAppointmentRooms.bind(this)}
                type="button"
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>
          <div className="form-details">
            <AlgaehDataGrid
              id="appt-room-grid"
              columns={[
                {
                  fieldName: "description",
                  label: <AlgaehLabel label={{ fieldName: "description" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{}}
                        textBox={{
                          value: row.description,
                          className: "txt-fld",
                          name: "description",
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          }
                        }}
                      />
                    );
                  }
                },

                {
                  fieldName: "created_by",
                  label: <AlgaehLabel label={{ fieldName: "created_by" }} />,
                  displayTemplate: row => {
                    let display =
                      this.props.userdrtails === undefined
                        ? []
                        : this.props.userdrtails.filter(
                            f => f.algaeh_d_app_user_id === row.created_by
                          );

                    return (
                      <span>
                        {display !== null && display.length !== 0
                          ? display[0].user_displayname
                          : ""}
                      </span>
                    );
                  },
                  disabled: true
                },
                {
                  fieldName: "created_date",
                  label: <AlgaehLabel label={{ fieldName: "created_date" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {moment(row.created_date).format("DD-MM-YYYY")}
                      </span>
                    );
                  },
                  disabled: true
                },
                {
                  fieldName: "room_active",
                  label: <AlgaehLabel label={{ fieldName: "room_status" }} />,
                  displayTemplate: row => {
                    return row.room_active === "Y" ? "Active" : "Inactive";
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{}}
                        selector={{
                          name: "room_active",
                          className: "select-fld",
                          value: row.room_active,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.FORMAT_ACT_INACT
                          },
                          onChange: this.changeGridEditors.bind(this, row)
                        }}
                      />
                    );
                  }
                }
              ]}
              keyId="hims_d_appointment_room_id"
              dataSource={{
                data: this.state.appointmentRooms
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteApptRooms.bind(this),
                onDone: this.updateApptRooms.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AppointmentRooms;
