import React, { Component } from "react";
import "./vitals_master.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import Enumerable from "linq";

let dps = [];

class VitalsMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vitals_name: "",
      uom: "",
      vitalsHeader: [],
      vitalsDetail: [],
      nonGeneralVitals: [],
      depts: [],
      general: true
    };
    dps = [];
    this.getVitalMasterHeader();
    this.getVitalMasterDetail();
    this.getDepartments();
    this.getDepartmentVitalMap();
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  changeChecks(e) {
    this.setState({
      [e.target.name]: !this.state.general
    });

    if (e.target.name === "mapped_dept") {
      if (dps.includes(e.target.value)) {
        dps.pop(e.target.value);
      } else {
        dps.push(e.target.value);
      }

      console.log("Mapped Department:", dps);
    }
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  resetSaveState() {
    this.setState({
      vitals_name: "",
      uom: "",
      gender: "",
      min_age: "",
      max_age: "",
      min_value: "",
      max_value: ""
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  getDepartments() {
    algaehApiCall({
      //uri: "/department/get",
      uri: "/department/get/subdepartment",
      method: "GET",
      // data: {
      //   department_type: "CLINICAL"
      // },
      onSuccess: response => {
        if (response.data.success) {
          debugger;
          this.setState({ depts: response.data.records });
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

  mapDeptandVital() {
    // {
    //   "vital_header_id":1,
    //   "departments":[{"department_id":38},{"department_id":41}]
    //   }

    let departments = [];
    let send_data = {
      vital_header_id: this.state.map_vitals_header_id
    };

    send_data.departments = departments;

    console.log("send_Data_for_mapping:", send_data);
  }

  getDepartmentVitalMap() {
    debugger;

    algaehApiCall({
      uri: "/workBenchSetup/getDepartmentVitalMap",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            mappingData: response.data.records
          });

          console.log("Mapping Data:", response.data.records);
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

  deleteVtialsHeader(data) {
    swal({
      title: "Delete Vital " + data.vitals_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/workBenchSetup/deleteVitalMasterHeader",
          data: {
            hims_d_vitals_header_id: data.hims_d_vitals_header_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });
            } else if (!response.data.records.success) {
              swalMessage({
                title: response.data.records.message,
                type: "error"
              });
            }

            this.getVitalMasterHeader();
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
  deleteVtialsDetail(data) {
    swal({
      title: "Delete Details for this Vital?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/workBenchSetup/deleteVitalMasterDetail",
          data: {
            hims_d_vitals_details_id: data.hims_d_vitals_details_id
          },
          method: "DELETE",
          onSuccess: response => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });
            } else if (!response.data.records.success) {
              swalMessage({
                title: response.data.records.message,
                type: "error"
              });
            }

            this.getVitalMasterDetail();
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

  updateVitalsHeader(data) {
    algaehApiCall({
      uri: "/workBenchSetup/updateVitalMasterHeader",
      method: "PUT",
      data: {
        vitals_name: data.vitals_name,
        uom: data.uom,
        hims_d_vitals_header_id: data.hims_d_vitals_header_id
      },
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });
          this.getVitalMasterHeader();
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

  updateVitalsDetail(data) {
    algaehApiCall({
      uri: "/workBenchSetup/updateVitalMasterDetail",
      method: "PUT",
      data: {
        vitals_header_id: data.vitals_header_id,
        gender: data.gender,
        min_age: data.min_age,
        max_age: data.max_age,
        min_value: data.min_value,
        max_value: data.max_value,
        hims_d_vitals_details_id: data.hims_d_vitals_details_id
      },
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });
          this.getVitalMasterHeader();
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

  getVitalMasterHeader() {
    algaehApiCall({
      uri: "/workBenchSetup/getVitalMasterHeader",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          //console.log("Header", response.data.records);

          let x = Enumerable.from(response.data.records)
            .where(w => w.general === "N")
            .toArray();

          this.setState({
            vitalsHeader: response.data.records,
            nonGeneralVitals: x
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
  getVitalMasterDetail() {
    algaehApiCall({
      uri: "/workBenchSetup/getVitalMasterDetail",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          //console.log("Detail", response.data.records);
          this.setState({ vitalsDetail: response.data.records });
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

  addVitalMasterHeader(e) {
    e.preventDefault();

    AlgaehValidation({
      querySelector: "data-validate='addVitalHdrDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/workBenchSetup/addVitalMasterHeader",
          method: "POST",
          data: {
            vitals_name: this.state.vitals_name,
            uom: this.state.uom,
            general: this.state.general === true ? "Y" : "N"
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record added successfully",
                type: "success"
              });
              this.resetSaveState();
              this.getVitalMasterHeader();
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

  addVitalMasterDetail(e) {
    e.preventDefault();
    AlgaehValidation({
      querySelector: "data-validate='addVitalDtlDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/workBenchSetup/addVitalMasterDetail",
          method: "POST",
          data: {
            vitals_header_id: this.state.vitals_header_id,
            gender: this.state.gender,
            min_age: this.state.min_age,
            max_age: this.state.max_age,
            min_value: this.state.min_value,
            max_value: this.state.max_value
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record added successfully",
                type: "success"
              });
              this.resetSaveState();
              this.getVitalMasterDetail();
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

  render() {
    return (
      <div className="vitals_master">
        <div className="row divInner">
          {/* Vitals Header Start*/}
          <div className="col-lg-4 divInnerLeft" data-validate="addVitalHdrDiv">
            <div className="col-lg-12">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "vitals_name",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "vitals_name",
                    value: this.state.vitals_name,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    },
                    others: {
                      required: true
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "uom",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "uom",
                    value: this.state.uom,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    },
                    others: {
                      required: true
                    }
                  }}
                />
                <div className="col" style={{ marginTop: 21 }}>
                  <input
                    name="general"
                    checked={this.state.general}
                    type="checkbox"
                    style={{ marginRight: "5px" }}
                    onChange={this.changeChecks.bind(this)}
                  />
                  <label>General</label>
                </div>
                <div className="col">
                  <button
                    style={{ marginTop: 21 }}
                    onClick={this.addVitalMasterHeader.bind(this)}
                    type="button"
                    className="btn btn-primary"
                  >
                    Add to List
                  </button>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-lg-12"
                  style={{ marginTop: 10 }}
                  data-validate="vitalsMasterDiv"
                  id="vitalsMasterDivCntr"
                >
                  <AlgaehDataGrid
                    datavalidate="data-validate='vitalsMasterDiv'"
                    id="appt-room-grid"
                    columns={[
                      {
                        fieldName: "vitals_name",
                        label: (
                          <AlgaehLabel label={{ fieldName: "vitals_name" }} />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "vitals_name",
                                value: row.vitals_name,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "Name - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "uom",
                        label: <AlgaehLabel label={{ fieldName: "uom" }} />,
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "uom",
                                value: row.uom,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  )
                                },
                                others: {
                                  errormessage: "UOM - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "general",
                        label: <AlgaehLabel label={{ fieldName: "general" }} />,
                        displayTemplate: row => {
                          return (
                            <span>{row.general === "Y" ? "Yes" : "No"}</span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "" }}
                              selector={{
                                name: "general",
                                className: "select-fld",
                                value: row.general,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_YESNO
                                },
                                others: {
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this)
                              }}
                            />
                          );
                        }
                      }
                    ]}
                    keyId="hims_d_vitals_header_id"
                    dataSource={{
                      data: this.state.vitalsHeader
                    }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: this.deleteVtialsHeader.bind(this),
                      onDone: this.updateVitalsHeader.bind(this)
                    }}
                  />
                  <hr />
                </div>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col">
                      <h6 style={{ marginTop: 27 }}>Department List</h6>
                    </div>
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        fieldName: "vitals_name",
                        isImp: true
                      }}
                      selector={{
                        name: "map_vitals_header_id",
                        className: "select-fld",
                        value: this.state.map_vitals_header_id,
                        dataSource: {
                          textField: "vitals_name",
                          valueField: "hims_d_vitals_header_id",
                          data: this.state.nonGeneralVitals
                        },
                        onChange: this.dropDownHandler.bind(this)
                      }}
                    />
                  </div>
                  <div>
                    <ul id="deptLit_Vitals">
                      {this.state.depts.map((row, index) => (
                        <li key={index}>
                          <span>
                            <input
                              id={row.hims_d_sub_department_id}
                              name="mapped_dept"
                              //checked={this.state.mapped_dept}
                              value={row.hims_d_sub_department_id}
                              type="checkbox"
                              onChange={this.changeChecks.bind(this)}
                            />
                          </span>
                          <span htmlFor={row.hims_d_sub_department_id}>
                            {row.sub_department_name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div>
                      <button
                        className="btn btn-primary"
                        onClick={this.mapDeptandVital.bind(this)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Vitals Header End */}

          {/* Vitals Detail Start */}
          <div
            className="col-lg-8 divInnerRight"
            data-validate="addVitalDtlDiv"
          >
            <div className="col-lg-12">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-2" }}
                  label={{
                    fieldName: "vitals_name",
                    isImp: true
                  }}
                  selector={{
                    name: "vitals_header_id",
                    className: "select-fld",
                    value: this.state.vitals_header_id,
                    dataSource: {
                      textField: "vitals_name",
                      valueField: "hims_d_vitals_header_id",
                      data: this.state.vitalsHeader
                    },
                    onChange: this.dropDownHandler.bind(this)
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-2" }}
                  label={{
                    fieldName: "gender",
                    isImp: true
                  }}
                  selector={{
                    name: "gender",
                    className: "select-fld",
                    value: this.state.gender,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.FORMAT_GENDER
                    },
                    onChange: this.dropDownHandler.bind(this)
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-2" }}
                  label={{
                    fieldName: "min_age",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "min_age",
                    value: this.state.min_age,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    },
                    others: {
                      type: "number",
                      min: 0,
                      checkvalidation: "$value === '' || $value < 0",
                      errormessage: "Please enter a proper age value"
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-lg-2" }}
                  label={{
                    fieldName: "max_age",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "max_age",
                    value: this.state.max_age,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    },
                    others: {
                      type: "number",
                      min: 0,
                      checkvalidation:
                        "$value === '' || $value < " + this.state.min_age,
                      errormessage: "Enter proper age range"
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-lg-2" }}
                  label={{
                    fieldName: "min_value",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "min_value",
                    value: this.state.min_value,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    },
                    others: {
                      type: "number",
                      min: 0,
                      checkvalidation:
                        "$value === '' || $value > " + this.state.max_value,
                      errormessage: "Enter proper value range"
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-lg-2" }}
                  label={{
                    fieldName: "max_value",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "max_value",
                    value: this.state.max_value,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    },
                    others: {
                      type: "number",
                      min: 0,
                      checkvalidation:
                        "$value === '' || $value < " + this.state.min_value,
                      errormessage: "Enter proper value range"
                    }
                  }}
                />

                <div className="col-lg-2">
                  <button
                    style={{ marginTop: 21 }}
                    onClick={this.addVitalMasterDetail.bind(this)}
                    type="button"
                    className="btn btn-primary"
                  >
                    Add to List
                  </button>
                </div>
              </div>
              <div
                className="col-lg-12"
                style={{ marginTop: 10 }}
                data-validate="vitalsMasterDetailDiv"
              >
                <AlgaehDataGrid
                  datavalidate="data-validate='vitalsMasterDetailDiv'"
                  id="appt-room-grid"
                  columns={[
                    {
                      fieldName: "vitals_header_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "vitals_name" }} />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{ className: "" }}
                            selector={{
                              name: "vitals_header_id",
                              className: "select-fld",
                              value: row.vitals_header_id,
                              dataSource: {
                                textField: "vitals_name",
                                valueField: "hims_d_vitals_header_id",
                                data: this.state.vitalsHeader
                              },
                              others: {
                                required: true
                              },
                              onChange: this.changeGridEditors.bind(this)
                            }}
                          />
                        );
                      },
                      displayTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{ className: "" }}
                            selector={{
                              name: "vitals_header_id",
                              className: "select-fld",
                              value: row.vitals_header_id,
                              dataSource: {
                                textField: "vitals_name",
                                valueField: "hims_d_vitals_header_id",
                                data: this.state.vitalsHeader
                              },
                              others: {
                                required: true,
                                disabled: true
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "gender",
                      label: <AlgaehLabel label={{ fieldName: "gender" }} />,
                      displayTemplate: row => {
                        return <span>{row.gender}</span>;
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{ className: "" }}
                            selector={{
                              name: "gender",
                              className: "select-fld",
                              value: row.gender,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_GENDER
                              },
                              onChange: this.changeGridEditors.bind(this)
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "min_age",
                      label: <AlgaehLabel label={{ fieldName: "min_age" }} />
                    },
                    {
                      fieldName: "max_age",
                      label: <AlgaehLabel label={{ fieldName: "max_age" }} />
                    },
                    {
                      fieldName: "min_value",
                      label: <AlgaehLabel label={{ fieldName: "min_value" }} />
                    },
                    {
                      fieldName: "max_value",
                      label: <AlgaehLabel label={{ fieldName: "max_value" }} />
                    }
                  ]}
                  keyId="hims_d_vitals_details_id"
                  dataSource={{
                    data: this.state.vitalsDetail
                  }}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onEdit: () => {},
                    onDelete: this.deleteVtialsDetail.bind(this),
                    onDone: this.updateVitalsDetail.bind(this)
                  }}
                />
              </div>
            </div>
          </div>
          {/* Vitals Detail End */}
        </div>
      </div>
    );
  }
}

export default VitalsMaster;
