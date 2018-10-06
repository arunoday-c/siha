import React, { Component } from "react";
import "./appointment.css";
import moment from "moment";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDateHandler
} from "../Wrapper/algaehWrapper";
import Modal from "@material-ui/core/Modal";
import { algaehApiCall } from "../../utils/algaehApiCall";
import swal from "sweetalert";
import Enumerable from "linq";
import renderHTML from "react-render-html";
import algaehLoader from "../Wrapper/fullPageLoader";
import GlobalVariables from "../../utils/GlobalVariables.json";

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
      provider_id: null
    };
  }

  componentDidMount() {
    this.getDoctorsAndDepts();
    this.getAppointmentStatus();
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
          console.log("Pat Appts:", response.data.records);
          this.setState({
            patientAppointments: response.data.records
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

  addPatientAppointment(e) {
    e.preventDefault();

    const send_data = {
      provider_id: apptProvider,
      sub_department_id: apptSubDept,
      appointment_date: this.state.activeDateHeader,
      appointment_from_time: this.state.apptFromTime,
      appointment_to_time: "09:15:00",
      appointment_status_id: 1,
      patient_name: this.state.patient_name,
      arabic_name: "sdwdw",
      date_of_birth: "1992-09-07",
      age: 45,
      contact_number: 9987543094,
      email: "hhdg@gmail.com",
      send_to_provider: "Y",
      gender: "female",
      confirmed: "Y",
      confirmed_by: "3",
      comfirmed_date: "2018-07-08",
      cancelled: "N",
      cancelled_by: null,
      cancelled_date: null,
      cancel_reason: null
    };

    algaehApiCall({
      uri: "/appointment/addPatientAppointment",
      method: "POST",
      data: send_data,
      onSuccess: response => {
        if (response.data.success) {
          console.log("Add Pat APpts REsp :", response.data.records);
          this.setState({
            //departments: response.data.records
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
        swal(error.message, {
          buttons: false,
          icon: "error",
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
          //console.log("Appt Status:", response.data.records);
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

  getAppointmentSchedule() {
    this.getPatientAppointment();
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
        swal(error.message, {
          buttons: false,
          icon: "warning",
          timer: 2000
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
      this.setState({ doctors: dept.doctors }, () => {
        console.log("Docs", this.state.doctors);
      });
    });
  }

  dropDownHandle(value) {
    debugger;
    this.setState({ [value.name]: value.value });
  }

  handleClose() {
    this.setState({
      showApt: false
    });
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

  showModal(e) {
    debugger;
    const appt_time = e.currentTarget.getAttribute("appt-time");
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
      apptSubDept: sub_dept_id
    });
  }

  generateChilderns(data) {
    return (
      <tr key={data.counter}>
        <td className="tg-baqh">
          <span className="dynSlot">{data.time}</span>
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
        </td>
        <td className="tg-baqh">
          <span className="dynSlot">{data.time}</span>
          <i onClick={this.showModal.bind(this)} className="fas fa-plus" />
        </td>
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
    const slot = data.slot;

    let tds = [];
    let count = 0;
    for (;;) {
      let newFrom =
        count === 0 ? from_work_hr : from_work_hr.add(slot, "minutes");
      if (newFrom.isBefore(to_work_hr)) {
        debugger;
        let endtime = new Date(newFrom.format("hh:mm a"));
        endtime.setMinutes(endtime.getMinutes() + slot);
        if (
          (to_break_hr1.format("hh:mm a") > newFrom.format("hh:mm a") &&
            to_break_hr1.format("hh:mm a") <= endtime) ||
          (from_break_hr1.format("hh:mm a") <= newFrom.format("hh:mm a") &&
            to_break_hr1.format("hh:mm a") >= endtime)
        ) {
          console.log("Break Time1 From:", from_break_hr1);
          console.log("Break Time1 To:", to_break_hr1);
          break;
        } else if (
          (to_break_hr2.format("hh:mm a") > newFrom.format("hh:mm a") &&
            to_break_hr2.format("hh:mm a") <= endtime) ||
          (from_break_hr2.format("hh:mm a") <= newFrom.format("hh:mm a") &&
            to_break_hr2.format("hh:mm a") >= endtime)
        ) {
          console.log("Break Time2 From:", from_break_hr2);
          console.log("Break Time2 To:", to_break_hr2);
          break;
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
            sub_dept_id: sub_dept_id
          })
        );
      } else {
        break;
      }
      count = count + 1;
    }
    return <React.Fragment>{tds}</React.Fragment>;
  }

  createDoctorTimeSlot(options) {
    let tds = [];
    const duration = options.slot;
    const _from_hr = moment(options.from_work_hr, "hh:mm:ss");
    let _to_hr = moment(options.to_work_hr, "hh:mm:ss");
    let count = 0;
    for (;;) {
      let newFrom = count === 0 ? _from_hr : _from_hr.add(duration, "minutes");
      if (newFrom.isBefore(_to_hr)) {
        tds.push({
          provider_id: options.provider_id,
          clinic_id: options.clinic_id,
          hims_d_appointment_schedule_detail_id:
            options.hims_d_appointment_schedule_detail_id
        });
        // tds +="<td class='tg-baqh'><span class='dynSlot'>"+newFrom.format("hh:mm tt")+"</span><span></span></td>";
      } else {
        break;
      }

      count = count + 1;
    }
    return tds;
  }

  plotAppointments(appointmentSchedule) {
    let timeing = [];
    let componentElementDoctors = "<table class='tg'><tbody><tr>";
    let componetElementBookStandBy = "<tr>";
    if (appointmentSchedule === undefined)
      return componentElementDoctors + "</tr>";

    const docLength = appointmentSchedule.length;
    const tdCount = docLength * 2;
    let componetElementTiming = "<tr>";

    appointmentSchedule.map((doctors, index) => {
      componentElementDoctors +=
        "<th key='" +
        index +
        "' class='tg-amwm' colspan='2'>" +
        doctors.first_name +
        " " +
        doctors.last_name +
        "</th>";
      componetElementBookStandBy +=
        "<td class='tg-baqh'>BOOKED</td> <td class='tg-baqh'>STANDBY</td>";
      timeing.push(this.createDoctorTimeSlot(doctors));
    });
    componentElementDoctors += "</tr>";
    componetElementBookStandBy += "</tr>";

    if (docLength != 0) {
      let docCount = 0;
      let maxTdLength = 0;
      for (let k = 0; k < timeing.length; k++) {
        if (timeing[k].length > maxTdLength) maxTdLength = timeing[k].length;
      }

      for (let i = docCount; i < timeing.length; i++) {
        let row = 0;
        if (timeing[i].length <= maxTdLength) {
          row = row + 1;
        } else {
          break;
        }
        for (let j = 0; j < tdCount; j++) {}
      }
    }

    //console.log("Max lenght", maxTime);
    return (
      componentElementDoctors + componetElementBookStandBy + "</tbody></table>"
    );
  }

  render() {
    return (
      <div className="appointment">
        {/* Pop up start */}
        <Modal open={this.state.showApt}>
          <div className="algaeh-modal" style={{ width: 500 }}>
            <div className="popupHeader">
              <h4>Book an Appointment</h4>
            </div>
            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12 popRightDiv">
                    <div className="row">
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Appointment Date"
                          }}
                        />
                        <h6>
                          {moment(this.state.activeDateHeader).format(
                            "DD-MM-YYYY"
                          )}
                        </h6>
                      </div>
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Appointment Time"
                          }}
                        />
                        <h6>{this.state.apptFromTime}</h6>
                      </div>
                      <AlagehAutoComplete
                        div={{ className: "col-lg-4" }}
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
                      <AlagehFormGroup
                        div={{ className: "col-lg-4 margin-top-15" }}
                        label={{
                          forceLabel: "Patient Code",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "patient_code",
                          others: {
                            disabled: false
                          },
                          value: this.state.patient_code,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />

                      <div className="col-lg-1">
                        <i className="fas fa-search" />
                      </div>

                      <AlagehFormGroup
                        div={{ className: "col-lg-8 margin-top-15" }}
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

                      <AlgaehDateHandler
                        div={{ className: "col-lg-4 margin-top-15" }}
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
                        div={{ className: "col-lg-4 margin-top-15" }}
                        label={{
                          forceLabel: "Age",
                          isImp: true
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
                        div={{ className: "col-lg-4 margin-top-15" }}
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

                      <AlagehFormGroup
                        div={{ className: "col-lg-4 margin-top-15" }}
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
                        div={{ className: "col-lg-8 margin-top-15" }}
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
                          name: "full_name",
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
        {/* Pop up end */}

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
                {this.state.appointmentSchedule.length !== 0
                  ? this.state.appointmentSchedule.map((data, index) => (
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
                        <tbody>
                          {this.generateTimeslots(data)}
                          {/* {renderHTML(this.generateTimeslots(data))} */}
                          {/* <tr>
                            <td className="tg-baqh">
                              <span className="dynSlot">09:00 AM</span>
                              <i
                                onClick={this.showModal.bind(this)}
                                className="fas fa-pen"
                              />
                              <i
                                onClick={this.showModal.bind(this)}
                                className="fas fa-times"
                              />
                              <span className="dynPatient">John Doe</span>
                            </td>
                            <td className="tg-baqh">
                              <span className="dynSlot">09:00 AM</span>
                              <i
                                onClick={this.showModal.bind(this)}
                                className="fas fa-plus"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="tg-baqh">
                              <span className="dynSlot">09:00 AM</span>
                              <i
                                onClick={this.showModal.bind(this)}
                                className="fas fa-plus"
                              />
                            </td>
                            <td className="tg-baqh">
                              <span className="dynSlot">09:00 AM</span>
                              <i
                                onClick={this.showModal.bind(this)}
                                className="fas fa-plus"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="tg-baqh">
                              <span className="dynSlot">09:00 AM</span>
                              <i
                                onClick={this.showModal.bind(this)}
                                className="fas fa-plus"
                              />
                            </td>
                            <td className="tg-baqh">
                              <span className="dynSlot">09:00 AM</span>
                              <i
                                onClick={this.showModal.bind(this)}
                                className="fas fa-plus"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="tg-baqh">
                              <span className="dynSlot">09:00 AM</span>
                              <i
                                onClick={this.showModal.bind(this)}
                                className="fas fa-plus"
                              />
                            </td>
                            <td className="tg-baqh">
                              <span className="dynSlot">09:00 AM</span>
                              <i
                                onClick={this.showModal.bind(this)}
                                className="fas fa-plus"
                              />
                            </td>
                          </tr>
                          <tr> 
                            <td className="tg-baqh">
                              <span className="dynSlot">09:00 AM</span>
                              <i
                                onClick={this.showModal.bind(this)}
                                className="fas fa-plus"
                              />
                            </td>
                            <td className="tg-baqh">
                              <span className="dynSlot">09:00 AM</span>
                              <i
                                onClick={this.showModal.bind(this)}
                                className="fas fa-plus"
                              />
                            </td>
                          </tr>*/}
                        </tbody>
                      </table>
                    ))
                  : "No Doctors available for the selected criteria"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Appointment;
