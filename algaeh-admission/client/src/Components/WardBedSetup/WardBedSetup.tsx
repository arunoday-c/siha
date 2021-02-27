import React, { useState, useEffect } from "react";
import "./WardBedSetup.scss";
// import { DatePicker } from "antd";

import {
  // AlgaehLabel,
  AlgaehFormGroup,
  AlgaehDataGrid,
  // AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehLabel,
  // AlgaehDateHandler,
  AlgaehMessagePop,
  // AlgaehSearch,
  algaehAxios,
  // // DatePicker,
  // AlgaehModal,
  // AlgaehHijriDatePicker,
  // // AlgaehTreeSearch,
  // AlgaehSecurityComponent,

  //   AlgaehButton,
} from "algaeh-react-components";
import { Controller, useForm } from "react-hook-form";
// import { debug } from "console";

export default function WardBedSetup(Props: any) {
  // const [wardRow, setWardRow] = useState<any>({});
  const [wardHeaderRow, setWardHeaderRow] = useState<any>({});
  const [wardHeaderData, setWardHeaderData] = useState([]);
  const [wardDetailsData, setWardDetailsData] = useState<any>([]);
  const [bedDropDown, setBedDropDown] = useState([]);
  const { control, errors, reset, handleSubmit } = useForm({
    shouldFocusError: true,
  });
  const {
    control: control2,
    // getValues: getValues2,
    reset: reset2,
    // setValue: setValue2,
    // watch: watch2,
    // register: register2,
    errors: errors2,
    handleSubmit: handleSubmit2,
  } = useForm({});

  useEffect(() => {
    getWardHeaderData();
    // getWardDetails();
    bedDataFromMaster();
  }, []);
  const onDeleteDetails = async (row: any) => {
    const { response, error } = await algaehAxios(
      "/bedManagement/onDeleteDetails",
      {
        module: "admission",
        method: "DELETE",
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

    if (response.data.success) {
      AlgaehMessagePop({
        display: "Successfully Deleted",
        type: "success",
      });
    }
  };

  // const onDeleteHeader = async (row: any) => {
  //   const { response, error } = await algaehAxios(
  //     "/bedManagement/onDeleteHeader",
  //     {
  //       module: "admission",
  //       method: "DELETE",
  //       data: { ...row },
  //     }
  //   );
  //   if (error) {
  //     if (error.show === true) {
  //       AlgaehMessagePop({
  //         display: "Successfully Deleted",
  //         type: "success",
  //       });
  //     }
  //   }
  //   console.log("response", response);
  //   if (response) {
  //   }
  // };

  const updateWardDetails = async (data: any) => {
    const { error, response } = await algaehAxios(
      "/bedManagement/updateWardDetails",
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
    if (response.data.success) {
      AlgaehMessagePop({
        display: "Successfully updated",
        type: "success",
      });

      // getWardDetails();
      // reset2();
    }
  };
  const addWardDetailsToGrid = async (data: any) => {
    setWardDetailsData((pre: any) => {
      // let details = wardDetailsData;
      const rIndex = pre.length + 1;
      // let itemObj =
      pre.push({
        rIndex: rIndex,
        bed_id: data.bed_id,
        bed_no: data.bed_no,
      });
      return [...pre];
    });

    reset2({ bed_id: null, bed_no: null });

    // const { error, response } = await algaehAxios(
    //   "/bedManagement/addWardDetails",
    //   {
    //     module: "admission",
    //     method: "POST",
    //     data: { ...data },
    //   }
    // );
    // if (error) {
    //   if (error.show === true) {
    //   }
    // }
    // console.log("response", response);
    // if (response) {
    //   getWardDetails();
    //   reset2();
    // }
  };
  const addWardDetails = async (data: any) => {
    const { error, response } = await algaehAxios(
      "/bedManagement/addWardDetails",
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
    }
  };
  const updateWardHeader = async (data: any) => {
    const { error, response } = await algaehAxios(
      "/bedManagement/updateWardHeader",
      {
        module: "admission",
        method: "PUT",
        data: {
          ...data,
          hims_adm_ward_header_id: wardHeaderRow.hims_adm_ward_header_id,
        },
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
  // const getWardDetails = async () => {
  //   const { response, error } = await algaehAxios(
  //     "/bedManagement/getWardDetails",
  //     {
  //       module: "admission",
  //       method: "GET",
  //     }
  //   );
  //   if (error) {
  //     if (error.show === true) {
  //       AlgaehMessagePop({
  //         display: error.response.data.message,
  //         type: "error",
  //       });
  //       return;
  //     }
  //   }
  //   console.log("response", response);
  //   if (response.data.success) {
  //     setWardDetailsData(response.data.records);
  //   }
  // };
  const bedDataFromMaster = async () => {
    const { response, error } = await algaehAxios(
      "/bedManagement/bedDataFromMaster",
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
      setBedDropDown(response.data.records);
    }
  };
  const addWardHeader = async (data: any) => {
    const { error, response } = await algaehAxios(
      "/bedManagement/addWardHeader",
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
      return response.data.result;
    }
  };
  const getWardHeaderData = async () => {
    const { response, error } = await algaehAxios(
      "/bedManagement/getWardHeaderData",
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
      setWardHeaderData(response.data.records);
    }
  };
  const wardHeader = (data: any) => {
    if (wardHeaderRow.hims_adm_ward_header_id) {
      updateWardHeader(data).then((result) => {
        const addNewWardDetails = wardDetailsData.filter(
          (item: { isInserted: number | null | undefined }) => {
            return item.isInserted !== 1;
          }
        );
        if (addNewWardDetails.length > 0) {
          addWardDetails({
            wardDetailsData: addNewWardDetails,
            insertId: wardHeaderRow.hims_adm_ward_header_id,
          }).then(() => {
            getWardHeaderData().then(() => {
              AlgaehMessagePop({
                display: "Successfully Updated",
                type: "success",
              });
              return;
            });
          });
          reset({ ward_desc: null, ward_short_name: null, ward_type: null });
        } else {
          AlgaehMessagePop({
            display: "Updated Successfully",
            type: "error",
          });
          return;
        }
      });
    } else {
      addWardHeader(data).then((result: { insertId: number }) => {
        addWardDetails({
          wardDetailsData,
          insertId: result.insertId,
        }).then(() => {
          getWardHeaderData().then(() => {
            AlgaehMessagePop({
              display: "Successfully Updated",
              type: "success",
            });
            return;
          });
        });
        reset({ ward_desc: null, ward_short_name: null, ward_type: null });
      });
    }
  };
  const wardDetails = (data: any) => {
    // let item_exists = wardDetailsData.find(
    //   (f:any) => f.bed_no ===data.bed_no
    // );

    addWardDetailsToGrid(data);

    // console.error(errors);
    // if (wardRow.length > 0) {
    //   updateWardDetails(data);
    // } else {
    //   addWardDetails(data);
    // }
  };
  return (
    <>
      <div className="WardBedSetupScreen" style={{ marginTop: 50 }}>
        <div className="row">
          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Ward Setup</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  {/* <form onSubmit={handleSubmit(wardHeader)}> */}{" "}
                  <Controller
                    name="ward_desc"
                    control={control}
                    rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col-3" }}
                        error={errors}
                        label={{
                          forceLabel: "Ward Desc.",
                          isImp: true,
                        }}
                        textBox={{
                          ...props,
                          className: "txt-fld",
                          name: "ward_desc",
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="ward_short_name"
                    control={control}
                    rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col-3" }}
                        error={errors}
                        label={{
                          forceLabel: "Ward Short Desc.",
                          isImp: true,
                        }}
                        textBox={{
                          ...props,
                          className: "txt-fld",
                          name: "ward_short_name",
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="ward_type"
                    control={control}
                    rules={{ required: "Select Procedure" }}
                    render={({ value, onChange }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-3" }}
                        label={{
                          forceLabel: "Ward Type",
                          isImp: true,
                        }}
                        error={errors}
                        selector={{
                          name: "ward_type",
                          value,
                          onChange: (_: any, selected: any) => {
                            onChange(selected);

                            // setValue("service_amount", _.standard_fee);
                          },

                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: Props.globalVariables.FORMAT_WARD_TYPE,
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
                  {/* </form> */}
                  <div className="portlet-body">
                    <div className="row ">
                      {/* <form
                        onSubmit={handleSubmit2(wardDetails)}
                        onError={wardDetails}
                      > */}
                      <Controller
                        name="bed_no"
                        control={control2}
                        rules={{ required: "Required" }}
                        render={(props) => (
                          <AlgaehFormGroup
                            div={{ className: "col" }}
                            error={errors2}
                            label={{
                              forceLabel: "BED NO.",
                              isImp: true,
                            }}
                            textBox={{
                              type: "number",
                              ...props,
                              className: "form-control",
                              name: "bed_no",
                            }}
                          />
                        )}
                      />
                      {/* <AlgaehFormGroup
                  div={{
                    className: "col-6 form-group",
                  }}
                  label={{
                    forceLabel: "Bed Short Desc.",
                    isImp: true,
                  }}
                  textBox={{
                    type: "text",
                    className: "form-control",
                    // placeholder: "Enter Invoice No.",
                    value: "",
                  }}
                />
                <AlgaehAutoComplete
                  div={{ className: "col-6" }}
                  label={{
                    forceLabel: "Bed Service Type",
                    isImp: true,
                  }}
                  selector={{
                    name: "default_cost_center_id",
                    value: "",
                    dataSource: {
                      data: "",
                      valueField: "cost_center_id",
                      textField: "cost_center",
                    },
                    // onChange: '',
                  }}
                />  
                */}
                      <Controller
                        name="bed_id"
                        control={control2}
                        rules={{ required: "Select bed" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{ className: "col" }}
                            label={{
                              forceLabel: "select Bed",
                              isImp: true,
                            }}
                            error={errors2}
                            selector={{
                              className: "form-control",
                              name: "bed_id",
                              value,
                              onChange: (_: any, selected: any) => {
                                onChange(selected);

                                // setValue("service_amount", _.standard_fee);
                              },

                              dataSource: {
                                textField: "bed_desc",
                                valueField: "hims_adm_ip_bed_id",
                                data: bedDropDown,
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
                      <div className="col-6" style={{ marginTop: 21 }}>
                        <button
                          // type="submit"
                          type="button"
                          onClick={handleSubmit2(wardDetails)}
                          className="btn btn-primary btn-small"
                        >
                          Add bed Details
                        </button>
                      </div>
                      <div className="col-6" style={{ marginTop: 21 }}>
                        <button
                          type="button"
                          onClick={handleSubmit(wardHeader)}
                          className="btn btn-primary btn-small"
                        >
                          Add To ward Mamster
                        </button>
                      </div>
                      {/* </form> */}
                    </div>{" "}
                    <div className="row">
                      <div className="col-12 margin-top-15" id="BedSetupGrid">
                        <AlgaehDataGrid
                          columns={[
                            // {
                            //   fieldName: "actions",
                            //   label: (
                            //     <AlgaehLabel label={{ fieldName: "Actions" }} />
                            //   ),
                            //   displayTemplate: (row: any) => {
                            //     return (
                            //       <>
                            //         <i
                            //           className="fas fa-pen"
                            //           onClick={() => {
                            //             reset2({ ...row });
                            //
                            //             setWardRow(row);
                            //           }}
                            //         ></i>

                            //         <i
                            //           className="fas fa-trash-alt"
                            //           onClick={() => {
                            //             setWardDetailsData((data: any) => {
                            //               const otherDetails = data
                            //                 .filter(
                            //                   (f: any) =>
                            //                     f.rIndex !== row["rIndex"]
                            //                 )
                            //                 .map((m: any, i: number) => {
                            //                   return { ...m, rIndex: i + 1 };
                            //                 });
                            //               return [...otherDetails];
                            //             });
                            //           }}
                            //         ></i>
                            //       </>
                            //     );
                            //   },
                            // },
                            {
                              fieldName: "bed_id",
                              label: (
                                <AlgaehLabel
                                  label={{ fieldName: "Bed Name" }}
                                />
                              ),
                              displayTemplate: (row: any) => {
                                return row.bed_desc;
                              },

                              editorTemplate: (row: any) => {
                                return (
                                  <AlgaehAutoComplete
                                    // error={errors2}
                                    div={{ className: "col " }}
                                    selector={{
                                      className: "select-fld",
                                      name: "bed_id",
                                      value: row.bed_id,
                                      onChange: (e: any, value: any) => {
                                        row.bed_id = value;
                                      },
                                      // others: { defaultValue: row.bed_id },
                                      dataSource: {
                                        textField: "bed_desc",
                                        valueField: "hims_adm_ip_bed_id",
                                        data: bedDropDown,
                                      },
                                      updateInternally: true,
                                      // others: {
                                      //   disabled:
                                      //     current.request_status === "APR" &&
                                      //     current.work_status === "COM",
                                      //   tabIndex: "4",
                                      // },
                                    }}
                                  />
                                );
                              },
                            },

                            {
                              fieldName: "bed_no",

                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Bed NO." }}
                                />
                              ),
                              editorTemplate: (row: any) => {
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
                                      type: "number",
                                      value: row.bed_no,
                                      className: "form-control",
                                      name: "bed_no",
                                      updateInternally: true,
                                      onChange: (
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        row.bed_no = e.target.value;
                                      },
                                    }}
                                  />
                                );
                              },
                              // disabled: false,
                            },
                          ]}
                          // keyId="hims_d_appointment_status_id"
                          // rowUniqueId="hims_d_appointment_status_id"
                          data={wardDetailsData}
                          isEditable={true}
                          events={{
                            onCancel: (row) => {},
                            onDeleteShow: (row) => {},
                            onSaveShow: (row) => {},
                            onEdit: (row) => {},
                            onSave: (row) => {
                              if (row.isInserted === 1) {
                                updateWardDetails(row);
                              } else {
                                return;
                              }
                            },
                            onDelete: (row) => {
                              if (row.isInserted === 1) {
                                onDeleteDetails(row);
                                setWardDetailsData((data: any) => {
                                  const otherDetails = data.filter(
                                    (f: any) =>
                                      f.hims_adm_ward_header_id !==
                                      row["hims_adm_ward_header_id"]
                                  );

                                  return [...otherDetails];
                                });
                              } else {
                                setWardDetailsData((data: any) => {
                                  const otherDetails = data
                                    .filter(
                                      (f: any) => f.rIndex !== row["rIndex"]
                                    )
                                    .map((m: any, i: number) => {
                                      return { ...m, rIndex: i + 1 };
                                    });
                                  return [...otherDetails];
                                });
                              }
                            },
                          }}
                          isFilterable={true}
                          pagination={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 margin-top-15" id="WardSetupGrid">
                    {/* <AlgaehDataGrid
                    columns={[
                      {
                        fieldName: "actions",
                        label: <AlgaehLabel label={{ fieldName: "Actions" }} />,
                        displayTemplate: (row: any) => {
                          return (
                            <>
                              <i
                                className="fas fa-pen"
                                onClick={() => {
                                  reset({ ...row });
                                  setWardHeaderRow(row);
                                }}
                              ></i>

                              <i
                                className="fas fa-trash-alt"
                                onClick={() => onDeleteHeader(row)}
                              ></i>
                            </>
                          );
                        },
                      },
                      {
                        fieldName: "ward_desc",
                        label: (
                          <AlgaehLabel label={{ fieldName: "description" }} />
                        ),
                      },
                      {
                        fieldName: "ward_short_name",

                        label: (
                          <AlgaehLabel label={{ forceLabel: "Short Name" }} />
                        ),

                        disabled: false,
                      },
                      {
                        fieldName: "ward_type",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "default Status" }}
                          />
                        ),

                        displayTemplate: (row: any) => {
                          return row.ward_type === "M"
                            ? "Male"
                            : row.ward_type === "F"
                            ? "Female"
                            : row.ward_type === "P"
                            ? "Pediatric"
                            : row.ward_type === "N"
                            ? "Neonatal"
                            : row.ward_type === "G"
                            ? "General"
                            : row.ward_type === "I"
                            ? "Intensive"
                            : "Labour";
                        },
                      },
                    ]}
                    // keyId="hims_d_appointment_status_id"
                    // rowUniqueId="hims_d_appointment_status_id"
                    data={wardHeaderData}
                    // isEditable={t}
                    isFilterable={true}
                    pagination={true}
                  /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Bed Setup</h3>
                </div>
              </div>

              {wardHeaderData.map((item: any, key: number) => (
                <div className="portlet-body" key={key}>
                  <span>
                    <i
                      className="fas fa-pen"
                      onClick={() => {
                        debugger;
                        setWardDetailsData(
                          item.groupDetail.length > 0 ? item.groupDetail : []
                        );
                        setWardHeaderRow(item);
                        reset({ ...item });
                      }}
                    ></i>
                    <h3>{item.ward_desc}</h3>
                  </span>
                  {item.groupDetail.map((data: any, i: number) => (
                    <table key={i} className="tg">
                      <thead>
                        <tr>
                          <th className="tg-amwm">
                            <h6>Bed Name</h6>
                          </th>
                        </tr>
                        <tr>
                          <th className="tbl-subHdg">
                            <h6>Bed Number</h6>
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>{data.bed_no}</tr>
                      </tbody>
                    </table>
                  ))}
                  {/* <small>{item.}</small> */}
                </div>
                // </div>
              ))}
              {/* <form
                  onSubmit={handleSubmit2(wardDetails)}
                  onError={wardDetails}
                >
                  <Controller
                    name="bed_no"
                    control={control2}
                    rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col" }}
                        error={errors2}
                        label={{
                          forceLabel: "BED NO.",
                          isImp: true,
                        }}
                        textBox={{
                          type: "number",
                          ...props,
                          className: "txt-fld",
                          name: "bed_no",
                        }}
                      />
                    )}
                  />
                  {/* <AlgaehFormGroup
                  div={{
                    className: "col-6 form-group",
                  }}
                  label={{
                    forceLabel: "Bed Short Desc.",
                    isImp: true,
                  }}
                  textBox={{
                    type: "text",
                    className: "form-control",
                    // placeholder: "Enter Invoice No.",
                    value: "",
                  }}
                />
                <AlgaehAutoComplete
                  div={{ className: "col-6" }}
                  label={{
                    forceLabel: "Bed Service Type",
                    isImp: true,
                  }}
                  selector={{
                    name: "default_cost_center_id",
                    value: "",
                    dataSource: {
                      data: "",
                      valueField: "cost_center_id",
                      textField: "cost_center",
                    },
                    // onChange: '',
                  }}
                />  
                */}
              {/* <Controller
                    name="bed_id"
                    control={control}
                    rules={{ required: "Select bed" }}
                    render={({ value, onChange }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "select Bed",
                          isImp: true,
                        }}
                        error={errors}
                        selector={{
                          name: "bed_id",
                          value,
                          onChange: (_: any, selected: any) => {
                            onChange(selected);

                            // setValue("service_amount", _.standard_fee);
                          },

                          dataSource: {
                            textField: "bed_desc",
                            valueField: "hims_adm_ip_bed_id",
                            data: bedDropDown,
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
                  <div className="col-6" style={{ marginTop: 21 }}>
                    <button type="submit" className="btn btn-primary btn-small">
                      Add to List
                    </button>
                  </div>
                </form>
              </div>{" "} */}
              {/* <div className="row">
                <div className="col-12 margin-top-15" id="BedSetupGrid">
                  <AlgaehDataGrid
                    columns={[
                      {
                        fieldName: "actions",
                        label: <AlgaehLabel label={{ fieldName: "Actions" }} />,
                        displayTemplate: (row: any) => {
                          return (
                            <>
                              <i
                                className="fas fa-pen"
                                onClick={() => {
                                  reset2({ ...row });
                                  setWardRow(row);
                                }}
                              ></i>

                              <i
                                className="fas fa-trash-alt"
                                onClick={() => onDeleteDetails(row)}
                              ></i>
                            </>
                          );
                        },
                      },
                      {
                        fieldName: "bed_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Bed Name" }} />
                        ),
                      },
                      {
                        fieldName: "bed_no",

                        label: (
                          <AlgaehLabel label={{ forceLabel: "Bed NO." }} />
                        ),

                        disabled: false,
                      },
                    ]}
                    // keyId="hims_d_appointment_status_id"
                    // rowUniqueId="hims_d_appointment_status_id"
                    data={wardDetailsData}
                    // isEditable={t}
                    isFilterable={true}
                    pagination={true}
                  />
                </div>
              </div>
               */}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
    // </div>
  );
}
