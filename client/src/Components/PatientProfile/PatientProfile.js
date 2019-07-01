import React, { Component } from "react";
import "./patientprofile.css";
import Overview from "./Overview/Overview";
import Subjective from "./Subjective/Subjective";
import BasicSubjective from "./Subjective/BasicSubjective";
import PhysicalExamination from "./PhysicalExamination/PhysicalExamination";
import ExamDiagramStandolone from "./ExamDiagramStandolone/ExamDiagramStandolone";
import Assesment from "./Assessment/Assessment";

import { AlgaehModalPopUp } from "../Wrapper/algaehWrapper";
import AlgaehFile from "../Wrapper/algaehFileUpload";
import {
  algaehApiCall,
  cancelRequest,
  getCookie,
  swalMessage
} from "../../utils/algaehApiCall";
import moment from "moment";
import { setGlobal, AlgaehOpenContainer } from "../../utils/GlobalFunctions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
import GlobalVariables from "../../utils/GlobalVariables.json";
import {
  getPatientProfile,
  getPatientVitals,
  getPatientDiet,
  getPatientDiagnosis,
  // getPatientAllergies,
  //getPatientHistory,
  printPrescription
} from "./PatientProfileHandlers";
// import AlgaehReport from "../Wrapper/printReports";
// import { getPatientAllergies } from "./Allergies/AllergiesHandlers";
import Enumerable from "linq";
import Summary from "./Summary/Summary";
import Dental from "./Dental/Dental";
import Eye from "./Eye/Eye";
import _ from "lodash";
import Allergies from "./Allergies/Allergies";
import SickLeave from "./SickLeave/SickLeave";
import PatientMRD from "../MRD/PatientMRD/PatientMRD";

const UcafEditor = React.lazy(() => import("../ucafEditors/ucaf"));
const DcafEditor = React.lazy(() => import("../ucafEditors/dcaf"));
const OcafEditor = React.lazy(() => import("../ucafEditors/ocaf"));

// import ExaminationDiagram from "./PhysicalExamination/ExaminationDiagram";
let allergyPopUp;

class PatientProfile extends Component {
  constructor(props) {
    super(props);
    this.selected_module = getCookie("module_id");
    this.active_modules = JSON.parse(
      AlgaehOpenContainer(sessionStorage.getItem("AlgaehOrbitaryData"))
    );

    allergyPopUp = props.open_allergy_popup;
    this.state = {
      pageDisplay: "subjective",
      patientDiet: [],
      patImg: "",
      patient_code:
        this.props.patient_profile !== undefined &&
        this.props.patient_profile.length > 0
          ? this.props.patient_profile[0].patient_code
          : "",
      openUCAF: false,
      UCAFData: undefined,
      openDCAF: false,
      DCAFData: undefined,
      openAlergy: false,
      openOCAF: false,
      openSickLeave: false,
      OCAFData: [],
      chart_type: Window.global["chart_type"],
      alergyExist: "",
      patientAllergies: []
    };

    getPatientProfile(this);
    getPatientVitals(this);

    // getPatientAllergies(this, () => {
    //   swalMessage({
    //     title: "Alergy Exists...",
    //     type: "warning"
    //   });
    // });
    getPatientDiet(this);
    getPatientDiagnosis(this);
    //getPatientHistory(this);
    this.getLocation();
    this.changeTabs = this.changeTabs.bind(this);
  }

  openAllergies(e) {
    this.setState({
      openAlergy: true
    });
  }

  closeAllergies(e) {
    this.setState({
      openAlergy: false
    });
  }

  showSickLeave() {
    this.setState({
      openSickLeave: !this.state.openSickLeave
    });
  }

  getLocation() {
    if (
      this.props.inventorylocations === undefined ||
      this.props.inventorylocations.length === 0
    ) {
      this.props.getLocation({
        uri: "/inventory/getInventoryLocation",
        module: "inventory",
        data: {
          location_status: "A"
        },
        method: "GET",
        redux: {
          type: "LOCATIONS_GET_DATA",
          mappingName: "inventorylocations"
        }
      });
    }
  }

