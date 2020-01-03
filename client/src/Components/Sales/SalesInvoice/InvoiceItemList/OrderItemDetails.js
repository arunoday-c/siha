import React, { Component } from "react";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";

import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import Options from "../../../../Options.json";
import moment from "moment";

export default class OrderItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeDateFormat(date) {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  }

  onClose = e => {

    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title={this.props.HeaderCaption}
            openPopup={this.props.show}
          >
            <div className="col-lg-12 popupInner">
              <AlgaehDataGrid
                id="DN_details"
                columns={[
                  {
                    fieldName: "item_description",
                    label: <AlgaehLabel label={{ forceLabel: "Item Name" }} />,
                    others: { minWidth: 150 }
                  },
                  {
                    fieldName: "uom_description",
                    label: <AlgaehLabel label={{ forceLabel: "UOM" }} />,
                    others: { minWidth: 100 }
                  },
                  {
                    fieldName: "expiry_date",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>{this.changeDateFormat(row.expiry_date)}</span>
                      );
                    },

                    others: {
                      minWidth: 150,
                      resizable: false
                    }
                  },
                  {
                    fieldName: "batchno",
                    label: <AlgaehLabel label={{ forceLabel: "Batch  No." }} />,

                    others: {
                      minWidth: 150,
                      resizable: false
                    }
                  },
                  {
                    fieldName: "dispatch_quantity",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Dispatched Qty" }} />
                    )
                  },
                  {
                    fieldName: "unit_cost",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                    )
                  },
                  {
                    fieldName: "discount_percentage",
                    label: <AlgaehLabel label={{ forceLabel: "Discount %" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "discount_amount",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Discount Amt" }} />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {getAmountFormart(row.discount_amount, {
                            appendSymbol: false
                          })}
                        </span>
                      );
                    },
                    disabled: true
                  },
                  {
                    fieldName: "net_extended_cost",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Net Ext Cost" }} />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {getAmountFormart(row.net_extended_cost, {
                            appendSymbol: false
                          })}
                        </span>
                      );
                    },
                    disabled: true
                  },

                  {
                    fieldName: "tax_amount",
                    label: <AlgaehLabel label={{ forceLabel: "Tax Amt" }} />,
                    displayTemplate: row => {
                      return (
                        <span>
                          {getAmountFormart(row.tax_amount, {
                            appendSymbol: false
                          })}
                        </span>
                      );
                    },
                    disabled: true
                  },

                  {
                    fieldName: "total_amount",
                    label: <AlgaehLabel label={{ forceLabel: "Total Amt" }} />,
                    displayTemplate: row => {
                      return (
                        <span>
                          {getAmountFormart(row.total_amount, {
                            appendSymbol: false
                          })}
                        </span>
                      );
                    },
                    disabled: true
                  }
                ]}
                keyId="hims_f_procurement_dn_detail_id"
                dataSource={{
                  data: this.props.dn_item_details
                }}
                paging={{ page: 0, rowsPerPage: 10 }}
              />
            </div>
            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
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
            </div>
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}
