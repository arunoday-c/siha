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
import { texthandle, InsertLabTest } from "./NewInvestigationEvent";
import variableJson from "../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../actions/algaehActions";
import LabInvestigation from "../LabInvestigation/LabInvestigation";
import RadInvestigation from "../RadInvestigation/RadInvestigation";
// import { successfulMessage } from "../../../utils/GlobalFunctions";
// import { getCookie } from "../../../utils/algaehApiCall";
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
    if (this.props.cptcodes === undefined || this.props.cptcodes.length === 0) {
      this.props.getCptcodes({
        uri: "/icdcptcodes/selectIcdcptCodes",
        method: "GET",
        redux: {
          type: "CPTCODES_GET_DATA",
          mappingName: "cptcodes"
        }
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.InvestigationPop.hims_d_investigation_test_id !== undefined) {
      let IOputs = newProps.InvestigationPop;
      IOputs.InvestigationtypeEnable = true;
      this.setState({ ...this.state, ...IOputs });
    } else {
      let IOputs = InvestigationIOputs.inputParam();
      IOputs.InvestigationtypeEnable = false;
      this.setState({ ...this.state, ...IOputs });
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
                  <AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
                    label={{
                      fieldName: "cpt_id"
                    }}
                    selector={{
                      name: "cpt_id",
                      className: "select-fld",
                      value: this.state.cpt_id,
                      dataSource: {
                        textField: "icd_code",
                        valueField: "hims_d_icd_id",
                        data: []
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                  <AlagehAutoComplete
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
                  />
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
    cptcodes: state.cptcodes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getServices: AlgaehActions,
      getCptcodes: AlgaehActions
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
