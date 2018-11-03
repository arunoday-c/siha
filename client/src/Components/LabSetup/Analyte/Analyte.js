import React, { Component } from "react";
import "./Analyte.css";
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
  insertLabAnalytes,
  updateLabAnalytes,
  deleteLabAnalytes
} from "./AnalyteEvents";
import Options from "../../../Options.json";
import moment from "moment";
import { successfulMessage } from "../../../utils/GlobalFunctions";

class LabAnalyte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_lab_section_id: "",
      description: "",
      analyte_type: null,
      result_unit: null,

      description_error: false,
      description_error_txt: ""
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });
    this.props.getLabAnalytes({
      uri: "/labmasters/selectAnalytes",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "labanalytes"
      },
      afterSuccess: data => {
        if (data.length === 0 || data.length === undefined) {
          if (data.response.data.success === false) {
            successfulMessage({
              message: data.response.data.message,
              title: "Warning",
              icon: "warning"
            });
          }
        }
      }
    });
  }

  dateFormater({ date }) {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  }

  render() {
    return (
      <div className="lab_section">
        <div className="container-fluid">
          <form>
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
                  fieldName: "analyte_type",
                  isImp: true
                }}
                selector={{
                  name: "analyte_type",
                  className: "select-fld",
                  value: this.state.analyte_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.FORMAT_ANALYTE_TYPE
                  },
                  onChange: changeTexts.bind(this, this)
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "result_unit",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "result_unit",
                  value: this.state.result_unit,
                  events: {
                    onChange: changeTexts.bind(this, this)
                  }
                }}
              />
              <div className="col-lg-2 align-middle" style={{ paddingTop: 21 }}>
                <button
                  onClick={insertLabAnalytes.bind(this, this)}
                  className="btn btn-primary"
                >
                  Add to List
                </button>
              </div>
            </div>
          </form>

          <div className="row form-details" data-validate="analyteDiv">
            <div className="col">
              <AlgaehDataGrid
                datavalidate="data-validate='analyteDiv'"
                id="analyte-grid"
                columns={[
                  {
                    fieldName: "description",
                    label: <AlgaehLabel label={{ fieldName: "type_desc" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
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
                    fieldName: "analyte_type",
                    label: (
                      <AlgaehLabel label={{ fieldName: "analyte_type" }} />
                    ),
                    displayTemplate: row => {
                      return row.analyte_type === "QU"
                        ? "Quality"
                        : row.analyte_type === "QN"
                          ? "Quantity"
                          : "Text";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "analyte_type",
                            className: "select-fld",
                            value: row.analyte_type,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.FORMAT_ANALYTE_TYPE
                            },
                            onChange: onchangegridcol.bind(this, this, row),
                            others: {
                              errormessage: "Analyte Type - cannot be blank",
                              required: true
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "result_unit",
                    label: <AlgaehLabel label={{ fieldName: "result_unit" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            value: row.result_unit,
                            className: "txt-fld",
                            name: "result_unit",
                            events: {
                              onChange: onchangegridcol.bind(this, this, row)
                            },
                            others: {
                              errormessage: "Result Unit - cannot be blank",
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
                            ? display[0].user_displayname
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
                            ? display[0].user_displayname
                            : ""}
                        </span>
                      );
                    }
                    // disabled: true
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
                  },
                  {
                    fieldName: "analyte_status",
                    label: <AlgaehLabel label={{ fieldName: "inv_status" }} />,
                    displayTemplate: row => {
                      return row.analyte_status === "A" ? "Active" : "Inactive";
                    },
                    editorTemplate: row => {
                      return (
                        <AlagehAutoComplete
                          div={{}}
                          selector={{
                            name: "analyte_status",
                            className: "select-fld",
                            value: row.analyte_status,
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
                    }
                  }
                ]}
                keyId="hims_d_lab_section_id"
                dataSource={{
                  data:
                    this.props.labanalytes === undefined
                      ? []
                      : this.props.labanalytes
                }}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onDelete: deleteLabAnalytes.bind(this, this),
                  onEdit: row => {},

                  onDone: updateLabAnalytes.bind(this, this)
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
    labanalytes: state.labanalytes,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabAnalytes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LabAnalyte)
);
