import Options from "../../../Options.json";
import moment from "moment";
import "./InvConsumptionEntry";
import React from "react";
import { AlgaehDataGrid, AlgaehLabel } from "algaeh-react-components";

import "../../../styles/site.scss";

function ConsumptionCancelItems({ ConsumptionIOputs, UpdateMegaState }) {
  function dateFormater(date) {
    if (date !== null) {
      return String(moment(date).format(Options.dateFormat));
    }
  }

  function deleteConsumptionDetail(row) {
    debugger;
    let inventory_stock_detail = ConsumptionIOputs.inventory_stock_detail;
    // let saveEnable = false;

    const _index = inventory_stock_detail.indexOf(row);
    inventory_stock_detail.splice(_index, 1);

    UpdateMegaState(inventory_stock_detail);
    // ConsumptionIOputs.inventory_stock_detail = inventory_stock_detail;
    // if (inventory_stock_detail.length === 0) {
    //   saveEnable = true;
    // }
    // $this.setState({ inventory_stock_detail: inventory_stock_detail });

    // updateState(after_ack.records);

    // if (context !== undefined) {
    //   context.updateState({
    //     inventory_stock_detail: inventory_stock_detail,
    //     saveEnable: saveEnable,
    //   });
    // }
  }

  return (
    <React.Fragment>
      <div className="hptl-phase1-requisition-item-form">
        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="row">
                <div className="col-lg-12" id="consumptionCancelGrid">
                  <AlgaehDataGrid
                    id="COMSUMPTIONGrid"
                    columns={[
                      {
                        fieldName: "action",

                        label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                        displayTemplate: (row) => {
                          return (
                            <span>
                              <i
                                className="fas fa-trash-alt"
                                style={{
                                  pointerEvents:
                                    ConsumptionIOputs.ItemDisable === true
                                      ? "none"
                                      : "",
                                  opacity:
                                    ConsumptionIOputs.ItemDisable === true
                                      ? "0.1"
                                      : "",
                                }}
                                onClick={() => {
                                  deleteConsumptionDetail(row);
                                }}
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 65,
                          resizable: false,
                          filterable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "item_description",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                        ),
                        filterable: true,
                        sortable: true,
                      },

                      {
                        fieldName: "uom_description",
                        label: <AlgaehLabel label={{ forceLabel: "UOM" }} />,
                        filterable: true,
                        sortable: true,
                      },

                      {
                        fieldName: "batchno",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                        ),
                        filterable: true,
                        sortable: true,
                        disabled: true,
                      },
                      {
                        fieldName: "expiry_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                        ),
                        displayTemplate: (row) => {
                          return <span>{dateFormater(row.expiry_date)}</span>;
                        },
                        disabled: true,
                      },
                      {
                        fieldName: "quantity",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                        ),

                        disabled: true,
                      },
                      {
                        fieldName: "qtyhand",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Qty in Hand" }} />
                        ),
                        disabled: true,
                      },
                    ]}
                    keyId="consumption_id"
                    data={ConsumptionIOputs.inventory_stock_detail}
                    // isEditable={false}
                    // paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    isFilterable={true}
                    pagination={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* )}
      </MyContext.Consumer> */}
    </React.Fragment>
  );
}

export default ConsumptionCancelItems;
