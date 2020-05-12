import React, { useState, useEffect, useContext } from "react";
import {
  Upload,
  AlgaehFormGroup,
  AlgaehAutoComplete,
  AlgaehMessagePop,
  AlgaehButton,
} from "algaeh-react-components";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";
import { Checkbox } from "antd";
import { newAlgaehApi } from "../../../../hooks";
import { MainContext } from "algaeh-react-components/context";
import { logoUrl, LoadLogo } from "../imagesSettings";
export function Organization(props) {
  const [organisation, setOrganisation] = useState({});
  const baseEmailConfig = {
    host: "",
    port: "",
    secure: false,
    user: "",
    pass: "",
    is_enabled: false,
  };
  const [emailConfig, setEmailConfig] = useState(baseEmailConfig);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [org_image, setOrgImage] = useState(undefined);
  const [loadingOrgImage, setLoadingOrgImage] = useState(false);
  const { countryMaster } = props;
  const { userToken } = useContext(MainContext);
  const disabledEdits =
    userToken.user_type === "SU" || userToken.user_type === "AD" ? false : true;

  useEffect(() => {
    Promise.all([
      newAlgaehApi({
        uri: "/organization/getMainOrganization",
        method: "GET",
      }),
      newAlgaehApi({
        uri: "/Document/getEmailConfig",
        method: "GET",
        module: "documentManagement",
      }),
    ])
      .then((result) => {
        const { records, success, message } = result[0].data;
        const {
          data: emailConf,
          success: emailSuccess,
          message: emailMsg,
        } = result[1].data;

        if (emailSuccess) {
          setEmailConfig(emailConf[0] || baseEmailConfig);
        } else {
          AlgaehMessagePop({
            display: emailMsg,
            type: "error",
          });
        }

        if (success === true) {
          setOrganisation(records);
          setOrgImage(
            LoadLogo({
              image_id: records.hims_d_organization_id,
              logo_type: "ORG",
            })
          );
        } else {
          AlgaehMessagePop({
            display: message,
            type: "error",
          });
        }
      })
      .catch((error) => {
        AlgaehMessagePop({
          display: error.message,
          type: "error",
        });
      });
  }, []);

  async function updateEmailConfig() {
    try {
      const res = await newAlgaehApi({
        uri: "/Document/setEmailConfig",
        method: "POST",
        data: emailConfig,
        module: "documentManagement",
      });
      if (res.data.success) {
        AlgaehMessagePop({
          display: res.data.message,
          type: "success",
        });
      }
    } catch (e) {
      AlgaehMessagePop({
        display: e.response.data.message || e.message,
        type: "error",
      });
    }
  }

  const {
    hims_d_organization_id,
    organization_name,
    business_registration_number,
    tax_number,
    product_type,
    fiscal_period,
    fiscal_quarters,
    country_id,
  } = organisation;

  const { host, port, is_enabled, pass, secure, user } = emailConfig;

  function onChangeHandler(e, val, nme) {
    if (nme !== undefined) {
      e = {
        target: {
          name: nme,
          value: val,
        },
      };
    }
    const { name, value } = e.target;
    setOrganisation((state) => {
      return { ...state, [name]: value };
    });
  }

  function handleEmailChange(e) {
    const { name, value, checked } = e.target;
    console.log(name, value, "name and value");

    if (name === "is_enabled") {
      setEmailConfig((state) => {
        const res = !state.is_enabled ? state : baseEmailConfig;
        return {
          is_enabled: !state.is_enabled,
          ...res,
        };
      });
    }

    setEmailConfig((state) => ({
      ...state,
      [name]: value !== undefined ? value : checked,
    }));
  }

  function onClearHandler(nme) {
    setOrganisation((state) => {
      return { ...state, [nme]: undefined };
    });
  }

  function onClickUpdate() {
    setLoadingUpdate(true);
    newAlgaehApi({
      uri: "/organization/updateOrganization",
      data: { ...organisation },
      method: "PUT",
    })
      .then((result) => {
        setLoadingUpdate(false);
        const { success, message } = result.data;
        AlgaehMessagePop({
          display: message,
          type: success === false ? "error" : "success",
        });
      })
      .catch((error) => {
        setLoadingUpdate(false);
        AlgaehMessagePop({
          display: error,
          type: "error",
        });
      });
  }

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function onImageHandleChange(info) {
    if (info.file.status === "uploading") {
      setLoadingOrgImage(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setOrgImage(imageUrl);
        setLoadingOrgImage(false);
      });
    }
  }

  const uploadButton = (
    <div>
      {loadingOrgImage ? (
        <i className="fas fa-spinner fa-spin" />
      ) : (
        <i className="fas fa-plus" />
      )}
      <div className="ant-upload-text">Organisation Logo</div>
    </div>
  );

  return (
    <div className="row">
      <div className="col">
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Organization</h3>
            </div>
            <div className="actions"></div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-3">
                <Upload
                  name="org_image"
                  listType="picture-card"
                  showUploadList={false}
                  onChange={onImageHandleChange}
                  data={{ image_id: hims_d_organization_id, logo_type: "ORG" }}
                  action={logoUrl({ uri: "/Document/saveLogo" })}
                  accept=".png"
                  className="orgImageUpload"
                >
                  {/* <img
                src={
                  org_image
                    ? org_image
                    : `${loadLogo({
                        image_id: hims_d_organization_id,
                        logo_type: "ORG",
                      })}`
                }
                alt=""
                style={{ width: "100%" }}
              />
              {uploadButton} */}
                  {org_image ? (
                    <img
                      src={org_image}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <>
                      <LoadLogo
                        input={{
                          image_id: hims_d_organization_id,
                          logo_type: "ORG",
                        }}
                      />
                      {uploadButton}
                    </>
                  )}
                </Upload>
              </div>{" "}
              <div className="col-9">
                {" "}
                <div className="row">
                  <AlgaehFormGroup
                    div={{
                      className: "col-7 form-group mandatory",
                    }}
                    label={{
                      forceLabel: "Business Reg. Name",
                      isImp: true,
                    }}
                    textBox={{
                      name: "organization_name",
                      type: "text",
                      className: "txt-fld",
                      placeholder: "Business Reg. Name",
                      value: organization_name,
                      onChange: onChangeHandler,
                      disabled: disabledEdits,
                    }}
                  />
                  {/* <div className="col-12">
            {" "}
            <div className="ui input">
              <input
                type="text"
                disabled={disabledEdits}
                name="organization_name"
                defaultValue={organization_name}
                onChange={onChangeHandler}
              ></input>
            </div>
          </div> */}
                  <AlgaehFormGroup
                    div={{
                      className: "col-3 form-group mandatory",
                    }}
                    label={{
                      forceLabel: "Business Reg.. No.",
                      isImp: true,
                    }}
                    textBox={{
                      name: "business_registration_number",
                      type: "text",
                      className: "txt-fld",
                      placeholder: "Business Registration Number",
                      value: business_registration_number,
                      onChange: onChangeHandler,
                    }}
                  />
                  <AlgaehFormGroup
                    div={{
                      className: "col-2 form-group mandatory",
                    }}
                    label={{
                      forceLabel: "Tax No.",
                      isImp: true,
                    }}
                    textBox={{
                      name: "tax_number",
                      type: "text",
                      className: "txt-fld",
                      placeholder: "Tax Number",
                      value: tax_number,
                      onChange: onChangeHandler,
                    }}
                  />
                  <AlgaehAutoComplete
                    div={{ className: "col-2 form-group mandatory" }}
                    label={{ forceLabel: "Product Type", isImp: true }}
                    selector={{
                      name: "product_type",
                      dataSource: {
                        data: [
                          {
                            value: "HIMS_ERP",
                            name: "Finance,HRMS,Pharmacy and Inventory",
                          },
                          { value: "HRMS", name: "HR & Payroll" },
                          {
                            value: "HRMS_ERP",
                            name: "HR & Payroll and Finance",
                          },
                          {
                            value: "FINANCE_ERP",
                            name: "Finance,HR & Payroll,Inventory and Pharmacy",
                          },
                          {
                            value: "HIMS_CLINICAL",
                            name: "No Finanace & HR & Payroll",
                          },
                          { value: "ONLY_LAB", name: "Only Lab and Radiology" },
                          { value: "ONLY_PHARMACY", name: "Only Pharmacy" },
                        ],
                        valueField: "value",
                        textField: "name",
                      },
                      value: product_type,
                      others: {
                        disabled: userToken.user_type === "SU" ? false : true,
                      },

                      onChange: onChangeHandler,

                      onClear: onClearHandler,
                    }}
                  />
                  <AlgaehAutoComplete
                    div={{ className: "col-2 form-group mandatory" }}
                    label={{ forceLabel: "Fiscal Period", isImp: true }}
                    selector={{
                      name: "fiscal_period",
                      dataSource: {
                        data: [
                          { name: "12", value: "12" },
                          { name: "13", value: "13" },
                        ],
                        valueField: "value",
                        textField: "name",
                      },
                      value: fiscal_period,
                      onChange: onChangeHandler,

                      onClear: onClearHandler,
                    }}
                  />
                  <AlgaehAutoComplete
                    div={{ className: "col-2 form-group mandatory" }}
                    label={{ forceLabel: "Fiscal Quarters", isImp: true }}
                    selector={{
                      name: "fiscal_quarters",
                      dataSource: {
                        data: [
                          { name: "1", value: "1" },
                          { name: "2", value: "2" },
                          { name: "3", value: "3" },
                          { name: "4", value: "4" },
                        ],
                        valueField: "value",
                        textField: "name",
                      },
                      value: fiscal_quarters,
                      onChange: onChangeHandler,

                      onClear: onClearHandler,
                    }}
                  />
                  <AlgaehAutoComplete
                    div={{ className: "col-2 form-group mandatory" }}
                    label={{ forceLabel: "Default Country", isImp: true }}
                    selector={{
                      name: "country_id",
                      dataSource: {
                        data: countryMaster,
                        valueField: "hims_d_country_id",
                        textField: "country_name",
                      },
                      value: String(country_id),

                      onChange: onChangeHandler,

                      onClear: onClearHandler,
                    }}
                  />{" "}
                  <div className="col">
                    <AlgaehButton
                      className="btn btn-primary"
                      style={{ float: "right", marginTop: 20 }}
                      disabled={disabledEdits}
                      onClick={onClickUpdate}
                      loading={loadingUpdate}
                    >
                      Update
                    </AlgaehButton>
                  </div>
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Email Configuration</h3>
            </div>
            <div className="actions"></div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-12 form-group">
                <Checkbox
                  onChange={handleEmailChange}
                  name="is_enabled"
                  checked={is_enabled}
                >
                  Activate Email Nofication
                </Checkbox>
              </div>

              <AlagehFormGroup
                div={{ className: "col-8 form-group" }}
                label={{
                  forceLabel: "SMTP Host Name",
                  isImp: false,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "host",
                  value: host,
                  disabled: !is_enabled,
                  events: {
                    onChange: handleEmailChange,
                  },
                  others: {
                    type: "text",
                  },
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-4 form-group" }}
                label={{
                  forceLabel: "SMTP Port",
                  isImp: false,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "port",
                  value: port,
                  disabled: !is_enabled,
                  events: {
                    onChange: handleEmailChange,
                  },
                  others: {
                    type: "number",
                  },
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-6 form-group" }}
                label={{
                  forceLabel: "SMTP Username",
                  isImp: false,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "user",
                  value: user,
                  disabled: !is_enabled,
                  events: {
                    onChange: handleEmailChange,
                  },
                  others: {
                    type: "text",
                  },
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-6 form-group" }}
                label={{
                  forceLabel: "SMTP Password",
                  isImp: false,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "pass",
                  value: pass,
                  disabled: !is_enabled,
                  events: {
                    onChange: handleEmailChange,
                  },
                  others: {
                    type: "password",
                  },
                }}
              />
              <div className="col-6 form-group">
                <Checkbox
                  onChange={handleEmailChange}
                  name="secure"
                  checked={secure}
                >
                  Is SSL enabled
                </Checkbox>
              </div>
              <div className="col">
                <AlgaehButton
                  className="btn btn-primary"
                  style={{ float: "right", marginTop: 20 }}
                  // disabled={!is_enabled}
                  onClick={updateEmailConfig}
                >
                  Update Email
                </AlgaehButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function (props) {
  const { userToken } = useContext(MainContext);
  if (userToken.user_type === "SU" || userToken.user_type === "AD")
    return Organization(props);
  else return null;
}
