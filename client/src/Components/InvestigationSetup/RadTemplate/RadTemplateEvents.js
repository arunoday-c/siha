const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    dataEnter: true
  });

  if (context !== undefined) {
    context.updateState({
      [name]: value,
      dataEnter: true
      // template_html: $this.state.template_html
    });
  }
};

const rtehandle = ($this, context, template_html) => {
  debugger;
  $this.setState({ template_html });

  if (context !== undefined) {
    context.updateState({
      template_html: template_html,
      template_name: $this.state.template_name
    });
  }
};

const saveTemplate = ($this, e) => {
  $this.props.onClose &&
    $this.props.onClose($this.state.hims_d_rad_template_detail_id);
};

export { texthandle, saveTemplate, rtehandle };
