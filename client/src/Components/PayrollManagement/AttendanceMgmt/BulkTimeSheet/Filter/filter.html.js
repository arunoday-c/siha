import React, { useState, useEffect } from "react";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDateHandler
} from "../../../../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../../../../Wrapper/autoSearch";
import {
  getHospitals,
  getAttendanceDates,
  getDivisionProject,
  getBranchWiseDepartments
} from "./filter.events";
export default function Filter(props) {
  const [hospitals, setHospitals] = useState([]);
  const [hospitalID, setHospitalID] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [projectID, setProjectID] = useState("");
  const [projects, setProjects] = useState([]);
  const [departmenID, setDepartmenID] = useState("");
  const [department, setDepartment] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [subDepartmentID, setSubDepartmentID] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  useEffect(() => {
    getHospitals(data => {
      setHospitals(data);
    });
  }, []);

  useEffect(() => {
    if (hospitalID !== "") {
      getAttendanceDates(data => {
        console.log(data);
      });
      getDivisionProject({ division_id: hospitalID }, data => {
        setProjects(data);
      });
      getBranchWiseDepartments({ hospital_id: hospitalID }, data => {
        setDepartment(data);
      });
    }
  }, [hospitalID]);
  return (
    <div className="row  inner-top-search">
      <AlagehAutoComplete
        div={{ className: "col-2 form-group mandatory" }}
        label={{
          forceLabel: "Branch",
          isImp: true
        }}
        selector={{
          name: "hospital_id",
          className: "select-fld",
          value: hospitalID,
          dataSource: {
            textField: "hospital_name",
            valueField: "hims_d_hospital_id",
            data: hospitals
          },
          onChange: e => {
            setHospitalID(e.value);
          }
        }}
        showLoading={true}
      />
      <AlgaehDateHandler
        div={{ className: "col" }}
        label={{ forceLabel: "From Date", isImp: false }}
        textBox={{
          className: "txt-fld",
          name: "fromDate"
        }}
        maxDate={new Date()}
        events={{
          onChange: e => {}
        }}
        value={fromDate}
      />
      <AlgaehDateHandler
        div={{ className: "col" }}
        label={{ forceLabel: "From Date", isImp: false }}
        textBox={{
          className: "txt-fld",
          name: "toDate"
        }}
        maxDate={new Date()}
        events={{
          onChange: e => {}
        }}
        value={toDate}
      />
      <AlagehAutoComplete
        div={{ className: "col-2 form-group" }}
        label={{
          forceLabel: "Project",
          isImp: true
        }}
        selector={{
          name: "project_id",
          className: "select-fld",
          value: projectID,
          dataSource: {
            textField: "project_desc",
            valueField: "project_id",
            data: projects
          },
          onChange: e => {
            setProjectID(e.value);
          }
        }}
        showLoading={true}
      />
      <AlagehAutoComplete
        div={{ className: "col-2 form-group" }}
        label={{ forceLabel: "Department" }}
        selector={{
          name: "department_id",
          value: departmenID,
          className: "select-fld",
          dataSource: {
            textField: "department_name",
            valueField: "hims_d_department_id",
            data: department
          },
          onChange: e => {
            setDepartmenID(e.value);
            setSubDepartments(e.selected.subDepts);
          }
        }}
      />
      <AlagehAutoComplete
        div={{ className: "col-2 form-group" }}
        label={{ forceLabel: "Sub Deptartment" }}
        selector={{
          name: "sub_department_id",
          value: subDepartmentID,
          className: "select-fld",
          dataSource: {
            textField: "sub_department_name",
            valueField: "hims_d_sub_department_id",
            data: subDepartments
          },
          onChange: e => {
            setSubDepartmentID(e.value);
          }
        }}
      />
      <AlgaehAutoSearch
        div={{ className: "col" }}
        label={{ forceLabel: "Employee Search" }}
        title="Employee Search"
        name="fullName"
        columns={[{ fieldName: "employee_code", fieldName: "full_name" }]}
        displayField="full_name"
        searchName="employee"
        value={fullName}
        template={({ full_name }) => {
          return <div className="col-12 padd-10">{full_name}</div>;
        }}
        onClick={item => {
          setFullName(item.full_name);
          setEmployeeCode(item.employee_code);
        }}
      />
      <button
        onClick={() => {
          if (hospitalID !== "" && fromDate !== "" && toDate !== "") {
            props.downloadExcel({
              hospitalID,
              fromDate,
              toDate,
              projectID,
              departmenID,
              subDepartmentID,
              employeeCode
            });
          }
        }}
        style={{ marginLeft: 10, float: "right" }}
        className="btn btn-primary"
      >
        {!loading ? (
          <span>Load</span>
        ) : (
          <i className="fas fa-spinner fa-spin" />
        )}
      </button>
    </div>
  );
}
