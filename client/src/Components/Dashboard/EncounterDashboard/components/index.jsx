import React, { useContext, useEffect } from "react";
import FilterComponent from "./FilterComponent";
import { useQuery } from "react-query";
import { MainContext } from "algaeh-react-components";
import moment from "moment";
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
  const { socket } = useContext(MainContext);
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
      setFollowUpPatientCount(result.total_followUp);
      setNewPatientCount(result.total_new_visit);
      setTotalPatientsLength(result.totalPatient);
      const sortedData = result.arrangedData.sort((a, b) =>
        a.totalLength < b.totalLength ? 1 : -1
      );

      setEncounterData(sortedData);
    });
  }, []);
  useEffect(() => {
    if (socket.connected) {
      socket.on("reload_encounter_dash", async (patient) => {
        const parameters = new URLSearchParams(window.location.search);
        const from_date = parameters.get("from_date");

        if (from_date === moment(patient.visit_date).format("YYYY-MM-DD")) {
          await loadEncounterData().then((result) => {
            setFollowUpPatientCount(result.total_followUp);
            setNewPatientCount(result.total_new_visit);
            setTotalPatientsLength(result.totalPatient);
            setEncounterData(result.arrangedData);
          });
        }
        // }
      });
    }
  }, [socket]);
  const { data: hospitalData } = useQuery(
    "hospital-data",
    getOrganizationByUser,
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        data.unshift({ hims_d_hospital_id: -1, hospital_name: "All" });
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
