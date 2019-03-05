import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import AlgaehReport from "../../Wrapper/printReports";
import Options from "../../../Options.json";
import moment from "moment";

const CollectSample = ($this, context, row) => {
  let inputobj = {
    hims_f_lab_order_id: row.hims_f_lab_order_id,
    hims_d_lab_sample_id: row.hims_d_lab_sample_id,
    order_id: row.hims_f_lab_order_id,
    sample_id: row.sample_id,
    collected: "Y",
    status: "N",
    hims_d_hospital_id: 1,
    service_id: row.service_id
  };

  algaehApiCall({
    uri: "/laboratory/updateLabOrderServices",
    module: "laboratory",
    data: inputobj,
    method: "PUT",
    onSuccess: response => {
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
            type: "success"
          });
        });

        if (context !== undefined) {
          context.updateState({ test_details: test_details });
        }
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.response.data.message || error.message,
        type: "error"
      });
    }
  });
};

const printBarcode = ($this, row, e) => {
  AlgaehReport({
    report: {
      fileName: "sampleBarcode",
      barcode: {
        parameter: "patient_code",
        options: {
          format: "",
          lineColor: "#0aa",
          width: 4,
          height: 40
        }
      }
    },
    data: {
      patient_code: $this.state.patient_code + row.service_code
    }
  });
};

const dateFormater = value => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

export { CollectSample, printBarcode, dateFormater };
