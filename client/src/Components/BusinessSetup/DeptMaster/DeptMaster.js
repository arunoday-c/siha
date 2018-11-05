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

//TODO
// Request for Sub Department Calling Doesn't stop
//Issue to be checked

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
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  textHandle(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  getAllDepartments() {
    this.props.getAllDepartments({
      uri: "/department/get",
      method: "GET",
      redux: {
        type: "DEPARTMENTS_GET_DATA",
        mappingName: "departments"
      }
    });
  }

  getAllSubDepartments(id) {
    this.props.getAllDepartments({
      uri: "/department/get/subdepartment?department_id=" + id,
      method: "GET",
      redux: {
        type: "SUB_DEPARTMENTS_GET_DATA",
        mappingName: "subdepartments"
      }
    });
  }

  addSubDept(data) {
    debugger;
  }

  getSubDeptGrid(id) {
    this.props.getAllDepartments({
      uri: "/department/get/subdepartment?department_id=" + id,
      method: "GET",
      redux: {
        type: "SUB_DEPARTMENTS_GET_DATA",
        mappingName: "subdepartments"
      }
    });

    return (
      <React.Fragment>
        <div style={{ padding: "20px" }}>
          <span>SUB DEPARTMENTS</span>
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
              data: this.props.subdepartments
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
      </React.Fragment>
    );
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

  componentDidMount() {
    this.getAllDepartments();
  }

  render() {
    return (
      <div className="dept">
        <Modal open={this.state.showSubDeptModal}>
          <div className="algaeh-modal" style={{ width: "55vw" }}>
            <div className="popupHeader">
              <h4>Add Sub Department</h4>
            </div>

            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">HELLO SUB MODAL</div>
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
                fieldName: "department_code",
                label: "Sub Dept.",
                displayTemplate: row => {
                  return (
                    <i className="fas fa-plus" onClick={this.addSubDept(row)} />
                  );
                },
                editorTemplate: row => {
                  return (
                    <i className="fas fa-plus" onClick={this.addSubDept(row)} />
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
                disabled: true
              }
            ]}
            keyId="department_code"
            dataSource={{
              data: this.props.departments
            }}
            expanded={{
              detailTemplate: row => {
                return this.getSubDeptGrid(row.hims_d_department_id);
              }
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
