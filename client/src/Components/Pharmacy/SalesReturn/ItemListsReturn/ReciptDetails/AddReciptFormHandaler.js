import moment from "moment";
import { successfulMessage } from "../../../../../utils/GlobalFunctions";
let texthandlerInterval = null;

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

  if (context !== null) {
    context.updateState({ [name]: value });
  }
};

const calculateRecipt = ($this, context) => {
  var intervalId;

  let serviceInput = {
    isReceipt: true,
    intCalculateall: false,

    cash_amount: parseFloat($this.state.cash_amount),
    card_amount: parseFloat($this.state.card_amount),
    cheque_amount: parseFloat($this.state.cheque_amount),
    receiveable_amount: parseFloat($this.state.receiveable_amount)
  };

  clearInterval(intervalId);
  intervalId = setInterval(() => {
    $this.props.reciptCalculations({
      uri: "/billing/billingCalculations",
      module: "billing",
      method: "POST",
      data: serviceInput,
      redux: {
        type: "BILL_HEADER_GEN_GET_DATA",
        mappingName: "posheader"
      }
    });
    clearInterval(intervalId);
  }, 500);
};

const cashtexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let cash_amount = parseFloat(e.target.value);
  let card_amount = parseFloat($this.state.card_amount);
  let cheque_amount = parseFloat($this.state.cheque_amount);
  let receiveable_amount = parseFloat($this.state.receiveable_amount);

  if (cash_amount + card_amount + cheque_amount > receiveable_amount) {
    successfulMessage({
      message: "Sum of all amount to be equal to Receivable.",
      title: "Warning",
      icon: "warning"
    });
    $this.setState(
      {
        [e.target.name]: 0,
        errorInCash: true
      },
      () => {
        $this.setState({ errorInCash: false });
      }
    );
  } else {
    $this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        calculateRecipt($this, context);
      }
    );

    if (context !== null) {
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
      message: "Sum of all amount to be equal to Receivable.",
      title: "Warning",
      icon: "warning"
    });
    $this.setState(
      {
        [e.target.name]: 0,
        errorInCard: true
      },
      () => {
        $this.setState({ errorInCard: false });
      }
    );
  } else {
    $this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        calculateRecipt($this, context);
      }
    );

    if (context !== null) {
      context.updateState({ [e.target.name]: e.target.value });
    }
  }
};

const datehandle = ($this, context, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });

  if (context !== null) {
    context.updateState({ [e]: moment(ctrl)._d });
  }
};

const checkcashhandaler = ($this, context, e) => {
  $this.setState(
    {
      Cashchecked: e.target.checked,
      cash_amount: 0
    },
    () => {
      calculateRecipt($this, context);
    }
  );

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({
        cash_amount: 0
      });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

const checkcardhandaler = ($this, context, e) => {
  $this.setState(
    {
      Cardchecked: e.target.checked,
      card_amount: 0,
      card_check_number: null,
      expiry_date: null
    },
    () => {
      calculateRecipt($this, context);
    }
  );

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({
        card_amount: 0,
        card_check_number: null,
        expiry_date: null
      });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

export {
  texthandle,
  cashtexthandle,
  datehandle,
  cardtexthandle,
  checkcashhandaler,
  checkcardhandaler
};
