import React, { useState, useEffect, useContext } from "react";
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
  MainContext,
  AlgaehHijriDatePicker,

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
}) {
  const {
    // titles = [],
    userLanguage,
  } = useContext(MainContext);

  //   const { userLanguage, titles = [] } = useContext(MainContext);
  const { FORMAT_GENDER, REQUEST_STATUS, WORK_STATUS } = GenericData;
  //   const [openDentalModal, setOpenDentalModal] = useState(false);
  // const [loading_request_list, setLoadingRequestList] = useState(false);
  //   const [request_list, setRequestList] = useState([]);

  //   const [loading, setLoading] = useState(true);

  const [sub_department_id, setSub_department_id] = useState("");
  const [doctor_id, setDoctor_id] = useState("");

  //   const [subDepartment, setSubDepartment] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const { control, errors, setValue, handleSubmit, reset } = useForm({
    shouldFocusError: true,
    defaultValues: {
      requesting_date: new Date(),
      //   from_due_date: new Date(),
      //   to_due_date: new Date(),
    },
  });
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
      });
      const doctors = subDepartment.departmets.filter((item) => {
        return item.sub_department_id === current.department_id;
      })[0].doctors;

      // .map((item) => item.doctors);

      setSub_department_id(current.department_id);
      setDoctor_id(current.provider_id);
      setDoctors(doctors);
    } else {
      reset({
        full_name: "",
        patient_code: "",
        gender: "",
        date_of_birth: "",
        requesting_date: new Date(),
        select_procedure: "",
        select_vendor: "",
        request_status: "PEN",
        work_status: "PEN",
        provider_id: "",
        due_date: "",
      });
      setSub_department_id("");
      setDoctor_id("");
    }
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
          department_id: sub_department_id,
          provider_id: doctor_id,
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
        clearState();
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
    const requestDate = moment(data.requesting_date).format("YYYY-MM-DD");
    const due_date = moment(new Date()).format("YYYY-MM-DD");
    const years = moment().diff(data.date_of_birth, "year");
    const date_of_birth = moment(data.date_of_birth).format("YYYY-MM-DD");
    try {
      const res = await newAlgaehApi({
        uri: "/dentalForm/updateDentalForm",
        method: "PUT",
        // module: "finance",
        data: {
          department_id: sub_department_id,
          provider_id: doctor_id,
          full_name: data.full_name,
          patient_code: data.patient_code,
          gender: data.gender,
          age: years,
          hims_d_services_id: data.select_procedure,
          standard_fee: data.service_amount,
          hims_d_vendor_id: data.select_vendor,
          request_status: data.request_status,
          work_status: data.work_status,
          requested_date: requestDate,
          due_date: due_date,
          date_of_birth: date_of_birth,
          hims_f_dental_form_id: current.hims_f_dental_form_id,
        },
      });
      if (res.data.success) {
        clearState();
        // getRequest();
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
  const clearState = () => {
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
    });
    setSub_department_id("");
    setDoctor_id("");
  };
  const onChangeDoctor = (e) => {
    setDoctor_id(e.employee_id);
  };
  const onChangeAutoComplete = (e) => {
    setSub_department_id(e.sub_department_id);
    setDoctors(e.doctors);
  };
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
      className={`${userLanguage}_comp row algaehNewModal dentalLabRequest`}
      footer={[
        <div className="col-2">
          <button
            onClick={handleSubmit(onSubmit)}
            className="btn btn-primary btn-sm"
            style={{ marginTop: 17 }}
          >
            {current.length !== 0 ? "Update" : "Add to List"}
          </button>

          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ marginTop: 17 }}
          >
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
              {/* <div className="col-3 globalSearchCntr">
                  <AlgaehLabel label={{ forceLabel: "Search Patient" }} />
                  <h6 onClick={patientSearch}>
                    {patientName ? patientName : "Search Patient"}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div> */}
              {/* <Controller
                control={control}
                name="title_id"
                // rules={{ required: "Please Select Title" }}
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
                        // disabled,
                        tabIndex: "1",
                      },
                    }}
                  />
                )}
              /> */}
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
                name="patient_code"
                rules={{ required: "MRN Number" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col-lg-4 mandatory" }}
                    label={{
                      fieldName: "MRN Number",
                      isImp: true,
                    }}
                    error={errors}
                    textBox={{
                      ...props,
                      className: "txt-fld",
                      name: "patient_code",
                      // placeholder: "MRN Number",
                      disabled,
                      tabIndex: "2",
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
                    others={{ disabled }}
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
                name="select_procedure"
                control={control}
                rules={{ required: "Please Enter" }}
                render={({ value, onChange }) => (
                  <AlgaehAutoComplete
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      forceLabel: "Select Procedure",
                      isImp: true,
                    }}
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
                        disabled,
                      },
                    }}
                  />
                )}
              />{" "}
              <Controller
                name="select_vendor"
                control={control}
                rules={{ required: "Please select" }}
                render={({ value, onBlur, onChange }) => (
                  <AlgaehAutoComplete
                    div={{ className: "col-3 form-group mandatory" }}
                    label={{
                      forceLabel: "Select Vendor",
                      isImp: true,
                    }}
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
                        disabled,
                        tabIndex: "11",
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="service_amount"
                control={control}
                rules={{ required: "Please Enter Name" }}
                render={(props) => (
                  <AlgaehFormGroup
                    div={{ className: "col-3 mandatory" }}
                    label={{
                      forceLabel: "Service Amount",
                      isImp: true,
                    }}
                    textBox={{
                      ...props,
                      type: "number",
                      className: "form-control",
                      disabled,
                      placeholder: "0.00",
                    }}
                  />
                )}
              />
              {/* <Controller
                  control={control}
                  name="doctor"
                  rules={{ required: "Please Select a doctor" }}
                  render={({ onChange, value }) => (
                    <AlgaehTreeSearch
                      div={{ className: "col mandatory" }}
                      label={{
                        fieldName: "doctor_id",
                        isImp: true,
                        align: "ltr",
                      }}
                      // error={errors}
                      tree={{
                        disableHeader: true,
                        treeDefaultExpandAll: true,
                        onChange: (selected) => {
                          onChange(selected);
                        },

                        value,
                        name: "doctor",
                        data: data.doctors,
                        textField: fieldNameFn("label", "arlabel"),
                        valueField: (node) => {
                          return node.value;
                        },
                      }}
                    />
                  )}
                /> */}
              <AlgaehAutoComplete
                div={{ className: "col-lg-2 mandatory" }}
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
              />
              <AlgaehAutoComplete
                div={{ className: "col-lg-2 mandatory" }}
                label={{
                  fieldName: "Doctor",
                  isImp: true,
                }}
                error={errors}
                selector={{
                  name: "doctors",
                  className: "select-fld",

                  dataSource: {
                    textField: "full_name",
                    valueField: "employee_id",
                    data: doctors,
                  },
                  value: doctor_id,
                  onChange: onChangeDoctor,
                  // onClear: () => {
                  //   onChange("");
                  // },
                  others: {
                    disabled,
                    tabIndex: "4",
                  },
                }}
              />
              <Controller
                control={control}
                name="due_date"
                rules={{ required: "Please Select DOB" }}
                render={({ onChange, value }) => (
                  <AlgaehDateHandler
                    div={{
                      className: "col-lg-3 ",
                      tabIndex: "5",
                    }}
                    error={errors}
                    label={{
                      fieldName: "due_date",
                      // isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "due_date",
                      value,
                    }}
                    others={{ disabled }}
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
              {/* <Controller
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
                        // disabled,
                        tabIndex: "4",
                      },
                    }}
                  />
                )}
              /> */}
              {disabled ? (
                <>
                  <Controller
                    control={control}
                    rules={{ required: "Please Select " }}
                    name="work_status"
                    render={({ onBlur, onChange, value }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-lg-2 mandatory" }}
                        label={{
                          fieldName: "work_status",
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
                          },
                          onClear: () => {
                            onChange("");
                          },
                          others: {
                            // disabled,
                            tabIndex: "4",
                          },
                        }}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    rules={{ required: "Please Select request status " }}
                    name="request_status"
                    render={({ onBlur, onChange, value }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-lg-2 mandatory" }}
                        label={{
                          fieldName: "request_status",
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
                          },
                          onClear: () => {
                            onChange("");
                          },
                          others: {
                            // disabled,
                            tabIndex: "4",
                          },
                        }}
                      />
                    )}
                  />
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
