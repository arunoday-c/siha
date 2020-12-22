// import { set } from "lodash";
import React, { useEffect, useState, useContext } from "react";
import {
  AlgaehSecurityElement,
  AlgaehSecurityComponent,
} from "algaeh-react-components";
import "./EmployeeMaster.scss";
import CommissionSetup from "./CommissionSetup/CommissionSetup";
import PersonalDetails from "./PersonalDetails/PersonalDetails";
import FamilyAndIdentification from "./FamilyAndIdentification/FamilyAndIdentification";
// import DeptUserDetails from "./DeptUserDetails/DeptUserDetails";
import PayRollDetails from "./PayRollDetails/PayRollDetails";
import OfficalDetails from "./OfficalDetails/OfficalDetails";
import RulesDetails from "./RulesDetails/RulesDetails";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import {
  MainContext,
  // AlgaehLabel,
  // Spin,
  // AlgaehMessagePop,
  // AlgaehSecurityComponent,
} from "algaeh-react-components";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import { AlgaehLabel, AlgaehModalPopUp } from "../../../Wrapper/algaehWrapper";
export default function EmployeeMaster({
  open,
  onClose,
  editEmployee,
  employeeDetailsPop,
  employee_status,
  HeaderCaption,
}) {
  // const [HIMS_Active, setHIMS_Active] = useState(false);

  const [HRMS_Active, setHRMS_Active] = useState(false);
  const [pageDisplay, setPageDisplay] = useState("PersonalDetails");
  const [personalDetails, setPersonalDetails] = useState({});
  const {
    // userLanguage,
    userToken,
  } = useContext(MainContext);
  useEffect(() => {
    // const userToken = this.context.userToken;
    // let prevLang = getCookie("Language");

    // let IOputs = EmpMasterIOputs.inputParam();
    // IOputs.selectedLang = prevLang;

    // const HIMS_Active =
    //   userToken.product_type === "HIMS_ERP" ||
    //   userToken.product_type === "HIMS_CLINICAL" ||
    //   userToken.product_type === "NO_FINANCE"
    //     ? true
    //     : false;
    const HRMS_Active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HRMS" ||
      userToken.product_type === "HRMS_ERP" ||
      userToken.product_type === "FINANCE_ERP" ||
      userToken.product_type === "NO_FINANCE"
        ? true
        : false;
    setPersonalDetails(employeeDetailsPop);
    // setHIMS_Active(HIMS_Active);
    setHRMS_Active(HRMS_Active);
  }, []);
  const openTab = (e) => {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='empPersonal'",
      onSuccess: () => {
        let specified = e.currentTarget.getAttribute("algaehtabs");

        if (specified === "CommissionSetup") {
          AlgaehLoader({ show: true });
        }
        var element = document.querySelectorAll("[algaehtabs]");
        for (var i = 0; i < element.length; i++) {
          element[i].classList.remove("active");
        }
        e.currentTarget.classList.add("active");

        setPageDisplay(specified);
      },
    });
  };
  // const onClose = (e) => {
  //   return setPageDisplay("PersonalDetails"), onClose(e);
  // };

  return (
    <div className="hims_employee_master">
      <AlgaehModalPopUp
        open={open}
        events={{
          onClose: onClose,
        }}
        title={HeaderCaption}
        openPopup={open}
      >
        <div className="hims_employee_master">
          <div className="popupInner" style={{ height: "75vh" }}>
            <div className="tab-container toggle-section">
              {personalDetails.hims_d_employee_id !== null ? (
                <ul className="nav">
                  <AlgaehSecurityComponent componentCode="EMP_TAB_PER">
                    <li
                      algaehtabs={"PersonalDetails"}
                      className={"nav-item tab-button active"}
                      onClick={openTab}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            fieldName: "personal_details",
                          }}
                        />
                      }
                    </li>
                  </AlgaehSecurityComponent>
                  <AlgaehSecurityComponent componentCode="EMP_TAB_OFF">
                    <li
                      algaehtabs={"OfficalDetails"}
                      className={"nav-item tab-button"}
                      onClick={openTab}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Official Details",
                          }}
                        />
                      }
                    </li>
                  </AlgaehSecurityComponent>
                  {/*  <li
                      algaehtabs={"DeptUserDetails"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            fieldName: "deptuser_details"
                          }}
                        />
                      }
                    </li>*/}
                  {HRMS_Active === true ? (
                    <AlgaehSecurityComponent componentCode="EMP_TAB_PAY">
                      <li
                        algaehtabs={"PayRollDetails"}
                        className={"nav-item tab-button"}
                        onClick={openTab}
                      >
                        {
                          <AlgaehLabel
                            label={{
                              forceLabel: "Payroll Details",
                            }}
                          />
                        }
                      </li>{" "}
                    </AlgaehSecurityComponent>
                  ) : null}
                  {personalDetails.isdoctor === "Y" ? (
                    <AlgaehSecurityComponent componentCode="EMP_TAB_COMM">
                      <li
                        algaehtabs={"CommissionSetup"}
                        className={"nav-item tab-button"}
                        onClick={openTab}
                      >
                        {
                          <AlgaehLabel
                            label={{
                              fieldName: "commission_setup",
                            }}
                          />
                        }
                      </li>
                    </AlgaehSecurityComponent>
                  ) : null}
                  {HRMS_Active === true ? (
                    <AlgaehSecurityComponent componentCode="EMP_TAB_FAM">
                      <li
                        algaehtabs={"FamilyAndIdentification"}
                        className={"nav-item tab-button"}
                        onClick={openTab}
                      >
                        {
                          <AlgaehLabel
                            label={{
                              forceLabel: "Family & Identification Details",
                            }}
                          />
                        }
                      </li>
                    </AlgaehSecurityComponent>
                  ) : null}
                  {HRMS_Active === true ? (
                    <AlgaehSecurityComponent componentCode="EMP_TAB_RUL">
                      <li
                        algaehtabs={"RulesDetails"}
                        className={"nav-item tab-button"}
                        onClick={openTab}
                      >
                        {
                          <AlgaehLabel
                            label={{
                              forceLabel: "Rules Details",
                            }}
                          />
                        }
                      </li>
                    </AlgaehSecurityComponent>
                  ) : null}{" "}
                  {/* {this.state.HRMS_Active === true ? (
                      <li
                        algaehtabs={"MoreDetails"}
                        className={"nav-item tab-button"}
                        onClick={this.openTab.bind(this)}
                      >
                        {
                          <AlgaehLabel
                            label={{
                              forceLabel: "More Details",
                            }}
                          />
                        }
                      </li>
                    ) : null} */}
                </ul>
              ) : (
                <ul className="nav">
                  <li
                    algaehtabs={"PersonalDetails"}
                    className={"nav-item tab-button active"}
                    onClick={openTab}
                  >
                    {
                      <AlgaehLabel
                        label={{
                          fieldName: "personal_details",
                        }}
                      />
                    }
                  </li>

                  <li
                    algaehtabs={"OfficalDetails"}
                    className={"nav-item tab-button"}
                    onClick={openTab}
                  >
                    {
                      <AlgaehLabel
                        label={{
                          forceLabel: "Official Details",
                        }}
                      />
                    }
                  </li>

                  {/*<li
                      algaehtabs={"DeptUserDetails"}
                      className={"nav-item tab-button disableLi"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            fieldName: "deptuser_details"
                          }}
                        />
                      }
                    </li>*/}
                  {HRMS_Active === true ? (
                    <li
                      algaehtabs={"PayRollDetails"}
                      className={"nav-item tab-button disableLi"}
                      onClick={openTab}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Payroll Details",
                          }}
                        />
                      }
                    </li>
                  ) : null}
                  {/* {this.state.isdoctor === "Y" ? (
                      <li
                        algaehtabs={"CommissionSetup"}
                        className={"nav-item tab-button disableLi"}
                        onClick={openTab}
                      >
                        {
                          <AlgaehLabel
                            label={{
                              fieldName: "commission_setup",
                            }}
                          />
                        }
                      </li>
                    ) : null} */}
                  {HRMS_Active === true ? (
                    <li
                      algaehtabs={"FamilyAndIdentification"}
                      className={"nav-item tab-button disableLi"}
                      onClick={openTab}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Family & Identification Details",
                          }}
                        />
                      }
                    </li>
                  ) : null}

                  {HRMS_Active === true ? (
                    <li
                      algaehtabs={"RulesDetails"}
                      className={"nav-item tab-button disableLi"}
                      onClick={openTab}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Rules Details",
                          }}
                        />
                      }
                    </li>
                  ) : null}

                  {/* {this.state.HRMS_Active === true ? (
                      <li
                        algaehtabs={"MoreDetails"}
                        className={"nav-item tab-button disableLi"}
                        onClick={this.openTab.bind(this)}
                      >
                        {
                          <AlgaehLabel
                            label={{
                              forceLabel: "More Details",
                            }}
                          />
                        }
                      </li>
                    ) : null} */}
                </ul>
              )}
            </div>
            {/* <MyContext.Provider
                  value={{
                    state: this.state,
                    updateState: obj => {
                      this.setState({ ...obj });
                    }
                  }}
                >
                : this.state.pageDisplay === "DeptUserDetails" ? (
                  <DeptUserDetails EmpMasterIOputs={this} />
                )
                */}
            <div className="employee-section">
              {pageDisplay === "PersonalDetails" ? (
                <PersonalDetails
                  EmpMasterIOputs={employeeDetailsPop.employee_id}
                />
              ) : pageDisplay === "OfficalDetails" ? (
                <OfficalDetails
                  EmpMasterIOputs={employeeDetailsPop.employee_id}
                />
              ) : pageDisplay === "PayRollDetails" ? (
                <PayRollDetails
                  EmpMasterIOputs={employeeDetailsPop.employee_id}
                />
              ) : pageDisplay === "CommissionSetup" ? (
                <CommissionSetup
                  EmpMasterIOputs={employeeDetailsPop.employee_id}
                />
              ) : pageDisplay === "FamilyAndIdentification" ? (
                <FamilyAndIdentification
                  EmpMasterIOputs={employeeDetailsPop.employee_id}
                />
              ) : pageDisplay === "RulesDetails" ? (
                <RulesDetails
                  EmpMasterIOputs={employeeDetailsPop.employee_id}
                />
              ) : // ) : this.state.pageDisplay === "MoreDetails" ? (
              //   <MoreDetails EmpMasterIOputs={this} />
              null}
            </div>
            {/* </MyContext.Provider> */}
          </div>

          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-12">
                  <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                    <button
                      // onClick={InsertUpdateEmployee.bind(this, this)}
                      type="button"
                      className="btn btn-primary"
                      disabled={employee_status === "I" ? true : false}
                    >
                      {personalDetails.hims_d_employee_id === null ? (
                        <AlgaehLabel label={{ fieldName: "btnSave" }} />
                      ) : (
                        <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                      )}
                    </button>
                  </AlgaehSecurityElement>
                  <button
                    onClick={(e) => {
                      this.onClose(e);
                    }}
                    type="button"
                    className="btn btn-default"
                  >
                    <AlgaehLabel label={{ fieldName: "btnCancel" }} />
                  </button>

                  {/* <button
                      onClick={generateEmployeeContract.bind(this, this)}
                      type="button"
                      className="btn btn-other"
                      style={{ float: "left", margin: 0 }}
                    >
                      <AlgaehLabel label={{ forceLabel: "Print Contract" }} />
                    </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AlgaehModalPopUp>
    </div>
  );
}

// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import "./EmployeeMaster.scss";
// import CommissionSetup from "./CommissionSetup/CommissionSetup";
// import PersonalDetails from "./PersonalDetails/PersonalDetails";
// import FamilyAndIdentification from "./FamilyAndIdentification/FamilyAndIdentification";
// // import DeptUserDetails from "./DeptUserDetails/DeptUserDetails";
// import PayRollDetails from "./PayRollDetails/PayRollDetails";
// import OfficalDetails from "./OfficalDetails/OfficalDetails";
// import RulesDetails from "./RulesDetails/RulesDetails";
// // import MoreDetails from "./MoreDetails/MoreDetails";

// import { AlgaehLabel, AlgaehModalPopUp } from "../../../Wrapper/algaehWrapper";
// import { AlgaehActions } from "../../../../actions/algaehActions";
// // import MyContext from "../../../../utils/MyContext";
// import Enumerable from "linq";
// import EmpMasterIOputs from "../../../../Models/EmployeeMaster";
// import { getCookie } from "../../../../utils/algaehApiCall";
// import { InsertUpdateEmployee } from "./EmployeeMasterEventsBeta";
// import AlgaehLoader from "../../../Wrapper/fullPageLoader";
// import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
// import { MainContext ,AlgaehModal} from "algaeh-react-components";
// import {
//   AlgaehSecurityElement,
//   AlgaehSecurityComponent,
// } from "algaeh-react-components";

// class EmployeeMaster extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       pageDisplay: "PersonalDetails",
//       personalDetails: {},
//       department_and_other: {},
//       payroll: {},
//       HIMS_Active: false, //HIMS_Active.length > 0 ? true : false,
//       HRMS_Active: false, //HRMS_Active.length > 0 ? true : false
//     };
//   }
//   static contextType = MainContext;

//   openTab(e) {
//     AlgaehValidation({
//       alertTypeIcon: "warning",
//       querySelector: "data-validate='empPersonal'",
//       onSuccess: () => {
//         let specified = e.currentTarget.getAttribute("algaehtabs");

//         if (specified === "CommissionSetup") {
//           AlgaehLoader({ show: true });
//         }
//         var element = document.querySelectorAll("[algaehtabs]");
//         for (var i = 0; i < element.length; i++) {
//           element[i].classList.remove("active");
//         }
//         e.currentTarget.classList.add("active");

//         this.setState({
//           pageDisplay: specified,
//         });
//       },
//     });
//   }

//   onClose = (e) => {
//     this.setState(
//       {
//         pageDisplay: "PersonalDetails",
//       },
//       () => this.props.onClose && this.props.onClose(e)
//     );
//   };

//   componentDidMount() {
//     // let IOputs = EmpMasterIOputs.inputParam();
//     // this.setState(IOputs);
//     const userToken = this.context.userToken;
//     let prevLang = getCookie("Language");

//     let IOputs = EmpMasterIOputs.inputParam();
//     IOputs.selectedLang = prevLang;

//     const HIMS_Active =
//       userToken.product_type === "HIMS_ERP" ||
//       userToken.product_type === "HIMS_CLINICAL" ||
//       userToken.product_type === "NO_FINANCE"
//         ? true
//         : false;
//     const HRMS_Active =
//       userToken.product_type === "HIMS_ERP" ||
//       userToken.product_type === "HRMS" ||
//       userToken.product_type === "HRMS_ERP" ||
//       userToken.product_type === "FINANCE_ERP" ||
//       userToken.product_type === "NO_FINANCE"
//         ? true
//         : false;

//     this.setState(
//       {
//         personalDetails: {
//           ...IOputs,
//           ...this.props.employeeDetailsPop,
//         },
//         HIMS_Active: HIMS_Active,
//         HRMS_Active: HRMS_Active,
//         hospital_id: userToken.hims_d_hospital_id,
//       },
//       () => {
//         if (
//           this.props.subdepartment === undefined ||
//           this.props.subdepartment.length === 0
//         ) {
//           this.props.getSubDepartment({
//             uri: "/department/get/subdepartment",
//             module: "masterSettings",
//             data: {
//               sub_department_status: "A",
//             },
//             method: "GET",
//             redux: {
//               type: "SUB_DEPT_GET_DATA",
//               mappingName: "subdepartment",
//             },
//           });
//         }

//         if (this.state.HIMS_Active === true) {
//           if (
//             this.props.empservicetype === undefined ||
//             this.props.empservicetype.length === 0
//           ) {
//             this.props.getServiceTypes({
//               uri: "/serviceType",
//               module: "masterSettings",
//               method: "GET",
//               redux: {
//                 type: "SERVIES_TYPES_GET_DATA",
//                 mappingName: "empservicetype",
//               },
//             });
//           }
//           if (
//             this.props.empservices === undefined ||
//             this.props.empservices.length === 0
//           ) {
//             this.props.getServices({
//               uri: "/serviceType/getService",
//               module: "masterSettings",
//               method: "GET",
//               redux: {
//                 type: "SERVICES_GET_DATA",
//                 mappingName: "empservices",
//               },
//             });
//           }
//         }

//         if (
//           this.props.countries === undefined ||
//           this.props.countries.length === 0
//         ) {
//           this.props.getCountries({
//             uri: "/masters/get/countryStateCity",
//             method: "GET",
//             redux: {
//               type: "CTRY_GET_DATA",
//               mappingName: "countries",
//             },
//           });
//         }
//       }
//     );
//   }

//   UNSAFE_componentWillReceiveProps(newProps) {
//     if (newProps.editEmployee) {
//       let IOputs = newProps.employeeDetailsPop;
//       IOputs.Applicable = IOputs.isdoctor === "Y" ? true : false;
//       IOputs.samechecked = IOputs.same_address === "Y" ? true : false;

//       if (IOputs.present_country_id === null) {
//         this.setState({
//           personalDetails: { ...this.state.personalDetails, ...IOputs },
//         });
//         return;
//       }
//       if (IOputs.present_country_id !== newProps.present_country_id) {
//         let country = Enumerable.from(this.props.countries)
//           .where((w) => w.hims_d_country_id === IOputs.present_country_id)
//           .firstOrDefault();

//         let states = country !== undefined ? country.states : [];
//         if (this.props.countries !== undefined && states.length !== 0) {
//           if (newProps.present_state_id !== IOputs.present_state_id) {
//             let cities = Enumerable.from(states)
//               .where((w) => w.hims_d_state_id === IOputs.present_state_id)
//               .firstOrDefault();
//             if (IOputs.present_country_id === IOputs.permanent_country_id) {
//               IOputs.countrystates = states;
//               IOputs.cities = cities !== undefined ? cities.cities : [];
//               IOputs.precountrystates = states;
//               IOputs.precities = cities !== undefined ? cities.cities : [];
//               IOputs.present_cities = cities !== undefined ? cities.cities : [];
//               // IOputs.present_state_id = IOputs.present_state_id;
//               // IOputs.present_city_id = IOputs.present_city_id;
//               IOputs.samechecked = "Y";
//               // this.updateEmployeeTabs({
//               //   IOputscountrystates: states,
//               //   cities: cities !== undefined ? cities.cities : [],
//               //   precountrystates: states,
//               //   precities: cities !== undefined ? cities.cities : [],
//               //   present_cities: cities !== undefined ? cities.cities : [],
//               //   present_state_id: IOputs.present_state_id,
//               //   present_city_id: IOputs.present_city_id,
//               //   samechecked: "Y"
//               // });
//             } else {
//               country = Enumerable.from(this.props.countries)
//                 .where(
//                   (w) => w.hims_d_country_id === IOputs.permanent_country_id
//                 )
//                 .firstOrDefault();

//               let pres_states = country !== undefined ? country.states : [];
//               if (
//                 this.props.countries !== undefined &&
//                 pres_states.length !== 0
//               ) {
//                 if (newProps.permanent_state_id !== IOputs.permanent_state_id) {
//                   let pres_cities = Enumerable.from(pres_states)
//                     .where(
//                       (w) => w.hims_d_state_id === IOputs.permanent_state_id
//                     )
//                     .firstOrDefault();

//                   IOputs.countrystates = states;
//                   IOputs.cities = cities !== undefined ? cities.cities : [];
//                   IOputs.present_cities =
//                     cities !== undefined ? cities.cities : [];

//                   IOputs.precountrystates = pres_states;
//                   IOputs.precities =
//                     pres_cities !== undefined ? pres_cities.cities : [];
//                   // IOputs.present_state_id = IOputs.present_state_id;
//                   // IOputs.present_city_id = IOputs.present_city_id;

//                   // IOputs.permanent_city_id = IOputs.permanent_city_id;
//                   // IOputs.permanent_city_id = IOputs.permanent_city_id;
//                   IOputs.samechecked = "N";
//                   // this.updateEmployeeTabs({
//                   //   countrystates: states,
//                   //   cities: cities !== undefined ? cities.cities : [],
//                   //   present_cities: cities !== undefined ? cities.cities : [],
//                   //
//                   //   precountrystates: pres_states,
//                   //   precities:
//                   //     pres_cities !== undefined ? pres_cities.cities : [],
//                   //   present_state_id: IOputs.present_state_id,
//                   //   present_city_id: IOputs.present_city_id,
//                   //
//                   //   permanent_city_id: IOputs.permanent_city_id,
//                   //   permanent_city_id: IOputs.permanent_city_id,
//                   //   samechecked: "N"
//                   // });
//                 }
//               }
//             }
//           }
//         }
//       }
//       this.setState({
//         personalDetails: { ...this.state.personalDetails, ...IOputs },
//       });
//     } else {
//       this.setState({
//         personalDetails: { ...EmpMasterIOputs.inputParam() },
//       });
//     }
//   }
//   updateEmployeeTabs(options) {
//     this.setState({
//       personalDetails: {
//         ...this.state.personalDetails,
//         ...options,
//       },
//     });
//   }

//   render() {
//     return (
//       <div className="hims_employee_master">
//         <AlgaehModalPopUp
//           open={this.props.open}
//           events={{
//             onClose: this.onClose.bind(this),
//           }}
//           title={this.props.HeaderCaption}
//           openPopup={this.props.open}
//         >
//           <div className="hims_employee_master">
//             <div className="popupInner" style={{ height: "75vh" }}>
//               <div className="tab-container toggle-section">
//                 {this.state.personalDetails.hims_d_employee_id !== null ? (
//                   <ul className="nav">
//                     <AlgaehSecurityComponent componentCode="EMP_TAB_PER">
//                       <li
//                         algaehtabs={"PersonalDetails"}
//                         className={"nav-item tab-button active"}
//                         onClick={this.openTab.bind(this)}
//                       >
//                         {
//                           <AlgaehLabel
//                             label={{
//                               fieldName: "personal_details",
//                             }}
//                           />
//                         }
//                       </li>
//                     </AlgaehSecurityComponent>
//                     <AlgaehSecurityComponent componentCode="EMP_TAB_OFF">
//                       <li
//                         algaehtabs={"OfficalDetails"}
//                         className={"nav-item tab-button"}
//                         onClick={this.openTab.bind(this)}
//                       >
//                         {
//                           <AlgaehLabel
//                             label={{
//                               forceLabel: "Official Details",
//                             }}
//                           />
//                         }
//                       </li>
//                     </AlgaehSecurityComponent>
//                     {/*  <li
//                       algaehtabs={"DeptUserDetails"}
//                       className={"nav-item tab-button"}
//                       onClick={this.openTab.bind(this)}
//                     >
//                       {
//                         <AlgaehLabel
//                           label={{
//                             fieldName: "deptuser_details"
//                           }}
//                         />
//                       }
//                     </li>*/}
//                     {this.state.HRMS_Active === true ? (
//                       <AlgaehSecurityComponent componentCode="EMP_TAB_PAY">
//                         <li
//                           algaehtabs={"PayRollDetails"}
//                           className={"nav-item tab-button"}
//                           onClick={this.openTab.bind(this)}
//                         >
//                           {
//                             <AlgaehLabel
//                               label={{
//                                 forceLabel: "Payroll Details",
//                               }}
//                             />
//                           }
//                         </li>{" "}
//                       </AlgaehSecurityComponent>
//                     ) : null}
//                     {this.state.personalDetails.isdoctor === "Y" ? (
//                       <AlgaehSecurityComponent componentCode="EMP_TAB_COMM">
//                         <li
//                           algaehtabs={"CommissionSetup"}
//                           className={"nav-item tab-button"}
//                           onClick={this.openTab.bind(this)}
//                         >
//                           {
//                             <AlgaehLabel
//                               label={{
//                                 fieldName: "commission_setup",
//                               }}
//                             />
//                           }
//                         </li>
//                       </AlgaehSecurityComponent>
//                     ) : null}
//                     {this.state.HRMS_Active === true ? (
//                       <AlgaehSecurityComponent componentCode="EMP_TAB_FAM">
//                         <li
//                           algaehtabs={"FamilyAndIdentification"}
//                           className={"nav-item tab-button"}
//                           onClick={this.openTab.bind(this)}
//                         >
//                           {
//                             <AlgaehLabel
//                               label={{
//                                 forceLabel: "Family & Identification Details",
//                               }}
//                             />
//                           }
//                         </li>
//                       </AlgaehSecurityComponent>
//                     ) : null}
//                     {this.state.HRMS_Active === true ? (
//                       <AlgaehSecurityComponent componentCode="EMP_TAB_RUL">
//                         <li
//                           algaehtabs={"RulesDetails"}
//                           className={"nav-item tab-button"}
//                           onClick={this.openTab.bind(this)}
//                         >
//                           {
//                             <AlgaehLabel
//                               label={{
//                                 forceLabel: "Rules Details",
//                               }}
//                             />
//                           }
//                         </li>
//                       </AlgaehSecurityComponent>
//                     ) : null}{" "}
//                     {/* {this.state.HRMS_Active === true ? (
//                       <li
//                         algaehtabs={"MoreDetails"}
//                         className={"nav-item tab-button"}
//                         onClick={this.openTab.bind(this)}
//                       >
//                         {
//                           <AlgaehLabel
//                             label={{
//                               forceLabel: "More Details",
//                             }}
//                           />
//                         }
//                       </li>
//                     ) : null} */}
//                   </ul>
//                 ) : (
//                   <ul className="nav">
//                     <li
//                       algaehtabs={"PersonalDetails"}
//                       className={"nav-item tab-button active"}
//                       onClick={this.openTab.bind(this)}
//                     >
//                       {
//                         <AlgaehLabel
//                           label={{
//                             fieldName: "personal_details",
//                           }}
//                         />
//                       }
//                     </li>

