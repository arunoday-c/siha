import React, { useEffect, useContext } from "react";
import { useQuery } from "react-query";
import { MainContext } from "algaeh-react-components";
import { useParams } from "react-router-dom";

import { useLocation } from "react-router-dom";
// import moment from "moment";
import TopSelect from "./topSelection";
import DoctorFilter from "./filter";
import Legends from "./legends";
import AppointmentSchedules from "./schedules";
import { AppointmentContext } from "../AppointmentContext";
import { getDepartmentAndDoctorList, getAppointmentStatus } from "./events";
import { swalMessage } from "../../../utils/algaehApiCall";
import "../appointment.scss";
import { getDoctorSchedule } from "./events";
// import socket from "../../../socket";
export default function BookAppointment(props) {
  const location = useLocation();
  // const history = useHistory();
  // const pathName = history.location.pathname;
  const { socket } = useContext(MainContext);
  const params = useParams();
  const {
    setAppointmentDate,
    setAppointmentDateHeader,
    setDepartment,
    setDoctor,
    setAppointmentStatus,
    setDepartmentData,
    setDoctorSchedules,
    setPatientRecallData,
  } = useContext(AppointmentContext);
  const { data, isLoading } = useQuery(
    "appointment-department-doctors",
    getDepartmentAndDoctorList,
    {
      keepPreviousData: true,
      onSuccess: (data) => setDepartmentData(data),
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
    let dataFromRecall = location.state?.data;

    if (dataFromRecall) {
      setAppointmentDate(dataFromRecall.followup_date);

      setAppointmentDateHeader(dataFromRecall.followup_date);

      setDepartment(dataFromRecall.sub_department_id);

      setDoctor(dataFromRecall.doctor_id);
      // history.push(
      //   pathName +
      //     `?appointmentDate=${moment(dataFromRecall.followup_date).format(
      //       "YYYY-MM-DD"
      //     )}&sub_department_id=${
      //       dataFromRecall.sub_department_id
      //     }&provider_id=${dataFromRecall.doctor_id}`
      // );
      setPatientRecallData(dataFromRecall);
    }
  }, [location?.state?.data]);

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

  useEffect(() => {
    if (socket.connected) {
      socket.on("refresh_appointment", async ({ patient }) => {
        const parameters = new URLSearchParams(window.location.search);
        const provider_id = parameters.get("provider_id");
        const sub_department_id = parameters.get("sub_department_id");
        const appointmentDate = parameters.get("appointmentDate");
        if (
          sub_department_id === patient.sub_department_id &&
          appointmentDate === patient.appointment_date
        ) {
          const dataSchedule = await getDoctorSchedule("", {
            sub_dept_id: sub_department_id,
            provider_id: provider_id,
            schedule_date: appointmentDate,
          });

          setDoctorSchedules(dataSchedule);
        }
        // }
      });
    }
  }, [socket]);

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
