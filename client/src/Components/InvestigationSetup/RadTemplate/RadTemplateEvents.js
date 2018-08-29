const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  if (context !== undefined) {
    context.updateState({
      [name]: value
    });
  }
};

const rtehandle = ($this, context, template_html) => {
  debugger;

  $this.setState({ template_html });

  if (context !== undefined) {
    context.updateState({
      template_html: template_html
    });
  }
};

const saveTemplate = ($this, e) => {
  $this.props.onClose && $this.props.onClose(1);
};

export { texthandle, saveTemplate, rtehandle };
