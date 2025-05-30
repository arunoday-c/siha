import React, { Component } from "react";
import MyContext from "../../../utils/MyContext";
import "./../../../styles/site.scss";
import { AlgaehDataGrid, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import _ from "lodash";

export default class ReceiptServiceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectBatch: false,
      selectBatchButton: true,

      addItemButton: true,
      service_name: "",
      addedItem: true,

      services_id: null,
      quantity: 0,
      discount_percentage: 0,
      unit_cost: 0,
      tax_percent: 0,
    };
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.ReceiptEntryInp;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.ReceiptEntryInp);
  }

  deleteSalesDetail(context, row) {
    let receipt_entry_detail_services = this.state
      .receipt_entry_detail_services;
    const _index = receipt_entry_detail_services.indexOf(row);
    receipt_entry_detail_services.splice(_index, 1);

    if (receipt_entry_detail_services.length === 0) {
      if (context !== undefined) {
        context.updateState({
          receipt_entry_detail_services: receipt_entry_detail_services,
          discount_amount: 0,
          sub_total: 0,
          total_tax: 0,
          net_total: 0,
          net_payable: 0,
          saveEnable: true,
        });
      }
    } else {
      const sub_total = _.sumBy(receipt_entry_detail_services, (s) =>
        parseFloat(s.sub_total)
      );
      const discount_amount = _.sumBy(receipt_entry_detail_services, (s) =>
        parseFloat(s.discount_amount)
      );
      const net_total = _.sumBy(receipt_entry_detail_services, (s) =>
        parseFloat(s.net_total)
      );
      const total_tax = _.sumBy(receipt_entry_detail_services, (s) =>
        parseFloat(s.total_tax)
      );
      const net_payable = _.sumBy(receipt_entry_detail_services, (s) =>
        parseFloat(s.net_payable)
      );

      if (context !== undefined) {
        context.updateState({
          receipt_entry_detail_services: receipt_entry_detail_services,

          sub_total: sub_total,
          discount_amount: discount_amount,
          net_total: net_total,
          total_tax: total_tax,
          net_payable: net_payable,
        });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {(context) => (
            <>
              {/* <div className="col-3">
                                <div className="portlet portlet-bordered margin-bottom-15">
                                    <div className="row">
                                        <AlgaehAutoSearch
                                            div={{ className: "col-12 form-group mandatory AlgaehAutoSearch" }}
                                            label={{ forceLabel: "Service Name" }}
                                            title="Search Items"
                                            id="item_id_search"
                                            template={({ service_name, service_type }) => {
                                                return (

                                                    <section className="resultSecStyles">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <h4 className="title">
                                                                    {_.startCase(_.toLower(service_name))}
                                                                </h4>
                                                                <p className="searchMoreDetails">
                                                                    <span>
                                                                        Service Type:
                                                                        <b>{_.startCase(_.toLower(service_type))}</b>
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </section>
                                                );
                                            }}
                                            name="services_id"
                                            columns={spotlightSearch.Services.servicemaster}
                                            displayField="service_name"
                                            value={this.state.service_name}
                                            searchName="servicemaster"
                                            onClick={servicechangeText.bind(this, this)}
                                            ref={attReg => {
                                                this.attReg = attReg;
                                            }}
                                            others={{
                                                disabled: this.state.dataExists
                                            }}
                                        />


                                        <AlagehFormGroup
                                            div={{ className: "col-6 form-group mandatory" }}
                                            label={{
                                                forceLabel: "Quantity"
                                            }}
                                            textBox={{
                                                number: {
                                                    allowNegative: false,
                                                    thousandSeparator: ","
                                                },
                                                className: "txt-fld",
                                                name: "quantity",
                                                value: this.state.quantity,
                                                dontAllowKeys: ["-", "e", "."],
                                                events: {
                                                    onChange: numberchangeTexts.bind(
                                                        this,
                                                        this,
                                                        context
                                                    )
                                                },
                                                others: {
                                                    disabled: this.state.dataExitst,
                                                    tabIndex: "3"
                                                }
                                            }}
                                        />

                                        <AlagehFormGroup
                                            div={{ className: "col-6 form-group mandatory" }}
                                            label={{
                                                forceLabel: "Discount (%)",
                                                isImp: false
                                            }}
                                            textBox={{
                                                decimal: { allowNegative: false },
                                                className: "txt-fld",
                                                name: "discount_percentage",
                                                value: this.state.discount_percentage,
                                                events: {
                                                    onChange: numberchangeTexts.bind(
                                                        this,
                                                        this,
                                                        context
                                                    )
                                                },
                                                others: {
                                                    tabIndex: "4"
                                                }
                                            }}
                                        />

                                        <div className="col-6 form-group mandatory">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Tax %"
                                                }}
                                            />
                                            <h6>
                                                {this.state.tax_percentage
                                                    ? this.state.tax_percentage
                                                    : "-----------"}
                                            </h6>
                                        </div>
                                        <div className="col-6 form-group mandatory">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Unit Cost"
                                                }}
                                            />
                                            <h6>
                                                {this.state.unit_cost
                                                    ? getAmountFormart(this.state.unit_cost)
                                                    : "-----------"}
                                            </h6>
                                        </div> <div className="col-12 subFooter-btn">
                                            <button
                                                className="btn btn-primary"
                                                onClick={AddSerices.bind(this, this, context)}
                                                disabled={this.state.addItemButton}
                                                tabIndex="5"
                                            >
                                                Add Item
                                            </button>

                                        </div>
                                    </div>
                                </div>

                            </div> */}

              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="row">
                    <div className="col-12" id="SaleOrderGrid_Cntr">
                      <AlgaehDataGrid
                        id="SaleOrderGrid"
                        columns={[
                          {
                            fieldName: "actions",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Action" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span
                                  onClick={this.deleteSalesDetail.bind(
                                    this,
                                    context,
                                    row
                                  )}
                                >
                                  <i className="fas fa-trash-alt" />
                                </span>
                              );
                            },
                          },
                          {
                            fieldName: "service_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Service Name" }}
                              />
                            ),
                            disabled: true,
                            others: {
                              minWidth: 200,
                            },
                          },
                          {
                            fieldName: "quantity",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                            ),
                            displayTemplate: (row) => {
                              return parseFloat(row.quantity);
                            },
                            others: {
                              minWidth: 90,
                            },
                          },
                          {
                            fieldName: "unit_cost",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Unit Cost" }}
                              />
                            ),
                            disabled: true,
                            others: {
                              minWidth: 90,
                            },
                          },

                          {
                            fieldName: "extended_cost",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Ext. Cost" }}
                              />
                            ),
                            disabled: true,
                          },
                          {
                            fieldName: "discount_percentage",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "discount %",
                                }}
                              />
                            ),
                            // displayTemplate: row => {
                            //     return this.state.dataExists === true ? row.discount_percentage : (
                            //         <AlagehFormGroup
                            //             div={{}}
                            //             textBox={{
                            //                 decimal: { allowNegative: false },
                            //                 value: row.discount_percentage,
                            //                 className: "txt-fld",
                            //                 name: "discount_percentage",
                            //                 events: {
                            //                     onChange: onchangegridcol.bind(
                            //                         this,
                            //                         this,
                            //                         context,
                            //                         row
                            //                     )
                            //                 },
                            //                 others: {
                            //                     onFocus: e => {
                            //                         e.target.oldvalue =
                            //                             e.target.value;
                            //                     }
                            //                 }
                            //             }}
                            //         />
                            //     );
                            // }
                          },
                          {
                            fieldName: "discount_amount",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "discount Amt.",
                                }}
                              />
                            ),
                            // displayTemplate: row => {
                            //     return (
                            //         <AlagehFormGroup
                            //             div={{}}
                            //             textBox={{
                            //                 decimal: { allowNegative: false },
                            //                 value: row.discount_amount,
                            //                 className: "txt-fld",
                            //                 name: "discount_amount",
                            //                 events: {
                            //                     onChange: onchangegridcol.bind(
                            //                         this,
                            //                         this,
                            //                         context,
                            //                         row
                            //                     )
                            //                 },
                            //                 others: {
                            //                     onFocus: e => {
                            //                         e.target.oldvalue =
                            //                             e.target.value;
                            //                     }
                            //                 }
                            //             }}
                            //         />
                            //     );
                            // }
                          },

                          {
                            fieldName: "net_extended_cost",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Net Ext. Cost",
                                }}
                              />
                            ),
                            disabled: true,
                          },
                          {
                            fieldName: "tax_percentage",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Tax %",
                                }}
                              />
                            ),
                            disabled: true,
                          },
                          {
                            fieldName: "tax_amount",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Tax Amount",
                                }}
                              />
                            ),
                            disabled: true,
                          },
                          {
                            fieldName: "total_amount",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Total Amount",
                                }}
                              />
                            ),
                            disabled: true,
                          },
                        ]}
                        keyId="service_type_id"
                        dataSource={{
                          data: this.state.receipt_entry_detail_services,
                        }}
                        paging={{ page: 0, rowsPerPage: 10 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}
