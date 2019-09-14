import Enumerable from "linq";
// import extend from "extend";
import {
  getCookie,
  algaehApiCall,
  swalMessage
} from "../../../../../utils/algaehApiCall";
import {
  AlgaehValidation,
  AlgaehOpenContainer
} from "../../../../../utils/GlobalFunctions";
import swal from "sweetalert2";
import _ from "lodash";

const earntexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (
    e.selected.specific_nationality === "Y" &&
    $this.state.nationality !== null
  ) {
    if (e.selected.nationality_id !== $this.state.nationality) {
      swalMessage({
        title: "This employee is not entitle for this component.",
        type: "warning"
      });
      $this.setState({
        [name]: null
      });
      return;
    }
  }
  let amount = e.selected.calculation_method === "FO" ? 0 : null;
  let formula =
    e.selected.calculation_method === "FO" ? e.selected.formula : null;

  $this.setState({
    [name]: value,
    earn_amount: amount,
    earn_disable: e.selected.calculation_method === "FO" ? true : false,
    earn_calculation_method: e.selected.calculation_method,
    earn_calculation_type: e.selected.calculation_type,
    earn_short_desc: e.selected.short_desc,
    earn_formula: formula
  });
};

const deducttexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (
    e.selected.specific_nationality === "Y" &&
    $this.state.nationality !== null
  ) {
    if (e.selected.nationality_id !== $this.state.nationality) {
      swalMessage({
        title: "This employee is not entitle for this component.",
        type: "warning"
      });
      $this.setState({
        [name]: null
      });
      return;
    }
  }
  let amount = e.selected.calculation_method === "FO" ? 0 : null;
  let formula =
    e.selected.calculation_method === "FO" ? e.selected.formula : null;

  $this.setState({
    [name]: value,
    dedection_amount: amount,
    deduct_calculation_method: e.selected.calculation_method,
    deduct_calculation_type: e.selected.calculation_type,
    deduct_short_desc: e.selected.short_desc,
    deduct_formula: formula
  });
};

const contributtexthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (
    e.selected.specific_nationality === "Y" &&
    $this.state.nationality !== null
  ) {
    if (e.selected.nationality_id !== $this.state.nationality) {
      swalMessage({
        title: "This employee is not entitle for this component.",
        type: "warning"
      });
      $this.setState({
        [name]: null
      });
      return;
    }
  }

  let amount = e.selected.calculation_method === "FO" ? 0 : null;
  let formula =
    e.selected.calculation_method === "FO" ? e.selected.formula : null;
  $this.setState({
    [name]: value,
    contribution_amount: amount,
    contribut_calculation_method: e.selected.calculation_method,
    contribut_calculation_type: e.selected.calculation_type,
    contribut_short_desc: e.selected.short_desc,
    contribut_formula: formula
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
      if (
        $this.state.earn_calculation_method === "FO" &&
        $this.state.earn_formula === null
      ) {
        swalMessage({
          title:
            "Selected component is Formula based, but in master Formula not defined, Please contact ADMIN.",
          type: "warning"
        });
        return;
      }
      let earningComponents = $this.state.earningComponents;
      let insertearnComp = $this.state.insertearnComp;

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

      let component_exist = 0;
      let formulaCal = $this.state.earn_formula;
      if ($this.state.earn_calculation_method === "FO") {
        earningComponents.map(menu => {
          if (formulaCal.indexOf(menu.short_desc) > -1) {
            component_exist = 1;
          }
        });
        if (formulaCal.indexOf("Gross Salary") > -1) {
          component_exist = 1;
        }
        if (component_exist === 0) {
          swalMessage({
            title:
              "Selected Component is Fomula based component missing some component related to formula .",
            type: "warning"
          });
          return;
        }
      }

      earningComponents.push({
        employee_id: $this.state.hims_d_employee_id,
        earnings_id: $this.state.earning_id,
        amount: $this.state.earn_amount,
        allocate: $this.state.allocate,
        calculation_method: $this.state.earn_calculation_method,
        calculation_type: $this.state.earn_calculation_type,
        formula: $this.state.earn_formula,
        short_desc: $this.state.earn_short_desc
      });

      insertearnComp.push({
        employee_id: $this.state.hims_d_employee_id,
        earnings_id: $this.state.earning_id,
        amount: $this.state.earn_amount,
        allocate: $this.state.allocate,
        calculation_method: $this.state.earn_calculation_method,
        calculation_type: $this.state.earn_calculation_type,
        formula: $this.state.earn_formula,
        short_desc: $this.state.earn_short_desc
      });

      $this.setState(
        {
          earningComponents: earningComponents,
          insertearnComp: insertearnComp,
          earning_id: null,
          earn_amount: null
        },
        () => {
          CalculateBasedonFormula($this);
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
      if (
        $this.state.deduct_calculation_method === "FO" &&
        $this.state.deduct_formula === null
      ) {
        swalMessage({
          title:
            "Selected component is Formula based, but in master Formula not defined, Please contact ADMIN.",
          type: "warning"
        });
        return;
      }

      const basic_earning_component = JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("hrOptions"))
      ).basic_earning_component;

      let basic_exists = _.find(
        $this.state.earningComponents,
        f => f.earnings_id == basic_earning_component
      );

      if (basic_exists === undefined) {
        swalMessage({
          title: "Please select Basic Salary in earnings.",
          type: "warning"
        });
        return;
      }

      let component_exist = 0;
      let formulaCal = $this.state.deduct_formula;
      if ($this.state.deduct_calculation_method === "FO") {
        $this.state.earningComponents.map(menu => {
          if (formulaCal.indexOf(menu.short_desc) > -1) {
            component_exist = 1;
          }
        });

        if (formulaCal.indexOf("Gross Salary") > -1) {
          component_exist = 1;
        }

        if (component_exist === 0) {
          swalMessage({
            title:
              "Selected Component is Fomula based component missing some component related to formula .",
            type: "warning"
          });
          return;
        }
      }

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
        calculation_type: $this.state.deduct_calculation_type,
        formula: $this.state.deduct_formula,
        short_desc: $this.state.deduct_short_desc
      });

      insertDeductionComp.push({
        employee_id: $this.state.hims_d_employee_id,
        deductions_id: $this.state.deducation_id,
        amount: $this.state.dedection_amount,
        allocate: $this.state.allocate,
        calculation_method: $this.state.deduct_calculation_method,
        calculation_type: $this.state.deduct_calculation_type,
        formula: $this.state.deduct_formula,
        short_desc: $this.state.deduct_short_desc
      });

      $this.setState(
        {
          deductioncomponents: deductioncomponents,
          insertDeductionComp: insertDeductionComp,
          deducation_id: null,
          dedection_amount: null
        },
        () => {
          CalculateBasedonFormula($this);
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
      if (
        $this.state.contribut_calculation_method === "FO" &&
        $this.state.contribut_formula === null
      ) {
        swalMessage({
          title:
            "Selected component is Formula based, but in master Formula not defined, Please contact ADMIN.",
          type: "warning"
        });
        return;
      }

      const basic_earning_component = JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("hrOptions"))
      ).basic_earning_component;

      let basic_exists = _.find(
        $this.state.earningComponents,
        f => f.earnings_id == basic_earning_component
      );

      if (basic_exists === undefined) {
        swalMessage({
          title: "Please select Basic Salary in earnings.",
          type: "warning"
        });
        return;
      }

      let component_exist = 0;
      let formulaCal = $this.state.contribut_formula;
      if ($this.state.contribut_calculation_method === "FO") {
        $this.state.earningComponents.map(menu => {
          if (formulaCal.indexOf(menu.short_desc) > -1) {
            component_exist = 1;
          }
        });
        if (formulaCal.indexOf("Gross Salary") > -1) {
          component_exist = 1;
        }
        if (component_exist === 0) {
          swalMessage({
            title:
              "Selected Component is Fomula based component missing some component related to formula .",
            type: "warning"
          });
          return;
        }
      }

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
        calculation_type: $this.state.contribut_calculation_type,
        formula: $this.state.contribut_formula,
        short_desc: $this.state.contribut_short_desc
      });

      insertContributeComp.push({
        employee_id: $this.state.hims_d_employee_id,
        contributions_id: $this.state.contribution_id,
        amount: $this.state.contribution_amount,
        allocate: $this.state.allocate,
        calculation_method: $this.state.contribut_calculation_method,
        calculation_type: $this.state.contribut_calculation_type,
        formula: $this.state.contribut_formula,
        short_desc: $this.state.contribut_short_desc
      });

      $this.setState(
        {
          contributioncomponents: contributioncomponents,
          insertContributeComp: insertContributeComp,
          contribution_id: null,
          contribution_amount: null
        },
        () => {
          CalculateBasedonFormula($this);
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

const calculationTotals = ($this, From) => {
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

  $this.setState(
    {
      gross_salary: gross_salary,
      yearly_gross_salary: gross_salary * 12,
      total_earnings: total_earnings,
      total_deductions: total_deductions,
      total_contributions: total_contributions,
      net_salary: total_earnings - total_deductions,
      cost_to_company: total_earnings + total_contributions
    },
    () => {
      CalculateBasedonFormula($this, "after");
    }
  );

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
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
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
          calculationTotals($this, "");
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
  $this.setState(
    {
      earningComponents: earningComponents,
      updateearnComp: updateearnComp,
      insertearnComp: insertearnComp
    },
    () => {
      calculationTotals($this, "");
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
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No"
  }).then(willDelete => {
    if (willDelete.value) {
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
          calculationTotals($this, "");
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
  $this.setState(
    {
      deductioncomponents: deductioncomponents,
      updateDeductionComp: updateDeductionComp,
      insertDeductionComp: insertDeductionComp
    },
    () => {
      calculationTotals($this, "");
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
    confirmButtonText: "Yes",
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
          calculationTotals($this, "");
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
  $this.setState(
    {
      contributioncomponents: contributioncomponents,
      updateContributeComp: updateContributeComp,
      insertContributeComp: insertContributeComp
    },
    () => {
      calculationTotals($this, "");
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
    data: {
      employee_id: $this.state.hims_d_employee_id,
      nationality_id: $this.state.nationality_id
    },
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

const CalculateBasedonFormula = ($this, from) => {
  let earningComponents = $this.state.earningComponents;
  let deductioncomponents = $this.state.deductioncomponents;
  let contributioncomponents = $this.state.contributioncomponents;

  let updateearnComp = $this.state.updateearnComp;
  let insertearnComp = $this.state.insertearnComp;
  let updateDeductionComp = $this.state.updateDeductionComp;
  let insertDeductionComp = $this.state.insertDeductionComp;
  let insertContributeComp = $this.state.insertContributeComp;
  let updateContributeComp = $this.state.updateContributeComp;

  const earn_comp = Enumerable.from(earningComponents)
    .where(w => w.calculation_method === "FO")
    .toArray();

  const deduct_comp = Enumerable.from(deductioncomponents)
    .where(w => w.calculation_method === "FO")
    .toArray();
  const contribute_comp = Enumerable.from(contributioncomponents)
    .where(w => w.calculation_method === "FO")
    .toArray();

  // let $this = this;

  if (earn_comp.length > 0) {
    for (let x = 0; x < earn_comp.length; x++) {
      let formulaCal = earn_comp[x].formula;

      // let strFormula = earn_comp[x].formula;
      const _index = earningComponents.indexOf(earn_comp[x]);

      earningComponents.map(menu => {
        if (formulaCal.indexOf(menu.short_desc) > -1) {
          let earn_short_desc = menu.short_desc;
          const expression = new RegExp(earn_short_desc, "g");
          formulaCal = formulaCal.replace(expression, menu.amount);
        }
      });
      const expression = new RegExp("Gross Salary", "g");
      formulaCal = formulaCal.replace(expression, $this.state.gross_salary);
      const perexpression = new RegExp("%", "g");
      formulaCal = formulaCal.replace(perexpression, "/100");

      formulaCal = eval(formulaCal);
      earn_comp[x].amount = formulaCal;
      earningComponents[_index] = earn_comp[x];

      updateearnComp.push(earn_comp[x]);
      if (insertearnComp.length > 0) {
        for (let b = 0; b < insertearnComp.length; b++) {
          if (insertearnComp[b].earnings_id === earn_comp[x].earnings_id) {
            insertearnComp[b] = earn_comp[x];
          }
        }
      }
    }
  }

  if (deduct_comp.length > 0) {
    for (let y = 0; y < deduct_comp.length; y++) {
      let formulaCal = deduct_comp[y].formula;

      const _index = deductioncomponents.indexOf(deduct_comp[y]);

      earningComponents.map(menu => {
        if (formulaCal.indexOf(menu.short_desc) > -1) {
          let ded_short_desc = menu.short_desc;
          const expression = new RegExp(ded_short_desc, "g");
          formulaCal = formulaCal.replace(expression, menu.amount);
        }
      });

      const expression = new RegExp("Gross Salary", "g");
      formulaCal = formulaCal.replace(expression, $this.state.gross_salary);
      const perexpression = new RegExp("%", "g");
      formulaCal = formulaCal.replace(perexpression, "/100");

      // formulaCal = `${formulaCal}`;
      formulaCal = eval(formulaCal);
      deduct_comp[y].amount = formulaCal;
      deductioncomponents[_index] = deduct_comp[y];

      updateDeductionComp.push(deduct_comp[y]);
      if (insertDeductionComp.length > 0) {
        for (let d = 0; d < insertDeductionComp.length; d++) {
          if (
            insertDeductionComp[d].deductions_id ===
            deduct_comp[y].deductions_id
          ) {
            insertDeductionComp[d] = deduct_comp[y];
          }
        }
      }
    }
  }

  if (contribute_comp.length > 0) {
    for (let z = 0; z < contribute_comp.length; z++) {
      let formulaCal = contribute_comp[z].formula;

      // let strFormula = contribute_comp[z].formula;
      const _index = contributioncomponents.indexOf(contribute_comp[z]);

      earningComponents.map(menu => {
        if (formulaCal.indexOf(menu.short_desc) > -1) {
          const expression = new RegExp(menu.short_desc, "g");
          formulaCal = formulaCal.replace(expression, menu.amount);
        }
      });
      const expression = new RegExp("Gross Salary", "g");
      formulaCal = formulaCal.replace(expression, $this.state.gross_salary);
      const perexpression = new RegExp("%", "g");
      formulaCal = formulaCal.replace(perexpression, "/100");

      formulaCal = eval(formulaCal);
      contribute_comp[z].amount = formulaCal;
      contributioncomponents[_index] = contribute_comp[z];

      updateContributeComp.push(contribute_comp[z]);
      if (insertContributeComp.length > 0) {
        for (let f = 0; f < insertContributeComp.length; f++) {
          if (
            insertContributeComp[f].contributions_id ===
            contribute_comp[z].contributions_id
          ) {
            insertContributeComp[f] = contribute_comp[z];
          }
        }
      }
    }
  }

  $this.setState(
    {
      deductioncomponents: deductioncomponents,
      contributioncomponents: contributioncomponents,
      earningComponents: earningComponents,
      insertearnComp: insertearnComp,
      updateearnComp: updateearnComp,
      updateDeductionComp: updateDeductionComp,
      insertDeductionComp: insertDeductionComp,
      insertContributeComp: insertContributeComp,
      updateContributeComp: updateContributeComp
    },
    () => {
      if (from !== "after") {
        calculationTotals($this, "afterCal");
      }
    }
  );
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
  getEmpContibuteComponents,
  CalculateBasedonFormula
};
