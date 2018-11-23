import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./employee_master_index.css";
import "../../../styles/site.css";
import { AlgaehLabel, AlgaehDataGrid } from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import EmployeeMaster from "./EmployeeMaster/EmployeeMaster";
// import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import moment from "moment";
import Options from "../../../Options.json";
// import AppBar from "@material-ui/core/AppBar";
import { getCookie } from "../../../utils/algaehApiCall";
import { setGlobal } from "../../../utils/GlobalFunctions";
import {
  getEmployeeDetails,
  EditEmployeeMaster
} from "./EmployeeMasterIndexEvent";

class EmployeeMasterIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      employeeDetailsPop: {},
      Employeedetails: [],
      selectedLang: "en"
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
        uri: "/employeesetups/getDesignations",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "designations"
        }
      });
    }

    getEmployeeDetails(this, this);
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      employeeDetailsPop: {}
    });
  }

  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen
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
          className="portlet portlet-bordered box-shadow-normal margin-bottom-15"
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
                employeeDetailsPop={this.state.employeeDetailsPop}
              />
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="employeeIndexGrid">
                <AlgaehDataGrid
                  id="employee_grid"
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
                        style: { textAlign: "center" }
                      }
                    },

                    {
                      fieldName: "employee_code",
                      label: (
                        <AlgaehLabel label={{ fieldName: "employee_code" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },

                    {
                      fieldName: "full_name",
                      label: <AlgaehLabel label={{ fieldName: "full_name" }} />,
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "employee_designation_id",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "employee_designation_id" }}
                        />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.designations === undefined
                            ? []
                            : this.props.designations.filter(
                                f =>
                                  f.hims_d_designation_id ===
                                  row.employee_designation_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].designation
                              : ""}
                          </span>
                        );
                      },
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "license_number",
                      label: (
                        <AlgaehLabel label={{ fieldName: "license_number" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "primary_contact_no",
                      label: (
                        <AlgaehLabel label={{ fieldName: "contact_no" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "email",
                      label: <AlgaehLabel label={{ fieldName: "email" }} />,
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    }
                  ]}
                  keyId="service_code"
                  dataSource={{
                    data: this.state.Employeedetails
                  }}
                  // isEditable={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
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
    hospitalservices: state.hospitalservices,
    servicetype: state.servicetype,
    subdepartments: state.subdepartments,
    employeedetails: state.employeedetails,
    designations: state.designations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServices: AlgaehActions,
      getServiceTypes: AlgaehActions,
      getSubDepatments: AlgaehActions,
      getEmployeeDetails: AlgaehActions,
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
