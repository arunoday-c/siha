import moment from "moment";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";

let texthandlerInterval = null;
const texthandle = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  clearInterval(texthandlerInterval);
  texthandlerInterval = setInterval(() => {
    if (context !== undefined) {
      context.updateState({ [name]: value });
    }
    clearInterval(texthandlerInterval);
  }, 1000);
};

const countryStatehandle = ($this, context, e) => {
  let name;
  let value;
  if (e.name !== undefined) {
    if (e.name === "country_id") {
      name = e.name;
      value = e.value;
      $this.setState({
        state_id: 0,
        city_id: 0
      });
      if (context !== undefined) {
        context.updateState({
          state_id: null,
          city_id: null
        });
      }

      $this.props.getStates({
        redux: {
          data: e.selected.states,
          type: "STATE_GET_DATA",
          mappingName: "countrystates"
        }
      });
    } else if (e.name === "state_id") {
      name = e.name;
      value = e.value;
      $this.setState({
        city_id: null
      });
      if (context !== undefined) {
        context.updateState({
          city_id: null
        });
      }
      $this.props.getCities({
        redux: {
          data: e.selected.cities,
          type: "CITY_GET_DATA",
          mappingName: "cities"
        }
      });
    }
  }

  $this.setState({
    [name]: value
  });

  if (context !== undefined) {
    context.updateState({ [name]: value });
  }
};

//Todo title and gender related chnage need to do
const titlehandle = ($this, context, e) => {
  let setGender = null;
  if (e.value === 1) {
    setGender = "Male";
  } else if (e.value === 2) {
    setGender = "Female";
  }
  $this.setState({
    gender: setGender,
    [e.name]: e.value
  });

  if (context !== undefined) {
    context.updateState({ gender: setGender, [e.name]: e.value });
  }
};

const calculateAge = ($this, context, e) => {
  let fromDate = moment(e);
  let toDate = new Date();
  let years = moment(toDate).diff(fromDate, "year");
  fromDate.add(years, "years");
  let months = moment(toDate).diff(fromDate, "months");
  fromDate.add(months, "months");
  let days = moment(toDate).diff(fromDate, "days");
  if (e !== undefined) {
    $this.setState({
      age: years,
      AGEMM: months,
      AGEDD: days,
      date_of_birth: moment(e)._d
    });
  } else {
    years = 0;
    months = 0;
    days = 0;
    $this.setState({
      age: years,
      AGEMM: months,
      AGEDD: days,
      date_of_birth: moment(e)._d
    });
  }
  if (context !== undefined) {
    context.updateState({
      date_of_birth: moment(e)._d,
      age: years,
      AGEMM: months,
      AGEDD: days,
      age_in_years: years,
      age_in_months: months,
      age_in_days: days
    });
  }
};

const setAge = ($this, context, e) => {
  if (e !== undefined) {
    let years = context.state.age;
    let months = context.state.AGEMM;
    let days = context.state.AGEDD;
    if (e.target.name === "age") years = e.target.value;
    if (e.target.name === "AGEMM") months = e.target.value;
    if (e.target.name === "AGEDD") days = e.target.value;
    let y = moment(new Date()).add(-years, "years");
    let m = y.add(-months, "months");
    let d = m.add(-days, "days");

    $this.setState({
      date_of_birth: d._d,
      [e.target.name]: e.target.value
    });

    if (context !== undefined) {
      context.updateState({
        [e.target.name]: e.target.value,
        date_of_birth: d._d
      });
    }
  }
};

const numberSet = ($this, context, cntrl, e) => {
  $this.setState({
    [e.target.name]: e.target.value
  });
  if (context !== undefined) {
    context.updateState({ [e.target.name]: e.target.value });
  }
};

const onDrop = ($this, file, context, fileType) => {
  $this.setState({ [file]: fileType[0].preview });
  if (context !== undefined) {
    context.updateState({ [file]: fileType[0].preview });
  }
};

const nationalityhandle = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  //TODO HOSPITAL
  $this.props.getHospitalDetails({
    uri: "/organization/getOrganization",
    method: "GET",
    data: { hims_d_hospital_id: 1 },
    redux: {
      type: "HOSPITAL_DETAILS_GET_DATA",
      mappingName: "hospitaldetails"
    },
    afterSuccess: data => {
      debugger;
      let vat_applicable = "Y";

      if (
        data[0].local_vat_applicable === "N" &&
        data[0].default_nationality === value
      ) {
        vat_applicable = "N";
      }
      $this.setState(
        {
          [name]: value,
          vat_applicable: vat_applicable
        },
        () => {
          if ($this.state.appointment_patient === "Y") {
            // $this.processInsurance.Click();
            generateBillDetails($this, context);
          }
        }
      );

      clearInterval(texthandlerInterval);
      texthandlerInterval = setInterval(() => {
        if (context !== undefined) {
          context.updateState({
            [name]: value,
            vat_applicable: vat_applicable
          });
        }
        clearInterval(texthandlerInterval);
      }, 1000);
    }
  });
};

const generateBillDetails = ($this, context) => {
  let serviceInput = [
    {
      insured: $this.state.insured,
      //TODO change middle ware to promisify function --added by Nowshad
      vat_applicable: $this.state.vat_applicable,
      hims_d_services_id: $this.state.hims_d_services_id,
      primary_insurance_provider_id: $this.state.primary_insurance_provider_id,
      primary_network_office_id: $this.state.primary_network_office_id,
      primary_network_id: $this.state.primary_network_id,
      sec_insured: $this.state.sec_insured,
      secondary_insurance_provider_id:
        $this.state.secondary_insurance_provider_id,
      secondary_network_id: $this.state.secondary_network_id,
      secondary_network_office_id: $this.state.secondary_network_office_id
    }
  ];
  AlgaehLoader({ show: true });
  $this.props.generateBill({
    uri: "/billing/getBillDetails",
    method: "POST",
    data: serviceInput,
    redux: {
      type: "BILL_GEN_GET_DATA",
      mappingName: "xxx"
    },
    afterSuccess: data => {
      if (context != null) {
        context.updateState({ ...data });
      }

      $this.props.billingCalculations({
        uri: "/billing/billingCalculations",
        method: "POST",
        data: data,
        redux: {
          type: "BILL_HEADER_GEN_GET_DATA",
          mappingName: "genbill"
        },
        afterSuccess: data => {
          AlgaehLoader({ show: false });
        }
      });
    }
  });
};

export {
  texthandle,
  titlehandle,
  calculateAge,
  setAge,
  numberSet,
  onDrop,
  countryStatehandle,
  nationalityhandle,
  generateBillDetails
};
