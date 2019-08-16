import React, { Component } from "react";
import "./LabContainer.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables";

import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall.js";
import {
  changeTexts,
  onchangegridcol,
  insertLabContainer,
  deleteLabContainer,
  updateLabContainer
} from "./LabContainerEvents";
import Options from "../../../Options.json";
import moment from "moment";

class LabContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_lab_container_id: "",
      description: "",
      container_id: null
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });
    if (
      this.props.labcontainer === undefined ||
      this.props.labcontainer.length === 0
    ) {
      this.props.getLabContainer({
        uri: "/labmasters/selectContainer",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "CONTAINER_GET_DATA",
          mappingName: "labcontainer"
        }
      });
    }
  }

  dateFormater(date) {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  }

  render() {
    return (
      <div className="lab_section">
        <div className="row inner-top-search margin-bottom-15">
          <AlagehFormGroup
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "Container Name",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "description",
              value: this.state.description,

              events: {
                onChange: changeTexts.bind(this, this)
              }
            }}
          />

          <AlagehFormGroup
            div={{ className: "col-2 mandatory" }}
            label={{
              fieldName: "container_id",
              isImp: true
            }}
            textBox={{
              className: "txt-fld",
              name: "container_id",
              value: this.state.container_id,

              events: {
                onChange: changeTexts.bind(this, this)
              }
            }}
          />
          <div className="col-lg-2 align-middle" style={{ paddingTop: 19 }}>
            <button
              onClick={insertLabContainer.bind(this, this)}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row" data-validate="labContainerDiv">
              <div className="col" id="labContainerGrid_Cntr">
                <AlgaehDataGrid
                  datavalidate="data-validate='labContainerDiv'"
                  id="labContainerGrid"
                  columns={[
                    {
                      fieldName: "description",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Container Name" }} />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.description,
                              className: "txt-fld",
                              name: "description",
                              events: {
                                onChange: onchangegridcol.bind(this, this, row)
                              },
                              others: {
                                errormessage: "Description - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "container_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "container_id" }} />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.container_id,
                              className: "txt-fld",
                              name: "container_id",
                              events: {
                                onChange: onchangegridcol.bind(this, this, row)
                              }
                            }}
                          />
                        );
                      },
                      others: { maxWidth: 120 }
                    },
                    {
                      fieldName: "created_by",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_by" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.userdrtails === undefined
                            ? []
                            : this.props.userdrtails.filter(
                                f => f.algaeh_d_app_user_id === row.created_by
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].username
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        let display =
                          this.props.userdrtails === undefined
                            ? []
                            : this.props.userdrtails.filter(
                                f => f.algaeh_d_app_user_id === row.created_by
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].username
                              : ""}
                          </span>
                        );
                      },
                      others: { maxWidth: 150 }
                    },
                    {
                      fieldName: "created_date",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_date" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>{this.dateFormater(row.created_date)}</span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>{this.dateFormater(row.created_date)}</span>
                        );
                      },
                      others: { maxWidth: 100 }
                      //disabled: true
                    },
                    {
                      fieldName: "container_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "inv_status" }} />
                      ),
                      displayTemplate: row => {
                        return row.container_status === "A"
                          ? "Active"
                          : "Inactive";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            selector={{
                              name: "container_status",
                              className: "select-fld",
                              value: row.container_status,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_STATUS
                              },
                              onChange: onchangegridcol.bind(this, this, row),
                              others: {
                                errormessage: "Status - cannot be blank",
                                required: true
                              }
                            }}
                          />
                        );
                      },
                      others: { maxWidth: 100 }
                    }
                  ]}
                  keyId="hims_d_lab_container_id"
                  dataSource={{
                    data:
                      this.props.labcontainer === undefined
                        ? []
                        : this.props.labcontainer
                  }}
                  isEditable={true}
                  actions={{
                    allowDelete: false
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    //onDelete: deleteLabContainer.bind(this, this),
                    onEdit: row => {},
                    onDone: updateLabContainer.bind(this, this)
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
    labcontainer: state.labcontainer,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabContainer: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LabContainer)
);
