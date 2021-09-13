import React, { useEffect, useContext, memo } from "react";
import "./BedManagement.scss";
import {
  // AlgaehAutoComplete,
  algaehAxios,
  AlgaehMessagePop,
  // MainContext,
  // AlgaehLabel,
} from "algaeh-react-components";
import BedColumn from "./BedColumn";
import { BedManagementContext } from "./BedMangementContext";
import SelectWardSection from "./SelectWardSection";

export default memo(function BedManagement(props: any) {
  const { bedStatusData, setBedStatusData, setWardHeaderData } =
    useContext(BedManagementContext);
  useEffect(() => {
    bedStatusSetUp();
    getWardHeaderData();
  }, []); //eslint-disable-line

  const bedStatusSetUp = async () => {
    const { response, error } = await algaehAxios(
      "/bedManagement/bedStatusSetUp",
      {
        module: "admission",
        method: "GET",
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
      setBedStatusData(response.data.records.result);
    }
  };
  //eslint-disable-line

  const getWardHeaderData = async (data?: string) => {
    const { response, error } = await algaehAxios(
      "/bedManagement/getWardHeaderData",
      {
        module: "admission",
        method: "GET",
        data: { hims_adm_ward_header_id: data },
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
  };

  // const context: any = useContext(MainContext);
  return (
    <div className="BedManagementScreen">
      <div className="row">
        <div className="col-12">
          <SelectWardSection />
        </div>
        <div className="col-12">
          <ul className="ul-legend">
            {bedStatusData?.length > 0
              ? bedStatusData.map(
                  (
                    data: { bed_color: string; description: string },
                    index: number
                  ) => (
                    <li key={index}>
                      <span
                        style={{
                          backgroundColor: data.bed_color,
                        }}
                      />
                      {/* {context.userLanguage === "ar" */}
                      {data.description}
                      {/* : data.statusDesc} */}
                    </li>
                  )
                )
              : null}
          </ul>
        </div>
        <div className="col-12 bedCntr">
          <BedColumn />
        </div>
      </div>
    </div>
  );
});
