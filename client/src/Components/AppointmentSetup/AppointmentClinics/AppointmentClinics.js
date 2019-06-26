import React, { Component } from "react";
import "./appointment_clinics.css";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import Enumerable from "linq";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

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
      description_error_text: "",
      all_docs: []
    };
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
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
      module: "frontDesk",
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

  getAppointmentClinics() {
    algaehApiCall({
      uri: "/appointment/getAppointmentClinic",
      module: "frontDesk",
      method: "GET",
      data: {},
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ appointmentClinics: response.data.records });
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

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      module: "masterSettings",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            departments: response.data.records.departmets,
            doctors: response.data.records.doctors,
            all_docs: response.data.records.doctors
          });
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
    this.getAppointmentClinics();
    this.getDoctorsAndDepts();
    this.getApptRooms();
  }

  deleteAppointmentClinics(data) {
    swal({
      title: "Are you sure you want to delete this Clinic?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/appointment/updateAppointmentClinic",
          module: "frontDesk",
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
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getAppointmentClinics();
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "warning"
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

  updateAppointmentClinics(data) {
    algaehApiCall({
      uri: "/appointment/updateAppointmentClinic",
      module: "frontDesk",
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
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });

          this.getAppointmentClinics();
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

  clearSaveState() {
    this.setState({
      description: "",
      sub_department_id: null,
      provider_id: null,
      room_id: null
    });
  }

  addAppointmentClinics(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/appointment/addAppointmentClinic",
          module: "frontDesk",
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
              this.clearSaveState();
              swalMessage({
                title: "Record Added Successfully",
                type: "success"
              });
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
    });
  }

  getDeptName(id) {
    let dept = Enumerable.from(
      this.state.departments.length !== 0 ? this.state.departments : null
    )
      .where(w => w.sub_department_id === id)
      .firstOrDefault();
    return dept !== undefined ? dept.sub_department_name : "";
  }

  getDoctorName(id) {
    let doc = Enumerable.from(
      this.state.all_docs.length !== 0 ? this.state.all_docs : null
    )
      .where(w => w.employee_id === id)
      .firstOrDefault();
    return doc !== undefined ? doc.full_name : "";
  }

  getRoomName(id) {
    let room = Enumerable.from(
      this.state.appointmentRooms.length !== 0
        ? this.state.appointmentRooms
        : null
    )
      .where(w => w.hims_d_appointment_room_id === id)
      .firstOrDefault();
    return room !== undefined ? room.roomDesc : "";
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
                fieldName: "department_name",
                isImp: true
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
                fieldName: "doctor",
                isImp: true
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
                fieldName: "room",
                isImp: true
              }}
              selector={{
                name: "room_id",
                className: "select-fld",
                value: this.state.room_id,
                dataSource: {
                  textField: "roomDesc",
                  valueField: "hims_d_appointment_room_id",
                  data: this.state.appointmentRooms
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <div className="col-lg-2">
              <button
                style={{ marginTop: 21 }}
                onClick={this.addAppointmentClinics.bind(this)}
                type="button"
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>
        </div>

        <div
          className="col-lg-12"
          data-validate="apptClinicsDiv"
          id="apptClinicsDivCntr"
        >
          <AlgaehDataGrid
            id="appt-status-grid"
            datavalidate="data-validate='apptClinicsDiv'"
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
                fieldName: "sub_department_id",
                label: <AlgaehLabel label={{ fieldName: "department_name" }} />,
                displayTemplate: row => {
                  return this.getDeptName(row.sub_department_id);
                },
                editorTemplate: row => {
                  return (
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      selector={{
                        name: "sub_department_id",
                        className: "select-fld",
                        value: row.sub_department_id,
                        dataSource: {
                          textField: "sub_department_name",
                          valueField: "sub_department_id",
                          data: this.state.departments
                        },
                        others: {
                          errormessage: "Department - cannot be blank",
                          required: true
                        },
                        onChange: this.changeGridEditors.bind(this, row)
                      }}
                    />
                  );
                }
              },
              {
                fieldName: "provider_id",
                label: <AlgaehLabel label={{ fieldName: "doctor" }} />,
                displayTemplate: row => {
                  return this.getDoctorName(row.provider_id);
                },
                editorTemplate: row => {
                  return (
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      selector={{
                        name: "provider_id",
                        className: "select-fld",
                        value: row.provider_id,
                        dataSource: {
                          textField: "full_name",
                          valueField: "employee_id",
                          data: this.state.all_docs
                        },
                        others: {
                          errormessage: "Doctor - cannot be blank",
                          required: true
                        },
                        onChange: this.changeGridEditors.bind(this, row)
                      }}
                    />
                  );
                }
              },
              {
                fieldName: "room_id",
                label: <AlgaehLabel label={{ fieldName: "room" }} />,
                displayTemplate: row => {
                  return this.getRoomName(row.room_id);
                },
                editorTemplate: row => {
                  return (
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      selector={{
                        name: "room_id",
                        className: "select-fld",
                        value: row.room_id,
                        dataSource: {
                          textField: "roomDesc",
                          valueField: "hims_d_appointment_room_id",
                          data: this.state.appointmentRooms
                        },
                        others: {
                          errormessage: "Room - cannot be blank",
                          required: true
                        },
                        onChange: this.changeGridEditors.bind(this, row)
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
            filter={true}
            isEditable={true}
            paging={{ page: 0, rowsPerPage: 10 }}
            events={{
              onEdit: () => {},
              onDelete: this.deleteAppointmentClinics.bind(this),
              onDone: this.updateAppointmentClinics.bind(this)
            }}
          />
        </div>
      </div>
    );
  }
}

export default AppointmentClinics;
