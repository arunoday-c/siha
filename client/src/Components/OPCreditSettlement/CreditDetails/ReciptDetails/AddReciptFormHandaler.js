import moment from "moment";
import { successfulMessage } from "../../../../utils/GlobalFunctions";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../../../utils/algaehApiCall";

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

const calculateRecipt = ($this, context, e) => {
  let serviceInput = {
    isReceipt: true,
    intCalculateall: false,

    cash_amount: parseFloat($this.state.cash_amount) || 0,
    card_amount: parseFloat($this.state.card_amount) || 0,
    cheque_amount: parseFloat($this.state.cheque_amount) || 0,
    receiveable_amount: parseFloat($this.state.recievable_amount) || 0
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

const calculateUnbalanced = ($this, context, e) => {
  const cash = parseFloat($this.state.cash_amount) || 0;
  const card = parseFloat($this.state.card_amount) || 0;
  const cheque = parseFloat($this.state.cheque_amount) || 0;
  const receive = parseFloat($this.state.recievable_amount) || 0;

  let unbalanced_amount = receive - (cash + card + cheque);

  $this.setState({
    unbalanced_amount
  });
  context.updateState({
    unbalanced_amount
  });
};

const cashtexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  console.log(e.target.value, e.target.name, "change cash");

  if (e.target.value === undefined) {
    $this.setState({
      [e.target.name]: null
    });
    if (context !== null) {
      context.updateState(
        { [e.target.name]: null },
        calculateUnbalanced($this, context)
      );
    }
  }

  if (e.target.value > 0) {
    let cash_amount = parseFloat(e.target.value) || 0;
    let card_amount = parseFloat($this.state.card_amount) || 0;
    let cheque_amount = parseFloat($this.state.cheque_amount) || 0;
    let receiveable_amount = parseFloat($this.state.recievable_amount) || 0;

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
      $this.setState({
        [e.target.name]: e.target.value
      });

      if (context !== null) {
        context.updateState(
          { [e.target.name]: e.target.value },
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
  checkcashhandaler,
  checkcardhandaler,
  checkcheckhandaler,
  calculateRecipt,
  countertexthandle,
  calculateUnbalanced
};
