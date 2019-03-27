import React, { Component } from "react";
import "./patientprofile.css";
import Overview from "./Overview/Overview";
import Subjective from "./Subjective/Subjective";
import PhysicalExamination from "./PhysicalExamination/PhysicalExamination";
import Assesment from "./Assessment/Assessment";
import Plan from "./Plan/Plan";
import { AlgaehModalPopUp } from "../Wrapper/algaehWrapper";
import AlgaehFile from "../Wrapper/algaehFileUpload";
import { algaehApiCall, cancelRequest } from "../../utils/algaehApiCall";
import moment from "moment";
import { setGlobal } from "../../utils/GlobalFunctions";
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
  getPatientAllergies
} from "./PatientProfileHandlers";
import AlgaehReport from "../Wrapper/printReports";
import Enumerable from "linq";
import Summary from "./Summary/Summary";
import Dental from "./Dental/Dental";
let allergyPopUp;
class PatientProfile extends Component {
  constructor(props) {
    super(props);
    allergyPopUp = props.open_allergy_popup;
    this.state = {
      pageDisplay: "subjective",
      patientDiet: [],
      patImg: "",
      patient_code:
        this.props.patient_profile !== undefined &&
        this.props.patient_profile.length > 0
          ? this.props.patient_profile[0].patient_code
          : ""
    };
    getPatientProfile(this);
    getPatientVitals(this);
    getPatientAllergies(this);
    getPatientDiet(this);
    getPatientDiagnosis(this);
    this.changeTabs = this.changeTabs.bind(this);
  }

