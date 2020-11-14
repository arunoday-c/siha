import { successfulMessage } from "../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import extend from "extend";

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

//New
const adjustadvance = ($this, context, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value > 0) {
    if (e.target.value > $this.state.advance_amount) {
      successfulMessage({
        message: "Adjusted amount cannot be greater than Advance amount",
        title: "Warning",
        icon: "warning"
      });
    } else {
      $this.setState({
        [e.target.name]: e.target.value
      });

      if (context !== null) {
        context.updateState({
          [e.target.name]: e.target.value
        });
      }
    }
  }
};

const discounthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  let sheet_discount_percentage = 0;
  let sheet_discount_amount = 0;

  if (e.target.name === "sheet_discount_percentage") {
    sheet_discount_percentage = parseFloat(e.target.value.replace(" %", ""));
    sheet_discount_amount = 0;
  } else {
    sheet_discount_amount = parseFloat(e.target.value);
    sheet_discount_percentage = 0;
  }
  if (sheet_discount_percentage > 100) {
    successfulMessage({
      message: "Discount % cannot be greater than 100.",
      title: "Warning",
      icon: "warning"
    });
  } else {
    $this.setState({
      sheet_discount_percentage: sheet_discount_percentage,
      sheet_discount_amount: sheet_discount_amount
    });

    if (context !== null) {
      context.updateState({
        sheet_discount_percentage: sheet_discount_percentage,
        sheet_discount_amount: sheet_discount_amount
      });
    }
  }
};

const billheaderCalculation = ($this, context, e) => {
  if (e.target.value !== e.target.oldvalue) {
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

    // $this.props.billingCalculations({
    //   uri: "/billing/billingCalculations",
    //   method: "POST",
    //   data: serviceInput,
    //   redux: {
    //     type: "BILL_HEADER_GEN_GET_DATA",
    //     mappingName: "genbill"
    //   }
    // });
  }
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

const credittexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  if (e.target.value === undefined) {
    if (context !== null) {
      context.updateState({
        sheet_discount_percentage: "",
        sheet_discount_amount: ""
      });
    }
  } else {
    if (parseFloat(e.target.value) > parseFloat($this.state.net_amount)) {
      successfulMessage({
        message: "Credit amount cannot be greater than Net amount",
        title: "Warning",
        icon: "warning"
      });
    } else {
      $this.setState(
        {
          [e.target.name]: e.target.value
        },
        () => {
          credittextCal($this, e);
        }
      );

      if (context !== null) {
        context.updateState({
          [e.target.name]: e.target.value
        });
      }
    }
  }
};

const credittextCal = ($this, e) => {
  if (e.target.value !== e.target.oldvalue) {
    billheaderCalculation($this);
  }
};

const EditGrid = ($this, context, cancelRow) => {
  let saveEnable = true;
  let addNewService = true;
  if ($this.state.hims_f_billing_header_id !== null) {
    saveEnable = true;
    addNewService = true;
  }
  if (context !== null) {
    let _billdetails = $this.state.billdetails;
    if (cancelRow !== undefined) {
      _billdetails[cancelRow.rowIdx] = cancelRow;
    }
    context.updateState({
      saveEnable: saveEnable,
      addNewService: addNewService,
      billdetails: _billdetails
    });
  }
};

const CancelGrid = ($this, context, cancelRow) => {
  let saveEnable = false;
  let addNewService = false;
  if ($this.state.hims_f_billing_header_id !== null) {
    saveEnable = true;
    addNewService = true;
  }
  if (context !== null) {
    let _billdetails = $this.state.billdetails;
    if (cancelRow !== undefined) {
      _billdetails[cancelRow.rowIdx] = cancelRow;
    }
    context.updateState({
      saveEnable: saveEnable,
      addNewService: addNewService,
      billdetails: _billdetails
    });
  }
};

const makeZero = ($this, context, e) => {
  if (e.target.value === "") {
    if (context !== null) {
      context.updateState({
        [e.target.name]: 0
      });
    }
  }
};

