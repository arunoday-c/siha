import React, { Component } from "react";
import "./procedure_group.css";
import { AlagehFormGroup, AlgaehDataGrid } from "../../Wrapper/algaehWrapper";

class ProcedureGroup extends Component {
  render() {
    return (
      <div className="procedure-group">
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

export default ProcedureGroup;
