import { Validations } from "./InsuranceAddValidation";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";

const handleNext = ($this, e) => {
  // setComponent($this, {});
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
    } else if ($this.state.screenName === "NetworkPlan") {
      debugger;
      //Save Network and Plan
      algaehApiCall({
        uri: "/insurance/addPlanAndPolicy",
        data: $this.state.network_plan,
        onSuccess: response => {
          if (response.data.success === true) {
            setComponent($this, response.data.records);
          }
        },
        onFailure: error => {
          console.log(error);
        }
      });
    } else if ($this.state.screenName === "Services") {
      //Save Services
      setComponent($this, {});
    }
  }
};

const setComponent = ($this, data, e) => {
  debugger;
  const { activeStep } = $this.state;
  $this.setState(
    {
      activeStep: activeStep + 1
    },
    () => {
      if ($this.state.activeStep === 0) {
        $this.setState({ screenName: "InsuranceProvider" });
      } else if ($this.state.activeStep === 1) {
        $this.setState({
          screenName: "SubInsurance",
          insurance_provider_saved: true,
          insurance_provider_id: data.insertId
        });
      } else if ($this.state.activeStep === 2) {
        $this.setState({
          screenName: "NetworkPlan",
          insurance_sub_saved: true
        });
      } else if ($this.state.activeStep === 3) {
        $this.setState({ screenName: "Services", insurance_plan_saved: true });
      } else {
        $this.setState({
          activeStep: 0
        });
        $this.props.onClose && $this.props.onClose(e);
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

const updatedata = ($this, e) => {
  debugger;
  if ($this.props.opencomponent === 1) {
    algaehApiCall({
      uri: "/insurance/updateInsuranceProvider",
      method: "PUT",
      data: $this.state,
      onSuccess: response => {
        if (response.data.success === true) {
          swal("Updated successfully . .", {
            icon: "success",
            buttons: false,
            timer: 2000
          });
          $this.props.onClose && $this.props.onClose(e);
        }
      },
      onFailure: error => {
        console.log(error);
      }
    });
  }
  if (
    $this.props.opencomponent === 2 &&
    $this.state.update_sub_insurance.length !== 0
  ) {
    debugger;
    algaehApiCall({
      uri: "/insurance/addSubInsuranceProvider",
      data: $this.state.update_sub_insurance,
      onSuccess: response => {
        if (response.data.success === true) {
          swal("Updated successfully . .", {
            icon: "success",
            buttons: false,
            timer: 2000
          });
        }
      },
      onFailure: error => {
        console.log(error);
      }
    });
  }
};

export { handleNext, handleBack, handleReset, getCtrlCode, updatedata };
