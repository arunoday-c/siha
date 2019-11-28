import React, { Component } from "react";
import "./employee_groups.scss";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import {
  AlgaehValidation,
  getAmountFormart
} from "../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import swal from "sweetalert2";

class EmployeeGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee_groups: []
    };

    this.getEmployeeGroups();
  }

  getEmployeeGroups() {
    algaehApiCall({
      uri: "/hrsettings/getEmployeeGroups",
      module: "hrManagement",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employee_groups: res.data.records
          });
        }
      },

      onFailure: err => {}
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  clearState() {
    this.setState({
      group_description: "",
      monthly_accrual_days: "",
      airfare_eligibility: "",
      airfare_amount: ""
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  deleteEmployeeGroups(data) {
    swal({
      title: "Are you sure you want to delete " + data.group_description + " ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/hrsettings/updateEmployeeGroup",
          module: "hrManagement",
          data: {
            hims_d_employee_group_id: data.hims_d_employee_group_id,
            group_description: data.group_description,
            monthly_accrual_days: data.monthly_accrual_days,
            airfare_eligibility: data.airfare_eligibility,
            airfare_amount: data.airfare_amount,
            record_status: "I"
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getEmployeeGroups();
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

  updateEmployeeGroups(data) {
    algaehApiCall({
      uri: "/hrsettings/updateEmployeeGroup",
      module: "hrManagement",
      method: "PUT",
      data: {
        hims_d_employee_group_id: data.hims_d_employee_group_id,
        group_description: data.group_description,
        monthly_accrual_days: data.monthly_accrual_days,
        airfare_eligibility: data.airfare_eligibility,
        airfare_amount: data.airfare_amount,
        record_status: "A"
      },
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });

          this.getEmployeeGroups();
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

  addEmployeeGroups() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/hrsettings/addEmployeeGroups",
          module: "hrManagement",
          method: "POST",
          data: {
            group_description: this.state.group_description,
            monthly_accrual_days: this.state.monthly_accrual_days,
            airfare_eligibility: this.state.airfare_eligibility,
            airfare_amount: this.state.airfare_amount
          },
          onSuccess: res => {
            if (res.data.success) {
              this.clearState();
              this.getEmployeeGroups();
              swalMessage({
                title: "Record Added Successfully",
                type: "success"
              });
            }
          },
          onFailure: err => {
            swalMessage({
              title: err.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  render() {
    return (
      <div className="employee_groups margin-top-15">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Group Description",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "group_description",
                value: this.state.group_description,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
              label={{
                forceLabel: "Monthly Accrual Days",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                //decimal: { allowNegative: false },
                name: "monthly_accrual_days",
                value: this.state.monthly_accrual_days,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "number"
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Airfare Eligibility",
                isImp: true
              }}
              selector={{
                name: "airfare_eligibility",
                className: "select-fld",
                value: this.state.airfare_eligibility,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.AIRFARE_ELEGIBILITY
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
              label={{
                forceLabel: "Airfare Amount",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "airfare_amount",
                value: this.state.airfare_amount,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "number"
                }
              }}
            />

            <div className="col form-group">
              <button
                style={{ marginTop: 19 }}
                className="btn btn-primary"
                id="srch-sch"
                onClick={this.addEmployeeGroups.bind(this)}
              >
                Add to List
              </button>
            </div>
          </div>

          <div id="empGrpGrid_Cntr">
            <AlgaehDataGrid
              id="empGrpGrid"
              data-validate="empGrpGrid"
              columns={[
                {
                  fieldName: "group_description",
                  label: <AlgaehLabel label={{ forceLabel: "Description" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "group_description",
                          value: row.group_description,
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
                  fieldName: "monthly_accrual_days",
                  label: (
                    <AlgaehLabel
                      label={{ forceLabel: "Monthly Accural Days" }}
                    />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "monthly_accrual_days",
                          value: row.monthly_accrual_days,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Field cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "airfare_eligibility",
                  label: (
                    <AlgaehLabel
                      label={{ forceLabel: "Airfare Eligibility" }}
                    />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        selector={{
                          name: "airfare_eligibility",
                          className: "select-fld",
                          value: row.airfare_eligibility,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.AIRFARE_ELEGIBILITY
                          },
                          others: {
                            errormessage: "Field cannot be blank",
                            required: true
                          },
                          onChange: this.changeGridEditors.bind(this, row)
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "airfare_amount",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Airfare Amount" }} />
                  ),
                  displayTemplate: row => {
                    return <span> {getAmountFormart(row.airfare_amount)}</span>;
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "airfare_amount",
                          value: row.airfare_amount,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Field cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
                }
              ]}
              keyId="hims_d_employee_group_id"
              dataSource={{
                data: this.state.employee_groups
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 20 }}
              filter={true}
              events={{
                onEdit: () => {},
                onDelete: this.deleteEmployeeGroups.bind(this),
                onDone: this.updateEmployeeGroups.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default EmployeeGroups;
