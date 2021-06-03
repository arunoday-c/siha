import React, { memo, useState, useContext } from "react";
import { AlgaehModal, AlgaehLabel } from "algaeh-react-components";
import { AppointmentContext } from "../AppointmentContext";
import { newAlgaehApi } from "../../../hooks";
import { swalMessage } from "../../../utils/algaehApiCall";
import { getDoctorSchedule } from "./events";
export default memo(function CancelPopup(props) {
  const [cancelReason, setCancelReason] = useState("");
  const {
    setDoctorSchedules,
    sub_department_id,
    provider_id,
    appointmentDate,
  } = useContext(AppointmentContext);
  function onChangeReason(e) {
    setCancelReason(e.target.value);
  }
  function onOkHandler() {
    if (cancelReason === "") {
      swalMessage({
        title: "reason can not blank.",
        type: "error",
      });
      return;
    } else {
      newAlgaehApi({
        uri: "/appointment/cancelPatientAppointment",
        module: "frontDesk",
        data: {
          cancel_reason: cancelReason,
          hims_f_patient_appointment_id:
            props?.patient?.hims_f_patient_appointment_id,
        },
        method: "PUT",
      }).then(async (response) => {
        if (response.data.success) {
          const data = await getDoctorSchedule("", {
            sub_dept_id: sub_department_id,
            provider_id,
            schedule_date: appointmentDate,
          });
          props.setShowCancelPopup(false);
          setDoctorSchedules(data);
          swalMessage({
            title: "Successfully Cancelled.",
            type: "success",
          });
        } else {
          swalMessage({
            title: response.data.message,
            type: "error",
          });
        }
      });
    }
  }
  return (
    <AlgaehModal
      title={`Are you Sure you want to Cancel Appointment for ${props?.patient?.patient_name}`}
      visible={props.showCancelPopup}
      destroyOnClose={true}
      okText="Update"
      onOk={onOkHandler}
      onCancel={() => props.setShowCancelPopup(false)}
    >
      <div className="col-12">
        <AlgaehLabel label={{ forceLabel: "Reason For Rejection" }} />
        <textarea
          defaultValue={cancelReason}
          name="cancel_reason"
          onChange={onChangeReason}
        />
      </div>
    </AlgaehModal>
  );
});
