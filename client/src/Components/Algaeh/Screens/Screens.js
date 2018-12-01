import React, { Component } from "react";
import "./screens.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";

class Screens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screens: [],
      modules: []
    };
  }

  clearState() {
    this.setState({
      screen_code: "",
      screen_name: "",
      page_to_redirect: "",
      module_id: null,
      other_language: ""
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  addScreens() {}
  deleteScreens() {}
  updateScreens() {}

  render() {
    return (
      <div className="screens">
        <div className="col-lg-12">
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Module"
              }}
              selector={{
                name: "module_id",
                className: "select-fld",
                value: this.state.module_id,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: this.state.modules
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Screen Code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "screen_code",
                value: this.state.screen_code,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Screen Name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "screen_name",
                value: this.state.screen_name,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Page to Redirect",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "page_to_redirect",
                value: this.state.page_to_redirect,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Other Language",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "other_language",
                value: this.state.other_language,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <div className="col-lg-3">
              <button
                type="submit"
                style={{ marginTop: 21 }}
                onClick={this.addScreens.bind(this)}
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>

          <div data-validate="shiftDiv" id="algaehGrid_Cntr">
            <AlgaehDataGrid
              id="shift-grid"
              datavalidate="data-validate='shiftDiv'"
              columns={[
                {
                  fieldName: "screen_code",
                  label: "Screen Code",
                  disabled: true
                },
                {
                  fieldName: "screen_name",
                  label: "Screen Name"
                },
                {
                  fieldName: "page_to_redirect",
                  label: "Page to Redirect",
                  disabled: true
                },
                {
                  fieldName: "module_id",
                  label: "Module"
                },
                {
                  fieldName: "other_languages",
                  label: "Other Language",
                  disabled: true
                }
              ]}
              keyId="algaeh_app_screens_id"
              dataSource={{
                data: this.state.screens
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteScreens.bind(this),
                onDone: this.updateScreens.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Screens;
