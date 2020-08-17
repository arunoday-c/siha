import React, { useContext } from "react";
import { useQuery } from "react-query";
import { Controller, useWatch } from "react-hook-form";
import moment from "moment";
import {
  //   MainContext,
  Tabs,
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehTreeSearch,
  AlgaehDataGrid,
  Spin,
} from "algaeh-react-components";
import { useLangFieldName } from "./patientHooks";
import { newAlgaehApi } from "../../hooks/";
import { FrontdeskContext } from "./FrontdeskContext";
// import GenericData from "../../utils/GlobalVariables.json";
const { TabPane } = Tabs;

const getDoctorData = async () => {
  const result = await Promise.all([
    newAlgaehApi({
      uri: "/frontDesk/getDoctorAndDepartment",
      module: "frontDesk",
      method: "GET",
    }),
    newAlgaehApi({
      uri: "/visitType/get",
      module: "masterSettings",
      method: "GET",
    }),
  ]);
  return {
    doctors: result[0]?.data?.records,
    visitTypes: result[1]?.data?.records,
  };
};

export function VisitDetails({
  control,
  setValue,
  trigger,
  errors,
  visits = [],
  packages = [],
}) {
  // const queryParams = useQueryParams();
  const { fieldNameFn } = useLangFieldName();
  const { setServiceInfo, setConsultationInfo, disabled } = useContext(
    FrontdeskContext
  );
  const { data, isLoading } = useQuery("doctors-data", getDoctorData, {
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
    initialData: {
      doctors: [],
      visitTypes: [],
    },
    initialStale: true,
  });
  const {
    hims_d_patient_id,
    primary_insurance_provider_id,
    department_type,
  } = useWatch({
    control,
    name: [
      "hims_d_patient_id",
      "primary_insurance_provider_id",
      "department_type",
    ],
  });

  const insured = !!primary_insurance_provider_id;

  return (
    <Spin spinning={isLoading}>
      <div className="hptl-phase1-consultation-details margin-top-15">
        <div className="consultation-section">
          <Tabs type="card">
            <TabPane
              tab={
                <AlgaehLabel
                  label={{
                    fieldName: "tab_condtls",
                  }}
                />
              }
              key="consultDetails"
            >
              <div className="hptl-phase1-add-consultation-form">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-4 primary-details">
                      <div className="row primary-box-container">
                        <Controller
                          name="visit_type"
                          control={control}
                          rules={{ required: "Please select Visit Type" }}
                          render={({ onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-6 mandatory" }}
                              label={{
                                fieldName: "visit_type",
                                isImp: true,
                              }}
                              error={errors}
                              selector={{
                                name: "visit_type",
                                className: "select-fld",
                                value,
                                onChange: (data, selected) => {
                                  setConsultationInfo(data);
                                  onChange(selected);
                                },
                                onClear: () => onChange(""),
                                dataSource: {
                                  textField: fieldNameFn("visit_type_desc"),
                                  valueField: "hims_d_visit_type_id",
                                  data: data?.visitTypes,
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
                          name="doctor"
                          rules={{ required: "Please Select a doctor" }}
                          render={({ onChange, value }) => (
                            <AlgaehTreeSearch
                              div={{ className: "col-6 form-group" }}
                              label={{
                                fieldName: "doctor_id",
                                isImp: true,
                                align: "ltr",
                              }}
                              error={errors}
                              tree={{
                                disableHeader: true,
                                treeDefaultExpandAll: true,
                                onChange: (selected) => {
                                  if (selected) {
                                    setServiceInfo(selected);
                                  } else {
                                    setServiceInfo(null);
                                  }
                                  onChange(selected);
                                },
                                disabled,
                                value,
                                name: "doctor",
                                data: data?.doctors,
                                textField: fieldNameFn("label", "arlabel"),
                                valueField: (node) => {
                                  if (node?.sub_department_id) {
                                    return `${node?.sub_department_id}-${node?.services_id}-${node?.value}-${node?.department_type}`;
                                  } else {
                                    return node?.value;
                                  }
                                },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="row primary-box-container">
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "visit_date",
                            }}
                          />
                          <h6>{moment().format("DD/MM/YYYY")}</h6>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          {department_type === "D" && !!hims_d_patient_id ? (
                            <div className="row">
                              <div
                                className="col-lg-4"
                                style={{ paddingRight: 0 }}
                              >
                                <label>Existing Plan</label>
                                <br />

                                <div className="customCheckbox">
                                  <label className="checkbox inline">
                                    <input
                                      type="checkbox"
                                      name="existing_plan"
                                      value="Y"
                                      // checked={this.state.checked_existing_plan}
                                      // onChange={radioChange.bind(
                                      //   this,
                                      //   this,
                                      //   context
                                      // )}
                                    />
                                    <span>{fieldNameFn("Yes", "نعم")}</span>
                                  </label>
                                </div>
                              </div>

                              <AlgaehAutoComplete
                                div={{ className: "col-lg-8" }}
                                label={{
                                  fieldName: "treatment_plan_id",
                                  isImp: true,
                                }}
                                selector={{
                                  name: "treatment_plan_id",
                                  className: "select-fld",
                                  // value: this.state.treatment_plan_id,
                                  dataSource: {
                                    textField: "plan_name",
                                    valueField: "hims_f_treatment_plan_id",
                                    //   data: this.props.dentalplans
                                  },
                                  others: {
                                    disabled,
                                  },
                                  // onChange: texthandle.bind(this, this, context),
                                  onClear: () => {
                                    //   this.setState({
                                    //     treatment_plan_id: null
                                    //   });
                                  },
                                }}
                              />
                            </div>
                          ) : null}
                        </div>

                        <div className="col-lg-12">
                          {insured ? (
                            <div className="row">
                              <div
                                className="col-lg-4"
                                style={{ paddingRight: 0 }}
                              >
                                <label>Eligible</label>
                                <br />

                                <div className="customCheckbox">
                                  <label className="checkbox inline">
                                    <input
                                      type="checkbox"
                                      name="eligible"
                                      value="Y"
                                      //   checked={this.state.checked_eligible}
                                      //   onChange={radioChange.bind(
                                      //     this,
                                      //     this,
                                      //     context
                                      //   )}
                                    />
                                    <span>{fieldNameFn("Yes", "نعم")}</span>
                                  </label>
                                </div>
                              </div>
                              <AlgaehFormGroup
                                div={{ className: "col-lg-8 mandatory" }}
                                label={{
                                  fieldName: "eligible_reference_number",
                                  // isImp: this.state.insured === "Y" ? true : false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "eligible_reference_number",
                                  //   value: this.state.eligible_reference_number,

                                  // onChange: texthandle.bind(this, this, context)

                                  disabled,
                                }}
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-8 secondary-details">
                      <h6>
                        <AlgaehLabel label={{ fieldName: "PastVisit" }} />
                        {packages?.length ? (
                          <span className="packageStatus">
                            {" "}
                            Package Exists{" "}
                          </span>
                        ) : null}
                      </h6>

                      <AlgaehDataGrid
                        className="pastVisitGrid"
                        columns={[
                          {
                            fieldName: "visit_code",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "visit_code" }}
                              />
                            ),
                            disabled: true,
                          },
                          {
                            fieldName: "visit_date",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "visit_date" }}
                              />
                            ),
                            disabled: true,
                          },
                          {
                            fieldName: "visit_type",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "visit_type" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              let display = data?.visitTypes?.filter(
                                (f) => f.hims_d_visit_type_id == row.visit_type
                              );

                              return (
                                <span>
                                  {fieldNameFn(
                                    display[0]?.visit_type_desc,
                                    display[0]?.arabic_visit_type_desc
                                  )}
                                </span>
                              );
                            },
                          },
                          {
                            fieldName: "sub_department_id",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "department_id" }}
                              />
                            ),

                            disabled: true,
                          },
                          {
                            fieldName: "doctor_id",
                            label: (
                              <AlgaehLabel label={{ fieldName: "doctor_id" }} />
                            ),

                            disabled: true,
                          },
                        ]}
                        keyId="visit_code"
                        data={visits ?? []}
                        paging={{ page: 0, rowsPerPage: 3 }}
                        events={{}}
                      />
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
