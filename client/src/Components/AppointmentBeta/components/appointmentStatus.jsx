import React, { memo, useState, useContext } from "react";
import swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import CancelAppointment from "./cancelPopup";
import { MainContext } from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";
import { swalMessage } from "../../../utils/algaehApiCall";
import { AppointmentContext } from "../AppointmentContext";
import { getDoctorSchedule } from "./events";
export default memo(function LiList(props) {
  const { userLanguage } = useContext(MainContext);
  const history = useHistory();
  const {
    setDoctorSchedules,
    sub_department_id,
    provider_id,
    appointmentDate,
  } = useContext(AppointmentContext);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
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

  return (
    <li
      onClick={() => {
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
    </li>
  );
});
