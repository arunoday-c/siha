//let texthandlerInterval = null;

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

const radioChange = ($this, context, e) => {
  debugger;
  let radioActive = true;
  let radioInactive = false;
  let item_status = "A";
  if (e.target.value === "Active") {
    radioActive = true;
    radioInactive = false;
    item_status = "A";
  } else if (e.target.value === "Inactive") {
    radioActive = false;
    radioInactive = true;
    item_status = "I";
  }
  $this.setState({
    [e.target.name]: e.target.value,
    radioInactive: radioInactive,
    radioActive: radioActive,
    item_status: item_status
  });

  if (context !== undefined) {
    context.updateState({
      radioInactive: radioInactive,
      radioActive: radioActive,
      item_status: item_status
    });
  }
};

const BatchExpRequired = ($this, e) => {
  let required_batchno_expiry = "N";
  if (!$this.state.batchexpreq === true) {
    required_batchno_expiry = "Y";
  }
  $this.setState({
    required_batchno_expiry: required_batchno_expiry,
    batchexpreq: !$this.state.batchexpreq
  });
};

export { texthandle, radioChange, BatchExpRequired };
