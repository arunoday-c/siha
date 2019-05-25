import React, { Component } from "react";
import "./screen_elements.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

class ScreenElements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      components: [],
      screen_elements: []
    };
    this.getComponents();
    this.getScreenElements();
  }

  getScreenElements() {
    algaehApiCall({
      uri: "/algaehMasters/getAlgaehScreenElement",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            screen_elements: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  getComponents() {
    algaehApiCall({
      uri: "/algaehMasters/getAlgaehComponents",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            components: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  addScreenElements() {
    algaehApiCall({
      uri: "/algaehMasters/addAlgaehScreenElement",
      method: "POST",
      data: {
        screen_element_code: this.state.screen_element_code,
        screen_element_name: this.state.screen_element_name,
        component_id: this.state.component_id
      },
      onSuccess: response => {
        if (response.data.success) {
          this.getScreenElements();
          this.clearState();
          swalMessage({
            title: "Records Added Successfully",
            type: "success"
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  clearState() {
    this.setState({
      screen_element_code: "",
      screen_element_name: "",
      component_id: null
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

  deleteScreenElements() {}
  updateScreenElements() {}

  render() {
    return (
      <div className="screen_elements">
        <div className="col-lg-12">
          <div className="row">
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
                  textField: "component_name",
                  valueField: "algaeh_d_app_component_id",
                  data: this.state.components
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

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

          <div data-validate="screenElementDiv" id="algaehGrid_Cntr">
            <AlgaehDataGrid
              id="shift-grid"
              datavalidate="data-validate='screenElementDiv'"
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
              filter={true}
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
