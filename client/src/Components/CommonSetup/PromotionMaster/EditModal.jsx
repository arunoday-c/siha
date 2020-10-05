import React, { useContext, useState } from "react";
import {
  AlgaehModal,
  Button,
  MainContext,
  AlgaehFormGroup,
  AlgaehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  Spin,
  // AlgaehMessagePop,
} from "algaeh-react-components";
import "./PromotionMaster.scss";
import { useQuery, useMutation } from "react-query";
import {
  getServiceTypes,
  getPromotionDetails,
  addPromotionDetail,
  updatePromotionDetail,
  deletePromotionDetail,
} from "./api";
import { useForm, Controller } from "react-hook-form";
import { swalMessage } from "../../../utils/algaehApiCall";

export function PromoEditModal({ visible, onClose, data = {} }) {
  const { userLanguage } = useContext(MainContext);
  const [editId, setEditId] = useState(null);
  const base = {
    service_type_id: null,
    avail_type: null,
    offer_value: "",
  };
  const { control, handleSubmit, errors, reset } = useForm({
    defaultValues: base,
  });

  const { data: serviceTypes, isLoading } = useQuery(
    "service-type",
    getServiceTypes
  );

  const { data: promoDetails, isLoading: pdLoading, refetch } = useQuery(
    ["promoDetails", { promo_id: data?.hims_d_promo_id }],
    getPromotionDetails
  );

  const [add, { isLoading: mutLoading }] = useMutation(addPromotionDetail, {
    onSuccess: (data) => {
      reset(base);
      setEditId(null);
      refetch().then(() => {
        swalMessage({
          title: "Added Successfully",
          type: "success",
        });
      });
    },
  });

  const [update, { isLoading: upDLoading }] = useMutation(
    updatePromotionDetail,
    {
      onSuccess: (data) => {
        reset(base);
        setEditId(null);
        refetch().then(() => {
          swalMessage({
            title: "Updated Successfully",
            type: "success",
          });
        });
      },
    }
  );

  const [deleteDetail, { isLoading: delLoading }] = useMutation(
    deletePromotionDetail,
    {
      onSuccess: (data) => {
        refetch().then(() => {
          swalMessage({
            title: "Deleted Successfully",
            type: "success",
          });
        });
      },
    }
  );

  const onSubmit = (e) => {
    if (editId) {
      update({
        hims_d_promotion_detail_id: editId,
        hims_d_promo_id: data?.hims_d_promo_id,
        ...e,
      });
    } else {
      add({
        hims_d_promo_id: data?.hims_d_promo_id,
        ...e,
      });
    }
  };

  return (
    <AlgaehModal
      title={"Promo Price List"}
      visible={visible}
      mask={true}
      maskClosable={true}
      onCancel={onClose}
      footer={[
        <Button className="btn btn-default" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={720}
      // footer={null}
      className={`${userLanguage}_comp row algaehNewModal`}
      // class={this.state.lang_sets}
    >
      <Spin
        spinning={
          isLoading || pdLoading || mutLoading || upDLoading || delLoading
        }
      >
        <div className="col popupInner">
          <div className="row inner-top-search margin-bottom-15">
            <Controller
              control={control}
              name="service_type_id"
              rules={{ required: "Required" }}
              render={({ value, onChange }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-3 form-group mandatory" }}
                  label={{
                    forceLabel: "Service Type",
                    isImp: true,
                  }}
                  error={errors}
                  selector={{
                    name: "service_type_id",
                    className: "select-fld",
                    value,
                    onChange: (_, selected) => onChange(selected),
                    onClear: () => onChange(null),
                    dataSource: {
                      textField: "service_type",
                      valueField: "hims_d_service_type_id",
                      data: serviceTypes,
                    },
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="avail_type"
              rules={{ required: "Required" }}
              render={({ value, onChange }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-2 form-group mandatory" }}
                  label={{
                    forceLabel: "Offer by",
                    isImp: true,
                  }}
                  error={errors}
                  selector={{
                    name: "avail_type",
                    className: "select-fld",
                    value,
                    onChange: (_, selected) => onChange(selected),
                    onClear: () => onChange(null),

                    dataSource: {
                      textField: "text",
                      valueField: "value",
                      data: [
                        { text: "Percentage", value: "P" },
                        { text: "Amount", value: "A" },
                      ],
                    },
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="offer_value"
              rules={{ required: "Required" }}
              render={(props) => (
                <AlgaehFormGroup
                  div={{ className: "col-2 form-group" }}
                  label={{ forceLabel: "Offer Value", isImp: true }}
                  error={errors}
                  textBox={{
                    className: "txt-fld",
                    name: "offer_value",
                    others: { type: "number" },
                    ...props,
                  }}
                />
              )}
            />

            <div className="col-2">
              <button
                type="submit"
                style={{ marginTop: 20 }}
                className="btn btn-primary"
                onClick={handleSubmit(onSubmit)}
              >
                {editId ? "Update" : "Add to List"}
              </button>
            </div>
          </div>
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Offer Price List</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12">
                  <div id="">
                    <AlgaehDataGrid
                      className="offerPriceList"
                      columns={[
                        {
                          fieldName: "hims_d_promotion_detail_id",
                          label: "Actions",
                          displayTemplate: (row) => {
                            return (
                              <>
                                <i
                                  className="fas fa-pen"
                                  onClick={() => {
                                    setEditId(row?.hims_d_promotion_detail_id);
                                    reset(row);
                                  }}
                                ></i>
                                <i
                                  className="fas fa-trash-alt"
                                  onClick={() => {
                                    deleteDetail({
                                      hims_d_promotion_detail_id:
                                        row?.hims_d_promotion_detail_id,
                                    });
                                  }}
                                ></i>
                              </>
                            );
                          },
                        },
                        {
                          fieldName: "service_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Service type" }}
                            />
                          ),
                        },
                        {
                          fieldName: "avail_type",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Offer by" }} />
                          ),
                          displayTemplate: (row) =>
                            row?.avail_type === "P" ? "Percentage" : "Amount",
                        },
                        {
                          fieldName: "offer_value",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Offer Value" }}
                            />
                          ),
                        },
                      ]}
                      rowUniqueId="hims_d_promotion_detail_id"
                      data={promoDetails || []}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </AlgaehModal>
  );
}
