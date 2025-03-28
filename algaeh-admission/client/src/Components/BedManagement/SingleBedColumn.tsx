import React, { memo } from "react";
import SingleCell from "./SingleCell";

export default memo(function SingleBedColumn(props: any) {
  const { groupDetail, item } = props;
  return (
    <div className="row bedSec">
      {groupDetail.map((data: any, index: number) => {
        const {
          bed_desc,
          bed_short_name,
          bed_id,
          bed_no,
          hims_adm_ward_detail_id,
          services_id,
          service_type_id,
          bed_status,
        } = data;
        return (
          <div key={hims_adm_ward_detail_id} className="bedCol">
            <SingleCell
              hims_adm_ward_header_id={item.hims_adm_ward_header_id}
              hims_adm_ward_detail_id={hims_adm_ward_detail_id}
              bed_short_name={bed_short_name}
              bed_id={bed_id}
              bed_no={bed_no}
              bed_desc={bed_desc}
              ward_desc={item.ward_desc}
              services_id={services_id}
              service_type_id={service_type_id}
              bed_status={bed_status}
            />
          </div>
        );
      })}
    </div>
  );
});
