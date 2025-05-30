import { newAlgaehApi } from "../../../hooks";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import AlgaehLoader from "../../Wrapper/fullPageLoader";

// export async function saveDocument(files = [], contract_no, contract_id) {
 
//   const formData = new FormData();
//   formData.append("contract_no", contract_no);
//   formData.append("contract_id", contract_id);
//   files.forEach((file, index) => {
//     formData.append(`file_${index}`, file, file.name);
//   });
//   const result = await newAlgaehApi({
//     uri: "/saveContractDoc",
//     data: formData,
//     extraHeaders: { "Content-Type": "multipart/form-data" },
//     method: "POST",
//     module: "documentManagement",
//   });
//   return result.data;
// }
// export const saveDocument = async(files = [], contract_no, contract_id) => {
//   const formData = new FormData();
//   formData.append("doc_number", contract_no);
//   formData.append("nameOfTheFolder", "LaboratoryDocuments");
//   formData.append("PatientFolderName", row.patient_code);
//   files.forEach((file, index) => {
//     formData.append(`file_${index}`, file, file.name);
//     formData.append("fileName", file.name);
//   });

//   newAlgaehApi({
//     uri: "/uploadPatientDoc",
//     data: formData,
//     extraHeaders: { "Content-Type": "multipart/form-data" },
//     method: "POST",
//     module: "documentManagement",
//   })
//     .then((res) => {
//       getDocuments(row.hims_f_rad_order_id);
//       // addDiagramFromMaster(contract_id, res.data.records);
//       swalMessage({
//         type: "success",
//         title: "Request Added successfully",
//       });
//       // return;
//       // getDocuments(contract_no);
//     })
//     .catch((e) => {
//       swalMessage({
//         type: "error",
//         title: e.message,
//       });
//     });
// };
// export async function getDocuments(contract_no,row) {
 
//   const result = await newAlgaehApi({
//       uri: "/getUploadedPatientFiles",
//       module: "documentManagement",
//       method: "GET",
//       data: {
//         doc_id: contract_no,
//         filePath: `PatientDocuments/${row.patient_code}/LaboratoryDocuments/${contract_no}/`,
//         nameOfTheFolder:"LaboratoryDocuments",
//         patient_code:row.patient_code,
//       },
//     });
//     debugger;
//     return result.data;
      
// //   const result = await newAlgaehApi({
// //     uri: "/getContractDoc",
// //     module: "documentManagement",
// //     method: "GET",
// //     data: {
// //       contract_no,
// //     },
// //   });
// //   debugger;
// //   return result.data.data;
// }

const reloadAnalytesMaster = (row) => {
  AlgaehLoader({ show: true });

  const inputObj = {
    test_id: row.test_id,
    date_of_birth: row.date_of_birth,
    gender: row.gender,
    order_id: row.hims_f_lab_order_id,
  };
  newAlgaehApi({
    uri: "/laboratory/reloadAnalytesMaster",
    module: "laboratory",
    method: "PUT",
    data: inputObj,
  })
    .then((response) => {
      if (response.data.success) {
        swalMessage({
          title: "Reloaded Succefully...",
          type: "success",
        });
        AlgaehLoader({ show: false });
      }
    })
    .catch((error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error",
      });
    });
};

const printLabWorkListReport = (row) => {
  debugger;
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
        reportName: "LabWorkListReport",
        reportParams: [
          {
            name: "hims_d_patient_id",
            value: row.patient_id,
          },
          {
            name: "visit_id",
            value: row.visit_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);

      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Lab Work List Report`;
      window.open(origin);
      // window.document.title = "";
    },
  });
};

const generateLabResultReport = (data) => {
  return new Promise((resolve, reject) => {
    let portalParams = {};

    debugger;
    portalParams["reportToPortal"] = "true";

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
          // reportName: "hematologyTestReport",
          ...portalParams,
          reportName:
            data?.isPCR === "Y" ? "pcrTestReport" : "hematologyTestReport",
          reportParams: [
            { name: "hims_d_patient_id", value: data.patient_id },
            {
              name: "visit_id",
              value: data.visit_id,
            },
            {
              name: "hims_f_lab_order_id",
              value: data.hims_f_lab_order_id,
            },
            {
              name: "service_id",
              value: data.service_id,
            },
          ],
          qrCodeReport: true,
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        resolve();
      },
      onCatch: (err) => {
        reject(err);
      },
    });
  });
};

export {
  reloadAnalytesMaster,
  printLabWorkListReport,
  generateLabResultReport,
};
