import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./NewInvestigation.css";
import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import {
  texthandle,
  InsertLabTest,
  CptCodesSearch
} from "./NewInvestigationEvent";
import variableJson from "../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../actions/algaehActions";
import LabInvestigation from "../LabInvestigation/LabInvestigation";
import RadInvestigation from "../RadInvestigation/RadInvestigation";
import InvestigationIOputs from "../../../Models/InvestigationSetup";
import MyContext from "../../../utils/MyContext.js";

class NewInvestigation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,

      InvestigationtypeEnable: false
    };
  }
  componentWillMount() {
    let IOputs = InvestigationIOputs.inputParam();
    this.setState({ ...this.state, ...IOputs });
  }

  componentDidMount() {
    if (
      this.props.ingservices === undefined ||
      this.props.ingservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "ingservices"
        }
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.InvestigationPop.hims_d_investigation_test_id !== undefined) {
      let IOputs = newProps.InvestigationPop;
      IOputs.InvestigationtypeEnable = true;
      this.setState({ ...this.state, ...IOputs }, () => {
        this.props.getTestCategory({
          uri: "/labmasters/selectTestCategory",
          module: "laboratory",
          method: "GET",
          data: { investigation_type: this.state.investigation_type },
          redux: {
            type: "TESTCATEGORY_GET_DATA",
            mappingName: "testcategory"
          }
        });
      });
    } else {
      let IOputs = InvestigationIOputs.inputParam();
      IOputs.InvestigationtypeEnable = false;
      this.setState({ ...this.state, ...IOputs }, () => {
        this.props.getTestCategory({
          uri: "/labmasters/selectTestCategory",
          module: "laboratory",
          method: "GET",
          data: { investigation_type: this.state.investigation_type },
          redux: {
            type: "TESTCATEGORY_GET_DATA",
            mappingName: "testcategory"
          }
        });
      });
    }
  }
  onClose = e => {
    this.props.onClose && this.props.onClose(true);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-investigation-form">
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title={this.props.HeaderCaption}
            openPopup={this.props.open}
          >
            <div className="popupInner">
              <div className="col-12 popRightDiv">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-3 mandatory" }}
                    label={{
                      fieldName: "investigation_type",
                      isImp: true
                    }}
                    selector={{
                      name: "investigation_type",
                      className: "select-fld",
                      value: this.state.investigation_type,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_LAB_RAD
                      },
                      others: {
                        disabled: this.state.InvestigationtypeEnable,
                        tabIndex: "1"
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                </div>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-3 mandatory" }}
                    label={{
                      fieldName: "test_name",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "description",
                      value: this.state.description,
                      events: {
                        onChange: texthandle.bind(this, this)
                      },
                      others: {
                        tabIndex: "2"
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-3 mandatory" }}
                    label={{
                      fieldName: "services_id",
                      isImp: true
                    }}
                    selector={{
                      name: "services_id",
                      className: "select-fld",
                      value: this.state.services_id,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "service_name"
                            : "arabic_service_name",
                        valueField: "hims_d_services_id",
                        data: this.props.ingservices
                      },
                      onChange: texthandle.bind(this, this),
                      others: {
                        tabIndex: "3"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-2 form-group" }}
                    label={{
                      fieldName: "cpt_id"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "cpt_id",
                      value: this.state.cpt_code_data,
                      events: {
                        onChange: texthandle.bind(this, this)
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />

                  <div className="col-1 form-group">
                    <i
                      className="fas fa-search"
                      onClick={CptCodesSearch.bind(this, this)}
                      style={{ marginTop: 25, fontSize: "1.4rem" }}
                    />
                  </div>

                  <AlagehAutoComplete
                    div={{ className: "col-3 mandatory" }}
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
                        data: this.props.testcategory
                      },
                      onChange: texthandle.bind(this, this),
                      others: {
                        tabIndex: "4"
                      }
                    }}
                  />
                  {/*<AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
                    label={{
                      fieldName: "restrict_order"
                    }}
                    selector={{
                      name: "restrict_order",
                      className: "select-fld",
                      value: this.state.restrict_order,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_YESNO
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
                    label={{
                      fieldName: "restrict_by"
                    }}
                    selector={{
                      name: "restrict_by",
                      className: "select-fld",
                      value: this.state.restrict_by,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_RESTRICTBY
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />*/}
                </div>
                {/* <LabInvestigation /> */}
                <MyContext.Provider
                  value={{
                    state: this.state,
                    updateState: obj => {
                      this.setState({ ...obj });
                    }
                  }}
                >
                  {this.state.investigation_type === "L" ? (
                    <LabInvestigation InvestigationIOputs={this.state} />
                  ) : (
                    <RadInvestigation InvestigationIOputs={this.state} />
                  )}
                </MyContext.Provider>
              </div>
            </div>

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>

                  <div className="col-lg-8">
                    <button
                      onClick={InsertLabTest.bind(this, this)}
                      type="button"
                      className="btn btn-primary"
                    >
                      {this.state.hims_d_investigation_test_id === null ? (
                        <AlgaehLabel label={{ fieldName: "btnSave" }} />
                      ) : (
                        <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                      )}
                    </button>
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
        </div>
      </React.Fragment>
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NewInvestigation)
);
