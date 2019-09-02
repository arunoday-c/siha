import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./employee_master_index.css";
import "../../../styles/site.css";
import { AlgaehLabel, AlgaehDataGrid } from "../../Wrapper/algaehWrapper";
import AlgaehFile from "../../Wrapper/algaehFileUpload";
import { AlgaehActions } from "../../../actions/algaehActions";
import EmployeeMaster from "./EmployeeMaster/EmployeeMaster";
import moment from "moment";
import Options from "../../../Options.json";
import { getCookie } from "../../../utils/algaehApiCall";
import { setGlobal } from "../../../utils/GlobalFunctions";
import {
  getEmployeeDetails,
  EditEmployeeMaster
} from "./EmployeeMasterIndexEvent";
// import variableJson from "../../../utils/GlobalVariables.json";

class EmployeeMasterIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      employeeDetailsPop: {},
      Employeedetails: [],
      selectedLang: "en",
      editEmployee: false,
      forceRender: false
    };
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
    });

    if (
      this.props.designations === undefined ||
      this.props.designations.length === 0
    ) {
      this.props.getDesignations({
        uri: "/hrsettings/getDesignations",
        module: "hrManagement",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "designations"
        }
      });
    }

    getEmployeeDetails(this, this);

    if (
      this.props.subdepartment === undefined ||
      this.props.subdepartment.length === 0
    ) {
      this.props.getSubDepartment({
        uri: "/department/get/subdepartment",
        module: "masterSettings",
        data: {
          sub_department_status: "A"
        },
        method: "GET",
        redux: {
          type: "SUB_DEPT_GET_DATA",
          mappingName: "subdepartment"
        }
      });
    }
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      employeeDetailsPop: {},
      editEmployee: false
    });
  }

  CloseModel(e) {
    this.setState(
      {
        isOpen: !this.state.isOpen,
        afterClose: true
      },
      () => {
        getEmployeeDetails(this, this);
      }
    );
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  setUpdateComponent(row, e) {
    this.setState({
      isOpen: true
    });
  }

  EditItemMaster(row) {
    row.addNew = false;
    this.setState({
      isOpen: !this.state.isOpen,
      servicePop: row,
      addNew: false
    });
  }

  render() {
    return (
      <div className="hims_hospitalservices">
        {/* <BreadCrumb
          title={
            <AlgaehLabel
              label={{ fieldName: "employee_master", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "employee_master_settings",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ fieldName: "employee_master", align: "ltr" }}
                />
              )
            }
          ]}
        /> */}
        <div
          className="portlet portlet-bordered margin-bottom-15"
          style={{ marginTop: 15 }}
        >
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Employee Master Lists</h3>
            </div>
            <div className="actions">
              <a
                className="btn btn-primary btn-circle active"
                onClick={this.ShowModel.bind(this)}
              >
                <i className="fas fa-plus" />
              </a>
              <EmployeeMaster
                HeaderCaption={
                  <AlgaehLabel
                    label={{
                      fieldName: "employee_master",
                      align: "ltr"
                    }}
                  />
                }
                open={this.state.isOpen}
                onClose={this.CloseModel.bind(this)}
                editEmployee={this.state.editEmployee}
                employeeDetailsPop={this.state.employeeDetailsPop}
                employee_status={this.state.employee_status}
              />
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="employeeIndexGrid">
                <AlgaehDataGrid
                  id="employee_grid"
                  forceRender={this.state.forceRender}
                  columns={[
                    {
                      fieldName: "action",

                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <i
                              className="fas fa-pen"
                              onClick={EditEmployeeMaster.bind(this, this, row)}
                            />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 65,
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "employee_img",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Profile Img" }} />
                      ),
                      displayTemplate: row => (
                        <AlgaehFile
                          name="attach_photo"
                          accept="image/*"
                          textAltMessage={row.full_name}
                          showActions={false}
                          serviceParameters={{
                            uniqueID: row.employee_code,
                            destinationName: row.employee_code,
                            fileType: "Employees"
                          }}
                        />
                      ),
                      others: {
                        maxWidth: 90,
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "employee_status",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      displayTemplate: row => {
                        return row.employee_status === "A" ? (
                          <span className="badge badge-success">Active</span>
                        ) : row.employee_status === "I" ? (
                          <span className="badge badge-dark">Inactive</span>
                        ) : row.employee_status === "R" ? (
                          <span className="badge badge-warning">Resigned</span>
                        ) : row.employee_status === "T" ? (
                          <span className="badge badge-secondary">
                            Terminated
                          </span>
                        ) : null;
                      },
                      others: {
                        maxWidth: 70,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "employee_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee ID" }} />
                      ),
                      others: {
                        maxWidth: 100,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Full Name" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "sex",
                      label: <AlgaehLabel label={{ forceLabel: "gender" }} />,
                      others: {
                        maxWidth: 80,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "designation",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "employee_designation_id" }}
                        />
                      ),

                      others: {
                        maxWidth: 200,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "nationality_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Nationality" }} />
                      ),

                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "religion_name",
                      label: <AlgaehLabel label={{ forceLabel: "Religion" }} />,

                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },

                    {
                      fieldName: "department_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Department" }} />
                      ),

                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "sub_department_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Sub Department" }} />
                      ),

                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    // {
                    //   fieldName: "license_number",
                    //   label: (
                    //     <AlgaehLabel label={{ fieldName: "license_number" }} />
                    //   ),
                    //   others: {
                    //     resizable: false,
                    //     style: { textAlign: "center" }
                    //   }
                    // },
                    {
                      fieldName: "secondary_contact_no",
                      label: <AlgaehLabel label={{ forceLabel: "Work No." }} />,
                      others: {
                        maxWidth: 120,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "work_email",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Work Email" }} />
                      ),
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center", wordBreak: "break-all" }
                      }
                    }
                  ]}
                  keyId="service_code"
                  dataSource={{
                    data: this.state.Employeedetails
                  }}
                  filter={true}
                  // isEditable={true}
                  paging={{ page: 0, rowsPerPage: 50 }}
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
    subdepartment: state.subdepartment,
    designations: state.designations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSubDepartment: AlgaehActions,
      getDesignations: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EmployeeMasterIndex)
);
