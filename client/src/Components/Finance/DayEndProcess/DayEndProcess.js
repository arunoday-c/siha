import React, { Component } from "react";
import "./day_end_prc.scss";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

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
      trans_type: []
    };
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

  render() {
    return (
      <div className="day_end_prc">
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
                  name: "expiry_date"
                }}
                minDate={new Date()}
                //disabled={true}
                events={{
                  onChange: null
                }}
                value={this.state.expiry_date}
              />

              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "To Date" }}
                textBox={{
                  className: "txt-fld",
                  name: "expiry_date"
                }}
                minDate={new Date()}
                //disabled={true}
                events={{
                  onChange: null
                }}
                value={this.state.expiry_date}
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
                <button className="btn btn-primary" style={{ marginTop: 21 }}>
                  Preview
                </button>
              </div>
              {/* <div
            className="customCheckbox col-lg-3"
            style={{ border: "none", marginTop: "28px" }}
          >
            <label className="checkbox" style={{ color: "#212529" }}>
              <input
                type="checkbox"
                name="Multiple PO"
                checked={this.state.Cashchecked}
                onChange={null}
              />

              <span style={{ fontSize: "0.8rem" }}>From Multiple PO</span>
            </label>
          </div> */}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="row">
                <div className="col-lg-12" id="dayEndProcessCntr">
                  <AlgaehDataGrid
                    id="dayEndProcessGrid"
                    columns={[
                      {
                        fieldName: "select_id",
                        label: <AlgaehLabel label={{ forceLabel: "Select" }} />,
                        other: {
                          maxWidth: 55
                        }
                      },
                      {
                        fieldName: "documentType",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Document Type" }}
                          />
                        )
                      },
                      {
                        fieldName: "documentNo",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Document No." }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "document_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Document  Date" }}
                          />
                        )
                      },
                      {
                        fieldName: "code",
                        label: <AlgaehLabel label={{ forceLabel: "Code" }} />,
                        disabled: true
                      },
                      {
                        fieldName: "description_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Description" }} />
                        )
                      },
                      {
                        fieldName: "recipt_refund",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Recipt/ Refund" }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "invoiceAmount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Invoice Amount" }}
                          />
                        )
                      },

                      {
                        fieldName: "fromDocument",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "From Document" }}
                          />
                        ),
                        disabled: true
                      }
                    ]}
                    keyId="service_type_id"
                    dataSource={{
                      data: this.state.pharmacy_stock_detail
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
                    <button className="btn btn-primary">POST</button>
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
