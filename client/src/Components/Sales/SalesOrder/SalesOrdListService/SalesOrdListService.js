import React, { Component } from "react";
import MyContext from "../../../../utils/MyContext";
import "./../../../../styles/site.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";

import AlgaehAutoSearch from "../../../Wrapper/autoSearch";

import {
  servicechangeText,
  numberchangeTexts,
  AddSerices,
  deleteSalesDetail,
  onchangegridcol,
  qtyonchangegridcol,
  changeTexts,
} from "./SalesOrdListServiceEvents";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import _ from "lodash";
import GlobalVariables from "../../../../utils/GlobalVariables.json";

export default class SalesOrdListService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectBatch: false,
      selectBatchButton: true,

      addItemButton: true,
      service_name: "",
      addedItem: false,

      services_id: null,
      quantity: 0,
      discount_percentage: 0,
      unit_cost: 0,
      tax_percentage: 0,
      service_frequency: null,
      comments: "",
      arabic_comments: ""
    };
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.SALESIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.SALESIOputs);
  }

  textAreaEvent(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {(context) => (
            <>
              <div className="col-3">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="row">
                    <AlgaehAutoSearch
                      div={{ className: "col-12 form-group mandatory" }}
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
                                    <b>
                                      {_.startCase(_.toLower(service_type))}
                                    </b>
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
                      searchName="servicetypeservice"
                      onClick={servicechangeText.bind(this, this)}
                      extraParameters={{
                        service_type_id: 7
                      }}
                      ref={(attReg) => {
                        this.attReg = attReg;
                      }}
                      others={{
                        disabled: this.state.serviceAdd,
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{
                        forceLabel: "Quantity",
                      }}
                      textBox={{
                        number: {
                          allowNegative: false,
                          thousandSeparator: ",",
                        },
                        className: "txt-fld",
                        name: "quantity",
                        value: this.state.quantity,
                        dontAllowKeys: ["-", "e"],
                        events: {
                          onChange: numberchangeTexts.bind(this, this, context),
                        },
                        others: {
                          disabled: this.state.dataExitst,
                          tabIndex: "3",
                        },
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{ forceLabel: "Frequency", isImp: true }}
                      selector={{
                        sort: "off",
                        name: "service_frequency",
                        className: "select-fld",
                        value: this.state.service_frequency,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.SERVICE_FREQUENCY,
                        },
                        onChange: changeTexts.bind(this, this),
                        others: {
                          disabled: this.state.dataExitst,
                          tabIndex: "4",
                        },
                        onClear: () => {
                          this.setState({
                            service_frequency: null,
                          });
                        },
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{
                        forceLabel: "Discount (%)",
                        isImp: false,
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "discount_percentage",
                        value: this.state.discount_percentage,
                        events: {
                          onChange: numberchangeTexts.bind(this, this, context),
                        },
                        others: {
                          tabIndex: "4",
                        },
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-6", }}
                      label={{
                        fieldName: "tax percentage",
                        isImp: this.state.Applicable,
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "tax_percentage",
                        value: this.state.tax_percentage,
                        events: {
                          onChange: numberchangeTexts.bind(this, this, context),
                        }
                      }}
                    />
                    {/* <div className="col-6 form-group mandatory">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Tax %",
                        }}
                      />
                      <h6>
                        {this.state.tax_percentage
                          ? this.state.tax_percentage
                          : "-----------"}
                      </h6>
                    </div> */}

                    <AlagehFormGroup
                      div={{ className: "col-6 mandatory  form-group" }}
                      label={{
                        forceLabel: "Unit Cost",
                        isImp: false,
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "unit_cost",
                        value: this.state.unit_cost,
                        events: {
                          onChange: numberchangeTexts.bind(this, this, context),
                        },
                        others: {
                          tabIndex: "6",
                        },
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-12", }}
                      label={{
                        fieldName: "Description in English"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "comments",
                        value: this.state.comments,
                        events: {
                          onChange: changeTexts.bind(this, this),
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-12", }}
                      label={{
                        fieldName: "Description in Arabic"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "arabic_comments",
                        value: this.state.arabic_comments,
                        events: {
                          onChange: changeTexts.bind(this, this),
                        }
                      }}
                    />

                    <div className="col-12 subFooter-btn">
                      <button
                        className="btn btn-primary"
                        onClick={AddSerices.bind(this, this, context)}
                        disabled={this.state.addItemButton}
                        tabIndex="5"
                      >
                        Add Service
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-9">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="row">
                    <div className="col-12" id="SaleOrderServiceGrid_Cntr">
                      <AlgaehDataGrid
                        id="SaleOrderServiceGrid"
                        columns={[
                          {
                            fieldName: "actions",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Action" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span
                                  onClick={deleteSalesDetail.bind(
                                    this,
                                    this,
                                    context,
                                    row
                                  )}
                                >
                                  <i
                                    style={{
                                      pointerEvents:
                                        this.state.from_invoice === true ? "none"
                                          : "",
                                      opacity:
                                        this.state.from_invoice === true ? "0.1"
                                          : ""
                                    }}
                                    className="fas fa-trash-alt" />
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
                              return this.state.dataExists === true ? (
                                parseFloat(row.quantity)
                              ) : (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      number: {
                                        allowNegative: false,
                                        thousandSeparator: ",",
                                      },
                                      dontAllowKeys: ["-", "e"],
                                      value: parseFloat(row.quantity),
                                      className: "txt-fld",
                                      name: "quantity",
                                      events: {
                                        onChange: qtyonchangegridcol.bind(
                                          this,
                                          this,
                                          context,
                                          row
                                        ),
                                      },
                                      others: {
                                        onFocus: (e) => {
                                          e.target.oldvalue = e.target.value;
                                        },
                                      },
                                    }}
                                  />
                                );
                            },
                            others: {
                              minWidth: 90,
                            },
                          },
                          {
                            fieldName: "service_frequency",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Frequency" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              let display = GlobalVariables.SERVICE_FREQUENCY.filter(
                                (f) => f.value === row.service_frequency
                              );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].name
                                    : ""}
                                </span>
                              );
                            },
                            disabled: true,
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
                            displayTemplate: (row) => {
                              return this.state.dataExists === true ? (
                                row.discount_percentage
                              ) : (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      decimal: { allowNegative: false },
                                      value: row.discount_percentage,
                                      className: "txt-fld",
                                      name: "discount_percentage",
                                      events: {
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          context,
                                          row
                                        ),
                                      },
                                      others: {
                                        onFocus: (e) => {
                                          e.target.oldvalue = e.target.value;
                                        },
                                      },
                                    }}
                                  />
                                );
                            },
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
                          {
                            fieldName: "comments",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Description",
                                }}
                              />
                            ),
                            disabled: true,
                            others: {
                              minWidth: 200,
                            },
                          },
                          {
                            fieldName: "arabic_comments",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Description in Arabic",
                                }}
                              />
                            ),
                            disabled: true,
                            others: {
                              minWidth: 200,
                            },
                          },
                        ]}
                        keyId="service_type_id"
                        dataSource={{
                          data: this.state.sales_order_services,
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