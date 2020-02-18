import React, { Component } from "react";
import "./ProjectMaster.scss";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import ProjectMasterEvents from "./ProjectMasterEvents";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import moment from "moment";
import Options from "../../../Options.json";

class EmployeeGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      project_code: "",
      project_desc: "",
      project_desc_arabic: "",
      start_date: "",
      end_date: ""
    };

    ProjectMasterEvents().getProjectsFunction(this);
  }

  changeTexts(e) {
    ProjectMasterEvents().texthandle(this, e);
  }

  datehandle(ctrl, e) {
    ProjectMasterEvents().datehandle(this, ctrl, e);
  }

  grddatehandleEvent(row, ctrl, e) {
    ProjectMasterEvents().griddatehandle(this, row, ctrl, e);
  }

  addProjectMaster() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='project'",
      onSuccess: () => {
        ProjectMasterEvents().addProject(this);
      }
    });
  }

  changeGridEditorsEvent(row, e) {
    ProjectMasterEvents().changeGridEditors(this, row, e);
  }

  updateProjectMaster(data) {
    ProjectMasterEvents().updateProjectMaster(this, data);
  }

  deleteEmployeeGroups(data) {
    ProjectMasterEvents().deleteEmployeeGroups(this, data);
  }

  render() {
    return (
      <div className="projectMasterScreen">
        <div className="row inner-top-search" data-validate="project">
          <AlagehFormGroup
            div={{ className: "col mandatory" }}
            label={{
              forceLabel: "Code",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "project_code",
              value: this.state.project_code,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />
          <AlagehFormGroup
            div={{ className: "col mandatory" }}
            label={{
              forceLabel: "Description",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "project_desc",
              value: this.state.project_desc,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />

          <AlagehFormGroup
            div={{
              className: "col arabic-txt-fld mandatory"
            }}
            label={{
              forceLabel: "Arabic Description",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "project_desc_arabic",
              value: this.state.project_desc_arabic,
              events: {
                onChange: this.changeTexts.bind(this)
              },
              others: {
                placeholder: "أدخل الاسم العربي"
              }
            }}
          />
          <AlagehFormGroup
            div={{
              className: "col mandatory"
            }}
            label={{
              forceLabel: "Project Abbreviation",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "abbreviation",
              value: this.state.abbreviation,
              events: {
                onChange: this.changeTexts.bind(this)
              }
            }}
          />

          <AlgaehDateHandler
            div={{ className: "col mandatory" }}
            label={{ forceLabel: "Start Date", isImp: true }}
            textBox={{ className: "txt-fld", name: "start_date" }}
            events={{
              onChange: this.datehandle.bind(this)
            }}
            value={this.state.start_date}
          />
          <AlgaehDateHandler
            div={{ className: "col mandatory" }}
            label={{ forceLabel: "End Date", isImp: true }}
            textBox={{ className: "txt-fld", name: "end_date" }}
            events={{
              onChange: this.datehandle.bind(this)
            }}
            value={this.state.end_date}
          />

          <div className="col form-group">
            <button
              style={{ marginTop: 19 }}
              className="btn btn-primary"
              id="srch-sch"
              onClick={this.addProjectMaster.bind(this)}
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Project Master List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="projectMasterGrid_Cntr">
                    <AlgaehDataGrid
                      id="projectMasterGrid"
                      data-validate="projectMasterGrid"
                      columns={[
                        {
                          fieldName: "project_code",
                          label: <AlgaehLabel label={{ forceLabel: "Code" }} />,
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "project_code",
                                  value: row.project_code,
                                  events: {
                                    onChange: this.changeGridEditorsEvent.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage: "Code - cannot be blank",
                                    required: true
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "project_desc",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Description" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "project_desc",
                                  value: row.project_desc,
                                  events: {
                                    onChange: this.changeGridEditorsEvent.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage: "Description cannot be blank",
                                    required: true
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "project_desc_arabic",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Arabic Description" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "project_desc_arabic",
                                  value: row.project_desc_arabic,
                                  events: {
                                    onChange: this.changeGridEditorsEvent.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage:
                                      "Arabic Description cannot be blank",
                                    required: true
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "abbreviation",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Project Abbreviation" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "abbreviation",
                                  value: row.abbreviation,
                                  events: {
                                    onChange: this.changeGridEditorsEvent.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage: "Abbrevation cannot be blank",
                                    required: true
                                  }
                                }}
                              />
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
                          editorTemplate: row => {
                            return (
                              <AlgaehDateHandler
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "start_date"
                                }}
                                events={{
                                  onChange: this.grddatehandleEvent.bind(
                                    this,
                                    row
                                  )
                                }}
                                value={row.start_date}
                              />
                            );
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
                          editorTemplate: row => {
                            return (
                              <AlgaehDateHandler
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "end_date"
                                }}
                                events={{
                                  onChange: this.grddatehandleEvent.bind(
                                    this,
                                    row
                                  )
                                }}
                                value={row.end_date}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "pjoject_status",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Status" }} />
                          ),
                          displayTemplate: row => {
                            return row.pjoject_status === "A"
                              ? "Active"
                              : "Inactive";
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{}}
                                selector={{
                                  name: "pjoject_status",
                                  className: "select-fld",
                                  value: row.pjoject_status,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.FORMAT_STATUS
                                  },
                                  others: {
                                    errormessage: "Status - cannot be blank",
                                    required: true
                                  },
                                  onChange: this.changeGridEditorsEvent.bind(
                                    this,
                                    row
                                  )
                                }}
                              />
                            );
                          }
                        }
                      ]}
                      keyId="hims_d_project_id"
                      dataSource={{
                        data: this.state.projects
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 20 }}
                      filter={true}
                      events={{
                        onEdit: () => {},
                        onDelete: this.deleteEmployeeGroups.bind(this),
                        onDone: this.updateProjectMaster.bind(this)
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

export default EmployeeGroups;
