import React, { Component } from "react";
import "./components.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";

class Components extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screens: []
    };
  }

  clearState() {
    this.setState({
      screen_id: null,
      component_code: "",
      component_name: ""
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

  addComponents() {}
  deleteComponents() {}
  updateComponents() {}

  render() {
    return (
      <div className="components">
        <div className="col-lg-12">
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Screen"
              }}
              selector={{
                name: "screen_id",
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
                forceLabel: "Component Code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "component_code",
                value: this.state.screen_code,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Component Name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "component_name",
                value: this.state.screen_name,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <div className="col-lg-3">
              <button
                type="submit"
                style={{ marginTop: 21 }}
                onClick={this.addComponents.bind(this)}
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
                  fieldName: "module_id",
                  label: "Module",
                  disabled: true
                },
                {
                  fieldName: "component_code",
                  label: "Component Code"
                },
                {
                  fieldName: "component_name",
                  label: "Component Name",
                  disabled: true
                }
              ]}
              keyId="algaeh_d_module_id"
              dataSource={{
                data: this.state.modules
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteComponents.bind(this),
                onDone: this.updateComponents.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Components;
