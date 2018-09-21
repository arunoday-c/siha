import React, { Component } from "react";
import "./dept.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import swal from "sweetalert";

class DeptMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDepartments: [],
      subDepartments: [],
      department_code: "",
      department_name: "",
      department_name_arabic: "",
      department_desc: "",
      department_type: "NON-CLINICAL",
      effective_start_date: new Date(),
      effective_end_date: "9999-12-31",
      department_status: "",
      buttonText: "ADD TO LIST",
      hims_d_department_id: "",
      department_code_error: false,
      department_code_error_text: "",
      department_name_arabic_error: false,
      department_name_arabic_error_text: "",
      department_name_error: false,
      department_name_error_text: "",
      department_type_error: false,
      department_type_error_text: "",
      effective_start_date_error: false,
      effective_start_date_error_text: ""
    };
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
        console.log("Data:", response.data.records);
        this.setState({
          allDepartments: response.data.records
        });
      },
      onFailure: error => {}
    });
  }

  getAllSubDepartments() {
    algaehApiCall({
      uri: "/department/get/subdepartment",
      method: "GET",
      data: {
        department_id: 41
      },
      onSuccess: response => {
        console.log("Sub Data:", response.data.records);
        this.setState({
          subDepartments: response.data.records
        });
      },
      onFailure: error => {}
    });
  }

  addDepartment(e) {
    e.preventDefault();

    if (this.state.department_code.length === 0) {
      this.setState({
        department_code_error: true,
        department_code_error_text: "Department code cannot be empty"
      });
    } else if (this.state.department_name.length === 0) {
      this.setState({
        department_name_error: true,
        department_name_error_text: "Department Name cannot be empty"
      });
    } else if (this.state.department_name.length === 0) {
      this.setState({
        department_name_error: true,
        department_name_error_text: "Department Name cannot be empty"
      });
    } else if (this.state.department_name_arabic.length === 0) {
      this.setState({
        department_name_arabic_error: true,
        department_name_arabic_error_text: "Department Name cannot be empty"
      });
    } else if (this.state.effective_start_date.length === 0) {
      this.setState({
        effective_start_date_error: true,
        effective_start_date_error_text: "Select the effective start date"
      });
    } else if (this.state.department_type.length === 0) {
      this.setState({
        department_type_error: true,
        department_type_error_text: "Department Type cannot be empty"
      });
    } else {
      algaehApiCall({
        uri: "/department/add",
        method: "POST",
        data: this.state,
        onSuccess: response => {
          if (response.data.success) {
            swal("Added Successfully", {
              buttons: false,
              icon: "success"
            });
          }
        },
        onFailure: error => {}
      });
    }
  }

  componentDidMount() {
    this.getAllDepartments();
    this.getAllSubDepartments();
  }

  render() {
    return (
      <div className="dept">
        <Paper className="container-fluid">
          <div>
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
                marginTop: 20
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
              <div className="col-lg-3">
                <label>HEAD DEPARTMENT</label>
                <br />
                {/* <AlagehAutoComplete
                  children={SelectFiledData({
                    textField: "department_name",
                    valueField: "hims_d_department_id",
                    payload: this.props.departments
                  })}
                  selected={this.selectedHeadDept.bind(this)}
                /> */}
              </div>
              <div className="col-lg-3 align-middle">
                <br />
                <Button
                  onClick={this.addDepartment.bind(this)}
                  variant="raised"
                  color="primary"
                >
                  {this.state.buttonText}
                </Button>
              </div>
            </div>
          </div>

          <div className="row form-details">
            <div className="col">
              <AlgaehDataGrid
                id="dept_grid"
                columns={[
                  {
                    fieldName: "department_code",
                    label: (
                      <AlgaehLabel label={{ fieldName: "department_code" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "department_name",
                    label: (
                      <AlgaehLabel label={{ fieldName: "department_name" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "department_type",
                    label: (
                      <AlgaehLabel label={{ fieldName: "department_type" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "department_status",
                    label: <AlgaehLabel label={{ fieldName: "status" }} />,
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.department_status === "A"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      );
                    },
                    disabled: true
                  }
                ]}
                keyId="department_code"
                dataSource={{
                  data: this.state.allDepartments
                }}
                expanded={{
                  detailTemplate: row => {
                    // return <Button> {JSON.stringify(row)}</Button>;
                    return;
                  }
                }}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 5 }}
                events={{
                  // onDelete: this.deleteVisaType.bind(this),
                  onDelete: row => {},
                  onEdit: row => {},
                  onDone: row => {}
                  // onDone: row => {
                  //   alert(JSON.stringify(row));
                  // }
                  // onDone: this.updateVisaTypes.bind(this)
                }}
              />
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    //departments: state.departments.departments,
    // subdepartments: state.subdepartments.subdepartments
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      // getDepartments: getDepartments,
      // getSubDepartments: getSubDepartments
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