//                     <li
//                       algaehtabs={"OfficalDetails"}
//                       className={"nav-item tab-button"}
//                       onClick={this.openTab.bind(this)}
//                     >
//                       {
//                         <AlgaehLabel
//                           label={{
//                             forceLabel: "Official Details",
//                           }}
//                         />
//                       }
//                     </li>

//                     {/*<li
//                       algaehtabs={"DeptUserDetails"}
//                       className={"nav-item tab-button disableLi"}
//                       onClick={this.openTab.bind(this)}
//                     >
//                       {
//                         <AlgaehLabel
//                           label={{
//                             fieldName: "deptuser_details"
//                           }}
//                         />
//                       }
//                     </li>*/}
//                     {this.state.HRMS_Active === true ? (
//                       <li
//                         algaehtabs={"PayRollDetails"}
//                         className={"nav-item tab-button disableLi"}
//                         onClick={this.openTab.bind(this)}
//                       >
//                         {
//                           <AlgaehLabel
//                             label={{
//                               forceLabel: "Payroll Details",
//                             }}
//                           />
//                         }
//                       </li>
//                     ) : null}
//                     {this.state.isdoctor === "Y" ? (
//                       <li
//                         algaehtabs={"CommissionSetup"}
//                         className={"nav-item tab-button disableLi"}
//                         onClick={this.openTab.bind(this)}
//                       >
//                         {
//                           <AlgaehLabel
//                             label={{
//                               fieldName: "commission_setup",
//                             }}
//                           />
//                         }
//                       </li>
//                     ) : null}
//                     {this.state.HRMS_Active === true ? (
//                       <li
//                         algaehtabs={"FamilyAndIdentification"}
//                         className={"nav-item tab-button disableLi"}
//                         onClick={this.openTab.bind(this)}
//                       >
//                         {
//                           <AlgaehLabel
//                             label={{
//                               forceLabel: "Family & Identification Details",
//                             }}
//                           />
//                         }
//                       </li>
//                     ) : null}

