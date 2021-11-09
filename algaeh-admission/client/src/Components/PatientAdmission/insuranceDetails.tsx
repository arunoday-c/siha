import React, { useEffect, useContext } from "react";
import { Controller } from "react-hook-form";
import moment from "moment";
import {
  AlgaehSearch,
  Tabs,
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehDateHandler,
  //   AlgaehHijriDatePicker,
  Spin,
} from "algaeh-react-components";
import { PatAdmissionContext } from "./PatientAdmissionContext";
const { TabPane } = Tabs;

export default function InsuranceDetails({
  props,
  control,
  errors,
  clearErrors,
  setValue,
  trigger,
  isInsurance,
  setIsInsurance,
  insurance_list,
  setInsuranceList,
  disable_data,
}: // Insurance_field,
// insurance_list,
// updateInsuranceState,
any) {
  const { insuranceInfo, setInsuranceInfo } = useContext(PatAdmissionContext);

  const isLoading = false;
  //   const dropDownData: any = [];
  let dropDownData = insurance_list?.length ? insurance_list : [];

  useEffect(() => {
    debugger;
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
      setInsuranceList([]);
    } else {
      if (insuranceInfo) {
        setValue(
          "primary_insurance_provider_id",
          insuranceInfo?.primary_insurance_provider_id
        );
        setValue("primary_sub_id", insuranceInfo?.primary_sub_id);
        setValue("primary_network_id", insuranceInfo?.primary_network_id);
        setValue(
          "primary_network_office_id",
          insuranceInfo?.primary_network_office_id
        );
        setValue("primary_policy_num", insuranceInfo?.primary_policy_num);
        setValue("effective_date", [
          moment(insuranceInfo?.effective_end_date),
          moment(insuranceInfo?.effective_start_date),
        ]);
      }
    }
  }, [isInsurance]); //eslint-disable-line

  const AddInsurance = () => {
    AlgaehSearch({
      //@ts-ignore
      searchName: "new_insurance",
      columns: props.getsportlightSearch("Insurance")?.Insurance_field,
      placeHolder: "Insurance Name",
      onRowSelect: (row: any) => {
        // updateInsuranceState(row);
        setInsuranceList([row]);
        setValue("primary_insurance_provider_id", row?.insurance_provider_id);
        setValue("primary_sub_id", row?.sub_insurance_provider_id);
        setValue("primary_network_id", row?.network_id);
        setInsuranceInfo({
          primary_insurance_provider_id: row?.insurance_provider_id,
          primary_sub_id: row?.sub_insurance_provider_id,
          primary_network_id: row?.network_id,
          primary_policy_num: row?.policy_number,
          primary_network_office_id: row?.hims_d_insurance_network_office_id,
        });

        // setValue("primary_network_office_id", row?.network_office_id);
        setValue("primary_policy_num", row?.policy_number);
        setValue("effective_date", [
          moment(row?.effective_end_date),
          moment(row?.effective_start_date),
        ]);
        clearErrors([
          "primary_policy_num",
          "effective_date",
          "primary_insurance_provider_id",
          "primary_sub_id",
          "primary_network_id",
        ]);
        // setValue("primary_effective_end_date", row?.net_effective_start_date);
        // dropDownData = [row];
        // setPatientDetails(row);
      },
    });
  };

  return (
    <Spin spinning={isLoading}>
      {/* <PolicyModal visible={showPolicy} onClose={() => setShowPolicy(false)} /> */}
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
              <div className="">
                <div className="col">
                  <div className="row">
                    <div className="col-lg-3 insuranceRadio form-group">
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
                            disabled={disable_data}
                            checked={isInsurance}
                            onChange={() => setIsInsurance(true)}
                          />
                          <span>Yes</span>
                        </label>
                        <label className="radio inline">
                          <input
                            type="radio"
                            name="insuredNo"
                            disabled={disable_data}
                            checked={!isInsurance}
                            onChange={() => setIsInsurance(false)}
                          />
                          <span>No</span>
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
                        disabled={disable_data === true ? true : !isInsurance}
                      >
                        <i className="fas fa-plus" />
                      </button>
                    </div>
                  </div>
                  <div className="row primary-box-container">
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
                          div={{ className: "col-4 form-group mandatory" }}
                          label={{
                            fieldName: "insurance_id",
                            isImp: isInsurance,
                          }}
                          error={errors}
                          selector={{
                            name: "primary_insurance_provider_id",
                            className: "select-fld",
                            onChange: (_: any, selected: any) => {
                              onChange(selected);
                              const [current] = dropDownData?.filter(
                                (item: any) =>
                                  item.insurance_provider_id === selected
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

                              setInsuranceInfo({
                                primary_insurance_provider_id:
                                  current?.insurance_provider_id,
                                primary_sub_id:
                                  current?.sub_insurance_provider_id,
                                primary_network_id: current?.network_id,
                                primary_policy_num: current?.policy_number,
                                primary_network_office_id:
                                  current?.hims_d_insurance_network_office_id,
                              });
                              // setInsuranceInfo({
                              //   primary_network_office_id:
                              //     current?.hims_d_insurance_network_office_id,
                              //   payer_id: current?.payer_id,
                              // });
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
                              // setInsurancePayerID(current?.payer_id);
                              trigger();
                            },
                            value,
                            // onClear: () => onChange(""),
                            dataSource: {
                              textField: "insurance_provider_name",
                              valueField: "insurance_provider_id",
                              data: dropDownData,
                            },
                            others: {
                              disabled:
                                disable_data === true ? true : !isInsurance,
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
                          div={{ className: "col-4 form-group mandatory" }}
                          label={{
                            fieldName: "sub_insurance_id",
                            isImp: isInsurance,
                          }}
                          error={errors}
                          selector={{
                            name: "primary_sub_id",
                            className: "select-fld",
                            onChange: (_: any, selected: any) =>
                              onChange(selected),
                            value,
                            // onClear: () => onChange(""),
                            dataSource: {
                              textField: insurance_list?.length
                                ? "insurance_sub_name"
                                : "sub_insurance_provider_name",
                              // this.state.selectedLang == "en" ? "sub_insurance_provider_name" : "name",
                              valueField: "sub_insurance_provider_id",
                              data: dropDownData,
                            },
                            // onChange: insurancehandle.bind(this, this, context),
                            others: {
                              disabled:
                                disable_data === true ? true : !isInsurance,
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
                          div={{ className: "col-4 form-group mandatory" }}
                          label={{
                            fieldName: "policy_id",
                            isImp: isInsurance,
                          }}
                          error={errors}
                          selector={{
                            name: "primary_network_id",
                            className: "select-fld",
                            onChange: (_: any, selected: any) =>
                              onChange(selected),
                            value,
                            onClear: () => onChange(""),
                            dataSource: {
                              textField: "network_type",
                              valueField: "network_id",
                              data: dropDownData,
                            },
                            others: {
                              disabled:
                                disable_data === true ? true : !isInsurance,
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
                          div={{ className: "col-3 form-group mandatory" }}
                          label={{
                            fieldName: "plan_id",
                            isImp: isInsurance,
                          }}
                          error={errors}
                          selector={{
                            name: "primary_policy_num",
                            className: "select-fld",
                            onChange: (_: any, selected: any) =>
                              onChange(selected),
                            value,
                            onClear: () => onChange(""),
                            dataSource: {
                              textField: "policy_number",
                              valueField: "policy_number",
                              data: dropDownData,
                            },
                            others: {
                              disabled:
                                disable_data === true ? true : !isInsurance,
                            },
                          }}
                        />
                      )}
                    />
                    <div
                      className="col-1"
                      style={{ paddingRight: 0, marginTop: 20 }}
                    >
                      <button
                        type="button"
                        className="btn btn-primary btn-rounded"
                        // onClick={() => setShowPolicy(true)}
                        // disabled={disable_data}
                        disabled={disable_data === true ? true : !isInsurance}
                      >
                        <i className="fas fa-plus" />
                      </button>
                    </div>
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
                          div={{ className: "col-4 form-group mandatory" }}
                          label={{
                            fieldName: "card_number",
                            isImp: isInsurance,
                          }}
                          error={errors}
                          textBox={{
                            ...props,
                            className: "txt-fld",
                            name: "primary_card_number",

                            disabled:
                              disable_data === true ? true : !isInsurance,
                          }}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="effective_date"
                      rules={{
                        required: {
                          value: isInsurance,
                          message: "Field is Required",
                        },
                      }}
                      render={({ onChange, value }) => (
                        <AlgaehDateHandler
                          div={{ className: "col-4 form-group mandatory" }}
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
                          type="range"
                          others={{
                            disabled:
                              disable_data === true ? true : !isInsurance,
                          }}
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
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Spin>
  );
}
