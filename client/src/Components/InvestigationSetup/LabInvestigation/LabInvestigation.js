import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LabInvestigation.scss";
import "./../../../styles/site.scss";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import {
  texthandle,
  containeridhandle,
  analyteidhandle,
  AddAnalytes,
  updateLabInvestigation,
  deleteLabAnalyte
} from "./LabInvestigationEvent";
import variableJson from "../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../actions/algaehActions";
import MyContext from "../../../utils/MyContext.js";
// import { swalMessage } from "../../../utils/algaehApiCall";

class LabInvestigation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static contextType = MyContext;

  componentDidMount() {
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

  // events
  texthandle = texthandle.bind(this);
  analyteidhandle = analyteidhandle.bind(this);
  containeridhandle = containeridhandle.bind(this);

  // Crud a
  AddAnalytes = AddAnalytes.bind(this);
  deleteLabAnalyte = deleteLabAnalyte.bind(this);
  updateLabInvestigation = updateLabInvestigation.bind(this);

  render() {
    const { state } = this.context;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-3">
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-12 mandatory form-group" }}
                label={{
                  fieldName: "specimen_id",
                  isImp: true
                }}
                selector={{
                  name: "specimen_id",
                  className: "select-fld",
                  value: state.specimen_id,
                  dataSource: {
                    textField: "SpeDescription",
                    valueField: "hims_d_lab_specimen_id",
                    data: this.props.labspecimen
                  },
                  onChange: this.texthandle,
                  others: {
                    tabIndex: "5"
                  }
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-12 mandatory form-group" }}
                label={{
                  fieldName: "container_id",
                  isImp: true
                }}
                selector={{
                  name: "container_id",
                  className: "select-fld",
                  value: state.container_id,
                  dataSource: {
                    textField: "ConDescription",
                    valueField: "hims_d_lab_container_id",
                    data: this.props.labcontainer
                  },
                  onChange: this.containeridhandle,
                  others: {
                    tabIndex: "6"
                  }
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-12 mandatory form-group" }}
                label={{
                  fieldName: "available_in_house",
                  isImp: true
                }}
                selector={{
                  name: "available_in_house",
                  className: "select-fld",
                  value: state.available_in_house,
                  dataSource: {
                    textField:
                      state.selectedLang === "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: variableJson.FORMAT_YESNO
                  },
                  onChange: this.texthandle,
                  others: {
                    tabIndex: "7"
                  }
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-12 form-group" }}
                label={{
                  fieldName: "send_out_test"
                }}
                selector={{
                  name: "send_out_test",
                  className: "select-fld",
                  value: state.send_out_test,
                  dataSource: {
                    textField:
                      state.selectedLang === "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: variableJson.FORMAT_YESNO
                  },
                  onChange: this.texthandle
                }}
              />
            </div>
          </div>
          <div
            className="col-9"
            style={{ borderLeft: "1px solid rgba(0,0,0,.1)" }}
          >
            {state.analytes_required === true ? (
              <div>
                <div className="row" data-validate="analyte_details">
                  <AlagehAutoComplete
                    div={{ className: "col-8 mandatory" }}
                    label={{
                      fieldName: "analyte_id",
                      isImp: true
                    }}
                    selector={{
                      name: "analyte_id",
                      className: "select-fld",
                      value: state.analyte_id,
                      dataSource: {
                        textField: "AnaDescription",
                        valueField: "hims_d_lab_analytes_id",
                        data: this.props.labanalytes
                      },
                      onChange: this.analyteidhandle
                    }}
                  />

                  <div className="col" style={{ padding: 0 }}>
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 19 }}
                      onClick={this.AddAnalytes}
                    >
                      Add
                    </button>
                  </div>

                  <div className="col-12" id="analyte_grid_cntr">
                    <AlgaehDataGrid
                      id="analyte_grid"
                      columns={[
                        {
                          fieldName: "analyte_id",
                          label: (
                            <AlgaehLabel label={{ fieldName: "analytes_id" }} />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.labanalytes === undefined
                                ? []
                                : this.props.labanalytes.filter(
                                    f =>
                                      f.hims_d_lab_analytes_id ===
                                      row.analyte_id
                                  );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].description
                                  : ""}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            let display =
                              this.props.labanalytes === undefined
                                ? []
                                : this.props.labanalytes.filter(
                                    f =>
                                      f.hims_d_lab_analytes_id ===
                                      row.analyte_id
                                  );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].description
                                  : ""}
                              </span>
                            );
                          }
                        }
                      ]}
                      keyId="analyte_id"
                      dataSource={{
                        data: state.analytes
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: this.deleteLabAnalyte,
                        onEdit: row => {},
                        onDone: this.updateLabInvestigation
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    labspecimen: state.labspecimen,
    labsection: state.labsection,
    labanalytes: state.labanalytes,
    labcontainer: state.labcontainer
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabsection: AlgaehActions,
      getLabSpecimen: AlgaehActions,
      getLabAnalytes: AlgaehActions,
      getLabContainer: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LabInvestigation)
);
