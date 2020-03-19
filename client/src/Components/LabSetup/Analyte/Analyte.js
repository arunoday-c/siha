import React, { Component } from "react";
import "./Analyte.scss";
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
  deleteLabAnalytes,
  EditInvestigationTest
} from "./AnalyteEvents";
import Options from "../../../Options.json";
import moment from "moment";
import AnalytesRange from "./AnalytesRange";

class LabAnalyte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_lab_section_id: "",
      description: "",
      analyte_type: null,
      result_unit: null,
      active: {},
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
    if (
      this.props.labanalytes === undefined ||
      this.props.labanalytes.length === 0
    ) {
      this.props.getLabAnalytes({
        uri: "/labmasters/selectAnalytes",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "ANALYTES_GET_DATA",
          mappingName: "labanalytes"
        }
      });
    }
  }

  dateFormater(date) {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  }

  ShowModel = row => {
    this.setState({
      isOpen: !this.state.isOpen,
      active: row
    });
  };

  CloseModel(e) {
    this.setState({
      isOpen: !this.state.isOpen,
      active: {}
    });
  }
  render() {
    return (
      <div className="lab_section">
        <div className="row inner-top-search margin-bottom-15">
          <AlagehFormGroup
            div={{ className: "col-3 form-group mandatory" }}
            label={{
              forceLabel: "Analyte Description",
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
            div={{ className: "col-2 form-group mandatory" }}
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
            div={{ className: "col-2 mandatory form-group" }}
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
          <div className="col-lg-2 align-middle" style={{ paddingTop: 19 }}>
            <button
              onClick={insertLabAnalytes.bind(this, this)}
              className="btn btn-primary"
            >
              Add to List
            </button>
          </div>
        </div>

        <AnalytesRange
          HeaderCaption="Range"
          open={this.state.isOpen}
          active={this.state.active}
          onClose={this.CloseModel.bind(this)}
          // InvestigationPop={this.state.InvestigationPop}
        />

        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-body">
            <div className="row" data-validate="analyteDiv">
              <div className="col" id="labAnalyteGrid_Cntr">
                <AlgaehDataGrid
                  datavalidate="data-validate='analyteDiv'"
                  id="labAnalyteGrid"
                  columns={[
                    {
                      fieldName: "analyteRange",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Analyte Range" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            <i
                              className="fas fa-plus"
                              onClick={() => this.ShowModel(row)}
                            />
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>
                            <i
                              className="fas fa-plus"
                              onClick={this.ShowModel.bind(this)}
                            />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 120,
                        resizable: false,
                        filterable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "description",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Analyte Description" }}
                        />
                      ),
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
                      },
                      others: { maxWidth: 150 }
                    },
                    {
                      fieldName: "result_unit",
                      label: (
                        <AlgaehLabel label={{ fieldName: "result_unit" }} />
                      ),
                      displayTemplate: row => {
                        return row.result_unit === "NULL"
                          ? "--"
                          : row.result_unit;
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              value:
                                row.result_unit === "NULL"
                                  ? ""
                                  : row.result_unit,
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
                      },
                      others: { maxWidth: 100 }
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
                      // disabled: true
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
                      fieldName: "analyte_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "inv_status" }} />
                      ),
                      displayTemplate: row => {
                        return row.analyte_status === "A"
                          ? "Active"
                          : "Inactive";
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
                      },
                      others: { maxWidth: 100 }
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
                  actions={{
                    allowDelete: false
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    //onDelete: deleteLabAnalytes.bind(this, this),
                    onEdit: row => {},

                    onDone: updateLabAnalytes.bind(this, this)
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
  connect(mapStateToProps, mapDispatchToProps)(LabAnalyte)
);
