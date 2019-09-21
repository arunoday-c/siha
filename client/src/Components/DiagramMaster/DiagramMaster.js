import React, { Component } from "react";
import "./DiagramMaster.scss";

import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup
} from "../Wrapper/algaehWrapper";
import swal from "sweetalert2";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import { AlgaehValidation } from "../../utils/GlobalFunctions";
// import AlgaehFileUploader from "../Wrapper/algaehFileUpload";
// import MyContext from "../../utils/MyContext.js";
export default class DiagramMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      specialities: [],
      diagrams: [],

      image_desc: null,
      image_link: null,
      hims_d_employee_speciality_id: null
    };
  }

  componentDidMount() {
    this.getDiagrams();
    this.getDepartments();
  }

  getDiagrams() {
    algaehApiCall({
      uri: "/diagram/getDiagrams",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            diagrams: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "success"
        });
      }
    });
  }

  clearState() {
    this.setState({
      diagram_id: "",
      image_desc: "",
      image_link: "",
      hims_d_employee_speciality_id: ""
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  changeGridEditors(row, e) {
    console.log("row:", row);

    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  addDiagrams2() {
    algaehApiCall({
      uri: "/diagram/addDiagram",
      method: "POST",
      data: {
        image_desc: this.state.image_desc,
        hims_d_employee_speciality_id: this.state.hims_d_employee_speciality_id
      },
      onSuccess: response => {
        if (response.data.success) {
          this.getDiagrams();
          this.clearState();
          swalMessage({
            title: "Added Successfully",
            type: "success"
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "success"
        });
      }
    });
  }
  addDiagrams() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/diagram/addDiagram",
          method: "POST",
          data: {
            image_desc: this.state.image_desc,
            hims_d_employee_speciality_id: this.state
              .hims_d_employee_speciality_id
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Added Successfully",
                type: "success"
              });

              this.getDiagrams();
              this.clearState();
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.response.data.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  deleteDiagram(data) {
    swal({
      title: "Delete diagram " + data.image_desc + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/diagram/deleteDiagram",

          data: {
            diagram_id: data.diagram_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getDiagrams();
            } else if (!response.data.success) {
              swalMessage({
                title: response.data.message,
                type: "error"
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
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "error"
        });
      }
    });
  }

  updateDiagram(data) {
    algaehApiCall({
      uri: "/diagram/updateDiagram",
      method: "PUT",
      data: {
        image_desc: data.image_desc,
        hims_d_employee_speciality_id: data.hims_d_employee_speciality_id,
        diagram_id: data.diagram_id
      },
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });

          this.getDiagrams();
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

  getDepartments() {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            departments: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "success"
        });
      }
    });
  }

  deptDropDownHandler(value) {
    algaehApiCall({
      uri: "/specialityAndCategory/getEmployeeSpecialityMaster",
      method: "GET",
      module: "masterSettings",
      data: { [value.name]: value.value },
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            specialities: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "success"
        });
      }
    });
  }

  render() {
    return (
      <div className="DiagramMasterScreen">
        <div className="row inner-top-search margin-bottom-15">
          <div className="col-lg-12">
            <div className="row">
              <div className="col form-group">
                {/* <AlgaehFileUploader
                  ref={patientImage => {
                    this.patientImage = patientImage;
                  }}
                  name="patientImage"
                  accept="image/*"
                  textAltMessage="Patient Image"
                  serviceParameters={{
                    //  uniqueID: this.state.patient_code,
                    //   destinationName: this.state.patient_code,
                    fileType: "Patients"
                    // processDelay: this.imageDetails.bind(
                    //   this,
                    //   context,
                    //   "patientImage"
                    // )
                  }}
                  renderPrevState={this.state.patientImage}
                  forceRefresh={this.state.forceRefresh}
                /> */}
                Upload Image comes Here
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Diagram List</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
                    label={{
                      forceLabel: "department",
                      isImp: true
                    }}
                    selector={{
                      name: "sub_department_id",
                      className: "select-fld",
                      value: this.state.hims_d_sub_department_id,
                      dataSource: {
                        textField: "sub_department_name",
                        valueField: "hims_d_sub_department_id",
                        data: this.state.departments
                      },
                      onChange: this.deptDropDownHandler.bind(this)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
                    label={{
                      forceLabel: "employee speciality",
                      isImp: true
                    }}
                    selector={{
                      name: "hims_d_employee_speciality_id",
                      className: "select-fld",
                      value: this.state.hims_d_employee_speciality_id,
                      dataSource: {
                        textField: "speciality_name",
                        valueField: "hims_d_employee_speciality_id",
                        data: this.state.specialities
                      },
                      onChange: this.dropDownHandle.bind(this)
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "diagram name",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "image_desc",
                      value: this.state.image_desc,
                      events: {
                        onChange: this.changeTexts.bind(this)
                      }
                    }}
                  />
                  <div className="col-lg-3">
                    <button
                      type="submit"
                      style={{ marginTop: 21 }}
                      onClick={this.addDiagrams.bind(this)}
                      className="btn btn-primary"
                    >
                      Add to List
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12" id="DiagramListGrid_Cntr">
                    <AlgaehDataGrid
                      id="DiagramListGrid"
                      datavalidate="id='DiagramListGrid_Cntr'"
                      columns={[
                        {
                          fieldName: "speciality_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "SPECIALITY " }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "image_desc",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "DiagramName" }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "col" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "image_desc",
                                  value: row.image_desc,
                                  events: {
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage:
                                      "description - cannot be blank",
                                    required: false
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "Diagram_Image",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Diagram Preview" }}
                            />
                          ),
                          disabled: true
                        }
                      ]}
                      keyId="diagram_id"
                      dataSource={{ data: this.state.diagrams }}
                      isEditable={true}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 20 }}
                      events={{
                        onEdit: () => {},
                        onDelete: this.deleteDiagram.bind(this),
                        onDone: this.updateDiagram.bind(this)
                      }}
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
