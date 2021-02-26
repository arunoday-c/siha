import React, { useState, useEffect } from "react";
// import "./appointment_status.scss";
// import {
//   AlagehFormGroup,
//   AlgaehDataGrid,
//   AlgaehLabel,
//   AlagehAutoComplete,
// } from "../../Wrapper/algaehWrapper";
import {
  // AlgaehLabel,
  AlgaehFormGroup,
  AlgaehDataGrid,
  // AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehLabel,
  // AlgaehDateHandler,
  // AlgaehMessagePop,
  AlgaehSearch,
  algaehAxios,
  AlgaehMessagePop,
  // // DatePicker,
  // AlgaehModal,
  // AlgaehHijriDatePicker,
  // // AlgaehTreeSearch,
  // AlgaehSecurityComponent,

  //   AlgaehButton,
} from "algaeh-react-components";
// import { useQuery,ReactQueryCacheProvider } from "react-query";
import { Controller, useForm } from "react-hook-form";
import { result } from "lodash";

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

  bed_desc: string;
  bed_status: string;
  bed_short_name: string;
}
interface Response {
  data: { records: []; success: boolean };
}

export default function BedStatus(Props: any) {
  const [appointmentStatus, setAppointmentStatus] = useState([]);
  // const [color_code, setColor_code] = useState<string>("#FFFFFF");
  // const [description, setDescription] = useState<string>("");
  // const [default_status, setDefault_status] = useState<string>("");
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [currentRow, setCurrentRow] = useState<Row>();
  const [dropDownData, setDropDownData] = useState([]);
  // const [disableAdd, setDisableAdd] = useState<null | string>("none");
  // const [min_steps, setMin_steps] = useState<number | string | null>(null);
  // const [steps_list, setSteps_list] = useState([]);
  // appointmentStatus: [],
  // color_code: "#FFFFFF",
  // description: "",
  // default_status: "",
  // isEditable: true,
  // disableAdd: null,

  const { control, errors, reset, handleSubmit } = useForm({
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
  const updateReportMaster = async (data: Row) => {
    const { error, response } = await algaehAxios(
      "/bedManagement/updateBedType",
      {
        module: "admission",
        method: "PUT",
        data: { ...data, hims_adm_ip_bed_id: currentRow?.hims_adm_ip_bed_id },
      }
    );
    if (error) {
      if (error.show === true) {
        console.log("error=====", error);
      }
    }
    console.log("response", response);
    if (response) {
      getAppointmentStatus();
      reset();
    }
  };
  const getBedService = async () => {
    const { error, response } = await algaehAxios(
      "/bedManagement/getBedService",
      {
        module: "admission",
        method: "GET",
        // data: { ...data, hims_adm_ip_bed_id: currentRow?.hims_adm_ip_bed_id },
      }
    );
    if (error) {
      if (error.show === true) {
        console.log("error=====", error);
      }
    }

    if (response) {
      setDropDownData(response.data.records);
    }
  };
  const addNewReportsFromReportMaster = async (data: Row) => {
    const { error, response } = await algaehAxios(
      "/bedManagement/AddNewBedType",
      {
        module: "admission",
        method: "POST",
        data: { ...data },
      }
    );
    if (error) {
      if (error.show === true) {
      }
    }
    console.log("response", response);
    if (response) {
      return response.data.records;
    }
  };

  const getAppointmentStatus = async () => {
    const { response, error } = await algaehAxios(
      "/bedManagement/getBedStatus",
      {
        module: "admission",
        method: "GET",
      }
    );
    if (error) {
      if (error.show === true) {
        console.log("error=====", error);
      }
    }
    console.log("response", response);
    if (response) {
      debugger;
      setAppointmentStatus(response.data.records);
      console.log("appointmentStatus", appointmentStatus);
    }
  };
  useEffect(() => {
    getAppointmentStatus();
    // eslint-disable-next-line
    getBedService();
  }, []);
  const onEdit = (row: Row) => {
    reset({ ...row });
    setCurrentRow(row);
  };
  const onDelete = async (row: Row) => {
    const { response, error } = await algaehAxios(
      "/bedManagement/deleteBedStatus",
      {
        module: "admission",
        method: "DELETE",
        data: { ...row },
      }
    );
    if (error) {
      if (error.show === true) {
        AlgaehMessagePop({
          display: "Successfully Deleted",
          type: "success",
        });
      }
    }
    console.log("response", response);
    if (response) {
    }
  };

  const onSubmit = (data: any) => {
    console.error(errors);

    if (currentRow) {
      updateReportMaster(data);
    } else {
      addNewReportsFromReportMaster(data).then((result) => {
        getAppointmentStatus();
        reset({});
      });
    }
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
              <AlgaehFormGroup
                div={{ className: "col-2 form-group mandatory" }}
                label={{
                  fieldName: "color_code",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "color_code",
                  // value: this.state.color_code,
                  // events: {
                  //   onChange: this.changeTexts.bind(this),
                  // },
                  others: {
                    type: "color",
                    required: true,
                    checkvalidation: "$value === #ffffff",
                    errormessage: "Please Select a color",
                  },
                }}
              />
            )}
          />
          <Controller
            name="bed_desc"
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
                  name: "bed_desc",
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
                        fieldName: "actions",
                        label: <AlgaehLabel label={{ fieldName: "Actions" }} />,
                        displayTemplate: (row: Row) => {
                          return (
                            <>
                              <i
                                className="fas fa-pen"
                                onClick={() => {
                                  onEdit(row);
                                }}
                              ></i>

                              <i
                                className="fas fa-trash-alt"
                                onClick={() => onDelete(row)}
                              ></i>
                            </>
                          );
                        },
                        others: {
                          width: 50,
                        },
                      },
                      {
                        fieldName: "bed_desc",
                        label: (
                          <AlgaehLabel label={{ fieldName: "description" }} />
                        ),
                        // editorTemplate: (row: Row) => {
                        //   return (
                        //     <AlgaehFormGroup
                        //       div={{ className: "col" }}
                        //       label={{
                        //         fieldName: "",
                        //         // isImp: true,
                        //       }}
                        //       textBox={{
                        //         className: "txt-fld",
                        //         name: "bed_desc",

                        //         value: row.bed_desc,
                        //         events: {
                        //           onChange: () => {
                        //             changeGridEditors.bind(row);
                        //           },
                        //         },
                        //         others: {
                        //           errormessage: "Description - cannot be blank",
                        //           required: true,
                        //         },
                        //       }}
                        //     />
                        //   );
                        // },
                      },
                    ]}
                    // keyId="hims_d_appointment_status_id"
                    // rowUniqueId="hims_d_appointment_status_id"
                    data={appointmentStatus}
                    // isEditable={isEditable}
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
