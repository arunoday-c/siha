const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;

  $this.setState({
    [name]: value,
    dataEnter: true
  });
};

const rtehandle = ($this, context, template_html) => {
  if (template_html === "<p><br></p>") {
    // the text editor returns these tags in place of empty strings
    $this.setState({ template_html: null });
  }
  $this.setState({ template_html: template_html });
};

const saveTemplate = ($this, e) => {
  $this.props.onClose && $this.props.onClose($this.state);
};

export { texthandle, saveTemplate, rtehandle };
