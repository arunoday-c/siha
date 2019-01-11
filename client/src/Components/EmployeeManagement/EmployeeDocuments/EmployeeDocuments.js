import React, { Component } from "react";
import "./EmployeeDocuments.css";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";

//import GlobalVariables from "../../../../../utils/GlobalVariables.json";

export default class EmployeeDocuments extends Component {
  render() {
    return (
      <div className="EmployeeDocuments row">
        <div className="col-12">
          <div className="row inner-top-search">
            {" "}
            <AlagehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Documents For",
                isImp: true
              }}
              selector={{
                name: "",
                className: "select-fld",

                dataSource: {},
                others: {}
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Select Employee",
                isImp: true
              }}
              selector={{
                name: "",
                className: "select-fld",

                dataSource: {},
                others: {}
              }}
            />
            <div className="col form-group">
              <button style={{ marginTop: 21 }} className="btn btn-default">
                Load
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
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
                <div className="col-12" id="employeeDocumGrid_Cntr">
                  <AlgaehDataGrid
                    id="employeeDocumGrid"
                    datavalidate="employeeDocumGrid"
                    columns={[
                      {
                        fieldName: "documentName",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Document Name" }}
                          />
                        )
                      },
                      {
                        fieldName: "documentType",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Document Type" }}
                          />
                        )
                      },
                      {
                        fieldName: "relationType",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Relation Type" }}
                          />
                        )
                      },
                      {
                        fieldName: "DependentName",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Dependent Name" }}
                          />
                        )
                      },
                      {
                        fieldName: "UploadedDate",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Uploaded Date" }}
                          />
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

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Add Document</h3>
              </div>
              <div className="actions">Ask Sidhiqe about Functionality</div>
            </div>
            <div className="portlet-body">
              <div className="row">
                {/* <AlagehAutoComplete
                  div={{ className: "col form-group mandatory" }}
                  label={{
                    forceLabel: "Documents For",
                    isImp: true
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",

                    dataSource: {},
                    others: {}
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col form-group mandatory" }}
                  label={{
                    forceLabel: "Select Employee",
                    isImp: true
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",

                    dataSource: {},
                    others: {}
                  }}
                /> */}

                <AlagehFormGroup
                  div={{ className: "col form-group mandatory" }}
                  label={{
                    forceLabel: "Applicant Name",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "",
                    value: "",
                    events: {},
                    option: {
                      type: "text"
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col form-group mandatory" }}
                  label={{
                    forceLabel: "Document Type",
                    isImp: true
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",

                    dataSource: {},
                    others: {}
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col form-group" }}
                  label={{
                    forceLabel: "Relation Type",
                    isImp: false
                  }}
                  selector={{
                    name: "",
                    className: "select-fld",

                    dataSource: {},
                    others: {}
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col form-group" }}
                  label={{
                    forceLabel: "Dependent Name",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "",
                    value: "",
                    events: {},
                    option: {
                      type: "text"
                    }
                  }}
                />

                <div className="col">
                  <label className="label">Attach File</label>
                  <input type="file" />
                </div>

                <div className="col form-group">
                  <button style={{ marginTop: 21 }} className="btn btn-primary">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
