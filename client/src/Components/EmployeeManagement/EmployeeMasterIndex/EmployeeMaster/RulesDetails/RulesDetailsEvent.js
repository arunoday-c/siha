const changeChecks = ($this, e) => {
  let name = e.target.name;

  switch (e.target.name) {
    case "leave_salary_process":
      $this.setState(
        {
          LeaveSalaryProcess: !$this.state.LeaveSalaryProcess
        },
        () => {
          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            [name]: $this.state.LeaveSalaryProcess ? "Y" : "N"
          });
        }
      );
      break;
    case "late_coming_rule":
      $this.setState(
        {
          LateComingRule: !$this.state.LateComingRule
        },
        () => {
          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            [name]: $this.state.LateComingRule ? "Y" : "N"
          });
        }
      );
      break;
    case "airfare_process":
      $this.setState(
        {
          AirfareProcess: !$this.state.AirfareProcess
        },
        () => {
          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            [name]: $this.state.AirfareProcess ? "Y" : "N"
          });
        }
      );
      break;
    case "exclude_machine_data":
      $this.setState(
        {
          ExcludeMachineData: !$this.state.ExcludeMachineData
        },
        () => {
          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            [name]: $this.state.ExcludeMachineData ? "Y" : "N"
          });
        }
      );
      break;
    case "gratuity_applicable":
      $this.setState(
        {
          GratuityApplicable: !$this.state.GratuityApplicable
        },
        () => {
          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            [name]: $this.state.GratuityApplicable ? "Y" : "N"
          });
        }
      );
      break;
    case "suspend_salary":
      $this.setState(
        {
          SuspendSalary: !$this.state.SuspendSalary
        },
        () => {
          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            [name]: $this.state.SuspendSalary ? "Y" : "N"
          });
        }
      );
      break;
    case "pf_applicable":
      $this.setState(
        {
          PfApplicable: !$this.state.PfApplicable
        },
        () => {
          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            [name]: $this.state.PfApplicable ? "Y" : "N"
          });
        }
      );
      break;
    case "gratuity_encash":
      $this.setState({
        [name]: e.target.value
      },
        () => {
          $this.props.EmpMasterIOputs.updateEmployeeTabs({
            [name]: e.target.value
          });
        });
      break;

    default:
      this.setState({
        [name]: "Y"
      });
      break;
  }
};

export { changeChecks };
