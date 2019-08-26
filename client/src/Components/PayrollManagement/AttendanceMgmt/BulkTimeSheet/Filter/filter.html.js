import React, { useState, useEffect } from "react";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDateHandler
} from "../../../../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../../../../Wrapper/autoSearch";
import { swalMessage } from "../../../../../utils/algaehApiCall";
import {
  getHospitals,
  getAttendanceDates,
  getDivisionProject,
  getBranchWiseDepartments,
  UploadTimesheet
} from "./filter.events";
import moment from "moment";
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
  const [employeeID, setEmployeeId] = useState(0);
  const [startDt, setStartDt] = useState(0);
  const [endDt, setEndDt] = useState(0);
  const [month, setMonth] = useState("");
  const [fromMin, setFromMin] = useState(new Date());
  const [fromMax, setFromMax] = useState(new Date());
  const [toMin, setToMin] = useState(new Date());
  const [toMax, setToMax] = useState(new Date());
  const [loadingPriew, setLoadingPriew] = useState(false);
  useEffect(() => {
    getHospitals(data => {
      setHospitals(data);
    });
  }, []);

  useEffect(() => {
    if (hospitalID !== "") {
      getAttendanceDates(data => {
        if (data.length > 0) {
          const firstRecord = data[0];

          setStartDt(firstRecord.at_st_date);
          setEndDt(firstRecord.at_end_date);
        }
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
          },
          onClear: () => {
            setFromDate("");
            setToDate("");
            setHospitalID("");
          }
        }}
        showLoading={true}
      />
      <AlagehAutoComplete
        div={{ className: "col-2 form-group mandatory" }}
        label={{
          forceLabel: "Select Month"
        }}
        selector={{
          sort: "off",
          name: "select_month",
          className: "select-fld",
          value: month,
          dataSource: {
            textField: "text",
            valueField: "name",
            data: [
              { name: "01", text: "January" },
              { name: "02", text: "February" },
              { name: "03", text: "March" },
              { name: "04", text: "April" },
              { name: "05", text: "May" },
              { name: "06", text: "June" },
              { name: "07", text: "July" },
              { name: "08", text: "August" },
              { name: "09", text: "September" },
              { name: "10", text: "October" },
              { name: "11", text: "November" },
              { name: "12", text: "December" }
            ]
          },
          onChange: e => {
            setMonth(e.value);

            const year = moment().format("YYYY");
            const maxDate = `${year}-${e.value}-${endDt}`;
            const minDate = moment(maxDate, "YYYY-MM-DD")
              .add(-1, "months")
              .set("date", startDt)
              .format("YYYY-MM-DD");

            setToMax(maxDate);
            setFromMin(minDate);
            setFromMax(maxDate);
            setFromDate(minDate);
            setToDate(maxDate);
          },
          onClear: () => {
            setMonth("");
          }
        }}
        showLoading={true}
      />

      <div className="col mandatory">
        <label className="style_Label ">
          From Date<span className="imp">&nbsp;*</span>
        </label>
        <div className="algaeh-datePicker">
          <input
            data_role="datepicker"
            type="date"
            name="fromDate"
            required=""
            min={fromMin}
            max={fromMax}
            value={fromDate}
            disabled={month === "" ? true : false}
            onChange={e => {
              setFromDate(e.target.value);
              setToMin(moment(e.target.value).format("YYYY-MM-DD"));
            }}
          />
        </div>
      </div>
      <div className="col mandatory">
        <label className="style_Label ">
          To Date<span className="imp">&nbsp;*</span>
        </label>
        <div className="algaeh-datePicker">
          <input
            data_role="datepicker"
            type="date"
            name="toDate"
            required=""
            min={toMin}
            max={toMax}
            value={toDate}
            disabled={month === "" ? true : false}
            onChange={e => {
              setToDate(e.target.value);
            }}
          />
        </div>
      </div>

      <AlagehAutoComplete
        div={{ className: "col-2 form-group" }}
        label={{
          forceLabel: "Project"
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
          setEmployeeId(item.hims_d_employee_id);
        }}
      />

      <input
        type="file"
        name="manualTimeSheet"
        onChange={e => {
          if (e.target.files.length > 0) UploadTimesheet(e.target.files, props);
        }}
      />

      <button
        onClick={() => {
          if (hospitalID !== "" && fromDate !== "" && toDate !== "") {
            props.downloadExcel({
              branch_id: hospitalID,
              from_date: fromDate,
              to_date: toDate,
              project_id: projectID,
              department_id: departmenID,
              sub_department_id: subDepartmentID,
              employee_id: employeeID,
              month: month,
              year: moment().format("YYYY")
            });
          } else {
            swalMessage({
              title: "Branch,from data and to date are mandatory",
              type: "error"
            });
          }
        }}
        style={{ marginLeft: 10, float: "right" }}
        className="btn btn-primary"
      >
        {!loading ? (
          <span>Download</span>
        ) : (
          <i className="fas fa-spinner fa-spin" />
        )}
      </button>
      <button
        onClick={() => {}}
        style={{ marginLeft: 10, float: "right" }}
        className="btn btn-primary"
      >
        {!loadingPriew ? (
          <span>Preview</span>
        ) : (
          <i className="fas fa-spinner fa-spin" />
        )}
      </button>
    </div>
  );
}
