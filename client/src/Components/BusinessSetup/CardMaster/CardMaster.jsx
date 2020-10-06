import {
  AlgaehDataGrid,
  AlgaehFormGroup,
  AlgaehLabel,
  AlgaehMessagePop,
  AlgaehTreeSearch,
  Input,
  Spin,
  Tooltip,
} from "algaeh-react-components";
import React, { useState } from "react";
import "./CardMaster.scss";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import {
  addCard,
  getAccountHeads,
  getCards,
  deleteCard,
  updateCard,
} from "./api";

export function CardMaster() {
  const baseValue = {
    card_name: "",
    account: "",
    card_format: "",
    vat_percentage: "",
    service_charge: "",
  };
  const [current, setCurrent] = useState(null);
  const { errors, control, handleSubmit, reset } = useForm({
    defaultValues: baseValue,
  });

  const { data: accounts, isLoading: accLoading } = useQuery(
    "accounts",
    getAccountHeads,
    {
      initialData: [],
      initialStale: true,
    }
  );
  const { data: cards, isLoading: cardLoading, refetch } = useQuery(
    "cards",
    getCards
  );

  const onSuccess = () => {
    refetch();
    reset(baseValue);
    setCurrent(null);
  };

  const onError = (err) => {
    AlgaehMessagePop({
      type: "error",
      display: err?.message,
    });
  };

  const [add] = useMutation(addCard, {
    onSuccess: (data) => {
      onSuccess();
      AlgaehMessagePop({
        type: "success",
        display: "Card Added successfully",
      });
    },
    onError,
  });
  const [update] = useMutation(updateCard, {
    onSuccess: (data) => {
      onSuccess();
      AlgaehMessagePop({
        type: "success",
        display: "Card Updated successfully",
      });
    },
    onError,
  });
  const [deleteRow] = useMutation(deleteCard, {
    onSuccess: (data) => {
      onSuccess();
      AlgaehMessagePop({
        type: "success",
        display: "Card Deleted successfully",
      });
    },
    onError,
  });

  const onSubmit = (e) => {
    const [head_id, child_id] = e?.account.split("-");
    if (current) {
      update({
        ...e,
        head_id,
        child_id,
        hims_d_bank_card_id: current?.hims_d_bank_card_id,
      });
    } else {
      add({ ...e, head_id, child_id });
    }
  };

  const ToolTipText = () => {
    return (
      <ul style={{ listStyle: "none" }}>
        <li>1 - is For the numbers</li>
        <li>a - is For the letters</li>
        <li>A - is For the letters, forced to upper case when entered</li>
        <li>* - is For the alphanumericals</li>
        <li>
          #- is For the alphanumericals, forced to upper case when entered
        </li>
      </ul>
    );
  };

  return (
    <Spin spinning={accLoading || cardLoading}>
      <div className="row inner-top-search">
        <div className="col-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <Controller
                control={control}
                name="card_name"
                rules={{ required: "Required" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col  mandatory" }}
                    label={{
                      forceLabel: "Card Name",
                      isImp: true,
                    }}
                    error={errors}
                    textBox={{
                      className: "txt-fld",
                      name: "card_name",
                      ...props,
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="card_format"
                render={(props) => (
                  <div className="col form-group cardInputFld mandatory">
                    <label className="styleLabel">
                      Card Format
                      {/* <span className="imp">&nbsp;*</span> */}
                    </label>
                    <div className="ui input txt-fld">
                      <Input
                        placeholder="11-1111"
                        name="masked_identity"
                        {...props}
                        suffix={
                          <Tooltip title={ToolTipText}>
                            <i className="fas fa-info-circle"></i>
                          </Tooltip>
                        }
                      />
                    </div>
                  </div>
                )}
              />

              <Controller
                control={control}
                name="vat_percentage"
                rules={{ required: "Required" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col mandatory" }}
                    label={{
                      forceLabel: "Vat %",
                      isImp: true,
                    }}
                    error={errors}
                    textBox={{
                      className: "txt-fld",
                      name: "vat_percentage",
                      ...props,
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="service_charge"
                rules={{ required: "Required" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col mandatory" }}
                    label={{
                      forceLabel: "Service Charge %",
                      isImp: true,
                    }}
                    error={errors}
                    textBox={{
                      className: "txt-fld",
                      name: "service_charge",
                      ...props,
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="account"
                rules={{
                  required: {
                    value: true, // Add finance check here
                    message: "Please select Account",
                  },
                }}
                render={(props) => (
                  <AlgaehTreeSearch
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Account",
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
                )}
              />

              <div className="col">
                <button
                  type="submit"
                  style={{ marginTop: 20 }}
                  className="btn btn-primary"
                  //   onClick={this.addCardMaster.bind(this)}
                >
                  {current ? "Update" : "Add to List"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-body">
          <div className="row">
            <div className="col-12">
              <div data-validate="cardDiv" id="CardMasterGrid_Cntr">
                <AlgaehDataGrid
                  id="CardMasterGrid"
                  datavalidate="data-validate='cardDiv'"
                  columns={[
                    {
                      fieldName: "",
                      label: "Actions",
                      displayTemplate: (row) => {
                        return (
                          <>
                            <i
                              className="fas fa-pen"
                              onClick={() => {
                                reset({
                                  ...row,
                                  account: `${row?.head_id}-${row?.child_id}`,
                                });
                                setCurrent(row);
                              }}
                            ></i>

                            <i
                              className="fas fa-trash-alt"
                              onClick={() =>
                                deleteRow(row?.hims_d_bank_card_id)
                              }
                            ></i>
                          </>
                        );
                      },
                    },
                    {
                      fieldName: "card_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Card Name" }} />
                      ),
                    },
                    {
                      fieldName: "card_format",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Card Format" }} />
                      ),
                    },
                    {
                      fieldName: "service_charge",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Service Charge" }} />
                      ),
                    },
                    {
                      fieldName: "vat_percentage",
                      label: <AlgaehLabel label={{ forceLabel: "Vat %" }} />,
                    },
                    {
                      fieldName: "child_id",
                      label: <AlgaehLabel label={{ forceLabel: "Account" }} />,
                      displayTemplate: (row) => {
                        if (row.head_id) {
                          return (
                            <AlgaehTreeSearch
                              div={{ className: "white" }}
                              tree={{
                                treeDefaultExpandAll: true,
                                name: "prepayment_head_id",
                                data: accounts,
                                value: `${row?.head_id}-${row?.child_id}`,
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
                  rowUniqueId="hims_d_bank_card_id"
                  data={cards || []}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
