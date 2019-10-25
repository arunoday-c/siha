import Enumerable from "linq";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
// import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import Options from "../../../../Options.json";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import LeaveSalaryProcessIOputs from "../../../../Models/LeaveSalaryProcess";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const getLeaveSalaryProcess = ($this, e) => {
  AlgaehLoader({ show: true });

  let inputObj = {
    employee_id: $this.state.employee_id
  };

  algaehApiCall({
    uri: "/leavesalaryprocess/getLeaveSalaryProcess",
    module: "hrManagement",
    data: inputObj,
    method: "GET",
    onSuccess: response => {
      AlgaehLoader({ show: false });
      let data = response.data.result;

      if (Object.keys(data).length > 0) {
        data.ProcessBtn = false;
      }
      // else {
      //   data.ProcessBtn = true;
      // }

      $this.setState(data);
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message || error.response.data.message,
        type: "error"
      });
    }
  });
};

const ClearData = $this => {
  $this.setState({
    year: moment().year(),
    month: moment(new Date()).format("M"),
    sub_department_id: null,
    employee_id: null,
    employee_name: null,
    hospital_id: null,
    ProcessBtn: true,
    encash_type: null,
    SaveBtn: true
  });
};

const MainClearData = $this => {
  let IOputs = LeaveSalaryProcessIOputs.inputParam();
  $this.setState(IOputs);
};

const employeeSearch = $this => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.Employee_details.employee
    },
    searchName: "employee",
    uri: "/gloabelSearch/get",
    inputs: "leave_salary_process = 'Y'",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      let IOputs = LeaveSalaryProcessIOputs.inputParam();
      IOputs.employee_name = row.full_name;
      IOputs.employee_id = row.hims_d_employee_id;
      $this.setState(IOputs, () => {
        getLeaveSalaryProcess($this);
      });
      // $this.setState(
      //   {
      //     employee_name: row.full_name,
      //     employee_id: row.hims_d_employee_id
      //   },
      //   () => {
      //     getLeaveSalaryProcess($this);
      //   }
      // );
    }
  });
};

const dateFormater = value => {
  if (value !== null) {
    return String(moment(value).format(Options.dateFormat));
  }
};

const LeaveSalProcess = $this => {
  let year = moment($this.state.leave_start_date).format("YYYY");
  let inputObj = {
    hims_d_employee_id: $this.state.employee_id,
    leave_start_date: $this.state.leave_start_date,
    leave_end_date: $this.state.leave_end_date,
    leave_period: $this.state.leave_period,
    year: year
  };
  let leave_salary_detail = $this.state.leave_salary_detail;

  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/leavesalaryprocess/processLeaveSalary",
    method: "GET",
    module: "hrManagement",
    data: inputObj,
    onSuccess: response => {
      if (response.data.success) {
        if (response.data.result.length > 0) {
          let salaryObj = [];
          // let data = response.data.result;

          // let data = response.data.result;

          for (let i = 0; i < leave_salary_detail.length; i++) {
            salaryObj = Enumerable.from(response.data.result[0])
              .where(
                w =>
                  w.month === leave_salary_detail[i].month &&
                  w.year === leave_salary_detail[i].year
              )
              .toArray();

            leave_salary_detail[i].salary_no = salaryObj[0].salary_number;
            leave_salary_detail[i].salary_date = salaryObj[0].salary_date;
            leave_salary_detail[i].gross_amount = salaryObj[0].gross_salary;
            leave_salary_detail[i].net_amount = salaryObj[0].net_salary;
            leave_salary_detail[i].salary_header_id =
              salaryObj[0].hims_f_salary_id;
          }

          let leave_amount = getAmountFormart(
            response.data.result[1][0].leave_amount
          );
          let airfare_amount = getAmountFormart(
            response.data.result[1][0].airfare_amount
          );

          let x = leave_amount.split(" ");
          leave_amount = x[1];

          x = airfare_amount.split(" ");
          airfare_amount = x[1];

          let salary_amount = Enumerable.from(leave_salary_detail).sum(s =>
            parseFloat(s.net_amount)
          );

          salary_amount = getAmountFormart(salary_amount);
          x = salary_amount.split(" ");
          salary_amount = x[1];

          AlgaehLoader({ show: false });

          let total_amount =
            parseFloat(salary_amount) +
            parseFloat(leave_amount) +
            parseFloat(airfare_amount);

          total_amount = getAmountFormart(total_amount);
          x = total_amount.split(" ");
          total_amount = x[1];

          $this.setState({
            leave_salary_detail: leave_salary_detail,
            salary_amount: salary_amount,
            leave_amount: leave_amount,
            airfare_amount: airfare_amount,
            total_amount: total_amount,
            SaveBtn: false,
            ProcessBtn: true,
            dis_salary_amount: getAmountFormart(salary_amount),
            airfare_months: response.data.result[1][0].airfare_months,
            dis_leave_amount: getAmountFormart(
              response.data.result[1][0].leave_amount
            ),
            dis_airfare_amount: getAmountFormart(
              response.data.result[1][0].airfare_amount
            ),
            dis_total_amount: getAmountFormart(total_amount)
          });
          swalMessage({
            title: "Processed succesfully..",
            type: "success"
          });
        } else {
          AlgaehLoader({ show: false });
          swalMessage({
            title: "Please, Process the time sheet.",
            type: "error"
          });
        }
      } else if (!response.data.success) {
        AlgaehLoader({ show: false });
        swalMessage({
          title: response.data.result.message,
          type: "error"
        });
      }
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const SaveLeaveSalary = $this => {
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/leavesalaryprocess/InsertLeaveSalary",
    module: "hrManagement",
    data: $this.state,
    method: "POST",
    onSuccess: response => {
      if (response.data.success) {
        AlgaehLoader({ show: false });
        let data = response.data.result;

        data.ProcessBtn = true;
        data.SaveBtn = true;

        $this.setState(data);
        swalMessage({
          title: "Saved Succefully...",
          type: "success"
        });
      } else if (!response.data.success) {
        AlgaehLoader({ show: false });
        swalMessage({
          title: response.data.result.message,
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
};

const getLeaveSalary = $this => {
  let inputObj = {
    hims_f_leave_salary_header_id: $this.state.hims_f_leave_salary_header_id
  };
  AlgaehLoader({ show: true });
  algaehApiCall({
    uri: "/leavesalaryprocess/getLeaveSalary",
    module: "hrManagement",
    data: inputObj,
    method: "GET",
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.result;

        AlgaehLoader({ show: false });
        data.dis_salary_amount = data.salary_amount;
        data.dis_leave_amount = data.leave_amount;
        data.dis_airfare_amount = data.airfare_amount;
        data.dis_total_amount = data.total_amount;
        data.ProcessBtn = true;
        data.SaveBtn = true;
        $this.setState(data);
      } else if (!response.data.success) {
        AlgaehLoader({ show: false });
        swalMessage({
          title: response.data.result.message,
          type: "error"
        });
      }
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.response.data.message,
        type: "error"
      });
    }
  });
};

const LoadLeaveSalary = $this => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.emp_payment_apply.leave_settlement
    },
    searchName: "leave_settlement",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState(
        {
          leave_salary_number: row.leave_salary_number,
          hims_f_leave_salary_header_id: row.hims_f_leave_salary_header_id
        },
        () => {
          getLeaveSalary($this);
        }
      );
    }
  });
};

