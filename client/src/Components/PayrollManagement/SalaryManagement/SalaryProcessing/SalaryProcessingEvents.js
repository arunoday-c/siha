import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
// import AlgaehSearch from "../../../Wrapper/globalSearch";
// import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
// import EmployeePaymentIOputs from "../../../../Models/EmployeePayment";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const SalaryProcess = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadSalary'",
    onSuccess: () => {
      let inputObj = {
        hospital_id: $this.state.hospital_id,
        year: $this.state.year,
        month: $this.state.month
      };
      debugger;
      algaehApiCall({
        uri: "/salary/processSalary",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: response => {
          debugger;
          if (
            response.data.result.length > 0 ||
            response.data.result.length === undefined
          ) {
            $this.setState({
              salaryprocess_header: response.data.result.salaryprocess_header,
              salaryprocess_detail: response.data.result.salaryprocess_detail
            });

            swalMessage({
              title: "Processed Successfully...",
              type: "success"
            });
          } else {
            swalMessage({
              title: "Invalid. Please process attendence",
              type: "error"
            });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message || error.response.data.message,
            type: "error"
          });
        }
      });
    }
  });
};

const getSalaryDetails = ($this, row) => {
  debugger;
  const salaryprocess_Earning = Enumerable.from(
    $this.state.salaryprocess_detail[0]
  )
    .where(w => w.salary_header_id === row.hims_f_salary_id)
    .toArray();

  const salaryprocess_Deduction = Enumerable.from(
    $this.state.salaryprocess_detail[1]
  )
    .where(w => w.salary_header_id === row.hims_f_salary_id)
    .toArray();

  const salaryprocess_Contribute = Enumerable.from(
    $this.state.salaryprocess_detail[2]
  )
    .where(w => w.salary_header_id === row.hims_f_salary_id)
    .toArray();

  $this.setState({
    salaryprocess_Earning: salaryprocess_Earning,
    salaryprocess_Deduction: salaryprocess_Deduction,
    salaryprocess_Contribute: salaryprocess_Contribute
  });
};

const TestData = ($this, e) => {
  let inputObj = {
    year: $this.state.year,
    month: $this.state.month
  };
  debugger;
  algaehApiCall({
    uri: "/salary/getSalaryProcess",
    module: "hrManagement",
    data: inputObj,
    method: "GET",
    onSuccess: response => {
      debugger;
      $this.setState({
        salaryprocess_header: response.data.result.salaryprocess_header,
        salaryprocess_detail: response.data.result.salaryprocess_detail
      });
    },
    onFailure: error => {
      swalMessage({
        title: error.message || error.response.data.message,
        type: "error"
      });
    }
  });
};

export { texthandle, SalaryProcess, TestData, getSalaryDetails };
