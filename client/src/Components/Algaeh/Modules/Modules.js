import React, { Component } from "react";
import "./modules.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";

class Modules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: []
    };
    this.getModules();
  }

  getModules() {
    algaehApiCall({
      uri: "/algaehMasters/getAlgaehModules",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            modules: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "success"
        });
      }
    });
  }

  clearState() {
    this.setState({
      module_code: "",
      module_name: "",
      licence_key: "",
      access_by: "",
      icons: "",
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

  addModules() {
    algaehApiCall({
      uri: "/algaehMasters/addAlgaehModule",
      method: "POST",
      data: {
        module_code: this.state.module_code,
        module_name: this.state.module_name,
        licence_key: this.state.licence_key,
        access_by: this.state.access_by,
        icons: this.state.icons,
        other_language: this.state.other_language
      },
      onSuccess: response => {
        if (response.data.success) {
          this.getModules();
          this.clearState();
          swalMessage({
            title: "Added Successfully",
            type: "success"
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "success"
        });
      }
    });
  }
  deleteModules() {}
  updateModules() {}

  render() {
    return (
      <div className="modules">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Module Code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "module_code",
                value: this.state.module_code,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Module Name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "module_name",
                value: this.state.module_name,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Licence Key",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "licence_key",
                value: this.state.licence_key,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Icon",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "icons",
                value: this.state.icons,
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
            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Access By"
              }}
              selector={{
                name: "access_by",
                className: "select-fld",
                value: this.state.access_by,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.ACCESS_BY
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-1" }}
              label={{
                forceLabel: "Display Order",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "display_order",
                value: this.state.display_order,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "number"
                }
              }}
            />

            <div className="col-lg-3">
              <button
                type="submit"
                style={{ marginTop: 21 }}
                onClick={this.addModules.bind(this)}
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
                  fieldName: "module_code",
                  label: "Module Code",
                  disabled: true
                },
                {
                  fieldName: "module_name",
                  label: "Module Name"
                },

                {
                  fieldName: "icons",
                  label: "Icons"
                },
                {
                  fieldName: "other_language",
                  label: "Other Language"
                },
                {
                  fieldName: "licence_key",
                  label: "Licence Key"
                },
                {
                  fieldName: "display_order",
                  label: "Display Order"
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
                onDelete: this.deleteModules.bind(this),
                onDone: this.updateModules.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Modules;
