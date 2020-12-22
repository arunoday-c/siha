import React, { useState } from "react";
import { useQuery } from "react-query";
import { Controller, useForm } from "react-hook-form";
// import moment from "moment";
// import EmployeeMaster from "./EmployeeMasterBeta/EmployeeMasterBeta";
import EmployeeModal from "./EmployeeMasterBeta/EmployeeMasterPopUp/index";
import {
  // MainContext,
  // AlgaehLabel,
  Spin,
  // AlgaehMessagePop,
  // AlgaehSecurityComponent,
  AlgaehDataGrid,
  AlgaehAutoComplete,
} from "algaeh-react-components";
// import {
//   // getCookie,
//   algaehApiCall,
//   swalMessage,
// } from "../../../utils/algaehApiCall";
import _ from "lodash";
import { newAlgaehApi } from "../../../hooks/";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";

// import { setGlobal } from "../../../utils/GlobalFunctions";
import AlgaehFile from "../../Wrapper/algaehFileUpload";
const getOrganisation = async (key) => {
  const result = await newAlgaehApi({
    uri: `/organization/getOrganizationByUser`,
    method: "GET",
  });
  return result?.data?.records;
};
const getEmployeesDetails = async (key, { hospital_id, branches }) => {
  let inputObj = {};
  if (hospital_id === -1) {
    const all_branches = branches.map((item) => {
      return item.hims_d_hospital_id;
    });
    inputObj = {
      select_all: true,
      hospital_id: all_branches,
      show_all_status: true,
    };
  } else {
    debugger;
    inputObj = { hospital_id: hospital_id, show_all_status: true };
  }
  const result = await newAlgaehApi({
    uri: "/employee/getEmployeesDetails",
    module: "hrManagement",
    method: "GET",
    data: inputObj,
  });
  return result?.data?.records;
};
export default function EmployeeMasterIndex() {
  // const { userLanguage, userToken } = useContext(MainContext);
  // const [isOpen,setIsOpen]=useState(false)
  // const [employeeDetailsPop,setEmployeeDetailsPop]=useState({})
  // const [editEmployee,setEditEmployee]=useState()
  // const [Employeedetails, setEmployeeDetails] = useState([]);
  // const [branches, setBranches] = useStateWithCallbackLazy([]);
  const [hospital_id, setHospital_id] = useState(-1);
  const [currentEmployee, setCurrentEmployee] = useState([]);
  const [editEmployee, setEditEmployee] = useState(false);
  const [employee_status, setEmployeeStatus] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const {
    control,
    errors,
    // handleSubmit,
    // setValue, //watch,
    // getValues,
  } = useForm({
    defaultValues: {
      hospital_id: -1,
    },
  });

  // useEffect(() => {
  //   debugger;
  //   algaehApiCall({
  //     uri: `/organization/getOrganizationByUser`,
  //     method: "GET",
  //     onSuccess: (response) => {
  //       if (response.data.success === true) {
  //         debugger;
  //         response.data.records.push({
  //           hims_d_hospital_id: -1,
  //           hospital_name: "All",
  //         });
  //         setBranches(response.data.records);
  //       }
  //     },
  //     onCatch: (error) => {
  //       console.log("error", error);
  //     },
  //   });
  // }, []);
  // useEffect(() => {
  //   if (branches.length > 0) {
  //     getEmployeeDetails();
  //   }
  // }, [branches, hospital_id]);
  const { data: branches, isLoading: tableLoading } = useQuery(
    ["get-branches", {}],
    getOrganisation,
    {
      onSuccess: (data) => {
        data.push({
          hims_d_hospital_id: -1,
          hospital_name: "All",
        });
      },
      onFailure: (errors) => {},
    }
  );
  const { data: Employeedetails } = useQuery(
    ["employee-details", { hospital_id: hospital_id, branches: branches }],
    getEmployeesDetails,
    {
      enabled: !!branches,

      retry: 0,
      initialStale: true,
      //   onSuccess: (data) => {

      //   },
      //   onFailure:(errors)=>{

      //   }
    }
  );
  const EditEmployeeMaster = (row) => {
    debugger;
    setIsOpen((state) => !state);
    setCurrentEmployee(row);
    setEditEmployee(true);
    setEmployeeStatus(row.employee_status);
  };
  const CloseModel = (e) => {
    setIsOpen((state) => !state);
    // afterClose: true,

    // if (e === true) {
    //   getEmployeeDetails(this, this);
    // }
  };
  // const getEmployeeDetails = () => {
  //   let inputObj = {};

  //   if (hospital_id === -1) {
  //     const all_branches = branches.map((item) => {
  //       return item.hims_d_hospital_id;
  //     });
  //     inputObj = {
  //       select_all: true,
  //       hospital_id: all_branches,
  //       show_all_status: true,
  //     };
  //   } else {
  //     debugger;
  //     inputObj = { hospital_id: hospital_id, show_all_status: true };
  //   }
  //   algaehApiCall({
  //     uri: "/employee/get",
  //     module: "hrManagement",
  //     method: "GET",
  //     data: inputObj,
  //     onSuccess: (response) => {
  //       if (response.data.success) {
  //         debugger;
  //         let data = response.data.records;

  //         setEmployeeDetails(data);
  //         // AlgaehLoader({ show: false });
  //       }
  //     },
  //     onFailure: (error) => {
  //       swalMessage({
  //         title: error.message,
  //         type: "error",
  //       });
  //       // AlgaehLoader({ show: false });
  //     },
  //   });
  // };
  if (Employeedetails !== undefined) {
    let _Active = [];

    let _Resigned = [];

    let _Terminated = [];
    let _Inactive = [];
    let _Suspended = [];
    if (Employeedetails !== undefined) {
      _Active = _.filter(Employeedetails, (f) => {
        return f.employee_status === "A";
      });

      _Resigned = _.filter(Employeedetails, (f) => {
        return f.employee_status === "R";
      });
      _Terminated = _.filter(Employeedetails, (f) => {
        return f.employee_status === "T";
      });

      _Inactive = _.filter(Employeedetails, (f) => {
        return f.employee_status === "I";
      });
      _Suspended = _.filter(Employeedetails, (f) => {
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
                // onClick={this.onClickHandler.bind(this)}
                // Download action come here
              >
                <i className="fas fa-download" />
              </button>
              <button
                className="btn btn-primary btn-circle active"
                // onClick={this.ShowModel.bind(this)}
              >
                <i className="fas fa-plus" />
              </button>

              <EmployeeModal
                HeaderCaption={
                  <AlgaehLabel
                    label={{
                      fieldName: "employee_master",
                      align: "ltr",
                    }}
                  />
                }
                open={isOpen}
                onClose={CloseModel}
                editEmployee={editEmployee}
                employeeDetailsPop={currentEmployee}
                employee_status={employee_status}
                // Employeedetails={this.state.Employeedetails}
              />
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              {/* {this.state.AllBranches === false ? ( */}
              <Controller
                control={control}
                name="hospital_id"
                rules={{ required: "Please Select Branch" }}
                render={({ onBlur, onChange, value }) => (
                  <AlgaehAutoComplete
                    div={{ className: "col-lg-2 mandatory" }}
                    label={{
                      fieldName: "hospital_id",
                      isImp: true,
                    }}
                    error={errors}
                    selector={{
                      name: "hospital_id",
                      className: "select-fld",
                      value,
                      dataSource: {
                        textField: "hospital_name",
                        valueField: "hims_d_hospital_id",
                        data: branches, //this.props.organizations,
                      },
                      ...value,
                      onChange: (_, selected) => {
                        onChange(selected);

                        setHospital_id(parseInt(selected));
                      },
                      onClear: () => {
                        onChange("");
                      },
                      others: {
                        // disabled,
                        tabIndex: "1",
                      },
                    }}
                  />
                )}
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
            <Spin spinning={tableLoading}>
              <div className="row">
                <div className="col-lg-12" id="employeeIndexGrid">
                  <AlgaehDataGrid
                    id="employee_grid"
                    // forceRender={this.state.forceRender}
                    columns={[
                      {
                        fieldName: "action",

                        label: "Action",

                        displayTemplate: (row) => {
                          return (
                            <span>
                              <i
                                className="fas fa-pen"
                                onClick={() => {
                                  EditEmployeeMaster(row);
                                }}
                              />
                            </span>
                          );
                        },
                      },
                      {
                        fieldName: "employee_img",
                        label: "Profile Img",
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
                      },
                      {
                        fieldName: "employee_status",
                        label: "Status",
                        sortable: true,
                        filterable: true,
                        displayTemplate: (row) => {
                          return row.employee_status === "A" ? (
                            <span className="badge badge-success">Active</span>
                          ) : row.employee_status === "I" ? (
                            <span className="badge badge-dark">Inactive</span>
                          ) : row.employee_status === "R" ? (
                            <span className="badge badge-warning">
                              Resigned
                            </span>
                          ) : row.employee_status === "T" ? (
                            <span className="badge badge-secondary">
                              Terminated
                            </span>
                          ) : null;
                        },
                      },
                      {
                        fieldName: "employee_code",
                        label: "Employee Code",
                        sortable: true,
                        filterable: true,
                      },
                      {
                        fieldName: "identity_no",
                        label: "ID Number",
                        sortable: true,
                        filterable: true,
                      },
                      {
                        fieldName: "full_name",
                        label: "Employee Name",
                        sortable: true,
                        filterable: true,
                      },
                      {
                        fieldName: "arabic_name",
                        label: "Employee Arabic Name",
                        sortable: true,
                        filterable: true,
                      },
                      {
                        fieldName: "sex",
                        label: "gender",
                        sortable: true,
                        filterable: true,
                      },
                      {
                        fieldName: "designation",
                        label: "employee_designation_id",

                        sortable: true,
                        filterable: true,
                      },
                      {
                        fieldName: "nationality_name",
                        label: "Nationality",

                        sortable: true,
                        filterable: true,
                      },
                      {
                        fieldName: "religion_name",
                        label: "Religion",
                        sortable: true,
                        filterable: true,
                      },

                      {
                        fieldName: "department_name",
                        label: "Department",
                        sortable: true,
                        filterable: true,
                      },
                      {
                        fieldName: "sub_department_name",
                        label: "Sub Department",
                        sortable: true,
                        filterable: true,
                      },
                      {
                        fieldName: "createdUser",
                        label: "Created By",
                        sortable: true,
                        filterable: true,
                      },
                      {
                        fieldName: "updatedUser",
                        label: "Updated By",
                        sortable: true,
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
                    rowUnique="service_code"
                    data={Employeedetails || []}
                    pagination={true}
                    isFilterable={true}
                    // isEditable={true}
                    paging={{ page: 0, rowsPerPage: 50 }}
                  />
                </div>
              </div>
            </Spin>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
// import React, { Component } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import "./employee_master_index.scss";
// import "../../../styles/site.scss";
// import {
//   AlgaehLabel,
//   AlgaehDataGrid,
//   AlagehAutoComplete,
// } from "../../Wrapper/algaehWrapper";
// import AlgaehFile from "../../Wrapper/algaehFileUpload";
// import { AlgaehActions } from "../../../actions/algaehActions";
// import EmployeeMaster from "./EmployeeMasterBeta/EmployeeMasterBeta";
// import moment from "moment";
// import Options from "../../../Options.json";
// import {
//   getCookie,
//   algaehApiCall,
//   swalMessage,
// } from "../../../utils/algaehApiCall";
// import { setGlobal } from "../../../utils/GlobalFunctions";
// import {
//   getEmployeeDetails,
//   EditEmployeeMaster,
//   texthandle,
//   // selectAllBranches,
// } from "./EmployeeMasterIndexEventBeta";
// // import variableJson from "../../../utils/GlobalVariables.json";
// import { MainContext } from "algaeh-react-components";
// import _ from "lodash";

// class EmployeeMasterIndex extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isOpen: false,
//       employeeDetailsPop: {},
//       Employeedetails: [],
//       selectedLang: "en",
//       editEmployee: false,
//       forceRender: false,
//       hospital_id: "",
//       // AllBranches: false,
//       branches: [],
//     };
//   }
//   static contextType = MainContext;
//   componentDidMount() {
//     const userToken = this.context.userToken;

//     let prevLang = getCookie("Language");
//     setGlobal({ selectedLang: prevLang });
//     this.setState(
//       {
//         selectedLang: prevLang,
//         hospital_id: userToken.hims_d_hospital_id,
//       },
//       () => getEmployeeDetails(this, this)
//     );

//     if (
//       this.props.designations === undefined ||
//       this.props.designations.length === 0
//     ) {
//       this.props.getDesignations({
//         uri: "/hrsettings/getDesignations",
//         module: "hrManagement",
//         method: "GET",
//         redux: {
//           type: "SERVICES_GET_DATA",
//           mappingName: "designations",
//         },
//       });
//     }

//     if (
//       this.props.organizations === undefined ||
//       this.props.organizations.length === 0
//     ) {
//       this.props.getOrganizations({
//         uri: "/organization/getOrganizationByUser",
//         method: "GET",
//         redux: {
//           type: "ORGS_GET_DATA",
//           mappingName: "organizations",
//         },
//         afterSuccess: (result) => {
//           result.push({
//             hims_d_hospital_id: -1,
//             hospital_name: "All",
//           });
//           this.setState({ branches: result });
//         },
//       });
//     } else {
//       const result = this.props.organizations;
//       result.push({
//         hims_d_hospital_id: -1,
//         hospital_name: "All",
//       });
//       this.setState({ branches: result });
//       // this.setState({ branches: result });
//     }

//     if (
//       this.props.subdepartment === undefined ||
//       this.props.subdepartment.length === 0
//     ) {
//       this.props.getSubDepartment({
//         uri: "/department/get/subdepartment",
//         module: "masterSettings",
//         data: {
//           sub_department_status: "A",
//         },
//         method: "GET",
//         redux: {
//           type: "SUB_DEPT_GET_DATA",
//           mappingName: "subdepartment",
//         },
//       });
//     }
//   }

//   onClickHandler(e) {
//     debugger;
//     algaehApiCall({
//       uri: "/employee/downloadEmployeeMaster",
//       method: "GET",
//       data: { hospital_id: this.state.hospital_id },
//       headers: {
//         Accept: "blob",
//       },
//       module: "hrManagement",
//       others: { responseType: "blob" },
//       onSuccess: (res) => {
//         let blob = new Blob([res.data], {
//           type: "application/octet-stream",
//         });
//         const fileName = `EmployeeMaster.xlsx`;
//         var objectUrl = URL.createObjectURL(blob);
//         var link = document.createElement("a");
//         link.setAttribute("href", objectUrl);
//         link.setAttribute("download", fileName);
//         link.click();
//       },
//       onCatch: (error) => {
//         debugger;
//         var reader = new FileReader();
//         reader.onload = function () {
//           const parse = JSON.parse(reader.result);
//           swalMessage({
//             type: "error",
//             title: parse !== undefined ? parse.result.message : parse,
//           });
//         };
//         reader.readAsText(error.response.data);
//       },
//     });
//   }

//   ShowModel(e) {
//     this.setState({
//       ...this.state,
//       isOpen: !this.state.isOpen,
//       employeeDetailsPop: {},
//       editEmployee: false,
//     });
//   }

//   CloseModel(e) {
//     this.setState(
//       {
//         isOpen: !this.state.isOpen,
//         afterClose: true,
//       },
//       () => {
//         if (e === true) {
//           getEmployeeDetails(this, this);
//         }
//       }
//     );
//   }

//   changeDateFormat = (date) => {
//     if (date != null) {
//       return moment(date).format(Options.dateFormat);
//     }
//   };

//   setUpdateComponent(row, e) {
//     this.setState({
//       isOpen: true,
//     });
//   }

//   EditItemMaster(row) {
//     row.addNew = false;
//     this.setState({
//       isOpen: !this.state.isOpen,
//       servicePop: row,
//       addNew: false,
//     });
//   }

//   render() {
//     let _Active = [];

//     let _Resigned = [];

//     let _Terminated = [];
//     let _Inactive = [];
//     let _Suspended = [];
//     if (this.state.Employeedetails !== undefined) {
//       _Active = _.filter(this.state.Employeedetails, (f) => {
//         return f.employee_status === "A";
//       });

//       _Resigned = _.filter(this.state.Employeedetails, (f) => {
//         return f.employee_status === "R";
//       });
//       _Terminated = _.filter(this.state.Employeedetails, (f) => {
//         return f.employee_status === "T";
//       });

//       _Inactive = _.filter(this.state.Employeedetails, (f) => {
//         return f.employee_status === "I";
//       });
//       _Suspended = _.filter(this.state.Employeedetails, (f) => {
//         return f.suspend_salary === "Y";
//       });
//     }
//
//   }
// }

// function mapStateToProps(state) {
//   return {
//     subdepartment: state.subdepartment,
//     designations: state.designations,
//     organizations: state.organizations,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getSubDepartment: AlgaehActions,
//       getDesignations: AlgaehActions,
//       getOrganizations: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(EmployeeMasterIndex)
// );