  changeTabs(e) {
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

  componentWillUnmount() {
    cancelRequest("getPatientProfile");
    cancelRequest("getPatientVitals");
    cancelRequest("getPatientDiet");
    cancelRequest("getPatientDiagnosis");
  }

  componentDidMount() {
    this.setState({
      firstLaunch:
        this.state.firstLaunch === undefined ? this.props.firstLaunch : false
    });
  }

  openUCAFReport(data, e) {
    algaehApiCall({
      uri: "/ucaf/getPatientUCAF",
      method: "GET",
      data: {
        patient_id: "580",
        visit_date: "2018-09-15"
      },
      onSuccess: response => {
        if (response.data.success) {
          // const _dataG = response.data.records[0];
          AlgaehReport({
            report: {
              fileName: "ucafReport"
            },
            data: data
          });
        }
      }
    });
  }

  showAllergyAlert(_patient_allergies) {
    if (allergyPopUp && _patient_allergies.length > 0) {
      return (
        <AlgaehModalPopUp
          openPopup={true}
          events={{
            onClose: (that = this) => {
              allergyPopUp = false;
              // that.handleClose.bind(this);
            }
          }}
          title="Alert"
        >
          <div>
            <span>Patient is Allergic</span>
            <span>Listed below are the following allergies</span>
            <br />

            {_patient_allergies.map((tables, index) => (
              <table
                key={index}
                className="table table-sm table-bordered customTable"
              >
                <thead className="table-primary">
                  <tr>
                    <th> {tables.allergy_type_desc} </th>
                    <th>Onset</th>
                    <th>Comment</th>
                    <th>Inactive</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.allergyList.map((rows, rIndex) => (
                    <tr key={rIndex}>
                      <td> {rows.allergy_name} </td>
                      <td>{this.decissionAllergyOnSet(rows)}</td>
                      <td>{rows.comment}</td>
                      <td>{rows.allergy_inactive === "Y" ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        </AlgaehModalPopUp>
      );
    }
    return null;
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

  render() {
    const _pat_profile =
      this.props.patient_profile !== undefined &&
      this.props.patient_profile.length > 0
        ? this.props.patient_profile[0]
        : {};

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

    const _patient_allergies =
      this.props.patient_allergies === undefined
        ? []
        : Enumerable.from(this.props.patient_allergies)
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
            .toArray();

    const _diagnosis =
      this.props.patient_diagnosis === undefined
        ? []
        : this.props.patient_diagnosis;
    const _diet =
      this.props.patient_diet === undefined ? [] : this.props.patient_diet;

    return (
      <div className="row patientProfile">
        {this.showAllergyAlert(_patient_allergies)}

        {/* <AlgaehModalPopUp
          openPopup={this.showAllergyAlert.bind(this, _patient_allergies)}
          onClose={this.handleClose.bind(this)}
          title="Alert"
        >
          <div>
            <span>Patient is Allergic</span>
            <span>Listed below are the following allergies</span>
            <br />

            {_patient_allergies.map((tables, index) => (
              <table
                key={index}
                className="table table-sm table-bordered customTable"
              >
                <thead className="table-primary">
                  <tr>
                    <th> {tables.allergy_type_desc} </th>
                    <th>Onset</th>
                    <th>Comment</th>
                    <th>Inactive</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.allergyList.map((rows, rIndex) => (
                    <tr key={rIndex}>
                      <td> {rows.allergy_name} </td>
                      <td>
                        {
                          Enumerable.from(GlobalVariables.ALLERGY_ONSET)
                            .where(w => w.value === rows.onset)
                            .firstOrDefault().name
                        }
                      </td>
                      <td>{rows.comment}</td>
                      <td>{rows.allergy_inactive === "Y" ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        </AlgaehModalPopUp> */}

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
              {_pat_profile.gender} ,{_pat_profile.age_in_years}Y{" "}
              {_pat_profile.age_in_months}M {_pat_profile.age_in_days}D
            </p>
          </div>
          <div className="patientDemographic">
            {" "}
            <span>
              DOB:{" "}
              <b>{moment(_pat_profile.date_of_birth).format("DD-MM-YYYY")}</b>
            </span>
            {/* <span>
              Mobile: <b>{_pat_profile.contact_number}</b>
            </span> */}
            <span>
              Nationality: <b>{_pat_profile.nationality}</b>
            </span>
            <span>
              Payment:{" "}
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
              Encounter:{" "}
              <b>
                {moment(_pat_profile.Encounter_Date).format(
                  "DD-MM-YYYY | hh:mm a"
                )}
              </b>
            </span>
          </div>
          {_Vitals.length > 0 ? (
            <div className="patientVital">
              <span>
                Vitals updated on:{" "}
                <b>{_Vitals[_Vitals.length - 1]["updated_Date"]}</b>
              </span>
              <br />
              {_Vitals.map((row, idx) => (
                <span key={idx}>
                  {row.vitals_name}:<b> {row.vital_value}</b>
                </span>
              ))}
            </div>
          ) : null}
          <div className="moreAction">
            <button type="button" className="btn btn-outline-secondary btn-sm">
              <i className="fas fa-caret-square-down fa-lg" />
              More
            </button>
            <ul className="moreActionUl">
              <li>
                <span>Open MRD</span>
              </li>
              <li onClick={this.openUCAFReport.bind(this, _pat_profile)}>
                <span>UCAF Report</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="patientTopNav box-shadow-normal">
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
                algaehsoap="assesment"
                className="nav-link"
              >
                Assesment
              </span>
            </li>
            <li className="nav-item">
              <span
                onClick={this.changeTabs}
                algaehsoap="plan"
                className="nav-link"
              >
                Plan
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
            <li className="nav-item">
              <span
                onClick={this.changeTabs}
                algaehsoap="dental"
                className="nav-link"
              >
                Dental
              </span>
            </li>
            <ul className="float-right patient-quick-info">
              <li>
                <i className="fas fa-allergies" />
                <section>
                  <b className="top-nav-sec-hdg">Allergies:</b>
                  <p>
                    {_patient_allergies.map((data, index) => (
                      <React.Fragment key={index}>
                        <b>{data.allergy_type_desc}</b>
                        {data.allergyList.map((allergy, aIndex) => (
                          <span
                            key={aIndex}
                            className={
                              "listofA-D-D " +
                              (allergy.allergy_inactive === "Y" ? "red" : "")
                            }
                            title={
                              "Onset Date : " +
                              allergy.onset_date +
                              "\n Comment : " +
                              allergy.comment +
                              "\n Severity : " +
                              allergy.severity
                            }
                          >
                            {allergy.allergy_name}
                          </span>
                        ))}
                      </React.Fragment>
                    ))}
                  </p>
                </section>
              </li>
              <li>
                <i className="fas fa-diagnoses" />
                <section>
                  <b className="top-nav-sec-hdg">Diagnosis:</b>
                  <p>
                    {_diagnosis.map((item, index) => (
                      <React.Fragment key={index}>
                        <span key={index} className="listofA-D-D">
                          {item.icd_code} | {item.icd_description} |
                          {item.diagnosis_type === "S"
                            ? "Secondary"
                            : "Primary"}{" "}
                          | {item.final_daignosis}
                        </span>
                      </React.Fragment>
                    ))}
                  </p>
                </section>
              </li>
              <li>
                <i className="fas fa-utensils" />
                <section>
                  <b className="top-nav-sec-hdg">Diet:</b>
                  <p>
                    {_diet.map((data, index) => (
                      <span key={index} className="listofA-D-D">
                        {data.icd_description}
                      </span>
                    ))}
                  </p>
                </section>
              </li>
            </ul>
          </ul>
        </div>
        <div className="patientContentArea">
          {this.state.pageDisplay === "overview" ? (
            <Overview />
          ) : this.state.pageDisplay === "subjective" ? (
            <Subjective />
          ) : this.state.pageDisplay === "phy_exam" ? (
            <PhysicalExamination />
          ) : this.state.pageDisplay === "assesment" ? (
            <Assesment vat_applicable={this.vatApplicable()} />
          ) : this.state.pageDisplay === "plan" ? (
            <Plan />
          ) : this.state.pageDisplay === "summary" ? (
            <Summary />
          ) : this.state.pageDisplay === "dental" ? (
            <Dental />
          ) : null}
        </div>
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
    patient_diagnosis: state.patient_diagnosis
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientProfile: AlgaehActions,
      getPatientAllergies: AlgaehActions,
      getPatientVitals: AlgaehActions,
      getPatientDiet: AlgaehActions,
      getPatientDiagnosis: AlgaehActions
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
