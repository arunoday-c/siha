import Enumerable from "linq";

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

export {
  earntexthandle,
  deducttexthandle,
  contributtexthandle,
  numberSet,
  AddEarnComponent,
  AddDeductionComponent,
  AddContributionComponent,
  onchangegridcol
};
