import React, { Component } from "react";
import "./LabSection.css";
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

import {
  changeTexts,
  onchangegridcol,
  insertLabSection,
  deleteLabSection,
  updateLabSection
} from "./LabSectionEvents";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall.js";
import Options from "../../../Options.json";
import moment from "moment";

class LabSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_lab_section_id: "",
      description: "",
      selectedLang: "en"
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });
    if (
      this.props.labsection === undefined ||
      this.props.labsection.length === 0
    ) {
      this.props.getLabsection({
        uri: "/labmasters/selectSection",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "SECTION_GET_DATA",
          mappingName: "labsection"
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
              forceLabel: "Lab Section Name",
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
          <div className="col-lg-2 align-middle" style={{ paddingTop: 19 }}>
            <button
              onClick={insertLabSection.bind(this, this)}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row">
              <div
                className="col"
                data-validate="labSecDiv"
                id="labSectionGrid_Cntr"
              >
                <AlgaehDataGrid
                  datavalidate="data-validate='labSecDiv'"
                  id="labSectionGrid"
                  columns={[
                    {
                      fieldName: "SecDescription",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Lab Section Name" }}
                        />
                      ),
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value: row.SecDescription,
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
                    },
                    {
                      fieldName: "section_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "inv_status" }} />
                      ),
                      displayTemplate: row => {
                        return row.section_status === "A"
                          ? "Active"
                          : "Inactive";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            selector={{
                              name: "section_status",
                              className: "select-fld",
                              value: row.section_status,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_STATUS
                              },
                              others: {
                                errormessage: "Status - cannot be blank",
                                required: true
                              },
                              onChange: onchangegridcol.bind(this, this, row)
                            }}
                          />
                        );
                      },
                      others: { maxWidth: 100 }
                    }
                  ]}
                  keyId="hims_d_lab_section_id"
                  dataSource={{
                    data:
                      this.props.labsection === undefined
                        ? []
                        : this.props.labsection
                  }}
                  isEditable={true}
                  actions={{
                    allowDelete: false
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    //onDelete: deleteLabSection.bind(this, this),
                    onEdit: row => {},
                    onDone: updateLabSection.bind(this, this)
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
    labsection: state.labsection,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabsection: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LabSection)
);
