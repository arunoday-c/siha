import React, { Component } from "react";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import AlgaehFile from "../../Wrapper/algaehFileUpload";
import eventLogic from "./eventsLogic";
import _ from "lodash";
import { swalMessage } from "../../../utils/algaehApiCall";
export default class PatientDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allVitals: [],
      episode_id: undefined
    };
  }

  /* method to get vitals for the patients */
  getVitals(item) {
    item = item || undefined;
    debugger;
    const { selectedPatientDetails } = this.props.dashboard_state;
    eventLogic()
      .getPatientVitials(item, selectedPatientDetails)
      .then(result => {
        this.setState({
          allVitals: result,
          episode_id: item.episode_id
        });
      })
      .catch(error => {
        swalMessage({
          type: "error",
          title: error.message
        });
      });
  }

  onViewVistChange(ele) {
    this.setState({ episode_id: ele.value });
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
    const _valueEncounterDate =
      encounterVisits.length > 1 && this.state.episode_id === undefined
        ? encounterVisits[1].episode_id
        : encounterVisits.length === 1 && this.state.episode_id === undefined
        ? encounterVisits[0].episode_id
        : this.state.episode_id;
    this.getVitals(encounterVisits.length > 1 ? encounterVisits[1] : undefined);
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
                    {eventLogic()
                      .getTopLevelVitals(this.state.allVitals)
                      .map(vital => (
                        <React.Fragment>
                          <span>
                            {vital.vital_short_name}:{" "}
                            <b>{parseFloat(vital.vital_value).toFixed(2)}</b>
                            <i>
                              {vital.formula_value === "C" ||
                              vital.formula_value === "F" ? (
                                <sup>o</sup>
                              ) : null}{" "}
                              {vital.formula_value}
                            </i>
                          </span>
                        </React.Fragment>
                      ))}
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
                <div className="col">
                  <h6>
                    <label>Weight</label>65cm
                  </h6>
                </div>
                <div className="col">
                  <h6>
                    <label>Weight</label>65cm
                  </h6>
                </div>
                <div className="col">
                  <h6>
                    <label>Weight</label>65cm
                  </h6>
                </div>
                <div className="col">
                  <h6>
                    <label>Weight</label>65cm
                  </h6>
                </div>
                <div className="col">
                  <h6>
                    <label>Weight</label>65cm
                  </h6>
                </div>
                <div className="col">
                  <h6>
                    <label>Weight</label>65cm
                  </h6>
                </div>
                <div className="col">
                  <h6>
                    <label>Weight</label>65cm
                  </h6>
                </div>
                <div className="col">
                  <h6>
                    <label>Weight</label>65cm
                  </h6>
                </div>
                <div className="col">
                  <h6>
                    <label>Weight</label>65cm
                  </h6>
                </div>
              </div>
              <hr />
              <div className="row patientDiagnosis">
                <div className="col-12">
                  <h4 className="patientSecHdg">Patient Diagnosis</h4>
                </div>
                <div className="col-12" id="newMedicationGrid_Cntr">
                  <AlgaehDataGrid
                    id="newMedicationGrid"
                    datavalidate="newMedicationGrid"
                    columns={[
                      {
                        fieldName: "Column_1",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Column 1" }} />
                        )
                      },
                      {
                        fieldName: "Column_2",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Column 2" }} />
                        )
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: [] }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    others={{}}
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
                      value: _valueEncounterDate,
                      dataSource: {
                        textField: "encounter_date",
                        valueField: "episode_id",
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
    const { selectedPatientDetails } = this.props.dashboard_state;

    return selectedPatientDetails === undefined
      ? this.renderWitOutdata()
      : this.renderWithData();
  }
}
