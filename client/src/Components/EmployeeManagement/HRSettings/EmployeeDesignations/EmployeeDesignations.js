import React, { Component } from "react";
import "./emp_dsgntn.scss";
import {
  AlgaehDataGrid,
  AlagehFormGroup,
  AlgaehLabel,
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import swal from "sweetalert2";
import moment from "moment";
import { AlgaehSecurityElement } from "algaeh-react-components";

class EmployeeDesignations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee_designations: [],
    };
    this.getDesignations();
  }

  getDesignations() {
    algaehApiCall({
      uri: "/hrsettings/getDesignations",
      module: "hrManagement",
      method: "GET",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            employee_designations: res.data.records,
          });
        }
      },

      onFailure: (err) => {},
    });
  }

  deleteDesignation(data) {
    swal({
      title: "Are you sure you want to delete " + data.designation + " ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/hrsettings/updateDesignation",
          module: "hrManagement",
          data: {
            hims_d_designation_id: data.hims_d_designation_id,
            designation_code: data.designation_code,
            designation: data.designation,
            record_status: "I",
          },
          method: "PUT",
          onSuccess: (response) => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success",
              });

              this.getDesignations();
            } else if (!response.data.success) {
              swalMessage({
                title: response.data.message,
                type: "error",
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
    });
  }

  updateDesignation(data) {
    algaehApiCall({
      uri: "/hrsettings/updateDesignation",
      module: "hrManagement",
      method: "PUT",
      data: {
        hims_d_designation_id: data.hims_d_designation_id,
        designation_code: data.designation_code,
        designation: data.designation,
        record_status: "A",
      },
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success",
          });

          this.getDesignations();
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

  addDesignations() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/hrsettings/addDesignation",
          module: "hrManagement",
          method: "POST",
          data: {
            designation_code: this.state.designation_code,
            designation: this.state.designation,
          },
          onSuccess: (res) => {
            if (res.data.success) {
              this.clearState();
              this.getDesignations();
              swalMessage({
                title: "Record Added Successfully",
                type: "success",
              });
            }
          },
          onFailure: (err) => {
            swalMessage({
              title: err.message,
              type: "error",
            });
          },
        });
      },
    });
  }

  changeTexts(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  clearState() {
    this.setState({
      designation_code: "",
      designation: "",
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  render() {
    return (
      <div className="emp_dsgntn">
        <div className="row inner-top-search">
          <AlagehFormGroup
            div={{ className: "col-2 mandatory form-group" }}
            label={{
              fieldName: "designation_code",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "designation_code",
              value: this.state.designation_code,
              events: {
                onChange: this.changeTexts.bind(this),
              },
            }}
          />
          <AlagehFormGroup
            div={{ className: "col-3 mandatory form-group" }}
            label={{
              fieldName: "designation_desc",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              //decimal: { allowNegative: false },
              name: "designation",
              value: this.state.designation,
              events: {
                onChange: this.changeTexts.bind(this),
              },
            }}
          />

          <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
            <div className="col form-group">
              <button
                style={{ marginTop: 20 }}
                className="btn btn-primary"
                id="srch-sch"
                onClick={this.addDesignations.bind(this)}
              >
                <AlgaehLabel label={{ fieldName: "add_to_list" }} />
              </button>
            </div>
          </AlgaehSecurityElement>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    {" "}
                    <AlgaehLabel
                      label={{ fieldName: "designation_mst_list" }}
                    />
                  </h3>
                </div>
              </div>
              <div className="portlet-body">
                <div id="empDsgnDivGrid_Cntr">
                  <AlgaehDataGrid
                    id="empDsgnDivGrid"
                    data-validate="empDsgnDivGrid"
                    columns={[
                      {
                        fieldName: "designation_code",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "designation_code" }}
                          />
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "designation_code",
                                value: row.designation_code,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage:
                                    "Designation Code - cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "designation",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "designation_desc" }}
                          />
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "designation",
                                value: row.designation,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage: "Designation cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "created_date",
                        label: (
                          <AlgaehLabel label={{ fieldName: "created_date" }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {moment(row.created_date).format("DD-MM-YYYY")}
                            </span>
                          );
                        },
                        disabled: true,
                      },
                    ]}
                    keyId="hims_d_designation_id"
                    dataSource={{
                      data: this.state.employee_designations,
                    }}
                    isEditable={true}
                    filter={true}
                    paging={{ page: 0, rowsPerPage: 20 }}
                    events={{
                      onEdit: () => {},
                      onDelete: this.deleteDesignation.bind(this),
                      onDone: this.updateDesignation.bind(this),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EmployeeDesignations;
