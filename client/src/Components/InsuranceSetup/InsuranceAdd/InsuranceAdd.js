import React, { PureComponent } from "react";
import "./../../../styles/site.css";
import { Button, Modal } from "../../Wrapper/algaehWrapper";

import Typography from "@material-ui/core/Typography";
import InsuranceProvider from "../InsuranceProvider/InsuranceProvider";
import SubInsurance from "../SubInsurance/SubInsurance";
import NetworkPlan from "../NetworkPlan/NetworkPlan";
import NetworkPlanList from "../NetworkPlanList/NetworkPlanList";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

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
  return [
    "Insurance Company",
    "Sub Insurance Company",
    "Network/Plan List",
    "Network/Plan",
    "Company Rate List"
  ];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return <InsuranceProvider />;
    case 1:
      return <SubInsurance />;
    case 2:
      return <NetworkPlanList />;
    case 3:
      return <NetworkPlan />;
    case 4:
      return "Services";
  }
}

class InsuranceAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0
    };
  }

  componentDidMount() {}

  handleNext = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep + 1
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <React.Fragment>
        <div className="">
          <Modal
            style={{
              margin: "0 auto",
              width: "150vh",
              height: "80vh",
              top: "10%"
            }}
            open={this.props.open}
          >
            <div
              style={{
                backgroundColor: "#fff"
              }}
            >
              <div className="colorPrimary">
                <Typography variant="title">
                  {this.props.HeaderCaption}
                </Typography>
              </div>
              <div className="container-fluid">
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map(label => {
                    return (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>

                <div>
                  {this.state.activeStep === steps.length ? (
                    <div>
                      <Typography className={classes.instructions}>
                        All steps completed - you&quot;re finished
                      </Typography>
                      <Button onClick={this.handleReset}>Reset</Button>
                    </div>
                  ) : (
                    <div>
                      <Typography className={classes.instructions}>
                        {getStepContent(activeStep)}
                      </Typography>
                    </div>
                  )}
                </div>
                <br />

                <div className="row" position="fixed">
                  <div className="col-lg-1">
                    <button
                      // className="htpl1-phase1-btn-others"
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={
                        classes.backButton + " htpl1-phase1-btn-others"
                      }
                    >
                      Previous
                    </button>
                  </div>
                  <div className="col-lg-2">
                    <button className="htpl1-phase1-btn-others" color="primary">
                      Save & Close
                    </button>
                  </div>
                  <div className="col-lg-6">&nbsp;</div>
                  <div className="col-lg-1">
                    <button
                      className="htpl1-phase1-btn-others"
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="col-lg-2">
                    <button
                      className="htpl1-phase1-btn-primary"
                      style={{ float: "right" }}
                      onClick={this.handleNext}
                    >
                      {activeStep === steps.length - 1
                        ? "Save & Finish"
                        : "Save & Next"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}
InsuranceAdd.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(InsuranceAdd);
