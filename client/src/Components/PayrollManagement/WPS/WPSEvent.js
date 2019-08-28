import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import _ from "lodash";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import moment from "moment";

export default function WPSEvents() {
  return {
    getWpsEmployees: $this => {
      AlgaehValidation({
        alertTypeIcon: "warning",
        onSuccess: () => {
          algaehApiCall({
            uri: "/salary/getWpsEmployees",
            method: "GET",
            data: {
              year: $this.state.year,
              month: $this.state.month,
              company_bank_id: $this.state.bank_id
            },
            module: "hrManagement",
            onSuccess: res => {
              if (res.data.success) {
                let data = res.data.records;
                debugger;
                if (Object.keys(data).length > 0) {
                  $this.setState({
                    employees: data.employees,
                    total_basic: data.total_basic,
                    total_deductions: data.total_deductions,
                    total_net_salary: data.total_net_salary,
                    button_enable: false
                  });
                }
              }
            },
            onFailure: err => {
              swalMessage({
                title: err.message,
                type: "error"
              });
            }
          });
        }
      });
    },
    getCompanyAccount: $this => {
      algaehApiCall({
        uri: "/companyAccount/getCompanyAccount",
        module: "masterSettings",
        method: "GET",
        onSuccess: res => {
          if (res.data.success) {
            $this.setState({
              companyAccount: res.data.records
            });
          }
        },
        onFailure: err => {
          swalMessage({
            title: err.message,
            type: "error"
          });
        }
      });
    },

    clearState: $this => {
      $this.setState({
        employees: [],
        year: moment().year(),
        month: moment(new Date()).format("M"),
        button_enable: true,
        bank_id: null,
        fileName: null,
        csvData: "",
        employer_cr_no: null,
        payer_cr_no: null,
        bank_short_name: null,
        account_number: null
      });
    },

    dropDownHandler: ($this, e) => {
      $this.setState({
        [e.name]: e.value
      });
    },

    deleteFunction: () => {
      swalMessage({
        title: "Cannot Delete..",
        type: "warning"
      });
    },

    updateWPS: ($this, row) => {
      let employees = $this.state.employees;
      employees[row.rowIdx] = row;
      $this.setState({
        employees: employees
      });
    },

    changeGridEditors: ($this, row, e) => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      row[name] = value;
      row.update();
    },

    generateSIFFile: $this => {
      let employees = $this.state.employees;
      let today = moment().format("YYYYMMDD");
      //Header Data
      let _csvString =
        "Employer CR-NO,Payer CR-NO,Payer Bank Short Name,Payer Account Number,Salary Year,Salary Month,Total Salary,Number Of Records,Payment Type \n ";

      _csvString +=
        $this.state.employer_cr_no +
        "," +
        $this.state.payer_cr_no +
        "," +
        $this.state.bank_short_name +
        "," +
        $this.state.account_number +
        "," +
        $this.state.year +
        "," +
        $this.state.month +
        "," +
        $this.state.total_net_salary +
        "," +
        employees.length +
        ",Salary \n";
      //Detail Data
      _csvString +=
        "Employee ID Type,Employee Code,Reference Number,Employee Name,Employee BIC,Employee Account No.,Salary Frequency,No. of Working Days,Net Salary,Basic Salary,Extra Hours,Extra Income,Deductions,Social Security Deductions,Notes/Comments \n";

      for (let i = 0; i < employees.length; i++) {
        _csvString +=
          employees[i].emp_id_type +
          "," +
          employees[i].employee_code +
          "," +
          employees[i].salary_number +
          "," +
          employees[i].employee_name +
          "," +
          employees[i].employee_bank_ifsc_code +
          "," +
          employees[i].employee_account_number +
          "," +
          employees[i].salary_freq +
          "," +
          employees[i].total_work_days +
          "," +
          employees[i].net_salary +
          "," +
          employees[i].basic_salary +
          "," +
          employees[i].complete_ot +
          "," +
          employees[i].extra_income +
          "," +
          employees[i].total_deductions +
          "," +
          0 +
          "," +
          employees[i].notes_comments +
          "\n";
      }

      let fileName =
        "SIF" +
        "_" +
        $this.state.payer_cr_no +
        "_" +
        $this.state.bank_short_name +
        "_" +
        today;
      let csvContent = "data:text/csv;charset=utf-8," + _csvString;
      var encodedUri = encodeURI(csvContent);

      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", fileName + ".sif");
      link.click();
    },
    BankEventHandaler: ($this, e) => {
      $this.setState({
        [e.name]: e.value,
        employer_cr_no: e.selected.employer_cr_no,
        payer_cr_no: e.selected.payer_cr_no,
        bank_short_name: e.selected.bank_short_name,
        account_number: e.selected.account_number
      });
    }
  };
}
