import React from "react";
interface Item {
  item: {
    groupType: string;
    hims_adm_ward_header_id: number;
    ward_desc: string;
    ward_short_name: string;
    ward_type: string;
    groupDetail: [
      {
        bed_desc: string;
        bed_id: number;
        bed_no: number;
        bed_short_name: string;
        hims_adm_ward_detail_id: number;
        isInserted: number;
        service_name: string;
        status: string;
      }
    ];
  };
}
function BedCell(item: Item) {
  return (
    <div>
      {item.item.groupDetail.map((data: any, index: number) => {
        const {
          bed_desc,
          bed_short_name,
          // bed_id,
          bed_no,
          // service_name,
        } = data;
        return (
          <div className="col-12 bedBox" key={index}>
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
        );
      })}
    </div>
  );
}

export default BedCell;
