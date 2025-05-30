import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import _ from "lodash";
const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
  });
};

const SalaryProcess = ($this, from) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadSalary'",
    onSuccess: () => {
      AlgaehLoader({ show: true });

      let inputObj = {
        year: $this.state.year,
        month: $this.state.month,
        hospital_id: $this.state.hospital_id,
      };
      if ($this.state.employee_id !== null) {
        inputObj.employee_id = $this.state.employee_id;
      }

      if ($this.state.sub_department_id !== null) {
        inputObj.sub_department_id = $this.state.sub_department_id;
      }

      algaehApiCall({
        uri: "/salary/processSalary",
        module: "hrManagement",
        data: inputObj,
        method: "GET",
        onSuccess: (response) => {
          if (response.data.result.length > 0) {
            let data = response.data.result[0];
            let finalizeBtn = true;
            let strMessage = "Salary already finalized for selected criteria.";
            let not_process = Enumerable.from(data.salaryprocess_header)
              .where((w) => w.salary_processed === "N")
              .toArray();
            if (not_process.length > 0) {
              finalizeBtn = false;
              strMessage = "Salary Loaded Successfully.";
            }
            $this.setState({
              salaryprocess_header: data.salaryprocess_header,
              salaryprocess_detail: data.salaryprocess_detail,
              finalizeBtn: finalizeBtn,
            });
            AlgaehLoader({ show: false });

            if (from === "load") {
              swalMessage({
                title: strMessage,
                type: "success",
              });
            }
          } else {
            $this.setState({
              salaryprocess_header: [],
              salaryprocess_detail: [],
              finalizeBtn: true,
            });
            AlgaehLoader({ show: false });
            swalMessage({
              title: "Invalid. Please process attendence",
              type: "error",
            });
          }
        },
        onFailure: (error) => {
          AlgaehLoader({ show: false });
          $this.setState({
            salaryprocess_header: [],
            salaryprocess_detail: [],
            finalizeBtn: true,
          });
          swalMessage({
            title: error.message || error.response.data.message,
            type: "error",
          });
        },
      });
    },
  });
};

const ClearData = ($this) => {
  $this.setState({
    year: moment().year(),
    month: moment(new Date()).format("M"),
    sub_department_id: null,
    salary_type: null,
    salaryprocess_header: [],
    salaryprocess_Earning: [],
    salaryprocess_Deduction: [],
    salaryprocess_Contribute: [],
    finalizeBtn: true,
    employee_id: null,
    employee_name: null,

    total_days: null,
    absent_days: null,
    total_work_days: null,
    total_weekoff_days: null,
    total_holidays: null,
    total_leave: null,
    paid_leave: null,
    unpaid_leave: null,
    present_days: null,
    pending_unpaid_leave: null,
    total_paid_days: null,

    total_earnings: null,
    total_deductions: null,
    loan_payable_amount: null,
    loan_due_amount: null,
    net_salary: null,
    salary_dates: null,
  });
};

const FinalizeSalary = ($this) => {
  AlgaehLoader({ show: true });

  const salary_header_id = _.map($this.state.salaryprocess_header, (o) => {
    return o.hims_f_salary_id;
  });

  const employee_id = _.map($this.state.salaryprocess_header, (o) => {
    return o.employee_id;
  });

  const net_salary = _.map($this.state.salaryprocess_header, (o) => {
    return {
      net_salary: o.net_salary,
      total_paid_days: o.total_paid_days,
      employee_id: o.employee_id,
    };
  });

  const salary_date = "01-" + $this.state.month + "-" + $this.state.year;
  const salary_end_date = moment(salary_date)
    .endOf("month")
    .format("YYYY-MM-DD");

  // const salary_end_date = "";

  let inputObj = {
    fron_salary: "Y",
    salary_end_date: salary_end_date,
    salary_header_id: salary_header_id,
    employee_id: employee_id,
    year: $this.state.year,
    month: $this.state.month,
    hospital_id: $this.state.hospital_id,
    net_salary: net_salary,
  };

  algaehApiCall({
    uri: "/salary/finalizedSalaryProcess",
    module: "hrManagement",
    data: inputObj,
    method: "PUT",
    onSuccess: (response) => {
      if (response.data.success) {
        SalaryProcess($this, "finalize");
        $this.setState({
          finalizeBtn: true,
        });
        AlgaehLoader({ show: false });
        swalMessage({
          title: "Finalized Successfully.",
          type: "success",
        });
      } else {
        AlgaehLoader({ show: false });
        swalMessage({
          title: response.data.result,
          type: "error",
        });
      }
    },
    onFailure: (error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message || error.response.data.message,
        type: "error",
      });
    },
  });
};

const employeeSearch = ($this) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee,
    },
    searchName: "employee",
    uri: "/gloabelSearch/get",
    inputs:
      $this.state.sub_department_id !== null
        ? "sub_department_id = " + $this.state.sub_department_id
        : "1=1",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: (row) => {
      $this.setState({
        employee_name: row.full_name,
        employee_id: row.hims_d_employee_id,
      });
    },
  });
};

const openSalaryComponents = ($this, row) => {
  const salaryprocess_Earning = Enumerable.from(
    $this.state.salaryprocess_detail[0]
  )
    .where((w) => w.salary_header_id === row.hims_f_salary_id)
    .toArray();

  const salaryprocess_Deduction = Enumerable.from(
    $this.state.salaryprocess_detail[1]
  )
    .where((w) => w.salary_header_id === row.hims_f_salary_id)
    .toArray();

  const salaryprocess_Contribute = Enumerable.from(
    $this.state.salaryprocess_detail[2]
  )
    .where((w) => w.salary_header_id === row.hims_f_salary_id)
    .toArray();

  $this.setState({
    isOpen: !$this.state.isOpen,
    salaryprocess_Earning: salaryprocess_Earning,
    salaryprocess_Deduction: salaryprocess_Deduction,
    salaryprocess_Contribute: salaryprocess_Contribute,

    total_earnings: row.total_earnings,
    total_deductions: row.total_deductions,
    loan_payable_amount: row.loan_payable_amount,
    loan_due_amount: row.loan_due_amount,
    net_salary: row.net_salary,

    total_days: row.total_days,
    absent_days: row.absent_days,
    total_work_days: row.total_work_days,
    total_weekoff_days: row.total_weekoff_days,
    total_holidays: row.total_holidays,
    total_leave: row.total_leave,
    paid_leave: row.paid_leave,
    unpaid_leave: row.unpaid_leave,
    present_days: row.present_days,
    total_paid_days: row.total_paid_days,
    dis_employee_name: row.full_name,
  });
};

const closeSalaryComponents = ($this, e) => {
  $this.setState({
    isOpen: !$this.state.isOpen,
  });
};

export {
  texthandle,
  SalaryProcess,
  FinalizeSalary,
  ClearData,
  employeeSearch,
  openSalaryComponents,
  closeSalaryComponents,
};
