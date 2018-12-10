import React, { Component } from "react";
import "./groups.css";
import { AlagehFormGroup, AlgaehDataGrid } from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

class Groups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: []
    };
    this.getGroups();
  }

  getGroups() {
    algaehApiCall({
      uri: "/algaehappuser/selectAppGroup",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            groups: res.data.records
          });
        }
      },
      onError: err => {}
    });
  }

  addGroups() {
    algaehApiCall({
      uri: "",
      method: "POST",
      data: {
        app_group_code: this.state.app_group_code,
        app_group_name: this.state.app_group_name,
        app_group_desc: this.state.app_group_desc
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record added successfully",
            type: "success"
          });
        }
      },
      onError: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  deleteGroups() {}
  updateGroups() {}

  render() {
    return (
      <div className="groups">
        <div className="col-lg-12">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
              label={{
                forceLabel: "Group Code",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "app_group_code",
                value: this.state.app_group_code,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
              label={{
                forceLabel: "Group Name",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "app_group_name",
                value: this.state.app_group_name,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Group Description",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "app_group_desc",
                value: this.state.app_group_desc,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />
            <AlagehFormGroup
              div={{ className: "col-lg-2" }}
              label={{
                forceLabel: "Group Type",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "app_group_type",
                value: this.state.app_group_type,
                events: {
                  onChange: this.changeTexts.bind(this)
                }
              }}
            />

            <div className="col-lg-3">
              <button
                type="submit"
                style={{ marginTop: 21 }}
                onClick={this.addGroups.bind(this)}
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>

          <div data-validate="groupDiv" id="adminGrid_Cntr">
            <AlgaehDataGrid
              id="group-grid"
              datavalidate="data-validate='groupDiv'"
              columns={[
                {
                  fieldName: "app_group_code",
                  label: "Group Code",
                  disabled: true
                },
                {
                  fieldName: "app_group_name",
                  label: "Group Name"
                },
                {
                  fieldName: "app_group_desc",
                  label: "Group Description",
                  disabled: true
                },
                {
                  fieldName: "app_group_type",
                  label: "Group Type",
                  disabled: true
                }
              ]}
              keyId="algaeh_d_module_id"
              dataSource={{
                data: this.state.groups
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteGroups.bind(this),
                onDone: this.updateGroups.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Groups;
