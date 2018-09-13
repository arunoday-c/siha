import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./../../../styles/site.css";
import "./InsuranceAdd.css";
import { Button, Modal } from "../../Wrapper/algaehWrapper";

import Typography from "@material-ui/core/Typography";
import InsuranceProvider from "../InsuranceProvider/InsuranceProvider";
import SubInsurance from "../SubInsurance/SubInsurance";
import NetworkPlan from "../NetworkPlan/NetworkPlan";
import ServicePriceList from "../ServicePriceList/ServicePriceList";
// import NetworkPlanList from "../NetworkPlanList/NetworkPlanList";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InsuranceSetup from "../../../Models/InsuranceSetup";
import {
  handleNext,
  handleBack,
  handleReset,
  updatedata
} from "./InsuranceAddHandaler";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";

import AHSnackbar from "../../common/Inputs/AHSnackbar";
import MyContext from "../../../utils/MyContext";
import { setGlobal } from "../../../utils/GlobalFunctions";
import { getCookie } from "../../../utils/algaehApiCall";
import { AlgaehActions } from "../../../actions/algaehActions";

const styles = theme => ({
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  button: {
    marginRight: theme.spacing.unit
  }
});

function getSteps() {
  return ["Insurance Provider", "Sub Insurance", "Network/Plan", "Price List"];
}

function getStepContent(stepIndex, $this) {
  $this.state.buttonenable === true ? (stepIndex = stepIndex - 1) : null;
  switch (stepIndex) {
    case 0:
      return <InsuranceProvider InsuranceSetup={$this.state} />;
    case 1:
      return <SubInsurance InsuranceSetup={$this.state} />;
    case 2:
      return <NetworkPlan InsuranceSetup={$this.state} />;
    case 3:
      return <ServicePriceList InsuranceSetup={$this.state} />;
  }
}

class InsuranceAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      screenName: "InsuranceProvider",
      buttonenable: false

      // activeStep: 3,
      // screenName: "Services"
    };
  }

  componentWillMount() {
    let IOputs = InsuranceSetup.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    debugger;
    let prevLang = getCookie("Language");

    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.insuranceprovider !== undefined &&
      nextProps.insuranceprovider.length !== 0
    ) {
      this.setState({ ...this.state, ...nextProps.insuranceprovider[0] });
    } else {
      if (this.state.insurance_provider_saved === false) {
        let IOputs = InsuranceSetup.inputParam();
        let prevLang = getCookie("Language");
        IOputs.selectedLang = prevLang;
        this.setState(IOputs);
      }
    }
    if (
      nextProps.subinsuranceprovider !== undefined &&
      nextProps.subinsuranceprovider.length !== 0
    ) {
      this.setState({ sub_insurance: nextProps.subinsuranceprovider });
    }
  }

  handleClose = () => {
    this.setState({ snackeropen: false });
  };

  onClose = e => {
    if (this.state.screenName === "SubInsurance") {
      if (this.state.sub_insurance.length === 0) {
        handleNext.bind(this, this);
      }
    }

    if (this.state.buttonenable === true) {
      if (
        this.props.insuranceprovider !== undefined &&
        this.props.insuranceprovider.length !== 0
      ) {
        this.props.initialStateInsurance({
          redux: {
            type: "INSURANCE_INT_DATA",
            mappingName: "insuranceprovider",
            data: []
          }
        });
      }
    }

    this.setState({
      activeStep: 0
    });
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    this.state.buttonenable = this.props.buttonenable;

    if (this.state.buttonenable === true) {
      this.props.insurance_provider_id !== null
        ? (this.state.insurance_provider_id = this.props.insurance_provider_id)
        : (this.state.insurance_provider_id = null);

      this.props.insurance_provider_name !== null
        ? (this.state.insurance_provider_name = this.props.insurance_provider_name)
        : (this.state.insurance_provider_id = null);
    }
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-insurance-form">
          {this.props.addfunctionality === true ? (
            <Modal className="model-set" open={this.props.open}>
              <div className="algaeh-modal">
                <div className="popupHeader">
                  <div className="row">
                    <div className="col-lg-8">
                      <h4>{this.props.HeaderCaption}</h4>
                    </div>
                    <div className="col-lg-4">
                      <button
                        type="button"
                        className=""
                        onClick={e => {
                          this.onClose(e);
                        }}
                      >
                        <i className="fas fa-times-circle" />
                      </button>
                    </div>
                  </div>
                </div>
                <MyContext.Provider
                  value={{
                    state: this.state,
                    updateState: obj => {
                      this.setState({ ...obj });
                    }
                  }}
                >
                  <div className="stepper-set">
                    <Stepper
                      activeStep={activeStep}
                      alternativeLabel
                      style={{
                        backgroundColor: "#DFFFFD",
                        borderBottom: "1px solid #E6E6E6"
                      }}
                    >
                      {steps.map(label => {
                        return (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </div>
                  <div className="container-fluid">
                    <div>
                      {this.state.activeStep === steps.length ? null : (
                        <div>{getStepContent(activeStep, this)}</div>
                      )}
                    </div>
                    <br />

                    <div className="row popupFooter">
                      <div className="col-lg-4">
                        <button
                          disabled={activeStep === 0}
                          onClick={handleBack.bind(this, this)}
                          type="button"
                          className="btn btn-default button-left"
                        >
                          Previous
                        </button>
                      </div>
                      <div className="col-lg-8">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleNext.bind(this, this)}
                        >
                          {activeStep === steps.length - 1
                            ? "Finish"
                            : "Save & Next"}
                        </button>
                        <button
                          onClick={handleNext.bind(this, this)}
                          type="button"
                          className="btn btn-default"
                        >
                          Save & Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={e => {
                            this.onClose(e);
                          }}
                        >
                          Cancel
                        </button>
                        <AHSnackbar
                          open={this.state.snackeropen}
                          handleClose={this.handleClose}
                          MandatoryMsg={this.state.MandatoryMsg}
                        />
                      </div>
                    </div>
                  </div>
                </MyContext.Provider>
              </div>
            </Modal>
          ) : (
            <Modal className="model-set" open={this.props.open}>
              <div className="algaeh-modal">
                <div className="popupHeader">
                  <div className="row">
                    <div className="col-lg-8">
                      <h4>{this.props.HeaderCaption}</h4>
                    </div>
                    <div className="col-lg-4">
                      <button
                        type="button"
                        className=""
                        onClick={e => {
                          this.onClose(e);
                        }}
                      >
                        <i className="fas fa-times-circle" />
                      </button>
                    </div>
                  </div>
                </div>
                <MyContext.Provider
                  value={{
                    state: this.state,
                    updateState: obj => {
                      this.setState({ ...obj });
                    }
                  }}
                >
                  <div className="popupInner">
                    {getStepContent(this.props.opencomponent, this)}
                  </div>

                  <div className="popupFooter">
                    <div className="col-lg-12">
                      {this.props.opencomponent === "1" ? (
                        <button
                          onClick={updatedata.bind(this, this)}
                          type="button"
                          className="btn btn-primary"
                        >
                          Update
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={e => {
                          this.onClose(e);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </MyContext.Provider>
              </div>
            </Modal>
          )}
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    insuranceprovider: state.insuranceprovider,
    subinsuranceprovider: state.subinsuranceprovider
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getInsuranceDetails: AlgaehActions,
      getSubInsuranceDetails: AlgaehActions,
      initialStateInsurance: AlgaehActions
    },
    dispatch
  );
}

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(InsuranceAdd)
  )
);

// export default withStyles(styles)(InsuranceAdd);
