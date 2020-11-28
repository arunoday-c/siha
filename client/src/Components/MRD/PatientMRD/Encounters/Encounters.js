import React, { Component } from "react";
import "./encounters.scss";
import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import algaehLoader from "../../../Wrapper/fullPageLoader";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Enumerable from "linq";
// import NursesNotes from "../../../PatientProfile/Examination/NursesNotes";
import Options from "../../../../Options.json";
// import Summary from "../Summary/Summary";
import { Dimmer, Loader } from "semantic-ui-react";
import {
  // AlgaehDataGrid,
  AlgaehModal,
  // AlgaehButton,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../../hooks";
class Encounters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientEncounters: [],
      patientComplaints: [],
      patientDiagnosis: [],
      patientMedications: [],
      patientInvestigations: [],
      patientPakages: [],
      consumableorderedList: [],
      nursingNotes: [],
      patientProcedures: [],
      patientVital: [],
      loaderChiefComp: false,
      loaderSignificantSigns_Others: false,
      loaderVitals: false,
      openAttachmentsModal: false,
      attached_docs: [],
    };
  }

  setEncounterDetails(row, e) {
    // const enc_id = e.currentTarget.getAttribute("enc-id");
    const episode_id = e.currentTarget.getAttribute("epi-id");
    const visit_id = e.currentTarget.getAttribute("visit-id");

    this.getPatientChiefComplaint(episode_id);
    this.getPatientDiagnosis(episode_id);
    this.getPatientMedication(row.encounter_id);
    this.getPatientInvestigation(visit_id);
    this.getPatientPakages(visit_id, Window.global["mrd_patient"]);
    this.getConsumableorderedList(visit_id);
    this.getNursingNotes(visit_id, Window.global["mrd_patient"]);
    this.getPatientVitals(Window.global["mrd_patient"], visit_id);
    this.getEncounterDetails(row.encounter_id);

    const general_info = Enumerable.from(this.state.patientEncounters)
      .where((w) => w.encounter_id === parseInt(row.encounter_id, 10))
      .firstOrDefault();

    this.setState({
      generalInfo: general_info,
    });
  }

  componentDidMount() {
    this.getPatientEncounterDetails();
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.fromClinicalDesk !== prevProps.fromClinicalDesk) {
  //     this.getPatientEncounterDetails();
  //   }
  // }

  getEncounterDetails(encounter_id) {
    this.setState(
      {
        loaderSignificantSigns_Others: true,
      },
      () => {
        algaehApiCall({
          uri: "/doctorsWorkBench/getPatientEncounter",
          method: "GET",
          data: {
            encounter_id: encounter_id,
          },
          onSuccess: (response) => {
            let data = response.data.records[0];
            if (response.data.success) {
              this.setState({
                significant_signs: data.significant_signs,
                other_signs: data.other_signs,
                loaderSignificantSigns_Others: false,
              });
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
    );
  }

  getPatientVitals(patient_id, visit_id) {
    this.setState(
      {
        loaderVitals: true,
      },
      () => {
        algaehApiCall({
          uri: "/doctorsWorkBench/getPatientVitals",
          method: "GET",
          data: {
            patient_id: patient_id,
            visit_id: visit_id,
          },
          cancelRequestId: "getPatientVitals",
          onSuccess: (response) => {
            algaehLoader({ show: false });
            if (response.data.success && response.data.records.length !== 0) {
              const _Vitals =
                response.data.records !== undefined &&
                response.data.records.length > 0
                  ? response.data.records[0].list
                  : // Enumerable.from(response.data.records)
                    //   .groupBy("$.visit_date", null, (k, g) => {
                    //     return {
                    //       key: k,
                    //       details: g.getSource(),
                    //     };
                    //   })
                    //   .toArray()
                    [];

              this.setState({ patientVital: _Vitals, loaderVitals: false });
            } else if (response.data.records.length === 0) {
              this.setState({
                patientVital: [],
                loaderVitals: false,
              });
            }
          },
          onFailure: (error) => {
            algaehLoader({ show: false });
            swalMessage({
              title: error.message,
              type: "error",
            });
          },
        });
      }
    );
  }

  getPatientChiefComplaint(episode_id) {
    this.setState(
      {
        loaderChiefComp: true,
      },
      () => {
        algaehApiCall({
          uri: "/mrd/getPatientChiefComplaint",
          method: "GET",
          data: {
            episode_id: episode_id,
          },
          module: "MRD",
          cancelRequestId: "getPatientChiefComplaint",
          onSuccess: (response) => {
            if (response.data.success) {
              this.setState({
                patientComplaints: response.data.records,
                loaderChiefComp: false,
              });
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
    );
  }

  getPatientDiagnosis(episode_id) {
    algaehApiCall({
      uri: "/mrd/getPatientDiagnosis",
      module: "MRD",
      method: "GET",
      data: {
        episode_id: episode_id,
      },
      onSuccess: (response) => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientDiagnosis: response.data.records });
        }
      },
      onFailure: (error) => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  getPatientMedication(enc_id) {
    algaehApiCall({
      uri: "/mrd/getPatientMedication",
      module: "MRD",
      method: "GET",
      data: {
        encounter_id: enc_id,
      },
      cancelRequestId: "getPatientMedication",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({ patientMedications: response.data.records });
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
  getPatientInvestigation(visit_id) {
    algaehApiCall({
      uri: "/mrd/getPatientInvestigation",
      module: "MRD",
      method: "GET",
      data: {
        visit_id: visit_id,
      },
      cancelRequestId: "getPatientInvestigation",
      onSuccess: (response) => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientInvestigations: response.data.records });
        }
      },
      onFailure: (error) => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  getConsumableorderedList(visit_id) {
    algaehApiCall({
      uri: "/orderAndPreApproval/getVisitConsumable",
      method: "GET",
      data: {
        visit_id: visit_id, //Window.global["visit_id"]
      },
      // cancelRequestId: "getPatientInvestigation",
      onSuccess: (response) => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ consumableorderedList: response.data.records });
        }
      },
      onFailure: (error) => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  getNursingNotes(visit_id, patient_id) {
    algaehApiCall({
      uri: "/doctorsWorkBench/getNurseNotes",
      data: { patient_id, visit_id },
      method: "GET",
      // cancelRequestId: "getPatientInvestigation",
      onSuccess: (response) => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ nursingNotes: response.data.records });
        }
      },
      onFailure: (error) => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  getPatientPakages(visit_id, patient_id) {
    algaehApiCall({
      uri: "/orderAndPreApproval/getPatientPackage",
      method: "GET",
      data: {
        package_visit_type: "ALL",
        patient_id: patient_id,
        visit_id: visit_id,
      },
      // cancelRequestId: "getPatientInvestigation",
      onSuccess: (response) => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientPakages: response.data.records });
        }
      },
      onFailure: (error) => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }
  // uri: "/doctorsWorkBench/getNurseNotes",
  // data: { patient_id, visit_id },
  // method: "GET",
  getPatientEncounterDetails() {
    algaehLoader({ show: true });

    algaehApiCall({
      uri: "/mrd/getPatientEncounterDetails",
      method: "GET",
      data: {
        patient_id: Window.global["mrd_patient"],
      },
      module: "MRD",
      onSuccess: (response) => {
        algaehLoader({ show: false });
        if (response.data.success) {
          this.setState({ patientEncounters: response.data.records });
        }
      },
      onFailure: (error) => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  printPatSummary() {
    // const { episode_id, current_patient, visit_id } = Window.global;
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
          reportName: "patSummaryReport",
          reportParams: [
            {
              name: "patient_id",
              value: this.state.generalInfo.patient_id, //Window.global["current_patient"]
            },
            {
              name: "visit_id",
              value: this.state.generalInfo.visit_id, //Window.global["visit_id"]
            },
            {
              name: "episode_id",
              value: this.state.generalInfo.episode_id, // Window.global["episode_id"]
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Patient Summary Report`;
        window.open(origin);
        // window.document.title = "";
      },

      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  printSickleave() {
    // const { episode_id, current_patient, visit_id } = Window.global;
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
          reportName: "sickLeave",
          reportParams: [
            {
              name: "patient_id",
              value: this.state.generalInfo.patient_id, //Window.global["current_patient"]
            },
            {
              name: "visit_id",
              value: this.state.generalInfo.visit_id, //Window.global["visit_id"]
            },
            {
              name: "episode_id",
              value: this.state.generalInfo.episode_id, // Window.global["episode_id"]
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Sick Leave`;
        window.open(origin);
        // window.document.title = "";
      },

      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  printPrescription() {
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
          reportName: "prescription",
          reportParams: [
            {
              name: "hims_d_patient_id",
              value: this.state.generalInfo.patient_id, //Window.global["current_patient"]
            },
            {
              name: "visit_id",
              value: this.state.generalInfo.visit_id, //Window.global["visit_id"]
            },
            {
              name: "visit_code",
              value: null,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);

        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Prescription`;
        window.open(origin);
        // window.document.title = "";
      },
    });
  }

  generateReport(row, report_type) {
    let inputObj = {};
    if (report_type === "RAD") {
      inputObj = {
        tab_name: "Radiology Report",
        reportName: "radiologyReport",
        data: [
          {
            name: "hims_f_rad_order_id",
            value: row.hims_f_rad_order_id,
          },
        ],
      };
    } else {
      inputObj = {
        tab_name: "Lab Report",
        reportName: "hematologyTestReport",
        data: [
          {
            name: "hims_d_patient_id",
            value: row.patient_id,
          },
          {
            name: "visit_id",
            value: row.visit_id,
          },
          {
            name: "hims_f_lab_order_id",
            value: row.hims_f_lab_order_id,
          },
        ],
      };
    }
    // let tab_name = report_type === "RAD" ? "Radiology Report" : "Lab Report";
    let tab_name = inputObj.tab_name;
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
          reportName: inputObj.reportName,
          reportParams: inputObj.data,
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        // const url = URL.createObjectURL(res.data);
        // let myWindow = window.open(
        //   "{{ product.metafields.google.custom_label_0 }}",
        //   "_blank"
        // );

        // myWindow.document.write(
        //   "<iframe src= '" + url + "' width='100%' height='100%' />"
        // );
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${tab_name}`;
        window.open(origin);
        // window.document.title = tab_name;
      },
    });
  }
  downloadDoc(doc, isPreview) {
    const fileUrl = `data:${doc.filetype};base64,${doc.document}`;
    const link = document.createElement("a");
    if (!isPreview) {
      link.download = doc.filename;
      link.href = fileUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      fetch(fileUrl)
        .then((res) => res.blob())
        .then((fblob) => {
          const newUrl = URL.createObjectURL(fblob);
          window.open(newUrl);
        });
    }
  }
  getSavedDocument(row) {
    newAlgaehApi({
      uri: "/getContractDoc",
      module: "documentManagement",
      method: "GET",
      data: {
        contract_no: row.lab_id_number,
      },
    })
      .then((res) => {
        if (res.data.success) {
          let { data } = res.data;
          this.setState({
            attached_docs: data,
          });
        }
      })
      .catch((e) => {
        swalMessage({
          title: e.message,
          type: "error",
        });
      });
  }
  getDocuments(row) {
    newAlgaehApi({
      uri: "/getRadiologyDoc",
      module: "documentManagement",
      method: "GET",
      data: {
        hims_f_rad_order_id: row.hims_f_rad_order_id,
      },
    })
      .then((res) => {
        if (res.data.success) {
          let { data } = res.data;
          this.setState({
            attached_docs: data,
          });
        }
      })
      .catch((e) => {
        // AlgaehLoader({ show: false });
        swalMessage({
          title: e.message,
          type: "error",
        });
      });
  }
  render() {
    return (
      <div className="encounters">
        <div className="row">
          <div className="col-lg-4">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">OP Encounter List</h3>
                </div>
              </div>
              <div className="portlet-body encounterListCntr">
                <AlgaehDataGrid
                  id="index"
                  columns={[
                    {
                      fieldName: "encountered_date",
                      label: "Consult Date & Time",
                      displayTemplate: (row) => {
                        return (
                          <span
                            enc-id={row.hims_f_patient_encounter_id}
                            epi-id={row.episode_id}
                            visit-id={row.visit_id}
                            onClick={this.setEncounterDetails.bind(this, row)}
                            className="pat-code"
                          >
                            {moment(row.encountered_date).format(
                              "DD-MM-YYYY HH:mm A"
                            )}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      className: (drow) => {
                        return "greenCell";
                      },
                    },
                    {
                      fieldName: "provider_name",
                      label: "Doctor Name",
                      others: {
                        style: { textAlign: "center" },
                      },
                    },
                  ]}
                  // rowClassName={row => {
                  //   return "cursor-pointer";
                  // }}
                  keyId="index"
                  dataSource={{
                    data: this.state.patientEncounters,
                  }}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: (row) => {},
                    onEdit: (row) => {},
                    onDone: (row) => {},
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">OP Encounter Details </h3>
                </div>

                {/* {this.state.generalInfo !== undefined
                            ? moment(
                                this.state.generalInfo.encountered_date
                              ).format("DD-MM-YYYY HH:mm A")
                            : "----------"} */}

                {this.state.generalInfo !== undefined ? (
                  <div className="actions">
                    <button
                      className="btn btn-default"
                      style={{ marginRight: 10 }}
                      onClick={this.printPatSummary.bind(this)}
                    >
                      Print Summary Report
                    </button>
                    <button
                      className="btn btn-default"
                      style={{ marginRight: 10 }}
                      onClick={this.printSickleave.bind(this)}
                    >
                      Print Sick Leave
                    </button>
                    <button
                      className="btn btn-default"
                      style={{ marginRight: 10 }}
                      onClick={this.printPrescription.bind(this)}
                    >
                      Print Prescription
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="portlet-body encounterDetailCntr">
                <div className="row generalInfo">
                  <div className="col-lg-12">
                    <h6 className="smallh6">General Information</h6>
                    <div className="row">
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Consult Date & Time",
                          }}
                        />
                        <h6>
                          {this.state.generalInfo !== undefined
                            ? moment(
                                this.state.generalInfo.encountered_date
                              ).format("DD-MM-YYYY HH:mm A")
                            : "----------"}
                        </h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Doctor Name",
                          }}
                        />
                        <h6>
                          {this.state.generalInfo !== undefined
                            ? "Dr. " + this.state.generalInfo.provider_name
                            : "----------"}
                        </h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Department",
                          }}
                        />
                        <h6>
                          {this.state.generalInfo !== undefined
                            ? this.state.generalInfo.sub_department_name
                            : "----------"}
                        </h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Insurance Details",
                          }}
                        />
                        <h6>
                          {this.state.generalInfo !== undefined
                            ? this.state.generalInfo.pri_insurance_provider_name
                            : "----------"}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row chiefComplaint">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Chief Complaint(s)</h6>
                    <div className="row">
                      {this.state.loaderChiefComp ? (
                        <div className="col">
                          <Dimmer active>
                            <Loader inline="centered">Loading</Loader>
                          </Dimmer>
                        </div>
                      ) : (
                        <div className="col">
                          <h6 className="">
                            {this.state.patientComplaints.map((data, index) => {
                              return data.chief_complaint
                                ? data.chief_complaint
                                : data.comment
                                ? data.comment
                                : "-------";
                            })}
                          </h6>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row chiefComplaint">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Significant Signs</h6>
                    <div className="row">
                      {this.state.loaderSignificantSigns_Others ? (
                        <div className="row">
                          <Dimmer active>
                            <Loader inline="centered">Loading</Loader>
                          </Dimmer>
                        </div>
                      ) : (
                        <div className="col">
                          <h6 className="">{this.state.significant_signs}</h6>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* VITALS START */}
                <div className="row vitals">
                  <div className="col-12">
                    <h6 className="smallh6">Vitals</h6>
                    {this.state.loaderVitals ? (
                      <div className="row">
                        <Dimmer active>
                          <Loader inline="centered">Loading</Loader>
                        </Dimmer>
                      </div>
                    ) : (
                      <div className="col-12">
                        <div className="row">
                          {this.state.patientVital.length > 0 ? (
                            this.state.patientVital.map((item, index) => (
                              <React.Fragment key={index}>
                                {/* <div className="col-lg-12">
                                Recorded on {item.key}
                              </div> */}
                                <div className="col-2 borderVitals">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: item.vitals_name,
                                    }}
                                  />
                                  <h6>
                                    {item.vital_value}
                                    <span>{item.uom}</span>
                                  </h6>
                                </div>

                                {/* {item.details.map((row, indexD) => (
                                <div key={indexD} className="col borderVitals">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: row.vitals_name,
                                    }}
                                  />
                                  <h6>
                                    {row.vital_value}
                                    <span>{row.uom}</span>
                                  </h6>
                                </div>
                              ))} */}
                              </React.Fragment>
                            ))
                          ) : (
                            <span className="col">----------</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* VITALS END */}

                <div className="row diagnosis">
                  <div className="col-lg-12">
                    <h6 className="smallh6">Diagnosis</h6>
                    <div className="row">
                      <div className="col">
                        {this.state.patientDiagnosis.map((data, index) => (
                          <h6 className="danger">
                            {data.diagnosis_type === "P"
                              ? "Primary: " + data.daignosis_description
                              : ""}
                          </h6>
                        ))}
                      </div>

                      <div className="col">
                        {this.state.patientDiagnosis.map((data, index) => (
                          <h6 className="">
                            {data.diagnosis_type === "S"
                              ? "Secondary: " + data.daignosis_description
                              : ""}
                          </h6>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.patientInvestigations.length !== 0 ? (
                  <div className="row investigation">
                    <div className="col-lg-12">
                      <h6 className="smallh6">Investigation</h6>
                      <div className="row">
                        <div className="col-lg-12">
                          <AlgaehDataGrid
                            id="investigation-grid"
                            columns={[
                              {
                                fieldName: "service_name",
                                label: "Service Name",
                              },
                              {
                                fieldName: "lab_ord_status",
                                label: "Lab Order Status",
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {row.lab_ord_status === "O"
                                        ? "Ordered"
                                        : row.lab_ord_status === "CL"
                                        ? "Specimen Collected"
                                        : row.lab_ord_status === "CN"
                                        ? "Test Cancelled"
                                        : row.lab_ord_status === "CF"
                                        ? "Result Confirmed "
                                        : row.lab_ord_status === "V"
                                        ? "Result Validated"
                                        : "----"}
                                    </span>
                                  );
                                },
                              },
                              {
                                fieldName: "lab_billed",
                                label: "Lab Billed",
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {row.lab_billed === "Y" ? "Yes" : "----"}
                                    </span>
                                  );
                                },
                              },
                              {
                                fieldName: "rad_ord_status",
                                label: "Radiology Order Status",
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {row.rad_ord_status === "O"
                                        ? "Ordered"
                                        : row.rad_ord_status === "S"
                                        ? "Scheduled"
                                        : row.rad_ord_status === "UP"
                                        ? "Under Process"
                                        : row.rad_ord_status === "CN"
                                        ? "Cancelled"
                                        : row.rad_ord_status === "RC"
                                        ? "Result Confirmed"
                                        : row.rad_ord_status === "RA"
                                        ? "Result Available"
                                        : "----"}
                                    </span>
                                  );
                                },
                              },
                              {
                                fieldName: "rad_billed",
                                label: "Radiology Billed",
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {row.rad_billed === "Y" ? "Yes" : "----"}
                                    </span>
                                  );
                                },
                              },
                              {
                                fieldName: "hims_f_ordered_services_id",
                                label: "View Report",
                                displayTemplate: (row) => {
                                  return row.service_type_id === 5 &&
                                    row.lab_ord_status === "V" ? (
                                    <span
                                      className="pat-code"
                                      style={{ color: "#006699" }}
                                      onClick={this.generateReport.bind(
                                        this,
                                        row,
                                        "LAB"
                                      )}
                                    >
                                      View Report
                                    </span>
                                  ) : row.service_type_id === 11 &&
                                    row.rad_ord_status === "RA" ? (
                                    <span
                                      className="pat-code"
                                      style={{ color: "#006699" }}
                                      onClick={this.generateReport.bind(
                                        this,
                                        row,
                                        "RAD"
                                      )}
                                    >
                                      View Report
                                    </span>
                                  ) : null;
                                },
                              },
                              {
                                fieldName: "action",
                                label: "Attachments",
                                displayTemplate: (row) => {
                                  return row.lab_billed === "Y" ? (
                                    <span>
                                      <i
                                        className="fas fa-paperclip"
                                        aria-hidden="true"
                                        onClick={() => {
                                          this.setState(
                                            {
                                              openAttachmentsModal: true,
                                              // currentRow: row,
                                              // lab_id_number: row.lab_id_number,
                                            },

                                            this.getSavedDocument.bind(
                                              this,
                                              row
                                            )
                                          );
                                        }}
                                      />
                                    </span>
                                  ) : (
                                    "----"
                                  );
                                },
                              },
                              {
                                fieldName: "radiology_attachments",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Radiology Attachments",
                                    }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.rad_billed === "Y" ? (
                                    <span>
                                      <i
                                        // style={{
                                        //   pointerEvents:
                                        //     row.status === "O"
                                        //       ? ""
                                        //       : row.sample_status === "N"
                                        //       ? "none"
                                        //       : "",
                                        // }}
                                        className="fas fa-paperclip"
                                        aria-hidden="true"
                                        onClick={(e) => {
                                          this.setState(
                                            {
                                              openAttachmentsModal: true,
                                            },

                                            this.getDocuments.bind(this, row)
                                          );
                                        }}
                                      />
                                    </span>
                                  ) : (
                                    "----"
                                  );
                                },
                              },
                            ]}
                            keyId="index"
                            dataSource={{
                              data: this.state.patientInvestigations,
                            }}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 5 }}
                            events={{
                              onDelete: (row) => {},
                              onEdit: (row) => {},
                              onDone: (row) => {},
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                <AlgaehModal
                  title="View Attachments"
                  visible={this.state.openAttachmentsModal}
                  mask={true}
                  maskClosable={false}
                  onCancel={() => {
                    this.setState({
                      openAttachmentsModal: false,

                      attached_docs: [],
                    });
                  }}
                  footer={[
                    <div className="col-12">
                      <button
                        onClick={() => {
                          this.setState({
                            openAttachmentsModal: false,

                            attached_docs: [],
                          });
                        }}
                        className="btn btn-default btn-sm"
                      >
                        Cancel
                      </button>
                    </div>,
                  ]}
                  className={`algaehNewModal investigationAttachmentModal`}
                >
                  <div className="portlet-body">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-3"></div>
                        <div className="col-6">
                          <div className="row">
                            <div className="col-12">
                              <ul className="AttachmentList">
                                {this.state.attached_docs.length ? (
                                  this.state.attached_docs.map((doc) => (
                                    <li>
                                      <b> {doc.filename} </b>
                                      <span>
                                        <i
                                          className="fas fa-download"
                                          onClick={() => this.downloadDoc(doc)}
                                        ></i>
                                        <i
                                          className="fas fa-eye"
                                          onClick={() =>
                                            this.downloadDoc(doc, true)
                                          }
                                        ></i>
                                      </span>
                                    </li>
                                  ))
                                ) : (
                                  <div className="col-12 noAttachment" key={1}>
                                    <p>No Attachments Available</p>
                                  </div>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AlgaehModal>
                {this.state.patientPakages.length !== 0 ? (
                  <div className="row investigation">
                    <div className="col-lg-12">
                      <h6 className="smallh6">Pakages</h6>
                      <div className="row">
                        <div className="col-lg-12">
                          <AlgaehDataGrid
                            id="Package_list"
                            columns={[
                              {
                                fieldName: "billed",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "Billed" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.billed === "N" ? "No" : "Yes";
                                },
                              },
                              {
                                fieldName: "created_date",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "created_date" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {this.dateFormater(row.created_date)}
                                    </span>
                                  );
                                },
                              },

                              {
                                fieldName: "service_type",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "service_type_id" }}
                                  />
                                ),
                                others: {
                                  minWidth: 100,
                                  maxWidth: 500,
                                },

                                disabled: true,
                              },
                              {
                                fieldName: "service_name",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "services_id" }}
                                  />
                                ),
                                others: {
                                  minWidth: 200,
                                  maxWidth: 400,
                                },
                                disabled: true,
                              },
                              {
                                fieldName: "insurance_yesno",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "insurance" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.insurance_yesno === "Y"
                                    ? "Covered"
                                    : "Not Covered";
                                },
                                disabled: true,
                              },
                              {
                                fieldName: "pre_approval",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "pre_approval" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {row.pre_approval === "Y"
                                        ? "Required"
                                        : "Not Required"}
                                    </span>
                                  );
                                },
                                disabled: true,
                              },
                              {
                                fieldName: "patient_payable",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "patient_payable" }}
                                  />
                                ),
                                disabled: true,
                              },
                              {
                                fieldName: "company_payble",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "company_payble" }}
                                  />
                                ),
                                disabled: true,
                              },
                            ]}
                            keyId="list_type_id"
                            dataSource={{
                              data: this.state.patientPakages,
                            }}
                            paging={{ page: 0, rowsPerPage: 10 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {this.state.consumableorderedList.length !== 0 ? (
                  <div className="row investigation">
                    <div className="col-lg-12">
                      <h6 className="smallh6">consumables</h6>
                      <div className="row">
                        <div className="col-lg-12">
                          <AlgaehDataGrid
                            id="Package_list"
                            columns={[
                              {
                                fieldName: "billed",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "Billed" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.billed === "N" ? "No" : "Yes";
                                },
                              },
                              {
                                fieldName: "created_date",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "created_date" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {this.dateFormater(row.created_date)}
                                    </span>
                                  );
                                },
                              },

                              {
                                fieldName: "service_type",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "service_type_id" }}
                                  />
                                ),
                                others: {
                                  minWidth: 100,
                                  maxWidth: 500,
                                },

                                disabled: true,
                              },
                              {
                                fieldName: "service_name",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "services_id" }}
                                  />
                                ),
                                others: {
                                  minWidth: 200,
                                  maxWidth: 400,
                                },
                                disabled: true,
                              },
                              {
                                fieldName: "item_notchargable",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Chargable" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.item_notchargable === "N"
                                    ? "Yes"
                                    : "No";
                                },
                                disabled: true,
                              },
                              {
                                fieldName: "instructions",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Instructions" }}
                                  />
                                ),
                              },
                              {
                                fieldName: "insurance_yesno",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "insurance" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.insurance_yesno === "Y"
                                    ? "Covered"
                                    : "Not Covered";
                                },
                                disabled: true,
                              },
                              {
                                fieldName: "pre_approval",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "pre_approval" }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {row.pre_approval === "Y"
                                        ? "Required"
                                        : "Not Required"}
                                    </span>
                                  );
                                },
                                disabled: true,
                              },
                              {
                                fieldName: "patient_payable",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "patient_payable" }}
                                  />
                                ),
                                disabled: true,
                              },
                              {
                                fieldName: "company_payble",
                                label: (
                                  <AlgaehLabel
                                    label={{ fieldName: "company_payble" }}
                                  />
                                ),
                                disabled: true,
                              },
                            ]}
                            keyId="Cons_type_id"
                            dataSource={{
                              data: this.state.consumableorderedList,
                            }}
                            paging={{ page: 0, rowsPerPage: 10 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {this.state.patientMedications.length !== 0 ? (
                  <div className="row medication">
                    <div className="col-lg-12">
                      <h6 className="smallh6">Medication</h6>
                      <div className="row">
                        <div className="col-lg-12">
                          <AlgaehDataGrid
                            id="medication-grid"
                            columns={[
                              {
                                fieldName: "generic_name",
                                label: "Generic Name",
                              },
                              {
                                fieldName: "item_description",
                                label: "Item Description",
                              },

                              {
                                fieldName: "dosage",
                                label: "Dosage",
                              },
                              {
                                fieldName: "med_units",
                                label: "Unit",
                              },
                              {
                                fieldName: "frequency",
                                label: "Frequency",
                              },
                              {
                                fieldName: "no_of_days",
                                label: "No. of Days",
                              },
                              {
                                fieldName: "start_date",
                                label: "Start date",
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {moment(row.start_date).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </span>
                                  );
                                },
                              },
                            ]}
                            keyId="index"
                            dataSource={{
                              data: this.state.patientMedications,
                            }}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 5 }}
                            events={{
                              onDelete: (row) => {},
                              onEdit: (row) => {},
                              onDone: (row) => {},
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {this.state.patientProcedures.length !== 0 ? (
                  <div className="row procedures">
                    <div className="col-lg-12">
                      <h6 className="smallh6">Procedures</h6>
                      <div className="row">
                        <div className="col-lg-12">
                          <AlgaehDataGrid
                            id="procedure-grid"
                            columns={[
                              {
                                fieldName: "index",
                                label: "Sl. No.",
                              },
                              {
                                fieldName: "c_d_t",
                                label: "Consult Date & Time",
                              },
                              {
                                fieldName: "doc_name",
                                label: "Doctor Name",
                              },
                            ]}
                            keyId="index"
                            dataSource={{
                              data: [
                                {
                                  c_d_t: "May 22 13:00:00",
                                  doc_name: "Norman John",
                                  index: "1",
                                },
                                {
                                  c_d_t: "May 23 13:00:00",
                                  doc_name: "John Morgan",
                                  index: "2",
                                },
                              ],
                            }}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 5 }}
                            events={{
                              onDelete: (row) => {},
                              onEdit: (row) => {},
                              onDone: (row) => {},
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                {this.state.nursingNotes.length !== 0 ? (
                  <div className="row investigation">
                    <div className="col-lg-12">
                      <h6 className="smallh6">Nursing Notes</h6>
                      <div className="row">
                        <div className="col-lg-12">
                          <AlgaehDataGrid
                            id="Package_list"
                            columns={[
                              {
                                fieldName: "nursing_notes",
                                label: "Notes",
                                disabled: true,
                              },
                              {
                                fieldName: "created_date",
                                label: "Entered by & Date",
                                disabled: true,
                              },
                            ]}
                            // keyId="_type_id"
                            dataSource={{
                              data: this.state.nursingNotes,
                            }}
                            paging={{ page: 0, rowsPerPage: 10 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Encounters;
