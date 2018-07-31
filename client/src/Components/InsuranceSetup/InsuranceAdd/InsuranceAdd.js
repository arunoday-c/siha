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
  stepIndex = stepIndex - 1;
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
      activeStep: 1,
      screenName: "InsuranceProvider",
      buttonenable: false

      // activeStep: 2,
      // screenName: "NetworkPlan"
    };
  }

  componentWillMount() {
    let IOputs = InsuranceSetup.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
    });
  }

  componentWillReceiveProps(nextProps) {
    debugger;

    if (
      nextProps.insuranceprovider !== undefined &&
      nextProps.insuranceprovider.length !== 0
    ) {
      this.setState({ ...this.state, ...nextProps.insuranceprovider[0] });
    }

    // if (
    //   nextProps.insurance_provider_id !== null &&
    //   nextProps.insurance_provider_id !== undefined
    // ) {
    //   this.props.getInsuranceDetails({
    //     uri: "/insurance/getListOfInsuranceProvider",
    //     method: "GET",
    //     printInput: true,
    //     data: {
    //       hims_d_insurance_provider_id: nextProps.insurance_provider_id
    //     },
    //     redux: {
    //       type: "INSURANCE_GET_DATA",
    //       mappingName: "insuranceprovider"
    //     },
    //     afterSuccess: data => {
    //       debugger;
    //       this.setState(data[0]);
    //     }
    //   });
    // }
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
    this.props.insurance_provider_id !== null
      ? (this.state.insurance_provider_id = this.props.insurance_provider_id)
      : null;
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-insurance-form">
          {this.props.addfunctionality === true ? (
            <Modal className="model-set" open={this.props.open}>
              <div
                style={{
                  backgroundColor: "#fff"
                }}
              >
                <MyContext.Provider
                  value={{
                    state: this.state,
                    updateState: obj => {
                      debugger;
                      this.setState({ ...obj });
                    }
                  }}
                >
                  <div className="colorPrimary">
                    <Typography variant="title">
                      {this.props.HeaderCaption}
                    </Typography>
                  </div>
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
                      {this.state.activeStep === steps.length ? (
                        <div>
                          <Typography className={classes.instructions}>
                            All steps completed - you&quot;re finished
                          </Typography>
                          <Button onClick={handleReset.bind(this, this)}>
                            Reset
                          </Button>
                        </div>
                      ) : (
                        <div>{getStepContent(activeStep, this)}</div>
                      )}
                    </div>
                    <br />

                    <div className="row" position="fixed">
                      <div className="col-lg-12">
                        <span className="float-left">
                          <button
                            // className="htpl1-phase1-btn-others"
                            disabled={activeStep === 0}
                            onClick={handleBack.bind(this, this)}
                            className={
                              classes.backButton + " htpl1-phase1-btn-others"
                            }
                          >
                            Previous
                          </button>

                          <button
                            className="htpl1-phase1-btn-others"
                            color="primary"
                            onClick={handleNext.bind(this, this)}
                          >
                            Save & Close
                          </button>
                        </span>

                        <span className="float-right">
                          <button
                            className="htpl1-phase1-btn-others"
                            onClick={e => {
                              this.onClose(e);
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            className="htpl1-phase1-btn-primary"
                            style={{ float: "right" }}
                            onClick={handleNext.bind(this, this)}
                          >
                            {activeStep === steps.length - 1
                              ? "Save & Finish"
                              : "Save & Next"}
                          </button>

                          <AHSnackbar
                            open={this.state.snackeropen}
                            handleClose={this.handleClose}
                            MandatoryMsg={this.state.MandatoryMsg}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </MyContext.Provider>
              </div>
            </Modal>
          ) : (
            <Modal className="model-set" open={this.props.open}>
              <div
                style={{
                  backgroundColor: "#fff"
                }}
              >
                <MyContext.Provider
                  value={{
                    state: this.state,
                    updateState: obj => {
                      debugger;
                      this.setState({ ...obj });
                    }
                  }}
                >
                  <div className="colorPrimary">
                    <Typography variant="title">
                      {this.props.HeaderCaption}
                    </Typography>
                  </div>

                  <div>{getStepContent(this.props.opencomponent, this)}</div>
                  {/* <InsuranceProvider InsuranceSetup={this.state} /> */}

                  <br />

                  <div className="row" position="fixed">
                    <div className="col-lg-12">
                      <span className="float-left">
                        <button
                          className="htpl1-phase1-btn-others"
                          onClick={e => {
                            this.onClose(e);
                          }}
                        >
                          Close
                        </button>
                      </span>

                      <span className="float-right">
                        <button
                          style={{ marginRight: "15px" }}
                          className="htpl1-phase1-btn-primary"
                          onClick={updatedata.bind(this, this)}
                        >
                          Update
                        </button>
                      </span>
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
    insuranceprovider: state.insuranceprovider
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getInsuranceDetails: AlgaehActions
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
