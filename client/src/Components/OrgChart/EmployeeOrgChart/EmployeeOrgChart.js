import React, { useEffect, useState } from "react";
import "./EmployeeView.scss";
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
      <ul className="flex-container">
        {data.map((item) => {
          return (
            <li
              id="sub-child"
              onClick={(e) => toggleChild(item, e)}
              className={`flex-item animated slideInLeft faster ${
                current === item.hims_d_employee_id ? "clickedLi" : ""
              }`}
            >
              <span className="childCount">{item.count || 0}</span>
              <span className="imgSection">
                <img src="" />
              </span>
              <span className="contentSection">
                <small>{item.employee_code}</small>
                <h1>{item.employee_name}</h1>
                <p>{item.designation}</p>
                <p>{item.sub_department_name}</p>
              </span>
            </li>
          );
        })}
      </ul>
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
    <div className="EmployeeOrgViewFlex">
      <ChartEntry data={employees} toggle={true} />
    </div>
  );
}
