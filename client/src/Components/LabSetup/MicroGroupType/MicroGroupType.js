import React, { Component } from "react";
import "./MicroGroupType.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  AlgaehValidation,
  AlgaehOpenContainer
} from "../../../utils/GlobalFunctions";
import swal from "sweetalert2";
import moment from "moment";
import _ from "lodash";

class DeptMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      microGroups: [],
      microAntbiotic: [],
      showGroupAntibiotic: false,
      group_code: null,
      group_name: null,
      arabic_group_name: null,
      group_type: null,
      antibiotic_id: null
    };

    this.getmicroGroups();
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  textHandle(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({ [name]: value });
  }

  resetSaveState() {
    this.setState({
      group_code: null,
      group_name: null,
      arabic_group_name: null,
      antibiotic_id: null,
      group_type: null
    });
  }

  updateMicroGroup(data) {
    let send_data = {
      hims_d_micro_group_id: data.hims_d_micro_group_id,
      group_code: data.group_code,
      group_name: data.group_name,
      group_status: data.group_status,
      group_type: data.group_type,
      arabic_group_name: data.arabic_group_name,
      group_status: data.group_status
    };
    algaehApiCall({
      uri: "/labmasters/updateMicroGroup",
      method: "PUT",
      data: send_data,
      module: "laboratory",

      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });
          this.getmicroGroups();
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

  updateGroupAntiMap(data) {
    debugger;
    let send_data = {
      hims_m_group_antibiotic_id: data.hims_m_group_antibiotic_id,
      micro_group_id: data.micro_group_id,
      antibiotic_id: data.antibiotic_id,
      map_status: data.map_status
    };
    algaehApiCall({
      uri: "/labmasters/updateGroupAntiMap",
      method: "PUT",
      data: send_data,
      module: "laboratory",

      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully",
            type: "success"
          });
          this.getAllGroupAntibiotic(data.micro_group_id);
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

  getmicroGroups() {
    algaehApiCall({
      uri: "/labmasters/selectMicroGroup",
      module: "laboratory",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ microGroups: response.data.records });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });

    this.props.getAntibiotic({
      uri: "/labmasters/selectAntibiotic",
      module: "laboratory",
      method: "GET",
      data: { antibiotic_status: "A" },
      redux: {
        type: "ANTIBIOTIC_GET_DATA",
        mappingName: "antibiotic"
      }
    });
  }

  getAllGroupAntibiotic(id) {
    algaehApiCall({
      uri: "/labmasters/selectGroupAntiMap",
      module: "laboratory",
      data: { micro_group_id: id },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ microAntbiotic: response.data.records });
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

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  addGroupAntibiotic(data, e) {
    debugger;
    this.getAllGroupAntibiotic(data.hims_d_micro_group_id);
    this.setState({
      showGroupAntibiotic: true,
      depNametoAdd: data.group_name,
      hims_d_micro_group_id: data.hims_d_micro_group_id
    });
  }

  addGroupAntiMap(e) {
    debugger;

    e.preventDefault();
    AlgaehValidation({
      querySelector: "data-validate='subdepDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        let sen_data = {
          micro_group_id: this.state.hims_d_micro_group_id,
          antibiotic_id: this.state.antibiotic_id
        };

        algaehApiCall({
          uri: "/labmasters/insertGroupAntiMap",
          method: "POST",
          data: sen_data,
          module: "laboratory",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Added Successfully",
                type: "success"
              });
              this.resetSaveState();
              this.getAllGroupAntibiotic(this.state.hims_d_micro_group_id);
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
    });
  }

  addMicroGroup(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        let send_data = {
          group_code: this.state.group_code,
          group_name: this.state.group_name,
          group_status: this.state.group_status,
          group_type: this.state.group_type,
          arabic_group_name: this.state.arabic_group_name
        };

        algaehApiCall({
          uri: "/labmasters/insertMicroGroup",
          method: "POST",
          data: send_data,
          module: "laboratory",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Added Successfully",
                type: "success"
              });
              this.resetSaveState();
              this.getmicroGroups();
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
    });
  }

  onClose() {
    this.setState({ microAntbiotic: [], showGroupAntibiotic: false });
  }

  render() {
    return (
      <div className="dept">
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Map Antibioties"
          openPopup={this.state.showGroupAntibiotic}
        >
          <div className="popupInner">
            <div className="col-12">
              <div className="row margin-top-15" data-validate="subdepDiv">
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group mandatory" }}
                  label={{ forceLabel: "Select Antibiotic", isImp: true }}
                  selector={{
                    name: "antibiotic_id",
                    className: "select-fld",
                    value: this.state.antibiotic_id,
                    dataSource: {
                      textField: "antibiotic_name",
                      valueField: "hims_d_antibiotic_id",
                      data: this.props.antibiotic
                    },

                    onChange: this.textHandle.bind(this),
                    onClear: () => {
                      this.setState({
                        antibiotic_id: null
                      });
                    }
                  }}
                />

                <div className="col align-middle">
                  <br />

                  <button
                    className="btn btn-primary"
                    onClick={this.addGroupAntiMap.bind(this)}
                  >
                    Add to List
                  </button>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-lg-12"
                  data-validate="subdepdd"
                  id="subdepddCntr"
                >
                  <AlgaehDataGrid
                    datavalidate="data-validate='subdepdd'"
                    id="sub_dep_grid"
                    columns={[
                      {
                        fieldName: "antibiotic_id",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Antibiotics Name" }}
                          />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.antibiotic === undefined
                              ? []
                              : this.props.antibiotic.filter(
                                  f =>
                                    f.hims_d_antibiotic_id === row.antibiotic_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].antibiotic_name
                                : ""}
                            </span>
                          );
                        },

                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{}}
                              selector={{
                                name: "antibiotic_id",
                                className: "select-fld",
                                value: row.antibiotic_id,
                                dataSource: {
                                  textField: "antibiotic_name",
                                  valueField: "hims_d_antibiotic_id",
                                  data: this.props.antibiotic
                                },

                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        }
                      },

                      {
                        fieldName: "map_status",
                        label: <label className="style_Label">Status</label>,
                        displayTemplate: row => {
                          return row.map_status === "A" ? "Active" : "Inactive";
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{}}
                              selector={{
                                name: "map_status",
                                className: "select-fld",
                                value: row.map_status,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_STATUS
                                },
                                others: {
                                  errormessage: "Status - cannot be blank",
                                  required: true
                                },
                                onChange: this.changeGridEditors.bind(this, row)
                              }}
                            />
                          );
                        },
                        others: {
                          maxWidth: 100
                        }
                      }
                    ]}
                    keyId="hims_d_sub_department_id"
                    dataSource={{
                      data: this.state.microAntbiotic
                    }}
                    isEditable={true}
                    actions={{
                      allowDelete: false
                    }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      //onDelete: this.deleteSubDepartment.bind(this),
                      onEdit: row => {},
                      onDone: this.updateGroupAntiMap.bind(this)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4"> &nbsp;</div>
                <div className="col-lg-8">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => {
                      this.setState({
                        microAntbiotic: [],
                        showGroupAntibiotic: false
                      });
                    }}
                  >
                    <label className="style_Label ">Cancel</label>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
        {/*Group Details*/}
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Organism Type",
              isImp: true
            }}
            selector={{
              name: "group_type",
              className: "select-fld",
              value: this.state.group_type,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.MICRO_GROUP_TYPE
              },
              onChange: this.dropDownHandle.bind(this)
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Group Code",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "group_code",
              value: this.state.group_code,
              events: {
                onChange: this.textHandle.bind(this)
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col form-group mandatory" }}
            label={{
              forceLabel: "Group Name",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "group_name",
              value: this.state.group_name,
              events: {
                onChange: this.textHandle.bind(this)
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col form-group arabic-txt-fld mandatory" }}
            label={{
              forceLabel: "Group Arabic Name",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "arabic_group_name",
              value: this.state.arabic_group_name,
              events: {
                onChange: this.textHandle.bind(this)
              }
            }}
          />

          <div className="col align-middle">
            <button
              className="btn btn-primary"
              style={{ marginTop: 19 }}
              onClick={this.addMicroGroup.bind(this)}
            >
              Add to List
            </button>
          </div>
        </div>
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row">
              <div
                data-validate="depdd"
                className="col-lg-12"
                id="depddGridCntr"
              >
                <AlgaehDataGrid
                  datavalidate="data-validate='depdd'"
                  id="dept_grid"
                  columns={[
                    {
                      fieldName: "add_dep",

                      label: (
                        <AlgaehLabel label={{ forceLabel: "Antibiotic" }} />
                      ),

                      displayTemplate: row => {
                        return (
                          <i
                            className="fas fa-plus"
                            onClick={this.addGroupAntibiotic.bind(this, row)}
                          />
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <i
                            className="fas fa-plus"
                            onClick={this.addGroupAntibiotic.bind(this, row)}
                          />
                        );
                      },
                      others: {
                        maxWidth: 100,
                        style: {
                          textAlign: "center"
                        }
                      }
                    },

                    {
                      fieldName: "group_type",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Organism Type" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {row.group_type === "F"
                              ? "Fascideous"
                              : "Non-Fascideous"}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>
                            {row.group_type === "F"
                              ? "Fascideous"
                              : "Non-Fascideous"}
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 150
                      }
                    },
                    {
                      fieldName: "group_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Group Code" }} />
                      ),

                      disabled: true,
                      others: {
                        maxWidth: 150
                      }
                    },
                    {
                      fieldName: "group_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Group Name" }} />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            textBox={{
                              className: "txt-fld",
                              name: "group_name",
                              value: row.group_name,
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              },
                              others: {
                                errormessage: "Name - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "arabic_group_name",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Group Arabic Name" }}
                        />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{ className: "col " }}
                            textBox={{
                              className: "txt-fld",
                              name: "arabic_group_name",
                              value: row.arabic_group_name,
                              events: {
                                onChange: this.changeGridEditors.bind(this, row)
                              },
                              others: {
                                errormessage: "Arabic Name - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "group_status",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            {row.group_status === "A" ? "Active" : "Inactive"}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            div={{}}
                            selector={{
                              name: "group_status",
                              className: "select-fld",
                              value: row.group_status,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_STATUS
                              },
                              others: {
                                errormessage: "Status - cannot be blank",
                                required: true
                              },
                              onChange: this.changeGridEditors.bind(this, row)
                            }}
                          />
                        );
                      },
                      others: {
                        maxWidth: 100
                      }
                    }
                  ]}
                  filter={true}
                  keyId="group_code"
                  dataSource={{
                    data: this.state.microGroups
                  }}
                  isEditable={true}
                  actions={{
                    allowDelete: false
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onEdit: row => {},
                    onDone: this.updateMicroGroup.bind(this)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    antibiotic: state.antibiotic
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAntibiotic: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeptMaster)
);
