import React, { Component } from "react";
import "./dep_rev.scss";
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

class DepreciationReversal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="dep_rev">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{
                forceLabel: "Depreciation/Reversal Entry",
                align: "ltr"
              }}
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
                  label={{
                    forceLabel: "Depreciation/Reversal Entry",
                    align: "ltr"
                  }}
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
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{ forceLabel: "Transaction Type" }}
              selector={{
                name: "location_id",
                className: "select-fld",
                value: this.state.location_id,
                dataSource: {
                  textField: "location_description",
                  valueField: "hims_d_pharmacy_location_id",
                  data: this.props.locations
                },

                onChange: null,
                onClear: null
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{ forceLabel: "Location" }}
              selector={{
                name: "location_id",
                className: "select-fld",
                value: this.state.location_id,
                dataSource: {
                  textField: "location_description",
                  valueField: "hims_d_pharmacy_location_id",
                  data: this.props.locations
                },

                onChange: null,
                onClear: null
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{ forceLabel: "Department" }}
              selector={{
                name: "location_id",
                className: "select-fld",
                value: this.state.location_id,
                dataSource: {
                  textField: "location_description",
                  valueField: "hims_d_pharmacy_location_id",
                  data: this.props.locations
                },

                onChange: null,
                onClear: null
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{ forceLabel: "Depreciation Category" }}
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
              div={{ className: "col-3" }}
              label={{ forceLabel: "Transaction Date" }}
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
          </div>
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{ forceLabel: "Depreciation Type" }}
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
              label={{ forceLabel: "Depreciation Account" }}
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
            <AlagehFormGroup
              div={{ className: "col-4" }}
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
              div={{ className: "col" }}
              label={{
                forceLabel: "Asset Group."
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
              <button className="btn btn-primary" style={{ marginTop: 19 }}>
                Add to List
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
                <div className="col-lg-12" id="depreReversalCntr">
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

export default DepreciationReversal;
