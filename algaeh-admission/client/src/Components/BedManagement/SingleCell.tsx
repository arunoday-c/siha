import React from "react";

function SingleCell({
  hims_adm_ward_detail_id,
  bed_short_name,
  bed_no,
  bed_desc,
}: {
  hims_adm_ward_detail_id: number;
  bed_short_name: string;
  bed_no: number;
  bed_desc: string;
}) {
  return (
    <div>
      <div className="col-12 bedBox" key={hims_adm_ward_detail_id}>
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

export default SingleCell;
