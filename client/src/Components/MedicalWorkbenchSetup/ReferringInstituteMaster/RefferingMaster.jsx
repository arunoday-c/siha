import React, { useContext } from "react";
// import "./Allergies.scss";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
import GlobalVariables from "../../../utils/GlobalVariables";

import { useQuery, useMutation } from "react-query";
import { useForm, Controller } from "react-hook-form";
import { newAlgaehApi } from "../../../hooks";
import moment from "moment";
import {
  AlgaehDataGrid,
  AlgaehFormGroup,
  // AlgaehDataGrid,
  AlgaehAutoComplete,
  AlgaehLabel,
  AlgaehMessagePop,
  Spin,
  MainContext,
  Input,
  Select,
} from "algaeh-react-components";

const addReferringMaster = async (input) => {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/addReferringMaster",
    data: input,
    method: "POST",
  });
  return res.data.records;
};

const updateReferringMaster = async (input) => {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/updateReferringMaster",
    data: input,
    method: "PUT",
  });
  return res.data.records;
};
const deleteReferringMaster = async (input) => {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/deleteReferringMaster",
    data: input,
    method: "Delete",
  });
  return res.data.records;
};

const getReferringMaster = async () => {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/getReferringMaster",
    method: "GET",
  });
  return res.data?.records;
};

