import React, { Component } from "react";
import "./appointment_clinics.css";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";
import Enumerable from "linq";
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from "constants";

class AppointmentClinics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmentClinics: [],
      departments: [],
      doctors: [],
      appointmentRooms: [],
      description: "",
      description_error: false,
      description_error_text: ""
    };
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

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value });
  }

  // doctorDropDownHandler(value) {
  //   this.setState({ [value.name]: value.value }, () => {
  //     let doc = Enumerable.from(this.state.doctors)
  //       .where(w => w.employee_id === this.state.provider_id)
  //       .firstOrDefault();
  //     this.setState({ departments: doc.departments });
  //   });
  // }

  deptDropDownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      let dept = Enumerable.from(this.state.departments)
        .where(w => w.sub_department_id === this.state.sub_department_id)
        .firstOrDefault();
      this.setState({ doctors: dept.doctors });
    });
  }

  getApptRooms() {
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
        swal(error.message, {
          buttons: false,
          icon: "error",
          timer: 2000
        });
      }
    });
  }

  getAppointmentClinics() {
    algaehApiCall({
      uri: "/appointment/getAppointmentClinic",
      method: "GET",
      data: {},
      onSuccess: response => {
        if (response.data.success) {
          console.log("Clinics:", response.data.records);
          this.setState({ appointmentClinics: response.data.records });
        }
      },
      onFailure: error => {
        swal(error.message, {
          buttons: false,
          icon: "error",
          timer: 2000
        });
      }
    });
  }

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          console.log("DocsDepts:", response.data.records);
          this.setState({
            departments: response.data.records.departmets,
            doctors: response.data.records.doctors
          });
        }
      },
      onFailure: error => {
        swal(error.message, {
          buttons: false,
          icon: "error",
          timer: 2000
        });
      }
    });
  }

  componentDidMount() {
    this.getAppointmentClinics();
    this.getDoctorsAndDepts();
    this.getApptRooms();
  }

  deleteAppointmentClinics(data) {
    swal({
      title: "Are you sure you want to delete this Clinic?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        algaehApiCall({
          uri: "/appointment/updateAppointmentClinic",
          data: {
            record_status: "I",
            description: data.description,
            sub_department_id: data.sub_department_id,
            provider_id: data.provider_id,
            room_id: data.room_id,
            hims_d_appointment_clinic_id: data.hims_d_appointment_clinic_id
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swal("Record deleted successfully . .", {
                icon: "success",
                buttons: false,
                timer: 2000
              });
              this.getAppointmentClinics();
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

  updateAppointmentClinics(data) {
    algaehApiCall({
      uri: "/appointment/updateAppointmentClinic",
      method: "PUT",
      data: {
        record_status: "A",
        description: data.description,
        sub_department_id: data.sub_department_id,
        provider_id: data.provider_id,
        room_id: data.room_id,
        hims_d_appointment_clinic_id: data.hims_d_appointment_clinic_id
      },
      onSuccess: response => {
        if (response.data.success) {
          swal("Record updated successfully", {
            buttons: false,
            icon: "success",
            timer: 2000
          });
          this.getAppointmentClinics();
        }
      },
      onFailure: error => {
        swal(error.message, {
          buttons: false,
          icon: "error",
          timer: 2000
        });
      }
    });
  }

  addAppointmentClinics(e) {
    e.preventDefault();

    algaehApiCall({
      uri: "/appointment/addAppointmentClinic",
      method: "POST",
      data: {
        description: this.state.description,
        sub_department_id: this.state.sub_department_id,
        provider_id: this.state.provider_id,
        room_id: this.state.room_id
      },
      onSuccess: response => {
        if (response.data.success) {
          this.getAppointmentClinics();
          swal("Record Added Successfully", {
            buttons: false,
            icon: "success",
            timer: 2000
          });
        }
      },
      onFailure: error => {
        swal(error.message, {
          buttons: false,
          icon: "error",
          timer: 2000
        });
      }
    });
  }

  getDeptName(id) {
    let dept = Enumerable.from(
      this.state.departments !== undefined ? this.state.departments : []
    )
      .where(w => w.sub_department_id === id)
      .firstOrDefault();
    return dept.sub_department_name;
  }

  render() {
    return (
      <div className="appointment_clinics">
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

            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{
                fieldName: "department_name"
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
                onChange: this.deptDropDownHandler.bind(this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{
                fieldName: "doctor"
              }}
              selector={{
                name: "provider_id",
                className: "select-fld",
                value: this.state.provider_id,
                dataSource: {
                  textField: "full_name",
                  valueField: "employee_id",
                  data: this.state.doctors
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{
                fieldName: "room"
              }}
              selector={{
                name: "room_id",
                className: "select-fld",
                value: this.state.room_id,
                dataSource: {
                  textField: "description",
                  valueField: "hims_d_appointment_room_id",
                  data: this.state.appointmentRooms
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <div className="col-lg-2 margin-top-15">
              <button
                onClick={this.addAppointmentClinics.bind(this)}
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
                  fieldName: "sub_department_id",
                  label: (
                    <AlgaehLabel label={{ fieldName: "department_name" }} />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "sub_department_id",
                          value: row.sub_department_id,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "provider_id",
                  label: <AlgaehLabel label={{ fieldName: "doctor" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "provider_id",
                          value: row.provider_id,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "room_id",
                  label: <AlgaehLabel label={{ fieldName: "room" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "room_id",
                          value: row.room_id,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          }
                        }}
                      />
                    );
                  }
                }
              ]}
              keyId="hims_d_appointment_clinic_id"
              dataSource={{
                data: this.state.appointmentClinics
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onDelete: this.deleteAppointmentClinics.bind(this),
                onDone: this.updateAppointmentClinics.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AppointmentClinics;
