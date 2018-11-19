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
      specialities: [],
      cat_specialities: []
    };

    this.getCategories();
    this.getSpecialities();
  }

  getCategories() {
    algaehApiCall({
      uri: "/specialityAndCategory/getEmployeeCategoryMaster",
      method: "GET",
      data: {
        employee_category_status: "A"
      },
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
      data: {
        speciality_status: "A"
      },
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

  addCategorySpecialityMappings() {
    algaehApiCall({
      uri: "/specialityAndCategory/addCategorySpecialityMappings",
      method: "POST",
      data: {
        category_id: this.state.category_id,
        speciality_id: this.state.speciality_id,
        description: this.state.description,
        effective_start_date: this.state.effective_start_date
      },
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

  getCategorySpecialityMap() {
    algaehApiCall({
      uri: "/specialityAndCategory/getCategorySpecialityMap",
      method: "GET",
      data: {},
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ cat_specialities: response.data.records });
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
                  fieldName: "category_id",
                  label: <AlgaehLabel label={{ fieldName: "category" }} />,
                  disabled: true
                },
                {
                  fieldName: "speciality_id",
                  label: <AlgaehLabel label={{ fieldName: "speciality" }} />,
                  disabled: true
                },
                {
                  fieldName: "description",
                  label: <AlgaehLabel label={{ fieldName: "description" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "description",
                          value: row.description,
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
                  fieldName: "category_speciality_status",
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
                }
              ]}
              keyId="hims_d_counter_id"
              dataSource={{
                data: this.state.cat_specialities
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
