import React from "react";
import "./DenialReasonMaster.scss";
import {
  AlgaehFormGroup,
  AlgaehDataGrid,
  Button,
  AlgaehLabel,
  Spin,
  AlgaehMessagePop,
} from "algaeh-react-components";
import { useQuery, useMutation } from "react-query";
import { useForm, Controller } from "react-hook-form";
import { newAlgaehApi } from "../../../hooks";

export const getDenialReasons = async () => {
  const res = await newAlgaehApi({
    uri: "/denialMaster/getDenialReasons",
    module: "insurance",
    method: "GET",
  });
  return res.data?.records;
};

const addDenialReason = async ({ denial_code, denial_desc }) => {
  const res = await newAlgaehApi({
    uri: "/denialMaster/addDenialReason",
    module: "insurance",
    method: "POST",
    data: {
      denial_desc,
      denial_code,
    },
  });
  return res.data?.records;
};

const updateDenialReason = async ({
  denial_code,
  denial_desc,
  hims_d_denial_id,
}) => {
  const res = await newAlgaehApi({
    uri: "/denialMaster/updateDenialReason",
    module: "insurance",
    method: "PUT",
    data: { denial_code, denial_desc, hims_d_denial_id },
  });
  return res.data?.records;
};

const deleteDenialReason = async ({ hims_d_denial_id }) => {
  const res = await newAlgaehApi({
    uri: "/denialMaster/deleteDenialReason",
    module: "insurance",
    method: "DELETE",
    data: { hims_d_denial_id },
  });
  return res.data?.records;
};

export default function DenialReasonMaster() {
  const { data, isLoading, refetch } = useQuery(
    "denial-reasons",
    getDenialReasons
  );
  const { control, handleSubmit, reset, errors } = useForm();
  const [add, { isLoading: addLoading }] = useMutation(addDenialReason, {
    onSuccess: () => {
      refetch();
      reset({
        denial_code: "",
        denial_desc: "",
      });
    },
  });
  const [updateReason, { isLoading: upLoading }] = useMutation(
    updateDenialReason,
    {
      onSuccess: () => {
        refetch();
      },
    }
  );
  const [deleteReason, { isLoading: delLoading }] = useMutation(
    deleteDenialReason,
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  return (
    <Spin spinning={isLoading || addLoading || upLoading || delLoading}>
      <div className="row DenialReasonMasterScreen">
        <div className="col-12">
          <div className="row inner-top-search">
            <Controller
              name="denial_code"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Please Enter a Value",
                },
              }}
              render={(props) => (
                <AlgaehFormGroup
                  div={{ className: "col-3 mandatory form-group" }}
                  label={{
                    forceLabel: "Denial Reason Code",
                    isImp: true,
                  }}
                  error={errors}
                  textBox={{
                    ...props,
                    className: "txt-fld",
                    name: "denial_code",
                    type: "text",
                    placeholder: "DRC0001",
                  }}
                />
              )}
            />
            <Controller
              name="denial_desc"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Please Enter a Value",
                },
              }}
              render={(props) => (
                <AlgaehFormGroup
                  div={{ className: "col-7 mandatory form-group" }}
                  label={{
                    forceLabel: "Denial Reason",
                    isImp: true,
                  }}
                  error={errors}
                  textBox={{
                    ...props,
                    className: "txt-fld",
                    name: "denial_desc",
                    type: "text",
                    placeholder: "Denial Reason",
                  }}
                />
              )}
            />

            <div className="col-2" style={{ marginTop: 21 }}>
              <Button
                className="btn btn-primary"
                disabled={isLoading || addLoading}
                loading={addLoading}
                onClick={handleSubmit(add)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Add to list", isImp: false }}
                />
              </Button>
            </div>
          </div>{" "}
          <div className="row">
            <div className="col-12 margin-top-15">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Denial Reason List</h3>
                  </div>
                  <div className="actions"></div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-12" id="DenialFormGrid_Cntr">
                      <AlgaehDataGrid
                        className="DenialFormGrid"
                        columns={[
                          {
                            fieldName: "denial_code",
                            label: "DENIAL REASON CODE",
                            others: {
                              maxWidth: 180,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "denial_desc",
                            label: "DENIAL REASON",
                          },
                        ]}
                        loading={false}
                        data={data ?? []}
                        pagination={true}
                        rowUniqueId="hims_d_denial_id"
                        isEditable={true}
                        events={{
                          onSave: (row) => {
                            if (row?.denial_code && row?.denial_desc) {
                              updateReason(row);
                            } else {
                              AlgaehMessagePop({
                                display: "Please enter all the fields",
                                type: "error",
                              });
                            }
                          },
                          onDelete: (row) => deleteReason(row),
                        }}
                        others={{}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
