// @flow
import React from "react";
import "./assets.scss";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehDropDown
} from "../../Wrappers";
import {
  country_list,
  currency_list,
  account_role
} from "../../data/dropdownList";
export default function Assets() {
  return (
    <div className="container-fluid">
      <h4>Asset accounts</h4>
      <div className="card">
        <h5 className="card-header">New Asset Account</h5>
        <div className="card-body">
          <div className="row">
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Asset Name",
                isImp: true
              }}
              textBox={{
                type: "text",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter Asset Name",
                autocomplete: false
              }}
            />{" "}
            <AlgaehDropDown
              div={{
                className: "form-group algaeh-select-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Select Default Currency",
                isImp: true
              }}
              selector={{
                className: "form-control",
                name: "country",
                onChange: "value"
              }}
              dataSource={{
                textField: "name",
                valueField: "value",
                data: currency_list
              }}
            />{" "}
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "IBAN",
                isImp: true
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
                isImp: true
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
                isImp: true
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
            <AlgaehFormGroup
              div={{
                className: "form-group algaeh-text-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Opening Balance",
                isImp: true
              }}
              textBox={{
                type: "number",
                value: "",
                className: "form-control",
                id: "name",
                placeholder: " Enter Opening Balance",
                autocomplete: false
              }}
            />
            <AlgaehDateHandler
              div={{
                className: "form-group algaeh-email-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Opening balance date",
                isImp: true
              }}
              textBox={{
                name: "enter_date",
                className: "form-control"
              }}
              events={{
                onChange: e => console.log(e.target)
              }}
              value={new Date()}
              maxDate={new Date()}
              minDate={new Date()}
            />
            <AlgaehDropDown
              div={{
                className: "form-group algaeh-select-fld col-xs-4 col-md-3"
              }}
              label={{
                forceLabel: "Select Account role",
                isImp: true
              }}
              selector={{
                className: "form-control",
                name: "country",
                onChange: "value"
              }}
              dataSource={{
                textField: "name",
                valueField: "value",
                data: account_role
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
