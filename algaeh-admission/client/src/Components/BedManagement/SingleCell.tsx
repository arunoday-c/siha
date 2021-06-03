import React, { useState, useContext } from "react";
import { BedManagementContext } from "./BedMangementContext";
import "./BedManagement.scss";
export function SingleCell({
  hims_adm_ward_detail_id,
  bed_short_name,
  bed_no,
  bed_desc,
  hims_adm_ward_header_id,
}: {
  hims_adm_ward_detail_id: number;
  bed_short_name: string;
  bed_no: number;
  bed_desc: string;
  hims_adm_ward_header_id: number | string;
}) {
  const {
    selectedBedData,
    setSelectedBedData,
    // setWardHeaderData,
    // wardHeaderData,
  } = useContext(BedManagementContext);
  const [selectedBed, setSelectedBed] = useState(false);
  // const [selectedBedData, setSelectedBedData] = useState<any>([]);
  return (
    <div>
      <span>
        <i className="fas fa-redo-alt"></i>
      </span>

      <div
        onClick={() => {
          debugger;
          let bedData = selectedBedData;
          // setWardHeaderData(wardHeaderData);
          if (selectedBedData?.length > 0) {
            for (let i = 0; i < selectedBedData.length; i++) {
              debugger;
              if (
                selectedBedData[i].hims_adm_ward_detail_id ===
                hims_adm_ward_detail_id
              ) {
                setSelectedBed(false);

                setSelectedBedData(null);
              } else {
                setSelectedBed(true);
                setSelectedBedData({
                  hims_adm_ward_detail_id,
                  hims_adm_ward_header_id,
                  bed_short_name,
                  bed_no,
                  bed_desc,
                });
              }
            }
          } else {
            setSelectedBed(true);
            setSelectedBedData({
              hims_adm_ward_detail_id,
              hims_adm_ward_header_id,
              bed_short_name,
              bed_no,
              bed_desc,
            });
          }
        }}
        className={`col-12 bedBox ${selectedBed ? "singleBedSelect" : ""}`}
        style={{
          color: selectedBed ? "white" : "",
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
