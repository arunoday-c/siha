import React, { Component } from "react";
import "./ComponentElementAssignment.scss";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

class ComponentElementAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      roles: []
    };
    this.getGroups();
  }

  getGroups() {
    algaehApiCall({
      uri: "/algaehappuser/selectAppGroup",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ groups: response.data.records });
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

  getRoles(group_id) {
    algaehApiCall({
      uri: "/algaehappuser/selectRoles",
      method: "GET",
      data: {
        algaeh_d_app_group_id: group_id
      },
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ roles: response.data.records });
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

  dropDownHandler(value) {
    switch (value.name) {
      case "app_group_id":
        this.getRoles(value.value);
        this.setState({
          [value.name]: value.value
        });

        break;

      default:
        this.setState({
          [value.name]: value.value
        });
    }
  }

  loadModulesandScreens() {}

  render() {
    return (
      <div className="ComponentElementAssignment">
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{ forceLabel: "Select a Group", isImp: true }}
                    selector={{
                      name: "app_group_id",
                      className: "select-fld",
                      value: this.state.app_group_id,
                      dataSource: {
                        textField: "app_group_name",
                        valueField: "algaeh_d_app_group_id",
                        data: this.state.groups
                      },
                      onChange: this.dropDownHandler.bind(this),
                      others: {}
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{ forceLabel: "Select a Role", isImp: true }}
                    selector={{
                      name: "role_id",
                      className: "select-fld",
                      value: this.state.role_id,
                      dataSource: {
                        textField: "role_name",
                        valueField: "app_d_app_roles_id",
                        data: this.state.roles
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Define Component/Elements</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Select Module", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Select Screen", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                  <div className="col-6">
                    <div className="moduleList list-group-check">
                      <ul className="mainmenu">
                        <li className="activeLi">
                          <input type="checkbox" checked />
                          <a>Patient Details</a>
                        </li>
                        <li>
                          <input type="checkbox" />
                          <a>Other Details</a>
                        </li>
                        <li>
                          <input type="checkbox" />
                          <a>Consultation Details</a>
                        </li>
                        <li>
                          <input type="checkbox" />
                          <a>MLC Details</a>
                        </li>
                        <li>
                          <input type="checkbox" />
                          <a>Primary Insurance</a>
                        </li>
                        <li>
                          <input type="checkbox" />
                          <a>Secondary Details</a>
                        </li>
                        <li>
                          <input type="checkbox" />
                          <a>Copay Details</a>
                        </li>
                        <li>
                          <input type="checkbox" />
                          <a>Billing Details</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-6">
                    <div id="AlgaehElementsGrid_Cntr">
                      <AlgaehDataGrid
                        id="AlgaehElementsGrid"
                        datavalidate="AlgaehElementsGrid"
                        columns={[
                          {
                            fieldName: "selectElement",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Select" }} />
                            ),
                            others: {
                              maxWidth: 50
                            }
                          },
                          {
                            fieldName: "elementname",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Element Name" }}
                              />
                            ),
                            others: {
                              textAlign: "left"
                            }
                          },
                          {
                            fieldName: "mandatoryFld",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Mandatory" }}
                              />
                            ),
                            others: {
                              maxWidth: 80
                            }
                          }
                        ]}
                        keyId=""
                        dataSource={{ data: [] }}
                        isEditable={false}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        events={{}}
                        others={{}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ComponentElementAssignment;
