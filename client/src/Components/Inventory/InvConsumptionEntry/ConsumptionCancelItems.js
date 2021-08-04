import Options from "../../../Options.json";
import moment from "moment";
import "./InvConsumptionEntry";
import React from "react";
import { AlgaehDataGrid, AlgaehLabel } from "algaeh-react-components";

import "../../../styles/site.scss";

function ConsumptionCancelItems({ ConsumptionIOputs }) {
  function dateFormater(date) {
    if (date !== null) {
      return String(moment(date).format(Options.dateFormat));
    }
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
