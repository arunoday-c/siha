import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import "./day_end_prc.scss";

import {
  // AlgaehDataGrid,
  AlgaehLabel,
  // AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDateHandler,
  // AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import {
  AlgaehTable,
  MainContext,
  Modal,
  AlgaehButton,
  Tooltip,
  persistStateOnBack,
  persistStageOnGet,
  persistStorageOnRemove,
  AlgaehAutoComplete,
} from "algaeh-react-components";
import swal from "sweetalert2";
import TransationDetails from "./TransationDetails";
// const modules = [
//   {
//     name: "OP Bill",
//     value: "5",

//     trans_type: [
//       { name: "Bill", value: "BL0001" },
//       { name: "Advance", value: "FD0002" },
//       { name: "Refund", value: "FD0002" },
//       { name: "Cancel", value: "BL0003" },
//       { name: "Credit", value: "BL0004" },
//     ],
//   },
//   {
//     name: "Pharmacy",
//     value: "10",
//     trans_type: [
//       { name: "Receipt", value: "PR0004" },
//       { name: "Purchase Return", value: "PR0006" },
//       { name: "POS", value: "PH0002" },
//       { name: "Sales Return", value: "PH0003" },
//       { name: "Transfer", value: "PH0012" },
//       { name: "Adjustment", value: "PH0014" },
//       { name: "Credit Settlement", value: "PH0010" },
//       { name: "Consumption", value: "PH0011" },
//     ],
//   },
//   {
//     name: "Inventory",
//     value: "11",
//     trans_type: [
//       { name: "Receipt", value: "PR0004" },
//       { name: "Sales Invoice", value: "SAL005" },
//       { name: "Sales Return", value: "SAL008" },
//       { name: "Purchase Return", value: "PR0006" },
//       { name: "Transfer", value: "INV0009" },
//       { name: "Adjustment", value: "INV0010" },
//       { name: "Consumption", value: "INV0007" },
//     ],
//   },
//   {
//     name: "Insurance",
//     value: "9",
//     trans_type: [
//       { name: "Invoice", value: "51" },
//       { name: "Receipt", value: "52" },
//       { name: "Adjustment", value: "53" },
//       { name: "Resubmission", value: "54" },
//     ],
//   },
//   {
//     name: "Payroll",
//     value: "27",
//     trans_type: [
//       { name: "Payroll Workbench", value: "PYRLWB" },
//       { name: "Salary Management", value: "SALARY_MANAGE" },
//     ],
//   },
// ];
let dataPayment = [
  { value: "journal", label: "Journal" },
  { label: "Contra", value: "contra" },
  { value: "receipt", label: "Receipt" },
  { label: "Payment", value: "payment" },
  { value: "sales", label: "Sales" },
  { label: "Purchase", value: "purchase" },
  {
    value: "credit_note",
    label: "Credit Note",
  },
  { value: "debit_note", label: "Debit Note" },
  { value: "expense_voucher", label: "Expense Voucher" },
];
class DayEndProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trans_type: [],
      dayEnd: [],
      from_date: undefined,
      to_date: undefined,
      openPopup: false,
      popUpRecords: {},
      posted: "N",
      module_id: null,
      screen_code: null,
      persistence: null,
      revert_trans: "N",
      voucherType: null,
      voucher_list: null,
      transType: "PN",
    };
    this.selectedDayEndIds = "";
  }

  static contextType = MainContext;
  componentDidMount() {
    (async () => {
      const records = await persistStageOnGet();

      if (records) {
        this.setState({ ...records });
        persistStorageOnRemove();
      } else {
        const userToken = this.context.userToken;

        const { decimal_places, symbol_position, currency_symbol } = userToken;
        const currency = {
          decimal_places,
          addSymbol: false,
          symbol_position,
          currency_symbol,
        };

        const params = new URLSearchParams(this.props.location?.search);
        if (params?.get("from_date")) {
          this.setState({
            from_date: moment(params?.get("from_date"))._d, //,params?.get("from_date"),
          });
        }
        if (params?.get("to_date")) {
          this.setState(
            {
              to_date: moment(params?.get("to_date"))._d, //params?.get("to_date"),
              currency: currency,
              revert_trans: params?.get("revert_trans"),
              posted: params?.get("posted"),
            },
            () => this.getDayEndProcess(this)
          );
        }

        // const currency = {
        //   decimal_places,
        //   addSymbol: false,
        //   symbol_position,
        //   currency_symbol,
        // };
        // const params = new URLSearchParams(this.props.location?.search);

        // if (params?.get("from_date")) {
        //   this.setState({
        //     from_date: moment(params?.get("from_date"))._d, //,params?.get("from_date"),
        //   });
        // }
        // if (params?.get("to_date")) {
        //   this.setState(
        //     {
        //       to_date: moment(params?.get("to_date"))._d, //params?.get("to_date"),
        //       currency: currency,
        //     },
        //     () => this.getDayEndProcess(this)
        //   );
        // }

        if (this.props.location.state) {
          // debugger;
          algaehApiCall({
            uri: "/finance/getDayEndData",
            data: {
              child_id: this.props.location.state.data.finance_account_child_id,
            },
            method: "GET",
            module: "finance",
            onSuccess: (response) => {
              this.setState({ dayEnd: response.data.result });
            },
            onCatch: (error) => {
              swalMessage({ title: error, type: "error" });
            },
          });
        }
      }
    })();
  }

  getDayEndProcess() {
    try {
      // let inputObj = { posted: this.state.posted };
      // debugger;
      let inputObj = {
        posted: this.state.transType === "PY" ? "Y" : "N",
        revert_trans: this.state.transType === "RT" ? "Y" : "N",
      };
      if (this.state.screen_code !== null) {
        inputObj.screen_code = this.state.screen_code;
      }
      if (this.state.module_id !== null) {
        inputObj.module_id = this.state.module_id;
      }
      if (this.state.from_date !== null) {
        inputObj.from_date = this.state.from_date;
      }
      if (this.state.to_date !== null) {
        inputObj.to_date = this.state.to_date;
      }
      if (this.state.voucherType) {
        inputObj.voucherType = this.state.voucherType;
      }

      algaehApiCall({
        uri: "/finance/getDayEndData",
        data: inputObj,
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          // debugger;
          const result_data = response.data.result;
          this.setState({
            dayEnd: result_data, //.length > 0 ? result_data : [{}],
            revert_visible: false,
          });
          return this.props.history?.push(
            `${this.props.location?.pathname}?from_date=${this.state.from_date}&to_date=${this.state.to_date}&revert_trans=${this.state.revert_trans}&posted=${this.state.posted}`
          );
        },
        onCatch: (error) => {
          swalMessage({ title: error, type: "error" });
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  postDayEndProcess(finance_day_end_header_id) {
    swal({
      title: "Are you sure you want to Post ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willPost) => {
      if (willPost.value) {
        try {
          if (finance_day_end_header_id !== undefined) {
            algaehApiCall({
              uri: "/finance/postDayEndData",
              data: { finance_day_end_header_id: finance_day_end_header_id },
              method: "POST",
              module: "finance",
              onSuccess: (response) => {
                swalMessage({ type: "success", title: "Successfully Posted" });
                this.getDayEndProcess();
              },
              onCatch: (error) => {
                swalMessage({ title: error, type: "error" });
              },
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  }

  bulkProcess() {
    const sortedList = this.state.dayEnd.filter((f) => f.checked === true);

    if (sortedList.length === 0) {
      swalMessage({
        title: "Select atleast one record to proceed",
        type: "error",
      });
      return;
    }
    const settings = { header: undefined, footer: undefined };

    swal({
      title: "Are you sure you want to Processed ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willProcess) => {
      if (willProcess.value) {
        algaehApiCall({
          uri: "/finance/bulkPosttoFinance",
          skipParse: true,
          data: Buffer.from(
            JSON.stringify({ day_end_list: sortedList }),
            "utf8"
          ),
          module: "finance",
          method: "POST",
          header: {
            "content-type": "application/octet-stream",
            ...settings,
          },

          // uri: "/finance/bulkPosttoFinance",
          // module: "finance",
          // data: { day_end_list: sortedList },
          // method: "PUT",
          onSuccess: (response) => {
            swalMessage({ type: "success", title: "Successfully Posted" });
            this.getDayEndProcess();
          },
          onFailure: (error) => {
            swalMessage({
              title: error.message,
              type: "error",
            });
          },
        });
      }
    });
  }

  RejectProcess() {
    let selected_data = this.state.selected_data;

    swal({
      title:
        "Are you sure you want to Revert " +
        selected_data.document_number +
        " ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willProcess) => {
      if (willProcess.value) {
        algaehApiCall({
          uri: "/finance/revertDayEnd",
          module: "finance",
          data: {
            finance_day_end_header_id: selected_data.finance_day_end_header_id,
            from_screen: selected_data.from_screen,
            document_number: selected_data.document_number,
            revert_reason: this.state.revert_reason,
          },
          method: "PUT",
          onSuccess: (response) => {
            const details = response.data.notificationDetails;
            if (details) {
              const { sales_order_number, sales_person_id } = details;
              if (this.context.socket.connected) {
                this.context.socket.emit("sales_revet", {
                  sales_order_number,
                  sales_person_id,
                });
              }
            }

            this.getDayEndProcess(this);
            swalMessage({
              title: "Reverted Successfully . .",
              type: "success",
            });
          },
          onFailure: (error) => {
            swalMessage({
              title: error.message,
              type: "error",
            });
          },
        });
      }
    });
  }

  checkHandaler(e) {
    switch (e.target.name) {
      case "revert_trans":
        this.setState({
          [e.target.name]: e.target.checked ? "Y" : "N",
          dayEnd: [],
          from_date: undefined,
          to_date: undefined,
          posted: "N",
        });
        break;
      case "transType":
        this.setState({
          [e.target.name]: e.target.value,
          dayEnd: [],
        });
        break;
      default:
        this.setState({
          [e.target.name]: e.target.checked ? "Y" : "N",
          dayEnd: [],
        });
        break;
    }
  }

  dropDownHandle(value) {
    switch (value.name) {
      case "module_id":
        this.setState({
          trans_type: value.selected.trans_type,
          [value.name]: value.value,
        });
        break;
      default:
        this.setState({
          [value.name]: value.value,
        });
        break;
    }
  }
  DrillDownScree(row) {
    persistStateOnBack(this.state, true);
    debugger;
    if (row.from_screen !== undefined) {
      if (
        row.from_screen === "FD0002" ||
        row.from_screen === "BL0001" ||
        row.from_screen === "BL0002"
      ) {
        // Billing
        this.props.history.push(`/OPBilling?bill_code=${row.document_number}`);
      } else if (row.from_screen === "BL0003") {
        // Billing
        this.props.history.push(
          `/OPBillCancellation?bill_cancel_number=${row.document_number}`
        );
      } else if (
        row.from_screen === "INV0009" ||
        row.from_screen === "INV0006"
      ) {
        // Inventory Transfer
        this.props.history.push(
          `/InvTransferEntry?transfer_number=${row.document_number}`
        );
      } else if (row.from_screen === "INV0011") {
        // Inventory Consumorion
        this.props.history.push(
          `/InvConsumptionCancel?can_consumption_number=${row.document_number}`
        );
      } else if (row.from_screen === "INV0007") {
        this.props.history.push(
          `/InvConsumptionEntry?consumption_number=${row.document_number}`
        );
      } else if (row.from_screen === "SAL005") {
        // Sales Invoice
        this.props.history.push(
          `/SalesInvoice?invoice_number=${row.document_number}&finance_day_end_header_id=${row.finance_day_end_header_id}`
        );
      } else if (row.from_screen === "SAL008") {
        //Sales Return
        this.props.history.push(
          `/SalesReturnEntry?sales_return_number=${row.document_number}`
        );
      } else if (row.from_screen === "PR0003") {
        // Delivery Note
        this.props.history.push(
          `/DeliveryNoteEntry?delivery_note_number=${row.document_number}`
        );
      } else if (row.from_screen === "PR0004") {
        //Receipt Entry
        this.props.history.push(
          `/ReceiptEntry?grn_number=${row.document_number}&finance_day_end_header_id=${row.finance_day_end_header_id}`
        );
      } else if (row.from_screen === "PR0006") {
        //Purchase Return
        this.props.history.push(
          `/PurchaseReturnEntry?purchase_return_number=${row.document_number}`
        );
      } else if (row.from_screen === "PH0002") {
        //Point of Sales
        this.props.history.push(
          `/PointOfSale?pos_number=${row.document_number}`
        );
      } else if (row.from_screen === "PH0003") {
        //Point of Sales Return
        this.props.history.push(
          `/SalesReturn?sales_return_number=${row.document_number}`
        );
      }
    }
  }
  onOpenPreviewPopUP(row, that) {
    try {
      if (row.finance_day_end_header_id !== undefined) {
        algaehApiCall({
          uri: "/finance/previewDayEndEntries",
          data: {
            day_end_header_id: row.finance_day_end_header_id,
            revert_trans: this.state.revert_trans,
          },
          method: "GET",
          module: "finance",
          onSuccess: (response) => {
            const { result, success, message } = response.data;
            if (success === true) {
              that.setState({
                popUpRecords: result,
                openPopup: true,
                finance_day_end_header_id: row.finance_day_end_header_id,
                narration: row.narration,
              });
            } else {
              that.setState({ popUpRecords: {}, openPopup: false });
              swalMessage({ title: message, type: "error" });
            }
          },
          onCatch: (error) => {
            swalMessage({ title: error, type: "error" });
          },
        });
      }
    } catch (e) {
      swalMessage({ title: e, type: "error" });
      console.error(e);
    }
  }

  dateValidate(value, event) {
    if (event.target.name === "from_date" && this.state.to_date !== undefined) {
      let inRange = moment(value).isBefore(
        moment(this.state.to_date).format("YYYY-MM-DD")
      );
      if (inRange) {
        swalMessage({
          title: "From Date cannot be grater than To Date.",
          type: "warning",
        });
        event.target.focus();
        this.setState({
          [event.target.name]: null,
        });
      }
    } else if (event.target.name === "to_date") {
      if (this.state.from_date === undefined || this.state.from_date === null) {
        swalMessage({
          title: "Select From Date.",
          type: "warning",
        });
        this.setState({
          [event.target.name]: null,
        });
        return;
      }
      let inRange = moment(value).isBefore(
        moment(this.state.from_date).format("YYYY-MM-DD")
      );
      if (inRange) {
        swalMessage({
          title: "To Date cannot be less than From Date.",
          type: "warning",
        });
        event.target.focus();
        this.setState({
          [event.target.name]: null,
        });
      }
    }
  }

  CloseTransationDetail(e) {
    this.setState(
      {
        openPopup: false,
        popUpRecords: {},
        finance_day_end_header_id: null,
      },
      () => {
        this.getDayEndProcess(this);
      }
    );
  }

  ClearData() {
    this.setState({
      dayEnd: [],
      from_date: undefined,
      to_date: undefined,
      openPopup: false,
      posted: "N",
      module_id: null,
      screen_code: null,
      revert_trans: "N",
      voucherType: null,
      voucher_list: null,
    });
    return this.props.history?.push(this.props.location?.pathname);
  }

  onChageCheckSelectAll(e) {
    const staus = e.target.checked;
    const myState = this.state.dayEnd.map((f) => {
      return { ...f, checked: staus };
    });

    const hasProcessed = myState.find((f) => f.salary_processed === "Y");
    if (hasProcessed !== undefined && staus === true) {
      this.allChecked.indeterminate = true;
    } else {
      this.allChecked.indeterminate = false;
    }
    this.setState({
      dayEnd: myState,
      selectAll:
        hasProcessed !== undefined
          ? "INDETERMINATE"
          : staus === true
          ? "CHECK"
          : "UNCHECK",
    });
  }

  onCheckChangeRow(row, e) {
    const status = e.target.checked;
    // const currentRow = row;
    row.checked = status;
    const records = this.state.dayEnd;
    const hasUncheck = records.filter((f) => {
      return f.checked === undefined || f.checked === false;
    });
    const hasProceesed = hasUncheck.find((f) => f.salary_processed === "Y");
    const totalRecords = records.length;
    let ckStatus =
      totalRecords === hasUncheck.length
        ? "UNCHECK"
        : hasUncheck.length === 0
        ? "CHECK"
        : "INDETERMINATE";
    if (hasProceesed !== undefined) {
      ckStatus = "INDETERMINATE";
    }
    if (ckStatus === "INDETERMINATE") {
      this.allChecked.indeterminate = true;
    } else {
      this.allChecked.indeterminate = false;
    }
    this.setState({
      selectAll: ckStatus,
    });
  }

  render() {
    return (
      <div className="day_end_prc">
        <TransationDetails
          openPopup={this.state.openPopup}
          posted={this.state.posted}
          popUpRecords={this.state.popUpRecords}
          finance_day_end_header_id={this.state.finance_day_end_header_id}
          narration={this.state.narration}
          onClose={this.CloseTransationDetail.bind(this)}
        />
        {this.props.location.state ? null : (
          <div
            className="row inner-top-search margin-bottom-15"
            style={{ paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <AlgaehDateHandler
                  div={{ className: "col-2" }}
                  label={{ fieldName: "from_date" }}
                  textBox={{
                    className: "txt-fld",
                    name: "from_date",
                  }}
                  events={{
                    onChange: (selectedDate) => {
                      this.setState({
                        from_date: selectedDate,
                        to_date: undefined,
                      });
                    },
                    onBlur: this.dateValidate.bind(this),
                  }}
                  value={this.state.from_date}
                  disabled={this.state.revert_trans === "Y" ? true : false}
                />

                <AlgaehDateHandler
                  div={{ className: "col-2" }}
                  label={{ fieldName: "to_date" }}
                  textBox={{
                    className: "txt-fld",
                    name: "to_date",
                  }}
                  {...(this.state.from_date !== undefined
                    ? { minDate: new Date(this.state.from_date) }
                    : {})}
                  events={{
                    onChange: (selectedDate) => {
                      this.setState({ to_date: selectedDate });
                    },
                    onBlur: this.dateValidate.bind(this),
                  }}
                  value={this.state.to_date}
                  disabled={this.state.revert_trans === "Y" ? true : false}
                />
                {/* <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                  forceLabel: "Transaction No."
                  }}
                  textBox={{
                  className: "txt-fld",
                  name: "batchno",
                  value: this.state.batchno,
                  events: {
                    onChange: null
                  },
                  others: {
                    // disabled: true
                  }
                  }}
                /> */}

                {/* <div
                  className="customCheckbox col"
                  style={{ border: "none", marginTop: "20px" }}
                >
                  <label className="checkbox" style={{ color: "#212529" }}>
                    <input
                      type="checkbox"
                      name="posted"
                      checked={this.state.posted === "Y" ? true : false}
                      disabled={this.state.revert_trans === "Y" ? true : false}
                      onChange={this.checkHandaler.bind(this)}
                    />

                    <span style={{ fontSize: "0.8rem" }}>
                      Posted Transaction
                    </span>
                  </label>
                </div> */}
                <AlgaehAutoComplete
                  div={{ className: "col-2" }}
                  label={{
                    fieldName: "voucherType",
                  }}
                  selector={{
                    value: this.state.voucherType,
                    dataSource: {
                      data: dataPayment,
                      valueField: "value",
                      textField: "label",
                    },
                    onChange: (selected) => {
                      debugger;
                      this.setState({
                        voucherType: selected.value,
                        dayEnd: [],
                        voucher_list: {
                          label: (
                            <input
                              type="checkbox"
                              defaultChecked={
                                this.state.selectAll === "CHECK" ? true : false
                              }
                              ref={(input) => {
                                this.allChecked = input;
                              }}
                              onChange={this.onChageCheckSelectAll.bind(this)}
                            />
                          ),
                          fieldName: "select",
                          displayTemplate: (row) => (
                            <input
                              type="checkbox"
                              checked={row.checked}
                              disabled={
                                row.salary_processed === "Y" ? true : false
                              }
                              onChange={this.onCheckChangeRow.bind(this, row)}
                            />
                          ),
                          others: {
                            minWidth: 50,
                            filterable: false,
                            sortable: false,
                          },
                        },
                      });
                    },
                    onClear: () => {
                      this.setState({
                        voucherType: null,
                        voucher_list: null,
                        dayEnd: [],
                      });
                    },
                    others: {
                      // disabled: disableFiled || afterSaveDisabled,
                    },
                  }}
                />
                {/* 
                <div className="col">
                  <label>Show Posted Transaction</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="posted"
                        checked={this.state.posted === "Y" ? true : false}
                        disabled={
                          this.state.revert_trans === "Y" ? true : false
                        }
                        onChange={this.checkHandaler.bind(this)}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>
                <div className="col">
                  <label>Show Reverted Transaction</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="revert_trans"
                        checked={this.state.revert_trans === "Y" ? true : false}
                        onChange={this.checkHandaler.bind(this)}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div> */}

                <div className="col">
                  <label>Show Transaction By</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="PN"
                        name="transType"
                        checked={this.state.transType === "PN" ? true : false}
                        onChange={this.checkHandaler.bind(this)}
                      />
                      <span>Not Posted</span>
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="PY"
                        name="transType"
                        checked={this.state.transType === "PY" ? true : false}
                        onChange={this.checkHandaler.bind(this)}
                      />
                      <span>Posted</span>
                    </label>
                    <label className="radio inline">
                      <input
                        value="RT"
                        type="radio"
                        name="transType"
                        checked={this.state.transType === "RT" ? true : false}
                        onChange={this.checkHandaler.bind(this)}
                      />
                      <span>Reverted</span>
                    </label>
                  </div>
                </div>

                {/* <div
                  className="customCheckbox col"
                  style={{ border: "none", marginTop: "20px" }}
                >
                  <label className="checkbox" style={{ color: "#212529" }}>
                    <input
                      type="checkbox"
                      name="revert_trans"
                      checked={this.state.revert_trans === "Y" ? true : false}
                      onChange={this.checkHandaler.bind(this)}
                    />

                    <span style={{ fontSize: "0.8rem" }}>
                      Reverted Transaction
                    </span>
                  </label>
                </div> */}

                <div className="col" style={{ textAlign: "right" }}>
                  <button
                    className="btn btn-default btn-small"
                    style={{ marginTop: 20 }}
                    onClick={this.ClearData.bind(this)}
                  >
                    Clear
                  </button>
                  <button
                    className="btn btn-primary btn-small"
                    style={{ marginTop: 20, marginLeft: 10 }}
                    onClick={this.getDayEndProcess.bind(this)}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
              <div className="portlet-body">
                <div className="row">
                  <div
                    className="col-lg-12 customCheckboxGrid"
                    id="dayEndProcessCntr"
                  >
                    <AlgaehTable
                      id="dayEndProcessGrid"
                      columns={[
                        this.state.voucher_list,
                        {
                          fieldName: "select_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Action" }} />
                          ),
                          displayTemplate: (row) => (
                            <>
                              {this.state.posted === "N" &&
                              this.state.revert_trans === "N" ? (
                                <Tooltip title="Post to Finance">
                                  <i
                                    className="fas fa-paper-plane"
                                    onClick={() => {
                                      this.postDayEndProcess(
                                        row.finance_day_end_header_id
                                      );
                                    }}
                                  ></i>
                                </Tooltip>
                              ) : null}

                              <Tooltip title="View Details">
                                <i
                                  className="fas fa-eye"
                                  onClick={() => {
                                    this.onOpenPreviewPopUP(row, this);
                                  }}
                                ></i>
                              </Tooltip>
                              <Tooltip title="DrillDown">
                                <i
                                  className="fa fa-exchange-alt"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.DrillDownScree(row, this);
                                  }}
                                ></i>
                              </Tooltip>

                              {this.state.posted === "N" &&
                              this.state.revert_trans === "N" &&
                              (row.from_screen === "PR0004" ||
                                row.from_screen === "PR0006" ||
                                row.from_screen === "SAL005") ? (
                                <Tooltip title="Revert">
                                  <i
                                    className="fa fa-share fa-flip-horizontal "
                                    // className="fa fa-exchange-alt"
                                    // aria-hidden="true"
                                    onClick={() =>
                                      this.setState({
                                        revert_visible: true,
                                        selected_data: row,
                                      })
                                    }
                                    // onClick={this.RejectProcess.bind(this, row)}
                                  />
                                </Tooltip>
                              ) : null}
                            </>
                          ),

                          others: {
                            width: 170,
                            maxWidth: 200,
                            filterable: false,
                          },
                        },
                        {
                          fieldName: "document_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Document No." }}
                            />
                          ),
                          disabled: true,
                          filterable: true,
                          sortable: true,
                          // filterType: "choices",
                          // choices: [
                          //   {
                          //     name: "Paid",
                          //     value: "paid",
                          //   },
                          //   {
                          //     name: "Un Paid",
                          //     value: "unpaid",
                          //   },
                          // ],

                          others: {
                            width: 140,
                          },
                        },
                        {
                          fieldName: "invoice_no",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Invoice No." }}
                            />
                          ),
                          disabled: true,
                          filterable: true,
                          sortable: false,

                          others: {
                            width: 130,
                          },
                        },

                        {
                          fieldName: "transaction_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Document Date" }}
                            />
                          ),
                          filterable: true,
                          sortable: false,
                          filterType: "date",

                          others: {
                            width: 130,
                          },
                        },

                        {
                          fieldName: "voucher_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Voucher Type" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return _.startCase(
                              row.voucher_type ? row.voucher_type : ""
                            );
                          },
                          disabled: true,
                          filterable: true,
                          sortable: false,

                          others: {
                            width: 120,
                          },
                        },
                        {
                          fieldName: "amount",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Amount" }} />
                          ),

                          displayTemplate: (row) => {
                            return (
                              <span>
                                {GetAmountFormart(row.amount, {
                                  appendSymbol: false,
                                })}
                              </span>
                            );
                          },

                          others: {
                            width: 100,
                          },
                        },

                        {
                          fieldName: "screen_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "From Document" }}
                            />
                          ),
                          disabled: true,
                          filterable: true,
                          sortable: false,
                          others: {
                            width: 140,
                          },
                        },

                        {
                          fieldName: "entered_by",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Entered By" }} />
                          ),
                          disabled: true,
                          filterable: true,
                          sortable: false,
                          others: {
                            width: 140,
                          },
                        },
                        {
                          fieldName: "narration",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Narration" }} />
                          ),
                          disabled: true,
                          filterable: true,
                          sortable: false,
                        },
                      ]}
                      data={this.state.dayEnd}
                      pagination={true}
                      pageOptions={{ rows: 20, page: 1 }}
                      isFilterable={true}
                      persistence={this.state.persistence}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.voucherType === null ? null : (
          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginLeft: 10 }}
                  onClick={this.bulkProcess.bind(this)}
                  disabled={this.state.dayEnd.length > 0 ? false : true}
                >
                  Post to Finance
                </button>
              </div>
            </div>
          </div>
        )}

        <Modal
          title="Revert"
          visible={this.state.revert_visible}
          width={1080}
          footer={null}
          onCancel={() => this.setState({ revert_visible: false })}
          className={`row algaehNewModal invoiceRevertModal`}
        >
          <AlagehFormGroup
            div={{ className: "col" }}
            label={{
              forceLabel: "Enter reason for invoice reversal",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "revert_reason",
              value: this.state.revert_reason,
              events: {
                onChange: (e) => {
                  this.setState({ revert_reason: e.target.value });
                },
              },
            }}
          />

          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <AlgaehButton
                    className="btn btn-primary"
                    onClick={this.RejectProcess.bind(this)}
                  >
                    Reject
                  </AlgaehButton>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col">
              <button
                className="btn btn-primary"
                onClick={this.postDayEndProcess.bind(this)}
                disabled={this.state.posted === "Y" ? true : false}
              >
                Post to Finance
              </button>
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

export default withRouter(DayEndProcess);
