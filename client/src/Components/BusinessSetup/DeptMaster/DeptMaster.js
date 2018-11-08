import React, { Component } from "react";
import "./dept.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import Modal from "@material-ui/core/Modal";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

class DeptMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDepartments: [],
      subDepartments: [],
      department_type: "NON-CLINICAL",
      effective_start_date: new Date(),
      showSubDeptModal: false
    };

    this.getAllDepartments();
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  textHandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  getAllDepartments() {
    algaehApiCall({
      uri: "/department/get",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ allDepartments: response.data.records });
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

  getAllSubDepartments(id) {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      data: { department_id: id },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ subDepartments: response.data.records });
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

  addSubDept(data, e) {
    debugger;
    this.getAllSubDepartments(data.hims_d_department_id);
    this.setState({
      showSubDeptModal: true,
      depNametoAdd: data.department_name
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
          effective_start_date: this.state.effective_start_date
        };

        algaehApiCall({
          uri: "/department/add",
          method: "POST",
          data: send_data,
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Added Successfully",
                type: "success"
              });
            }
          },
          onFailure: error => {}
        });
      }
    });
  }

  render() {
    return (
      <div className="dept">
        <Modal open={this.state.showSubDeptModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Add Sub Department</h4>
                </div>
                <div className="col-lg-4">
                  <button
                    type="button"
                    className=""
                    onClick={() => {
                      this.setState({ showSubDeptModal: false });
                    }}
                  >
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>

            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    label={{
                      fieldName: "head_department",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "department_name",
                      value: this.state.depNametoAdd,
                      events: {
                        onChange: () => {}
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    label={{
                      fieldName: "sub_department_code",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "sub_department_code",
                      value: this.state.sub_department_code,
                      events: {
                        onChange: this.textHandle.bind(this)
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "sub_department_name",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "sub_department_name",
                      value: this.state.sub_department_name,
                      events: {
                        onChange: this.textHandle.bind(this)
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "sub_department_name_arabic",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "sub_department_name_arabic",
                      value: this.state.sub_department_name_arabic,
                      events: {
                        onChange: this.textHandle.bind(this)
                      }
                    }}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{ fieldName: "effective_start_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "effective_start_date",
                      error: this.state.effective_start_date_error,
                      helperText: this.state.effective_start_date_error_text
                    }}
                    maxDate={new Date()}
                    events={{
                      onChange: date => {
                        this.setState({ effective_start_date: date });
                      }
                    }}
                    value={this.state.effective_start_date}
                  />

                  <div className="col-lg-1 align-middle">
                    <br />

                    <button
                      className="btn btn-primary"
                      onClick={this.addDepartment.bind(this)}
                    >
                      ADD TO LIST
                    </button>
                  </div>
                </div>

                {/* <div
                  className="row"
                  style={{
                    marginTop: 5
                  }}
                >
                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{ fieldName: "effective_start_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "effective_start_date",
                      error: this.state.effective_start_date_error,
                      helperText: this.state.effective_start_date_error_text
                    }}
                    maxDate={new Date()}
                    events={{
                      onChange: date => {
                        this.setState({ effective_start_date: date });
                      }
                    }}
                    value={this.state.effective_start_date}
                  />

                  <div className="col-lg-3 align-middle">
                    <br />

                    <button
                      className="btn btn-primary"
                      onClick={this.addDepartment.bind(this)}
                    >
                      ADD TO LIST
                    </button>
                  </div>
                </div> */}

                <div
                  className="col-lg-12"
                  id="departGrid_Cntr"
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
                  <AlgaehDataGrid
                    id="sub_dep_grid"
                    columns={[
                      {
                        fieldName: "sub_department_code",
                        label: "Sub Department Code"
                      },
                      {
                        fieldName: "sub_department_name",
                        label: "Sub Department Name"
                      },
                      {
                        fieldName: "arabic_sub_department_name",
                        label: "Sub Department Arabic Name"
                      },
                      {
                        fieldName: "effective_start_date",
                        label: "Effective Start Date"
                      },
                      {
                        fieldName: "effective_end_date",
                        label: "Effective End Date"
                      },
                      {
                        fieldName: "sub_department_status",
                        label: "Status"
                      }
                    ]}
                    keyId="hims_d_sub_department_id"
                    dataSource={{
                      data: this.state.subDepartments
                    }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onDelete: row => {},
                      onEdit: row => {},
                      onDone: row => {}
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "department_code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "department_code",
                value: this.state.department_code,
                events: {
                  onChange: this.textHandle.bind(this)
                },
                error: this.state.department_code_error,
                helperText: this.state.department_code_error_text
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "department_name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "department_name",
                value: this.state.department_name,
                events: {
                  onChange: this.textHandle.bind(this)
                },
                error: this.state.department_name_error,
                helperText: this.state.department_name_error_text
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "department_name_arabic",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "department_name_arabic",
                value: this.state.department_name_arabic,
                events: {
                  onChange: this.textHandle.bind(this)
                },
                error: this.state.department_name_arabic_error,
                helperText: this.state.department_name_arabic_error_text
              }}
            />
          </div>

          <div
            className="row"
            style={{
              marginTop: 5
            }}
          >
            <AlgaehDateHandler
              div={{ className: "col-lg-3" }}
              label={{ fieldName: "effective_start_date", isImp: true }}
              textBox={{
                className: "txt-fld",
                name: "effective_start_date",
                error: this.state.effective_start_date_error,
                helperText: this.state.effective_start_date_error_text
              }}
              maxDate={new Date()}
              events={{
                onChange: date => {
                  this.setState({ effective_start_date: date });
                }
              }}
              value={this.state.effective_start_date}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "department_type"
              }}
              selector={{
                name: "department_type",
                className: "select-fld",
                value: this.state.department_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.DEPT_TYPE
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <div className="col-lg-3 align-middle">
              <br />

              <button
                className="btn btn-primary"
                onClick={this.addDepartment.bind(this)}
              >
                ADD TO LIST
              </button>
            </div>
          </div>
        </div>

        <div
          className="col-lg-12"
          id="departGrid_Cntr"
          style={{ marginTop: 10, marginBottom: 10 }}
        >
          <AlgaehDataGrid
            id="dept_grid"
            columns={[
              {
                fieldName: "add_dep",
                label: "Sub Dept.",
                displayTemplate: row => {
                  return (
                    <i
                      className="fas fa-plus"
                      onClick={this.addSubDept.bind(this, row)}
                    />
                  );
                },
                editorTemplate: row => {
                  return (
                    <i
                      className="fas fa-plus"
                      onClick={this.addSubDept.bind(this, row)}
                    />
                  );
                },
                others: {
                  style: {
                    textAlign: "center"
                  }
                }
              },
              {
                fieldName: "department_code",
                label: <AlgaehLabel label={{ fieldName: "department_code" }} />,
                disabled: true
              },
              {
                fieldName: "department_name",
                label: <AlgaehLabel label={{ fieldName: "department_name" }} />,
                disabled: true
              },
              {
                fieldName: "arabic_department_name",
                label: (
                  <AlgaehLabel
                    label={{ fieldName: "department_name_arabic" }}
                  />
                )
              },
              {
                fieldName: "department_type",
                label: <AlgaehLabel label={{ fieldName: "department_type" }} />,
                disabled: true
              },
              {
                fieldName: "effective_start_date",
                label: "Effective Start Date"
              },
              {
                fieldName: "department_status",
                label: <AlgaehLabel label={{ fieldName: "status" }} />,
                displayTemplate: row => {
                  return (
                    <span>
                      {row.department_status === "A" ? "Active" : "Inactive"}
                    </span>
                  );
                },
                editorTemplate: row => {
                  return (
                    <span>
                      {row.department_status === "A" ? "Active" : "Inactive"}
                    </span>
                  );
                }
              }
            ]}
            keyId="department_code"
            dataSource={{
              data: this.state.allDepartments
            }}
            isEditable={true}
            paging={{ page: 0, rowsPerPage: 10 }}
            events={{
              onDelete: row => {},
              onEdit: row => {},
              onDone: row => {}
            }}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    departments: state.departments,
    subdepartments: state.subdepartments
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllDepartments: AlgaehActions,
      getAllSubDepartments: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeptMaster)
);