const openSalaryComponents = ($this, row) => {
  let inputObj = {
    year: row.year,
    month: row.month,
    hospital_id: $this.state.hospital_id,
    employee_id: $this.state.employee_id,
    salary_type: "LS"
  };
  algaehApiCall({
    uri: "/salary/getSalaryProcess",
    module: "hrManagement",
    data: inputObj,
    method: "GET",
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.result;
        if (data.length === 0) {
          return
        }
        let header = data[0]["salaryprocess_header"][0];
        const salaryprocess_Earning = Enumerable.from(
          data[0]["salaryprocess_detail"][0]
        )
          .where(w => w.salary_header_id === header.hims_f_salary_id)
          .toArray();

        const salaryprocess_Deduction = Enumerable.from(
          data[0]["salaryprocess_detail"][1]
        )
          .where(w => w.salary_header_id === header.hims_f_salary_id)
          .toArray();

        const salaryprocess_Contribute = Enumerable.from(
          data[0]["salaryprocess_detail"][2]
        )
          .where(w => w.salary_header_id === header.hims_f_salary_id)
          .toArray();

        $this.setState({
          isOpen: !$this.state.isOpen,
          salaryprocess_Earning: salaryprocess_Earning,
          salaryprocess_Deduction: salaryprocess_Deduction,
          salaryprocess_Contribute: salaryprocess_Contribute,

          total_earnings: header.total_earnings,
          total_deductions: header.total_deductions,
          loan_payable_amount: header.loan_payable_amount,
          loan_due_amount: header.loan_due_amount,
          net_salary: header.net_salary,

          total_days: header.total_days,
          absent_days: header.absent_days,
          total_work_days: header.total_work_days,
          total_weekoff_days: header.total_weekoff_days,
          total_holidays: header.total_holidays,
          total_leave: header.total_leave,
          paid_leave: header.paid_leave,
          unpaid_leave: header.unpaid_leave,
          present_days: header.present_days,
          total_paid_days: header.total_paid_days,
          display_present_days: header.display_present_days,
          comp_off_days: 0,
          pending_unpaid_leave: header.pending_unpaid_leave
        });
      } else if (!response.data.success) {
        AlgaehLoader({ show: false });
        swalMessage({
          title: response.data.result.message,
          type: "error"
        });
      }
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.response.data.message,
        type: "error"
      });
    }
  });
};

const closeSalaryComponents = ($this, e) => {
  $this.setState({
    isOpen: !$this.state.isOpen
  });
};

export {
  texthandle,
  ClearData,
  employeeSearch,
  dateFormater,
  LeaveSalProcess,
  SaveLeaveSalary,
  LoadLeaveSalary,
  MainClearData,
  openSalaryComponents,
  closeSalaryComponents
};
