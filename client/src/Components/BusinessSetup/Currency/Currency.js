import React, { Component } from "react";
import "./currency.css";
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
      confirmButtonText: "Yes!",
      confirmButtonColor: "#",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/currency/deleteCurrencyMaster",
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
    debugger;
    algaehApiCall({
      uri: "/currency/updateCurrencyMaster",
      data: {
        currency_code: data.currency_code,
        currency_description: data.currency_description,
        symbol: data.symbol,
        decimal_places: data.decimal_places,
        symbol_position: data.symbol_position,
        thousand_separator: data.thousand_separator,
        decimal_separator: data.decimal_separator,
        negative_separator: data.negative_separator,
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
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "currency_description",
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
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-2" }}
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
              div={{ className: "col-lg-2" }}
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
              div={{ className: "col-lg-2" }}
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
              div={{ className: "col-lg-2" }}
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
              div={{ className: "col-lg-2" }}
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

            <div className="col-lg-3 margin-top-15">
              <button
                onClick={this.addCurrencyCodes.bind(this)}
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>
          <div
            className="form-details"
            data-validate="currencyDiv"
            id="currencyGridCntr"
          >
            <AlgaehDataGrid
              datavalidate="data-validate='currencyDiv'"
              id="currency-grid"
              columns={[
                {
                  fieldName: "currency_code",
                  label: <AlgaehLabel label={{ fieldName: "currency_code" }} />,
                  disabled: true
                },
                {
                  fieldName: "currency_description",
                  label: (
                    <AlgaehLabel
                      label={{ fieldName: "currency_description" }}
                    />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "currency_description",
                          value: row.currency_description,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Description - cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
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
                            onChange: this.changeGridEditors.bind(this, row)
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
                    <AlgaehLabel label={{ fieldName: "decimal_places" }} />
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
                            errormessage: "Decimal Places - cannot be blank",
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
                    <AlgaehLabel label={{ fieldName: "symbol_position" }} />
                  ),
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.symbol_position === "BWS"
                          ? "BEFORE WITH SPACE"
                          : row.symbol_position === "BS"
                          ? "BEFORE SPACE"
                          : row.symbol_position === "AWS"
                          ? "AFTER WITH SPACE"
                          : row.symbol_position === "AS"
                          ? "AFTER SPACE"
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
                            errormessage: "Symbol Position - cannot be blank",
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
                    <AlgaehLabel label={{ fieldName: "thousand_separator" }} />
                  ),
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.thousand_separator === "S"
                          ? "SPACE"
                          : row.thousand_separator === "P"
                          ? "PERIOD"
                          : row.thousand_separator === "C"
                          ? "COMMA"
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
                    <AlgaehLabel label={{ fieldName: "decimal_separator" }} />
                  ),
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.thousand_separator === "P"
                          ? "PERIOD"
                          : row.thousand_separator === "C"
                          ? "COMMA"
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
                            errormessage: "Decimal Separator - cannot be blank",
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
                    <AlgaehLabel label={{ fieldName: "negative_separator" }} />
                  ),
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.thousand_separator === "TR"
                          ? "TRAILING"
                          : row.thousand_separator === "LD"
                          ? "LEADING"
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
    );
  }
}

export default Currency;
