import React, { useEffect, useState, createContext } from "react";
import { AlgaehOpenContainer } from "../../../utils/GlobalFunctions";
import { FilterComponent } from ".";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehSearch from "../../Wrapper/globalSearch";

export const FilterContext = createContext(null);

export default function EmployeeFilter(props) {
  const [hospitals, setHospitals] = useState([]);
  const [allDepartments, setDepts] = useState([]);
  const [subDepts, setSubDepts] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [inputs, setInputs] = useState({ ...props.getParentState() });

  // kind of works like componentDidMount but runs after the first render and runs once
  useEffect(() => {
    getHospitals();
  }, []);

  // To get the departments after branch changes
  useEffect(() => {
    if (inputs.hospital_id) {
      getBranchDetails();
    }
  }, [inputs.hospital_id]);

  // To set the sub depts after department selected
  useEffect(() => {
    if (inputs.department_id && allDepartments.length !== 0) {
      const [reqDept] = allDepartments.filter(
        dept => dept.hims_d_department_id === inputs.department_id
      );
      setSubDepts(reqDept.subDepts);
    } else {
      setSubDepts([]);
    }
  }, [inputs.department_id]);

  useEffect(() => {
    if (inputs.sub_department_id) {
      getDesignations(inputs.sub_department_id);
    }
  }, [inputs.sub_department_id]);

  useEffect(() => {
    props.updateParentState(inputs);
  }, [inputs]);

  function getHospitals() {
    algaehApiCall({
      uri: "/organization/getOrganization",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          setHospitals(res.data.records);
        }
      },
      onFailure: err => {}
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
      [name]: value
    }));
  }

  function clearInputState(fields) {
    setInputs(state => ({
      ...state,
      ...fields
    }));
  }

  function employeeSearch(e) {
    let input_data = "";
    if (inputs.sub_department_id !== null) {
      input_data += " sub_department_id=" + inputs.sub_department_id;
      if (inputs.designation_id !== null) {
        input_data += " and employee_designation_id=" + inputs.designation_id;
      }
    } else {
      input_data = "1=1";
    }
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee
      },
      searchName: "employee",
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
          designation_id: row.employee_designation_id
        }));
        // setEmployees(employees);
      }
    });
  }

  const handlers = (() => ({
    clearInputState,
    dropDownHandler,
    employeeSearch
  }))();

  return (
    <FilterContext.Provider
      value={{
        inputs,
        hospitals,
        allDepartments,
        subDepts,
        designations,
        handlers
      }}
    >
      <FilterComponent loadFunc={props.loadFunc} />
    </FilterContext.Provider>
  );
}
