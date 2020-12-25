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
      let inputObj = {
        posted: this.state.posted,
        revert_trans: this.state.revert_trans,
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

      algaehApiCall({
        uri: "/finance/getDayEndData",
        data: inputObj,
        method: "GET",
        module: "finance",
        onSuccess: (response) => {
          this.setState({
            dayEnd: response.data.result,
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
    try {
      // if (this.selectedDayEndIds.length === 0) {
      //   swalMessage({
      //     title: "Select Atleast one transaction to post",
      //     type: "warning"
      //   });
      //   return;
      // }
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
    } catch (e) {
      console.error(e);
    }
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
    } else if (row.from_screen === "INV0009") {
      // Inventory Transfer
      this.props.history.push(
        `/InvTransferEntry?transfer_number=${row.document_number}`
      );
    } else if (row.from_screen === "INV0007") {
      // Inventory Consumorion
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


    // persistStateOnBack(this.state, () => {
    //   if (
    //     row.from_screen === "FD0002" ||
    //     row.from_screen === "BL0001" ||
    //     row.from_screen === "BL0002"
    //   ) {
    //     // Billing
    //     this.props.history.push(`/OPBilling?bill_code=${row.document_number}`);
    //   } else if (row.from_screen === "BL0003") {
    //     // Billing
    //     this.props.history.push(
    //       `/OPBillCancellation?bill_cancel_number=${row.document_number}`
    //     );
    //   } else if (row.from_screen === "INV0009") {
    //     // Inventory Transfer
    //     this.props.history.push(
    //       `/InvTransferEntry?transfer_number=${row.document_number}`
    //     );
    //   } else if (row.from_screen === "INV0007") {
    //     // Inventory Consumorion
    //     this.props.history.push(
    //       `/InvConsumptionEntry?consumption_number=${row.document_number}`
    //     );
    //   } else if (row.from_screen === "SAL005") {
    //     // Sales Invoice
    //     this.props.history.push(
    //       `/SalesInvoice?invoice_number=${row.document_number}&finance_day_end_header_id=${row.finance_day_end_header_id}`
    //     );
    //   } else if (row.from_screen === "SAL008") {
    //     //Sales Return
    //     this.props.history.push(
    //       `/SalesReturnEntry?sales_return_number=${row.document_number}`
    //     );
    //   } else if (row.from_screen === "PR0003") {
    //     // Delivery Note
    //     this.props.history.push(
    //       `/DeliveryNoteEntry?delivery_note_number=${row.document_number}`
    //     );
    //   } else if (row.from_screen === "PR0004") {
    //     //Receipt Entry
    //     this.props.history.push(
    //       `/ReceiptEntry?grn_number=${row.document_number}&finance_day_end_header_id=${row.finance_day_end_header_id}`
    //     );
    //   } else if (row.from_screen === "PR0006") {
    //     //Purchase Return
    //     this.props.history.push(
    //       `/PurchaseReturnEntry?purchase_return_number=${row.document_number}`
    //     );
    //   }
    // });
  }
  onOpenPreviewPopUP(row, that) {
    try {
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
    });
    return this.props.history?.push(this.props.location?.pathname);
  }

  render() {
    return (
      <div className="day_end_prc">
        <TransationDetails
          openPopup={this.state.openPopup}
          popUpRecords={this.state.popUpRecords}
          finance_day_end_header_id={this.state.finance_day_end_header_id}
          onClose={this.CloseTransationDetail.bind(this)}
        />
        {/* <AlgaehModalPopUp
          title="Accounting Entries"
          openPopup={this.state.openPopup}
          events={{
            onClose: () => {
              this.setState({ popUpRecords: {}, openPopup: false });
            },
          }}
        >
          <div className="col-lg-12 popupInner">
            <div className="row" style={{ paddingTop: 15 }}>              
              <div className="col-12" id="dayEndProcessDetailsGrid_Cntr">
                <AlgaehDataGrid
                  id="dayEndProcessDetailsGrid"
                  columns={[
                    {
                      fieldName: "to_account",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "To Account" }} />
                      ),
                    },

                    {
                      fieldName: "payment_type",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Payment Type" }} />
                      ),
                    },
                    {
                      fieldName: "payment_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Payment Date" }} />
                      ),
                    },
                    {
                      fieldName: "debit_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Debit Amount" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {GetAmountFormart(row.debit_amount, {
                              appendSymbol: false,
                            })}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "credit_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Credit Amount" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {GetAmountFormart(row.credit_amount, {
                              appendSymbol: false,
                            })}
                          </span>
                        );
                      },
                    },

                    // {
                    //   fieldName: "narration",
                    //   label: <AlgaehLabel label={{ forceLabel: "Narration" }} />
                    // }
                  ]}
                  dataSource={{
                    data:
                      this.state.popUpRecords.entries === undefined
                        ? []
                        : this.state.popUpRecords.entries,
                  }}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row" style={{ textAlign: "right" }}>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={(e) => {
                    this.setState({ popUpRecords: {}, openPopup: false });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp> */}
        {this.props.location.state ? null : (
          <div
            className="row inner-top-search margin-bottom-15"
            style={{ paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                {/* <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Select Module" }}
                  selector={{
                    name: "module_id",
                    className: "select-fld",
                    value: this.state.module_id,
                    dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: modules,
                    },
                    onClear: () => {
                  this.setState({
                  module_id: null,
                  screen_code: null,
                  trans_type: [],
                  });
                    },
                    onChange: this.dropDownHandle.bind(this),
                  }}
                /> */}

                {/* <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Select Screen" }}
                  selector={{
                  name: "screen_code",
                  className: "select-fld",
                  value: this.state.screen_code,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: this.state.trans_type
                  },
                  onChange: this.dropDownHandle.bind(this),
                  onClear: () => {
                    this.setState({
                  screen_code: null
                    });
                  }
                  }}
                /> */}
                <AlgaehDateHandler
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "From Date" }}
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
                  label={{ forceLabel: "To Date" }}
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
                      Posted Trancation
                    </span>
                  </label>
                </div> */}

                <div className="col">
                  <label>Show Only Posted Trancation</label>
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
                  <label>Show Only Reverted Trancation</label>
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
                      Reverted Trancation
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
                        {
                          fieldName: "select_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Select" }} />
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
                          // others: {
                          //   width: 140,
                          // },
                        },
                      ]}
                      // rowUniqueId="finance_day_end_header_id"
                      data={this.state.dayEnd}
                      // height="80vh"
                      pagination={true}
                      isFilterable={true}
                      persistence={this.state.persistence}
                    // paging={{ page: 3, rowsPerPage: 20 }}
                    />
                    {/* <AlgaehDataGrid
                      id="dayEndProcessGrid"
                      columns={[
                        {
                          fieldName: "select_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Select" }} />
                          ),
                          displayTemplate: (row) => (
                            <>
                              {this.state.posted === "N" ? (
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
                                  onClick={() => {
                                    this.DrillDownScree(row, this);
                                  }}
                                ></i>
                              </Tooltip>

                              {this.state.posted === "N" &&
                              (row.from_screen === "PR0004" ||
                                row.from_screen === "SAL005") ? (
                                <Tooltip title="Revert">
                                  <i
                                    className="fa fa-share fa-flip-horizontal"
                                    aria-hidden="true"
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
                            maxWidth: 170,
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
                        },
                        {
                          fieldName: "invoice_no",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Invoice No." }}
                            />
                          ),
                          disabled: true,
                        },

                        {
                          fieldName: "transaction_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Document  Date" }}
                            />
                          ),
                          others: { filterable: false },
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
                          others: { filterable: false },
                        },

                        {
                          fieldName: "screen_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "From Document" }}
                            />
                          ),
                          disabled: true,
                       
                        },
                        {
                          fieldName: "narration",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Narration" }} />
                          ),
                          disabled: false,
                          others: { filterable: true },
                        },
                      ]}
                      keyId="finance_day_end_header_id"
                      dataSource={{
                        data: this.state.dayEnd,
                      }}
                      isEditable={false}
                      filter={true}
                      paging={{ page: 3, rowsPerPage: 20 }}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
