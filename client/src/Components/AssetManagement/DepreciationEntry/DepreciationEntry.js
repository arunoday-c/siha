import React, { Component } from "react";
import "./dep_entry.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";

class DepreciationEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="dep_entry">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Depreciation Entry", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Home",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ forceLabel: "Depreciation Entry", align: "ltr" }}
                />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "Depreciation Number", returnText: true }}
              />
            ),
            value: this.state.document_number,
            selectValue: "document_number",
            events: {
              onChange: null //getCtrlCode.bind(this, this)
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "initialStock.intstock"
            },
            searchName: "initialstock"
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Depreciation Date"
                  }}
                />
                <h6>
                  {this.state.docdate
                    ? moment(this.state.docdate).format(Options.dateFormat)
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          selectedLang={this.state.selectedLang}
        />
        <div
          className="portlet portlet-bordered margin-bottom-15"
          style={{ marginTop: 90 }}
        >
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-6" }}
              label={{
                forceLabel: "Asset Desc."
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
            <AlagehFormGroup
              div={{ className: "col-2" }}
              label={{
                forceLabel: "Year/Period"
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
            <AlagehFormGroup
              div={{ className: "col-2" }}
              label={{
                forceLabel: "Last Period"
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
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{ forceLabel: "Asset Details" }}
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
          </div>
          <div className="row">
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
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{ forceLabel: "Function" }}
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
            <div className="col">
              <button className="btn btn-primary" style={{ marginTop: 21 }}>
                Process
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

        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="row">
                <div className="col-lg-12" id="depreEntryCntr">
                  <AlgaehDataGrid
                    id="PO_details"
                    columns={[
                      {
                        fieldName: "item_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Asset Code" }} />
                        )
                      },

                      {
                        fieldName: "item_category",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Asset Desc." }} />
                        )
                      },
                      {
                        fieldName: "qtyhand",
                        label: <AlgaehLabel label={{ forceLabel: "Method" }} />,
                        disabled: true
                      },
                      {
                        fieldName: "expiry_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Fiscal Year" }} />
                        )
                      },
                      {
                        fieldName: "batchno",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Fiscal Period" }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "uom_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Actual Year" }} />
                        )
                      }
                    ]}
                    keyId="service_type_id"
                    dataSource={{
                      data: this.state.pharmacy_stock_detail
                    }}
                    isEditable={true}
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

export default DepreciationEntry;
