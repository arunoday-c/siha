import React, { Component } from "react";
import "./employee_groups.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

class EmployeeGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee_groups: []
    };
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

  deleteEmployeeGroups() {}

  updateEmployeeGroups() {}

  addEmployeeGroups() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/employee/addEmployeeGroups",
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
      <div className="employee_groups">
        <div className="row inner-top-search">
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
              forceLabel: "Monthly Accural Days",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
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
              style={{ marginTop: 21 }}
              className="btn btn-primary"
              id="srch-sch"
              onClick={this.addEmployeeGroups.bind(this)}
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="group-section">
          <AlgaehDataGrid
            id="emp-groups-grid"
            datavalidate="data-validate='apptClinicsDiv'"
            columns={[
              {
                fieldName: "description",
                label: <AlgaehLabel label={{ forceLabel: "description" }} />,
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
                fieldName: "sub_department_id",
                label: <AlgaehLabel label={{ fieldName: "department_name" }} />,
                displayTemplate: row => {
                  return this.getDeptName(row.sub_department_id);
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
                          valueField: "sub_department_id",
                          data: this.state.departments
                        },
                        others: {
                          errormessage: "Department - cannot be blank",
                          required: true
                        },
                        onChange: this.changeGridEditors.bind(this, row)
                      }}
                    />
                  );
                }
              },
              {
                fieldName: "provider_id",
                label: <AlgaehLabel label={{ fieldName: "doctor" }} />,
                displayTemplate: row => {
                  return this.getDoctorName(row.provider_id);
                },
                editorTemplate: row => {
                  return (
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      selector={{
                        name: "provider_id",
                        className: "select-fld",
                        value: row.provider_id,
                        dataSource: {
                          textField: "full_name",
                          valueField: "employee_id",
                          data: this.state.all_docs
                        },
                        others: {
                          errormessage: "Doctor - cannot be blank",
                          required: true
                        },
                        onChange: this.changeGridEditors.bind(this, row)
                      }}
                    />
                  );
                }
              },
              {
                fieldName: "room_id",
                label: <AlgaehLabel label={{ fieldName: "room" }} />,
                displayTemplate: row => {
                  return this.getRoomName(row.room_id);
                },
                editorTemplate: row => {
                  return (
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      selector={{
                        name: "room_id",
                        className: "select-fld",
                        value: row.room_id,
                        dataSource: {
                          textField: "description",
                          valueField: "hims_d_appointment_room_id",
                          data: this.state.appointmentRooms
                        },
                        others: {
                          errormessage: "Room - cannot be blank",
                          required: true
                        },
                        onChange: this.changeGridEditors.bind(this, row)
                      }}
                    />
                  );
                }
              }
            ]}
            keyId="hims_d_appointment_clinic_id"
            dataSource={{
              data: this.state.employee_groups
            }}
            isEditable={true}
            paging={{ page: 0, rowsPerPage: 10 }}
            events={{
              onEdit: () => {},
              onDelete: this.deleteEmployeeGroups.bind(this),
              onDone: this.updateEmployeeGroups.bind(this)
            }}
          />
        </div>
      </div>
    );
  }
}

export default EmployeeGroups;
