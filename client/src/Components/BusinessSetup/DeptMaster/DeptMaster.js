import React, { Component } from "react";
import "./dept.scss";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import swal from "sweetalert2";
import moment from "moment";
import { MainContext } from "algaeh-react-components";
import { AlgaehSecurityElement } from "algaeh-react-components";
import SubImageMasterPopUp from "./subImageMasterPopUp";

// import { getUploadedFile } from "../../../../../DocumentManagement/src/files";

// import { Input, Space } from "antd";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// const eye = <FontAwesomeIcon icon={faEye} />;
// const slashEye = <FontAwesomeIcon icon={faEyeSlash} />;

class DeptMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDepartments: [],
      subDepartments: [],
      department_type: "NON-CLINICAL",
      effective_start_date: new Date(),
      showSubDeptModal: false,
      s_department_type: "N",
      Inventory_Active: false,
      HIMS_Active: false,
      hospital_id: "",
      UploadImagesModal: false,
    };

    this.getLocation();
    this.getAllDepartments();
  }
  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    const active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HIMS_CLINICAL" ||
      userToken.product_type === "NO_FINANCE"
        ? true
        : false;
    const inventoryactive =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HIMS_CLINICAL" ||
      userToken.product_type === "FINANCE_ERP" ||
      userToken.product_type === "NO_FINANCE"
        ? true
        : false;
    this.setState({
      Inventory_Active: inventoryactive,
      HIMS_Active: active,
      hospital_id: userToken.hospital_id,
    });
  }
  getLocation() {
    if (this.state.Inventory_Active) {
      if (
        this.props.inventorylocations === undefined ||
        this.props.inventorylocations.length === 0
      ) {
        this.props.getLocation({
          uri: "/inventory/getInventoryLocation",
          module: "inventory",
          data: {
            location_status: "A",
          },
          method: "GET",
          redux: {
            type: "LOCATIONS_GET_DATA",
            mappingName: "inventorylocations",
          },
        });
      }
    }
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  textHandle(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({ [name]: value });
  }

  resetSaveState() {
    this.setState({
      department_code: "",
      department_name: "",
      department_name_arabic: "",
      department_type: "NON-CLINICAL",
      effective_start_date: new Date(),
      sub_department_code: "",
      sub_department_name: "",
      arabic_sub_department_name: "",
      // sub_department_email: "",
      // password: "",
      s_department_type: "N",
    });
  }
  UploadImageModal(data, e) {
    this.setState({
      UploadImagesModal: true,
      currentRow: data,
    });
  }
  deleteDepartment(data) {
    swal({
      title: "Delete Department " + data.department_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/department/deleteDepartment",
          module: "masterSettings",
          data: {
            hims_d_department_id: data.hims_d_department_id,
          },
          method: "DELETE",
          onSuccess: (response) => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success",
              });

              this.getAllDepartments();
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
  deleteSubDepartment(data) {
    swal({
      title: "Delete Department " + data.sub_department_name + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willDelete) => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/department/deleteSubDepartment",
          module: "masterSettings",
          data: {
            hims_d_sub_department_id: data.hims_d_sub_department_id,
          },
          method: "DELETE",
          onSuccess: (response) => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success",
              });

              this.getAllSubDepartments(this.state.hims_d_department_id);
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

  updateDepartment(data) {
    data.department_status === "I"
      ? algaehApiCall({
          uri: "/department/makeDepartmentInActive",
          module: "masterSettings",
          data: {
            hims_d_department_id: data.hims_d_department_id,
          },
          method: "PUT",
          onSuccess: (response) => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success",
              });
              this.getAllDepartments();
            } else if (!response.data.records.success) {
              swalMessage({
                title: response.data.records.message,
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
        })
      : algaehApiCall({
          uri: "/department/updateDepartment",
          data: {
            department_name: data.department_name,
            department_desc: data.department_name,
            department_type: data.department_type,
            arabic_department_name: data.arabic_department_name,
            effective_start_date: data.effective_start_date,
            hims_d_department_id: data.hims_d_department_id,
          },
          method: "PUT",
          module: "masterSettings",
          onSuccess: (response) => {
            if (response.data.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success",
              });
              this.getAllDepartments();
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

  updateSubDepartment(data) {
    data.sub_department_status === "I"
      ? algaehApiCall({
          uri: "/department/makeSubDepartmentInActive",
          module: "masterSettings",
          data: {
            hims_d_sub_department_id: data.hims_d_sub_department_id,
          },
          method: "PUT",
          onSuccess: (response) => {
            if (response.data.records.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success",
              });
              this.getAllSubDepartments(data.department_id);
            } else if (!response.data.records.success) {
              swalMessage({
                title: response.data.records.message,
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
        })
      : algaehApiCall({
          uri: "/department/updateSubDepartment",
          data: {
            sub_department_name: data.sub_department_name,
            sub_department_desc: data.sub_department_name,
            arabic_sub_department_name: data.arabic_sub_department_name,
            effective_start_date: data.effective_start_date,
            department_type: data.department_type,
            hims_d_sub_department_id: data.hims_d_sub_department_id,
            vitals_mandatory: data.vitals_mandatory,
            // sub_department_email: data.sub_department_email,
            // password: data.password,
          },
          module: "masterSettings",
          method: "PUT",
          onSuccess: (response) => {
            if (response.data.success) {
              swalMessage({
                title: "Record updated successfully",
                type: "success",
              });
              this.getAllSubDepartments(data.department_id);
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

  getAllDepartments() {
    algaehApiCall({
      uri: "/department/get",
      method: "GET",
      module: "masterSettings",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({ allDepartments: response.data.records });
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

  getAllSubDepartments(id) {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      data: { department_id: id },
      method: "GET",
      module: "masterSettings",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({ subDepartments: response.data.records });
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

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  addSubDept(data, e) {
    this.getAllSubDepartments(data.hims_d_department_id);
    this.setState({
      showSubDeptModal: true,
      depNametoAdd: data.department_name,
      hims_d_department_id: data.hims_d_department_id,
    });
  }

  addSubDepartment(e) {
    e.preventDefault();
    AlgaehValidation({
      querySelector: "data-validate='subdepDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        let sen_data = {
          department_id: this.state.hims_d_department_id,
          sub_department_code: this.state.sub_department_code,
          sub_department_name: this.state.sub_department_name,
          arabic_sub_department_name: this.state.arabic_sub_department_name,
          // sub_department_email: this.state.sub_department_email,
          // password: this.state.password,
          effective_start_date: this.state.effective_start_date,

          location_description: this.state.sub_department_name,
          hospital_id: this.state.hospital_id, //hospital.hims_d_hospital_id,
          department_type: this.state.s_department_type,
          location_type: "SS",
          Inventory_Active: this.state.Inventory_Active,
        };

        algaehApiCall({
          uri: "/department/add/subdepartment",
          module: "masterSettings",
          method: "POST",
          data: sen_data,
          onSuccess: (response) => {
            if (response.data.success) {
              if (this.state.Inventory_Active) {
                this.props.getLocation({
                  uri: "/inventory/getInventoryLocation",
                  module: "inventory",
                  data: {
                    location_status: "A",
                  },
                  method: "GET",
                  redux: {
                    type: "LOCATIONS_GET_DATA",
                    mappingName: "inventorylocations",
                  },
                });
              }
              swalMessage({
                title: "Added Successfully",
                type: "success",
              });
              this.resetSaveState();
              this.getAllSubDepartments(this.state.hims_d_department_id);
            }
          },
          onFailure: (error) => {
            swalMessage({
              title: error.message,
              type: "error",
            });
          },
        });
      },
    });
  }

  addDepartment(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        let send_data = {
          department_code: this.state.department_code,
          department_name: this.state.department_name,
          arabic_department_name: this.state.department_name_arabic,
          department_desc: this.state.department_name,
          department_type: this.state.department_type,
          effective_start_date: this.state.effective_start_date,
        };

        algaehApiCall({
          uri: "/department/addDepartment",
          method: "POST",
          data: send_data,
          module: "masterSettings",
          onSuccess: (response) => {
            if (response.data.success) {
              swalMessage({
                title: "Added Successfully",
                type: "success",
              });
              this.resetSaveState();
              this.getAllDepartments();
            }
          },
          onFailure: (error) => {
            swalMessage({
              title: error.message,
              type: "error",
            });
          },
        });
      },
    });
  }
  onCloseUploadModal() {
    this.setState({
      UploadImagesModal: false,
    });
  }
  onClose() {
    this.setState({ showSubDeptModal: false });
  }

  render() {
    return (
      <div className="dept">
        {this.state.UploadImagesModal ? (
          <SubImageMasterPopUp
            UploadImagesModal={this.state.UploadImagesModal}
            onCloseUploadModal={() => this.onCloseUploadModal()}
            currentRow={this.state.currentRow}
          />
        ) : null}
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this),
          }}
          title="Add Sub Department"
          openPopup={this.state.showSubDeptModal}
        >
          <div className="popupInner">
            <div className="col-lg-12">
              <div className="row margin-top-15" data-validate="subdepDiv">
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "head_department",
                    isImp: false,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "department_name",
                    value: this.state.depNametoAdd,
                    events: {
                      onChange: () => {},
                    },
                    others: {
                      disabled: true,
                    },
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col mandatory" }}
                  label={{
                    fieldName: "sub_department_code",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "sub_department_code",
                    value: this.state.sub_department_code,
                    events: {
                      onChange: this.textHandle.bind(this),
                    },
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col mandatory" }}
                  label={{
                    fieldName: "sub_department_name",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "sub_department_name",
                    value: this.state.sub_department_name,
                    events: {
                      onChange: this.textHandle.bind(this),
                    },
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col arabic-txt-fld mandatory" }}
                  label={{
                    fieldName: "sub_department_name_arabic",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "arabic_sub_department_name",
                    value: this.state.arabic_sub_department_name,
                    events: {
                      onChange: this.textHandle.bind(this),
                    },
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Department Type" }}
                  selector={{
                    name: "s_department_type",
                    className: "select-fld",
                    value: this.state.s_department_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.DEPARTMENT_TYPE,
                    },

                    onChange: this.textHandle.bind(this),
                    onClear: () => {
                      this.setState({
                        s_department_type: null,
                      });
                    },
                  }}
                />
                {/* {this.state.HIMS_Active === true ? (
                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{ forceLabel: "Chart Type" }}
                    selector={{
                      name: "chart_type",
                      className: "select-fld",
                      value: this.state.chart_type,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.CHART_TYPE,
                      },

                      onChange: this.textHandle.bind(this),
                      onClear: () => {
                        this.setState({
                          chart_type: null,
                        });
                      },
                    }}
                  />
                ) : null} */}
                <AlgaehDateHandler
                  div={{ className: "col mandatory" }}
                  label={{ fieldName: "effective_start_date", isImp: true }}
                  textBox={{
                    className: "txt-fld",
                    name: "effective_start_date",
                    error: this.state.effective_start_date_error,
                    helperText: this.state.effective_start_date_error_text,
                  }}
                  maxDate={new Date()}
                  events={{
                    onChange: (date) => {
                      this.setState({ effective_start_date: date });
                    },
                  }}
                  value={this.state.effective_start_date}
                />
                {/* <AlagehFormGroup
                  div={{ className: "col mandatory" }}
                  label={{
                    fieldName: "sub_department_email",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "sub_department_email",
                    value: this.state.sub_department_email,
                    events: {
                      onChange: this.textHandle.bind(this),
                    },
                  }}
                />
                <Space>
                  <Input.Password
                    placeholder="Sub dept email password"
                    name="password"
                    iconRender={(visible) =>
                      visible ? (
                        <span>
                          <i className="fas fa-eye" aria-hidden="true" />
                        </span>
                      ) : (
                        <span>
                          <i class="fa fa-eye-slash" aria-hidden="true"></i>
                        </span>
                      )
                    }
                    value={this.state.password}
                    onChange={this.textHandle.bind(this)}
                  />
                </Space> */}

                <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                  <div className="col align-middle">
                    <br />

                    <button
                      className="btn btn-primary"
                      onClick={this.addSubDepartment.bind(this)}
                    >
                      Add to List
                    </button>
                  </div>
                </AlgaehSecurityElement>
              </div>
              <div className="row">
                <div
                  className="col-lg-12"
                  data-validate="subdepdd"
                  id="subdepddCntr"
                >
                  <AlgaehDataGrid
                    datavalidate="data-validate='subdepdd'"
                    id="sub_dep_grid"
                    columns={[
                      {
                        fieldName: "add_dep",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Sub Dept." }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <i
                              className="fas fa-plus"
                              onClick={this.UploadImageModal.bind(this, row)}
                            />
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <i
                              className="fas fa-plus"
                              onClick={this.UploadImageModal.bind(this, row)}
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
                        fieldName: "sub_department_code",
                        label: (
                          <label className="style_Label">
                            Sub Department Code
                          </label>
                        ),
                        disabled: true,
                      },
                      {
                        fieldName: "sub_department_name",
                        label: (
                          <label className="style_Label">
                            Sub Department Name
                          </label>
                        ),

                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "sub_department_name",
                                value: row.sub_department_name,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage: "Name - cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "arabic_sub_department_name",
                        label: (
                          <label className="style_Label">
                            Sub Department Arabic Name
                          </label>
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{ className: "col" }}
                              textBox={{
                                className: "txt-fld",
                                name: "arabic_sub_department_name",
                                value: row.arabic_sub_department_name,
                                events: {
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                },
                                others: {
                                  errormessage: "Arabic Name - cannot be blank",
                                  required: true,
                                },
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "inventory_location_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Location" }} />
                        ),
                        displayTemplate: (row) => {
                          let display =
                            this.props.inventorylocations === undefined
                              ? []
                              : this.props.inventorylocations.filter(
                                  (f) =>
                                    f.hims_d_inventory_location_id ===
                                    row.inventory_location_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].location_description
                                : ""}
                            </span>
                          );
                        },

                        editorTemplate: (row) => {
                          let display =
                            this.props.inventorylocations === undefined
                              ? []
                              : this.props.inventorylocations.filter(
                                  (f) =>
                                    f.hims_d_inventory_location_id ===
                                    row.inventory_location_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].location_description
                                : ""}
                            </span>
                          );
                        },
                        others: {
                          show: this.state.Inventory_Active,
                        },
                      },

                      {
                        fieldName: "department_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Department Type" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          const display = GlobalVariables.DEPARTMENT_TYPE.find(
                            (f) => f.value === row.department_type
                          );
                          return (
                            <span>
                              {display !== undefined ? display.name : ""}
                            </span>
                          );
                        },

                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{}}
                              selector={{
                                name: "department_type",
                                className: "select-fld",
                                value: row.department_type,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.DEPARTMENT_TYPE,
                                },

                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "effective_start_date",
                        label: (
                          <label className="style_Label">
                            Effective Start Date
                          </label>
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {moment(row.effective_start_date).format(
                                "DD-MM-YYYY"
                              )}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          return (
                            <span>
                              {moment(row.effective_start_date).format(
                                "DD-MM-YYYY"
                              )}
                            </span>
                          );
                        },
                      },
                      {
                        fieldName: "vitals_mandatory",
                        label: (
                          <label className="style_Label">
                            Vitals Mandatory
                          </label>
                        ),
                        displayTemplate: (row) => {
                          return row.vitals_mandatory === "Y" ? "Yes" : "No";
                        },
                        editorTemplate: (row) => {
                          console.log("Row on edit", row);
                          return (
                            <AlagehAutoComplete
                              div={{}}
                              selector={{
                                name: "vitals_mandatory",
                                className: "select-fld",
                                value: row.vitals_mandatory,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_YESNO,
                                },
                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      {
                        fieldName: "sub_department_status",
                        label: <label className="style_Label">Status</label>,
                        displayTemplate: (row) => {
                          return row.sub_department_status === "A"
                            ? "Active"
                            : "Inactive";
                        },
                        editorTemplate: (row) => {
                          return (
                            <AlagehAutoComplete
                              div={{}}
                              selector={{
                                name: "sub_department_status",
                                className: "select-fld",
                                value: row.sub_department_status,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_STATUS,
                                },
                                others: {
                                  errormessage: "Status - cannot be blank",
                                  required: true,
                                },
                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),
                              }}
                            />
                          );
                        },
                      },
                      // {
                      //   fieldName: "sub_department_mail",
                      //   label: (
                      //     <label className="style_Label">
                      //       sub department mail
                      //     </label>
                      //   ),
                      //   displayTemplate: (row) => {
                      //     return row.sub_department_email;
                      //   },
                      //   editorTemplate: (row) => {
                      //     return (
                      //       <AlagehFormGroup
                      //         div={{ className: "col" }}
                      //         textBox={{
                      //           className: "txt-fld",
                      //           name: "sub_department_email",
                      //           value: row.sub_department_email,
                      //           events: {
                      //             onChange: this.changeGridEditors.bind(
                      //               this,
                      //               row
                      //             ),
                      //           },
                      //         }}
                      //       />
                      //     );
                      //   },
                      // },
                      // {
                      //   fieldName: "password",
                      //   label: (
                      //     <label className="style_Label">
                      //       sub Dept email Password
                      //     </label>
                      //   ),
                      //   displayTemplate: (row) => {
                      //     return row.password;
                      //   },
                      //   editorTemplate: (row) => {
                      //     return (
                      //       <AlagehFormGroup
                      //         div={{ className: "col" }}
                      //         textBox={{
                      //           className: "txt-fld",
                      //           name: "password",
                      //           value: row.password,
                      //           events: {
                      //             onChange: this.changeGridEditors.bind(
                      //               this,
                      //               row
                      //             ),
                      //           },
                      //         }}
                      //       />
                      //     );
                      //   },
                      // },
                    ]}
                    keyId="hims_d_sub_department_id"
                    dataSource={{
                      data: this.state.subDepartments,
                    }}
                    filter={true}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onDelete: this.deleteSubDepartment.bind(this),
                      onEdit: (row) => {},
                      onDone: this.updateSubDepartment.bind(this),
                    }}
                  />
                </div>
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
                      this.setState({ showSubDeptModal: false });
                    }}
                  >
                    <label className="style_Label ">Cancel</label>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>

        <div className="row inner-top-search">
          <AlagehFormGroup
            div={{ className: "col form-group mandatory" }}
            label={{
              fieldName: "department_code",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "department_code",
              value: this.state.department_code,
              events: {
                onChange: this.textHandle.bind(this),
              },
              error: this.state.department_code_error,
              helperText: this.state.department_code_error_text,
            }}
          />

          <AlagehFormGroup
            div={{ className: "col form-group mandatory" }}
            label={{
              fieldName: "department_name",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "department_name",
              value: this.state.department_name,
              events: {
                onChange: this.textHandle.bind(this),
              },
              error: this.state.department_name_error,
              helperText: this.state.department_name_error_text,
            }}
          />

          <AlagehFormGroup
            div={{ className: "col form-group arabic-txt-fld mandatory" }}
            label={{
              fieldName: "department_name_arabic",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "department_name_arabic",
              value: this.state.department_name_arabic,
              events: {
                onChange: this.textHandle.bind(this),
              },
              error: this.state.department_name_arabic_error,
              helperText: this.state.department_name_arabic_error_text,
            }}
          />
          {this.state.HIMS_Active === true ? (
            <AlagehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                fieldName: "department_type",
              }}
              selector={{
                name: "department_type",
                className: "select-fld",
                value: this.state.department_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.DEPT_TYPE,
                },
                onChange: this.dropDownHandle.bind(this),
              }}
            />
          ) : null}

          <AlgaehDateHandler
            div={{ className: "col form-group mandatory" }}
            label={{ fieldName: "effective_start_date", isImp: true }}
            textBox={{
              className: "txt-fld",
              name: "effective_start_date",
              error: this.state.effective_start_date_error,
              helperText: this.state.effective_start_date_error_text,
            }}
            maxDate={new Date()}
            events={{
              onChange: (date) => {
                this.setState({ effective_start_date: date });
              },
            }}
            value={this.state.effective_start_date}
          />

          <div className="col align-middle">
            <button
              className="btn btn-primary"
              style={{ marginTop: 20 }}
              onClick={this.addDepartment.bind(this)}
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row">
              <div
                data-validate="depdd"
                className="col-lg-12"
                id="depddGridCntr"
              >
                <AlgaehDataGrid
                  datavalidate="data-validate='depdd'"
                  id="dept_grid"
                  columns={[
                    {
                      fieldName: "add_dep",

                      label: (
                        <AlgaehLabel label={{ forceLabel: "Sub Dept." }} />
                      ),

                      displayTemplate: (row) => {
                        return (
                          <i
                            className="fas fa-plus"
                            onClick={this.addSubDept.bind(this, row)}
                          />
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          <i
                            className="fas fa-plus"
                            onClick={this.addSubDept.bind(this, row)}
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
                      fieldName: "department_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "department_code" }} />
                      ),
                      editorTemplate: (row) => {
                        return <span>{row.department_code}</span>;
                      },
                      disabled: true,
                    },
                    {
                      fieldName: "department_name",
                      label: (
                        <AlgaehLabel label={{ fieldName: "department_name" }} />
                      ),
                      editorTemplate: (row) => {
                        return (
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "department_name",
                              value: row.department_name,
                              events: {
                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),
                              },
                              others: {
                                errormessage: "Name - cannot be blank",
                                required: true,
                              },
                            }}
                          />
                        );
                      },
                    },
                    {
                      fieldName: "arabic_department_name",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "department_name_arabic" }}
                        />
                      ),
                      editorTemplate: (row) => {
                        return (
                          <AlagehFormGroup
                            div={{ className: "col " }}
                            textBox={{
                              className: "txt-fld",
                              name: "arabic_department_name",
                              value: row.arabic_department_name,
                              events: {
                                onChange: this.changeGridEditors.bind(
                                  this,
                                  row
                                ),
                              },
                              others: {
                                errormessage: "Arabic Name - cannot be blank",
                                required: true,
                              },
                            }}
                          />
                        );
                      },
                    },

                    {
                      fieldName: "department_type",
                      label: (
                        <AlgaehLabel label={{ fieldName: "department_type" }} />
                      ),
                      editorTemplate: (row) => {
                        return (
                          <AlagehAutoComplete
                            div={{ className: "col" }}
                            selector={{
                              name: "department_type",
                              className: "select-fld",
                              value: this.state.department_type,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.DEPT_TYPE,
                              },
                              onChange: this.dropDownHandle.bind(this),
                            }}
                          />
                        );
                      },
                      disabled: true,
                      others: {
                        show: this.state.HIMS_Active,
                      },
                    },
                    {
                      fieldName: "effective_start_date",

                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Effective Start Date" }}
                        />
                      ),

                      displayTemplate: (row) => {
                        return (
                          <span>
                            {moment(row.effective_start_date).format(
                              "DD-MM-YYYY"
                            )}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          <span>
                            {moment(row.effective_start_date).format(
                              "DD-MM-YYYY"
                            )}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "department_status",
                      label: <AlgaehLabel label={{ fieldName: "status" }} />,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {row.department_status === "A"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "department_status",
                              className: "select-fld",
                              value: row.department_status,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_STATUS,
                              },
                              others: {
                                errormessage: "Status - cannot be blank",
                                required: true,
                              },
                              onChange: this.changeGridEditors.bind(this, row),
                            }}
                          />
                        );
                      },
                    },
                  ]}
                  filter={true}
                  keyId="department_code"
                  dataSource={{
                    data: this.state.allDepartments,
                  }}
                  isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: this.deleteDepartment.bind(this),
                    onEdit: (row) => {},
                    onDone: this.updateDepartment.bind(this),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    departments: state.departments,
    subdepartments: state.subdepartments,
    inventorylocations: state.inventorylocations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllDepartments: AlgaehActions,
      getAllSubDepartments: AlgaehActions,
      getLocation: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DeptMaster)
);
