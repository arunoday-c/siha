import React, { useContext, useEffect } from "react";
import FilterComponent from "./FilterComponent";
import { useQuery } from "react-query";
// import { MainContext } from "algaeh-react-components";
// import { useParams } from "react-router-dom";
import {
  getDeptAndSubDept,
  getOrganizationByUser,
  getProviderDetails,
  loadEncounterData,
} from "./events";
import { swalMessage } from "../../../../utils/algaehApiCall";
// import { useLocation } from "react-router-dom";
import { EncounterDashboardContext } from "../EncounterDashboardContext";
import PatientsCountComponent from "./PatientsCountComponent";
import DoctorsDataWithSubdepartment from "./DoctorsDataWithSubdepartment";
export default function EncounterDashboard(props) {
  // const location = useLocation();
  // const history = useHistory();
  // const pathName = history.location.pathname;
  // const { socket } = useContext(MainContext);
  const {
    setSubDepartmentData,
    setHospitalData,
    setDoctorData,
    setFollowUpPatientCount,
    setNewPatientCount,
    setTotalPatientsLength,
    setEncounterData,
  } = useContext(EncounterDashboardContext);
  const { data: subDepartmentData, isLoading } = useQuery(
    "sub-department-data",
    getDeptAndSubDept,
    {
      keepPreviousData: true,
      onSuccess: (data) => setSubDepartmentData(data),
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    }
  );
  useEffect(() => {
    loadEncounterData().then((result) => {
      debugger;
      setFollowUpPatientCount(result.total_followUp);
      setNewPatientCount(result.total_new_visit);
      setTotalPatientsLength(result.totalPatient);
      setEncounterData(result.arrangedData);
    });
  }, []);
  // useEffect(() => {
  // if (socket.connected) {
  //   socket.on("refresh_appointment", async ({ patient }) => {
  //     const parameters = new URLSearchParams(window.location.search);
  //     const provider_id = parameters.get("provider_id");
  //     const sub_department_id = parameters.get("sub_department_id");
  //     const appointmentDate = parameters.get("appointmentDate");
  //     if (
  //       sub_department_id === patient.sub_department_id &&
  //       appointmentDate === patient.appointment_date
  //     ) {
  //       const dataSchedule = await getDoctorSchedule("", {
  //         sub_dept_id: sub_department_id,
  //         provider_id: provider_id,
  //         schedule_date: appointmentDate,
  //       });

  //       setDoctorSchedules(dataSchedule);
  //     }
  //     // }
  //   });
  // }
  // }, [socket]);
  const { data: hospitalData } = useQuery(
    "hospital-data",
    getOrganizationByUser,
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setHospitalData(data);
      },
      onError: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    }
  );
  const { data: doctorData } = useQuery("doctor-data", getProviderDetails, {
    keepPreviousData: true,
    onSuccess: (data) => {
      debugger;
      setDoctorData(data);
    },
    onError: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });

  return (
    <div className="dashboard front-dash">
      <FilterComponent
        {...{
          ...props,
          subDepartmentData,
          isLoading,
          hospitalData,
          doctorData,
        }}
      />
      <PatientsCountComponent {...{ ...props }} />
      <DoctorsDataWithSubdepartment {...{ ...props }} />
    </div>
  );
}
