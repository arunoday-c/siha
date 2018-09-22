let texthandlerInterval = null;

const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  if (context !== undefined) {
    context.updateState({ [name]: value });
  }
};

export { texthandle };
