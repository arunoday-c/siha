import React, { Component } from "react";
import "./cat_spl_map.scss";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import Enumerable from "linq";
import swal from "sweetalert2";

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
    this.getCategorySpecialityMap();
  }

  resetSaveState() {
    this.setState({
      category_id: null,
      speciality_id: null,
      description: null,
      effective_start_date: null
    });
  }

  getCategories() {
    algaehApiCall({
      uri: "/specialityAndCategory/getEmployeeCategoryMaster",
      module: "masterSettings",
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
      module: "masterSettings",
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
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/specialityAndCategory/addCategorySpecialityMappings",
          module: "masterSettings",
          method: "POST",
          data: {
            category_id: this.state.category_id,
            speciality_id: this.state.speciality_id,
            description: this.state.description,
            effective_start_date: this.state.effective_start_date,
            category_speciality_status: "A"
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record Added Successfully",
                type: "success"
              });
              this.resetSaveState();
              this.getCategorySpecialityMap();
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
    });
  }

  getCategorySpecialityMap() {
    algaehApiCall({
      uri: "/specialityAndCategory/getCategorySpecialityMap",
      module: "masterSettings",
      method: "GET",
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

  deleteCategorySpecialityMap(data) {
    swal({
      title: "Delete Vendor " + data.description + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/specialityAndCategory/deleteCategorySpecialityMap",
          module: "masterSettings",
          data: {
            hims_m_category_speciality_mappings_id:
              data.hims_m_category_speciality_mappings_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getCategorySpecialityMap();
            } else if (!response.data.success) {
              swalMessage({
                title: response.data.message,
                type: "error"
              });
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
          type: "error"
        });
      }
    });
  }

  updateCategorySpeciality(data) {
    data.category_speciality_status === "I"
      ? algaehApiCall({
          uri: "/specialityAndCategory/updateCategorySpecialityMap",
          module: "masterSettings",
          data: {
            hims_m_category_speciality_mappings_id:
              data.hims_m_category_speciality_mappings_id
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success"
              });
              this.getCategorySpecialityMap();
            } else if (!response.data.records.success) {
              swalMessage({
                title: response.data.records.message,
                type: "error"
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        })
      : algaehApiCall({
          uri: "/specialityAndCategory/updateCategorySpecialityMap",
          module: "masterSettings",
          data: {
            category_id: data.category_id,
            speciality_id: data.speciality_id,
            description: data.description,
            category_speciality_status: "A"
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success"
              });
              this.getCategorySpecialityMap();
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

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  render() {
    return (
      <div className="cat_spl_map">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col form-group mandatory" }}
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
            div={{ className: "col form-group mandatory" }}
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
            div={{ className: "col form-group mandatory" }}
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
            div={{ className: "col form-group mandatory" }}
            label={{
              fieldName: "effective_start_date",
              isImp: true
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
              onClick={this.addCategorySpecialityMappings.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              Add to list
            </button>
          </div>
        </div>
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12">
                <div data-validate="currencyDiv" id="categorySpecMapGridCntr">
                  <AlgaehDataGrid
                    datavalidate="data-validate='currencyDiv'"
                    id="categorySpecMapGrid"
                    columns={[
                      // {
                      //   fieldName: "action",
                      //   label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      //   displayTemplate: row => {
                      //     return (
                      //       <span>
                      //         <i
                      //           className="fas fa-trash-alt"
                      //           aria-hidden="true"
                      //           onClick={this.deleteCategorySpecialityMap.bind(
                      //             this,
                      //             row
                      //           )}
                      //         />
                      //       </span>
                      //     );
                      //   },
                      //   others: {
                      //     maxWidth: 50,
                      //     resizable: false,
                      //     filterable: false
                      //   }
                      // },
                      {
                        fieldName: "speciality_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "speciality" }} />
                        ),
                        displayTemplate: row => {
                          let x = Enumerable.from(this.state.specialities)
                            .where(
                              w =>
                                w.hims_d_employee_speciality_id ===
                                row.speciality_id
                            )
                            .firstOrDefault();

                          return (
                            <span>
                              {x !== undefined ? x.speciality_name : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let x = Enumerable.from(this.state.specialities)
                            .where(
                              w =>
                                w.hims_d_employee_speciality_id ===
                                row.speciality_id
                            )
                            .firstOrDefault();

                          return (
                            <span>
                              {x !== undefined ? x.speciality_name : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "category_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "category" }} />
                        ),
                        displayTemplate: row => {
                          let x = Enumerable.from(this.state.categories)
                            .where(
                              w =>
                                w.hims_employee_category_id === row.category_id
                            )
                            .firstOrDefault();

                          return (
                            <span>
                              {x !== undefined ? x.employee_category_name : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let x = Enumerable.from(this.state.categories)
                            .where(
                              w =>
                                w.hims_employee_category_id === row.category_id
                            )
                            .firstOrDefault();

                          return (
                            <span>
                              {x !== undefined ? x.employee_category_name : ""}
                            </span>
                          );
                        }
                      },

                      {
                        fieldName: "description",
                        label: (
                          <AlgaehLabel label={{ fieldName: "description" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "description",
                                value: row.description,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
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
                        label: <AlgaehLabel label={{ fieldName: "status" }} />,
                        displayTemplate: row => {
                          return row.category_speciality_status === "A"
                            ? "Active"
                            : "Inactive";
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{}}
                              selector={{
                                name: "category_speciality_status",
                                className: "select-fld",
                                value: row.category_speciality_status,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_STATUS
                                },
                                others: {
                                  errormessage: "Status - cannot be blank",
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
                    filter={true}
                    isEditable={true}
                    actions={{
                      allowDelete: false
                    }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      //onDelete: this.deleteCategorySpecialityMap.bind(this),
                      onDone: () => {}
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

export default CategorySpeciality;
