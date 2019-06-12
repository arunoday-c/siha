import React, { Component } from "react";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import AlgaehFile from "../../Wrapper/algaehFileUpload";
import eventLogic from "./eventsLogic";
import _ from "lodash";
import { swalMessage, cancelRequest } from "../../../utils/algaehApiCall";
import GLOBALVARIABLE from "../../../utils/GlobalVariables.json";
export default class PatientDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPatientDashboard: false,
      isProcess: false,
      allVitals: [],
      hims_f_patient_visit_id: undefined,
      patientDiagnosis: []
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      showPatientDashboard: props.dashboard_state.showPatientDashboard,
      allVitals: [],
      isProcess: false,
      hims_f_patient_visit_id: undefined
    });
  }
  /* method to get vitals for the patients */
  getVitals(item) {
    item = item || undefined;
    let that = this;
    const { selectedPatientDetails } = this.props.dashboard_state;
    console.log("item", item);
    eventLogic()
      .getPatientVitials(item, selectedPatientDetails)
      .then(result => {
        that.setState({
          isProcess: true,
          allVitals: result,
          hims_f_patient_visit_id: item.hims_f_patient_visit_id
        });
      })
      .catch(error => {
        swalMessage({
          type: "error",
          title: error.message
        });
      });
    eventLogic()
      .getSelectDiagnosis({
        patient_id: item.hims_d_patient_id,
        episode_id: item.episode_id
      })
      .then(result => {
        that.setState({ isProcess: true, patientDiagnosis: result });
      })
      .catch(error => {
        swalMessage({
          type: "error",
          title: error.message
        });
      });
  }

  componentWillUnmount() {
    cancelRequest("ehr_vitals");
  }

  /* onchange handler for visit date change */
  onViewVistChange(ele) {
    this.setState({ hims_f_patient_visit_id: ele.value });
  }
  /* on diagnosis icd change */
  onChangeDiagnosis(e, item) {
    
  }

  /* method to render with selected patent data*/
  renderWithData() {
    const { selectedPatientDetails } = this.props.dashboard_state;
    const sortedDetails = eventLogic().patientDetails(selectedPatientDetails);

    const _internalPatientDetails =
      sortedDetails === undefined ? {} : sortedDetails;
    let encounterVisits =
      selectedPatientDetails === undefined
        ? []
        : eventLogic().visitsOrder(selectedPatientDetails);
    encounterVisits.unshift({ encounter_date: "New Visit", episode_id: 0 });

    const _hims_f_patient_visit_id =
      encounterVisits.length > 1 &&
      this.state.hims_f_patient_visit_id === undefined
        ? encounterVisits[1].hims_f_patient_visit_id
        : encounterVisits.length === 1 &&
          this.state.hims_f_patient_visit_id === undefined
        ? encounterVisits[0].hims_f_patient_visit_id
        : this.state.hims_f_patient_visit_id;

    if (!this.state.isProcess) {
      this.getVitals(
        selectedPatientDetails.length > 0
          ? selectedPatientDetails[0]
          : undefined
      );
    }
    // !this.state.isProcess
    //   ? this.getVitals(
    //       selectedPatientDetails.length > 0
    //         ? selectedPatientDetails[0]
    //         : undefined
    //     )
    //   : null;

    const _objSelected = eventLogic().getSelectedDateVitals(
      _hims_f_patient_visit_id,
      this.state.allVitals,
      encounterVisits
    );
    const _selectedDate = _objSelected.vitals;
    const _date = new Date(_objSelected.date).toLocaleDateString();
    const _topVitals = eventLogic().getTopLevelVitals(this.state.allVitals);
    return (
      <React.Fragment>
        <div className="patientDetailSection">
          <div className="row">
            <div className="col-12  patientMainInfo">
              <div className="row  PatientProfile">
                <div className="PatientInfo-Top box-shadow-normal">
                  <div className="PatientImg">
                    <AlgaehFile
                      name="attach_photo"
                      accept="image/*"
                      showActions={false}
                      serviceParameters={{
                        fileType: " Patients"
                      }}
                    />
                  </div>
                  <div className="PatientName">
                    <h6>
                      {_.startCase(
                        _.toLower(_internalPatientDetails.full_name)
                      )}
                    </h6>
                    <p>
                      <b>
                        {_internalPatientDetails.gender}
                        {_internalPatientDetails.years !== undefined
                          ? ", " + _internalPatientDetails.years
                          : ""}
                        {_internalPatientDetails.months !== undefined
                          ? " " + _internalPatientDetails.months
                          : ""}
                        {_internalPatientDetails.days !== undefined
                          ? " " + _internalPatientDetails.days
                          : ""}
                      </b>
                    </p>
                  </div>
                  <div className="PatientDemographic">
                    <span>
                      DOB:
                      <b>
                        {Date.parse(_internalPatientDetails.date_of_birth)
                          ? new Date(
                              _internalPatientDetails.date_of_birth
                            ).toLocaleDateString()
                          : ""}
                      </b>
                    </span>
                    <span>
                      Mob: <b>{_internalPatientDetails.contact_number}</b>
                    </span>
                    <span>
                      Nationality: <b>{_internalPatientDetails.nationality} </b>
                    </span>
                  </div>
                  <div className="PatientDemographic">
                    <span>
                      MRN: <b>{_internalPatientDetails.patient_code}</b>
                    </span>
                    <span>
                      Encounter:
                      <b>
                        {Date.parse(_internalPatientDetails.encounter_date)
                          ? new Date(
                              _internalPatientDetails.encounter_date
                            ).toLocaleString()
                          : ""}
                      </b>
                    </span>
                    <span>
                      Payment: <b>{_internalPatientDetails.payment_type} </b>
                    </span>
                  </div>
                  <div className="PatientVitals">
                    {_topVitals.length > 0
                      ? _topVitals.map((vital, index) => {
                          return (
                            <React.Fragment key={index}>
                              <span key={index}>
                                {vital.vital_short_name}:{" "}
                                <b>
                                  {parseFloat(
                                    vital.vital_value === null
                                      ? 0
                                      : vital.vital_value
                                  ).toFixed(2)}
                                </b>
                                <i>
                                  {vital.formula_value === "C" ||
                                  vital.formula_value === "F" ? (
                                    <sup>o</sup>
                                  ) : null}{" "}
                                  {vital.formula_value}
                                </i>
                              </span>
                            </React.Fragment>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="col patientReportSection">
              <div className="row patientChiefSec">
                <div className="col-12">
                  <h4 className="patientSecHdg">Chief Complaints</h4>
                </div>
                <div className="col-6">
                  <textarea className="chiefComplaintsTextArea" />
                </div>
              </div>
              <hr />
              <div className="row patientVitalsSec">
                <div className="col-12">
                  <h4 className="patientSecHdg">Vitals</h4>
                </div>
                {_selectedDate.length > 0 ? (
                  _selectedDate.map((vital, index) => {
                    return (
                      <div className="col" key={index}>
                        <h6>
                          <label>{vital.vital_short_name}</label>
                          {parseFloat(
                            vital.vital_value === undefined
                              ? 0
                              : vital.vital_value
                          ).toFixed(2)}{" "}
                          {vital.formula_value === "C" ||
                          vital.formula_value === "F" ? (
                            <sup>o</sup>
                          ) : null}
                          {vital.formula_value}
                        </h6>
                      </div>
                    );
                  })
                ) : (
                  <div> No vital recorded on {_date} </div>
                )}
              </div>
              <hr />
              <div className="row patientDiagnosis">
                <div className="col-12">
                  <div className="row">
                    {" "}
                    <div className="col">
                      <h4 className="patientSecHdg">Patient Diagnosis</h4>
                    </div>{" "}
                    <AlagehAutoComplete
                      div={{ className: "col-3" }}
                      // label={{ forceLabel: "", isImp: false }}
                      selector={{
                        name: "",
                        className: "select-fld",
                        dataSource: {},
                        others: {}
                      }}
                    />
                  </div>
                </div>
                <div className="col-12" id="newMedicationGrid_Cntr">
                  <AlgaehDataGrid
                    id="dash_PatientDiagnosis"
                    columns={[
                      {
                        fieldName: "action_delete",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Action " }} />
                        ),
                        displayTemplate: row => (
                          <i title="Delete row" className="fas fa-trash-alt" />
                        ),
                        others: {
                          maxWidth: 60
                        }
                      },
                      {
                        fieldName: "slno",
                        label: <AlgaehLabel label={{ forceLabel: "Sl No." }} />,
                        others: {
                          maxWidth: 60
                        }
                      },
                      {
                        fieldName: "icd_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "ICD Code" }} />
                        ),
                        others: {
                          maxWidth: 100
                        }
                      },
                      {
                        fieldName: "icd_description",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "ICD Description" }}
                          />
                        )
                      },
                      {
                        fieldName: "diagnosis_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Diagnosis Type" }}
                          />
                        ),
                        displayTemplate: row => (
                          <AlagehAutoComplete
                            selector={{
                              name: "diagnosis_type",
                              className: "select-fld",
                              value: row.diagnosis_type,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GLOBALVARIABLE.FORMAT_DIG_TYPE
                              },
                              onChange: this.onChangeDiagnosis.bind(this, row)
                            }}
                          />
                        ),
                        others: {
                          maxWidth: 195
                        }
                      },
                      {
                        fieldName: "final_daignosis",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Status " }} />
                        ),
                        displayTemplate: row => {
                          return row.final_daignosis === "Y"
                            ? "Final"
                            : "Initial";
                        },
                        others: {
                          maxWidth: 80
                        }
                      }
                    ]}
                    keyId="dash_PatientDiagnosis"
                    dataSource={{ data: this.state.patientDiagnosis }}
                    paging={{ page: 0, rowsPerPage: 5 }}
                  />
                </div>
              </div>
              <hr />
              <div className="row patientDiagnosis">
                <div className="col">Patient Diagnosis</div>
              </div>
              <hr />
              <div className="row patientDiagnosis">
                <div className="col">Patient Diagnosis</div>
              </div>
            </div>
            <div className="clinicalAction">
              <ul className="rightActionSec">
                <li>
                  <i className="fas fa-heartbeat" />
                  <span className="animated slideInRight faster">
                    Add Vitals
                  </span>
                </li>
                <li>
                  <i className="fas fa-utensils" />
                  <span className="animated slideInRight faster">
                    Add Vitals
                  </span>
                </li>
                <li>
                  <i className="fas fa-diagnoses" />
                  <span className="animated slideInRight faster">
                    Add Vitals
                  </span>
                </li>
                <li>
                  <i className="fas fa-allergies" />
                  <span className="animated slideInRight faster">
                    Add Vitals
                  </span>
                </li>
                <li>
                  <i className="fas fa-pills" />
                  <span className="animated slideInRight faster">
                    Add Vitals
                  </span>
                </li>
              </ul>
            </div>
            <div className="col-12 clinicalFooter">
              <div className="row">
                <div className="col-6">
                  <AlagehAutoComplete
                    div={{ className: "col inline-formGroup" }}
                    label={{
                      forceLabel: "View Visit",
                      isImp: false
                    }}
                    selector={{
                      name: "view_visit",
                      className: "select-fld",
                      value: _hims_f_patient_visit_id,
                      dataSource: {
                        textField: "encounter_date",
                        valueField: "hims_f_patient_visit_id",
                        data: encounterVisits
                      },

                      onChange: this.onViewVistChange.bind(this)
                    }}
                  />
                </div>
                <div className="col-6">
                  {" "}
                  <button className="btn btn-primary">
                    Close Encounter & Print
                  </button>
                  <button className="btn btn-default">Print</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="clinicalDeskWrapper">
          <div className="clinicalDeskPopup animated slideInRight faster">
            <div className="HeaderSection">
              <div className="popupName">PopUp Name</div>
              <div className="popupCloseAction">
                <i className="fas fa-times" />
              </div>
            </div>
            <div className="ContentSection">PopUp Content Comes Here</div>
            <div className="FooterSection">Content Section Action</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  /* method to render when no patient data avilabe */
  renderWitOutdata() {
    return <div>No patient selected</div>;
  }
  render() {
    return !this.state.showPatientDashboard
      ? this.renderWitOutdata()
      : this.renderWithData();
  }
}
