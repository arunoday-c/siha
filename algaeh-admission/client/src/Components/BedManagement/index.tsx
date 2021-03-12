import React, { useEffect, useState } from "react";
import "./BedManagement.scss";
import {
  AlgaehAutoComplete,
  algaehAxios,
  AlgaehMessagePop,
  // MainContext,
} from "algaeh-react-components";
import { useForm, Controller, useWatch } from "react-hook-form";
import { SingleCell } from "./SingleCell";

interface IFormInputs {
  // name: string;
  hims_adm_ward_header_id: string;
}

export default function BedManagement(props: any) {
  const { control, setValue } = useForm<IFormInputs>();

  const [wardHeaderData, setWardHeaderData] = useState([]);
  const [bedStatusData, setBedStatusData] = useState([]);
  useEffect(() => {
    getWardHeaderData();
    bedStatusSetUp();
  }, []);
  const { hims_adm_ward_header_id } = useWatch({
    control,
    name: ["hims_adm_ward_header_id"],
  });
  useEffect(() => {
    getWardHeaderData(hims_adm_ward_header_id);
  }, [hims_adm_ward_header_id]);
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
      <div className="row inner-top-search">
        <Controller
          name="hims_adm_ward_header_id"
          control={control}
          // rules={{ required: "Select Ward Type " }}
          render={({ value, onChange }) => (
            <AlgaehAutoComplete
              div={{ className: "col-2  form-group mandatory" }}
              label={{
                forceLabel: "Filter By Ward",
                // isImp: true,
              }}
              // error={errors}
              selector={{
                name: "hims_adm_ward_header_id",
                value,
                onChange: (_: any, selected: any) => {
                  onChange(selected);

                  getWardHeaderData(selected);
                  // setValue("service_amount", _.standard_fee);
                },

                onClear: () => {
                  onChange("");
                },

                dataSource: {
                  textField: "ward_desc",
                  valueField: "hims_adm_ward_header_id",
                  data: wardHeaderData,
                },
                // others: {
                //   disabled: hims_adm_ward_header_id,

                //   tabIndex: "4",
                // },
              }}
            />
          )}
        />{" "}
        <button
          className="btn btn-default btn-small"
          style={{ marginTop: 21 }}
          onClick={() => setValue("hims_adm_ward_header_id", undefined)}
        >
          clear
        </button>
      </div>
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Ward and Bed List</h3>
          </div>

          <div className="actions">
            <ul className="ul-legend">
              {bedStatusData !== undefined
                ? bedStatusData.map(
                    (
                      data: { bed_color: string; description: string },
                      index
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
        </div>
        <div className="portlet-body">
          <div className="col-12">
            <div className="row">
              {wardHeaderData.map((item: any, key: number) => (
                <div className="col-1 WardCol" key={key}>
                  <>
                    <div className="row">
                      <div className="col-12 WardHdg">
                        <h3>{item.ward_desc}</h3>
                      </div>
                    </div>
                    <div className="row ">
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

                          {/* <BedCell item={item} /> */}
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
