import React, { Component, Suspense } from "react";
import "./patientprofile.scss";
import Overview from "./Overview/Overview";
import BasicSubjective from "./Subjective/BasicSubjective";
import { AlgaehModalPopUp } from "../Wrapper/algaehWrapper";
import AlgaehFile from "../Wrapper/algaehFileUpload";
import {
  algaehApiCall,
  cancelRequest,
  getCookie,
  swalMessage,
  setCookie,
} from "../../utils/algaehApiCall";
import { setGlobal, removeGlobal } from "../../utils/GlobalFunctions";
import moment from "moment";
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
  printPrescription,
} from "./PatientProfileHandlers";
import Enumerable from "linq";
import Summary from "./Summary/Summary";
import Dental from "./Dental/Dental";
import Eye from "./Eye/Eye";
import _ from "lodash";
import SickLeave from "./SickLeave/SickLeave";
import PatientAttendance from "./PatientAttendance/PatientAttendance";
import PatientMRD from "../MRD/PatientMRD/PatientMRD";
import Chronic from "./chronic";
import GrowthCharts from "./growthCharts";
import GrowthChartsNew from "./growthCharts/new";
import MyContext from "../../utils/MyContext";
const ExamDiagramStandolone = React.lazy(() =>
  import("./ExamDiagramStandolone/ExamDiagramStandolone")
);

const UcafEditor = React.lazy(() => import("../ucafEditors/ucaf"));
const DcafEditor = React.lazy(() => import("../ucafEditors/dcaf"));
const OcafEditor = React.lazy(() => import("../ucafEditors/ocaf"));

// import ExaminationDiagram from "./PhysicalExamination/ExaminationDiagram";

class PatientProfile extends Component {
  constructor(props) {
    super(props);
    this.selected_module = getCookie("module_id");

    this.state = {
      pageDisplay: "subjective",
      patientDiet: [],
      patImg: "",
      patient_code: "",
      openUCAF: false,
      UCAFData: undefined,
      openDCAF: false,
      DCAFData: undefined,
      openAlergy: false,
      openOCAF: false,
      openSickLeave: false,
      openPatientAttendance: false,
      OCAFData: [],
      department_type: "",
      alergyExist: "",
      chronicExists: false,
      updateChronic: false,
      showAllergyPopup: true,
      patientAllergies: [],
    };

    this.changeTabs = this.changeTabs.bind(this);
  }
  componentDidMount() {
    const patientDetails = Window.global;
    // if (patientDetails === undefined) {
    //   this.props.history.push("/DoctorsWorkbench");
    // }

    this.setState(
      {
        alergyExist: "",
        firstLaunch:
          this.state.firstLaunch === undefined ? this.props.firstLaunch : false,
        patient_code:
          this.props.patient_profile !== undefined &&
          this.props.patient_profile.length > 0
            ? this.props.patient_profile[0].patient_code
            : "",
        department_type: patientDetails["department_type"],
      },
      () => {
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
      }
    );
  }

  openAllergies(e) {
    this.setState({
      openAlergy: true,
    });
  }

  closeAllergies(e) {
    this.setState({
      openAlergy: false,
    });
  }

  showSickLeave() {
    this.setState({
      openSickLeave: !this.state.openSickLeave,
    });
  }

  showPatientAttendance() {
    this.setState({
      openPatientAttendance: !this.state.openPatientAttendance,
    });
  }

