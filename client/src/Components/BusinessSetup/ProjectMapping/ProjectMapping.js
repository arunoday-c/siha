import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../actions/algaehActions";
import "./ProjectMapping.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";

import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import ProjectMappingEvents from "./ProjectMappingEvents";
import moment from "moment";
import Options from "../../../Options.json";

class ProjectMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      division_project: [],
      division_id: "",
      project_id: ""
    };

    ProjectMappingEvents().getDivisionProjectFunction(this);
  }

  componentDidMount() {
    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganizationByUser",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations"
        }
      });
    }

    if (this.props.projects === undefined || this.props.projects.length === 0) {
      this.props.getProjects({
        uri: "/hrsettings/getProjects",
        module: "hrManagement",
        method: "GET",
        date: { pjoject_status: "A" },
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "projects"
        }
      });
    }
  }

  eventHandaler(e) {
    ProjectMappingEvents().texthandle(this, e);
  }

  addDivisionProject() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        ProjectMappingEvents().addDivisionProjectEvent(this);
      }
    });
  }
  deleteDivisionProject(data) {
    ProjectMappingEvents().deleteDivisionProjectEvent(this, data);
  }

  render() {
    return (
      <div className="ProjectMappingScreen">
        <div className="row  inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Select a Branch",
              isImp: true
            }}
            selector={{
              name: "division_id",
              className: "select-fld",
              value: this.state.division_id,
              dataSource: {
                textField: "hospital_name",
                valueField: "hims_d_hospital_id",
                data: this.props.organizations
              },
              onChange: this.eventHandaler.bind(this),
              onClear: () => {
                this.setState({
                  division_id: null
                });
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "Select Project",
              isImp: true
            }}
            selector={{
              name: "project_id",
              className: "select-fld",
              value: this.state.project_id,
              dataSource: {
                textField: "project_desc",
                valueField: "hims_d_project_id",
                data: this.props.projects
              },
              onChange: this.eventHandaler.bind(this),
              onClear: () => {
                this.setState({
                  project_id: null
                });
              }
            }}
          />

          <div className="col form-group">
            <button
              onClick={this.addDivisionProject.bind(this)}
              style={{ marginTop: 19 }}
              className="btn btn-primary"
            >
              <span>Add</span>
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
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="projectMappingGrid_Cntr">
                    <AlgaehDataGrid
                      id="projectMappingGrid"
                      datavalidate="projectMappingGrid"
                      columns={[
                        {
                          fieldName: "actions",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Action" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span
                                onClick={this.deleteDivisionProject.bind(
                                  this,
                                  row
                                )}
                              >
                                <i className="fas fa-trash-alt" />
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 50,
                            filterable: false
                          }
                        },
                        {
                          fieldName: "division_id",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Branch Name" }}
                            />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.organizations === undefined
                                ? []
                                : this.props.organizations.filter(
                                    f =>
                                      f.hims_d_hospital_id === row.division_id
                                  );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].hospital_name
                                  : ""}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 250
                          }
                        },
                        {
                          fieldName: "project_id",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Project Name" }}
                            />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.projects === undefined
                                ? []
                                : this.props.projects.filter(
                                    f => f.hims_d_project_id === row.project_id
                                  );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].project_desc
                                  : ""}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "start_date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Start Date" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {moment(row.start_date).format(
                                  Options.dateFormat
                                )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "end_date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "End Date" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {moment(row.end_date).format(
                                  Options.dateFormat
                                )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 150
                          }
                        },
                        {
                          fieldName: "d_p_status",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Status" }} />
                          ),
                          displayTemplate: row => {
                            return row.d_p_status === "A"
                              ? "Active"
                              : "Inactive";
                          },
                          others: {
                            maxWidth: 100
                          }
                        }
                      ]}
                      keyId="hims_m_division_project_id"
                      filter={true}
                      dataSource={{ data: this.state.division_project }}
                      paging={{ page: 0, rowsPerPage: 10 }}
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

function mapStateToProps(state) {
  return {
    projects: state.projects,
    organizations: state.organizations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getProjects: AlgaehActions,
      getOrganizations: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProjectMapping)
);
