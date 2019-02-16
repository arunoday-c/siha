import React, { Component } from "react";
import "./ProjectMapping.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
export default class ProjectMapping extends Component {
  render() {
    return (
      <div className="ProjectMappingScreen">
        <div className="row  inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select a Division", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              options: {}
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Project", isImp: false }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              options: {}
            }}
          />

          <div className="col form-group">
            <button
              // onClick={this.getEmployeesForShiftRoster.bind(this)}
              style={{ marginTop: 21 }}
              className="btn btn-primary"
            >
              <span>Add</span>

              {/* <i className="fas fa-spinner fa-spin" /> */}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Project Mapping List</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="projectMappingGrid_Cntr">
                    <AlgaehDataGrid
                      id="projectMappingGrid"
                      datavalidate="projectMappingGrid"
                      columns={[
                        {
                          fieldName: "DivisionName",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Division Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "ProjectName",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Project Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "StartDate",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Start Date" }} />
                          )
                        },
                        {
                          fieldName: "EndDate",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "End Date" }} />
                          )
                        }
                      ]}
                      keyId=""
                      dataSource={{ data: [] }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{}}
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
