import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import RadTemplate from "../RadTemplate/RadTemplate";
import "./RadInvestigation.scss";
import "./../../../styles/site.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import {
  texthandle,
  ShowTemplate,
  CloseTemplate,
  ViewEditTemplate,
  updateRadInvestigation,
  deleteRadTemplate
} from "./RadInvestigationEvent";
import variableJson from "../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../actions/algaehActions";
import MyContext from "../../../utils/MyContext.js";
// import { successfulMessage } from "../../../utils/GlobalFunctions";
// import { getCookie } from "../../../utils/algaehApiCall";

class RadInvestigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTemplate: false,
      radTempobj: null
    };
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.InvestigationIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="row hptl-phase1-add-rad-investigation-form">
              <div className="col-3">
                <div className="row ">
                  <AlagehAutoComplete
                    div={{ className: "col-12 mandatory form-group" }}
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
                  />{" "}
                  <AlagehAutoComplete
                    div={{ className: "col-12 mandatory form-group" }}
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
                      onChange: texthandle.bind(this, this, context),
                      others: {
                        tabIndex: "3"
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-12" }}
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
                </div>
              </div>
              <div
                className="col-9"
                style={{ borderLeft: "1px solid rgba(0,0,0,.1)" }}
              >
                <div className="row ">
                  <div className="col-12">
                    <button
                      className="btn btn-primary"
                      onClick={ShowTemplate.bind(this, this)}
                    >
                      Add New Template
                    </button>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-12" id="templateGridCntr">
                    <AlgaehDataGrid
                      id="templateGrid"
                      columns={[
                        {
                          fieldName: "action",
                          label: (
                            <AlgaehLabel label={{ fieldName: "action" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                <i
                                  className="fas fa-pen"
                                  onClick={ViewEditTemplate.bind(
                                    this,
                                    this,
                                    row
                                  )}
                                />
                                <i
                                  className="fas fa-trash-alt"
                                  onClick={deleteRadTemplate.bind(
                                    this,
                                    this,
                                    context,
                                    row
                                  )}
                                />
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 90,
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "template_name",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "template_name" }}
                            />
                          )
                        }
                      ]}
                      keyId="analyte_id"
                      dataSource={{
                        data: this.state.RadTemplate
                      }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: deleteRadTemplate.bind(this, this, context),
                        onEdit: row => { },

                        onDone: updateRadInvestigation.bind(this, this)
                      }}
                    />
                  </div>
                </div>
              </div>{" "}
              <MyContext.Provider
                value={{
                  state: this.state,
                  updateState: obj => {
                    this.setState({ ...obj });
                  }
                }}
              >
                <RadTemplate
                  openTemplate={this.state.openTemplate}
                  onClose={CloseTemplate.bind(this, this)}
                  radTempobj={this.state.radTempobj}
                />
              </MyContext.Provider>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    radtestcategory: state.radtestcategory
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTestCategory: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RadInvestigation)
);
