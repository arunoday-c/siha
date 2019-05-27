import React, { Component } from "react";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import { AlgaehValidation } from "../../utils/GlobalFunctions";

class PatientRecall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      doctors: [],
      patients: [],
      sub_department_id: null
    };
    this.getDoctorsAndDepts();
  }

  loadPatients() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/doctorsWorkBench/getFollowUp",
          method: "GET",
          data: {
            department_id: this.state.sub_department_id,
            doctor_id: this.state.provider_id,
            date_of_recall: this.state.date_of_recall
          },
          onSuccess: response => {
            if (response.data.success) {
              this.setState({
                patients: response.data.records
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

  dropDownHandle(value) {
    switch (value.name) {
      case "sub_department_id":
        this.setState({
          [value.name]: value.value,
          doctors: value.selected.doctors
        });
        return;

      default:
        this.setState({
          [value.name]: value.value
        });

        return;
    }
  }

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      module: "masterSettings",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            departments: response.data.records.departmets
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

  render() {
    return (
      <div className="patient_recall">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col mandatory" }}
            label={{
              forceLabel: "Department",
              isImp: true
            }}
            selector={{
              name: "sub_department_id",
              className: "select-fld",
              value: this.state.sub_department_id,
              dataSource: {
                textField: "sub_department_name",
                valueField: "sub_department_id",
                data: this.state.departments
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col mandatory" }}
            label={{
              forceLabel: "Doctor",
              isImp: true
            }}
            selector={{
              name: "provider_id",
              className: "select-fld",
              value: this.state.provider_id,
              dataSource: {
                textField: "full_name",
                valueField: "employee_id",
                data: this.state.doctors
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          />

          <AlgaehDateHandler
            div={{ className: "col" }}
            label={{ forceLabel: "Date" }}
            textBox={{
              className: "txt-fld",
              name: "date_of_recall"
            }}
            minDate={new Date()}
            events={{
              onChange: selectedDate => {
                this.setState({
                  date_of_recall: selectedDate
                });
              }
            }}
            value={this.state.date_of_recall}
          />

          <div className="col form-group">
            <button
              onClick={this.loadPatients.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              LOAD
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered ">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Patient List</h3>
            </div>
          </div>
          <div className="portlet-body" id="mrdList-Cntr">
            <div className="row">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="index"
                  columns={[
                    {
                      fieldName: "registration_date",
                      label: "Registration Date",
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "patient_code",
                      label: "Patient Code",
                      displayTemplate: row => {
                        return (
                          <span onClick={() => {}} className="pat-code">
                            {row.patient_code}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 120,
                        resizable: false,
                        style: { textAlign: "center" }
                      },
                      className: drow => {
                        return "greenCell";
                      }
                    },
                    {
                      fieldName: "full_name",
                      label: "Patient Name",
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "gender",
                      label: "Gender",
                      others: {
                        maxWidth: 90,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "date_of_birth",
                      label: "Date of Birth",
                      others: {
                        maxWidth: 120,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "contact_number",
                      label: "Phone Number",
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    }
                  ]}
                  keyId="index"
                  dataSource={{
                    data: this.state.patients
                  }}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 20 }}
                  events={{
                    onDelete: row => {},
                    onEdit: row => {},
                    onDone: row => {}
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PatientRecall;
