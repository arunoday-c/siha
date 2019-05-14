import React, { Component } from "react";
import "./groups.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { GROUP_TYPE } from "../../../utils/GlobalVariables.json";

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

  dropDownHandler(value) {
    debugger;
    this.setState({
      [value.name]: value.value
    });
  }

  deleteGroups() {}
  updateGroups() {}

  render() {
    return (
      <div className="groups">
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
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
              <AlagehAutoComplete
                div={{ className: "col-lg-2" }}
                label={{
                  forceLabel: "Group Type",
                  isImp: true
                }}
                selector={{
                  name: "group_type",
                  className: "select-fld",
                  value: this.state.group_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GROUP_TYPE
                  },

                  onChange: this.dropDownHandler.bind(this)
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
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Group List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div data-validate="groupDiv" id="GroupGrid_Cntr">
                  <AlgaehDataGrid
                    id="group-grid"
                    datavalidate="data-validate='groupDiv'"
                    columns={[
                      {
                        fieldName: "app_group_code",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Group Code"
                            }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "app_group_name",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Group Name"
                            }}
                          />
                        )
                      },
                      {
                        fieldName: "app_group_desc",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Group Description"
                            }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "app_group_type",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Group Type"
                            }}
                          />
                        ),
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
          </div>
        </div>
      </div>
    );
  }
}

export default Groups;
