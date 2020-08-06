import React from "react";
// import { useQuery } from "react-query";
// import { Controller, useWatch } from "react-hook-form";
// import moment from "moment";
import {
  // MainContext,
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
// import { fieldNameFn } from "./index";
// import { newAlgaehApi } from "../../hooks/";
// import GenericData from "../../utils/GlobalVariables.json";
const { TabPane } = Tabs;

export function InsuranceDetails({ control, trigger }) {
  const { fieldNameFn } = useLangFieldName();
  // const { userLanguage } = useContext(MainContext);

  return (
    <Spin spinning={false}>
      <div
        className="hptl-phase1-insurance-details margin-top-15"
        onFocus={() => trigger()}
      >
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
                                value="Y"
                                checked={
                                  false
                                  //   this.state.insured === "Y" ? true : false
                                }
                                // onChange={radioChange.bind(this, this, context)}
                                // disabled={this.state.hideInsurance}
                              />
                              <span>{fieldNameFn("Yes", "نعم")}</span>
                            </label>
                            <label className="radio inline">
                              <input
                                type="radio"
                                name="insuredNo"
                                value="N"
                                checked={
                                  true
                                  //   this.state.insured === "N" ? true : false
                                }
                                // disabled={this.state.hideInsurance}
                                // onChange={radioChange.bind(this, this, context)}
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
                            // disabled={this.state.insuranceYes}
                            // onClick={InsuranceDetails.bind(this, this, context)}
                          >
                            <i className="fas fa-plus" />
                          </button>
                        </div>
                        <AlgaehAutoComplete
                          div={{ className: "col-3" }}
                          label={{
                            fieldName: "insurance_id",
                            isImp: true,
                          }}
                          selector={{
                            name: "primary_insurance_provider_id",
                            className: "select-fld",
                            // value: this.state.primary_insurance_provider_id,
                            dataSource: {
                              textField: "insurance_provider_name",
                              // this.state.selectedLang == "en" ? "insurance_provider_name" : "name",
                              valueField: "insurance_provider_id",
                              data: [],
                            },
                            // onChange: insurancehandle.bind(this, this, context),
                            others: {
                              disabled: true,
                            },
                          }}
                        />

                        <AlgaehAutoComplete
                          div={{ className: "col-3" }}
                          label={{
                            fieldName: "sub_insurance_id",
                            isImp: true,
                          }}
                          selector={{
                            name: "primary_sub_id",
                            className: "select-fld",
                            // value: this.state.primary_sub_id,
                            dataSource: {
                              textField: "sub_insurance_provider_name",
                              // this.state.selectedLang == "en" ? "sub_insurance_provider_name" : "name",
                              valueField: "sub_insurance_provider_id",
                              data: [],
                            },
                            // onChange: insurancehandle.bind(this, this, context),
                            others: {
                              disabled: true,
                            },
                            // onClear: clearinsurancehandle.bind(
                            //   this,
                            //   this,
                            //   context
                            // ),
                          }}
                        />
                        <AlgaehAutoComplete
                          div={{ className: "col-3" }}
                          label={{
                            fieldName: "policy_id",
                            isImp: true,
                          }}
                          selector={{
                            name: "primary_network_id",
                            className: "select-fld",
                            // value: this.state.primary_network_id,
                            dataSource: {
                              textField: "network_type",
                              // this.state.selectedLang == "en" ? "network_type" : "name",
                              valueField: "network_id",
                              data: [],
                            },
                            // onChange: insurancehandle.bind(this, this, context),
                            others: {
                              disabled: true,
                            },
                            // onClear: clearinsurancehandle.bind(
                            //   this,
                            //   this,
                            //   context
                            // ),
                          }}
                        />
                      </div>
                      <div className="row primary-box-container">
                        <AlgaehAutoComplete
                          div={{ className: "col-3" }}
                          label={{
                            fieldName: "plan_id",
                            isImp: true,
                          }}
                          selector={{
                            name: "primary_policy_num",
                            className: "select-fld",
                            // value: this.state.primary_policy_num,
                            dataSource: {
                              textField: "policy_number",
                              valueField: "policy_number",
                              data: [],
                            },
                            // onChange: insurancehandle.bind(this, this, context),
                            others: {
                              disabled: true,
                            },
                            // onClear: clearinsurancehandle.bind(
                            //   this,
                            //   this,
                            //   context
                            // ),
                          }}
                        />

                        <AlgaehFormGroup
                          div={{ className: "col-3" }}
                          label={{
                            fieldName: "card_number",
                            isImp: true,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "primary_card_number",
                            // value: this.state.primary_card_number,
                            // events: {
                            //   onChange: texthandle.bind(this, this, context),
                            // },

                            disabled: true,
                          }}
                        />

                        <AlgaehDateHandler
                          div={{ className: "col-3" }}
                          label={{
                            fieldName: "effective_start_date",
                            isImp: true,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "primary_effective_start_date",
                          }}
                          maxDate={new Date()}
                          others={{ disabled: true }}
                          //   events={
                          //     {
                          //       // onChange: datehandle.bind(this, this, context),
                          //     }
                          //   }
                          //   value={this.state.primary_effective_start_date}
                        />

                        <AlgaehDateHandler
                          div={{ className: "col-3" }}
                          label={{
                            fieldName: "expiry_date",
                            isImp: true,
                          }}
                          others={{ disabled: true }}
                          textBox={{
                            className: "txt-fld",
                            name: "primary_effective_end_date",
                          }}
                          minDate={new Date()}
                          //   events={{
                          //     onChange: enddatehandle.bind(this, this, context),
                          //   }}
                          //   value={this.state.primary_effective_end_date}
                          disabled={true}
                        />
                      </div>
                    </div>

                    {/* //effective_end_date// */}

                    <div className="col-lg-4 secondary-details">
                      <div className="row secondary-box-container">
                        <div className="col-lg-6 insurCrdImg">
                          <AlgaehFileUploader
                            // ref={(patInsuranceFrontImg) => {
                            //   this.patInsuranceFrontImg = patInsuranceFrontImg;
                            // }}
                            noImage="insurance-card-front"
                            name="patInsuranceFrontImg"
                            accept="image/*"
                            showActions={false}
                            textAltMessage="Insurance Card Front Side"
                            serviceParameters={{
                              uniqueID: "null" + "_front",
                              fileType: "Patients",
                              //   processDelay: this.imageDetails.bind(
                              //     this,
                              //     context,
                              //     "patInsuranceFrontImg"
                              //   ),
                            }}
                            // renderPrevState={this.state.patInsuranceFrontImg}
                            // forceRefresh={this.state.forceRefresh}
                          />
                        </div>

                        <div className="col-lg-6 insurCrdImg">
                          <AlgaehFileUploader
                            // ref={(patInsuranceBackImg) => {
                            //   this.patInsuranceBackImg = patInsuranceBackImg;
                            // }}
                            noImage="insurance-card-back"
                            name="patInsuranceBackImg"
                            accept="image/*"
                            showActions={false}
                            textAltMessage="Insurance Card Back Side"
                            serviceParameters={{
                              uniqueID: null + "_back",
                              fileType: "Patients",
                              //   processDelay: this.imageDetails.bind(
                              //     this,
                              //     context,
                              //     "patInsuranceBackImg"
                              //   ),
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
