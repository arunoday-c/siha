import Enumerable from "linq";
// import extend from "extend";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../../utils/GlobalFunctions";
import swal from "sweetalert2";

const earntexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let amount = e.selected.calculation_method === "FO" ? 0 : null;
  $this.setState({
    [name]: value,
    earn_amount: amount,
    earn_disable: e.selected.calculation_method === "FO" ? true : false,
    earn_calculation_method: e.selected.calculation_method,
    earn_calculation_type: e.selected.calculation_type
  });
};

const deducttexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let amount = e.selected.calculation_method === "FO" ? 0 : null;
  $this.setState({
    [name]: value,
    dedection_amount: amount,
    deduct_calculation_method: e.selected.calculation_method,
    deduct_calculation_type: e.selected.calculation_type
  });
};

const contributtexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let amount = e.selected.calculation_method === "FO" ? 0 : null;
  $this.setState({
    [name]: value,
    contribution_amount: amount,
    contribut_calculation_method: e.selected.calculation_method,
    contribut_calculation_type: e.selected.calculation_type
  });
};

const numberSet = ($this, e) => {
  $this.setState({
    [e.target.name]: e.target.value
  });
};

const AddEarnComponent = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='EarnComponent'",
    onSuccess: () => {
      let earningComponents = $this.state.earningComponents;
      let insertearnComp = $this.state.insertearnComp;
      debugger;
      const _earnComponent = Enumerable.from(earningComponents)
        .where(w => w.earnings_id === $this.state.earning_id)
        .any();
      if (_earnComponent) {
        swalMessage({
          title: "Selected component already exists.",
          type: "warning"
        });
        return;
      }

      earningComponents.push({
        employee_id: $this.state.hims_d_employee_id,
        earnings_id: $this.state.earning_id,
        amount: $this.state.earn_amount,
        allocate: $this.state.allocate,
        calculation_method: $this.state.earn_calculation_method,
        calculation_type: $this.state.earn_calculation_type
      });

      insertearnComp.push({
        employee_id: $this.state.hims_d_employee_id,
        earnings_id: $this.state.earning_id,
        amount: $this.state.earn_amount,
        allocate: $this.state.allocate,
        calculation_method: $this.state.earn_calculation_method,
        calculation_type: $this.state.earn_calculation_type
      });

      $this.setState(
        {
          earningComponents: earningComponents,
          insertearnComp: insertearnComp,
          earning_id: null,
          earn_amount: null
        },
        () => {
          calculationTotals($this);
        }
      );
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        earningComponents: earningComponents,
        insertearnComp: insertearnComp
      });
    }
  });
};

const AddDeductionComponent = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='DeductionComponent'",
    onSuccess: () => {
      let deductioncomponents = $this.state.deductioncomponents;
      let insertDeductionComp = $this.state.insertDeductionComp;

      const _dedComponent = Enumerable.from(deductioncomponents)
        .where(w => w.deductions_id === $this.state.deducation_id)
        .any();
      if (_dedComponent) {
        swalMessage({
          title: "Selected component already exists.",
          type: "warning"
        });
        return;
      }

      deductioncomponents.push({
        employee_id: $this.state.hims_d_employee_id,
        deductions_id: $this.state.deducation_id,
        amount: $this.state.dedection_amount,
        allocate: $this.state.allocate,
        calculation_method: $this.state.deduct_calculation_method,
        calculation_type: $this.state.deduct_calculation_type
      });

      insertDeductionComp.push({
        employee_id: $this.state.hims_d_employee_id,
        deductions_id: $this.state.deducation_id,
        amount: $this.state.dedection_amount,
        allocate: $this.state.allocate,
        calculation_method: $this.state.deduct_calculation_method,
        calculation_type: $this.state.deduct_calculation_type
      });

      $this.setState(
        {
          deductioncomponents: deductioncomponents,
          insertDeductionComp: insertDeductionComp,
          deducation_id: null,
          dedection_amount: null
        },
        () => {
          calculationTotals($this);
        }
      );
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        deductioncomponents: deductioncomponents,
        insertDeductionComp: insertDeductionComp
      });
    }
  });
};

