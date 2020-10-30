import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./subjective.scss";

import {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlgaehDataGrid,
} from "../../Wrapper/algaehWrapper";
import Vitals from "../Vitals/Vitals";
import LabResults from "../Assessment/LabResult/LabResult";
import RadResults from "../Assessment/RadResult/RadResult";
import Delta from "../Delta";
import Enumerable from "linq";
import { AlgaehActions } from "../../../actions/algaehActions";
import OrderedList from "../Assessment/OrderedList/OrderedList";
import Plan from "../Plan/Plan";
import {
  algaehApiCall,
  swalMessage,
  maxCharactersLeft,
} from "../../../utils/algaehApiCall";
import SubjectiveHandler from "./SubjectiveHandler";
import PatientHistory from "../PatientHistory/PatientHistory";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import Allergies from "../Allergies/Allergies";
import Examination from "../Examination/Examination";
import { Validations } from "./Validation";
// import { setGlobal } from "../../../utils/GlobalFunctions";
import "./basicSubjective.scss";
import _ from "lodash";
import moment from "moment";
import { Dimmer, Loader } from "semantic-ui-react";
import { PatientAttachments } from "../../PatientRegistrationNew/PatientAttachment";
import { printPrescription } from "../PatientProfileHandlers";
class BasicSubjective extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageDisplay: "Orders",
      openMedication: false,
      openMedicaldata: false,
      openDiet: false,
      openVital: false,
      openAlergy: false,
      openExamnModal: null,
      chief_complaint: "",
      duration: null,
      significant_signs: "",
      other_signs: "",
      interval: null,
      onset_date: null,
      pain: null,
      severity: null,
      chronic: null,
      complaint_type: null,
      isPregnancy: false,
      hims_f_episode_chief_complaint_id: null,
      recent_mediction: [],
      all_mediction: [],
      active_medication: [],
      loadingUnderMedication: true,
      deltaOpen: false,
    };
    this.isMale = Window?.global?.gender === "Male" ? true : false; // String(Window["global"]["gender"]) === "Male" ? true : false;
    this.chiefComplaintMaxLength = 200;
    this.significantSignsLength = 250;
    this.otherConditionMaxLength = 250;
    this.getPatientEncounterDetails();
    this.complaintType = [];
    SubjectiveHandler().getPatientChiefComplaints(this);
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
    });

    value.value === "PREGNANCY"
      ? this.setState({
          isPregnancy: true,
        })
      : this.setState({
          isPregnancy: false,
          lmp_days: "",
        });
  }
  datehandle(e) {
    SubjectiveHandler().datehandle(this, e);
  }
  ChangeEventHandler(e) {
    SubjectiveHandler().ChangeEventHandler(this, e);
  }

  onchangegridcol(row, from, e) {
    SubjectiveHandler().onchangegridcol(this, row, from, e);
  }

  deleteFinalDiagnosis(row) {
    SubjectiveHandler().deleteFinalDiagnosis(this, row);
  }
  updateDiagnosis(row) {
    SubjectiveHandler().updateDiagnosis(this, row);
  }
  IcdsSearch(diagType) {
    SubjectiveHandler().IcdsSearch(this, diagType);
  }
  dataLevelUpdate(e) {
    SubjectiveHandler().dataLevelUpdate(this, e);
  }
  openTab(e) {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      var element = document.querySelectorAll("[algaehtabs]");
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove("active");
      }
      e.currentTarget.classList.add("active");
      var specified = e.currentTarget.getAttribute("algaehtabs");
      this.setState({
        pageDisplay: specified,
      });
    }
  }

  getPatientMedications() {
    const { current_patient } = Window.global;
    this.setState(
      {
        loadingUnderMedication: true,
      },
      () => {
        algaehApiCall({
          uri: "/orderMedication/getPatientMedications",
          data: { patient_id: current_patient }, //Window.global["current_patient"] },
          method: "GET",
          onSuccess: (response) => {
            const data = { loadingUnderMedication: false };
            if (response.data.success) {
              data["recent_mediction"] = response.data.records.latest_mediction;
              data["all_mediction"] = response.data.records.all_mediction;
              data["active_medication"] =
                response.data.records.active_medication;
            }
            this.setState({
              ...data,
            });
          },
          onFailure: (error) => {
            swalMessage({
              title: error.message,
              type: "error",
            });
          },
        });
      }
    );
  }

  getPatientEncounterDetails() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientEncounter",
      method: "GET",
      data: {
        encounter_id: Window?.global?.encounter_id, //Window.global.encounter_id
      },
      onSuccess: (response) => {
        let data = response.data.records[0];
        if (response.data.success) {
          this.setState(
            {
              significant_signs: data.significant_signs,
              other_signs: data.other_signs,
            },
            () => {
              Window.global["significant_signs"] = this.state.significant_signs;
              Window.global["other_signs"] = this.state.other_signs;
            }
          );

          // setGlobal({
          //   significant_signs: data.significant_signs
          // });
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
  componentWillUnmount() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
    }
  }

  showAllergies() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      this.setState({
        openAlergy: !this.state.openAlergy,
      });
    }
  }
  showMedication() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      this.setState({
        openMedication: !this.state.openMedication,
      });
    }
  }

  showMedicalData() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      this.setState({
        openMedicaldata: !this.state.openMedicaldata,
      });
    }
  }

  showDelta() {
    this.setState({
      deltaOpen: !this.state.deltaOpen,
    });
  }

  showAttachments() {
    this.setState({
      attachmentOpen: !this.state.attachmentOpen,
    });
  }

  showPatientHistory() {
    this.setState({
      openAddModal: !this.state.openAddModal,
    });
  }

  showDietPlan() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      this.setState({
        openDiet: !this.state.openDiet,
      });
    }
  }

  closeDietPlan() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      const { current_patient, episode_id } = Window.global;
      this.setState(
        {
          openDiet: !this.state.openDiet,
        },
        () => {
          this.props.getPatientDiet({
            uri: "/doctorsWorkBench/getPatientDiet",
            method: "GET",
            data: {
              patient_id: current_patient, //Window.global["current_patient"],
              episode_id: episode_id, //Window.global["episode_id"]
            },
            cancelRequestId: "getPatientDiet",
            redux: {
              type: "PATIENT_DIET",
              mappingName: "patient_diet",
            },
          });
        }
      );
    }
  }

  showVitals() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      this.setState({
        openVital: !this.state.openVital,
      });
    }
  }

  closeVitals() {
    this.setState({
      openVital: !this.state.openVital,
    });
  }

  showPhysicalExamination() {
    this.setState({
      openExamnModal: !this.state.openExamnModal,
    });
  }

  textAreaEvent(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value,
    });
    Window.global[name] = value;
    // if (name === "chief_complaint") {

    // setGlobal({
    //   chief_complaint: value
    // });
    //  }
    // if (name === "significant_signs") {
    //   setGlobal({
    //     significant_signs: value
    //   });
    // }
  }
  componentDidMount() {
    this.getPatientMedications();
    if (this.isMale) {
      this.complaintType = Enumerable.from(GlobalVariables.COMPLAINT_TYPE)
        .where((w) => w["value"] !== "PREGNANCY")
        .toArray();
    } else {
      this.complaintType = GlobalVariables.COMPLAINT_TYPE;
    }
  }
  render() {
    const _diagnosis =
      this.props.patient_diagnosis !== undefined
        ? this.props.patient_diagnosis
        : [];
    const _finalDiagnosis = Enumerable.from(_diagnosis)
      .where((w) => w.final_daignosis === "Y")
      .toArray();
    const recentMediction = _.chain(this.state.active_medication)
      .groupBy((g) => moment(g.prescription_date).format("YYYYMMDD"))
      .map((details, key) => {
        const month = moment(key, "YYYYMMDD").format("MMM");
        const day = moment(key, "YYYYMMDD").format("DD");
        const year = moment(key, "YYYYMMDD").format("YYYY");
        return {
          date: key,
          month: month,
          day: day,
          year: year,
          details: details,
        };
      })
      .value();

    return (
      <div className="subjective basicSubjective">
        <div className="row margin-top-15">
          <div className="algaeh-fixed-right-menu">
            <ul className="rightActionIcon">
              <li>
                <span className="animated slideInLeft faster">Vitals</span>
                <i
                  className="fas fa-heartbeat"
                  onClick={this.showVitals.bind(this)}
                />
              </li>
              <Vitals
                openVital={this.state.openVital}
                onClose={this.closeVitals.bind(this)}
              />
              <li>
                <span className="animated slideInLeft faster">Allergies</span>
                <i
                  className="fas fa-allergies"
                  onClick={this.showAllergies.bind(this)}
                />
              </li>
              <Allergies
                openAllergyModal={this.state.openAlergy}
                onClose={this.showAllergies.bind(this)}
              />
              <li>
                <span className="animated slideInLeft faster">History</span>
                <i
                  className="fas fa-hourglass-half"
                  onClick={this.showPatientHistory.bind(this)}
                />
              </li>
              <PatientHistory
                openAddModal={this.state.openAddModal}
                onClose={this.showPatientHistory.bind(this)}
              />
              <li>
                <span className="animated slideInLeft faster">Examination</span>
                <i
                  className="fas fa-clipboard"
                  onClick={this.showPhysicalExamination.bind(this)}
                />
              </li>
              <Examination
                openExamnModal={this.state.openExamnModal}
                onClose={this.showPhysicalExamination.bind(this)}
              />
              <li>
                <span className="animated slideInLeft faster">Medication</span>
                <i
                  className="fas fa-pills"
                  onClick={this.showMedication.bind(this)}
                />
              </li>
              <Plan
                mainState={this}
                openMedication={this.state.openMedication}
                onClose={this.showMedication.bind(this)}
                vat_applicable={this.props.vat_applicable}
              />
              <li>
                <span className="animated slideInLeft faster">Diet Plan</span>
                <i
                  className="fas fa-utensils"
                  onClick={this.showDietPlan.bind(this)}
                />
              </li>
              <Plan
                mainState={this}
                openDiet={this.state.openDiet}
                onClose={this.closeDietPlan.bind(this)}
              />
              <li>
                <span className="animated slideInLeft faster">
                  Other Details
                </span>
                <i
                  className="fas fa-notes-medical"
                  onClick={this.showMedicalData.bind(this)}
                />
              </li>
              <Plan
                mainState={this}
                openMedicaldata={this.state.openMedicaldata}
                onClose={this.showMedicalData.bind(this)}
              />
              <li>
                <span className="animated slideInLeft faster">Delta</span>
                <i
                  className="fas fa-chart-line"
                  onClick={this.showDelta.bind(this)}
                />
              </li>
              <Delta
                state={this.state}
                visible={this.state.deltaOpen}
                onCancel={this.showDelta.bind(this)}
              />
              <li>
                <span className="animated slideInLeft faster">Attachments</span>
                <i
                  className="fas fa-paperclip"
                  onClick={this.showAttachments.bind(this)}
                />
              </li>
              <PatientAttachments
                visible={this.state.attachmentOpen}
                onClose={this.showAttachments.bind(this)}
                patientData={{
                  hims_d_patient_id: Window?.global?.current_patient,
                  patient_code: this.props.pat_profile?.patient_code,
                }}
                onlyShow={true}
              />
            </ul>
          </div>
          <div className="algaeh-col-3">
            <div className="row">
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15 mandatoryBox">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">
                        Chief Complaints & Main Symptoms
                      </h3>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12">
                            <textarea
                              value={
                                this.state.chief_complaint === null ||
                                this.state.chief_complaint === undefined
                                  ? ""
                                  : this.state.chief_complaint
                              }
                              name="chief_complaint"
                              onChange={this.textAreaEvent.bind(this)}
                              maxLength={this.chiefComplaintMaxLength}
                            />

                            <small className="float-right">
                              Max Char.{" "}
                              {maxCharactersLeft(
                                this.chiefComplaintMaxLength,
                                this.state.chief_complaint
                              )}
                              /{this.chiefComplaintMaxLength}
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row">
                          <AlgaehDateHandler
                            div={{ className: "col-8" }}
                            label={{
                              forceLabel: "Onset Date",
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "onset_date",
                            }}
                            maxDate={new Date()}
                            events={{
                              onChange: this.datehandle.bind(this),
                            }}
                            dontAllow={"future"}
                            value={this.state.onset_date}
                          />

                          <AlagehAutoComplete
                            div={{ className: "col-4 paddingLeft-0 " }}
                            label={{ forceLabel: "Interval", isImp: false }}
                            selector={{
                              name: "interval",
                              className: "select-fld",
                              value: this.state.interval,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.PAIN_DURATION,
                              },
                              onChange: this.dataLevelUpdate.bind(this),
                            }}
                          />

                          <AlagehFormGroup
                            div={{ className: "col-4" }}
                            label={{
                              forceLabel: "Duration",
                              isImp: false,
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "duration",
                              number: true,
                              value: this.state.duration,
                              events: {
                                onChange: this.dataLevelUpdate.bind(this),
                              },
                              others: {
                                min: 0,
                              },
                            }}
                          />
                          <AlagehAutoComplete
                            div={{
                              className: "col-4  paddingRight-0 paddingLeft-0",
                            }}
                            label={{
                              forceLabel: "Comp. Type",
                              isImp: false,
                            }}
                            selector={{
                              name: "complaint_type",
                              className: "select-fld",
                              value: this.state.complaint_type,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: this.complaintType,
                              },
                              onChange: this.dropDownHandler.bind(this),
                            }}
                          />

                          {this.isMale ? null : (
                            <AlagehFormGroup
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "LMP (Days)",
                                isImp: false,
                              }}
                              textBox={{
                                className: "txt-fld",
                                name: "lmp_days",
                                number: { allowNegative: false },
                                value: this.state.lmp_days,
                                disabled: !this.state.isPregnancy,
                                events: {
                                  onChange: this.ChangeEventHandler.bind(this),
                                },
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15 mandatoryBox">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Significant Signs</h3>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12">
                        <textarea
                          value={
                            this.state.significant_signs === null ||
                            this.state.significant_signs === undefined
                              ? ""
                              : this.state.significant_signs
                          }
                          name="significant_signs"
                          onChange={this.textAreaEvent.bind(this)}
                          maxLength={this.significantSignsLength}
                        />
                        <small className="float-right">
                          Max Char.{" "}
                          {maxCharactersLeft(
                            this.significantSignsLength,
                            this.state.significant_signs
                          )}
                          /{this.significantSignsLength}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Other Conditions</h3>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12">
                        <textarea
                          value={
                            this.state.other_signs === null ||
                            this.state.other_signs === undefined
                              ? ""
                              : this.state.other_signs
                          }
                          name="other_signs"
                          onChange={this.textAreaEvent.bind(this)}
                          maxLength={this.otherConditionMaxLength}
                        />
                        <small className="float-right">
                          Max Char.{" "}
                          {maxCharactersLeft(
                            this.otherConditionMaxLength,
                            this.state.other_signs
                          )}
                          / {this.otherConditionMaxLength}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="algaeh-col-8">
            <div className="row">
              <div className="col-7">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Diagnosis</h3>
                    </div>
                    <div className="actions">
                      <button
                        className="btn btn-primary btn-circle active"
                        onClick={this.IcdsSearch.bind(this, "Final")}
                      >
                        <i className="fas fa-plus" />
                      </button>
                    </div>
                  </div>

                  <div className="portlet-body">
                    <div id="finalDioGrid" className="row">
                      <div className="col-lg-12">
                        <AlgaehDataGrid
                          id="Finalintial_icd"
                          columns={[
                            {
                              fieldName: "diagnosis_type",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Type",
                                  }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return row.diagnosis_type === "P"
                                  ? "Primary"
                                  : "Secondary";
                              },
                              editorTemplate: (row) => {
                                return (
                                  <AlagehAutoComplete
                                    div={{}}
                                    selector={{
                                      name: "diagnosis_type",
                                      className: "select-fld",
                                      value: row.diagnosis_type,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.DIAG_TYPE,
                                      },
                                      onChange: this.onchangegridcol.bind(
                                        this,
                                        row,
                                        "Final"
                                      ),
                                    }}
                                  />
                                );
                              },
                              others: { maxWidth: 70, align: "center" },
                            },
                            {
                              fieldName: "icd_code",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "ICD Code",
                                  }}
                                />
                              ),
                              others: {
                                disabled: true,
                                maxWidth: 70,
                                align: "center",
                              },
                            },
                            {
                              fieldName: "icd_description",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Description",
                                  }}
                                />
                              ),
                              others: { disabled: true },
                            },
                          ]}
                          keyId="code"
                          dataSource={{
                            // data: _finalDiagnosis
                            data: _finalDiagnosis,
                          }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 5 }}
                          events={{
                            onDelete: this.deleteFinalDiagnosis.bind(this),
                            onEdit: (row) => {},

                            onDone: this.updateDiagnosis.bind(this),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-5" style={{ paddingLeft: 0 }}>
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Under Medication</h3>
                    </div>

                    <div className="actions">
                      {" "}
                      <button
                        className="btn btn-circle"
                        onClick={printPrescription.bind(this, this)}
                        style={{ marginRight: 5 }}
                      >
                        <i className="fas fa-print" />
                        {/* <i className="fas fa-retweet" /> */}
                      </button>
                      <button
                        className="btn btn-primary btn-circle active"
                        onClick={this.showMedication.bind(this)}
                      >
                        <i className="fas fa-plus" />
                        {/* <i className="fas fa-retweet" /> */}
                      </button>
                    </div>
                  </div>

                  <div className="portlet-body">
                    <div className="activeMedication">
                      {this.state.loadingUnderMedication ? (
                        <Dimmer active>
                          <Loader inline="centered">Loading</Loader>
                        </Dimmer>
                      ) : (
                        <React.Fragment>
                          {recentMediction.map((item, index) => (
                            <div key={index} className="activeMedDateList">
                              <div className="medcineDate">
                                <span>{item.month}</span>
                                <h3>{item.day}</h3>
                                <span>{item.year}</span>

                                {/* <div className="printOnHover">
                                  <i className="fas fa-print" />
                                </div> */}
                              </div>
                              <div className="medcineList">
                                <ul>
                                  {item.details.map((medicine, indexD) => (
                                    <li key={indexD}>
                                      <b>
                                        {medicine.item_description !== undefined
                                          ? medicine.item_description.replace(
                                              /\w+/g,
                                              _.capitalize
                                            )
                                          : medicine.item_description}
                                      </b>
                                      {/* <small><span>4 ml</span> - <span>12 hourly (1-1-1)</span> * <span>5 days</span></small>*/}
                                      <small>{medicine.instructions}</small>
                                      <small>
                                        Medicine end date :{" "}
                                        {moment(medicine.enddate).format(
                                          "DD dddd MMMM YYYY"
                                        )}
                                      </small>
                                      <div className="deletePresItem">
                                        <i className="fas fa-trash" />
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="tab-container toggle-section">
                  <ul className="nav">
                    <li
                      algaehtabs={"Orders"}
                      className={"nav-item tab-button active"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Order Investigation",
                          }}
                        />
                      }
                    </li>

                    <li
                      algaehtabs={"OrderConsumable"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Order Consumable",
                          }}
                        />
                      }
                    </li>

                    <li
                      algaehtabs={"OrderPackage"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Order Package",
                          }}
                        />
                      }
                    </li>

                    <li
                      algaehtabs={"LabResults"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Lab Results",
                          }}
                        />
                      }
                    </li>
                    <li
                      algaehtabs={"RisResults"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "RIS Results",
                          }}
                        />
                      }
                    </li>
                  </ul>
                </div>

                <div className="grid-section">
                  {this.state.pageDisplay === "Orders" ? (
                    <OrderedList
                      vat_applicable={this.props.vat_applicable}
                      date_of_birth={this.props.date_of_birth}
                      gender={this.props.gender}
                      openData="Investigation"
                      chief_complaint={
                        this.state.chief_complaint === null ||
                        this.state.chief_complaint.length < 4
                          ? true
                          : false
                      }
                      significant_signs={
                        this.state.significant_signs === null ||
                        this.state.significant_signs.length < 4
                          ? true
                          : false
                      }
                    />
                  ) : this.state.pageDisplay === "OrderConsumable" ? (
                    <OrderedList
                      vat_applicable={this.props.vat_applicable}
                      openData="Consumable"
                    />
                  ) : this.state.pageDisplay === "OrderPackage" ? (
                    <OrderedList
                      vat_applicable={this.props.vat_applicable}
                      openData="Package"
                    />
                  ) : this.state.pageDisplay === "LabResults" ? (
                    <LabResults />
                  ) : this.state.pageDisplay === "RisResults" ? (
                    <RadResults />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_diagnosis: state.patient_diagnosis,
    patient_diet: state.patient_diet,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientDiagnosis: AlgaehActions,
      getPatientDiet: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BasicSubjective)
);
