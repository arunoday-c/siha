import React, { Component } from "react";
import "./procedures.css";
import {
  AlgaehDataGrid,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";

class Procedures extends Component {
  render() {
    return (
      <div className="procedures">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-3" }}
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
              div={{ className: "col-lg-2" }}
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
              div={{ className: "col-lg-2" }}
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

            <div className="col-lg-2 margin-top-15">
              <button
                //  onClick={this.addAppointmentClinics.bind(this)}
                type="button"
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>

          <div className="form-details">
            <AlgaehDataGrid
              id="index"
              columns={[
                {
                  fieldName: "encountered_date",
                  label: "Code",

                  others: {
                    style: { textAlign: "center" }
                  }
                },
                {
                  fieldName: "provider_name",
                  label: "Description",
                  others: {
                    style: { textAlign: "center" }
                  }
                },
                {
                  fieldName: "provider_name",
                  label: "Procedure Group",
                  others: {
                    style: { textAlign: "center" }
                  }
                },
                {
                  fieldName: "provider_name",
                  label: "Service ID",
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
    );
  }
}

export default Procedures;
