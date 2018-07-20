import moment from "moment";

const texthandle = ($this, context, e) => {
  let name;
  let value;
  if (e.name != null) {
    name = e.name;
    value = e.value;
  } else {
    name = e.target.name;
    value = e.target.value;
  }

  $this.setState({
    [name]: value
  });

  if (context != null) {
    context.updateState({ [name]: value });
  }
};

const countryStatehandle = ($this, context, e) => {
  let name;
  let value;
  if (e.name != null) {
    if (e.name == "country_id") {
      name = e.name;
      value = e.value;
      $this.setState(
        {
          state_id: 0,
          city_id: 0
        },
        () => {
          console.log("State ID", $this.state.state_id);
        }
      );
      if (context != null) {
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
    } else if (e.name == "state_id") {
      name = e.name;
      value = e.value;
      $this.setState({
        city_id: null
      });
      if (context != null) {
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

  if (context != null) {
    context.updateState({ [name]: value });
  }
};

//Todo title and gender related chnage need to do
const titlehandle = ($this, context, e) => {
  let setGender;
  if (e.value == 1) {
    setGender = "Male";
  } else if (e.value == 2) {
    setGender = "Female";
  }
  $this.setState({
    gender: setGender,
    [e.name]: e.value
  });

  if (context != null) {
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
  if (e != null) {
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
  if (context != null) {
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
  if (e !== null) {
    let years = context.state.age;
    let months = context.state.AGEMM;
    let days = context.state.AGEDD;
    if (e.target.name == "age") years = e.target.value;
    if (e.target.name == "AGEMM") months = e.target.value;
    if (e.target.name == "AGEDD") days = e.target.value;
    let y = moment(new Date()).add(-years, "years");
    let m = y.add(-months, "months");
    let d = m.add(-days, "days");

    $this.setState({
      date_of_birth: d._d,
      [e.target.name]: e.target.value
    });

    if (context != null) {
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
  if (context != null) {
    context.updateState({ [e.target.name]: e.target.value });
  }
};

const onDrop = ($this, file, fileType) => {
  $this.setState({ [file]: fileType[0].preview });
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