// const getUserDetails = async () => {
//   const res = await newAlgaehApi({
//     uri: "/algaehappuser/selectAppUsers",
//     method: "GET",
//   });
//   return res.data?.records;
// };
export default function ReferringMaster() {
  const { countries = [] } = useContext(MainContext);
  const { control, errors, handleSubmit, reset, clearErrors } = useForm({
    shouldFocusError: true,
    defaultValues: {
      //   nphies_desc: undefined,
      //   long_nphies_desc: undefined,
      //   prefLabel: undefined,
      institute_status: "A",
    },
  });
  const addReferring = (data) => {
    save({ ...data });
  };
  const { data: referringMasterData, isLoading, refetch } = useQuery(
    "referringMaster-data",
    getReferringMaster,
    {
      onSuccess: (data) => {},
    }
  );
  //   const { data: nphiesData, isLoading, refetch } = useQuery(
  //     "nphies-data",
  //     getNphies,
  //     {
  //       //   enabled: !!,
  //       initialData: {},
  //       //   retry: 0,
  //       //   initialStale: true,
  //       onSuccess: (data) => {},
  //       onError: (err) => {
  //
  //         AlgaehMessagePop({
  //           display: err?.message,
  //           type: "error",
  //         });
  //       },
  //     }
  //   );
  // const { data: userDetails } = useQuery(["user-data"], getUserDetails, {
  //   //   enabled: !!,
  //   initialData: {},
  //   //   retry: 0,
  //   //   initialStale: true,
  //   onSuccess: (data) => {},
  //   onError: (err) => {
  //     AlgaehMessagePop({
  //       display: err?.message,
  //       type: "error",
  //     });
  //   },
  // });
  const [save, { isLoading: saveLoading }] = useMutation(addReferringMaster, {
    onSuccess: (data) => {
      reset({
        institute_name: "",
        tel_code: "",
        contact_number: "",
        inCharge_name: "",
        institute_status: "A",
      });
      refetch();
      AlgaehMessagePop({
        display: "Referring Institute Added Successfully",
        type: "success",
      });
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err.message,
        type: "error",
      });
    },
  });
  const [update, { isLoading: updateLoading }] = useMutation(
    updateReferringMaster,
    {
      onSuccess: (data) => {
        reset({
          institute_name: "",
          tel_code: "",
          contact_number: "",
          inCharge_name: "",
          institute_status: "A",
        });
        refetch();
        AlgaehMessagePop({
          display: " Updated Successfully",
          type: "success",
        });
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err.message,
          type: "error",
        });
      },
    }
  );

  const [deleteN, { isLoading: deleteLoading }] = useMutation(
    deleteReferringMaster,
    {
      onSuccess: (data) => {
        reset({
          institute_name: "",
          tel_code: "",
          contact_number: "",
          inCharge_name: "",
          institute_status: "A",
        });
        refetch();
        AlgaehMessagePop({
          display: "Referring  Deleted Successfully",
          type: "success",
        });
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err.message,
          type: "error",
        });
      },
    }
  );
  return (
    <div className="lab_section">
      <form onSubmit={handleSubmit(addReferring)}>
        <div className="row inner-top-search margin-bottom-15">
          <Controller
            name="institute_name"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{ className: "col form-group mandatory" }}
                error={errors}
                label={{
                  forceLabel: "Enter Institute Name",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  ...props,
                  className: "form-control",
                  name: "institute_name",
                }}
              />
            )}
          />

          {!!countries?.length && (
            <div className="col-3 algaehInputGroup mandatory">
              <AlgaehLabel
                label={{
                  fieldName: "contact_number",
                  isImp: true,
                }}
              />
              <Input.Group compact>
                <Controller
                  control={control}
                  name="tel_code"
                  rules={{
                    required: "Please Select",
                  }}
                  render={({ value, onChange }) => (
                    <>
                      <Select
                        value={value}
                        onChange={onChange}
                        virtual={true}
                        // disabled={disabled}
                        showSearch
                        filterOption={(input, option) => {
                          return (
                            option.value
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          );
                        }}
                        options={countries
                          ?.map((item) => item.tel_code)
                          .filter((v, i, a) => a.indexOf(v) === i)
                          .map((item) => ({
                            label: item,
                            value: item,
                          }))}
                      >
                        {/* {countries?.map((item) => (
                                      <Option
                                        value={item.tel_code}
                                        key={item.tel_code}
                                      >
                                        {item.tel_code}
                                      </Option>
                                    ))} */}
                      </Select>
                    </>
                  )}
                />
                <p style={{ backgroundColor: "red" }}>
                  {errors.tel_code?.message}
                </p>
                <Controller
                  control={control}
                  name="contact_number"
                  rules={{
                    required: "Please Enter Contact Number",
                    minLength: {
                      message: "Please Enter Valid Number",
                      value: 6,
                    },
                  }}
                  render={(props) => (
                    <>
                      <Input error={errors} {...props} />
                    </>
                  )}
                />
              </Input.Group>
              <p style={{ backgroundColor: "red" }}>
                {errors.contact_number?.message}
              </p>
            </div>
          )}
          <Controller
            name="inCharge_name"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{ className: "col-3 form-group mandatory" }}
                error={errors}
                label={{
                  forceLabel: "Incharge Name",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  ...props,
                  className: "form-control",
                  name: "inCharge_name",
                }}
              />
            )}
          />

          <Controller
            name="institute_status"
            control={control}
            rules={{ required: "Select bed" }}
            render={({ value, onChange }) => (
              <AlgaehAutoComplete
                div={{ className: "col-1 form-group mandatory" }}
                label={{
                  forceLabel: "Status",
                  isImp: true,
                }}
                error={errors}
                selector={{
                  className: "form-control",
                  name: "institute_status",
                  value,
                  onChange: (_, selected) => {
                    onChange(selected);

                    // setValue("service_amount", _.standard_fee);
                  },

                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.FORMAT_STATUS,
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

          <div className="col-2 align-middle" style={{ paddingTop: 19 }}>
            <button
              className="btn btn-default"
              type="button"
              onClick={() => {
                return (
                  clearErrors([
                    "institute_name",
                    "tel_code",
                    "contact_number",
                    "inCharge_name",
                  ]),
                  reset({
                    institute_name: "",
                    tel_code: "",
                    contact_number: "",
                    inCharge_name: "",
                    institute_status: "A",
                  })
                );
              }}
            >
              Clear
            </button>{" "}
            <button type="submit" className="btn btn-primary">
              Add to List
            </button>
          </div>
        </div>
      </form>

      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-body">
          <div className="row" data-validate="analyteDiv">
            <div className="col" id="ICDMasterGrid_Cntr">
              <Spin
                spinning={
                  isLoading || saveLoading || deleteLoading || updateLoading
                }
              >
                <AlgaehDataGrid
                  //   datavalidate="data-validate='analyteDiv'"

                  columns={[
                    {
                      fieldName: "institute_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Institute Name" }} />
                      ),
                      filterable: true,
                      sortable: true,
                      editorTemplate: (row) => {
                        return (
                          <AlgaehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "institute_name",
                              value: row.institute_name,
                              updateInternally: true,
                              onChange: (e) => {
                                row.institute_name = e.target.value;
                              },
                            }}
                          />
                        );
                      },
                    },
                    {
                      fieldName: "tel_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Contact Number" }} />
                      ),
                      filterable: true,
                      sortable: true,
                      displayTemplate: (row) => {
                        return `${row.tel_code}-${row.contact_number}`;
                      },
                      editorTemplate: (row) => {
                        return (
                          <Input.Group compact>
                            <Select
                              defaultValue={row.tel_code}
                              onChange={(e, value) => {
                                row.tel_code = e;
                              }}
                              name="tel_code"
                              virtual={true}
                              // disabled={disabled}
                              // updateInternally={true}
                              showSearch
                              filterOption={(input, option) => {
                                return (
                                  option.value
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                );
                              }}
                              options={countries
                                ?.map((item) => item.tel_code)
                                .filter((v, i, a) => a.indexOf(v) === i)
                                .map((item) => ({
                                  label: item,
                                  value: item,
                                }))}
                            >
                              {/* {countries?.map((item) => (
                                                  <Option
                                                    value={item.tel_code}
                                                    key={item.tel_code}
                                                  >
                                                    {item.tel_code}
                                                  </Option>
                                                ))} */}
                            </Select>
                            <AlgaehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "contact_number",
                                value: row.contact_number,
                                updateInternally: true,
                                onChange: (e) => {
                                  row.contact_number = e.target.value;
                                },
                              }}
                            />
                            {/* <Input
                              type="text"
                              name="contact_number"
                              value={row.contact_number}
                              updateInternally={true}
                              onChange={(e) => {
                                
                                row.contact_number = e.target.value;
                              }}
                            /> */}
                          </Input.Group>
                        );
                      },
                    },
                    {
                      fieldName: "inCharge_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "InCharge Name" }} />
                      ),
                      filterable: true,
                      sortable: true,
                      editorTemplate: (row) => {
                        return (
                          <AlgaehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "inCharge_name",
                              value: row.inCharge_name,
                              updateInternally: true,
                              onChange: (e) => {
                                row.inCharge_name = e.target.value;
                              },
                            }}
                          />
                        );
                      },
                    },

                    // {
                    //   fieldName: "nphies_status",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: "NPHEIS Status" }} />
                    //   ),
                    //   filterable: true,
                    //   sortable: true,
                    //   displayTemplate: (row) => {
                    //     return row.nphies_status === "A"
                    //       ? "Active"
                    //       : "Inactive";
                    //   },
                    //   editorTemplate: (row) => {
                    //     return (
                    //       <AlgaehAutoComplete
                    //         //   div={{}}
                    //         selector={{
                    //           name: "nphies_status",
                    //           className: "select-fld",
                    //           value: row.nphies_status,
                    //           dataSource: {
                    //             textField: "name",
                    //             valueField: "value",
                    //             data: GlobalVariables.FORMAT_STATUS,
                    //           },
                    //           updateInternally: true,
                    //           onChange: (e, value) => {
                    //             row.nphies_status = value;
                    //           },
                    //           // others: {
                    //           //   errormessage: "ICD Type - Cannot be blank",
                    //           //   required: true,
                    //           // },
                    //         }}
                    //       />
                    //     );
                    //   },
                    // },
                    {
                      fieldName: "user_display_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_by" }} />
                      ),
                      displayTemplate: (row) => {
                        return <span>{row.user_display_name}</span>;
                      },

                      editorTemplate: (row) => {
                        return <span>{row.user_display_name}</span>;
                      },
                      others: { maxWidth: 150 },
                      filterable: true,
                      sortable: true,
                      // disabled: true
                    },
                    {
                      fieldName: "created_date",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_date" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {moment(row.created_date).format("DD-MM-YYYY")}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          <span>
                            {moment(row.created_date).format("DD-MM-YYYY")}
                          </span>
                        );
                      },
                      others: { maxWidth: 100 },
                      filterable: true,
                      sortable: true,
                    },
                  ]}
                  loading={false}
                  // dataSource={{

                  data={referringMasterData ?? []}
                  // }}
                  isEditable={true}
                  isFilterable={true}
                  // paging={{ page: 0, rowsPerPage: 10 }}
                  pagination={true}
                  events={{
                    onDelete: (row) => deleteN({ ...row }),
                    onEdit: (row) => {},
                    onSave: (row) => update({ ...row }),
                    // onDone: updateICDcode.bind(this, this),
                  }}
                />
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
