import { swalMessage } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";

const writeOffhandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let recievable_amount =
    parseFloat($this.state.reciept_amount) - parseFloat(e.target.value);
  $this.setState({
    [e.target.name]: e.target.value,
    recievable_amount: recievable_amount
  });
  if (context !== null) {
    context.updateState({
      [e.target.name]: e.target.value,
      recievable_amount: recievable_amount,
      cash_amount: recievable_amount
    });
  }
};

const EditGrid = ($this, context) => {
  let saveEnable = true;

  if ($this.state.hims_f_pos_credit_header_id !== null) {
    saveEnable = true;
  }
  if (context !== null) {
    context.updateState({
      saveEnable: saveEnable
    });
  }
};

const CancelGrid = ($this, context, cancelRow) => {
  let saveEnable = false;

  if ($this.state.hims_f_pos_credit_header_id !== null) {
    saveEnable = true;
  }
  if (context !== null) {
    let _criedtdetails = $this.state.criedtdetails;
    if (cancelRow !== undefined) {
      _criedtdetails[cancelRow.rowIdx] = cancelRow;
    }
    context.updateState({
      saveEnable: saveEnable,

      criedtdetails: _criedtdetails
    });
  }
};

const deleteCridetSettlement = ($this, context) => {
  let saveEnable = true;

  let reciept_amount = Enumerable.from($this.state.criedtdetails).sum(w =>
    parseFloat(w.receipt_amount)
  );

  if ($this.state.hims_f_pos_credit_header_id !== null) {
    saveEnable = true;
  }
  if (context !== null) {
    context.updateState({
      saveEnable: saveEnable,
      reciept_amount: reciept_amount,
      write_off_amount: 0,
      recievable_amount: reciept_amount,
      cash_amount: reciept_amount
    });
  }
};

const updateCridetSettlement = ($this, context) => {
  let saveEnable = false;

  let reciept_amount = Enumerable.from($this.state.criedtdetails).sum(w =>
    parseFloat(w.receipt_amount)
  );

  if ($this.state.hims_f_pos_credit_header_id !== null) {
    saveEnable = true;
  }
  if (context !== null) {
    context.updateState({
      saveEnable: saveEnable,
      reciept_amount: reciept_amount,
      write_off_amount: 0,
      recievable_amount: reciept_amount,
      cash_amount: reciept_amount
    });
  }
};

const includeHandler = ($this, context, row, e) => {
  let _criedtdetails = $this.state.criedtdetails;
  let reciept_amount = 0;
  let include = "Y";
  let saveEnable = true;
  if (e.target.checked === true) {
    row["receipt_amount"] = row["previous_balance"];
    row["balance_amount"] = 0;
    reciept_amount =
      row["receipt_amount"] + parseFloat($this.state.reciept_amount);
    row["include"] = "Y";
  } else if (e.target.checked === false) {
    reciept_amount =
      parseFloat($this.state.reciept_amount) - row["receipt_amount"];
    row["receipt_amount"] = 0;
    row["balance_amount"] = row["previous_balance"];

    row["include"] = "N";
  }
  //   row.update();

  for (let k = 0; k < _criedtdetails.length; k++) {
    if (_criedtdetails[k].bill_header_id === row.bill_header_id) {
      _criedtdetails[k] = row;
    }
  }

  let listOfinclude = Enumerable.from(_criedtdetails)
    .where(w => w.include === "Y")
    .toArray();
  if (listOfinclude.length > 0) {
    saveEnable = false;
  }

  if (context !== null) {
    context.updateState({
      reciept_amount: reciept_amount,
      write_off_amount: 0,
      recievable_amount: reciept_amount,
      cash_amount: reciept_amount,
      include: include,
      criedtdetails: _criedtdetails,
      saveEnable: saveEnable
    });
  }
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if ($this.state.previous_balance > value) {
    swalMessage({
      title: "Receipt Amount cannot be greater than Previous Balance",
      type: "error"
    });
  } else {
    let balance_amount = parseFloat(row.previous_balance) - parseFloat(value);
    row[name] = value;
    row["balance_amount"] = balance_amount;
    row.update();
  }
};

export {
  writeOffhandle,
  EditGrid,
  CancelGrid,
  deleteCridetSettlement,
  updateCridetSettlement,
  includeHandler,
  onchangegridcol
};
