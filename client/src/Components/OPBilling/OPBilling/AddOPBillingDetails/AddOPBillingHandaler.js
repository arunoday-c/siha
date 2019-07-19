import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import extend from "extend";

const serviceTypeHandeler = ($this, context, e) => {
  if (e.value === undefined) {
    $this.setState({
      [e]: null
    });
    if (context !== null) {
      context.updateState({ [e]: null });
    }
    $this.props.getServices({
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "opbilservices",
        data: []
      }
    });
  } else {
    $this.setState(
      {
        [e.name]: e.value
      },
      () => {
        $this.props.getServices({
          uri: "/serviceType/getService",
          module: "masterSettings",
          method: "GET",
          data: { service_type_id: $this.state.s_service_type },
          redux: {
            type: "SERVICES_GET_DATA",
            mappingName: "opbilservices"
          }
        });
      }
    );
    if (context !== null) {
      context.updateState({ [e.name]: e.value });
    }
  }
};

const serviceHandeler = ($this, context, e) => {
  if (e.value === undefined) {
    $this.setState({
      [e]: null,
      visittypeselect: true
    });
    if (context !== null) {
      context.updateState({ [e]: null });
    }
  } else {
    $this.setState(
      {
        [e.name]: e.value,
        visittypeselect: false
      },
      () => {}
    );
    if (context !== null) {
      context.updateState({ [e.name]: e.value });
    }
  }
};

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
  if (e.target.value === undefined) {
    if (context !== null) {
      context.updateState({
        [e.target.name]: ""
      });
    }
  } else {
    if (parseFloat(e.target.value) > 0) {
      if (parseFloat(e.target.value) > parseFloat($this.state.advance_amount)) {
        swalMessage({
          title: "Adjusted amount cannot be greater than Advance amount",
          type: "warning"
        });
      } else {
        $this.setState(
          {
            [e.target.name]: e.target.value
          },
          () => {
            billheaderCalculation($this, context);
          }
        );

        if (context !== null) {
          context.updateState({
            [e.target.name]: e.target.value
          });
        }
      }
    }
  }
};

const discounthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;

  if (e.target.value === undefined) {
    if (context !== null) {
      context.updateState({
        sheet_discount_percentage: "",
        sheet_discount_amount: ""
      });
    }
  } else {
    let sheet_discount_percentage = 0;
    let sheet_discount_amount = 0;

    if (e.target.name === "sheet_discount_percentage") {
      sheet_discount_percentage =
        e.target.value === "" ? "" : parseFloat(e.target.value);
      sheet_discount_amount = 0;
    } else {
      sheet_discount_amount =
        e.target.value === "" ? "" : parseFloat(e.target.value);
      sheet_discount_percentage = 0;
    }
    if (sheet_discount_percentage > 100) {
      swalMessage({
        title: "Discount % cannot be greater than 100.",
        type: "Warning"
      });
      $this.setState({
        sheet_discount_percentage: $this.state.sheet_discount_percentage
      });

      if (context !== null) {
        context.updateState({
          sheet_discount_percentage: $this.state.sheet_discount_percentage
        });
      }
    } else if (
      sheet_discount_amount > parseFloat($this.state.patient_payable)
    ) {
      swalMessage({
        title: "Discount Amount cannot be greater than Patient Share.",
        type: "Warning"
      });
      $this.setState(
        {
          sheet_discount_amount: $this.state.sheet_discount_amount
        },
        () => {
          billheaderCalculation($this, context);
        }
      );

      if (context !== null) {
        context.updateState({
          sheet_discount_amount: $this.state.sheet_discount_amount
        });
      }
    } else {
      $this.setState(
        {
          sheet_discount_percentage: sheet_discount_percentage,
          sheet_discount_amount: sheet_discount_amount
        },
        () => {
          billheaderCalculation($this, context);
        }
      );

      if (context !== null) {
        context.updateState({
          sheet_discount_percentage: sheet_discount_percentage,
          sheet_discount_amount: sheet_discount_amount
        });
      }
    }
  }
};

