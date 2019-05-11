import React, { Component } from "react";
import "./udocaf.css";
import {
  AlagehFormGroup,
  AlgaehDateHandler,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../utils/algaehApiCall";
import _ from "lodash";
export default class OcafEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refill: false,
      walkin: false,
      referral: false,
      class: "",
      insurance_holder: "",
      insurance_approved: "",
      ucaf_data: undefined
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
          reportName: "ocaf",
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
                            value: _hims_f_ucaf_header.provider_name,
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
                          div={{ className: "col-4 form-group" }}
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
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Patient File Number",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: _hims_f_ucaf_header.patient_code,
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
                            value: _hims_f_ucaf_header.sub_department_name,
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
                          value={_hims_f_ucaf_header.visit_date}
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
                                _hims_f_ucaf_header.patient_marital_status ===
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
                                _hims_f_ucaf_header.patient_marital_status ===
                                "Married"
                                  ? true
                                  : false
                              }
                            />
                            <span>Married</span>
                          </label>
                        </div>
                        <div className="col-12 customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              checked={
                                _hims_f_ucaf_header.new_visit_patient === "Y"
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
                                _hims_f_ucaf_header.new_visit_patient === "N"
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
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Insured Name",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: _hims_f_ucaf_header.patient_full_name,
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
                            value: _hims_f_ucaf_header.patient_gender,
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
                            value: _hims_f_ucaf_header.age_in_years,
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
                              _hims_f_ucaf_header.insurance_holder === undefined
                                ? this.state.insurance_holder === ""
                                  ? _hims_f_ucaf_header.patient_full_name
                                  : this.state.insurance_holder
                                : _hims_f_ucaf_header.insurance_holder,
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
                          label={{ forceLabel: "Expiry Date", isImp: false }}
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
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="attendingPhysician">
                      <div className="row">
                        <div className="col-6 table-responsive">
                          <table className="table table-bordered table-sm">
                            <thead>
                              <tr>
                                <th />
                                <th colSpan="5">Right Eye</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td />
                                <td>Sphere</td>
                                <td>Cylinder</td>
                                <td>Axis</td>
                                <td>Prism</td>
                                <td>V/A</td>
                              </tr>
                              <tr>
                                <td>Distance</td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                              </tr>
                              <tr>
                                <td>Near</td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col-6 table-responsive">
                          <table className="table table-bordered table-sm">
                            <thead>
                              <tr>
                                <th colSpan="5">Left Eye</th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Sphere</td>
                                <td>Cylinder</td>
                                <td>Axis</td>
                                <td>Prism</td>
                                <td>V/A</td>
                                <td>PD</td>
                              </tr>
                              <tr>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  {" "}
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                                <td>
                                  <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      name: "",
                                      className: "select-fld",
                                      dataSource: {},
                                      others: {}
                                    }}
                                  />
                                </td>

                                <td>
                                  {" "}
                                  <AlagehFormGroup
                                    div={{ className: "" }}
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
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Bifocal",
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
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Add",
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
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Vertex",
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
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Add",
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
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Bifocal",
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
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Add",
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
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <div className="attendingPhysician">
                      <div className="row">
                        <div className="col-12 customRadio">
                          <h5>Regular Lenses Type:</h5>
                          <label className="radio inline">
                            <input type="radio" name="lenseType" />
                            <span>Glass</span>
                          </label>
                          <label className="radio inline">
                            <input type="radio" name="lenseType" />
                            <span>Plastic</span>
                          </label>
                          <label className="radio inline">
                            <input type="radio" name="lenseType" />
                            <span>None</span>
                          </label>
                        </div>
                        <div className="col-4 customRadio">
                          <h5>Lenses Specification:</h5>
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Multi-coated</span>
                          </label>
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Varliux</span>
                          </label>
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Light</span>
                          </label>{" "}
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Aspheric</span>
                          </label>{" "}
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Bifocal</span>
                          </label>
                        </div>
                        <div className="col-4 customRadio">
                          <h5 />
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Medium</span>
                          </label>
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Lenticular</span>
                          </label>
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Single Vision</span>
                          </label>{" "}
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Dark</span>
                          </label>{" "}
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Safety Thickness</span>
                          </label>
                        </div>{" "}
                        <div className="col-4 customRadio">
                          <h5 />
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Anti-Reflection Coating</span>
                          </label>
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Photosensitive</span>
                          </label>
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>High Index</span>
                          </label>{" "}
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Colored</span>
                          </label>{" "}
                          <label className="radio block">
                            <input type="radio" name="lenseSpec" />
                            <span>Anti-Scratch</span>
                          </label>
                        </div>
                        <div className="col-6 customRadio">
                          <h5>Contact Lenses Type:</h5>
                          <label className="radio inline">
                            <input type="radio" name="ContactLenseType" />
                            <span>Permanent</span>
                          </label>
                          <label className="radio inline">
                            <input type="radio" name="ContactLenseType" />
                            <span>Disposable</span>
                          </label>
                        </div>
                        <div className="col-6 customRadio">
                          <h5>Frames:</h5>
                          <label className="radio inline">
                            <input type="radio" name="frames" />
                            <span>Yes</span>
                          </label>
                          <label className="radio inline">
                            <input type="radio" name="frames" />
                            <span>No</span>
                          </label>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Please Specify No of Pairs",
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
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Estimated Cost",
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
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Lenses",
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
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Frames",
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
