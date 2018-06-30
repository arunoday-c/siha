const DeptselectedHandeler = ($this, context, e) => {
  $this.setState({
    [e.name]: e.value,
    department_id: e.selected.department_id
  });
  if (context != null) {
    context.updateState({
      [e.name]: e.value,
      department_id: e.selected.department_id
    });
  }
};

const selectedHandeler = ($this, context, e) => {
  $this.setState({
    [e.name]: e.value,
    visittypeselect: false
  });
  if (context != null) {
    context.updateState({ [e.name]: e.value });
  }
};

const doctorselectedHandeler = ($this, context, e) => {
  $this.setState(
    {
      [e.name]: e.value,
      visittypeselect: false,
      hims_d_services_id: e.selected.services_id,
      incharge_or_provider: e.value
    },
    () => {
      let serviceInput = { hims_d_services_id: $this.state.hims_d_services_id };
      $this.props.generateBill(serviceInput);
    }
  );
  if (context != null) {
    context.updateState({
      [e.name]: e.value,
      hims_d_services_id: e.selected.services_id,
      incharge_or_provider: e.value
    });
  }
};

export { DeptselectedHandeler, selectedHandeler, doctorselectedHandeler };