const billheaderCalculation = ($this, context, e) => {
  let serviceInput = {
    isReceipt: false,
    intCalculateall: false,
    sheet_discount_percentage:
      $this.state.sheet_discount_percentage === ""
        ? 0
        : parseFloat($this.state.sheet_discount_percentage),
    sheet_discount_amount:
      $this.state.sheet_discount_amount === ""
        ? 0
        : parseFloat($this.state.sheet_discount_amount),
    advance_adjust: parseFloat($this.state.advance_adjust),
    gross_total: parseFloat($this.state.gross_total),
    credit_amount:
      $this.state.credit_amount === ""
        ? 0
        : parseFloat($this.state.credit_amount)
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

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

const ondiscountgridcol = ($this, context, row, e) => {
  debugger;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let oldvalue = e.oldvalue || e.target.oldvalue;
  let billdetails = $this.state.billdetails;
  let _index = billdetails.indexOf(row);
  if (value === undefined) {
    row["discount_percentage"] = "";
    row["discount_amout"] = "";
    billdetails[_index] = row;
    $this.setState({ billdetails: billdetails });
    return;
  }

  if (name === "discount_percentage") {
    if (parseFloat(value) > 100) {
      swalMessage({
        title: "Discount % cannot be greater than 100.",
        type: "warning"
      });
      row[name] = oldvalue;
      billdetails[_index] = row;
      $this.setState({ billdetails: billdetails });
      return;
    }
    if (parseFloat(value) < 0) {
      swalMessage({
        title: "Discount % cannot be less than Zero",
        type: "warning"
      });
      row[name] = oldvalue;
      billdetails[_index] = row;
      $this.setState({ billdetails: billdetails });
      return;
    }
  } else if (name === "discount_amout") {
    if (parseFloat(row.gross_amount) < parseFloat(value)) {
      swalMessage({
        title: "Discount Amount cannot be greater than Gross Amount.",
        type: "warning"
      });
      row[name] = oldvalue;
      billdetails[_index] = row;
      $this.setState({ billdetails: billdetails });
      return;
    }
    if (parseFloat(value) < 0) {
      swalMessage({
        title: "Discount Amount cannot be less than Zero",
        type: "warning"
      });
      row[name] = oldvalue;
      billdetails[_index] = row;
      $this.setState({ billdetails: billdetails });
      return;
    }
  }
  row[name] = value;
  // row.update();
  calculateAmount($this, context, row, e);
};

const onquantitycol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let oldvalue = e.oldvalue || e.target.oldvalue;
  if (value < 0) {
    swalMessage({
      title: "Quantity cannot be less than zero.",
      type: "warning"
    });
    row[name] = oldvalue;
    row.update();
  } else {
    row[name] = value;
    row.update();
  }
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
      swalMessage({
        title: "Criedt amount cannot be greater than Net amount",
        type: "warning"
      });
      $this.setState({
        [e.target.name]: $this.state.credit_amount
      });

      if (context !== null) {
        context.updateState({
          [e.target.name]: $this.state.credit_amount
        });
      }
    } else {
      // let balance_credit = $this.state.receiveable_amount - e.target.value;
      $this.setState(
        {
          [e.target.name]: e.target.value
        },
        () => {
          billheaderCalculation($this, context, e);
        }
      );

      if (context !== null) {
        context.updateState({
          [e.target.name]: e.target.value,
          balance_credit: e.target.value === "" ? 0 : e.target.value
        });
      }
    }
  }
};

const credittextCal = ($this, e) => {
  // if (e.target.value !== e.target.oldvalue) {
  billheaderCalculation($this);
  // }
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

const calculateAmount = ($this, context, row, e) => {
  // e = e || ctrl;

  if (e.target.value !== e.target.oldvalue) {
    let billdetails = $this.state.billdetails;

    row[e.target.name] = parseFloat(e.target.value === "" ? 0 : e.target.value);
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
        primary_network_office_id:
          $this.state.hims_d_insurance_network_office_id,
        primary_network_id: $this.state.network_id,
        sec_insured: $this.state.sec_insured,
        secondary_insurance_provider_id:
          $this.state.secondary_insurance_provider_id,
        secondary_network_id: $this.state.secondary_network_id,
        secondary_network_office_id: $this.state.secondary_network_office_id
      }
    ];

    algaehApiCall({
      uri: "/billing/getBillDetails",
      module: "billing",
      method: "POST",
      data: inputParam,
      onSuccess: response => {
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
              onSuccess: response => {
                if (response.data.success) {
                  response.data.records.patient_payable_h =
                    response.data.records.patient_payable ||
                    this.state.patient_payable;
                  response.data.records.saveEnable = false;
                  response.data.records.addNewService = false;
                  if (context !== null) {
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
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
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

const makeDiscountZero = ($this, context, e) => {
  if (e.target.value === "") {
    if (context !== null) {
      context.updateState({
        sheet_discount_percentage: 0,
        sheet_discount_amount: 0
      });
    }
  }
};

const makeZeroIngrid = ($this, context, row, e) => {
  debugger;
  if (e.target.value === "") {
    row["discount_amout"] = 0;
    row["discount_percentage"] = 0;
    let billdetails = $this.state.billdetails;
    let _index = billdetails.indexOf(row);
    billdetails[_index] = row;
    context.updateState({
      billdetails: billdetails
    });
  }
};

export {
  serviceTypeHandeler,
  serviceHandeler,
  texthandle,
  discounthandle,
  adjustadvance,
  billheaderCalculation,
  onchangegridcol,
  credittexthandle,
  credittextCal,
  EditGrid,
  CancelGrid,
  onquantitycol,
  ondiscountgridcol,
  calculateAmount,
  makeZero,
  makeDiscountZero,
  makeZeroIngrid
};
