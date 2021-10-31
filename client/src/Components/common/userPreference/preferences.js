import React, { memo, useState, useContext, useEffect } from "react";
import {
  Switch,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehTreeSearch,
} from "algaeh-react-components";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { newAlgaehApi } from "../../../hooks";
import { MainContext } from "algaeh-react-components";
import { swalMessage } from "../../../utils/algaehApiCall";
import UserDownloads from "./userDownloads";
const getDoctorData = async () => {
  const result = await Promise.all([
    newAlgaehApi({
      uri: "/frontDesk/getDoctorAndDepartment",
      module: "frontDesk",
      method: "GET",
    }),
    newAlgaehApi({
      uri: "/visitType/get",
      module: "masterSettings",
      method: "GET",
    }),
  ]);
  return {
    doctors: result[0]?.data?.records,
    visitTypes: result[1]?.data?.records,
  };
};

// const getPreferenceData = async (key, { user_id }) => {
//   const result = await newAlgaehApi({
//     uri: "/getPreferences",
//     data: { user_id },
//     method: "POST",
//     module: "documentManagement",
//   });

//   return result?.data?.records;
// };

export default memo(function () {
  const [searchBarDropDown, setSearchBarDropDown] = useState(true);
  const [notificationSound, setNotificationSound] = useState(true);
  const [screens, setScreens] = useState([]);
  const [language, setLanguage] = useState([]);
  const { userMenu, userToken, userPreferences } = useContext(MainContext);
  const {
    control,
    handleSubmit,
    setValue,
    // trigger,
    errors,
    // reset,
    // setError,
    // clearErrors,
    getValues,
    // formState,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      screen_code: "FD0002",
    },
  });

  useEffect(() => {
    let scrns = [];
    for (let i = 0; i < userMenu.length; i++) {
      for (let j = 0; j < userMenu[i]["ScreenList"].length; j++) {
        const {
          screen_name,
          s_other_language,
          algaeh_app_screens_id,
          screen_code,
        } = userMenu[i]["ScreenList"][j];
        scrns.push({
          screen_name,
          screen_code,
          s_other_language,
          algaeh_app_screens_id,
        });
      }
    }
    const { other_lang, other_lang_short } = userToken;
    console.log("usertocken", userToken);
    setLanguage([
      { lang_short: "en", lang: "English" },
      { lang_short: other_lang_short, lang: other_lang },
    ]);
    setScreens(scrns);

    console.log("userPreferences", userPreferences);

    if (userPreferences?.length > 0 && userPreferences) {
      const preference = userPreferences[0]["FD0002"];
      if (preference) {
        if (getValues().screen_code === "FD0002") {
          setValue("visit_type", preference.visit_type);
          setValue("doctor", preference.doctor);
        }
      }
    }
  }, []); //eslint-disable-line

  const { data } = useQuery("doctors-data", getDoctorData, {
    cacheTime: Infinity,
    initialData: {
      doctors: [],
      visitTypes: [],
    },
    initialStale: true,
    onSuccess: (data) => {
      // const res = data?.visitTypes?.filter((item) => item.consultation === "Y");
    },
  });

  // const {} = useQuery(
  //   ["preference-data", { user_id: userToken.user_id }],
  //   getPreferenceData,
  //   {
  //     refetchOnReconnect: false,
  //     // keepPreviousData: true,
  //     refetchOnWindowFocus: false,
  //     initialStale: true,
  //     cacheTime: Infinity,
  //     onSuccess: (data) => {
  //       debugger;
  //       if (data.length > 0) {
  //         debugger;
  //         const bindData = data[0].preferences[0].preference;
  //         reset({ ...bindData });
  //       }
  //     },
  //   }
  // );
  // const { visit_type } = useWatch({
  //   control,
  //   name: ["visit_type"],
  // });

  // const { visitTypes } = data;

  function onChnageSwitch(checked, e) {
    const { name } = e.currentTarget;
    switch (name) {
      case "searchBarDropDown":
        setSearchBarDropDown(checked);
        break;
      case "notificationSound":
        setNotificationSound(checked);
        break;
      default:
        break;
    }
  }

  const addOrUpdatePreference = (data) => {
    newAlgaehApi({
      uri: "/setPreferences",
      data: {
        preferenceData: { ...data },
        screen_code: data.screen_code,
        user_id: userToken.user_id,
      },
      method: "POST",
      module: "documentManagement",
    })
      .then((res) => {
        swalMessage({
          type: "success",
          title: "Request Added successfully",
        });
      })
      .catch((e) => {
        swalMessage({
          type: "error",
          title: e.message,
        });
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-3">
          <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">User Preferences</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <small> (For Front Desk Users Only)</small>
              <hr />
              <div className="row">
                <div className="col-12">
                  <form onSubmit={handleSubmit(addOrUpdatePreference)}>
                    <div className="row">
                      <Controller
                        name="screen_code"
                        control={control}
                        rules={{ required: "Please select Screen" }}
                        render={({ onChange, value }) => (
                          <AlgaehAutoComplete
                            div={{ className: "col-12 form-group  mandatory" }}
                            label={{
                              forceLabel: "Screen Preference",
                              isImp: true,
                            }}
                            error={errors}
                            selector={{
                              name: "screen_code",
                              className: "select-fld",
                              value,
                              onChange: (_, selected) => {
                                onChange(selected);
                              },
                              onClear: () => onChange(""),
                              dataSource: {
                                data: screens,
                                valueField: "screen_code",
                                textField: "screen_name",
                              },
                              others: {
                                // disabled: disabled || !!appointment_id,
                              },
                            }}
                          />
                        )}
                      />
                      <Controller
                        name="visit_type"
                        control={control}
                        rules={{ required: "Please select Visit Type" }}
                        render={({ onChange, value }) => (
                          <AlgaehAutoComplete
                            div={{ className: "col-12  form-group mandatory" }}
                            label={{
                              fieldName: "visit_type",
                              isImp: true,
                            }}
                            error={errors}
                            selector={{
                              name: "visit_type",
                              className: "select-fld",
                              value,
                              onChange: (_, selected) => {
                                onChange(selected);
                              },
                              onClear: () => onChange(""),
                              dataSource: {
                                textField: "visit_type_desc",
                                valueField: "hims_d_visit_type_id",
                                data: data?.visitTypes,
                              },
                              others: {
                                // disabled: disabled || !!appointment_id,
                              },
                            }}
                          />
                        )}
                      />{" "}
                      <Controller
                        control={control}
                        name="doctor"
                        rules={{ required: "Please Select a doctor" }}
                        render={({ onChange, value }) => (
                          <AlgaehTreeSearch
                            div={{ className: "col-12 mandatory" }}
                            label={{
                              fieldName: "doctor_id",
                              isImp: true,
                              align: "ltr",
                            }}
                            error={errors}
                            tree={{
                              disableHeader: true,
                              treeDefaultExpandAll: true,
                              onChange: (selected) => {
                                onChange(selected);
                              },
                              // disabled: !!appointment_id || disabled,
                              value,
                              name: "doctor",
                              data: data?.doctors,
                              textField: "label",
                              valueField: (node) => {
                                if (node?.sub_department_id) {
                                  return `${node?.sub_department_id}-${node?.services_id}-${node?.value}-${node?.department_type}-${node?.department_id}-${node?.service_type_id}`;
                                } else {
                                  return node?.value;
                                }
                              },
                            }}
                          />
                        )}
                      />
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <button
                        type="submit"
                        style={{ marginTop: 10 }}
                        className="btn btn-primary"
                      >
                        UPDATE
                      </button>
                    </div>
                  </form>
                </div>
                <div className="col-12" style={{ display: "none" }}>
                  <div className="row">
                    <div className="col-12 switchDiv">
                      <label>Remeber search dropdown</label>
                      <Switch
                        className="ant-switch-block"
                        name="searchBarDropDown"
                        checkedChildren={<i className="fa fa-check"></i>}
                        unCheckedChildren={<i className="fa fa-times"></i>}
                        checked={searchBarDropDown}
                        onChange={onChnageSwitch}
                      ></Switch>
                    </div>
                    <div className="col-12 switchDiv">
                      <label>Notification Sound</label>{" "}
                      <Switch
                        className="ant-switch-block"
                        name="notificationSound"
                        checkedChildren={<i className="fa fa-check"></i>}
                        unCheckedChildren={<i className="fa fa-times"></i>}
                        checked={notificationSound}
                        onChange={onChnageSwitch}
                      ></Switch>
                    </div>
                    <AlgaehAutoComplete
                      div={{ className: "col-12" }}
                      label={{ forceLabel: "Default Landing Page" }}
                      selector={{
                        dataSource: {
                          data: screens,
                          valueField: "algaeh_app_screens_id",
                          textField: "screen_name",
                        },
                      }}
                    />
                    <AlgaehFormGroup
                      div={{ className: "col-12" }}
                      label={{
                        forceLabel: "Screen TimeOut	",
                        isImp: false,
                      }}
                      textBox={{
                        type: "number",
                        value: "",
                        className: "form-control",
                        placeholder: "0",
                        autoComplete: false,
                      }}
                    />

                    <AlgaehAutoComplete
                      div={{ className: "col-12" }}
                      label={{ forceLabel: "Default language" }}
                      selector={{
                        dataSource: {
                          data: language,
                          valueField: "lang_short",
                          textField: "lang",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        <UserDownloads />
      </div>
    </>
  );
});
