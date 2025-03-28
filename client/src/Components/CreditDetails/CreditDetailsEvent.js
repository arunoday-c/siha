import { swalMessage } from "../../utils/algaehApiCall";
import Enumerable from "linq";
import _ from "lodash";

const writeOffhandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let { name, value } = e.target;
  let recievable_amount;

  if (value) {
    recievable_amount =
      parseFloat($this.state.receipt_amount) - parseFloat(e.target.value);
    if (recievable_amount < 0) {
      recievable_amount = parseFloat($this.state.receipt_amount);
      value = 0;
      swalMessage({
        title: "Write off amount cannot be greater than Receipt amount",
        type: "error",
      });
    }
  } else {
    recievable_amount = parseFloat($this.state.receipt_amount);
  }

  $this.setState({
    [name]: value,
    recievable_amount: recievable_amount,
  });
  if (context !== null) {
    context.updateState({
      [name]: value,
      recievable_amount: recievable_amount,
      unbalanced_amount: recievable_amount,
      cash_amount:
        $this.state.default_pay_type === "CH" ? recievable_amount : 0,
      card_amount:
        $this.state.default_pay_type === "CD" ? recievable_amount : 0,
      // unbalanced_amount: 0
    });
  }
};

const updateCridetSettlement = ($this, context) => {
  let saveEnable = true;

  let receipt_amount = Enumerable.from($this.state.criedtdetails)
    .where("!!$.receipt_amount") // don't be afraid, meet $ aka lambda selector from Linq, lookup the docs.
    .sum((w) => parseFloat(w.receipt_amount));

  let selected_data = _.filter($this.state.criedtdetails, (f) => {
    return f.include === "Y";
  });
  if (selected_data.length > 0) {
    saveEnable = false;
  }

  if (context !== null) {
    context.updateState({
      saveEnable: saveEnable,
      receipt_amount: receipt_amount,
      write_off_amount: 0,
      recievable_amount: receipt_amount,
      unbalanced_amount: $this.state.default_pay_type ? 0 : receipt_amount,
      cash_amount: $this.state.default_pay_type === "CH" ? receipt_amount : 0,
      card_amount: $this.state.default_pay_type === "CD" ? receipt_amount : 0,
      cheque_amount: 0,
      // unbalanced_amount: 0
    });
  }
};

const includeHandler = ($this, context, row, e) => {
  let _criedtdetails = $this.state.criedtdetails;
  let receipt_amount = 0;
  let include = "Y";
  let saveEnable = true;

  if (e.target.checked === true) {
    row["receipt_amount"] = row["previous_balance"];
    row["balance_amount"] = 0;
    receipt_amount =
      row["receipt_amount"] + parseFloat($this.state.receipt_amount);
    row["include"] = "Y";
  } else if (e.target.checked === false) {
    receipt_amount =
      parseFloat($this.state.receipt_amount) - row["receipt_amount"];
    row["receipt_amount"] = 0;
    row["balance_amount"] = row["previous_balance"];
    row["include"] = "N";
  }

  for (let k = 0; k < _criedtdetails.length; k++) {
    if (_criedtdetails[k].bill_header_id === row.bill_header_id) {
      _criedtdetails[k] = row;
    }
  }

  let listOfinclude = Enumerable.from(_criedtdetails)
    .where((w) => w.include === "Y")
    .toArray();
  if (listOfinclude.length > 0) {
    saveEnable = false;
  }

  $this.setState(
    {
      receipt_amount: receipt_amount,
      unbalanced_amount: receipt_amount,
      cash_amount: 0,
      write_off_amount: 0,
      include: include,
      criedtdetails: _criedtdetails,
      saveEnable: saveEnable,
    },
    updateCridetSettlement($this, context) // to calculate total receipt amount
  );
};

const onchangegridcol = ($this, context, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let _criedtdetails = $this.state.criedtdetails;

  let balance_amount = parseFloat(row.previous_balance) - parseFloat(value);
  balance_amount = isNaN(balance_amount) // check whether the number is NaN, trust me it's a thing
    ? row.previous_balance
    : balance_amount;

  if (balance_amount < 0) {
    swalMessage({
      title: "Receipt Amount cannot be greater than Previous Balance",
      type: "error",
    });
    row["balance_amount"] = row["previous_balance"];
    row[name] = 0;
  } else {
    row[name] = value;
    row["balance_amount"] = balance_amount;
  }

  for (let k = 0; k < _criedtdetails.length; k++) {
    if (_criedtdetails[k].bill_header_id === row.bill_header_id) {
      _criedtdetails[k] = row;
    }
  }

  $this.setState(
    {
      criedtdetails: _criedtdetails,
    },
    updateCridetSettlement($this, context) // calling update to calculate total of all receipt amounts
  );
};

export {
  writeOffhandle,
  updateCridetSettlement,
  includeHandler,
  onchangegridcol,
};
