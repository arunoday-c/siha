import React, { useState } from "react";
// import "./EmailSetup.scss";
import // AlgaehLabel,
// AlgaehFormGroup,
// AlgaehDateHandler,
// AlgaehAutoComplete,
// AlgaehDateHandler,
// AlgaehMessagePop,
// DatePicker,
// AlgaehModal,
// AlgaehHijriDatePicker,
// // AlgaehTreeSearch,
// AlgaehSecurityComponent,

//   AlgaehButton,
"algaeh-react-components";
// import { MainContext } from "algaeh-react-components";
// import { Controller, useForm } from "react-hook-form";
import DeptSubDeptComponent from "./deptandsubDeptComp";
// import { AlgaehSecurityElement } from "algaeh-react-components";
import { useQuery } from "react-query";
import { newAlgaehApi } from "../../../../hooks";
const getDeptAndSubDept = async () => {
  const result = await newAlgaehApi({
    uri: "/department/getEmailSetupDetails",
    method: "GET",
    module: "masterSettings",
  });

  return result.data?.records;
};
export default function EmailSetup() {
  const [emailData, setEmailData] = useState([]);
  // const [subdepartment, setDepartment] = useState([]);
  // // const [hospital_id, setHospitalId] = useState("");
  // const { control, errors } = useForm({
  //   shouldFocusError: true,
  //   defaultValues: {
  //     requesting_date: new Date(),
  //     //   from_due_date: new Date(),
  //     //   to_due_date: new Date(),
  //   },
  // });
  // const { userToken } = useContext(MainContext);
  // const { hospital_id } = userToken;

  const { data: dropdownData } = useQuery("table-data", getDeptAndSubDept, {
    onSuccess: (data) => {
      setEmailData(data);
    },
  });
  // // const { departments } = dropdownData;
  console.log("hospital_id", dropdownData);
  return (
    <div className="row EmailSetupScreen">
      {emailData.map((item) => (
        <div className="col-3 form-group">
          <div className="portlet portlet-bordered">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">{item.setup_name}</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <DeptSubDeptComponent
                  data={item}
                  name={item.setup_name}
                  id={item.email_type}
                ></DeptSubDeptComponent>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
