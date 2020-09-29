import React from "react";
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
export function PromotionMaster() {
  const baseValue = {};
  const { errors, control } = useForm({
    defaultValues: baseValue,
  });
  return (
    <div className="PromotionMaster">
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
                            <i className="fas fa-pen"></i>

                            <i className="fas fa-plus"></i>
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
                    ,
                    {
                      fieldName: "",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "ALLOW MULTIPLE TIMES" }}
                        />
                      ),
                    },
                  ]}
                  rowUniqueId=""
                  data=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
