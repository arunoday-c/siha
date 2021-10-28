import React, { useState, useEffect } from "react";
import AccordionComponent from "./AccordionComponent";
import { useLocation } from "react-router-dom";

import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
export default function CategoryComponent({ componentsName }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const location = useLocation();

  const getPatientDiagnosis = () => {
    algaehApiCall({
      uri: "/mrd/getPatientDiagnosis",
      module: "MRD",
      method: "GET",
      data: {
        patient_id: location.state?.content.current_patient
          ? location.state?.content.current_patient
          : Window.global["mrd_patient"],
        fromHistoricalData: true,
      },
      cancelRequestId: "getPatientDiagnosis",
      onSuccess: (response) => {
        if (response.data.success) {
          setData(response.data.records);
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  const getPatientMedicationHistoricalData = () => {
    algaehApiCall({
      uri: "/mrd/getPatientMedication",
      module: "MRD",
      method: "GET",
      data: {
        patient_id: location.state?.content.current_patient
          ? location.state?.content.current_patient
          : Window.global["mrd_patient"],
        fromHistoricalData: true,
      },
      cancelRequestId: "getPatientMedication",
      onSuccess: (response) => {
        if (response.data.success) {
          setData(response.data.records);
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  const getPatientTreatments = () => {
    algaehApiCall({
      uri: "/mrd/getPatientTreatments",
      module: "MRD",
      method: "GET",
      data: {
        patient_id: location.state?.content.current_patient
          ? location.state?.content.current_patient
          : Window.global["mrd_patient"],
      },
      cancelRequestId: "getPatientTreatments",
      onSuccess: (response) => {
        if (response.data.success) {
          setData(response.data.records);
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  const getPatientInvestigation = () => {
    algaehApiCall({
      uri: "/mrd/getPatientInvestigation",
      module: "MRD",
      method: "GET",
      data: {
        patient_id: location.state?.content.current_patient
          ? location.state?.content.current_patient
          : Window.global["mrd_patient"],
        fromHistoricalData: true,
      },
      cancelRequestId: "getPatientInvestigation",
      onSuccess: (response) => {
        if (response.data.success) {
          setData(response.data.records);
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  useEffect(() => {
    if (componentsName === "Diagnosis") {
      getPatientDiagnosis();
      setColumns([
        { name: "Diagnosis" },
        { name: "Code" },
        { name: "Type" },
        { name: "Final Dia." },
      ]);
    } else if (componentsName === "Treatments") {
      getPatientTreatments();
      setColumns([
        { name: "Doctor Name" },
        { name: "Service Name" },
        { name: "Service Description" },
        { name: "Teeth Number" },
      ]);
    } else if (componentsName === "Prescription") {
      getPatientMedicationHistoricalData();
      setColumns([
        // { name: "Generic Name" },
        { name: "Item Description" },
        { name: "Start Date" },
        { name: "Instructions" },
        // { name: "Dosage" },
        // { name: "Unit" },
        // { name: "Frequency" },
        // { name: "No. of Days" },
      ]);
    } else if (componentsName === "Investigations") {
      getPatientInvestigation();
      setColumns([
        { name: "Investigation Name" },
        { name: "Ordered By" },
        { name: "Lab Status" },
        // { name: "Lab Billed" },
        { name: "Rad Status" },
        // { name: "Radiology Billed" },
      ]);
    }
  }, [componentsName]);
  return (
    <>
      {data.map((item, i) => {
        return (
          <AccordionComponent
            display_date={item.display_date}
            columns={columns}
            user_display_name={item.user_name}
            componentsName={componentsName}
            listOfDetails={item.detailsOf}
          />
        );
      })}
    </>
  );
}