//                     {this.state.HRMS_Active === true ? (
//                       <li
//                         algaehtabs={"RulesDetails"}
//                         className={"nav-item tab-button disableLi"}
//                         onClick={this.openTab.bind(this)}
//                       >
//                         {
//                           <AlgaehLabel
//                             label={{
//                               forceLabel: "Rules Details",
//                             }}
//                           />
//                         }
//                       </li>
//                     ) : null}

//                     {/* {this.state.HRMS_Active === true ? (
//                       <li
//                         algaehtabs={"MoreDetails"}
//                         className={"nav-item tab-button disableLi"}
//                         onClick={this.openTab.bind(this)}
//                       >
//                         {
//                           <AlgaehLabel
//                             label={{
//                               forceLabel: "More Details",
//                             }}
//                           />
//                         }
//                       </li>
//                     ) : null} */}
//                   </ul>
//                 )}
//               </div>
//               {/* <MyContext.Provider
//                   value={{
//                     state: this.state,
//                     updateState: obj => {
//                       this.setState({ ...obj });
//                     }
//                   }}
//                 >
//                 : this.state.pageDisplay === "DeptUserDetails" ? (
//                   <DeptUserDetails EmpMasterIOputs={this} />
//                 )
//                 */}
//               <div className="employee-section">
//                 {this.state.pageDisplay === "PersonalDetails" ? (
//                   <PersonalDetails EmpMasterIOputs={this} />
//                 ) : this.state.pageDisplay === "OfficalDetails" ? (
//                   <OfficalDetails EmpMasterIOputs={this} />
//                 ) : this.state.pageDisplay === "PayRollDetails" ? (
//                   <PayRollDetails EmpMasterIOputs={this} />
//                 ) : this.state.pageDisplay === "CommissionSetup" ? (
//                   <CommissionSetup EmpMasterIOputs={this} />
//                 ) : this.state.pageDisplay === "FamilyAndIdentification" ? (
//                   <FamilyAndIdentification EmpMasterIOputs={this} />
//                 ) : this.state.pageDisplay === "RulesDetails" ? (
//                   <RulesDetails EmpMasterIOputs={this} />
//                 ) : // ) : this.state.pageDisplay === "MoreDetails" ? (
//                 //   <MoreDetails EmpMasterIOputs={this} />
//                 null}
//               </div>
//               {/* </MyContext.Provider> */}
//             </div>

