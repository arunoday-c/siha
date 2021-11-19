import React, { useState, useContext, useEffect, useCallback } from "react";
import "./PersonalDetails.scss";
import moment from "moment";
import _ from "lodash";
import { EmployeeMasterContext } from "../../EmployeeMasterContext";
import { EmployeeMasterContextForEmployee } from "../../EmployeeMasterContextForEmployee";
import variableJson from "../../../../../utils/GlobalVariables.json";
import AlgaehFileUploader from "../../../../Wrapper/algaehFileUpload";
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
import { Controller } from "react-hook-form";
import { newAlgaehApi } from "../../../../../hooks";
import { useQuery } from "react-query";
// import Enumerable from "linq";
const getPersonalDetails = async (key, { employee_id }) => {
  const result = await newAlgaehApi({
    uri: "/employee/getEmployeePersonalDetails",
    module: "hrManagement",
    method: "GET",
    data: { employee_id: employee_id },
  });
  return result?.data?.records;
};

// const initCall = async (key, { fields, tableName, keyFieldName }) => {
//   const result = await newAlgaehApi({
//     uri: "/init/",
//     method: "GET",
//     data: { fields: fields, tableName: tableName, keyFieldName: keyFieldName },
//   });
//   return result?.data?.records;
// };
// const getDropDownData = async (key) => {
//   const result = await newAlgaehApi({
//     uri: "/masters/get/relegion",
//     method: "GET",
//   });
//   return result?.data?.records;
// };
// const getNationalities = async (key) => {
//   const result = await newAlgaehApi({
//     uri: "/masters/get/nationality",
//     method: "GET",
//   });
//   return result?.data?.records;
// };
// const getIDTypes = async (key) => {
//   const result = await newAlgaehApi({
//     uri: "/identity/get",
//     module: "masterSettings",
//     method: "GET",
//     data: { identity_status: "A" },
//   });
//   return result?.data?.records;
// };

