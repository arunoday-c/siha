import React from "react";
import "./income.scss";
import { AlgaehFormGroup } from "../../../Wrappers";

export default function Income() {
  return (
    <div className="container-fluid">
      <h4>Income accounts</h4>
      <div className="card">
        <h5 className="card-header">New Income Account</h5>
        <div className="card-body">
          <div className="row">
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Income Name",
                isImp: true
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter Income Name",
                autocomplete: false
              }}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "IBAN",
                isImp: false
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: "Enter IBAN",
                autocomplete: false
              }}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "BIC",
                isImp: false
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter BIC",
                autocomplete: false
              }}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Account number",
                isImp: false
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter Account number",
                autocomplete: false
              }}
            />{" "}
            <div className="form-group algaeh-checkbox-fld col-xs-4 col-md-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="includeNetWorth"
                />
                <label className="form-check-label" for="includeNetWorth">
                  Include in net worth
                </label>
              </div>
            </div>
          </div>
        </div>{" "}
        <div class="card-footer text-muted ">
          <button className="btn btn-primary" style={{ float: "right" }}>
            Add to List
          </button>{" "}
          <button
            className="btn btn-default"
            style={{ float: "right", marginRight: 10 }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
