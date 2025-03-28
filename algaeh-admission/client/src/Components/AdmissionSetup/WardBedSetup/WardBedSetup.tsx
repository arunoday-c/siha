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
  Collapse,
  // // DatePicker,
  // AlgaehModal,
  // AlgaehHijriDatePicker,
  // // AlgaehTreeSearch,
  // AlgaehSecurityComponent,

  //   AlgaehButton,
} from "algaeh-react-components";
import { Controller, useForm } from "react-hook-form";
import { parseInt } from "lodash";
// import { debug } from "console";
const { Panel } = Collapse;
export default function WardBedSetup(Props: any) {
  debugger;
  // const [wardRow, setWardRow] = useState<any>({});
  const [wardHeaderRow, setWardHeaderRow] = useState<any>({});
  const [wardHeaderData, setWardHeaderData] = useState([]);
  const [wardDetailsData, setWardDetailsData] = useState<any>([]);
  const [bedDropDown, setBedDropDown] = useState([]);
  const [disabledSave, setDisabledSave] = useState(false);
  const { control, errors, reset, handleSubmit } = useForm({
    shouldFocusError: true,
    defaultValues: {
      ward_desc: "",
      ward_short_name: "",
      ward_type: null,
    },
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
  } = useForm({
    defaultValues: {
      bed_id: null,
      bed_no: null,
    },
  });

  useEffect(() => {
    getWardHeaderData().then(() => {
      bedDataFromMaster();
    });
    // getWardDetails();
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
      setDisabledSave(false);
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
      let bedDesc: { bed_desc: string } = bedDropDown.filter((f: any) => {
        return f.hims_adm_ip_bed_id === parseInt(data.bed_id);
      })[0];

      pre.push({
        rIndex: rIndex,
        bed_id: data.bed_id,
        bed_no: data.bed_no,
        bed_desc: bedDesc.bed_desc,
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
          (item: { isInserted: number }) => {
            return item.isInserted !== 1;
          }
        );
        if (addNewWardDetails.length > 0) {
          const wardDetails = addNewWardDetails.map((item: any) => {
            return {
              ...item,
              ward_header_id: wardHeaderRow.hims_adm_ward_header_id,
            };
          });
          addWardDetails({
            wardDetails,
          }).then(() => {
            getWardHeaderData().then(() => {
              AlgaehMessagePop({
                display: "Successfully Updated",
                type: "success",
              });
              setWardDetailsData([]);
              return;
            });
          });
          reset({
            ward_desc: "",
            ward_short_name: "",
            ward_type: null,
          });
        } else {
          getWardHeaderData().then(() => {
            AlgaehMessagePop({
              display: "Successfully Updated",
              type: "success",
            });
            setWardDetailsData([]);
          });

          reset({
            ward_desc: "",
            ward_short_name: "",
            ward_type: null,
          });
        }
      });
    } else {
      addWardHeader(data).then(
        (result: { hims_adm_ward_header_id: number }) => {
          const wardDetails = wardDetailsData.map((item: any) => {
            return { ...item, ward_header_id: result.hims_adm_ward_header_id };
          });

          addWardDetails({
            wardDetails,
          }).then(() => {
            getWardHeaderData().then(() => {
              setWardDetailsData([]);
              AlgaehMessagePop({
                display: "Successfully Updated",
                type: "success",
              });
              return;
            });
          });
          reset({ ward_desc: "", ward_short_name: "", ward_type: null });
        }
      );
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
          <div className="col-8">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Create or Edit Ward</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  {/* <form onSubmit={handleSubmit(wardHeader)}> */}{" "}
                  <Controller
                    name="ward_desc"
                    control={control}
                    rules={{ required: "Enter Ward Desc." }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col form-group mandatory" }}
                        error={errors}
                        label={{
                          forceLabel: "Enter Ward Desc.",
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
                    rules={{ required: "Enter Ward Short Desc." }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col-3 form-group mandatory" }}
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
                    rules={{ required: "Select Ward Type " }}
                    render={({ value, onChange }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-2  form-group mandatory" }}
                        label={{
                          forceLabel: "Ward Type ",
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
                            data: Props.getGlobalVariables("FORMAT_WARD_TYPE"),
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
                </div>
                <div className="row ">
                  <div className="col">
                    <div className="col-12 algaehLabelFormGroup margin-top-15">
                      <label className="algaehLabelGroup">Assign Beds</label>
                      <div className="row">
                        <Controller
                          name="bed_id"
                          control={control2}
                          rules={{ required: "Select bed" }}
                          render={({ value, onChange }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-4 form-group mandatory" }}
                              label={{
                                forceLabel: "Select Bed",
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
                        />
                        <Controller
                          name="bed_no"
                          control={control2}
                          rules={{ required: "Required" }}
                          render={(props) => (
                            <AlgaehFormGroup
                              div={{ className: "col-3 form-group mandatory" }}
                              error={errors2}
                              label={{
                                forceLabel: "Enter Bed No.",
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
                        <div className="col-2" style={{ marginTop: 21 }}>
                          <button
                            // type="submit"
                            type="button"
                            onClick={handleSubmit2(wardDetails)}
                            className="btn btn-default btn-small"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="row">
                        <div
                          className="col-12 margin-bottom-15"
                          id="BedSetupGrid"
                        >
                          <AlgaehDataGrid
                            columns={[
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
                                          row.bed_desc = e.bed_desc;
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
                                      div={{ className: "col noLabel" }}
                                      label={{}}
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
                              },
                            ]}
                            data={wardDetailsData}
                            isEditable={true}
                            events={{
                              onCancel: (row) => {},
                              onDeleteShow: (row) => {},
                              onSaveShow: (row) => {},
                              onEdit: (row) => {
                                setDisabledSave(true);
                              },
                              onSave: (row) => {
                                if (row.isInserted === 1 && row.bed_id) {
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
                                        f.hims_adm_ward_detail_id !==
                                        row["hims_adm_ward_detail_id"]
                                    );

                                    return [...otherDetails];
                                  });
                                  getWardHeaderData();
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
                </div>{" "}
                <div className="row">
                  {" "}
                  <div className="col-12" style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setWardDetailsData([]);
                        setWardHeaderRow({});
                        reset({
                          ward_desc: "",
                          ward_short_name: "",
                          ward_type: null,
                        });
                      }}
                      className="btn btn-default btn-small"
                      // disabled={disabledSave}
                      style={{ marginRight: "10px" }}
                    >
                      clear
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit(wardHeader)}
                      className="btn btn-primary btn-small"
                      disabled={disabledSave}
                    >
                      {wardDetailsData.length > 0 ? "Update Ward" : "Save Ward"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">List of Wards</h3>
                </div>
              </div>
              <Collapse className="wardBedListAcc">
                {wardHeaderData?.map((item: any, key: number) => {
                  return (
                    <Panel
                      header={
                        <h3 style={{ width: "85%", display: "inline-block" }}>
                          {item.ward_desc}{" "}
                          <span
                            className="ediIcon"
                            onClick={() => {
                              let filteredItem = item.groupDetail.filter(
                                (f: any) => {
                                  return f.bed_id !== null || undefined;
                                }
                              );
                              setWardDetailsData(filteredItem);
                              setWardHeaderRow(item);
                              reset({ ...item });
                            }}
                          >
                            {" "}
                            <i className="fas fa-pen"></i>
                          </span>
                        </h3>
                      }
                      key={key}
                    >
                      <table className="accrTable">
                        <thead>
                          <tr>
                            <th>Bed Name</th>
                            <th>Bed No.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.groupDetail.map((data: any, index: number) => {
                            const {
                              bed_desc,
                              // bed_id,
                              bed_no,
                            } = data;

                            return (
                              <tr key={index}>
                                <td
                                  style={{
                                    textAlign: "left",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {bed_desc}
                                </td>
                                <td width="150">{bed_no}</td>
                                {/* <td width="20">{critical_status === "Y" ? "Yes" : "No"}</td> */}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div className="accFooter">
                        {/* <AlgaehButton
            className="btn btn-default btn-sm"
            report="merge"
            onClick={showReport}
            disabled={enablePrintButton}
            loading={loading}
          >
            Print as merge report
          </AlgaehButton>{" "}
          <AlgaehButton
            className="btn btn-default btn-sm"
            report="separate"
            onClick={showReport}
            disabled={enablePrintButton}
            loading={loading}
            style={{ marginLeft: 10 }}
          >
            Print as separate report
          </AlgaehButton> */}
                      </div>
                    </Panel>
                  );
                })}
              </Collapse>

              {/* {wardHeaderData.map((item: any, key: number) => (
                <div className="portlet-body" key={key}>
                  <span>
                    <i
                      className="fas fa-pen"
                      onClick={() => {
                        
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
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