const AddContributionComponent = ($this, e) => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='ContributeComponent'",
    onSuccess: () => {
      let contributioncomponents = $this.state.contributioncomponents;
      let insertContributeComp = $this.state.insertContributeComp;

      const _contComponent = Enumerable.from(contributioncomponents)
        .where(w => w.contributions_id === $this.state.contribution_id)
        .any();
      if (_contComponent) {
        swalMessage({
          title: "Selected component already exists.",
          type: "warning"
        });
        return;
      }

      contributioncomponents.push({
        employee_id: $this.state.hims_d_employee_id,
        contributions_id: $this.state.contribution_id,
        amount: $this.state.contribution_amount,
        allocate: $this.state.allocate,
        calculation_method: $this.state.contribut_calculation_method,
        calculation_type: $this.state.contribut_calculation_type
      });

      insertContributeComp.push({
        employee_id: $this.state.hims_d_employee_id,
        contributions_id: $this.state.contribution_id,
        amount: $this.state.contribution_amount,
        allocate: $this.state.allocate,
        calculation_method: $this.state.contribut_calculation_method,
        calculation_type: $this.state.contribut_calculation_type
      });

      $this.setState(
        {
          contributioncomponents: contributioncomponents,
          insertContributeComp: insertContributeComp,
          contribution_id: null,
          contribution_amount: null
        },
        () => {
          calculationTotals($this);
        }
      );

      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        contributioncomponents: contributioncomponents,
        insertContributeComp: insertContributeComp
      });
    }
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
    if (willDelete.value) {
      debugger;
      let deleteearnComp = $this.state.deleteearnComp;
      let insertearnComp = $this.state.insertearnComp;
      let earningComponents = $this.state.earningComponents;

      if (row.hims_d_employee_earnings_id !== undefined) {
        deleteearnComp.push(row);
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
  let Updateobj = {};
  debugger;
  if (row.hims_d_employee_earnings_id !== undefined) {
    Updateobj = {
      hims_d_employee_earnings_id: row.hims_d_employee_earnings_id,
      employee_id: $this.state.hims_d_employee_id,
      earnings_id: row.earnings_id,
      amount: row.amount,
      allocate: row.allocate,
      record_status: "A"
    };
    updateearnComp.push(Updateobj);
    earningComponents[row.rowIdx] = Updateobj;
  } else {
    {
      Updateobj = {
        employee_id: $this.state.hims_d_employee_id,
        earnings_id: row.earnings_id,
        amount: row.amount,
        allocate: row.allocate
      };
      for (let x = 0; x < insertearnComp.length; x++) {
        if (insertearnComp[x].earnings_id === row.earnings_id) {
          insertearnComp[x] = Updateobj;
        }
      }
      // insertearnComp[row.rowIdx] = Updateobj;
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

const deleteDeductionComponent = ($this, row) => {
  swal({
    title: "Are you sure you want to delete Deduction Component?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes!",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      debugger;
      let insertDeductionComp = $this.state.insertDeductionComp;
      let deductioncomponents = $this.state.deductioncomponents;
      let deleteDeductionComp = $this.state.deleteDeductionComp;

      if (row.hims_d_employee_deductions_id !== undefined) {
        deleteDeductionComp.push(row);
        deductioncomponents.splice(row.rowIdx, 1);
      } else {
        for (let x = 0; x < insertDeductionComp.length; x++) {
          if (insertDeductionComp[x].deductions_id === row.deductions_id) {
            insertDeductionComp.splice(x, 1);
          }
        }

        deductioncomponents.splice(row.rowIdx, 1);
      }
      $this.setState(
        {
          deductioncomponents: deductioncomponents,
          deleteDeductionComp: deleteDeductionComp,
          insertDeductionComp: insertDeductionComp
        },
        () => {
          calculationTotals($this);
        }
      );
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        deductioncomponents: deductioncomponents,
        deleteDeductionComp: deleteDeductionComp,
        insertDeductionComp: insertDeductionComp
      });
    } else {
      swalMessage({
        title: "Delete request cancelled",
        type: "error"
      });
    }
  });
};

const updateDeductionComponent = ($this, row) => {
  let updateDeductionComp = $this.state.updateDeductionComp;
  let insertDeductionComp = $this.state.insertDeductionComp;
  let deductioncomponents = $this.state.deductioncomponents;
  let Updateobj = {};
  if (row.hims_d_employee_deductions_id !== undefined) {
    Updateobj = {
      hims_d_employee_deductions_id: row.hims_d_employee_deductions_id,
      employee_id: $this.state.hims_d_employee_id,
      deductions_id: row.deductions_id,
      amount: row.amount,
      allocate: row.allocate,
      record_status: "A"
    };
    updateDeductionComp.push(Updateobj);
    deductioncomponents[row.rowIdx] = Updateobj;
  } else {
    {
      Updateobj = {
        employee_id: $this.state.hims_d_employee_id,
        deductions_id: row.deductions_id,
        amount: row.amount,
        allocate: row.allocate
      };
      for (let x = 0; x < insertDeductionComp.length; x++) {
        if (insertDeductionComp[x].deductions_id === row.deductions_id) {
          insertDeductionComp[x] = Updateobj;
        }
      }
      // insertDeductionComp[row.rowIdx] = Updateobj;
      deductioncomponents[row.rowIdx] = Updateobj;
    }
  }
  $this.setState(
    {
      deductioncomponents: deductioncomponents,
      updateDeductionComp: updateDeductionComp,
      insertDeductionComp: insertDeductionComp
    },
    () => {
      calculationTotals($this);
    }
  );
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    deductioncomponents: deductioncomponents,
    updateDeductionComp: updateDeductionComp,
    insertDeductionComp: insertDeductionComp
  });
};

