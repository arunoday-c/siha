import React, { Component } from "react";
import "./category.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import swal from "sweetalert2";
import moment from "moment";

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    };
    this.getCategories();
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  dropDownHandle(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  clearState() {
    this.setState({
      employee_category_code: "",
      employee_category_name: "",
      arabic_name: "",
      sub_department_id: null
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  getCategories() {
    algaehApiCall({
      uri: "/specialityAndCategory/getEmployeeCategoryMaster",
      module: "masterSettings",
      method: "GET",
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

  updateSpeciality(data) {
    data.department_status === "I"
      ? algaehApiCall({
          uri: "/specialityAndCategory/makeEmployeeCategoryInActive",
          module: "masterSettings",
          data: {
            hims_employee_category_id: data.hims_employee_category_id
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success"
              });
              this.getCategories();
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
          uri: "/specialityAndCategory/updateEmployeeCategoryMaster",
          module: "masterSettings",
          data: {
            hims_employee_category_id: data.hims_employee_category_id,
            employee_category_code: data.employee_category_code,
            employee_category_name: data.employee_category_name,
            employee_category_desc: data.employee_category_name,
            effective_start_date: data.effective_start_date,
            employee_category_status: data.employee_category_status,
            arabic_name: data.arabic_name
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success"
              });
              this.getCategories();
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

  deleteCategory(data) {
    swal({
      title: "Delete category " + data.employee_category_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/specialityAndCategory/deleteEmployeeCategoryMaster",
          module: "masterSettings",
          data: {
            hims_employee_category_id: data.hims_employee_category_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getCategories();
            } else if (!response.data.success) {
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
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  addCategory(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/specialityAndCategory/addEmployeeCategoryMaster",
          module: "masterSettings",
          method: "POST",
          data: {
            employee_category_code: this.state.employee_category_code,
            employee_category_name: this.state.employee_category_name,
            employee_category_desc: this.state.employee_category_name,
            arabic_name: this.state.arabic_name,
            employee_category_status: "A",
            effective_start_date: this.state.effective_start_date
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Category added Successfully",
                type: "success"
              });

              this.getCategories();
              this.clearState();
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
      <div className="category">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                fieldName: "category_code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "employee_category_code",
                value: this.state.employee_category_code,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                fieldName: "category_name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "employee_category_name",
                value: this.state.employee_category_name,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col arabic-txt-fld" }}
              label={{
                fieldName: "arabic_name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "arabic_name",
                value: this.state.arabic_name,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlgaehDateHandler
              div={{ className: "col-lg-3" }}
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

            <div className="col margin-top-15">
              <button
                type="submit"
                onClick={this.addCategory.bind(this)}
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>
          <div
            className="form-details"
            data-validate="specialityDiv"
            id="shiftGridCntr"
          >
            <AlgaehDataGrid
              id="shift-grid"
              datavalidate="data-validate='specialityDiv'"
              columns={[
                {
                  fieldName: "employee_category_code",
                  label: <AlgaehLabel label={{ fieldName: "category_code" }} />,
                  disabled: true
                },
                {
                  fieldName: "employee_category_name",
                  label: <AlgaehLabel label={{ fieldName: "category_name" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "employee_category_name",
                          value: row.employee_category_name,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Name - cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "arabic_name",
                  label: <AlgaehLabel label={{ fieldName: "arabic_name" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "arabic_name",
                          value: row.arabic_name,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Arabic Name - cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "effective_start_date",
                  label: (
                    <AlgaehLabel
                      label={{ fieldName: "effective_start_date" }}
                    />
                  ),
                  displayTemplate: row => {
                    return (
                      <span>
                        {moment(row.effective_start_date).format("DD-MM-YYYY")}
                      </span>
                    );
                  },
                  disabled: true
                },
                {
                  fieldName: "employee_category_status",
                  label: <AlgaehLabel label={{ fieldName: "status" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.employee_category_status === "A"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        selector={{
                          name: "employee_category_status",
                          className: "select-fld",
                          value: row.employee_category_status,
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
              keyId="hims_d_employee_category_id"
              dataSource={{
                data: this.state.categories
              }}
              filter={true}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteCategory.bind(this),
                onDone: this.updateSpeciality.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Category;
