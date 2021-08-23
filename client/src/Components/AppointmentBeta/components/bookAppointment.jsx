import React, { memo, useContext, useState, useEffect } from "react";
import {
  AlgaehModal,
  AlgaehLabel,
  MainContext,
  Input,
  Select,
  //   AlgaehSearch,
} from "algaeh-react-components";
import "../appointment.scss";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import { useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import AlgaehSearch from "../../Wrapper/globalSearch";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import { swalMessage } from "../../../utils/algaehApiCall";
import { newAlgaehApi } from "../../../hooks";
import GlobalVariables from "../../../utils/GlobalVariables";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import moment from "moment";
import { AppointmentContext } from "../AppointmentContext";
import { getDoctorSchedule } from "./events";
export default memo(function BookAppointment(props) {
  const location = useLocation();
  // const history = useHistory();
  // const pathName = history.location.pathname;
  const { userLanguage, titles, countries, socket } = useContext(MainContext);
  const {
    appointmentDate,
    setDoctorSchedules,
    app_status,
    sub_department_id,
    provider_id,
    userToken,
    // dataFromRecall,
    // setDataFromRecall,
  } = useContext(AppointmentContext);
  const [maxLength, setMaxLength] = useState(null);
  const [no_of_slots, setNoOfSlots] = useState(1);
  const [patient_code, setPatientCode] = useState(undefined);
  const [title_id, setTitleId] = useState(undefined);
  const [patient_id, setPatientID] = useState(undefined);
  const [patient_name, setPatientName] = useState("");
  const [arabic_name, setArabicName] = useState("");
  const [date_of_birth, setDateOfBirth] = useState(undefined);
  const [age, setAge] = useState(undefined);
  const [gender, setGender] = useState(undefined);
  const [pat_recall_id, setPat_recall_id] = useState(null);
  const [appointment_status_id, setAppointmentStatusId] = useState(undefined);
  // const [tel_code, setTeleCode] = useState(undefined);
  // const [contact_number, setContactNumber] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [appointment_remarks, setAppointmentRemarks] = useState(undefined);
  const [edited_appStatus, setEdited_appStatus] = useState([]);
  // let [, setState] = useState();
  useEffect(() => {
    const defaultAppStatus = app_status.find(
      (f) => f.default_status === "Y"
    )?.hims_d_appointment_status_id;
    setAppointmentStatusId(defaultAppStatus);
    setNoOfSlots(props.noOfSlots);
    setEdited_appStatus(
      app_status.filter(
        (f) =>
          f.default_status !== "CAN" &&
          f.default_status !== "RS" &&
          f.default_status !== "NS"
      )
    );
  }, []);
  const [currentCountry] = countries?.filter(
    (item) => item.hims_d_country_id === userToken?.default_country
  );
  const {
    control,
    setValue,
    clearErrors,
    setError,
    getValues,
    formState: { errors },
  } = useForm({
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      tel_code: currentCountry?.tel_code,
    },
  });

  useEffect(() => {
    let dataFromRecall = location.state?.data;

    if (dataFromRecall) {
      const yrsAge = moment().diff(
        moment(dataFromRecall.date_of_birth, "YYYY-MM-DD"),
        "years"
      );

      setPatientCode(dataFromRecall.patient_code);
      setTitleId(dataFromRecall.title_id);
      setPatientID(dataFromRecall.patient_id);
      setPatientName(dataFromRecall.pat_name);
      setDateOfBirth(dataFromRecall.date_of_birth);
      setAge(yrsAge);
      setGender(dataFromRecall.gender);
      // setTeleCode(dataFromRecall.tel_code);
      setPat_recall_id(dataFromRecall.pat_recall_id);
      // setValue("tel_code", dataFromRecall.tel_code);
      // setValue("contact_number", dataFromRecall.contact_number);
      setEmail(dataFromRecall.email);
      setArabicName(dataFromRecall.arabic_name);
      // setContactNumber(dataFromRecall.contact_number);
      // setTimeout(function () {
      //   // setState({});
      //   setValue("tel_code", dataFromRecall.tel_code);
      //   setValue("contact_number", dataFromRecall.contact_number);
      // });
      // location.state = null;

      // history.push(
      //   pathName +
      //     `?appointmentDate=${moment(dataFromRecall.followup_date).format(
      //       "YYYY-MM-DD"
      //     )}&sub_department_id=${
      //       dataFromRecall.sub_department_id
      //     }&provider_id=${dataFromRecall.doctor_id}`
      // );
    }
  }, [location?.state?.data]);
  useEffect(() => {
    const telCode = getValues().tel_code;
    if (telCode) {
      const maxlength = countries.filter((f) => f.tel_code === telCode)[0]
        .max_phone_digits;
      setMaxLength(maxlength);
    }
  }, [getValues().tel_code]);
  useEffect(() => {
    let dataFromRecall = location.state?.data;
    if (dataFromRecall) {
      setTimeout(function () {
        // setState({});
        const maxlength = countries.filter(
          (f) => f.tel_code === dataFromRecall.tel_code
        )[0].max_phone_digits;
        setMaxLength(maxlength);
        setValue("tel_code", dataFromRecall.tel_code);
        setValue("contact_number", dataFromRecall.contact_number);
      });
    }
  }, [props.showEditPopup]);
  function clearAllState() {
    setNoOfSlots(1);
    setPatientCode(undefined);
    setTitleId(undefined);
    setPatientID(undefined);
    setPatientName("");
    setArabicName("");
    setDateOfBirth(undefined);
    setAge(undefined);
    setGender(undefined);
    setAppointmentStatusId(undefined);
    setPat_recall_id(null);
    // setTeleCode(undefined);
    // setContactNumber(undefined);
    setValue("tel_code", undefined);
    setValue("contact_number", undefined);
    setEmail(undefined);
    setAppointmentRemarks(undefined);
    clearErrors(["tel_code", "contact_number"]);
  }
  function patientSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.frontDesk.patients,
      },
      searchName: "patients",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        // console.log("Selected Row:", row);
        setPat_recall_id(null);
        const yrsAge = moment().diff(
          moment(row.date_of_birth, "YYYY-MM-DD"),
          "years"
        );
        debugger;
        setPatientCode(row.patient_code);
        setTitleId(row.title_id);
        setPatientID(row.hims_d_patient_id);
        setPatientName(row.full_name);
        setDateOfBirth(row.date_of_birth);
        setAge(yrsAge);
        setGender(row.gender);
        // setTeleCode(row.tel_code);
        setEmail(row.email);
        setArabicName(row.arabic_name);
        const maxlength = countries.filter((f) => f.tel_code === row.tel_code)[0]
        .max_phone_digits;
        debugger;
      setMaxLength(maxlength?maxlength:10);
        // setContactNumber(row.contact_number);
        setValue("tel_code", row.tel_code);
        setValue("contact_number", row.contact_number);
      },
    });
  }

  function onClickOk() {
    AlgaehValidation({
      querySelector: "data-validate='addApptDiv'",
      alertTypeIcon: "warning",
      onSuccess: async () => {
        const from_time = props.time;
        const duration_minutes = no_of_slots * props.slot;
        const appointment_to_time = moment(from_time, "hh:mm a")
          .add("minutes", duration_minutes)
          .format("HH:mm:ss");
        const dob = moment(date_of_birth).format("YYYY-MM-DD");
        const values = getValues();
        if (!values.tel_code) {
          setError("tel_code", {
            type: "manual",
            shouldFocus: true,
            message: `This field is mandatory`,
          });
          return;
        }
        if (
          !values.contact_number ||
          values.contact_number?.length !== maxLength
        ) {
          setError("contact_number", {
            type: "maxLength",
            shouldFocus: true,
            message: `This should be ${maxLength} length`,
          });
          return;
        }

        const send_data = {
          patient_id,
          patient_code,
          provider_id: props.provider_id,
          sub_department_id,
          appointment_date: appointmentDate,
          appointment_from_time: moment(from_time, "hh:mm a").format(
            "HH:mm:ss"
          ),
          pat_recall_id,
          appointment_to_time,
          appointment_status_id,
          patient_name,
          arabic_name,
          date_of_birth: dob,
          age,
          contact_number: getValues().contact_number,
          tel_code: getValues().tel_code,
          email,
          send_to_provider: "N",
          gender,
          appointment_remarks,
          number_of_slot: no_of_slots,
          confirmed: "N",
          cancelled: "N",
          is_stand_by: props.isStandBy,
          title_id,
        };
        const result = await newAlgaehApi({
          uri: "/appointment/addPatientAppointment",
          module: "frontDesk",
          method: "POST",
          data: send_data,
        }).catch((error) => {
          swalMessage({
            title: error.message,
            type: "error",
          });
        });

        if (result.data.success) {
          if (socket.connected) {
            socket.emit("appointment_created", send_data);
          }
          clearAllState();

          const data = await getDoctorSchedule("", {
            sub_dept_id: sub_department_id,
            provider_id,
            schedule_date: appointmentDate,
          });
          props.setShowEditPopup(false);
          setDoctorSchedules(data);

          swalMessage({
            title: "Successfully created",
            type: "success",
          });
        }
      },
    });
  }
  function dateOfBirthChange(e) {
    const yrsAge = moment().diff(moment(e, "YYYY-MM-DD"), "years");
    setAge(yrsAge);
    setDateOfBirth(e);
  }
  function ageChangeHandler(e) {
    let month = "01";
    let day = "01";
    const year = moment().format("YYYY");
    if (moment(date_of_birth).isValid()) {
      month = moment(date_of_birth).format("MM");
      day = moment(date_of_birth).format("DD");
    }
    const dob = moment(`${year}-${month}-${day}`).add(
      "years",
      -parseInt(e.target.value)
    );
    setAge(e.target.value);
    setDateOfBirth(dob);
  }
  return (
    <AlgaehModal
      title={<AlgaehLabel label={{ fieldName: "bookAppo" }} />}
      visible={props.showEditPopup}
      destroyOnClose={true}
      onOk={onClickOk}
      onCancel={() => {
        clearAllState();
        props.setShowEditPopup(false);
      }}
      okText={<AlgaehLabel label={{ fieldName: "btn_save" }} />}
      cancelText={<AlgaehLabel label={{ fieldName: "btn_close" }} />}
      className={`row algaehNewModal newAppoModal`}
    >
      <div className="popupInner" data-validate="addApptDiv">
        <div className="col-12 popRightDiv">
          <div className="row">
            <div className="col-2 form-group">
              <AlgaehLabel
                label={{
                  fieldName: "appoDate",
                }}
              />
              <h6>
                {userLanguage === "ar"
                  ? new Date(appointmentDate).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : moment(appointmentDate).format("DD-MM-YYYY")}
              </h6>
            </div>

            <div className="col-2 form-group">
              <AlgaehLabel
                label={{
                  fieldName: "appoTime",
                }}
              />
              <h6>
                {userLanguage === "ar"
                  ? new Date(moment(props.time, "HH:mm a")._d)
                      .toLocaleDateString("ar-EG", {
                        hour12: true,
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .split(",")[1]
                  : props.time}
              </h6>
            </div>

            <AlagehAutoComplete
              div={{
                className: "col-2  form-group mandatory",
              }}
              label={{
                fieldName: "selectSlot",
                isImp: true,
              }}
              selector={{
                name: "no_of_slots",
                className: "select-fld",
                value: no_of_slots,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.NO_OF_SLOTS,
                },
                onChange: (selected) => {
                  setNoOfSlots(selected.value);
                },
              }}
            />

            <div className="col globalSearchCntr">
              <AlgaehLabel label={{ fieldName: "patient_search" }} />
              <h6 onClick={() => patientSearch()}>
                {patient_code ? patient_code : "Search Patient"}
                <i className="fas fa-search fa-lg"></i>
              </h6>
            </div>
          </div>
          <hr></hr>
          <div className="row">
            <AlagehAutoComplete
              div={{
                className: "col-2  form-group mandatory",
              }}
              label={{
                fieldName: "title_id",
                isImp: true,
              }}
              selector={{
                name: "title_id",
                className: "select-fld",
                value: title_id,
                dataSource: {
                  textField: userLanguage === "ar" ? "arabic_title" : "title",
                  valueField: "his_d_title_id",
                  data: titles,
                },
                others: {
                  //   disabled: props.state.fromSearch || false,
                },
                onChange: (selected) => {
                  setTitleId(selected.value);
                },
                onClear: () => {
                  setTitleId(undefined);
                },
              }}
            />

            <AlagehFormGroup
              div={{
                className: "col-5  form-group mandatory",
              }}
              label={{
                fieldName: "full_name",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "patient_name",
                value: patient_name,
                others: {
                  //   disabled: props.state.fromSearch || false,
                },
                events: {
                  onChange: (e) => setPatientName(e.target.value),
                },
              }}
            />
            <AlagehFormGroup
              div={{
                className: "col-5  form-group mandatory arabic-txt-fld",
              }}
              label={{
                fieldName: "arabic_name",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "arabic_name",
                value: arabic_name,
                others: {
                  //   disabled: props.state.fromSearch || false,
                },
                events: {
                  onChange: (e) => setArabicName(e.target.value),
                },
              }}
            />
          </div>

          <div className="row">
            <AlgaehDateHandler
              div={{
                className: "col-3   form-group mandatory",
              }}
              label={{
                fieldName: "date_of_birth",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "date_of_birth",
                others: {
                  //   disabled: props.state.fromSearch || false,
                },
              }}
              maxDate={new Date()}
              events={{
                onChange: dateOfBirthChange,
                // onBlur: props.validateAge,
              }}
              value={date_of_birth}
            />

            <AlagehFormGroup
              div={{
                className: "col-2  form-group mandatory",
              }}
              label={{
                fieldName: "age",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "age",
                number: {
                  allowNegative: false,
                },
                others: {
                  type: "number",
                  //   onBlur: props.validateAge,
                  //   disabled: props.state.fromSearch || false,
                },
                value: age,
                events: {
                  onChange: ageChangeHandler,
                },
              }}
            />

            <AlagehAutoComplete
              div={{
                className: "col-2  form-group mandatory",
              }}
              label={{
                fieldName: "gender",
                isImp: true,
              }}
              selector={{
                name: "gender",
                className: "select-fld",
                value: gender,
                dataSource: {
                  textField: userLanguage === "ar" ? "arabic_name" : "name",
                  valueField: "value",
                  data: GlobalVariables.FORMAT_GENDER,
                },
                others: {
                  //   disabled: props.state.fromSearch || false,
                },
                onChange: (e) => setGender(e.value),
              }}
            />

            <AlagehAutoComplete
              div={{
                className: "col form-group mandatory AutoCompleteRight",
              }}
              label={{
                fieldName: "selectStatus",
                isImp: true,
              }}
              selector={{
                name: "appointment_status_id",
                className: "select-fld",
                value: appointment_status_id,
                dataSource: {
                  textField:
                    userLanguage === "en" ? "statusDesc" : "description_ar",
                  valueField: "hims_d_appointment_status_id",
                  // data: props.state.appointmentStatus,
                  data: edited_appStatus,
                },
                onChange: (e) => setAppointmentStatusId(e.value),
              }}
            />
          </div>

          <div className="row">
            {/* {!!countries?.length && (
              <div className="col-lg-4 algaehInputGroup">
                <AlgaehLabel
                  label={{
                    fieldName: "contact_number",
                    isImp: true,
                  }}
                />
                <Input.Group compact>
                  <>
                    <Select
                      value={tel_code}
                      onChange={(e) => setTeleCode(e.value)}
                      virtual={true}
                      // disabled={disabled}
                      // disabled={props.state.fromSearch || false}
                      showSearch
                      filterOption={(input, option) => {
                        return (
                          option.value
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      options={countries
                        ?.map((item) => item.tel_code)
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .map((item) => ({
                          label: item,
                          value: item,
                        }))}
                    >
                   
                    </Select>
                  </>
                  <AlagehFormGroup
                   
                    textBox={{
                      className: "txt-fld",
                      name: "contact_number",
                      others: {
                        type: "number",
                        // disabled: props.state.fromSearch || false,
                      },
                      value: contact_number,
                      events: {
                        onChange: (e) => setContactNumber(e.target.value),
                      },
                    }}
                  />
                
                </Input.Group>
              </div>
            )} */}
            {!!countries?.length && (
              <div className="col-lg-4 algaehInputGroup mandatory">
                <AlgaehLabel
                  label={{
                    fieldName: "contact_number",
                    isImp: true,
                  }}
                />
                {/* <label className="style_Label">
                              Contact Number<span className="imp">&nbsp;*</span>
                            </label> */}
                <Input.Group compact>
                  <Controller
                    control={control}
                    name="tel_code"
                    rules={{
                      required: "Select Tel Code",
                    }}
                    render={({ value, onChange }) => (
                      <>
                        <Select
                          value={value}
                          onChange={(_, selected) => {
                            onChange(_, selected);
                            setMaxLength(
                              selected.max_phone_digits
                                ? selected.max_phone_digits
                                : null
                            );
                          }}
                          virtual={true}
                          // disabled={disabled}
                          showSearch
                          filterOption={(input, option) => {
                            return (
                              option.value
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            );
                          }}
                          options={countries
                            ?.map((item) => ({
                              tel_code: item.tel_code,
                              max_phone_digits: item.max_phone_digits,
                            }))
                            .filter((v, i, a) => a.indexOf(v) === i)
                            .map((item) => {
                              return {
                                label: item.tel_code,
                                value: item.tel_code,

                                max_phone_digits: item.max_phone_digits,
                              };
                            })}
                        >
                          {/* {countries?.map((item) => (
                                      <Option
                                        value={item.tel_code}
                                        key={item.tel_code}
                                      >
                                        {item.tel_code}
                                      </Option>
                                    ))} */}
                        </Select>
                      </>
                    )}
                  />
                  <span className="errorMsg">{errors.tel_code?.message}</span>
                  <Controller
                    control={control}
                    name="contact_number"
                    rules={{
                      required: "Please Enter Contact Number",
                      maxLength: {
                        message: "Please Enter Valid Number",
                        value: maxLength,
                      },
                    }}
                    render={(props) => (
                      <>
                        <Input
                          {...props}
                          // disabled={disabled}
                          onChange={(e) => {
                            const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      if (value.length === maxLength) {
        clearErrors();
        props.onChange(value);
      } else {
        props.onChange(value);
      }
    }
                            
                          }}
                          maxLength={maxLength}
                          placeholder={maxLength ? `${maxLength} digits` : ""}
                        />
                      </>
                    )}
                  />
                </Input.Group>
                <span className="errorMsg">
                  {errors.contact_number?.message}
                </span>
              </div>
            )}

            <AlagehFormGroup
              div={{
                className: "col-6 form-group",
              }}
              label={{
                fieldName: "email",
                isImp: false,
              }}
              textBox={{
                className: "txt-fld",
                name: "email",
                value: email,
                others: {
                  //   disabled: props.state.fromSearch || false,
                },
                events: {
                  onChange: (e) => setEmail(e.target.value),
                },
              }}
            />
          </div>

          <div className="row">
            <AlagehFormGroup
              div={{
                className: "col-12 form-group margin-bottom-15",
              }}
              label={{
                fieldName: "remarks",
                isImp: false,
              }}
              textBox={{
                className: "txt-fld",
                name: "appointment_remarks",
                value: appointment_remarks,
                others: {
                  //   disabled: props.state.fromSearch || false,
                },
                events: {
                  onChange: (e) => setAppointmentRemarks(e.target.value),
                },
              }}
            />
          </div>
        </div>
      </div>
    </AlgaehModal>
  );
});
