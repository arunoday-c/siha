import React, { Component } from "react";
import "./screen_elements.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";

class ScreenElements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      components: [],
      screen_elements: []
    };
  }

  clearState() {
    this.setState({
      screen_element_code: "",
      screen_element_name: "",
      screen_element_name: null
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

  addScreenElements() {}
  deleteScreenElements() {}
  updateScreenElements() {}

  render() {
    return (
      <div className="screen_elements">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Screen Element Code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "screen_element_code",
                value: this.state.screen_element_code,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Screen Element Name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "screen_element_name",
                value: this.state.screen_element_name,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Component"
              }}
              selector={{
                name: "component_id",
                className: "select-fld",
                value: this.state.component_id,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: this.state.components
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <div className="col-lg-3">
              <button
                type="submit"
                style={{ marginTop: 21 }}
                onClick={this.addScreenElements.bind(this)}
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
                  fieldName: "screen_element_code",
                  label: "Screen Element Code"
                },
                {
                  fieldName: "screen_element_name",
                  label: "Screen Element Name"
                },
                {
                  fieldName: "component_id",
                  label: "Component"
                }
              ]}
              keyId="algaeh_d_module_id"
              dataSource={{
                data: this.state.screen_elements
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteScreenElements.bind(this),
                onDone: this.updateScreenElements.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ScreenElements;
