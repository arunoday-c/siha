import React, { useEffect, useState, useContext } from "react";
import "./PrepaymentMasterList.scss";
import { getAccountHeads } from "../../../utils/accountHelpers";
import { newAlgaehApi } from "../../../hooks/";
import { useForm, Controller } from "react-hook-form";
import {
  AlgaehFormGroup,
  AlgaehDataGrid,
  AlgaehMessagePop,
  AlgaehTreeSearch,
  Spin,
  AlgaehAutoComplete,
  // Button,
  Modal,
  AlgaehLabel,
} from "algaeh-react-components";
import { PrePaymentContext } from "../Prepayment";

const { confirm } = Modal;

export function PrepaymentMaster() {
  const { setPrepaymentTypes } = useContext(PrePaymentContext);
  const [current, setCurrent] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);

  const {
    control,
    errors,
    handleSubmit,
    reset,
    setValue,
    register,
    watch,
  } = useForm({
    defaultValues: {
      pre_type: "P",
      prepayment_desc: "",
      prepayment_duration: "",
      prepayment_gl: "",
      expense_gl: "",
      // employees_req: true,
    },
  });

  const { pre_type } = watch(["pre_type"]);

  useEffect(() => {
    Promise.all([getPreType(), getAccountHeads()])
      .then(([_, accounts]) => {
        setAccounts(accounts);
        setLoading(false);
      })
      .catch((e) => AlgaehMessagePop({ type: "Error", display: e.message }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPreType = () => {
    newAlgaehApi({
      uri: "/prepayment/getPrepaymentTypes",
      method: "GET",
      module: "finance",
    })
      .then((res) => {
        if (res.data.success) {
          setTypes(res.data.result);
          setPrepaymentTypes(res.data.result);
        }
      })
      .catch((e) => AlgaehMessagePop({ type: "Error", display: e.message }));
  };

  const addPreType = (e) => {
    // let employees_req = e.employees_req ? "Y" : "N";

    newAlgaehApi({
      uri: "/prepayment/createPrepaymentTypes",
      method: "POST",
      module: "finance",
      data: { ...e, employees_req: "Y" },
    })
      .then((res) => {
        if (res.data.success) {
          getPreType();
          reset();
        }
      })
      .catch((e) => AlgaehMessagePop({ type: "Error", display: e.message }));
  };

  const updatePreType = (e) => {
    newAlgaehApi({
      uri: "/prepayment/updatePrepaymentTypes",
      method: "PUT",
      module: "finance",
      data: {
        ...e,
        // employees_req: e.employees_req ? "Y" : "N",
        employees_req: "Y",
        finance_d_prepayment_type_id: current.finance_d_prepayment_type_id,
      },
    })
      .then((res) => {
        if (res.data.success) {
          getPreType();
          reset();
          setCurrent(null);
        }
      })
      .catch((e) => AlgaehMessagePop({ type: "Error", display: e.message }));
  };

  const deletePreType = (e) => {
    newAlgaehApi({
      uri: "/prepayment/deletePrepaymentTypes",
      method: "DELETE",
      module: "finance",
      data: {
        finance_d_prepayment_type_id: e.finance_d_prepayment_type_id,
      },
    })
      .then((res) => {
        if (res.data.success) {
          getPreType();
        }
      })
      .catch((e) => AlgaehMessagePop({ type: "Error", display: e.message }));
  };

  const onEdit = (row) => {
    setValue("prepayment_desc", row.prepayment_desc);
    setValue("prepayment_duration", row.prepayment_duration);
    setValue(
      "prepayment_gl",
      `${row.prepayment_head_id}-${row.prepayment_child_id}`
    );
    setValue("expense_gl", `${row.expense_head_id}-${row.expense_child_id}`);
    setCurrent(row);
  };

  const onDelete = (row) => {
    confirm({
      title: "Are you sure you want to delete?",
      content: `This action will remove the ${row.prepayment_desc} type.`,
      icon: "",
      cancelText: "Cancel",
      okText: "Delete",
      okType: "danger",
      onOk: () => deletePreType(row),
    });
  };

  const onSubmit = (e) => {
    console.error(errors);

    if (current) {
      updatePreType(e);
    } else {
      addPreType(e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} onError={onSubmit}>
        <div className="row inner-top-search">
          <Controller
            control={control}
            name="pre_type"
            rules={{ required: "Please select a type" }}
            render={({ value, onChange }) => (
              <AlgaehAutoComplete
                div={{ className: "col form-group mandatory" }}
                label={{
                  forceLabel: "Type",
                  isImp: true,
                }}
                selector={{
                  value,
                  onChange: (_, selected) => {
                    onChange(selected);
                    if (selected === "E") {
                      setValue("prepayment_duration", 1);
                    } else {
                      setValue("prepayment_duration", "");
                    }
                  },
                  onClear: () => {
                    onChange("");
                  },
                  name: "pre_type",
                  dataSource: {
                    data: [
                      { name: "Prepayment", value: "P" },
                      { name: "Expense", value: "E" },
                    ],
                    textField: "name",
                    valueField: "value",
                  },
                }}
              />
            )}
          />
          {errors.pre_type && <span>{errors.pre_type.message}</span>}
          <Controller
            name="prepayment_desc"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{
                  className: "col form-group algaeh-text-fld mandatory",
                }}
                // error={errors}
                label={{
                  forceLabel: "Prepayment Desc.",
                  isImp: true,
                }}
                P
                textBox={{
                  name: "prepayment_desc",
                  type: "text",
                  className: "form-control",
                  ...props,
                }}
              />
            )}
          />

          <Controller
            name="prepayment_duration"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{
                  className: "col form-group algaeh-text-fld mandatory",
                }}
                error={errors}
                label={{
                  forceLabel: "Duration (Months)",
                  isImp: true,
                }}
                textBox={{
                  name: "prepayment_duration",
                  type: "text",
                  className: "form-control",
                  ...props,
                  disabled: pre_type === "E",
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="prepayment_gl"
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehTreeSearch
                div={{ className: "col form-group mandatory" }}
                label={{
                  forceLabel: "Prepayment GL",
                  isImp: true,
                  align: "ltr",
                }}
                error={errors}
                tree={{
                  treeDefaultExpandAll: true,
                  name: "prepayment_gl",
                  data: accounts,
                  textField: "label",
                  ...props,
                  valueField: (node) => {
                    if (node["leafnode"] === "Y") {
                      return (
                        node["head_id"] + "-" + node["finance_account_child_id"]
                      );
                    } else {
                      return node["finance_account_head_id"];
                    }
                  },
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="expense_gl"
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehTreeSearch
                div={{ className: "col form-group mandatory" }}
                label={{
                  forceLabel: "Expense GL",
                  isImp: true,
                  align: "ltr",
                }}
                error={errors}
                tree={{
                  treeDefaultExpandAll: true,
                  name: "expense_gl",
                  data: accounts,
                  ...props,
                  textField: "label",
                  valueField: (node) => {
                    if (node["leafnode"] === "Y") {
                      return (
                        node["head_id"] + "-" + node["finance_account_child_id"]
                      );
                    } else {
                      return node["finance_account_head_id"];
                    }
                  },
                }}
              />
            )}
          />
          {/* <Controller
            name="prepayment_duration"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{
                  className: "col-2 form-group algaeh-text-fld",
                }}
                label={{
                  forceLabel: "Duration (Months)",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  className: "form-control",
                  ...props,
                }}
              />
            )}
          /> */}
          {/* 
          <div className="col">
            <label>Employee Requiried</label>
            <div className="customCheckbox">
              <label className="checkbox inline">
                <input
                  type="checkbox"
                  name="employees_req"
                  ref={register({ required: false })}
                />
                <span>Yes</span>
              </label>
            </div>
          </div> */}

          <div className="col">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ marginTop: 17 }}
            >
              {current ? "Update" : "Add to List"}
            </button>
          </div>
        </div>
      </form>
      <Spin spinning={loading}>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Prepayment Master List</h3>
                </div>
                <div className="actions"></div>
              </div>

              <div className="portlet-body" id="PrepaymentMasterListGrid">
                <AlgaehDataGrid
                  columns={[
                    {
                      fieldName: "",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: (row) => {
                        return (
                          <>
                            <i
                              className="fas fa-pen"
                              onClick={() => onEdit(row)}
                            ></i>

                            <i
                              className="fas fa-trash-alt"
                              onClick={() => onDelete(row)}
                            ></i>
                          </>
                        );
                      },
                    },
                    {
                      fieldName: "pre_type_name",
                      label: <AlgaehLabel label={{ forceLabel: "Type" }} />,
                      sortable: false,
                      others: {
                        minWidth: 180,
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "prepayment_desc",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Description" }} />
                      ),
                      sortable: false,
                      others: {
                        minWidth: 180,
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "prepayment_duration",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Duration (month)" }}
                        />
                      ),
                      align: "center",
                      sortable: false,
                      others: {
                        minWidth: 100,
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "prepayment_head_id",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Prepayment Credit GL" }}
                        />
                      ),
                      sortable: false,
                      others: {
                        minWidth: 180,
                      },
                      displayTemplate: (row) => {
                        if (row.prepayment_head_id) {
                          return (
                            <AlgaehTreeSearch
                              div={{ className: "white" }}
                              tree={{
                                treeDefaultExpandAll: true,
                                name: "prepayment_head_id",
                                data: accounts,
                                value: `${row.prepayment_head_id}-${row.prepayment_child_id}`,
                                textField: "label",
                                disabled: true,
                                valueField: (node) => {
                                  if (node["leafnode"] === "Y") {
                                    return (
                                      node["head_id"] +
                                      "-" +
                                      node["finance_account_child_id"]
                                    );
                                  } else {
                                    return node["finance_account_head_id"];
                                  }
                                },
                              }}
                            />
                          );
                        } else {
                          return null;
                        }
                      },
                    },
                    {
                      fieldName: "expense_head_id",

                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Prepayment Debit GL" }}
                        />
                      ),
                      sortable: false,
                      others: {
                        minWidth: 180,
                      },
                      displayTemplate: (row) => {
                        if (row.expense_head_id) {
                          return (
                            <AlgaehTreeSearch
                              div={{ className: "white" }}
                              tree={{
                                treeDefaultExpandAll: true,
                                name: "prepayment_head_id",
                                data: accounts,
                                value: `${row.expense_head_id}-${row.expense_child_id}`,
                                textField: "label",
                                disabled: true,
                                valueField: (node) => {
                                  if (node["leafnode"] === "Y") {
                                    return (
                                      node["head_id"] +
                                      "-" +
                                      node["finance_account_child_id"]
                                    );
                                  } else {
                                    return node["finance_account_head_id"];
                                  }
                                },
                              }}
                            />
                          );
                        } else {
                          return null;
                        }
                      },
                    },
                    // {
                    //   fieldName: "employees_req",
                    //   // label: "Employee Required",
                    //   label: (
                    //     <AlgaehLabel
                    //       label={{ forceLabel: "Employee Required" }}
                    //     />
                    //   ),
                    //   sortable: false,
                    //   others: {
                    //     minWidth: 100,
                    //   },
                    //   filterable: true,
                    //   displayTemplate: (row) => {
                    //     return row.employees_req === "Y" ? "YES" : "NO";
                    //   },
                    // },
                  ]}
                  isFilterable={true}
                  // isEditable="onlyDelete"
                  data={types}
                />
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
}

// dead code
/* <AlgaehFormGroup
          div={{
            className: "col form-group",
          }}
          label={{
            forceLabel: "Prepayment Code",
            isImp: true,
          }}
          textBox={{
            type: "text",
            className: "form-control",
            placeholder: "",
            value: "",
          }}
        />{" "} */
