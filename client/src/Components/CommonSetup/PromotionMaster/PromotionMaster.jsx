import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { useMutation, useQuery } from "react-query";
// import moment from "moment";
import "./PromotionMaster.scss";
import {
  AlgaehLabel,
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehDataGrid,
  Spin,
} from "algaeh-react-components";
import { useForm, Controller } from "react-hook-form";
import { PromoAddModal } from "./AddModal";
import { PromoEditModal } from "./EditModal";
import { useMutation, useQuery } from "react-query";
import { addPromotion, getPromotions } from "./api";

export function PromotionMaster() {
  const [currentAdd, setCurrentAdd] = useState(null);
  const [currentEdit, setCurrentEdit] = useState(null);
  const baseValue = {
    promo_name: "",
    promo_code: "",
    offer_code: "",
    dates: [],
    avail_type: "O",
  };
  const { errors, control, handleSubmit, register, reset } = useForm({
    defaultValues: baseValue,
  });

  const { data, isLoading, refetch } = useQuery("promotions", getPromotions, {
    initialData: [],
    initialStale: true,
  });

  const [addPromo, { isLoading: addLoading }] = useMutation(addPromotion, {
    onSuccess: (data) => {
      reset(baseValue);
      refetch();
    },
  });

  function onSubmit(e) {
    addPromo({
      valid_to_from: e.dates[0]?.format("YYYY-MM-DD"),
      valid_to_date: e.dates[1]?.format("YYYY-MM-DD"),
      ...e,
    });
  }

  return (
    <Spin spinning={isLoading || addLoading}>
      <div className="PromotionMaster">
        <PromoAddModal
          visible={!!currentAdd}
          data={currentAdd}
          onClose={() => setCurrentAdd(null)}
        />
        <PromoEditModal
          visible={!!currentEdit}
          data={currentEdit}
          onClose={() => setCurrentEdit(null)}
        />
        <div className="row inner-top-search">
          <div className="col">
            <form>
              <div className="row">
                {/* <Controller
                  control={control}
                  name="promo_code"
                  rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group mandatory" }}
                      label={{
                        forceLabel: "Promotion Code",
                        isImp: true,
                      }}
                      error={errors}
                      textBox={{
                        className: "txt-fld",
                        name: "promo_code",
                        ...props,
                      }}
                    />
                  )}
                />{" "} */}
                <Controller
                  control={control}
                  name="promo_name"
                  rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group mandatory" }}
                      label={{
                        forceLabel: "Promotion Name",
                        isImp: true,
                      }}
                      error={errors}
                      textBox={{
                        className: "txt-fld",
                        name: "promo_name",
                        ...props,
                      }}
                    />
                  )}
                />{" "}
                <Controller
                  control={control}
                  name="offer_code"
                  rules={{ required: "Required" }}
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col form-group mandatory" }}
                      label={{
                        forceLabel: "Promo Code",
                        isImp: true,
                      }}
                      error={errors}
                      textBox={{
                        className: "txt-fld",
                        name: "offer_code",
                        ...props,
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="dates"
                  rules={{ required: "Required" }}
                  render={({ value, onChange }) => (
                    <AlgaehDateHandler
                      div={{ className: "col-3 form-group mandatory" }}
                      label={{ forceLabel: "From & To Date", isImp: true }}
                      type="range"
                      textBox={{
                        value,
                        name: "dates",
                      }}
                      events={{
                        onChange,
                      }}
                      minDate={new Date()}
                    />
                  )}
                />
                <div className="col">
                  <label>Allow Multiple Time</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        value="M"
                        name="avail_type"
                        ref={register({ name: "avail_type" })}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>
                <div className="col-2">
                  <button
                    type="submit"
                    style={{ marginTop: 20 }}
                    className="btn btn-primary"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Add to List
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Promotion Master Lists</h3>
            </div>
            <div className="actions"></div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-12">
                <div id="CardMasterGrid_Cntr">
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
                                onClick={() => setCurrentEdit(row)}
                              ></i>

                              <i
                                className="fas fa-paper-plane"
                                onClick={() => setCurrentAdd(row)}
                              ></i>
                            </>
                          );
                        },
                      },
                      // {
                      //   fieldName: "promo_code",
                      //   label: (
                      //     <AlgaehLabel
                      //       label={{ forceLabel: "Promotion Code" }}
                      //     />
                      //   ),
                      // },
                      {
                        fieldName: "promo_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Promotion Name" }}
                          />
                        ),
                      },
                      {
                        fieldName: "offer_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Offer Code" }} />
                        ),
                      },
                      {
                        fieldName: "valid_to_from",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Valid From" }} />
                        ),
                      },
                      {
                        fieldName: "valid_to_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Valid Upto" }} />
                        ),
                      },

                      {
                        fieldName: "avail_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "ALLOW MULTIPLE TIMES" }}
                          />
                        ),
                        displayTemplate: (row) =>
                          row?.avail_type === "M" ? "Yes" : "No",
                      },
                    ]}
                    rowUniqueId="hims_d_promotion_id"
                    // data={[
                    //   {
                    //     hims_d_promotion_id: 1,
                    //     code: "PROM-2010",
                    //     name: "some",
                    //   },
                    //   {
                    //     hims_d_promotion_id: 2,
                    //     code: "PROM-2011",
                    //     name: "another",
                    //   },
                    //   {
                    //     hims_d_promotion_id: 3,
                    //     code: "PROM-2012",
                    //     name: "spam",
                    //   },
                    // ]}
                    data={data}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
