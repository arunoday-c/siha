import React, { useEffect, useState, useContext, memo } from "react";
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
// import { useForm, Controller } from "react-hook-form";

export default memo(function BedManagement(props: any) {
  const { fromAdmission } = props;
  const { setBedStatusData, setFromPatientAdmission } =
    useContext(BedManagementContext);
  const [bedStatus, setBedStatus] = useState([]);
  useEffect(() => {
    bedStatusSetUp();
    setFromPatientAdmission(fromAdmission ? fromAdmission : false);
    // getWardHeaderData();
  }, []); //eslint-disable-line
  // const { control, setValue, getValues, handleSubmit } = useForm({
  //   shouldFocusError: true,
  //   defaultValues: {
  //     hims_adm_bed_status_id: "Vacant",
  //     hims_adm_ward_header_id: undefined,
  //   },
  // });
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
      const allStatus = response.data.records.result;
      setBedStatus(response.data.records.result);
      // const allStatus = response.data.records.result;

      allStatus.unshift({
        description: "All",
      });

      setBedStatusData(allStatus);
    }
  };
  //eslint-disable-line

  // const getWardHeaderData = async (data?: string) => {
  //   const { response, error } = await algaehAxios(
  //     "/bedManagement/getWardHeaderData",
  //     {
  //       module: "admission",
  //       method: "GET",
  //       data: { hims_adm_ward_header_id: data },
  //     }
  //   );
  //   if (error) {
  //     if (error.show === true) {
  //       let extendedError: Error | any = error;
  //       AlgaehMessagePop({
  //         display: extendedError.response.data.message,
  //         type: "error",
  //       });
  //       throw error;
  //     }
  //   }
  //   if (response.data.success) {
  //     setWardHeaderData(response.data.records);
  //   }
  // };

  // const context: any = useContext(MainContext);
  return (
    <div
      className={fromAdmission ? "ModalBedManagement" : "BedManagementScreen"}
    >
      <div className="row">
        <div className="col-12">
          <SelectWardSection
            fromAdmissionprop={fromAdmission}
            // control={control} setValue={setValue} Controller={Controller} getValues={getValues} handleSubmit={handleSubmit}
          />
        </div>
        <div className="col-12">
          <ul className="ul-legend">
            {bedStatus?.length > 0
              ? bedStatus.map(
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
