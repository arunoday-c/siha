import React, { useEffect, useState } from "react";
import { getAccountHeads } from "../../../utils/accountHelpers";
import { newAlgaehApi } from "../../../hooks/";
import { useForm, Controller } from "react-hook-form";
import {
  AlgaehFormGroup,
  AlgaehTable,
  AlgaehMessagePop,
  AlgaehTreeSearch,
  Spin,
  Button,
  Modal,
} from "algaeh-react-components";

const { confirm } = Modal;

export function PrepaymentMaster() {
  const [current, setCurrent] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const { control, errors, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      prepayment_desc: "",
      prepayment_duration: "",
      prepayment_gl: "",
      expense_gl: "",
    },
  });

  useEffect(() => {
    Promise.all([getPreType(), getAccountHeads()])
      .then(([_, accounts]) => {
        setAccounts(accounts);
        setLoading(false);
      })
      .catch((e) => AlgaehMessagePop({ type: "Error", display: e.message }));
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
        }
      })
      .catch((e) => AlgaehMessagePop({ type: "Error", display: e.message }));
  };

  const addPreType = (e) => {
    newAlgaehApi({
      uri: "/prepayment/createPrepaymentTypes",
      method: "POST",
      module: "finance",
      data: { ...e },
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
    debugger;

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
            name="prepayment_desc"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{
                  className: "col form-group algaeh-text-fld",
                }}
                label={{
                  forceLabel: "Prepayment Desc.",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  className: "form-control",
                  ...props,
                }}
              />
            )}
          />
          {errors.prepayment_desc && (
            <span>{errors.prepayment_desc.message}</span>
          )}
          <Controller
            name="prepayment_duration"
            control={control}
            rules={{ required: "Required" }}
            render={(props) => (
              <AlgaehFormGroup
                div={{
                  className: "col-2 form-group algaeh-text-fld",
                }}
                label={{
                  forceLabel: "Duration (Days)",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  className: "form-control",
                  ...props,
                }}
              />
            )}
          />
          {errors.prepayment_duration && (
            <span>{errors.prepayment_duration.message}</span>
          )}
          <Controller
            control={control}
            name="prepayment_gl"
            render={(props) => (
              <AlgaehTreeSearch
                div={{ className: "col form-group" }}
                label={{
                  forceLabel: "Prepayment GL",
                  isImp: false,
                  align: "ltr",
                }}
                tree={{
                  treeDefaultExpandAll: true,
                  name: "prepayment_head_id",
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
            render={(props) => (
              <AlgaehTreeSearch
                div={{ className: "col form-group" }}
                label={{
                  forceLabel: "Expense GL",
                  isImp: false,
                  align: "ltr",
                }}
                tree={{
                  treeDefaultExpandAll: true,
                  name: "expense_head_id",
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

          <div className="col-2">
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

              <div className="portlet-body">
                <AlgaehTable
                  columns={[
                    {
                      fieldName: "",
                      label: "Actions",
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
                      fieldName: "prepayment_desc",
                      label: "Prepayment Desc.",
                      sortable: true,
                      filterable: true,
                    },
                    {
                      fieldName: "prepayment_duration",
                      label: "Duration (Days)",
                      align: "center",
                      sortable: true,
                      filterable: true,
                    },
                    {
                      fieldName: "prepayment_head_id",
                      label: "Prepayment Credit GL",
                      sortable: true,
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
                      label: "Prepayment Debit GL",
                      sortable: true,
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
                  ]}
                  isFilterable={true}
                  // isEditable="onlyDelete"
                  height="34vh"
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
