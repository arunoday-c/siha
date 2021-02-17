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
  // // DatePicker,
  // AlgaehModal,
  // AlgaehHijriDatePicker,
  // // AlgaehTreeSearch,
  // AlgaehSecurityComponent,

  //   AlgaehButton,
} from "algaeh-react-components";
import { Controller, useForm } from "react-hook-form";
// import {
//   algaehApiCall,
//   swalMessage,
// } from "../../../../../client/src/utils/algaehApiCall";

// import swal from "sweetalert2";
// import GlobalVariables from "../../../../../client/src/utils/GlobalVariables.json";
// import { AlgaehValidation } from "../../../utils/GlobalFunctions";
// import _ from "lodash";
interface Row {
  hims_d_appointment_status_id: number;
  color_code: string;
  description: string;
  default_status: string;
  steps?: string;
  statusDesc?: string;
  authorized?: string;
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
  const [disableAdd, setDisableAdd] = useState<null | string>("none");
  const [min_steps, setMin_steps] = useState<number | string | null>(null);
  // const [steps_list, setSteps_list] = useState([]);
  // appointmentStatus: [],
  // color_code: "#FFFFFF",
  // description: "",
  // default_status: "",
  // isEditable: true,
  // disableAdd: null,

  const { control, errors } = useForm({
    shouldFocusError: true,
    defaultValues: {
      requesting_date: new Date(),
      //   from_due_date: new Date(),
      //   to_due_date: new Date(),
    },
  });
  const changeGridEditors = (row: Row, e: any) => {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    if (name === "description") {
      row["statusDesc"] = value;
    }
    row[name] = value;
    // row.update();
  };

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

  // dropDownHandler(value) {
  //   this.setState({ [value.name]: value.value }, () => {
  //     this.state.default_status === "Y"
  //       ? this.setState({ steps: 1 })
  //       : this.setState({
  //           steps: this.state.appointmentStatus.length + 1,
  //         });
  //   });
  // }

  // hasDuplicates(array) {
  //   var valuesSoFar = Object.create(null);
  //   for (var i = 0; i < array.length; ++i) {
  //     var value = array[i];
  //     if (value in valuesSoFar) {
  //       return true;
  //     }
  //     valuesSoFar[value] = true;
  //   }
  //   return false;
  // }

  // authorizeApptStatus() {
  //   this.state.appointmentStatus.length > 0
  //     ? swal({
  //         title:
  //           "This is a one time setup, are you sure you want to authorize the Status for Appointment set?",
  //         type: "warning",
  //         showCancelButton: true,
  //         confirmButtonText: "Yes",
  //         confirmButtonColor: "#44b8bd",
  //         cancelButtonColor: "#d33",
  //         cancelButtonText: "No",
  //       }).then((willDelete) => {
  //         if (willDelete.value) {
  //           this.hasDuplicates(this.state.steps_list)
  //             ? swalMessage({
  //                 title:
  //                   "There are repeated values, please re-check the status",
  //                 type: "warning",
  //                 timer: 5000,
  //               })
  //             : algaehApiCall({
  //                 uri: "/appointment/appointmentStatusAuthorized",
  //                 module: "frontDesk",
  //                 method: "PUT",
  //                 onSuccess: (response) => {
  //                   if (response.data.success) {
  //                     this.setState({
  //                       isEditable: false,
  //                     });
  //                     swalMessage({
  //                       title: "Status Authorized successfully . .",
  //                       type: "success",
  //                     });
  //                     this.getAppointmentStatus();
  //                   }
  //                 },
  //                 onFailure: (error) => {
  //                   swalMessage({
  //                     title: error.message,
  //                     type: "error",
  //                   });
  //                 },
  //               });
  //         } else {
  //           swalMessage({
  //             title: "Not authorized",
  //             type: "error",
  //           });
  //         }
  //       })
  //     : swalMessage({
  //         title: "Please add the status first and then authorize",
  //       });
  // }

