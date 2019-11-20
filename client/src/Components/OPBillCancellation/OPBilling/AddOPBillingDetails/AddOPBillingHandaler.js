import { successfulMessage } from "../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

const serviceTypeHandeler = ($this, context, e) => {
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
};

const serviceHandeler = ($this, context, e) => {
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
  makeZero
};
