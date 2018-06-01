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
const titlehandle = (context, e) => {
  let setGender;
  if (e.value == 1) {
    setGender = "Male";
  } else if (e.value == 2) {
    setGender = "Female";
  }

  if (context != null) {
    context.updateState({ gender: setGender, title_id: e.value });
  }
};

const calculateAge = (context, e) => {
  let fromDate = e;
  let toDate = new Date();
  let years = moment(toDate).diff(fromDate, "year");
  fromDate.add(years, "years");
  let months = moment(toDate).diff(fromDate, "months");
  fromDate.add(months, "months");
  let days = moment(toDate).diff(fromDate, "days");

  if (context != null) {
    context.updateState({
      date_of_birth: e._d,
      age: years,
      AGEMM: months,
      AGEDD: days
    });
  }
};

const setAge = (context, ctrl, e) => {
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
export { texthandle, titlehandle, calculateAge, setAge, numberSet };

export function AddPatientHandlers(state, context) {
  context = context || null;
  // debugger;
  return {
    // texthandle: e => {
    //   debugger;
    //   state.setState({
    //     [e.target.name]: e.target.value
    //   });

    //   if (context != null) {
    //     context.updateState({ [e.target.name]: e.target.value });
    //   }
    // },

    // selectedHandeler: e => {
    //   debugger;
    //   state.setState({
    //     [e.name]: e.value
    //   });
    //   if (context != null) {
    //     context.updateState({ [e.name]: e.value });
    //   }
    // },
    // numbertexthandle: (ctrl, e) => {
    //   debugger;
    //   state.setState({
    //     [e.target.name]: e.target.value
    //   });

    //   if (context != null) {
    //     context.updateState({ [e.target.name]: e.target.value });
    //   }
    // },

    // titlehandle: e => {
    //   debugger;
    //   let setGender;
    //   if (e.value == 1) {
    //     setGender = "Male";
    //   } else if (e.value == 2) {
    //     setGender = "Female";
    //   }

    //   if (context != null) {
    //     context.updateState({ gender: setGender, title_id: e.value });
    //   }
    // },

    // CalculateAge: e => {
    //   debugger;
    //   const err = DateOfBirthValidation(state, e._d);
    //   console.log(err);
    //   if (!err) {
    //     state.setState(
    //       {
    //         date_of_birth: moment(e._d).format("YYYY-MM-DD")
    //       },
    //       () => {
    //         debugger;
    //         if (context != null) {
    //           context.updateState({
    //             date_of_birth: moment(state.state.date_of_birth).format(
    //               "YYYY-MM-DD"
    //             )
    //           });
    //         }

    //         var one_day = 1000 * 60 * 60 * 24;
    //         var today = new Date();
    //         var other_date = new Date(state.state.date_of_birth);

    //         var Birth_date = new Date(
    //           other_date.getFullYear(),
    //           other_date.getMonth(),
    //           other_date.getDate()
    //         );
    //         if (Birth_date > today) return;

    //         var Years = today.getFullYear() - other_date.getFullYear();
    //         var Months = today.getMonth() - other_date.getMonth();
    //         var Days = today.getDate() - other_date.getDate();

    //         if (Days < 0) state.state.AGEMM = Months - 1;

    //         if (Months < 0) {
    //           Years = Years - 1;
    //           Months = Months + 12;
    //         }

    //         state.setState(
    //           {
    //             age: Years,
    //             AGEMM: Months,
    //             AGEDD: Days
    //           },
    //           () => {
    //             if (context != null) {
    //               context.updateState({ age: state.state.age });
    //             }
    //           }
    //         );
    //       }
    //     );
    //   }
    // },

    //Calculates Date of birth with given Age in Years, Months & Days
    //Starts here
    //Calculates Date of birth with given Age in Years, Months & Days
    //Starts here
    // SetAge: (ctrl, e) => {
    //   debugger;
    //   console.log("Length-", e.target.value.length);
    //   if (e.target.value.length > "0") {
    //     state.setState(
    //       {
    //         [e.target.name]: e.target.value
    //       },
    //       () => {
    //         CalculateDateofBirth(state);
    //         if (context != null) {
    //           context.updateState({ age: state.state.age });
    //         }
    //       }
    //     );
    //   }
    // },

    onDrop: (file, fileType) => {
      debugger;
      imageDataToFile(state, file, fileType);
    },

    handleClose: () => {
      state.setState({ DOBError: false });
    }
  };
}

export function imageDataToFile(state, file, fileType) {
  debugger;
  state.state.file[file] = fileType[0].preview;
  state.setState({
    file: state.state.file
  });
}

export function CalculateDateofBirth(state) {
  var today = new Date(),
    date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

  const Current_array = date.split("-");

  var DateOfBrth = new Date(
    Current_array[0] - state.state.age,
    Current_array[1] - state.state.AGEMM,
    Current_array[2] - state.state.AGEDD
  );
  // var date = new Date(DateOfBrth).toDateString("yyyy-MM-dd");

  if (DateOfBrth.getMonth() < "10" && DateOfBrth.getDate() < "10") {
    var date =
      "0" +
      DateOfBrth.getDate() +
      "-0" +
      DateOfBrth.getMonth() +
      "-" +
      DateOfBrth.getFullYear();
  } else if (DateOfBrth.getMonth() < "10") {
    var date =
      "0" +
      DateOfBrth.getDate() +
      "-0" +
      DateOfBrth.getMonth() +
      "-" +
      DateOfBrth.getFullYear();
  } else if (DateOfBrth.getDate() < "10") {
    var date =
      "0" +
      DateOfBrth.getDate() +
      "-0" +
      DateOfBrth.getMonth() +
      "-" +
      DateOfBrth.getFullYear();
  } else {
    var date =
      "0" +
      DateOfBrth.getDate() +
      "-0" +
      DateOfBrth.getMonth() +
      "-" +
      DateOfBrth.getFullYear();
  }

  console.log("Date Of Birth-", date);

  state.setState({
    date_of_birth: date
  });
}

export function DateOfBirthValidation(state, SelectedDate) {
  debugger;
  let isError = false;
  var today = moment(new Date()).format("YYYY-MM-DD");
  var DateOfBirth = moment(SelectedDate).format("YYYY-MM-DD"); //new Date(e.target.value),

  if (DateOfBirth > today) {
    isError = true;
    state.setState({
      DOBErrorMsg: "Invalid Input.DOB Cannot be greater than current date.",
      DOBError: isError
    });
  } else {
    state.setState({
      DOBError: isError
    });
  }
  return isError;
}

// export function numInput(e) {
//     debugger;
//     let isError = false;
//     var inputKeyCode = e.keyCode ? e.keyCode : e.which;
//     console.log("Show my data-", inputKeyCode);
//     if (inputKeyCode !== null) {
//         if (inputKeyCode == 45 || inputKeyCode == 101)  isError = true;
//     }
//     return isError;
// }
