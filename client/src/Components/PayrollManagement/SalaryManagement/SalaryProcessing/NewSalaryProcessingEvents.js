import Enumerable from "linq";
import { swalMessage, algaehApiCall, getCookie } from "../../../../utils/algaehApiCall.js";
import {
  AlgaehValidation,
  AlgaehOpenContainer
} from "../../../../utils/GlobalFunctions";
import moment from "moment";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import _ from "lodash";
import swal from "sweetalert2";

const SalaryProcess = ($this, inputs, from) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='loadSalary'",
    onSuccess: () => {
      AlgaehLoader({ show: true });

      $this.setState(
        prevState => {
          return { inputs: !inputs ? prevState.inputs : inputs };
        },
        () => {
          let inputs = $this.state.inputs;
          let inputObj = {
            year: inputs.year,
            month: inputs.month,
            hospital_id: inputs.hospital_id
          };
          if (inputs.hims_d_employee_id !== null) {
            inputObj.employee_id = inputs.hims_d_employee_id;
          }

          if (inputs.sub_department_id !== null) {
            inputObj.sub_department_id = inputs.sub_department_id;
          }

          if (inputs.department_id !== null) {
            inputObj.department_id = inputs.department_id;
          }
          if (inputs.group_id !== null) {
            inputObj.group_id = inputs.group_id;
          }

          algaehApiCall({
            uri: "/salary/processSalary",
            module: "hrManagement",
            data: inputObj,
            method: "GET",
            onSuccess: response => {
              if (response.data.success) {
                if (response.data.result.length > 0) {
                  let data = response.data.result[0];
                  let finalizeBtn = true;
                  let strMessage =
                    "Salary already finalized for selected criteria.";
                  let not_process = Enumerable.from(data.salaryprocess_header)
                    .where(w => w.salary_processed === "N")
                    .toArray();
                  if (not_process.length > 0) {
                    finalizeBtn = false;
                    strMessage = "Salary Loaded Successfully.";
                  }
                  $this.setState({
                    salaryprocess_header: data.salaryprocess_header,
                    salaryprocess_detail: data.salaryprocess_detail,
                    finalizeBtn: finalizeBtn
                  });
                  AlgaehLoader({ show: false });

                  if (from === "load") {
                    swalMessage({
                      title: strMessage,
                      type: "success"
                    });
                  }
                } else {
                  $this.setState({
                    salaryprocess_header: [],
                    salaryprocess_detail: [],
                    finalizeBtn: true
                  });
                  AlgaehLoader({ show: false });
                  swalMessage({
                    title: "Attendance not processed for selected criteria.",
                    type: "warning"
                  });
                }
              } else {
                AlgaehLoader({ show: false });
                swalMessage({
                  title: response.data.result.message,
                  type: "warning"
                });

              }

            },
            onFailure: error => {
              AlgaehLoader({ show: false });
              $this.setState({
                salaryprocess_header: [],
                salaryprocess_detail: [],
                finalizeBtn: true
              });
              swalMessage({
                title: error.message || error.response.data.message,
                type: "error"
              });
            }
          });
        }
      );
    }
  });
};

const ClearData = $this => {
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
    salary_dates: null
  });
};

const FinalizeSalary = $this => {
  swal({
    title: "You want to finalize the salary?",
    text:
      "Please verify all the information before finalize, Once finalize can't be revert back.",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Finalize",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancel"
  }).then(willFinalize => {
    if (willFinalize.value) {
      AlgaehLoader({ show: true });
      const { salaryprocess_header } = $this.state;

      const salary_header_id = salaryprocess_header.map(o => {
        return o.hims_f_salary_id;
      });

      const employee_id = salaryprocess_header.map(o => {
        return o.employee_id;
      });

      const net_salary = salaryprocess_header.map(o => {
        return {
          net_salary: o.net_salary,
          total_paid_days: o.total_paid_days,
          employee_id: o.employee_id
        };
      });

      const _leave_salary_acc = _.filter(salaryprocess_header, f => {
        return f.leave_salary_accrual_amount > 0;
      });

      let hrms_options = JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("hrOptions"))
      );

      let salary_date =
        "01-" + $this.state.inputs.month + "-" + $this.state.inputs.year;
      let salary_end_date = moment(salary_date)
        .endOf("month")
        .format("YYYY-MM-DD");
      if (hrms_options.attendance_starts === "PM") {
        salary_date =
          hrms_options.at_st_date +
          "-" +
          $this.state.inputs.month +
          "-" +
          $this.state.inputs.year;
        salary_end_date =
          $this.state.inputs.year +
          "-" +
          $this.state.inputs.month +
          "-" +
          hrms_options.at_end_date;
      }

      let annual_leave_calculation = JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("hrOptions"))
      ).annual_leave_calculation;
      let inputObj = {
        fron_salary: "Y",
        salary_end_date: salary_end_date,
        salary_header_id: salary_header_id,
        employee_id: employee_id,
        year: $this.state.inputs.year,
        month: $this.state.inputs.month,
        hospital_id: $this.state.inputs.hospital_id,
        net_salary: net_salary,
        _leave_salary_acc: _leave_salary_acc,
        annual_leave_calculation: annual_leave_calculation,
        ScreenCode: getCookie("ScreenCode")
      };

      algaehApiCall({
        uri: "/salary/finalizedSalaryProcess",
        module: "hrManagement",
        data: inputObj,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            SalaryProcess($this, null, "finalize");
            $this.setState({
              finalizeBtn: true
            });
            AlgaehLoader({ show: false });
            swalMessage({
              title: "Finalized Successfully.",
              type: "success"
            });
          } else {
            AlgaehLoader({ show: false });
            swalMessage({
              title: response.data.result,
              type: "error"
            });
          }
        },
        onFailure: error => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.message || error.response.data.message,
            type: "error"
          });
        }
      });
    }
  });
};

const openSalaryComponents = ($this, row) => {
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
    display_present_days: row.display_present_days,
    total_paid_days: row.total_paid_days,
    dis_employee_name: row.full_name
  });
};

const closeSalaryComponents = ($this, e) => {
  $this.setState({
    isOpen: !$this.state.isOpen
  });
};



const TestAccountingEntry = $this => {
  swal({
    title: "You want to finalize the salary?",
    text:
      "Please verify all the information before finalize, Once finalize can't be revert back.",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Finalize",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancel"
  }).then(willFinalize => {
    if (willFinalize.value) {
      AlgaehLoader({ show: true });
      const { salaryprocess_header } = $this.state;

      const salary_header_id = salaryprocess_header.map(o => {
        return o.hims_f_salary_id;
      });

      let inputObj = {
        salary_header_id: salary_header_id,
        ScreenCode: getCookie("ScreenCode")
      };

      algaehApiCall({
        uri: "/salary/generateAccountingEntry",
        module: "hrManagement",
        data: inputObj,
        method: "PUT",
        onSuccess: response => {
          if (response.data.success) {
            AlgaehLoader({ show: false });
            swalMessage({
              title: "Finalized Successfully.",
              type: "success"
            });
          }
        }
      });
    }
  });
};

export {
  SalaryProcess,
  FinalizeSalary,
  ClearData,
  openSalaryComponents,
  closeSalaryComponents,
  TestAccountingEntry
};