export default function PersonalDetails({
  EmpMasterIOputs,
  // control,
  // errors,
  // reset,
  // setValue,
  // getValues,
  // Controller,
  // clearErrors,
  employeeImage,
}) {
  // const {
  //   userToken,
  // relegions = [],
  //   countries = [],
  //   nationalities = [],
  // } = useContext(MainContext);
  const {
    userToken,
    nationalities = [],
    countries = [],
  } = useContext(MainContext);
  // useEffect(() => {
  //   debugger;
  //   console.log(nationalities);
  // }, []);
  const {
    setDropDownData,
    dropdownData,
    formControlPersonal,
    personalDetails,
    setPersonalDetails,
  } = useContext(EmployeeMasterContext);
  const { setEmployeeUpdateDetails } = useContext(
    EmployeeMasterContextForEmployee
  );
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
  // const { control, errors, reset, setValue, getValues } = useForm({
  //   defaultValues: {},
  // });
  // const handleChange = useCallback(
  //   debounce((name, value) => {
  //     // e.persist();
  //     debugger;
  //   }, 500),
  //   []
  // );
  const delayedQuery = useCallback(
    _.debounce((name, value) => onChangeHandler(name, value), 500),
    []
  );
  useEffect(() => {
    const { reset } = formControlPersonal;
    reset({ ...personalDetails });
    // debugger;
  }, []);
  function onChangeHandler(name, value) {
    debugger;
    setPersonalDetails({ ...personalDetails, [name]: value });
    console.log(
      "result---->",
      formControlPersonal.getValues(name),
      FldEditable
    );
  }
  const { data: presonalDetails } = useQuery(
    ["personal-details", { employee_id: EmpMasterIOputs }],
    getPersonalDetails,
    {
      enabled: !!EmpMasterIOputs,
      initialStale: true,

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
        debugger;
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
        setEmployeeUpdateDetails({
          ...data[0],
        });
        const rest = {
          ...data[0],
          date_of_birth: moment(data[0].date_of_birth, "YYYY-MM-DD"),
        };

        formControlPersonal.reset(rest);
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
  const { data: dropdownDataPersonalDetails } = useQuery(
    [
      "dropdown-data1",
      {
        fields: "employee_code",
        tableName: "hims_d_employee",
        keyFieldName: "hims_d_employee_id",
        // dropdownData: dropdownData,
      },
    ],
    getDropDownData,
    {
      initialData: {
        employee_code_placeHolder: [],
        relegions: [],
        // nationalities: [],
        idtypes: [],
      },
      enabled:
        !!presonalDetails ||
        EmpMasterIOputs === undefined ||
        EmpMasterIOputs === null,
      refetchOnMount: false,
      refetchOnReconnect: false,
      // keepPreviousData: true,
      refetchOnWindowFocus: false,
      initialStale: true,
      cacheTime: Infinity,
      onSuccess: (data) => {
        debugger;
        setDropDownData({ ...data, countries, nationalities });
        if (EmpMasterIOputs !== undefined || EmpMasterIOputs === null) {
          let maskedIdentity = data.idtypes.find((item) => {
            return (
              item.hims_d_identity_document_id ===
              presonalDetails[0].identity_type_id
            );
          });

          setMasked_identity(maskedIdentity.masked_identity);
        }
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );
  async function getDropDownData(key, { fields, tableName, keyFieldName }) {
    if (dropdownData === undefined || dropdownData.countries.length === 0) {
      const result = await Promise.all([
        newAlgaehApi({
          uri: "/init/",
          method: "GET",
          data: {
            fields: fields,
            tableName: tableName,
            keyFieldName: keyFieldName,
          },
        }),
        newAlgaehApi({
          uri: "/masters/get/relegion",
          method: "GET",
        }),
        // newAlgaehApi({
        //   uri: "/masters/get/nationality",
        //   method: "GET",
        // }),
        newAlgaehApi({
          uri: "/identity/get",
          module: "masterSettings",
          method: "GET",
          data: { identity_status: "A" },
        }),
      ]);
      return {
        employee_code_placeHolder: result[0]?.data?.records,
        relegions: result[1]?.data?.records,
        // nationalities: result[2]?.data?.records,
        idtypes: result[2]?.data?.records,
      };
    } else {
      return {
        employee_code_placeHolder: dropdownData.employee_code_placeHolder,
        relegions: dropdownData.relegions,
        // nationalities: dropdownData.nationalities,
        idtypes: dropdownData.idtypes,
      };
    }
  }
  const { employee_code_placeHolder, relegions, idtypes } =
    dropdownDataPersonalDetails;
  // useEffect(() => {
  //   return () => {
  //     debugger;

  //   };
  // }, [dropdownData]);
  // const requied_emp_id = isEmpIdRequired;
  // const { data: employee_code_placeHolder } = useQuery(
  //   [
  //     "employee_code",
  //     {
  //       fields: "employee_code",
  //       tableName: "hims_d_employee",
  //       keyFieldName: "hims_d_employee_id",
  //     },
  //   ],
  //   initCall
  // );
  // const { data: relegions } = useQuery("employee-religion", getRelegion, {});
  // const { data: nationalities } = useQuery(
  //   "employee_nationalities",
  //   getNationalities
  // );
  // const { data: idtypes } = useQuery("employee_idtypes", getIDTypes, {
  //   enabled: !!presonalDetails,
  //   initialStale: true,
  //   onSuccess: (data) => {
  //     let maskedIdentity = data.find((item) => {
  //       return (
  //         item.hims_d_identity_document_id ===
  //         presonalDetails[0].identity_type_id
  //       );
  //     });

  //     setMasked_identity(maskedIdentity.masked_identity);
  //   },
  //   onError: (err) => {
  //     AlgaehMessagePop({
  //       display: err?.message,
  //       type: "error",
  //     });
  //   },
  // });

  const sameAsPresent = (e, data) => {
    const value = e.target.checked ? "Y" : "N";

    if (value === "Y") {
      formControlPersonal.setValue("permanent_address", data.present_address);
      formControlPersonal.setValue(
        "permanent_country_id",
        data.present_country_id
      );
      formControlPersonal.setValue("permanent_state_id", data.present_state_id);
      formControlPersonal.setValue("permanent_city_id", data.present_city_id);
    } else {
      formControlPersonal.setValue(
        "permanent_address",
        presonalDetails[0].permanent_address
      );
      formControlPersonal.setValue(
        "permanent_country_id",
        presonalDetails[0].permanent_country_id
      );
      formControlPersonal.setValue(
        "permanent_state_id",
        presonalDetails[0].permanent_state_id
      );
      formControlPersonal.setValue(
        "permanent_city_id",
        presonalDetails[0].permanent_city_id
      );
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
                    control={formControlPersonal.control}
                    rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className: "col-lg-2 col-md-2 col-sm-12 mandatory",
                        }}
                        error={formControlPersonal.errors}
                        label={{
                          forceLabel: "Emp. Code",
                          isImp: true,
                        }}
                        textBox={{
                          name: "employee_code",
                          type: "text",
                          className: "form-control",
                          // ...props,
                          onChange: (e) => {
                            props.onChange(e);
                            delayedQuery(e.target.name, e.target.value);
                          },
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
                    control={formControlPersonal.control}
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
                    control={formControlPersonal.control}
                    rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className:
                            "col-lg-3 col-sm-12 arabic-txt-fld mandatory",
                        }}
                        error={formControlPersonal.errors}
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
                    control={formControlPersonal.control}
                    name="date_of_birth"
                    rules={{ required: "Please Select DOB" }}
                    render={({ onChange, value }) => (
                      <AlgaehDateHandler
                        div={{
                          className: "col-lg-2 col-md-2 col-sm-12 mandatory",
                          tabIndex: "4",
                        }}
                        error={formControlPersonal.errors}
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
                    control={formControlPersonal.control}
                    name="sex"
                    rules={{ required: "Required" }}
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{
                          className: "col-lg-2 col-md-2 col-sm-12 mandatory",
                        }}
                        error={formControlPersonal.errors}
                        label={{
                          fieldName: "gender",
                          isImp: true,
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
                    control={formControlPersonal.control}
                    rules={{ required: "Please Select Nationality" }}
                    name="nationality"
                    render={({ onBlur, onChange, value }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-lg-3 mandatory" }}
                        label={{
                          fieldName: "nationality_id",
                          isImp: true,
                        }}
                        error={formControlPersonal.errors}
                        selector={{
                          name: "nationality",
                          className: "select-fld",

                          dataSource: {
                            textField: "nationality",
                            valueField: "hims_d_nationality_id",
                            data: nationalities,
                          },

                          value,
                          onChange: (_, selected) => {
                            onChange(selected);
                          },
                          onClear: () => {
                            onChange("");
                          },
                          others: {
                            // disabled,
                            tabIndex: "13",
                          },
                        }}
                      />
                    )}
                  />
                  {/* <Controller
                    control={control}
                    name="nationality"
                    rules={{ required: "Required" }}
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{
                          className:
                            "col-lg-2 col-md-2 col-sm-12 form-group mandatory",
                        }}
                        error={errors}
                        label={{
                          forceLabel: "Nationality",
                          isImp: true,
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
                            data: nationalities ?? [],
                          },
                        }}
                      />
                    )}
                  /> */}
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
                    control={formControlPersonal.control}
                    name="religion_id"
                    rules={{ required: "Required" }}
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{
                          className:
                            "col-lg-2 col-md-2 col-sm-12 mandatory form-group",
                        }}
                        error={formControlPersonal.errors}
                        label={{
                          forceLabel: "Religion",
                          isImp: true,
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
                    control={formControlPersonal.control}
                    // rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className: "col-lg-2 col-md-2 col-sm-12",
                        }}
                        // error={errors}
                        label={{
                          forceLabel: "Personal Contact No.",
                          // isImp: true,
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
                    control={formControlPersonal.control}
                    // rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className: "col-lg-2 col-md-2 col-sm-12",
                        }}
                        // error={errors}
                        label={{
                          forceLabel: "Work Contact No.",
                          // isImp: true,
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
                    control={formControlPersonal.control}
                    name="identity_type_id"
                    render={({ value, onChange, onBlur }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                        label={{
                          forceLabel: "PRIMARY ID",
                          isImp: false,
                        }}
                        selector={{
                          value,
                          onChange: (_, selected) => {
                            setMasked_identity(_.masked_identity);
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
                  <div className="col-lg-2 col-md-2 col-sm-12 mandatory">
                    <label className="styleLabel"> ENTER ID NUMBER</label>

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
                        control={formControlPersonal.control}
                        // rules={{ required: "Required" }}
                        render={(props) => (
                          <AlgaehFormGroup
                            div={{
                              className: "col-10",
                            }}
                            // error={errors}
                            label={{
                              forceLabel: "",
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
                    control={formControlPersonal.control}
                    // rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className: "col-lg-3 col-sm-12",
                        }}
                        // error={errors}
                        label={{
                          forceLabel: "Personal Email Id",
                          // isImp: true,
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
                    control={formControlPersonal.control}
                    // rules={{ required: "Required" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className: "col-lg-3 col-sm-12",
                        }}
                        // error={errors}
                        label={{
                          forceLabel: "Personal Email Id",
                          // isImp: true,
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
                    control={formControlPersonal.control}
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
                    control={formControlPersonal.control}
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
                        control={formControlPersonal.control}
                        // rules={{ required: "Add Service Amount" }}
                        render={(props) => (
                          <AlgaehFormGroup
                            div={{ className: "col-2 mandatory form-group" }}
                            // error={errors}
                            label={{
                              fieldName: "address",
                              // isImp: true,
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
                        control={formControlPersonal.control}
                        // rules={{ required: "Select Procedure" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{
                              className:
                                "col-lg-4 col-sm-12 form-group form-group",
                            }}
                            label={{
                              fieldName: "country_id",
                              // isImp: true,
                            }}
                            // error={errors}
                            selector={{
                              name: "select_procedure",
                              value,
                              onChange: (_, selected) => {
                                onChange(selected);
                                formControlPersonal.setValue(
                                  "present_state_id",
                                  undefined
                                );
                                formControlPersonal.setValue(
                                  "present_city_id",
                                  undefined
                                );
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
                              "col-lg-4 col-sm-12 form-group form-group",
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
                        control={formControlPersonal.control}
                        // rules={{ required: "Select Procedure" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{
                              className:
                                "col-lg-4 col-sm-12 form-group form-group",
                            }}
                            label={{
                              fieldName: "state_id",
                              // isImp: true,
                            }}
                            // error={errors}
                            selector={{
                              name: "present_state_id",
                              className: "select-fld",
                              // value: this.state.present_state_id,
                              dataSource: {
                                textField: "state_name",
                                valueField: "hims_d_state_id",
                                data: presentCountry?.states,
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
                              "col-lg-4 col-sm-12 form-group form-group",
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
                        control={formControlPersonal.control}
                        // rules={{ required: "Select Procedure" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{
                              className:
                                "col-lg-4 col-sm-12 form-group form-group",
                            }}
                            label={{
                              fieldName: "city_id",
                              isImp: false,
                            }}
                            // error={errors}
                            selector={{
                              name: "present_city_id",
                              value,
                              onChange: (_, selected) => {
                                onChange(selected);

                                formControlPersonal.setValue(
                                  "service_amount",
                                  _.standard_fee
                                );
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
                              "col-lg-4 col-sm-12 form-group form-group",
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
                          <Controller
                            name="samechecked"
                            control={formControlPersonal.control}
                            // defaultValue={"N"}
                            // rules={{ required: true }}
                            render={(props) => (
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  props.onChange(
                                    e.target.checked
                                      ? (props.value = "Y")
                                      : (props.value = "N")
                                  )
                                }
                                checked={props.value === "Y" ? true : false}
                              />
                            )} // props contains: onChange, onBlur and value
                          />
                          <input
                            type="checkbox"
                            name="samechecked"
                            value={samechecked}
                            checked={samechecked === "Y" ? true : false}
                            onChange={(e) => {
                              sameAsPresent(e, formControlPersonal.getValues());
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
                        control={formControlPersonal.control}
                        // rules={{ required: "Add Service Amount" }}
                        render={(props) => (
                          <AlgaehFormGroup
                            div={{ className: "col-lg-8 col-sm-12 form-group" }}
                            // error={errors}
                            label={{
                              fieldName: "address",
                              // isImp: true,
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
                        control={formControlPersonal.control}
                        // rules={{ required: "Select Procedure" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{
                              className:
                                "col-lg-4 col-sm-12 form-group form-group",
                            }}
                            label={{
                              fieldName: "country_id",
                              // isImp: true,
                            }}
                            // error={errors}
                            selector={{
                              name: "permanent_country_id",
                              value,
                              onChange: (_, selected) => {
                                onChange(selected);
                                formControlPersonal.setValue(
                                  "permanent_state_id",
                                  undefined
                                );
                                formControlPersonal.setValue(
                                  "permanent_city_id",
                                  undefined
                                );
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
                              "col-lg-4 col-sm-12 form-group form-group",
                          }}
                          label={{PROFILE IMAGE

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
                        control={formControlPersonal.control}
                        // rules={{ required: "Select Procedure" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{
                              className:
                                "col-lg-4 col-sm-12 form-group form-group",
                            }}
                            label={{
                              fieldName: "state_id",
                              isImp: false,
                            }}
                            // error={errors}
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
                              "col-lg-4 col-sm-12 form-group form-group",
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
                        control={formControlPersonal.control}
                        // rules={{ required: "Select Procedure" }}
                        render={({ value, onChange }) => (
                          <AlgaehAutoComplete
                            div={{
                              className:
                                "col-lg-4 col-sm-12 form-group form-group",
                            }}
                            label={{
                              fieldName: "city_id",
                              isImp: false,
                            }}
                            // error={errors}
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
                              "col-lg-4 col-sm-12 form-group form-group",
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
                      <AlgaehFileUploader
                        key={
                          formControlPersonal.getValues().employee_code ||
                          "image"
                        }
                        ref={employeeImage}
                        name="employeeImage"
                        accept="image/*"
                        textAltMessage="Employee Image"
                        serviceParameters={{
                          uniqueID:
                            formControlPersonal.getValues().employee_code ||
                            null,
                          fileType: "Employees",
                          // processDelay: (...val) => {
                          //   console.log(val, "val");
                          // },
                        }}
                        //Need to add undefined. if no record exists
                        renderPrevState={true}
                        forceRefresh={
                          !formControlPersonal.getValues().employee_code
                        }
                      />
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
                          forceRefresh={!}
                        /> */}
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
                        control={formControlPersonal.control}
                        // rules={{ required: "Add Service Amount" }}
                        render={(props) => (
                          <AlgaehFormGroup
                            div={{ className: "col-lg-12 col-sm-12 mandatory" }}
                            // error={errors}
                            label={{
                              fieldName: "license_number",
                              isImp: isdoctor === "Y" ? true : false,
                            }}
                            textBox={{
                              ...props,

                              className: "txt-fld",

                              name: "license_number",

                              others: {
                                disabled: isdoctor === "Y" ? false : true,
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
