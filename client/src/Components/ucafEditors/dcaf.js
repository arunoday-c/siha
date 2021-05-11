import React, { Component } from "react";
import "./udocaf.scss";
import {
  AlagehFormGroup,
  AlgaehDateHandler,
  // AlgaehDataGrid,
  AlgaehLabel,
} from "../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
// import ButtonType from "../Wrapper/algaehButton";
import Swal from "sweetalert2";
import moment from "moment";
import AlgaehFileUploader from "../Wrapper/algaehFileUpload";
import EditorEvents from "./EditorEvents";
import {
  AlgaehFormGroup,
  AlgaehSecurityComponent,
  AlgaehDataGrid,
} from "algaeh-react-components";
import RequestForCorrection from "./RequestForCorrection";

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
      showImgArea: true,
      loading: false,
      correctionModal: false,
    };
  }

  saveAndPrintDcaf(e) {
    this.setState(
      {
        loading: true,
      },
      () => {
        EditorEvents().saveAndPrintDcaf(this, e);
      }
    );
  }

  ChangeEventHandler(e) {
    EditorEvents().ChangeEventHandler(this, e);
  }

  radioChange(e) {
    EditorEvents().dcafradioChange(this, e);
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
          uri: "/dcaf/getPatientDCAF",
          method: "GET",
          data: {
            patient_id: Window.global["current_patient"],
            visit_id: Window.global["visit_id"],
            forceReplace: "true",
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
            regular_dental_trt: this.state.regular_dental_trt,
            dental_cleaning: this.state.dental_cleaning,
            patient_rta: this.state.patient_rta,
            patient_work_related: this.state.patient_work_related,
            how: this.state.how,
            when: this.state.when,
            where: this.state.where,
          },
          onSuccess: (response) => {
            if (response.data.success === true) {
              // if (typeof this.props.onReloadClose === "function") {

              //   this.props.onReloadClose();
              // }

              const data = response.data.records.hims_f_dcaf_header[0];
              const insurance =
                response.data.records.hims_f_dcaf_insurance_details[0];
              data.dcaf_services = response.data.records.hims_f_dcaf_services;
              data.dcaf_medication =
                response.data.records.hims_f_dcaf_medication;

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

  numberOfDays(interval, duration, onset_date) {
    if (interval === "D") {
      return duration;
    } else {
      let fromdate = moment(onset_date);
      if (interval === "M") {
        let todate = moment(onset_date).set("month", duration);
        return todate.diff(fromdate, "days");
      } else if (interval === "W") {
        let todate = moment(onset_date).set("week", duration);
        return todate.diff(fromdate, "days");
      } else if (interval === "Y") {
        let todate = moment(onset_date).set("year", duration);
        return todate.diff(fromdate, "days");
      } else {
        return duration;
      }
    }
  }

  componentDidMount() {
    if (
      this.props.dataProps.hims_f_dcaf_header !== undefined &&
      this.props.dataProps.hims_f_dcaf_header.length > 0
    ) {
      let data = this.props.dataProps.hims_f_dcaf_header[0];
      let insurance = this.props.dataProps.hims_f_dcaf_insurance_details[0];

      data.dcaf_services = this.props.dataProps.hims_f_dcaf_services;
      data.dcaf_medication = this.props.dataProps.hims_f_dcaf_medication;

      this.setState({
        ...this.state,
        ...data,
        ...insurance,
      });
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.dataProps.hims_f_dcaf_header !== undefined &&
      nextProps.dataProps.hims_f_dcaf_header.length > 0
    ) {
      let data = nextProps.dataProps.hims_f_dcaf_header[0];
      let insurance = nextProps.dataProps.hims_f_dcaf_insurance_details[0];

      data.dcaf_services = nextProps.dataProps.hims_f_dcaf_services;
      data.dcaf_medication = nextProps.dataProps.hims_f_dcaf_medication;

      this.setState({
        ...this.state,
        ...data,
        ...insurance,
      });
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
      // row.update();
    }
    // row[name] = value;
    // row.update();
  }
  updateDcafMedicationQuantity(data) {
    algaehApiCall({
      uri: "/dcaf/updateDcafMedicationQuantity",
      method: "PUT",
      data: {
        type: data.type,
        quantity: data.quantity,
        hims_f_dcaf_header_id: data.hims_f_dcaf_header_id,
        hims_f_dcaf_medication_id: data.hims_f_dcaf_medication_id,
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
  openRequestCorrectionModal() {
    this.setState({ correctionModal: !this.state.correctionModal });
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
                        <AlagehFormGroup
                          div={{ className: "col-12  form-group" }}
                          label={{
                            forceLabel: "Provider Name",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: this.state.provider_name,
                            events: {},
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6  form-group" }}
                          label={{
                            forceLabel: "Insurance Company Name",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: this.state.primary_insurance_company_name,
                            events: {},
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "TPA Company Name",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value:
                              this.state.primary_tpa_insurance_company_name,
                            events: {},
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Patient File Number",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: this.state.patient_code,
                            events: {},
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlgaehDateHandler
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Date of Visit",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                          }}
                          value={this.state.visit_date}
                          maxDate={new Date()}
                          events={{}}
                        />
                        {/* <div className="col">
                          <label>Reference Number</label>
                          <h6>{this.state.eligible_reference_number}</h6>
                        </div> */}
                        {/* <div
                          className="col customRadio"
                          style={{ paddingTop: 25 }}
                        >
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="maritalType"
                              checked={
                                this.state.patient_marital_status === "PlanType"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Plan Type</span>
                          </label>
                        </div> */}
                        <div
                          className="col customCheckbox"
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
                  <div className="col-6">
                    <div className="attendingPhysician">
                      <div className="row">
                        <div className="col-12">
                          <h5>To be completed by the Dentist:</h5>
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
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
                          div={{ className: "col-8 form-group" }}
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
                          div={{ className: "col-6 form-group" }}
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
                          div={{ className: "col-6 form-group" }}
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
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Diagnosis(ICD10)",
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
                        {/* <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Primary",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "primary",
                            value: this.state.primary,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        /> */}
                        {/* <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Secondary",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "secondary",
                            value: this.state.secondary,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        /> */}

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
                  <div className="col-6">
                    <div className="attendingPhysician">
                      <div className="row">
                        {" "}
                        <div className="col-12">
                          <h5>Please tick (&#10004;) where appropriate</h5>
                        </div>
                        <div className="col-12 customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="regular_dental_trt"
                              value="Y"
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
                              checked={this.state.RTA === "Y" ? true : false}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Trauma Treatment Specify: RTA</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="work_related"
                              checked={
                                this.state.work_related === "Y" ? true : false
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
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "others",
                            value: this.state.others,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "How",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "how",
                            value: this.state.how,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "When",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "when",
                            value: this.state.when,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this),
                            },
                            option: {
                              type: "text",
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Where",
                            isImp: false,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "where",
                            value: this.state.where,
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
                        <div className="col-6" id="serviceGrid_Cntr">
                          <h5 style={{ marginBottom: 0, marginTop: 10 }}>
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
                                      forceLabel: "Dental Service",
                                    }}
                                  />
                                ),
                              },

                              {
                                fieldName: "teeth_number",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Tooth No." }}
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
                            keyId="hims_f_dcaf_header_id"
                            // loading={false}
                            // isEditable={"editOnly"}
                            // events={{
                            //   // onDone: () => {},
                            //   onSave: updateProcessList,

                            // }}
                            // height="34vh"
                            pagination={true}
                            data={
                              this.state.dcaf_services
                                ? this.state.dcaf_services
                                : []
                            }
                          />
                        </div>
                        <div className="col-6" id="medicationGrd_Cntr">
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

                                      //
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
                                this.updateDcafMedicationQuantity.bind(this),
                            }}
                            // height="34vh"
                            pagination={true}
                            data={
                              this.state.dcaf_medication
                                ? this.state.dcaf_medication
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
              type={"dcaf"}
              title={`Dcaf Correction ${this.props.rowData?.invoice_number}`}
            />
          ) : null}
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <AlgaehSecurityComponent componentCode="ENB_BTN_DCAF">
                    <button
                      type="button"
                      className={
                        "btn btn-primary " +
                        (this.state.loading ? " btn-loader" : "")
                      }
                      onClick={this.saveAndPrintDcaf.bind(this)}
                    >
                      {this.state.loading ? (
                        <span className="showBtnLoader">
                          <i className="fas fa-spinner fa-spin" />
                        </span>
                      ) : null}
                      Save & Print
                    </button>
                  </AlgaehSecurityComponent>
                  <AlgaehSecurityComponent componentCode="RLD_DAT_DCAF">
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
