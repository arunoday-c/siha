import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";

import "./appointment.css";
import moment from "moment";
import {
  setGlobal,
  AlgaehValidation,
  SetBulkState
} from "../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import Enumerable from "linq";
import isEmpty from "lodash/isEmpty";
import Notification from "../Wrapper/algaehNotification";
import algaehLoader from "../Wrapper/fullPageLoader";
import spotlightSearch from "../../Search/spotlightSearch";
import AlgaehSearch from "../Wrapper/globalSearch";
import swal from "sweetalert2";
import AppointmentComponent from "./AppointmentComponent";
import {
  generateTimeslotsForDoctor,
  generateReport
} from "./AppointmentHelper";
import sockets from "../../sockets";

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
    this.appSock = sockets;
  }

  componentDidMount() {
    this.getDoctorsAndDepts();
    this.getAppointmentStatus();
    this.getTitles();
    this.props.getVisittypes({
      uri: "/visitType/get",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "VISITTYPE_GET_DATA",
        mappingName: "visittypes"
      }
    });
    this.appSock.on("refresh_appointment", patient => {
      console.log(patient);
      const { provider_id, sub_department_id } = this.state;
      if (
        sub_department_id === patient.sub_department_id ||
        provider_id === patient.provider_id
      ) {
        this.setState(
          {
            byPassValidation: true
          },
          this.getAppointmentSchedule
        );
      }
    });
  }

  restoreOldState() {
    if (this.props.fromRegistration) {
      let x = JSON.parse(localStorage.getItem("ApptCriteria"));
      if (this.props.visitCreated) {
        this.clearSaveState();
      }
      if (x !== undefined && x !== null) {
        this.setState(
          {
            sub_department_id: x.sub_dept_id,
            provider_id: x.provider_id,
            activeDateHeader: x.schedule_date,
            doctors: x.doctors,
            byPassValidation: true
          },
          () => this.getAppointmentSchedule()
        );
      }
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
    } else if (row.appointment_status_id === this.state.checkInId) {
      swalMessage({
        title: "Cannot cancel checked in Patients",
        type: "error"
      });
    } else {
      swal({
        title: "Cancel Appointment for " + row.patient_name + "?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
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
                this.setState(
                  {
                    openPatEdit: false
                  },
                  () => {
                    this.clearSaveState();
                    swalMessage({
                      title: "Record cancelled successfully . .",
                      type: "success"
                    });
                  }
                );
              }
              this.getAppointmentSchedule();
            },
            onFailure: error => {}
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
        columns: spotlightSearch.frontDesk.patients
      },
      searchName: "patients",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        // console.log("Selected Row:", row);
        this.setState({
          fromSearch: true,
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
      title_id: "",
      gender: "",
      patient_code: "",
      patient_name: "",
      arabic_name: "",
      date_of_birth: null,
      age: null,
      contact_number: "",
      email: "",
      appointment_remarks: "",
      timeSlots: [],
      edit_appt_date: "",
      fromSearch: false
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
                  this.appSock.emit("appointment_created", send_data);
                  if (
                    send_data.appointment_status_id === this.state.checkInId
                  ) {
                    this.handleCheckIn(send_data);
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
          this.setState(
            {
              departments: response.data.records.departmets
            },
            () => this.restoreOldState()
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

            let CheckedIn = Enumerable.from(this.state.appointmentStatus)
              .where(w => w.default_status === "C")
              .firstOrDefault();

            let Reschedule = Enumerable.from(this.state.appointmentStatus)
              .where(w => w.default_status === "RS")
              .firstOrDefault();

            let Cancelled = Enumerable.from(this.state.appointmentStatus)
              .where(w => w.default_status === "CAN")
              .firstOrDefault();

            let NoShow = Enumerable.from(this.state.appointmentStatus)
              .where(w => w.default_status === "NS")
              .firstOrDefault();

            this.setState({
              defaultStatus: DefaultStatus,
              appointment_status_id:
                DefaultStatus !== undefined
                  ? DefaultStatus.hims_d_appointment_status_id
                  : null,
              checkInId:
                CheckedIn !== undefined
                  ? CheckedIn.hims_d_appointment_status_id
                  : null,
              RescheduleId:
                Reschedule !== undefined
                  ? Reschedule.hims_d_appointment_status_id
                  : null,
              cancelledId:
                Cancelled !== undefined
                  ? Cancelled.hims_d_appointment_status_id
                  : null,
              noShowId:
                NoShow !== undefined
                  ? NoShow.hims_d_appointment_status_id
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
                        ? 318 * response.data.records.length
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
    if (value.name === "title_id" || value === "title_id") {
      this.handleTitle(value);
    }
    this.setState({ [value.name]: value.value });
  }

  handleTitle(e) {
    let setGender = null;

    if (!e.value) {
      this.setState({
        gender: null,
        [e.name]: null
      });
    } else {
      if (e.selected.title === "Mr" || e.selected.title === "Master") {
        setGender = "Male";
      } else if (e.selected.title === "Mrs" || e.selected.title === "Miss") {
        setGender = "Female";
      } else if (e.selected.title === "Ms") {
        setGender = "Female";
      } else if (e.selected.title === "Dr" || e.selected.title === "Prof") {
        setGender = "";
      }
      this.setState({
        gender: setGender,
        [e.name]: e.value
      });
    }
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

  validateAge(e) {
    const { date_of_birth, age } = this.state;
    let dob = moment(date_of_birth);
    if (dob.isAfter(moment()) || age < 0) {
      this.setState(
        {
          date_of_birth: null,
          age: null
        },
        () => {
          swalMessage({
            title: "Date of Birth must be a Past date",
            type: "error"
          });
        }
      );
    }
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

  editDateHandler(selectedDate) {
    this.setState({ edit_appt_date: selectedDate });
  }

  editDateValidate = (value, event) => {
    let inRange = moment(value).isBefore(moment(), "day");
    if (inRange) {
      swalMessage({
        title: "Appointment date cannot be past Date.",
        type: "warning"
      });
      event.target.focus();
      this.setState({
        [event.target.name]: null,
        edit_appt_time: null,
        timeSlots: [],
        schAvailable: false
      });
    } else {
      const provider_id = this.state.edit_provider_id;
      if (moment(value).isValid()) {
        this.getTimeSlotsForDropDown(provider_id);
      }
    }
  };

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
                  onClick={this.onSelectedDateHandler.bind(this)}
                >
                  {row.day}
                  <span
                    date={row.currentdate}
                    onClick={this.onSelectedDateHandler.bind(this)}
                  >
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

  handlePatient(patient, data, e) {
    if (data.hims_d_appointment_status_id === this.state.checkInId) {
      this.handleCheckIn(patient, data);
    } else {
      this.openEditModal(patient, data, e);
    }
  }

  handleCheckIn(patient) {
    setGlobal({
      "FD-STD": "RegistrationPatient"
    });
    // for new patient who are not yet registered
    if (!patient.patient_code) {
      patient.patient_age = patient.age;
      patient.arabic_patient_name = patient.arabic_name;
      patient.patient_gender = patient.gender;
      patient.patient_phone = patient.contact_number;
      patient.patient_email = patient.email;
      delete patient.age;
      delete patient.gender;
      delete patient.contact_number;
      delete patient.email;
      delete patient.arabic_name;
      return this.props.routeComponents(patient, this.state.checkInId);
    }

    return this.props.routeComponents(patient, this.state.checkInId);
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
    } else if (patient.appointment_status_id === this.state.checkInId) {
      swalMessage({
        title: "Visit already created, cannot edit the appointment",
        type: "warning"
      });
    } else {
      let openPatEdit = false;
      if (
        data !== null &&
        data.hims_d_appointment_status_id === this.state.RescheduleId
      ) {
        openPatEdit = true;
      }
      this.setState(
        {
          openPatEdit,
          edit_appointment_status_id: data.hims_d_appointment_status_id,
          edit_appt_date: patient.appointment_date,
          edit_appt_time: patient.appointment_from_time,
          edit_contact_number: patient.contact_number,
          edit_patient_name: patient.patient_name,
          edit_arabic_name: patient.arabic_name,
          edit_date_of_birth: patient.date_of_birth,
          edit_age: patient.age,
          edit_gender: patient.gender,
          edit_email: patient.email,
          edit_appointment_remarks: patient.appointment_remarks,
          edit_appointment_id: patient.hims_f_patient_appointment_id,
          edit_provider_id: patient.provider_id,
          edit_patient_id: patient.patient_id,
          edit_from_time: patient.appointment_from_time,
          edit_sub_dep_id: patient.sub_department_id,
          edit_appointment_date: patient.appointment_date,
          patient_code: patient.patient_code,
          edit_no_of_slots: patient.number_of_slot,
          edit_is_stand_by: openPatEdit ? "N" : patient.is_stand_by,
          edit_title_id: patient.title_id
        },
        () => {
          if (
            data !== null &&
            data.hims_d_appointment_status_id !== this.state.RescheduleId
          ) {
            this.updatePatientAppointment(data);
          } else {
            this.getTimeSlotsForDropDown(patient.provider_id);
          }
        }
      );
    }
  }

  updatePatientAppointment(data) {
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
          confirmButtonText: "Yes",
          confirmButtonColor: "#44b8bd",
          cancelButtonColor: "#d33",
          cancelButtonText: "No"
        }).then(willUpdate => {
          let new_to_time = moment(this.state.edit_appt_time, "HH:mm:ss").add(
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
                appointment_from_time: this.state.edit_appt_time,
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
              if (edit_details.appointment_status_id === this.state.checkInId) {
                this.handleCheckIn(edit_details);
              } else if (
                edit_details.appointment_status_id === this.state.cancelledId
              ) {
                this.cancelAppt(edit_details);
              } else {
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
                      this.setState({
                        openPatEdit: false
                      });
                      this.getAppointmentSchedule();
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
    } else if (pat.appointment_status_id === this.state.checkInId) {
      swalMessage({
        title: "Cannot re-schedule checked In patients",
        type: "error"
      });
      ev.preventDefault();
    } else {
      this.setState({
        patToEdit: pat,
        edit_appointment_status_id: pat.appointment_status_id,
        edit_appt_date: pat.appointment_date,
        edit_contact_number: pat.contact_number,
        edit_patient_name: pat.patient_name,
        edit_arabic_name: pat.arabic_name,
        edit_date_of_birth: pat.date_of_birth,
        edit_age: pat.age,
        edit_gender: pat.gender,
        edit_email: pat.email,
        edit_appointment_remarks: pat.appointment_remarks,
        edit_appointment_id: pat.hims_f_patient_appointment_id,
        edit_patient_id: pat.patient_id,
        edit_sub_dep_id: pat.sub_department_id,
        edit_appointment_date: pat.appointment_date,
        patient_code: pat.patient_code,
        edit_no_of_slots: pat.number_of_slot,
        edit_title_id: pat.title_id
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
    } else if (this.state.edit_appointment_status_id === this.state.checkInId) {
      swalMessage({
        title: "Cannot change schedule for CheckedIn Patients",
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
            confirmButtonText: "Yes",
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
                    <p>{item.patient_name}</p>
                    <span>
                      <i
                        className="fas fa-check"
                        onClick={this.handlePatient.bind(this, item, {
                          hims_d_appointment_status_id: this.state.checkInId
                        })}
                      />
                      <i
                        className="fas fa-clock"
                        onClick={this.handlePatient.bind(this, item, {
                          hims_d_appointment_status_id: this.state.RescheduleId
                        })}
                      />
                      <i
                        className="fas fa-times"
                        onClick={this.cancelAppt.bind(this, item)}
                      />
                    </span>
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
      const sel_stat_id =
        _firstPatient !== undefined ? _firstPatient.appointment_status_id : 0;

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
      if (_firstPatient !== undefined) {
        return (
          <React.Fragment>
            {_firstPatient.appointment_status_id === this.state.noShowId ? (
              <div
                className="dynPatient"
                style={{ background: "#f2f2f2" }}
                draggable={false}
              >
                <span>
                  {_firstPatient.patient_name} <br />
                  {_firstPatient.contact_number}
                </span>
              </div>
            ) : (
              <div
                appt-pat={JSON.stringify(_firstPatient)}
                className="dynPatient"
                style={{ background: "#f2f2f2" }}
              >
                <span>
                  {_firstPatient.patient_name}
                  <br />
                  {_firstPatient.contact_number}
                </span>

                <i
                  className="fas fa-times"
                  onClick={this.cancelAppt.bind(this, _firstPatient)}
                />
                <div className="appStatusListCntr">
                  <i className="fas fa-clock" />
                  <ul className="appStatusList">
                    {status !== undefined
                      ? status.map((data, index) => (
                          <li
                            key={index}
                            onClick={this.handlePatient.bind(
                              this,
                              _firstPatient,
                              data
                            )}
                          >
                            <span
                              style={{
                                backgroundColor: data.color_code
                              }}
                            >
                              {data.statusDesc}
                            </span>
                          </li>
                        ))
                      : null}
                    <li
                      onClick={generateReport.bind(
                        this,
                        _firstPatient,
                        "appointmentSlip",
                        "Appointment Slip"
                      )}
                    >
                      <span>Print App. Slip</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {this.loadSubStandBy(standByPatients)}
          </React.Fragment>
        );
      } else {
        return null;
      }
    }
  }

  isInactiveTimeSlot(time, date) {
    let activeDate = date ? date : this.state.activeDateHeader;
    if (moment(activeDate).isBefore(new Date(), "day")) {
      return true;
    } else if (moment(activeDate).isSame(new Date(), "day")) {
      return (
        moment(time, "HH:mm a").format("HHmm") <
        moment(new Date()).format("HHmm")
      );
    } else {
      return false;
    }
  }

  generateChildren(data) {
    const colspan = data.mark_as_break
      ? {
          colSpan: 2,
          style: {
            width: "300px",
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

    let status =
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
      ? "activeSlotOpacity"
      : this.isInactiveTimeSlot(data.time)
      ? "inActiveSlotOpacity"
      : "activeSlotOpacity";

    let isTodayActive = moment(this.state.activeDateHeader).isSame(
      moment(),
      "day"
    );
    if (!isTodayActive) {
      status = status.filter(
        stat => stat.hims_d_appointment_status_id !== this.state.checkInId
      );
    }

    let bg_color =
      patient != null
        ? this.getColorCode(patient.appointment_status_id)
        : data.mark_as_break
        ? "#f2f2f2"
        : this.isInactiveTimeSlot(data.time)
        ? "#fbfbfb"
        : "#ffffff";

    return (
      <tr
        className={brk_bg_color}
        style={{ cursor: "pointer" }}
        key={data.counter}
      >
        <td
          className="tg-baqh" //highlight-Drop
          {...colspan}
          onDrop={this.drop.bind(this)}
          onDragOver={this.allowDrop.bind(this)}
          onDragEnter={this.enterDrag.bind(this)}
          onDragLeave={this.leaveDrag.bind(this)}
        >
          {data.mark_as_break === false ? (
            <span className="dynSlot">{data.time}</span>
          ) : null}

          {data.mark_as_break === false ? (
            <React.Fragment>
              {this.plotAddIcon(patient, data)}

              {patient != null &&
              patient.is_stand_by === "N" &&
              patient.cancelled === "N" ? (
                patient.appointment_status_id === this.state.noShowId ? (
                  <div
                    className="dynPatient"
                    style={{ background: bg_color }}
                    draggable={false}
                  >
                    <span>
                      {patient.patient_name} <br /> {patient.contact_number}
                    </span>
                  </div>
                ) : (
                  <div
                    appt-pat={JSON.stringify(patient)}
                    className="dynPatient"
                    style={{ background: bg_color }}
                    draggable={true}
                    onDragStart={this.drag.bind(this)}
                  >
                    <span
                    // onClick={this.openEditModal.bind(this, patient, null)}
                    >
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
                                onClick={this.handlePatient.bind(
                                  this,
                                  patient,
                                  data
                                )}
                              >
                                <span
                                  style={{
                                    backgroundColor: data.color_code
                                  }}
                                >
                                  {data.statusDesc}
                                </span>
                              </li>
                            ))
                          : null}
                        <li
                          onClick={generateReport.bind(
                            this,
                            patient,
                            "appointmentSlip",
                            "Appointment Slip"
                          )}
                        >
                          <span>Print App. Slip</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )
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

  getTimeSlotsForDropDown(id) {
    let schedule;
    let data;
    let apptDate = this.state.edit_appt_date;
    let send_data = {
      sub_dept_id: this.state.sub_department_id,
      schedule_date: moment(this.state.edit_appt_date).format("YYYY-MM-DD"),
      provider_id: this.state.edit_provider_id
    };
    algaehApiCall({
      uri: "/appointment/getDoctorScheduleDateWise",
      module: "frontDesk",
      method: "GET",
      data: send_data,
      onSuccess: response => {
        if (response.data.success && response.data.records.length > 0) {
          schedule = response.data.records;
          data = schedule.filter(
            doc => doc.provider_id === this.state.edit_provider_id
          );
          const result = generateTimeslotsForDoctor(data[0]);
          let timeSlots = [];
          result.forEach(time => {
            if (time !== "break") {
              if (
                !this.isInactiveTimeSlot(time, apptDate) &&
                isEmpty(
                  this.plotPatients({
                    time,
                    slot: data[0].slot,
                    patients: data[0].patientList
                  })
                )
              ) {
                timeSlots.push({
                  name: moment(time, "HH:mm:ss").format("hh:mm a"),
                  value: time
                });
              }
            }
          });
          return this.setState({ timeSlots, schAvailable: true });
        } else {
          swalMessage({
            title: "There is no schedule Available for the doctor",
            type: "error"
          });
          return this.setState({
            timeSlots: [],
            schAvailable: false
          });
        }
      },
      onFailure: response => {
        swalMessage({
          title: "There is no schedule Available for the doctor",
          type: "error"
        });
        return this.setState({
          timeSlots: [],
          schAvailable: false
        });
      }
    });
  }

  generateTimeslots(data) {
    const {
      to_work_hr,
      from_break_hr1,
      from_break_hr2,
      to_break_hr1,
      to_break_hr2,
      slot,
      clinic_id,
      provider_id,
      sch_header_id,
      sch_detail_id,
      sub_dept_id,
      patientList
    } = data;

    const timeSlots = generateTimeslotsForDoctor(data);
    let isPrevbreak = null;
    let count = 0;
    let tds = [];
    timeSlots.forEach(time => {
      let isBreak = time === "break";
      if (isBreak) {
        isPrevbreak = {
          counter: count,
          mark_as_break: isBreak
        };
      } else {
        if (isPrevbreak !== null) {
          tds.push(this.generateChildren(isPrevbreak));
          isPrevbreak = null;
        }
        tds.push(
          this.generateChildren({
            time: moment(time, "HH:mm:ss").format("hh:mm a"),
            counter: count,
            to_work_hr: moment(to_work_hr).format("hh:mm a"),
            from_break_hr1: moment(from_break_hr1).format("hh:mm a"),
            to_break_hr1: moment(to_break_hr1).format("hh:mm a"),
            from_break_hr2: moment(from_break_hr2).format("hh:mm a"),
            to_break_hr2: moment(to_break_hr2).format("hh:mm a"),
            slot: parseInt(slot, 10),
            clinic_id,
            provider_id,
            sch_header_id,
            sch_detail_id,
            sub_dept_id,
            mark_as_break: isBreak,
            patients: patientList
          })
        );
      }
      count++;
    });

    return <React.Fragment>{tds}</React.Fragment>;
  }

  render() {
    return (
      <AppointmentComponent
        state={this.state}
        setState={this.setState}
        texthandle={e => this.texthandle(e)}
        handleClose={e => this.handleClose(e)}
        editDateHandler={selectedDate => this.editDateHandler(selectedDate)}
        editDateValidate={this.editDateValidate}
        dropDownHandle={e => this.dropDownHandle(e)}
        nullifyState={name => this.nullifyState(name)}
        updatePatientAppointment={data => this.updatePatientAppointment(data)}
        ageHandler={() => this.ageHandler()}
        dobHandler={e => this.dobHandler(e)}
        patientSearch={() => this.patientSearch()}
        validateAge={e => this.validateAge(e)}
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

function mapStateToProps(state) {
  return {
    visittypes: state.visittypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisittypes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Appointment)
);
