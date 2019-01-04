import Enumerable from "linq";
// import extend from "extend";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";
import swal from "sweetalert2";

const earntexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let amount = e.selected.calculation_method === "FO" ? 0 : null;
  $this.setState({
    [name]: value,
    earn_amount: amount,
    earn_disable: e.selected.calculation_method === "FO" ? true : false,
    earn_calculation_method: e.selected.calculation_method
  });
};

const deducttexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let amount = e.selected.calculation_method === "FO" ? 0 : null;
  $this.setState({
    [name]: value,
    dedection_amount: amount,
    deduct_calculation_method: e.selected.calculation_method
  });
};

const contributtexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let amount = e.selected.calculation_method === "FO" ? 0 : null;
  $this.setState({
    [name]: value,
    contribution_amount: amount,
    contribut_calculation_method: e.selected.calculation_method
  });
};

const numberSet = ($this, e) => {
  $this.setState({
    [e.target.name]: e.target.value
  });
};

const AddEarnComponent = ($this, e) => {
  debugger;
  let earningComponents = $this.state.earningComponents;

  earningComponents.push({
    employee_id: $this.state.hims_d_employee_id,
    earnings_id: $this.state.earning_id,
    amount: $this.state.earn_amount,
    allocate: $this.state.allocate,
    calculation_method: $this.state.earn_calculation_method
  });

  $this.setState(
    {
      earningComponents: earningComponents,
      insertearnComp: earningComponents,
      earning_id: null,
      earn_amount: null
    },
    () => {
      calculationTotals($this);
    }
  );
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    earningComponents: earningComponents,
    insertearnComp: earningComponents
  });
};

const AddDeductionComponent = ($this, e) => {
  let deductioncomponents = $this.state.deductioncomponents;

  deductioncomponents.push({
    employee_id: $this.state.hims_d_employee_id,
    deductions_id: $this.state.deducation_id,
    amount: $this.state.dedection_amount,
    allocate: $this.state.allocate,
    calculation_method: $this.state.deduct_calculation_method
  });

  $this.setState(
    {
      deductioncomponents: deductioncomponents,
      insertDeductionComp: deductioncomponents,
      deducation_id: null,
      dedection_amount: null
    },
    () => {
      calculationTotals($this);
    }
  );
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    deductioncomponents: deductioncomponents,
    insertDeductionComp: deductioncomponents
  });
};

const AddContributionComponent = ($this, e) => {
  let contributioncomponents = $this.state.contributioncomponents;

  contributioncomponents.push({
    employee_id: $this.state.hims_d_employee_id,
    contributions_id: $this.state.contribution_id,
    amount: $this.state.contribution_amount,
    allocate: $this.state.allocate,
    calculation_method: $this.state.contribut_calculation_method
  });

  $this.setState(
    {
      contributioncomponents: contributioncomponents,
      insertContributeComp: contributioncomponents,
      contribution_id: null,
      contribution_amount: null
    },
    () => {
      calculationTotals($this);
    }
  );

  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    contributioncomponents: contributioncomponents,
    insertContributeComp: contributioncomponents
  });
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

const calculationTotals = $this => {
  let gross_salary = Enumerable.from($this.state.earningComponents).sum(w =>
    parseFloat(w.amount)
  );
  let total_earnings = Enumerable.from($this.state.earningComponents).sum(w =>
    parseFloat(w.amount)
  );

  let total_deductions = Enumerable.from($this.state.deductioncomponents).sum(
    w => parseFloat(w.amount)
  );
  let total_contributions = Enumerable.from(
    $this.state.contributioncomponents
  ).sum(w => parseFloat(w.amount));

  $this.setState({
    gross_salary: gross_salary,
    yearly_gross_salary: gross_salary * 12,
    total_earnings: total_earnings,
    total_deductions: total_deductions,
    total_contributions: total_contributions,
    net_salary: total_earnings - total_deductions,
    cost_to_company: total_earnings + total_contributions
  });

  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    gross_salary: gross_salary,
    yearly_gross_salary: gross_salary * 12,
    total_earnings: total_earnings,
    total_deductions: total_deductions,
    total_contributions: total_contributions,
    net_salary: total_earnings - total_deductions,
    cost_to_company: total_earnings + total_contributions
  });
};

