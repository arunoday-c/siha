import React, { Component } from "react";
import "./components.scss";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

class Components extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screens: []
    };
    this.getComponents();
    this.getScreens();
  }

  getScreens() {
    algaehApiCall({
      uri: "/algaehMasters/getAlgaehScreens",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            screens: response.data.records
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

  addComponents() {
    algaehApiCall({
      uri: "/algaehMasters/addAlgaehComponent",
      method: "POST",
      data: {
        screen_id: this.state.screen_id,
        component_code: this.state.component_code,
        component_name: this.state.component_name
      },
      onSuccess: response => {
        if (response.data.success) {
          this.getComponents();
          this.clearState();
          swalMessage({
            title: "Records added successfully",
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
                value: this.state.screen_id,
                dataSource: {
                  textField: "screen_name",
                  valueField: "algaeh_app_screens_id",
                  data: this.state.screens
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
                value: this.state.component_code,
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
                value: this.state.component_name,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <div className="col-lg-3">
              <button
                type="submit"
                style={{ marginTop: 19 }}
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
                  fieldName: "screen_id",
                  label: "Screen",
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
                data: this.state.components
              }}
              filter={true}
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
