import moment from "moment";
import { successfulMessage } from "../../../utils/GlobalFunctions";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../../utils/algaehApiCall";

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

const calculateUnbalanced = ($this, context) => {
  let cash = parseFloat($this.state.cash_amount) || 0;
  let card = parseFloat($this.state.card_amount) || 0;
  let cheque = parseFloat($this.state.cheque_amount) || 0;
  let receive = parseFloat($this.state.recievable_amount) || 0;

  let unbalanced_amount = receive - (cash + card + cheque);
  if (unbalanced_amount < 0) {
    swalMessage({
      title: "Please enter correct amount",
      type: "error"
    });
    context.updateState({
      unbalanced_amount: $this.state.recievable_amount,
      cash_amount: 0,
      card_amount: 0,
      cheque_amount: 0
    });
  }

  if (context !== null) {
    context.updateState({
      unbalanced_amount
    });
  }
};

const calculateRecipt = ($this, context, e) => {
  let serviceInput = {
    isReceipt: true,
    intCalculateall: false,

    cash_amount: parseFloat($this.state.cash_amount),
    card_amount: parseFloat($this.state.card_amount),
    cheque_amount: parseFloat($this.state.cheque_amount),
    receiveable_amount: parseFloat($this.state.recievable_amount)
  };

  algaehApiCall({
    uri: "/billing/billingCalculations",
    module: "billing",
    method: "POST",
    data: serviceInput,
    onSuccess: response => {
      if (response.data.success) {
        if (context !== null) {
          response.data.records.patient_payable_h =
            response.data.records.patient_payable ||
            $this.state.patient_payable;
          context.updateState({ ...response.data.records });
        }
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const cashtexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  if (e.target.value === undefined) {
    context.updateState(
      {
        [e.target.name]: e.target.value
      },
      () => calculateUnbalanced($this, context)
    );
  }

  if (e.target.value > 0) {
    let cash_amount = parseFloat(e.target.value);
    let card_amount = parseFloat($this.state.card_amount);
    let cheque_amount = parseFloat($this.state.cheque_amount);
    let receiveable_amount = parseFloat($this.state.recievable_amount);

    if (cash_amount + card_amount + cheque_amount > receiveable_amount) {
      successfulMessage({
        message: "Sum of all amount to be equal to Receivable.",
        title: "Warning",
        icon: "warning"
      });
      context.updateState(
        {
          [e.target.name]: 0
        },
        () => calculateRecipt($this, context)
      );
    } else {
      if (context !== null) {
        context.updateState({ [e.target.name]: e.target.value }, () =>
          calculateUnbalanced($this, context)
        );
      }
    }
  }
};

const cardtexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  if (e.target.value === undefined) {
    context.updateState(
      {
        [e.target.name]: e.target.value
      },
      () => calculateUnbalanced($this, context)
    );
  }
  if (e.target.value && e.target.value > 0) {
    let cash_amount = parseFloat($this.state.cash_amount);
    let card_amount = parseFloat(e.target.value);
    let cheque_amount = parseFloat($this.state.cheque_amount);
    let receiveable_amount = parseFloat($this.state.recievable_amount);

    if (cash_amount + card_amount + cheque_amount > receiveable_amount) {
      successfulMessage({
        message: "Sum of all amount to be equal to Receivable.",
        title: "Warning",
        icon: "warning"
      });
      context.updateState(
        {
          [e.target.name]: 0
        },
        () => calculateRecipt($this, context)
      );
    } else {
      if (context !== null) {
        context.updateState({ [e.target.name]: e.target.value }, () =>
          calculateUnbalanced($this, context)
        );
      }
    }
  }
};

const chequetexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value === undefined) {
    context.updateState(
      {
        [e.target.name]: e.target.value
      },
      () => calculateUnbalanced($this, context)
    );
  }

  if (e.target.value > 0) {
    let cash_amount = parseFloat($this.state.cash_amount);
    let card_amount = parseFloat($this.state.card_amount);
    let cheque_amount = parseFloat(e.target.value);
    let receiveable_amount = parseFloat($this.state.recievable_amount);

    if (cash_amount + card_amount + cheque_amount > receiveable_amount) {
      successfulMessage({
        message: "Sum of all amount to be equal to Receivable.",
        title: "Warning",
        icon: "warning"
      });
      context.updateState(
        {
          [e.target.name]: 0
        },
        () => calculateRecipt($this, context)
      );
    } else {
      if (context !== null) {
        context.updateState({ [e.target.name]: e.target.value }, () =>
          calculateUnbalanced($this, context)
        );
      }
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
  let Cashchecked = e.target.checked;
  $this.setState(
    {
      Cashchecked: Cashchecked,
      cash_amount: 0
    },
    () => {
      calculateUnbalanced($this, context, e);
    }
  );

  if (context !== undefined) {
    context.updateState({
      cash_amount: 0,
      Cashchecked: Cashchecked
    });
  }
};

const checkcardhandaler = ($this, context, e) => {
  let Cardchecked = e.target.checked;
  $this.setState(
    {
      Cardchecked: Cardchecked,
      card_amount: 0,
      card_check_number: null,
      expiry_date: null
    },
    () => {
      calculateUnbalanced($this, context, e);
    }
  );

  if (context !== undefined) {
    context.updateState({
      card_amount: 0,
      card_check_number: null,
      expiry_date: null,
      Cardchecked: Cardchecked
    });
  }
};

const checkcheckhandaler = ($this, context, e) => {
  let Checkchecked = e.target.checked;
  $this.setState(
    {
      Checkchecked: Checkchecked,
      cheque_amount: 0,
      cheque_number: null,
      cheque_date: null
    },
    () => {
      calculateUnbalanced($this, context, e);
    }
  );

  if (context !== undefined) {
    context.updateState({
      cheque_amount: 0,
      cheque_number: null,
      cheque_date: null,
      Checkchecked: Checkchecked
    });
  }
};

const countertexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      let _screenName = getCookie("ScreenName").replace("/", "");
      algaehApiCall({
        uri: "/userPreferences/save",
        data: {
          screenName: _screenName,
          identifier: "Counter",
          value: value
        },
        method: "POST"
      });
    }
  );
  if (context !== undefined) {
    context.updateState({ [name]: value });
  }
};

export {
  texthandle,
  cashtexthandle,
  datehandle,
  cardtexthandle,
  chequetexthandle,
  checkcashhandaler,
  checkcardhandaler,
  checkcheckhandaler,
  calculateRecipt,
  countertexthandle,
  calculateUnbalanced
};
