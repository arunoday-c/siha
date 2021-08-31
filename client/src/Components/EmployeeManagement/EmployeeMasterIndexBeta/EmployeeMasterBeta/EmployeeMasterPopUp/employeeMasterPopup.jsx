import React, { useState, useEffect, useContext } from "react";
import {
  AlgaehTabs,
  AlgaehModal,
  AlgaehLabel,
  MainContext,
  AlgaehSecurityElement,
} from "algaeh-react-components";
import "../EmployeeMaster.scss";
import { ContextProviderForEmployee } from "../../EmployeeMasterContextForEmployee";

// import { EmployeeMasterContextForEmployee } from "../../EmployeeMasterContextForEmployee";

import CommissionSetup from "../CommissionSetup/CommissionSetup";
import PersonalDetails from "../PersonalDetails/PersonalDetails";
import FamilyAndIdentification from "../FamilyAndIdentification/FamilyAndIdentification";
// import DeptUserDetails from "./DeptUserDetails/DeptUserDetails";
import PayRollDetails from "../PayRollDetails/PayRollDetails";
import OfficalDetails from "../OfficalDetails/OfficalDetails";
import RulesDetails from "../RulesDetails/RulesDetails";
export default function EmployeeMasterPopup({
  visible,
  onClose,
  employeeDetails,
  HeaderCaption,
}) {
  // const { clearState } = useContext(EmployeeMasterContextForEmployee);
  const [HRMS_Active, setHRMS_Active] = useState(false);
  // const [pageDisplay, setPageDisplay] = useState("PersonalDetails");
  // const [personalDetails, setPersonalDetails] = useState({});
  const {
    // userLanguage,
    userToken,
  } = useContext(MainContext);
  useEffect(() => {
    // const HIMS_Active =
    //   userToken.product_type === "HIMS_ERP" ||
    //   userToken.product_type === "HIMS_CLINICAL" ||
    //   userToken.product_type === "NO_FINANCE"
    //     ? true
    //     : false;
    console.log("userToken", userToken);
    const HRMS_Active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HRMS" ||
      userToken.product_type === "HRMS_ERP" ||
      userToken.product_type === "FINANCE_ERP" ||
      userToken.product_type === "NO_FINANCE"
        ? true
        : false;
    // setPersonalDetails(employeeDetailsPop);
    // setHIMS_Active(HIMS_Active);
    setHRMS_Active(HRMS_Active);
  }, []);
  // console.log("personalDetails", personalDetails);

  return (
    <AlgaehModal
      title={HeaderCaption}
      visible={visible}
      maskClosable={true}
      onCancel={
        onClose
        // clearState();
      }
      destroyOnClose={true}
      footer={null}
      className={`row algaehNewModal EmployeeAddEditPopup`}
    >
      <ContextProviderForEmployee>
        <div className="EmployeeMasterModal">
          <AlgaehTabs
            removeCommonSection={true}
            content={[
              {
                title: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Personal Details",
                    }}
                  />
                ),
                children: (
                  <PersonalDetails
                    EmpMasterIOputs={employeeDetails?.employee_id}
                  />
                ),
                componentCode: "EMP_TAB_PER",
                name: "EMP_TAB_PER",
              },
              {
                title: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Official Details",
                    }}
                  />
                ),
                children: (
                  <OfficalDetails
                    EmpMasterIOputs={employeeDetails?.employee_id}
                  />
                ),
                componentCode: "EMP_TAB_OFF",
                name: "EMP_TAB_OFF",
              },
              {
                title: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Payroll Details",
                    }}
                  />
                ),
                children: (
                  <PayRollDetails employee_id={employeeDetails?.employee_id} />
                ),
                componentCode: "EMP_TAB_PAY",
                name: "EMP_TAB_PAY",
                show: HRMS_Active,
              },
              {
                title: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "FAMILY & IDENTIFICATION DETAILS",
                    }}
                  />
                ),
                children: (
                  <FamilyAndIdentification
                    employee_id={employeeDetails?.employee_id}
                  />
                ),
                componentCode: "EMP_TAB_FAM",
                name: "EMP_TAB_FAM",
              },
              {
                title: (
                  <AlgaehLabel
                    label={{
                      fieldName: "commission_setup",
                    }}
                  />
                ),
                children: (
                  <CommissionSetup employee_id={employeeDetails?.employee_id} />
                ),
                componentCode: "EMP_TAB_COMM",
                name: "EMP_TAB_COMM",
              },
              {
                title: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Rules Details",
                    }}
                  />
                ),
                children: (
                  <RulesDetails
                    EmpMasterIOputs={employeeDetails?.employee_id}
                  />
                ),
                componentCode: "EMP_TAB_RUL",
                name: "EMP_TAB_RUL",
              },
            ]}
            onClick={(options, cb) => {
              //Your logic
              cb();
            }}
            // renderClass="PrepaymentCntr"
          />
          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-12">
                  <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                    <button
                      // onClick={InsertUpdateEmployee.bind(this, this)}
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        employeeDetails?.employee_status === "I" ||
                        employeeDetails?.blockUpdate === true
                          ? true
                          : false
                      }
                    >
                      {employeeDetails?.employee_id === null ||
                      employeeDetails?.employee_id === undefined ? (
                        <AlgaehLabel label={{ fieldName: "btnSave" }} />
                      ) : (
                        <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                      )}
                    </button>
                  </AlgaehSecurityElement>
                  <button
                    onClick={onClose}
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
      </ContextProviderForEmployee>
    </AlgaehModal>
  );
}
