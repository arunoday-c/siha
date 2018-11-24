import moment from "moment";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../../../utils/algaehApiCall";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

let texthandlerInterval = null;

const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ [name]: value });
    }
    clearInterval(texthandlerInterval);
  }, 500);
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
    method: "POST",
    data: serviceInput,
    onSuccess: response => {
      if (response.data.success) {
        if (context != null) {
          context.updateState({ ...response.data.records });
        }
      }
      AlgaehLoader({ show: false });
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
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
      title: "Invalid Input. Sum of all amount to be equal to Receivable.",
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
    $this.setState({
      [e.target.name]: e.target.value
    });

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
    swalMessage({
      title: "Invalid Input. Sum of all amount to be equal to Receivable.",
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
    $this.setState({
      [e.target.name]: e.target.value
    });

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
    swalMessage({
      title: "Invalid Input. Sum of all amount to be equal to Receivable.",
      type: "warning"
    });
    $this.setState(
      {
        [e.target.name]: 0,
        errorInCheck: true
      },
      () => {
        $this.setState({ errorInCheck: false });
      }
    );
  } else {
    $this.setState({
      [e.target.name]: e.target.value
    });

    if (context != null) {
      context.updateState({ [e.target.name]: e.target.value });
    }
  }
};

const adjustadvance = ($this, context, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value > $this.state.advance_amount) {
    swalMessage({
      title:
        "Invalid Input. Adjusted amount cannot be greater than Advance amount",
      type: "warning"
    });
  } else {
    $this.setState({
      [e.target.name]: e.target.value
    });

    if (context != null) {
      context.updateState({
        [e.target.name]: e.target.value
      });
    }
  }
};

const discounthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let sheet_discount_percentage = 0;
  let sheet_discount_amount = 0;

  if (e.target.name === "sheet_discount_percentage") {
    sheet_discount_percentage = parseFloat(e.target.value);
    sheet_discount_amount = 0;
  } else {
    sheet_discount_amount = parseFloat(e.target.value);
    sheet_discount_percentage = 0;
  }
  if (sheet_discount_percentage > 100) {
    swalMessage({
      title: "Invalid Input. Discount % cannot be greater than 100.",
      type: "Warning"
    });
  } else {
    $this.setState({
      sheet_discount_percentage: sheet_discount_percentage,
      sheet_discount_amount: sheet_discount_amount
    });

    if (context != null) {
      context.updateState({
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      });
    }
  }
};

const billheaderCalculation = ($this, context) => {
  let serviceInput = {
    isReceipt: false,
    intCalculateall: false,
    sheet_discount_percentage: parseFloat(
      $this.state.sheet_discount_percentage
    ),
    sheet_discount_amount: parseFloat($this.state.sheet_discount_amount),
    advance_adjust: parseFloat($this.state.advance_adjust),
    gross_total: parseFloat($this.state.gross_total),
    credit_amount: parseFloat($this.state.credit_amount)
  };

  algaehApiCall({
    uri: "/billing/billingCalculations",
    method: "POST",
    data: serviceInput,
    onSuccess: response => {
      if (response.data.success) {
        if (context != null) {
          context.updateState({ ...response.data.records });
        }
      }
      AlgaehLoader({ show: false });
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
  // $this.props.billingCalculations({
  //   uri: "/billing/billingCalculations",
  //   method: "POST",
  //   data: serviceInput,
  //   redux: {
  //     type: "BILL_HEADER_GEN_GET_DATA",
  //     mappingName: "genbill"
  //   }
  // });
};

const datehandle = ($this, context, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });

  if (context != null) {
    context.updateState({ [e]: moment(ctrl)._d });
  }
};

const ProcessInsurance = ($this, context, ctrl, e) => {
  if (
    $this.state.insured === "Y" &&
    ($this.state.primary_insurance_provider_id == null ||
      $this.state.primary_network_office_id == null ||
      $this.state.primary_network_id == null)
  ) {
    swalMessage({
      title:
        "Invalid Input. Please select the primary insurance details properly.",
      type: "error"
    });
  } else if (
    $this.state.sec_insured === "Y" &&
    ($this.state.secondary_insurance_provider_id == null ||
      $this.state.secondary_network_office_id == null ||
      $this.state.secondary_network_id == null)
  ) {
    swalMessage({
      title:
        "Invalid Input. Please select the secondary insurance details properly.",
      type: "error"
    });
  } else {
    let serviceInput = [
      {
        insured: $this.state.insured,
        vat_applicable: $this.state.vat_applicable,
        hims_d_services_id: $this.state.hims_d_services_id,
        primary_insurance_provider_id:
          $this.state.primary_insurance_provider_id,
        primary_network_office_id: $this.state.primary_network_office_id,
        primary_network_id: $this.state.primary_network_id,
        sec_insured: $this.state.sec_insured,
        secondary_insurance_provider_id:
          $this.state.secondary_insurance_provider_id,
        secondary_network_id: $this.state.secondary_network_id,
        secondary_network_office_id: $this.state.secondary_network_office_id
      }
    ];

    algaehApiCall({
      uri: "/billing/getBillDetails",
      method: "POST",
      data: serviceInput,
      onSuccess: response => {
        if (response.data.success) {
          if (context != null) {
            context.updateState({ ...response.data.records });
          }

          algaehApiCall({
            uri: "/billing/billingCalculations",
            method: "POST",
            data: response.data.records,
            onSuccess: response => {
              if (response.data.success) {
                if (context != null) {
                  context.updateState({ ...response.data.records });
                }
              }
              AlgaehLoader({ show: false });
            },
            onFailure: error => {
              AlgaehLoader({ show: false });
              swalMessage({
                title: error.message,
                type: "error"
              });
            }
          });
        }
      },
      onFailure: error => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
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
      calculateRecipt($this, context);
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

const credittexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value > $this.state.net_amount) {
    swalMessage({
      title: "Invalid Input. Criedt amount cannot be greater than Net amount",
      type: "warning"
    });
  } else {
    $this.setState({
      [e.target.name]: e.target.value
    });

    if (context != null) {
      context.updateState({
        [e.target.name]: e.target.value
      });
    }
  }
};

const advanceAdjustCal = ($this, context, e) => {
  if (e.target.value !== e.target.oldvalue) {
    billheaderCalculation($this, context);
  }
};

const discountCal = ($this, context, e) => {
  if (e.target.value !== e.target.oldvalue) {
    billheaderCalculation($this, context);
  }
};

const credittextCal = ($this, context, e) => {
  if (e.target.value !== e.target.oldvalue) {
    billheaderCalculation($this, context);
  }
};

const cashtexthCal = ($this, context, e) => {
  if (e.target.value !== e.target.oldvalue) {
    calculateRecipt($this, context);
  }
};

const cardtexthCal = ($this, context, e) => {
  if (e.target.value !== e.target.oldvalue) {
    calculateRecipt($this, context);
  }
};

const chequetexthCal = ($this, context, e) => {
  if (e.target.value !== e.target.oldvalue) {
    calculateRecipt($this, context);
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

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ [name]: value });
    }
    clearInterval(texthandlerInterval);
  }, 500);
};

export {
  texthandle,
  datehandle,
  discounthandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle,
  adjustadvance,
  ProcessInsurance,
  checkcashhandaler,
  checkcardhandaler,
  checkcheckhandaler,
  credittexthandle,
  advanceAdjustCal,
  discountCal,
  credittextCal,
  cashtexthCal,
  cardtexthCal,
  chequetexthCal,
  countertexthandle
};
