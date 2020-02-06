import moment from "moment";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../utils/algaehApiCall.js";

const texthandle = ($this, ctrl, e) => {
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
};

const cashtexthandle = ($this, ctrl, e) => {
  e = e || ctrl;

  $this.setState(
    {
      [e.target.name]: e.target.value
    },
    () => {
      calculateTotalAmount($this);
    }
  );
};

const calculateTotalAmount = ($this, e) => {
  // Enumerable

  let cash = parseFloat($this.state.cash_amount);
  let card = parseFloat($this.state.card_amount);
  let cheque = parseFloat($this.state.cheque_amount);
  let totalamount = cash + card + cheque;
  $this.setState({ total_amount: totalamount });
};

const checkcashhandaler = ($this, e) => {
  $this.setState(
    {
      Cashchecked: e.target.checked,
      cash_amount: 0
    },
    () => {
      calculateTotalAmount($this);
    }
  );
};

const checkcardhandaler = ($this, e) => {
  $this.setState(
    {
      Cardchecked: e.target.checked,
      card_amount: 0,
      card_number: null,
      expiry_date: null
    },
    () => {
      calculateTotalAmount($this);
    }
  );
};

const checkcheckhandaler = ($this, e) => {
  $this.setState(
    {
      Checkchecked: e.target.checked,
      cheque_amount: 0,
      cheque_number: null,
      cheque_date: null
    },
    () => {
      calculateTotalAmount($this);
    }
  );
};

const cardtexthandle = ($this, ctrl, e) => {
  e = e || ctrl;

  $this.setState(
    {
      [e.target.name]: e.target.value
    },
    () => {
      calculateTotalAmount($this);
    }
  );
};

const chequetexthandle = ($this, ctrl, e) => {
  e = e || ctrl;

  $this.setState(
    {
      [e.target.name]: e.target.value
    },
    () => {
      calculateTotalAmount($this);
    }
  );
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const Validations = ($this, e) => {
  let isError = false;

  if ($this.state.shift_id === null) {
    isError = true;
    swalMessage({
      title: "Please Select Shift.",
      type: "error"
    });

    document.querySelector("[name='shift_id']").focus();
    return isError;
  } else if ($this.state.Cashchecked === true) {
    if (parseFloat($this.state.cash_amount) === 0) {
      isError = true;
      swalMessage({
        title: "Please enter the Cash Amount",
        type: "error"
      });

      document.querySelector("[name='cash_amount']").focus();
      return isError;
    }
  }

  if ($this.state.Cardchecked === true) {
    if (parseFloat($this.state.card_amount) === 0) {
      isError = true;
      swalMessage({
        title: "Please enter the Card Amount",
        type: "error"
      });

      // document.querySelector("[name='card_amount']").focus();
      return isError;
    } else if (
      $this.state.card_number === null ||
      $this.state.card_number === ""
    ) {
      isError = true;
      swalMessage({
        title: "Card Number date is mandatory.",
        type: "error"
      });

      // document.querySelector("[name='card_date']").focus();
      return isError;
    } else if ($this.state.bank_card_id === null) {
      isError = true;

      swalMessage({
        type: "warning",
        title: "Select Card."
      });

      document.querySelector("[name='bank_card_id']").focus();
      return isError;
    }
  }

  if ($this.state.Checkchecked === true) {
    if (parseFloat($this.state.cheque_amount) === 0) {
      isError = true;
      swalMessage({
        title: "Please enter the Cheque Amount",
        type: "error"
      });

      // document.querySelector("[name='cheque_amount']").focus();
      return isError;
    } else if (
      $this.state.cheque_number === null ||
      $this.state.cheque_number === ""
    ) {
      isError = true;
      swalMessage({
        title: "Card Number date is mandatory.",
        type: "error"
      });

      // document.querySelector("[name='card_date']").focus();
      return isError;
    }
  }

  if (parseFloat($this.state.total_amount) === 0) {
    isError = true;
    swalMessage({
      title: "Invalid. Please enter the amount.",
      type: "error"
    });

    // document.querySelector("[name='cash_amount']").focus();
    return isError;
  } else if (
    $this.props.Advance === false &&
    parseFloat($this.state.total_amount) >
    parseFloat($this.props.inputsparameters.advance_amount)
  ) {
    isError = true;
    swalMessage({
      title: "Invalid. Refund Amount cannot be greater than Advance Taken.",
      type: "error"
    });

    // document.querySelector("[name='cash_amount']").focus();
    return isError;
  }
};

const countertexthandle = ($this, ctrl, e) => {
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
};

const getCashiersAndShiftMAP = $this => {
  let year = moment().format("YYYY");
  let month = moment().format("MM");

  algaehApiCall({
    uri: "/shiftAndCounter/getCashiersAndShiftMAP",
    module: "masterSettings",
    method: "GET",
    data: { year: year, month: month, for: "T" },
    onSuccess: response => {
      if (response.data.success) {
        if (response.data.records.length > 0) {
          $this.setState({ shift_id: response.data.records[0].shift_id });
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

export {
  texthandle,
  datehandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle,
  checkcashhandaler,
  checkcardhandaler,
  checkcheckhandaler,
  Validations,
  countertexthandle,
  getCashiersAndShiftMAP
};
