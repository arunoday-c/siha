import React, { useContext, memo } from "react";
import { PatAdmissionContext } from "../PatientAdmission/PatientAdmissionContext";
import { BedManagementContext } from "./BedMangementContext";
import {
  algaehAxios,
  AlgaehMessagePop,
  message,
} from "algaeh-react-components";
import "./BedManagement.scss";
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
  //
  const { selectedBedData, setSelectedBedData } =
    useContext(PatAdmissionContext);
  const { bedStatusData } = useContext(BedManagementContext);
  const bgColor = bedStatusData?.filter(
    (f: any) => f.description === bed_status
  )[0]?.bed_color;

  const getPatBedAdmissionDetails = async () => {
    const { response, error } = await algaehAxios(
      "/bedManagement/getPatBedAdmissionDetails",
      {
        module: "admission",
        method: "GET",
        data: { bed_id },
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
  const updateBedReleasingDetails = async (data: any) => {
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
  };

  return (
    <div>
      <span
        style={
          bed_status === "Booked"
            ? {}
            : { pointerEvents: "none", opacity: "0.4" }
        }
      >
        <i
          className="fas fa-redo-alt"
          onClick={() => {
            getPatBedAdmissionDetails()
              .then((response) => {
                updateBedReleasingDetails(response);
              })
              .catch((error) =>
                AlgaehMessagePop({ display: error.message, type: "error" })
              );
          }}
        ></i>
      </span>
      {/* <span disabled={bed_status==="Booked"?true:false}></span> */}
      <div
        style={
          bed_status === "Booked"
            ? {
                backgroundColor: bgColor,
                pointerEvents: "none",
                opacity: "0.4",
              }
            : { backgroundColor: bgColor }
        }
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
        className={`col-12 bedBox ${
          selectedBedData?.hims_adm_ward_detail_id === hims_adm_ward_detail_id
            ? "singleBedSelect"
            : ""
        }`}
        // style={{
        //   color:
        //     selectedBedData?.hims_adm_ward_detail_id === hims_adm_ward_detail_id
        //       ? "white"
        //       : "",
        // }}
        key={hims_adm_ward_detail_id}
      >
        {/* <span>
                                  <b>{service_name}</b>
                                </span> */}

        <span>
          <b>
            {bed_short_name}-{bed_no}
          </b>
        </span>
        <span>{bed_desc}</span>
        {/* <span>{bed_short_name}</span> */}
      </div>
    </div>
  );
});

// export function SingleCell;
