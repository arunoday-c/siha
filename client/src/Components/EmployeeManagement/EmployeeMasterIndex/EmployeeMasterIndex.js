import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./employee_master_index.scss";
import "../../../styles/site.scss";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import AlgaehFile from "../../Wrapper/algaehFileUpload";
import { AlgaehActions } from "../../../actions/algaehActions";
import EmployeeMaster from "./EmployeeMaster/EmployeeMaster";
import moment from "moment";
import Options from "../../../Options.json";
import {
  getCookie,
  algaehApiCall,
  swalMessage,
} from "../../../utils/algaehApiCall";
import { setGlobal } from "../../../utils/GlobalFunctions";
import {
  getEmployeeDetails,
  EditEmployeeMaster,
  texthandle,
  // selectAllBranches,
} from "./EmployeeMasterIndexEvent";
// import variableJson from "../../../utils/GlobalVariables.json";
import { MainContext, AlgaehDataGrid } from "algaeh-react-components";
import _ from "lodash";

class EmployeeMasterIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      employeeDetailsPop: {},
      Employeedetails: [],
      selectedLang: "en",
      editEmployee: false,
      forceRender: false,
      hospital_id: "",
      // AllBranches: false,
      branches: [],
    };
  }
  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });
    this.setState(
      {
        selectedLang: prevLang,
        hospital_id: userToken.hims_d_hospital_id,
      },
      () => getEmployeeDetails(this, this)
    );

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
          mappingName: "designations",
        },
      });
    }

    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganizationByUser",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations",
        },
        afterSuccess: (result) => {
          result.push({
            hims_d_hospital_id: -1,
            hospital_name: "All",
          });
          this.setState({ branches: result });
        },
      });
    } else {
      const result = this.props.organizations;
      result.push({
        hims_d_hospital_id: -1,
        hospital_name: "All",
      });
      this.setState({ branches: result });
      // this.setState({ branches: result });
    }

    if (
      this.props.subdepartment === undefined ||
      this.props.subdepartment.length === 0
    ) {
      this.props.getSubDepartment({
        uri: "/department/get/subdepartment",
        module: "masterSettings",
        data: {
          sub_department_status: "A",
        },
        method: "GET",
        redux: {
          type: "SUB_DEPT_GET_DATA",
          mappingName: "subdepartment",
        },
      });
    }
  }

  onClickHandler(e) {
    algaehApiCall({
      uri: "/employee/downloadEmployeeMaster",
      method: "GET",
      data: { hospital_id: this.state.hospital_id },
      headers: {
        Accept: "blob",
      },
      module: "hrManagement",
      others: { responseType: "blob" },
      onSuccess: (res) => {
        let blob = new Blob([res.data], {
          type: "application/octet-stream",
        });
        const fileName = `EmployeeMaster.xlsx`;
        var objectUrl = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.setAttribute("href", objectUrl);
        link.setAttribute("download", fileName);
        link.click();
      },
      onCatch: (error) => {
        var reader = new FileReader();
        reader.onload = function () {
          const parse = JSON.parse(reader.result);
          swalMessage({
            type: "error",
            title: parse !== undefined ? parse.result.message : parse,
          });
        };
        reader.readAsText(error.response.data);
      },
    });
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      employeeDetailsPop: {},
      editEmployee: false,
    });
  }

  CloseModel(e) {
    this.setState(
      {
        isOpen: !this.state.isOpen,
        afterClose: true,
      },
      () => {
        if (e === true) {
          getEmployeeDetails(this, this);
        }
      }
    );
  }

  changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  setUpdateComponent(row, e) {
    this.setState({
      isOpen: true,
    });
  }

  EditItemMaster(row) {
    row.addNew = false;
    this.setState({
      isOpen: !this.state.isOpen,
      servicePop: row,
      addNew: false,
    });
  }

  render() {
    let _Active = [];

    let _Resigned = [];

    let _Terminated = [];
    let _Inactive = [];
    let _Suspended = [];
    if (this.state.Employeedetails !== undefined) {
      _Active = _.filter(this.state.Employeedetails, (f) => {
        return f.employee_status === "A";
      });

      _Resigned = _.filter(this.state.Employeedetails, (f) => {
        return f.employee_status === "R";
      });
      _Terminated = _.filter(this.state.Employeedetails, (f) => {
        return f.employee_status === "T";
      });

      _Inactive = _.filter(this.state.Employeedetails, (f) => {
        return f.employee_status === "I";
      });
      _Suspended = _.filter(this.state.Employeedetails, (f) => {
        return f.suspend_salary === "Y";
      });
    }
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
              <button
                className="btn btn-default btn-circle active"
                style={{ marginRight: 10 }}
                onClick={this.onClickHandler.bind(this)}
                // Download action come here
              >
                <i className="fas fa-download" />
              </button>
              <button
                className="btn btn-primary btn-circle active"
                onClick={this.ShowModel.bind(this)}
              >
                <i className="fas fa-plus" />
              </button>

              <EmployeeMaster
                HeaderCaption={
                  <AlgaehLabel
                    label={{
                      fieldName: "employee_master",
                      align: "ltr",
                    }}
                  />
                }
                open={this.state.isOpen}
                onClose={this.CloseModel.bind(this)}
                editEmployee={this.state.editEmployee}
                employeeDetailsPop={this.state.employeeDetailsPop}
                employee_status={this.state.employee_status}
                Employeedetails={this.state.Employeedetails}
              />
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              {/* {this.state.AllBranches === false ? ( */}
              <AlagehAutoComplete
                div={{ className: "col-lg-3 col-md-3 col-sm-12" }}
                label={{
                  forceLabel: "Select Branch",
                }}
                selector={{
                  name: "hospital_id",
                  className: "select-fld",
                  value: this.state.hospital_id,
                  dataSource: {
                    textField: "hospital_name",
                    valueField: "hims_d_hospital_id",
                    data: this.state.branches, //this.props.organizations,
                  },
                  onChange: texthandle.bind(this, this),
                  others: {
                    tabIndex: "2",
                  },
                  onClear: () => {
                    this.setState({
                      hospital_id: null,
                    });
                  },
                }}
              />
              {/* ) : null} */}
              {/* <div className="col-lg-2 col-md-2 col-sm-12">
                <label>View All Branch</label>
                <div className="customCheckbox">
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="AllBranches"
                      checked={this.state.AllBranches}
                      onChange={selectAllBranches.bind(this, this)}
                    />
                    <span>Yes</span>
                  </label>
                </div>
              </div> */}
              <div className="col-lg-9 col-md-9 col-sm-12 employeeMasterLegend">
                <div className="card-group">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{_Active.length}</h5>
                      <p className="card-text">
                        <span className="badge badge-success">Active</span>
                      </p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{_Inactive.length}</h5>
                      <p className="card-text">
                        <span className="badge badge-dark">Inactive</span>
                      </p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{_Resigned.length}</h5>
                      <p className="card-text">
                        <span className="badge badge-warning">Resigned</span>
                      </p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{_Terminated.length}</h5>
                      <p className="card-text">
                        <span className="badge badge-danger">Terminated</span>
                      </p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{_Suspended.length}</h5>
                      <p className="card-text">
                        <span className="badge badge-secondary">Suspended</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12" id="employeeIndexGrid">
                <AlgaehDataGrid
                  id="employee_grid"
                  forceRender={this.state.forceRender}
                  columns={[
                    {
                      fieldName: "action",

                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: (row) => {
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
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "employee_img",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Profile Img" }} />
                      ),
                      displayTemplate: (row) => (
                        <AlgaehFile
                          name="attach_photo"
                          accept="image/*"
                          textAltMessage={row.full_name}
                          showActions={false}
                          serviceParameters={{
                            uniqueID: row.employee_code,
                            destinationName: row.employee_code,
                            fileType: "Employees",
                          }}
                        />
                      ),
                      others: {
                        maxWidth: 90,
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "employee_status",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      displayTemplate: (row) => {
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
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                      filterType: "choices",
                      choices: [
                        {
                          name: "Active",
                          value: "A",
                        },
                        {
                          name: "Inactive",
                          value: "I",
                        },
                        {
                          name: "Resigned",
                          value: "R",
                        },
                        {
                          name: "Terminated",
                          value: "T",
                        },
                      ],
                    },
                    {
                      fieldName: "employee_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee Code" }} />
                      ),
                      others: {
                        maxWidth: 100,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "identity_no",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "ID Number" }} />
                      ),
                      others: {
                        maxWidth: 100,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                      ),
                      others: {
                        // minWidth: 200,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "arabic_name",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Employee Arabic Name" }}
                        />
                      ),
                      others: {
                        // minWidth: 200,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "sex",
                      label: <AlgaehLabel label={{ forceLabel: "gender" }} />,
                      others: {
                        maxWidth: 80,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
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
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "nationality_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Nationality" }} />
                      ),

                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "religion_name",
                      label: <AlgaehLabel label={{ forceLabel: "Religion" }} />,

                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },

                    {
                      fieldName: "department_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Department" }} />
                      ),

                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "sub_department_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Sub Department" }} />
                      ),

                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "createdUser",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Created By" }} />
                      ),

                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
                    },
                    {
                      fieldName: "updatedUser",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Updated By" }} />
                      ),
                      others: {
                        maxWidth: 150,
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      filterable: true,
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
                    // {
                    //   fieldName: "secondary_contact_no",
                    //   label: (
                    //     <AlgaehLabel
                    //       label={{ forceLabel: "Work Contact No." }}
                    //     />
                    //   ),
                    //   others: {
                    //     minWidth: 120,
                    //     resizable: false,
                    //     style: { textAlign: "center" }
                    //   }
                    // },
                    // {
                    //   fieldName: "work_email",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: "Work Email ID" }} />
                    //   ),
                    //   others: {
                    //     minWidth: 100,
                    //     resizable: false,
                    //     style: { textAlign: "center", wordBreak: "break-all" }
                    //   }
                    // }
                  ]}
                  keyId="service_code"
                  // dataSource={{
                  //   data: this.state.Employeedetails,
                  // }}

                  data={this.state.Employeedetails}
                  pagination={true}
                  isFilterable={true}
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
    designations: state.designations,
    organizations: state.organizations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSubDepartment: AlgaehActions,
      getDesignations: AlgaehActions,
      getOrganizations: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EmployeeMasterIndex)
);
