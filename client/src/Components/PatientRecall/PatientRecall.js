import React, { Component, useState, useEffect } from "react";
import "./PatientRecall.scss";
import {
  // AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import { AlgaehButton } from "algaeh-react-components";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
// import { AlgaehValidation } from "../../utils/GlobalFunctions";
import moment from "moment";
import Options from "../../Options.json";

function PatientRecall() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const today = moment().format("YYYY/MM/DD");
  const baseState = {
    sub_department_id: null,
    provider_id: null,
    recall_start: moment(today).startOf("month"),
    recall_end: today
  };
  const [inputs, setInputs] = useState(baseState);

  useEffect(() => {
    getDoctorsAndDepts();
  }, []);

  function getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      module: "masterSettings",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          setDepartments(response.data.records.departmets);
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  function dateValidate(value, event) {
    let inRange = moment(value).isBefore(moment().format("YYYY-MM-DD"));
    if (inRange) {
      swalMessage({
        title: "Date cannot be past Date.",
        type: "warning"
      });
      event.target.focus();
      setInputs({
        [event.target.name]: null
      });
    }
  }

  function dropDownHandle(value) {
    switch (value.name) {
      case "sub_department_id":
        setInputs(state => ({
          [value.name]: value.value
        }));
        setDoctors(value.selected.doctors);
        break;

      default:
        setInputs(state => ({
          [value.name]: value.value
        }));
        break;
    }
  }

  function dateFormater(value) {
    if (value !== null) {
      return String(moment(value).format(Options.dateFormat));
    }
    // "DD-MM-YYYY"
  }

  function handleInput(e) {
    const { name, value } = e.target;
    setInputs(state => ({
      ...state,
      [name]: value
    }));
  }

  function loadPatients() {
    const { provider_id, recall_start, sub_department_id } = inputs;
    if (!sub_department_id && !provider_id && !recall_start) {
      swalMessage({
        title: "Department/Doctor/Date is mandatory to load data.",
        type: "warning"
      });
      return undefined;
    } else {
      let inputObj = {
        date_of_recall: recall_start,
        provider_id,
        sub_department_id
      };

      algaehApiCall({
        uri: "/doctorsWorkBench/getFollowUp",
        method: "GET",
        data: inputObj,
        onSuccess: response => {
          if (response.data.success) {
            this.setState({
              patients: response.data.records
            });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    }
  }

  const fakeData = [
    {
      date: "01-Jan-2020",
      patients: [
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        }
      ]
    },
    {
      date: "10-Jan-2020",
      patients: [
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        }
      ]
    },
    {
      date: "10-Jan-2020",
      patients: [
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        }
      ]
    },
    {
      date: "12-Jan-2020",
      patients: [
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        },
        {
          patient_code: "PAT-123213",
          patient_name: "John Doe",
          contact_number: "81272829",
          provider_name: "Jane Doe",
          start_time: "10:00 am",
          end_time: "10:15 am"
        }
      ]
    }
  ];

  function Column({ data }) {
    return (
      <div className="card">
        <h2>{data.date}</h2>
        <div className="slotsDiv">
          {data.patients.map(item => (
            <div className="eachSlot">
              <small>{item.patient_code}</small>
              <h3>{item.patient_name}</h3>
              <small>{item.contact_number}</small>
              <br />
              <small>
                <b>{item.start_time}</b> - <b>{item.end_time}</b>
              </small>
              <hr />
              <small>
                <b>{item.provider_name}</b>
              </small>
              <br />
              <small>{item.sub_department_name || "Cardiology"}</small>
              <button className="btn btn-default btn-block btn-sm btn-book">
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="patient_recall">
      <div className="row inner-top-search">
        <AlgaehDateHandler
          div={{ className: "col-2 form-group" }}
          label={{ forceLabel: "From Date" }}
          textBox={{
            className: "txt-fld",
            name: "recall_start"
          }}
          minDate={new Date()}
          events={{
            onChange: handleInput,
            onBlur: dateValidate
          }}
          value={inputs.recall_start}
        />
        <AlgaehDateHandler
          div={{ className: "col-2 form-group" }}
          label={{ forceLabel: "To Date" }}
          textBox={{
            className: "txt-fld",
            name: "recall_end"
          }}
          minDate={new Date()}
          events={{
            onChange: handleInput,
            onBlur: dateValidate
          }}
          value={inputs.recall_end}
        />
        <AlagehAutoComplete
          div={{ className: "col-2 form-group" }}
          label={{
            forceLabel: "Filter by Department"
          }}
          selector={{
            name: "sub_department_id",
            className: "select-fld",
            value: inputs.sub_department_id,
            onChange: dropDownHandle,
            dataSource: {
              textField: "sub_department_name",
              valueField: "sub_department_id",
              data: departments
            }
          }}
        />
        <AlagehAutoComplete
          div={{ className: "col-2 form-group" }}
          label={{
            forceLabel: "Filter by Doctor"
          }}
          selector={{
            name: "provider_id",
            className: "select-fld",
            value: inputs.provider_id,
            dataSource: {
              textField: "full_name",
              valueField: "employee_id",
              data: doctors
            }
          }}
        />
        <div className="col-2 mt-4">
          <AlgaehButton type="primary">Load</AlgaehButton>
        </div>
      </div>
      <div className="scrolling-wrapper">
        {fakeData.map((item, index) => (
          <Column key={index} data={item} />
        ))}
      </div>
    </div>
  );
}

export default PatientRecall;
