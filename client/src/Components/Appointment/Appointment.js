import React, { Component } from "react";
import "./appointment.css";
import moment from "moment";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDateHandler
} from "../Wrapper/algaehWrapper";
import { setGlobal } from "../../utils/GlobalFunctions";
import Modal from "@material-ui/core/Modal";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import Enumerable from "linq";
import algaehLoader from "../Wrapper/fullPageLoader";
import GlobalVariables from "../../utils/GlobalVariables.json";
import FrontDesk from "../../Search/FrontDesk.json";
import AlgaehSearch from "../Wrapper/globalSearch";

class Appointment extends Component {
  constructor(props) {
    super(props);
    let dateToday = moment().format("YYYY") + moment().format("MM") + "01";
    this.state = {
      selectedHDate: moment(dateToday, "YYYYMMDD")._d,
      fromDate: new Date(),
      toDate: new Date(),
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
      checkInId: null
    };
  }

  componentDidMount() {
    this.getDoctorsAndDepts();
    this.getAppointmentStatus();
  }

  getDoctorName(id) {
    let doc = Enumerable.from(
      this.state.doctors.length !== 0 ? this.state.doctors : null
    )
      .where(w => w.employee_id === parseInt(id))
      .firstOrDefault();
    return doc !== undefined ? doc.full_name : "";
  }

