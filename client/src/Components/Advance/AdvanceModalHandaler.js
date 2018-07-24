import moment from "moment";

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

const datehandle = ($this, e) => {
  $this.setState({
    [e.target.name]: moment(e)._d
  });
};

const Validations = ($this, e) => {
  let isError = false;

  if ($this.state.card_number.length !== 0 && $this.state.card_amount >= 0) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid. Card amount cannot be zero."
    });
    document.querySelector("[name='card_amount']").focus();
    return isError;
  }

  if ($this.state.card_number.length !== 0 && $this.state.card_date === null) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid. Card expiry date is mandatory."
    });
    document.querySelector("[name='card_date']").focus();
    return isError;
  }

  if (
    $this.state.cheque_number.length !== 0 &&
    $this.state.cheque_amount >= 0
  ) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid. Check amount cannot be zero."
    });
    document.querySelector("[name='cheque_amount']").focus();
    return isError;
  }

  if (
    $this.state.cheque_number.length !== 0 &&
    $this.state.cheque_date === null
  ) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid. Check expiry date is mandatory."
    });
    document.querySelector("[name='cheque_date']").focus();
    return isError;
  }

  if ($this.state.card_amount > 0) {
    if (
      $this.state.card_number === undefined ||
      $this.state.card_number === ""
    ) {
      isError = true;
      $this.setState({
        open: true,
        MandatoryMsg: "Invalid. Card Number cannot be blank."
      });
      return isError;
    }

    if ($this.state.card_date === undefined || $this.state.card_date === "") {
      isError = true;
      $this.setState({
        open: true,
        MandatoryMsg: "Invalid. Card Date Cannot be blank."
      });
      return isError;
    }
  }

  if ($this.state.cheque_amount > 0) {
    if (
      $this.state.cheque_number === undefined ||
      $this.state.cheque_number === ""
    ) {
      isError = true;
      $this.setState({
        open: true,
        MandatoryMsg: "Invalid. Check Number cannot be blank."
      });
      return isError;
    }

    if (
      $this.state.cheque_date === undefined ||
      $this.state.cheque_date === ""
    ) {
      isError = true;
      $this.setState({
        open: true,
        MandatoryMsg: "Invalid. Cheque Date Cannot be blank."
      });
      return isError;
    }
  }

  if ($this.state.total_amount < 0) {
    isError = true;
    $this.setState({
      open: true,
      MandatoryMsg: "Invalid. Please enter the amount."
    });
    document.querySelector("[name='cash_amount']").focus();
    return isError;
  }
};

export {
  texthandle,
  datehandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle,
  Validations
};
