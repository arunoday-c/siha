// @flow
import React from "react";
import "./assets.scss";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehDropDown
} from "../../Wrappers";
import { country_list } from "../../data/country_list";
export default function Assets() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <h1>Algaeh UI Component</h1>
        </div>
      </div>
      <hr></hr>
      <form>
        <div className="row">
          <AlgaehFormGroup
            div={{ className: "form-group algaeh-text-fld col-xs-4 col-md-3" }}
            label={{
              forceLabel: "Enter Text",
              isImp: true
            }}
            textBox={{
              type: "text",
              value: "",
              className: "form-control",
              id: "name",
              placeholder: " Enter Text",
              autocomplete: false
            }}
          />
          <AlgaehFormGroup
            div={{
              className: "form-group algaeh-number-fld col-xs-4 col-md-3"
            }}
            label={{
              forceLabel: "Enter Number",
              isImp: true
            }}
            textBox={{
              type: "number",
              value: "",
              className: "form-control",
              id: "name",
              placeholder: " Enter Number",
              autoComplete: false
            }}
          />
          <AlgaehFormGroup
            div={{
              className: "form-group algaeh-email-fld col-xs-4 col-md-3"
            }}
            label={{
              forceLabel: "Enter Email Address",
              isImp: true
            }}
            textBox={{
              type: "email",
              value: "",
              className: "form-control",
              id: "name",
              placeholder: " Enter Email Address",
              autocomplete: "false"
            }}
          />
          <AlgaehDateHandler
            div={{ className: "form-group algaeh-email-fld col-xs-4 col-md-3" }}
            label={{
              forceLabel: "Enter Full Date",
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
          <AlgaehFormGroup
            div={{ className: "form-group algaeh-time-fld col-xs-4 col-md-3" }}
            label={{
              forceLabel: "Enter Time",
              isImp: true
            }}
            textBox={{
              type: "time",
              value: "",
              className: "form-control",
              id: "name",
              placeholder: " Enter Time",
              autocomplete: false
            }}
          />
          <AlgaehDropDown
            div={{
              className: "form-group algaeh-select-fld col-xs-4 col-md-3"
            }}
            label={{
              forceLabel: "Select Country",
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
              data: country_list
            }}
          />
          <div className="form-group algaeh-multi-select-fld col-xs-4 col-md-3">
            <label for="exampleFormControlSelect2" className="control-label">
              Example multiple select
            </label>
            <select
              multiple
              className="form-control"
              id="exampleFormControlSelect2"
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          <AlgaehFormGroup
            div={{
              className: "form-group algaeh-textarea-fld col-xs-4 col-md-3"
            }}
            label={{
              forceLabel: "Example textarea",
              isImp: true
            }}
            textBox={{
              name: "textarea",
              type: "text",
              value: "",
              className: "form-control",
              placeholder: " Enter Text",
              autocomplete: false
            }}
            multiline={true}
            no_of_lines={4}
          />
          <AlgaehFormGroup
            div={{
              className: "form-group algaeh-file-fld col-xs-4 col-md-3"
            }}
            label={{
              forceLabel: "Example file input",
              isImp: true
            }}
            textBox={{
              name: "textarea",
              type: "file",
              value: "",
              className: "form-control-file",
              placeholder: "Choose",
              autocomplete: false
            }}
          />
          <AlgaehFormGroup
            div={{
              className: "form-group algaeh-range-fld col-xs-4 col-md-3"
            }}
            label={{
              forceLabel: "Example Range input",
              isImp: true
            }}
            textBox={{
              name: "rage",
              type: "range",
              className: "form-control-range"
            }}
          />

          <div className="form-group algaeh-checkbox-fld col-xs-4 col-md-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="defaultCheck1"
              />
              <label className="form-check-label" for="defaultCheck1">
                Default checkbox
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="defaultCheck2"
                disabled
              />
              <label className="form-check-label" for="defaultCheck2">
                Disabled checkbox
              </label>
            </div>
          </div>
          <div className="form-group algaeh-radio-fld col-xs-4 col-md-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios1"
                value="option1"
                checked
              />
              <label className="form-check-label" for="exampleRadios1">
                Default radio
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios2"
                value="option2"
              />
              <label className="form-check-label" for="exampleRadios2">
                Second default radio
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios3"
                value="option3"
                disabled
              />
              <label className="form-check-label" for="exampleRadios3">
                Disabled radio
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
