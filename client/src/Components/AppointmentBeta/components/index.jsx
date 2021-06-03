import React, { useEffect, useContext } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import TopSelect from "./topSelection";
import DoctorFilter from "./filter";
import Legends from "./legends";
import AppointmentSchedules from "./schedules";
import { AppointmentContext } from "../AppointmentContext";
import { getDepartmentAndDoctorList, getAppointmentStatus } from "./events";
import { swalMessage } from "../../../utils/algaehApiCall";
import "../appointment.scss";
export default function BookAppointment(props) {
  const params = useParams();
  const {
    setAppointmentDate,
    setAppointmentDateHeader,
    setDepartment,
    setDoctor,
    setAppointmentStatus,
  } = useContext(AppointmentContext);
  const { data, isLoading } = useQuery(
    "appointment-department-doctors",
    getDepartmentAndDoctorList,
    {
      keepPreviousData: true,
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    }
  );
  const { data: appointmentStatus, isLoading: appStatusLoading } = useQuery(
    "appointment-status",
    getAppointmentStatus,
    {
      keepPreviousData: true,
      onSuccess: ({ legends }) => {
        setAppointmentStatus(legends);
        // const appStatus = legends.find(
        //   (f) => f.hims_d_appointment_status_id === appointment_status_id
        // );
        // const checkStatus = legends.find(
        //   (f) => f.hims_d_appointment_status_id === checkInId
        // );
        // const rescheduleStatus = legends.find(
        //   (f) => f.hims_d_appointment_status_id === RescheduleId
        // );
        // const cancelledStatus = legends.find(
        //   (f) => f.hims_d_appointment_status_id === cancelledId
        // );
        // const noShowStatus = legends.find(
        //   (f) => f.hims_d_appointment_status_id === noShowId
        // );

        // setAppointmentStatus({

        //   appointment_status: {
        //     id: appStatus?.hims_d_appointment_status_id,
        //     color: appStatus?.color_code,
        //     name: appStatus?.statusDesc,
        //     default_status: appStatus?.default_status,
        //   },
        //   check_in_status: {
        //     id: checkStatus?.hims_d_appointment_status_id,
        //     color: checkStatus?.color_code,
        //     name: checkStatus?.statusDesc,
        //     default_status: checkStatus?.default_status,
        //   },
        //   reschedule_status: {
        //     id: rescheduleStatus?.hims_d_appointment_status_id,
        //     color: rescheduleStatus?.color_code,
        //     name: rescheduleStatus?.statusDesc,
        //     default_status: rescheduleStatus?.default_status,
        //   },
        //   cancelled_status: {
        //     id: cancelledStatus?.hims_d_appointment_status_id,
        //     color: cancelledStatus?.color_code,
        //     name: cancelledStatus?.statusDesc,
        //     default_status: cancelledStatus?.default_status,
        //   },
        //   no_show_status: {
        //     id: noShowStatus?.hims_d_appointment_status_id,
        //     color: noShowStatus?.color_code,
        //     name: noShowStatus?.statusDesc,
        //     default_status: noShowStatus?.default_status,
        //   },
        // });
      },
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    }
  );

  useEffect(() => {
    const parameters = new URLSearchParams(window.location.search);
    if (parameters.get("appointmentDate")) {
      setAppointmentDate(parameters.get("appointmentDate"));
    }
    if (parameters.get("activeDateHeader")) {
      setAppointmentDateHeader(parameters.get("activeDateHeader"));
    }
    if (parameters.get("sub_department_id")) {
      setDepartment(parameters.get("sub_department_id"));
    }
    if (parameters.get("provider_id")) {
      setDoctor(parameters.get("provider_id"));
    }
  }, [params]);

  return (
    <div className="appointment">
      <TopSelect {...props} />
      <DoctorFilter {...{ ...props, data, isLoading }} />
      <div
        className="portlet portlet-bordered margin-bottom-15"
        style={{
          padding: "0px",
          backgroundImage: "none",
          boxShadow: "none",
          border: "none",
        }}
      >
        <Legends {...{ ...props, ...appointmentStatus, appStatusLoading }} />
        <AppointmentSchedules {...props} />
      </div>
    </div>
  );
}
