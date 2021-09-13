import React, { memo, useContext } from "react";
import { MainContext, AlgaehLabel, Popover } from "algaeh-react-components";
import moment from "moment";
import swal from "sweetalert2";
import _ from "lodash";
import { AppointmentContext } from "../AppointmentContext";
import AddPatientIcon from "./addPatient";
import LiList from "./appointmentStatus";
import { swalMessage } from "../../../utils/algaehApiCall";
// import { newAlgaehApi } from "../../../hooks";
import { generateReport, rescheduleAppointmentSMS } from "./events";
export default memo(function TdCell(props) {
  const { userLanguage } = useContext(MainContext);
  const {
    appointmentDate,
    app_status,
    setDoctorSchedules,
    sub_department_id,
    provider_id,
  } = useContext(AppointmentContext);
  const isInactive = isInactiveTimeSlot(props?.time);
  const newEndTime = moment(props.time, "hh:mm a").add(props.slot, "minutes");
  const patient_list = props.patients?.filter(
    (f) => {
      if (f.number_of_slot > 1) {
        return (
          parseInt(
            moment(f.appointment_from_time, "HH:mm:ss").format("HHmm"),
            10
          ) <= parseInt(newEndTime.format("HHmm"), 10) &&
          parseInt(newEndTime.format("HHmm"), 10) <=
            parseInt(
              moment(f.appointment_to_time, "HH:mm:ss").format("HHmm"),
              10
            ) &&
          f.cancelled === "N"
        );
      } else {
        return (
          parseInt(
            moment(f.appointment_from_time, "HH:mm:ss").format("HHmm"),
            10
          ) >= parseInt(moment(props.time, "HH:mm a").format("HHmm"), 10) &&
          parseInt(
            moment(f.appointment_to_time, "HH:mm:ss").format("HHmm"),
            10
          ) <= parseInt(newEndTime.format("HHmm"), 10) &&
          f.cancelled === "N"
        );
      }
    }

    //f.is_stand_by === "N" && f.cancelled === "N"
  );
  const patient = _.head(patient_list.filter((f) => f.is_stand_by === "N"));
  const isStandby = patient
    ? "N"
    : patient?.is_stand_by === "Y"
    ? "Y"
    : patient?.cancelled === "Y"
    ? "N"
    : null;
  const date_time_val =
    (parseInt(moment(props.time, "HH:mm a").format("HHmm"), 10) <
      parseInt(moment().format("HHmm"), 10) ||
      parseInt(moment(appointmentDate).format("YYYYMMDD"), 10) <
        parseInt(moment().format("YYYYMMDD"), 10)) &&
    parseInt(moment(appointmentDate).format("YYYYMMDD"), 10) <=
      parseInt(moment().format("YYYYMMDD"), 10);
  function PlotAddIcon() {
    if (!date_time_val && !patient) {
      return <AddPatientIcon {...props} noOfSlots={1} isStandBy="N" />;
    } else {
      return null;
    }
  }
  function PlotStandByIcons() {
    if (!date_time_val) {
      return <AddPatientIcon {...props} noOfSlots={1} isStandBy="Y" />;
    } else {
      return null;
    }
  }
  function isInactiveTimeSlot(time, date) {
    let activeDate = date ? date : appointmentDate;
    if (moment(activeDate).isBefore(moment(), "day")) {
      return true;
    } else if (moment(activeDate).isSame(moment(), "day")) {
      return (
        moment(time, "HH:mm a").format("HHmm") < moment(moment()).format("HHmm")
      );
    } else {
      return false;
    }
  }

  function DisplayAppointmentPatient() {
    if (patient) {
      const bg_color = patient
        ? app_status?.find(
            (f) =>
              f.hims_d_appointment_status_id === patient.appointment_status_id
          )?.color_code
        : props?.mark_as_break
        ? "#f2f2f2"
        : isInactive //isInactiveTimeSlot(props?.time)
        ? "#fbfbfb"
        : "#ffffff";
      const isNoShow = app_status?.find((f) => f.default_status === "NS");
      const appStep = app_status?.find(
        (f) => f.hims_d_appointment_status_id === patient.appointment_status_id
      )?.steps;
      if (isStandby === "N" && patient?.cancelled === "N") {
        if (
          patient?.appointment_status_id ===
          isNoShow?.hims_d_appointment_status_id
        ) {
          return (
            <div
              className="dynPatient"
              style={{ background: bg_color }}
              draggable={false}
            >
              <span>
                {userLanguage === "en"
                  ? patient?.patient_name
                  : patient?.arabic_name}
                <br />
                {patient?.tel_code}
                &nbsp; {patient?.contact_number}
              </span>
            </div>
          );
        } else {
          return (
            <div
              className="dynPatient"
              style={{ background: bg_color, cursor: "move" }}
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData("data", JSON.stringify(patient));
              }}
            >
              <span style={{ cursor: "pointer" }}>
                {userLanguage === "en"
                  ? patient?.patient_name
                  : patient?.arabic_name}
                <br />
                {patient?.tel_code}
                &nbsp; {patient?.contact_number}
              </span>

              {/* <i
                className="fas fa-times"
                onClick={() => {
                  setShowCancelPopup(true);
                  setIsAppointmentSlot(true);
                }}
              /> */}
              <div className="appStatusListCntr">
                <i className="fas fa-clock" />
                <ul className="appStatusList">
                  {app_status
                    ?.filter((f) => f.steps > appStep)
                    .map((item, index) => {
                      return (
                        <LiList
                          key={index}
                          item={item}
                          userLanguage={userLanguage}
                          patient={{ ...patient, doc_name: props.doc_name }}
                          // doc_name={}
                        />
                      );
                    })}
                  <li
                    onClick={() =>
                      generateReport(
                        patient.hims_f_patient_appointment_id,
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
          );
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  function onDropAppointment(e) {
    e.preventDefault();
    e.persist();

    const hasPatient = e.currentTarget.querySelector("div");
    if (hasPatient) {
      swalMessage({
        title: `Patient record already exists @ ${props.time} slot`,
        type: "error",
      });
      e.dataTransfer.clearData("data");
      return;
    }
    const _data = JSON.parse(e.dataTransfer.getData("data"));
    e.dataTransfer.clearData("data");
    const duration = _data.number_of_slot * props.slot;
    const app_end_time = moment(props.time, "hh:mm a")
      .add("minutes", duration)
      .format("HH:mm:ss");
    swal({
      title: "Are you sure you want to Re-Schedule the appointment?",
      text: `"${
        userLanguage === "en" ? _data.patient_name : _data.arabic_name
      }" rescheduling from "${_data.appointment_from_time}" to "${
        props.time
      }" `,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willUpdate) => {
      if (willUpdate.value) {
        const appStatus = app_status.find(
          (f) => f.default_status === "RS"
        )?.hims_d_appointment_status_id;
        const sendingData = {
          ..._data,
          appointment_status_id: appStatus,
          appointment_to_time: app_end_time,
          appointment_from_time: moment(props.time, "hh:mm a").format(
            "HH:mm:ss"
          ),
          is_stand_by: "N",
          cancelled: "N",
          record_status: "A",
          doc_name: props.doc_name,
        };
        rescheduleAppointmentSMS(
          sendingData,
          sub_department_id,
          provider_id,
          appointmentDate
        ).then((response) => {
          debugger;
          setDoctorSchedules(response);
        });
        // newAlgaehApi({
        //   uri: "/appointment/updatePatientAppointment",
        //   module: "frontDesk",
        //   method: "PUT",
        //   data: sendingData,
        // }).then(async (response) => {
        //   const dataSchedule = await getDoctorSchedule("", {
        //     sub_dept_id: sub_department_id,
        //     provider_id,
        //     schedule_date: appointmentDate,
        //   });
        //   setDoctorSchedules(dataSchedule);
        //   swalMessage({
        //     title: "Successfully Updated",
        //     type: "success",
        //   });
        // });
      }
    });
  }

  function StandByList(list) {
    return (
      <ul style={{ listStyle: "none", padding: "5px" }}>
        {list.map((item) => (
          <li
            key={item.hims_f_patient_appointment_id}
            style={{
              background: app_status.find(
                (f) =>
                  f.hims_d_appointment_status_id === item.appointment_status_id
              )?.color_code,
            }}
          >
            {userLanguage === "en" ? item.patient_name : item.arabic_name}
          </li>
        ))}
      </ul>
    );
  }

  function DisplayStandByPatients() {
    const standByList = patient_list.filter((f) => f.is_stand_by === "Y");
    const veryFirstPatient = _.head(standByList);
    if (veryFirstPatient) {
      const isNoShow = app_status.find((f) => f.default_status === "NS");
      const appStep = app_status.find(
        (f) =>
          f.hims_d_appointment_status_id ===
          veryFirstPatient.appointment_status_id
      )?.steps;
      if (
        veryFirstPatient?.appointment_status_id ===
        isNoShow.hims_d_appointment_status_id
      ) {
        return (
          <Popover content={StandByList(standByList)} trigger="click">
            <div
              className="dynPatient"
              style={{ background: "#f2f2f2" }}
              draggable={false}
            >
              <span>
                {veryFirstPatient?.patient_name} <br />
                {veryFirstPatient?.tel_code}
                &nbsp;
                {veryFirstPatient?.contact_number}
              </span>
            </div>
          </Popover>
        );
      } else {
        return (
          <Popover content={StandByList(standByList)} trigger="click">
            <div
              appt-pat={JSON.stringify(veryFirstPatient)}
              className="dynPatient"
              style={{ background: "#f2f2f2" }}
            >
              <span>
                {veryFirstPatient?.patient_name}
                <br />
                {veryFirstPatient?.tel_code}
                &nbsp;
                {veryFirstPatient?.contact_number}
              </span>

              <div className="appStatusListCntr">
                <i className="fas fa-clock" />
                <ul className="appStatusList">
                  {app_status
                    .filter((f) => f.steps > appStep)
                    .map((item, index) => {
                      return (
                        <LiList
                          key={index}
                          item={item}
                          userLanguage={userLanguage}
                          patient={veryFirstPatient}
                        />
                      );
                    })}
                  <li
                    onClick={() =>
                      generateReport(
                        standByList.hims_f_patient_appointment_id,
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
          </Popover>
        );
      }
    } else {
      return null;
    }
  }

  return (
    <React.Fragment>
      {props.mark_as_break === false ? (
        <>
          <td
            className={`tg-baqh ${
              isInactive === true && !patient ? "inActiveSlotOpacity" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }}
            onDrop={onDropAppointment}
          >
            <span className="dynSlot">
              {userLanguage === "ar" ? props.time_ar : props.time}
            </span>
            <PlotAddIcon />
            <DisplayAppointmentPatient key={props.time} />
          </td>
          <td
            className={`tg-baqh ${
              isInactive === true && !patient ? "inActiveSlotOpacity" : ""
            }`}
          >
            <PlotStandByIcons />
            <DisplayStandByPatients key={props.time} />
          </td>
        </>
      ) : (
        <td
          colSpan="2"
          style={{
            width: "300px",
            background: "rgb(255, 238, 214)",
            textTransform: "uppercase",
          }}
        >
          <span>
            <AlgaehLabel label={{ fieldName: "break_time" }} />
          </span>
        </td>
      )}
      {/* <CancelAppointment
        showCancelPopup={showCancelPopup}
        setShowCancelPopup={setShowCancelPopup}
        patient={
          isAppointmentSlot === true
            ? patient
            : patient_list.filter((f) => f.is_stand_by === "Y")
        }
      /> */}
    </React.Fragment>
  );
});
