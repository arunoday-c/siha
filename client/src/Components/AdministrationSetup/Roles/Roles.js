import React, { Component } from "react";
import "./roles.css";
import {
  AlgaehDataGrid,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";

class Roles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: []
    };
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  deleteRoles() {}
  updateRoles() {}
  addRoles() {}

  render() {
    return (
      <div className="roles">
        <div className="col-lg-12">
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Group"
              }}
              selector={{
                name: "app_group_id",
                className: "select-fld",
                value: this.state.app_group_id,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: this.state.groups
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Role Code",
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
                forceLabel: "Role Name",
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
                forceLabel: "Role Description",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "role_discreption",
                value: this.state.role_discreption,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Role Type",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "role_type",
                value: this.state.role_type,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <div className="col-lg-3">
              <button
                type="submit"
                style={{ marginTop: 21 }}
                onClick={this.addRoles.bind(this)}
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
                  label: "Group",
                  disabled: true
                },
                {
                  fieldName: "screen_name",
                  label: "Role Code"
                },
                {
                  fieldName: "screen_name",
                  label: "Role Name"
                },
                {
                  fieldName: "page_to_redirect",
                  label: "Role Description",
                  disabled: true
                },
                {
                  fieldName: "module_id",
                  label: "Role Type"
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
                onDelete: this.deleteRoles.bind(this),
                onDone: this.updateRoles.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Roles;
