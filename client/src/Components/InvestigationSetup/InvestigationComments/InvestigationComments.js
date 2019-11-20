import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./InvestigationComments.scss";
import "./../../../styles/site.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehModalPopUp,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

class InvestigationComments extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      commnet_name: null,
      commet: "",
      comments_data: []
    };
  }

  componentWillReceiveProps(newProps) {
    debugger;

    if (newProps.investigation_test_id !== null) {
      this.setState(
        {
          investigation_test_id: newProps.investigation_test_id,
          comments_data: newProps.comments_data
        },
        () => {
          debugger;
        }
      );
    }
  }
  onClose = e => {
    this.setState(
      {
        commnet_name: null,
        commet: "",
        comments_data: []
      },
      () => this.props.onClose && this.props.onClose(true)
    );
  };

  texthandle(e) {
    debugger;
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onchangegridcol(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  addComments() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='test_comments_data'",
      onSuccess: () => {
        if (this.state.commet === "") {
          swalMessage({
            type: "warning",
            title: "Enter Commets"
          });
          return;
        }
        let IntObj = {
          investigation_test_id: this.state.investigation_test_id,
          commnet_name: this.state.commnet_name,
          commet: this.state.commet
        };
        algaehApiCall({
          uri: "/investigation/addTestComments",
          module: "laboratory",
          data: IntObj,
          onSuccess: response => {
            if (response.data.success === true) {
              this.getTestComments();
              swalMessage({
                type: "success",
                title: "Added successfully . ."
              });
            }
          }
        });
      }
    });
  }

  getTestComments() {
    algaehApiCall({
      uri: "/investigation/getTestComments",
      module: "laboratory",
      data: { investigation_test_id: this.state.investigation_test_id },
      method: "GET",
      onSuccess: response => {
        debugger;
        if (response.data.success === true) {
          this.setState({
            commnet_name: null,
            commet: "",
            comments_data: response.data.records
          });
        }
      }
    });
  }

  updateComments(row) {
    debugger;
    algaehApiCall({
      uri: "/investigation/updateTestComments",
      module: "laboratory",
      data: row,
      method: "PUT",
      onSuccess: response => {
        if (response.data.success === true) {
          swalMessage({
            type: "success",
            title: "Updated successfully . ."
          });
        }
      }
    });
  }
  render() {
    debugger;
    return (
      <>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.open}
        >
          <div className="popupInner">
            <div className="row">
              <div className="col-4 " data-validate="test_comments_data">
                <div className="popLeftDiv" style={{ height: "60vh" }}>
                  <div className="row">
                    <div className="col-12">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Test Name"
                        }}
                      />
                      <h6>
                        {this.props.test_name
                          ? this.props.test_name
                          : "--------"}
                      </h6>
                    </div>
                    <AlagehFormGroup
                      div={{ className: "col-12 form-group mandatory" }}
                      label={{
                        forceLabel: "Comment Name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "commnet_name",
                        value: this.state.commnet_name,
                        events: {
                          onChange: this.texthandle.bind(this)
                        }
                      }}
                    />

                    <div className="col-12 form-group mandatory">
                      <AlgaehLabel
                        label={{ forceLabel: "Comment", isImp: true }}
                      />
                      <textarea
                        value={this.state.commet}
                        name="commet"
                        onChange={this.texthandle.bind(this)}
                      />
                    </div>

                    <div className="col-12">
                      <button
                        onClick={this.addComments.bind(this)}
                        className="btn btn-primary"
                      >
                        Add Comments
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-8" style={{ paddingLeft: 0 }}>
                <div className="popRightDiv">
                  <div className="row">
                    <div className="col" data-validate="test_comments">
                      <AlgaehDataGrid
                        datavalidate="data-validate='test_comments'"
                        id="hims_d_investigation_test_comments"
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
                                      onChange: this.onchangegridcol.bind(
                                        this,
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
                                    onChange: this.onchangegridcol.bind(
                                      this,
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
                        keyId="hims_d_investigation_test_comments_id"
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
                          onEdit: row => {},
                          onDone: this.updateComments.bind(this)
                        }}
                      />
                    </div>
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
                    onClick={e => {
                      this.onClose(e);
                    }}
                    type="button"
                    className="btn btn-default"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    ingservices: state.ingservices,
    testcategory: state.testcategory
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServices: AlgaehActions,
      getTestCategory: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InvestigationComments)
);
