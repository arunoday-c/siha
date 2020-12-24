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
                </div>
              </div>
            </div>
          </div>
        </div>
      </AlgaehModalPopUp>
    </div>
  );
}
