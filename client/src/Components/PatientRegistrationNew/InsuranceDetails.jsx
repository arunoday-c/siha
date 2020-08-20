import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import { Controller, useWatch } from "react-hook-form";
// import moment from "moment";
import {
  MainContext,
  Tabs,
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehDateHandler,
  //   AlgaehHijriDatePicker,
  Spin,
} from "algaeh-react-components";
import { useLangFieldName } from "./patientHooks";
import AlgaehFileUploader from "../Wrapper/algaehFileUpload";
import AlgaehSearch from "../Wrapper/globalSearch";
import InsuranceFields from "../../Search/Insurance.json";
import { newAlgaehApi } from "../../hooks/";
import { FrontdeskContext } from "./FrontdeskContext";
// import { fieldNameFn } from "./index";
// import GenericData from "../../utils/GlobalVariables.json";
const { TabPane } = Tabs;

const getPatientInsurance = async (key, { patient_id }) => {
  const res = await newAlgaehApi({
    uri: "/patientRegistration/getPatientInsurance",
    module: "frontDesk",
    data: { patient_id },
    method: "GET",
  });
  return res?.data?.records;
};

export function InsuranceDetails({
  control,
  errors,
  clearErrors,
  setValue,
  trigger,
  insuranceImgFront,
  insuranceImgBack,
}) {
  const { userToken } = useContext(MainContext);
  const { setInsuranceInfo, disabled: saveDisable } = useContext(
    FrontdeskContext
  );
  const { fieldNameFn } = useLangFieldName();
  const [isInsurance, setIsInsurance] = useState(false);
  const [insuranceList, setInsuranceList] = useState([]);
  const disabled = !isInsurance || saveDisable;
  const { hims_d_patient_id, primary_card_number } = useWatch({
    control,
    name: ["hims_d_patient_id", "primary_card_number"],
  });
  const { isLoading, data: patientInsurance } = useQuery(
    ["patient-insurance", { patient_id: hims_d_patient_id }],
    getPatientInsurance,
    {
      enabled: !!hims_d_patient_id && isInsurance,

      initialData: [],
      initialStale: true,
    }
  );
  const dropDownData = insuranceList?.length ? insuranceList : patientInsurance;

  useEffect(() => {
    const fieldNames = [
      "primary_insurance_provider_id",
      "primary_sub_id",
      "primary_network_id",
      "primary_network_office_id",
      "primary_policy_num",
      "primary_card_number",
      "primary_effective_start_date",
      "primary_effective_end_date",
    ];
    if (!isInsurance) {
      fieldNames.map((item) => setValue(item, ""));
      clearErrors(fieldNames);
      setInsuranceInfo(null);
      setInsuranceList([]);
    }
  }, [isInsurance]); //eslint-disable-line

  const AddInsurance = () => {
    AlgaehSearch({
      searchGrid: {
        columns: InsuranceFields,
      },
      searchName: "new_insurance",
      uri: "/gloabelSearch/get",
      inputs: `netoff.hospital_id =  ${userToken?.hims_d_hospital_id}`,
      onContainsChange: (text, serchBy, callback) => {
        callback(text);
      },
      onRowSelect: (row) => {
        console.log(row, "selected");
        setInsuranceList([row]);
        setValue("primary_insurance_provider_id", row?.insurance_provider_id);
        setValue("primary_sub_id", row?.sub_insurance_provider_id);
        setValue("primary_network_id", row?.network_id);
        setInsuranceInfo(row?.hims_d_insurance_network_office_id);
        // setValue("primary_network_office_id", row?.network_office_id);
        setValue("primary_policy_num", row?.policy_number);
        setValue("primary_effective_start_date", row?.effective_start_date);
        setValue("primary_effective_end_date", row?.effective_end_date);
      },
    });
  };

  return (
    <Spin spinning={isLoading}>
      <div className="hptl-phase1-insurance-details margin-top-15">
        <div className="insurance-section">
          <Tabs type="card">
            <TabPane
              tab={
                <AlgaehLabel
                  label={{
                    fieldName: "lbl_insurance",
                  }}
                />
              }
              key="insuranceForm"
            >
              <div className="htpl-phase1-primary-insurance-form">
                <div className="col-12">
                  <div className="row">
                    <div className="col-lg-8 primary-details">
                      <div className="row primary-box-container">
                        <div className="col-lg-2 insuranceRadio">
                          <AlgaehLabel
                            label={{
                              fieldName: "lbl_insurance",
                            }}
                          />
                          <br />

                          <div className="customRadio">
                            <label className="radio inline">
                              <input
                                type="radio"
                                name="insuredYes"
                                disabled={saveDisable}
                                checked={isInsurance}
                                onChange={() => setIsInsurance(true)}
                              />
                              <span>{fieldNameFn("Yes", "نعم")}</span>
                            </label>
                            <label className="radio inline">
                              <input
                                type="radio"
                                name="insuredNo"
                                disabled={saveDisable}
                                checked={!isInsurance}
                                onChange={() => setIsInsurance(false)}
                              />
                              <span>{fieldNameFn("No", "لا")}</span>
                            </label>
                          </div>
                        </div>
                        <div
                          className="col-1"
                          style={{ paddingRight: 0, marginTop: 20 }}
                        >
                          <button
                            type="button"
                            className="btn btn-primary btn-rounded"
                            onClick={AddInsurance}
                            disabled={!isInsurance}
                          >
                            <i className="fas fa-plus" />
                          </button>
                        </div>
                        <Controller
                          control={control}
                          name="primary_insurance_provider_id"
                          rules={{
                            required: {
                              value: isInsurance,
                              message: "Field is Required",
                            },
                          }}
                          render={({ value, onChange }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-3" }}
                              label={{
                                fieldName: "insurance_id",
                                isImp: isInsurance,
                              }}
                              error={errors}
                              selector={{
                                name: "primary_insurance_provider_id",
                                className: "select-fld",
                                onChange: (_, selected) => {
                                  onChange(selected);
                                  const [current] = dropDownData?.filter(
                                    (item) =>
                                      item.insurance_provider_id == selected
                                  );
                                  setValue(
                                    "primary_insurance_provider_id",
                                    current?.insurance_provider_id
                                  );
                                  setValue(
                                    "primary_sub_id",
                                    current?.sub_insurance_provider_id
                                  );
                                  setValue(
                                    "primary_network_id",
                                    current?.network_id
                                  );
                                  setInsuranceInfo(
                                    current?.hims_d_insurance_network_office_id
                                  );
                                  setValue(
                                    "primary_policy_num",
                                    current?.policy_number
                                  );
                                  setValue(
                                    "primary_effective_start_date",
                                    current?.primary_effective_start_date
                                  );
                                  setValue(
                                    "primary_effective_end_date",
                                    current?.effective_end_date
                                  );
                                  trigger();
                                },
                                value,
                                onClear: () => onChange(""),
                                dataSource: {
                                  textField: fieldNameFn(
                                    "insurance_provider_name",
                                    "name"
                                  ),
                                  valueField: "insurance_provider_id",
                                  data: dropDownData,
                                },
                                others: {
                                  disabled,
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="primary_sub_id"
                          rules={{
                            required: {
                              value: isInsurance,
                              message: "Field is Required",
                            },
                          }}
                          render={({ value, onChange }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-3" }}
                              label={{
                                fieldName: "sub_insurance_id",
                                isImp: isInsurance,
                              }}
                              error={errors}
                              selector={{
                                name: "primary_sub_id",
                                className: "select-fld",
                                onChange: (_, selected) => onChange(selected),
                                value,
                                onClear: () => onChange(""),
                                dataSource: {
                                  textField: "sub_insurance_provider_name",
                                  // this.state.selectedLang == "en" ? "sub_insurance_provider_name" : "name",
                                  valueField: "sub_insurance_provider_id",
                                  data: dropDownData,
                                },
                                // onChange: insurancehandle.bind(this, this, context),
                                others: {
                                  disabled,
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="primary_network_id"
                          rules={{
                            required: {
                              value: isInsurance,
                              message: "Field is Required",
                            },
                          }}
                          error={errors}
                          render={({ value, onChange }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-3" }}
                              label={{
                                fieldName: "policy_id",
                                isImp: isInsurance,
                              }}
                              error={errors}
                              selector={{
                                name: "primary_network_id",
                                className: "select-fld",
                                onChange: (_, selected) => onChange(selected),
                                value,
                                onClear: () => onChange(""),
                                dataSource: {
                                  textField: fieldNameFn(
                                    "network_type",
                                    "name"
                                  ),
                                  valueField: "network_id",
                                  data: dropDownData,
                                },
                                others: {
                                  disabled,
                                },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="row primary-box-container">
                        <Controller
                          control={control}
                          name="primary_policy_num"
                          rules={{
                            required: {
                              value: isInsurance,
                              message: "Field is Required",
                            },
                          }}
                          render={({ onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-3" }}
                              label={{
                                fieldName: "plan_id",
                                isImp: isInsurance,
                              }}
                              error={errors}
                              selector={{
                                name: "primary_policy_num",
                                className: "select-fld",
                                onChange: (_, selected) => onChange(selected),
                                value,
                                onClear: () => onChange(""),
                                dataSource: {
                                  textField: "policy_number",
                                  valueField: "policy_number",
                                  data: dropDownData,
                                },
                                others: {
                                  disabled,
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="primary_card_number"
                          rules={{
                            required: {
                              value: isInsurance,
                              message: "Field is Required",
                            },
                          }}
                          render={(props) => (
                            <AlgaehFormGroup
                              div={{ className: "col-3" }}
                              label={{
                                fieldName: "card_number",
                                isImp: isInsurance,
                              }}
                              error={errors}
                              textBox={{
                                className: "txt-fld",
                                name: "primary_card_number",
                                ...props,
                                disabled,
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="primary_effective_start_date"
                          rules={{
                            required: {
                              value: isInsurance,
                              message: "Field is Required",
                            },
                          }}
                          render={({ onChange, value }) => (
                            <AlgaehDateHandler
                              div={{ className: "col-3" }}
                              label={{
                                fieldName: "effective_start_date",
                                isImp: isInsurance,
                              }}
                              error={errors}
                              textBox={{
                                className: "txt-fld",
                                name: "primary_effective_start_date",
                                value: value || undefined,
                              }}
                              maxDate={new Date()}
                              others={{ disabled }}
                              events={{
                                onChange: (mdate) => {
                                  if (mdate) {
                                    onChange(mdate._d);
                                  } else {
                                    onChange(undefined);
                                  }
                                },
                                onClear: () => {
                                  onChange(undefined);
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="primary_effective_end_date"
                          rules={{
                            required: {
                              value: isInsurance,
                              message: "Field is Required",
                            },
                          }}
                          render={({ onChange, value }) => (
                            <AlgaehDateHandler
                              div={{ className: "col-3" }}
                              label={{
                                fieldName: "expiry_date",
                                isImp: isInsurance,
                              }}
                              error={errors}
                              others={{ disabled }}
                              textBox={{
                                className: "txt-fld",
                                name: "primary_effective_end_date",
                                value: value || undefined,
                              }}
                              minDate={new Date()}
                              events={{
                                onChange: (mdate) => {
                                  if (mdate) {
                                    onChange(mdate._d);
                                  } else {
                                    onChange(undefined);
                                  }
                                },
                                onClear: () => {
                                  onChange(undefined);
                                },
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>

                    {/* //effective_end_date// */}

                    <div className="col-lg-4 secondary-details">
                      <div className="row secondary-box-container">
                        <div className="col-lg-6 insurCrdImg">
                          <AlgaehFileUploader
                            ref={insuranceImgFront}
                            noImage="insurance-card-front"
                            name="patInsuranceFrontImg"
                            accept="image/*"
                            showActions={isInsurance}
                            textAltMessage="Insurance Card Front Side"
                            serviceParameters={{
                              uniqueID:
                                (primary_card_number || null) + "_front",
                              fileType: "Patients",
                              processDelay: (...val) => {
                                console.log(val, "val");
                              },
                            }}
                            // renderPrevState={this.state.patInsuranceFrontImg}
                            // forceRefresh={this.state.forceRefresh}
                          />
                        </div>

                        <div className="col-lg-6 insurCrdImg">
                          <AlgaehFileUploader
                            ref={insuranceImgBack}
                            noImage="insurance-card-back"
                            name="patInsuranceBackImg"
                            accept="image/*"
                            showActions={isInsurance}
                            textAltMessage="Insurance Card Back Side"
                            serviceParameters={{
                              uniqueID: (primary_card_number || null) + "_back",
                              fileType: "Patients",
                              processDelay: (...val) => {
                                console.log(val, "val");
                              },
                            }}
                            // renderPrevState={this.state.patInsuranceBackImg}
                            // forceRefresh={this.state.forceRefresh}
                          />
                          <div />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Spin>
  );
}
