import moment from "moment";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import {
  saveImageOnServer,
  SetBulkState
} from "../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";

const texthandle = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const countryStatehandle = ($this, e) => {
  let name;
  let value;

  SetBulkState({
    state: $this,
    callback: () => {
      if (e.name !== undefined) {
        if (e.name === "country_id") {
          name = e.name;
          value = e.value;
          $this.setState({
            state_id: null,
            city_id: null,
            countrystates: e.selected.states
          });
        } else if (e.name === "state_id") {
          name = e.name;
          value = e.value;
          $this.setState({
            city_id: null,
            cities: e.selected.cities
          });
        }
      }

      $this.setState({
        [name]: value
      });

      // if (context !== undefined) {
      //   context.updateState({ [name]: value, ...$this.state });
      // }
    }
  });
};

//Todo title and gender related chnage need to do
const titlehandle = ($this, e) => {
  let setGender = null;

  if (e.value === undefined) {
    $this.setState({
      gender: setGender,
      [e]: null
    });
  } else {
    debugger;
    if (e.selected.title === "Mr") {
      setGender = "Male";
    } else if (e.selected.title === "Mrs") {
      setGender = "Female";
    } else if (e.selected.title === "Ms") {
      setGender = "Female";
    }
    $this.setState({
      gender: setGender,
      [e.name]: e.value
    });
  }
};

const calculateAge = ($this, e) => {
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
};

const setAge = ($this, e) => {
  if (e !== undefined) {
    let years = $this.state.age;
    let months = $this.state.AGEMM;
    let days = $this.state.AGEDD;
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
  }
};

const onDrop = ($this, file, fileType) => {
  saveImageOnServer({
    fileControl: fileType[0].preview
  });
};

const nationalityhandle = ($this, context, e) => {
  SetBulkState({
    state: $this,
    callback: () => {
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;
      //TODO HOSPITAL
      debugger;
      let hospitaldetails = Enumerable.from($this.props.hospitaldetails)
        .where(w => w.hims_d_hospital_id === 1)
        .firstOrDefault();

      let vat_applicable = "Y";
      debugger;
      if (
        hospitaldetails.local_vat_applicable === "N" &&
        hospitaldetails.default_nationality === value
      ) {
        vat_applicable = "N";
      }
      $this.setState(
        {
          [name]: value,
          vat_applicable: vat_applicable
        },
        () => {
          debugger;
          if (
            $this.state.appointment_patient === "Y" ||
            $this.state.doctor_id !== null
          ) {
            // $this.processInsurance.Click();
            generateBillDetails($this, context);
          } else {
            if (context !== undefined) {
              context.updateState({
                ...$this.state
              });
            }
          }
        }
      );
    }
  });
};

const generateBillDetails = ($this, context) => {
  SetBulkState({
    state: $this,
    callback: () => {
      debugger;
      let serviceInput = [
        {
          insured: $this.state.insured,
          //TODO change middle ware to promisify function --added by Nowshad
          vat_applicable: $this.state.vat_applicable,
          hims_d_services_id: $this.state.hims_d_services_id,
          primary_insurance_provider_id:
            $this.state.primary_insurance_provider_id,
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

      algaehApiCall({
        uri: "/billing/getBillDetails",
        method: "POST",
        data: serviceInput,
        onSuccess: response => {
          if (response.data.success) {
            if (context !== null) {
              context.updateState({ ...response.data.records });
            }

            algaehApiCall({
              uri: "/billing/billingCalculations",
              method: "POST",
              data: response.data.records,
              onSuccess: response => {
                if (response.data.success) {
                  if (context !== null) {
                    context.updateState({ ...response.data.records });
                  }
                }
                AlgaehLoader({ show: false });
              },
              onFailure: error => {
                AlgaehLoader({ show: false });
                swalMessage({
                  title: error.message,
                  type: "error"
                });
              }
            });
          }
        },
        onFailure: error => {
          AlgaehLoader({ show: false });
          swalMessage({
            title: error.message,
            type: "error"
          });
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
  onDrop,
  countryStatehandle,
  nationalityhandle,
  generateBillDetails
};
