import moment from "moment";
import { successfulMessage } from "../../../../utils/GlobalFunctions";

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

const calculateRecipt = ($this, context) => {
  var intervalId;
  debugger;

  let serviceInput = {
    isReceipt: true,
    intCalculateall: false,

    cash_amount: parseFloat($this.state.cash_amount),
    card_amount: parseFloat($this.state.card_amount),
    cheque_amount: parseFloat($this.state.cheque_amount),
    receiveable_amount: parseFloat($this.state.receiveable_amount)
  };
  debugger;
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    $this.props.billingCalculations({
      uri: "/billing/billingCalculations",
      method: "POST",
      data: serviceInput,
      redux: {
        type: "BILL_HEADER_GEN_GET_DATA",
        mappingName: "genbill"
      }
    });
    clearInterval(intervalId);
  }, 1000);
};

const cashtexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let cash_amount = parseFloat(e.target.value);
  let card_amount = parseFloat($this.state.card_amount);
  let cheque_amount = parseFloat($this.state.cheque_amount);
  let receiveable_amount = parseFloat($this.state.receiveable_amount);

  if (cash_amount + card_amount + cheque_amount > receiveable_amount) {
    successfulMessage({
      message: "Invalid Input. Sum of all amount to be equal to Receivable.",
      title: "Warning",
      icon: "warning"
    });
  } else {
    $this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        calculateRecipt($this, context);
      }
    );

    if (context != null) {
      context.updateState({ [e.target.name]: e.target.value });
    }
  }
};

const cardtexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let cash_amount = parseFloat($this.state.cash_amount);
  let card_amount = parseFloat(e.target.value);
  let cheque_amount = parseFloat($this.state.cheque_amount);
  let receiveable_amount = parseFloat($this.state.receiveable_amount);

  if (cash_amount + card_amount + cheque_amount > receiveable_amount) {
    successfulMessage({
      message: "Invalid Input. Sum of all amount to be equal to Receivable.",
      title: "Warning",
      icon: "warning"
    });
  } else {
    $this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        calculateRecipt($this, context);
      }
    );

    if (context != null) {
      context.updateState({ [e.target.name]: e.target.value });
    }
  }
};

const chequetexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let cash_amount = parseFloat($this.state.cash_amount);
  let card_amount = parseFloat($this.state.card_amount);
  let cheque_amount = parseFloat(e.target.value);
  let receiveable_amount = parseFloat($this.state.receiveable_amount);

  if (cash_amount + card_amount + cheque_amount > receiveable_amount) {
    successfulMessage({
      message: "Invalid Input. Sum of all amount to be equal to Receivable.",
      title: "Warning",
      icon: "warning"
    });
  } else {
    $this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        calculateRecipt($this, context);
      }
    );

    if (context != null) {
      context.updateState({ [e.target.name]: e.target.value });
    }
  }
};

const adjustadvance = ($this, context, ctrl, e) => {
  debugger;
  e = e || ctrl;

  if (e.target.value > $this.state.advance_amount) {
    successfulMessage({
      message:
        "Invalid Input. Adjusted amount cannot be greater than Advance amount",
      title: "Warning",
      icon: "warning"
    });
  } else {
    $this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        billheaderCalculation($this, context);
      }
    );

    if (context != null) {
      context.updateState({
        [e.target.name]: e.target.value
      });
    }
  }
};

const servicetexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  debugger;
  let sheet_discount_percentage = 0;
  let sheet_discount_amount = 0;

  if ([e.target.name] == "sheet_discount_percentage") {
    sheet_discount_percentage = parseFloat(e.target.value.replace(" %", ""));
    sheet_discount_amount = 0;
  } else {
    sheet_discount_amount = parseFloat(e.target.value);
    sheet_discount_percentage = 0;
  }
  if (sheet_discount_percentage > 100) {
    successfulMessage({
      message: "Invalid Input. Discount % cannot be greater than 100.",
      title: "Warning",
      icon: "warning"
    });
  } else {
    $this.setState(
      {
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      },
      () => {
        billheaderCalculation($this, context);
      }
    );

    if (context != null) {
      context.updateState({
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      });
    }
  }
};

const billheaderCalculation = ($this, context) => {
  var intervalId;
  let serviceInput = {
    isReceipt: false,
    intCalculateall: false,
    sheet_discount_percentage: parseFloat(
      $this.state.sheet_discount_percentage
    ),
    sheet_discount_amount: parseFloat($this.state.sheet_discount_amount),
    advance_adjust: parseFloat($this.state.advance_adjust),
    gross_total: parseFloat($this.state.gross_total)
  };

  clearInterval(intervalId);
  debugger;
  intervalId = setInterval(() => {
    $this.props.billingCalculations({
      uri: "/billing/billingCalculations",
      method: "POST",
      data: serviceInput,
      redux: {
        type: "BILL_HEADER_GEN_GET_DATA",
        mappingName: "genbill"
      }
    });
    clearInterval(intervalId);
  }, 1000);
};

const datehandle = ($this, context, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });

  if (context != null) {
    context.updateState({ [e]: moment(ctrl)._d });
  }
};

export {
  texthandle,
  datehandle,
  servicetexthandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle,
  adjustadvance
};
