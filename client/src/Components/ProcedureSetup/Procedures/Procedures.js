import React, { Component } from "react";
import "./procedures.css";
import {
  AlgaehDataGrid,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";

class Procedures extends Component {
  render() {
    return (
      <div className="row procedures">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Code",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "description",
                    //value: this.state.description,
                    events: {
                      // onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Description",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "description",
                    //value: this.state.description,
                    events: {
                      // onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Procedure Group"
                  }}
                  selector={{
                    name: "sub_department_id",
                    className: "select-fld",
                    //value: this.state.sub_department_id,
                    dataSource: {
                      textField: "sub_department_name",
                      valueField: "sub_department_id"
                      // data: this.state.departments
                    }
                    // onChange: this.deptDropDownHandler.bind(this)
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Service ID"
                  }}
                  selector={{
                    name: "provider_id",
                    className: "select-fld",
                    // value: this.state.provider_id,
                    dataSource: {
                      textField: "full_name",
                      valueField: "employee_id"
                      // data: this.state.doctors
                    }
                    // onChange: this.dropDownHandler.bind(this)
                  }}
                />

                <div className="col" style={{ marginTop: 21 }}>
                  <button
                    //  onClick={this.addAppointmentClinics.bind(this)}
                    type="button"
                    className="btn btn-primary"
                  >
                    Add to List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Procedure List</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="procedureGrid_Cntr">
                  <AlgaehDataGrid
                    id="procedureGrid"
                    datavalidate="procedureGrid"
                    columns={[
                      {
                        fieldName: "encountered_date",
                        label: <AlgaehLabel label={{ forceLabel: "Code" }} />,

                        others: {
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "provider_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Description" }} />
                        ),

                        others: {
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "provider_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Procedure Group" }}
                          />
                        ),

                        others: {
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "provider_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Service Id" }} />
                        ),
                        others: {
                          style: { textAlign: "center" }
                        }
                      }
                    ]}
                    // rowClassName={row => {
                    //   return "cursor-pointer";
                    // }}
                    keyId="index"
                    dataSource={{
                      data: []
                    }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 5 }}
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
      </div>
    );
  }
}

export default Procedures;
