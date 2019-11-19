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

import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
const modules = [
  {
    name: "OP Bill",
    value: "OP",

    trans_type: [
      { name: "Bill", value: "1" },
      { name: "Advance", value: "2" },
      { name: "Refund", value: "3" },
      { name: "Cancel", value: "4" },
      { name: "Credit", value: "5" }
    ]
  },
  {
    name: "Pharmacy",
    value: "PH",
    trans_type: [
      { name: "Receipt", value: "20" },
      { name: "Invoice", value: "21" },
      { name: "Purchase Return", value: "22" },
      { name: "Credit Note", value: "23" },
      { name: "Debit Note", value: "24" },
      { name: "POS", value: "25" },
      { name: "Sales Return", value: "26" },
      { name: "Transfer", value: "27" },
      { name: "Adjustment", value: "28" },
      { name: "Shipment", value: "29" },
      { name: "Credit Settlement", value: "30" },
      { name: "Consumption", value: "31" }
    ]
  },
  {
    name: "Inventory",
    value: "IN",
    trans_type: [
      { name: "Receipt", value: "40" },
      { name: "Invoice", value: "41" },
      { name: "Purchase Return", value: "42" },
      { name: "Credit Note", value: "43" },
      { name: "Debit Note", value: "44" },
      { name: "Transfer", value: "45" },
      { name: "Adjustment", value: "46" },
      { name: "Shipment", value: "47" },
      { name: "Consumption", value: "48" }
    ]
  },
  {
    name: "Insurance",
    value: "IS",
    trans_type: [
      { name: "Invoice", value: "51" },
      { name: "Receipt", value: "52" },
      { name: "Adjustment", value: "53" },
      { name: "Resubmission", value: "54" }
    ]
  },
  { name: "IP Bill", value: "IP" }
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
      popUpRecords: {}
    };
    this.selectedDayEndIds = [];
  }

  getDayEndProcess() {
    try {
      algaehApiCall({
        uri: "/finance/getDayEndData",
        data: { from_date: this.state.from_date, to_date: this.state.to_date },
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
  dropDownHandle(value) {
    switch (value.name) {
      case "modules":
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
          {" "}
          <div className="col-lg-12 popupInner">
            <div className="row" style={{ paddingTop: 15 }}>
              <div className="col-2">
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
              </div>
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
                    {
                      fieldName: "narration",
                      label: <AlgaehLabel label={{ forceLabel: "Narration" }} />
                    }
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
              </div>{" "}
            </div>
          </div>{" "}
          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row" style={{ textAlign: "right" }}>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={e => {
                    this.onClose(e);
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
                  name: "modules",
                  className: "select-fld",
                  value: this.state.modules,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: modules
                  },
                  onChange: this.dropDownHandle.bind(this),
                  onClear: null
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{ forceLabel: "Transaction Type" }}
                selector={{
                  name: "trans_type_name",
                  className: "select-fld",
                  value: this.state.trans_type_name,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: this.state.trans_type
                  },
                  onChange: this.dropDownHandle.bind(this),
                  onClear: () => {
                    this.setState({
                      trans_type: null
                    });
                  }
                }}
              />
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
                  }
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
                  }
                }}
                value={this.state.to_date}
              />
              <AlagehFormGroup
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
              />
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
                            {" "}
                            <span style={{ padding: 6 }}>
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
                            </span>
                            <i
                              className="fas fa-eye"
                              onClick={() => {
                                this.onOpenPreviewPopUP(row, this);
                                // this.setState({openPopup:true});
                              }}
                            ></i>
                          </>
                        ),
                        other: {
                          maxWidth: 55
                        }
                      },
                      {
                        fieldName: "document_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Document Type" }}
                          />
                        )
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
                        )
                      },
                      {
                        fieldName: "narration",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Description" }} />
                        )
                      },
                      {
                        fieldName: "transaction_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Transaction Type" }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "amount",
                        label: <AlgaehLabel label={{ forceLabel: "Amount" }} />
                      },

                      {
                        fieldName: "screen_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "From Document" }}
                          />
                        ),
                        disabled: true
                      }
                    ]}
                    keyId="finance_day_end_header_id"
                    dataSource={{
                      data: this.state.dayEnd
                    }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    // events={{
                    //   onDelete: deletePosDetail.bind(this, this, context),
                    //   onEdit: row => {},
                    //   onDone: updatePosDetail.bind(this, this)
                    // }}
                    // onRowSelect={row => {
                    //   getItemLocationStock(this, row);
                    // }}
                  />
                  <div
                    style={{
                      float: "right",
                      margin: "10px"
                    }}
                  >
                    <button
                      className="btn btn-primary"
                      onClick={this.postDayEndProcess.bind(this)}
                    >
                      POST
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DayEndProcess;
