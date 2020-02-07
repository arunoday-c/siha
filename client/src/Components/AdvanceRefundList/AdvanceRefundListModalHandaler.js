import moment from "moment";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../utils/algaehApiCall.js";
import _ from "lodash";
export const getAdvanceRefundList = $this => {
  let year = moment().format("YYYY");
  let month = moment().format("MM");

  algaehApiCall({
    uri: "/patientRegistration/getPatientAdvaceAndRefund",
    module: "frontDesk",
    method: "GET",
    data: {
      patient_id: $this.props.inputsparameters.hims_f_patient_id
    },
    onSuccess: res => {
      if (res.data.success) {
        const result = res.data.records;
        const advance_amount = _.chain(result)
          .filter(f => f.transaction_type === "Advance")
          .sumBy(s =>
            typeof s.advance_amount === "string"
              ? parseFloat(s.advance_amount)
              : s.advance_amount
          )
          .value();
        const refund_amount = _.chain(result)
          .filter(f => f.transaction_type === "Refund")
          .sumBy(s =>
            typeof s.advance_amount === "string"
              ? parseFloat(s.advance_amount)
              : s.advance_amount
          )
          .value();
        $this.setState({
          advaceRefundList: res.data.records,
          advance_amount,
          refund_amount,
          loading: false
        });
      }
    },
    onFailure: error => {
      $this.setState({
        loading: false
      });
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

export const generateAdvanceRefundReceipt = (row, that) => {
  // debugger;
  // console.log("row_result", row);
  const {
    patient_code,
    full_name,
    hims_f_patient_id
  } = that.props.inputsparameters;
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob"
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "advanceRefundReceipt",
        reportParams: [
          {
            name: "transaction_type",
            value: row.transaction_type
          },
          {
            name: "receipt_number",
            value: row.receipt_number
          },
          {
            name: "receipt_date",
            value: row.receipt_date
          },
          {
            name: "advance_amount",
            value: row.advance_amount
          },
          {
            name: "cashier",
            value: row.cashier
          },
          {
            name: "patient_code",
            value: patient_code
          },
          {
            name: "full_name",
            value: full_name
          },
          {
            name: "hims_f_patient_id",
            value: hims_f_patient_id
          }
        ],
        pageSize: "A5",
        pageOrentation: "landscape",
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const url = URL.createObjectURL(res.data);
      let myWindow = window.open(
        "{{ product.metafields.google.custom_label_0 }}",
        "_blank"
      );

      myWindow.document.write(
        "<iframe src= '" + url + "' width='100%' height='100%' />"
      );
      myWindow.document.title = "Receipt";
    }
  });
};
