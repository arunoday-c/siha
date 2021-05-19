import { Validations } from "./InsuranceAddValidation";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";
import InsuranceSetup from "../../../Models/InsuranceSetup";
import axios from "axios";
import moment from "moment";

const handleNext = ($this, setp, e) => {
  // if (setp === "Close") {
  //   $this.onClose(e);
  // } else if (setp === "Next") {
  //   setComponent($this, {});
  // }
  const err = Validations($this);
  if (!err) {
    if ($this.state.screenName === "InsuranceProvider") {
      const PORTAL_HOST = process.env.REACT_APP_PORTAL_HOST;
      if ($this.state.insurance_provider_saved === false) {
        //Save Insurance
        $this.state.preapp_valid_days =
          $this.state.preapp_valid_days === "" ||
          $this.state.preapp_valid_days === null
            ? 0
            : $this.state.preapp_valid_days;
        algaehApiCall({
          uri: "/insurance/addInsuranceProvider",
          module: "insurance",
          data: $this.state,
          onSuccess: (response) => {
            if (response.data.success === true) {
              if (
                $this.state.insurance_type === "C" &&
                $this.state.portal_exists === "Y"
              ) {
                const eff_end_date = moment(
                  $this.state.effective_end_date
                ).format("YYYYMMDD");
                const firstFourLetters = String($this.state.payer_id)
                  .substring(0, 4)
                  .toUpperCase();
                const password = `${firstFourLetters}${eff_end_date}`;

                debugger;
                const _data = {
                  user_id: $this.state.payer_id,
                  password: password,
                };
                try {
                  axios
                    .post(`${PORTAL_HOST}/info/userCreation`, _data)
                    .then(function (response) {
                      //handle success
                      console.log(response);
                    })
                    .catch(function (response) {
                      //handle error
                      console.log(response);
                    });
                } catch (error) {
                  swalMessage({
                    title: error,
                    type: "error",
                  });
                }
              }
              if (setp === "Close") {
                $this.onClose(e);
              } else if (setp === "Next") {
                setComponent($this, response.data.records);
              }
            }
          },
        });
      } else {
        if (setp === "Close") {
          $this.onClose(e);
        } else if (setp === "Next") {
          setComponent($this, {});
        }
      }
    } else if ($this.state.screenName === "SubInsurance") {
      //Save Sub
      if (setp === "Close") {
        $this.onClose(e);
      } else if (setp === "Next") {
        setComponent($this, {});
      }
    } else if ($this.state.screenName === "NetworkPlan") {
      //Save Network and Plan

      if (setp === "Close") {
        $this.onClose(e);
      } else if (setp === "Next") {
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
      insurance_provider_id: insurance_provider_id,
    },
    () => {
      if ($this.state.activeStep === 0) {
        $this.setState({ screenName: "InsuranceProvider" });
      } else if ($this.state.activeStep === 1) {
        $this.setState({
          screenName: "SubInsurance",
          insurance_provider_saved: true,
        });
      } else if ($this.state.activeStep === 2) {
        $this.setState({
          screenName: "NetworkPlan",
          insurance_sub_saved: true,
        });
      } else if ($this.state.activeStep === 3) {
        $this.setState({ screenName: "Services", insurance_plan_saved: true });
      } else {
        $this.setState({
          activeStep: 0,
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
      activeStep: activeStep - 1,
    },
    () => {
      if ($this.state.activeStep === 0) {
        $this.setState({ screenName: "InsuranceProvider" });
      } else if ($this.state.activeStep === 1) {
        $this.setState({ screenName: "SubInsurance" });
      } else if ($this.state.activeStep === 2) {
        $this.setState({ screenName: "NetworkPlan" });
      } else if ($this.state.activeStep === 3) {
        $this.setState({ screenName: "Services" });
      }
    }
  );
};

const handleReset = ($this, e) => {
  $this.setState({
    activeStep: 0,
  });
};

const updatedata = ($this, e) => {
  if ($this.props.opencomponent === "1") {
    let isError = false;
    AlgaehValidation({
      querySelector: "data-validate='InsuranceProvider'", //if require section level
      fetchFromFile: true, //if required arabic error
      alertTypeIcon: "warning", // error icon
      onCatch: () => {
        isError = true;
      },
    });
    if (isError === false) {
      $this.state.preapp_valid_days =
        $this.state.preapp_valid_days === "" ||
        $this.state.preapp_valid_days === null
          ? 0
          : $this.state.preapp_valid_days;
      algaehApiCall({
        uri: "/insurance/updateInsuranceProvider",
        module: "insurance",
        method: "PUT",
        data: $this.state,
        onSuccess: (response) => {
          if (response.data.success === true) {
            if ($this.state.buttonenable === true) {
              if (
                $this.props.insuranceprovider !== undefined &&
                $this.props.insuranceprovider.length !== 0
              ) {
                $this.props.initialStateInsurance({
                  redux: {
                    type: "INSURANCE_INT_DATA",
                    mappingName: "insuranceprovider",
                    data: [],
                  },
                });
              }
            }

            let IOputs = InsuranceSetup.inputParam();
            IOputs.activeStep = 0;
            IOputs.screenName = "InsuranceProvider";

            $this.setState(IOputs, () => {
              $this.props.onClose && $this.props.onClose(e);
            });

            swalMessage({
              title: "Updated successfully . .",
              type: "success",
            });
          }
        },
      });
    }
  }
};

export { handleNext, handleBack, handleReset, updatedata };
