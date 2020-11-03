import { algaehApiCall } from "../../../../utils/algaehApiCall.js";
const texthandler = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
  });
};

const generateLoanEmiReport = ($this, row) => {
  console.log(row);
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
        reportName: "loanEmiSlip",
        reportParams: [
          {
            name: "hims_f_loan_application_id",
            value: row.hims_f_loan_application_id,
          },
        ],
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
      // const documentName="Salary Slip"
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Loan EMI Slip for ${row.employee_code}-${row.employee_name}`;
      window.open(origin);
    },
  });
};

export { texthandler, generateLoanEmiReport };
