const serviceTypeHandeler = ($this, context, e) => {
  $this.setState(
    {
      [e.name]: e.value
    },
    () => {
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

const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name;
  let value;
  if (e.name != null) {
    name = e.name;
    value = e.value;
  } else {
    name = e.target.name;
    value = e.target.value;
  }

  $this.setState({
    [name]: value
  });

  if (context != null) {
    context.updateState({ [name]: value });
  }
};

const servicetexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let sheet_discount_percentage = 0;
  let sheet_discount_amount = 0;
  if ([e.target.name] == "sheet_discount_percentage") {
    sheet_discount_percentage = parseFloat(e.target.value.replace(" %", ""));
    sheet_discount_amount = 0;
  } else {
    sheet_discount_amount = parseFloat(e.target.value);
    sheet_discount_percentage = 0;
  }
  $this.setState({
    sheet_discount_percentage: sheet_discount_percentage,
    sheet_discount_amount: sheet_discount_amount,
    cash_amount: parseFloat($this.state.cash_amount),
    card_amount: parseFloat($this.state.card_amount),
    cheque_amount: parseFloat($this.state.cheque_amount)
  });

  if (context != null) {
    context.updateState({
      sheet_discount_percentage: sheet_discount_percentage,
      sheet_discount_amount: sheet_discount_amount
    });
  }
};

export { serviceTypeHandeler, serviceHandeler, texthandle, servicetexthandle };
