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

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      departments: []
    };
    this.getCategories();
    this.getDepts();
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
      category_code: "",
      category_name: "",
      sub_department_id: null
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  getDepts() {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ departments: response.data.records });
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

  getCategories() {
    algaehApiCall({
      uri: "/shiftAndCounter/getShiftMaster",
      method: "GET",
      data: {},
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ shifts: response.data.records });
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
          uri: "/department/makeDepartmentInActive",
          data: {
            hims_d_department_id: data.hims_d_department_id
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success"
              });
              this.getAllDepartments();
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
          uri: "/department/updateDepartment",
          data: {
            department_name: data.department_name,
            department_desc: data.department_name,
            department_type: data.department_type,
            arabic_department_name: data.arabic_department_name,
            effective_start_date: data.effective_start_date,
            hims_d_department_id: data.hims_d_department_id
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

  deleteSpeciality(data) {
    swal({
      title: "Delete Speciality " + data.category_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/department/deleteDepartment",
          data: {
            hims_d_employee_category_id: data.hims_d_employee_category_id
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

  addSpeciality(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/shiftAndCounter/addShiftMaster",
          method: "POST",
          data: {
            category_code: this.state.category_code,
            category_name: this.state.category_name
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Speciality added Successfully",
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
                name: "category_code",
                value: this.state.category_code,
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
                name: "category_name",
                value: this.state.category_name,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col" }}
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
                fieldName: "effective_start_date"
              }}
              textBox={{
                className: "txt-fld",
                name: "effective_start_date"
              }}
              disabled={!this.state.effective_start_date}
              minDate={new Date()}
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
                onClick={this.addSpeciality.bind(this)}
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
                  fieldName: "category_code",
                  label: <AlgaehLabel label={{ fieldName: "category_code" }} />,
                  disabled: true
                },
                {
                  fieldName: "category_name",
                  label: <AlgaehLabel label={{ fieldName: "category_name" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "category_name",
                          value: row.category_name,
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
                  fieldName: "sub_department_id",
                  label: (
                    <AlgaehLabel label={{ fieldName: "sub_department_id" }} />
                  ),
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.shift_status === "A" ? "Active" : "Inactive"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        selector={{
                          name: "sub_department_id",
                          className: "select-fld",
                          value: row.shift_status,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: this.state.departments
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
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteSpeciality.bind(this),
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
