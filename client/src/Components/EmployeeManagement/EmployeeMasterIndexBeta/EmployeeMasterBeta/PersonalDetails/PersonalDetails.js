import React, { useState, useContext } from "react";
import "./PersonalDetails.scss";
import moment from "moment";
// import { AlgaehActions } from "../../../../../actions/algaehActions";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import {
//   texthandle,
//   isDoctorChange,
//   sameAsPresent,
// } from "./PersonalDetailsEvents.js";
// import MyContext from "../../../../../utils/MyContext.js";
// import {
//   AlgaehDateHandler,
//   // AlagehFormGroup,
//   AlgaehLabel,
// } from "../../../../Wrapper/algaehWrapper";
import variableJson from "../../../../../utils/GlobalVariables.json";
// import AlgaehFile from "../../../../Wrapper/algaehFileUpload";
// import { getCookie } from "../../../../../utils/algaehApiCall";
import {
  MainContext,
  AlgaehMessagePop,
  // persistStorageOnRemove,
  AlgaehAutoComplete,
  AlgaehDateHandler,
  AlgaehFormGroup,
  AlgaehLabel,
} from "algaeh-react-components";
// import { algaehApiCall } from "../../../../../utils/algaehApiCall";
// import AlgaehLoader from "../../../../Wrapper/fullPageLoader";
import { RawSecurityElement } from "algaeh-react-components";
import MaskedInput from "react-maskedinput";
import { useForm, Controller } from "react-hook-form";
import { newAlgaehApi } from "../../../../../hooks";
import { useQuery } from "react-query";
// import Enumerable from "linq";
const initCall = async (key, { fields, tableName, keyFieldName }) => {
  const result = await newAlgaehApi({
    uri: "/init/",
    method: "GET",
    data: { fields: fields, tableName: tableName, keyFieldName: keyFieldName },
  });
  return result?.data?.records;
};
const getRelegion = async (key) => {
  const result = await newAlgaehApi({
    uri: "/masters/get/relegion",
    method: "GET",
  });
  return result?.data?.records;
};
const getNationalities = async (key) => {
  const result = await newAlgaehApi({
    uri: "/masters/get/nationality",
    method: "GET",
  });
  return result?.data?.records;
};
const getIDTypes = async (key) => {
  const result = await newAlgaehApi({
    uri: "/identity/get",
    module: "masterSettings",
    method: "GET",
    data: { identity_status: "A" },
  });
  return result?.data?.records;
};
const getPersonalDetails = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getEmployeePersonalDetails",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: employee_id },
  });
  return result?.data?.records;
};
export default function PersonalDetails({ EmpMasterIOputs }) {
  const {
    userToken,

    countries = [],
  } = useContext(MainContext);

  const [samechecked, setsamechecked] = useState("N");
  const [HIMS_Active, setHIMS_Active] = useState(false);
  const [FldEditable, setFldEditable] = useState(true);
  const [identity_no, setIdentity_no] = useState("");
  const [isdoctor, setIsdoctor] = useState("");
  const [masked_identity, setMasked_identity] = useState("");
  const [presentCountry, setPresentCountry] = useState([]);
  const [presentCities, setPresentCities] = useState([]);
  const [permanentCountry, setPermanentCountry] = useState([]);
  const [permanentCities, setPermanentCities] = useState([]);
  console.log("FldEditable", FldEditable);
  const { control, errors, reset, setValue, getValues } = useForm({
    defaultValues: {},
  });
  const { data: presonalDetails } = useQuery(
    ["personal-details", { employee_id: EmpMasterIOputs }],
    getPersonalDetails,
    {
      onSuccess: (data) => {
        RawSecurityElement({ elementCode: "FLD_EDT_PER" }).then((result) => {
          if (result === "hide") {
            setFldEditable(false);
          }
        });
        const HIMS_Active =
          userToken.product_type === "HIMS_ERP" ||
          userToken.product_type === "HIMS_CLINICAL" ||
          userToken.product_type === "NO_FINANCE"
            ? true
            : false;
        setHIMS_Active(HIMS_Active);
        const presentCountry = countries.filter((country) => {
          return country.hims_d_country_id === data[0].present_country_id;
        });

        setPresentCountry(presentCountry[0]);

        const cities = presentCountry[0].states.filter((states) => {
          return states.cities.length !== 0;
        });
        setPresentCities(cities[0].cities);
        const permanentCountry = countries.filter((country) => {
          return country.hims_d_country_id === data[0].permanent_country_id;
        });

        setPermanentCountry(permanentCountry[0]);

        const permanentCities = permanentCountry[0].states.filter((states) => {
          return states.cities.length !== 0;
        });

        setPermanentCities(permanentCities[0].cities);
        const rest = {
          ...data[0],
          date_of_birth: moment(data[0].date_of_birth, "YYYY-MM-DD"),
        };
        reset(rest);
        setIdentity_no(data[0].identity_no);
        setIsdoctor(data[0].isdoctor);
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  const { data: employee_code_placeHolder } = useQuery(
    [
      "employee_code",
      {
        fields: "employee_code",
        tableName: "hims_d_employee",
        keyFieldName: "hims_d_employee_id",
      },
    ],
    initCall
  );
  const { data: relegions } = useQuery("employee-religion", getRelegion, {});
  const { data: nationalities } = useQuery(
    "employee_nationalities",
    getNationalities
  );
  const { data: idtypes } = useQuery("employee_idtypes", getIDTypes, {
    enabled: !!presonalDetails,
    initialStale: true,
    onSuccess: (data) => {
      let maskedIdentity = data.find((item) => {
        return (
          item.hims_d_identity_document_id ===
          presonalDetails[0].identity_type_id
        );
      });

      setMasked_identity(maskedIdentity.masked_identity);
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });

  const sameAsPresent = (e, data) => {
    const value = e.target.checked ? "Y" : "N";

    if (value === "Y") {
      setValue("permanent_address", data.present_address);
      setValue("permanent_country_id", data.present_country_id);
      setValue("permanent_state_id", data.present_state_id);
      setValue("permanent_city_id", data.present_city_id);
    } else {
      setValue("permanent_address", presonalDetails[0].permanent_address);
      setValue("permanent_country_id", presonalDetails[0].permanent_country_id);
      setValue("permanent_state_id", presonalDetails[0].permanent_state_id);
      setValue("permanent_city_id", presonalDetails[0].permanent_city_id);
    }
    setsamechecked(value);
  };

  return (
    <>
      <div
        className="hptl-phase1-add-employee-form popRightDiv"
        data-validate="empPersonal"
      >
        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              <div
                className="col-lg-10 col-md-10 col-sm-12primary-details"
                style={{ height: "70vh" }}
              >
                <h5>
                  <span>Basic Info.</span>
                </h5>
                <div className="row paddin-bottom-5">
                  <Controller
                    name="employee_code"
                    control={control}
                    rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className: "col-lg-2 col-md-2 col-sm-12 mandatory",
                        }}
                        // error={errors}
                        label={{
                          forceLabel: "Emp. Code",
                          isImp: true,
                        }}
                        P
                        textBox={{
                          name: "employee_code",
                          type: "text",
                          className: "form-control",
                          ...props,
                          others: {
                            tabIndex: "1",
                            placeholder: employee_code_placeHolder,
                            // disabled:
                            //   presonalDetails.hims_d_employee_id === null
                            //     ? false
                            //     : FldEditable,
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehFormGroup
                      div={{
                        className: "col-lg-2 col-md-2 col-sm-12 mandatory",
                      }}
                      label={{
                        forceLabel: "Emp. Code",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "employee_code",
                        value: this.state.employee_code,
                        events: {
                          onChange: texthandle.bind(this, this),
                        },

                        others: {
                          tabIndex: "1",
                          placeholder: this.state.employee_code_placeHolder,
                          disabled:
                            this.state.hims_d_employee_id === null
                              ? false
                              : this.state.FldEditable,
                        },
                      }}
                    /> */}
                  <Controller
                    name="full_name"
                    control={control}
                    rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className: "col-lg-3 col-sm-12 mandatory",
                        }}
                        // error={errors}
                        label={{
                          forceLabel: "Full Name",
                          isImp: true,
                        }}
                        P
                        textBox={{
                          name: "full_name",
                          type: "text",
                          className: "form-control",
                          ...props,
                        }}
                      />
                    )}
                  />
                  {/* <AlagehFormGroup
                      div={{ className: "col-lg-3 col-sm-12 mandatory" }}
                      label={{
                        fieldName: "full_name",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "full_name",
                        value: this.state.full_name,
                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "2",
                        },
                      }}
                      // target={{
                      //   tElement: (text) => {
                      //     const arabic =
                      //       this.state.arabic_name !== undefined
                      //         ? this.state.arabic_name + " " + text
                      //         : text;
                      //     this.setState({ arabic_name: arabic });
                      //   },
                      // }}
                    /> */}
                  <Controller
                    name="arabic_name"
                    control={control}
                    rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className:
                            "col-lg-3 col-sm-12 arabic-txt-fld mandatory",
                        }}
                        error={errors}
                        label={{
                          fieldName: "arabic_name",
                          isImp: true,
                        }}
                        textBox={{
                          name: "arabic_name",
                          type: "text",
                          className: "form-control",
                          ...props,
                        }}
                      />
                    )}
                  />
                  {/* <AlagehFormGroup
                      div={{
                        className:
                          "col-lg-3 col-sm-12 arabic-txt-fld mandatory",
                      }}
                      label={{
                        fieldName: "arabic_name",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "arabic_name",
                        value: this.state.arabic_name,
                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "3",
                        },
                      }}
                    /> */}
                  <Controller
                    control={control}
                    name="date_of_birth"
                    rules={{ required: "Please Select DOB" }}
                    render={({ onChange, value }) => (
                      <AlgaehDateHandler
                        div={{
                          className: "col-lg-2 col-md-2 col-sm-12 mandatory",
                          tabIndex: "4",
                        }}
                        error={errors}
                        label={{
                          fieldName: "date_of_birth",
                          isImp: true,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "date_of_birth",
                          value,
                        }}
                        // others={{ disabled }}
                        maxDate={new Date()}
                        events={{
                          onChange: (mdate) => {
                            if (mdate) {
                              onChange(mdate._d);
                            } else {
                              onChange(undefined);
                            }
                          },
                          onClear: () => {
                            onChange(undefined);
                          },
                        }}
                      />
                    )}
                  />

                  {/* <AlgaehDateHandler
                      div={{
                        className: "col-lg-2 col-md-2 col-sm-12 mandatory",
                      }}
                      label={{ fieldName: "date_of_birth", isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "date_of_birth",
                        others: {
                          tabIndex: "4",
                        },
                      }}
                      maxDate={new Date()}
                      events={{
                        onChange: datehandle.bind(this, this),
                      }}
                      value={this.state.date_of_birth}
                    /> */}
                  <Controller
                    control={control}
                    name="sex"
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{
                          className: "col-lg-2 col-md-2 col-sm-12 mandatory",
                        }}
                        label={{
                          fieldName: "gender",
                          isImp: false,
                        }}
                        selector={{
                          value,
                          onChange: (_, selected) => {
                            onChange(selected);
                          },
                          onClear: () => {
                            onChange("");
                          },
                          name: "sex",
                          dataSource: {
                            textField: "name",

                            valueField: "value",
                            data: variableJson.EMP_FORMAT_GENDER,
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehAutoComplete
                      div={{
                        className: "col-lg-2 col-md-2 col-sm-12 mandatory",
                      }}
                      label={{
                        fieldName: "gender",
                        isImp: true,
                      }}
                      selector={{
                        name: "sex",
                        className: "select-fld",
                        value: this.state.sex,
                        dataSource: {
                          textField: "name",

                          valueField: "value",
                          data: variableJson.EMP_FORMAT_GENDER,
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          tabIndex: "5",
                        },
                        onClear: () => {
                          this.setState({
                            sex: null,
                          });
                          this.props.EmpMasterIOputs.updateEmployeeTabs({
                            sex: null,
                          });
                        },
                      }}
                    /> */}
                </div>
                <h5>
                  <span>Personal Info.</span>
                </h5>
                <div className="row paddin-bottom-5">
                  <Controller
                    control={control}
                    name="nationality"
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-lg-2 form-group" }}
                        label={{
                          forceLabel: "Nationality",
                          isImp: false,
                        }}
                        selector={{
                          value,
                          onChange: (_, selected) => {
                            onChange(selected);
                          },
                          onClear: () => {
                            onChange("");
                          },
                          name: "nationality",
                          dataSource: {
                            textField: "nationality",
                            valueField: "hims_d_nationality_id",
                            data: nationalities,
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehAutoComplete
                      div={{
                        className:
                          "col-lg-2 col-md-2 col-sm-12 form-group mandatory",
                      }}
                      label={{
                        forceLabel: "Nationality",
                        isImp: true,
                      }}
                      selector={{
                        name: "nationality",
                        className: "select-fld",
                        value: this.state.nationality,
                        dataSource: {
                          textField: "nationality",
                          valueField: "hims_d_nationality_id",
                          data: this.props.nationalities,
                        },
                        onChange: texthandle.bind(this, this),
                        onClear: () => {
                          this.setState({
                            nationality: null,
                          });
                          this.props.EmpMasterIOputs.updateEmployeeTabs({
                            nationality: null,
                          });
                        },
                      }}
                    /> */}
                  <Controller
                    control={control}
                    name="religion_id"
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-lg-2 form-group" }}
                        label={{
                          forceLabel: "Religion",
                          isImp: false,
                        }}
                        selector={{
                          value,
                          onChange: (_, selected) => {
                            onChange(selected);
                          },
                          onClear: () => {
                            onChange("");
                          },
                          name: "religion_id",
                          dataSource: {
                            textField: "religion_name",
                            valueField: "hims_d_religion_id",
                            data: relegions,
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehAutoComplete
                      div={{
                        className:
                          "col-lg-2 col-md-2 col-sm-12 mandatory form-group",
                      }}
                      label={{
                        forceLabel: "Religion",
                        isImp: true,
                      }}
                      selector={{
                        name: "religion_id",
                        className: "select-fld",
                        value: this.state.religion_id,
                        dataSource: {
                          textField: "religion_name",
                          valueField: "hims_d_religion_id",
                          data: this.props.relegions,
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          tabIndex: "10",
                        },
                        onClear: () => {
                          this.setState({
                            religion_id: null,
                          });
                          this.props.EmpMasterIOputs.updateEmployeeTabs({
                            religion_id: null,
                          });
                        },
                      }}
                    /> */}
                  <Controller
                    name="primary_contact_no"
                    control={control}
                    rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col-lg-2 mandatory" }}
                        error={errors}
                        label={{
                          forceLabel: "Personal Contact No.",
                          isImp: true,
                        }}
                        textBox={{
                          name: "primary_contact_no",
                          type: "text",
                          className: "form-control",
                          ...props,
                          others: {
                            tabIndex: "7",
                            placeholder: "(+968)123-456-78)",
                            type: "number",
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehFormGroup
                      div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                      label={{
                        forceLabel: "Personal Contact No.",
                        isImp: false,
                      }}
                      textBox={{
                        value: this.state.primary_contact_no,
                        className: "txt-fld",
                        name: "primary_contact_no",

                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "7",
                          placeholder: "(+968)123-456-78)",
                          type: "number",
                        },
                      }}
                      
                    /> */}
                  <Controller
                    name="secondary_contact_no"
                    control={control}
                    rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col-lg-2 mandatory" }}
                        error={errors}
                        label={{
                          forceLabel: "Work Contact No.",
                          isImp: true,
                        }}
                        textBox={{
                          name: "secondary_contact_no",
                          type: "text",
                          className: "form-control",
                          ...props,
                          others: {
                            tabIndex: "7",
                            placeholder: "(+968)123-456-78",
                            type: "number",
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehFormGroup
                      div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                      label={{
                        forceLabel: "Work Contact No.",
                        isImp: false,
                      }}
                      textBox={{
                        value: this.state.secondary_contact_no,
                        className: "txt-fld",
                        name: "secondary_contact_no",

                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "7",
                          placeholder: "(+968)123-456-78",
                          type: "number",
                        },
                      }}
                    /> */}
                  <Controller
                    control={control}
                    name="identity_type_id"
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-lg-2 mandatory" }}
                        label={{
                          forceLabel: "PRIMARY ID",
                          isImp: false,
                        }}
                        selector={{
                          value,
                          onChange: (_, selected) => {
                            onChange(selected);
                          },
                          onClear: () => {
                            onChange("");
                          },
                          name: "identity_type_id",
                          dataSource: {
                            textField: "identity_document_name",
                            valueField: "hims_d_identity_document_id",
                            data: idtypes,
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehAutoComplete
                      div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                      label={{
                        forceLabel: "Primary ID",
                      }}
                      selector={{
                        name: "identity_type_id",
                        className: "select-fld",
                        value: this.state.identity_type_id,
                        dataSource: {
                          textField: "identity_document_name",
                          valueField: "hims_d_identity_document_id",
                          data: this.props.idtypes,
                        },
                        onChange: texthandle.bind(this, this),
                        onClear: () => {
                          this.setState({
                            identity_type_id: null,
                            identity_no: null,
                          });
                        },
                      }}
                    /> */}
                  <div className="col-lg-2 col-md-2 col-sm-12 ">
                    {/* <label className="styleLabel"> ENTER ID NUMBER</label> */}

                    {masked_identity ? (
                      <div className="ui input txt-fld">
                        <MaskedInput
                          mask={masked_identity}
                          className="form-control"
                          placeholder={"eg: " + masked_identity}
                          name="identity_no"
                          value={identity_no}
                          guide={false}
                          id="my-input-id"
                          onBlur={() => {}}
                          // onChange={texthandle.bind(this, this)}
                        />
                      </div>
                    ) : (
                      <Controller
                        name="identity_no"
                        control={control}
                        rules={{ required: "Required" }}
                        render={(props) => (
                          <AlgaehFormGroup
                            // div={{
                            //   className: "col-12",
                            // }}
                            error={errors}
                            label={{
                              forceLabel: "ENTER ID NUMBER",
                              isImp: true,
                            }}
                            textBox={{
                              name: "identity_no",

                              className: "txt-fld",
                              ...props,
                              others: {
                                placeholder: "Enter ID Number",
                              },
                            }}
                          />
                        )}
                      />
                      // <AlagehFormGroup
                      //   // div={{ className: "col-lg-2 col-md-2 col-sm-12" }}

                      //   textBox={{
                      //     className: "txt-fld",
                      //     name: "identity_no",
                      //     value: identity_no,
                      //     events: {
                      //       // onChange: texthandle.bind(this, this),
                      //     },
                      //     others: {
                      //       placeholder: "Enter ID Number",
                      //     },
                      //   }}
                      // />
                    )}
                  </div>

                  {/* <AlagehFormGroup
                      div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                      label={{
                        forceLabel: "Number",
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "identity_no",
                        value: this.state.identity_no,
                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          placeholder: "Enter ID Number",
                        },
                      }}
                    /> */}
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className: "col-3 mandatory",
                        }}
                        error={errors}
                        label={{
                          forceLabel: "Personal Email ID",
                          isImp: true,
                        }}
                        textBox={{
                          name: "email",
                          type: "text",
                          className: "form-control",
                          ...props,
                          others: {
                            tabIndex: "8",
                            placeholder: "Enter Personal Email Address",
                            type: "email",
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehFormGroup
                      div={{ className: "col-lg-3 col-sm-12  " }}
                      label={{
                        forceLabel: "Personal Email Id",
                        isImp: false,
                      }}
                      textBox={{
                        value: this.state.email,
                        className: "txt-fld",
                        name: "email",

                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "8",
                          placeholder: "Enter Personal Email Address",
                          type: "email",
                        },
                      }}
                    /> */}
                  <Controller
                    name="work_email"
                    control={control}
                    rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className: "col-3 mandatory",
                        }}
                        error={errors}
                        label={{
                          forceLabel: "Work Email ID",
                          isImp: true,
                        }}
                        textBox={{
                          name: "work_email",
                          type: "text",
                          className: "form-control",
                          ...props,
                          others: {
                            tabIndex: "8",
                            placeholder: "Enter Work Email Address",
                            type: "email",
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehFormGroup
                      div={{ className: "col-lg-3 col-sm-12  " }}
                      label={{
                        forceLabel: "Work Email Id",
                        isImp: false,
                      }}
                      textBox={{
                        value: this.state.work_email,
                        className: "txt-fld",
                        name: "work_email",

                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "8",
                          placeholder: "Enter Work Email Address",
                          type: "email",
                        },
                      }}
                    /> */}
                  <Controller
                    control={control}
                    name="blood_group"
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                        label={{
                          fieldName: "blood_group",
                          isImp: false,
                        }}
                        selector={{
                          value,
                          onChange: (_, selected) => {
                            onChange(selected);
                          },
                          onClear: () => {
                            onChange("");
                          },
                          name: "blood_group",
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: variableJson.FORMAT_BLOOD_GROUP,
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehAutoComplete
                      div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                      label={{
                        fieldName: "blood_group",
                      }}
                      selector={{
                        name: "blood_group",
                        className: "select-fld",
                        value: this.state.blood_group,

                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: variableJson.FORMAT_BLOOD_GROUP,
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          tabIndex: "9",
                        },
                        onClear: () => {
                          this.setState({
                            blood_group: null,
                          });
                          this.props.EmpMasterIOputs.updateEmployeeTabs({
                            blood_group: null,
                          });
                        },
                      }}
                    /> */}
                  <Controller
                    control={control}
                    name="marital_status"
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                        label={{
                          forceLabel: "Marital Status",
                          isImp: false,
                        }}
                        selector={{
                          value,
                          onChange: (_, selected) => {
                            onChange(selected);
                          },
                          onClear: () => {
                            onChange("");
                          },
                          name: "marital_status",
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: variableJson.FORMAT_MARTIALSTS_EMP,
                          },
                        }}
                      />
                    )}
                  />
                  {/* <AlagehAutoComplete
                      div={{
                        className: "col-lg-2 col-md-2 col-sm-12",
                      }}
                      label={{
                        forceLabel: "Marital Status",
                        isImp: false,
                      }}
                      selector={{
                        name: "marital_status",
                        className: "select-fld",
                        value: this.state.marital_status,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: variableJson.FORMAT_MARTIALSTS_EMP,
                        },
                        onChange: texthandle.bind(this, this),
                        onClear: () => {
                          this.setState({
                            marital_status: null,
                          });
                          this.props.EmpMasterIOputs.updateEmployeeTabs({
                            marital_status: null,
                          });
                        },
                      }}
                    /> */}
                </div>
                <div className="row">
                  <div className="col-lg-6 col-sm-12">
                    <h5>
                      <span>Present Address</span>
                    </h5>
                    <div className="row paddin-bottom-5">
                      <Controller
                        name="present_address"
                        control={control}
                        // rules={{ required: "Add Service Amount" }}
                        render={(props) => (
                          <AlgaehFormGroup
                            div={{ className: "col-12 form-group" }}
                            error={errors}
                            label={{
                              fieldName: "address",
                              isImp: false,
                            }}
                            textBox={{
                              ...props,

                              className: "txt-fld",

                              name: "present_address",
                              others: {
                                tabIndex: "11",
                              },
                            }}
                          />
                        )}
                      />
                      {/* <AlagehFormGroup
                          div={{ className: "col-lg-12 col-sm-12 form-group" }}
                          label={{
                            fieldName: "address",
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "present_address",
                            value: this.state.present_address,
                            events: {
                              onChange: texthandle.bind(this, this),
                              others: {
                                tabIndex: "11",
                              },
                            },
                          }}
                        /> */}
                      <Controller
                        name="present_country_id"
                        control={control}
                        // rules={{ required: "Select Procedure" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{
                              className: "col-lg-4 col-sm-12 form-group",
                            }}
                            label={{
                              fieldName: "country_id",
                              isImp: false,
                            }}
                            error={errors}
                            selector={{
                              name: "select_procedure",
                              value,
                              onChange: (_, selected) => {
                                onChange(selected);
                                setValue("present_state_id", undefined);
                                setValue("present_city_id", undefined);
                                setPresentCountry(_);
                              },

                              dataSource: {
                                textField: "country_name",
                                valueField: "hims_d_country_id",
                                data: countries,
                              },
                              others: {
                                tabIndex: "10",
                              },
                            }}
                          />
                        )}
                      />
                      {/* <AlagehAutoComplete
                          div={{
                            className:
                              "col-lg-4 col-sm-12 form-group",
                          }}
                          label={{
                            fieldName: "country_id",
                            isImp: false,
                          }}
                          selector={{
                            name: "present_country_id",
                            className: "select-fld",
                            value: this.state.present_country_id,
                            dataSource: {
                              textField: "country_name",
                              valueField: "hims_d_country_id",
                              data: this.props.countries,
                            },
                            onChange: countryStatehandle.bind(this, this),
                            others: {
                              tabIndex: "10",
                            },
                            onClear: () => {
                              this.setState({
                                present_country_id: null,
                              });
                              this.props.EmpMasterIOputs.updateEmployeeTabs({
                                present_country_id: null,
                              });
                            },
                          }}
                        /> */}
                      <Controller
                        name="present_state_id"
                        control={control}
                        // rules={{ required: "Select Procedure" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{
                              className: "col-lg-4 col-sm-12 form-group",
                            }}
                            label={{
                              fieldName: "state_id",
                              isImp: false,
                            }}
                            error={errors}
                            selector={{
                              name: "present_state_id",
                              className: "select-fld",
                              // value: this.state.present_state_id,
                              dataSource: {
                                textField: "state_name",
                                valueField: "hims_d_state_id",
                                data: presentCountry.states,
                              },
                              value,
                              onChange: (_, selected) => {
                                onChange(selected);
                                setPresentCities(_.cities);
                              },

                              others: {
                                tabIndex: "10",
                              },
                            }}
                          />
                        )}
                      />
                      {/* <AlagehAutoComplete
                          div={{
                            className:
                              "col-lg-4 col-sm-12 form-group",
                          }}
                          label={{
                            fieldName: "state_id",
                            isImp: false,
                          }}
                          selector={{
                            name: "present_state_id",
                            className: "select-fld",
                            value: this.state.present_state_id,
                            dataSource: {
                              textField: "state_name",
                              valueField: "hims_d_state_id",
                              data: this.state.countrystates,
                            },
                            onChange: countryStatehandle.bind(this, this),
                            others: {
                              tabIndex: "11",
                              disabled: this.state.existingPatient,
                            },
                            onClear: () => {
                              this.setState({
                                present_state_id: null,
                              });
                              this.props.EmpMasterIOputs.updateEmployeeTabs({
                                present_state_id: null,
                              });
                            },
                          }}
                        /> */}
                      <Controller
                        name="present_city_id"
                        control={control}
                        rules={{ required: "Select City" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{
                              className: "col-lg-4 col-sm-12 form-group",
                            }}
                            label={{
                              fieldName: "city_id",
                              isImp: false,
                            }}
                            error={errors}
                            selector={{
                              name: "present_city_id",
                              value,
                              onChange: (_, selected) => {
                                onChange(selected);

                                setValue("service_amount", _.standard_fee);
                              },

                              dataSource: {
                                textField: "city_name",
                                valueField: "hims_d_city_id",
                                data: presentCities,
                              },
                              others: {
                                tabIndex: "12",
                                // disabled: this.state.existingPatient,
                              },
                            }}
                          />
                        )}
                      />

                      {/* <AlagehAutoComplete
                          div={{
                            className:
                              "col-lg-4 col-sm-12 form-group",
                          }}
                          label={{
                            fieldName: "city_id",
                            isImp: false,
                          }}
                          selector={{
                            name: "present_city_id",
                            className: "select-fld",
                            value: this.state.present_city_id,
                            dataSource: {
                              textField: "city_name",
                              valueField: "hims_d_city_id",
                              data: this.state.present_cities,
                            },
                            onChange: texthandle.bind(this, this),
                            others: {
                              tabIndex: "12",
                              disabled: this.state.existingPatient,
                            },
                            onClear: () => {
                              this.setState({
                                present_city_id: null,
                              });
                              this.props.EmpMasterIOputs.updateEmployeeTabs({
                                present_city_id: null,
                              });
                            },
                          }}
                        /> */}
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <h5>
                      <span>Permanent Address</span>
                    </h5>
                    <div className="row paddin-bottom-5">
                      <div
                        className="col-lg-4 col-sm-12 customCheckbox form-group"
                        style={{ marginTop: 23, border: "none" }}
                      >
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="samechecked"
                            value={samechecked}
                            checked={samechecked === "Y" ? true : false}
                            onChange={(e) => {
                              sameAsPresent(e, getValues());
                            }}
                          />
                          <span>
                            <AlgaehLabel
                              label={{ forceLabel: "Same as Present" }}
                            />
                          </span>
                        </label>
                      </div>
                      <Controller
                        name="permanent_address"
                        control={control}
                        // rules={{ required: "Add Service Amount" }}
                        render={(props) => (
                          <AlgaehFormGroup
                            div={{ className: "col-lg-8 form-group" }}
                            error={errors}
                            label={{
                              fieldName: "address",
                              isImp: false,
                            }}
                            textBox={{
                              ...props,

                              className: "txt-fld",

                              name: "permanent_address",
                              others: {
                                tabIndex: "11",
                              },
                            }}
                          />
                        )}
                      />
                      {/* <AlagehFormGroup
                          div={{ className: "col-lg-8 col-sm-12 form-group" }}
                          label={{
                            fieldName: "address",
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "permanent_address",
                            value:
                              this.state.samechecked === "Y"
                                ? this.state.present_address
                                : this.state.permanent_address,
                            events: {
                              onChange: texthandle.bind(this, this),
                              others: {
                                tabIndex: "11",
                              },
                            },
                          }}
                        /> */}
                      <Controller
                        name="permanent_country_id"
                        control={control}
                        rules={{ required: "Select Procedure" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{
                              className: "col-lg-4 col-sm-12 form-group",
                            }}
                            label={{
                              fieldName: "country_id",
                              // isImp: true,
                            }}
                            error={errors}
                            selector={{
                              name: "permanent_country_id",
                              value,
                              onChange: (_, selected) => {
                                onChange(selected);
                                setValue("permanent_state_id", undefined);
                                setValue("permanent_city_id", undefined);
                                setPermanentCountry(_);
                              },

                              dataSource: {
                                textField: "country_name",
                                valueField: "hims_d_country_id",
                                data: countries,
                              },
                              others: {
                                tabIndex: "10",
                              },
                            }}
                          />
                        )}
                      />{" "}
                      {/* <AlagehAutoComplete
                          div={{
                            className:
                              "col-lg-4 col-sm-12 form-group",
                          }}
                          label={{
                            fieldName: "country_id",
                            isImp: false,
                          }}
                          selector={{
                            name: "permanent_country_id",
                            className: "select-fld",
                            value:
                              this.state.samechecked === "Y"
                                ? this.state.present_country_id
                                : this.state.permanent_country_id,
                            dataSource: {
                              textField: "country_name",
                              valueField: "hims_d_country_id",
                              data: this.props.countries,
                            },
                            onChange: countryStatehandle.bind(this, this),
                            others: {
                              tabIndex: "10",
                            },
                            onClear: () => {
                              this.setState({
                                permanent_country_id: null,
                              });
                              this.props.EmpMasterIOputs.updateEmployeeTabs({
                                permanent_country_id: null,
                              });
                            },
                          }}
                        /> */}
                      <Controller
                        name="permanent_state_id"
                        control={control}
                        rules={{ required: "Select Procedure" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{
                              className: "col-lg-4 col-sm-12 form-group",
                            }}
                            label={{
                              fieldName: "state_id",
                              isImp: false,
                            }}
                            error={errors}
                            selector={{
                              name: "permanent_state_id",
                              value,
                              onChange: (_, selected) => {
                                onChange(selected);
                                setPermanentCities(_.cities);
                              },

                              dataSource: {
                                textField: "state_name",
                                valueField: "hims_d_state_id",
                                data:
                                  samechecked === "Y"
                                    ? presentCountry.states
                                    : permanentCountry.states,
                              },
                              others: {
                                tabIndex: "11",
                              },
                            }}
                          />
                        )}
                      />{" "}
                      {/* <AlagehAutoComplete
                          div={{
                            className:
                              "col-lg-4 col-sm-12 form-group",
                          }}
                          label={{
                            fieldName: "state_id",
                            isImp: false,
                          }}
                          selector={{
                            name: "permanent_state_id",
                            className: "select-fld",
                            value:
                              this.state.samechecked === "Y"
                                ? this.state.present_state_id
                                : this.state.permanent_state_id,
                            dataSource: {
                              textField: "state_name",
                              valueField: "hims_d_state_id",
                              data:
                                this.state.samechecked === "Y"
                                  ? this.state.countrystates
                                  : this.state.precountrystates,
                            },
                            onChange: countryStatehandle.bind(this, this),
                            others: {
                              tabIndex: "11",
                            },
                            onClear: () => {
                              this.setState({
                                permanent_state_id: null,
                              });
                              this.props.EmpMasterIOputs.updateEmployeeTabs({
                                permanent_state_id: null,
                              });
                            },
                          }}
                        /> */}
                      <Controller
                        name="permanent_city_id"
                        control={control}
                        rules={{ required: "Select Procedure" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{
                              className: "col-lg-4 col-sm-12 form-group",
                            }}
                            label={{
                              fieldName: "city_id",
                              isImp: false,
                            }}
                            error={errors}
                            selector={{
                              name: "permanent_city_id",
                              value,
                              onChange: (_, selected) => {
                                onChange(selected);
                              },

                              dataSource: {
                                textField: "city_name",
                                valueField: "hims_d_city_id",
                                data:
                                  samechecked === "Y"
                                    ? presentCities
                                    : permanentCities,
                              },

                              others: {
                                tabIndex: "11",
                              },
                            }}
                          />
                        )}
                      />{" "}
                      {/* <AlagehAutoComplete
                          div={{
                            className:
                              "col-lg-4 col-sm-12 form-group",
                          }}
                          label={{
                            fieldName: "city_id",
                            isImp: false,
                          }}
                          selector={{
                            name: "permanent_city_id",
                            className: "select-fld",
                            value:
                              this.state.samechecked === "Y"
                                ? this.state.present_city_id
                                : this.state.permanent_city_id,
                            dataSource: {
                              textField: "city_name",
                              valueField: "hims_d_city_id",
                              data:
                                this.state.samechecked === "Y"
                                  ? this.state.present_cities
                                  : this.state.precities,
                            },
                            onChange: texthandle.bind(this, this),
                            others: {
                              tabIndex: "12",
                              disabled: this.state.existingPatient,
                            },
                            onClear: () => {
                              this.setState({
                                permanent_city_id: null,
                              });
                              this.props.EmpMasterIOputs.updateEmployeeTabs({
                                permanent_city_id: null,
                              });
                            },
                          }}
                        /> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-sm-12 secondary-details">
                <h5>
                  <span>Profile Image</span>
                </h5>
                <div className="row secondary-box-container">
                  <div className="col">
                    <div>
                      {/* <AlgaehFile
                          ref={(employeeImage) => {
                            this.employeeImage = employeeImage;
                          }}
                          name="employeeImage"
                          accept="image/*"
                          showActions={
                            employee_status === "I"
                              ? false
                              : employee_code === null ||
                                employee_code === ""
                              ? false
                              : true
                          }
                          textAltMessage="Employee Image"
                          serviceParameters={{
                            uniqueID: employee_code,
                            fileType: "Employees",
                            processDelay:imageDetails( "employeeImage"),
                          }}
                          renderPrevState={employeeImage}
                          forceRefresh={this.state.forceRefresh}
                        />*/}
                    </div>
                  </div>
                </div>
                {HIMS_Active === true ? (
                  <div>
                    <h5 style={{ marginTop: 20 }}>
                      <span>If its a Doctor</span>
                    </h5>
                    <div className="row secondary-box-container">
                      <div
                        className="col-lg-12 col-sm-12 customCheckbox"
                        style={{ border: "none" }}
                      >
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="isdoctor"
                            value={isdoctor}
                            checked={isdoctor === "Y" ? true : false}
                            // onChange={isDoctorChange.bind(this, this)}
                          />
                          <span>
                            <AlgaehLabel
                              label={{ forceLabel: "Healthcare Provider" }}
                            />
                          </span>
                        </label>
                      </div>
                      <Controller
                        name="license_number"
                        control={control}
                        rules={{ required: "Add Service Amount" }}
                        render={(props) => (
                          <AlgaehFormGroup
                            div={{ className: "col-lg-12 col-sm-12 mandatory" }}
                            error={errors}
                            label={{
                              fieldName: "license_number",
                              isImp: isdoctor === "Y" ? true : false,
                            }}
                            textBox={{
                              ...props,

                              className: "txt-fld",

                              name: "license_number",

                              others: {
                                disabled:
                                  this.state.isdoctor === "Y" ? false : true,
                              },
                            }}
                          />
                        )}
                      />
                      {/* <AlagehFormGroup
                        div={{ className: "col-lg-12 col-sm-12 mandatory" }}
                        label={{
                          fieldName: "license_number",
                          isImp: isdoctor === "Y" ? true : false,
                        }}
                        textBox={{
                          value: license_number,
                          className: "txt-fld",
                          name: "license_number",

                          // events: {
                          //   onChange: texthandle.bind(this, this),
                          // },
                          others: {
                            disabled: isdoctor === "Y" ? false : true,
                          },
                        }}
                      /> */}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="col">
                <DeptUserDetails EmpMasterIOputs={this.state} />
              </div> */}
      </div>
    </>
  );
}
