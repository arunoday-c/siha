import React, { useState, useEffect, useContext, useRef } from "react";
import {
  AlgaehTabs,
  AlgaehModal,
  AlgaehLabel,
  MainContext,
  AlgaehSecurityElement,
} from "algaeh-react-components";
import "../EmployeeMaster.scss";
import { ContextProviderForEmployee } from "../../EmployeeMasterContextForEmployee";
import { EmployeeMasterContext } from "../../EmployeeMasterContext";
// import { useForm, Controller } from "react-hook-form";
// import { EmployeeMasterContextForEmployee } from "../../EmployeeMasterContextForEmployee";
// import { updatePersonalDetails } from "../events";
import CommissionSetup from "../CommissionSetup/CommissionSetup";
import PersonalDetails from "../PersonalDetails/PersonalDetails";
import FamilyAndIdentification from "../FamilyAndIdentification/FamilyAndIdentification";
// import DeptUserDetails from "./DeptUserDetails/DeptUserDetails";
import PayRollDetails from "../PayRollDetails/PayRollDetails";
import OfficalDetails from "../OfficalDetails/OfficalDetails";
import RulesDetails from "../RulesDetails/RulesDetails";
// import { EmployeeMasterContextForEmployee } from "../../EmployeeMasterContextForEmployee";

export default function EmployeeMasterPopup({
  visible,
  onClose,
  employeeDetails,
  HeaderCaption,
}) {
  // const { clearState } = useContext(EmployeeMasterContextForEmployee);
  const [HRMS_Active, setHRMS_Active] = useState(false);
  // const [activeTab, setActiveTab] = useState(0);
  // const [pageDisplay, setPageDisplay] = useState("PersonalDetails");
  // const [personalDetails, setPersonalDetails] = useState({});
  const {
    // userLanguage,
    userToken,
  } = useContext(MainContext);
  // let { setEmployeeUpdateDetails } = useContext(
  //   EmployeeMasterContextForEmployee
  // );
  let {
    formControlPersonal,
    // formControlOfficial,
    // formControlFamily,
    // formControlRules,
  } = useContext(EmployeeMasterContext);
  const employeeImage = useRef();

  // const {
  //   control,
  //   errors,
  //   // trigger,
  //   reset,
  //   setValue,
  //   getValues,
  //   clearErrors,
  //   handleSubmit,
  // } = useForm({
  //   shouldFocusError: true,
  //   defaultValues: {},
  // });

  // const {
  //   control: control2,
  //   // getValues: getValues2,
  //   reset: reset2,
  //   watch: watch3,
  //   // setValue: setValue2,
  //   // watch: watch2,
  //   // register: register2,
  //   errors: errors2,
  //   handleSubmit: handleSubmit2,
  // } = useForm({
  //   defaultValues: {
  //     employee_status: "A",
  //   },
  // });
  // const {
  //   control: control3,
  //   // getValues: getValues2,
  //   reset: reset3,
  //   // setValue: setValue2,
  //   // watch: watch2,
  //   // register: register2,
  //   errors: errors3,
  //   handleSubmit: handleSubmit3,
  // } = useForm({
  //   shouldFocusError: true,
  //   defaultValues: {},
  // });
  // const {
  //   control: control4,
  //   // getValues: getValues2,
  //   reset: reset4,
  //   // setValue: setValue2,
  //   // watch: watch2,
  //   // register: register2,
  //   errors: errors4,
  //   handleSubmit: handleSubmit4,
  // } = useForm({
  //   defaultValues: {},
  // });

  // const updatePersonalDetails = (data) => {
  //   debugger;
  //   const images = [];
  //   // setEmployeeUpdateDetails(data);
  //   if (
  //     employeeImage.current !== null &&
  //     employeeImage.current?.state?.fileExtention
  //   ) {
  //     images.push(
  //       new Promise((resolve, reject) => {
  //         employeeImage.current.SavingImageOnServer(
  //           undefined,
  //           undefined,
  //           undefined,
  //           data?.employee_code,
  //           () => {
  //             resolve();
  //           }
  //         );
  //       })
  //     );
  //   }
  // };
  // useEffect(() => {
  //   const errorsvalues = Object.values(errors);
  //   debugger;
  //   if (errorsvalues.length <= 0) {
  //     // updatePersonalDetails(getValues());
  //   }
  // }, [errors]);
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
                    // control={control}
                    // reset={reset}
                    employeeImage={employeeImage}
                    // handleSubmit={handleSubmit}
                    // errors={errors}
                    // Controller={Controller}
                    // getValues={getValues}
                    // clearErrors={clearErrors}
                    // setValue={setValue}
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
                  // EmpMasterIOputs={employeeDetails?.employee_id}
                  // control={control2}
                  // reset={reset2}
                  // handleSubmit={handleSubmit2}
                  // errors={errors2}
                  // Controller={Controller}
                  // watch={watch3}

                  // clearErrors={clearErrors}
                  // setValue={setValue2}
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
                  // employee_id={employeeDetails?.employee_id}
                  // control={control3}
                  // reset={reset3}
                  // handleSubmit={handleSubmit3}
                  // errors={errors3}
                  // Controller={Controller}
                  // clearErrors={clearErrors}
                  // setValue={setValue2}
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
                  // EmpMasterIOputs={employeeDetails?.employee_id}
                  // control={control4}
                  // reset={reset4}
                  // handleSubmit={handleSubmit4}
                  // errors={errors4}
                  // Controller={Controller}
                  // clearErrors={clearErrors}
                  // setValue={setValue2}
                  />
                ),
                componentCode: "EMP_TAB_RUL",
                name: "EMP_TAB_RUL",
              },
            ]}
            // defaultActive={activeTab}
            onClick={(options, cb) => {
              debugger;
              // trigger();
              // setActiveTab(options.index);
              // cb();
              // clearErrors();
              const activeTab = options.active;
              if (activeTab.name === "EMP_TAB_PER") {
                debugger;
                formControlPersonal.trigger();

                if (Object.values(formControlPersonal.errors).length > 0) {
                  debugger;
                } else {
                  debugger;
                  cb();
                }
                debugger;
              } else {
                debugger;
                cb();
              }
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
