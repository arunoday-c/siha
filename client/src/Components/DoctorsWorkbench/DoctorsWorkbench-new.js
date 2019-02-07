import React, { Component } from "react";
import "./doctor_workbench.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import AlgaehFile from "../Wrapper/algaehFileUpload";
import {
  algaehApiCall,
  cancelRequest,
  swalMessage
} from "../../utils/algaehApiCall";
import { setGlobal } from "../../utils/GlobalFunctions";
import Enumerable from "linq";
import moment from "moment";
const MyDaypanel = React.memo(React.lazy(() => import("./Myday")));
class DoctorsWorkbench extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row clinicalDeskScreen">
        <React.Suspense fallback={<div>Loading....</div>}>
          <MyDaypanel />
        </React.Suspense>

        <div className="patientDetailSection">
          <div className="row">
            <div className="col-12  patientMainInfo">
              <div className="row  PatientProfile">
                <div className="PatientInfo-Top box-shadow-normal">
                  <div className="PatientImg">
                    {/* <img alt="Algaeh-HIS" src={ PatientProfileImg} /> */}

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
                    {/* <h6>SYED ADIL FAWAD NIZAMI</h6> */}
                    <h6>SYED ADIL FAWAD NIZAMI</h6>
                    <p>
                      <b>Male, 43Y 7M 10D</b>
                    </p>
                  </div>
                  <div className="PatientDemographic">
                    <span>
                      DOB: <b>31/02/2019 </b>
                    </span>
                    <span>
                      Mob: <b>+91 9008523153 </b>
                    </span>
                    <span>
                      Nationality: <b>Indian </b>
                    </span>
                  </div>
                  <div className="PatientDemographic">
                    <span>
                      MRN: <b>PAT-3872565 </b>
                    </span>
                    <span>
                      Encounter: <b> 25/07/2018 11:27:38 PM </b>
                    </span>
                    <span>
                      Payment: <b>Self Paying </b>
                    </span>
                  </div>
                  <div className="PatientVitals">
                    <span>
                      Temp.: <b>70</b>
                      <i>°C</i>
                    </span>
                    <span>
                      O2 Sat: <b>32</b>
                      <i>°C</i>
                    </span>
                    <span>
                      Bp Systolic: <b>73</b>
                      <i>cm</i>
                    </span>
                    <span>
                      Bp Diastolic: <b>67</b>
                      <i>cm</i>
                    </span>
                    <span>
                      RR: <b>90</b>
                      <i>bpm</i>
                    </span>
                    <span>
                      HR: <b>76</b>
                      <i>bpm</i>
                    </span>
                    <span>
                      Weight: <b>76</b>
                      <i>kg</i>
                    </span>{" "}
                    <span>
                      Height: <b>189</b>
                      <i>cm</i>
                    </span>
                    <span>
                      BMI: <b>24.915</b>
                      <i>cm</i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col patientReportSection">
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
              <div className="row patientChiefSec">
                <div className="col-12">
                  <h4 className="patientSecHdg">Chief Complaints</h4>
                </div>
                <div className="col-6">
                  <textarea className="chiefComplaintsTextArea" />
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
                    label={{ forceLabel: "View Visit", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
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
      </div>
    );
  }
}

export default DoctorsWorkbench;
