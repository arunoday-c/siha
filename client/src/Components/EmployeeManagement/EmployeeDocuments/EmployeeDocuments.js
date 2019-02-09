import React, { Component } from "react";
import "./EmployeeDocuments.css";

import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
const AlgaehFileUploader = React.memo(
  React.lazy(() => import("../../Wrapper/algaehFileUpload"))
);
export default class EmployeeDocuments extends Component {
  afterPassPortSave(rawData) {}
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
                <li className="list-group-item d-flex justify-content-between align-items-center active">
                  Aboobacker Sidhiqe
                  <span className="badge badge-primary badge-pill">Self</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Febry
                  <span className="badge badge-primary badge-pill">Spouse</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Aaliya
                  <span className="badge badge-primary badge-pill">
                    Daughter
                  </span>
                </li>
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
                        fieldName: "documentType",
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
                        fieldName: "DocumentName",
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
                        others: {
                          maxWidth: 150
                        }
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
              <div className="row margin-top-15">
                {/* <div className="col-12">
                  <label className="label">Attach File</label>
                  <input type="file" />
                </div> */}
                <div className="col">
                  <AlgaehFileUploader
                    name="attach_photo"
                    textAltMessage="Passport Copies"
                    showActions={true}
                    serviceParameters={{
                      uniqueID: "",
                      destinationName: "",
                      fileType: "Employees"
                    }}
                    onlyDragDrop={true}
                    events={{
                      afterSave: ""
                    }}
                  />
                  {/* <div className="upload-drop-zone">
                    {" "}
                    <b>Passport Copies</b>
                    <br />
                    drag and drop files here
                  </div> */}
                </div>
                <div className="col">
                  <div className="upload-drop-zone">
                    <b>Identity Documents</b> <br />
                    drag and drop files here
                  </div>
                </div>
                <div className="col">
                  <div className="upload-drop-zone">
                    <b>Education Certificates</b> <br />
                    drag and drop files here
                  </div>
                </div>
                <div className="col">
                  <div className="upload-drop-zone">
                    <b>Experience Certificates</b> <br />
                    drag and drop files here
                  </div>
                </div>
                <div className="col">
                  <div className="upload-drop-zone">
                    <b>Others Certificates</b> <br />
                    drag and drop files here
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
