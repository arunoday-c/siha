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

const ShowTemplate = $this => {
  $this.setState({
    ...$this.state,
    openTemplate: !$this.state.openTemplate
  });
};

export { texthandle, ShowTemplate };
