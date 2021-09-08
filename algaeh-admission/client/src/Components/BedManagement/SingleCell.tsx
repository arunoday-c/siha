import { useContext } from "react";
import { PatAdmissionContext } from "../PatientAdmission/PatientAdmissionContext";
// import { BedManagementContext } from "./BedMangementContext";
import "./BedManagement.scss";
export function SingleCell({
  hims_adm_ward_detail_id,
  bed_short_name,
  bed_id,
  bed_no,
  bed_desc,
  hims_adm_ward_header_id,
  ward_desc,
  services_id,
  service_type_id,
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
}) {
  const { selectedBedData, setSelectedBedData } = useContext(
    PatAdmissionContext
  );

  return (
    <div>
      <span>
        <i className="fas fa-redo-alt"></i>
      </span>

      <div
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
        style={{
          color:
            selectedBedData?.hims_adm_ward_detail_id === hims_adm_ward_detail_id
              ? "white"
              : "",
        }}
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
}

// export function SingleCell;
