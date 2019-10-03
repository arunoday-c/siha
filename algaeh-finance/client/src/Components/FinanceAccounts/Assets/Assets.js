// @flow
import React from "react";
import { Accordion } from "semantic-ui-react";
import "./assets.scss";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehDropDown
} from "../../../Wrappers";
import {
  country_list,
  currency_list,
  account_role
} from "../../../data/dropdownList";

export default function Assets() {
  const level1Panels = [
    { key: "panel-1a", title: "Bank Account" },
    { key: "panel-1a", title: "Cash in Hand" },
    {
      key: "panel-1a",
      title: "Accounts Receivable"
    },
    {
      key: "panel-1a",
      title: "Cheque Receivable"
    },
    { key: "panel-1a", title: "Inventory" },
    {
      key: "panel-1a",
      title: "Department Stock"
    },
    {
      key: "panel-1a",
      title: "Advance, Deposits and Pre-Payments"
    }
  ];

  const Level1Content = (
    <div>
      <div className="innerContentDiv">
        <span>
          {" "}
          <a className="btn btn-primary active">
            <i className="fas fa-plus" /> Add Child
          </a>{" "}
        </span>
        <span>
          {" "}
          <small>Total</small>
          SAR 4000
        </span>
      </div>
      <Accordion.Accordion panels={level1Panels} />
    </div>
  );
  const rootPanels = [
    {
      key: "panel-1",
      title: "Current assets",
      content: { content: Level1Content }
    },
    {
      key: "panel-2",
      title: "Non Current Assets"
    },
    {
      key: "panel-3",
      title: "Intangable Assets"
    }
  ];

  const AssetAccountNested = () => (
    <Accordion defaultActiveIndex={0} panels={rootPanels} styled />
  );

  return (
    <div className="container-fluid assetsModuleScreen">
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Asset Accounts</h3>
          </div>
          <div className="actions">
            {" "}
            <a className="btn btn-primary  active">
              <i className="fas fa-plus" /> New Account Heads
            </a>
          </div>
        </div>
        <div className="portlet-body">
          <div className="col">
            <div className="row">
              {" "}
              <AssetAccountNested></AssetAccountNested>
            </div>
          </div>
        </div>
      </div>

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
