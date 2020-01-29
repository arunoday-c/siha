import React, { Component } from "react";
import "./day_end_prc.scss";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
const modules = [
  {
    name: "OP Bill",
    value: "5",

    trans_type: [
      { name: "Bill", value: "BL0001" },
      { name: "Advance", value: "FD0002" },
      { name: "Refund", value: "FD0002" },
      { name: "Cancel", value: "BL0003" },
      { name: "Credit", value: "BL0004" }
    ]
  },
  {
    name: "Pharmacy",
    value: "10",
    trans_type: [
      { name: "Receipt", value: "PR0004" },
      { name: "Purchase Return", value: "PR0006" },
      { name: "POS", value: "PH0002" },
      { name: "Sales Return", value: "PH0003" },
      { name: "Transfer", value: "PH0012" },
      { name: "Adjustment", value: "PH0014" },
      { name: "Credit Settlement", value: "PH0010" },
      { name: "Consumption", value: "PH0011" }
    ]
  },
  {
    name: "Inventory",
    value: "11",
    trans_type: [
      { name: "Receipt", value: "PR0004" },
      { name: "Sales Invoice", value: "SAL005" },
      { name: "Sales Return", value: "SAL008" },
      { name: "Purchase Return", value: "PR0006" },
      { name: "Transfer", value: "INV0009" },
      { name: "Adjustment", value: "INV0010" },
      { name: "Consumption", value: "INV0007" }
    ]
  },
  {
    name: "Insurance",
    value: "9",
    trans_type: [
      { name: "Invoice", value: "51" },
      { name: "Receipt", value: "52" },
      { name: "Adjustment", value: "53" },
      { name: "Resubmission", value: "54" }
    ]
  },
  {
    name: "Payroll",
    value: "27",
    trans_type: [
      { name: "Payroll Workbench", value: "PYRLWB" },
      { name: "Salary Management", value: "SALARY_MANAGE" }
    ]
  }
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
      screen_code: null
    };
    this.selectedDayEndIds = [];
  }

  getDayEndProcess() {
    try {
      let inputObj = { posted: this.state.posted }
      if (this.state.screen_code !== null) {
        inputObj.screen_code = this.state.screen_code
      }
      if (this.state.module_id !== null) {
        inputObj.module_id = this.state.module_id
      }
      if (this.state.from_date !== null) {
        inputObj.from_date = this.state.from_date
      }
      if (this.state.to_date !== null) {
        inputObj.to_date = this.state.to_date
      }
      algaehApiCall({
        uri: "/finance/getDayEndData",
        data: inputObj,
        method: "GET",
        module: "finance",
        onSuccess: response => {
          this.setState({ dayEnd: response.data.result });
        },
        onCatch: error => {
          swalMessage({ title: error, type: "error" });
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
  postDayEndProcess() {

    try {
      if (this.selectedDayEndIds.length === 0) {
        swalMessage({
          title: "Select Atleast one transaction to post",
          type: "warning"
        });
        return
      }
      algaehApiCall({
        uri: "/finance/postDayEndData",
        data: { finance_day_end_header_ids: this.selectedDayEndIds },
        method: "POST",
        module: "finance",
        onSuccess: response => {
          swalMessage({ type: "success", title: "Successfully Posted" });
          this.getDayEndProcess();
        },
        onCatch: error => {
          swalMessage({ title: error, type: "error" });
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  checkHandaler(e) {
    this.setState({
      [e.target.name]: e.target.checked ? "Y" : "N",
      dayEnd: []
    });
  };

  dropDownHandle(value) {
    switch (value.name) {
      case "module_id":

        this.setState({
          trans_type: value.selected.trans_type,
          [value.name]: value.value
        });
        break;
      default:
        this.setState({
          [value.name]: value.value
        });
        break;
    }
  }
  onOpenPreviewPopUP(row, that) {
    try {
      algaehApiCall({
        uri: "/finance/previewDayEndEntries",
        data: { day_end_header_id: row.finance_day_end_header_id },
        method: "GET",
        module: "finance",
        onSuccess: response => {
          const { result, success, message } = response.data;
          if (success === true) {
            that.setState({ popUpRecords: result, openPopup: true });
          } else {
            that.setState({ popUpRecords: {}, openPopup: false });
            swalMessage({ title: message, type: "error" });
          }
        },
        onCatch: error => {
          swalMessage({ title: error, type: "error" });
        }
      });
    } catch (e) {
      swalMessage({ title: e, type: "error" });
      console.error(e);
    }
  }

  dateValidate(value, event) {

    if (event.target.name === "from_date" && this.state.to_date !== undefined) {
      let inRange = moment(value).isBefore(moment(this.state.to_date).format("YYYY-MM-DD"));
      if (inRange) {
        swalMessage({
          title: "From Date cannot be grater than To Date.",
          type: "warning"
        });
        event.target.focus();
        this.setState({
          [event.target.name]: null
        });
      }
    } else if (event.target.name === "to_date") {
      if (this.state.from_date === undefined || this.state.from_date === null) {
        swalMessage({
          title: "Select From Date.",
          type: "warning"
        });
        this.setState({
          [event.target.name]: null
        });
        return
      }
      let inRange = moment(value).isBefore(moment(this.state.from_date).format("YYYY-MM-DD"));
      if (inRange) {
        swalMessage({
          title: "To Date cannot be less than From Date.",
          type: "warning"
        });
        event.target.focus();
        this.setState({
          [event.target.name]: null
        });
      }
    }

  };

  render() {
    return (
      <div className="day_end_prc">
        <AlgaehModalPopUp
          title="Accounting Entries"
          openPopup={this.state.openPopup}
          events={{
            onClose: () => {
              this.setState({ popUpRecords: {}, openPopup: false });
            }
          }}
        >

          <div className="col-lg-12 popupInner">
            <div className="row" style={{ paddingTop: 15 }}>
              {/* <div className="col-2">
                <AlgaehLabel
                  label={{
                    forceLabel: "Cash"
                  }}
                />
                <h6>{this.state.popUpRecords.cash}</h6>
              </div>
              <div className="col-2">
                <AlgaehLabel
                  label={{
                    forceLabel: "Card"
                  }}
                />
                <h6>{this.state.popUpRecords.card}</h6>
              </div>
              <div className="col-2">
                <AlgaehLabel
                  label={{
                    forceLabel: "Cheque"
                  }}
                />
                <h6>{this.state.popUpRecords.cheque}</h6>
              </div> */}
              <div className="col-12" id="dayEndProcessDetailsGrid_Cntr">
                <AlgaehDataGrid
                  id="dayEndProcessDetailsGrid"
                  columns={[
                    {
                      fieldName: "to_account",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "To Account" }} />
                      )
                    },

                    {
                      fieldName: "payment_type",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Payment Type" }} />
                      )
                    },
                    {
                      fieldName: "payment_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Payment Date" }} />
                      )
                    },
                    {
                      fieldName: "credit_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Credit Amount" }} />
                      )
                    },
                    {
                      fieldName: "debit_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Debit Amount" }} />
                      )
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
                        : this.state.popUpRecords.entries
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
                  onClick={e => {
                    this.setState({ popUpRecords: {}, openPopup: false });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
        <div
          className="row inner-top-search margin-bottom-15"
          style={{ paddingBottom: "10px" }}
        >
          <div className="col-lg-12">
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{ forceLabel: "Select Module" }}
                selector={{
                  name: "module_id",
                  className: "select-fld",
                  value: this.state.module_id,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: modules
                  },
                  onClear: () => {
                    this.setState({
                      module_id: null,
                      screen_code: null,
                      trans_type: []
                    });
                  },
                  onChange: this.dropDownHandle.bind(this),

                }}
              />

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
                div={{ className: "col" }}
                label={{ forceLabel: "From Date" }}
                textBox={{
                  className: "txt-fld",
                  name: "from_date"
                }}
                events={{
                  onChange: selectedDate => {
                    this.setState({
                      from_date: selectedDate,
                      to_date: undefined
                    });
                  },
                  onBlur: this.dateValidate.bind(this)
                }}
                value={this.state.from_date}
              />

              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "To Date" }}
                textBox={{
                  className: "txt-fld",
                  name: "to_date"
                }}
                {...(this.state.from_date !== undefined
                  ? { minDate: new Date(this.state.from_date) }
                  : {})}
                events={{
                  onChange: selectedDate => {
                    this.setState({ to_date: selectedDate });
                  },
                  onBlur: this.dateValidate.bind(this)
                }}
                value={this.state.to_date}
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

              <div
                className="customCheckbox col"
                style={{ border: "none", marginTop: "20px" }}
              >
                <label className="checkbox" style={{ color: "#212529" }}>
                  <input
                    type="checkbox"
                    name="posted"
                    checked={this.state.posted === "Y" ? true : false}
                    onChange={this.checkHandaler.bind(this)}
                  />

                  <span style={{ fontSize: "0.8rem" }}>Posted Trancation</span>
                </label>
              </div>

              <div className="col">
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 19 }}
                  onClick={this.getDayEndProcess.bind(this)}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="row">
                <div
                  className="col-lg-12 customCheckboxGrid"
                  id="dayEndProcessCntr"
                >
                  <AlgaehDataGrid
                    id="dayEndProcessGrid"
                    columns={[
                      {
                        fieldName: "select_id",
                        label: <AlgaehLabel label={{ forceLabel: "Select" }} />,
                        displayTemplate: row => (
                          <>
                            {this.state.posted === "N" ? <span style={{ padding: 6 }}>
                              <input
                                type="checkbox"
                                onClick={e => {
                                  if (e.target.checked === true) {
                                    this.selectedDayEndIds.push(
                                      row.finance_day_end_header_id
                                    );
                                  } else {
                                    const itemExists = this.selectedDayEndIds.findIndex(
                                      f => f === row.finance_day_end_header_id
                                    );
                                    this.selectedDayEndIds.splice(
                                      itemExists,
                                      1
                                    );
                                  }
                                }}
                              />
                              {/* <label for="">gfgh</label> */}
                            </span> : null}

                            <i
                              className="fas fa-eye"
                              onClick={() => {
                                this.onOpenPreviewPopUP(row, this);
                                // this.setState({openPopup:true});
                              }}
                            ></i>
                          </>
                        ),
                        others: {
                          maxWidth: 80,
                          filterable: false
                        }
                      },

                      {
                        fieldName: "document_number",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Document No." }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "transaction_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Document  Date" }}
                          />
                        ),
                        others: { filterable: false }
                      },

                      {
                        fieldName: "voucher_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Voucher Type" }}
                          />
                        ),
                        disabled: true,
                        // others: { filterable: false }
                      },
                      {
                        fieldName: "amount",
                        label: <AlgaehLabel label={{ forceLabel: "Amount" }} />,
                        others: { filterable: false }
                      },

                      {
                        fieldName: "screen_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "From Document" }}
                          />
                        ),
                        disabled: true,
                        // others: { filterable: false }
                      },
                      {
                        fieldName: "narration",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Narration" }}
                          />
                        ),
                        disabled: true,
                        others: { filterable: false }
                      }
                    ]}
                    keyId="finance_day_end_header_id"
                    dataSource={{
                      data: this.state.dayEnd
                    }}
                    isEditable={false}
                    filter={true}
                    paging={{ page: 0, rowsPerPage: 20 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
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
        </div>
      </div>
    );
  }
}

export default DayEndProcess;
