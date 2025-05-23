import AlgaehSearch from "../Wrapper/globalSearch";
import spotlightSearch from "../../Search/spotlightSearch.json";
import { swalMessage } from "../../utils/algaehApiCall.js";

export default function employeeSearch(inputs, callback) {
  if (inputs.hospital_id === null || inputs.hospital_id === undefined) {
    swalMessage({
      title: "Please Select Branch",
      type: "warning"
    });
    document.querySelector("[name='hospital_id']").focus();
    return
  }
  let input_data = " hospital_id=" + inputs.hospital_id;
  if (inputs.sub_department_id) {
    input_data += " and sub_department_id=" + inputs.sub_department_id;
    if (inputs.designation_id) {
      input_data += " and employee_designation_id=" + inputs.designation_id;
    }
  }
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee
    },
    searchName: "employee_project",
    uri: "/gloabelSearch/get",
    inputs: input_data,
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      console.log(row, "emp details");
      // let arr = employees;
      // arr.push(row);
      // getDesignations(row.sub_department_id);

      callback(row);
      // setEmployees(employees);
    }
  });
}