//             <div className="popupFooter">
//               <div className="col-lg-12">
//                 <div className="row">
//                   <div className="col-12">
//                     <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
//                       <button
//                         onClick={InsertUpdateEmployee.bind(this, this)}
//                         type="button"
//                         className="btn btn-primary"
//                         disabled={
//                           this.props.employee_status === "I" ||
//                           this.props.blockUpdate === true
//                             ? true
//                             : false
//                         }
//                       >
//                         {this.state.personalDetails.hims_d_employee_id ===
//                         null ? (
//                           <AlgaehLabel label={{ fieldName: "btnSave" }} />
//                         ) : (
//                           <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
//                         )}
//                       </button>
//                     </AlgaehSecurityElement>
//                     <button
//                       onClick={(e) => {
//                         this.onClose(e);
//                       }}
//                       type="button"
//                       className="btn btn-default"
//                     >
//                       <AlgaehLabel label={{ fieldName: "btnCancel" }} />
//                     </button>

//                     {/* <button
//                       onClick={generateEmployeeContract.bind(this, this)}
//                       type="button"
//                       className="btn btn-other"
//                       style={{ float: "left", margin: 0 }}
//                     >
//                       <AlgaehLabel label={{ forceLabel: "Print Contract" }} />
//                     </button> */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </AlgaehModalPopUp>
//       </div>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     empservicetype: state.empservicetype,
//     empservices: state.empservices,
//     servicetypelist: state.servicetypelist,
//     subdepartment: state.subdepartment,
//     servTypeCommission: state.servTypeCommission,
//     serviceComm: state.serviceComm,
//     countries: state.countries,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getServiceTypes: AlgaehActions,
//       getServices: AlgaehActions,
//       getSubDepartment: AlgaehActions,
//       getDoctorServiceTypeCommission: AlgaehActions,
//       getDoctorServiceCommission: AlgaehActions,
//       getCountries: AlgaehActions,
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(EmployeeMaster)
// );
