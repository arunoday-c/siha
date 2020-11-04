import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import Options from "../../../Options.json";
import moment from "moment";

const CollectSample = ($this, context, row) => {
  debugger
  let inputobj = {
    hims_f_lab_order_id: row.hims_f_lab_order_id,
    hims_d_lab_sample_id: row.hims_d_lab_sample_id,
    order_id: row.hims_f_lab_order_id,
    sample_id: row.sample_id,
    collected: "Y",
    status: "N",
    hims_d_hospital_id: $this.state.hospital_id,
    service_id: row.service_id,
    service_code: row.service_code,
    send_out_test: row.send_out_test,
    container_id: row.container_id
  };

  algaehApiCall({
    uri: "/laboratory/updateLabOrderServices",
    module: "laboratory",
    data: inputobj,
    method: "PUT",
    onSuccess: (response) => {
      if (response.data.success === true) {
        let test_details = $this.state.test_details;
        for (let i = 0; i < test_details.length; i++) {
          if (
            test_details[i].hims_d_lab_sample_id === row.hims_d_lab_sample_id
          ) {
            test_details[i].collected = response.data.records.collected;
            test_details[i].collected_by = response.data.records.collected_by;
            test_details[i].collected_date =
              response.data.records.collected_date;
          }
        }

        $this.setState({ test_details: test_details }, () => {
          swalMessage({
            title: "Collected Successfully",
            type: "success",
          });
        });

        if (context !== undefined) {
          context.updateState({ test_details: test_details });
        }
      }
    },
    onFailure: (error) => {
      swalMessage({
        title: error.response.data.message || error.message,
        type: "error",
      });
    },
  });
};

const printBarcode = ($this, row, e) => {
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
        others: {
          width: "50mm",
          height: "20mm",
          showHeaderFooter: false,
        },
        reportName: "specimenBarcode",
        reportParams: [
          {
            name: "hims_f_lab_order_id",
            value: row.hims_f_lab_order_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Specimen Barcode`;
      window.open(origin);
      window.document.title = "Specimen Barcode";
    },
  });
};

// const printBarcode = ($this, row, e) => {
//   AlgaehReport({
//     report: {
//       fileName: "sampleBarcode",
//       barcode: {
//         parameter: "bar_code",
//         options: {
//           format: "",
//           lineColor: "#0aa",
//           width: 4,
//           height: 40
//         }
//       }
//     },
//     data: {
//       bar_code: $this.state.patient_code + row.service_code
//     }
//   });
// };

const dateFormater = (value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const onchangegridcol = ($this, row, e) => {
  let test_details = $this.state.test_details;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let _index = test_details.indexOf(row);
  row[name] = value;

  test_details[_index] = row;
  $this.setState({ test_details: test_details });
};

export { CollectSample, printBarcode, dateFormater, onchangegridcol };
