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
import AlgaehFileUploader from "../Wrapper/algaehFileUpload";
export default class UcafEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refill: false,
      walkin: false,
      referral: false,
      class: "",
      insurance_holder: "",
      insurance_approved: "",
      ucaf_data: undefined,
      showImgArea: true
    };
  }

  saveAndPrintUcaf(e) {
    const that = this;
    const _hims_f_ucaf_header = this.props.dataProps.hims_f_ucaf_header[0];
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob"
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "ucaf",
          reportParams: [
            {
              name: "hims_d_patient_id",
              value: _hims_f_ucaf_header.patient_id
            },
            { name: "visit_id", value: _hims_f_ucaf_header.visit_id },
            { name: "visit_date", value: null }
          ],
          outputFileType: "PDF" //"EXCEL", //"PDF",
        }
      },
      onSuccess: res => {
        let reader = new FileReader();
        reader.onloadend = () => {
          let myWindow = window.open(
            "{{ product.metafields.google.custom_label_0 }}",
            "_blank"
          );
          myWindow.document.write(
            "<embed src= '" + reader.result + "' width='100%' height='100%' />"
          );
          myWindow.document.title = "Algaeh UCAF 2.0";
        };

        reader.readAsDataURL(res.data);
      }
    });
  }
  getPrimaryCardNumber() {
    if (
      this.props.dataProps.hims_f_ucaf_insurance_details !== undefined &&
      this.props.dataProps.hims_f_ucaf_insurance_details.length > 0
    ) {
      return this.props.dataProps.hims_f_ucaf_insurance_details[0][
        "primary_card_number"
      ];
    } else {
      return "";
    }
  }

  componentDidMount(){
    debugger

    if(this.props.dataProps.hims_f_ucaf_header !== undefined &&
      this.props.dataProps.hims_f_ucaf_header.length > 0){
        debugger;
        let data = this.props.dataProps.hims_f_ucaf_header[0];
        let insurance = this.props.dataProps.hims_f_ucaf_insurance_details[0]

        data.ucaf_services = this.props.dataProps.hims_f_ucaf_services
        data.ucaf_medication = this.props.dataProps.hims_f_ucaf_medication        
        this.setState({...this.state, ...data, ...insurance})
    }
  }

  render() {
    const _isPrimary = "primary";
    const _hims_f_ucaf_header = this.props.dataProps.hims_f_ucaf_header[0];
    const _insurnce = _.find(
      this.props.dataProps.hims_f_ucaf_insurance_details,
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
                          div={{ className: "col-6   form-group" }}
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
                          div={{ className: "col-6   form-group" }}
                          label={{
                            forceLabel: "Insurance Company Name",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: this.state.primary_insurance_company_name,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "TPA Company Name",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: this.state.primary_tpa_insurance_company_name,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
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
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Department",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: this.state.sub_department_name,
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
                          className="col-6 customRadio"
                          style={{ paddingTop: 24, borderBottom: "none" }}
                        >
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="maritalType"
                              checked={
                                this.state.patient_marital_status ===
                                "Single"
                                  ? true
                                  : false
                              }
                            />
                            <span>Single</span>
                          </label>
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="maritalType"
                              checked={
                                this.state.patient_marital_status ===
                                "Married"
                                  ? true
                                  : false
                              }
                            />
                            <span>Married</span>
                          </label>
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
                            />
                            <span>Plan Type</span>
                          </label>
                        </div>
                        <div className="col-12 customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              checked={
                                this.state.new_visit_patient === "Y"
                                  ? true
                                  : false
                              }
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
                            />
                            <span>Follow Up</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              checked={this.state.refill}
                            />
                            <span>Refill</span>
                          </label>{" "}
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              checked={this.state.walkin}
                            />
                            <span>Walk In</span>
                          </label>{" "}
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              checked={this.state.referral}
                            />
                            <span>Referral</span>
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
                            <div className="row popupIDImg">
                              <AlgaehFileUploader
                                noImage="insurance-card-front"
                                name="patInsuranceFrontImg"
                                accept="image/*"
                                textAltMessage="Insurance Card Front Side"
                                showActions={false}
                                serviceParameters={{
                                  uniqueID:
                                    this.getPrimaryCardNumber() + "_front",
                                  fileType: "Patients"
                                }}
                              />
                            </div>
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
                                  value: this.state.primary_card_number,
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
                              />{" "}
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
                              />{" "}
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
                              />{" "}
                              <AlagehFormGroup
                                div={{ className: "col-6 form-group" }}
                                label={{
                                  forceLabel: "Policy No.",
                                  isImp: false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: this.state.primary_policy_num,
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
                          <h5>To be completed by the Attending Physician:</h5>
                        </div>
                        <div className="col-4 customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="caseType"
                              checked={
                                this.state.case_type === "IP"
                                  ? true
                                  : false
                              }
                            />
                            <span>Inpatient</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="caseType"
                              checked={
                                this.state.case_type === "OP"
                                  ? true
                                  : false
                              }
                            />
                            <span>Outpatient</span>
                          </label>
                        </div>
                        <div className="col-8 customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="empergency_case"
                              checked={
                                this.state.patient_emergency_case !==
                                null
                                  ? true
                                  : false
                              }
                            />
                            <span>Emergency Case</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="empergency_l1"
                              checked={
                                this.state.patient_emergency_case ===
                                "L1"
                                  ? true
                                  : false
                              }
                            />
                            <span>Level 1</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="empergency_l2"
                              checked={
                                this.state.patient_emergency_case ===
                                "L2"
                                  ? true
                                  : false
                              }
                            />
                            <span>Level 2</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="empergency_l3"
                              checked={
                                this.state.patient_emergency_case ===
                                "L2"
                                  ? true
                                  : false
                              }
                            />
                            <span>Level 3</span>
                          </label>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "BP",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_bp_sys_dya",
                            value:
                              this.state.patient_bp_sys +
                              "/" +
                              this.state.patient_bp_dia,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Pulse (bpm)",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_pulse",
                            value: this.state.patient_pulse,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Temp (C)",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_temp",
                            value: this.state.patient_temp,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Weight (kg)",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_weight",
                            value: this.state.patient_weight,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Height (cm)",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_height",
                            value: this.state.patient_height,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "R.R",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_respiratory_rate",
                            value: this.state.patient_respiratory_rate,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
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
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Chief Complaints and Main Symptoms",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_chief_comp_main_symptoms",
                            value:
                              this.state.patient_chief_comp_main_symptoms,
                            events: {},
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
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Other Conditions",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_other_conditions",
                            value: this.state.patient_other_conditions,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Diagnosis",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_diagnosys",
                            value: this.state.patient_diagnosys,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Principal Code 1",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_principal_code_1",
                            value: this.state.patient_principal_code_1,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Principal Code 2",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_principal_code_2",
                            value: this.state.patient_principal_code_2,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Principal Code 3",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_principal_code_3",
                            value: this.state.patient_principal_code_3,
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Principal Code 4",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_principal_code_4",
                            value: this.state.patient_principal_code_4,
                            events: {},
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

                        <div className="col-9 customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              checked={
                                this.state.patient_complaint_type === "CHRONIC"
                                  ? true
                                  : false
                              }
                            />
                            <span>Chronic</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              checked={
                                _hims_f_ucaf_header.patient_complaint_type === "CONGENTIAL"
                                  ? true
                                  : false
                              }
                            />
                            <span>Congential</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              checked={
                                _hims_f_ucaf_header.patient_complaint_type === "RTA"
                                  ? true
                                  : false
                              }
                            />
                            <span>RTA</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              checked={
                                _hims_f_ucaf_header.patient_complaint_type === "WORKRELATED"
                                  ? true
                                  : false
                              }
                            />
                            <span>Work Related</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              checked={
                                _hims_f_ucaf_header.patient_complaint_type === "VACCINATION"
                                  ? true
                                  : false
                              }
                            />
                            <span>Vaccination</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              checked={
                                _hims_f_ucaf_header.patient_complaint_type === "CHECKUP"
                                  ? true
                                  : false
                              }
                            />
                            <span>Check-Up</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              checked={
                                _hims_f_ucaf_header.patient_complaint_type === "PSYCHIATRIC"
                                  ? true
                                  : false
                              }
                            />
                            <span>Psychiatric</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              checked={
                                _hims_f_ucaf_header.patient_complaint_type === "INFERTILITY"
                                  ? true
                                  : false
                              }
                            />
                            <span>Infertility</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              checked={
                                _hims_f_ucaf_header.patient_complaint_type === "PREGNANCY"
                                  ? true
                                  : false
                              }
                            />
                            <span>Pregnancy</span>
                          </label>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Indicate LMP",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_indicated_LMP",
                            value: this.state.patient_indicated_LMP,
                            events: {},
                            option: {
                              type: "text",
                              disabled: true
                            }
                          }}
                        />

                        <div className="col-12">
                          <h5>
                            Suggestive line(s) of management: Kindly, enumerate
                            the recommended investigation, and/or procedures{" "}
                            <b>For outpatient approvals only:</b>
                          </h5>
                        </div>

                        <div className="col-12" id="serviceGrid_Cntr">
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
                                      forceLabel: "Description/Service"
                                    }}
                                  />
                                )
                              },
                              {
                                fieldName: "service_type",
                                label: (
                                  <AlgaehLabel label={{ forceLabel: "Type" }} />
                                )
                              },
                              {
                                fieldName: "service_quantity",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Quantity" }}
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
                            keyId="hims_f_ucaf_header_id"
                            dataSource={{
                              data: this.state.ucaf_services
                            }}
                            paging={{ page: 0, rowsPerPage: 10 }}
                          />
                        </div>

                        <div className="col-12">
                          <h5>
                            Providers Approval/Coding staff must review/code the
                            recommended services(s) and allocate cost and
                            complete the following:
                          </h5>
                        </div>

                        <div className="col-12" id="medicationGrd_Cntr">
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
                            keyId="hims_f_ucaf_medication_id"
                            dataSource={{
                              data: this.props.dataProps.ucaf_medication
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
                    onClick={this.saveAndPrintUcaf.bind(this)}
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
