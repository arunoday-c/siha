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
    debugger;
    const that = this;
    const _hims_f_dcaf_header = this.props.dataProps.hims_f_dcaf_header[0];
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
          reportName: "dcaf",
          reportParams: [
            {
              name: "hims_d_patient_id",
              value: _hims_f_dcaf_header.patient_id
            },
            { name: "visit_id", value: _hims_f_dcaf_header.visit_id },
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
          myWindow.document.title = "Algaeh DCAF 2.0";
        };

        reader.readAsDataURL(res.data);
      }
    });
  }

  render() {
    debugger;
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
                            value: _hims_f_dcaf_header.provider_name,
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
                            value:
                              _isPrimary === "primary"
                                ? _insurnce.primary_insurance_company_name
                                : _insurnce.secondary_insurance_company_name,
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
                            value:
                              _isPrimary === "primary"
                                ? _insurnce.primary_tpa_insurance_company_name
                                : _insurnce.secondary_tpa_insurance_company_name,
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
                            value: _hims_f_dcaf_header.patient_code,
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
                          value={_hims_f_dcaf_header.visit_date}
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
                                _hims_f_dcaf_header.patient_marital_status ===
                                "PlanType"
                                  ? true
                                  : false
                              }
                            />
                            <span>Plan Type</span>
                          </label>{" "}
                        </div>{" "}
                        <div
                          className="col-6 customCheckbox"
                          style={{ paddingTop: 25 }}
                        >
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              checked={
                                _hims_f_dcaf_header.new_visit_patient === "Y"
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
                                _hims_f_dcaf_header.new_visit_patient === "N"
                                  ? true
                                  : false
                              }
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
                                  value: _hims_f_dcaf_header.patient_full_name,
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
                                  value:
                                    _isPrimary === "primary"
                                      ? _insurnce.primary_card_number
                                      : _insurnce.secondary_card_number,
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
                                  value: _hims_f_dcaf_header.patient_gender,
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
                                  value: _hims_f_dcaf_header.age_in_years,
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
                                    _hims_f_dcaf_header.insurance_holder ===
                                    undefined
                                      ? this.state.insurance_holder === ""
                                        ? _hims_f_dcaf_header.patient_full_name
                                        : this.state.insurance_holder
                                      : _hims_f_dcaf_header.insurance_holder,
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
                                  value:
                                    _isPrimary === "primary"
                                      ? _insurnce.primary_policy_num
                                      : _insurnce.secondary_policy_num,
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
                                value={
                                  _isPrimary === "primary"
                                    ? _insurnce.primary_effective_end_date
                                    : _insurnce.secondary_effective_end_date
                                }
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
                              _hims_f_dcaf_header.patient_duration_of_illness,
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
                              _hims_f_dcaf_header.patient_chief_comp_main_symptoms,
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
                              _hims_f_dcaf_header.patient_significant_signs,
                            events: {},
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
                            value: _hims_f_dcaf_header.patient_diagnosys,
                            events: {},
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
                            name: "patient_principal_code_1",
                            value: _hims_f_dcaf_header.patient_principal_code_1,
                            events: {},
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
                            name: "patient_principal_code_2",
                            value: _hims_f_dcaf_header.patient_principal_code_2,
                            events: {},
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
                            value: _hims_f_dcaf_header.patient_other_conditions,
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

                        <div className="col-12 customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_chronic"
                              checked={
                                _hims_f_dcaf_header.patient_chronic === "Y"
                                  ? true
                                  : false
                              }
                            />
                            <span>Regular Dental Treatment</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_congenetal"
                              checked={
                                _hims_f_dcaf_header.patient_congenetal === "Y"
                                  ? true
                                  : false
                              }
                            />
                            <span>Dental Cleaning</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_rta"
                              checked={
                                _hims_f_dcaf_header.patient_rta === "Y"
                                  ? true
                                  : false
                              }
                            />
                            <span>Trauma Treatment Specify: RTA</span>
                          </label>
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="patient_work_related"
                              checked={
                                _hims_f_dcaf_header.patient_work_related === "Y"
                                  ? true
                                  : false
                              }
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
                            name: "",
                            value: "",
                            events: {},
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
                            name: "",
                            value: "",
                            events: {},
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
                            name: "",
                            value: "",
                            events: {},
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
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <div className="col-12" id="serviceGrid_Cntr">
                          <h5 style={{ marginBottom: 0, marginTop: 10 }}>
                            Suggestive line(s) of management: Kindly, enumerate
                            the recommended investigation, and/or procedures{" "}
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
                              data: this.props.dataProps.hims_f_dcaf_services
                            }}
                            paging={{
                              page: 0,
                              rowsPerPage: 10,
                              showPagination: true
                            }}
                          />
                        </div>
                        <div className="col-12" id="medicationGrd_Cntr">
                          {" "}
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
                              data: this.props.dataProps.hims_f_dcaf_medication
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
