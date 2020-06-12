import moment from "moment";
// import { successfulMessage } from "../../../../../utils/GlobalFunctions";
import { swalMessage, algaehApiCall } from "../../../../../utils/algaehApiCall";
// import { debug } from "util";
// let texthandlerInterval = null;

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
  let serviceInput = {
    isReceipt: true,
    intCalculateall: false,

    cash_amount: parseFloat($this.state.cash_amount),
    card_amount: parseFloat($this.state.card_amount),
    cheque_amount: parseFloat($this.state.cheque_amount),
    receiveable_amount: parseFloat($this.state.receiveable_amount)
  };

  algaehApiCall({
    uri: "/billing/billingCalculations",
    module: "billing",
    method: "POST",
    data: serviceInput,
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        data.patient_payable_h =
          data.patient_payable || $this.state.patient_payable;
        data.sub_total = data.sub_total_amount || $this.state.sub_total;
        data.patient_responsibility =
          data.patient_res || $this.state.patient_responsibility;
        data.company_responsibility =
          data.company_res || $this.state.company_responsibility;

        data.company_payable =
          data.company_payble || $this.state.company_payable;
        data.sec_company_responsibility =
          data.sec_company_res || $this.state.sec_company_responsibility;
        data.sec_company_payable =
          data.sec_company_paybale || $this.state.sec_company_payable;

        data.copay_amount = data.copay_amount || $this.state.copay_amount;
        data.sec_copay_amount =
          data.sec_copay_amount || $this.state.sec_copay_amount;
        data.addItemButton = false;
        data.saveEnable = false;

        $this.setState({ ...data });
        if (context !== null) {
          context.updateState({ ...data });
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

  let cash_amount = parseFloat(e.target.value);
  let card_amount = parseFloat($this.state.card_amount);
  let cheque_amount = parseFloat($this.state.cheque_amount);
  let receiveable_amount = parseFloat($this.state.receiveable_amount);

  if (cash_amount + card_amount + cheque_amount > receiveable_amount) {
    swalMessage({
      title: "Sum of all amount to be equal to Receivable.",
      type: "warning"
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
    swalMessage({
      title: "Sum of all amount to be equal to Receivable.",
      type: "warning"
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

// const chequetexthandle = ($this, context, ctrl, e) => {
//   e = e || ctrl;

//   let cash_amount = parseFloat($this.state.cash_amount);
//   let card_amount = parseFloat($this.state.card_amount);
//   let cheque_amount = parseFloat(e.target.value);
//   let receiveable_amount = parseFloat($this.state.receiveable_amount);

//   if (cash_amount + card_amount + cheque_amount > receiveable_amount) {
//     swalMessage({
//       title: "Sum of all amount to be equal to Receivable.",
//       type: "warning"
//     });
//     $this.setState(
//       {
//         [e.target.name]: 0,
//         errorInCheck: true
//       },
//       () => {
//         $this.setState({ errorInCheck: false });
//       }
//     );
//   } else {
//     $this.setState(
//       {
//         [e.target.name]: e.target.value
//       },
//       () => {
//         calculateRecipt($this, context);
//       }
//     );

//     if (context !== null) {
//       context.updateState({ [e.target.name]: e.target.value });
//     }
//   }
// };

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
      calculateRecipt($this, context);
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
      calculateRecipt($this, context);
    }
  );

  if (context !== undefined) {
    context.updateState({
      Cardchecked: Cardchecked,
      card_amount: 0,
      card_check_number: null,
      expiry_date: null
    });
  }
};

// const checkcheckhandaler = ($this, context, e) => {
//   let Checkchecked = e.target.checked;
//   $this.setState(
//     {
//       Checkchecked: Checkchecked,
//       cheque_amount: 0,
//       cheque_number: null,
//       cheque_date: null
//     },
//     () => {
//       calculateRecipt($this, context);
//     }
//   );

//   if (context !== undefined) {
//     context.updateState({
//       Checkchecked: Checkchecked,
//       cheque_amount: 0,
//       cheque_number: null,
//       cheque_date: null
//     });
//   }
// };

export {
  texthandle,
  cashtexthandle,
  datehandle,
  cardtexthandle,
  // chequetexthandle,
  checkcashhandaler,
  checkcardhandaler,
  // checkcheckhandaler
};
