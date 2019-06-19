import React, { PureComponent } from "react";
import "./appointment.css";
import moment from "moment";
import {
  setGlobal,
  AlgaehValidation,
  SetBulkState
} from "../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import Enumerable from "linq";
import algaehLoader from "../Wrapper/fullPageLoader";
import FrontDesk from "../../Search/FrontDesk.json";
import AlgaehSearch from "../Wrapper/globalSearch";
import swal from "sweetalert2";
import AppointmentComponent from "./AppointmentComponent";

class Appointment extends PureComponent {
  constructor(props) {
    super(props);
    let dateToday = moment().format("YYYY") + moment().format("MM") + "01";
    this.state = {
      selectedHDate: moment(dateToday, "YYYYMMDD")._d,
      showApt: false,
      departments: [],
      doctors: [],
      appointmentSchedule: [],
      provider_id: null,
      no_of_slots: 1,
      patient_code: "",
      defaultStatus: {},
      patToEdit: {},
      openPatEdit: false,
      checkInId: null,
      sub_department_id: null,
      date_of_birth: null,
      activeDateHeader: moment()._d,
      outerStyles: {},
      // byPassValidation: false,
      width: 0,
      byPassValidation: true
    };
  }

  componentDidMount() {
    this.getDoctorsAndDepts();
    this.getAppointmentStatus();
    this.getTitles();

    let x = JSON.parse(localStorage.getItem("ApptCriteria"));

    // if (x !== undefined && x !== null) {
    //   this.setState(
    //     {
    //       sub_department_id: x.sub_dept_id,
    //       provider_id: x.provider_id,
    //       activeDateHeader: x.schedule_date,
    //       doctors: x.doctors,
    //       byPassValidation: true
    //     },
    //     () => {
    //       this.getAppointmentSchedule();
    //     }
    //   );
    // }

    if (x !== undefined && x !== null) {
      this.setState({
        sub_department_id: x.sub_dept_id,
        provider_id: x.provider_id,
        activeDateHeader: x.schedule_date,
        doctors: x.doctors,
        byPassValidation: true
      });
    }
  }

  cancelAppt(row) {
    let _date = moment(row.appointment_date).format("YYYYMMDD");
    let _time = moment(row.appointment_from_time, "HH:mm:ss").format("HHmm");

    if (
      _date < moment(new Date()).format("YYYYMMDD") ||
      (_date === moment(new Date()).format("YYYYMMDD") &&
        _time < moment(new Date()).format("HHmm"))
    ) {
      swalMessage({
        title: "Cannot cancel previous appointments",
        type: "error"
      });
    } else {
      swal({
        title: "Cancel Appointment for " + row.patient_name + "?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes!",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No"
      }).then(willDelete => {
        if (willDelete.value) {
          let data = {
            cancel_reason: "Cancelled",
            hims_f_patient_appointment_id: row.hims_f_patient_appointment_id
          };
          algaehApiCall({
            uri: "/appointment/cancelPatientAppointment",
            module: "frontDesk",
            data: data,
            method: "PUT",
            onSuccess: response => {
              if (response.data.success) {
                swalMessage({
                  title: "Record cancelled successfully . .",
                  type: "success"
                });
              }
              this.getAppointmentSchedule();
            },
            onFailure: error => {}
          });
        } else {
          swalMessage({
            title: "Not cancelled",
            type: "error"
          });
        }
      });
    }
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    //  console.error("Appointment :", error.toString());
    //logErrorToMyService(error, info);
  }

  getDoctorName(id) {
    let doc = Enumerable.from(
      this.state.doctors.length !== 0 ? this.state.doctors : null
    )
      .where(w => w.employee_id === parseInt(id, 10))
      .firstOrDefault();
    return doc !== undefined ? doc.full_name : "";
  }

  getDeptName(id) {
    let dept = Enumerable.from(
      this.state.departments.length !== 0 ? this.state.departments : null
    )
      .where(w => w.sub_department_id === parseInt(id, 10))
      .firstOrDefault();
    return dept !== undefined ? dept.sub_department_name : "";
  }

  getColorCode(id) {
    return Enumerable.from(this.state.appointmentStatus)
      .where(w => w.hims_d_appointment_status_id === id)
      .firstOrDefault() !== undefined
      ? Enumerable.from(this.state.appointmentStatus)
          .where(w => w.hims_d_appointment_status_id === id)
          .firstOrDefault().color_code
      : "#ffffff";
  }

  patientSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: FrontDesk
      },
      searchName: "patients",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        // console.log("Selected Row:", row);
        this.setState({
          patient_code: row.patient_code,
          patient_id: row.hims_d_patient_id,
          patient_name: row.full_name,
          age: row.age,
          date_of_birth: row.date_of_birth,
          gender: row.gender,
          contact_number: row.contact_number,
          email: row.email,
          arabic_name: row.arabic_name,
          title_id: row.title_id
        });
      }
    });
  }

  getPatientAppointment(e) {
    algaehApiCall({
      uri: "/appointment/getPatientAppointment",
      module: "frontDesk",
      method: "GET",
      data: {
        appointment_date: moment(this.state.activeDateHeader).format(
          "YYYY-MM-DD"
        ),
        provider_id: this.state.provider_id,
        sub_department_id: this.state.sub_department_id
      },
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            patientAppointments: response.data.records
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

  clearSaveState() {
    this.setState({
      patient_code: "",
      patient_name: "",
      arabic_name: "",
      date_of_birth: null,
      age: "",
      contact_number: "",
      email: "",
      appointment_remarks: ""
    });
  }

  addPatientAppointment(e) {
    e.preventDefault();

    AlgaehValidation({
      querySelector: "data-validate='addApptDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        SetBulkState({
          state: this,
          callback: () => {
            let from_time = this.state.apptFromTime;
            let duration_minutes = this.state.apptSlot * this.state.no_of_slots;
            let to_time = moment(from_time, "hh:mm a")
              .add(duration_minutes, "minutes")
              .format("HH:mm:ss");

            let appt_date =
              this.state.activeDateHeader !== undefined
                ? this.state.activeDateHeader
                : new Date();

            const send_data = {
              patient_id: this.state.patient_id,
              patient_code: this.state.patient_code,
              provider_id: this.state.apptProvider,
              sub_department_id: this.state.apptSubDept,
              appointment_date: moment(appt_date).format("YYYY-MM-DD"),
              appointment_from_time: moment(
                this.state.apptFromTime,
                "hh:mm a"
              ).format("HH:mm:ss"),
              appointment_to_time: to_time,
              appointment_status_id: this.state.appointment_status_id,
              patient_name: this.state.patient_name,
              arabic_name: this.state.arabic_name,
              date_of_birth: this.state.date_of_birth,
              age: this.state.age,
              contact_number: this.state.contact_number,
              email: this.state.email,
              send_to_provider: "N",
              gender: this.state.gender,
              appointment_remarks: this.state.appointment_remarks,
              number_of_slot: this.state.no_of_slots,
              confirmed: "N",
              cancelled: "N",
              is_stand_by: this.state.is_stand_by,
              title_id: this.state.title_id
            };
            algaehApiCall({
              uri: "/appointment/addPatientAppointment",
              module: "frontDesk",
              method: "POST",
              data: send_data,
              onSuccess: response => {
                if (response.data.success) {
                  if (
                    send_data.appointment_status_id === this.state.checkInId
                  ) {
                    setGlobal({
                      "FD-STD": "RegistrationPatient",
                      "appt-pat-code": this.state.patient_code,
                      "appt-provider-id": this.state.apptProvider,
                      "appt-dept-id": this.state.apptSubDept,
                      "appt-pat-name": this.state.patient_name,
                      "appt-pat-arabic-name": this.state.arabic_name,
                      "appt-pat-dob": this.state.date_of_birth,
                      "appt-pat-age": this.state.age,
                      "appt-pat-gender": this.state.gender,
                      "appt-pat-ph-no": this.state.contact_number,
                      "appt-pat-email": this.state.email,
                      "appt-department-id": this.state.department_id,
                      "appt-title-id": this.state.title_id
                    });

                    document.getElementById("fd-router").click();
                  } else {
                    this.clearSaveState();
                    swalMessage({
                      title: "Appointment Created Successfully",
                      type: "success"
                    });
                    this.setState({ showApt: false });
                    this.getAppointmentSchedule();
                  }
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
    });
  }

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/selectDoctorsAndClinic",
      module: "masterSettings",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            departments: response.data.records.departmets
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

  getTitles() {
    algaehApiCall({
      uri: "/masters/get/title",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            titles: response.data.records
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

  getAppointmentStatus() {
    algaehApiCall({
      uri: "/appointment/getAppointmentStatus",
      module: "frontDesk",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ appointmentStatus: response.data.records }, () => {
            let DefaultStatus = Enumerable.from(this.state.appointmentStatus)
              .where(w => w.default_status === "Y")
              .firstOrDefault();

            let CreateVisit = Enumerable.from(this.state.appointmentStatus)
              .where(w => w.default_status === "C")
              .firstOrDefault();

            let Reschedule = Enumerable.from(this.state.appointmentStatus)
              .where(w => w.default_status === "RS")
              .firstOrDefault();

            this.setState({
              defaultStatus: DefaultStatus,
              appointment_status_id:
                DefaultStatus !== undefined
                  ? DefaultStatus.hims_d_appointment_status_id
                  : null,
              checkInId:
                CreateVisit !== undefined
                  ? CreateVisit.hims_d_appointment_status_id
                  : null,
              RescheduleId:
                Reschedule !== undefined
                  ? Reschedule.hims_d_appointment_status_id
                  : null
            });
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

  getAppointmentSchedule(e) {
    if (e !== undefined) e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      skip: this.state.byPassValidation,
      onSuccess: () => {
        this.setState({ byPassValidation: false });
        let send_data = {
          sub_dept_id: this.state.sub_department_id,
          schedule_date: moment(this.state.activeDateHeader).format(
            "YYYY-MM-DD"
          ),
          provider_id: this.state.provider_id
        };

        localStorage.setItem(
          "ApptCriteria",
          JSON.stringify({
            sub_dept_id: this.state.sub_department_id,
            schedule_date: moment(this.state.activeDateHeader).format(
              "YYYY-MM-DD"
            ),
            provider_id: this.state.provider_id,
            doctors: this.state.doctors
          })
        );

        algaehLoader({ show: true });
        algaehApiCall({
          uri: "/appointment/getDoctorScheduleDateWise",
          module: "frontDesk",
          method: "GET",
          data: send_data,
          onSuccess: response => {
            algaehLoader({ show: false });
            if (response.data.success && response.data.records.length > 0) {
              //  console.log("Appt Schedule:", response.data.records);
              this.setState(
                { appointmentSchedule: response.data.records },
                () => {
                  this.setState({
                    slot:
                      this.state.appointmentSchedule !== undefined
                        ? this.state.appointmentSchedule[0].slot
                        : null,
                    width:
                      response.data.records !== undefined
                        ? 265 * response.data.records.length
                        : 0
                  });
                }
              );
            } else {
              this.setState({
                appointmentSchedule: []
              });

              swalMessage({
                title: "No Schedule Available",
                type: "warning"
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
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  onSelectedDateHandler(e) {
    this.setState(
      {
        activeDateHeader: e.target.getAttribute("date")
      },
      () => {
        this.getAppointmentSchedule();
      }
    );
  }

  monthChangeHandler(e) {
    let dt = moment(e.target.value + "-01", "YYYY-MM-DD")._d;
    this.setState({ selectedHDate: dt, activeDateHeader: dt });
  }

  deptDropDownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      let dept = Enumerable.from(this.state.departments)
        .where(w => w.sub_dept_id === this.state.sub_department_id)
        .firstOrDefault();
      this.setState({
        doctors: dept.doctors,
        department_id: value.selected.department_id
      });
    });
  }

  dropDownHandle(value) {
    // const _maxSlots =
    //   this.state.maxSlots === undefined ? 0 : this.state.maxSlots;
    // if (value.name === "no_of_slots") {
    //   if (parseInt(value.value) > parseInt(_maxSlots)) {
    //     swalMessage({
    //       type: "error",
    //       title: "Maximum " + _maxSlots + " slots avilable "
    //     });
    //     return;
    //   }
    // }
    this.setState({ [value.name]: value.value });
  }

  handleClose() {
    this.setState({
      showApt: false,
      openPatEdit: false
    });
    this.clearSaveState();
  }

  ageHandler(e) {
    SetBulkState({
      state: this,
      callback: () => {
        this.setState({
          age: moment().diff(this.state.date_of_birth, "years")
        });
      }
    });
  }

  dobHandler(e) {
    var age_value = e.target.value;
    var current_date = new Date();
    var birth_date = new Date(
      current_date.getFullYear() - age_value,
      current_date.getMonth(),
      current_date.getDate() + 1
    );

    SetBulkState({
      state: this,
      callback: () => {
        this.setState({
          date_of_birth: birth_date
        });
      }
    });
  }

  dateHandler(selectedDate) {
    this.setState({ edit_appt_date: selectedDate });
  }

  texthandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  liGenerate() {
    let momDate = moment(this.state.selectedHDate);
    let initialDate = momDate._d;
    var date = initialDate,
      y = date.getFullYear(),
      m = date.getMonth();
    var lastDay = new Date(y, m + 1, 0);
    let endDate = moment(lastDay)._d;

    let generatedLi = [];

    while (
      moment(initialDate).format("YYYYMMDD") <=
      moment(endDate).format("YYYYMMDD")
    ) {
      let dt = moment(initialDate);

      generatedLi.push({
        day: dt.format("DD"),
        currentdate: dt._d,
        dayName: dt.format("ddd")
      });
      initialDate.setDate(initialDate.getDate() + 1);
    }
    return generatedLi;
  }

  generateHorizontalDateBlocks() {
    const act_date = new Date(this.state.activeDateHeader);
    return (
      <div className="calendar">
        <div className="col-12">
          <div className="row">
            {this.liGenerate().map((row, index) => {
              const _currDate = moment(row.currentdate).format("YYYYMMDD");
              const _activeDate = moment(act_date).format("YYYYMMDD");
              return (
                <div
                  // className="col"
                  key={index}
                  date={row.currentdate}
                  className={
                    _currDate === _activeDate
                      ? _currDate === moment().format("YYYYMMDD")
                        ? "col activeDate CurrentDate"
                        : "col activeDate"
                      : _currDate === moment().format("YYYYMMDD")
                      ? "col CurrentDate"
                      : "col"
                  }
                  onClick={this.onSelectedDateHandler.bind(this)}>
                  {row.day}
                  <span
                    date={row.currentdate}
                    onClick={this.onSelectedDateHandler.bind(this)}>
                    {row.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  openEditModal(patient, data, e) {
    e.preventDefault();

    let maxSlots = 1;
    const _currentRow = e.target.parentElement.parentNode.sectionRowIndex + 1;
    const _allRows =
      e.target.parentElement.parentElement.parentElement.childElementCount;

    for (let i = _currentRow; i < _allRows; i++) {
      const _element =
        e.target.parentElement.parentElement.parentElement.children[i];
      const _firstChild = _element.children[0];
      const _hasPatient = _firstChild.querySelector("div[appt-pat]");
      if (_hasPatient) break;
      else {
        maxSlots = maxSlots + 1;
      }
    }

    if (
      (moment(patient.appointment_to_time, "HH:mm:ss").format("HHmm") <
        moment(new Date()).format("HHmm") ||
        moment(patient.appointment_date).format("YYYYMMDD") <
          moment(new Date()).format("YYYYMMDD")) &&
      moment(this.state.activeDateHeader).format("YYYYMMDD") <=
        moment(new Date()).format("YYYYMMDD")
    ) {
      swalMessage({
        title: "Can't edit past appointments",
        type: "error"
      });
    } else if (
      patient.appointment_status_id === this.state.checkInId &&
      patient.visit_created === "Y"
    ) {
      swalMessage({
        title: "Visit already created, cannot edit the appointment",
        type: "warning"
      });
    } else {
      let openPatEdit = false;
      if (data === null) {
        openPatEdit = true;
      }
      this.setState({ patToEdit: patient, openPatEdit: openPatEdit }, () => {
        let pat_edit = this.state.patToEdit;
        this.setState(
          {
            edit_appointment_status_id: pat_edit.appointment_status_id,
            edit_appt_date: pat_edit.appointment_date,
            edit_appt_time: pat_edit.appointment_from_time,
            edit_contact_number: pat_edit.contact_number,
            edit_patient_name: pat_edit.patient_name,
            edit_arabic_name: pat_edit.arabic_name,
            edit_date_of_birth: pat_edit.date_of_birth,
            edit_age: pat_edit.age,
            edit_gender: pat_edit.gender,
            edit_email: pat_edit.email,
            edit_appointment_remarks: pat_edit.appointment_remarks,
            edit_appointment_id: pat_edit.hims_f_patient_appointment_id,
            edit_provider_id: pat_edit.provider_id,
            edit_patient_id: pat_edit.patient_id,
            edit_from_time: pat_edit.appointment_from_time,
            edit_sub_dep_id: pat_edit.sub_department_id,
            edit_appointment_date: pat_edit.appointment_date,
            patient_code: pat_edit.patient_code,
            edit_no_of_slots: pat_edit.number_of_slot,
            edit_is_stand_by: pat_edit.is_stand_by,
            edit_title_id: pat_edit.title_id
          },
          () => {
            if (data !== null) {
              this.updatePatientAppointment(data);
            }
          }
        );
      });
    }
  }

  updatePatientAppointment(data) {
    debugger;
    if (data !== null) {
      this.setState({
        edit_appointment_status_id: data.hims_d_appointment_status_id
      });
    }
    AlgaehValidation({
      querySelector: "data-validate='editApptDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        swal({
          title: "Are you Sure you want to Update Appointment?",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes!",
          confirmButtonColor: "#44b8bd",
          cancelButtonColor: "#d33",
          cancelButtonText: "No"
        }).then(willUpdate => {
          let new_to_time = moment(this.state.edit_from_time, "HH:mm:ss").add(
            this.state.edit_no_of_slots * this.state.slot,
            "minutes"
          );

          if (willUpdate.value) {
            if (
              this.state.edit_appointment_status_id === this.state.checkInId &&
              moment(this.state.edit_appt_date).format("YYYYMMDD") !==
                moment(new Date()).format("YYYYMMDD")
            ) {
              swalMessage({
                title:
                  "Only Patients with Today's appointments can be Checked In",
                type: "warning"
              });
            } else {
              let edit_details = {
                hims_f_patient_appointment_id: this.state.edit_appointment_id,
                record_status: "A",
                appointment_status_id: this.state.edit_appointment_status_id,
                patient_id: this.state.edit_patient_id,
                provider_id: this.state.edit_provider_id,
                sub_department_id: this.state.edit_sub_dep_id,
                appointment_date: this.state.edit_appt_date,
                appointment_from_time: this.state.edit_from_time,
                appointment_to_time: moment(new_to_time).format("HH:mm:ss"),
                patient_name: this.state.edit_patient_name,
                arabic_name: this.state.edit_arabic_name,
                date_of_birth: this.state.edit_date_of_birth,
                age: this.state.edit_age,
                contact_number: this.state.edit_contact_number,
                email: this.state.edit_email,
                send_to_provider: null,
                gender: this.state.edit_gender,
                confirmed: "N",
                confirmed_by: null,
                comfirmed_date: null,
                cancelled: "N",
                cancelled_by: null,
                cancelled_date: null,
                cancel_reason: null,
                appointment_remarks: this.state.edit_appointment_remarks,
                is_stand_by: this.state.edit_is_stand_by,
                number_of_slot: this.state.edit_no_of_slots,
                title_id: this.state.edit_title_id
              };

              algaehApiCall({
                uri: "/appointment/updatePatientAppointment",
                module: "frontDesk",
                method: "PUT",
                data: edit_details,
                onSuccess: response => {
                  if (response.data.success) {
                    if (
                      edit_details.appointment_status_id ===
                      this.state.checkInId
                    ) {
                      setGlobal({
                        "FD-STD": "RegistrationPatient",
                        "appt-pat-code": this.state.patient_code,
                        "appt-provider-id": this.state.edit_provider_id,
                        "appt-dept-id": this.state.edit_sub_dep_id,
                        "appt-pat-name": this.state.edit_patient_name,
                        "appt-pat-arabic-name": this.state.edit_arabic_name,
                        "appt-pat-dob": this.state.edit_date_of_birth,
                        "appt-pat-age": this.state.edit_age,
                        "appt-pat-gender": this.state.edit_gender,
                        "appt-pat-ph-no": this.state.edit_contact_number,
                        "appt-pat-email": this.state.edit_email,
                        "appt-department-id": this.state.department_id,
                        "appt-id": this.state.edit_appointment_id,
                        "appt-title-id": this.state.edit_title_id
                      });

                      document.getElementById("fd-router").click();
                    } else {
                      this.clearSaveState();
                      swalMessage({
                        title: "Appointment Updated Successfully",
                        type: "success"
                      });
                      this.setState({ openPatEdit: false });
                      this.getAppointmentSchedule();
                    }
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
          } else {
            swalMessage({
              title: "Not cancelled",
              type: "error"
            });
          }
        });
      }
    });
  }

  showModal(e) {
    let maxSlots = 1;
    const _currentRow = e.target.parentElement.parentNode.sectionRowIndex + 1;
    const _allRows =
      e.target.parentElement.parentElement.parentElement.childElementCount;

    for (let i = _currentRow; i < _allRows; i++) {
      const _element =
        e.target.parentElement.parentElement.parentElement.children[i];
      const _firstChild = _element.children[0];
      const _hasPatient = _firstChild.querySelector("div[appt-pat]");
      if (_hasPatient) break;
      else {
        maxSlots = maxSlots + 1;
      }
    }

    const appt_time = e.currentTarget.getAttribute("appt-time");
    if (
      (moment(appt_time, "HH:mm a").format("HHmm") <
        moment(new Date()).format("HHmm") ||
        moment(this.state.activeDateHeader).format("YYYYMMDD") <
          moment(new Date()).format("YYYYMMDD")) &&
      moment(this.state.activeDateHeader).format("YYYYMMDD") <=
        moment(new Date()).format("YYYYMMDD")
    ) {
      swalMessage({
        title: "Can't create appointment for past time",
        type: "error"
      });
      this.setState({
        showApt: false
      });
    } else {
      const to_work_hr = e.currentTarget.getAttribute("to_work_hr");
      const from_break_hr1 = e.currentTarget.getAttribute("from_break_hr1");
      const to_break_hr1 = e.currentTarget.getAttribute("to_break_hr1");
      const from_break_hr2 = e.currentTarget.getAttribute("from_break_hr2");
      const to_break_hr2 = e.currentTarget.getAttribute("to_break_hr2");
      const slot = e.currentTarget.getAttribute("slot");
      const clinic_id = e.currentTarget.getAttribute("clinic_id");
      const provider_id = e.currentTarget.getAttribute("provider_id");
      const sch_header_id = e.currentTarget.getAttribute("sch_header_id");
      const sch_detail_id = e.currentTarget.getAttribute("sch_detail_id");
      const sub_dept_id = e.currentTarget.getAttribute("sub_dept_id");
      const is_stand_by = e.currentTarget.getAttribute("isstandby");
      const sub_dep_name = this.getDeptName(sub_dept_id);
      const doc_name = this.getDoctorName(provider_id);

      this.setState({
        maxSlots: maxSlots,
        showApt: true,
        apptFromTime: appt_time,
        apptProvider: provider_id,
        apptToWorkHr: to_work_hr,
        apptFromBrk1: from_break_hr1,
        apptToBrk1: to_break_hr1,
        apptFromBrk2: from_break_hr2,
        apptToBrk2: to_break_hr2,
        apptSlot: slot,
        apptClinicID: clinic_id,
        apptSchHdId: sch_header_id,
        apptSchDtId: sch_detail_id,
        apptSubDept: sub_dept_id,
        apptSubDeptName: sub_dep_name,
        apptProviderName: doc_name,
        is_stand_by: is_stand_by
      });
    }
  }

  enterDrag(ev) {
    ev.currentTarget.classList.add("highlight-Drop");
  }

  leaveDrag(ev) {
    ev.currentTarget.classList.remove("highlight-Drop");
  }

  drag(ev) {
    let pat = JSON.parse(ev.currentTarget.getAttribute("appt-pat"));

    let appt_date = pat.appointment_date;
    let appt_time = pat.appointment_from_time;
    if (
      (moment(appt_time, "HH:mm:ss").format("HHmm") <
        moment(new Date()).format("HHmm") ||
        moment(appt_date).format("YYYYMMDD") <
          moment(new Date()).format("YYYYMMDD")) &&
      moment(this.state.activeDateHeader).format("YYYYMMDD") <=
        moment(new Date()).format("YYYYMMDD")
    ) {
      swalMessage({
        title: "Cannot re-schedule past appointments",
        type: "error"
      });
      ev.preventDefault();
    } else {
      this.setState({ patToEdit: pat }, () => {
        let pat_edit = this.state.patToEdit;
        this.setState({
          edit_appointment_status_id: pat_edit.appointment_status_id,
          edit_appt_date: pat_edit.appointment_date,
          edit_contact_number: pat_edit.contact_number,
          edit_patient_name: pat_edit.patient_name,
          edit_arabic_name: pat_edit.arabic_name,
          edit_date_of_birth: pat_edit.date_of_birth,
          edit_age: pat_edit.age,
          edit_gender: pat_edit.gender,
          edit_email: pat_edit.email,
          edit_appointment_remarks: pat_edit.appointment_remarks,
          edit_appointment_id: pat_edit.hims_f_patient_appointment_id,
          edit_patient_id: pat_edit.patient_id,
          edit_sub_dep_id: pat_edit.sub_department_id,
          edit_appointment_date: pat_edit.appointment_date,
          patient_code: pat_edit.patient_code,
          edit_no_of_slots: pat_edit.number_of_slot,
          edit_title_id: pat_edit.title_id
        });
      });
    }
  }

  allowDrop(e) {
    e.preventDefault();
  }

  drop(ev) {
    ev.preventDefault();

    ev.currentTarget.classList.remove("highlight-Drop");
    let new_from_time = ev.currentTarget.children[1].getAttribute("appt-time");

    if (
      (moment(new_from_time, "HH:mm a").format("HHmm") <
        moment(new Date()).format("HHmm") ||
        moment(this.state.activeDateHeader).format("YYYYMMDD") <
          moment(new Date()).format("YYYYMMDD")) &&
      moment(this.state.activeDateHeader).format("YYYYMMDD") <=
        moment(new Date()).format("YYYYMMDD")
    ) {
      swalMessage({
        title: "Cannot create schedule for past time",
        type: "error"
      });
    } else {
      let prov_id = ev.currentTarget.children[1].getAttribute("provider_id");
      let slot = ev.currentTarget.children[1].getAttribute("slot");

      let new_to_time = moment(new_from_time, "HH:mm a").add(
        this.state.edit_no_of_slots * slot,
        "minutes"
      );

      this.setState(
        {
          edit_appt_time: moment(new_from_time, "HH:mm a").format("HH:mm:ss"),
          edit_from_time: moment(new_from_time, "HH:mm a").format("HH:mm:ss"),
          edit_to_time: moment(new_to_time).format("HH:mm:ss"),
          edit_provider_id: prov_id,
          edit_appointment_status_id: this.state.RescheduleId
        },
        () => {
          swal({
            title: "Are you sure you want to Re-Schedule the appointment?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes!",
            confirmButtonColor: "#",
            cancelButtonColor: "#d33",
            cancelButtonText: "No"
          }).then(willUpdate => {
            if (willUpdate.value) {
              let edit_details = {
                hims_f_patient_appointment_id: this.state.edit_appointment_id,
                record_status: "A",
                appointment_status_id: this.state.edit_appointment_status_id,
                patient_id: this.state.edit_patient_id,
                provider_id: this.state.edit_provider_id,
                sub_department_id: this.state.edit_sub_dep_id,
                appointment_date: this.state.edit_appointment_date,
                appointment_from_time: this.state.edit_from_time,
                appointment_to_time: this.state.edit_to_time,
                patient_name: this.state.edit_patient_name,
                arabic_name: this.state.edit_arabic_name,
                date_of_birth: this.state.edit_date_of_birth,
                age: this.state.edit_age,
                title_id: this.state.edit_title_id,
                contact_number: this.state.edit_contact_number,
                email: this.state.edit_email,
                send_to_provider: null,
                gender: this.state.edit_gender,
                confirmed: "Y",
                confirmed_by: null,
                comfirmed_date: null,
                cancelled: "N",
                cancelled_by: null,
                cancelled_date: null,
                cancel_reason: null,
                appointment_remarks: this.state.edit_appointment_remarks,
                is_stand_by: "N",
                number_of_slot: this.state.edit_no_of_slots
              };

              algaehApiCall({
                uri: "/appointment/updatePatientAppointment",
                module: "frontDesk",
                method: "PUT",
                data: edit_details,
                onSuccess: response => {
                  if (response.data.success) {
                    this.clearSaveState();
                    swalMessage({
                      title: "Appointment Updated Successfully",
                      type: "success"
                    });
                    this.setState({ openPatEdit: false });
                    this.getAppointmentSchedule();
                  }
                },
                onFailure: error => {
                  swalMessage({
                    title:
                      "Appointment already present for the selected time cannot re-schedule",
                    type: "error"
                  });
                }
              });
            } else {
              swalMessage({
                title: "Re-Schedule Cancelled",
                type: "error"
              });
            }
          });
        }
      );
    }
  }

  plotPatients(data) {
    const newEndTime = new moment(data.time, "hh:mm a").add(
      data.slot,
      "minutes"
    );
    let patients = [];
    if (data.patients !== undefined) {
      patients = data.patients;
    }
    const patient = Enumerable.from(patients)
      .where(
        w =>
          (moment(w.appointment_to_time, "hh:mm:ss") >
            moment(data.time, "hh:mm a") &&
            moment(w.appointment_to_time, "hh:mm:ss") <=
              moment(data.time, "hh:mm a")) ||
          (moment(w.appointment_from_time, "hh:mm:ss") <=
            moment(data.time, "hh:mm a") &&
            moment(w.appointment_to_time, "hh:mm:ss") >= newEndTime)
      )
      .toArray();
    if (patient !== undefined) {
      return patient;
    } else {
      return null;
    }
  }
  plotAddIcon(patient, data) {
    const _isstandby =
      patient === null || patient === undefined
        ? "N"
        : patient.is_stand_by === "Y"
        ? "Y"
        : patient.cancelled === "Y"
        ? "N"
        : null;

    let date_time_val =
      (moment(data.time, "HH:mm a").format("HHmm") <
        moment(new Date()).format("HHmm") ||
        moment(this.state.activeDateHeader).format("YYYYMMDD") <
          moment(new Date()).format("YYYYMMDD")) &&
      moment(this.state.activeDateHeader).format("YYYYMMDD") <=
        moment(new Date()).format("YYYYMMDD");

    if (_isstandby !== null && !date_time_val) {
      return (
        <i
          appt-time={data.time}
          to_work_hr={data.to_work_hr}
          from_break_hr1={data.from_break_hr1}
          to_break_hr1={data.to_break_hr1}
          from_break_hr2={data.from_break_hr2}
          to_break_hr2={data.to_work_hr}
          slot={data.slot}
          clinic_id={data.clinic_id}
          provider_id={data.provider_id}
          sch_header_id={data.sch_header_id}
          sch_detail_id={data.sch_detail_id}
          sub_dept_id={data.sub_dept_id}
          isstandby="N"
          onClick={this.showModal.bind(this)}
          className="fas fa-plus"
        />
      );
    } else {
      return null;
    }
  }

  plotStandByAddIcon(patient, data) {
    let date_time_val =
      (moment(data.time, "HH:mm a").format("HHmm") <
        moment(new Date()).format("HHmm") ||
        moment(this.state.activeDateHeader).format("YYYYMMDD") <
          moment(new Date()).format("YYYYMMDD")) &&
      moment(this.state.activeDateHeader).format("YYYYMMDD") <=
        moment(new Date()).format("YYYYMMDD");

    if (!date_time_val) {
      return (
        <i
          appt-time={data.time}
          to_work_hr={data.to_work_hr}
          from_break_hr1={data.from_break_hr1}
          to_break_hr1={data.to_break_hr1}
          from_break_hr2={data.from_break_hr2}
          to_break_hr2={data.to_work_hr}
          slot={data.slot}
          clinic_id={data.clinic_id}
          provider_id={data.provider_id}
          sch_header_id={data.sch_header_id}
          sch_detail_id={data.sch_detail_id}
          sub_dept_id={data.sub_dept_id}
          isstandby="Y"
          onClick={this.showModal.bind(this)}
          className="fas fa-plus"
        />
      );
    } else {
      return null;
    }
  }

  loadSubStandBy(patients) {
    if (patients !== undefined && patients !== null && patients.length > 0) {
      const _otherPatients = patients.slice(1);
      if (_otherPatients !== undefined && _otherPatients.length > 0) {
        return (
          <span className="patientStdbyCount">
            {_otherPatients.length} more..
            <ul>
              {_otherPatients.map((item, index) => {
                return (
                  <li key={index}>
                    {item.patient_name}{" "}
                    <b onClick={this.cancelAppt.bind(this, item)}>x</b>
                  </li>
                );
              })}
            </ul>
          </span>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  renderStandByMultiple(standByPatients) {
    if (standByPatients !== null && standByPatients !== undefined) {
      const _firstPatient = standByPatients[0];
      if (_firstPatient !== undefined) {
        return (
          <React.Fragment>
            <div
              appt-pat={JSON.stringify(_firstPatient)}
              className="dynPatient"
              style={{ background: "#f2f2f2" }}>
              <span
                onClick={this.openEditModal.bind(this, _firstPatient, null)}>
                {_firstPatient.patient_name}
                <br />
                {_firstPatient.contact_number}
              </span>

              <i
                className="fas fa-times"
                onClick={this.cancelAppt.bind(this, _firstPatient)}
              />
            </div>
            {this.loadSubStandBy(standByPatients)}
          </React.Fragment>
        );
      } else {
        return null;
      }
    }
  }

  generateChilderns(data) {
    const colspan = data.mark_as_break
      ? {
          colSpan: 2,
          style: {
            width: "240px",
            background: "rgb(255, 238, 214)",
            textTransform: "uppercase"
          }
        }
      : {};
    const _patientList = this.plotPatients({
      time: data.time,
      slot: data.slot,
      patients: data.patients
    });
    const patient =
      _patientList !== null
        ? Enumerable.from(_patientList)
            .where(w => w.is_stand_by === "N" && w.cancelled === "N")
            .firstOrDefault()
        : undefined;

    const sel_stat_id =
      patient !== undefined ? patient.appointment_status_id : 0;

    const sel_stat = Enumerable.from(
      this.state.appointmentStatus !== undefined
        ? this.state.appointmentStatus
        : []
    )
      .where(w => w.hims_d_appointment_status_id === sel_stat_id)
      .firstOrDefault();

    let sel_steps = sel_stat !== undefined ? sel_stat.steps : 0;

    const status =
      sel_stat_id !== null
        ? Enumerable.from(
            this.state.appointmentStatus !== undefined
              ? this.state.appointmentStatus
              : []
          )
            .where(w => w.steps > sel_steps)
            .toArray()
        : [];

    const _standByPatients =
      _patientList !== null
        ? Enumerable.from(_patientList)
            .where(w => w.is_stand_by === "Y" && w.cancelled === "N")
            .toArray()
        : undefined;

    let brk_bg_color = data.mark_as_break
      ? "1"
      : (moment(data.time, "HH:mm a").format("HHmm") <
          moment(new Date()).format("HHmm") &&
          moment(this.state.activeDateHeader).format("YYYYMMDD") <=
            moment(new Date()).format("YYYYMMDD")) ||
        moment(this.state.activeDateHeader).format("YYYYMMDD") <
          moment(new Date()).format("YYYYMMDD")
      ? "0.4"
      : "1";

    let bg_color =
      patient != null
        ? this.getColorCode(patient.appointment_status_id)
        : data.mark_as_break
        ? "#f2f2f2"
        : moment(data.time, "HH:mm a").format("HHmm") <
            moment(new Date()).format("HHmm") &&
          moment(this.state.activeDateHeader).format("YYYYMMDD") <
            moment(new Date()).format("YYYYMMDD")
        ? "#fbfbfb"
        : "#ffffff";

    return (
      <tr
        style={{ opacity: brk_bg_color, cursor: "pointer" }}
        key={data.counter}>
        <td
          className="tg-baqh" //highlight-Drop
          {...colspan}
          onDrop={this.drop.bind(this)}
          onDragOver={this.allowDrop.bind(this)}
          onDragEnter={this.enterDrag.bind(this)}
          onDragLeave={this.leaveDrag.bind(this)}>
          {data.mark_as_break === false ? (
            <span className="dynSlot">{data.time}</span>
          ) : null}

          {data.mark_as_break === false ? (
            <React.Fragment>
              {this.plotAddIcon(patient, data)}

              {patient != null &&
              patient.is_stand_by === "N" &&
              patient.cancelled === "N" ? (
                <div
                  appt-pat={JSON.stringify(patient)}
                  className="dynPatient"
                  style={{ background: bg_color }}
                  draggable={true}
                  onDragStart={this.drag.bind(this)}>
                  <span onClick={this.openEditModal.bind(this, patient, null)}>
                    {patient.patient_name}
                    <br />
                    {patient.contact_number}
                  </span>

                  <i
                    className="fas fa-times"
                    onClick={this.cancelAppt.bind(this, patient)}
                  />
                  <div className="appStatusListCntr">
                    <i className="fas fa-clock" />
                    <ul className="appStatusList">
                      {status !== undefined
                        ? status.map((data, index) => (
                            <li
                              key={index}
                              onClick={this.openEditModal.bind(
                                this,
                                patient,
                                data
                              )}>
                              <span
                                style={{
                                  backgroundColor: data.color_code
                                }}>
                                {data.description}
                              </span>
                            </li>
                          ))
                        : null}
                      <li
                        onClick={this.openEditModal.bind(this, patient, data)}>
                        <span>Print App. Slip</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : null}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span>Break Time</span>
            </React.Fragment>
          )}
        </td>

        {data.mark_as_break === false ? (
          <td className="tg-baqh">
            <span className="dynSlot">{data.time}</span>

            {(moment(data.time, "HH:mm a").format("HHmm") <
              moment(new Date()).format("HHmm") ||
              moment(this.state.activeDateHeader).format("YYYYMMDD") <
                moment(new Date()).format("YYYYMMDD")) &&
              moment(this.state.activeDateHeader).format("YYYYMMDD") <=
                moment(new Date()).format("YYYYMMDD")}

            {this.plotStandByAddIcon(patient, data)}
            {this.renderStandByMultiple(_standByPatients)}
          </td>
        ) : null}
      </tr>
    );
  }

  nullifyState(name) {
    this.setState({
      [name]: null
    });
  }

  generateTimeslots(data) {
    const clinic_id = data.clinic_id;
    const provider_id = data.provider_id;
    const sch_header_id = data.hims_d_appointment_schedule_header_id;
    const sch_detail_id = data.hims_d_appointment_schedule_detail_id;
    const sub_dept_id = data.sub_dept_id;
    const from_work_hr = moment(data.from_work_hr, "hh:mm:ss");
    const to_work_hr = moment(data.to_work_hr, "hh:mm:ss");
    const from_break_hr1 = moment(data.from_break_hr1, "hh:mm:ss");
    const to_break_hr1 = moment(data.to_break_hr1, "hh:mm:ss");
    const from_break_hr2 = moment(data.from_break_hr2, "hh:mm:ss");
    const to_break_hr2 = moment(data.to_break_hr2, "hh:mm:ss");
    const slot = parseInt(data.slot, 10);
    let isPrevbreak = null;
    let tds = [];
    let count = 0;
    for (;;) {
      let isBreak = false;

      let newFrom =
        count === 0 ? from_work_hr : from_work_hr.add(slot, "minutes");
      if (newFrom.isBefore(to_work_hr)) {
        if (data.work_break1 === "Y" || data.work_break2 === "Y") {
          let endTimeTemp = new moment(newFrom).add(slot, "minutes");
          if (
            (to_break_hr1 > newFrom && to_break_hr1 <= newFrom) ||
            (from_break_hr1 <= newFrom && to_break_hr1 >= endTimeTemp)
          ) {
            isBreak = true;
          }

          if (
            (to_break_hr2 > newFrom && to_break_hr2 <= endTimeTemp) ||
            (from_break_hr2 <= newFrom && to_break_hr2 >= endTimeTemp)
          ) {
            isBreak = true;
          }
        }
        if (isBreak) {
          isPrevbreak = {
            counter: count,
            mark_as_break: isBreak
          };
        } else {
          if (isPrevbreak !== null) {
            tds.push(this.generateChilderns(isPrevbreak));
            isPrevbreak = null;
          }

          tds.push(
            this.generateChilderns({
              time: newFrom.format("hh:mm a"),
              counter: count,
              to_work_hr: moment(to_work_hr).format("hh:mm a"),
              from_break_hr1: moment(from_break_hr1).format("hh:mm a"),
              to_break_hr1: moment(to_break_hr1).format("hh:mm a"),
              from_break_hr2: moment(from_break_hr2).format("hh:mm a"),
              to_break_hr2: moment(to_break_hr2).format("hh:mm a"),
              slot: slot,
              clinic_id: clinic_id,
              provider_id: provider_id,
              sch_header_id: sch_header_id,
              sch_detail_id: sch_detail_id,
              sub_dept_id: sub_dept_id,
              mark_as_break: isBreak,
              patients: data.patientList
            })
          );
        }
      } else {
        break;
      }
      count = count + 1;
    }
    return <React.Fragment>{tds}</React.Fragment>;
  }
  // getSnapshotBeforeUpdate() {
  //   const doctorCntr = document.getElementsByClassName("tg");
  //   if (doctorCntr !== undefined && doctorCntr.length > 0) {
  //     const _completeWidth = doctorCntr[0].width * doctorCntr.length;
  //     return { width: _completeWidth };
  //     // this.setState({ outerStyles: { width: _completeWidth } }, () => {
  //     //
  //     // });
  //   }
  //   return null;
  // }
  //componentDidUpdate(props, prevState, snapshot) {}

  render() {
    return (
      <AppointmentComponent
        state={this.state}
        setState={this.setState}
        texthandle={e => this.texthandle(e)}
        handleClose={e => this.handleClose(e)}
        dateHandler={selectedDate => this.dateHandler(selectedDate)}
        dropDownHandle={e => this.dropDownHandle(e)}
        nullifyState={name => this.nullifyState(name)}
        updatePatientAppointment={data => this.updatePatientAppointment(data)}
        ageHandler={() => this.ageHandler()}
        dobHandler={(e) => this.dobHandler(e)}
        patientSearch={() => this.patientSearch()}
        deptDropDownHandler={value => this.deptDropDownHandler(value)}
        getAppointmentSchedule={() => this.getAppointmentSchedule()}
        addPatientAppointment={e => this.addPatientAppointment(e)}
        monthChangeHandler={e => this.monthChangeHandler(e)}
        generateHorizontalDateBlocks={() => this.generateHorizontalDateBlocks()}
        generateTimeslots={data => this.generateTimeslots(data)}
      />
    );
  }
}

export default Appointment;
