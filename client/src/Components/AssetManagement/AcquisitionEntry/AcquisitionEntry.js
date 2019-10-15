import React, { Component } from "react";
import "./acq_entry.scss";
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

class AcquisitionEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="acq_entry">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ fieldName: "acquisition_entry", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "home",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ fieldName: "acquisition_entry", align: "ltr" }}
                />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ fieldName: "acquisition_number", returnText: true }}
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
                    fieldName: "acquisition_date"
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
              label={{ fieldName: "transaction_type" }}
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
              label={{ fieldName: "location" }}
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
              label={{ fieldName: "department" }}
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
              label={{ fieldName: "deprctn_cat" }}
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
              label={{ transaction_date: "Transaction Date" }}
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
              label={{ fieldName: "acquistn_type" }}
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
              label={{ fieldName: "acquistn_account" }}
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
                fieldName: "asset_desc"
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
                fieldName: "asset_group"
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
                <div className="col-lg-12" id="acquisitionEntryCntr">
                  <AlgaehDataGrid
                    id="acquisitionEntry"
                    columns={[
                      {
                        fieldName: "item_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "item_name" }} />
                        )
                      },

                      {
                        fieldName: "item_category",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "deprictn_catgry" }}
                          />
                        )
                      },
                      {
                        fieldName: "qtyhand",
                        label: (
                          <AlgaehLabel label={{ fieldName: "asset_code" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "expiry_date",
                        label: (
                          <AlgaehLabel label={{ fieldName: "asset_desc" }} />
                        )
                      },
                      {
                        fieldName: "batchno",
                        label: <AlgaehLabel label={{ fieldName: "barcode" }} />,
                        disabled: true
                      },
                      {
                        fieldName: "uom_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "account_set" }} />
                        )
                      },
                      {
                        fieldName: "unit_cost",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "asset_type_code" }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "quantity",
                        label: <AlgaehLabel label={{ fieldName: "category" }} />
                      },

                      {
                        fieldName: "extended_cost",
                        label: <AlgaehLabel label={{ fieldName: "group" }} />,
                        disabled: true
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

export default AcquisitionEntry;
