import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { useMutation, useQuery } from "react-query";
import "./PromotionMaster.scss";
import {
  AlgaehLabel,
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehDataGrid,
} from "algaeh-react-components";
import { useForm, Controller } from "react-hook-form";
import { PromoAddModal } from "./AddModal";
import { PromoEditModal } from "./EditModal";

export function PromotionMaster() {
  const [currentAdd, setCurrentAdd] = useState(null);
  const [currentEdit, setCurrentEdit] = useState(null);
  const baseValue = {};
  const { errors, control } = useForm({
    defaultValues: baseValue,
  });
  return (
    <div className="PromotionMaster">
      <PromoAddModal
        visible={!!currentAdd}
        onClose={() => setCurrentAdd(null)}
      />
      <PromoEditModal
        visible={!!currentEdit}
        onClose={() => setCurrentEdit(null)}
      />
      <div className="row inner-top-search">
        <div className="col">
          <form>
            <div className="row">
              <Controller
                control={control}
                name=""
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
                      name: "",
                      ...props,
                    }}
                  />
                )}
              />{" "}
              <Controller
                control={control}
                name=""
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
                      name: "",
                      ...props,
                    }}
                  />
                )}
              />{" "}
              <Controller
                control={control}
                name=""
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
                      name: "",
                      ...props,
                    }}
                  />
                )}
              />
              <AlgaehDateHandler
                div={{ className: "col-3 form-group mandatory" }}
                label={{ forceLabel: "From & To Date", isImp: true }}
                type="range"
                textBox={{
                  value: "",
                }}
                maxDate={new Date()}
                events={{}}
              />
              <div className="col">
                <label>Allow Multiple Time</label>
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <input type="checkbox" value="yes" name="" />
                    <span>Yes</span>
                  </label>
                </div>
              </div>
              <div className="col-2">
                <button
                  type="submit"
                  style={{ marginTop: 20 }}
                  className="btn btn-primary"
                  //   onClick={this.addCardMaster.bind(this)}
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
                              className="fas fa-plus"
                              onClick={() => setCurrentAdd(row)}
                            ></i>
                          </>
                        );
                      },
                    },
                    {
                      fieldName: "",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Promotion Code" }} />
                      ),
                    },
                    {
                      fieldName: "",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Promotion Name" }} />
                      ),
                    },
                    {
                      fieldName: "",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Promo Code" }} />
                      ),
                    },
                    {
                      fieldName: "",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Promo Validity" }} />
                      ),
                    },

                    {
                      fieldName: "",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "ALLOW MULTIPLE TIMES" }}
                        />
                      ),
                    },
                  ]}
                  rowUniqueId="hims_d_promotion_id"
                  data={[
                    {
                      hims_d_promotion_id: 1,
                      code: "PROM-2010",
                      name: "some",
                    },
                    {
                      hims_d_promotion_id: 2,
                      code: "PROM-2011",
                      name: "another",
                    },
                    {
                      hims_d_promotion_id: 3,
                      code: "PROM-2012",
                      name: "spam",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
