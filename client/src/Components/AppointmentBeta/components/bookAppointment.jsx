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
  const { userLanguage, titles, countries, socket } = useContext(MainContext);
  const {
    appointmentDate,
    setDoctorSchedules,
    app_status,
    sub_department_id,
    provider_id,
    patientRecallData,
    setPatientRecallData,
  } = useContext(AppointmentContext);
  const [no_of_slots, setNoOfSlots] = useState(1);
  const [patient_code, setPatientCode] = useState(undefined);
  const [title_id, setTitleId] = useState(undefined);
  const [patient_id, setPatientID] = useState(undefined);
  const [patient_name, setPatientName] = useState("");
  const [arabic_name, setArabicName] = useState("");
  const [date_of_birth, setDateOfBirth] = useState(undefined);
  const [age, setAge] = useState(undefined);
  const [gender, setGender] = useState(undefined);
  const [appointment_status_id, setAppointmentStatusId] = useState(undefined);
  const [tel_code, setTeleCode] = useState(undefined);
  const [contact_number, setContactNumber] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const [appointment_remarks, setAppointmentRemarks] = useState(undefined);
  const [edited_appStatus, setEdited_appStatus] = useState([]);
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
  useEffect(() => {
    if (patientRecallData) {
      debugger;
      const yrsAge = moment().diff(
        moment(patientRecallData.date_of_birth, "YYYY-MM-DD"),
        "years"
      );
      setPatientCode(patientRecallData.patient_code);
      setTitleId(patientRecallData.title_id);
      setPatientID(patientRecallData.patient_id);
      setPatientName(patientRecallData.pat_name);
      setDateOfBirth(patientRecallData.date_of_birth);
      setAge(yrsAge);
      setGender(patientRecallData.gender);
      setTeleCode(patientRecallData.tel_code);
      setEmail(patientRecallData.email);
      setArabicName(patientRecallData.arabic_name);
      setContactNumber(patientRecallData.contact_number);
    }
  }, [patientRecallData]);
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
    setTeleCode(undefined);
    setContactNumber(undefined);
    setEmail(undefined);
    setAppointmentRemarks(undefined);
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

        const yrsAge = moment().diff(
          moment(row.date_of_birth, "YYYY-MM-DD"),
          "years"
        );
        setPatientCode(row.patient_code);
        setTitleId(row.title_id);
        setPatientID(row.hims_d_patient_id);
        setPatientName(row.full_name);
        setDateOfBirth(row.date_of_birth);
        setAge(yrsAge);
        setGender(row.gender);
        setTeleCode(row.tel_code);
        setEmail(row.email);
        setArabicName(row.arabic_name);
        setContactNumber(row.contact_number);
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
        const send_data = {
          patient_id,
          patient_code,
          provider_id: props.provider_id,
          sub_department_id,
          appointment_date: appointmentDate,
          appointment_from_time: moment(from_time, "hh:mm a").format(
            "HH:mm:ss"
          ),
          appointment_to_time,
          appointment_status_id,
          patient_name,
          arabic_name,
          date_of_birth: dob,
          age,
          contact_number,
          tel_code,
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
          setPatientRecallData(undefined);
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
            {!!countries?.length && (
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
                  <AlagehFormGroup
                    // div={{
                    //   className: "col-6 form-group mandatory",
                    // }}
                    // label={{
                    //   fieldName: "contact_number",
                    //   isImp: true,
                    // }}
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
                  {/* <Controller
                            control={control}
                            name="contact_number"
                            rules={{
                              required: "Please Enter Contact Number",
                              minLength: {
                                message: "Please Enter Valid Number",
                                value: 6,
                              },
                            }}
                            render={(props) => (
                              <>
                                <Input {...props} disabled={disabled} />
                              </>
                            )}
                          /> */}
                </Input.Group>
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
