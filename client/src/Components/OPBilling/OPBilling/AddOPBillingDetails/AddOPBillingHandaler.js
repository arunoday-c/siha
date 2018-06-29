const serviceTypeHandeler = ($this, context, e) => {
  $this.setState(
    {
      [e.name]: e.value
    },
    () => {
      debugger;
      $this.props.getServices($this.state.s_service_type);
    }
  );
  if (context != null) {
    context.updateState({ [e.name]: e.value });
  }
};

const serviceHandeler = ($this, context, e) => {
  $this.setState({
    [e.name]: e.value,
    visittypeselect: false
  });
  if (context != null) {
    context.updateState({ [e.name]: e.value });
  }
};

export { serviceTypeHandeler, serviceHandeler };
