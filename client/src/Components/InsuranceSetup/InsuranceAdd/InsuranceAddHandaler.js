import { Validations } from "./InsuranceAddValidation";
import { algaehApiCall } from "../../../utils/algaehApiCall";

const handleNext = ($this, e) => {
  // setComponent($this);
  const err = Validations($this);
  if (!err) {
    if ($this.state.screenName === "InsuranceProvider") {
      if ($this.state.insurance_provider_saved === false) {
        //Save Insurance
        algaehApiCall({
          uri: "/insurance/addInsuranceProvider",
          data: $this.state,
          onSuccess: response => {
            if (response.data.success === true) {
              setComponent($this, response.data.records);
            }
          },
          onFailure: error => {
            console.log(error);
          }
        });
      } else {
        setComponent($this, {});
      }
    } else if ($this.state.screenName === "SubInsurance") {
      //Save Sub
      debugger;
      if ($this.state.insurance_sub_saved === false) {
        algaehApiCall({
          uri: "/insurance/addSubInsuranceProvider",
          data: $this.state.sub_insurance,
          onSuccess: response => {
            if (response.data.success === true) {
              setComponent($this, response.data.records);
            }
          },
          onFailure: error => {
            console.log(error);
          }
        });
      } else {
        setComponent($this, {});
      }
    } else if ($this.state.screenName === "NetworkPlan") {
      //Save Network and Plan
      if ($this.state.insurance_plan_saved === false) {
        algaehApiCall({
          uri: "/insurance/addNetwork",
          data: $this.state,
          onSuccess: response => {
            if (response.data.success === true) {
              algaehApiCall({
                uri: "/insurance/NetworkOfficeMaster",
                data: $this.state,
                onSuccess: response => {
                  if (response.data.success === true) {
                    setComponent($this, response.data.records);
                  }
                },
                onFailure: error => {
                  console.log(error);
                }
              });
            }
          },
          onFailure: error => {
            console.log(error);
          }
        });
      } else {
        setComponent($this, {});
      }
    } else if ($this.state.screenName === "Services") {
      //Save Services
      setComponent($this, {});
    }
  }
};

const setComponent = ($this, data) => {
  debugger;
  const { activeStep } = $this.state;
  $this.setState(
    {
      activeStep: activeStep + 1,
      insurance_provider_id: data.insertId
    },
    () => {
      if ($this.state.activeStep === 0) {
        $this.setState({ screenName: "InsuranceProvider" });
      } else if ($this.state.activeStep === 1) {
        $this.setState({
          screenName: "SubInsurance",
          insurance_provider_saved: true
        });
      } else if ($this.state.activeStep === 2) {
        $this.setState({
          screenName: "NetworkPlan",
          insurance_sub_saved: true
        });
      } else if ($this.state.activeStep === 3) {
        $this.setState({ screenName: "Services", insurance_plan_saved: true });
      }
    }
  );
};

const handleBack = ($this, e) => {
  const { activeStep } = $this.state;
  $this.setState(
    {
      activeStep: activeStep - 1
    },
    () => {
      if ($this.state.activeStep === 0) {
        $this.setState({ screenName: "InsuranceProvider" });
      } else if ($this.state.activeStep === 1) {
        $this.setState({ screenName: "SubInsurance" });
      } else if ($this.state.activeStep === 2) {
        $this.setState({ screenName: "NetworkPlanList" });
      } else if ($this.state.activeStep === 3) {
        $this.setState({ screenName: "NetworkPlan" });
      } else if ($this.state.activeStep === 4) {
        $this.setState({ screenName: "Services" });
      }
    }
  );
};

const handleReset = ($this, e) => {
  $this.setState({
    activeStep: 0
  });
};

const getCtrlCode = ($this, insCode) => {
  debugger;
  // clearInterval(intervalId);
  // intervalId = setInterval(() => {
  //   this.props.getPatientDetails({
  //     uri: "/frontDesk/get",
  //     method: "GET",
  //     printInput: true,
  //     data: { patient_code: insCode },
  //     redux: {
  //       type: "PAT_GET_DATA",
  //       mappingName: "patients"
  //     },
  //     afterSuccess: data => {
  //       data.patientRegistration.visitDetails = data.visitDetails;
  //       data.patientRegistration.patient_id =
  //         data.patientRegistration.hims_d_patient_id;
  //       data.patientRegistration.existingPatient = true;
  //       $this.setState(data.patientRegistration);

  //       $this.props.getPatientInsurance({
  //         uri: "/insurance/getPatientInsurance",
  //         method: "GET",
  //         data: { patient_id: data.patientRegistration.hims_d_patient_id },
  //         redux: {
  //           type: "EXIT_INSURANCE_GET_DATA",
  //           mappingName: "existinsurance"
  //         }
  //       });
  //     }
  //   });
  //   clearInterval(intervalId);
  // }, 500);
};

export { handleNext, handleBack, handleReset, getCtrlCode };
