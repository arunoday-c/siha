import React, { useState, useEffect } from "react";
import "./encounters.scss";
import { PatientAttachments } from "../../../PatientRegistrationNew/PatientAttachment";
// import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import algaehLoader from "../../../Wrapper/fullPageLoader";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
// import Enumerable from "linq";
// import NursesNotes from "../../../PatientProfile/Examination/NursesNotes";
import Options from "../../../../Options.json";
// import Summary from "../Summary/Summary";
import { Dimmer, Loader } from "semantic-ui-react";
import {
  // AlgaehDataGrid,
  // AlgaehModal,
  AlgaehDataGrid,
  AlgaehLabel,
} from "algaeh-react-components";
import { ViewAttachmentsModal } from "./viewAttachmentsModal";
// import { newAlgaehApi } from "../../../../hooks";

export default function OPEncounterDetails({
  episode_id,
  encounter_id,
  visit_id,
  patient_id,
  generalInfo,
}) {
  //  const setEncounterDetails=(row, e)=> {
  //     // const enc_id = e.currentTarget.getAttribute("enc-id");
  //     const episode_id = e.currentTarget.getAttribute("epi-id");
  //     const visit_id = e.currentTarget.getAttribute("visit-id");

  //     this.getPatientChiefComplaint(episode_id);
  //     this.getPatientDiagnosis(episode_id);
  //     this.getPatientMedication(row.encounter_id);
  //     this.getPatientInvestigation(visit_id);
  //     this.getPatientPakages(visit_id, Window.global["mrd_patient"]);
  //     this.getConsumableorderedList(visit_id);
  //     this.getNursingNotes(visit_id, Window.global["mrd_patient"]);
  //     this.getPatientVitals(Window.global["mrd_patient"], visit_id);
  //     this.getEncounterDetails(row.encounter_id);

  //     const general_info = Enumerable.from(this.state.patientEncounters)
  //       .where((w) => w.encounter_id === parseInt(row.encounter_id, 10))
  //       .firstOrDefault();

  //     this.setState({
  //       generalInfo: general_info,
  //     });
  //   }
  const [patientComplaints, setPatientComplaints] = useState([]);
  const [patientDiagnosis, setPatientDiagnosis] = useState([]);
  const [patientMedications, setPatientMedications] = useState([]);
  const [patientInvestigations, setPatientInvestigations] = useState([]);
  const [patientPakages, setPatientPakages] = useState([]);
  const [consumableorderedList, setConsumableorderedList] = useState([]);
  const [nursingNotes, setNursingNotes] = useState([]);
  const [currentRow, setCurrentRow] = useState({});
  // const [patientProcedures, setPatientProcedures] = useState([]);
  const [patientVital, setPatientVital] = useState([]);
  const [loaderChiefComp, setLoaderChiefComp] = useState(false);
  const [
    loaderSignificantSigns_Others,
    setLoaderSignificantSigns_Others,
  ] = useState(false);
  const [loaderVitals, setLoaderVitals] = useState(false);
  const [openAttachmentsModal, setOpenAttachmentsModal] = useState(false);
  // const [attached_docs, setAttached_docs] = useState([]);
  const [significant_signs, setSignificant_signs] = useState("");
  const [attachmentOpen, setattachmentOpen] = useState(false);
  //       patientComplaints: [],
  //       patientDiagnosis: [],
  //       : [],
  //       patientInvestigations: [],
  //       patientPakages: [],
  //       consumableorderedList: [],
  //       nursingNotes: [],
  //       patientProcedures: [],
  //       patientVital: [],
  //       loaderChiefComp: false,
  //       loaderSignificantSigns_Others: false,
  //       loaderVitals: false,
  //       openAttachmentsModal: false,
  //       attached_docs: [],
  useEffect(() => {
    if (encounter_id) {
      getPatientChiefComplaint(episode_id);
      getPatientChiefComplaint(episode_id);
      getPatientDiagnosis(episode_id);
      getPatientMedication(encounter_id);
      getPatientInvestigation(visit_id);
      getPatientPakages(visit_id, Window.global["mrd_patient"]);
      getConsumableorderedList(visit_id);
      getNursingNotes(visit_id, Window.global["mrd_patient"]);
      getPatientVitals(Window.global["mrd_patient"], visit_id);
      getEncounterDetails(encounter_id);
    } else {
      return;
    }
  }, [episode_id, encounter_id, visit_id, patient_id]);

  // componentDidMount() {
  //   this.getPatientEncounterDetails();
  // }

  // componentDidUpdate(prevProps) {
  //   if (this.props.fromClinicalDesk !== prevProps.fromClinicalDesk) {
  //     this.getPatientEncounterDetails();
  //   }
  // }
  // const { data:patientMrdData } = useQuery(
  //   [
  //     "patient_data_for_encounter",
  //     {
  //       episode_id, enc_id, visit_id,patient_id

  //       // dropdownData: dropdownData,
  //     },
  //   ],
  //   getPatientEncounterDetails,
  //   {
  //     initialData: {
  //       patientComplaints: [],
  //       patientDiagnosis: [],
  //       patientMedications: [],
  //       patientInvestigations: [],
  //       patientPakages: [],
  //       consumableorderedList: [],
  //       nursingNotes: [],
  //       patientProcedures: [],
  //       patientVital: [],
  //     },
  //     // enabled:

  //     refetchOnMount: true,
  //     refetchOnReconnect: true,
  //     // keepPreviousData: true,
  //     refetchOnWindowFocus: false,
  //     initialStale: true,
  //     cacheTime: Infinity,
  //     onSuccess: (data) => {

  //     },
  //     onError: (err) => {
  //       AlgaehMessagePop({
  //         display: err?.message,
  //         type: "error",
  //       });
  //     },
  //   }
  // );
  // async function getPatientEncounterDetails(key, { episode_id, enc_id, visit_id,patient_id }) {

  //       const result = await Promise.all([
  //         newAlgaehApi({
  //           uri: "/mrd/getPatientChiefComplaint",
  //         method: "GET",
  //         data: {
  //           episode_id: episode_id,
  //         },
  //         module: "MRD",
  //         cancelRequestId: "getPatientChiefComplaint",
  //         }),
  //         newAlgaehApi({
  //           uri: "/mrd/getPatientDiagnosis",
  //           module: "MRD",
  //           method: "GET",
  //           data: {
  //             episode_id: episode_id,
  //           },
  //         }),
  //         newAlgaehApi({
  //           uri: "/mrd/getPatientMedication",
  //           module: "MRD",
  //           method: "GET",
  //           data: {
  //             encounter_id: enc_id,
  //           },
  //           cancelRequestId: "getPatientMedication",
  //         }),
  //         newAlgaehApi({
  //           uri: "/mrd/getPatientInvestigation",
  //           module: "MRD",
  //           method: "GET",
  //           data: {
  //             visit_id: visit_id,
  //           },
  //           cancelRequestId: "getPatientInvestigation",
  //         }),
  //         newAlgaehApi({
  //           uri: "/orderAndPreApproval/getPatientPackage",
  //           method: "GET",
  //           data: {
  //             package_visit_type: "ALL",
  //             patient_id: patient_id,
  //             visit_id: visit_id,
  //           },
  //         }),
  //         newAlgaehApi({
  //           uri: "/orderAndPreApproval/getVisitConsumable",
  //           method: "GET",
  //           data: {
  //             visit_id: visit_id, //Window.global["visit_id"]
  //           },
  //           // cancelRequestId: "getPatientInvestigation",
  //         }),
  //         newAlgaehApi({
  //           uri: "/doctorsWorkBench/getNurseNotes",
  //           data: { patient_id, visit_id },
  //           method: "GET",
  //         }),
  //         newAlgaehApi({
  //           uri: "/doctorsWorkBench/getNurseNotes",
  //           data: { patient_id, visit_id },
  //           method: "GET",
  //         }),
  //         newAlgaehApi({
  //           uri: "/doctorsWorkBench/getPatientVitals",
  //           method: "GET",
  //           data: {
  //             patient_id: patient_id,
  //             visit_id: visit_id,
  //           },
  //           cancelRequestId: "getPatientVitals",
  //         }),
  //         newAlgaehApi({
  //           uri: "/doctorsWorkBench/getPatientEncounter",
  //           method: "GET",
  //           data: {
  //             encounter_id: encounter_id,
  //           },
  //         }),

  //       ]);
  //       return {
  //         patientComplaints: result[0]?.data?.records,
  //         patientDiagnosis: result[1]?.data?.records,
  //         // nationalities: result[1]?.data?.records,
  //         patientMedications: result[2]?.data?.records,
  //         patientInvestigations: result[3]?.data?.records,
  //         patientPakages: result[4]?.data?.records,
  //         consumableorderedList: result[5]?.data?.records,
  //         nursingNotes: result[6]?.data?.records,
  //         patientVital: result[7]?.data?.records,
  //         patientMedications: result[2]?.data?.records,
  //       };

  //   }
  //   const {
  //     patientComplaints,
  //       patientDiagnosis,
  //       patientMedications,
  //       patientInvestigations,
  //       patientPakages,
  //       consumableorderedList,
  //       nursingNotes,
  //       patientProcedures,
  //       patientVital,
  //   } = patientMrdData;

  const getEncounterDetails = (encounter_id) => {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientEncounter",
      method: "GET",
      data: {
        encounter_id: encounter_id,
      },
      onSuccess: (response) => {
        let data = response.data.records[0];
        if (response.data.success) {
          setSignificant_signs(data.significant_signs);
          setLoaderSignificantSigns_Others(false);
          // this.setState({
          //   significant_signs: ,
          //   other_signs: data.other_signs,
          //   loaderSignificantSigns_Others: false,
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
  };

  const getPatientVitals = (patient_id, visit_id) => {
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

          setPatientVital(_Vitals);
          setLoaderVitals(false);
        } else if (response.data.records.length === 0) {
          setPatientVital([]);
          setLoaderVitals(false);
          // this.setState({
          //   patientVital: [],
          //   loaderVitals: false,
          // });
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
  };

  const getPatientChiefComplaint = (episode_id) => {
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
          setPatientComplaints(response.data.records);
          setLoaderChiefComp(false);
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };

  const getPatientDiagnosis = (episode_id) => {
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
          setPatientDiagnosis(response.data.records);
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
  };
  const getPatientMedication = (enc_id) => {
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
          setPatientMedications(response.data.records);
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  };
  const getPatientInvestigation = (visit_id) => {
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
          setPatientInvestigations(response.data.records);
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
  };
  const getConsumableorderedList = (visit_id) => {
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
          setConsumableorderedList(response.data.records);
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
  };
  const getNursingNotes = (visit_id, patient_id) => {
    algaehApiCall({
      uri: "/doctorsWorkBench/getNurseNotes",
      data: { patient_id, visit_id },
      method: "GET",
      // cancelRequestId: "getPatientInvestigation",
      onSuccess: (response) => {
        algaehLoader({ show: false });
        if (response.data.success) {
          setNursingNotes(response.data.records);
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
  };
  const getPatientPakages = (visit_id, patient_id) => {
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
          setPatientPakages(response.data.records);
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
  };
  const dateFormater = (value) => {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  };
  // uri: "/doctorsWorkBench/getNurseNotes",
  // data: { patient_id, visit_id },
  // method: "GET",
  // getPatientEncounterDetails() {
  //   algaehLoader({ show: true });

  //   algaehApiCall({
  //     uri: "/mrd/getPatientEncounterDetails",
  //     method: "GET",
  //     data: {
  //       patient_id: Window.global["mrd_patient"],
  //     },
  //     module: "MRD",
  //     onSuccess: (response) => {
  //       algaehLoader({ show: false });
  //       if (response.data.success) {
  //         this.setState({ patientEncounters: response.data.records });
  //       }
  //     },
  //     onFailure: (error) => {
  //       algaehLoader({ show: false });
  //       swalMessage({
  //         title: error.message,
  //         type: "error",
  //       });
  //     },
  //   });
  // }

  const printPatSummary = () => {
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
              value: generalInfo.patient_id, //Window.global["current_patient"]
            },
            {
              name: "visit_id",
              value: generalInfo.visit_id, //Window.global["visit_id"]
            },
            {
              name: "episode_id",
              value: generalInfo.episode_id, // Window.global["episode_id"]
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
  };
  const printSickleave = () => {
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
              value: generalInfo.patient_id, //Window.global["current_patient"]
            },
            {
              name: "visit_id",
              value: generalInfo.visit_id, //Window.global["visit_id"]
            },
            {
              name: "episode_id",
              value: generalInfo.episode_id, // Window.global["episode_id"]
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
  };

  const printPrescription = () => {
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
              value: generalInfo.patient_id, //Window.global["current_patient"]
            },
            {
              name: "visit_id",
              value: generalInfo.visit_id, //Window.global["visit_id"]
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
  };

  const generateReport = (row, report_type) => {
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
  };
  const showAttachments = () => {
    setattachmentOpen((pre) => !pre);
  };
  const showAttachmentsOfServices = (row, attachment_type) => {
    setOpenAttachmentsModal((pre) => !pre);
    setCurrentRow({ ...row, attach_type: attachment_type });
  };

  // const downloadDoc = (doc, isPreview) => {
  //   if (doc.fromPath === true) {
  //     // this.setState({ pdfLoading: true }, () => {
  //     newAlgaehApi({
  //       uri: "/getContractDoc",
  //       module: "documentManagement",
  //       method: "GET",
  //       extraHeaders: {
  //         Accept: "blon",
  //       },
  //       others: {
  //         responseType: "blob",
  //       },
  //       data: {
  //         contract_no: doc.contract_no,
  //         filename: doc.filename,
  //         download: true,
  //       },
  //     })
  //       .then((resp) => {
  //         const urlBlob = URL.createObjectURL(resp.data);
  //         if (isPreview) {
  //           window.open(urlBlob);
  //         } else {
  //           const link = document.createElement("a");
  //           link.download = doc.filename;
  //           link.href = urlBlob;
  //           document.body.appendChild(link);
  //           link.click();
  //           document.body.removeChild(link);
  //         }
  //         // this.setState({ pdfLoading: false });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         // this.setState({ pdfLoading: false });
  //       });
  //     // });
  //   } else {
  //     const fileUrl = `data:${doc.filetype};base64,${doc.document}`;
  //     const link = document.createElement("a");
  //     if (!isPreview) {
  //       link.download = doc.filename;
  //       link.href = fileUrl;
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     } else {
  //       fetch(fileUrl)
  //         .then((res) => res.blob())
  //         .then((fblob) => {
  //           const newUrl = URL.createObjectURL(fblob);
  //           window.open(newUrl);
  //         });
  //     }
  //   }
  // };
  // const getSavedDocument = (row) => {
  //   newAlgaehApi({
  //     uri: "/getContractDoc",
  //     module: "documentManagement",
  //     method: "GET",
  //     data: {
  //       contract_no: row.lab_id_number,
  //     },
  //   })
  //     .then((res) => {
  //       if (res.data.success) {
  //         let { data } = res.data;
  //         setAttached_docs(data);
  //         //   attached_docs: data,
  //         // });
  //       }
  //     })
  //     .catch((e) => {
  //       swalMessage({
  //         title: e.message,
  //         type: "error",
  //       });
  //     });
  // };
  // const getDocuments = (row) => {
  //   newAlgaehApi({
  //     uri: "/getRadiologyDoc",
  //     module: "documentManagement",
  //     method: "GET",
  //     data: {
  //       hims_f_rad_order_id: row.hims_f_rad_order_id,
  //     },
  //   })
  //     .then((res) => {
  //       if (res.data.success) {
  //         let { data } = res.data;
  //         setAttached_docs(data);
  //         // this.setState({
  //         //   attached_docs: data,
  //         // });
  //       }
  //     })
  //     .catch((e) => {
  //       // AlgaehLoader({ show: false });
  //       swalMessage({
  //         title: e.message,
  //         type: "error",
  //       });
  //     });
  // };
  return (
    <div className="col componentRenderArea" style={{ margin: 0 }}>
      <PatientAttachments
        visible={attachmentOpen}
        onClose={showAttachments}
        patientData={{
          hims_d_patient_id: Window.global["mrd_patient"],
          patient_code: Window.global.patient_code,
        }}
        onlyShow={true}
      />
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">OP Encounter Details </h3>
          </div>

          {/* {generalInfo !== undefined
                            ? moment(
                                generalInfo.encountered_date
                              ).format("DD-MM-YYYY HH:mm A")
                            : "----------"} */}
        </div>

        <div className="portlet-body encounterDetailCntr">
          <div className="row">
            <div className="col-12" style={{ marginBottom: 5 }}>
              {generalInfo !== undefined ? (
                <div style={{ float: "right" }}>
                  <button
                    className="btn btn-default"
                    style={{ marginRight: 10 }}
                    onClick={showAttachments}
                  >
                    view Patient Attachments
                  </button>
                  <button
                    className="btn btn-default"
                    style={{ marginRight: 10 }}
                    onClick={printPatSummary}
                  >
                    Print Summary Report
                  </button>
                  <button
                    className="btn btn-default"
                    style={{ marginRight: 10 }}
                    onClick={printSickleave}
                  >
                    Print Sick Leave
                  </button>
                  <button
                    className="btn btn-default"
                    style={{ marginRight: 10 }}
                    onClick={printPrescription}
                  >
                    Print Prescription
                  </button>
                </div>
              ) : null}
            </div>
          </div>
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
                    {generalInfo !== undefined
                      ? moment(generalInfo.encountered_date).format(
                          "DD-MM-YYYY HH:mm A"
                        )
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
                    {generalInfo !== undefined
                      ? "Dr. " + generalInfo.provider_name
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
                    {generalInfo !== undefined
                      ? generalInfo.sub_department_name
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
                    {generalInfo !== undefined
                      ? generalInfo.pri_insurance_provider_name
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
                {loaderChiefComp ? (
                  <div className="col">
                    <Dimmer active>
                      <Loader inline="centered">Loading</Loader>
                    </Dimmer>
                  </div>
                ) : (
                  <div className="col">
                    <h6 className="">
                      {patientComplaints.map((data, index) => {
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
                {loaderSignificantSigns_Others ? (
                  <div className="row">
                    <Dimmer active>
                      <Loader inline="centered">Loading</Loader>
                    </Dimmer>
                  </div>
                ) : (
                  <div className="col">
                    <h6 className="">{significant_signs}</h6>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* VITALS START */}
          <div className="row vitals">
            <div className="col-12">
              <h6 className="smallh6">Vitals</h6>
              {loaderVitals ? (
                <div className="row">
                  <Dimmer active>
                    <Loader inline="centered">Loading</Loader>
                  </Dimmer>
                </div>
              ) : (
                <div className="col-12">
                  <div className="row">
                    {patientVital.length > 0 ? (
                      patientVital.map((item, index) => (
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
                  {patientDiagnosis.map((data, index) => (
                    <h6 className="danger">
                      {data.diagnosis_type === "P"
                        ? "Primary: " +
                          data.daignosis_code +
                          " - " +
                          data.daignosis_description
                        : ""}
                    </h6>
                  ))}
                </div>

                <div className="col">
                  {patientDiagnosis.map((data, index) => (
                    <h6 className="">
                      {data.diagnosis_type === "S"
                        ? "Secondary: " +
                          data.daignosis_code +
                          " - " +
                          data.daignosis_description
                        : ""}
                    </h6>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {patientInvestigations.length !== 0 ? (
            <div className="row investigation">
              <div className="col-lg-12">
                <h6 className="smallh6">Investigation</h6>
                <div className="row">
                  <div className="col-lg-12">
                    <AlgaehDataGrid
                      id="investigation-grid"
                      columns={[
                        {
                          fieldName: "service_type_id",
                          label: "Service Type",
                          displayTemplate: (row) => {
                            return row.service_type_id === 5 ? (
                              <span>Lab</span>
                            ) : row.service_type_id === 11 ? (
                              <span>Radiology</span>
                            ) : null;
                          },
                        },
                        {
                          fieldName: "service_name",
                          label: "Service Name",
                        },
                        // {
                        //   fieldName: "lab_ord_status",
                        //   label: "Lab Order Status",
                        //   displayTemplate: (row) => {
                        //     return (
                        //       <span>
                        //         {row.lab_ord_status === "O"
                        //           ? "Ordered"
                        //           : row.lab_ord_status === "CL"
                        //           ? "Specimen Collected"
                        //           : row.lab_ord_status === "CN"
                        //           ? "Test Cancelled"
                        //           : row.lab_ord_status === "CF"
                        //           ? "Result Confirmed "
                        //           : row.lab_ord_status === "V"
                        //           ? "Result Validated"
                        //           : "----"}
                        //       </span>
                        //     );
                        //   },
                        // },
                        // {
                        //   fieldName: "lab_billed",
                        //   label: "Lab Billed",
                        //   displayTemplate: (row) => {
                        //     return (
                        //       <span>
                        //         {row.lab_billed === "Y" ? "Yes" : "----"}
                        //       </span>
                        //     );
                        //   },
                        // },

                        {
                          fieldName: "lab_ord_status",
                          label: "Status",
                          displayTemplate: (row) => {
                            return row.service_type_id === 5 ? (
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
                            ) : row.service_type_id === 11 ? (
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
                            ) : null;
                          },
                        },

                        // {
                        //   fieldName: "rad_ord_status",
                        //   label: "Radiology Order Status",
                        //   displayTemplate: (row) => {
                        //     return (
                        //       <span>
                        //         {row.rad_ord_status === "O"
                        //           ? "Ordered"
                        //           : row.rad_ord_status === "S"
                        //           ? "Scheduled"
                        //           : row.rad_ord_status === "UP"
                        //           ? "Under Process"
                        //           : row.rad_ord_status === "CN"
                        //           ? "Cancelled"
                        //           : row.rad_ord_status === "RC"
                        //           ? "Result Confirmed"
                        //           : row.rad_ord_status === "RA"
                        //           ? "Result Available"
                        //           : "----"}
                        //       </span>
                        //     );
                        //   },
                        // },
                        // {
                        //   fieldName: "rad_billed",
                        //   label: "Radiology Billed",
                        //   displayTemplate: (row) => {
                        //     return (
                        //       <span>
                        //         {row.rad_billed === "Y" ? "Yes" : "----"}
                        //       </span>
                        //     );
                        //   },
                        // },
                        {
                          fieldName: "intrnReport",
                          label: "Internal Report",
                          displayTemplate: (row) => {
                            return row.service_type_id === 5 &&
                              row.lab_ord_status === "V" ? (
                              <span
                                className="pat-code"
                                style={{ color: "#006699" }}
                                onClick={() => {
                                  generateReport(row, "LAB");
                                }}
                              >
                                View Report
                              </span>
                            ) : row.service_type_id === 11 &&
                              row.rad_ord_status === "RA" ? (
                              <span
                                className="pat-code"
                                style={{ color: "#006699" }}
                                onClick={() => {
                                  generateReport(row, "RAD");
                                }}
                              >
                                View Report
                              </span>
                            ) : null;
                          },
                        },

                        {
                          fieldName: "extrnReport",
                          label: "External Report",
                          displayTemplate: (row) => {
                            return row.service_type_id === 5 &&
                              row.lab_ord_status === "V" ? (
                              <span>
                                <i
                                  className="fas fa-paperclip"
                                  aria-hidden="true"
                                  onClick={() => {
                                    showAttachmentsOfServices(row, "LAB");

                                    // getSavedDocument(row);
                                  }}
                                />
                              </span>
                            ) : row.service_type_id === 11 &&
                              row.rad_ord_status === "RA" ? (
                              <span>
                                <i
                                  className="fas fa-paperclip"
                                  aria-hidden="true"
                                  onClick={(e) => {
                                    showAttachmentsOfServices(row, "RAD");

                                    // getDocuments(row);
                                  }}
                                />
                              </span>
                            ) : null;
                          },
                        },
                        // {
                        //   fieldName: "action",
                        //   label: "Attachments",
                        //   displayTemplate: (row) => {
                        //     return row.lab_billed === "Y" ? (
                        //       <span>
                        //         <i
                        //           className="fas fa-paperclip"
                        //           aria-hidden="true"
                        //           onClick={() => {
                        //             this.setState(
                        //               {
                        //                 openAttachmentsModal: true,
                        //                 // currentRow: row,
                        //                 // lab_id_number: row.lab_id_number,
                        //               },

                        //               this.getSavedDocument.bind(
                        //                 this,
                        //                 row
                        //               )
                        //             );
                        //           }}
                        //         />
                        //       </span>
                        //     ) : (
                        //       "----"
                        //     );
                        //   },
                        // },
                        // {
                        //   fieldName: "radiology_attachments",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{
                        //         forceLabel: "Radiology Attachments",
                        //       }}
                        //     />
                        //   ),
                        //   displayTemplate: (row) => {
                        //     return row.rad_billed === "Y" ? (
                        //       <span>
                        //         <i
                        //           // style={{
                        //           //   pointerEvents:
                        //           //     row.status === "O"
                        //           //       ? ""
                        //           //       : row.sample_status === "N"
                        //           //       ? "none"
                        //           //       : "",
                        //           // }}
                        //           className="fas fa-paperclip"
                        //           aria-hidden="true"
                        //           onClick={(e) => {
                        //             this.setState(
                        //               {
                        //                 openAttachmentsModal: true,
                        //               },

                        //               this.getDocuments.bind(this, row)
                        //             );
                        //           }}
                        //         />
                        //       </span>
                        //     ) : (
                        //       "----"
                        //     );
                        //   },
                        // },
                      ]}
                      keyId="index"
                      data={patientInvestigations}
                      // isEditable={false}
                      pagination={true}
                      // paging={{ page: 0, rowsPerPage: 5 }}
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
          {openAttachmentsModal ? (
            <ViewAttachmentsModal
              rowData={currentRow}
              visible={openAttachmentsModal}
              onClose={showAttachmentsOfServices}
            />
          ) : null}

          {/* <AlgaehModal
            title="View Attachments"
            visible={openAttachmentsModal}
            mask={true}
            maskClosable={false}
            onCancel={() => {
              setAttached_docs(false);
              setAttached_docs([]);
            }}
            footer={[
              <div className="col-12">
                <button
                  onClick={() => {
                    setOpenAttachmentsModal(false);
                    setAttached_docs([]);
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
                          {attached_docs.length ? (
                            attached_docs.map((doc) => (
                              <li>
                                <b> {doc.filename} </b>
                                <span>
                                  <i
                                    className="fas fa-download"
                                    onClick={() => downloadDoc(doc)}
                                  ></i>
                                  <i
                                    className="fas fa-eye"
                                    onClick={() => downloadDoc(doc, true)}
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
          </AlgaehModal> */}
          {patientPakages.length !== 0 ? (
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
                            <AlgaehLabel label={{ fieldName: "Billed" }} />
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
                              <span>{dateFormater(row.created_date)}</span>
                            );
                          },
                        },

                        {
                          fieldName: "service_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Service Type" }}
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
                            <AlgaehLabel label={{ fieldName: "services_id" }} />
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
                            <AlgaehLabel label={{ fieldName: "insurance" }} />
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
                      data={patientPakages}
                      pagination={true}
                      // paging={{ page: 0, rowsPerPage: 10 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {consumableorderedList.length !== 0 ? (
            <div className="row investigation">
              <div className="col-lg-12">
                <h6 className="smallh6">consumables</h6>
                <div className="row">
                  <div className="col-lg-12">
                    <AlgaehDataGrid
                      id="consumables_list"
                      columns={[
                        {
                          fieldName: "billed",
                          label: (
                            <AlgaehLabel label={{ fieldName: "Billed" }} />
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
                              <span>{dateFormater(row.created_date)}</span>
                            );
                          },
                        },

                        {
                          fieldName: "service_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Service Type" }}
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
                            <AlgaehLabel label={{ fieldName: "services_id" }} />
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
                            <AlgaehLabel label={{ forceLabel: "Chargable" }} />
                          ),
                          displayTemplate: (row) => {
                            return row.item_notchargable === "N" ? "Yes" : "No";
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
                            <AlgaehLabel label={{ fieldName: "insurance" }} />
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
                      data={consumableorderedList}
                      pagination={true}
                      // paging={{ page: 0, rowsPerPage: 10 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {patientMedications.length !== 0 ? (
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
                          displayTemplate: (row) => {
                            return row.frequency === "0"
                              ? "1-0-1"
                              : row.frequency === "1"
                              ? "1-0-0"
                              : row.frequency === "2"
                              ? "0-0-1"
                              : row.frequency === "3"
                              ? "0-1-0"
                              : row.frequency === "4"
                              ? "1-1-0"
                              : row.frequency === "5"
                              ? "0-1-1"
                              : row.frequency === "6"
                              ? "1-1-1"
                              : row.frequency === "7"
                              ? "Once only"
                              : row.frequency === "8"
                              ? "Once daily (q24h)"
                              : row.frequency === "9"
                              ? "Twice daily (Bid)"
                              : row.frequency === "10"
                              ? "Three times daily (tid)"
                              : row.frequency === "11"
                              ? "Five times daily"
                              : row.frequency === "12"
                              ? "Every two hours (q2h)"
                              : row.frequency === "13"
                              ? "Every three hours (q3h)"
                              : row.frequency === "14"
                              ? "Every four hours (q4h)"
                              : row.frequency === "15"
                              ? "Every six hours (q6h)"
                              : row.frequency === "16"
                              ? "Every eight hours (q8h)"
                              : row.frequency === "17"
                              ? "Every twelve hours (q12h)"
                              : row.frequency === "18"
                              ? "Four times daily (qid)"
                              : row.frequency === "19"
                              ? "Other (As per need)"
                              : null;
                          },
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
                                {moment(row.start_date).format("DD-MM-YYYY")}
                              </span>
                            );
                          },
                        },
                      ]}
                      keyId="index"
                      data={patientMedications}
                      pagination={true}
                      // isEditable={false}
                      // paging={{ page: 0, rowsPerPage: 5 }}
                      // events={{
                      //   onDelete: (row) => {},
                      //   onEdit: (row) => {},
                      //   onDone: (row) => {},
                      // }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {/* {patientProcedures.length !== 0 ? (
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
              ) : null} */}
          {nursingNotes.length !== 0 ? (
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
                        data: nursingNotes,
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
  );
}
