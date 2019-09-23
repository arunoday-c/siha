import React, { Component } from "react";
import "./EmployeeDocuments.scss";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import { swalMessage, cancelRequest } from "../../../utils/algaehApiCall";
import eventLogic from "./eventsLogic/employeeDocumentLogic";
const AlgaehFileUploader = React.memo(
  React.lazy(() => import("../../Wrapper/algaehFileUpload"))
);

class EmployeeDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      document_grid: [],
      document_type: undefined,
      disable_employee: true,
      employee_list: [],
      employee_id: undefined,
      document_for_list: [],
      selected_id: undefined,
      document_type_list: []
    };
  }
  afterPassPortSave(rawData) {
    let details = this.state.document_grid;
    const _type = this.state.document_type;
    const _unique = rawData.uniqueID.split("_");
    let _document_id = undefined;
    let _document_type_name = undefined;
    if (_unique.length > 2) {
      _document_id = _unique[_unique.length - 2];
    }
    if (_unique.length > 1) {
      _document_type_name = _unique[_unique.length - 1];
    }
    eventLogic()
      .saveDocument({
        document_id: _document_id,
        document_type: _type,
        employee_id: this.state.employee_id,
        document_name: rawData.fileName,
        dependent_id: this.state.selected_id,
        download_uniq_id: rawData.uniqueID,
        document_type_name: _document_type_name
      })
      .then(result => {
        details.push({
          document_name: rawData.fileName,
          document_type_name: _document_type_name,
          download_doc: rawData.uniqueID
        });
        this.setState({
          document_grid: details
        });
        swalMessage({
          title: "Successfully done",
          type: "success"
        });
      })
      .catch(error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      });
  }
  onChangeDocTypeHandler(e) {
    eventLogic()
      .getDocumentTypes({
        document_type: e.value
      })
      .then(result => {
        this.setState({
          document_type_list: result
        });
      })
      .catch(error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      });

    if (e.value === "E") {
      if (this.state.employee_list.length === 0) {
        eventLogic()
          .getEmployeeDetails()
          .then(result => {
            this.setState({
              document_type: e.value,
              disable_employee: false,
              employee_list: result,
              document_for_list: []
            });
          })
          .catch(error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          });
      }
    } else {
      eventLogic()
        .getCompanyDependents()
        .then(result => {
          this.setState({
            document_type: e.value,
            disable_employee: true,
            employee_id: undefined,
            document_for_list: result
          });
        })
        .catch(error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        });
    }
  }
  onHandleDocumentForClick(item, e) {
    this.setState(
      {
        selected_id: item.hims_d_employee_dependents_id
      },
      () => {
        eventLogic()
          .getSaveDocument({
            document_type: this.state.document_type,
            employee_id: this.state.employee_id,
            dependent_id: item.hims_d_employee_dependents_id
          })
          .then(result => {
            this.setState({
              document_grid: result
            });
          })
          .catch(error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          });
      }
    );
  }
  onClearDocTypeHandler(e) {
    this.setState({
      selected_id: undefined,
      document_for_list: [],
      employee_id: undefined,
      disable_employee: true
    });
  }
  onClearEmployeeHandler(e) {
    this.setState({
      selected_id: undefined,
      document_for_list: [],
      employee_id: undefined
    });
  }
  onChangeEmployeeHandler(e) {
    eventLogic()
      .getEmployeeDependents({ employee_id: e.value })
      .then(result => {
        this.setState({
          employee_id: e.value,
          document_for_list: result
        });
      })
      .catch(error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      });
  }
  componentWillUnmount() {
    cancelRequest("getEmployees");
    cancelRequest("employeeDependents");
    cancelRequest("companyDependents");
    cancelRequest("types");
  }
  render() {
    return (
      <div className="EmployeeDocumentsScreen row">
        <div className="col-12">
          <div className="row inner-top-search">
            <AlagehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Documents For",
                isImp: true
              }}
              selector={{
                name: "document_type",
                className: "select-fld",
                value: this.state.document_type,
                dataSource: {
                  data: [
                    { text: "Employee", value: "E" },
                    { text: "Company", value: "C" }
                  ],
                  textField: "text",
                  valueField: "value"
                },
                onChange: this.onChangeDocTypeHandler.bind(this),
                onClear: this.onClearDocTypeHandler.bind(this),
                autoComplete: "off"
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Select Employee",
                isImp: true
              }}
              selector={{
                name: "employee_id",
                className: "select-fld",
                value: this.state.employee_id,
                dataSource: {
                  data: this.state.employee_list,
                  textField: "full_name",
                  valueField: "employee_id"
                },
                onChange: this.onChangeEmployeeHandler.bind(this),
                onClear: this.onClearEmployeeHandler.bind(this),
                others: {
                  disabled: this.state.disable_employee
                },
                autoComplete: "off"
              }}
            />
            <div className="col form-group">
              <button style={{ marginTop: 21 }} className="btn btn-default">
                Load
              </button>
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Document for</h3>
              </div>
              <div className="actions" />
            </div>
            <div className="portlet-body">
              <ul className="list-group documentFor">
                {this.state.document_for_list.map((item, index) => (
                  <li
                    key={index}
                    className={
                      "list-group-item d-flex justify-content-between align-items-center" +
                      (this.state.selected_id ===
                      item.hims_d_employee_dependents_id
                        ? " active"
                        : "")
                    }
                    onClick={this.onHandleDocumentForClick.bind(this, item)}
                  >
                    {item.dependent_name}
                    <span className="badge badge-primary badge-pill">
                      {item.dependent_type}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-9">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Uploaded Documents</h3>
              </div>
              <div className="actions">
                {/* <a className="btn btn-primary btn-circle active">
                  <i className="fas fa-pen" />
                </a> */}
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="EmployeeDocumentGrid_Cntr">
                  <AlgaehDataGrid
                    id="EmployeeDocumentGrid"
                    datavalidate="EmployeeDocumentGrid"
                    columns={[
                      {
                        fieldName: "document_type_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Document Type" }}
                          />
                        ),
                        others: {
                          maxWidth: 200
                        }
                      },
                      {
                        fieldName: "document_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Document Name" }}
                          />
                        )
                      },
                      {
                        fieldName: "View_Download",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "View/ Download" }}
                          />
                        ),
                        displayTemplate: row => <button>Download</button>,
                        others: {
                          maxWidth: 150
                        }
                      }
                    ]}
                    keyId="documentManagement"
                    dataSource={{ data: this.state.document_grid }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onDelete: rows => {}, //deleteDeptUser.bind(this, this),
                      onEdit: row => {},
                      onDone: rows => {} //updateDeptUser.bind(this, this)
                    }}
                  />
                </div>
              </div>
              <div className="row margin-top-15">
                {this.state.selected_id !== undefined
                  ? this.state.document_type_list.map((item, index) => (
                      <div className="col" key={index}>
                        <AlgaehFileUploader
                          name={"attach_" + item.hims_d_document_type_id}
                          textAltMessage={item.document_description}
                          showActions={true}
                          serviceParameters={{
                            uniqueID:
                              (this.state.selected_id === null
                                ? "Me"
                                : this.state.selected_id) +
                              "_" +
                              this.state.document_type +
                              (this.state.employee_id !== undefined
                                ? "_" + this.state.employee_id
                                : "") +
                              "_" +
                              item.hims_d_document_type_id +
                              "_" +
                              item.document_description,
                            destinationName:
                              (this.state.selected_id === null
                                ? "Me"
                                : this.state.selected_id) +
                              "_" +
                              this.state.document_type +
                              (this.state.employee_id !== undefined
                                ? "_" + this.state.employee_id
                                : "") +
                              "_" +
                              item.hims_d_document_type_id +
                              "_" +
                              item.document_description,
                            fileType:
                              this.state.document_type === "C"
                                ? "Company"
                                : "Employees"
                          }}
                          onlyDragDrop={true}
                          componentType={item.document_description}
                          afterSave={result => {
                            this.afterPassPortSave(result);
                          }}
                        />
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EmployeeDocuments;
