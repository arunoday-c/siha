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
  Modal
} from "../../Wrapper/algaehWrapper";
import { texthandle, InsertLabTest } from "./NewInvestigationEvent";
import variableJson from "../../../utils/GlobalVariables.json";
import Typography from "@material-ui/core/Typography";
import { AlgaehActions } from "../../../actions/algaehActions";
import LabInvestigation from "../LabInvestigation/LabInvestigation";
import RadInvestigation from "../RadInvestigation/RadInvestigation";
// import { successfulMessage } from "../../../utils/GlobalFunctions";
// import { getCookie } from "../../../utils/algaehApiCall";
import InvestigationIOputs from "../../../Models/InvestigationSetup";
import MyContext from "../../../utils/MyContext.js";
import AHSnackbar from "../../common/Inputs/AHSnackbar.js";

class NewInvestigation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      MandatoryMsg: "",
      InvestigationtypeEnable: false
    };
  }
  componentWillMount() {
    let IOputs = InvestigationIOputs.inputParam();
    this.setState({ ...this.state, ...IOputs });
  }

  componentDidMount() {
    this.props.getServices({
      uri: "/serviceType/getService",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "services"
      }
    });

    this.props.getCptcodes({
      uri: "/icdcptcodes/selectIcdcptCodes",
      method: "GET",
      redux: {
        type: "CPTCODES_GET_DATA",
        mappingName: "cptcodes"
      }
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.InvestigationPop.hims_d_investigation_test_id !== undefined) {
      let IOputs = newProps.InvestigationPop;
      IOputs.InvestigationtypeEnable = true;
      this.setState({ ...this.state, ...IOputs });
    }
    // else {
    //   debugger;

    //   let IOputs = InvestigationIOputs.inputParam();
    //   this.setState({ ...this.state, ...IOputs });
    // }
  }
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <Modal
            style={{
              margin: "0 auto",
              width: "120vh"
              // height: "80vh"
            }}
            open={this.props.open}
          >
            <div className="hptl-phase1-add-investigation-form">
              <div className="colorPrimary header">
                <Typography variant="title">Investigation</Typography>
              </div>

              {/* <div className="hptl-phase1-add-advance-form"> */}
              <div className="container-fluid">
                <div className="row form-details">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
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
                        disabled: this.state.InvestigationtypeEnable
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                </div>
                <div className="row form-details">
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
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
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
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
                        data: this.props.services
                      },
                      onChange: texthandle.bind(this, this)
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
                        data: this.props.cptcodes
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
                <div className="row button">
                  <div className="col-lg-8"> &nbsp;</div>

                  <div className="col-lg-2">
                    <button
                      variant="contained"
                      className="htpl1-phase1-btn-secondary"
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      <AlgaehLabel label={{ fieldName: "btnCancel" }} />
                    </button>
                  </div>
                  <div className="col-lg-2">
                    <button
                      className="htpl1-phase1-btn-primary"
                      onClick={InsertLabTest.bind(this, this)}
                      color="primary"
                      variant="contained"
                    >
                      {this.state.hims_d_investigation_test_id === null ? (
                        <AlgaehLabel label={{ fieldName: "btnSave" }} />
                      ) : (
                        <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                      )}
                    </button>
                  </div>

                  <AHSnackbar
                    open={this.state.open}
                    handleClose={this.handleClose}
                    MandatoryMsg={this.state.MandatoryMsg}
                  />
                </div>
              </div>
            </div>

            {/* <AHSnackbar
                open={this.state.open}
                handleClose={this.handleClose}
                MandatoryMsg={this.state.MandatoryMsg}
              /> */}
            {/* </div> */}
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    services: state.services,
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