  // const deleteAppointmentStatus = (data: Row) => {
  //   swal({
  //     title: "Are you sure you want to delete this Status?",
  //     type: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes",
  //     confirmButtonColor: "#44b8bd",
  //     cancelButtonColor: "#d33",
  //     cancelButtonText: "No",
  //   }).then((willDelete: any) => {
  //     if (willDelete.value) {
  //       algaehApiCall({
  //         uri: "/appointment/updateAppointmentStatus",
  //         module: "frontDesk",
  //         data: {
  //           hims_d_appointment_status_id: data.hims_d_appointment_status_id,
  //           color_code: data.color_code,
  //           description: data.description,
  //           default_status: data.default_status,
  //           record_status: "I",
  //         },
  //         method: "PUT",
  //         onSuccess: (response: Response) => {
  //           if (response.data.success) {
  //             swalMessage({
  //               title: "Record deleted successfully . .",
  //               type: "success",
  //             });

  //             // this.getAppointmentStatus();
  //           }
  //         },
  //         onFailure: (error: any) => {
  //           swalMessage({
  //             title: error.message,
  //             type: "error",
  //           });
  //         },
  //       });
  //     }
  //   });
  // };

  // const updateAppointmentStatus = (data: Row) => {
  //   algaehApiCall({
  //     uri: "/appointment/updateAppointmentStatus",
  //     module: "frontDesk",
  //     data: {
  //       hims_d_appointment_status_id: data.hims_d_appointment_status_id,
  //       color_code: data.color_code,
  //       description: data.description,
  //       default_status: data.default_status,
  //       steps: data.steps,
  //       record_status: "A",
  //     },
  //     method: "PUT",
  //     onSuccess: (response: Response) => {
  //       if (response.data.success) {
  //         swalMessage({
  //           title: "Record updated successfully . .",
  //           type: "success",
  //         });

  //         // this.getAppointmentStatus();
  //       }
  //     },
  //     onFailure: (error: any) => {
  //       swalMessage({
  //         title: error.response.data.message,
  //         type: "error",
  //       });
  //       // this.getAppointmentStatus();
  //     },
  //   });
  // };

  const getAppointmentStatus = async () => {
    debugger;
    const { response, error } = await algaehAxios("/bedMaster/getBedStatus", {
      module: "admission",
      method: "GET",
    });
    if (error) {
      if (error.show === true) {
        console.log("error=====", error);
      }
    }
    console.log("response", response);
    if (response) {
      debugger;
    }
    // Props.algaehApiCall({
    //   uri: "/appointment/getAppointmentStatus",
    //   module: "frontDesk",
    //   method: "GET",
    //   onSuccess: (response: Response) => {
    //     if (response.data.success) {
    //       setAppointmentStatus(response.data.records);

    //       //steps: this.state.appointmentStatus.length + 1,
    //       setMin_steps(appointmentStatus.length + 1);
    //       // let steps_list: any[any];
    //       // steps_list = Enumerable.from(appointmentStatus)
    //       //   .select((w: { steps: any }) => w.steps)
    //       //   .toArray();

    //       // setSteps_list(steps_list);

    //       let authCount = _.chain(appointmentStatus)
    //         .filter((w: any) => w.authorized === "Y")
    //         .value().length;

    //       if (authCount > 0 && authCount === appointmentStatus.length) {
    //         setIsEditable(false);
    //         setDisableAdd("none");
    //       }
    //     }
    //   },
    //   onFailure: (error: any) => {
    //     AlgaehMessagePop({
    //       display: error.message,
    //       type: "error",
    //     });
    //   },
    // });
  };
  useEffect(() => {
    getAppointmentStatus();
    // eslint-disable-next-line
  }, []);
  // componentDidMount() {
  //   this.getAppointmentStatus();
  // }

  // addAppointmentStatus(e) {
  //   e.preventDefault();

  //   AlgaehValidation({
  //     alertTypeIcon: "warning",
  //     onSuccess: () => {
  //       this.state.steps_list.includes(parseInt(this.state.steps, 10))
  //         ? swalMessage({
  //             title:
  //               "Order already exists please select a unique order number?",
  //             type: "warning",
  //           })
  //         : algaehApiCall({
  //             uri: "/appointment/addAppointmentStatus",
  //             module: "frontDesk",
  //             method: "POST",
  //             data: {
  //               color_code: this.state.color_code,
  //               description: this.state.description,
  //               default_status: this.state.default_status,
  //               steps: this.state.steps,
  //             },
  //             onSuccess: (response) => {
  //               if (response.data.success) {
  //                 swalMessage({
  //                   title: "Record added successfully",
  //                   type: "success",
  //                 });

