import React, { Component } from "react";
import "./speciality.scss";
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
import Enumerable from "linq";

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

  getDepts() {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      method: "GET",
      module: "masterSettings",
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
      uri: "/specialityAndCategory/getEmployeeSpecialityMaster",
      module: "masterSettings",
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

  updateSpeciality(data) {
    data.speciality_status === "I"
      ? algaehApiCall({
        uri: "/specialityAndCategory/makeEmployeeSpecialityInActive",
        module: "masterSettings",
        data: {
          hims_d_employee_speciality_id: data.hims_d_employee_speciality_id
        },
        method: "PUT",
        onSuccess: response => {
          if (response.data.records.success) {
            swalMessage({
              title: "Record updated successfully",
              type: "success"
            });
            this.getSpeciality();
          } else if (!response.data.records.success) {
            swalMessage({
              title: response.data.records.message,
              type: "error"
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
      })
      : algaehApiCall({
        uri: "/specialityAndCategory/updateEmployeeSpecialityMaster",
        module: "masterSettings",
        data: {
          hims_d_employee_speciality_id: data.hims_d_employee_speciality_id,
          speciality_code: data.speciality_code,
          speciality_name: data.speciality_name,
          speciality_desc: data.speciality_name,
          arabic_name: data.arabic_name,
          sub_department_id: data.sub_department_id,
          speciality_status: data.speciality_status
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
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/specialityAndCategory/deleteEmployeeSpecialityMaster",
          module: "masterSettings",
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
      }
    });
  }

  addSpeciality(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/specialityAndCategory/addEmployeeSpecialityMaster",
          module: "masterSettings",
          method: "POST",
          data: {
            speciality_code: this.state.speciality_code,
            speciality_name: this.state.speciality_name,
            speciality_desc: this.state.speciality_name,
            sub_department_id: this.state.sub_department_id,
            arabic_name: this.state.arabic_name
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Speciality added successfully",
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
        <div className="row inner-top-search">
          <AlagehFormGroup
            div={{ className: "col form-group mandatory" }}
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
            div={{ className: "col form-group mandatory" }}
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
            div={{ className: "col arabic-txt-fld form-group mandatory" }}
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
            div={{ className: "col form-group mandatory" }}
            label={{
              fieldName: "department",
              isImp: true
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
              Add to List
            </button>
          </div>
        </div>
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12">
                <div
                  className="form-details"
                  data-validate="specialityDiv"
                  id="specialityGridCntr"
                >
                  <AlgaehDataGrid
                    id="specialityGrid"
                    datavalidate="data-validate='specialityDiv'"
                    columns={[
                      {
                        fieldName: "speciality_code",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "speciality_code" }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "speciality_name",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "speciality_name" }}
                          />
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
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
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
                        label: (
                          <AlgaehLabel label={{ fieldName: "arabic_name" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "arabic_name",
                                value: row.arabic_name,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
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
                          <AlgaehLabel
                            label={{ fieldName: "department_name" }}
                          />
                        ),
                        displayTemplate: row => {
                          let x = Enumerable.from(this.state.departments)
                            .where(
                              w =>
                                w.hims_d_sub_department_id ===
                                row.sub_department_id
                            )
                            .firstOrDefault();

                          return (
                            <span>
                              {x !== undefined ? x.sub_department_name : ""}
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
                                value: row.sub_department_id,
                                dataSource: {
                                  textField: "sub_department_name",
                                  valueField: "hims_d_sub_department_id",
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
                      },
                      // {
                      //   fieldName: "effective_start_date",
                      //   label: (
                      //     <AlgaehLabel
                      //       label={{ fieldName: "effective_start_date" }}
                      //     />
                      //   )
                      // },
                      {
                        fieldName: "speciality_status",
                        label: <label className="style_Label">Status</label>,
                        displayTemplate: row => {
                          return row.speciality_status === "A"
                            ? "Active"
                            : row.speciality_status === "I"
                              ? "Inactive"
                              : "----------";
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              selector={{
                                name: "speciality_status",
                                className: "select-fld",
                                value: row.speciality_status,
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
                    keyId="hims_d_employee_speciality_id"
                    dataSource={{
                      data: this.state.specialities
                    }}
                    filter={true}
                    isEditable={true}
                    actions={{
                      allowDelete: false
                    }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => { },
                      onDelete: this.deleteSpeciality.bind(this),
                      onDone: this.updateSpeciality.bind(this)
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

export default Speciality;
