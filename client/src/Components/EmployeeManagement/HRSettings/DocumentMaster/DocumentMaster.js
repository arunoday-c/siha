import React, { Component } from "react";
import "./doc_master.scss";
import { DOC_TYPE } from "../../../../utils/GlobalVariables.json";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";

class DocumentMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: []
    };
    this.getDocTypes();
  }

  getDocTypes() {
    algaehApiCall({
      uri: "/hrSettings/getDocumentsMaster",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            docs: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  clearState() {
    this.setState({
      document_type: null,
      document_description: null
    });
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  updateDocument(data) {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='docsDivGrid'",
      onSuccess: () => {
        algaehApiCall({
          uri: "/hrsettings/updateDocumentType",
          module: "hrManagement",
          method: "PUT",
          data: data,
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success"
              });
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  deleteDocument(data) {
    // swal({
    //   title: "Are you sure you want to delete " + data.document_description + " ?",
    //   type: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes",
    //   confirmButtonColor: "#44b8bd",
    //   cancelButtonColor: "#d33",
    //   cancelButtonText: "No"
    // }).then(willDelete => {
    //   if (willDelete.value) {
    //     algaehApiCall({
    //       uri: "/hrsettings/updateDesignation",
    //       module: "hrManagement",
    //       data: {
    //         hims_d_designation_id: data.hims_d_designation_id,
    //         designation_code: data.designation_code,
    //         designation: data.designation,
    //         record_status: "I"
    //       },
    //       method: "PUT",
    //       onSuccess: response => {
    //         if (response.data.success) {
    //           swalMessage({
    //             title: "Record deleted successfully . .",
    //             type: "success"
    //           });
    //           this.getDesignations();
    //         } else if (!response.data.success) {
    //           swalMessage({
    //             title: response.data.message,
    //             type: "error"
    //           });
    //         }
    //       },
    //       onFailure: error => {
    //         swalMessage({
    //           title: error.message,
    //           type: "error"
    //         });
    //       }
    //     });
    //   } 
    // });
  }

  addDocType() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/hrSettings/addDocumentType",
          method: "POST",
          data: {
            document_type: this.state.document_type,
            document_description: this.state.document_description,
            arabic_name: this.state.arabic_name
          },
          module: "hrManagement",
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Record Added Successfully",
                type: "success"
              });
              this.getDocTypes();
              this.clearState();
            }
          },
          onFailure: err => {
            swalMessage({
              title: err.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  render() {
    return (
      <div className="doc_master margin-top-15">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
              label={{
                forceLabel: "Description",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "document_description",
                value: this.state.document_description,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-2 form-group" }}
              label={{ forceLabel: "Document Type", isImp: true }}
              selector={{
                name: "document_type",
                value: this.state.document_type,
                className: "select-fld",
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: DOC_TYPE
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    document_type: null
                  });
                },
                others: {}
              }}
            />

            <div className="col form-group">
              <button
                style={{ marginTop: 19 }}
                className="btn btn-primary"
                id="srch-sch"
                onClick={this.addDocType.bind(this)}
              >
                Add to List
              </button>
            </div>
          </div>

          <div id="docTypeDivGrid_Cntr" data-validate="docsDivGrid">
            <AlgaehDataGrid
              id="docTypeDivGrid"
              data-validate="docsDivGrid"
              columns={[
                {
                  fieldName: "document_description",
                  label: <AlgaehLabel label={{ forceLabel: "Description" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "document_description",
                          value: row.document_description,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Description - cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "document_type",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Document Type" }} />
                  ),
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.document_type === "C"
                          ? "Company"
                          : row.document_type === "E"
                          ? "Employee"
                          : "------"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        selector={{
                          name: "document_type",
                          value: row.document_type,
                          className: "select-fld",
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: DOC_TYPE
                          },
                          onChange: this.changeGridEditors.bind(this, row),
                          others: {
                            errormessage: "Type - cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "created_date",
                  label: <AlgaehLabel label={{ forceLabel: "Created Date" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {moment(row.created_date).format("DD-MM-YYYY")}
                      </span>
                    );
                  },
                  disabled: true
                }
              ]}
              keyId="hims_d_document_type_id"
              dataSource={{
                data: this.state.docs
              }}
              isEditable={true}
              filter={true}
              paging={{ page: 0, rowsPerPage: 20 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteDocument.bind(this),
                onDone: this.updateDocument.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DocumentMaster;
