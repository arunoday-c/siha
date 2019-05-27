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
      general: true,
      display: true
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
    if (e.target.name === "general") {
      this.setState({
        [e.target.name]: !this.state.general
      });
      return;
    }

    if (e.target.name === "display") {
      this.setState({
        [e.target.name]: !this.state.display
      });
      return;
    }

    if (e.target.name === "mapped_vital") {
      if (dps.includes(e.target.value)) {
        dps.pop(e.target.value);
      } else {
        dps.push(e.target.value);
      }
      // console.log("Mapped Department:", dps);
      return;
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
      module : "masterSettings",
      // data: {
      //   department_type: "CLINICAL"
      // },
      onSuccess: response => {
        if (response.data.success) {
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

    // {
    //   "department_id":1,
    //   "vitals":[{"vital_header_id":38},{"vital_header_id":41}]
    //   }

    AlgaehValidation({
      querySelector: "data-validate='deptLit_Vitals'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        let vitals = [];
        let send_data = {
          department_id: this.state.hims_d_sub_department_id
        };

        for (var i = 0; i < dps.length; i++) {
          let myObj = { vital_header_id: dps[i] };
          vitals.push(myObj);
        }

        send_data.vitals = vitals;
        // console.log("send_Data_for_mapping:", send_data);

        if (dps.length === 0) {
          swalMessage({
            title: "Please Select atleast one vital to add",
            type: "warning"
          });
        } else {
          algaehApiCall({
            uri: "/workBenchSetup/addDepartmentVitalMap",
            method: "POST",
            data: send_data,
            onSuccess: response => {
              if (response.data.success) {
                swalMessage({
                  title: "Vitals Mapped Successfully",
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
      }
    });
  }

  getDepartmentVitalMap() {
    algaehApiCall({
      uri: "/workBenchSetup/getDepartmentVitalMap",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            mappingData: response.data.records
          });

          // console.log("Mapping Data:", response.data.records);
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
        general: data.general,
        display: data.display,
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
            general: this.state.general === true ? "Y" : "N",
            display: this.state.display === true ? "Y" : "N"
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
        <div className="row">
          <div className="col-lg-8">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Create Vitals</h3>
                </div>
              </div>
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
                <div className="col" style={{ marginTop: 21 }}>
                  <input
                    name="display"
                    checked={this.state.display}
                    type="checkbox"
                    style={{ marginRight: "5px" }}
                    onChange={this.changeChecks.bind(this)}
                  />
                  <label>Display</label>
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
                    id="vital-hdr-grid"
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
                              div={{ className: "col" }}
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
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "display",
                        label: <AlgaehLabel label={{ fieldName: "display" }} />,
                        displayTemplate: row => {
                          return (
                            <span>{row.display === "Y" ? "Yes" : "No"}</span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{ className: "col" }}
                              selector={{
                                name: "display",
                                className: "select-fld",
                                value: row.display,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_YESNO
                                },
                                others: {
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
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
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Assign Dept.</h3>
                </div>
              </div>
              <div className="row" data-validate="deptLit_Vitals">
                <AlagehAutoComplete
                  div={{ className: "col-12" }}
                  label={{
                    fieldName: "select_department",
                    isImp: true
                  }}
                  selector={{
                    name: "hims_d_sub_department_id",
                    className: "select-fld",
                    value: this.state.hims_d_sub_department_id,
                    dataSource: {
                      textField: "sub_department_name",
                      valueField: "hims_d_sub_department_id",
                      data: this.state.depts
                    },
                    onChange: this.dropDownHandler.bind(this)
                  }}
                />
                <div className="col-12">
                  <ul id="deptLit_Vitals">
                    {this.state.nonGeneralVitals.map((row, index) => (
                      <li key={index}>
                        <span>
                          <input
                            id={row.hims_d_vitals_header_id}
                            name="mapped_vital"
                            value={row.hims_d_vitals_header_id}
                            type="checkbox"
                            onChange={this.changeChecks.bind(this)}
                          />
                        </span>
                        <span htmlFor={row.hims_d_sub_department_id}>
                          {row.vitals_name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 5, float: "right" }}>
                    <button
                      className="btn btn-primary"
                      onClick={this.mapDeptandVital.bind(this)}
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Define Vitals</h3>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="row" data-validate="addVitalDtlDiv">
                    <AlagehAutoComplete
                      div={{ className: "col" }}
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
                      div={{ className: "col" }}
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
                      div={{ className: "col" }}
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
                      div={{ className: "col" }}
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
                      div={{ className: "col" }}
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
                      div={{ className: "col" }}
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

                    <div className="col">
                      <button
                        style={{ marginTop: 21 }}
                        onClick={this.addVitalMasterDetail.bind(this)}
                        type="button"
                        className="btn btn-primary"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      className="col-lg-12"
                      style={{ marginTop: 10 }}
                      data-validate="vitalsMasterDetailDiv"
                      id="vitalsMasterDetailCntr"
                    >
                      <AlgaehDataGrid
                        datavalidate="data-validate='vitalsMasterDetailDiv'"
                        id="appt-room-grid"
                        columns={[
                          {
                            fieldName: "vitals_header_id",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "vitals_name" }}
                              />
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
                            label: (
                              <AlgaehLabel label={{ fieldName: "gender" }} />
                            ),
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
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "min_age",
                            label: (
                              <AlgaehLabel label={{ fieldName: "min_age" }} />
                            )
                          },
                          {
                            fieldName: "max_age",
                            label: (
                              <AlgaehLabel label={{ fieldName: "max_age" }} />
                            )
                          },
                          {
                            fieldName: "min_value",
                            label: (
                              <AlgaehLabel label={{ fieldName: "min_value" }} />
                            )
                          },
                          {
                            fieldName: "max_value",
                            label: (
                              <AlgaehLabel label={{ fieldName: "max_value" }} />
                            )
                          }
                        ]}
                        keyId="hims_d_vitals_details_id"
                        dataSource={{
                          data: this.state.vitalsDetail
                        }}
                        filter={true}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VitalsMaster;
