import React, { useState } from "react";
import { AlagehAutoComplete } from "../../../Wrapper/algaehWrapper";
import { EmployeeFilter } from "../../../common/EmployeeFilter";

export default function BulkTimeSheet(props) {
  return (
    <div id="bulkManualTimeSheet">
      <div className="row inner-top-search">
        <EmployeeFilter
          loadFunc={result => {
            debugger;

            console.log("result", result);
          }}
        />
      </div>
      <div className="col-12">
        <p>Here error template</p>
      </div>
    </div>
  );
}
