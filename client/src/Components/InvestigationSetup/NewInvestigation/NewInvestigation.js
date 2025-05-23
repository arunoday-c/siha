import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./NewInvestigation.scss";
import "./../../../styles/site.scss";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import {
  texthandle,
  InsertLabTest,
  CptCodesSearch,
  ServiceTypeSearch,
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

      InvestigationtypeEnable: false,
    };
  }

  componentDidMount() {
    let IOputs = InvestigationIOputs.inputParam();
    this.setState({ ...IOputs });
    // if (
    //   this.props.ingservices === undefined ||
    //   this.props.ingservices.length === 0
    // ) {
    //   this.props.getServices({
    //     uri: "/serviceType/getService",
    //     module: "masterSettings",
    //     method: "GET",
    //     redux: {
    //       type: "SERVICES_GET_DATA",
    //       mappingName: "ingservices",
    //     },
    //   });
    // }
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.InvestigationPop.hims_d_investigation_test_id ===
      state.hims_d_investigation_test_id
    ) {
      return null;
    } else {
      if (
        props.InvestigationPop.hims_d_investigation_test_id !== undefined &&
        props.open
      ) {
        let IOputs = props.InvestigationPop;
        IOputs.InvestigationtypeEnable = true;
        return { ...state, ...IOputs };
      } else if (!props.open) {
        let IOputs = InvestigationIOputs.inputParam();
        IOputs.InvestigationtypeEnable = false;
        return { ...state, ...IOputs };
      }
    }
  }

  // UNSAFE_componentWillReceiveProps(newProps) {
  //   if (newProps.InvestigationPop.hims_d_investigation_test_id !== undefined) {
  //     let IOputs = newProps.InvestigationPop;
  //     IOputs.InvestigationtypeEnable = true;
  //     this.setState({ ...this.state, ...IOputs });
  //   } else {
  //     let IOputs = InvestigationIOputs.inputParam();
  //     IOputs.InvestigationtypeEnable = false;
  //     this.setState({ ...this.state, ...IOputs });
  //   }
  // }

  onClose = (e) => {
    let IOputs = InvestigationIOputs.inputParam();
    IOputs.InvestigationtypeEnable = false;
    this.setState({ ...this.state, ...IOputs }, () => {
      this.props.onClose && this.props.onClose(true);
    });
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
              onClose: this.onClose.bind(this),
            }}
            title={this.props.HeaderCaption}
            openPopup={this.props.open}
            class={"investigationModalPopup"}
          >
            <div className="popupInner">
              <div className="col-12">
                <div className="row">
                  <div className="col-4 popLeftDiv">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-6 mandatory form-group" }}
                        label={{
                          fieldName: "investigation_type",
                          isImp: true,
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
                            data: variableJson.FORMAT_LAB_RAD,
                          },
                          others: {
                            disabled: this.state.InvestigationtypeEnable,
                            tabIndex: "1",
                          },
                          onChange: texthandle.bind(this, this),
                        }}
                      />
                    </div>
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col-12 mandatory form-group" }}
                        label={{
                          fieldName: "test_name",
                          isImp: true,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "description",
                          value: this.state.description,
                          events: {
                            onChange: texthandle.bind(this, this),
                          },
                          others: {
                            tabIndex: "2",
                          },
                        }}
                      />
                      <div className="col-12 globalSearchCntr mandatory form-group">
                        <AlgaehLabel
                          label={{ fieldName: "services_id", isImp: true }}
                        />
                        <h6 onClick={ServiceTypeSearch.bind(this, this)}>
                          {this.state.service_name
                            ? this.state.service_name
                            : "Search Services"}
                          <i className="fas fa-search fa-lg"></i>
                        </h6>
                      </div>
                      {/* <AlagehAutoComplete
                        div={{ className: "col-6 mandatory" }}
                        label={{
                          fieldName: "services_id",
                          isImp: true,
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
                            data: this.props.ingservices,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            tabIndex: "3",
                          },
                        }}
                      /> */}
                      <AlagehFormGroup
                        div={{ className: "col-6 form-group" }}
                        label={{
                          forceLabel: "Test Code",
                          isImp: false,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "test_code",
                          value: this.state.test_code,
                          events: {
                            onChange: texthandle.bind(this, this),
                          },
                          others: {
                            tabIndex: "3",
                          },
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-6 mandatory form-group" }}
                        label={{
                          fieldName: "category_id",
                          isImp: true,
                        }}
                        selector={{
                          name: "category_id",
                          className: "select-fld",
                          value: this.state.category_id,
                          dataSource: {
                            textField: "category_name",
                            valueField: "hims_d_test_category_id",
                            data: this.props.testcategory,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            tabIndex: "4",
                          },
                        }}
                      />
                      <div className="col-6 globalSearchCntr">
                        <AlgaehLabel
                          label={{ forceLabel: "Select CPT Code" }}
                        />
                        <h6 onClick={CptCodesSearch.bind(this, this)}>
                          {this.state.cpt_code_data
                            ? this.state.cpt_code_data
                            : "Search CPT"}
                          <i className="fas fa-search fa-lg"></i>
                        </h6>
                      </div>
                      {this.state.investigation_type === "L" ? (
                        <AlagehAutoComplete
                          div={{ className: "col-6 form-group" }}
                          label={{
                            fieldName: "Culture Test",
                          }}
                          selector={{
                            name: "culture_test",
                            className: "select-fld",
                            value: this.state.culture_test,
                            dataSource: {
                              textField:
                                this.state.selectedLang === "en"
                                  ? "name"
                                  : "arabic_name",
                              valueField: "value",
                              data: variableJson.FORMAT_YESNO,
                            },
                            onChange: texthandle.bind(this, this),
                          }}
                        />
                      ) : null}
                      {/* <AlagehFormGroup
                        div={{ className: "col-6 form-group" }}
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
                      />{" "}
                      <div className="col-1 form-group">
                        <i
                          className="fas fa-search"
                        
                          style={{ marginTop: 25, fontSize: "1.4rem" }}
                        />
                      </div> */}

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
                  </div>
                  <div className="col-8 popRightDiv">
                    <MyContext.Provider
                      value={{
                        state: this.state,
                        updateState: (obj) => {
                          this.setState({ ...obj });
                        },
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
                  <div className="row">
                    <div className="col-12">
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
                        onClick={(e) => {
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
    testcategory: state.testcategory,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServices: AlgaehActions,
      getTestCategory: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewInvestigation)
);
