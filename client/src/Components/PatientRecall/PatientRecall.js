import React, { useState, useEffect } from "react";
import "./PatientRecall.scss";
// import {
//   AlgaehDateHandler,
//   AlagehAutoComplete,
// } from "../Wrapper/algaehWrapper";
import { newAlgaehApi } from "../../hooks";
import { useQuery } from "react-query";
import {
  // AlgaehButton,
  AlgaehAutoComplete,
  AlgaehDateHandler,
  AlgaehMessagePop,
  Spin,
  // persistStorageOnRemove,
  // persistStageOnGet,
  // persistStateOnBack
} from "algaeh-react-components";
import { swalMessage } from "../../utils/algaehApiCall";
import { Controller, useForm } from "react-hook-form";
// import { AlgaehValidation } from "../../utils/GlobalFunctions";
import moment from "moment";
import Column from "./appointmentColumn";
import { useLocation, useHistory } from "react-router-dom";

const getDoctorsAndDepts = async (key) => {
  const result = await newAlgaehApi({
    uri: "/department/get/get_All_Doctors_DepartmentWise",
    module: "masterSettings",
    method: "GET",
    // data: { identity_status: "A" },
  });
  return result?.data?.records;
};
function PatientRecall() {
  const today = moment().format("YYYY/MM/DD");
  const {
    control,
    errors,
    handleSubmit,
    setValue, //watch,
    getValues,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      sub_department_id: null,
      provider_id: null,
      recall_start: today,
      recall_end: today,
    },
  });
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followUpData, setFollowUpData] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const {} = useQuery(["dropdown-data"], getDoctorsAndDepts, {
    refetchOnReconnect: false,
    // keepPreviousData: true,
    refetchOnWindowFocus: false,
    initialStale: true,
    cacheTime: Infinity,
    onSuccess: (data) => {
      setDepartments(data.departmets);
      const params = new URLSearchParams(location?.search);
      // let provider_id = params.get("provider_id");
      let sub_department_id = params.get("sub_department_id");

      if (sub_department_id === "null" || sub_department_id === null) {
        return;
      } else {
        const doctor = data.departmets.filter((item) => {
          return item.sub_department_id === parseInt(sub_department_id);
        });

        setDoctors(doctor[0].doctors);
      }
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "error",
      });
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(location?.search);
    let recall_start = params.get("recall_start");

    if (recall_start === "null" || recall_start === null) {
      getFollowUpData(getValues()).then(() => setLoading(false));
    } else {
      setValue("recall_start", params.get("recall_start"));
      setValue("recall_end", params.get("recall_end"));
      setValue(
        "sub_department_id",
        params.get("sub_department_id") !== "null"
          ? params.get("sub_department_id")
          : null
      );

      setValue(
        "provider_id",
        params.get("provider_id") !== "null" ? params.get("provider_id") : null
      );

      getFollowUpData(getValues()).then(() => setLoading(false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFollowUpData = async (data) => {
    const from_data = data.recall_start
      ? moment(data.recall_start).format("YYYY/MM/DD")
      : null;
    const to_data = data.recall_end
      ? moment(data.recall_end).format("YYYY/MM/DD")
      : null;

    try {
      const res = await newAlgaehApi({
        uri: "/doctorsWorkBench/getAllPatientFollowUp",
        method: "GET",
        data: {
          recall_start: from_data,
          recall_end: to_data,
          sub_department_id:
            data.sub_department_id === "" ? null : data.sub_department_id,
          doctor_id: data.provider_id === "" ? null : data.provider_id,
        },
      });
      if (res.data.success) {
        setFollowUpData(res.data.records);
        let state = getValues();

        //

        return history?.push(
          `${
            location?.pathname
          }?recall_start=${from_data}&recall_end=${to_data}&sub_department_id=${
            state.sub_department_id
          }&provider_id=${state.provider_id ? state.provider_id : null}`
        );
      }
    } catch (e) {
      AlgaehMessagePop({
        type: "error",
        display: e.message,
      });
    }
  };

  // const baseState = {
  //   sub_department_id: null,
  //   provider_id: null,
  //   recall_start: moment(today).startOf("month"),
  //   recall_end: today,
  // };
  // const [inputs, setInputs] = useState(baseState);

  // useEffect(() => {
  //   getDoctorsAndDepts();
  // }, []);

  // function getDoctorsAndDepts() {
  //   algaehApiCall({
  //     uri: "/department/get/get_All_Doctors_DepartmentWise",
  //     module: "masterSettings",
  //     method: "GET",
  //     onSuccess: (response) => {
  //       if (response.data.success) {
  //         setDepartments(response.data.records.departmets);
  //       }
  //     },
  //     onFailure: (error) => {
  //       swalMessage({
  //         title: error.message,
  //         type: "error",
  //       });
  //     },
  //   });
  // }

  function dateValidate(value, event) {
    let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
    if (inRange) {
      swalMessage({
        title: "Date cannot be past Date.",
        type: "warning",
      });
      event.target.focus();
      // setInputs({
      //   [event.target.name]: null,
      // });
    }
  }

  // function dropDownHandle(value) {
  //   switch (value.name) {
  //     case "sub_department_id":
  //       setInputs((state) => ({
  //         [value.name]: value.value,
  //       }));
  //       setDoctors(value.selected.doctors);
  //       break;

  //     default:
  //       setInputs((state) => ({
  //         [value.name]: value.value,
  //       }));
  //       break;
  //   }
  // }

  // function dateFormater(value) {
  //   if (value !== null) {
  //     return String(moment(value).format(Options.dateFormat));
  //   }
  //   // "DD-MM-YYYY"
  // }

  // function handleInput(e) {
  //   const { name, value } = e.target;
  //   setInputs((state) => ({
  //     ...state,
  //     [name]: value,
  //   }));
  // }

  // function loadPatients() {
  //   const { provider_id, recall_start, sub_department_id } = inputs;
  //   if (!sub_department_id && !provider_id && !recall_start) {
  //     swalMessage({
  //       title: "Department/Doctor/Date is mandatory to load data.",
  //       type: "warning"
  //     });
  //     return undefined;
  //   } else {
  //     let inputObj = {
  //       date_of_recall: recall_start,
  //       provider_id,
  //       sub_department_id
  //     };

  //     algaehApiCall({
  //       uri: "/doctorsWorkBench/getFollowUp",
  //       method: "GET",
  //       data: inputObj,
  //       onSuccess: response => {
  //         if (response.data.success) {
  //           this.setState({
  //             patients: response.data.records
  //           });
  //         }
  //       },
  //       onFailure: error => {
  //         swalMessage({
  //           title: error.message,
  //           type: "error"
  //         });
  //       }
  //     });
  //   }
  // }

  // const fakeData = [
  //   {
  //     date: "01-Jan-2020",
  //     patients: [
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //     ],
  //   },
  //   {
  //     date: "10-Jan-2020",
  //     patients: [
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //     ],
  //   },
  //   {
  //     date: "10-Jan-2020",
  //     patients: [
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //     ],
  //   },
  //   {
  //     date: "12-Jan-2020",
  //     patients: [
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //       {
  //         patient_code: "PAT-123213",
  //         patient_name: "John Doe",
  //         contact_number: "81272829",
  //         provider_name: "Jane Doe",
  //         start_time: "10:00 am",
  //         end_time: "10:15 am",
  //       },
  //     ],
  //   },
  // ];

  return (
    <div className="patient_recall">
      <form onSubmit={handleSubmit(getFollowUpData)}>
        <div className="row inner-top-search">
          <Controller
            control={control}
            name="recall_start"
            rules={{ required: "Please Select From Date" }}
            render={({ onChange, value }) => (
              <AlgaehDateHandler
                div={{ className: "col form-group" }}
                error={errors}
                label={{ forceLabel: "From Date" }}
                textBox={{
                  className: "txt-fld",
                  name: "recall_start",
                  value,
                }}
                // others={{ disabled }}
                // maxDate={new Date()}
                // minDate={new Date()}
                events={{
                  onChange: (mdate) => {
                    if (mdate) {
                      onChange(mdate._d);
                    } else {
                      onChange(undefined);
                    }
                  },
                  onBlur: dateValidate,
                  onClear: () => {
                    onChange(undefined);
                  },
                }}
              />
            )}
          />
          {/* 
        <AlgaehDateHandler
          div={{ className: "col-2 form-group" }}
          label={{ forceLabel: "From Date" }}
          textBox={{
            className: "txt-fld",
            name: "recall_start",
          }}
          minDate={new Date()}
          events={{
            onChange: handleInput,
            onBlur: dateValidate,
          }}
          value={inputs.recall_start}
        /> */}

          {/* <AlgaehDateHandler
          div={{ className: "col-2 form-group" }}
          label={{ forceLabel: "To Date" }}
          textBox={{
            className: "txt-fld",
            name: "recall_end",
          }}
          minDate={new Date()}
          events={{
            onChange: handleInput,
            onBlur: dateValidate,
          }}
          value={inputs.recall_end}
        /> */}
          <Controller
            control={control}
            name="recall_end"
            rules={{ required: "Please Select To Date" }}
            render={({ onChange, value }) => (
              <AlgaehDateHandler
                div={{ className: "col form-group" }}
                error={errors}
                label={{ forceLabel: "To Date" }}
                textBox={{
                  className: "txt-fld",
                  name: "recall_end",
                  value,
                }}
                // others={{ disabled }}
                // maxDate={new Date()}
                // minDate={new Date()}
                events={{
                  onChange: (mdate) => {
                    if (mdate) {
                      onChange(mdate._d);
                    } else {
                      onChange(undefined);
                    }
                  },
                  onBlur: dateValidate,
                  onClear: () => {
                    onChange(undefined);
                  },
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="sub_department_id"
            // rules={{ required: "Required" }}
            render={({ value, onChange, onBlur }) => (
              <AlgaehAutoComplete
                div={{ className: "col form-group" }}
                // error={errors}
                label={{
                  forceLabel: "Filter by Department",
                }}
                selector={{
                  value,
                  onChange: (_, selected) => {
                    onChange(selected);
                    setValue("provider_id", "");
                    setDoctors(_.doctors);
                  },
                  onClear: () => {
                    onChange("");
                  },
                  name: "sub_department_id",
                  dataSource: {
                    textField: "sub_department_name",
                    valueField: "sub_department_id",
                    data: departments,
                  },
                }}
              />
            )}
          />
          {/* <AlagehAutoComplete
          div={{ className: "col-2 form-group" }}
          label={{
            forceLabel: "Filter by Department",
          }}
          selector={{
            name: "sub_department_id",
            className: "select-fld",
            value: inputs.sub_department_id,
            onChange: dropDownHandle,
            dataSource: {
              textField: "sub_department_name",
              valueField: "sub_department_id",
              data: departments,
            },
          }}
        /> */}

          <Controller
            control={control}
            name="provider_id"
            // rules={{ required: "Required" }}
            render={({ value, onChange, onBlur }) => (
              <AlgaehAutoComplete
                div={{ className: "col form-group" }}
                // error={errors}
                label={{
                  forceLabel: "Filter by Doctor",
                }}
                selector={{
                  value,
                  onChange: (_, selected) => {
                    onChange(selected);
                  },
                  onClear: () => {
                    onChange("");
                  },
                  name: "provider_id",
                  dataSource: {
                    textField: "full_name",
                    valueField: "employee_id",
                    data: doctors,
                  },
                }}
              />
            )}
          />
          {/* <AlagehAutoComplete
          div={{ className: "col-2 form-group" }}
          label={{
            forceLabel: "Filter by Doctor",
          }}
          selector={{
            name: "provider_id",
            className: "select-fld",
            value: inputs.provider_id,
            dataSource: {
              textField: "full_name",
              valueField: "employee_id",
              data: doctors,
            },
          }}
        /> */}
          <div className="col" style={{ marginTop: 21 }}>
            <button className="btn btn-primary" type="submit">
              Load
            </button>
          </div>
        </div>
      </form>
      <div className="scrolling-wrapper">
        <Spin spinning={loading}>
          {followUpData?.map((item, index) => (
            <Column key={index} data={item} />
          ))}
        </Spin>
      </div>
    </div>
  );
}

export default PatientRecall;
