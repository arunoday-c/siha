import React from "react";
// import React, { useState, useEffect } from "react";
// import { Modal } from "antd";
// import moment from "moment";

import "./costCenterMaster.scss";
import {
  AlgaehFormGroup,
  // AlgaehDateHandler,
  // AlgaehAutoComplete,
  // AlgaehDataGrid,
  // AlgaehTreeSearch,
  // AlgaehMessagePop,
  // AlgaehFormGroupGrid,
  // AlgaehButton
} from "algaeh-react-components";

export default function CostCenterMaster(props) {
  return (
    <div className="costCenterMaster">
      <div
        className="row inner-top-search margin-bottom-15"
        style={{ paddingBottom: "10px" }}
      >
        <AlgaehFormGroup
          div={{
            className: "col form-group"
          }}
          label={{
            forceLabel: "Invoice No.",
            isImp: true
          }}
          textBox={{
            type: "text",
            className: "form-control",
            placeholder: "Enter Invoice No.",
            value: ""
          }}
        />
      </div>
    </div>
  );
}
