let texthandlerInterval = null;

const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const AddUom = ($this, context) => {
  debugger;
  let isError = false;
  if ($this.state.uom_id === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Select Sales UOM."
    });
    return isError;
  } else if ($this.state.conversion_factor === 0) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Select Sales UOM."
    });
    return isError;
  } else if ($this.state.stocking_uom === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid Input. Select Sales UOM."
    });
    return isError;
  } else {
    let detail_item_uom = $this.state.detail_item_uom;

    let uomObj = {
      uom_id: $this.state.uom_id,
      conversion_factor: $this.state.conversion_factor,
      stocking_uom: $this.state.stocking_uom
    };
    detail_item_uom.push(uomObj);
    $this.setState({
      detail_item_uom: detail_item_uom
    });

    if (context !== undefined) {
      context.updateState({ detail_item_uom: detail_item_uom });
    }
  }
};

export { texthandle, AddUom };
