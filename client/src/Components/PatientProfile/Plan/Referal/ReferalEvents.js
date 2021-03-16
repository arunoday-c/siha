import {
  AlgaehValidation,
  successfulMessage,
} from "../../../../utils/GlobalFunctions";
import { algaehApiCall } from "../../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
  });
};

const addReferal = ($this) => {
  // e.preventDefault();
  AlgaehValidation({
    querySelector: "data-validate='referalValidate'",
    alertTypeIcon: "warning",
    onSuccess: () => {
      const { current_patient, episode_id, visit_id } = Window.global;
      if (
        $this.state.referral_type === "I" &&
        $this.state.doctor_id === undefined
      ) {
        successfulMessage({
          message: "Please select Doctor",
          title: "Warning",
          icon: "warning",
        });
      } else {
        let inputObj = {
          patient_id: current_patient, //Window.global["current_patient"],
          episode_id: episode_id, //Window.global["episode_id"],
          referral_type: $this.state.referral_type,
          sub_department_id: $this.state.sub_department_id,
          doctor_id: $this.state.doctor_id,
          hospital_name: $this.state.hospital_name,
          reason: $this.state.reason,
          external_doc_name: $this.state.external_doc_name,
          visit_id: visit_id,
        };
        algaehApiCall({
          uri: "/doctorsWorkBench/addReferalDoctor",
          data: inputObj,
          method: "POST",
          onSuccess: (response) => {
            if (response.data.success) {
              successfulMessage({
                message: "Added Succesfully...",
                title: "Success",
                icon: "success",
              });
            }

            $this.setState(
              {
                doctor_id: undefined,
                sub_department_id: undefined,
                hospital_name: "",
                reason: "",
                external_doc_name: "",
                doctor_department: "",
                changed: true,
              }
              // () => {
              //   $this.getPatientReferralDoc();
              // }
            );
          },
          onFailure: (error) => {
            successfulMessage({
              message: error.message,
              title: "Error",
              icon: "error",
            });
          },
        });
      }
    },
  });
};

const radioChange = ($this, e) => {
  let _external_doc_name = {};
  let _radio = false;
  if (e.target.value === "I") {
    _radio = true;
    _external_doc_name = { external_doc_name: "" };
  }
  $this.setState({
    referral_type: e.target.value,
    radio: _radio,
    sub_department_id: null,
    hospital_name: "",
    reason: "",
    doctor_department: "",
    ..._external_doc_name,
  });
};

// const printReferral = ($this, row) => {
//   console.log(row);
//   algaehApiCall({
//     uri: "/report",
//     method: "GET",
//     module: "reports",
//     headers: {
//       Accept: "blob",
//     },
//     others: { responseType: "blob" },
//     data: {
//       report: {
//         reportName: "doctorReferralReport",
//         reportParams: [
//           {
//             name: "hims_f_patient_referral_id",
//             value: row.hims_f_patient_referral_id,
//           },
//           {
//             name: "patient_id",
//             value: row.patient_id,
//           },
//           {
//             name: "episode_id",
//             value: row.episode_id,
//           },
//           {
//             name: "visit_id",
//             value: row.visit_id,
//           },
//         ],
//         outputFileType: "PDF",
//       },
//     },
//     onSuccess: (res) => {
//       // const url = URL.createObjectURL(res.data);
//       // let myWindow = window.open(
//       //   "{{ product.metafields.google.custom_label_0 }}",
//       //   "_blank"
//       // );

//       // myWindow.document.write(
//       //   "<iframe src= '" + url + "' width='100%' height='100%' />"
//       // );
//       const urlBlob = URL.createObjectURL(res.data);
//       // const documentName="Salary Slip"
//       const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Doctor Referral Letter`;
//       window.open(origin);
//     },
//   });
// };

export { texthandle, addReferal, radioChange };
