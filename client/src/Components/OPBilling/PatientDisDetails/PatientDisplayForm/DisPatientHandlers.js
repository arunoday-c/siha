const texthandle = ($this, context, e) => {
  $this.setState({
    [e.target.name]: e.target.value
  });

  if (context != null) {
    context.updateState({ [e.target.name]: e.target.value });
  }
};

export { texthandle };
