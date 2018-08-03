import { Validations } from "./InsuranceAddValidation";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";

const handleNext = ($this, e) => {
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
      debugger;
      //Save Network and Plan

      if ($this.state.insurance_plan_saved === false) {
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
      } else {
        setComponent($this, {});
      }
    } else if ($this.state.screenName === "Services") {
      //Save Services

      $this.onClose(e);
    }
  }
};

const setComponent = ($this, data, e) => {
  const { activeStep } = $this.state;
  let insurance_provider_id = 0;
  if ($this.state.activeStep === 0) {
    insurance_provider_id = data.insertId || $this.state.insurance_provider_id;
  } else {
    insurance_provider_id = $this.state.insurance_provider_id;
  }
  $this.setState(
    {
      activeStep: activeStep + 1,
      insurance_provider_id: insurance_provider_id
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

const updatedata = ($this, e) => {
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
  } else if ($this.props.opencomponent === 2) {
    if ($this.state.update_sub_insurance.length !== 0) {
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
            $this.props.onClose && $this.props.onClose(e);
          }
        },
        onFailure: error => {
          console.log(error);
        }
      });
    }
  } else if ($this.props.opencomponent === 3) {
    if ($this.state.update_network_plan_insurance.length !== 0) {
      algaehApiCall({
        uri: "/insurance/addPlanAndPolicy",
        data: $this.state.update_network_plan_insurance,
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
  } else if ($this.props.opencomponent === 4) {
    $this.props.onClose && $this.props.onClose(e);
  }
};

export { handleNext, handleBack, handleReset, updatedata };