  changeTabs(e) {
    let chief_complaint = Window.global["chief_complaint"];
    let significant_signs = Window.global["significant_signs"];
    const _Vitals =
      this.props.patient_vitals !== undefined &&
      this.props.patient_vitals.length > 0
        ? Enumerable.from(this.props.patient_vitals)
            .groupBy("$.visit_date", null, (k, g) => {
              return g.getSource();
            })
            .orderBy(g => g.visit_date)
            .lastOrDefault()
        : [];

    if (
      chief_complaint === null ||
      chief_complaint === undefined ||
      chief_complaint.length < 4
    ) {
      swalMessage({
        title: "Enter Chief Complaint. Atlest 4 letter",
        type: "warning"
      });
    } else if (
      significant_signs === null ||
      significant_signs === undefined ||
      significant_signs.length < 4
    ) {
      swalMessage({
        title: "Enter Significant Signs. Atlest 4 letter",
        type: "warning"
      });
    } else if (
      _Vitals.length === 0 &&
      Window.global["vitals_mandatory"] === "Y"
    ) {
      swalMessage({
        title: "Enter All Vitals...",
        type: "warning"
      });
    } else {
      var element = document.querySelectorAll("[algaehsoap]");
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove("active");
      }
      e.currentTarget.classList.add("active");
      var page = e.currentTarget.getAttribute("algaehsoap");
      this.setState({
        pageDisplay: page
      });
    }
  }

  componentWillUnmount() {
    cancelRequest("getPatientProfile");
    cancelRequest("getPatientVitals");
    cancelRequest("getPatientDiet");
    cancelRequest("getPatientDiagnosis");
  }
  componentWillReceiveProps(props) {
    if (props.patient_allergies !== undefined) {
      if (this.state.patientAllergies.length === 0)
        this.showAllergyAlert(props.patient_allergies);
      this.setState({
        alergyExist: props.patient_allergies.length > 0 ? " AllergyActive" : "",
        patientAllergies: Enumerable.from(props.patient_allergies)
          .groupBy("$.allergy_type", null, (k, g) => {
            return {
              allergy_type: k,
              allergy_type_desc:
                k === "F"
                  ? "Food"
                  : k === "A"
                  ? "Airborne"
                  : k === "AI"
                  ? "Animal  &  Insect"
                  : k === "C"
                  ? "Chemical & Others"
                  : "",
              allergyList: g.getSource()
            };
          })
          .toArray()
      });
    }
  }
  componentDidMount() {
    this.setState({
      alergyExist: "",
      firstLaunch:
        this.state.firstLaunch === undefined ? this.props.firstLaunch : false
    });
  }

  openUCAFReport(data, e) {
    let chief_complaint = Window.global["chief_complaint"];
    let significant_signs = Window.global["significant_signs"];
    const _Vitals =
      this.props.patient_vitals !== undefined &&
      this.props.patient_vitals.length > 0
        ? Enumerable.from(this.props.patient_vitals)
            .groupBy("$.visit_date", null, (k, g) => {
              return g.getSource();
            })
            .orderBy(g => g.visit_date)
            .lastOrDefault()
        : [];

    if (chief_complaint === null || chief_complaint.length < 4) {
      swalMessage({
        title: "Enter Chief Complaint. Atlest 4 letter",
        type: "warning"
      });
    } else if (significant_signs === null || significant_signs.length < 4) {
      swalMessage({
        title: "Enter Significant Signs. Atlest 4 letter",
        type: "warning"
      });
    } else if (
      _Vitals.length === 0 &&
      Window.global["vitals_mandatory"] === "Y"
    ) {
      swalMessage({
        title: "Enter All Vitals...",
        type: "warning"
      });
    } else {
      let that = this;
      algaehApiCall({
        uri: "/ucaf/getPatientUCAF",
        method: "GET",
        data: {
          patient_id: Window.global["current_patient"],
          visit_id: Window.global["visit_id"],
          forceReplace: true
        },
        onSuccess: response => {
          if (response.data.success) {
            that.setState({ openUCAF: true, UCAFData: response.data.records });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.response.data.message,
            type: "warning"
          });
        }
      });
    }
  }

  openDCAFReport(data, e) {
    let chief_complaint = Window.global["chief_complaint"];
    let significant_signs = Window.global["significant_signs"];
    const _Vitals =
      this.props.patient_vitals !== undefined &&
      this.props.patient_vitals.length > 0
        ? Enumerable.from(this.props.patient_vitals)
            .groupBy("$.visit_date", null, (k, g) => {
              return g.getSource();
            })
            .orderBy(g => g.visit_date)
            .lastOrDefault()
        : [];

    if (chief_complaint === null || chief_complaint.length < 4) {
      swalMessage({
        title: "Enter Chief Complaint. Atlest 4 letter",
        type: "warning"
      });
    } else if (significant_signs === null || significant_signs.length < 4) {
      swalMessage({
        title: "Enter Significant Signs. Atlest 4 letter",
        type: "warning"
      });
    } else if (
      _Vitals.length === 0 &&
      Window.global["vitals_mandatory"] === "Y"
    ) {
      swalMessage({
        title: "Enter All Vitals...",
        type: "warning"
      });
    } else {
      let that = this;
      algaehApiCall({
        uri: "/dcaf/getPatientDCAF",
        method: "GET",
        data: {
          patient_id: Window.global["current_patient"],
          visit_id: Window.global["visit_id"]
          // forceReplace: true
        },
        onSuccess: response => {
          if (response.data.success) {
            that.setState({ openDCAF: true, DCAFData: response.data.records });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.response.data.message,
            type: "warning"
          });
        }
      });
    }
  }

  openOCAFReport(data, e) {
    let chief_complaint = Window.global["chief_complaint"];
    let significant_signs = Window.global["significant_signs"];
    const _Vitals =
      this.props.patient_vitals !== undefined &&
      this.props.patient_vitals.length > 0
        ? Enumerable.from(this.props.patient_vitals)
            .groupBy("$.visit_date", null, (k, g) => {
              return g.getSource();
            })
            .orderBy(g => g.visit_date)
            .lastOrDefault()
        : [];

    if (
      chief_complaint === undefined ||
      chief_complaint === null ||
      chief_complaint.length < 4
    ) {
      swalMessage({
        title: "Enter Chief Complaint. Atlest 4 letter",
        type: "warning"
      });
    } else if (significant_signs === null || significant_signs.length < 4) {
      swalMessage({
        title: "Enter Significant Signs. Atlest 4 letter",
        type: "warning"
      });
    } else if (
      _Vitals.length === 0 &&
      Window.global["vitals_mandatory"] === "Y"
    ) {
      swalMessage({
        title: "Enter All Vitals...",
        type: "warning"
      });
    } else {
      let that = this;
      algaehApiCall({
        uri: "/ocaf/getPatientOCAF",
        method: "GET",
        data: {
          patient_id: Window.global["current_patient"],
          visit_id: Window.global["visit_id"]
        },
        onSuccess: response => {
          if (response.data.success) {
            that.setState({ openOCAF: true, OCAFData: response.data.records });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.response.data.message,
            type: "warning"
          });
        }
      });
    }
  }

  showAllergyAlert(_patient_allergies) {
    if (allergyPopUp && _patient_allergies.length > 0) {
      allergyPopUp = false;
      swalMessage({
        title: "Alergy Exists...",
        type: "warning"
      });
    }
  }
  decissionAllergyOnSet(row) {
    const _onSet = Enumerable.from(GlobalVariables.ALLERGY_ONSET)
      .where(w => w.value === row.onset)
      .firstOrDefault();
    if (_onSet !== undefined) {
      return _onSet.name;
    } else return "";
  }
  renderBackButton(e) {
    setGlobal({ "EHR-STD": "DoctorsWorkbench" });
    document.getElementById("ehr-router").click();
  }

  renderDCAFReport() {
    return (
      <AlgaehModalPopUp
        openPopup={this.state.openDCAF}
        title="DCAF 2.0"
        events={{
          onClose: () => {
            this.setState({ openDCAF: false });
          }
        }}
      >
        <DcafEditor dataProps={this.state.DCAFData} />
      </AlgaehModalPopUp>
    );
  }
  renderOCAFReport() {
    return (
      <AlgaehModalPopUp
        openPopup={this.state.openOCAF}
        title="OCAF 2.0"
        events={{
          onClose: () => {
            this.setState({ openOCAF: false });
          }
        }}
      >
        <OcafEditor dataProps={this.state.OCAFData} />
      </AlgaehModalPopUp>
    );
  }
  renderUCAFReport() {
    return (
      <AlgaehModalPopUp
        openPopup={this.state.openUCAF}
        title="UCAF 2.0"
        events={{
          onClose: () => {
            this.setState({ openUCAF: false });
          }
        }}
      >
        <UcafEditor dataProps={this.state.UCAFData} />
      </AlgaehModalPopUp>
    );
  }

  OpenMrdHandler(e) {
    let chief_complaint = Window.global["chief_complaint"];
    let significant_signs = Window.global["significant_signs"];
    const _Vitals =
      this.props.patient_vitals !== undefined &&
      this.props.patient_vitals.length > 0
        ? Enumerable.from(this.props.patient_vitals)
            .groupBy("$.visit_date", null, (k, g) => {
              return g.getSource();
            })
            .orderBy(g => g.visit_date)
            .lastOrDefault()
        : [];

    if (
      chief_complaint === null ||
      chief_complaint === undefined ||
      chief_complaint.length < 4
    ) {
      swalMessage({
        title: "Enter Chief Complaint. Atlest 4 letter",
        type: "warning"
      });
    } else if (
      significant_signs === null ||
      significant_signs === undefined ||
      significant_signs.length < 4
    ) {
      swalMessage({
        title: "Enter Significant Signs. Atlest 4 letter",
        type: "warning"
      });
    } else if (
      _Vitals.length === 0 &&
      Window.global["vitals_mandatory"] === "Y"
    ) {
      swalMessage({
        title: "Enter All Vitals...",
        type: "warning"
      });
    } else {
      const details = Window.global;
      var element = document.querySelectorAll("[algaehsoap]");
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove("active");
      }
      e.currentTarget.classList.add("active");
      var page = e.currentTarget.getAttribute("algaehsoap");

      setGlobal({
        "MRD-STD": "PatientMRD",
        mrd_patient: details["current_patient"],
        nationality: document.querySelector("[patient_nationality='true']")
          .innerText,
        gender: details["gender"]
      });
      this.setState({
        pageDisplay: page
      });
    }
  }
  render() {
    const module_plan = _.find(this.active_modules, f => {
      return f.module_id === parseInt(this.selected_module);
    });
    const _pat_profile =
      this.props.patient_profile !== undefined &&
      this.props.patient_profile.length > 0
        ? this.props.patient_profile[0]
        : {};

    const _Vitals =
      this.props.patient_vitals !== undefined &&
      this.props.patient_vitals.length > 0
        ? _.chain(this.props.patient_vitals)
            .uniqBy(u => u.vital_id)
            .orderBy(o => o.sequence_order)
            .value()
        : [];

    // const _patient_allergies =
    //   this.props.patient_allergies === undefined
    //     ? []
    //     : Enumerable.from(this.props.patient_allergies)
    //         .groupBy("$.allergy_type", null, (k, g) => {
    //           return {
    //             allergy_type: k,
    //             allergy_type_desc:
    //               k === "F"
    //                 ? "Food"
    //                 : k === "A"
    //                 ? "Airborne"
    //                 : k === "AI"
    //                 ? "Animal  &  Insect"
    //                 : k === "C"
    //                 ? "Chemical & Others"
    //                 : "",
    //             allergyList: g.getSource()
    //           };
    //         })
    //         .toArray();
    const _patient_allergies = this.state.patientAllergies;

    const _diagnosis =
      this.props.patient_diagnosis === undefined
        ? []
        : this.props.patient_diagnosis;

    const _diet =
      this.props.patient_diet === undefined ? [] : this.props.patient_diet;

    return (
      <div className="row patientProfile">
        <div className="patientInfo-Top box-shadow-normal">
          <div className="backBtn">
            <button
              id="btn-outer-component-load"
              className="d-none"
              //  onClick={this.setPatientGlobalParameters.bind(this)}
            />
            <button
              onClick={this.renderBackButton.bind(this)}
              type="button"
              className="btn btn-outline-secondary btn-sm"
            >
              <i className="fas fa-angle-double-left fa-lg" />
              Back
            </button>
          </div>
          <div className="patientImg">
            <AlgaehFile
              name="attach_photo"
              accept="image/*"
              textAltMessage={_pat_profile.full_name}
              showActions={false}
              serviceParameters={{
                uniqueID: _pat_profile.patient_code,
                destinationName: _pat_profile.patient_code,
                fileType: "Patients"
              }}
            />
          </div>
          <div className="patientName">
            <h6>{_pat_profile.full_name}</h6>
            <p>
              {_pat_profile.gender} - {_pat_profile.age_in_years}y,
              {_pat_profile.age_in_months}m, {_pat_profile.age_in_days}d
            </p>
          </div>
          <div className="patientDemographic">
            <span>
              DOB:
              <b>{moment(_pat_profile.date_of_birth).format("DD-MM-YYYY")}</b>
            </span>

            <span>
              Nationality:{" "}
              <b patient_nationality="true">{_pat_profile.nationality}</b>
            </span>
            <span>
              Payment:
              <b>
                {_pat_profile.payment_type === "I"
                  ? "Insurance"
                  : _pat_profile.payment_type === "S"
                  ? "Self"
                  : ""}
              </b>
            </span>
          </div>
          <div className="patientHospitalDetail">
            <span>
              MRN: <b>{_pat_profile.patient_code}</b>
            </span>
            <span>
              Encounter:
              <b>
                {moment(_pat_profile.Encounter_Date).format(
                  "DD-MM-YYYY | hh:mm a"
                )}
              </b>
            </span>
          </div>
          {_Vitals.length > 0 ? (
            <div className="patientVital">
              {_Vitals.map((row, idx) => {
                if (row.display === "N") {
                  return null;
                }
                return (
                  <span key={idx}>
                    {row.vital_short_name}:<b> {row.vital_value} </b>
                    <small>{row.formula_value}</small>
                  </span>
                );
              })}
            </div>
          ) : null}
          <div className="moreAction">
            <button type="button" className="btn btn-outline-secondary btn-sm">
              <i className="fas fa-caret-square-down fa-lg" />
              More
            </button>
            <ul className="moreActionUl">
              {/*<li>

                <span onClick={this.OpenMrdHandler.bind(this)}>Open MRD</span>

              </li> */}
              <li>
                <span onClick={printPrescription.bind(this, this)}>
                  Prescription
                </span>
              </li>
              <li>
                <span onClick={this.showSickLeave.bind(this)}>Sick Leave</span>
              </li>
              {/* <li onClick={this.openUCAFReport.bind(this, _pat_profile)}>
                <span>UCAF Report</span>
              </li>

              <li onClick={this.openDCAFReport.bind(this, _pat_profile)}>
                <span>DCAF Report</span>
              </li> */}
              {this.state.chart_type === "D" ? (
                <li onClick={this.openDCAFReport.bind(this, _pat_profile)}>
                  <span>DCAF Report</span>
                </li>
              ) : this.state.chart_type === "O" ? (
                <li onClick={this.openOCAFReport.bind(this, _pat_profile)}>
                  <span>OCAF Report</span>
                </li>
              ) : (
                <li onClick={this.openUCAFReport.bind(this, _pat_profile)}>
                  <span>UCAF Report</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="patientTopNav box-shadow-normal">
          {module_plan === undefined || module_plan.module_plan === "G" ? (
            <ul className="nav">
              <li className="nav-item">
                <span
                  onClick={this.changeTabs}
                  algaehsoap="subjective"
                  className="nav-link active"
                >
                  Subjective
                </span>
              </li>
              <li className="nav-item">
                <span
                  onClick={this.changeTabs}
                  algaehsoap="phy_exam"
                  className="nav-link"
                >
                  Physical Examination
                </span>
              </li>
              <li className="nav-item">
                <span
                  onClick={this.changeTabs}
                  algaehsoap="exam_diagram"
                  className="nav-link"
                >
                  Examination Diagram
                </span>
              </li>
              <li className="nav-item">
                <span
                  onClick={this.changeTabs}
                  algaehsoap="assesment"
                  className="nav-link"
                >
                  Assesment
                </span>
              </li>

              <li className="nav-item">
                <span
                  onClick={this.changeTabs}
                  algaehsoap="dental"
                  className="nav-link"
                >
                  Dental
                </span>
              </li>
              <li className="nav-item">
                <span
                  onClick={this.changeTabs}
                  algaehsoap="eye"
                  className="nav-link"
                >
                  Optometry
                </span>
              </li>
              <li className="nav-item">
                <span
                  onClick={this.changeTabs}
                  algaehsoap="summary"
                  className="nav-link"
                >
                  Summary
                </span>
              </li>

              <ul className="float-right patient-quick-info">
                <li>
                  <i className={"fas fa-allergies " + this.state.alergyExist} />
                  <section>
                    <span className="top-nav-sec-hdg">Allergies</span>
                    <div className="listofADDWrapper">
                      <table className="listofADDTable">
                        <thead>
                          <tr>
                            <th>
                              <b>Allergy</b>
                            </th>
                            <th>
                              <b>Onset From</b>
                            </th>
                            <th>
                              <b>Severity</b>
                            </th>
                            <th>
                              <b>Comments</b>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {_patient_allergies.map((data, index) => (
                            <React.Fragment key={index}>
                              {data.allergyList.map((allergy, aIndex) => (
                                <tr
                                  className={
                                    allergy.allergy_inactive === "Y"
                                      ? "red"
                                      : ""
                                  }
                                >
                                  <td>{allergy.allergy_name}</td>
                                  <td>
                                    {allergy.onset === "O"
                                      ? allergy.onset_date
                                      : allergy.onset === "A"
                                      ? "Adulthood"
                                      : allergy.onset === "C"
                                      ? "Childhood"
                                      : allergy.onset === "P"
                                      ? "Pre Terms"
                                      : allergy.onset === "T"
                                      ? "Teenage"
                                      : ""}
                                  </td>
                                  <td>
                                    {allergy.severity === "MO"
                                      ? "Moderate"
                                      : allergy.severity === "MI"
                                      ? "Mild"
                                      : allergy.severity === "SE"
                                      ? "Severe"
                                      : ""}
                                  </td>
                                  <td>{allergy.comment}</td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </li>
                <li>
                  <i className="fas fa-diagnoses" />
                  <section>
                    <span className="top-nav-sec-hdg">Diagnosis</span>
                    <div className="listofADDWrapper">
                      <table className="listofADDTable">
                        <thead>
                          <tr>
                            <th>
                              <b>ICD Code</b>
                            </th>
                            <th>
                              <b>Description</b>
                            </th>
                            <th>
                              <b>Diagnosis Type</b>
                            </th>
                            <th>
                              <b>Diagnosis Level</b>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {_diagnosis.map((item, index) => (
                            <tr key={index}>
                              <td>{item.icd_code}</td>
                              <td>{item.icd_description}</td>
                              <td>
                                {item.diagnosis_type === "S"
                                  ? "Secondary"
                                  : "Primary"}
                              </td>
                              <td>
                                {item.final_daignosis === "Y"
                                  ? "Final"
                                  : "Not Final"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </li>
                <li>
                  <i className="fas fa-utensils" />
                  <section>
                    <span className="top-nav-sec-hdg">Diet</span>{" "}
                    <div className="listofADDWrapper">
                      <table className="listofADDTable">
                        <tbody>
                          {_diet.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item.hims_d_diet_note}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </li>
              </ul>
            </ul>
          ) : (
            <ul className="nav">
              <li className="nav-item">
                <span
                  onClick={this.changeTabs}
                  algaehsoap="subjective"
                  className="nav-link active"
                >
                  Subjective
                </span>
              </li>

              <li className="nav-item">
                <span
                  onClick={this.changeTabs}
                  algaehsoap="exam_diagram"
                  className="nav-link"
                >
                  Examination Diagram
                </span>
              </li>

              {this.state.chart_type === "D" ? (
                <li className="nav-item">
                  <span
                    onClick={this.changeTabs}
                    algaehsoap="dental"
                    className="nav-link"
                  >
                    Dental
                  </span>
                </li>
              ) : this.state.chart_type === "O" ? (
                <li className="nav-item">
                  <span
                    onClick={this.changeTabs}
                    algaehsoap="eye"
                    className="nav-link"
                  >
                    Optometry
                  </span>
                </li>
              ) : null}

              <li className="nav-item">
                <span
                  onClick={this.changeTabs}
                  algaehsoap="summary"
                  className="nav-link"
                >
                  Summary
                </span>
              </li>
              <li className="nav-item">
                <span
                  onClick={this.OpenMrdHandler.bind(this)}
                  algaehsoap="mrd"
                  className="nav-link"
                >
                  MRD
                </span>
              </li>
              <ul className="float-right patient-quick-info">
                <li>
                  <i className={"fas fa-allergies" + this.state.alergyExist} />
                  <section>
                    <span className="top-nav-sec-hdg">Allergies</span>
                    <div className="listofADDWrapper">
                      <table className="listofADDTable">
                        <thead>
                          <tr>
                            <th>
                              <b>Allergy</b>
                            </th>
                            <th>
                              <b>Onset From</b>
                            </th>
                            <th>
                              <b>Severity</b>
                            </th>
                            <th>
                              <b>Comments</b>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {_patient_allergies.map((data, index) => (
                            <React.Fragment key={index}>
                              {data.allergyList.map((allergy, aIndex) => (
                                <tr
                                  key={aIndex}
                                  className={
                                    allergy.allergy_inactive === "Y"
                                      ? "red"
                                      : ""
                                  }
                                >
                                  <td>{allergy.allergy_name}</td>
                                  <td>
                                    {allergy.onset === "O"
                                      ? allergy.onset_date
                                      : allergy.onset === "A"
                                      ? "Adulthood"
                                      : allergy.onset === "C"
                                      ? "Childhood"
                                      : allergy.onset === "P"
                                      ? "Pre Terms"
                                      : allergy.onset === "T"
                                      ? "Teenage"
                                      : ""}
                                  </td>
                                  <td>
                                    {allergy.severity === "MO"
                                      ? "Moderate"
                                      : allergy.severity === "MI"
                                      ? "Mild"
                                      : allergy.severity === "SE"
                                      ? "Severe"
                                      : ""}
                                  </td>
                                  <td>{allergy.comment}</td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </li>
                <li>
                  <i className="fas fa-diagnoses" />
                  <section>
                    <span className="top-nav-sec-hdg">Diagnosis</span>
                    <div className="listofADDWrapper">
                      <table className="listofADDTable">
                        <thead>
                          <tr>
                            <th>
                              <b>ICD Code</b>
                            </th>
                            <th>
                              <b>Description</b>
                            </th>
                            <th>
                              <b>Diagnosis Type</b>
                            </th>
                            <th>
                              <b>Diagnosis Level</b>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {_diagnosis.map((item, index) => (
                            <tr key={index}>
                              <td>{item.icd_code}</td>
                              <td>{item.icd_description}</td>
                              <td>
                                {item.diagnosis_type === "S"
                                  ? "Secondary"
                                  : "Primary"}
                              </td>
                              <td>
                                {item.final_daignosis === "Y"
                                  ? "Final"
                                  : "Not Final"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </li>
                <li>
                  <i className="fas fa-utensils" />
                  <section>
                    <span className="top-nav-sec-hdg">Diet</span>{" "}
                    <div className="listofADDWrapper">
                      <table className="listofADDTable">
                        <tbody>
                          {_diet.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item.hims_d_diet_note}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </li>
              </ul>
            </ul>
          )}
        </div>
        <div className="patientContentArea">
          {module_plan === undefined || module_plan.module_plan === "G" ? (
            this.state.pageDisplay === "overview" ? (
              <Overview />
            ) : this.state.pageDisplay === "subjective" ? (
              <Subjective />
            ) : this.state.pageDisplay === "phy_exam" ? (
              <PhysicalExamination />
            ) : this.state.pageDisplay === "exam_diagram" ? (
              <ExamDiagramStandolone />
            ) : this.state.pageDisplay === "assesment" ? (
              <Assesment vat_applicable={this.vatApplicable()} />
            ) : this.state.pageDisplay === "summary" ? (
              <Summary />
            ) : this.state.pageDisplay === "dental" ? (
              <Dental vat_applicable={this.vatApplicable()} />
            ) : this.state.pageDisplay === "eye" ? (
              <Eye />
            ) : null
          ) : this.state.pageDisplay === "overview" ? (
            <Overview />
          ) : this.state.pageDisplay === "subjective" ? (
            <BasicSubjective vat_applicable={this.vatApplicable()} />
          ) : this.state.pageDisplay === "exam_diagram" ? (
            <ExamDiagramStandolone />
          ) : this.state.pageDisplay === "eye" ? (
            <Eye />
          ) : this.state.pageDisplay === "dental" ? (
            <Dental vat_applicable={this.vatApplicable()} />
          ) : this.state.pageDisplay === "summary" ? (
            <Summary />
          ) : this.state.pageDisplay === "mrd" ? (
            <PatientMRD fromClinicalDesk={true} />
          ) : null}
        </div>
        {this.renderUCAFReport()}
        {this.renderDCAFReport()}
        {this.renderOCAFReport()}
        <SickLeave
          openSickLeave={this.state.openSickLeave}
          onClose={this.showSickLeave.bind(this)}
        />
      </div>
    );
  }

  vatApplicable() {
    const _atApplicable = Enumerable.from(
      this.props.patient_profile
    ).firstOrDefault();
    if (_atApplicable !== undefined) return _atApplicable.vat_applicable;
    else return "";
  }
}

function mapStateToProps(state) {
  return {
    patient_profile: state.patient_profile,
    patient_allergies: state.patient_allergies,
    patient_vitals: state.patient_vitals,
    patient_diet: state.patient_diet,
    patient_diagnosis: state.patient_diagnosis,
    inventorylocations: state.inventorylocations,
    patient_history: state.patient_history
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientProfile: AlgaehActions,
      getPatientAllergies: AlgaehActions,
      getPatientVitals: AlgaehActions,
      getPatientDiet: AlgaehActions,
      getPatientDiagnosis: AlgaehActions,
      getLocation: AlgaehActions
      //getPatientHistory: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientProfile)
);
