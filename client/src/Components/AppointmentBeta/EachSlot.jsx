import React, { useContext, memo } from "react";
import { useHistory } from "react-router-dom";
import algaehLoader from "../Wrapper/fullPageLoader";
// import {
//       generateReport,
//   } from "./AppointmentHelper";

//   import { getLabelFromLanguage } from "../../utils/GlobalFunctions";
import {
  MainContext,
  AlgaehLabel,
  // AlgaehAutoComplete,
  // AlgaehDateHandler,
  persistStateOnBack,
} from "algaeh-react-components";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import Enumerable from "linq";
import "./appointment.scss";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import swal from "sweetalert2";
import StandBySlot from "./StandBySlot";
// import { AppointmentContext } from "./AppointmentContext";
import { setGlobal, AlgaehValidation } from "../../utils/GlobalFunctions";
export default memo(function EachSlot({
  setState,
  data,
  // handleCheckIn,
  // updatePatientAppointment,
  state,
  // isInactiveTimeSlot,
  // getTimeSlotsForDropDown,
  // cancelAppt,
  clearSaveState,
  // plotPatients,
  // getAppointmentSchedule,
}) {
  const history = useHistory();
  // const { setstate, state, clearState } = useContext(
  //   AppointmentContext
  // );
  // useEffect(() => {
  //   console.log(state);
  // }, [state]);
  const getAppointmentSchedule = (e) => {
    if (e !== undefined) e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      skip: state.byPassValidation,
      onSuccess: () => {
        setState({ byPassValidation: false });
        let send_data = {
          sub_dept_id: state.sub_department_id,
          schedule_date: moment(state.activeDateHeader).format("YYYY-MM-DD"),
          provider_id: state.provider_id,
        };

        localStorage.setItem(
          "ApptCriteria",
          JSON.stringify({
            sub_dept_id: state.sub_department_id,
            schedule_date: moment(state.activeDateHeader).format("YYYY-MM-DD"),
            provider_id: state.provider_id,
            doctors: state.doctors,
          })
        );
        getAppointmentScheduleFunc(send_data);
        algaehLoader({ show: true });
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  const getAppointmentScheduleFunc = (send_data) => {
    algaehApiCall({
      uri: "/appointment/getDoctorScheduleDateWise",
      module: "frontDesk",
      method: "GET",
      data: { ...send_data },
      onSuccess: (response) => {
        algaehLoader({ show: false });
        if (response.data.success && response.data.records.length > 0) {
          const dataArray = Array.isArray(response.data.records)
            ? response.data.records
            : [];
          const slot = dataArray.length > 0 ? dataArray[0].slot : null;
          const width = 318 * dataArray;

          // console.log("dataArray", dataArray);
          setState({ slot, width, appointmentSchedule: dataArray });
          // this.setState(
          //   { appointmentSchedule: response.data.records },
          //   () => {
          //
          //     this.setState({
          //       slot:
          //         this.state.appointmentSchedule !== undefined
          //           ? this.state.appointmentSchedule[0].slot
          //           : null,
          //       width:
          //         response.data.records !== undefined
          //           ? 318 * response.data.records.length
          //           : 0,
          //     });
          //   }
          // );
        } else {
          setState({
            appointmentSchedule: [],
          });

          swalMessage({
            title: "No Schedule Available",
            type: "warning",
          });
        }
      },
      onCatch: (error) => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  const plotPatients = (data) => {
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
        (w) =>
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
  };
  const handleCheckIn = (patient) => {
    let isTodayActive = moment(state.activeDateHeader).isSame(moment(), "day");
    if (!isTodayActive) {
      swalMessage({
        title:
          "Only Patients with appointment for today are allowed to checkin",
        type: "warning",
      });
      return null;
    }
    setGlobal({
      "FD-STD": "RegistrationPatient",
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
      delete patient.tel_code;
      delete patient.email;
      delete patient.arabic_name;
      // return this.props.routeComponents(patient, this.state.checkInId);

      return history?.push(
        `/PatientRegistration?appointment_id=${patient?.hims_f_patient_appointment_id}&status_id=${state.checkInId}`
      );
    }

    // return this.props.routeComponents(patient, this.state.checkInId);
    return history?.push(
      `/PatientRegistration?appointment_id=${patient?.hims_f_patient_appointment_id}&patient_code=${patient?.patient_code}&status_id=${state.checkInId}`
    );
  };
  const { userLanguage } = useContext(MainContext);

  const updatePatientAppointment = (data) => {
    if (data !== null) {
      setState(
        {
          edit_appointment_status_id: data.hims_d_appointment_status_id,
        },
        (parentState) => {
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
                cancelButtonText: "No",
              }).then((willUpdate) => {
                let new_to_time = moment(
                  parentState.edit_appt_time,
                  "HH:mm:ss"
                ).add(
                  parentState.edit_no_of_slots * parentState.slot,
                  "minutes"
                );

                if (willUpdate.value) {
                  if (
                    parentState.edit_appointment_status_id ===
                      parentState.checkInId &&
                    moment(parentState.edit_appt_date).format("YYYYMMDD") !==
                      moment(new Date()).format("YYYYMMDD")
                  ) {
                    swalMessage({
                      title:
                        "Only Patients with Today's appointments can be Checked In",
                      type: "warning",
                    });
                  } else {
                    let edit_details = {
                      hims_f_patient_appointment_id:
                        parentState.edit_appointment_id,
                      record_status: "A",
                      appointment_status_id:
                        parentState.edit_appointment_status_id,
                      patient_id: parentState.edit_patient_id,
                      provider_id: parentState.edit_provider_id,
                      sub_department_id: parentState.edit_sub_dep_id,
                      appointment_date: parentState.edit_appt_date,
                      appointment_from_time: parentState.edit_appt_time,
                      appointment_to_time: moment(new_to_time).format(
                        "HH:mm:ss"
                      ),
                      patient_name: parentState.edit_patient_name,
                      arabic_name: parentState.edit_arabic_name,
                      date_of_birth: parentState.edit_date_of_birth,
                      age: parentState.edit_age,
                      contact_number: parentState.edit_contact_number,
                      tel_code: parentState.tel_code,
                      email: parentState.edit_email,
                      send_to_provider: null,
                      gender: parentState.edit_gender,
                      confirmed: "N",
                      confirmed_by: null,
                      comfirmed_date: null,
                      cancelled: "N",
                      cancelled_by: null,
                      cancelled_date: null,
                      cancel_reason: null,
                      appointment_remarks: parentState.edit_appointment_remarks,
                      is_stand_by: parentState.edit_is_stand_by,
                      number_of_slot: parentState.edit_no_of_slots,
                      title_id: parentState.edit_title_id,
                    };
                    if (
                      edit_details.appointment_status_id ===
                      parentState.checkInId
                    ) {
                      handleCheckIn(edit_details);
                    } else if (
                      edit_details.appointment_status_id ===
                      parentState.cancelledId
                    ) {
                      cancelAppt(edit_details);
                    } else {
                      algaehApiCall({
                        uri: "/appointment/updatePatientAppointment",
                        module: "frontDesk",
                        method: "PUT",
                        data: edit_details,
                        onSuccess: (response) => {
                          if (response.data.success) {
                            clearSaveState();
                            swalMessage({
                              title: "Appointment Updated Successfully",
                              type: "success",
                            });
                            setState({
                              openPatEdit: false,
                            });
                            clearSaveState();
                            getAppointmentSchedule();
                          }
                        },
                        onFailure: (error) => {
                          swalMessage({
                            title: error.message,
                            type: "error",
                          });
                        },
                      });
                    }
                  }
                }
              });
            },
          });
        }
      );
    }
  };
  const generateTimeslotsForDoctor = (data) => {
    // Takes Appointment Schedule as input and returns an Array with time and "break"
    const from_work_hr = moment(data.from_work_hr, "hh:mm:ss");
    const to_work_hr = moment(data.to_work_hr, "hh:mm:ss");
    const from_break_hr1 = moment(data.from_break_hr1, "hh:mm:ss");
    const to_break_hr1 = moment(data.to_break_hr1, "hh:mm:ss");
    const from_break_hr2 = moment(data.from_break_hr2, "hh:mm:ss");
    const to_break_hr2 = moment(data.to_break_hr2, "hh:mm:ss");
    const slot = parseInt(data.slot, 10);
    let result = [];
    let count = 0;
    let newFrom = from_work_hr.clone();

    for (;;) {
      let isBreak = false;

      newFrom = count === 0 ? newFrom : newFrom.add(slot, "minutes");
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
          result.push("break");
        } else {
          result.push(newFrom.format("HH:mm:ss"));
        }
      } else {
        break;
      }
      count = count + 1;
    }

    return result;
  };

  const getTimeSlotsForDropDown = (id) => {
    let schedule;
    let data;
    let apptDate = state.edit_appt_date;
    let send_data = {
      sub_dept_id: state.sub_department_id,
      schedule_date: moment(state.edit_appt_date).format("YYYY-MM-DD"),
      provider_id: state.edit_provider_id,
    };
    algaehApiCall({
      uri: "/appointment/getDoctorScheduleDateWise",
      module: "frontDesk",
      method: "GET",
      data: send_data,
      onSuccess: (response) => {
        if (response.data.success && response.data.records.length > 0) {
          schedule = response.data.records;
          data = schedule.filter(
            (doc) => doc.provider_id === state.edit_provider_id
          );
          const options = { hour12: true, hour: "2-digit", minute: "2-digit" };
          const result = generateTimeslotsForDoctor(data[0]);
          let timeSlots = [];
          result.forEach((time) => {
            if (time !== "break") {
              if (
                !isInactiveTimeSlot(time, apptDate) &&
                isEmpty(
                  plotPatients({
                    time,
                    slot: data[0].slot,
                    patients: data[0].patientList,
                  })
                )
              ) {
                const time_ar = new Date(
                  moment(time, "HH:mm:ss")._d
                ).timeSlots.push({
                  name: moment(time, "HH:mm:ss").format("hh:mm a"),
                  value: time,
                  name_ar: time_ar.toLocaleDateString("ar-EG", options),
                });
              }
            }
          });
          //  setstate({ timeSlots: timeSlots, schAvailable: true });
          return setState({ timeSlots, schAvailable: true });
        } else {
          swalMessage({
            title: "There is no schedule Available for the doctor",
            type: "error",
          });
          return setState({ timeSlots: [], schAvailable: true });
        }
      },
      onFailure: (response) => {
        swalMessage({
          title: "There is no schedule Available for the doctor",
          type: "error",
        });
        return setState({ timeSlots: [], schAvailable: false });
      },
    });
  };
  const isInactiveTimeSlot = (time, date) => {
    let activeDate = date ? date : state.activeDateHeader;
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
  };
  const generateReport = (patient, rpt_name, rpt_desc) => {
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: rpt_name,
          reportParams: [
            {
              name: "hims_f_patient_appointment_id",
              value: patient.hims_f_patient_appointment_id,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${rpt_desc}`;
        window.open(origin);
        // myWindow.document.title = rpt_desc;
      },
    });
  };
  const allowDrop = (e) => {
    e.preventDefault();
  };

  const enterDrag = (ev) => {
    ev.currentTarget.classList.add("highlight-Drop");
  };
  const leaveDrag = (ev) => {
    ev.currentTarget.classList.remove("highlight-Drop");
  };
  const drop = (ev) => {
    ev.preventDefault();

    ev.currentTarget.classList.remove("highlight-Drop");
    let new_from_time = ev.currentTarget.children[1].getAttribute("appt-time");

    if (
      (moment(new_from_time, "HH:mm a").format("HHmm") <
        moment(new Date()).format("HHmm") ||
        moment(state.activeDateHeader).format("YYYYMMDD") <
          moment(new Date()).format("YYYYMMDD")) &&
      moment(state.activeDateHeader).format("YYYYMMDD") <=
        moment(new Date()).format("YYYYMMDD")
    ) {
      swalMessage({
        title: "Cannot create schedule for past time",
        type: "error",
      });
    } else if (state.edit_appointment_status_id === state.checkInId) {
      swalMessage({
        title: "Cannot change schedule for CheckedIn Patients",
        type: "error",
      });
    } else {
      let prov_id = ev.currentTarget.children[1].getAttribute("provider_id");
      let slot = ev.currentTarget.children[1].getAttribute("slot");

      let new_to_time = moment(new_from_time, "HH:mm a").add(
        state.edit_no_of_slots * slot,
        "minutes"
      );

      setState(
        {
          edit_appt_time: moment(new_from_time, "HH:mm a").format("HH:mm:ss"),
          edit_from_time: moment(new_from_time, "HH:mm a").format("HH:mm:ss"),
          edit_to_time: moment(new_to_time).format("HH:mm:ss"),
          edit_provider_id: prov_id,
          edit_appointment_status_id: state.RescheduleId,
        },
        (parentState) => {
          swal({
            title: "Are you sure you want to Re-Schedule the appointment?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            confirmButtonColor: "#",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
          }).then((willUpdate) => {
            if (willUpdate.value) {
              let edit_details = {
                hims_f_patient_appointment_id: parentState.edit_appointment_id,
                record_status: "A",
                appointment_status_id: parentState.RescheduleId,
                patient_id: parentState.edit_patient_id,
                provider_id: prov_id,
                sub_department_id: parentState.edit_sub_dep_id,
                appointment_date: parentState.edit_appointment_date,
                appointment_from_time: moment(new_from_time, "HH:mm a").format(
                  "HH:mm:ss"
                ),
                appointment_to_time: moment(new_to_time).format("HH:mm:ss"),
                patient_name: parentState.edit_patient_name,
                arabic_name: parentState.edit_arabic_name,
                date_of_birth: parentState.edit_date_of_birth,
                age: parentState.edit_age,
                title_id: parentState.edit_title_id,
                contact_number: parentState.edit_contact_number,
                tel_code: parentState.tel_code,
                email: parentState.edit_email,
                send_to_provider: null,
                gender: parentState.edit_gender,
                confirmed: "Y",
                confirmed_by: null,
                comfirmed_date: null,
                cancelled: "N",
                cancelled_by: null,
                cancelled_date: null,
                cancel_reason: null,
                appointment_remarks: parentState.edit_appointment_remarks,
                is_stand_by: "N",
                number_of_slot: parentState.edit_no_of_slots,
              };

              algaehApiCall({
                uri: "/appointment/updatePatientAppointment",
                module: "frontDesk",
                method: "PUT",
                data: edit_details,
                onSuccess: (response) => {
                  if (response.data.success) {
                    clearSaveState();
                    swalMessage({
                      title: "Appointment Updated Successfully",
                      type: "success",
                    });
                    setState({
                      openPatEdit: false,
                    });
                    clearSaveState();
                    getAppointmentSchedule();
                  }
                },
                onFailure: (error) => {
                  swalMessage({
                    title:
                      "Appointment already present for the selected time cannot re-schedule",
                    type: "error",
                  });
                },
              });
            } else {
              swalMessage({
                title: "Re-Schedule Cancelled",
                type: "error",
              });
            }
          });
        }
      );
    }
  };

  const drag = (ev) => {
    let pat = JSON.parse(ev.currentTarget.getAttribute("appt-pat"));

    let appt_date = pat.appointment_date;
    let appt_time = pat.appointment_from_time;
    if (
      (moment(appt_time, "HH:mm:ss").format("HHmm") <
        moment(new Date()).format("HHmm") ||
        moment(appt_date).format("YYYYMMDD") <
          moment(new Date()).format("YYYYMMDD")) &&
      moment(state.activeDateHeader).format("YYYYMMDD") <=
        moment(new Date()).format("YYYYMMDD")
    ) {
      swalMessage({
        title: "Cannot re-schedule past appointments",
        type: "error",
      });
      ev.preventDefault();
    } else if (pat.appointment_status_id === state.checkInId) {
      swalMessage({
        title: "Cannot re-schedule checked In patients",
        type: "error",
      });
      ev.preventDefault();
    } else {
      setState({
        patToEdit: pat,
        edit_appointment_status_id: pat.appointment_status_id,
        edit_appt_date: pat.appointment_date,
        edit_contact_number: pat.contact_number,
        edit_tel_code: pat.tel_code,
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
        edit_title_id: pat.title_id,
      });
    }
  };

  const plotAddIcon = (patient, data) => {
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
        moment(state.activeDateHeader).format("YYYYMMDD") <
          moment(new Date()).format("YYYYMMDD")) &&
      moment(state.activeDateHeader).format("YYYYMMDD") <=
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
          onClick={showModal}
          className="fas fa-plus"
        />
      );
    } else {
      return null;
    }
  };
  const colspan = data.mark_as_break
    ? {
        colSpan: 2,
        style: {
          width: "300px",
          background: "rgb(255, 238, 214)",
          textTransform: "uppercase",
        },
      }
    : {};
  const _patientList = plotPatients({
    time: data.time,
    slot: data.slot,
    patients: data.patients,
  });
  const patient =
    _patientList !== null
      ? Enumerable.from(_patientList)
          .where((w) => w.is_stand_by === "N" && w.cancelled === "N")
          .firstOrDefault()
      : undefined;
  let brk_bg_color = data.mark_as_break
    ? "activeSlotOpacity"
    : isInactiveTimeSlot(data.time) && patient === undefined
    ? "inActiveSlotOpacity"
    : "activeSlotOpacity";

  let isTodayActive = moment(state.activeDateHeader).isSame(moment(), "day");
  if (!isTodayActive) {
    status = status.filter(
      (stat) => stat.hims_d_appointment_status_id !== state.checkInId
    );
  }
  const handlePatient = (patient, data, e) => {
    persistStateOnBack(state, true);
    if (data.hims_d_appointment_status_id === state.checkInId) {
      handleCheckIn(patient, data);
    } else {
      openEditModal(patient, data, e);
    }
  };
  const showModal = (e) => {
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
        moment(state.activeDateHeader).format("YYYYMMDD") <
          moment(new Date()).format("YYYYMMDD")) &&
      moment(state.activeDateHeader).format("YYYYMMDD") <=
        moment(new Date()).format("YYYYMMDD")
    ) {
      swalMessage({
        title: "Can't create appointment for past time",
        type: "error",
      });
      setState({ showApt: false });
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
      const sub_dep_name = getDeptName(sub_dept_id);
      const doc_name = getDoctorName(provider_id);

      setState({
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
        is_stand_by: is_stand_by,
      });
    }
  };
  const getDoctorName = (id) => {
    let doc = Enumerable.from(state.doctors.length !== 0 ? state.doctors : null)
      .where((w) => w.employee_id === parseInt(id, 10))
      .firstOrDefault();
    return doc !== undefined ? doc.full_name : "";
  };

  const getDeptName = (id) => {
    let dept = Enumerable.from(
      state.departments.length !== 0 ? state.departments : null
    )
      .where((w) => w.sub_department_id === parseInt(id, 10))
      .firstOrDefault();
    return dept !== undefined ? dept.sub_department_name : "";
  };
  const getColorCode = (id) => {
    return Enumerable.from(state.appointmentStatus)
      .where((w) => w.hims_d_appointment_status_id === id)
      .firstOrDefault() !== undefined
      ? Enumerable.from(state.appointmentStatus)
          .where((w) => w.hims_d_appointment_status_id === id)
          .firstOrDefault().color_code
      : "#ffffff";
  };

  let bg_color =
    patient != null
      ? getColorCode(patient.appointment_status_id)
      : data.mark_as_break
      ? "#f2f2f2"
      : isInactiveTimeSlot(data.time)
      ? "#fbfbfb"
      : "#ffffff";

  const openEditModal = (patient, data, e) => {
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
        moment(patient.appointmupdatePatientAppointmentent_date).format(
          "YYYYMMDD"
        ) < moment(new Date()).format("YYYYMMDD")) &&
      moment(state.activeDateHeader).format("YYYYMMDD") <=
        moment(new Date()).format("YYYYMMDD")
    ) {
      swalMessage({
        title: "Can't edit past appointments",
        type: "error",
      });
    } else if (patient.appointment_status_id === state.checkInId) {
      swalMessage({
        title: "Visit already created, cannot edit the appointment",
        type: "warning",
      });
    } else {
      let openPatEdit = false;
      if (
        data !== null &&
        data.hims_d_appointment_status_id === state.RescheduleId
      ) {
        openPatEdit = true;
      }
      setState({
        openPatEdit,
        edit_appointment_status_id: data.hims_d_appointment_status_id,
        edit_appt_date: patient.appointment_date,
        edit_appt_time: patient.appointment_from_time,
        edit_contact_number: patient.contact_number,
        edit_tel_code: patient.tel_code,
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
        edit_title_id: patient.title_id,
      });

      if (
        data !== null &&
        data.hims_d_appointment_status_id !== state.RescheduleId
      ) {
        console.log("state", state);
        updatePatientAppointment(data);

        // openModal(data);
      } else {
        getTimeSlotsForDropDown(patient.provider_id);
      }
    }
  };

  const sel_stat_id = patient !== undefined ? patient.appointment_status_id : 0;

  const sel_stat = Enumerable.from(
    state.appointmentStatus !== undefined ? state.appointmentStatus : []
  )
    .where((w) => w.hims_d_appointment_status_id === sel_stat_id)
    .firstOrDefault();
  let sel_steps = sel_stat !== undefined ? sel_stat.steps : 0;
  let status =
    sel_stat_id !== null
      ? Enumerable.from(
          state.appointmentStatus !== undefined ? state.appointmentStatus : []
        )
          .where((w) => w.steps > sel_steps)
          .toArray()
      : [];
  const cancelAppt = (row) => {
    let _date = moment(row.appointment_date).format("YYYYMMDD");
    let _time = moment(row.appointment_from_time, "HH:mm:ss").format("HHmm");

    if (
      _date < moment(new Date()).format("YYYYMMDD") ||
      (_date === moment(new Date()).format("YYYYMMDD") &&
        _time < moment(new Date()).format("HHmm"))
    ) {
      swalMessage({
        title: "Cannot cancel previous appointments",
        type: "error",
      });
    } else if (row.appointment_status_id === state.checkInId) {
      swalMessage({
        title: "Cannot cancel checked in Patients",
        type: "error",
      });
    } else {
      setState({ rejectVisible: true, rowData: row });
    }
  };
  const checkCurrentTime = (data) => {
    const currentDate = moment().format("YYYYMMDD");
    const selectedDate = moment(state.activeDateHeader).format("YYYYMMDD");
    if (parseInt(selectedDate, 10) > parseInt(currentDate, 10)) {
      return <td></td>;
    }
    if (data.mark_as_break === true) {
      return <td></td>;
    }
    const inactiveTime = isInactiveTimeSlot(data.time);
    if (inactiveTime === false) {
      return (
        <td activetime="true">
          <span className="schedulePosition">
            <i className="fas fa-caret-left"></i>
          </span>
        </td>
      );
    } else {
      return <td></td>;
    }
  };
  return (
    // <div>
    <React.Fragment key={data.counter}>
      <tr>{checkCurrentTime(data)}</tr>
      <tr className={brk_bg_color} style={{ cursor: "pointer" }}>
        <td
          className="tg-baqh" //highlight-Drop
          {...colspan}
          onDrop={drop}
          onDragOver={allowDrop}
          onDragEnter={enterDrag}
          onDragLeave={leaveDrag}
        >
          {data.mark_as_break === false ? (
            <span className="dynSlot">
              {userLanguage === "ar" ? data.time_ar : data.time}
            </span>
          ) : null}

          {data.mark_as_break === false ? (
            <>
              {plotAddIcon(patient, data)}

              {patient != null &&
              patient.is_stand_by === "N" &&
              patient.cancelled === "N" ? (
                patient.appointment_status_id === state.noShowId ? (
                  <div
                    className="dynPatient"
                    style={{ background: bg_color }}
                    draggable={false}
                  >
                    <span>
                      {userLanguage === "ar"
                        ? patient.arabic_name
                        : patient.patient_name}{" "}
                      <br />
                      {patient.tel_code}
                      &nbsp; {patient.contact_number}
                    </span>
                  </div>
                ) : (
                  <div
                    appt-pat={JSON.stringify(patient)}
                    className="dynPatient"
                    style={{ background: bg_color }}
                    draggable={true}
                    onDragStart={drag}
                  >
                    <span
                    // onClick={openEditModal.bind(this, patient, null)}
                    >
                      {userLanguage === "ar"
                        ? patient.arabic_name
                        : patient.patient_name}
                      <br />
                      {patient.tel_code}
                      &nbsp;
                      {patient.contact_number}
                    </span>

                    <i
                      className="fas fa-times"
                      onClick={() => cancelAppt(patient)}
                    />
                    <div className="appStatusListCntr">
                      <i className="fas fa-clock" />
                      <ul className="appStatusList">
                        {status !== undefined
                          ? status.map((data, index) => {
                              return (
                                <li
                                  key={index}
                                  onClick={(e) => {
                                    handlePatient(patient, data, e);
                                  }}
                                >
                                  <span
                                    style={{
                                      backgroundColor: data.color_code,
                                    }}
                                  >
                                    {userLanguage === "ar"
                                      ? data.description_ar
                                      : data.statusDesc}
                                  </span>
                                </li>
                              );
                            })
                          : null}
                        <li
                          onClick={() =>
                            generateReport(
                              patient,
                              "appointmentSlip",
                              "Appointment Slip"
                            )
                          }
                        >
                          <span>Print App. Slip</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )
              ) : null}
            </>
          ) : (
            <>
              <span>
                <AlgaehLabel label={{ fieldName: "break_time" }} />{" "}
              </span>
            </>
          )}
        </td>

        {data.mark_as_break === false ? (
          <StandBySlot
            patient={patient}
            showModal={showModal}
            _patientList={_patientList}
            data={data}
            state={state}
            handlePatient={(item, data, e) => {
              handlePatient(item, data, e);
            }}
            generateReport={() => generateReport}
            cancelAppt={(item) => {
              cancelAppt(item);
            }}
          />
        ) : null}
      </tr>
      {/* </div> */}
    </React.Fragment>
  );
});