const ondiscountgridcol = ($this, context, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let billdetails = $this.state.billdetails;
  let _index = billdetails.indexOf(row);

  if (name === "discount_percentage") {
    if (parseFloat(value) > 100) {
      row[name] = 0;
      row["discount_amout"] = 0;
      billdetails[_index] = row;
      $this.setState({ billdetails: billdetails });
      swalMessage({
        title: "Discount % cannot be greater than 100.",
        type: "warning",
      });
      // return;
    } else if (
      parseFloat(value) > parseFloat($this.state.service_dis_percentage)
    ) {
      row[name] = 0;
      row["discount_amout"] = 0;
      billdetails[_index] = row;
      $this.setState({ billdetails: billdetails });
      swalMessage({
        title:
          "You dont have privilage to give discount More than." +
          $this.state.service_dis_percentage,
        type: "warning",
      });
    } else if (parseFloat(value) < 0) {
      row[name] = 0;
      row["discount_amout"] = 0;
      billdetails[_index] = row;
      $this.setState({ billdetails: billdetails });
      swalMessage({
        title: "Discount % cannot be less than Zero",
        type: "warning",
      });
      // return;
    } else {
      row[name] = value;
    }
  } else if (name === "discount_amout") {
    if (parseFloat(row.gross_amount) < parseFloat(value)) {
      row[name] = 0;
      row["discount_percentage"] = 0;
      billdetails[_index] = row;
      $this.setState({ billdetails: billdetails });
      swalMessage({
        title: "Discount Amount cannot be greater than Gross Amount.",
        type: "warning",
      });
      // return;
    } else if (parseFloat(value) < 0) {
      row[name] = 0;
      row["discount_percentage"] = 0;
      billdetails[_index] = row;
      $this.setState({ billdetails: billdetails });
      swalMessage({
        title: "Discount Amount cannot be less than Zero",
        type: "warning",
      });

    } else {
      row[name] = value;
    }
  }

  calculateAmount($this, context, row, e);
};

const calculateAmount = ($this, context, row, e) => {
  // e = e || ctrl;

  // if (e.target.value !== e.target.oldvalue) {
  let billdetails = $this.state.billdetails;

  debugger
  // row[e.target.name] = parseFloat(e.target.value === "" ? 0 : e.target.value);
  let inputParam = [
    {
      hims_d_services_id: row.services_id,
      vat_applicable: $this.state.vat_applicable,
      quantity: row.quantity,
      discount_amout:
        e.target.name === "discount_percentage" ? 0 : row.discount_amout,
      discount_percentage:
        e.target.name === "discount_amout" ? 0 : row.discount_percentage,

      insured: $this.state.insured,
      primary_insurance_provider_id: $this.state.insurance_provider_id,
      primary_network_office_id: $this.state.hims_d_insurance_network_office_id,
      primary_network_id: $this.state.network_id,
      sec_insured: $this.state.sec_insured,
      secondary_insurance_provider_id:
        $this.state.secondary_insurance_provider_id,
      secondary_network_id: $this.state.secondary_network_id,
      secondary_network_office_id: $this.state.secondary_network_office_id,
    },
  ];

  algaehApiCall({
    uri: "/billing/getBillDetails",
    module: "billing",
    method: "POST",
    data: inputParam,
    onSuccess: (response) => {
      if (response.data.success) {
        let data = response.data.records;

        extend(row, data.billdetails[0]);

        billdetails[row.rowIdx] = row;
        $this.setState({ billdetails: billdetails }, () => {
          algaehApiCall({
            uri: "/billing/billingCalculations",
            module: "billing",
            method: "POST",
            data: { billdetails: $this.state.billdetails },
            onSuccess: (response) => {
              if (response.data.success) {
                debugger
                response.data.records.patient_payable_h =
                  response.data.records.patient_payable === 0
                    ? response.data.records.patient_payable
                    : $this.state.patient_payable;
                response.data.records.saveEnable = false;
                response.data.records.addNewService = false;

                if ($this.state.default_pay_type === "CD") {
                  response.data.records.card_amount =
                    response.data.records.receiveable_amount;
                  response.data.records.cash_amount = 0;
                }
                if (context !== null) {
                  context.updateState({ ...response.data.records });
                }
              }
            },
            onFailure: (error) => {
              swalMessage({
                title: error.message,
                type: "error",
              });
            },
          });
        });
      }
    },
    onFailure: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};

const makeZeroIngrid = ($this, context, row, e) => {
  if (e.target.value === "") {
    row["discount_amout"] = 0;
    row["discount_percentage"] = 0;
    let billdetails = $this.state.billdetails;
    let _index = billdetails.indexOf(row);
    billdetails[_index] = row;
    context.updateState({
      billdetails: billdetails,
    });
  }
};

export {
  texthandle,
  discounthandle,
  adjustadvance,
  billheaderCalculation,
  onchangegridcol,
  credittexthandle,
  credittextCal,
  EditGrid,
  CancelGrid,
  makeZero,
  ondiscountgridcol,
  makeZeroIngrid
};
