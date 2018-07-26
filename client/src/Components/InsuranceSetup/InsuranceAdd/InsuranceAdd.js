import React, { PureComponent } from "react";
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
import { handleNext, handleBack, handleReset } from "./InsuranceAddHandaler";
import AHSnackbar from "../../common/Inputs/AHSnackbar";
import MyContext from "../../../utils/MyContext";
// import { Validations } from "./InsuranceAddValidation";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
// import { AlgaehDateHandler, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { setGlobal } from "../../../utils/GlobalFunctions";
import { getCookie } from "../../../utils/algaehApiCall";

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
      screenName: "SubInsurance",
      snackeropen: false
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

  handleClose = () => {
    this.setState({ snackeropen: false });
  };

  onClose = e => {
    this.setState({
      activeStep: 0
    });
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <React.Fragment>
        <div className="hptl-phase1-add-insurance-form">
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
        </div>
      </React.Fragment>
    );
  }
}
// InsuranceAdd.propTypes = {
//   classes: PropTypes.object
// };

export default withStyles(styles)(InsuranceAdd);
