import React, { Component } from "react";
import "./EmployeeDocuments.scss";
import { MainContext } from "algaeh-react-components";
import swal from "sweetalert2";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
} from "../../Wrapper/algaehWrapper";
import {
  algaehApiCall,
  swalMessage,
  cancelRequest,
} from "../../../utils/algaehApiCall";
import {
  // AlgaehModal,
  // MainContext,
  //   AlgaehLabel,
  // Modal,
  Upload,
  // Spin,
} from "algaeh-react-components";
import { Tooltip } from "antd";
// import { newAlgaehApi } from "../../../hooks";
import eventLogic from "./eventsLogic/employeeDocumentLogic";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
const { Dragger } = Upload;
// const document_grid_copy = [];
// const AlgaehFileUploader = React.memo(
//   React.lazy(() => import("../../Wrapper/algaehFileUpload"))
// );

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
      document_type_list: [],
      hospital_id: null,
      fileList: [],

      employee_code: null,
    };
    this.getHospitals();
    this.getEmployees();
    this.editedRecord = {};
  }

  afterPassPortSave(fileName, uniqueID, file) {
    // let details = this.state.document_grid;
    const _type = this.state.document_type;
    const _unique = uniqueID.split("_");
    let _document_id = undefined;
    let _document_type_name = undefined;
    if (_unique.length > 2) {
      _document_id = _unique[_unique.length - 2];
    }
    if (_unique.length > 1) {
      _document_type_name = _unique[_unique.length - 1];
    }
    // eventLogic()
    //   .saveDocument(file, uniqueID)
    //   .then((result) => {

    eventLogic()
      .saveDocumentDetails({
        document_id: _document_id,
        document_type: _type,
        employee_id: this.state.employee_id,
        document_name: fileName,
        dependent_id: this.state.selected_id,
        download_uniq_id: uniqueID,
        document_type_name: _document_type_name,
        file: file,
        // unique_id_fromMongo: result,
      })
      .then((result) => {
        const formData = new FormData();
        formData.append("doc_number", result.insertId);
        formData.append("nameOfTheFolder", uniqueID);
        formData.append("EmpFolderName", this.state.employee_code);
        file.forEach((file, index) => {
          formData.append(`file_${index}`, file, file.name);
          formData.append("fileName", file.name);
        });

        eventLogic()
          .saveDocument(formData)
          .then((result) => {
            eventLogic()
              .getSaveDocument({
                document_type: this.state.document_type,
                employee_id: this.state.employee_id,
                dependent_id: this.state.selected_id,
              })
              .then((result) => {
                swalMessage({
                  title: "Successfully done",
                  type: "success",
                });
                // document_grid_copy = [...result];
                this.setState({
                  document_grid: result,
                });
              })
              .catch((error) => {
                swalMessage({
                  title: error.message,
                  type: "error",
                });
              });
          })
          .catch((error) => {
            swalMessage({
              title: error.message,
              type: "error",
            });
          });
        // eventLogic()
        //   .getSaveDocument({
        //     document_type: this.state.document_type,
        //     employee_id: this.state.employee_id,
        //     dependent_id: this.state.selected_id,
        //   })
        //   .then((result) => {
        //     swalMessage({
        //       title: "Successfully done",
        //       type: "success",
        //     });
        //     this.setState({
        //       document_grid: result,
        //     });
        //   })
        //   .catch((error) => {
        //     swalMessage({
        //       title: error.message,
        //       type: "error",
        //     });
        //   });
      })
      .catch((error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      });
    // details.push({
    //   document_name: fileName,
    //   document_type_name: _document_type_name,
    //   download_doc: uniqueID,
    // });
    // this.setState({
    //   document_grid: details,
    // });
    // })
    // .catch((error) => {
    //   swalMessage({
    //     title: error.message,
    //     type: "error",
    //   });
    // });
  }

  onChangeDocTypeHandler(e) {
    // document_grid_copy = [];
    this.setState({
      employee_name: null,
      document_grid: [],

      employee_id: undefined,
      // hospital_id: null,
      document_type_list: [],
    });
    eventLogic()
      .getDocumentTypes({
        document_type: e.value,
      })
      .then((result) => {
        this.setState({
          document_type_list: result,
        });
      })
      .catch((error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      });

    if (e.value === "E") {
      if (this.state.employee_list.length === 0) {
        eventLogic()
          .getEmployeeDetails()
          .then((result) => {
            this.setState({
              document_type: e.value,
              disable_employee: false,
              employee_list: result,
              document_for_list: [],
            });
          })
          .catch((error) => {
            swalMessage({
              title: error.message,
              type: "error",
            });
          });
      } else {
        this.setState({
          document_type: e.value,
          document_for_list: [],
        });
      }
    } else {
      eventLogic()
        .getCompanyDependents()
        .then((result) => {
          this.setState({
            document_type: e.value,
            disable_employee: true,
            employee_id: undefined,
            document_for_list: result,
          });
        })
        .catch((error) => {
          swalMessage({
            title: error.message,
            type: "error",
          });
        });
    }
  }

  deleteDeptUser(data) {
    swal({
      title: `Do you want to delete?`,
      text: `${data.document_type_name} `,
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        //     eventLogic()
        //       .deleteSavedDocument({
        //         hims_f_employee_documents_id: data.hims_f_employee_documents_id,
        //         dependent_id: data.dependent_id,
        //       })
        //       .then(
        //         eventLogic()
        //           .deleteDocument({
        //             unique: data.download_uniq_id,

        //             fileType:
        //               data.document_type === "C"
        //                 ? "CompanyDocuments"
        //                 : "EmployeeDocuments",
        //           })
        //           .then(
        //             swalMessage({
        //               title: "Successfully Deleted",
        //               type: "success",
        //             }),
        //             eventLogic()
        //               .getSaveDocument({
        //                 document_type: this.state.document_type,
        //                 employee_id: this.state.employee_id,
        //                 dependent_id: this.state.selected_id,
        //               })
        //               .then((result) => {
        //                 this.setState({
        //                   document_grid: result,
        //                 });
        //               })
        //               .catch((error) => {
        //                 swalMessage({
        //                   title: error.message,
        //                   type: "error",
        //                 });
        //               })
        //           )
        //           .catch((error) => {
        //             swalMessage({
        //               title: error.message,
        //               type: "error",
        //             });
        //           })
        //       )
        //       .catch((error) => {
        //         swalMessage({
        //           title: error.message,
        //           type: "error",
        //         });
        //       });
        //   }
        // });

        // eventLogic()
        //   .getSelectedDocument(data)
        //   .then((result) => {
        eventLogic()
          .onDelete(data, this.state)
          .then(
            swalMessage({
              title: "Successfully Deleted",
              type: "success",
            }),

            eventLogic()
              .deleteSavedDocument(data)
              .then((result) => {
                eventLogic()
                  .getSaveDocument({
                    document_type: this.state.document_type,
                    employee_id: this.state.employee_id,
                    dependent_id: this.state.selected_id,
                  })
                  .then((result) => {
                    // document_grid_copy = [...result];
                    this.setState({
                      document_grid: result,
                    });
                  })
                  .catch((error) => {
                    swalMessage({
                      title: error.message,
                      type: "error",
                    });
                  });
              })
              .catch((error) => {
                swalMessage({
                  title: error.message,
                  type: "error",
                });
              })
          )
          .catch((error) => {
            swalMessage({
              title: error.message,
              type: "error",
            });
          });
        // })
        // .catch((error) => {
        //   swalMessage({
        //     title: error.message,
        //     type: "error",
        //   });
        // });
      }
    });
  }

  updateDocumentName(data) {
    algaehApiCall({
      uri: "/documents/updateDocument",
      module: "hrManagement",
      method: "PUT",
      data: {
        document_name: data.document_name,
        hims_f_employee_documents_id: data.hims_f_employee_documents_id,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          eventLogic()
            .updateDocumentNamePhysical(data, this.state, this.editedRecord)
            .then((result) => {
              eventLogic()
                .getSaveDocument({
                  document_type: this.state.document_type,
                  employee_id: this.state.employee_id,
                  dependent_id: this.state.selected_id,
                })
                .then((result) => {
                  swalMessage({
                    title: "Record updated successfully",
                    type: "success",
                  });
                  delete this.editedRecord[data.hims_f_employee_documents_id];
                  // document_grid_copy = [...result];
                  this.setState({
                    document_grid: result,
                  });
                })
                .catch((error) => {
                  swalMessage({
                    title: error.message,
                    type: "error",
                  });
                });
            })
            .catch((error) => {
              swalMessage({
                title: error.message,
                type: "error",
              });
            });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  onSaved() {
    eventLogic()
      .getSaveDocument({
        document_type: this.state.document_type,
        employee_id: this.state.employee_id,
        dependent_id: this.state.selected_id,
      })
      .then((result) => {
        // document_grid_copy = [...result];
        this.setState({
          document_grid: result,
        });
      })
      .catch((error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      });
  }
  onHandleDocumentForClick(item, e) {
    this.setState(
      {
        selected_id: item.hims_d_employee_dependents_id,
      },
      () => {
        eventLogic()
          .getSaveDocument({
            document_type: this.state.document_type,
            employee_id: this.state.employee_id,
            dependent_id: this.state.selected_id,
          })
          .then((result) => {
            // document_grid_copy = [...result];
            this.setState({
              document_grid: result,
            });
          })
          .catch((error) => {
            swalMessage({
              title: error.message,
              type: "error",
            });
          });
      }
    );
  }

  dropDownHandler(value, name) {
    this.setState({
      [value.name]: value.value,
    });
  }
  onClearDocTypeHandler(e) {
    this.setState({
      selected_id: undefined,
      document_for_list: [],
      employee_id: undefined,
      disable_employee: true,
      document_type: undefined,
    });
  }
  onClearEmployeeHandler(e) {
    // document_grid_copy = [];
    this.setState({
      document_type: null,
      // selected_id: undefined,
      document_grid: [],

      document_for_list: [],

      employee_name: null,
      document_type_list: [],
      employee_id: undefined,
      hospital_id: null,
    });
  }
  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }
  // onChangeEmployeeHandler(e) {
  //
  //   eventLogic()
  //     .getEmployeeDependents({ employee_id: e.value })
  //     .then((result) => {
  //       this.setState({
  //         employee_id: e.value,
  //         document_for_list: result,
  //       });
  //     })
  //     .catch((error) => {
  //       swalMessage({
  //         title: error.message,
  //         type: "error",
  //       });
  //     });
  // }
  onChangeEmployeeHandler(row) {
    eventLogic()
      .getEmployeeDependents({ employee_id: row.hims_d_employee_id })
      .then((result) => {
        this.setState({
          document_for_list: result,
        });
        return;
      })
      .catch((error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      });
  }

  getEmployees() {
    algaehApiCall({
      uri: "/employee/get",
      module: "hrManagement",
      method: "GET",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            employees: res.data.records,
          });
        }
      },

      onFailure: (err) => {},
    });
  }

  getHospitals() {
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            hospitals: res.data.records,
          });
        }
      },

      onFailure: (err) => {},
    });
  }

  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee,
      },
      searchName: "employee_branch_wise",
      uri: "/gloabelSearch/get",
      inputs: "hospital_id = " + this.state.hospital_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        this.setState(
          {
            employee_name: row.full_name,
            employee_id: row.hims_d_employee_id,
            employee_code: row.employee_code,
          },
          () => {
            this.onChangeEmployeeHandler(row);
          }
        );
      },
    });
  }

  componentWillUnmount() {
    cancelRequest("getEmployees");
    cancelRequest("employeeDependents");
    cancelRequest("companyDependents");
    cancelRequest("types");
  }
  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.setState({
      hospital_id: userToken.hims_d_hospital_id,
    });
  }
  downloadSelectedFile(row, isPreview) {
    AlgaehLoader({ show: true });
    eventLogic().downloadDoc(row, isPreview, this.state);
  }

  // downloadSelectedFile(row) {
  //   const { download_uniq_id, document_name } = row;
  //   //for preview
  //   // const { hostname, port, protocol } = window.location;
  //   // const _port = port === "" ? "/documentManagement" : `:3006`;
  //   // const fileType = "Employees";
  //   // const url = `${protocol}//${hostname}${_port}/api/v1/Document/get?fileType=${fileType}&destinationName=${download_uniq_id}`;
  //   //--end
  //   algaehApiCall({
  //     uri: "/Document/get",
  //     method: "GET",
  //     module: "documentManagement",
  //     fileType: "Employees",
  //     headers: {
  //       Accept: "blob",
  //     },
  //     data: {
  //       fileType: "Employees",
  //       destinationName: download_uniq_id,
  //     },
  //     others: { responseType: "blob" },
  //     onSuccess: (response) => {
  //       const { data } = response;
  //       const url = URL.createObjectURL(data);
  //       let a = document.createElement("a");
  //       a.href = url;
  //       const cleanFileName = document_name.split(".");
  //       a.download = `${cleanFileName[0]}.${data.type}`;
  //       a.click();
  //     },
  //     onCatch: (error) => {
  //       console.error(error);
  //     },
  //   });
  // }

  render() {
    return (
      <div className="EmployeeDocumentsScreen row">
        <div className="col-12">
          <div className="row inner-top-search">
            <AlagehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Documents For",
                isImp: true,
              }}
              selector={{
                name: "document_type",
                className: "select-fld",
                value: this.state.document_type,
                dataSource: {
                  data: [
                    { text: "Employee", value: "E" },
                    { text: "Company", value: "C" },
                  ],
                  textField: "text",
                  valueField: "value",
                },
                onChange: this.onChangeDocTypeHandler.bind(this),
                onClear: this.onClearDocTypeHandler.bind(this),
                autoComplete: "off",
              }}
            />
            {this.state.document_type === "E" ? (
              <AlagehAutoComplete
                div={{ className: "col-2 form-group mandatory" }}
                label={{
                  fieldName: "branch",
                  isImp: true,
                }}
                selector={{
                  name: "hospital_id",
                  className: "select-fld",
                  value: this.state.hospital_id,
                  dataSource: {
                    textField: "hospital_name",
                    valueField: "hims_d_hospital_id",
                    data: this.state.hospitals,
                  },

                  onChange: this.dropDownHandler.bind(this),
                }}
                showLoading={true}
              />
            ) : null}
            {this.state.document_type === "E" ? (
              <div className="col-2 globalSearchCntr">
                <AlgaehLabel label={{ fieldName: "searchEmployee" }} />

                <h6 onClick={this.employeeSearch.bind(this)}>
                  {/* {this.state.emp_name ? this.state.emp_name : "------"} */}
                  {this.state.employee_name
                    ? this.state.employee_name
                    : "Search Employee"}
                  <i className="fas fa-search fa-lg"></i>
                </h6>
              </div>
            ) : null}

            {/* <AlagehAutoComplete
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
            /> */}
            <div className="col form-group">
              <button
                style={{ marginTop: 20 }}
                className="btn btn-primary"
                onClick={this.onClearEmployeeHandler.bind(this)}
              >
                Clear
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
        <div className="col-6">
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
                        editorTemplate: (row) => {
                          return row.document_type_name;
                        },
                        others: {
                          maxWidth: 200,
                        },
                      },
                      {
                        fieldName: "document_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Document Name" }}
                          />
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "document_name",
                                value: row.document_name,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage:
                                    "Document Name- cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "View_Download",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "View/ Download" }}
                          />
                        ),
                        displayTemplate: (row) => (
                          // <button
                          //   onClick={() => {
                          //
                          //   }}
                          // >
                          //   Download
                          // </button>
                          <span>
                            <Tooltip title="Download Document">
                              <i
                                className="fas fa-download"
                                onClick={() => this.downloadSelectedFile(row)}
                              ></i>
                            </Tooltip>
                            <Tooltip title="Preview Document">
                              <i
                                className="fas fa-eye"
                                onClick={() =>
                                  this.downloadSelectedFile(row, true)
                                }
                              ></i>
                            </Tooltip>
                          </span>
                        ),
                        editorTemplate: (row) => (
                          <span>
                            <Tooltip title="Download Document">
                              <i
                                className="fas fa-download"
                                onClick={() => this.downloadSelectedFile(row)}
                              ></i>
                            </Tooltip>
                            <Tooltip title="Preview Document">
                              <i
                                className="fas fa-eye"
                                onClick={() =>
                                  this.downloadSelectedFile(row, true)
                                }
                              ></i>
                            </Tooltip>
                          </span>
                        ),
                        others: {
                          maxWidth: 150,
                        },
                      },
                    ]}
                    keyId="documentManagement"
                    dataSource={{ data: this.state.document_grid }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 20 }}
                    events={{
                      //,
                      onEdit: (row) => {
                        this.editedRecord[row.hims_f_employee_documents_id] =
                          row.document_name;
                      },
                      onDelete: (row) => {
                        this.deleteDeptUser(row);
                      },
                      onDone: this.updateDocumentName.bind(this), //updateDeptUser.bind(this, this)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-body documentMasterCntr">
              <div className="row">
                {/* {this.state.selected_id !== undefined
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
                                : "Employees",
                          }}
                          onlyDragDrop={true}
                          componentType={item.document_description}
                          afterSave={(result) => {
                            this.afterPassPortSave(result);
                            this.onSaved();
                          }}
                        />
                      </div>
                    ))
                  : null} */}
                {this.state.selected_id !== undefined
                  ? this.state.document_type_list.map((item, index) => (
                      <div className="col" key={index}>
                        {" "}
                        <Dragger
                          accept=".jpg,.png,.pdf"
                          name={item.hims_d_document_type_id}
                          beforeUpload={(file) => {
                            this.afterPassPortSave(
                              file.name,
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
                              [file]
                            );
                            return false;
                          }}
                          multiple={false}
                          // disabled={this.state.dataExists && !this.state.editMode}
                          fileList={this.state.fileList}
                        >
                          <p className="upload-drag-icon">
                            {item.document_description}{" "}
                            <i className="fas fa-file-upload"></i>
                          </p>
                          <p className="ant-upload-text">
                            Click or Drag a file to upload
                          </p>
                        </Dragger>
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
