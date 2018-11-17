import React, { Component } from "react";
import "./speciality.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import swal from "sweetalert2";

class Speciality extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialities: [],
      departments: []
    };
    this.getSpeciality();
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
      speciality_code: "",
      speciality_name: "",
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

  getSpeciality() {
    algaehApiCall({
      uri: "/getEmployeeSpecialityMaster",
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
              this.getSpeciality();
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
      title: "Delete Speciality " + data.speciality_name + "?",
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
            hims_d_employee_speciality_id: data.hims_d_employee_speciality_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getSpeciality();
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
            speciality_code: this.state.speciality_code,
            speciality_name: this.state.speciality_name
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Speciality added Successfully",
                type: "success"
              });

              this.getSpeciality();
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
      <div className="speciality">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                fieldName: "speciality_code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "speciality_code",
                value: this.state.speciality_code,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                fieldName: "speciality_name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "speciality_name",
                value: this.state.speciality_name,
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

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                fieldName: "departments"
              }}
              selector={{
                name: "sub_department_id",
                className: "select-fld",
                value: this.state.sub_department_id,
                dataSource: {
                  textField: "sub_department_name",
                  valueField: "hims_d_sub_department_id",
                  data: this.state.departments
                },
                onChange: this.dropDownHandle.bind(this)
              }}
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
                  fieldName: "speciality_code",
                  label: (
                    <AlgaehLabel label={{ fieldName: "speciality_code" }} />
                  ),
                  disabled: true
                },
                {
                  fieldName: "speciality_name",
                  label: (
                    <AlgaehLabel label={{ fieldName: "speciality_name" }} />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "speciality_name",
                          value: row.speciality_name,
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
              keyId="hims_d_employee_speciality_id"
              dataSource={{
                data: this.state.specialities
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

export default Speciality;
