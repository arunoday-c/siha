import React, { Component } from "react";
import "./udocaf.css";
import {
  AlagehFormGroup,
  AlgaehDateHandler,
  AlgaehDataGrid,
  AlgaehLabel
} from "../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../utils/algaehApiCall";
import _ from "lodash";
import EditorEvents from "./EditorEvents"

export default class DcafEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refill: false,
      walkin: false,
      referral: false,
      class: "",
      insurance_holder: "",
      insurance_approved: "",
      dcaf_data: undefined,
      showImgArea: true
    };
  }

  saveAndPrintDcaf(e) {
    
    EditorEvents().saveAndPrintDcaf(this,e)  
  }

  ChangeEventHandler(e){
    EditorEvents().ChangeEventHandler(this,e)
  }

  radioChange(e){
    EditorEvents().dcafradioChange(this,e)
  }

  componentDidMount(){
    

    if(this.props.dataProps.hims_f_dcaf_header !== undefined &&
      this.props.dataProps.hims_f_dcaf_header.length > 0){
        
        let data = this.props.dataProps.hims_f_dcaf_header[0];
        let insurance = this.props.dataProps.hims_f_dcaf_insurance_details[0]

        data.dcaf_services = this.props.dataProps.hims_f_dcaf_services
        data.dcaf_medication = this.props.dataProps.hims_f_dcaf_medication
        this.setState({...this.state, ...data, ...insurance})
    }
  }

  render() {
    
    const _isPrimary = "primary";
    const _hims_f_dcaf_header = this.props.dataProps.hims_f_dcaf_header[0];
    const _insurnce = _.find(
      this.props.dataProps.hims_f_dcaf_insurance_details,
      f =>
        f[
          _isPrimary === "primary"
            ? "primary_insurance_company_name"
            : "secondary_insurance_company_name"
        ] !== undefined
    );

    return (
      <div className="">
        <React.Fragment>
          <div className="popupInner">
            <div className="popRightDiv">
              <div className="ucafEditCntr">
                <div className="row">
                  <div className="col-7">
                    <div className="receptionNurse">
                      <div className="row">
                        <div className="col-12">
                          <h5>
                            To be completed & ID verified by the
                            reception/nurse:
                          </h5>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-12  form-group" }}
                          label={{
                            forceLabel: "Provider Name",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: this.state.provider_name,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12  form-group" }}
                          label={{
                            forceLabel: "Insurance Company Name",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value:this.state.primary_insurance_company_name,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "TPA Company Name",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value:this.state.primary_tpa_insurance_company_name,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Patient File Number",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: this.state.patient_code,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlgaehDateHandler
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Date of Visit",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: ""
                          }}
                          value={this.state.visit_date}
                          maxDate={new Date()}
                          events={{}}
                        />
                        <div
                          className="col-2 customRadio"
                          style={{ paddingTop: 25 }}
                        >
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="maritalType"
                              checked={
                                this.state.patient_marital_status ===
                                "PlanType"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Plan Type</span>
                          </label>
                        </div>
                        <div
                          className="col-6 customCheckbox"
                          style={{ paddingTop: 25 }}
                        >
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              checked={
                                this.state.new_visit_patient === "Y"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>New Visit</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              checked={
                                this.state.new_visit_patient === "N"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Follow Up</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-5">
                    <div className="IDCardUcaf">
                      <div className="row">
                        <div className="col-12">
                          <h5>Print/Fill in clear letters or Emboss Card:</h5>
                        </div>

                        {this.state.showImgArea ? (
                          <div className="col-12">
                            <div className="row">Image Comes Here</div>
                          </div>
                        ) : (
                          <div className="col-12">
                            <div className="row">
                              <AlagehFormGroup
                                div={{ className: "col-6 form-group" }}
                                label={{
                                  forceLabel: "Insured Name",
                                  isImp: false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: this.state.patient_full_name,
                                  events: {},
                                  option: {
                                    type: "text"
                                  }
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-6 form-group" }}
                                label={{
                                  forceLabel: "ID. Card No.",
                                  isImp: false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value:this.state.primary_card_number,
                                  events: {},
                                  option: {
                                    type: "text"
                                  }
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-4 form-group" }}
                                label={{
                                  forceLabel: "Sex",
                                  isImp: false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: this.state.patient_gender,
                                  events: {},
                                  option: {
                                    type: "text"
                                  }
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-4 form-group" }}
                                label={{
                                  forceLabel: "Age",
                                  isImp: false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: this.state.age_in_years,
                                  events: {},
                                  option: {
                                    type: "text"
                                  }
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-4 form-group" }}
                                label={{
                                  forceLabel: "Class",
                                  isImp: false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: this.state.class,
                                  events: {},
                                  option: {
                                    type: "text"
                                  }
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-6 form-group" }}
                                label={{
                                  forceLabel: "Policy Holder",
                                  isImp: false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value:
                                    this.state.insurance_holder ===
                                    undefined
                                      ? this.state.insurance_holder === ""
                                        ? this.state.patient_full_name
                                        : this.state.insurance_holder
                                      : this.state.insurance_holder,
                                  events: {},
                                  option: {
                                    type: "text"
                                  }
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-6 form-group" }}
                                label={{
                                  forceLabel: "Policy No.",
                                  isImp: false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value:this.state.primary_policy_num,
                                  events: {},
                                  option: {
                                    type: "text"
                                  }
                                }}
                              />
                              <AlgaehDateHandler
                                div={{ className: "col-6" }}
                                label={{
                                  forceLabel: "Expiry Date",
                                  isImp: false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: ""
                                }}
                                value={this.state.primary_effective_end_date}
                                maxDate={new Date()}
                                events={{}}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-6 form-group" }}
                                label={{
                                  forceLabel: "Approval",
                                  isImp: false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "insurance_approved",
                                  value: this.state.insurance_approved,
                                  events: {},
                                  option: {
                                    type: "text"
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="attendingPhysician">
                      <div className="row">
                        <div className="col-12">
                          <h5>To be completed by the Dentist:</h5>
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Duration of Illness (Days)",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_duration_of_illness",
                            value:
                              this.state.patient_duration_of_illness,
                            events: {
                              onChange:this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Chief Complaints & Main Symptoms",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_chief_comp_main_symptoms",
                            value:
                              this.state.patient_chief_comp_main_symptoms,
                            events: {
                              onChange:this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Significant Signs",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_significant_signs",
                            value:
                              this.state.patient_significant_signs,
                            events: {
                              onChange:this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Diagnosis(ICD10)",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_diagnosys",
                            value: this.state.patient_diagnosys,
                            events: {
                              onChange:this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Primary",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "primary",
                            value: this.state.primary,
                            events: {
                              onChange:this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Secondary",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "secondary",
                            value: this.state.secondary,
                            events: {
                              onChange:this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Other Conditions",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_other_conditions",
                            value: this.state.patient_other_conditions,
                            events: {
                              onChange:this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <div className="attendingPhysician">
                      <div className="row">
                        <div className="col-12">
                          <h5>Please tick () where appropriate</h5>
                        </div>

                        <div className="col-12 customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="regular_dental_trt"
                              value = "Y"
                              checked={
                                this.state.regular_dental_trt === "Y"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Regular Dental Treatment</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="dental_cleaning"
                              checked={
                                this.state.dental_cleaning === "Y"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Dental Cleaning</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="RTA"
                              checked={
                                this.state.RTA === "Y"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Trauma Treatment Specify: RTA</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="work_related"
                              checked={
                                this.state.work_related === "Y"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Work Related</span>
                          </label>
                          {/* //Others */}
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Others",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "others",
                            value: this.state.others,
                            events: {
                              onChange:this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "How",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "how",
                            value: this.state.how,
                            events: {
                              onChange:this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "When",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "when",
                            value: this.state.when,
                            events: {
                              onChange:this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Where",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "where",
                            value: this.state.where,
                            events: {
                              onChange:this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <div className="col-12" id="serviceGrid_Cntr">
                          <h5 style={{ marginBottom: 0, marginTop: 10 }}>
                            Suggestive line(s) of management: Kindly, enumerate
                            the recommended investigation, and/or procedures
                            <b>For outpatient approvals only:</b>
                          </h5>
                          <AlgaehDataGrid
                            id="service_grid"
                            columns={[
                              {
                                fieldName: "service_code",
                                label: (
                                  <AlgaehLabel label={{ forceLabel: "Code" }} />
                                )
                              },
                              {
                                fieldName: "service_name",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Dental Service"
                                    }}
                                  />
                                )
                              },

                              {
                                fieldName: "teeth_number",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Tooth No." }}
                                  />
                                )
                              },
                              {
                                fieldName: "service_net_amout",
                                label: (
                                  <AlgaehLabel label={{ forceLabel: "Cost" }} />
                                )
                              }
                            ]}
                            keyId="hims_f_dcaf_header_id"
                            dataSource={{
                              data: this.state.dcaf_services
                            }}
                            paging={{
                              page: 0,
                              rowsPerPage: 10,
                              showPagination: true
                            }}
                          />
                        </div>
                        <div className="col-12" id="medicationGrd_Cntr">

                          <h5 style={{ marginBottom: 0, marginTop: 10 }}>
                            Providers Approval/Coding staff must review/code the
                            recommended services(s) and allocate cost and
                            complete the following:
                          </h5>
                          <AlgaehDataGrid
                            id="medication_grid"
                            columns={[
                              {
                                fieldName: "generic_name",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel:
                                        "Medication Name (Generic Name)"
                                    }}
                                  />
                                )
                              },
                              {
                                fieldName: "type",
                                label: (
                                  <AlgaehLabel label={{ forceLabel: "Type" }} />
                                )
                              },
                              {
                                fieldName: "quantity",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Quantity" }}
                                  />
                                )
                              }
                            ]}
                            keyId="hims_f_dcaf_medication_id"
                            dataSource={{
                              data: this.state.dcaf_medication
                            }}
                            paging={{ page: 0, rowsPerPage: 10 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.saveAndPrintDcaf.bind(this)}
                  >
                    Save & Print
                  </button>
                  {/* <button
                    type="button"
                    className="btn btn-default"
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}
