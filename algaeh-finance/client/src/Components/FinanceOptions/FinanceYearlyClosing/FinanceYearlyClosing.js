import React from "react";
import "./FinanceYearlyClosing.scss";
// import { DatePicker } from "antd";
import {
  AlgaehDateHandler,
  AlgaehAutoComplete,
  // AlgaehFormGroup,
} from "algaeh-react-components";
export default function FinanceYearlyClosing() {
  return (
    <div className="FinanceYearlyClosingScreen">
      <div className="row inner-top-search">
        <AlgaehDateHandler
          type={"year"}
          div={{
            className: "col-1 form-group",
          }}
          label={{
            forceLabel: "Select Year",
          }}
          textBox={{
            name: "selectRange",
            value: "",
          }}
          // maxDate={moment().add(1, "days")}
          events={{}}
          // others={{
          //   ...format,
          // }}
        />
        <AlgaehDateHandler
          type={"range"}
          div={{
            className: "col-2 form-group",
          }}
          label={{
            forceLabel: "Selected Date",
          }}
          textBox={{
            name: "selectRange",
            value: "",
          }}
          // maxDate={moment().add(1, "days")}
          events={{}}
          // others={{
          //   ...format,
          // }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Select Account",
            isImp: true,
          }}
          selector={{
            name: "default_cost_center_id",
            value: "",
            dataSource: {
              data: "",
              valueField: "cost_center_id",
              textField: "cost_center",
            },
            // onChange: '',
          }}
        />
        <div className="col">
          <label>Current Amount</label>
          <h6>0.00</h6>
        </div>{" "}
        <div className="col">
          <label>New Amount</label>
          <h6>0.00</h6>
        </div>{" "}
        <div className="col">
          <label>Final Amount</label>
          <h6>0.00</h6>
        </div>{" "}
        <div className="col">
          <label>Is Closed</label>
          <div className="customCheckbox">
            <label className="checkbox inline">
              <input
                type="checkbox"
                value="Y"
                // onChange={handleChange}
                name="allow_negative_balance"
                // checked={allow_negative_balance === "Y"}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>{" "}
        <div className="col" style={{ marginTop: 21 }}>
          <button className="btn btn-primary btn-small">Add to List</button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">Grid Come here</div>
      </div>
    </div>
  );
}
