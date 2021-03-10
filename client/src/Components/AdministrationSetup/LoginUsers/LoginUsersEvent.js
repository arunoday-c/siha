import { algaehApiCall } from "../../../utils/algaehApiCall.js";
// import moment from "moment";

const generateUserListReport = ($this) => {
  algaehApiCall({
    uri: "/report",
    // uri: "/excelReport",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "loginUserList",
        pageOrentation: "landscape",
        // excelTabName: `${$this.state.inputs.hospital_name} | ${moment(
        //   $this.state.inputs.month,
        //   "MM"
        // ).format("MMM")}-${$this.state.inputs.year}`,
        excelHeader: false,
        // reportParams: [
        //   {
        //     name: "hospital_id",
        //     value: $this.state.inputs.hospital_id,
        //   },
        //   {
        //     name: "year",
        //     value: $this.state.inputs.year,
        //   },
        //   {
        //     name: "month",
        //     value: $this.state.inputs.month,
        //   },
        //   {
        //     name: "department_id",
        //     value: $this.state.inputs.department_id,
        //   },
        //   {
        //     name: "sub_department_id",
        //     value: $this.state.inputs.sub_department_id,
        //   },
        //   {
        //     name: "designation_id",
        //     value: $this.state.inputs.designation_id,
        //   },
        //   {
        //     name: "group_id",
        //     value: $this.state.inputs.group_id,
        //   },
        //   {
        //     name: "hims_d_employee_id",
        //     value: $this.state.inputs.hims_d_employee_id,
        //   },
        // ],
        outputFileType: "EXCEL", //"EXCEL", //"PDF",
      },
    },
    onSuccess: (res) => {
      // const urlBlob = URL.createObjectURL(res.data);
      // const a = document.createElement("a");
      // a.href = urlBlob;
      // a.download = `Loan Reconciliation Report ${moment(
      //   $this.state.inputs.month,
      //   "MM"
      // ).format("MMM")}-${$this.state.inputs.year}.${"xlsx"}`;
      // a.click();

      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=User List Report`;
      window.open(origin);
    },
  });
};

export { generateUserListReport };
