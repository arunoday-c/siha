import React, { useEffect, useState } from "react";
import { AlgaehMessagePop } from "algaeh-react-components";
import { algaehApiCall } from "../../../utils/algaehApiCall";

function ChartEntry({ data = [], toggle = true }) {
  const [childArr, setChildArr] = useState(null);
  const [childToggle, setChildToggle] = useState(false);
  const [current, setCurrent] = useState(null);

  function toggleChild(emp, e) {
    if (emp.hims_d_employee_id === current && childToggle) {
      setCurrent(null);
      setChildToggle(false);
      setChildArr([]);
    } else {
      if (emp) {
        setCurrent(emp.hims_d_employee_id);
        setChildArr(emp.children);
        setChildToggle(true);
      }
    }
  }

  return (
    <>
      <div>
        <ul
          style={{
            minHeight: toggle ? "85vh" : "0",
          }}
          className="eachShelf"
        >
          {data.map((item) => {
            return (
              <li
                id="sub-child"
                onClick={(e) => toggleChild(item, e)}
                className={`eachChild animated slideInLeft faster ${
                  current === item.hims_d_employee_id ? "clickedLi" : ""
                }`}
              >
                <span className="childCount">{item.count || 0}</span>

                <span className="contentSection">
                  <p>{item.employee_name}</p>
                  <p>{item.designation}</p>
                  <p>Employee Code:{item.employee_code}</p>
                  <p> Department:{item.sub_department_name}</p>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      {childArr && childToggle ? (
        <ChartEntry
          data={childArr}
          toggle={childToggle}
          key={childArr[0].hims_d_employee_id}
        />
      ) : null}
    </>
  );
}

export function EmployeeOrgChart() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    algaehApiCall({
      uri: "/branchMaster/getEmployeeReportingTo",
      method: "GET",
      module: "masterSettings",

      onSuccess: (res) => {
        if (res.data.success) {
          setEmployees([res.data.records]);
        } else {
          AlgaehMessagePop({
            title: res.data.records.message,
            type: "warning",
          });
        }
      },
      onError: (err) => {
        AlgaehMessagePop({
          title: err.message,
          type: "error",
        });
      },
    });
  }, []);

  return (
    <div className="DepartmentOrgView">
      <ChartEntry data={employees} toggle={true} />
    </div>
  );
}
