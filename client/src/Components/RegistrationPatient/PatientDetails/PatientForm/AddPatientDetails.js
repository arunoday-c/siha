import moment from "moment";

const texthandle = (context, e) => {
  debugger;
  let name;
  let value;
  if (e.name != null) {
    name = e.name;
    value = e.value;
  } else {
    name = e.target.name;
    value = e.target.value;
  }

  if (context != null) {
    context.updateState({ [name]: value });
  }
};
//Todo title and gender related chnage need to do
const titlehandle = ($this, context, e) => {
  debugger;
  let setGender;
  if (e.value == 1) {
    setGender = "Male";
  } else if (e.value == 2) {
    setGender = "Female";
  }

  $this.setState({
    gender: setGender,
    title_id: e.value
  });

  if (context != null) {
    context.updateState({ gender: setGender, title_id: e.value });
  }
};

const calculateAge = ($this, context, e) => {
  debugger;
  let fromDate = moment(e._d);
  let toDate = new Date();
  let years = moment(toDate).diff(fromDate, "year");
  fromDate.add(years, "years");
  let months = moment(toDate).diff(fromDate, "months");
  fromDate.add(months, "months");
  let days = moment(toDate).diff(fromDate, "days");

  $this.setState({
    age: years,
    AGEMM: months,
    AGEDD: days
  });
  if (context != null) {
    context.updateState({
      date_of_birth: moment(e._d).format("DD-MM-YYYY"),
      age: years,
      AGEMM: months,
      AGEDD: days
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
      date_of_birth: d.format("DD-MM-YYYY"),
      AGEMM: months,
      AGEDD: days
    });

    if (context != null) {
      context.updateState({
        [e.target.name]: e.target.value,
        date_of_birth: d.format("DD-MM-YYYY")
      });
    }
  }
};

const numberSet = (context, cntrl, e) => {
  debugger;
  if (context != null) {
    context.updateState({ [e.target.name]: e.target.value });
  }
};

const onDrop = ($this, file, fileType) => {
  debugger;
  let obj = new Object();
  obj[file] = fileType[0].preview;
  $this.setState({
    file: obj
  });
};

export { texthandle, titlehandle, calculateAge, setAge, numberSet, onDrop };
