import React, { useState } from "react";
import { useQuery } from "react-query";
import { newAlgaehApi } from "../../../../hooks";
// import { AlgaehSecurityElement } from "algaeh-react-components";
import "./EmailSetup.scss";
import {
  AlgaehLabel,
  AlgaehFormGroup,
  // AlgaehDateHandler,
  AlgaehAutoComplete,
  // AlgaehDateHandler,
  AlgaehMessagePop,
  // DatePicker,
  // AlgaehModal,
  // AlgaehHijriDatePicker,
  // // AlgaehTreeSearch,
  // AlgaehSecurityComponent,

  //   AlgaehButton,
} from "algaeh-react-components";
// import { MainContext } from "algaeh-react-components";
import { Controller, useForm } from "react-hook-form";
import { Input, Space } from "antd";
const getDeptAndSubDept = async () => {
  const result = await newAlgaehApi({
    uri: "/department/get/getAllSubDepartment",
    method: "GET",
    module: "masterSettings",
  });

  return result?.data?.records;
};

export default function DeptSubDeptComponent(props) {
  // const [subdepartment, setDepartment] = useState([]);
  const [password, setPassword] = useState("");
  const [attachMail, setAttachMail] = useState(props?.data?.report_attach);
  const { control, handleSubmit, errors } = useForm({
    shouldFocusError: true,
    defaultValues: {
      ...props.data,
      SubDept: props.data.sub_department_id,
    },
  });

  const { data: dropdownData } = useQuery("dropdown-data", getDeptAndSubDept, {
    onSuccess: (data) => {
      console.log(data, "datta");
    },
  });

  const changePassword = (e) => {
    setPassword(e.target.value);
  };
  const addEmailConfig = async (data) => {
    try {
      const res = await newAlgaehApi({
        uri: "/department/addEmailSendSubDept",
        method: "POST",
        module: "masterSettings",
        data: {
          sub_department_id: data.SubDept,
          sub_department_email: data.sub_department_email,
          password: password,
          report_name: "test",
          report_attach: attachMail,
          hims_f_email_setup_id: props.data.hims_f_email_setup_id,
        },
      });
      if (res.data.success) {
        // clearState();

        AlgaehMessagePop({
          type: "success",
          display: "Email configuration Added Successfully",
        });
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  const onSubmit = (e) => {
    console.error(errors);
    addEmailConfig(e);
  };

  return (
    <>
      <Controller
        name="SubDept"
        control={control}
        rules={{ required: "Please Select a department" }}
        render={({ value, onBlur, onChange }) => (
          <AlgaehAutoComplete
            div={{ className: "col-10 form-group mandatory" }}
            label={{
              forceLabel: "Select Sub Department",
              isImp: true,
            }}
            error={errors}
            selector={{
              value,
              onChange: (_, selected) => {
                onChange(selected);
              },
              onBlur: (_, selected) => {
                onBlur(selected);
              },
              name: "SubDept",
              dataSource: {
                data: dropdownData,
                textField: "sub_department_name",
                valueField: "hims_d_sub_department_id",
              },
              others: {
                // disabled: disabled || current.request_status === "APR",
                tabIndex: "23",
              },
            }}
          />
        )}
      />
      <Controller
        control={control}
        name="sub_department_email"
        rules={{ required: "Enter Patient Code" }}
        render={(props) => (
          <AlgaehFormGroup
            div={{ className: "col-10 mandatory form-group" }}
            label={{
              forceLabel: "sub department mail",
              isImp: true,
            }}
            error={errors}
            textBox={{
              ...props,
              className: "txt-fld",
              name: "sub_department_email",

              // disabled: disabled || current.request_status === "APR",
              tabIndex: "8",
            }}
          />
        )}
      />

      <Space>
        <Input.Password
          placeholder="Sub dept email password"
          name="password"
          iconRender={(visible) =>
            visible ? (
              <span>
                <i className="fas fa-eye" aria-hidden="true" />
              </span>
            ) : (
              <span>
                <i class="fa fa-eye-slash" aria-hidden="true"></i>
              </span>
            )
          }
          value={password}
          onChange={changePassword}
        />
      </Space>
      <div className="col-12">
        <label>Attachment Requiured</label>
        <div className="customCheckbox">
          <label className="checkbox inline">
            <input
              type="checkbox"
              value={attachMail}
              name="report_attach"
              checked={attachMail === "Y" ? true : false}
              onChange={(e) => {
                return e.target.checked
                  ? setAttachMail("Y")
                  : setAttachMail("N");
              }}
            />
            <span>Yes</span>
          </label>
        </div>
      </div>

      <div className="col-lg-12">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit(onSubmit)}
        >
          <AlgaehLabel label={{ forceLabel: "Save", returnText: true }} />
        </button>
      </div>
    </>
  );
}
