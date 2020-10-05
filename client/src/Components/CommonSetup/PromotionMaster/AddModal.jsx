import React, { useContext, useEffect, useState } from "react";
import {
  AlgaehModal,
  Button,
  MainContext,
  AlgaehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  Spin,
  Checkbox,
} from "algaeh-react-components";

// import { useForm } from "react-hook-form";
import "./PromotionMaster.scss";
import { useQuery } from "react-query";
import { getPatientsForPromo } from "./api";
import { swalMessage } from "../../../utils/algaehApiCall";

export function PromoAddModal({ visible, onClose }) {
  const { userLanguage } = useContext(MainContext);
  const [gender, setGender] = useState("both");
  const [age_range, setAgeRange] = useState(null);
  const [sms, setSms] = useState("");
  const [recepients, setRecepients] = useState([]);

  const { data: patients, isLoading: patLoading, refetch, clear } = useQuery(
    ["get-patients", { age_range, gender }],
    getPatientsForPromo,
    {
      enabled: false,
    }
  );

  useEffect(() => {
    setRecepients([]);
    setSms("");
    setAgeRange(null);
    setGender("both");
    clear();

    //eslint-disable-next-line
  }, [visible]);

  const addToList = (row) => {
    setRecepients((state) => {
      const current = state.findIndex(
        (item) => item?.hims_d_patient_id === row?.hims_d_patient_id
      );
      if (current !== -1) {
        state.splice(current, 1);
        return [...state];
      } else {
        return [...state, row];
      }
    });
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
        <Button
          className="btn btn-primary"
          disabled={!recepients.length || !sms?.length}
          onClick={() => {
            swalMessage({
              title: "SMS sent to recipients",
              type: "success",
            });
            onClose();
          }}
        >
          Send SMS
        </Button>,
      ]}
      width={720}
      // footer={null}
      className={`${userLanguage}_comp row algaehNewModal`}
      // class={this.state.lang_sets}
    >
      <Spin spinning={patLoading}>
        <div className="col popupInner">
          <div className="row inner-top-search margin-bottom-15">
            <AlgaehAutoComplete
              div={{ className: "col-2 form-group mandatory" }}
              label={{
                forceLabel: "Patient Gender",
                isImp: true,
              }}
              selector={{
                name: "applicable",
                className: "select-fld",
                value: gender,
                onChange: (_, sel) => setGender(sel),
                onClear: () => setGender(null),
                dataSource: {
                  textField: "text",
                  valueField: "value",
                  data: [
                    { text: "Male", value: "Male" },
                    { text: "Female", value: "Female" },
                    { text: "Both", value: "both" },
                  ],
                },
              }}
            />
            <AlgaehAutoComplete
              div={{ className: "col-2 form-group mandatory" }}
              label={{
                forceLabel: "Age Range",
                isImp: false,
              }}
              selector={{
                name: "age_range",
                className: "select-fld",
                value: age_range,
                onChange: (_, sel) => setAgeRange(sel),
                onClear: () => setAgeRange(null),
                dataSource: {
                  textField: "value",
                  valueField: "value",
                  data: [
                    { value: "16-24" },
                    { value: "25-40" },
                    { value: "40-60" },
                    { value: "60-80" },
                  ],
                },
              }}
            />
            {/* <AlgaehFormGroup
            div={{ className: "col-2 form-group" }}
            label={{ forceLabel: "Enter Age" }}
            textBox={{
              className: "txt-fld",
              name: "",
              others: { type: "number" },
            }}
          /> */}
            <div className="col-2">
              <button
                type="submit"
                style={{ marginTop: 20 }}
                className="btn btn-primary"
                onClick={() => refetch()}
                disabled={!gender && !age_range}
              >
                Load recipients
              </button>
            </div>
            <div className="col-1">
              <button
                type="button"
                style={{ marginTop: 20 }}
                className="btn btn-default"
                onClick={() => {
                  setRecepients([]);
                  clear();
                }}
                disabled={!patients?.length}
              >
                Clear recipients
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">SMS Recipient List</h3>
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
                              fieldName: "hims_d_patient_id",
                              label: "Actions",
                              displayTemplate: (row) => {
                                return (
                                  <>
                                    <Checkbox
                                      onChange={() => addToList(row)}
                                      checked={recepients.some(
                                        (item) =>
                                          item?.hims_d_patient_id ===
                                          row?.hims_d_patient_id
                                      )}
                                    />
                                  </>
                                );
                              },
                            },

                            {
                              fieldName: "patient_code",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Patient Code" }}
                                />
                              ),
                            },
                            {
                              fieldName: "full_name",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Patient Name" }}
                                />
                              ),
                            },
                          ]}
                          rowUniqueId="hims_d_patient_id"
                          data={patients || []}
                          pagination={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            <div className="col-4">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">SMS Template Generator</h3>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-12">
                      <textarea
                        value={sms}
                        onChange={(e) => setSms(e.target.value)}
                        name="sms_template"
                        maxLength={160}
                      />

                      <small className="float-right">
                        Max Char. {sms?.length ?? 0} /{160}
                      </small>
                    </div>
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
