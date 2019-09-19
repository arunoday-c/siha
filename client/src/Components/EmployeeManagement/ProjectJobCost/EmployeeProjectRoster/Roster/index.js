import React, { createContext, useState } from "react";
import Index from "./employeeProjectRoster.html";
export const ProjectRosterContext = createContext(undefined);

export default function(props) {
  const [projectRoster, setProjectRoster] = useState({
    employees: [],
    inputs: {},
    totalRosters: 0
  });

  function setProjectRosterState(options) {
    setProjectRoster({ ...projectRoster, ...options });
  }
  function getProjectRosterState() {
    return projectRoster;
  }
  return (
    <ProjectRosterContext.Provider
      value={{ setProjectRosterState, getProjectRosterState }}
    >
      <Index {...props} />
    </ProjectRosterContext.Provider>
  );
}
