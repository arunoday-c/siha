import React, { useEffect, useContext } from "react";
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

export default function BedManagement(props: any) {
  // const [bedStatusData, setBedStatusData] = useState([]);
  const { bedStatusData, setBedStatusData } = useContext(BedManagementContext);
  useEffect(() => {
    bedStatusSetUp();
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

  // const context: any = useContext(MainContext);
  return (
    <div className="BedManagementScreen">
      <div className="col-12">
        <SelectWardSection />
      </div>
      <div className="row">
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
          {/* <li>
                  <span style={{ backgroundColor: "red" }}></span>Legend 1
                </li>
                <li>
                  <span style={{ backgroundColor: "red" }}></span>Legend 1
                </li>
                <li>
                  <span style={{ backgroundColor: "red" }}></span>Legend 1
                </li>
                <li>
                  <span style={{ backgroundColor: "red" }}></span>Legend 1
                </li> */}
        </ul>
      </div>
      <div className="col-12">
        <BedColumn />
      </div>
      {/* <div className="row">
        <div className="col">
          <button
            type="button"
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
            }}
            // disabled={disabled}
          >
            <AlgaehLabel label={{ fieldName: "btn_save" }} />
          </button>
          <button
            type="button"
            className="btn btn-default"
            // onClick={() => onClear(false)}
            // disabled={
            //   !disabled &&
            //   !appointment_id &&
            //   !patient_code &&
            //   !formState.isDirty
            // }
          >
            <AlgaehLabel label={{ fieldName: "btn_clear" }} />
          </button>
        </div>
      </div> */}
    </div>
  );
}
