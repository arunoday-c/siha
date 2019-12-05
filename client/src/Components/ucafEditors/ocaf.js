import React, { Component } from "react";
import "./udocaf.scss";
import { AlagehFormGroup, AlgaehDateHandler } from "../Wrapper/algaehWrapper";
import _ from "lodash";
import AlgaehFileUploader from "../Wrapper/algaehFileUpload";
import EditorEvents from "./EditorEvents";

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
      ocaf_data: undefined,

      patient_marital_status: null,
      dv_right_sch: null,
      dv_right_cyl: null,
      dv_right_axis: null,
      dv_right_vision: null,
      nv_right_sch: null,
      nv_right_cyl: null,
      nv_right_axis: null,
      nv_right_vision: null,
      dv_left_sch: null,
      dv_left_cyl: null,
      dv_left_axis: null,
      dv_left_vision: null,
      nv_left_sch: null,
      nv_left_cyl: null,
      nv_left_axis: null,
      nv_left_vision: null,

      frames: null,
      no_pairs: null,
      estimated_cost: 0,
      lense_cost: 0,
      frame_cost: 0,

      multi_coated: false,
      varilux: false,
      light: false,
      aspheric: false,
      bifocal: false,
      medium: false,
      lenticular: false,
      single_vision: false,
      dark: false,
      safety_thickness: false,
      anti_reflecting_coating: false,
      photosensitive: false,
      high_index: false,
      colored: false,
      anti_scratch: false,
      contact_lense_type: null,
      resgular_lense_type: "N"
    };
  }

  componentDidMount() {
    // this.props.dataProps.hims_f_ocaf_header
    // this.props.dataProps.hims_f_ocaf_insurance_details
    if (
      this.props.dataProps.hims_f_ocaf_header !== undefined &&
      this.props.dataProps.hims_f_ocaf_header.length > 0
    ) {
      let data = this.props.dataProps.hims_f_ocaf_header[0];
      let insurance = this.props.dataProps.hims_f_ocaf_insurance_details[0];

      // data
      data.multi_coated = data.multi_coated === "Y" ? true : false;
      data.varilux = data.varilux === "Y" ? true : false;
      data.light = data.light === "Y" ? true : false;
      data.aspheric = data.aspheric === "Y" ? true : false;
      data.bifocal = data.bifocal === "Y" ? true : false;
      data.medium = data.medium === "Y" ? true : false;
      data.lenticular = data.lenticular === "Y" ? true : false;
      data.single_vision = data.single_vision === "Y" ? true : false;
      data.dark = data.dark === "Y" ? true : false;
      data.safety_thickness = data.safety_thickness === "Y" ? true : false;
      data.anti_reflecting_coating =
        data.anti_reflecting_coating === "Y" ? true : false;
      data.photosensitive = data.photosensitive === "Y" ? true : false;
      data.high_index = data.high_index === "Y" ? true : false;
      data.colored = data.colored === "Y" ? true : false;
      data.anti_scratch = data.anti_scratch === "Y" ? true : false;
      this.setState({ ...this.state, ...data, ...insurance });
    }
  }

  ChangeEventHandler(e) {
    EditorEvents().ChangeEventHandler(this, e);
  }
  radioChange(e) {
    EditorEvents().radioChange(this, e);
  }
  saveAndPrintOcaf() {
    EditorEvents().saveAndPrintOcaf(this);
  }


  render() {
    const _isPrimary = "primary";
    // const _hims_f_ocaf_header = this.props.dataProps.hims_f_ocaf_header[0];
    // const _insurnce = _.find(
    //   this.props.dataProps.hims_f_ocaf_insurance_details,
    //   f =>
    //     f[
    //       _isPrimary === "primary"
    //         ? "primary_insurance_company_name"
    //         : "secondary_insurance_company_name"
    //     ] !== undefined
    // );

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

                        <div className="col-6">
                          <label>TPA Company Name</label>
                          <h6>
                            {this.state.primary_tpa_insurance_company_name}
                          </h6>
                        </div>

                        <div className="col-6">
                          <label>Patient File Number</label>
                          <h6>{this.state.patient_code}</h6>
                        </div>

                        <div className="col-6">
                          <label>Department</label>
                          <h6>{this.state.sub_department_name}</h6>
                        </div>

                        <div className="col-6">
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
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Married</span>
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
                                    this.state.insurance_holder === undefined
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
                        <div
                          className="col-6 table-responsive"
                          style={{ padding: 0 }}
                        >
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
                                  <h6>{this.state.dv_right_sch}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "dv_right_sch",
                                      className: "select-fld",
                                      value:this.state.dv_right_sch,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.AUTO_REF_SCH
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>
                                <td>
                                  <h6>{this.state.dv_right_cyl}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "dv_right_cyl",
                                      className: "select-fld",
                                      value:this.state.dv_right_cyl,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.AUTO_REF_SCH
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>

                                <td>
                                  <h6>{this.state.dv_right_axis}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "dv_right_axis",
                                      className: "select-fld",
                                      value: this.state.dv_right_axis,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.AXIS_TYPE
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>

                                <td>
                                  <h6>{this.state.dv_right_prism}</h6>
                                  {/* <AlagehFormGroup
                                    div={{ className: "" }}
                                    textBox={{
                                      className: "txt-fld",
                                      name: "dv_right_prism",
                                      value: this.state.dv_right_prism,
                                      events: {},
                                      option: {
                                        type: "text"
                                      }
                                    }}
                                  /> */}
                                </td>

                                <td>
                                  <h6>{this.state.dv_right_vision}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "dv_right_vision",
                                      className: "select-fld",
                                      value:this.state.dv_right_vision,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.DV_VISION_TYPE
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>
                              </tr>
                              <tr>
                                <td>Near</td>
                                <td>
                                  <h6>{this.state.nv_right_sch}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "nv_right_sch",
                                      className: "select-fld",
                                      value:this.state.nv_right_sch,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.AUTO_REF_SCH
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>
                                <td>
                                  <h6>{this.state.nv_right_cyl}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "nv_right_cyl",
                                      className: "select-fld",
                                      value:this.state.nv_right_cyl,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.AUTO_REF_SCH
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>

                                <td>
                                  <h6>{this.state.nv_right_axis}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "nv_right_axis",
                                      className: "select-fld",
                                      value: this.state.nv_right_axis,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.AXIS_TYPE
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>

                                <td>
                                  <h6>{this.state.nv_right_prism}</h6>
                                  {/* <AlagehFormGroup
                                    div={{ className: "" }}
                                    div={{ className: "" }}
                                    textBox={{
                                      className: "txt-fld",
                                      name: "nv_right_prism",
                                      value: this.state.nv_right_prism,
                                      events: {},
                                      option: {
                                        type: "text"
                                      }
                                    }}
                                  /> */}
                                </td>

                                <td>
                                  <h6>{this.state.nv_right_vision}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "nv_right_vision",
                                      className: "select-fld",
                                      value:this.state.nv_right_vision,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.NV_VISION_TYPE
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div
                          className="col-6 table-responsive"
                          style={{ padding: 0 }}
                        >
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
                                  <h6>{this.state.dv_left_sch}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "dv_left_sch",
                                      className: "select-fld",
                                      value:this.state.dv_left_sch,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.AUTO_REF_SCH
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>
                                <td>
                                  <h6>{this.state.dv_left_cyl}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "dv_left_cyl",
                                      className: "select-fld",
                                      value:this.state.dv_left_cyl,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.AUTO_REF_SCH
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>

                                <td>
                                  <h6>{this.state.dv_left_axis}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "dv_left_axis",
                                      className: "select-fld",
                                      value: this.state.dv_left_axis,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.AXIS_TYPE
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>

                                <td>
                                  <h6>{this.state.dv_left_prism}</h6>
                                  {/* <AlagehFormGroup
                                    div={{ className: "" }}
                                    textBox={{
                                      className: "txt-fld",
                                      name: "dv_left_prism",
                                      value: this.state.dv_left_prism,
                                      events: {
                                        onChange:this.ChangeEventHandler.bind(this)
                                      },
                                      option: {
                                        type: "text"
                                      }
                                    }}
                                  /> */}
                                </td>

                                <td>
                                  <h6>{this.state.dv_left_vision}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "dv_left_vision",
                                      className: "select-fld",
                                      value:this.state.dv_left_vision,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.DV_VISION_TYPE
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>
                                <td>
                                  <h6>{this.state.eye_pd1}</h6>
                                  {/* <AlagehFormGroup
                                  div={{ className: "" }}
                                  textBox={{
                                    className: "txt-fld",
                                    name: "eye_pd1",
                                    value: this.state.eye_pd1,
                                    events: {
                                      onChange:this.ChangeEventHandler.bind(this)
                                    },
                                    others: {
                                      type: "number"
                                    }
                                  }}
                                /> */}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <h6>{this.state.nv_left_sch}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "nv_left_sch",
                                      className: "select-fld",
                                      value:this.state.nv_left_sch,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.AUTO_REF_SCH
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>
                                <td>
                                  <h6>{this.state.nv_left_cyl}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "nv_left_cyl",
                                      className: "select-fld",
                                      value:this.state.nv_left_cyl,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.AUTO_REF_SCH
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>

                                <td>
                                  <h6>{this.state.nv_left_axis}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "nv_left_axis",
                                      className: "select-fld",
                                      value: this.state.nv_left_axis,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.AXIS_TYPE
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>

                                <td>
                                  <h6>{this.state.nv_left_prism}</h6>
                                  {/* <AlagehFormGroup
                                    div={{ className: "" }}
                                    textBox={{
                                      className: "txt-fld",
                                      name: "nv_left_prism",
                                      value: this.state.nv_left_prism,
                                      events: {
                                        onChange:this.ChangeEventHandler.bind(this)
                                      },
                                      option: {
                                        type: "text"
                                      }
                                    }}
                                  /> */}
                                </td>

                                <td>
                                  <h6>{this.state.nv_left_vision}</h6>
                                  {/* <AlagehAutoComplete
                                    div={{ className: "" }}
                                    selector={{
                                      sort: "off",
                                      name: "nv_left_vision",
                                      className: "select-fld",
                                      value:this.state.nv_left_vision,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.NV_VISION_TYPE
                                      },
                                      onChange:this.ChangeEventHandler.bind(this)
                                    }}
                                  /> */}
                                </td>
                                <td>
                                  <h6>{this.state.eye_pd2}</h6>
                                  {/* <AlagehFormGroup
                                  div={{ className: "" }}
                                  textBox={{
                                    className: "txt-fld",
                                    name: "eye_pd2",
                                    value: this.state.eye_pd2,
                                    events: {
                                      onChange:this.ChangeEventHandler.bind(this)
                                    },
                                    others: {
                                      type: "number"
                                    }
                                  }}
                                /> */}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Bifocal/Add",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "right_bifocal_add",
                            value: this.state.right_bifocal_add,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Vertex/Add",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "vertical_add",
                            value: this.state.vertical_add,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this)
                            },
                            option: {
                              type: "text"
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Bifocal/Add",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "left_bifocal_add",
                            value: this.state.left_bifocal_add,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this)
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
                        <div className="col-12 customRadio">
                          <h5>Regular Lenses Type:</h5>
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="resgular_lense_type"
                              value="GL"
                              checked={
                                this.state.resgular_lense_type === "GL"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Glass</span>
                          </label>
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="resgular_lense_type"
                              value="PL"
                              checked={
                                this.state.resgular_lense_type === "PL"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Plastic</span>
                          </label>
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="resgular_lense_type"
                              value="N"
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>None</span>
                          </label>
                        </div>
                        <div className="col-4 customCheckbox">
                          <h5>Lenses Specification:</h5>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="multi_coated"
                              checked={this.state.multi_coated}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Multi-coated</span>
                          </label>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="varilux"
                              checked={this.state.varilux}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Varliux</span>
                          </label>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="light"
                              checked={this.state.light}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Light</span>
                          </label>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="aspheric"
                              checked={this.state.aspheric}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Aspheric</span>
                          </label>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="bifocal"
                              checked={this.state.bifocal}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Bifocal</span>
                          </label>
                        </div>
                        <div className="col-4 customCheckbox">
                          {/* <h5 /> */}
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="medium"
                              checked={this.state.medium}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Medium</span>
                          </label>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="lenticular"
                              checked={this.state.lenticular}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Lenticular</span>
                          </label>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="single_vision"
                              checked={this.state.single_vision}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Single Vision</span>
                          </label>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="dark"
                              checked={this.state.dark}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Dark</span>
                          </label>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="safety_thickness"
                              checked={this.state.safety_thickness}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Safety Thickness</span>
                          </label>
                        </div>
                        <div className="col-4 customCheckbox">
                          {/* <h5 /> */}
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="anti_reflecting_coating"
                              checked={this.state.anti_reflecting_coating}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Anti-Reflection Coating</span>
                          </label>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="photosensitive"
                              checked={this.state.photosensitive}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Photosensitive</span>
                          </label>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="high_index"
                              checked={this.state.high_index}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>High Index</span>
                          </label>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="colored"
                              checked={this.state.colored}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Colored</span>
                          </label>
                          <label className="checkbox block">
                            <input
                              type="checkbox"
                              name="anti_scratch"
                              checked={this.state.anti_scratch}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Anti-Scratch</span>
                          </label>
                        </div>
                        <div className="col-6 customRadio">
                          <h5>Contact Lenses Type:</h5>
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="contact_lense_type"
                              value="P"
                              checked={
                                this.state.contact_lense_type === "P"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Permanent</span>
                          </label>
                          <label className="radio inline">
                            <input
                              type="radio"
                              value="D"
                              name="contact_lense_type"
                              checked={
                                this.state.contact_lense_type === "D"
                                  ? true
                                  : false
                              }
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Disposable</span>
                          </label>
                        </div>
                        <div className="col-6 customRadio">
                          <h5>Frames:</h5>
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="frames"
                              value="Y"
                              checked={this.state.frames === "Y" ? true : false}
                              onChange={this.radioChange.bind(this)}
                            />
                            <span>Yes</span>
                          </label>
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="frames"
                              value="N"
                              checked={this.state.frames === "N" ? true : false}
                              onChange={this.radioChange.bind(this)}
                            />
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
                            name: "no_pairs",
                            value: this.state.no_pairs,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this)
                            },
                            others: {
                              type: "number"
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
                            name: "estimated_cost",
                            value: this.state.estimated_cost,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this)
                            },
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
                            name: "lense_cost",
                            value: this.state.lense_cost,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this)
                            },
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
                            name: "frame_cost",
                            value: this.state.frame_cost,
                            events: {
                              onChange: this.ChangeEventHandler.bind(this)
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
                    onClick={this.saveAndPrintOcaf.bind(this)}
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
