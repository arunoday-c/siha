import React, { useEffect, useState, createContext, useContext } from "react";
import { FilterComponent } from ".";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { getEmpGroups } from "../../PayrollManagement/AttendanceMgmt/BulkTimeSheet/Filter/filter.events";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehSearch from "../../Wrapper/globalSearch";
import moment from "moment";
import { MainContext } from "algaeh-react-components/context";

export const FilterContext = createContext(null);

export default function EmployeeFilter(props) {
  const [hospitals, setHospitals] = useState([]);
  const [allDepartments, setDepts] = useState([]);
  const [empGroups, setEmpGroups] = useState([]);
  const [subDepts, setSubDepts] = useState([]);
  const [designations, setDesignations] = useState([]);
  const { userToken } = useContext(MainContext);
  console.log(userToken, "hospital");
  const baseInput = {
    hospital_id: userToken.hims_d_hospital_id,
    year: moment().year(),
    month: moment(new Date()).format("M"),
    department_id: null,
    sub_department_id: null,
    designation_id: null,
    group_id: null,
    hims_d_employee_id: null,
    emp_name: null,
    hims_d_employee_id: null,
    inputChanged: false
  };
  const [inputs, setInputs] = useState({ ...baseInput });

  // kind of works like componentDidMount but runs after the first render and runs once
  useEffect(() => {
    getHospitals();
    getEmpGroups(data => setEmpGroups(data));
  }, []);

  // To get the departments after branch changes
  useEffect(() => {
    if (inputs.hospital_id) {
      if (inputs.inputChanged) {
        clearOtherStates(["hospital_id"]);
      }
      getBranchDetails();
    }
  }, [inputs.hospital_id]);

  // To set the sub depts after department selected
  useEffect(() => {
    if (inputs.department_id && allDepartments.length !== 0) {
      if (inputs.inputChanged) {
        clearOtherStates(["hospital_id", "department_id"]);
      }
      const [reqDept] = allDepartments.filter(
        dept => dept.hims_d_department_id === inputs.department_id
      );
      if (reqDept) {
        setSubDepts(reqDept.subDepts);
      } else {
        swalMessage({
          title: "Please contact the admin, Error Code: 007",
          type: "error"
        });
      }
    } else {
      setSubDepts([]);
    }
  }, [inputs.department_id]);

  useEffect(() => {
    if (inputs.sub_department_id) {
      if (inputs.inputChanged) {
        clearOtherStates(["hospital_id", "department_id", "sub_department_id"]);
      }
      getDesignations(inputs.sub_department_id);
    }
  }, [inputs.sub_department_id]);

  function getHospitals() {
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          setHospitals(res.data.records);
        }
      },
      onFailure: err => { }
    });
  }

  function getBranchDetails() {
    algaehApiCall({
      uri: "/branchMaster/getBranchWiseDepartments",
      method: "GET",
      data: {
        hospital_id: inputs.hospital_id
      },
      module: "masterSettings",
      onSuccess: res => {
        if (res.data.success) {
          setDepts(res.data.records);
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  function getDesignations(sub_department_id) {
    algaehApiCall({
      uri: "/hrsettings/getDesignations",
      method: "GET",
      module: "hrManagement",
      data: {
        sub_department_id: sub_department_id
      },
      onSuccess: res => {
        if (res.data.success) {
          setDesignations(res.data.records);
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  function dropDownHandler(e) {
    const { name, value } = e;
    setInputs(state => ({
      ...state,
      [name]: value,
      inputChanged: true
    }));
  }

  function clearInputState(fields) {
    setInputs(state => ({
      ...state,
      ...fields
    }));
  }

  function clearOtherStates(fields) {
    setInputs(state => {
      const arr = [
        "department_id",
        "sub_department_id",
        "designation_id",
        "hims_d_employee_id",
        "emp_name",
        "hims_d_employee_id"
      ];
      const matches = arr.filter(element => !fields.includes(element));

      let result = { ...state };
      matches.forEach(fld => {
        result[fld] = null;
      });
      return result;
    });
  }

  function employeeSearch(e) {
    let input_data = " hospital_id=" + inputs.hospital_id;
    if (inputs.sub_department_id !== null) {
      input_data += " and  sub_department_id=" + inputs.sub_department_id;
      if (inputs.designation_id !== null) {
        input_data += " and employee_designation_id=" + inputs.designation_id;
      }
    }
    if (inputs.group_id !== null) {
      input_data += " and employee_group_id=" + inputs.group_id;
    }
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee
      },
      searchName: "employee_project",
      uri: "/gloabelSearch/get",
      inputs: input_data,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        console.log(row, "emp details");
        // let arr = employees;
        // arr.push(row);
        // getDesignations(row.sub_department_id);

        setInputs(state => ({
          ...state,
          hims_d_employee_id: row.hims_d_employee_id,
          emp_name: row.full_name,
          department_id: row.hims_d_department_id,
          sub_department_id: row.sub_department_id,
          designation_id: row.employee_designation_id,
          inputChanged: false
        }));
        // setEmployees(employees);
      }
    });
  }

  function clearState() {
    setInputs({ ...baseInput });
  }

  function loadFunc() {
    if (inputs.hospital_id) {
      props.loadFunc(inputs);
    } else {
      swalMessage({
        title: "Please select a hospital",
        type: "warning"
      });
    }
  }

  const handlers = (() => ({
    clearInputState,
    dropDownHandler,
    employeeSearch,
    clearState,
    loadFunc
  }))();

  return (
    <FilterContext.Provider
      value={{
        inputs,
        hospitals,
        allDepartments,
        subDepts,
        designations,
        empGroups,
        handlers
      }}
    >
      <FilterComponent loadFunc={props.loadFunc} />
    </FilterContext.Provider>
  );
}
