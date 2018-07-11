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
  cashtexthandle,
  datehandle,
  cardtexthandle,
  chequetexthandle
};
