import React, { Component } from "react";
import "./udocaf.scss";
import {
  AlagehFormGroup,
  AlgaehDateHandler,
  // AlgaehDataGrid,
  AlgaehLabel,
} from "../Wrapper/algaehWrapper";
import {
  AlgaehFormGroup,
  AlgaehDataGrid,
  AlgaehSecurityComponent,
} from "algaeh-react-components";
// import _ from "lodash";
import AlgaehFileUploader from "../Wrapper/algaehFileUpload";
import EditorEvents from "./EditorEvents";
import Swal from "sweetalert2";
import RequestForCorrection from "./RequestForCorrection";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
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
      showImgArea: true,
      correctionModal: false,
    };
  }

  saveAndPrintUcaf(e) {
    EditorEvents().saveAndPrintUcaf(this, e);
  }

  // getPrimaryCardNumber() {
  //   if (
  //     this.state.dataProps.hims_f_ucaf_insurance_details !== undefined &&
  //     this.props.dataProps.hims_f_ucaf_insurance_details.length > 0
  //   ) {
  //     return this.state.primary_card_number
  //   } else {
  //     return "";
  //   }
  // }

  ChangeEventHandler(e) {
    EditorEvents().ChangeEventHandler(this, e);
  }

  radioChange(e) {
    EditorEvents().ucafradioChange(this, e);
  }

  componentDidMount() {
    if (
      this.props.dataProps.hims_f_ucaf_header !== undefined &&
      this.props.dataProps.hims_f_ucaf_header.length > 0
    ) {
      let data = this.props.dataProps.hims_f_ucaf_header[0];
      let insurance = this.props.dataProps.hims_f_ucaf_insurance_details[0];
      data.ucaf_services = this.props.dataProps.hims_f_ucaf_services;
      data.ucaf_medication = this.props.dataProps.hims_f_ucaf_medication;
      this.setState({ ...this.state, ...data, ...insurance });
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.dataProps.hims_f_ucaf_header !== undefined &&
      nextProps.dataProps.hims_f_ucaf_header.length > 0
    ) {
      let data = nextProps.dataProps.hims_f_ucaf_header[0];
      let insurance = nextProps.dataProps.hims_f_ucaf_insurance_details[0];
      data.ucaf_services = nextProps.dataProps.hims_f_ucaf_services;
      data.ucaf_medication = nextProps.dataProps.hims_f_ucaf_medication;
      this.setState({ ...this.state, ...data, ...insurance });
    }
  }
  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    if (value <= 0) {
      swalMessage({
        title: "Quantity cannot be less than or equal to Zero",
        type: "warning",
      });
    } else {
      row[name] = value;
    }
    // row[name] = value;
    // row.update();
  }

  onClickReloadData(source, e, loader) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, force load!",
    }).then((result) => {
      if (result.value) {
        const that = this;
        algaehApiCall({
          uri: "/ucaf/getPatientUCAF",
          method: "GET",
          data: {
            patient_id: Window.global["current_patient"],
            visit_id: Window.global["visit_id"],
            forceReplace: "true",
            patient_emergency_type: this.state.patient_emergency_type,
            patient_emergency_case: this.state.patient_emergency_case,
            patient_duration_of_illness: this.state.patient_duration_of_illness,
            patient_chief_comp_main_symptoms:
              this.state.patient_chief_comp_main_symptoms,
            patient_significant_signs: this.state.patient_significant_signs,
            patient_other_conditions: this.state.patient_other_conditions,
            patient_diagnosys: this.state.patient_diagnosys,

            patient_principal_code_1: this.state.patient_principal_code_1,
            patient_principal_code_2: this.state.patient_principal_code_2,
            patient_principal_code_3: this.state.patient_principal_code_3,
            patient_principal_code_4: this.state.patient_principal_code_4,

            patient_complaint_type: this.state.patient_complaint_type,
            patient_indicated_LMP: this.state.patient_indicated_LMP,
          },
          onSuccess: (response) => {
            if (response.data.success === true) {
              const data = response.data.records.hims_f_ucaf_header[0];
              const insurance =
                response.data.records.hims_f_ucaf_insurance_details[0];
              data.ucaf_services = response.data.records.hims_f_ucaf_services;
              data.ucaf_medication =
                response.data.records.hims_f_ucaf_medication;

              that.setState({
                ...data,
                ...insurance,
              });
            }
          },
        });
      } else {
        return;
      }
    });
  }
  openRequestCorrectionModal() {
    this.setState({ correctionModal: !this.state.correctionModal });
  }

  updateUcafMedicationQuantity(data) {
    algaehApiCall({
      uri: "/ucaf/updateUcafMedicationQuantity",
      method: "PUT",
      data: {
        type: data.type,
        quantity: data.quantity,
        hims_f_ucaf_header_id: data.hims_f_ucaf_header_id,
        hims_f_ucaf_medication_id: data.hims_f_ucaf_medication_id,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success",
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  render() {
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
                        <div className="col-6">
                          <label>Provider Name</label>
                          <h6>{this.state.provider_name}</h6>
                        </div>
                        <div className="col-6">
                          <label>Insurance Company Name</label>
                          <h6>{this.state.primary_insurance_company_name}</h6>
                        </div>
                        <div className="col-4">
                          <label>TPA Company Name</label>
                          <h6>
                            {this.state.primary_tpa_insurance_company_name}
                          </h6>
                        </div>
                        <div className="col-4">
                          <label>Patient File Number</label>
                          <h6>{this.state.patient_code}</h6>
                        </div>
                        <div className="col-4">
                          <label>Department</label>
                          <h6>{this.state.sub_department_name}</h6>
                        </div>
                        <div className="col-4">
                          <label>Date of Visit</label>
                          <h6>{this.state.visit_date}</h6>
                        </div>
                        <div className="col-4">
                          <label>Reference Number</label>
                          <h6>{this.state.eligible_reference_number}</h6>
                        </div>

                        <div
                          className="col-6 customRadio"
                          style={{ paddingTop: 24, borderBottom: "none" }}
                        >
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="patient_marital_status"
                              value="Single"
                              checked={
                                this.state.patient_marital_status === "Single"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Single</span>
                          </label>
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="patient_marital_status"
                              value="Married"
                              checked={
                                this.state.patient_marital_status === "Married"
                                  ? true
                                  : false
                              }
                            />
                            <span>Married</span>
                          </label>
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="patient_marital_status"
                              value="PlanType"
                              checked={
                                this.state.patient_marital_status === "PlanType"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Plan Type</span>
                          </label>
                        </div>
                        <div className="col-12 customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="new_visit_patient"
                              value="Y"
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
                              name="new_visit_patient"
                              value="N"
                              checked={
                                this.state.new_visit_patient === "N"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Follow Up</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              checked={this.state.refill}
                            />
                            <span>Refill</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              checked={this.state.walkin}
                            />
                            <span>Walk In</span>
                          </label>
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
                                    this.state.primary_card_number + "_front",
                                  fileType: "Patients",
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
                                  isImp: false,
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: this.state.patient_full_name,
                                  events: {},
                                  option: {
                                    type: "text",
                                  },
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-6 form-group" }}
                                label={{
                                  forceLabel: "ID. Card No.",
                                  isImp: false,
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: this.state.primary_card_number,
                                  events: {},
                                  option: {
                                    type: "text",
                                  },
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-4 form-group" }}
                                label={{
                                  forceLabel: "Sex",
                                  isImp: false,
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: this.state.patient_gender,
                                  events: {},
                                  option: {
                                    type: "text",
                                  },
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-4 form-group" }}
                                label={{
                                  forceLabel: "Age",
                                  isImp: false,
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: this.state.age_in_years,
                                  events: {},
                                  option: {
                                    type: "text",
                                  },
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-4 form-group" }}
                                label={{
                                  forceLabel: "Class",
                                  isImp: false,
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: this.state.class,
                                  events: {},
                                  option: {
                                    type: "text",
                                  },
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-6 form-group" }}
                                label={{
                                  forceLabel: "Policy Holder",
                                  isImp: false,
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value:
                                    this.state.insurance_holder === undefined
                                      ? this.state.insurance_holder === ""
                                        ? this.state.patient_full_name
                                        : this.state.insurance_holder
                                      : this.state.insurance_holder,
                                  events: {},
                                  option: {
                                    type: "text",
                                  },
                                }}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-6 form-group" }}
                                label={{
                                  forceLabel: "Policy No.",
                                  isImp: false,
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: this.state.primary_policy_num,
                                  events: {},
                                  option: {
                                    type: "text",
                                  },
                                }}
                              />
                              <AlgaehDateHandler
                                div={{ className: "col-6" }}
                                label={{
                                  forceLabel: "Expiry Date",
                                  isImp: false,
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                }}
                                value={this.state.primary_effective_end_date}
                                maxDate={new Date()}
                                events={{}}
                              />
                              <AlagehFormGroup
                                div={{ className: "col-6 form-group" }}
                                label={{
                                  forceLabel: "Approval",
                                  isImp: false,
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "insurance_approved",
                                  value: this.state.insurance_approved,
                                  events: {},
                                  option: {
                                    type: "text",
                                  },
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
                                this.state.case_type === "IP" ? true : false
                              }
                            />
                            <span>Inpatient</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="caseType"
                              checked={
                                this.state.case_type === "OP" ? true : false
                              }
                            />
                            <span>Outpatient</span>
                          </label>
                        </div>
                        <div className="col-8 customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_emergency_type"
                              value={this.state.patient_emergency_type}
                              checked={
                                this.state.patient_emergency_type === "Y"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Emergency Case</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_emergency_case"
                              value="L1"
                              checked={
                                this.state.patient_emergency_case === "L1"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Level 1</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_emergency_case"
                              value="L2"
                              checked={
                                this.state.patient_emergency_case === "L2"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Level 2</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_emergency_case"
                              value="L3"
                              checked={
                                this.state.patient_emergency_case === "L3"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Level 3</span>
                          </label>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "BP",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_bp_sys_dya",
                            value:
                              (this.state.patient_bp_sys
                                ? this.state.patient_bp_sys
                                : "--") +
                              "/" +
                              (this.state.patient_bp_dia
                                ? this.state.patient_bp_dia
                                : "--"),
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Pulse (bpm)",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_pulse",
                            value: this.state.patient_pulse,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Temp (C)",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_temp",
                            value: this.state.patient_temp,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Weight (kg)",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_weight",
                            value: this.state.patient_weight,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Height (cm)",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_height",
                            value: this.state.patient_height,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "R.R",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_respiratory_rate",
                            value: this.state.patient_respiratory_rate,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Duration of Illness (Days)",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_duration_of_illness",
                            value: this.state.patient_duration_of_illness,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Chief Complaints & Main Symptoms",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_chief_comp_main_symptoms",
                            value: this.state.patient_chief_comp_main_symptoms,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Significant Signs",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_significant_signs",
                            value: this.state.patient_significant_signs,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Other Conditions",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_other_conditions",
                            value: this.state.patient_other_conditions,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Diagnosis",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_diagnosys",
                            value: this.state.patient_diagnosys,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Principal Code 1",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_principal_code_1",
                            value: this.state.patient_principal_code_1,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Principal Code 2",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_principal_code_2",
                            value: this.state.patient_principal_code_2,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Principal Code 3",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_principal_code_3",
                            value: this.state.patient_principal_code_3,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Principal Code 4",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_principal_code_4",
                            value: this.state.patient_principal_code_4,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
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
                              value="CHRONIC"
                              checked={
                                this.state.patient_complaint_type === "CHRONIC"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Chronic</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              value="CONGENTIAL"
                              checked={
                                this.state.patient_complaint_type ===
                                "CONGENTIAL"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Congential</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              value="RTA"
                              checked={
                                this.state.patient_complaint_type === "RTA"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>RTA</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              value="WORKRELATED"
                              checked={
                                this.state.patient_complaint_type ===
                                "WORKRELATED"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Work Related</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              value="VACCINATION"
                              checked={
                                this.state.patient_complaint_type ===
                                "VACCINATION"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Vaccination</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              value="CHECKUP"
                              checked={
                                this.state.patient_complaint_type === "CHECKUP"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Check-Up</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              value="PSYCHIATRIC"
                              checked={
                                this.state.patient_complaint_type ===
                                "PSYCHIATRIC"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Psychiatric</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              value="INFERTILITY"
                              checked={
                                this.state.patient_complaint_type ===
                                "INFERTILITY"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Infertility</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_complaint_type"
                              value="PREGNANCY"
                              checked={
                                this.state.patient_complaint_type ===
                                "PREGNANCY"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Pregnancy</span>
                          </label>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Indicate LMP",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "patient_indicated_LMP",
                            value: this.state.patient_indicated_LMP,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            others: {
                              type: "number",
                              disabled:
                                this.state.patient_complaint_type ===
                                "PREGNANCY"
                                  ? false
                                  : true,
                            },
                          }}
                        />

                        <div className="col-6" id="serviceGrid_Cntr">
                          {" "}
                          <h5 style={{ margin: 0 }}>
                            Suggestive line(s) of management: Kindly, enumerate
                            the recommended investigation, and/or procedures.{" "}
                            <b>For outpatient approvals only:</b>
                          </h5>
                          <AlgaehDataGrid
                            id="service_grid"
                            columns={[
                              {
                                fieldName: "service_code",
                                label: (
                                  <AlgaehLabel label={{ forceLabel: "Code" }} />
                                ),
                              },
                              {
                                fieldName: "service_name",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Description/Service",
                                    }}
                                  />
                                ),
                              },
                              {
                                fieldName: "service_type",
                                label: (
                                  <AlgaehLabel label={{ forceLabel: "Type" }} />
                                ),
                              },
                              {
                                fieldName: "service_quantity",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Quantity" }}
                                  />
                                ),
                              },
                              {
                                fieldName: "service_net_amout",
                                label: (
                                  <AlgaehLabel label={{ forceLabel: "Cost" }} />
                                ),
                              },
                            ]}
                            // keyId="hims_f_ucaf_header_id"
                            data={
                              this.state.ucaf_services
                                ? this.state.ucaf_services
                                : []
                            }
                            pagination={true}
                            // paging={{ page: 0, rowsPerPage: 10 }}
                          />
                        </div>

                        <div className="col-6" id="medicationGrd_Cntr">
                          {" "}
                          <h5 style={{ margin: 0 }}>
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
                                        "Medication Name (Generic Name)",
                                    }}
                                  />
                                ),
                                editorTemplate: (row) => {
                                  return row.generic_name;
                                },
                              },
                              {
                                fieldName: "type",
                                label: (
                                  <AlgaehLabel label={{ forceLabel: "Type" }} />
                                ),
                                editorTemplate: (row) => {
                                  return row.type;
                                },
                                others: {
                                  maxWidth: 150,
                                },
                              },
                              {
                                fieldName: "quantity",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Quantity" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.quantity ? row.quantity : 1;
                                },
                                editorTemplate: (row) => {
                                  return (
                                    <AlgaehFormGroup
                                      div={{}}
                                      textBox={{
                                        updateInternally: true,
                                        number: {
                                          allowNegative: false,
                                          thousandSeparator: ",",
                                        },
                                        onChange: this.changeGridEditors.bind(
                                          this,
                                          row
                                        ),
                                        value: row.quantity ? row.quantity : 1,
                                        className: "txt-fld",
                                        name: "quantity",

                                        others: {
                                          placeholder: "",
                                        },
                                      }}
                                      // events={{

                                      // }}
                                    />
                                  );
                                },
                                others: {
                                  maxWidth: 100,
                                },
                              },
                            ]}
                            loading={false}
                            isEditable={"editOnly"}
                            events={{
                              // onDone: () => {},
                              onSave:
                                this.updateUcafMedicationQuantity.bind(this),
                            }}
                            // height="34vh"
                            pagination={true}
                            data={
                              this.state.ucaf_medication
                                ? this.state.ucaf_medication
                                : []
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.state.correctionModal ? (
            <RequestForCorrection
              visible={this.state.correctionModal}
              onClose={() => this.openRequestCorrectionModal()}
              rowData={this.props.rowData}
              dataProps={this.props.dataProps}
              type={"ucaf"}
              title={`Ucaf Correction ${this.props.rowData?.invoice_number}`}
            />
          ) : null}
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <AlgaehSecurityComponent componentCode="ENB_BTN_UCAF">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.saveAndPrintUcaf.bind(this)}
                    >
                      {this.props.fromCorrection ? "save" : `Save & Print`}
                    </button>
                  </AlgaehSecurityComponent>
                  <AlgaehSecurityComponent componentCode="RLD_DAT_UCAF">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={this.onClickReloadData.bind(this, this)}
                    >
                      {/* {this.state.loading ? (
                      <span className="showBtnLoader">
                        <i className="fas fa-spinner fa-spin" />
                      </span>
                    ) : null} */}
                      Reload Data
                    </button>
                    {/* <AlgaehSecurityComponent componentCode="ENB_BTN_REQ_INSR_CRTN"> */}
                  </AlgaehSecurityComponent>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.openRequestCorrectionModal.bind(this, this)}
                  >
                    Request For Insurace Correction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    );
  }
}
