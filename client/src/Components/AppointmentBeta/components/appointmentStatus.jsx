import React, { memo, useState, useContext } from "react";
import swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import CancelAppointment from "./cancelPopup";
import ReschedulePopup from "./reschedule";
import { MainContext } from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";
import { swalMessage } from "../../../utils/algaehApiCall";
import { AppointmentContext } from "../AppointmentContext";
import { getDoctorSchedule, confirmAppointmentSMS } from "./events";
export default memo(function LiList(props) {
  const { userLanguage } = useContext(MainContext);
  const history = useHistory();
  const {
    setDoctorSchedules,
    sub_department_id,
    provider_id,
    appointmentDate,
  } = useContext(AppointmentContext);
  const [maxSlots, setMaxSlots] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showReschedulePopup, setShowReschedulePopup] = useState(false);
  function appointmentUpdate(type) {
    swal({
      title: "Are you Sure you want to Update Appointment?",
      text: `${type} "${
        userLanguage === "en"
          ? props?.patient?.patient_name
          : props?.patient?.arabic_name
      }" @ ${props?.patient?.appointment_from_time}`,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willUpdate) => {
      if (willUpdate.value) {
        const edit_details = {
          ...props.patient,
          record_status: "A",
          confirmed: props.item.default_status === "CF" ? "Y" : "N",
          cancelled: "N",
          appointment_status_id: props.item.hims_d_appointment_status_id,
          ...props.doc_name,
        };
        newAlgaehApi({
          uri: `/appointment/updatePatientAppointment`,
          module: "frontDesk",
          method: "PUT",
          data: edit_details,
        })
          .then(async (response) => {
            const data = await getDoctorSchedule("", {
              sub_dept_id: sub_department_id,
              provider_id,
              schedule_date: appointmentDate,
            });
            debugger;
            if (type === "Confirmed") {
              confirmAppointmentSMS(edit_details);
            }

            setDoctorSchedules(data);
            swalMessage({
              title: "Successfully Updated",
              type: "success",
            });
          })
          .catch((error) => {
            swalMessage({
              title: error,
              type: "error",
            });
          });
      }
    });
  }
  // const openReschedule = () => {
  //   debugger;
  //   setShowReschedulePopup((pre) => !pre);
  // };
  return (
    <li
      onClick={(e) => {
        switch (props.item.default_status) {
          case "CAN":
            setShowCancelPopup(true);
            break;
          case "CF":
            appointmentUpdate(
              userLanguage === "en"
                ? props.item?.statusDesc
                : props.item?.description_ar
            );
            break;
          case "RS":
            debugger;
            if (!showReschedulePopup) {
              let maxSlots = 1;
              const _currentRow =
                e.target.parentElement.parentNode.parentElement.parentElement
                  .parentElement.parentElement.sectionRowIndex + 1;
              const _allRows =
                e.target.parentElement.parentElement.parentElement
                  .childElementCount;

              for (let i = _currentRow; i < _allRows; i++) {
                const _element =
                  e.target.parentElement.parentElement.parentElement.children[
                    i
                  ];
                const _firstChild = _element.children[0];
                const _hasPatient = _firstChild.querySelector("div[appt-pat]");
                if (_hasPatient) break;
                else {
                  maxSlots = maxSlots + 1;
                }
              }
              setMaxSlots(maxSlots);
              setShowReschedulePopup(true);
            }

            break;
          case "C":
            if (!props.patient?.patient_code) {
              history.push(
                `/PatientRegistration?appointment_id=${props.patient?.hims_f_patient_appointment_id}&status_id=${props.item.hims_d_appointment_status_id}`
              );
            } else {
              history.push(
                `/PatientRegistration?appointment_id=${props.patient?.hims_f_patient_appointment_id}&status_id=${props.item.hims_d_appointment_status_id}&patient_code=${props.patient.patient_code}`
              );
            }
            break;
          case "NS":
            appointmentUpdate(
              userLanguage === "en"
                ? props.item?.statusDesc
                : props.item?.description_ar
            );
            break;
        }
      }}
    >
      <span
        style={{
          backgroundColor: props.item.color_code,
        }}
      >
        {props.userLanguage === "ar"
          ? props.item.description_ar
          : props.item.statusDesc}
      </span>
      {props.item.default_status === "CAN" ? (
        <CancelAppointment
          showCancelPopup={showCancelPopup}
          setShowCancelPopup={setShowCancelPopup}
          patient={props.patient}
        />
      ) : null}
      {props.item.default_status === "RS" && showReschedulePopup ? (
        <ReschedulePopup
          showReschedulePopup={showReschedulePopup}
          setShowReschedulePopup={() => setShowReschedulePopup((pre) => !pre)}
          patient={props.patient}
          maxSlots={maxSlots}
        />
      ) : null}
    </li>
  );
});
