import React, { Component } from "react";
import "./currency.scss";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

class Currency extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency_code: "",
      currency_description: ""
    };
    this.getCurrency();
  }

  getCurrency() {
    algaehApiCall({
      uri: "/currency/getCurrencyMaster",
      module: "masterSettings",
      method: "GET",
      data: {},
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ currencies: response.data.records });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  deleteCurrency(data) {
    swal({
      title: "Delete the currency " + data.currency_description + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/currency/deleteCurrencyMaster",
          module: "masterSettings",
          data: {
            hims_d_currency_id: data.hims_d_currency_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getCurrency();
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "warning"
        });
      }
    });
  }

  updateCurrency(data) {
    algaehApiCall({
      uri: "/currency/updateCurrencyMaster",
      module: "masterSettings",
      data: {
        currency_code: data.currency_code,
        currency_description: data.currency_description,
        symbol: data.symbol,
        decimal_places: data.decimal_places,
        symbol_position: data.symbol_position,
        thousand_separator: data.thousand_separator,
        decimal_separator: data.decimal_separator,
        negative_separator: data.negative_separator,
        currency_symbol: data.currency_symbol,
        hims_d_currency_id: data.hims_d_currency_id
      },
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });
          this.getCurrency();
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  resetSaveState() {
    this.setState({
      currency_code: "",
      currency_description: "",
      symbol: "",
      decimal_places: "",
      symbol_position: "",
      thousand_separator: "",
      decimal_separator: "",
      negative_separator: ""
    });
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandle(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  addCurrencyCodes(e) {
    e.preventDefault();
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/currency/addCurrencyMaster",
          module: "masterSettings",
          method: "POST",
          data: {
            currency_code: this.state.currency_code,
            currency_description: this.state.currency_description,
            currency_symbol: this.state.currency_symbol,
            decimal_places: this.state.decimal_places,
            symbol_position: this.state.symbol_position,
            thousand_separator: this.state.thousand_separator,
            decimal_separator: this.state.decimal_separator,
            negative_separator: this.state.negative_separator
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "currency added Successfully",
                type: "success"
              });

              this.getCurrency();
              this.resetSaveState();
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.response.data.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  render() {
    return (
      <div className="currency">
        <div className="row inner-top-search">
          <AlagehFormGroup
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              fieldName: "currency_code",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "currency_code",
              value: this.state.currency_code,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-2 mandatory" }}
            label={{
              forceLabel: "Currency Desc.",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "currency_description",
              value: this.state.currency_description,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-2 mandatory" }}
            label={{
              fieldName: "symbol",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "currency_symbol",
              value: this.state.currency_symbol,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-2 mandatory" }}
            label={{
              fieldName: "decimal_places",
              isImp: true
            }}
            selector={{
              name: "decimal_places",
              className: "select-fld",
              value: this.state.decimal_places,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.DECIMAL_PLACES
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory" }}
            label={{
              fieldName: "symbol_position",
              isImp: true
            }}
            selector={{
              name: "symbol_position",
              className: "select-fld",
              value: this.state.symbol_position,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.SYMBOL_POSITION
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory" }}
            label={{
              fieldName: "thousand_separator",
              isImp: true
            }}
            selector={{
              name: "thousand_separator",
              className: "select-fld",
              value: this.state.thousand_separator,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.THOUSAND_SEPARATOR
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory" }}
            label={{
              fieldName: "decimal_separator",
              isImp: true
            }}
            selector={{
              name: "decimal_separator",
              className: "select-fld",
              value: this.state.decimal_separator,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.DECIMAL_SEPARATOR
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              fieldName: "negative_separator",
              isImp: true
            }}
            selector={{
              name: "negative_separator",
              className: "select-fld",
              value: this.state.negative_separator,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.NEGATIVE_SEPARATOR
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          />

          <div className="col">
            <button
              onClick={this.addCurrencyCodes.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12">
                <div data-validate="currencyDiv" id="currencyGridCntr">
                  <AlgaehDataGrid
                    datavalidate="data-validate='currencyDiv'"
                    id="currency-grid"
                    columns={[
                      {
                        fieldName: "currency_code",
                        label: (
                          <AlgaehLabel label={{ fieldName: "currency_code" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "currency_description",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "currency_description" }}
                          />
                        ),
                        disabled: true
                        // editorTemplate: row => {
                        //   return (
                        //     <AlagehFormGroup
                        //       div={{ className: "col" }}
                        //       textBox={{
                        //         className: "txt-fld",
                        //         name: "currency_description",
                        //         value: row.currency_description,
                        //         events: {
                        //           onChange: this.changeGridEditors.bind(this, row)
                        //         },
                        //         others: {
                        //           errormessage: "Description - cannot be blank",
                        //           required: true
                        //         }
                        //       }}
                        //     />
                        //   );
                        // }
                      },
                      {
                        fieldName: "currency_symbol",
                        label: <AlgaehLabel label={{ fieldName: "symbol" }} />,
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "currency_symbol",
                                value: row.currency_symbol,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Symbol - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "decimal_places",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "decimal_places" }}
                          />
                        ),
                        displayTemplate: row => {
                          return <span>{row.decimal_places}</span>;
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "decimal_places",
                                className: "select-fld",
                                value: row.decimal_places,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.DECIMAL_PLACES
                                },
                                others: {
                                  errormessage:
                                    "Decimal Places - cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "symbol_position",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "symbol_position" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.symbol_position === "BWS"
                                ? "Before without space"
                                : row.symbol_position === "BS"
                                ? "Before space"
                                : row.symbol_position === "AWS"
                                ? "After without space"
                                : row.symbol_position === "AS"
                                ? "After space"
                                : null}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "symbol_position",
                                className: "select-fld",
                                value: row.symbol_position,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.SYMBOL_POSITION
                                },
                                others: {
                                  errormessage:
                                    "Symbol Position - cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "thousand_separator",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "thousand_separator" }}
                          />
                        ),

                        displayTemplate: row => {
                          return (
                            <span>
                              {row.thousand_separator === " "
                                ? "Space"
                                : row.thousand_separator === "."
                                ? "Period"
                                : row.thousand_separator === ","
                                ? "Comma"
                                : null}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "thousand_separator",
                                className: "select-fld",
                                value: row.thousand_separator,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.THOUSAND_SEPARATOR
                                },
                                others: {
                                  errormessage:
                                    "Thousand Separator - cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "decimal_separator",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "decimal_separator" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.decimal_separator === "."
                                ? "Period"
                                : row.decimal_separator === ","
                                ? "Comma"
                                : null}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "decimal_separator",
                                className: "select-fld",
                                value: row.decimal_separator,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.DECIMAL_SEPARATOR
                                },
                                others: {
                                  errormessage:
                                    "Decimal Separator - cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "negative_separator",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "negative_separator" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.negative_separator === "TR"
                                ? "Trailing"
                                : row.negative_separator === "LD"
                                ? "Leading"
                                : null}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "negative_separator",
                                className: "select-fld",
                                value: row.negative_separator,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.NEGATIVE_SEPARATOR
                                },
                                others: {
                                  errormessage:
                                    "Negative Separator - cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      }
                    ]}
                    keyId="hims_d_counter_id"
                    dataSource={{
                      data: this.state.currencies
                    }}
                    filter={true}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: this.deleteCurrency.bind(this),
                      onDone: this.updateCurrency.bind(this)
                    }}
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

export default Currency;
