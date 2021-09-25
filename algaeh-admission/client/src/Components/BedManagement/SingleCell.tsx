import React, { useContext, memo, useEffect, useState } from "react";
import { PatAdmissionContext } from "../PatientAdmission/PatientAdmissionContext";
import { BedManagementContext } from "./BedMangementContext";
import { algaehAxios, AlgaehMessagePop, Modal } from "algaeh-react-components";

import "./BedManagement.scss";

const { confirm } = Modal;
export default memo(function SingleCell({
  hims_adm_ward_detail_id,
  bed_short_name,
  bed_id,
  bed_no,
  bed_desc,
  hims_adm_ward_header_id,
  ward_desc,
  services_id,
  service_type_id,
  bed_status,
}: {
  hims_adm_ward_detail_id: number;
  bed_short_name: string;
  bed_id: number;
  bed_no: number;
  bed_desc: string;
  hims_adm_ward_header_id: number | string;
  ward_desc: string;
  services_id: number;
  service_type_id: number;
  bed_status: string;
}) {
  const [patientData, setPatientData] = useState<any>({});
  useEffect(() => {
    if (bed_status === "Occupied") {
      getPatBedAdmissionDetails().then((response) => {
        getPatientAdmissionDetails(response).then((response) => {
          setPatientData(response[0]);

          console.log("patientData", patientData);
          return;
        });
      });
    }
  }, []);
  const { selectedBedData, setSelectedBedData } =
    useContext(PatAdmissionContext);
  const {
    bedStatusData,
    setWardHeaderData,
    hims_adm_bed_status_id,
    ward_header_id,
    fromAdmission,
  } = useContext(BedManagementContext);
  const bgColor = bedStatusData?.filter(
    (f: any) => f.description === bed_status
  )[0]?.bed_color;
  async function getWardHeaderData(data: any) {
    const { response, error } = await algaehAxios(
      "/bedManagement/getWardHeaderData",
      {
        module: "admission",
        method: "GET",
        data: { ...data },
      }
    );
    if (error) {
      if (error.show === true) {
        let extendedError: Error | any = error;
        AlgaehMessagePop({
          display: extendedError.response.data.message,
          type: "error",
        });
        throw error;
      }
    }
    if (response.data.success) {
      setWardHeaderData(response.data.records);
    }
  }
  const getPatientAdmissionDetails = async (data: any) => {
    const { response, error } = await algaehAxios(
      "/frontDesk/getPatientAdmissionDetails",
      {
        module: "frontDesk",
        method: "GET",
        data: { patient_id: data.patient_id, hims_adm_ward_detail_id },
      }
    );
    if (error) {
      if (error.show === true) {
        let extendedError: Error | any = error;
        AlgaehMessagePop({
          display: extendedError.response.data.message,
          type: "error",
        });
        throw error;
      }
    }
    if (response.data.success) {
      return response.data.records;
    }
  };

  const getPatBedAdmissionDetails = async () => {
    const { response, error } = await algaehAxios(
      "/bedManagement/getPatBedAdmissionDetails",
      {
        module: "admission",
        method: "GET",
        data: { bed_id, hims_adm_ward_detail_id },
      }
    );
    if (error) {
      if (error.show === true) {
        let extendedError: Error | any = error;
        AlgaehMessagePop({
          display: extendedError.response.data.message,
          type: "error",
        });
        throw error;
      }
    }
    if (response.data.success) {
      return response.data.records;
    }
  };
  const updateBedStatusUnavailable = async () => {
    debugger;
    confirm({
      okText: "Yes",
      okType: "primary",
      icon: "",
      title: "Are You sure you want to confirm ?",
      maskClosable: true,
      onOk: async () => {
        const { response, error } = await algaehAxios(
          "/bedManagement/updateBedStatusUnavailable",
          {
            module: "admission",
            method: "PUT",
            data: { hims_adm_ward_detail_id },
          }
        );
        if (error) {
          if (error.show === true) {
            let extendedError: Error | any = error;
            AlgaehMessagePop({
              display: extendedError.response.data.message,
              type: "error",
            });
            throw error;
          }
        }
        if (response.data.success) {
          return response.data.records;
        }
      },
    });
  };
  const updateBedReleasingDetails = async (data: any) => {
    confirm({
      okText: "Yes",
      okType: "primary",
      icon: "",
      title: "Are You sure you want to Release The bed ?",
      maskClosable: true,
      onOk: async () => {
        const { response, error } = await algaehAxios(
          "/bedManagement/updateBedReleasingDetails",
          {
            module: "admission",
            method: "PUT",
            data: { ...data, hims_adm_ward_detail_id },
          }
        );
        if (error) {
          if (error.show === true) {
            let extendedError: Error | any = error;
            AlgaehMessagePop({
              display: extendedError.response.data.message,
              type: "error",
            });
            throw error;
          }
        }
        if (response.data.success) {
          return response.data.records;
        }
      },
    });
  };

  return (
    <div
      style={
        bed_status === "Occupied"
          ? {
              backgroundColor: bgColor,
              // pointerEvents: "none",
              // opacity: "0.4",
            }
          : { backgroundColor: bgColor }
      }
      className={`${
        selectedBedData?.hims_adm_ward_detail_id === hims_adm_ward_detail_id
          ? "singleBedSelect"
          : ""
      }`}
    >
      {!fromAdmission ? (
        <>
          <span className="bedBox">
            <b>
              {bed_short_name}-{bed_no}
            </b>
            {bed_desc}
          </span>

          <span className="actionSec">
            <i
              className="fas fa-redo-alt"
              onClick={() => {
                getPatBedAdmissionDetails()
                  .then((response) => {
                    updateBedReleasingDetails(response);
                    getWardHeaderData({
                      hims_adm_ward_header_id: ward_header_id,
                      hims_adm_bed_status_id: hims_adm_bed_status_id,
                    });
                  })
                  .catch((error) =>
                    AlgaehMessagePop({ display: error.message, type: "error" })
                  );
              }}
              style={
                bed_status === "Occupied" || bed_status === "Unavailable"
                  ? {}
                  : { pointerEvents: "none", opacity: "0.2" }
              }
            ></i>{" "}
            <i
              onClick={() => {
                updateBedStatusUnavailable()
                  .then((response) => {
                    getWardHeaderData({
                      hims_adm_ward_header_id: ward_header_id,
                      hims_adm_bed_status_id: hims_adm_bed_status_id,
                    });
                  })
                  .catch((error) =>
                    AlgaehMessagePop({ display: error.message, type: "error" })
                  );
              }}
              className="fas fa-times-circle"
              // fa-tick
              style={
                bed_status !== "Vacant"
                  ? { pointerEvents: "none", opacity: "0.5" }
                  : {}
              }
            ></i>
          </span>
        </>
      ) : (
        <>
          <span
            onClick={() => {
              setSelectedBedData({
                hims_adm_ward_detail_id,
                hims_adm_ward_header_id,
                bed_short_name,
                bed_id,
                bed_no,
                bed_desc,
                ward_desc,
                services_id,
                service_type_id,
              });
            }}
            className={`bedBox`}
            key={hims_adm_ward_detail_id}
          >
            <span>
              <b>
                {bed_short_name}-{bed_no}
              </b>
            </span>
            <span>{bed_desc}</span>
          </span>
        </>
      )}

      {bed_status === "Occupied" ? (
        <div
          className="bookedDetails animated slideInDown faster"
          style={
            bed_status === "Occupied"
              ? {
                  backgroundColor: bgColor,
                }
              : { backgroundColor: bgColor }
          }
        >
          {/* {patientData ? ( */}
          <div className="row">
            <div className="col">
              <small>Patient Name</small>
              <b>{patientData.full_name}</b>
            </div>
            <div className="col">
              <small>Contact Number</small>
              <b>
                {patientData.tel_code} {patientData.contact_number}{" "}
              </b>
            </div>
            {/* <div className="col">
              <small>Name</small>
              <b>Name</b>
            </div>
            <div className="col">
              <small>Name</small>
              <b>Name</b>
            </div>
            <div className="col">
              <small>Name</small>
              <b>Name</b>
            </div> */}
          </div>
          {/* ) : null} */}
        </div>
      ) : null}
    </div>
  );
});
