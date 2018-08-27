import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Paper from "@material-ui/core/Paper";

import IconButton from "@material-ui/core/IconButton";
import AddCircle from "@material-ui/icons/AddCircle";

import RadTemplate from "../RadTemplate/RadTemplate";
import "./RadInvestigation.css";
import "./../../../styles/site.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import { texthandle, ShowTemplate } from "./RadInvestigationEvent";
import variableJson from "../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../actions/algaehActions";
import MyContext from "../../../utils/MyContext.js";
// import { successfulMessage } from "../../../utils/GlobalFunctions";
// import { getCookie } from "../../../utils/algaehApiCall";

class RadInvestigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTemplate: false
    };
  }

  componentWillMount() {
    let InputOutput = this.props.InvestigationIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }
  componentDidMount() {
    this.props.getLabsection({
      uri: "/labmasters/selectSection",
      method: "GET",
      redux: {
        type: "SECTION_GET_DATA",
        mappingName: "labsection"
      }
    });

    this.props.getLabSpecimen({
      uri: "/labmasters/selectSpecimen",
      method: "GET",
      redux: {
        type: "SPECIMEN_GET_DATA",
        mappingName: "labspecimen"
      }
    });

    this.props.getLabAnalytes({
      uri: "/labmasters/selectAnalytes",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "labanalytes"
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-rad-investigation-form">
              <div className="container-fluid">
                <div className="row form-details">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "category_id",
                      isImp: true
                    }}
                    selector={{
                      name: "category_id",
                      className: "select-fld",
                      value: this.state.category_id,
                      dataSource: {
                        textField: "category_name",
                        valueField: "hims_d_test_category_id",
                        data: this.props.labsection
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "film_category",
                      isImp: true
                    }}
                    selector={{
                      name: "film_category",
                      className: "select-fld",
                      value: this.state.film_category,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_FILMCATEGORY
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "screening_test"
                    }}
                    selector={{
                      name: "screening_test",
                      className: "select-fld",
                      value: this.state.screening_test,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "film_used",
                      isImp: true
                    }}
                    selector={{
                      name: "film_used",
                      className: "select-fld",
                      value: this.state.film_used,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                </div>

                <Paper className="Paper">
                  <div className="row form-details">
                    <div className="col-lg-12">
                      <button
                        className="htpl1-phase1-btn-primary"
                        style={{ margin: "10px" }}
                        onClick={ShowTemplate.bind(this, this)}
                      >
                        Select Template
                      </button>
                    </div>
                  </div>
                  <div className="row form-details">
                    <div className="col-lg-12">
                      <AlgaehDataGrid
                        id="template_grid"
                        columns={[
                          {
                            fieldName: "template_name",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "template_name" }}
                              />
                            )
                          },
                          {
                            fieldName: "action",
                            label: (
                              <AlgaehLabel label={{ fieldName: "action" }} />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  <IconButton color="primary" title="View">
                                    <AddCircle />
                                  </IconButton>
                                </span>
                              );
                            }
                          }
                        ]}
                        keyId="analyte_id"
                        dataSource={{
                          data: this.state.analytes
                        }}
                        isEditable={true}
                        paging={{ page: 0, rowsPerPage: 10 }}
                      />
                    </div>
                  </div>
                  <RadTemplate
                    openTemplate={this.state.openTemplate}
                    onClose={ShowTemplate.bind(this, this)}
                  />
                </Paper>
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    labspecimen: state.labspecimen,
    labsection: state.labsection,
    labanalytes: state.labanalytes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabsection: AlgaehActions,
      getLabSpecimen: AlgaehActions,
      getLabAnalytes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RadInvestigation)
);
