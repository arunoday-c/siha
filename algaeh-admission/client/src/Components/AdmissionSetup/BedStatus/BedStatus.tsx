import React, { useState, useEffect } from "react";

import {
  // AlgaehLabel,
  AlgaehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  algaehAxios,
  AlgaehMessagePop,
} from "algaeh-react-components";
// import { useQuery,ReactQueryCacheProvider } from "react-query";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";

// const getBedService = async (key: any) => {
//   const { response } = await algaehAxios("/bedManagement/getBedService", {
//     module: "admission",
//     method: "GET",

//     // data: { ...data, hims_adm_ip_bed_id: currentRow?.hims_adm_ip_bed_id },
//   });
//   return response.data.records;
// };
// import { debounce } from "lodash";

// import {
//   algaehApiCall,
//   swalMessage,
// } from "../../../../../client/src/utils/algaehApiCall";

// import swal from "sweetalert2";
// import GlobalVariables from "../../../../../client/src/utils/GlobalVariables.json";
// import { AlgaehValidation } from "../../../utils/GlobalFunctions";
// import _ from "lodash";
interface Row {
  hims_adm_ip_bed_id?: number;
  bed_color?: string;
  steps?: number;
  description: string;
  bed_status: string;
  bed_short_name: string;
  record_status?: string;
}
// interface Response {
//   data: { records: []; success: boolean };
// }
interface Error {
  show: boolean;
  response: { data: { message: string; success: boolean } };
}
export default function BedStatus(Props: any) {
  const [bedStatusData, setBedStatusData] = useState<any>([]);
  // const [color_code, setColor_code] = useState<string>("#FFFFFF");
  // const [description, setDescription] = useState<string>("");
  // const [default_status, setDefault_status] = useState<string>("");
  // const [isEditable, setIsEditable] = useState<boolean>(true);

  // const [disableAdd, setDisableAdd] = useState<null | string>("none");
  // const [min_steps, setMin_steps] = useState<number | string | null>(null);
  // const [steps_list, setSteps_list] = useState([]);
  // appointmentStatus: [],
  // color_code: "#FFFFFF",
  // description: "",
  // default_status: "",
  // isEditable: true,
  // disableAdd: null,

  const { control, errors, reset, setValue, handleSubmit } = useForm({
    shouldFocusError: true,
  });

  // const { data: DropDownData } = useQuery(["bedServiceData"], getBedService, {
  //   // initialStale: true,
  //   // onSuccess: (data) => {

  //   // },
  //   onError: (err: any) => {
  //     AlgaehMessagePop({
  //       display: err?.message,
  //       type: "error",
  //     });
  //   },
  // });
  // resetState() {
  //   this.setState(this.baseState);
  // }

  // changeTexts(e) {
  //   this.setState({ [e.target.name]: e.target.value });

  //   if (e.target.name === "description") {
  //     this.setState({ steps: this.state.appointmentStatus.length + 1 });
  //   }

  //   if (e.target.name === "steps" && e.target.value === "1") {
  //     this.setState({ default_status: "Y" });
  //   }
  // }
  const updateBedStatus = async (data: Row) => {
    const { error, response } = await algaehAxios(
      "/bedManagement/updateBedStatus",
      {
        module: "admission",
        method: "PUT",
        data: { ...data },
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
    console.log("response", response);
    if (response) {
      if (response.data.success) {
        bedStatusSetUp();
        reset();
        AlgaehMessagePop({
          display: "Successfully Updated",
          type: "success",
        });
      }
    }
  };

  const addBedStatus = async (data: Row) => {
    const { error, response } = await algaehAxios(
      "/bedManagement/addBedStatus",
      {
        module: "admission",
        method: "POST",
        data: { ...data },
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
      return response.data.records;
    }
  };

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
      debugger;
      setValue(
        "steps",
        parseInt(
          response.data.records.last_inserted
            ? response.data.records.last_inserted
            : 0
        ) + 1
      );
      setBedStatusData(response.data.records.result);
      return response.data.records;
    }
  };
  useEffect(() => {
    bedStatusSetUp();
    // eslint-disable-next-line
    // getBedService();
  }, []);
  // const onEdit = (row: Row) => {
  //   reset({ ...row });
  //   setCurrentRow(row);
  // };
  const onDeleteBedStatus = async (row: Row) => {
    const { response, error } = await algaehAxios(
      "/bedManagement/onDeleteBedStatus",
      {
        module: "admission",
        method: "PUT",
        data: { ...row },
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
    console.log("response", response);
    if (response) {
      AlgaehMessagePop({
        display: "Successfully Deleted",
        type: "success",
      });
    }
  };

  const onSubmit = (data: any) => {
    console.error(errors);

    addBedStatus(data).then(() => {
      bedStatusSetUp().then((result) => {
        reset({
          bed_color: "#ffffff",
          description: "",
          steps: parseInt(result.last_inserted) + 1,
        });
      });
      AlgaehMessagePop({
        display: "Successfully Added...",
        type: "success",
      });
    });
  };

  return (
    <div className="appointment_status">
      <form onSubmit={handleSubmit(onSubmit)} onError={onSubmit}>
        <div className="row inner-top-search">
          {/* <Controller
            name="color_code"
            control={control}
            rules={{ required: "Please Select a color" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{ className: "col-2 mandatory form-group" }}
                error={errors}
                label={{
                  forceLabel: "color code",
                  isImp: true,
                }}
                textBox={{
                  ...props,
                  className: "txt-fld",
                  name: "color_code",
                  others: {
                    type: "color",
                    required: true,
                    checkvalidation: "$value === #ffffff",
                    errormessage: "Please Select a color",
                  },
                }}
              />
            )}
          /> */}

          <Controller
            name="bed_color"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <div
                component-role="textbox"
                validator-required="true"
                validator-value="focus-on"
                focus-on="input"
                className="col-2 form-group mandatory "
              >
                <label className="style_Label">
                  Color Code<span className="imp">&nbsp;*</span>
                </label>
                <input
                  className="ant-input txt-fld"
                  // name="bed_color"
                  // value={
                  //   props.value === "" || !props.value ? "#ffffff" : props.value
                  // }

                  {...props}
                  type="color"
                />
              </div>
              // <AlgaehFormGroup
              //   div={{ className: "col-2 form-group mandatory" }}
              //   label={{
              //     fieldName: "color_code",
              //     isImp: true,
              //   }}
              //   textBox={{
              //     className: "txt-fld",
              //     name: "color_code",

              //     others: {
              //       type: "color",
              //       required: true,
              //       checkvalidation: "$value === #ffffff",
              //       errormessage: "Please Select a color",
              //     },
              //   }}
              // />
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{ className: "col-2 mandatory form-group" }}
                error={errors}
                label={{
                  forceLabel: "Bed Description",
                  isImp: true,
                }}
                textBox={{
                  ...props,
                  className: "txt-fld",
                  name: "description",
                }}
              />
            )}
          />
          <Controller
            name="steps"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{ className: "col-2 mandatory form-group" }}
                error={errors}
                label={{
                  forceLabel: "steps",
                  isImp: true,
                }}
                textBox={{
                  ...props,
                  className: "txt-fld",
                  name: "steps",
                  disabled: true,
                }}
              />
            )}
          />

          <div className="col">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: 21 }}
            >
              Add to List
            </button>
            {/* <button
              style={{ marginTop: 20, marginLeft: 15, float: "right" }}
              onClick={() => {
                reset({});
              }}
              className="btn btn-default"
            >
              Clear
            </button> */}
          </div>
        </div>
      </form>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <div
                  className="col-12"
                  data-validate="apptStatusDiv"
                  id="apptStatusDivCntr"
                >
                  {/* <button
                    onClick={() => {
                      AlgaehSearch();
                    }}
                  >
                    Search
                  </button> */}
                  <AlgaehDataGrid
                    // id="appt-status-grid"
                    // datavalidate="data-validate='apptStatusDiv'"
                    columns={[
                      {
                        fieldName: "bed_color",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Bed Color" }} />
                        ),
                        displayTemplate: (row: Row) => {
                          return (
                            <div
                              className="col"
                              style={{
                                backgroundColor: "" + row.bed_color,
                                height: "20px",
                                margin: "auto",
                              }}
                            />
                          );
                        },
                        editorTemplate: (row: Row) => {
                          return (
                            <div className="row">
                              <input
                                className="col-lg-11"
                                name="bed_color"
                                defaultValue={row.bed_color}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  let name = e.target.name;
                                  let value = e.target.value;
                                  row[name] = value;
                                }}
                                type="color"
                              />
                            </div>
                          );
                        },
                      },
                      {
                        fieldName: "description",
                        label: (
                          <AlgaehLabel label={{ fieldName: "description" }} />
                        ),
                        editorTemplate: (row: Row) => {
                          return (
                            <AlgaehFormGroup
                              div={{ className: "col" }}
                              label={
                                {
                                  // forceLabel: "BED NO.",
                                  // isImp: true,
                                }
                              }
                              textBox={{
                                type: "text",
                                value: row.description,
                                className: "form-control",
                                name: "bed_no",
                                updateInternally: true,
                                onChange: (
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  row.description = e.target.value;
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "steps",
                        label: <AlgaehLabel label={{ fieldName: "Steps" }} />,
                        editorTemplate: (row: Row) => {
                          return row.steps;
                        },
                      },
                      {
                        fieldName: "record_status",
                        label: <AlgaehLabel label={{ fieldName: "Status" }} />,
                        displayTemplate: (row: Row) => {
                          return row.record_status === "A"
                            ? "Active"
                            : "InActive";
                        },
                        editorTemplate: (row: Row) => {
                          return row.record_status === "A"
                            ? "Active"
                            : "InActive";
                        },
                      },
                    ]}
                    // keyId="hims_d_appointment_status_id"
                    // rowUniqueId="hims_d_appointment_status_id"
                    data={bedStatusData}
                    isEditable={true}
                    events={{
                      onCancel: (row) => {},
                      onDeleteShow: (row) => {},
                      onSaveShow: (row) => {},
                      onEdit: (row) => {},
                      onSave: (row) => {
                        updateBedStatus(row);
                      },
                      onDelete: (row) => {
                        onDeleteBedStatus(row);
                      },
                    }}
                    isFilterable={true}
                    pagination={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // export default BedStatus;
  // import React from "react";
  // export default function BedStatus() {
  //   return <h4>test</h4>;
}
