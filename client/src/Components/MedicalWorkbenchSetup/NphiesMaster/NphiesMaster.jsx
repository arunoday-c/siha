import React from "react";
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
} from "algaeh-react-components";

const addNphies = async (input) => {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/addNphies",
    data: input,
    method: "POST",
  });
  return res.data.records;
};

const updateNphies = async (input) => {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/updateNphies",
    data: input,
    method: "PUT",
  });
  return res.data.records;
};
const deleteNphies = async (input) => {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/deleteNphies",
    data: input,
    method: "Delete",
  });
  return res.data.records;
};

const getNphies = async () => {
  const res = await newAlgaehApi({
    uri: "/doctorsWorkBench/getNphies",
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
export default function NphiesMaster() {
  const { control, errors, handleSubmit, reset } = useForm({
    shouldFocusError: true,
    defaultValues: {
      nphies_code: undefined,
      nphies_desc: undefined,
      long_nphies_desc: undefined,
      prefLabel: undefined,
      nphies_status: "A",
    },
  });
  const addOrUpdate = (data) => {
    saveNphies({ ...data });
    console.log(data);
  };
  const { data: nphiesData, isLoading, refetch } = useQuery(
    "nphies-data",
    getNphies,
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
  const [saveNphies, { isLoading: saveLoading }] = useMutation(addNphies, {
    onSuccess: (data) => {
      reset({
        nphies_code: "",
        nphies_desc: "",
        long_nphies_desc: "",
        prefLabel: "",
        nphies_status: "A",
      });
      refetch();
      AlgaehMessagePop({
        display: "Patient Updated Successfully",
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
  const [update, { isLoading: updateLoading }] = useMutation(updateNphies, {
    onSuccess: (data) => {
      reset({
        nphies_code: "",
        nphies_desc: "",
        long_nphies_desc: "",
        prefLabel: "",
        nphies_status: "A",
      });
      refetch();
      AlgaehMessagePop({
        display: "Patient Updated Successfully",
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

  const [deleteN, { isLoading: deleteLoading }] = useMutation(deleteNphies, {
    onSuccess: (data) => {
      reset({
        nphies_code: "",
        nphies_desc: "",
        long_nphies_desc: "",
        prefLabel: "",
        nphies_status: "A",
      });
      refetch();
      AlgaehMessagePop({
        display: "NPHIES Deleted Successfully",
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
  return (
    <div className="lab_section">
      <div className="row inner-top-search margin-bottom-15">
        <form onSubmit={handleSubmit(addOrUpdate)}>
          <Controller
            name="nphies_code"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{ className: "col-3 form-group mandatory" }}
                error={errors}
                label={{
                  forceLabel: "Enter NPHIES code.",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  ...props,
                  className: "form-control",
                  name: "nphies_code",
                }}
              />
            )}
          />

          <Controller
            name="nphies_desc"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{ className: "col-3 form-group mandatory" }}
                error={errors}
                label={{
                  forceLabel: "Description",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  ...props,
                  className: "form-control",
                  name: "nphies_desc",
                }}
              />
            )}
          />
          <Controller
            name="long_nphies_desc"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{ className: "col-3 form-group mandatory" }}
                error={errors}
                label={{
                  forceLabel: "long Description",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  ...props,
                  className: "form-control",
                  name: "long_nphies_desc",
                }}
              />
            )}
          />
          <Controller
            name="prefLabel"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{ className: "col-3 form-group mandatory" }}
                error={errors}
                label={{
                  forceLabel: "Pre Label",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  ...props,
                  className: "form-control",
                  name: "prefLabel",
                }}
              />
            )}
          />

          <Controller
            name="nphies_status"
            control={control}
            rules={{ required: "Select bed" }}
            render={({ value, onChange }) => (
              <AlgaehAutoComplete
                div={{ className: "col-4 form-group mandatory" }}
                label={{
                  forceLabel: "Naphies Status",
                  isImp: true,
                }}
                error={errors}
                selector={{
                  className: "form-control",
                  name: "nphies_status",
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

          <div className="col-lg-2 align-middle" style={{ paddingTop: 19 }}>
            <button type="submit" className="btn btn-primary">
              Add to List
            </button>
          </div>
        </form>
      </div>

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
                  datavalidate="data-validate='analyteDiv'"
                  id="ICDMasterGrid"
                  columns={[
                    {
                      fieldName: "nphies_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "NPHIES Code" }} />
                      ),
                      filterable: true,
                      sortable: true,
                      editorTemplate: (row) => {
                        return (
                          <AlgaehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "nphies_code",
                              value: row.nphies_code,
                              updateInternally: true,
                              onChange: (e) => {
                                row.nphies_code = e.target.value;
                              },
                            }}
                          />
                        );
                      },
                    },
                    {
                      fieldName: "nphies_desc",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "NPHIES Description" }}
                        />
                      ),
                      filterable: true,
                      sortable: true,
                      editorTemplate: (row) => {
                        return (
                          <AlgaehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "nphies_desc",
                              value: row.nphies_desc,
                              updateInternally: true,
                              onChange: (e) => {
                                row.nphies_desc = e.target.value;
                              },
                            }}
                          />
                        );
                      },
                    },
                    {
                      fieldName: "long_nphies_desc",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "NPHIES Long Description" }}
                        />
                      ),
                      filterable: true,
                      sortable: true,
                      editorTemplate: (row) => {
                        return (
                          <AlgaehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "long_nphies_desc",
                              value: row.long_nphies_desc,
                              updateInternally: true,
                              onChange: (e) => {
                                row.long_nphies_desc = e.target.value;
                              },
                            }}
                          />
                        );
                      },
                    },
                    {
                      fieldName: "prefLabel",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Pref Label" }} />
                      ),
                      filterable: true,
                      sortable: true,
                      editorTemplate: (row) => {
                        return (
                          <AlgaehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "prefLabel",
                              value: row.prefLabel,
                              updateInternally: true,
                              onChange: (e) => {
                                row.prefLabel = e.target.value;
                              },
                            }}
                          />
                        );
                      },
                    },
                    {
                      fieldName: "nphies_status",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "NPHEIS Status" }} />
                      ),
                      filterable: true,
                      sortable: true,
                      displayTemplate: (row) => {
                        return row.nphies_status === "A"
                          ? "Active"
                          : "Inactive";
                      },
                      editorTemplate: (row) => {
                        return (
                          <AlgaehAutoComplete
                            //   div={{}}
                            selector={{
                              name: "nphies_status",
                              className: "select-fld",
                              value: row.nphies_status,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_STATUS,
                              },
                              updateInternally: true,
                              onChange: (e, value) => {
                                row.nphies_status = value;
                              },
                              // others: {
                              //   errormessage: "ICD Type - Cannot be blank",
                              //   required: true,
                              // },
                            }}
                          />
                        );
                      },
                    },
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

                  data={nphiesData ?? []}
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
