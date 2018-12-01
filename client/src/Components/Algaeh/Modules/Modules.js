import React, { Component } from "react";
import "./modules.css";
import { AlagehFormGroup, AlgaehDataGrid } from "../../Wrapper/algaehWrapper";

class Modules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: []
    };
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

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  addModules() {}
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
                  fieldName: "shift_code",
                  label: "Module Code",
                  disabled: true
                },
                {
                  fieldName: "module_name",
                  label: "Module Name"
                },
                {
                  fieldName: "licence_key",
                  label: "Licence Key",
                  disabled: true
                },
                {
                  fieldName: "icons",
                  label: "Icons"
                },
                {
                  fieldName: "other_languages",
                  label: "Other Language",
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
