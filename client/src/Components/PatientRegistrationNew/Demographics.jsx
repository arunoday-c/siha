import React, { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { Controller, useWatch } from "react-hook-form";
import moment from "moment";
import {
  MainContext,
  Tabs,
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehHijriDatePicker,
  Spin,
} from "algaeh-react-components";
import AlgaehFileUploader from "../Wrapper/algaehFileUpload";
import { newAlgaehApi, useQueryParams } from "../../hooks/";
import GenericData from "../../utils/GlobalVariables.json";
import { FrontdeskContext } from "./FrontdeskContext";
import { useLangFieldName } from "./patientHooks";
const { TabPane } = Tabs;
const { FORMAT_GENDER, FORMAT_MARTIALSTS } = GenericData;

async function getDemoData() {
  const result = await Promise.all([
    newAlgaehApi({
      uri: "/visaType/getVisaMaster",
      module: "masterSettings",
      method: "GET",
      data: { visa_status: "A" },
    }),
    newAlgaehApi({
      uri: "/patientType/getPatientType",
      module: "masterSettings",
      method: "GET",
      data: { patient_status: "A" },
    }),
    newAlgaehApi({
      uri: "/identity/get",
      module: "masterSettings",
      data: { identity_status: "A" },
      method: "GET",
    }),
  ]);
  return {
    visaTypes: result[0]?.data?.records,
    patientTypes: result[1]?.data?.records,
    identities: result[2]?.data?.records,
  };
}

export function Demographics({
  control,
  setValue,
  errors,
  patientIdCard,
  patientImage,
  incomeByOp,
  incomeByPoint,
  inModal = false,
}) {
  const queryParams = useQueryParams();
  const patient_code = queryParams.get("patient_code");
  const { savedPatient } = useContext(FrontdeskContext);
  const disabled = !inModal && (!!patient_code || !!savedPatient?.patient_code);
  const {
    country_id: country,
    state_id,
    date_of_birth,
    primary_id_no,
    nationality_id,
  } = useWatch({
    control,
    name: [
      "country_id",
      "state_id",
      "date_of_birth",
      "primary_id_no",
      "nationality_id",
    ],
  });

  const { fieldNameFn } = useLangFieldName();
  const {
    titles = [],
    nationalities = [],
    countries = [],
    religions = [],
  } = useContext(MainContext);
  const { isLoading, data: dropdownData } = useQuery(
    "dropdown-data",
    getDemoData,
    {
      initialData: {
        visaTypes: [],
        patientTypes: [],
        identities: [],
      },
      refetchOnMount: false,
      initialStale: true,
      cacheTime: Infinity,
    }
  );
  const { visaTypes, patientTypes, identities } = dropdownData;
  const requied_emp_id = "N";

  const states = country
    ? countries?.filter((i) => i.hims_d_country_id == country)[0]?.states
    : [];

  const cities = state_id
    ? states?.filter((c) => c.hims_d_state_id === state_id)[0]?.cities
    : [];

  useEffect(() => {
    if (!!nationality_id && nationalities?.length) {
      const res = nationalities?.filter(
        (n) => n.hims_d_nationality_id == nationality_id
      );
      if (!patient_code) {
        if (res[0]?.identity_document_id) {
          setValue("primary_identity_id", res[0]?.identity_document_id);
        } else {
          setValue("primary_identity_id", "");
        }
      }
    }
    // eslint-disable-next-line
  }, [nationality_id, nationalities, patient_code]);

  const calculateAge = (date) => {
    if (date) {
      let fromDate = moment(date);

      let years = moment().diff(fromDate, "year");
      fromDate.add(years, "years");
      let months = moment().diff(fromDate, "months");
      fromDate.add(months, "months");
      let days = moment().diff(fromDate, "days");
      return `${years} Years, ${months} Months, ${days} Days`;
    } else {
      return "";
    }
  };
  console.log("parseInt(incomeByPoint)", parseInt(incomeByPoint));
  return (
    <Spin spinning={isLoading}>
      <div className="hptl-phase1-patient-details margin-bottom-15 margin-top-15">
        <div className="patient-section">
          <Tabs type="card">
            <TabPane
              tab={
                <AlgaehLabel
                  label={{
                    fieldName: "tab_patdtls",
                  }}
                />
              }
              key="patientDetails"
            >
              <div
                className="hptl-phase1-add-patient-form"
                data-validate="demographicDetails"
              >
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-8 primary-details">
                      <div className="row paddin-bottom-5">
                        <Controller
                          control={control}
                          name="title_id"
                          rules={{ required: "Please Select Title" }}
                          render={({ onBlur, onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-lg-2 mandatory" }}
                              label={{
                                fieldName: "title_id",
                                isImp: true,
                              }}
                              error={errors}
                              selector={{
                                name: "title_id",
                                className: "select-fld",
                                placeholder: "Select Title",
                                dataSource: {
                                  textField: fieldNameFn("title"),
                                  valueField: "his_d_title_id",
                                  data: titles,
                                },
                                value,
                                onChange: (_, selected) => {
                                  onChange(selected);
                                  if (selected == 1 || selected == 6) {
                                    setValue("gender", "Male");
                                  } else {
                                    setValue("gender", "Female");
                                  }
                                },
                                onClear: () => {
                                  onChange("");
                                },
                                others: {
                                  disabled,
                                  tabIndex: "1",
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="full_name"
                          rules={{ required: "Please Enter Name" }}
                          render={(props) => (
                            <AlgaehFormGroup
                              div={{ className: "col-lg-4 mandatory" }}
                              label={{
                                fieldName: "full_name",
                                isImp: true,
                              }}
                              error={errors}
                              textBox={{
                                ...props,
                                className: "txt-fld",
                                name: "full_name",
                                placeholder: "Enter Full Name",
                                disabled,
                                tabIndex: "2",
                              }}

                              // target={{
                              //   tElement: (arabicText) => {
                              //     const arabic_name = this.state.arabic_name;
                              //     this.setState({
                              //       arabic_name:
                              //         arabic_name !== "" || arabic_name !== undefined
                              //           ? `${arabic_name} ${arabicText}`
                              //           : arabicText,
                              //     });
                              //   },
                              // }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="arabic_name"
                          rules={{ required: "Please Enter Arabic Name" }}
                          render={(props) => (
                            <AlgaehFormGroup
                              div={{
                                className: "col-lg-4 mandatory arabic-txt-fld",
                              }}
                              error={errors}
                              label={{
                                fieldName: "arabic_name",
                                isImp: true,
                              }}
                              textBox={{
                                ...props,
                                className: "txt-fld",
                                name: "arabic_name",

                                disabled,
                                tabIndex: "3",
                                placeholder: "أدخل الاسم العربي",
                                id: "arabicName",
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          rules={{ required: "Please Select Gender" }}
                          name="gender"
                          render={({ onBlur, onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-lg-2 mandatory" }}
                              label={{
                                fieldName: "gender",
                                isImp: true,
                              }}
                              error={errors}
                              selector={{
                                name: "gender",
                                className: "select-fld",

                                dataSource: {
                                  textField: fieldNameFn("name"),
                                  valueField: "value",
                                  data: FORMAT_GENDER,
                                },
                                value,
                                onChange: (_, selected) => {
                                  onChange(selected);
                                },
                                onClear: () => {
                                  onChange("");
                                },
                                others: {
                                  disabled,
                                  tabIndex: "4",
                                },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="row paddin-bottom-5">
                        <Controller
                          control={control}
                          name="date_of_birth"
                          rules={{ required: "Please Select DOB" }}
                          render={({ onChange, value }) => (
                            <AlgaehDateHandler
                              div={{
                                className: "col-lg-3 mandatory",
                                tabIndex: "5",
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
                              others={{ disabled }}
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

                        <AlgaehHijriDatePicker
                          div={{
                            className: "col-lg-3 mandatory HijriCalendar",
                            tabIndex: "6",
                          }}
                          gregorianDate={date_of_birth || null}
                          label={{ forceLabel: "Hijiri Date" }}
                          textBox={{ className: "txt-fld", disabled }}
                          type="hijri"
                          events={{
                            onChange: ({ target }) => {
                              setValue(
                                "date_of_birth",
                                moment(target?.gregorianDate, "DD-MM-YYYY")._d
                              );
                            },
                            onClear: () => {
                              setValue("date_of_birth", undefined);
                            },
                          }}
                        />

                        <AlgaehFormGroup
                          div={{
                            className: "col-lg-3 mandatory",
                            others: {
                              style: { paddingRight: 0 },
                            },
                          }}
                          error={errors}
                          label={{
                            fieldName: "age",
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "age",
                            value: calculateAge(date_of_birth),
                            disabled: true,
                            tabIndex: "7",
                            placeholder: "Y",
                          }}
                        />

                        <Controller
                          control={control}
                          name="contact_number"
                          rules={{
                            required: "Please Enter Contact Number",
                            minLength: {
                              message: "Please Enter Valid Number",
                              value: 10,
                            },
                          }}
                          render={(props) => (
                            <AlgaehFormGroup
                              div={{
                                className: "col-3 mandatory",
                                others: {
                                  style: { paddingLeft: 0 },
                                },
                              }}
                              label={{
                                fieldName: "contact_number",
                                isImp: true,
                              }}
                              error={errors}
                              textBox={{
                                ...props,
                                className: "txt-fld",
                                name: "contact_number",
                                disabled,
                                tabIndex: "10",
                                placeholder: "(+01)123-456-7890",
                                type: "number",
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="row paddin-bottom-5">
                        <Controller
                          control={control}
                          name="patient_type"
                          rules={{ required: "Please Select Patient Type" }}
                          render={({ onBlur, onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-lg-3 mandatory" }}
                              label={{
                                fieldName: "patient_type",
                                isImp: true,
                              }}
                              error={errors}
                              selector={{
                                name: "patient_type",
                                className: "select-fld",

                                dataSource: {
                                  textField: fieldNameFn("patitent_type_desc"),
                                  valueField: "hims_d_patient_type_id",
                                  data: patientTypes,
                                },

                                value,
                                onChange: (_, selected) => {
                                  onChange(selected);
                                },
                                onClear: () => {
                                  onChange("");
                                },
                                others: {
                                  disabled,
                                  tabIndex: "11",
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="country_id"
                          rules={{ required: "Please Select Country" }}
                          render={({ onBlur, onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-lg-3 mandatory" }}
                              label={{
                                fieldName: "country_id",
                                isImp: true,
                              }}
                              error={errors}
                              selector={{
                                name: "country_id",
                                className: "select-fld",
                                dataSource: {
                                  textField: fieldNameFn("country_name"),
                                  valueField: "hims_d_country_id",
                                  data: countries,
                                },
                                value,
                                onChange: (_, selected) => {
                                  onChange(selected);
                                },
                                onClear: () => {
                                  onChange("");
                                },
                                others: {
                                  disabled,
                                  tabIndex: "12",
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          rules={{ required: "Please Select Nationality" }}
                          name="nationality_id"
                          render={({ onBlur, onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-lg-3 mandatory" }}
                              label={{
                                fieldName: "nationality_id",
                                isImp: true,
                              }}
                              error={errors}
                              selector={{
                                name: "nationality_id",
                                className: "select-fld",

                                dataSource: {
                                  textField: fieldNameFn("nationality"),
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
                                  disabled,
                                  tabIndex: "13",
                                },
                              }}
                            />
                          )}
                        />

                        {requied_emp_id === "Y" ? (
                          <Controller
                            control={control}
                            name="employee_id"
                            render={(props) => (
                              <AlgaehFormGroup
                                div={{
                                  className: "col-3 form-group mandatory",
                                }}
                                label={{
                                  fieldName: "employee_id",
                                  isImp: requied_emp_id === "Y" ? true : false,
                                }}
                                error={errors}
                                textBox={{
                                  ...props,
                                  className: "txt-fld",
                                  name: "employee_id",
                                  disabled,
                                  type: "text",
                                  tabIndex: "14",
                                }}
                              />
                            )}
                          />
                        ) : null}
                      </div>
                      <div className="row paddin-bottom-5">
                        <Controller
                          control={control}
                          name="marital_status"
                          render={({ onBlur, onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{
                                className: "col-lg-3",
                              }}
                              label={{
                                fieldName: "marital_status",
                                isImp: false,
                              }}
                              error={errors}
                              selector={{
                                name: "marital_status",
                                className: "select-fld",
                                dataSource: {
                                  textField: fieldNameFn("name"),
                                  valueField: "value",
                                  data: FORMAT_MARTIALSTS,
                                },
                                value,
                                onChange: (_, selected) => {
                                  onChange(selected);
                                },
                                onClear: () => {
                                  onChange("");
                                },
                                others: {
                                  disabled,
                                  tabIndex: "17",
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="religion_id"
                          render={({ onBlur, onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-lg-3" }}
                              label={{
                                fieldName: "religion_id",
                                isImp: false,
                              }}
                              error={errors}
                              selector={{
                                name: "religion_id",
                                className: "select-fld",
                                dataSource: {
                                  textField: fieldNameFn("religion_name"),
                                  valueField: "hims_d_religion_id",
                                  data: religions,
                                },

                                value,
                                onChange: (_, selected) => {
                                  onChange(selected);
                                },
                                onClear: () => {
                                  onChange("");
                                },
                                others: {
                                  disabled,
                                  tabIndex: "18",
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="visa_type_id"
                          render={({ onBlur, onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-lg-3" }}
                              label={{
                                fieldName: "visa_type_id",
                              }}
                              error={errors}
                              selector={{
                                name: "visa_type_id",
                                className: "select-fld",

                                dataSource: {
                                  textField: fieldNameFn("visa_type"),
                                  valueField: "hims_d_visa_type_id",
                                  data: visaTypes,
                                },

                                value,
                                onChange: (_, selected) => {
                                  onChange(selected);
                                },
                                onClear: () => {
                                  onChange("");
                                },
                                others: {
                                  disabled,
                                  tabIndex: "19",
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="state_id"
                          render={({ onBlur, onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-lg-3" }}
                              label={{
                                fieldName: "state_id",
                                isImp: false,
                              }}
                              error={errors}
                              selector={{
                                name: "state_id",
                                className: "select-fld",
                                dataSource: {
                                  textField: fieldNameFn("state_name"),
                                  valueField: "hims_d_state_id",
                                  data: country ? states : [],
                                },
                                value,
                                onChange: (_, selected) => {
                                  onChange(selected);
                                },
                                onClear: () => {
                                  onChange("");
                                },
                                others: {
                                  disabled,
                                  tabIndex: "20",
                                },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="row paddin-bottom-5">
                        <Controller
                          control={control}
                          name="city_id"
                          render={({ onBlur, onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-lg-3" }}
                              label={{
                                fieldName: "city_id",
                                isImp: false,
                              }}
                              error={errors}
                              selector={{
                                name: "city_id",
                                className: "select-fld",
                                dataSource: {
                                  textField: fieldNameFn(
                                    "city_name",
                                    "city_arabic_name"
                                  ),
                                  valueField: "hims_d_city_id",
                                  data: cities,
                                },
                                value,
                                onChange: (_, selected) => {
                                  onChange(selected);
                                },
                                onClear: () => {
                                  onChange("");
                                },
                                others: {
                                  disabled,
                                  tabIndex: "21",
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="address1"
                          render={(props) => (
                            <AlgaehFormGroup
                              div={{ className: "col" }}
                              label={{
                                fieldName: "address1",
                              }}
                              error={errors}
                              textBox={{
                                ...props,
                                className: "txt-fld",
                                name: "address1",
                                disabled,
                                placeholder: "Enter Full Address 1",
                                tabIndex: "22",
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 secondary-details">
                      <div
                        className="row secondary-box-container"
                        style={{ paddingTop: "5px" }}
                      >
                        <div className="col-lg-5 patientRegImg">
                          <AlgaehFileUploader
                            key={patient_code || "image"}
                            ref={patientImage}
                            name="patientImage"
                            accept="image/*"
                            textAltMessage="Patient Image"
                            serviceParameters={{
                              uniqueID: patient_code || null,
                              fileType: "Patients",
                              // processDelay: (...val) => {
                              //   console.log(val, "val");
                              // },
                            }}
                            //Need to add undefined. if no record exists
                            renderPrevState={true}
                            // renderPrevState={patientImage.current}
                            forceRefresh={!patient_code}
                          />
                        </div>
                        <div className="col-lg-7 patientRegId">
                          <AlgaehFileUploader
                            key={patient_code || "idcard"}
                            ref={patientIdCard}
                            noImage="ID-card"
                            name="patientIdCard"
                            accept="image/*"
                            textAltMessage="ID Card"
                            serviceParameters={{
                              uniqueID: primary_id_no || null,
                              fileType: "Patients",
                              // processDelay: (...val) => {
                              //   console.log(val, "val")
                              // },
                            }}
                            //Need to add undefined. if no record exists
                            renderPrevState={patient_code ? undefined : true}
                            forceRefresh={!patient_code}
                          />

                          <div />
                        </div>
                      </div>

                      <div
                        className="row secondary-box-container"
                        style={{ paddingTop: "10px" }}
                      >
                        <Controller
                          control={control}
                          name="primary_identity_id"
                          rules={{
                            required: {
                              value: true,
                              message: "Please Enter Nationality ID",
                            },
                          }}
                          render={({ onBlur, onChange, value }) => (
                            <AlgaehAutoComplete
                              div={{ className: "col-lg-5 mandatory" }}
                              label={{
                                fieldName: "primary_identity_id",
                                isImp: true,
                              }}
                              error={errors}
                              selector={{
                                name: "primary_identity_id",
                                className: "select-fld",
                                dataSource: {
                                  textField: fieldNameFn(
                                    "identity_document_name"
                                  ),
                                  valueField: "hims_d_identity_document_id",
                                  data: identities,
                                },
                                value,
                                onChange: (_, selected) => {
                                  onChange(selected);
                                },
                                onClear: () => {
                                  onChange("");
                                },
                                others: {
                                  disabled,
                                  tabIndex: "15",
                                },
                              }}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name="primary_id_no"
                          rules={{
                            required: {
                              value: true,
                              message: "Please enter primary id no",
                            },
                          }}
                          render={(props) => (
                            <AlgaehFormGroup
                              div={{ className: "col-lg-7 mandatory" }}
                              label={{
                                fieldName: "primary_id_no",
                                isImp: true,
                              }}
                              error={errors}
                              textBox={{
                                ...props,
                                className: "txt-fld",
                                name: "primary_id_no",
                                disabled,
                                tabIndex: "16",
                                placeholder: "Enter ID Number",
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane
              tab={
                <AlgaehLabel
                  label={{
                    fieldName: "tab_othinf",
                  }}
                />
              }
              key="otherInfo"
            >
              <div className="hptl-phase1-add-other-form">
                {/* <div className="main-details" /> */}
                <div className="col-lg-12">
                  <div className="row" style={{ paddingTop: "10px" }}>
                    <div className="col-8">
                      <div className="row">
                        {" "}
                        <div className="col">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Income from Billing",
                            }}
                          />
                          <h6>{incomeByOp ? incomeByOp : 0.0}</h6>
                        </div>{" "}
                        <i className="fas fa-plus calcSybmbol"></i>
                        <div className="col">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Income from Point of Sales",
                            }}
                          />
                          <h6>{incomeByPoint ? incomeByPoint : 0.0}</h6>
                        </div>{" "}
                        <i className="fas fa-equals calcSybmbol"></i>
                        <div className="col">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Net Income from Patient",
                            }}
                          />
                          <h6>
                            {incomeByPoint || incomeByOp
                              ? parseInt(incomeByOp) + parseInt(incomeByPoint)
                              : 0.0}
                          </h6>
                        </div>{" "}
                      </div>
                    </div>
                    <div className="col-4"></div>
                  </div>
                  <hr />

                  <div className="row" style={{ paddingBottom: "10px" }}>
                    <Controller
                      control={control}
                      name="secondary_contact_number"
                      render={(props) => (
                        <AlgaehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "secondary_contact_number",
                          }}
                          textBox={{
                            ...props,
                            className: "txt-fld",
                            name: "secondary_contact_number",
                            placeholder: "(+01)123-456-7890",
                            type: "number",
                            disabled,
                          }}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="emergency_contact_number"
                      render={(props) => (
                        <AlgaehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "emergency_contact_number",
                          }}
                          textBox={{
                            ...props,
                            className: "txt-fld",
                            name: "emergency_contact_number",
                            placeholder: "(+01)123-456-7890",
                            type: "number",
                            disabled,
                          }}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="emergency_contact_name"
                      render={(props) => (
                        <AlgaehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "emergency_contact_name",
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "emergency_contact_name",
                            ...props,
                            disabled,
                          }}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="relationship_with_patient"
                      render={(props) => (
                        <AlgaehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "relationship_with_patient",
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "relationship_with_patient",
                            ...props,
                            disabled,
                          }}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="email"
                      render={(props) => (
                        <AlgaehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "email",
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "email",
                            placeholder: "Enter Email Address",
                            type: "email",
                            disabled,
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="row" style={{ paddingBottom: "10px" }}>
                    <Controller
                      control={control}
                      name="postal_code"
                      render={(props) => (
                        <AlgaehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            fieldName: "postal_code",
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "postal_code",
                            ...props,
                            disabled,
                          }}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="address2"
                      render={(props) => (
                        <AlgaehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "address2",
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "address2",
                            ...props,
                            disabled,
                            placeholder: "Enter Full Address 2",
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Spin>
  );
}
