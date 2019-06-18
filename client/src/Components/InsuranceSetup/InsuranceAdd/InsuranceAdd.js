import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./../../../styles/site.css";
import "./InsuranceAdd.css";
import { AlgaehModalPopUp } from "../../Wrapper/algaehWrapper";

import InsuranceProvider from "../InsuranceProvider/InsuranceProvider";
import SubInsurance from "../SubInsurance/SubInsurance";
import NetworkPlan from "../NetworkPlan/NetworkPlan";
import ServicePriceList from "../ServicePriceList/ServicePriceList";
// import NetworkPlanList from "../NetworkPlanList/NetworkPlanList";
import InsuranceSetup from "../../../Models/InsuranceSetup";
import { handleNext, handleBack, updatedata } from "./InsuranceAddHandaler";

import MyContext from "../../../utils/MyContext";
import { setGlobal } from "../../../utils/GlobalFunctions";
import { getCookie } from "../../../utils/algaehApiCall";
import { AlgaehActions } from "../../../actions/algaehActions";

function getSteps() {
  return ["Insurance Provider", "Sub Insurance", "Network/Plan", "Price List"];
}

function getStepContent(stepIndex, $this) {
  if ($this.state.buttonenable === true) {
    stepIndex = stepIndex - 1;
  }
  // $this.state.buttonenable === true ? (stepIndex = stepIndex - 1) : null;
  switch (stepIndex) {
    case 0:
      return <InsuranceProvider InsuranceSetup={$this.state} />;
    case 1:
      return <SubInsurance InsuranceSetup={$this.state} />;
    case 2:
      return <NetworkPlan InsuranceSetup={$this.state} />;
    case 3:
      return <ServicePriceList InsuranceSetup={$this.state} />;
    default:
      break;
  }
}

class InsuranceAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      screenName: "InsuranceProvider",
      buttonenable: false
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
    // if (
    //   nextProps.insuranceprovider !== undefined &&
    //   nextProps.insuranceprovider.length !== 0
    // ) {
    //   this.setState({ ...this.state, ...nextProps.insuranceprovider[0] });
    // } else {
    //   if (this.state.insurance_provider_saved === false) {
    //     let IOputs = InsuranceSetup.inputParam();
    //     let prevLang = getCookie("Language");
    //     IOputs.selectedLang = prevLang;
    //     this.setState(IOputs);
    //   }
    // }

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

    // if (
    //   nextProps.subinsuranceprovider !== undefined &&
    //   nextProps.subinsuranceprovider.length !== 0
    // ) {
    //   this.setState({ sub_insurance: nextProps.subinsuranceprovider });
    // }

    let insurance_provider_id = null;
    let insurance_provider_name = null;
    if (nextProps.buttonenable === true) {
      insurance_provider_id =
        nextProps.insurance_provider_id !== null
          ? nextProps.insurance_provider_id
          : null;

      insurance_provider_name =
        nextProps.insurance_provider_name !== null
          ? nextProps.insurance_provider_name
          : null;
    }
    this.setState({
      buttonenable: nextProps.buttonenable,
      insurance_provider_id: insurance_provider_id,
      insurance_provider_name: insurance_provider_name
    });
  }

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
    
    let IOputs = InsuranceSetup.inputParam();
    IOputs.activeStep = 0;
    IOputs.screenName = "InsuranceProvider";
    this.setState(IOputs, () => {
      this.props.onClose && this.props.onClose(e);
    });
  };

  render() {
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <React.Fragment>
        <div className="hptl-phase1-add-insurance-form">
          {this.props.addfunctionality === true ? (
            <AlgaehModalPopUp
              events={{
                onClose: this.onClose.bind(this)
              }}
              title={this.props.HeaderCaption}
              openPopup={this.props.open}
            >
              <div className="popupInner">
                <MyContext.Provider
                  value={{
                    state: this.state,
                    updateState: obj => {
                      this.setState({ ...obj });
                    }
                  }}
                >
                  <div className="stepper-set">
                    <ul className="progressbar">
                      <li className="active">Insurance Provider</li>
                      <li
                        className={
                          this.state.screenName === "SubInsurance" ||
                          this.state.screenName === "NetworkPlan" ||
                          this.state.screenName === "Services"
                            ? "active"
                            : ""
                        }
                      >
                        Sub Insurance
                      </li>
                      <li
                        className={
                          this.state.screenName === "NetworkPlan" ||
                          this.state.screenName === "Services"
                            ? "active"
                            : ""
                        }
                      >
                        Network/Plan
                      </li>
                      <li
                        className={
                          this.state.screenName === "Services" ? "active" : ""
                        }
                      >
                        Price List
                      </li>
                    </ul>
                    {/* <Stepper
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
                    </Stepper> */}
                  </div>
                  {this.state.activeStep === steps.length ? null : (
                    <div>{getStepContent(activeStep, this)}</div>
                  )}
                </MyContext.Provider>
              </div>

              <div className="popupFooter">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-4">
                      <button
                        disabled={activeStep === 0}
                        onClick={handleBack.bind(this, this)}
                        type="button"
                        className="btn btn-default btn-left"
                      >
                        Previous
                      </button>
                    </div>
                    <div className="col-lg-8">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNext.bind(this, this, "Next")}
                      >
                        {activeStep === steps.length - 1
                          ? "Finish"
                          : "Save & Next"}
                      </button>
                      <button
                        onClick={handleNext.bind(this, this, "Close")}
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
                    </div>
                  </div>
                </div>
              </div>
            </AlgaehModalPopUp>
          ) : (
            <AlgaehModalPopUp
              events={{
                onClose: this.onClose.bind(this)
              }}
              title={this.props.HeaderCaption}
              openPopup={this.props.open}
            >
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
            </AlgaehModalPopUp>
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InsuranceAdd)
);

// export default withStyles(styles)(InsuranceAdd);
