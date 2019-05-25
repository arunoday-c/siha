import React, { Component } from "react";
import "./modules.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
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
      other_language: "",
      display_order: ""
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
        other_language: this.state.other_language,
        display_order: this.state.display_order
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

  onchangegridcol(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  deleteModules() {}

  updateModules(data) {
    algaehApiCall({
      uri: "/algaehMasters/updateAlgaehModules",
      method: "PUT",
      data: {
        algaeh_d_module_id: data.algaeh_d_module_id,
        module_plan: data.module_plan,
        display_order: data.display_order
      },
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

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
              div={{ className: "col-lg-2" }}
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

            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{
                forceLabel: "Module Plan"
              }}
              selector={{
                name: "module_plan",
                className: "select-fld",
                value: this.state.module_plan,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.MODULE_PLAN
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <div className="col-lg-2">
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
                  label: <AlgaehLabel label={{ forceLabel: "Module Code" }} />,
                  disabled: true
                },
                {
                  fieldName: "module_name",
                  label: <AlgaehLabel label={{ forceLabel: "Module Name" }} />,
                  disabled: true
                },
                {
                  fieldName: "module_plan",
                  label: <AlgaehLabel label={{ forceLabel: "Module Plan" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.module_plan === "S"
                          ? "Silver"
                          : row.module_plan === "G"
                          ? "Gold"
                          : "Platinum"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{}}
                        selector={{
                          name: "module_plan",
                          className: "select-fld",
                          value: row.module_plan,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.MODULE_PLAN
                          },
                          onChange: this.onchangegridcol.bind(this, row)
                        }}
                      />
                    );
                  }
                },

                {
                  fieldName: "icons",
                  label: <AlgaehLabel label={{ forceLabel: "Icons" }} />,
                  disabled: true
                },
                {
                  fieldName: "other_language",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Other Language" }} />
                  ),
                  disabled: true
                },
                {
                  fieldName: "licence_key",
                  label: <AlgaehLabel label={{ forceLabel: "Licence Key" }} />,
                  disabled: true
                },
                {
                  fieldName: "display_order",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Display Order" }} />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{}}
                        textBox={{
                          value: row.display_order,
                          className: "txt-fld",
                          name: "display_order",
                          events: {
                            onChange: this.onchangegridcol.bind(this, row)
                          },
                          others: {
                            type: "number"
                          }
                        }}
                      />
                    );
                  }
                }
              ]}
              keyId="algaeh_d_module_id"
              dataSource={{
                data: this.state.modules
              }}
              filter={true}
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
