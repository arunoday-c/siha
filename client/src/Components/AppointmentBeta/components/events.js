// import {swalMessage} from "../../../utils/algaehApiCall";
import moment from "moment";
import { newAlgaehApi } from "../../../hooks";
import { generateTimeslotsForDoctor } from "../AppointmentHelper";
export async function getDepartmentAndDoctorList() {
  const { data } = await newAlgaehApi({
    uri: "/frontdesk/getDoctorAndDepartment",
    module: "frontDesk",
    method: "GET",
  }).catch((error) => {
    throw error;
  });
  if (data.success === false) {
    throw new Error(data.message);
  } else {
    return data.records;
  }
}
export async function getAppointmentStatus() {
  const { data } = await newAlgaehApi({
    uri: "/appointment/getAppointmentStatus",
    module: "frontDesk",
    method: "GET",
  }).catch((error) => {
    throw error;
  });
  if (data.success === false) {
    throw new Error(data.message);
  } else {
    const defaultStatus = data.records?.find((f) => f.default_status === "Y");
    const checkIn = data.records?.find((f) => f.default_status === "C");
    const reschedule = data.records?.find((f) => f.default_status === "RS");
    const cancelled = data.records?.find((f) => f.default_status === "CAN");
    const noShow = data.records?.find((f) => f.default_status === "NS");
    // const appointment_status_id = defaultStatus?.hims_d_appointment_status_id;

    return {
      legends: data.records,
      defaultStatus,
      appointment_status_id: defaultStatus?.hims_d_appointment_status_id,
      checkInId: checkIn?.hims_d_appointment_status_id,
      RescheduleId: reschedule?.hims_d_appointment_status_id,
      cancelledId: cancelled?.hims_d_appointment_status_id,
      noShowId: noShow?.hims_d_appointment_status_id,
    };
  }
}

export async function getDoctorSchedule(queryName, args) {
  const { sub_dept_id, schedule_date, provider_id } = args;
  if (sub_dept_id && schedule_date) {
    const { data } = await newAlgaehApi({
      uri: "/appointment/getDoctorScheduleDateWise",
      module: "frontDesk",
      method: "GET",
      data: {
        sub_dept_id,
        schedule_date: schedule_date,
        provider_id,
      },
    }).catch((error) => {
      throw error;
    });
    if (data.success === false) {
      throw new Error(data.message);
    } else {
      return data.records;
    }
  } else {
    return [];
  }
}

export function generateDoctorSlots(data) {
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
    patientList,
  } = data;
  const timeSlots = generateTimeslotsForDoctor(data);
  let isPrevbreak = null;
  let count = 0;
  let tds = [];
  // console.log("timeSlots", timeSlots);
  timeSlots.forEach((time) => {
    let isBreak = time === "break";
    const options = { hour12: true, hour: "2-digit", minute: "2-digit" };
    if (isBreak) {
      isPrevbreak = {
        counter: count,
        mark_as_break: isBreak,
      };
    } else {
      if (isPrevbreak !== null) {
        tds.push(this.generateChildren(isPrevbreak));
        isPrevbreak = null;
      }
      const time_ar = new Date(moment(time, "HH:mm:ss")).toLocaleDateString(
        "ar-EG",
        options
      );
      // console.log("time_ar", time_ar.split(","));
      tds.push({
        time: moment(time, "HH:mm:ss").format("hh:mm a"),
        time_ar: time_ar.split(",")[1],
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
        patients: patientList,
      });
    }
    count++;
  });
  console.log("tds====>", tds);
  return tds;
}