  //                 this.resetState();
  //                 this.getAppointmentStatus();
  //               }
  //             },
  //             onFailure: (error) => {},
  //           });
  //     },
  //   });
  // }

  return (
    <div className="appointment_status">
      <div className="row inner-top-search" style={{ display: disableAdd! }}>
        <Controller
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
        />
        {/* <AlagehFormGroup
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              fieldName: "color_code",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "color_code",
              value: this.state.color_code,
              events: {
                onChange: this.changeTexts.bind(this),
              },
              others: {
                type: "color",
                required: true,
                checkvalidation: "$value === #ffffff",
                errormessage: "Please Select a color",
              },
            }}
          /> */}
        <Controller
          name="description"
          control={control}
          rules={{ required: "Add Service Amount" }}
          render={(props) => (
            <AlgaehFormGroup
              div={{ className: "col-2 mandatory form-group" }}
              error={errors}
              label={{
                forceLabel: "Service Amount",
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
        {/* <AlagehFormGroup
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              fieldName: "description",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "description",
              value: this.state.description,
              events: {
                onChange: this.changeTexts.bind(this),
              },
            }}
          /> */}
        <Controller
          name="default_status"
          control={control}
          rules={{ required: "Select Procedure" }}
          render={({ value, onChange }) => (
            <AlgaehAutoComplete
              div={{ className: "col-3 form-group mandatory" }}
              label={{
                forceLabel: "default_status",
                isImp: true,
              }}
              error={errors}
              selector={{
                name: "default_status",
                value,
                onChange: (_: any, selected: any) => {
                  onChange(selected);

                  // setValue("service_amount", _.standard_fee);
                },

                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: Props.globalVariables.FORMAT_APPT_STATUS,
                },
                // others: {
                //   disabled:
                //     current.request_status === "APR" &&
                //     current.work_status === "COM",
                //   tabIndex: "4",
                // },
              }}
            />
          )}
        />{" "}
        {/* <AlagehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "default_status",
              isImp: true,
            }}
            selector={{
              name: "default_status",
              className: "select-fld",
              value: this.state.default_status,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.FORMAT_APPT_STATUS,
              },
              onChange: this.dropDownHandler.bind(this),
            }}
          /> */}
        <Controller
          control={control}
          name="steps"
          rules={{ required: "Enter Patient Code" }}
          render={(props) => (
            <AlgaehFormGroup
              div={{ className: "col-2 mandatory form-group" }}
              label={{
                forceLabel: "steps",
                isImp: true,
              }}
              error={errors}
              textBox={{
                ...props,
                className: "txt-fld",
                name: "steps",
                // placeholder: "MRN Number",
                others: {
                  type: "number",
                  disabled: true,
                  // min: min_steps,
                },
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="steps"
          rules={{ required: "Enter Patient Code" }}
          render={(props) => (
            <AlgaehFormGroup
              div={{ className: "col-1 form-group mandatory" }}
              label={{
                forceLabel: "steps",
                isImp: true,
              }}
              error={errors}
              textBox={{
                ...props,
                className: "txt-fld",
                name: "steps",
                // placeholder: "MRN Number",
                disabled: true,
                tabIndex: "8",
                others: {
                  type: "number",
                  disabled: true,
                  min: min_steps,
                },
              }}
            />
          )}
        />
        {/* <AlagehFormGroup
            div={{ className: "col-1 form-group mandatory" }}
            label={{
              forceLabel: "steps",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "steps",
              value: this.state.steps,
              events: {
                onChange: this.changeTexts.bind(this),
              },
              others: {
                type: "number",
                disabled: true,
                min: this.state.min_steps,
              },
            }} */}
        {/* /> */}
        <div className="col">
          <button
            style={{
              marginTop: 20,
              pointerEvents: "none",
            }}
            onClick={() => {
              return;
            }}
            type="button"
            className="btn btn-primary"
          >
            Add to List
          </button>
          <button
            style={{ marginTop: 20, marginLeft: 15, float: "right" }}
            onClick={() => {
              return;
            }}
            className="btn btn-default"
          >
            Authorize Status
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
            <div className="portlet-body">
              <div className="row">
                <div
                  className="col-12"
                  data-validate="apptStatusDiv"
                  id="apptStatusDivCntr"
                >
                  <button
                    onClick={() => {
                      AlgaehSearch();
                    }}
                  >
                    Search
                  </button>
                  <AlgaehDataGrid
                    // id="appt-status-grid"
                    // datavalidate="data-validate='apptStatusDiv'"
                    columns={[
                      {
                        fieldName: "color_code",
                        label: (
                          <AlgaehLabel label={{ fieldName: "color_code" }} />
                        ),
                        displayTemplate: (row: Row) => {
                          return (
                            <div
                              className="col"
                              style={{
                                backgroundColor: "" + row.color_code,
                                height: "20px",
                                margin: "auto",
                              }}
                            />
                          );
                        },
                        editorTemplate: (row: Row) => {
                          return (
                            <div className="row">
                              <AlgaehFormGroup
                                div={{ className: "col-lg-11" }}
                                label={{
                                  fieldName: "",
                                  // isImp: true,
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "color_code",

                                  value: row.color_code,
                                  events: {
                                    onChange: (e: Event) => {
                                      changeGridEditors(row, e);
                                    },
                                  },
                                  others: {
                                    type: "color",
                                    // checkvalidation: "#ffffff",
                                    // errormessage: "Please Select a color",
                                    required: true,
                                  },
                                }}
                              />
                            </div>
                          );
                        },
                      },
                      {
                        fieldName: "statusDesc",
                        label: (
                          <AlgaehLabel label={{ fieldName: "description" }} />
                        ),
                        editorTemplate: (row: Row) => {
                          return (
                            <AlgaehFormGroup
                              div={{ className: "col" }}
                              label={{
                                fieldName: "",
                                // isImp: true,
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "description",

                                value: row.statusDesc,
                                events: {
                                  onChange: () => {
                                    changeGridEditors.bind(row);
                                  },
                                },
                                others: {
                                  errormessage: "Description - cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "default_status",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "default_status" }}
                          />
                        ),
                        displayTemplate: (row: Row) => {
                          return row.default_status === "Y"
                            ? "Yes"
                            : row.default_status === "N"
                            ? "No"
                            : row.default_status === "RS"
                            ? "Re-Schedule"
                            : row.default_status === "C"
                            ? "Create Visit"
                            : "----------";
                        },
                        editorTemplate: (row: Row) => {
                          return (
                            <AlgaehAutoComplete
                              div={{ className: "col" }}
                              label={{
                                fieldName: "",
                                // isImp: true,
                              }}
                              selector={{
                                name: "default_status",
                                className: "select-fld",
                                value: row.default_status,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data:
                                    Props.globalVariables.FORMAT_APPT_STATUS,
                                },
                                onChange: () => {
                                  changeGridEditors.bind(row);
                                },
                                others: {
                                  errormessage: "Cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "steps",

                        label: <AlgaehLabel label={{ forceLabel: "Steps" }} />,

                        editorTemplate: (row: Row) => {
                          return (
                            <AlgaehFormGroup
                              div={{ className: "col" }}
                              label={{
                                fieldName: "",
                                // isImp: true,
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "steps",
                                value: row.steps,
                                events: {
                                  onChange: () => {
                                    changeGridEditors.bind(row);
                                  },
                                },
                                others: {
                                  type: "number",
                                  errormessage: "Cannot be blank",
                                  required: true,
                                  max: appointmentStatus.length,
                                  min: 1,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "authorized",

                        label: (
                          <AlgaehLabel label={{ forceLabel: "Authorized" }} />
                        ),

                        disabled: false,
                        displayTemplate: (row: Row) => {
                          return (
                            <span>{row.authorized === "Y" ? "Yes" : "No"}</span>
                          );
                        },
                        editorTemplate: (row: Row) => {
                          return (
                            <span>{row.authorized === "Y" ? "Yes" : "No"}</span>
                          );
                        },
                      },
                    ]}
                    // keyId="hims_d_appointment_status_id"
                    rowUniqueId="hims_d_appointment_status_id"
                    data={appointmentStatus}
                    isEditable={isEditable}
                    isFilterable={true}
                    pagination={true}
                    footer={() => {
                      return null;
                    }}
                    aggregate={() => {
                      return null;
                    }}
                    // TableProps={{
                    //   aggregate: () => {

                    //   },
                    //   footer: false
                    // }}
                    // events={{
                    //   onEdit: () => {},
                    //   onDelete:() => {},
                    //   onEdit: () => {},
                    // }}
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
