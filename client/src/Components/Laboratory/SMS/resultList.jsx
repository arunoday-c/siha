import React, { memo, useContext } from "react";
import { LabContext } from "./index";
import ValidateList from "./validateList";
export default memo(function ResultList(props) {
  const { STATUS, DATE_RANGE } = useContext(LabContext);

  if (STATUS === "V") {
    return (
      <ValidateList
        {...props}
        from_date={Array.isArray(DATE_RANGE) ? DATE_RANGE[0] : undefined}
        to_date={Array.isArray(DATE_RANGE) ? DATE_RANGE[1] : undefined}
      />
    );
  } else {
    return null;
  }
});
