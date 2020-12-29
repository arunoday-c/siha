import React, { useState } from "react";
import { useQuery } from "react-query";
import { Controller, useForm } from "react-hook-form";
// import moment from "moment";
// import EmployeeMaster from "./EmployeeMasterBeta/EmployeeMasterBeta";
import EmployeeModal from "./EmployeeMasterBeta/EmployeeMasterPopUp/index";
import "./employee_master_index.scss";
import "../../../styles/site.scss";
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
    "get-branches",
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
      <div className="">
        <div className="row" style={{ marginTop: 15 }}>
          <Controller
            control={control}
            name="hospital_id"
            rules={{ required: "Please Select Branch" }}
            render={({ onBlur, onChange, value }) => (
              <AlgaehAutoComplete
                div={{ className: "col-3 mandatory" }}
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
          <div className="col-lg-9 col-md-9 employeeMasterLegend">
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
        <div
          className="portlet portlet-bordered margin-bottom-15"
          style={{ marginTop: 10 }}
        >
          <div className="portlet-body">
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
                        label: "",
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
                        sortable: false,
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
                        sortable: false,
                        filterable: true,
                      },
                      {
                        fieldName: "identity_no",
                        label: "ID Number",
                        sortable: false,
                        filterable: true,
                      },
                      {
                        fieldName: "full_name",
                        label: "Employee Name",
                        sortable: false,
                        filterable: true,
                      },
                      {
                        fieldName: "arabic_name",
                        label: "Employee Arabic Name",
                        sortable: false,
                        filterable: true,
                      },
                      {
                        fieldName: "sex",
                        label: "gender",
                        sortable: false,
                        filterable: true,
                      },
                      {
                        forceLabel: "designation",
                        label: "Designation",
                        sortable: false,
                        filterable: true,
                      },
                      {
                        fieldName: "nationality_name",
                        label: "Nationality",

                        sortable: false,
                        filterable: true,
                      },
                      {
                        fieldName: "religion_name",
                        label: "Religion",
                        sortable: false,
                        filterable: true,
                      },

                      {
                        fieldName: "department_name",
                        label: "Department",
                        sortable: false,
                        filterable: true,
                      },
                      {
                        fieldName: "sub_department_name",
                        label: "Sub Department",
                        sortable: false,
                        filterable: true,
                      },
                      {
                        fieldName: "createdUser",
                        label: "Created By",
                        sortable: false,
                        filterable: true,
                      },
                      {
                        fieldName: "updatedUser",
                        label: "Updated By",
                        sortable: false,
                        filterable: true,
                      },
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

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-12">
              <button
                className="btn btn-primary"
                // onClick={this.ShowModel.bind(this)}
              >
                Add an Employee
              </button>
              <button
                className="btn btn-other"
                // onClick={this.onClickHandler.bind(this)}
              >
                Download Employee List
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
        </div>
      </div>
    );
  }
  return null;
}
