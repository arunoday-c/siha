import moment from "moment";
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
  let setGender;
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

const setAge = ($this, context, ctrl, e) => {
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

export {
  texthandle,
  titlehandle,
  calculateAge,
  setAge,
  numberSet,
  onDrop,
  countryStatehandle
};