const deleteContibuteComponent = ($this, row) => {
  swal({
    title: "Are you sure you want to delete Contribution Component?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes!",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
      let contributioncomponents = $this.state.contributioncomponents;
      let insertContributeComp = $this.state.insertContributeComp;
      let deleteContributeComp = $this.state.deleteContributeComp;

      if (row.hims_d_employee_contributions_id !== undefined) {
        deleteContributeComp.push(row);
        contributioncomponents.splice(row.rowIdx, 1);
      } else {
        for (let x = 0; x < insertContributeComp.length; x++) {
          if (insertContributeComp[x].deductions_id === row.deductions_id) {
            insertContributeComp.splice(x, 1);
          }
        }

        contributioncomponents.splice(row.rowIdx, 1);
      }
      $this.setState(
        {
          contributioncomponents: contributioncomponents,
          deleteContributeComp: deleteContributeComp,
          insertContributeComp: insertContributeComp
        },
        () => {
          calculationTotals($this);
        }
      );
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        contributioncomponents: contributioncomponents,
        deleteContributeComp: deleteContributeComp,
        insertContributeComp: insertContributeComp
      });
    } else {
      swalMessage({
        title: "Delete request cancelled",
        type: "error"
      });
    }
  });
};

const updateContibuteComponent = ($this, row) => {
  let contributioncomponents = $this.state.contributioncomponents;
  let insertContributeComp = $this.state.insertContributeComp;
  let updateContributeComp = $this.state.updateContributeComp;
  let Updateobj = {};
  if (row.hims_d_employee_contributions_id !== undefined) {
    Updateobj = {
      hims_d_employee_contributions_id: row.hims_d_employee_contributions_id,
      employee_id: $this.state.hims_d_employee_id,
      contributions_id: row.contributions_id,
      amount: row.amount,
      allocate: row.allocate,
      record_status: "A"
    };
    updateContributeComp.push(Updateobj);
    contributioncomponents[row.rowIdx] = Updateobj;
  } else {
    {
      Updateobj = {
        employee_id: $this.state.hims_d_employee_id,
        contributions_id: row.contributions_id,
        amount: row.amount,
        allocate: row.allocate
      };
      for (let x = 0; x < insertContributeComp.length; x++) {
        if (insertContributeComp[x].contributions_id === row.contributions_id) {
          insertContributeComp[x] = Updateobj;
        }
      }
      // insertContributeComp[row.rowIdx] = Updateobj;
      contributioncomponents[row.rowIdx] = Updateobj;
    }
  }
  $this.setState(
    {
      contributioncomponents: contributioncomponents,
      updateContributeComp: updateContributeComp,
      insertContributeComp: insertContributeComp
    },
    () => {
      calculationTotals($this);
    }
  );
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    contributioncomponents: contributioncomponents,
    updateContributeComp: updateContributeComp,
    insertContributeComp: insertContributeComp
  });
};

const getEmpEarningComponents = $this => {
  algaehApiCall({
    uri: "/employee/getEmpEarningComponents",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: $this.state.hims_d_employee_id },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          $this.setState({
            earningComponents: data
          });

          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            earningComponents: data
          });
        } else {
          $this.setState({
            earningComponents: []
          });

          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            earningComponents: []
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

const getEmpDeductionComponents = $this => {
  algaehApiCall({
    uri: "/employee/getEmpDeductionComponents",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: $this.state.hims_d_employee_id },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          $this.setState({
            deductioncomponents: data
          });

          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            deductioncomponents: data
          });
        } else {
          $this.setState({
            deductioncomponents: []
          });

          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            deductioncomponents: []
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
const getEmpContibuteComponents = $this => {
  algaehApiCall({
    uri: "/employee/getEmpContibuteComponents",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: $this.state.hims_d_employee_id },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        if (data.length > 0) {
          $this.setState({
            contributioncomponents: data
          });

          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            contributioncomponents: data
          });
        } else {
          $this.setState({
            contributioncomponents: []
          });

          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            contributioncomponents: []
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
  getEmpEarningComponents,
  getEmpDeductionComponents,
  getEmpContibuteComponents
};
