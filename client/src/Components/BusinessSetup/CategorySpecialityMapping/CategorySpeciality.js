import React, { Component } from "react";
import "./cat_spl_map.css";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";

class CategorySpeciality extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      specialities: []
    };

    this.getCategories();
    this.getSpecialities();
  }

  getCategories() {
    algaehApiCall({
      uri: "/specialityAndCategory/getEmployeeCategoryMaster",
      method: "GET",
      data: {},
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ categories: response.data.records });
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
  getSpecialities() {
    algaehApiCall({
      uri: "/specialityAndCategory/getEmployeeSpecialityMaster",
      method: "GET",
      data: {},
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ specialities: response.data.records });
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

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleDropDown(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  mapCatSpl(e) {}

  render() {
    return (
      <div className="cat_spl_map">
        <div className="col-lg-12">
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                fieldName: "category",
                isImp: true
              }}
              selector={{
                name: "category_id",
                className: "select-fld",
                value: this.state.category_id,
                dataSource: {
                  textField: "employee_category_name",
                  valueField: "hims_employee_category_id",
                  data: this.state.categories
                },
                onChange: this.handleDropDown.bind(this)
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                fieldName: "speciality",
                isImp: true
              }}
              selector={{
                name: "speciality_id",
                className: "select-fld",
                value: this.state.speciality_id,
                dataSource: {
                  textField: "speciality_name",
                  valueField: "hims_d_employee_speciality_id",
                  data: this.state.specialities
                },
                onChange: this.handleDropDown.bind(this)
              }}
            />

            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                fieldName: "description",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "description",
                value: this.state.description,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlgaehDateHandler
              div={{ className: "col" }}
              label={{
                fieldName: "effective_start_date"
              }}
              textBox={{
                className: "txt-fld",
                name: "effective_start_date"
              }}
              // maxDate={new Date()}
              events={{
                onChange: selDate => {
                  this.setState({
                    effective_start_date: selDate
                  });
                }
              }}
              value={this.state.effective_start_date}
            />

            <div className="col">
              <button
                onClick={this.mapCatSpl.bind(this)}
                style={{ marginTop: 21 }}
                className="btn btn-primary"
              >
                <AlgaehLabel
                  label={{
                    fieldName: "add_to_list"
                  }}
                />
              </button>
            </div>
          </div>
          <div data-validate="currencyDiv" id="currencyGridCntr">
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
                          ? "Space"
                          : row.thousand_separator === "P"
                          ? "Period"
                          : row.thousand_separator === "C"
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
                    <AlgaehLabel label={{ fieldName: "decimal_separator" }} />
                  ),
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.decimal_separator === "P"
                          ? "Period"
                          : row.decimal_separator === "C"
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
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: () => {},
                onDone: () => {}
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CategorySpeciality;
