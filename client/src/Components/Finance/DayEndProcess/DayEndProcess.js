import React, { Component } from "react";
import "./day_end_prc.css";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";

class DayEndProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
                  name: "item_id",
                  className: "select-fld",
                  value: this.state.item_id,
                  dataSource: {
                    textField: "item_description",
                    valueField: "hims_d_item_master_id",
                    data: this.props.itemlist
                  },
                  onChange: null,
                  onClear: null
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{ forceLabel: "Transaction Type" }}
                selector={{
                  name: "item_id",
                  className: "select-fld",
                  value: this.state.item_id,
                  dataSource: {
                    textField: "item_description",
                    valueField: "hims_d_item_master_id",
                    data: this.props.itemlist
                  },
                  onChange: null,
                  onClear: null
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
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
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
