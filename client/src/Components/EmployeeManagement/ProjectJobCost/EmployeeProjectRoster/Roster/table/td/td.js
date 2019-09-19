import React from "react";
export default React.memo(function(props) {
  console.log("Project", props);
  return (
    <td className="time_cell editAction">
      <span>{props.abbreviation}</span>
    </td>
  );
});
