import React, { useState, useEffect, useContext } from "react";
import {
  AlgaehTabs,
  AlgaehModal,
  AlgaehLabel,
  MainContext,
} from "algaeh-react-components";
import "../EmployeeMaster.scss";
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
  debugger;
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
  console.log("HRMS_Active", HRMS_Active);

  return (
    <AlgaehModal
      // title={HeaderCaption}
      visible={visible}
      maskClosable={false}
      onCancel={onClose}
      footer={null}
      width={720}
      className={`row algaehNewModal EmployeeAddEditPopup`}
    >
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
                  EmpMasterIOputs={employeeDetails.employee_id}
                />
              ),
              componentCode: "EMP_TAB_PER",
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
                <OfficalDetails EmpMasterIOputs={employeeDetails.employee_id} />
              ),
              componentCode: "EMP_TAB_OFF",
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
                <PayRollDetails EmpMasterIOputs={employeeDetails.employee_id} />
              ),
              componentCode: "EMP_TAB_PAY",
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
                  EmpMasterIOputs={employeeDetails.employee_id}
                />
              ),
              componentCode: "EMP_TAB_FAM",
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
                <CommissionSetup
                  EmpMasterIOputs={employeeDetails.employee_id}
                />
              ),
              componentCode: "EMP_TAB_COMM",
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
                <RulesDetails EmpMasterIOputs={employeeDetails.employee_id} />
              ),
              componentCode: "EMP_TAB_RUL",
            },
          ]}
          // renderClass="PrepaymentCntr"
        />
      </div>
    </AlgaehModal>
  );
}