  getDeptName(id) {
    let dept = Enumerable.from(
      this.state.departments.length !== 0 ? this.state.departments : null
    )
      .where(w => w.sub_department_id === parseInt(id))
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
        console.log("Selected Row:", row);
        this.setState(
          {
            patient_code: row.patient_code,
            patient_id: row.hims_d_patient_id,
            patient_name: row.full_name,
            age: row.age,
            date_of_birth: row.date_of_birth,
            gender: row.gender,
            contact_number: row.contact_number,
            email: row.email
          }
          // ,
          // () => {
          //   setGlobal({
          //     "FD-STD": "RegistrationPatient",
          //     "pat-code": this.state.patient_code
          //   });
          //   document.getElementById("fd-router").click();
          // }
        );
      }
    });
  }

  getPatient(e) {
    e.preventDefault();
    if (this.state.patient_code.length === 0) {
      swalMessage({
        title: "Please Enter the Patient Code",
        type: "warning"
      });
    } else {
      algaehApiCall({
        uri: "/patient/get",
        method: "GET",
        data: {
          patient_code: this.state.patient_code
        },
        onSuccess: response => {
          if (response.data.success) {
            let pat_obj = response.data.records[0];
            this.setState({
              age: pat_obj.age,
              arabic_name: pat_obj.arabic_name,
              patient_name: pat_obj.full_name,
              gender: pat_obj.gender,
              contact_number: pat_obj.contact_number,
              date_of_birth: pat_obj.date_of_birth,
              email: pat_obj.email
            });

            console.log("Pat Code:", response.data.records);
          }
        },
        onFailure: error => {
          swalMessage({
            title: "Patient Not Found",
            type: "warning"
          });
        }
      });
    }
  }

  getPatientAppointment(e) {
    algaehApiCall({
      uri: "/appointment/getPatientAppointment",
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
      date_of_birth: "",
      age: "",
      contact_number: "",
      email: "",
      appointment_remarks: ""
    });
  }

  addPatientAppointment(e) {
    e.preventDefault();

    let from_time = this.state.apptFromTime;
    let duration_minutes = this.state.apptSlot * this.state.no_of_slots;
    let to_time = moment(from_time, "hh:mm a")
      .add(duration_minutes, "minutes")
      .format("HH:mm:ss");

    let appt_date =
      this.state.activeDateHeader !== undefined
        ? this.state.activeDateHeader
        : new Date();

    //     if(from_time <new Date()){
    // swalMessage ({
    //   title: "Cannot create slot for pas ",
    //   type: "success"
    // })
    //     }

    const send_data = {
      patient_id: this.state.patient_id,
      patient_code: this.state.patient_code,
      provider_id: this.state.apptProvider,
      sub_department_id: this.state.apptSubDept,
      appointment_date: moment(appt_date).format("YYYY-MM-DD"),
      appointment_from_time: moment(this.state.apptFromTime, "hh:mm a").format(
        "HH:mm:ss"
      ),
      appointment_to_time: to_time,
      appointment_status_id: this.state.appointment_status_id,
      patient_name: this.state.patient_name,
      arabic_name: this.state.arabic_name,
      date_of_birth: this.state.date_of_birth,
      age: this.state.age,
      contact_number: this.state.contact_number,
      email: this.state.email,
      send_to_provider: "Y",
      gender: this.state.gender,
      appointment_remarks: this.state.appointment_remarks
    };
    //console.log("Send Obj:", send_data);

    algaehApiCall({
      uri: "/appointment/addPatientAppointment",
      method: "POST",
      data: send_data,
      onSuccess: response => {
        if (response.data.success) {
          this.clearSaveState();
          swalMessage({
            title: "Appointment Created Successfully",
            type: "success"
          });
          this.setState({ showApt: false });
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

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/selectDoctorsAndClinic",
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

  getAppointmentStatus() {
    algaehApiCall({
      uri: "/appointment/getAppointmentStatus",
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

            this.setState({
              defaultStatus: DefaultStatus,
              appointment_status_id:
                DefaultStatus !== undefined
                  ? DefaultStatus.hims_d_appointment_status_id
                  : null,
              checkInId:
                CreateVisit !== undefined
                  ? CreateVisit.hims_d_appointment_status_id
                  : null
            });
          });

          //console.log("Default Status:", this.state.defaultStatus);
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

  getAppointmentSchedule() {
    algaehLoader({ show: true });
    algaehApiCall({
      uri: "/appointment/getDoctorScheduleDateWise",
      method: "GET",
      data: {
        sub_dept_id: this.state.sub_department_id,
        schedule_date: moment(this.state.activeDateHeader).format("YYYY-MM-DD"),
        provider_id: this.state.provider_id
      },
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          console.log("Appt Schedule:", response.data.records);
          this.setState({ appointmentSchedule: response.data.records });
        }
      },
      onFailure: error => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  onSelectedDateHandler(e) {
    this.setState({
      activeDateHeader: e.target.getAttribute("date"),
      fromDate: e.target.getAttribute("date"),
      toDate: e.target.getAttribute("date")
      // selectedHDate: e.target.getAttribute("date")
    });
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
      this.setState({ doctors: dept.doctors });
    });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  handleClose() {
    this.setState({
      showApt: false,
      openPatEdit: false
    });
    this.clearSaveState();
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

    while (initialDate <= endDate) {
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
    //let classesCurrentDate = moment().format("YYYYMMDD");

    return (
      <div className="calendar">
        <div className="col-12">
          <div className="row">
            {this.liGenerate().map((row, index) => {
              return (
                <div
                  // className="col"
                  key={index}
                  date={row.currentdate}
                  className={
                    moment(row.currentdate).format("YYYYMMDD") ===
                    moment(this.state.activeDateHeader).format("YYYYMMDD")
                      ? moment(row.currentdate).format("YYYYMMDD") ===
                        moment().format("YYYYMMDD")
                        ? "col activeDate CurrentDate"
                        : "col activeDate"
                      : moment(row.currentdate).format("YYYYMMDD") ===
                        moment().format("YYYYMMDD")
                        ? "col CurrentDate"
                        : "col"
                  }
                  onClick={this.onSelectedDateHandler.bind(this)}
                >
                  {row.day}
                  <span>{row.dayName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  openEditModal(patient, e) {
    debugger;
    console.log("Edit Pat Data:", patient);
    this.setState({ patToEdit: patient, openPatEdit: true }, () => {
      let pat_edit = this.state.patToEdit;
      this.setState({
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
        edit_to_time: pat_edit.appointment_to_time,
        edit_arabic_name: pat_edit.arabic_name,
        edit_sub_dep_id: pat_edit.sub_department_id,
        edit_appointment_date: pat_edit.appointment_date,
        patient_code: pat_edit.patient_code
      });
    });
  }

  updatePatientAppointment() {
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
      contact_number: this.state.edit_contact_number,
      email: "",
      send_to_provider: null,
      gender: this.state.edit_gender,
      confirmed: null,
      confirmed_by: null,
      comfirmed_date: null,
      cancelled: null,
      cancelled_by: null,
      cancelled_date: null,
      cancel_reason: null,
      appointment_remarks: null,
      is_stand_by: null
    };

    algaehApiCall({
      uri: "/appointment/updatePatientAppointment",
      method: "PUT",
      data: edit_details,
      onSuccess: response => {
        if (response.data.success) {
          debugger;
          if (edit_details.appointment_status_id === this.state.checkInId) {
            setGlobal({
              "FD-STD": "RegistrationPatient",
              "appt-pat-code": this.state.patient_code,
              "appt-provider-id": this.state.edit_provider_id,
              "appt-dept-id": this.state.edit_sub_dep_id
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

  showModal(e) {
    debugger;
    const appt_time = e.currentTarget.getAttribute("appt-time");

    if (
      moment(appt_time, "HH:mm a").format("HHMM") <
      moment(new Date()).format("HHMM")
    ) {
      swalMessage({
        title: "Can't create schedule for past time",
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
      const sub_dep_name = this.getDeptName(sub_dept_id);
      const doc_name = this.getDoctorName(provider_id);

      this.setState({
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
        apptProviderName: doc_name
      });
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
      .firstOrDefault();
    if (patient !== undefined) {
      return patient;
    } else {
      return null;
    }
  }

  generateChilderns(data) {
    const colspan = data.mark_as_break
      ? { colSpan: 2, style: { width: "240px" } }
      : {};

    const patient = this.plotPatients({
      time: data.time,
      slot: data.slot,
      patients: data.patients
    });

    let brk_bg_color = data.mark_as_break ? "#f2f2f2" : "#ffffff";

    let bg_color =
      patient !== null
        ? this.getColorCode(patient.appointment_status_id)
        : data.mark_as_break
          ? "#f2f2f2"
          : "#ffffff";

    return (
      <tr
        style={{ background: brk_bg_color, cursor: "pointer" }}
        key={data.counter}
      >
        <td className="tg-baqh" {...colspan} style={{ background: bg_color }}>
          {data.mark_as_break == false ? (
            <span className="dynSlot">{data.time}</span>
          ) : null}

          {data.mark_as_break === false ? (
            <React.Fragment>
              {patient === null ? (
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
                  onClick={this.showModal.bind(this)}
                  className="fas fa-plus"
                />
              ) : (
                <i
                  className="fas fa-edit"
                  onClick={this.openEditModal.bind(this, patient)}
                />
              )}

              {patient !== null ? (
                <span className="dynPatient">
                  {patient.patient_name}
                  <span
                    className="statusClr"
                    style={{
                      background:
                        patient !== undefined
                          ? this.getColorCode(patient.appointment_status_id)
                          : null
                    }}
                  />
                </span>
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
            {patient === null ? (
              <i onClick={this.showModal.bind(this)} className="fas fa-plus" />
            ) : (
              <i onClick={this.showModal.bind(this)} className="fas fa-edit" />
            )}
          </td>
        ) : null}
      </tr>
    );
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
    const slot = parseInt(data.slot);
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

  render() {
    return (
      <div className="appointment">
        {/* Appointment Module Start */}
        <div id="appointment-module">
          {/* Edit Pop up Start */}
          <Modal open={this.state.openPatEdit}>
            <div className="algaeh-modal" style={{ width: "55vw" }}>
              <div className="popupHeader">
                <h4>Edit Appointment</h4>
              </div>
              <div className="popupInner">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-12 popRightDiv">
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col-lg-3" }}
                          label={{
                            forceLabel: "Select Status",
                            isImp: true
                          }}
                          selector={{
                            name: "edit_appointment_status_id",
                            className: "select-fld",
                            value: this.state.edit_appointment_status_id,
                            dataSource: {
                              textField: "description",
                              valueField: "hims_d_appointment_status_id",
                              data: this.state.appointmentStatus
                            },
                            onChange: this.dropDownHandle.bind(this)
                          }}
                        />
                        <AlgaehDateHandler
                          div={{ className: "col-lg-3" }}
                          label={{
                            forceLabel: "APPOINTMENT Date"
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "edit_appt_date"
                          }}
                          events={{
                            onChange: selectedDate => {
                              this.setState(
                                { edit_appt_date: selectedDate },
                                () => {
                                  this.setState({
                                    edit_age: moment().diff(
                                      this.state.edit_appt_date,
                                      "years"
                                    )
                                  });
                                }
                              );
                            }
                          }}
                          value={this.state.edit_appt_date}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            forceLabel: "Appointment Time"
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "edit_appt_time",
                            value: this.state.edit_appt_time,
                            events: {
                              onChange: this.texthandle.bind(this)
                            },
                            others: {
                              type: "time",
                              disabled: true
                            }
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-lg-3" }}
                          label={{
                            forceLabel: "Select Slots",
                            isImp: true
                          }}
                          selector={{
                            name: "edit_no_of_slots",
                            className: "select-fld",
                            value: this.state.edit_no_of_slots,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.NO_OF_SLOTS
                            },
                            onChange: this.dropDownHandle.bind(this)
                          }}
                        />
                      </div>

                      <div className="row">
                        <AlagehFormGroup
                          div={{ className: "col-lg-6 margin-top-15" }}
                          label={{
                            forceLabel: "Patient Name",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "edit_patient_name",
                            value: this.state.edit_patient_name,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-lg-6 margin-top-15" }}
                          label={{
                            forceLabel: "Patient Name Arabic",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "edit_arabic_name",
                            value: this.state.edit_arabic_name,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />

                        <AlgaehDateHandler
                          div={{ className: "col-lg-3 margin-top-15" }}
                          label={{
                            forceLabel: "Date of Birth"
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "edit_date_of_birth"
                          }}
                          events={{
                            onChange: selectedDate => {
                              this.setState(
                                { date_of_birth: selectedDate },
                                () => {
                                  this.setState({
                                    edit_age: moment().diff(
                                      this.state.edit_date_of_birth,
                                      "years"
                                    )
                                  });
                                }
                              );
                            }
                          }}
                          value={this.state.edit_date_of_birth}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-2 margin-top-15" }}
                          label={{
                            forceLabel: "Age",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "edit_age",
                            others: {
                              type: "number"
                            },
                            value: this.state.edit_age,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />

                        <AlagehAutoComplete
                          div={{ className: "col-lg-3 margin-top-15" }}
                          label={{
                            forceLabel: "Gender",
                            isImp: true
                          }}
                          selector={{
                            name: "edit_gender",
                            className: "select-fld",
                            value: this.state.edit_gender,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_GENDER
                            },
                            onChange: this.dropDownHandle.bind(this)
                          }}
                        />

                        {/* <AlagehAutoComplete
                          div={{ className: "col-lg-3" }}
                          label={{
                            forceLabel: "Select Status",
                            isImp: true
                          }}
                          selector={{
                            name: "appointment_status_id",
                            className: "select-fld",
                            value: this.state.appointment_status_id,
                            dataSource: {
                              textField: "description",
                              valueField: "hims_d_appointment_status_id",
                              data: this.state.appointmentStatus
                            },
                            onChange: this.dropDownHandle.bind(this)
                          }}
                        /> */}

                        <AlagehFormGroup
                          div={{ className: "col-lg-6 margin-top-15" }}
                          label={{
                            forceLabel: "Mobile No.",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "edit_contact_number",
                            others: {
                              type: "number"
                            },
                            value: this.state.edit_contact_number,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-6 margin-top-15" }}
                          label={{
                            forceLabel: "Email Address",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "edit_email",
                            value: this.state.edit_email,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-12 margin-top-15" }}
                          label={{
                            forceLabel: "Remarks",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "edit_appointment_remarks",
                            value: this.state.edit_appointment_remarks,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className="popupFooter">
                <div className="col-lg-12">
                  <button
                    onClick={this.updatePatientAppointment.bind(this)}
                    type="button"
                    className="btn btn-primary"
                  >
                    Update
                  </button>
                  <button
                    onClick={this.handleClose.bind(this)}
                    type="button"
                    className="btn btn-other"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          {/* Edit Pop up End */}

          {/* Add Pop up start */}
          <Modal open={this.state.showApt}>
            <div className="algaeh-modal" style={{ width: "55vw" }}>
              <div className="popupHeader">
                <h4>Book an Appointment</h4>
              </div>
              <div className="popupInner">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-12 popRightDiv">
                      {/* <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          forceLabel: "Select Status",
                          isImp: true
                        }}
                        selector={{
                          name: "appointment_status_id",
                          className: "select-fld",
                          value: this.state.appointment_status_id,
                          dataSource: {
                            textField: "description",
                            valueField: "hims_d_appointment_status_id",
                            data: this.state.appointmentStatus
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />
                      <AlgaehDateHandler
                        div={{ className: "col-lg-3" }}
                        label={{
                          forceLabel: "APPOINTMENT Date"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "date_of_birth"
                        }}
                        events={{
                          onChange: selectedDate => {
                            this.setState(
                              { date_of_birth: selectedDate },
                              () => {
                                this.setState({
                                  age: moment().diff(
                                    this.state.date_of_birth,
                                    "years"
                                  )
                                });
                              }
                            );
                          }
                        }}
                        value={this.state.date_of_birth}
                      />
                      <AlgaehDateHandler
                        div={{ className: "col-lg-3" }}
                        label={{
                          forceLabel: "APPOINTMENT TIME"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "date_of_birth"
                        }}
                        events={{
                          onChange: selectedDate => {
                            this.setState(
                              { date_of_birth: selectedDate },
                              () => {
                                this.setState({
                                  age: moment().diff(
                                    this.state.date_of_birth,
                                    "years"
                                  )
                                });
                              }
                            );
                          }
                        }}
                        value={this.state.date_of_birth}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          forceLabel: "Select Slots",
                          isImp: true
                        }}
                        selector={{
                          name: "no_of_slots",
                          className: "select-fld",
                          value: this.state.no_of_slots,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.NO_OF_SLOTS
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />
                    </div> */}
                      {/* <div className="row">
                      <div className="col-lg-3 margin-top-15">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Department"
                          }}
                        />
                        <h6>{this.state.apptSubDeptName}</h6>
                      </div>

                      <div className="col-lg-2 margin-top-15">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Doctor"
                          }}
                        />
                        <h6>{this.state.apptProviderName}</h6>
                      </div>
                    </div> */}
                      <div className="row">
                        <div className="col-lg-3 margin-top-15">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Appo. Date"
                            }}
                          />
                          <h6>
                            {moment(this.state.activeDateHeader).format(
                              "DD-MM-YYYY"
                            )}
                          </h6>
                        </div>

                        <div className="col-lg-2 margin-top-15">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Appo. Time"
                            }}
                          />
                          <h6>{this.state.apptFromTime}</h6>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-lg-3 margin-top-15" }}
                          label={{
                            forceLabel: "Patient Code",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_code",
                            others: {
                              disabled: true
                            },
                            value: this.state.patient_code,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />

                        <div
                          className="col-lg-1"
                          style={{ paddingTop: "40px" }}
                        >
                          <i
                            //onClick={this.getPatient.bind(this)}
                            onClick={this.patientSearch.bind(this)}
                            className="fas fa-search"
                            style={{ marginLeft: "-75%", cursor: "pointer" }}
                          />
                        </div>
                        <AlagehAutoComplete
                          div={{ className: "col-lg-3 margin-top-15" }}
                          label={{
                            forceLabel: "Select Slots",
                            isImp: true
                          }}
                          selector={{
                            name: "no_of_slots",
                            className: "select-fld",
                            value: this.state.no_of_slots,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.NO_OF_SLOTS
                            },
                            onChange: this.dropDownHandle.bind(this)
                          }}
                        />
                      </div>

                      <div className="row">
                        <AlagehFormGroup
                          div={{ className: "col-lg-6 margin-top-15" }}
                          label={{
                            forceLabel: "Patient Name",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_name",
                            value: this.state.patient_name,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-lg-6 margin-top-15" }}
                          label={{
                            forceLabel: "Patient Name Arabic",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "arabic_name",
                            value: this.state.arabic_name,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />

                        <AlgaehDateHandler
                          div={{ className: "col-lg-3 margin-top-15" }}
                          label={{
                            forceLabel: "Date of Birth"
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "date_of_birth"
                          }}
                          events={{
                            onChange: selectedDate => {
                              this.setState(
                                { date_of_birth: selectedDate },
                                () => {
                                  this.setState({
                                    age: moment().diff(
                                      this.state.date_of_birth,
                                      "years"
                                    )
                                  });
                                }
                              );
                            }
                          }}
                          value={this.state.date_of_birth}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-2 margin-top-15" }}
                          label={{
                            forceLabel: "Age",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "age",
                            others: {
                              type: "number"
                            },
                            value: this.state.age,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />

                        <AlagehAutoComplete
                          div={{ className: "col-lg-3 margin-top-15" }}
                          label={{
                            forceLabel: "Gender",
                            isImp: true
                          }}
                          selector={{
                            name: "gender",
                            className: "select-fld",
                            value: this.state.gender,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_GENDER
                            },
                            onChange: this.dropDownHandle.bind(this)
                          }}
                        />

                        <AlagehAutoComplete
                          div={{ className: "col-lg-3" }}
                          label={{
                            forceLabel: "Select Status",
                            isImp: true
                          }}
                          selector={{
                            name: "appointment_status_id",
                            className: "select-fld",
                            value: this.state.appointment_status_id,
                            dataSource: {
                              textField: "description",
                              valueField: "hims_d_appointment_status_id",
                              data: this.state.appointmentStatus
                            },
                            onChange: this.dropDownHandle.bind(this)
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-6 margin-top-15" }}
                          label={{
                            forceLabel: "Mobile No.",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "contact_number",
                            others: {
                              type: "number"
                            },
                            value: this.state.contact_number,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-6 margin-top-15" }}
                          label={{
                            forceLabel: "Email Address",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "email",
                            value: this.state.email,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-12 margin-top-15" }}
                          label={{
                            forceLabel: "Remarks",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "appointment_remarks",
                            value: this.state.appointment_remarks,
                            events: {
                              onChange: this.texthandle.bind(this)
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className="popupFooter">
                <div className="col-lg-12">
                  <button
                    onClick={this.addPatientAppointment.bind(this)}
                    type="button"
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                  <button
                    onClick={this.handleClose.bind(this)}
                    type="button"
                    className="btn btn-other"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          {/* Add Pop up end */}

          {/* Calendar Component Starts */}
          <div className="row">
            <div className="my-calendar col-lg-12">
              <div style={{ height: "34px" }}>
                <div className="myDay_date">
                  <input
                    type="month"
                    onChange={this.monthChangeHandler.bind(this)}
                    value={moment(this.state.selectedHDate).format("YYYY-MM")}
                  />
                </div>
              </div>
              {this.generateHorizontalDateBlocks()}
            </div>
          </div>
          {/* Calendar Component Ends */}

          {/* Filter Bar Start */}
          <div className="row inner-top-search">
            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "department_name"
              }}
              selector={{
                name: "sub_department_id",
                className: "select-fld",
                value: this.state.sub_department_id,
                dataSource: {
                  textField: "sub_department_name",
                  valueField: "sub_dept_id",
                  data: this.state.departments
                },
                onChange: this.deptDropDownHandler.bind(this)
              }}
              error={this.state.department_error}
              helperText={this.state.department_error_text}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Filter by Doctor"
              }}
              selector={{
                name: "provider_id",
                className: "select-fld",
                value: this.state.provider_id,
                dataSource: {
                  textField: "full_name",
                  valueField: "provider_id",
                  data: this.state.doctors
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <div className="col-lg-1 form-group margin-top-15">
              <span
                onClick={this.getAppointmentSchedule.bind(this)}
                style={{ cursor: "pointer" }}
                className="fas fa-search fa-2x"
              />
            </div>
            <div className="col-lg-5" />
          </div>
          {/* Filter Bar End */}

          <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
            {/* Portlet Top Bar Start */}
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Doctors Availability</h3>
              </div>
              <div className="actions">
                <ul className="ul-legend">
                  {this.state.appointmentStatus !== undefined
                    ? this.state.appointmentStatus.map((data, index) => (
                        <li key={index}>
                          <span
                            style={{
                              backgroundColor: data.color_code
                            }}
                          />
                          {data.description}
                        </li>
                      ))
                    : null}
                </ul>
              </div>
            </div>
            {/* Portlet Top Bar End */}

            <div className="portlet-body">
              <div className="appointment-outer-cntr">
                <div className="appointment-inner-cntr">
                  {/* Table Start */}
                  {this.state.appointmentSchedule.length !== 0 ? (
                    this.state.appointmentSchedule.map((data, index) => (
                      <table key={index} className="tg">
                        <thead>
                          <tr>
                            {/* <th className="tg-c3ow">Time</th> */}
                            <th className="tg-amwm" colSpan="2">
                              {data.first_name + " " + data.last_name}
                              {/* Dr. Norman John */}
                            </th>
                          </tr>
                          <tr>
                            {/* <td className="tg-baqh"><span class="dynSlot">09:00 AM</span><i onClick={this.showModal.bind(this)} className="fas fa-plus"/></td> */}
                            <th className="tbl-subHdg">BOOKED</th>
                            <th className="tbl-subHdg">STANDBY</th>
                          </tr>
                        </thead>
                        <tbody>{this.generateTimeslots(data)}</tbody>
                      </table>
                    ))
                  ) : (
                    <span className="noDoctor">
                      No Doctors available for the selected criteria
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Appointment Module End */}

        {/* <div
          id="patient-registration"
          className="d-none"
          style={{ display: "none" }}
        >
          <RegistrationPatient
            patient_code={this.state.patient_code}
            provider_id={this.state.provider_id}
            dept_id={this.state.sub_department_id}
          />
        </div> */}
      </div>
    );
  }
}

export default Appointment;
