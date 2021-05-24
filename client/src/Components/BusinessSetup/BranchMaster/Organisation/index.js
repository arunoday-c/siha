import React, { useState, useEffect, useContext } from "react";
import {
  Upload,
  AlgaehFormGroup,
  AlgaehAutoComplete,
  AlgaehMessagePop,
  AlgaehButton,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../../hooks";
import { AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import { MainContext } from "algaeh-react-components";
import { logoUrl, LoadLogo } from "../imagesSettings";
// import EmailConfig from "./EmailConfig";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

export function Organization(props) {
  const [organisation, setOrganisation] = useState({});

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [org_image, setOrgImage] = useState(undefined);
  const [app_logo, setAppLogo] = useState(undefined);
  const [seal_logo, setSealLogo] = useState(undefined);

  const [loadingOrgImage, setLoadingOrgImage] = useState(false);
  const { countryMaster } = props;
  const { userToken } = useContext(MainContext);
  const disabledEdits =
    userToken.user_type === "SU" || userToken.user_type === "AD" ? false : true;
  // const [hospitalList, setHospitalList] = useState([]);
  const [fullName, setFullName] = useState("");
  // const [employeeID, setEmployeeId] = useState(0);
  // const [hospitalID, setHospitalID] = useState(userToken.hims_d_hospital_id);
  // const [employee, setEmloyees] = useState("");

  useEffect(() => {
    newAlgaehApi({
      uri: "/organization/getMainOrganization",
      method: "GET",
    })
      .then((result) => {
        const { records, success, message } = result.data;
        if (success === true) {
          setOrganisation(records);
          setOrgImage(
            LoadLogo({
              image_id: records.hims_d_organization_id,
              logo_type: "ORG",
            })
          );
          setAppLogo(
            LoadLogo({
              image_id: records.hims_d_organization_id,
              logo_type: "APP",
            })
          );
          setSealLogo(
            LoadLogo({
              image_id: records.hims_d_organization_id,
              logo_type: "SEAL",
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

  const {
    hims_d_organization_id,
    organization_name,
    business_registration_number,
    tax_number,
    product_type,
    fiscal_period,
    fiscal_quarters,
    country_id,
    email,
    phone1,
    address1,
    address2,
    // hims_d_head_of_organization_id,
    full_name,
  } = organisation;

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

  function onLogoHandleChange(info) {
    if (info.file.status === "uploading") {
      setLoadingOrgImage(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setAppLogo(imageUrl);
        setLoadingOrgImage(false);
      });
    }
  }
  function onSealLogoHandleChange(info) {
    if (info.file.status === "uploading") {
      setLoadingOrgImage(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setSealLogo(imageUrl);
        setLoadingOrgImage(false);
      });
    }
  }

  function employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee,
      },

      searchName: "employee",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        setFullName(row.full_name);
        // setEmployeeId(row.hims_d_employee_id);
        setOrganisation((state) => {
          return {
            ...state,
            hims_d_head_of_organization_id: row.hims_d_employee_id,
          };
        });

        // setHospitalID(row.hospital_id);
      },
    });
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
              <div className="col-12">
                <div className="row">
                  <AlgaehAutoComplete
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{ forceLabel: "Product Type", isImp: true }}
                    selector={{
                      name: "product_type",
                      dataSource: {
                        data: [
                          // HIMS_ERP= Complete Product(with FINANCE,HRMS,PHARMACY,INVENTRORY),
                          // HRMS = ONLY HR and PAYROLL,
                          // HRMS_ERP = HR PAYROLL and FINANCE
                          // FINANCE_ERP = (Finance,HR&PROL,Inventory,Pharmacy)
                          // HIMS_CLINICAL=(NO Finance & HR&PROL)
                          // ONLY_LAB=ONLY_LAB
                          // ONLY_PHARMACY=ONLY_PHARMACY
                          // nNO_FINANCE=(Complete Product without Finance)
                          {
                            value: "HIMS_ERP",
                            name: "Complete Product",
                          },
                          { value: "HRMS", name: "HR & Payroll Only" },
                          {
                            value: "HRMS_ERP",
                            name: "HR, Payroll & Finance",
                          },
                          {
                            value: "FINANCE_ERP",
                            name: "HR, Payroll, Inventory, Pharmacy & Finance",
                          },
                          {
                            value: "HIMS_CLINICAL",
                            name: "Complete Product w/o Payroll & Finance",
                          },
                          { value: "ONLY_LAB", name: "Lab, Radiology HR Only" },
                          {
                            value: "ONLY_PHARMACY",
                            name: "Pharmacy & HR Only",
                          },
                          {
                            value: "NO_FINANCE",
                            name: "Complete Product w/o Finance",
                          },
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
                  />{" "}
                  <div className="col-3 globalSearchCntr mandatory">
                    <AlgaehLabel
                      label={{ forceLabel: "Head of Organisation" }}
                    />
                    <h6 onClick={employeeSearch}>
                      {fullName ? fullName : full_name}
                      <i className="fas fa-search fa-lg"></i>
                    </h6>
                  </div>
                  <AlgaehFormGroup
                    div={{
                      className: "col-3 form-group mandatory",
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
                      className: "col-3 form-group mandatory",
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
                    div={{ className: "col-3 form-group mandatory" }}
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
                    div={{ className: "col-3 form-group mandatory" }}
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
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{ forceLabel: "Default Country", isImp: true }}
                    selector={{
                      name: "country_id",
                      dataSource: {
                        data: countryMaster,
                        valueField: "hims_d_country_id",
                        textField: "country_name",
                      },
                      value: country_id || undefined,

                      onChange: onChangeHandler,

                      onClear: onClearHandler,
                    }}
                  />{" "}
                  <AlgaehFormGroup
                    div={{
                      className: "col-3 form-group mandatory",
                    }}
                    label={{
                      forceLabel: "Email",
                      isImp: true,
                    }}
                    textBox={{
                      name: "email",
                      type: "text",
                      className: "txt-fld",
                      value: email,
                      onChange: onChangeHandler,
                    }}
                  />
                  <AlgaehFormGroup
                    div={{
                      className: "col-3 form-group mandatory",
                    }}
                    label={{
                      forceLabel: "Phone",
                      isImp: true,
                    }}
                    textBox={{
                      name: "phone1",
                      type: "text",
                      className: "txt-fld",
                      value: phone1,
                      onChange: onChangeHandler,
                    }}
                  />
                  <AlgaehFormGroup
                    div={{
                      className: "col-3 form-group mandatory",
                    }}
                    label={{
                      forceLabel: "Address Line 1",
                      isImp: true,
                    }}
                    textBox={{
                      name: "address1",
                      type: "text",
                      className: "txt-fld",
                      value: address1,
                      onChange: onChangeHandler,
                    }}
                  />
                  <AlgaehFormGroup
                    div={{
                      className: "col-3 form-group mandatory",
                    }}
                    label={{
                      forceLabel: "Address Line 2",
                      isImp: true,
                    }}
                    textBox={{
                      name: "address2",
                      type: "text",
                      className: "txt-fld",
                      value: address2,
                      onChange: onChangeHandler,
                    }}
                  />{" "}
                  <div className="col-12">
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
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col">
                    <label>Logo For Application</label>
                    <Upload
                      name="org_image"
                      listType="picture-card"
                      showUploadList={false}
                      onChange={onLogoHandleChange}
                      data={{
                        image_id: hims_d_organization_id,
                        logo_type: "APP",
                      }}
                      action={logoUrl({ uri: "/Document/saveLogo" })}
                      accept=".png"
                      className="orgImageUpload"
                    >
                      {app_logo ? (
                        <img
                          src={app_logo}
                          alt="avatar"
                          style={{ height: "100%" }}
                        />
                      ) : (
                        <>
                          <LoadLogo
                            key="app"
                            input={{
                              image_id: hims_d_organization_id,
                              logo_type: "APP",
                            }}
                          />
                          {uploadButton}
                        </>
                      )}
                    </Upload>
                  </div>
                  <div className="col">
                    <label>Logo For Report</label>
                    <Upload
                      name="org_image"
                      listType="picture-card"
                      showUploadList={false}
                      onChange={onImageHandleChange}
                      data={{
                        image_id: hims_d_organization_id,
                        logo_type: "ORG",
                      }}
                      action={logoUrl({ uri: "/Document/saveLogo" })}
                      accept=".png"
                      className="orgImageUpload"
                    >
                      {org_image ? (
                        <img
                          src={org_image}
                          alt="avatar"
                          style={{ height: "100%" }}
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
                  </div>
                  <div className="col">
                    <label>Seal For Report</label>
                    <Upload
                      name="org_image"
                      listType="picture-card"
                      showUploadList={false}
                      onChange={onSealLogoHandleChange}
                      data={{
                        image_id: hims_d_organization_id,
                        logo_type: "SEAL",
                      }}
                      action={logoUrl({ uri: "/Document/saveLogo" })}
                      accept=".png"
                      className="orgImageUpload"
                    >
                      {seal_logo ? (
                        <img
                          src={seal_logo}
                          alt="avatar"
                          style={{ height: "100%" }}
                        />
                      ) : (
                        <>
                          <LoadLogo
                            key="seal"
                            input={{
                              image_id: hims_d_organization_id,
                              logo_type: "SEAL",
                            }}
                          />
                          {uploadButton}
                        </>
                      )}
                    </Upload>
                  </div>
                </div>
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="col-4">
        {userToken.user_type === "SU" ? <EmailConfig /> : null}
      </div> */}
    </div>
  );
}

export default function (props) {
  const { userToken } = useContext(MainContext);
  if (userToken.user_type === "SU" || userToken.user_type === "AD")
    return Organization(props);
  else return null;
}
