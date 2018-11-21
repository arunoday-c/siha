import React, { Component } from "react";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";

class PatientRecall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      doctors: []
    };
    this.getAllSubDepartments();
  }

  dropDownHandle(value) {}

  getAllSubDepartments() {
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

  render() {
    return (
      <div className="patient_recall">
        <div className="row inner-top-search">
          <div className="row padding-10">
            <AlagehAutoComplete
              div={{ className: "col mandatory" }}
              label={{
                forceLabel: "Department",
                isImp: true
              }}
              selector={{
                name: "hims_d_sub_department_id",
                className: "select-fld",
                value: this.state.hims_d_sub_department_id,
                dataSource: {
                  textField: "sub_department_name",
                  valueField: "hims_d_sub_department_id",
                  data: this.state.departments
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Doctor"
              }}
              selector={{
                name: "provider_id",
                className: "select-fld",
                value: this.state.provider_id,
                dataSource: {
                  textField: "full_name",
                  valueField: "provider_id",
                  data: this.state.doctors
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <AlgaehDateHandler
              div={{ className: "col" }}
              label={{ forceLabel: "Date", isImp: false }}
              textBox={{
                className: "txt-fld",
                name: "date_of_recall"
              }}
              maxDate={new Date()}
              events={{
                onChange: selectedDate => {
                  this.setState({
                    date_of_recall: selectedDate
                  });
                }
              }}
              value={this.state.date_of_recall}
            />
          </div>
        </div>

        <div className="portlet portlet-bordered box-shadow-normal ">
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
                      others: { resizable: false, style: { textAlign: "left" } }
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
                      fieldName: "age",
                      label: "Age",
                      others: {
                        maxWidth: 60,
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
                    data: this.state.patientData
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
