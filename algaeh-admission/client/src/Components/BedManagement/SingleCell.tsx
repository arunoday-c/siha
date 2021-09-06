import { useContext } from "react";
import { PatAdmissionContext } from "../PatientAdmission/PatientAdmissionContext";
// import { BedManagementContext } from "./BedMangementContext";
import "./BedManagement.scss";
export function SingleCell({
  hims_adm_ward_detail_id,
  bed_short_name,
  bed_no,
  bed_desc,
  hims_adm_ward_header_id,
  ward_desc,
}: {
  hims_adm_ward_detail_id: number;
  bed_short_name: string;
  bed_no: number;
  bed_desc: string;
  hims_adm_ward_header_id: number | string;
  ward_desc: string;
}) {
  // const {
  //   selectedBedData,
  //   setSelectedBedData,
  //   // setWardHeaderData,
  //   // wardHeaderData,
  // } = useContext(BedManagementContext);
  const { selectedBedData, setSelectedBedData } =
    useContext(PatAdmissionContext);

  // const [selectedBed, setSelectedBed] = useState(false);
  // const [selectedBedData, setSelectedBedData] = useState<any>([]);
  return (
    <div>
      <span>
        <i className="fas fa-redo-alt"></i>
      </span>

      <div
        onClick={() => {
          // console.log("data", selectedBedData);
          // setSelectedBed(true);
          setSelectedBedData({
            hims_adm_ward_detail_id,
            hims_adm_ward_header_id,
            bed_short_name,
            bed_no,
            bed_desc,
            ward_desc,
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
