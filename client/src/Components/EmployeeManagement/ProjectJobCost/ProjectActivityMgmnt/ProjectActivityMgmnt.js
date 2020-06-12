import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./ProjectActivityMgmnt.scss";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import ProjectActMgmntEvent from "./ProjectActMgmntEvent";
import { AlgaehActions } from "../../../../actions/algaehActions";

class ProjectActivityMgmnt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity_id: null,
      description: null,
      sub_description: null
    };
    if (
      this.props.main_activites === undefined ||
      this.props.main_activites.length === 0
    ) {
      ProjectActMgmntEvent().getActivities(this);
    }
    if (
      this.props.sub_activites === undefined ||
      this.props.sub_activites.length === 0
    ) {
      ProjectActMgmntEvent().getSubActivity(this);
    }
  }

  eventHandaler(e) {
    ProjectActMgmntEvent().texthandle(this, e);
  }

  addEvent(addFor) {
    if (addFor === "Main") {
      ProjectActMgmntEvent().addMainActivity(this);
    } else if (addFor === "Sub") {
      ProjectActMgmntEvent().addSubActivity(this);
    }
  }

  updateActivity(updateFor, row) {
    if (updateFor === "Main") {
      ProjectActMgmntEvent().UpdateMainActivity(this, row);
    } else if (updateFor === "Sub") {
      ProjectActMgmntEvent().UpdateSubActivity(this, row);
    }
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  // componentDidMount() {
  //   if (
  //     this.props.organizations === undefined ||
  //     this.props.organizations.length === 0
  //   ) {
  //     this.props.getOrganizations({
  //       uri: "/organization/getOrganization",
  //       method: "GET",
  //       redux: {
  //         type: "ORGS_GET_DATA",
  //         mappingName: "organizations"
  //       }
  //     });
  //   }

  //   if (this.props.projects === undefined || this.props.projects.length === 0) {
  //     this.props.getProjects({
  //       uri: "/hrsettings/getProjects",
  //       module: "hrManagement",
  //       method: "GET",
  //       date: { pjoject_status: "A" },
  //       redux: {
  //         type: "ORGS_GET_DATA",
  //         mappingName: "projects"
  //       }
  //     });
  //   }
  // }

  render() {
    return (
      <div className="ProjectActivityMgmntScreen">
        <div className="row  inner-top-search">
          <AlagehFormGroup
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Enter Main Activity",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "description",
              value: this.state.description,
              events: {
                onChange: this.eventHandaler.bind(this)
              },
              option: {
                type: "text"
              }
            }}
          />

          <div className="col-2 form-group">
            <button
              style={{ marginTop: 19 }}
              className="btn btn-primary"
              onClick={this.addEvent.bind(this, "Main")}
            >
              <span>Add</span>
            </button>
          </div>
          <div className="col-1" />

          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Select Main Activity",
              isImp: true
            }}
            selector={{
              name: "activity_id",
              className: "select-fld",
              value: this.state.activity_id,
              dataSource: {
                textField: "description",
                valueField: "hims_d_activity_id",
                data: this.props.main_activites
              },
              onChange: this.eventHandaler.bind(this),
              onClear: () => {
                this.setState({
                  activity_id: null
                });
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Enter Sub Activity",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "sub_description",
              value: this.state.sub_description,
              events: {
                onChange: this.eventHandaler.bind(this)
              },
              option: {
                type: "text"
              }
            }}
          />
          <div className="col-2 form-group">
            <button
              style={{ marginTop: 19 }}
              className="btn btn-primary"
              onClick={this.addEvent.bind(this, "Sub")}
            >
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Main Activity List</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="mainActivityGrid_Cntr">
                    <AlgaehDataGrid
                      id="mainActivityGrid"
                      // datavalidate="main-activities"
                      columns={[
                        {
                          fieldName: "description",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Main Activity Name" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "description",
                                  value: row.description,
                                  events: {
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage:
                                      "Main Activity Name cannot be blank",
                                    required: true
                                  }
                                }}
                              />
                            );
                          }
                        }
                      ]}
                      keyId="mainActivityGrid"
                      dataSource={{ data: this.props.main_activites }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        // onDelete: this.deleteDesignation.bind(this),
                        onDone: this.updateActivity.bind(this, "Main")
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Sub-Activity List</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="subActivityGrid_Cntr">
                    <AlgaehDataGrid
                      id="subActivityGrid"
                      // datavalidate="sub-activities"
                      columns={[
                        {
                          fieldName: "activity_id",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Main Activity Name" }}
                            />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.main_activites === undefined
                                ? []
                                : this.props.main_activites.filter(
                                    f =>
                                      f.hims_d_activity_id === row.activity_id
                                  );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].description
                                  : ""}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{}}
                                selector={{
                                  name: "activity_id",
                                  className: "select-fld",
                                  value: row.activity_id,
                                  dataSource: {
                                    textField: "description",
                                    valueField: "hims_d_activity_id",
                                    data: this.props.main_activites
                                  },
                                  others: {
                                    errormessage: "Select Main Activity.",
                                    required: true
                                  },
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "description",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Sub Activity Name" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "description",
                                  value: row.description,
                                  events: {
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage:
                                      "Sub Activity Name cannot be blank",
                                    required: true
                                  }
                                }}
                              />
                            );
                          }
                        }
                      ]}
                      keyId="subActivityGrid"
                      dataSource={{ data: this.props.sub_activites }}
                      isEditable={true}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onEdit: () => {},
                        // onDelete: this.deleteDesignation.bind(this),
                        onDone: this.updateActivity.bind(this, "Sub")
                      }}
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
    main_activites: state.main_activites,
    sub_activites: state.sub_activites
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getActivity: AlgaehActions,
      getSubActivity: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProjectActivityMgmnt)
);
