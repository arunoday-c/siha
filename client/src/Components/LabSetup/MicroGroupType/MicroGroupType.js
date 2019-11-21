import React, { Component } from "react";
import "./MicroGroupType.scss";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
// import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
// import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import {
  dropDownHandle,
  textHandle,
  updateMicroGroup,
  getmicroGroups,
  updateGroupAntiMap,
  changeGridEditors,
  addGroupAntibiotic,
  addGroupAntiMap,
  addMicroGroup,
  onClose,
  addComments,
  updateComments,
  onchangegridcol
} from "./MicroGroupEvent"
import _ from "lodash";

class MicroGroupType extends Component {
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
      antibiotic_id: null,
      group_types: null,
      selected_group_name: null,
      comments_data: [],
      commet: "",
      commnet_name: null
    };

    getmicroGroups(this, this);
  }


  render() {
    return (
      <div className="MicroGroup">
        <AlgaehModalPopUp
          events={{
            onClose: onClose.bind(this, this)
          }}
          title="Map Antibioties"
          openPopup={this.state.showGroupAntibiotic}
        >
          <div className="popupInner">
            <div className="row">
              <div className="col-6">
                <div className="row popLeftDiv" data-validate="subdepDiv">
                  <div className="col-12">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Group Name"
                      }}
                    />
                    <h6>
                      {this.state.selected_group_name
                        ? this.state.selected_group_name
                        : "--------"}
                    </h6>
                  </div>
                  <AlagehAutoComplete
                    div={{ className: "col-4 form-group mandatory" }}
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

                      onChange: textHandle.bind(this, this),
                      onClear: () => {
                        this.setState({
                          antibiotic_id: null
                        });
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-4 form-group mandatory" }}
                    label={{ forceLabel: "Select Group", isImp: true }}
                    selector={{
                      name: "group_types",
                      className: "select-fld",
                      value: this.state.group_types,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.ANTI_GROUP_TYPE
                      },

                      onChange: textHandle.bind(this, this),
                      onClear: () => {
                        this.setState({
                          group_types: null
                        });
                      }
                    }}
                  />

                  <div className="col align-middle">
                    <br />

                    <button
                      className="btn btn-primary"
                      onClick={addGroupAntiMap.bind(this, this)}
                    >
                      Add to List
                  </button>
                  </div>
                </div>
                <div className="row popLeftDiv">
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

                                  onChange: changeGridEditors.bind(this, this, row)
                                }}
                              />
                            );
                          }
                        },

                        {
                          fieldName: "group_types",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Group Type" }} />
                          ),
                          displayTemplate: row => {
                            let display = GlobalVariables.ANTI_GROUP_TYPE.filter(
                              f => f.value === row.group_types
                            );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].name
                                  : ""}
                              </span>
                            );
                          },

                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{}}
                                selector={{
                                  name: "group_types",
                                  className: "select-fld",
                                  value: row.group_types,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.ANTI_GROUP_TYPE
                                  },

                                  onChange: changeGridEditors.bind(this, this, row)
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
                                  onChange: changeGridEditors.bind(this, this, row)
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
                        onEdit: row => { },
                        onDone: updateGroupAntiMap.bind(this, this)
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="row popRightDiv" data-validate="group_comments_data">
                  <AlagehFormGroup
                    div={{ className: "col-10 form-group mandatory" }}
                    label={{
                      forceLabel: "Comment Name",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "commnet_name",
                      value: this.state.commnet_name,
                      events: {
                        onChange: textHandle.bind(this, this)
                      }
                    }}
                  />

                  <div className="col-2">
                    <button
                      onClick={addComments.bind(this, this)}
                      className="btn btn-primary"
                    >
                      Add Comments
                    </button>
                  </div>

                  <div className="col-12 form-group mandatory">
                    <AlgaehLabel
                      label={{ forceLabel: "Comment", isImp: true }}
                    />
                    <textarea
                      value={this.state.commet}
                      name="commet"
                      onChange={textHandle.bind(this, this)}
                    />
                  </div>


                </div>
                <div className="row popRightDiv">
                  <div
                    className="col-lg-12"
                    data-validate="group_comments"
                    id="groupcomments"
                  >
                    <AlgaehDataGrid
                      datavalidate="data-validate='group_comments'"
                      id="hims_d_group_comment"
                      columns={[
                        {
                          fieldName: "commnet_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Comment Name" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "commet",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Comment" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.commet,
                                  className: "txt-fld",
                                  name: "commet",
                                  events: {
                                    onChange: onchangegridcol.bind(
                                      this, this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage: "Comment - cannot be blank",
                                    required: true
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "comment_status",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "status" }} />
                          ),
                          displayTemplate: row => {
                            return row.comment_status === "A"
                              ? "Active"
                              : "Inactive";
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{}}
                                selector={{
                                  name: "comment_status",
                                  className: "select-fld",
                                  value: row.comment_status,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.FORMAT_STATUS
                                  },
                                  onChange: onchangegridcol.bind(
                                    this, this,
                                    row
                                  ),
                                  others: {
                                    errormessage: "Status - cannot be blank",
                                    required: true
                                  }
                                }}
                              />
                            );
                          }
                        }
                      ]}
                      keyId="hims_d_group_comment_id"
                      dataSource={{
                        data: this.state.comments_data
                      }}
                      filter={false}
                      isEditable={true}
                      actions={{
                        allowDelete: false
                      }}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        // onDelete: this.deleteIDType.bind(this),
                        onEdit: row => { },
                        onDone: updateComments.bind(this, this)
                      }}
                    />
                  </div>
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
              onChange: dropDownHandle.bind(this, this)
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
                onChange: textHandle.bind(this, this)
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
                onChange: textHandle.bind(this, this)
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
                onChange: textHandle.bind(this, this)
              }
            }}
          />

          <div className="col align-middle">
            <button
              className="btn btn-primary"
              style={{ marginTop: 19 }}
              onClick={addMicroGroup.bind(this, this)}
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
                            onClick={addGroupAntibiotic.bind(this, this, row)}
                          />
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <i
                            className="fas fa-plus"
                            onClick={addGroupAntibiotic.bind(this, this, row)}
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
                              ? "Fastidious"
                              : "Non-Fastidious"}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>
                            {row.group_type === "F"
                              ? "Fastidious"
                              : "Non-Fastidious"}
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
                                onChange: changeGridEditors.bind(this, this, row)
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
                                onChange: changeGridEditors.bind(this, this, row)
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
                              onChange: changeGridEditors.bind(this, this, row)
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
                    onEdit: row => { },
                    onDone: updateMicroGroup.bind(this, this)
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
  )(MicroGroupType)
);
