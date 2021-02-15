import React, { createContext, useState } from "react";
import Index from "./employeeProjectRoster.html";
import { getEmployeesForProjectRoster } from "./employeeProjectRoster.event";
export const ProjectRosterContext = createContext(undefined);

export default function (props) {
  const [projectRoster, setProjectRoster] = useState({
    employees: [],
    filterEmployees: [],
    filterTrue: false,
    selectedFilter: "0",
    inputs: {},
    dates: [],
    total_rosted: 0,
    total_non_rosted: 0,
    fromDate: "",
    toDate: "",
    hospitals: []
  });

  function setProjectRosterState(options) {
    setProjectRoster({ ...projectRoster, ...options });
  }
  function getProjectRosterState() {
    return projectRoster;
  }
  return (
    <ProjectRosterContext.Provider
      value={{
        setProjectRosterState,
        getProjectRosterState,
        getEmployeesForProjectRoster
      }}
    >
      <Index {...props} />
    </ProjectRosterContext.Provider>
  );
}
