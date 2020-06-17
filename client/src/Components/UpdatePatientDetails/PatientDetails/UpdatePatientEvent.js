import moment from "moment";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import {
  saveImageOnServer,
  SetBulkState,
} from "../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import Enumerable from "linq";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
  });
};

const companyHandle = ($this, context, e) => {
  debugger
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value,
    insurance_type: e.selected.insurance_type,
    insurance_provider_name: e.selected.insurance_provider_name
  }, () => {
    if (context !== undefined) {
      context.updateState({
        [name]: value,
        insurance_type: e.selected.insurance_type,
        insurance_provider_name: e.selected.insurance_provider_name,
        ...$this.state
      });
    }
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
            countrystates: e.selected.states,
          });
        } else if (e.name === "state_id") {
          name = e.name;
          value = e.value;
          $this.setState({
            city_id: null,
            cities: e.selected.cities,
          });
        }
      }

      $this.setState({
        [name]: value,
      });

      // if (context !== undefined) {
      //   context.updateState({ [name]: value, ...$this.state });
      // }
    },
  });
};

//Todo title and gender related chnage need to do
const titlehandle = ($this, e) => {
  let setGender = null;

  if (e.selected.title === "Mr") {
    setGender = "Male";
  } else if (e.selected.title === "Mrs") {
    setGender = "Female";
  } else if (e.selected.title === "Ms") {
    setGender = "Female";
  }
  $this.setState({
    gender: setGender,
    [e.name]: e.value,
    saveEnable: false
  });

  // if (context !== undefined) {
  //   context.updateState({
  //     gender: setGender,
  //     [e.name]: e.value,
  //     saveEnable: false
  //   });
  // }

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
      date_of_birth: moment(e)._d,
    });
  } else {
    years = 0;
    months = 0;
    days = 0;
    $this.setState({
      age: years,
      AGEMM: months,
      AGEDD: days,
      date_of_birth: moment(e)._d,
    });
  }
};

const setAge = ($this, e) => {
  if (e !== undefined) {
    let years = $this.state.age;
    let months = $this.state.AGEMM;
    let days = $this.state.AGEDD;

    if (e.target.name === "AGEMM" && parseInt(e.target.value, 10) > 23) {
      swalMessage({
        title: "Age in months cannot be greater than 23.",
        type: "error",
      });
      $this.setState({
        [e.target.name]: $this.state.AGEMM,
      });
    }
    if (e.target.name === "AGEDD" && parseInt(e.target.value, 10) > 365) {
      swalMessage({
        title: "Age in days cannot be greater than 365.",
        type: "error",
      });
      $this.setState({
        [e.target.name]: $this.state.AGEDD,
      });
    } else {
      if (e.target.name === "age") years = e.target.value;
      if (e.target.name === "AGEMM") months = e.target.value;
      if (e.target.name === "AGEDD") days = e.target.value;
      let y = moment(new Date()).add(-years, "years");
      let m = y.add(-months, "months");
      let d = m.add(-days, "days");

      $this.setState({
        date_of_birth: d._d,
        [e.target.name]: e.target.value,
      });
    }
  }
};

const onDrop = ($this, file, fileType) => {
  saveImageOnServer({
    fileControl: fileType[0].preview,
  });
};

const hijriOnChange = ($this, e) => {
  const { gregorianDate } = e.target;
  if (gregorianDate === undefined || gregorianDate === "") {
    return;
  }
  const gDate = parseInt(moment(gregorianDate).format("YYYYMMDD"));
  const cDate = parseInt(moment().format("YYYYMMDD"));
  if (gDate > cDate) {
    swalMessage({
      title: "Date can not be grater than todays date",
      type: "warning",
    });
    return;
  }

  let fromDate = moment(gregorianDate);
  let toDate = new Date();
  let years = moment(toDate).diff(fromDate, "year");
  fromDate.add(years, "years");
  let months = moment(toDate).diff(fromDate, "months");
  fromDate.add(months, "months");
  let days = moment(toDate).diff(fromDate, "days");
  $this.setState({
    date_of_birth: gregorianDate,
    age: years,
    AGEMM: months,
    AGEDD: days,
  });
}

export {
  texthandle,
  titlehandle,
  calculateAge,
  setAge,
  onDrop,
  countryStatehandle,
  hijriOnChange,
  companyHandle
};
