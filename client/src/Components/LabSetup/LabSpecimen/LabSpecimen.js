import React, { Component } from "react";
import "./LabSpecimen.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import {
  changeTexts,
  onchangegridcol,
  insertLabSpecimen,
  updateLabSpecimen,
  deleteLabSpecimen
} from "./LabSpecimenEvents";

import GlobalVariables from "../../../utils/GlobalVariables";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getCookie } from "../../../utils/algaehApiCall.js";
import Options from "../../../Options.json";
import moment from "moment";

class LabSpecimen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_lab_specimen_id: "",
      description: "",
      storage_type: null
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });
    if (
      this.props.labspecimen === undefined ||
      this.props.labspecimen.length === 0
    ) {
      this.props.getLabSpecimen({
        uri: "/labmasters/selectSpecimen",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "SPECIMEN_GET_DATA",
          mappingName: "labspecimen"
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
        <div className="container-fluid">
          <div className="row">
            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                fieldName: "type_desc",
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

            <AlagehAutoComplete
              div={{ className: "col-lg-2" }}
              label={{
                fieldName: "storage_type",
                isImp: true
              }}
              selector={{
                name: "storage_type",
                className: "select-fld",
                value: this.state.storage_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.FORMAT_STORAGE_TYPE
                },
                onChange: changeTexts.bind(this, this)
              }}
            />
            <div className="col-lg-2 align-middle" style={{ paddingTop: 21 }}>
              <button
                onClick={insertLabSpecimen.bind(this, this)}
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>

          <div className="row form-details" data-validate="labSpecimenDiv">
            <div className="col">
              <AlgaehDataGrid
                datavalidate="data-validate='labSpecimenDiv'"
                id="visa_grd"
                columns={[
                  {
                    fieldName: "SpeDescription",
                    label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.SpeDescription,
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
                    fieldName: "storage_type",
                    label: (
                      <AlgaehLabel label={{ fieldName: "storage_type" }} />
                    ),
                    displayTemplate: row => {
                      return row.storage_type === "N"
                        ? "Normal"
                        : row.storage_type === "F"
                        ? "Frozen"
                        : "Refrigerate";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          selector={{
                            name: "storage_type",
                            className: "select-fld",
                            value: row.storage_type,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_STORAGE_TYPE
                            },
                            onChange: onchangegridcol.bind(this, this, row),
                            others: {
                              errormessage: "Storage Type - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "created_by",
                    label: <AlgaehLabel label={{ fieldName: "created_by" }} />,
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
                    }
                  },
                  {
                    fieldName: "created_date",
                    label: (
                      <AlgaehLabel label={{ fieldName: "created_date" }} />
                    ),
                    displayTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    },
                    editorTemplate: row => {
                      return <span>{this.dateFormater(row.created_date)}</span>;
                    }
                    //disabled: true
                  },
                  {
                    fieldName: "specimen_status",
                    label: <AlgaehLabel label={{ fieldName: "inv_status" }} />,
                    displayTemplate: row => {
                      return row.specimen_status === "A"
                        ? "Active"
                        : "Inactive";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "specimen_status",
                            className: "select-fld",
                            value: row.specimen_status,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_STATUS
                            },
                            onChange: onchangegridcol.bind(this, this, row),
                            others: {
                              errormessage: "Specimen Status - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  }
                ]}
                keyId="hims_d_lab_section_id"
                dataSource={{
                  data:
                    this.props.labspecimen === undefined
                      ? []
                      : this.props.labspecimen
                }}
                isEditable={true}
                filter={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onDelete: deleteLabSpecimen.bind(this, this),
                  onEdit: row => {},
                  onDone: updateLabSpecimen.bind(this, this)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    labspecimen: state.labspecimen,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabSpecimen: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LabSpecimen)
);
