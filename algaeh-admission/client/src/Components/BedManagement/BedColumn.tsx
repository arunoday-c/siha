import { useContext, memo } from "react";
import { BedManagementContext } from "./BedMangementContext";
import SingleBedColumn from "./SingleBedColumn";

export default memo(function BedColumn() {
  const { wardHeaderData } = useContext(BedManagementContext);
  return (
    <div>
      <div className="col-12">
        <div className="row">
          {wardHeaderData?.length > 0
            ? wardHeaderData?.map((item: any, key: number) => (
                <div className="col-12 WardCol" key={key}>
                  <>
                    <div className="row">
                      <div className=" WardHdg">
                        <h3>{item.ward_desc}</h3>
                      </div>
                    </div>
                    <SingleBedColumn
                      groupDetail={item.groupDetail}
                      item={item}
                    />
                    {/* <div className="row ">
                      <div className="col-12 bedCol">
                        <div className="row">
                          {item.groupDetail.map((data: any, index: number) => {
                            
                            const {
                              bed_desc,
                              bed_short_name,
                              // bed_id,
                              bed_no,
                              // service_name,
                              hims_adm_ward_detail_id,
                            } = data;
                            return (
                              <div key={hims_adm_ward_detail_id}>
                                <SingleCell
                                  hims_adm_ward_header_id={
                                    item.hims_adm_ward_header_id
                                  }
                                  hims_adm_ward_detail_id={
                                    hims_adm_ward_detail_id
                                  }
                                  bed_short_name={bed_short_name}
                                  bed_no={bed_no}
                                  bed_desc={bed_desc}
                                />
                              </div>
                            );
                          })}

                      
                        </div>
                      </div>
                    </div> */}
                  </>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
});
