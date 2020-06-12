import React, { Component } from "react";
import "./ReorderQtyMasterInventory.scss";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
export default class ReorderQtyMasterInventory extends Component {
  render() {
    return (
      <div
        className="ReorderQtyMasterInventoryScreen"
        style={{ marginTop: 10 }}
      >
        <div className="row margin-top-15">
          <div className="col-4">
            <div className="portlet portlet-bordered marginBottom-15">
              {/* <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Item Notification Settings
                  </h3>
                </div>
              </div> */}
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{
                      className: "col-12 form-group mandatory"
                    }}
                    label={{
                      forceLabel: "Select Store",
                      isImp: true
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      value: "",
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: []
                      }
                    }}
                  />
                  <div className="col-4">
                    <label>Assign Default Qty</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input type="checkbox" value="" name="" />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                  <AlagehFormGroup
                    div={{
                      className: "col-4  mandatory"
                    }}
                    label={{
                      forceLabel: "Reorder Qty",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {}
                    }}
                  />
                </div>
                <div className="row">
                  <div
                    className="col-12"
                    id="ReorderQtyMasterInventoryGrid_Cntr"
                  >
                    <AlgaehDataGrid
                      id="ReorderQtyMasterInventoryGrid"
                      columns={[
                        {
                          fieldName: "abc",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Select" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span style={{ padding: 6 }}>
                                <input type="checkbox" />
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 50,
                            filterable: false
                          }
                        },
                        {
                          fieldName: "abc",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: "",
                                  className: "txt-fld",
                                  name: "",
                                  events: {},
                                  others: {}
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "abc",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Reorder Qty"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: "",
                                  className: "txt-fld",
                                  name: "",
                                  events: {},
                                  others: {}
                                }}
                              />
                            );
                          },
                          others: {
                            maxWidth: 100,
                            filterable: false
                          }
                        }
                      ]}
                      keyId=""
                      dataSource=""
                      filter={true}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{}}
                    />
                  </div>{" "}
                  <div
                    className="col-12"
                    style={{ textAlign: "right", marginTop: 15 }}
                  >
                    <button className="btn btn-primary">Assign</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-8">
            <div className="portlet portlet-bordered marginBottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Reorder List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12">
                    <AlgaehDataGrid
                      columns={[
                        {
                          fieldName: "abc",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                          )
                        },
                        {
                          fieldName: "abc",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Store Name"
                              }}
                            />
                          )
                        },
                        {
                          fieldName: "abc",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Reorder Qty"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: "",
                                  className: "txt-fld",
                                  name: "",
                                  events: {},
                                  others: {}
                                }}
                              />
                            );
                          },
                          others: {
                            maxWidth: 100,
                            filterable: false
                          }
                        }
                      ]}
                      keyId=""
                      dataSource=""
                      filter={true}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{}}
                    />
                  </div>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
