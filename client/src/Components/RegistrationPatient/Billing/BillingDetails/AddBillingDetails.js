import moment from "moment";

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

const cashtexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  $this.setState(
    {
      [e.target.name]: e.target.value
    },
    () => {
      var intervalId;
      let serviceInput = {
        isReceipt: true,
        hims_d_services_id: $this.state.hims_d_services_id,
        sheet_discount_percentage: parseFloat(
          $this.state.sheet_discount_percentage
        ),
        sheet_discount_amount: parseFloat($this.state.sheet_discount_amount),
        cash_amount: parseFloat($this.state.cash_amount),
        card_amount: parseFloat($this.state.card_amount),
        cheque_amount: parseFloat($this.state.cheque_amount)
      };

      clearInterval(intervalId);
      intervalId = setInterval(() => {
        $this.props.generateBill(serviceInput);
        clearInterval(intervalId);
      }, 1000);
    }
  );

  if (context != null) {
    context.updateState({ [e.target.name]: e.target.value });
  }
};

const cardtexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  $this.setState(
    {
      [e.target.name]: e.target.value
    },
    () => {
      var intervalId;
      let serviceInput = {
        isReceipt: true,
        hims_d_services_id: $this.state.hims_d_services_id,
        sheet_discount_percentage: parseFloat(
          $this.state.sheet_discount_percentage
        ),
        sheet_discount_amount: parseFloat($this.state.sheet_discount_amount),
        cash_amount: parseFloat($this.state.cash_amount),
        card_amount: parseFloat($this.state.card_amount),
        cheque_amount: parseFloat($this.state.cheque_amount)
      };

      clearInterval(intervalId);
      intervalId = setInterval(() => {
        $this.props.generateBill(serviceInput);
        clearInterval(intervalId);
      }, 1000);
    }
  );

  if (context != null) {
    context.updateState({ [e.target.name]: e.target.value });
  }
};

const chequetexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  $this.setState(
    {
      [e.target.name]: e.target.value
    },
    () => {
      var intervalId;
      let serviceInput = {
        isReceipt: true,
        hims_d_services_id: $this.state.hims_d_services_id,
        sheet_discount_percentage: parseFloat(
          $this.state.sheet_discount_percentage
        ),
        sheet_discount_amount: parseFloat($this.state.sheet_discount_amount),
        cash_amount: parseFloat($this.state.cash_amount),
        card_amount: parseFloat($this.state.card_amount),
        cheque_amount: parseFloat($this.state.cheque_amount)
      };

      clearInterval(intervalId);
      intervalId = setInterval(() => {
        $this.props.generateBill(serviceInput);
        clearInterval(intervalId);
      }, 1000);
    }
  );

  if (context != null) {
    context.updateState({ [e.target.name]: e.target.value });
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
  $this.setState(
    {
      sheet_discount_percentage: sheet_discount_percentage,
      sheet_discount_amount: sheet_discount_amount,
      cash_amount: parseFloat($this.state.cash_amount),
      card_amount: parseFloat($this.state.card_amount),
      cheque_amount: parseFloat($this.state.cheque_amount)
    },
    () => {
      var intervalId;
      let serviceInput = {
        hims_d_services_id: $this.state.hims_d_services_id,
        sheet_discount_percentage: parseFloat(
          $this.state.sheet_discount_percentage
        ),
        sheet_discount_amount: parseFloat($this.state.sheet_discount_amount),
        cash_amount: parseFloat($this.state.cash_amount),
        card_amount: parseFloat($this.state.card_amount),
        cheque_amount: parseFloat($this.state.cheque_amount)
      };

      clearInterval(intervalId);
      intervalId = setInterval(() => {
        $this.props.generateBill(serviceInput);
        clearInterval(intervalId);
      }, 1000);
    }
  );

  if (context != null) {
    context.updateState({
      sheet_discount_percentage: sheet_discount_percentage,
      sheet_discount_amount: sheet_discount_amount
    });
  }
};

const datehandle = ($this, context, e) => {
  $this.setState({
    [e.target.name]: moment(e)._d
  });

  if (context != null) {
    context.updateState({ bill_date: moment(e)._d });
  }
};

export {
  texthandle,
  datehandle,
  servicetexthandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle
};
