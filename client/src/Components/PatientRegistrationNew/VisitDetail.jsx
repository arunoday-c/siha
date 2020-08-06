import React from "react";
// import { useQuery } from "react-query";
// import { Controller, useWatch } from "react-hook-form";
import moment from "moment";
import {
  //   MainContext,
  Tabs,
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  //   AlgaehDateHandler,
  AlgaehDataGrid,
  //   AlgaehHijriDatePicker,
  Spin,
} from "algaeh-react-components";
import { useLangFieldName } from "./patientHooks";
// import { newAlgaehApi } from "../../hooks/";
// import GenericData from "../../utils/GlobalVariables.json";
const { TabPane } = Tabs;

export function VisitDetails({ control, trigger }) {
  const { fieldNameFn } = useLangFieldName();
  const insured = "Y";
  let department_type, hims_d_patient_id;

  return (
    <Spin spinning={false}>
      <div
        className="hptl-phase1-consultation-details margin-top-15"
        onFocus={() => trigger()}
      >
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
                        <AlgaehAutoComplete
                          div={{ className: "col-lg-6 mandatory" }}
                          label={{
                            fieldName: "visit_type",
                            isImp: true,
                          }}
                          selector={{
                            name: "visit_type",
                            className: "select-fld",

                            dataSource: {
                              textField: fieldNameFn("visit_type_desc"),
                              valueField: "hims_d_visit_type_id",
                              //   data: this.props.visittypes
                            },
                            others: {
                              disabled: false,
                            },
                          }}
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
                          {department_type === "D" &&
                          hims_d_patient_id !== null ? (
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
                                    <span>
                                      {this.state.selectedLang === "en"
                                        ? "Yes"
                                        : "نعم"}
                                    </span>
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
                                    disabled: true,
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
                          {insured === "Y" ? (
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

                                  disabled: false,
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
                        {true ? (
                          <span className="packageStatus">
                            {" "}
                            Package Exists{" "}
                          </span>
                        ) : null}
                      </h6>

                      <AlgaehDataGrid
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
                            // displayTemplate: row => {
                            //   return (
                            //     <span>{this.changeDateFormat(row.visit_date)}</span>
                            //   );
                            // },
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
                            // displayTemplate: row => {
                            //   let display =
                            //     this.props.visittypes === undefined
                            //       ? []
                            //       : this.props.visittypes.filter(
                            //         f => f.hims_d_visit_type_id === row.visit_type
                            //       );

                            //   return (
                            //     <span>
                            //       {display !== null && display.length !== 0
                            //         ? this.state.selectedLang === "en"
                            //           ? display[0].visit_type_desc
                            //           : display[0].arabic_visit_type_desc
                            //         : ""}
                            //     </span>
                            //   );
                            // },
                            disabled: true,
                          },
                          {
                            fieldName: "sub_department_id",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "department_id" }}
                              />
                            ),
                            // displayTemplate: row => {
                            //   let display;
                            //   display =
                            //     this.props.viewsubdept === undefined
                            //       ? []
                            //       : (display = this.props.viewsubdept.filter(
                            //         f =>
                            //           f.hims_d_sub_department_id ===
                            //           row.sub_department_id
                            //       ));

                            //   return (
                            //     <span>
                            //       {display !== null && display.length !== 0
                            //         ? this.state.selectedLang === "en"
                            //           ? display[0].sub_department_name
                            //           : display[0].arabic_sub_department_name
                            //         : ""}
                            //     </span>
                            //   );
                            // },
                            disabled: true,
                          },
                          {
                            fieldName: "doctor_id",
                            label: (
                              <AlgaehLabel label={{ fieldName: "doctor_id" }} />
                            ),
                            // displayTemplate: row => {
                            //   let display;
                            //   display =
                            //     this.props.frontproviders === undefined
                            //       ? []
                            //       : (display = this.props.frontproviders.filter(
                            //         f => f.hims_d_employee_id === row.doctor_id
                            //       ));

                            //   return (
                            //     <span>
                            //       {display !== null && display.length !== 0
                            //         ? this.state.selectedLang === "en"
                            //           ? display[0].full_name
                            //           : display[0].arabic_name
                            //         : ""}
                            //     </span>
                            //   );
                            // },
                            disabled: true,
                          },
                        ]}
                        keyId="visit_code"
                        data={[]}
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
