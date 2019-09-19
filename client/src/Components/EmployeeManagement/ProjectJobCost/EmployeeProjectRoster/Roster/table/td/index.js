import React from "react";
import _ from "lodash";
import moment from "moment";
import TD from "./td";
export default React.memo(function(props) {
  const { row } = props;
  const { empProject } = row;

  return (
    <React.Fragment>
      {empProject.map(item => (
        <TD {...item} />
      ))}
    </React.Fragment>
  );
});
