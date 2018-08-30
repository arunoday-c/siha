const texthandle = ($this, context, ctrl, e) => {
  debugger;
  e = e || ctrl;
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

const ViewEditTemplate = ($this, row) => {
  debugger;
  $this.setState({
    ...$this.state,
    openTemplate: !$this.state.openTemplate,
    radTempobj: row
  });
};

const ShowTemplate = $this => {
  $this.setState({
    ...$this.state,
    openTemplate: !$this.state.openTemplate,
    radTempobj: null
  });
};

const CloseTemplate = ($this, value) => {
  debugger;
  if (value !== 0) {
    let radObj = {
      template_name: $this.state.template_name,
      template_html: $this.state.template_html
    };

    let RadTemplate = $this.state.RadTemplate;
    RadTemplate.push(radObj);
    $this.setState({
      openTemplate: !$this.state.openTemplate,
      RadTemplate: RadTemplate
    });
  } else {
    $this.setState({
      openTemplate: !$this.state.openTemplate
    });
  }
};

export { texthandle, ShowTemplate, CloseTemplate, ViewEditTemplate };