const deleteEarningComponent = ($this, row) => {
  swal({
    title: "Are you sure you want to delete Earning Component?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes!",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    debugger;
    if (willDelete.value) {
      let deleteearnComp = $this.state.deleteearnComp;
      let insertearnComp = $this.state.insertearnComp;
      let earningComponents = $this.state.earningComponents;

      if (row.hims_d_employee_earnings_id !== undefined) {
        for (let x = 0; x < deleteearnComp.length; x++) {
          if (deleteearnComp[x].earnings_id === row.earnings_id) {
            deleteearnComp.splice(x, 1);
          }
        }

        earningComponents.splice(row.rowIdx, 1);
      } else {
        for (let x = 0; x < insertearnComp.length; x++) {
          if (insertearnComp[x].earnings_id === row.earnings_id) {
            insertearnComp.splice(x, 1);
          }
        }

        earningComponents.splice(row.rowIdx, 1);
      }
      $this.setState(
        {
          earningComponents: earningComponents,
          deleteearnComp: deleteearnComp,
          insertearnComp: insertearnComp
        },
        () => {
          calculationTotals($this);
        }
      );
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        earningComponents: earningComponents,
        deleteearnComp: deleteearnComp,
        insertearnComp: insertearnComp
      });
    } else {
      swalMessage({
        title: "Delete request cancelled",
        type: "error"
      });
    }
  });
};

const updateEarningComponent = ($this, row) => {
  let updateearnComp = $this.state.updateearnComp;
  let insertearnComp = $this.state.insertearnComp;
  let earningComponents = $this.state.earningComponents;

  if (row.hims_d_employee_earnings_id !== undefined) {
    let Updateobj = {
      hims_d_employee_earnings_id: row.hims_d_employee_earnings_id,
      earnings_id: row.earnings_id,
      amount: row.amount,
      allocate: row.allocate,
      record_status: "A"
    };
    updateearnComp.push(Updateobj);
    earningComponents[row.rowIdx] = Updateobj;
    // earningComponents[row.rowIdx] = Updateobj;
  } else {
    {
      let Updateobj = {
        earnings_id: row.earnings_id,
        amount: row.amount,
        allocate: row.allocate
      };
      insertearnComp[row.rowIdx] = Updateobj;
      earningComponents[row.rowIdx] = Updateobj;
    }
  }
  $this.setState(
    {
      earningComponents: earningComponents,
      updateearnComp: updateearnComp,
      insertearnComp: insertearnComp
    },
    () => {
      calculationTotals($this);
    }
  );
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    earningComponents: earningComponents,
    updateearnComp: updateearnComp,
    insertearnComp: insertearnComp
  });
};

const deleteDeductionComponent = ($this, e) => {};

const updateDeductionComponent = ($this, e) => {};

const deleteContibuteComponent = ($this, e) => {};

const updateContibuteComponent = ($this, e) => {};

const getPayrollComponents = $this => {
  debugger;
  algaehApiCall({
    uri: "/employee/getPayrollComponents",
    method: "GET",
    data: { employee_id: $this.state.hims_d_employee_id },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          debugger;
          $this.setState({
            earningComponents: data[0],
            deductioncomponents: data[1],
            contributioncomponents: data[2]
          });
        }
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

export {
  earntexthandle,
  deducttexthandle,
  contributtexthandle,
  numberSet,
  AddEarnComponent,
  AddDeductionComponent,
  AddContributionComponent,
  onchangegridcol,
  deleteEarningComponent,
  updateEarningComponent,
  deleteDeductionComponent,
  updateDeductionComponent,
  deleteContibuteComponent,
  updateContibuteComponent,
  getPayrollComponents
};
