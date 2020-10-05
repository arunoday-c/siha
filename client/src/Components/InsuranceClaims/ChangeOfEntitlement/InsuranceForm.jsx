import React, { useContext, useRef, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  AlgaehAutoComplete,
  AlgaehDateHandler,
  AlgaehFormGroup,
  AlgaehLabel,
  MainContext,
} from "algaeh-react-components";
// import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import AlgaehFileUploader from "../../Wrapper/algaehFileUpload";
import { useLangFieldName } from "../../PatientRegistrationNew/patientHooks";
import AlgaehSearch from "../../Wrapper/globalSearch";
import InsuranceFields from "../../../Search/Insurance.json";
import { PolicyModal } from "../../InsuranceSetup/PolicyModal";

export function InsuranceForm({
  details = [],
  patientInsurance = [],
  data = {},
}) {
  const { fieldNameFn } = useLangFieldName();
  const [isInsurance, setIsInsurance] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [insuranceList, setInsuranceList] = useState([]);
  const insuranceImgFront = useRef(null);
  const insuranceImgBack = useRef(null);
  const { userToken } = useContext(MainContext);
  const { control, setValue, trigger, errors, reset, watch } = useForm({
    defaultValues: {
      primary_insurance_provider_id: "",
      primary_sub_id: "",
      primary_network_id: "",
      primary_network_office_id: "",
      primary_policy_num: "",
      primary_effective_start_date: "",
      primary_effective_end_date: "",
    },
  });

  const primary_card_number = watch("primary_card_number");

  useEffect(() => {
    if (patientInsurance.length) {
      const [ins] = patientInsurance;
      setIsInsurance(true);
      reset({
        primary_insurance_provider_id: ins?.insurance_provider_id,
        primary_sub_id: ins?.sub_insurance_provider_id,
        primary_network_id: ins?.network_id,
        primary_network_office_id: ins?.hims_d_insurance_network_office_id,
        primary_policy_num: ins?.policy_number,
        primary_effective_start_date: ins?.primary_effective_start_date,
        primary_effective_end_date: ins?.primary_effective_end_date,
        primary_card_number: ins?.card_number,
      });
    }
    // eslint-disable-next-line
  }, [patientInsurance]);

  const disabled = !isInsurance;
  const dropDownData = insuranceList?.length ? insuranceList : patientInsurance;

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
        setInsuranceList([row]);
        setValue("primary_insurance_provider_id", row?.insurance_provider_id);
        setValue("primary_sub_id", row?.sub_insurance_provider_id);
        setValue("primary_network_id", row?.network_id);
        setValue("primary_network_office_id", row?.network_office_id);
        setValue("primary_policy_num", row?.policy_number);
        setValue("primary_effective_start_date", row?.effective_start_date);
        setValue("primary_effective_end_date", row?.effective_end_date);
      },
    });
  };

  return (
    <div className="hptl-phase1-invoice-generation-form">
      <PolicyModal visible={showPolicy} onClose={() => setShowPolicy(false)} />
      <div className="col-lg-12">
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
                      name="insuredNo"
                      checked={!isInsurance}
                      onChange={() => setIsInsurance(false)}
                    />
                    <span>Cash</span>
                  </label>
                  <label className="radio inline">
                    <input
                      type="radio"
                      name="insuredYes"
                      checked={isInsurance}
                      onChange={() => setIsInsurance(true)}
                    />
                    <span>Insurance</span>
                  </label>
                </div>
              </div>
              <div className="col-1" style={{ paddingRight: 0, marginTop: 20 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-rounded"
                  onClick={AddInsurance}
                  // disabled={!isInsurance}
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
                          (item) => item.insurance_provider_id == selected
                        );
                        setValue(
                          "primary_insurance_provider_id",
                          current?.insurance_provider_id
                        );
                        setValue(
                          "primary_sub_id",
                          current?.sub_insurance_provider_id
                        );
                        setValue("primary_network_id", current?.network_id);

                        setValue("primary_policy_num", current?.policy_number);
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
                        textField: "insurance_sub_name",
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
                        textField: fieldNameFn("network_type", "name"),
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
                    div={{ className: "col-2" }}
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
              <div className="col-1" style={{ paddingRight: 0, marginTop: 20 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-rounded"
                  onClick={() => setShowPolicy(true)}
                  // disabled={!isInsurance}
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
                  showActions={isInsurance && !!primary_card_number}
                  textAltMessage="Insurance Card Front Side"
                  serviceParameters={{
                    uniqueID:
                      primary_card_number === undefined ||
                      primary_card_number === null ||
                      primary_card_number === ""
                        ? null
                        : primary_card_number + "_front",
                    // (primary_card_number ||  null) + "_front",
                    fileType: "Patients",
                    // processDelay: (...val) => {
                    //   console.log(val, "val");
                    // },
                  }}
                  renderPrevState={primary_card_number ? undefined : true}
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
                  showActions={isInsurance && !!primary_card_number}
                  textAltMessage="Insurance Card Back Side"
                  serviceParameters={{
                    uniqueID:
                      primary_card_number === undefined ||
                      primary_card_number === null ||
                      primary_card_number === ""
                        ? null
                        : primary_card_number + "_back",
                    //(primary_card_number || null) + "_back",
                    fileType: "Patients",
                    // processDelay: (...val) => {
                    //   console.log(val, "val");
                    // },
                  }}
                  renderPrevState={primary_card_number ? undefined : true}
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
  );
}
