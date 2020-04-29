import React, { useState, useEffect, useContext } from "react";
import "./filter.html.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";
import { swalMessage } from "../../../../../utils/algaehApiCall";
import { getYears } from "../../../../../utils/GlobalFunctions";
import AlgaehSearch from "../../../../Wrapper/globalSearch";

import {
  getHospitals,
  getAttendanceDates,
  getDivisionProject,
  getBranchWiseDepartments,
  getEmpGroups,
  UploadTimesheet,
  getPreview
} from "./filter.events";
import moment from "moment";
import spotlightSearch from "../../../../../Search/spotlightSearch.json";
import { MainContext } from "algaeh-react-components/context";

export default function Filter(props) {
  let fileInput = React.createRef();
  const { userToken } = useContext(MainContext);

  const [hospitals, setHospitals] = useState([]);
  const [hospitalID, setHospitalID] = useState(userToken.hims_d_hospital_id);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [projectID, setProjectID] = useState("");
  const [projects, setProjects] = useState([]);
  const [departmenID, setDepartmenID] = useState("");
  const [department, setDepartment] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]);
  const [subDepartmentID, setSubDepartmentID] = useState("");

  const [empGroups, setEmpGroups] = useState([]);
  const [empGroupId, setEmpGroupId] = useState("");

  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [employeeID, setEmployeeId] = useState(0);
  const [startDt, setStartDt] = useState(0);
  const [endDt, setEndDt] = useState(0);
  const [month, setMonth] = useState(moment().format("MM"));
  const [fromMin, setFromMin] = useState(new Date());
  const [fromMax, setFromMax] = useState(new Date());
  const [toMin, setToMin] = useState(new Date());
  const [toMax, setToMax] = useState(new Date());
  const [loadingPriew, setLoadingPriew] = useState(false);
  const [atStartType, setATStartType] = useState("");
  // const [onlyExcel, setOnlyExcel] = useState("");
  const [upload, setUpload] = useState("Y");
  const [selYear, setSelYear] = useState("");
  const [loadYear, setLoadYear] = useState([]);

  useEffect(() => {
    setLoadYear(getYears());
    setSelYear(parseInt(moment().format("YYYY")));
    getHospitals(data => {
      setHospitals(data);
    });
  }, []);

  useEffect(() => {
    if (hospitalID !== "") {
      getAttendanceDates(data => {
        if (data.length > 0) {
          const firstRecord = data[0];
          setATStartType(firstRecord.attendance_starts);
          setStartDt(firstRecord.at_st_date);
          setEndDt(firstRecord.at_end_date);
          // dateCalcl(firstRecord.at_st_date, firstRecord.at_end_date, undefined);
        }
      });
      getDivisionProject({ division_id: hospitalID }, data => {
        setProjects(data);
      });
      getBranchWiseDepartments({ hospital_id: hospitalID }, data => {
        setDepartment(data);
      });
      getEmpGroups(data => {
        setEmpGroups(data);
      });
    }
  }, [hospitalID]);

  useEffect(() => {
    const dateCalcl = () => {

      let maxDate, minDate;
      if (atStartType === "FE") {
        const parsedMonth = parseInt(month) - 1;
        maxDate = moment()
          .year(selYear)
          .month(parsedMonth)
          .endOf("month")
          .format("YYYY-MM-DD");
        minDate = moment()
          .year(selYear)
          .month(parsedMonth)
          .startOf("month")
          .format("YYYY-MM-DD");
      } else {
        const searchYear =
          month === "01"
            ? moment(`01-01-${selYear}`, "DD-MM-YYYY")
              .add(-1, "year")
              .format("YYYY")
            : selYear;
        maxDate = `${selYear}-${month}-${endDt}`;
        let prevMonths = moment(maxDate, "YYYY-MM-DD")
          .add(-1, "months")
          .format("MM");
        minDate = `${searchYear}-${prevMonths}-${startDt}`;
      }
      setToMax(maxDate);
      setFromMin(minDate);
      setFromMax(maxDate);
      setToMin(minDate);
      setFromDate(minDate);
      setToDate(maxDate);
    };

    if (selYear && month && atStartType) {
      dateCalcl();
    }
  }, [atStartType, month, selYear, startDt, endDt]);

  function employeeSearch() {
    if (
      hospitalID === null ||
      hospitalID === undefined
    ) {
      swalMessage({
        title: "Please Select Branch",
        type: "warning"
      });
      document.querySelector("[name='hospital_id']").focus();
      return
    }

    let input_data = " hospital_id=" + hospitalID;
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee
      },
      inputs: input_data,
      searchName: "employee",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        setEmployeeId(row.hims_d_employee_id);
        setFullName(row.full_name);
        setHospitalID(row.hospital_id);
      }
    });
  }

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
        div={{ className: "col-1 form-group mandatory" }}
        label={{
          forceLabel: "Select Year",
          isImp: true
        }}
        selector={{
          name: "year",
          className: "select-fld",
          value: selYear,
          dataSource: {
            textField: "name",
            valueField: "value",
            data: loadYear
          },
          onChange: e => {
            setMonth("");
            setFromDate(undefined);
            setToDate(undefined);
            setSelYear(e.value);
            // dateCalcl(startDt, endDt, e.value);
          },
          onClear: () => {
            setSelYear("");
          }
        }}
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
            if (selYear === undefined || selYear === "") {
              setFromDate("");
              setToDate("");
              swalMessage({
                type: "error",
                title: "Please select year fist"
              });
              return;
            }
            setMonth(e.value);
          },
          onClear: () => {
            setMonth("");
          }
        }}
        showLoading={true}
      />
      <div className="col-2 mandatory">
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
      <div className="col-2 mandatory">
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
          },
          onClear: () => {
            setProjectID("");
          }
        }}
        showLoading={true}
      />{" "}
      <AlagehAutoComplete
        div={{ className: "col-2 form-group" }}
        label={{ forceLabel: "Employee Group" }}
        selector={{
          name: "group_id",
          value: empGroupId,
          className: "select-fld",
          dataSource: {
            textField: "group_description",
            valueField: "hims_d_employee_group_id",
            data: empGroups
          },
          onChange: e => {
            setEmpGroupId(e.value);
          },
          onClear: () => {
            setEmpGroupId("");
          }
        }}
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
          },
          onClear: () => {
            setDepartmenID("");
            setSubDepartments("");
            setSubDepartmentID("");
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
          },
          onClear: () => {
            setSubDepartmentID("");
          }
        }}
      />
      <div className="col-2 globalSearchCntr">
        <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
        <h6 onClick={employeeSearch}>
          {fullName ? fullName : "Search Employee"}
          <i className="fas fa-search fa-lg"></i>
        </h6>
      </div>
      <div className="col" style={{ paddingTop: 19 }}>
        <div className="uploadManualDiv   btn-with-icon">
          <input
            className="inputfile"
            type="file"
            name="manualTimeSheet"
            ref={fileInput}
            onChange={e => {
              if (e.target.files.length > 0)
                UploadTimesheet(e.target.files, props);
            }}
          />
          <label onClick={() => fileInput.current.click()}>
            <i className="fas fa-file-upload"></i> Upload
          </label>
        </div>
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
                employee_group_id: empGroupId,
                month: month,
                year: selYear //moment().format("YYYY")
              });
            } else {
              swalMessage({
                title: "Branch,from data and to date are mandatory",
                type: "error"
              });
            }
          }}
          style={{ marginLeft: 10, float: "right" }}
          className="btn btn-default btn-with-icon"
        >
          {!loading ? (
            <span>
              {" "}
              <i className="fas fa-file-download"></i> Download
            </span>
          ) : (
              <i className="fas fa-spinner fa-spin" />
            )}
        </button>
        <button
          onClick={() => {
            getPreview(
              {
                branch_id: hospitalID,
                from_date: fromDate,
                to_date: toDate,
                project_id: projectID,
                department_id: departmenID,
                sub_department_id: subDepartmentID,
                employee_id: employeeID,
                employee_group_id: empGroupId,
                month: month,
                year: selYear, //moment().format("YYYY"),
                upload: upload
              },
              props
            );
          }}
          style={{ marginLeft: 10, float: "right" }}
          className="btn btn-default  btn-with-icon"
        >
          {!loadingPriew ? (
            <span>
              {" "}
              <i className="fas fa-eye"></i> Preview
            </span>
          ) : (
              <i className="fas fa-spinner fa-spin" />
            )}
        </button>

        <button
          onClick={() => {
            setProjectID("");
            setDepartmenID("");
            setSubDepartmentID("");
            setFullName("");
            setEmployeeId("");
            setEmpGroupId("");
            setSubDepartments([]);
            if (typeof props.clear === "function") props.clear();
          }}
          style={{ marginLeft: 10, float: "right" }}
          className="btn btn-default  btn-with-icon"
        >
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
