import React, { useState, useEffect } from "react";
import "./DentalLab.scss";
import {
  // AlgaehLabel,
  AlgaehFormGroup,
  // AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDateHandler,
  AlgaehMessagePop,
  // DatePicker,
  AlgaehModal,
  AlgaehHijriDatePicker,
  // AlgaehTreeSearch,
  AlgaehSecurityComponent,

  //   AlgaehButton,
} from "algaeh-react-components";

// import { useQuery } from "react-query";
// import ButtonType from "../../Wrapper/algaehButton";
import { newAlgaehApi } from "../../../hooks/";
import GenericData from "../../../utils/GlobalVariables.json";
import moment from "moment";
// import swal from "sweetalert2";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useLangFieldName } from "../../PatientRegistrationNew/patientHooks";
// import AlgaehSearch from "../../Wrapper/globalSearch";
// import spotlightSearch from "../../../Search/spotlightSearch";
// import DentalImage from "../../../assets/images/dcaf_Dental_chart.png";
// import { swalMessage } from "../../../utils/algaehApiCall";
// const { confirm } = Modal;

export function AddPatientDentalForm({
  //   control,
  //   setValue,
  //   errors,
  povendors,
  procedureList,
  subDepartment,
  current,
  openDentalModal,
  // userLanguage,
  // titles,
  onClose,
  visible,
  disabled,
  getRequest,
  doctors,
}) {
  //   const { userLanguage, titles = [] } = useContext(MainContext);
  const { FORMAT_GENDER, REQUEST_STATUS, WORK_STATUS } = GenericData;
  //   const [openDentalModal, setOpenDentalModal] = useState(false);
  // const [loading_request_list, setLoadingRequestList] = useState(false);
  //   const [request_list, setRequestList] = useState([]);

  const [checked, setChecked] = useState(false);

  // const [sub_department_id, setSub_department_id] = useState("");
  // const [doctor_id, setDoctor_id] = useState("");

  //   const [subDepartment, setSubDepartment] = useState([]);

  // const [doctors, setDoctors] = useState([]);
  const { control, errors, setValue, handleSubmit, reset, watch } = useForm({
    shouldFocusError: true,
    defaultValues: {
      requesting_date: new Date(),
      //   from_due_date: new Date(),
      //   to_due_date: new Date(),
    },
  });
  const { request_status, work_status } = watch([
    "request_status",
    "work_status",
  ]);

  useEffect(() => {
    if (visible && current.length !== 0) {
      reset({
        full_name: current.full_name,
        patient_code: current.patient_code,
        gender: current.gender,
        date_of_birth: current.date_of_birth,
        requesting_date: current.requested_date,
        select_procedure: current.procedure_id,
        select_vendor: current.hims_d_vendor_id,
        request_status: current.request_status,
        work_status: current.work_status,
        provider_id: current.provider_id,
        due_date: current.due_date,
        service_amount: current.procedure_amt,
        doctor: current.provider_id,
        arrival_date:
          current.arrival_date === null ? undefined : current.arrival_date,
      });

      // .map((item) => item.doctors);

      // setSub_department_id(current.department_id);
      // setDoctor_id(current.provider_id);
      // setDoctors(doctors);
    } else {
      reset({
        full_name: "",
        patient_code: "",
        gender: "",
        date_of_birth: undefined,
        requesting_date: new Date(),
        select_procedure: "",
        select_vendor: "",
        request_status: "PEN",
        work_status: "PEN",
        provider_id: "",
        due_date: undefined,
        service_amount: "",
        doctor: "",
        arrival_date: undefined,
      });
      // setSub_department_id("");
      // setDoctor_id("");
      setChecked(false);
    }
    //eslint-disable-next-line
  }, [current, visible]);
  const { date_of_birth } = useWatch({
    control,
    name: ["date_of_birth"],
  });
  const { fieldNameFn } = useLangFieldName();

  const addDentalForm = async (data) => {
    const requestDate = moment(data.requesting_date).format("YYYY-MM-DD");
    const due_date = moment(new Date()).format("YYYY-MM-DD");
    const years = moment().diff(data.date_of_birth, "year");
    const date_of_birth = moment(data.date_of_birth).format("YYYY-MM-DD");

    try {
      const res = await newAlgaehApi({
        uri: "/dentalForm/addDentalForm",
        method: "POST",
        data: {
          // patient_id: patientId,
          // department_id: sub_department_id,
          provider_id: data.doctor,
          full_name: data.full_name,
          patient_code: data.patient_code,
          gender: data.gender,
          age: years,
          hims_d_services_id: data.select_procedure,
          standard_fee: data.service_amount,
          hims_d_vendor_id: data.select_vendor,
          request_status: "PEN",
          requested_date: requestDate,
          due_date: due_date,
          date_of_birth: date_of_birth,
        },
      });
      if (res.data.success) {
        // clearState();
        getRequest();
        AlgaehMessagePop({
          type: "success",
          display: "Dental Form Added Successfully",
        });
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };
  const updateDentalForm = async (data) => {
    debugger;
    const arrival_date =
      data.arrival_date === undefined
        ? undefined
        : moment(data.arrival_date).format("YYYY-MM-DD");
    // const due_date = moment(new Date()).format("YYYY-MM-DD");
    const years = moment().diff(data.date_of_birth, "year");
    // const date_of_birth = moment(data.date_of_birth).format("YYYY-MM-DD");
    try {
      const res = await newAlgaehApi({
        uri: "/dentalForm/updateDentalForm",
        method: "PUT",

        data: {
          // department_id: sub_department_id,
          provider_id: data.doctor,
          full_name: data.full_name,
          patient_code: data.patient_code,
          gender: data.gender,
          age: years,
          hims_d_services_id: data.select_procedure,
          standard_fee: data.service_amount,
          hims_d_vendor_id: data.select_vendor,
          request_status: data.request_status,
          work_status: data.work_status,
          requested_date: data.requesting_date,
          due_date: data.due_date,
          date_of_birth: data.date_of_birth,
          hims_f_dental_form_id: current.hims_f_dental_form_id,
          arrival_date: arrival_date,
          send_mail: checked,
          doctor_email: current.work_email,
        },
      });
      if (res.data.success) {
        // clearState

        getRequest();

        AlgaehMessagePop({
          type: "success",
          display: "Dental Form Updated Successfully",
        });
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };

  // const clearState = () => {
  //   reset({
  //     full_name: "",
  //     patient_code: "",
  //     gender: "",
  //     date_of_birth: undefined,
  //     requesting_date: new Date(),
  //     select_procedure: "",
  //     select_vendor: "",
  //     request_status: "PEN",
  //     work_status: "PEN",
  //     provider_id: "",
  //     due_date: undefined,
  //   });
  //   setSub_department_id("");
  //   setDoctor_id("");
  //   onClose
  // };
  // const onChangeDoctor = (e) => {
  //   setDoctor_id(e.employee_id);
  // };
  // const onChangeAutoComplete = (e) => {
  //   setSub_department_id(e.sub_department_id);
  //   setDoctors(e.doctors);
  // };
  //   const onCancel = () => {
  //     openDentalModal = false;
  //   };

  const onSubmit = (e) => {
    console.error(errors);
    onClose();

    if (current.length !== 0) {
      updateDentalForm(e);
    } else {
      addDentalForm(e);
    }
  };

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

  return (
    <AlgaehModal
      visible={visible}
      title="Request Dental Service"
      closable={true}
      onCancel={onClose}
      className={`row algaehNewModal dentalLabRequest`}
      footer={[
        <div className="col-12">
          <button
            onClick={handleSubmit(onSubmit)}
            className="btn btn-primary btn-sm"
          >
            {current.length !== 0 ? "Update" : "Add to List"}
          </button>
          <button onClick={onClose} className="btn btn-default btn-sm">
            Cancel
          </button>
        </div>,
      ]}
    >
      <div
        className="col-12 popupInner margin-top-15"
        data-validate="addDentalPlanDiv"
      >
        <div className="row">
          <div className="col-12 popRightDiv">
            <div className="row">
              {/* <AlgaehAutoComplete
                div={{ className: "col-lg-2 mandatory form-group" }}
                label={{
                  fieldName: "Department",
                  isImp: true,
                }}
                selector={{
                  name: "sub_department",

                  dataSource: {
                    textField: "sub_department_name",
                    valueField: "sub_department_id",
                    data: subDepartment.departmets,
                  },
                  value: sub_department_id,
                  onChange: onChangeAutoComplete,

                  onClear: () => {
                    setDoctors([]);
                    setDoctor_id("");
                    setSub_department_id("");
                  },
                  others: {
                    disabled,
                    tabIndex: "4",
                  },
                }}
              /> */}
              {/* <Controller
                control={control}
                name="doctor"
                rules={{ required: "Please Select a doctor" }}
                render={({ onChange, value }) => (
                  <AlgaehTreeSearch
                    div={{ className: "col mandatory" }}
                    label={{
                      forceLabel: "Requesting By",
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
                      disabled: disabled || current.request_status === "APR",
                      value,
                      name: "doctor",
                      data: doctors,
                      textField: fieldNameFn("label", "arlabel"),
                      valueField: (node) => {
                        return node.value;
                      },
                    }}
                  />
                )}
              />{" "} */}
              <Controller
                name="doctor"
                control={control}
                rules={{ required: "Please Select a doctor" }}
                render={({ value, onBlur, onChange }) => (
                  <AlgaehAutoComplete
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      forceLabel: "Requesting By",
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
                      name: "doctor",
                      dataSource: {
                        data: doctors,
                        textField: "full_name",
                        valueField: "hims_d_employee_id",
                      },
                      others: {
                        disabled: disabled || current.request_status === "APR",
                        tabIndex: "23",
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="select_vendor"
                control={control}
                rules={{ required: "Select Vendor" }}
                render={({ value, onBlur, onChange }) => (
                  <AlgaehAutoComplete
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      forceLabel: "Requesting to Vendor",
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
                      name: "select_vendor",
                      dataSource: {
                        data: povendors,
                        textField: "vendor_name",
                        valueField: "hims_d_vendor_id",
                      },
                      others: {
                        disabled: disabled || current.request_status === "APR",
                        tabIndex: "23",
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="select_procedure"
                control={control}
                rules={{ required: "Select Procedure" }}
                render={({ value, onChange }) => (
                  <AlgaehAutoComplete
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      forceLabel: "For the Procedure",
                      isImp: true,
                    }}
                    error={errors}
                    selector={{
                      name: "select_procedure",
                      value,
                      onChange: (_, selected) => {
                        onChange(selected);

                        setValue("service_amount", _.standard_fee);
                      },

                      dataSource: {
                        data: procedureList,
                        valueField: "hims_d_services_id",
                        textField: "service_name",
                      },
                      others: {
                        disabled: disabled || current.request_status === "APR",
                        tabIndex: "4",
                      },
                    }}
                  />
                )}
              />{" "}
              <Controller
                name="service_amount"
                control={control}
                rules={{ required: "Add Service Amount" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col-2 mandatory form-group" }}
                    error={errors}
                    label={{
                      forceLabel: "Service Amount",
                      isImp: true,
                    }}
                    textBox={{
                      ...props,
                      type: "number",
                      className: "form-control",
                      disabled: disabled || current.request_status === "APR",
                      placeholder: "0.00",
                      name: "service_amount",
                      others: {
                        tabIndex: "5",
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="requesting_date"
                control={control}
                render={({ value, onChange }) => (
                  <AlgaehDateHandler
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      forceLabel: "Requesting Date",
                      isImp: true,
                    }}
                    textBox={{
                      className: "form-control",
                      value,
                    }}
                    others={{
                      disabled: disabled || current.request_status === "APR",
                      tabIndex: "6",
                    }}
                    minDate={new Date()}
                    events={{
                      onChange: (reqDate) => {
                        setValue("requesting_date", moment(reqDate));
                      },
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="due_date"
                // rules={{ required: "Please Select DOB" }}
                render={({ onChange, value }) => (
                  <AlgaehDateHandler
                    div={{
                      className: "col-lg-3 form-group",
                      tabIndex: "7",
                    }}
                    // error={errors}
                    label={{
                      forceLabel: "Due Date",
                      isImp: false,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "due_date",
                      value,
                    }}
                    others={{
                      disabled: disabled || current.request_status === "APR",
                    }}
                    minDate={new Date()}
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
            </div>
            <hr></hr>
            <div className="row">
              <Controller
                control={control}
                name="patient_code"
                rules={{ required: "Enter Patient Code" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col-2 mandatory form-group" }}
                    label={{
                      forceLabel: "Enter Patient Code",
                      isImp: true,
                    }}
                    error={errors}
                    textBox={{
                      ...props,
                      className: "txt-fld",
                      name: "patient_code",
                      // placeholder: "MRN Number",
                      disabled: disabled || current.request_status === "APR",
                      tabIndex: "8",
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="full_name"
                rules={{ required: "Enter Full Patient Name" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col mandatory form-group" }}
                    label={{
                      forceLabel: "Enter Patient Name",
                      isImp: true,
                    }}
                    error={errors}
                    textBox={{
                      ...props,
                      className: "txt-fld",
                      name: "full_name",
                      placeholder: "Enter Full Name",
                      disabled: disabled || current.request_status === "APR",
                      tabIndex: "9",
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                // rules={{ required: "Please Select Gender" }}
                name="gender"
                render={({ onBlur, onChange, value }) => (
                  <AlgaehAutoComplete
                    div={{ className: "col-2 mandatory" }}
                    label={{
                      forceLabel: "Gender",
                      isImp: false,
                    }}
                    // error={errors}
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
                        disabled: disabled || current.request_status === "APR",
                        tabIndex: "10",
                      },
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="date_of_birth"
                // rules={{ required: "Please Select DOB" }}
                render={({ onChange, value }) => (
                  <AlgaehDateHandler
                    div={{
                      className: "col-3",
                      tabIndex: "11",
                    }}
                    // error={errors}
                    label={{
                      fieldName: "date_of_birth",
                      isImp: false,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "date_of_birth",
                      value,
                    }}
                    others={{
                      disabled: disabled || current.request_status === "APR",
                    }}
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
            </div>
            <div className="row d-none">
              <AlgaehHijriDatePicker
                div={{
                  className: "col HijriCalendar",
                  tabIndex: "12",
                }}
                gregorianDate={date_of_birth || null}
                label={{ forceLabel: "Hijiri Date" }}
                textBox={{
                  className: "txt-fld",
                  disabled,
                }}
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
                  className: "col form-group",
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
                  tabIndex: "13",
                  placeholder: "Y",
                }}
              />
            </div>
            <hr></hr>
            <div className="row">
              {disabled ? (
                <>
                  <Controller
                    control={control}
                    rules={{ required: "Please Select request status " }}
                    name="request_status"
                    render={({ onBlur, onChange, value }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-3 mandatory" }}
                        label={{
                          forceLabel: "Change Request Status",
                          isImp: true,
                        }}
                        error={errors}
                        selector={{
                          name: "request_status",
                          className: "select-fld",

                          dataSource: {
                            textField: fieldNameFn("name"),
                            valueField: "value",
                            data: REQUEST_STATUS,
                          },
                          value,
                          onChange: (_, selected) => {
                            onChange(selected);
                            if (selected !== "APR") {
                              setValue("work_status", "");
                              setValue("arrival_date", undefined);
                            }
                          },
                          onClear: () => {
                            onChange("");
                          },
                          others: {
                            // disabled,
                            // tabIndex: "4",
                          },
                        }}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    rules={{ required: "Change Work Status" }}
                    name="work_status"
                    render={({ onBlur, onChange, value }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-3 mandatory" }}
                        label={{
                          forceLabel: "Change Work Status",
                          isImp: true,
                        }}
                        error={errors}
                        selector={{
                          name: "work_status",
                          className: "select-fld",

                          dataSource: {
                            textField: fieldNameFn("name"),
                            valueField: "value",
                            data: WORK_STATUS,
                          },
                          value,
                          onChange: (_, selected) => {
                            onChange(selected);
                            if (selected !== "COM") {
                              setValue("arrival_date", undefined);
                              return;
                            }
                          },
                          onClear: () => {
                            onChange("");
                          },
                          others: {
                            disabled: request_status !== "APR",
                            // tabIndex: "4",
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="arrival_date"
                    control={control}
                    rules={{
                      required:
                        work_status === "COM" ? " please enter date" : false,
                    }}
                    render={({ onChange, value }) => (
                      <AlgaehDateHandler
                        div={{ className: "col-3 form-group mandatory" }}
                        error={errors}
                        label={{
                          forceLabel: "Received Date",
                          isImp: true,
                        }}
                        textBox={{
                          className: "form-control",
                          name: "arrival_date",
                          value,
                        }}
                        others={{
                          disabled: work_status !== "COM",
                        }}
                        minDate={new Date()}
                        events={{
                          onChange: (mdate) => {
                            if (mdate) {
                              onChange(mdate._d);
                            } else {
                              onChange(undefined);
                            }
                          },
                          onClear: () => {
                            debugger;
                            onChange(undefined);
                            // setValue("arrival_date", undefined);
                          },
                        }}
                      />
                    )}
                  />

                  <AlgaehSecurityComponent componentCode="DEN_MAIL_NOTY">
                    <div className="col">
                      <label>Notify Via Email</label>
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            value="yes"
                            name=""
                            checked={checked}
                            // disabled={}
                            onChange={(e) => {
                              e.target.checked
                                ? setChecked(true)
                                : setChecked(false);
                            }}
                          />
                          <span>Yes</span>
                        </label>
                      </div>
                    </div>
                  </AlgaehSecurityComponent>
                </>
              ) : null}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </AlgaehModal>
  );
}
