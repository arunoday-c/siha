let texthandlerInterval = null;

const changeChecks = ($this, context, e) => {
  let name = e.target.name;

  switch (e.target.name) {
    case "leave_salary_process":
      $this.setState(
        {
          leave_salary_process: !$this.state.leave_salary_process
        },
        () => {
          clearInterval(texthandlerInterval);
          texthandlerInterval = setInterval(() => {
            if (context !== undefined) {
              context.updateState({
                [name]: $this.state.leave_salary_process ? "Y" : "N"
              });
            }
            clearInterval(texthandlerInterval);
          }, 500);
        }
      );

    case "late_coming_rule":
      $this.setState(
        {
          late_coming_rule: !$this.state.late_coming_rule
        },
        () => {
          clearInterval(texthandlerInterval);
          texthandlerInterval = setInterval(() => {
            if (context !== undefined) {
              context.updateState({
                [name]: $this.state.late_coming_rule ? "Y" : "N"
              });
            }
            clearInterval(texthandlerInterval);
          }, 500);
        }
      );

    case "airfare_process":
      $this.setState(
        {
          airfare_process: !$this.state.airfare_process
        },
        () => {
          clearInterval(texthandlerInterval);
          texthandlerInterval = setInterval(() => {
            if (context !== undefined) {
              context.updateState({
                [name]: $this.state.airfare_process ? "Y" : "N"
              });
            }
            clearInterval(texthandlerInterval);
          }, 500);
        }
      );

    case "exclude_machine_data":
      $this.setState(
        {
          exclude_machine_data: !$this.state.exclude_machine_data
        },
        () => {
          clearInterval(texthandlerInterval);
          texthandlerInterval = setInterval(() => {
            if (context !== undefined) {
              context.updateState({
                [name]: $this.state.exclude_machine_data ? "Y" : "N"
              });
            }
            clearInterval(texthandlerInterval);
          }, 500);
        }
      );
    case "gratuity_applicable":
      $this.setState(
        {
          gratuity_applicable: !$this.state.gratuity_applicable
        },
        () => {
          clearInterval(texthandlerInterval);
          texthandlerInterval = setInterval(() => {
            if (context !== undefined) {
              context.updateState({
                [name]: $this.state.gratuity_applicable ? "Y" : "N"
              });
            }
            clearInterval(texthandlerInterval);
          }, 500);
        }
      );
    case "suspend_salary":
      $this.setState(
        {
          suspend_salary: !$this.state.suspend_salary
        },
        () => {
          clearInterval(texthandlerInterval);
          texthandlerInterval = setInterval(() => {
            if (context !== undefined) {
              context.updateState({
                [name]: $this.state.suspend_salary ? "Y" : "N"
              });
            }
            clearInterval(texthandlerInterval);
          }, 500);
        }
      );
  }
};

export { changeChecks };