  printGeneralConsentForm() {
    const { visit_id, ip_id, current_patient } = Window.global;
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "GeneralConsent",
          reportParams: [
            {
              name: "patient_id",
              value: current_patient,
            },
            {
              name: "visit_id",
              value: visit_id,
            },
            {
              name: "ip_id",
              value: ip_id,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=General Consent Form`;
        window.open(origin);
        // window.document.title = "Consent Form";
      },
    });
  }

  printMedicalConsentForm() {
    const { current_patient, visit_id, episode_id, ip_id } = Window.global;
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "MedicalConsent",
          reportParams: [
            {
              name: "patient_id",
              value: current_patient,
            },
            {
              name: "visit_id",
              value: visit_id,
            },
            {
              name: "episode_id",
              value: episode_id,
            },
            {
              name: "ip_id",
              value: ip_id,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const documentName = "Medical Consent Form";
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${documentName}`;
        window.open(origin);
      },
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
          location_status: "A",
        },
        method: "GET",
        redux: {
          type: "LOCATIONS_GET_DATA",
          mappingName: "inventorylocations",
        },
      });
    }
  }

  changeTabs(e) {
    var element = document.querySelectorAll("[algaehsoap]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var page = e.currentTarget.getAttribute("algaehsoap");
    this.setState({
      pageDisplay: page,
    });
  }

  componentWillUnmount() {
    cancelRequest("getPatientProfile");
    cancelRequest("getPatientVitals");
    cancelRequest("getPatientDiet");
    cancelRequest("getPatientDiagnosis");
    removeGlobal("encounter_id");
    removeGlobal("vitals_mandatory");
    removeGlobal("current_patient");
    // removeGlobal("episode_id");
    removeGlobal("visit_id");
    removeGlobal("ip_id");
    removeGlobal("provider_id");
    removeGlobal("department_type");
    removeGlobal("gender");
    removeGlobal("sub_department_id");
    removeGlobal("source");
    this.props.getPatientAllergies({
      redux: {
        type: "PATIENT_ALLERGIES",
        mappingName: "patient_allergies",
        data: [],
      },
    });
    this.props.getPatientVitals({
      redux: {
        type: "PATIENT_VITALS",
        mappingName: "patient_vitals",
        data: [],
      },
    });
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.patient_allergies !== undefined) {
      if (this.state.patientAllergies.length === 0)
        this.showAllergyAlert(props.patient_allergies);
      this.setState(
        {
          alergyExist:
            props.patient_allergies.length > 0 ? " AllergyActive" : "",
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
                allergyList: g.getSource(),
              };
            })
            .toArray(),
        },
        () => {
          this.showAllergyAlert(props.patient_allergies);
        }
      );
    } else {
      this.setState({
        alergyExist: "",
        patientAllergies: [],
      });
    }
  }

  openUCAFReport(data, e) {
    const {
      chief_complaint,
      // significant_signs,
      vitals_mandatory,
      current_patient,
      visit_id,
    } = Window.global;
    // let chief_complaint = Window.global["chief_complaint"];
    // let significant_signs = Window.global["significant_signs"];
    const _Vitals =
      this.props.patient_vitals !== undefined &&
      this.props.patient_vitals.length > 0
        ? Enumerable.from(this.props.patient_vitals)
            .groupBy("$.visit_date", null, (k, g) => {
              return g.getSource();
            })
            .orderBy((g) => g.visit_date)
            .lastOrDefault()
        : [];

    if (!chief_complaint || chief_complaint.length < 4) {
      swalMessage({
        title: "Please enter chief complaint.",
        type: "warning",
      });
    }
    // else if (significant_signs === null || significant_signs.length < 4) {
    //   swalMessage({
    //     title: "Please enter significant signs.",
    //     type: "warning",
    //   });
    // }
    else if (
      _Vitals.length === 0 &&
      // Window.global["vitals_mandatory"] === "Y"
      vitals_mandatory === "Y"
    ) {
      swalMessage({
        title: "Enter All Vitals...",
        type: "warning",
      });
    } else {
      let that = this;
      algaehApiCall({
        uri: "/ucaf/getPatientUCAF",
        method: "GET",
        data: {
          patient_id: current_patient, //Window.global["current_patient"],
          visit_id: visit_id, //Window.global["visit_id"],
          // forceReplace: true,
        },
        onSuccess: (response) => {
          if (response.data.success) {
            that.setState({ openUCAF: true, UCAFData: response.data.records });
          }
        },
        onFailure: (error) => {
          swalMessage({
            title: error.response.data.message,
            type: "warning",
          });
        },
      });
    }
  }

  openDCAFReport(data, e) {
    const {
      chief_complaint,
      // significant_signs,
      vitals_mandatory,
      current_patient,
      visit_id,
    } = Window.global;
    // let chief_complaint = Window.global["chief_complaint"];
    // let significant_signs = Window.global["significant_signs"];
    const _Vitals =
      this.props.patient_vitals !== undefined &&
      this.props.patient_vitals.length > 0
        ? Enumerable.from(this.props.patient_vitals)
            .groupBy("$.visit_date", null, (k, g) => {
              return g.getSource();
            })
            .orderBy((g) => g.visit_date)
            .lastOrDefault()
        : [];

    if (
      chief_complaint === null ||
      chief_complaint === undefined ||
      chief_complaint.length < 4
    ) {
      swalMessage({
        title: "Please enter chief complaint.",
        type: "warning",
      });
    }
    // else if (significant_signs === null || significant_signs.length < 4) {
    //   swalMessage({
    //     title: "Please enter significant signs.",
    //     type: "warning",
    //   });
    // }
    else if (
      _Vitals.length === 0 &&
      // Window.global["vitals_mandatory"] === "Y"
      vitals_mandatory === "Y"
    ) {
      swalMessage({
        title: "Enter All Vitals...",
        type: "warning",
      });
    } else {
      let that = this;
      algaehApiCall({
        uri: "/dcaf/getPatientDCAF",
        method: "GET",
        data: {
          patient_id: current_patient, //Window.global["current_patient"],
          visit_id: visit_id, //Window.global["visit_id"]
          // forceReplace: true
        },
        onSuccess: (response) => {
          if (response.data.success) {
            that.setState({ openDCAF: true, DCAFData: response.data.records });
          }
        },
        onFailure: (error) => {
          swalMessage({
            title: error.response.data.message,
            type: "warning",
          });
        },
      });
    }
  }

  openOCAFReport(data, e) {
    const {
      chief_complaint,
      // significant_signs,
      vitals_mandatory,
      current_patient,
      visit_id,
    } = Window.global;
    // let chief_complaint = Window.global["chief_complaint"];
    // let significant_signs = Window.global["significant_signs"];
    const _Vitals =
      this.props.patient_vitals !== undefined &&
      this.props.patient_vitals.length > 0
        ? Enumerable.from(this.props.patient_vitals)
            .groupBy("$.visit_date", null, (k, g) => {
              return g.getSource();
            })
            .orderBy((g) => g.visit_date)
            .lastOrDefault()
        : [];

    if (
      chief_complaint === undefined ||
      chief_complaint === null ||
      chief_complaint.length < 4
    ) {
      swalMessage({
        title: "Please enter chief complaint.",
        type: "warning",
      });
    }
    //  else if (significant_signs === null || significant_signs.length < 4) {
    //   swalMessage({
    //     title: "Please enter significant signs.",
    //     type: "warning",
    //   });
    // }
    else if (
      _Vitals.length === 0 &&
      // Window.global["vitals_mandatory"] === "Y"
      vitals_mandatory === "Y"
    ) {
      swalMessage({
        title: "Enter All Vitals...",
        type: "warning",
      });
    } else {
      let that = this;
      algaehApiCall({
        uri: "/ocaf/getPatientOCAF",
        method: "GET",
        data: {
          patient_id: current_patient, //Window.global["current_patient"],
          visit_id: visit_id, //Window.global["visit_id"]
        },
        onSuccess: (response) => {
          if (response.data.success) {
            that.setState({ openOCAF: true, OCAFData: response.data.records });
          }
        },
        onFailure: (error) => {
          swalMessage({
            title: error.response.data.message,
            type: "warning",
          });
        },
      });
    }
  }

  showAllergyAlert(_patient_allergies) {
    if (this.state.showAllergyPopup && _patient_allergies.length > 0) {
      swalMessage({
        title: "Alergy Exists...",
        type: "warning",
      });
      this.setState({ showAllergyPopup: false });
    }
  }
  decissionAllergyOnSet(row) {
    const _onSet = Enumerable.from(GlobalVariables.ALLERGY_ONSET)
      .where((w) => w.value === row.onset)
      .firstOrDefault();
    if (_onSet !== undefined) {
      return _onSet.name;
    } else return "";
  }
  renderBackButton(e) {
    this.props.getPatientProfile({
      redux: {
        type: "PATIENT_PROFILE",
        mappingName: "patient_profile",
        data: [],
      },
    });
    setCookie("ScreenName", "DoctorsWorkbench");
    setGlobal({ "EHR-STD": "DoctorsWorkbench" });

    //document.getElementById("ehr-router").click();
    this.props.history.push("/DoctorsWorkbench");
  }

  renderDCAFReport() {
    return (
      <AlgaehModalPopUp
        openPopup={this.state.openDCAF}
        title="DCAF 2.0"
        events={{
          onClose: () => {
            this.setState({ openDCAF: false });
          },
        }}
      >
        <DcafEditor
          dataProps={this.state.DCAFData}
          onReloadClose={{
            onClose: () => {
              this.setState({ openDCAF: false }, () => {
                this.setState({ openDCAF: true });
              });
            },
          }}
        />
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
          },
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
          },
        }}
      >
        <UcafEditor dataProps={this.state.UCAFData} />
      </AlgaehModalPopUp>
    );
  }

  OpenMrdHandler(_pat_profile, e) {
    // let chief_complaint = Window.global["chief_complaint"];
    // let significant_signs = Window.global["significant_signs"];
    // const _Vitals =
    //   this.props.patient_vitals !== undefined &&
    //   this.props.patient_vitals.length > 0
    //     ? Enumerable.from(this.props.patient_vitals)
    //         .groupBy("$.visit_date", null, (k, g) => {
    //           return g.getSource();
    //         })
    //         .orderBy(g => g.visit_date)
    //         .lastOrDefault()
    //     : [];

    // if (
    //   chief_complaint === null ||
    //   chief_complaint === undefined ||
    //   chief_complaint.length < 4
    // ) {
    //   swalMessage({
    //     title: "Please enter chief complaint.",
    //     type: "warning"
    //   });
    // } else if (
    //   significant_signs === null ||
    //   significant_signs === undefined ||
    //   significant_signs.length < 4
    // ) {
    //   swalMessage({
    //     title: "Please enter significant signs.",
    //     type: "warning"
    //   });
    // } else if (
    //   _Vitals.length === 0 &&
    //   // Window.global["vitals_mandatory"] === "Y"
    //   vitals_mandatory === "Y"
    // ) {
    //   swalMessage({
    //     title: "Enter All Vitals...",
    //     type: "warning"
    //   });
    // } else {
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
      nationality: _pat_profile.nationality,
      gender: details["gender"],
    });
    this.setState({
      pageDisplay: page,
    });
    // }
  }

  goback = () => {
    if (!Window.global) {
      this.props.history.push({
        pathname: "/DoctorsWorkbench",
      });
    }
  };

  checkChronicExists(isExists) {
    this.setState({ chronicExists: isExists });
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
        ? _.head(this.props.patient_vitals)?.list
        : [];
    // const _Vitals =
    //   this.props.patient_vitals !== undefined &&
    //   this.props.patient_vitals.length > 0
    //     ? _.chain(this.props.patient_vitals)
    //         .uniqBy((u) => u.vital_id)
    //         .orderBy((o) => o.sequence_order)
    //         .value()
    //     : [];

    const _patient_allergies = this.state.patientAllergies;

    const _diagnosis =
      this.props.patient_diagnosis === undefined
        ? []
        : this.props.patient_diagnosis;

    const _diet =
      this.props.patient_diet === undefined ? [] : this.props.patient_diet;

    console.log("_Vitals", _Vitals);

    return (
      <MyContext.Provider
        value={{
          state: { updateChronic: this.state.updateChronic },
          updateState: (obj) => {
            console.log("obj", obj);
            this.setState({ ...obj });
          },
        }}
      >
        <div className="row patientProfile">
          <div className="patientInfo-Top box-shadow-normal">
            {/* <div className="backBtn">
            <button
              id="btn-outer-component-load"
              className="d-none"
                onClick={this.setPatientGlobalParameters.bind(this)}
            />
            <button
              onClick={this.renderBackButton.bind(this)}
              type="button"
              className="btn btn-outline-secondary btn-sm"
            >
              <i className="fas fa-angle-double-left fa-lg" />
              Back
            </button>
          </div> */}
            <div className="patientImg">
              <AlgaehFile
                name="attach_photo"
                accept="image/*"
                textAltMessage={_pat_profile.full_name}
                showActions={false}
                serviceParameters={{
                  uniqueID: _pat_profile.patient_code,
                  destinationName: _pat_profile.patient_code,
                  fileType: "Patients",
                }}
                forceRefresh={true}
              />

              <div className="patientDemoHover animated slideInDown faster">
                <table>
                  <tbody>
                    <tr>
                      <td rowspan="17" className="imgSection">
                        {" "}
                        <p className="patProImg">
                          {" "}
                          <AlgaehFile
                            name="attach_photo"
                            accept="image/*"
                            textAltMessage={_pat_profile.full_name}
                            showActions={false}
                            serviceParameters={{
                              uniqueID: _pat_profile.patient_code,
                              destinationName: _pat_profile.patient_code,
                              fileType: "Patients",
                            }}
                            forceRefresh={true}
                          />
                        </p>
                        <p className="idCardImg">
                          <AlgaehFile
                            noImage="ID-card"
                            name="patientIdCard"
                            accept="image/*"
                            textAltMessage={_pat_profile.full_name}
                            showActions={false}
                            serviceParameters={{
                              uniqueID: _pat_profile.primary_id_no,
                              destinationName: _pat_profile.patient_code,
                              fileType: "Patients",
                            }}
                            forceRefresh={true}
                          />
                        </p>
                      </td>
                      <td colspan="2" className="hdr">
                        <span>Personal Details:-</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Full Name:</td>
                      <td>{_pat_profile.full_name}</td>
                    </tr>
                    <tr>
                      <td>Arabic Name:</td>
                      <td>{_pat_profile.arabic_name}</td>
                    </tr>
                    <tr>
                      <td>Age & Gender:</td>
                      <td>
                        {" "}
                        {_pat_profile.gender} - {_pat_profile.age_in_years}y,
                        {_pat_profile.age_in_months}m,{" "}
                        {_pat_profile.age_in_days}d
                      </td>
                    </tr>
                    <tr>
                      <td>MRN:</td>
                      <td>{_pat_profile.patient_code}</td>
                    </tr>
                    <tr>
                      <td>{_pat_profile.identity_document_name}:</td>
                      <td>{_pat_profile.primary_id_no}</td>
                    </tr>
                    <tr>
                      <td>Blood Group:</td>
                      <td>{_pat_profile.blood_group}</td>
                    </tr>
                    <tr>
                      <td>Marital Status:</td>
                      <td>{_pat_profile.marital_status}</td>
                    </tr>
                    <tr>
                      <td>Nationality:</td>
                      <td>{_pat_profile.nationality}</td>
                    </tr>
                    <tr>
                      <td>Payment Type:</td>
                      <td>
                        {_pat_profile.payment_type === "I"
                          ? "Insurance"
                          : _pat_profile.payment_type === "S"
                          ? "Self"
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" className="hdr">
                        <span>Contact Details:-</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Address:</td>
                      <td>{_pat_profile.patient_address}</td>
                    </tr>{" "}
                    <tr>
                      <td>Primary No.:</td>
                      <td>
                        {_pat_profile.tel_code} {_pat_profile.contact_number}
                      </td>
                    </tr>
                    <tr>
                      <td>Secondary No.:</td>
                      <td>{_pat_profile.secondary_contact_number}</td>
                    </tr>{" "}
                    <tr>
                      <td>Emergency No:</td>
                      <td>{_pat_profile.emergency_contact_number}</td>
                    </tr>{" "}
                    <tr>
                      <td>Emergency Contact Person:</td>
                      <td>{_pat_profile.emergency_contact_name}</td>
                    </tr>{" "}
                    <tr>
                      <td>Relationship:</td>
                      <td>{_pat_profile.relationship_with_patient}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                Nationality:
                <b patient_nationality="true">{_pat_profile.nationality}</b>
              </span>
              <span>
                {_pat_profile.identity_document_name}:
                <b>{_pat_profile.primary_id_no} </b>
              </span>
              {/* <span>
              Payment:<b>
                {_pat_profile.payment_type === "I"
                  ? "Insurance"
                  : _pat_profile.payment_type === "S"
                  ? "Self"
                  : ""}
              </b>
            </span> */}
            </div>
            <div className="patientHospitalDetail">
              <span>
                MRN:
                <b>{_pat_profile.patient_code}</b>
              </span>
              <span>
                Previous Encounter:
                <b>
                  {_pat_profile.previous_en_date === null
                    ? "-------"
                    : moment(_pat_profile.previous_en_date).format(
                        "DD-MM-YYYY | hh:mm a"
                      )}
                </b>
              </span>
              <span>
                Current Encounter:
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
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
              >
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
                  <span onClick={this.showSickLeave.bind(this)}>
                    Sick Leave
                  </span>
                </li>
                <li>
                  <span onClick={this.showPatientAttendance.bind(this)}>
                    Patient Attendance
                  </span>
                </li>
                <li>
                  <span onClick={this.printGeneralConsentForm.bind(this)}>
                    General Consent Form
                  </span>
                </li>
                <li>
                  <span onClick={this.printMedicalConsentForm.bind(this)}>
                    Medical Consent Form
                  </span>
                </li>
                {/* <li onClick={this.openUCAFReport.bind(this, _pat_profile)}>
                <span>UCAF Report</span>
              </li>

              <li onClick={this.openDCAFReport.bind(this, _pat_profile)}>
                <span>DCAF Report</span>
              </li> */}
                {this.state.department_type === "D" ? (
                  <li onClick={this.openDCAFReport.bind(this, _pat_profile)}>
                    <span>DCAF Report</span>
                  </li>
                ) : this.state.department_type === "O" ? (
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
            {
              <ul className="nav">
                <li className="nav-item">
                  <span
                    onClick={this.changeTabs}
                    algaehsoap="subjective"
                    className="nav-link active"
                  >
                    SOAP
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

                {this.state.department_type === "D" ? (
                  <li className="nav-item">
                    <span
                      onClick={this.changeTabs}
                      algaehsoap="dental"
                      className="nav-link"
                    >
                      Dental
                    </span>
                  </li>
                ) : this.state.department_type === "O" ? (
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
                {this.state.department_type === "P" ? (
                  <>
                    <li className="nav-item">
                      <span
                        onClick={this.changeTabs}
                        algaehsoap="growthCharts"
                        className="nav-link"
                      >
                        Growth Charts
                      </span>
                    </li>
                    <li className="nav-item">
                      <span
                        onClick={this.changeTabs}
                        algaehsoap="growthChartsNew"
                        className="nav-link"
                      >
                        Growth Charts Alpha
                      </span>
                    </li>
                  </>
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
                    onClick={this.OpenMrdHandler.bind(this, _pat_profile)} //this.OpenMrdHandler.bind(this)}
                    algaehsoap="mrd"
                    className="nav-link"
                  >
                    Previous Encounters
                  </span>
                </li>
                <ul className="float-right patient-quick-info">
                  <li>
                    {/* AllergyActive */}
                    <i
                      className={`fas fa-book-medical ${
                        this.state.chronicExists ? "AllergyActive" : ""
                      }`}
                    />
                    <section>
                      <span className="top-nav-sec-hdg">
                        Chronic Conditions
                      </span>

                      <Chronic
                        updateChronic={this.state.updateChronic}
                        checkChronicExists={(boolType) => {
                          this.checkChronicExists(boolType);
                        }}
                      />
                    </section>
                  </li>
                  <li>
                    <i
                      className={"fas fa-allergies" + this.state.alergyExist}
                    />
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
                      <span className="top-nav-sec-hdg">Diet</span>
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
            }
          </div>
          <div className="patientContentArea">
            {this.state.pageDisplay === "overview" ? (
              <Overview />
            ) : this.state.pageDisplay === "subjective" ? (
              <MyContext.Provider
                value={{
                  state: this.state,
                  updateState: (obj) => {
                    this.setState({ ...obj });
                  },
                }}
              >
                <BasicSubjective
                  vat_applicable={this.vatApplicable()}
                  date_of_birth={_pat_profile.date_of_birth}
                  gender={_pat_profile.gender}
                  pat_profile={_pat_profile}
                />
              </MyContext.Provider>
            ) : this.state.pageDisplay === "exam_diagram" ? (
              <Suspense
                fallback={
                  <div className="loader-container">
                    <div className="algaeh-progress float shadow">
                      <div className="progress__item">loading</div>
                    </div>
                  </div>
                }
              >
                <ExamDiagramStandolone />
              </Suspense>
            ) : this.state.pageDisplay === "eye" ? (
              <Eye />
            ) : this.state.pageDisplay === "dental" ? (
              <Dental
                vat_applicable={this.vatApplicable()}
                age_in_years={_pat_profile.age_in_years}
                patient_code={_pat_profile.patient_code}
              />
            ) : this.state.pageDisplay === "summary" ? (
              <Summary />
            ) : this.state.pageDisplay === "mrd" ? (
              <PatientMRD fromClinicalDesk={true} />
            ) : this.state.pageDisplay === "growthCharts" ? (
              <GrowthCharts patient={this.props?.patient_profile[0]} />
            ) : this.state.pageDisplay === "growthChartsNew" ? (
              <GrowthChartsNew patient={this.props?.patient_profile[0]} />
            ) : null}
          </div>
          {this.renderUCAFReport()}
          {this.renderDCAFReport()}
          {this.renderOCAFReport()}
          <SickLeave
            openSickLeave={this.state.openSickLeave}
            onClose={this.showSickLeave.bind(this)}
            patient_diagnosis={_diagnosis}
          />
          <PatientAttendance
            openPatientAttendance={this.state.openPatientAttendance}
            onClose={this.showPatientAttendance.bind(this)}
          />
        </div>
      </MyContext.Provider>
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
    patient_history: state.patient_history,
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
      getLocation: AlgaehActions,
      //getPatientHistory: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientProfile)
);
