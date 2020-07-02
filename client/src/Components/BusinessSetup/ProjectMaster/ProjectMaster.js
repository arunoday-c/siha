import React, { Component } from "react";
import "./ProjectMaster.scss";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import ProjectMasterEvents from "./ProjectMasterEvents";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import moment from "moment";
import Options from "../../../Options.json";
import { AlgaehSecurityElement } from "algaeh-react-components";

class EmployeeGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      project_code: "",
      project_desc: "",
      project_desc_arabic: "",
      start_date: "",
      end_date: "",
      showProjectComponent: false,
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
      },
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
  addProjectComponent(data, e) {
    // this.getAllSubDepartments(data.hims_d_department_id);
    this.setState({
      showProjectComponent: true,
      // depNametoAdd: data.department_name,
      // hims_d_department_id: data.hims_d_department_id,
    });
  }
  onClose() {
    this.setState({ showProjectComponent: false });
  }

  render() {
    return (
      <div className="projectMasterScreen">
        <AlgaehModalPopUp
          class="projectComponentModal"
          events={{
            onClose: this.onClose.bind(this),
          }}
          title="Add Project Component"
          openPopup={this.state.showProjectComponent}
        >
          <div className="popupInner">
            <div className="col-lg-12">
              <div className="row margin-top-15">
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{ forceLabel: "Select Component" }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    value: "",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: [],
                    },
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-3 mandatory" }}
                  label={{ forceLabel: "Select Interval" }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    value: "",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: [],
                    },
                  }}
                />
                <AlagehFormGroup
                  div={{
                    className: "col-2 mandatory",
                  }}
                  label={{
                    forceLabel: "Amount",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "",
                    value: "",
                    // events: {
                    //   onChange: this.changeTexts.bind(this),
                    // },
                    // others: {
                    //   placeholder: "أدخل الاسم العربي",
                    // },
                  }}
                />

                <div className="col-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: 19 }}
                  >
                    <label className="style_Label ">Add</label>
                  </button>
                </div>
              </div>

              <div className="row margin-top-15">
                <div className="col-12" id="ProjectComponentGrid_Cntr">
                  <AlgaehDataGrid
                    id="projectMasterGrid"
                    data-validate="projectMasterGrid"
                    columns={[
                      {
                        fieldName: "add_component",

                        label: (
                          <AlgaehLabel label={{ forceLabel: "Components" }} />
                        ),

                        others: {
                          style: {
                            textAlign: "center",
                          },
                        },
                      },
                    ]}
                    keyId=""
                    dataSource={{}}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 20 }}
                    filter={true}
                    events={{}}
                  />
                </div>
              </div>
            </div>
            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>
                  <div className="col-lg-8">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        this.setState({ showProjectComponent: false });
                      }}
                    >
                      <label className="style_Label ">Cancel</label>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
        <div className="row inner-top-search" data-validate="project">
          <AlagehFormGroup
            div={{ className: "col mandatory" }}
            label={{
              forceLabel: "Code",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "project_code",
              value: this.state.project_code,
              events: {
                onChange: this.changeTexts.bind(this),
              },
            }}
          />
          <AlagehFormGroup
            div={{ className: "col mandatory" }}
            label={{
              forceLabel: "Description",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "project_desc",
              value: this.state.project_desc,
              events: {
                onChange: this.changeTexts.bind(this),
              },
            }}
          />

          <AlagehFormGroup
            div={{
              className: "col arabic-txt-fld mandatory",
            }}
            label={{
              forceLabel: "Arabic Description",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "project_desc_arabic",
              value: this.state.project_desc_arabic,
              events: {
                onChange: this.changeTexts.bind(this),
              },
              others: {
                placeholder: "أدخل الاسم العربي",
              },
            }}
          />
          <AlagehFormGroup
            div={{
              className: "col mandatory",
            }}
            label={{
              forceLabel: "Project Abbreviation",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "abbreviation",
              value: this.state.abbreviation,
              events: {
                onChange: this.changeTexts.bind(this),
              },
            }}
          />

          <AlgaehDateHandler
            div={{ className: "col mandatory" }}
            label={{ forceLabel: "Start Date", isImp: true }}
            textBox={{ className: "txt-fld", name: "start_date" }}
            events={{
              onChange: this.datehandle.bind(this),
            }}
            value={this.state.start_date}
          />
          <AlgaehDateHandler
            div={{ className: "col mandatory" }}
            label={{ forceLabel: "End Date", isImp: true }}
            textBox={{ className: "txt-fld", name: "end_date" }}
            events={{
              onChange: this.datehandle.bind(this),
            }}
            value={this.state.end_date}
          />

          <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
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
          </AlgaehSecurityElement>
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
                          fieldName: "add_component",

                          label: (
                            <AlgaehLabel label={{ forceLabel: "Components" }} />
                          ),

                          displayTemplate: (row) => {
                            return (
                              <i
                                className="fas fa-plus"
                                onClick={this.addProjectComponent.bind(
                                  this,
                                  row
                                )}
                              />
                            );
                          },
                          editorTemplate: (row) => {
                            return (
                              <i
                                className="fas fa-plus"
                                onClick={this.addProjectComponent.bind(
                                  this,
                                  row
                                )}
                              />
                            );
                          },
                          others: {
                            style: {
                              textAlign: "center",
                            },
                          },
                        },
                        {
                          fieldName: "project_code",
                          label: <AlgaehLabel label={{ forceLabel: "Code" }} />,
                          editorTemplate: (row) => {
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
                                    ),
                                  },
                                  others: {
                                    errormessage: "Code - cannot be blank",
                                    required: true,
                                  },
                                }}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "project_desc",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Description" }}
                            />
                          ),
                          editorTemplate: (row) => {
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
                                    ),
                                  },
                                  others: {
                                    errormessage: "Description cannot be blank",
                                    required: true,
                                  },
                                }}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "project_desc_arabic",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Arabic Description" }}
                            />
                          ),
                          editorTemplate: (row) => {
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
                                    ),
                                  },
                                  others: {
                                    errormessage:
                                      "Arabic Description cannot be blank",
                                    required: true,
                                  },
                                }}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "abbreviation",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Project Abbreviation" }}
                            />
                          ),
                          editorTemplate: (row) => {
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
                                    ),
                                  },
                                  others: {
                                    errormessage: "Abbrevation cannot be blank",
                                    required: true,
                                  },
                                }}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "start_date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Start Date" }} />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {moment(row.start_date).format(
                                  Options.dateFormat
                                )}
                              </span>
                            );
                          },
                          editorTemplate: (row) => {
                            return (
                              <AlgaehDateHandler
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "start_date",
                                }}
                                events={{
                                  onChange: this.grddatehandleEvent.bind(
                                    this,
                                    row
                                  ),
                                }}
                                value={row.start_date}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "end_date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "End Date" }} />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {moment(row.end_date).format(
                                  Options.dateFormat
                                )}
                              </span>
                            );
                          },
                          editorTemplate: (row) => {
                            return (
                              <AlgaehDateHandler
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "end_date",
                                }}
                                events={{
                                  onChange: this.grddatehandleEvent.bind(
                                    this,
                                    row
                                  ),
                                }}
                                value={row.end_date}
                              />
                            );
                          },
                        },
                        {
                          fieldName: "pjoject_status",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Status" }} />
                          ),
                          displayTemplate: (row) => {
                            return row.pjoject_status === "A"
                              ? "Active"
                              : "Inactive";
                          },
                          editorTemplate: (row) => {
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
                                    data: GlobalVariables.FORMAT_STATUS,
                                  },
                                  others: {
                                    errormessage: "Status - cannot be blank",
                                    required: true,
                                  },
                                  onChange: this.changeGridEditorsEvent.bind(
                                    this,
                                    row
                                  ),
                                }}
                              />
                            );
                          },
                        },
                      ]}
                      keyId="hims_d_project_id"
                      dataSource={{
                        data: this.state.projects,
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 20 }}
                      filter={true}
                      events={{
                        onEdit: () => { },
                        onDelete: this.deleteEmployeeGroups.bind(this),
                        onDone: this.updateProjectMaster.bind(this),
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
