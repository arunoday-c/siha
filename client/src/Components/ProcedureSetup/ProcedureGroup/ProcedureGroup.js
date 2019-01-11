import React, { Component } from "react";
import "./procedure_group.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";

class ProcedureGroup extends Component {
  render() {
    return (
      <div className="row procedure-group">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body">
              <div className="row">
                {" "}
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
                <h3 className="caption-subject">Procedure Groups List</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="procedureGroupGrid_Cntr">
                  <AlgaehDataGrid
                    id="procedureGroupGrid"
                    datavalidate="procedureGroupGrid"
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

export default ProcedureGroup;
