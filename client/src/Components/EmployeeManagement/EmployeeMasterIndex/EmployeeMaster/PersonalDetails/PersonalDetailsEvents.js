import moment from "moment";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  let obj = {};

  if (name === "nationality") {
    const primaryId = $this.props.idtypes.find(
      (f) => f.hims_d_nationality_id === parseInt(value)
    );
    if (primaryId !== undefined) {
      obj["identity_type_id"] = primaryId.hims_d_identity_document_id;
    }
  }
  debugger;
  if (name === "identity_type_id") {
    obj["identity_no"] = e.selected.masked_identity;
  }

  $this.setState({
    [name]: value,
    ...obj,
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [name]: value,
  });
};

const countryStatehandle = ($this, e) => {
  let name = e.name;
  let value = e.value;

  if (e.name !== undefined) {
    if (e.name === "present_country_id") {
      name = e.name;
      value = e.value;
      $this.setState({
        [name]: value,
        present_state_id: null,
        present_city_id: null,
        countrystates: e.selected.states,
      });
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        [name]: value,
        present_state_id: null,
        present_city_id: null,
        countrystates: e.selected.states,
      });
    } else if (e.name === "present_state_id") {
      name = e.name;
      value = e.value;
      $this.setState({
        [name]: value,
        present_city_id: null,
        present_cities: e.selected.cities,
      });
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        [name]: value,
        present_city_id: null,
        present_cities: e.selected.cities,
      });
    }

    if (e.name === "permanent_country_id") {
      name = e.name;
      value = e.value;
      $this.setState({
        [name]: value,
        permanent_state_id: null,
        permanent_city_id: null,
        precountrystates: e.selected.states,
      });
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        [name]: value,
        permanent_state_id: null,
        permanent_city_id: null,
        precountrystates: e.selected.states,
      });
    } else if (e.name === "permanent_state_id") {
      name = e.name;
      value = e.value;
      $this.setState({
        [name]: value,
        permanent_city_id: null,
        precities: e.selected.cities,
      });
      $this.props.EmpMasterIOputs.updateEmployeeTabs({
        [name]: value,
        permanent_city_id: null,
        precities: e.selected.cities,
      });
    }
  } else {
    $this.setState({
      [name]: value,
    });

    $this.props.EmpMasterIOputs.updateEmployeeTabs({
      [name]: value,
    });
  }
};

const datehandle = ($this, ctrl, e) => {
  let selected_date = moment(ctrl, "YYYY-MM-DD", true).isValid();
  $this.setState({
    [e]: selected_date === true ? ctrl : null,
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [e]: selected_date === true ? ctrl : null,
  });
};

const sameAsPresent = ($this, e) => {
  let name = e.target.name;
  const _value = e.target.checked ? "Y" : "N";

  let permanent_address = "";
  let permanent_country_id = "";
  let permanent_state_id = "";
  let permanent_city_id = "";
  if (_value === "Y") {
    permanent_address = $this.state.present_address;
    permanent_country_id = $this.state.present_country_id;
    permanent_state_id = $this.state.present_state_id;
    permanent_city_id = $this.state.present_city_id;
  } else {
    permanent_address = "";
    permanent_country_id = "";
    permanent_state_id = "";
    permanent_city_id = "";
  }

  // if (this.state.personalDetails.present_country_id === null) return;
  // if (
  //   this.state.personalDetails.present_country_id !==
  //   this.state.present_country_id
  // ) {
  //   let country = Enumerable.from(this.props.countries)
  //     .where(
  //       w =>
  //         w.hims_d_country_id === this.state.personalDetails.present_country_id
  //     )
  //     .firstOrDefault();

  //   let states = country !== undefined ? country.states : [];
  //   if (this.props.countries !== undefined && states.length !== 0) {
  //     if (
  //       this.state.present_state_id !==
  //       this.state.personalDetails.present_state_id
  //     ) {
  //       let cities = Enumerable.from(states)
  //         .where(
  //           w =>
  //             w.hims_d_state_id === this.state.personalDetails.present_state_id
  //         )
  //         .firstOrDefault();
  //       if (cities !== undefined) {
  //         this.updateEmployeeTabs({
  //           countrystates: states,
  //           cities: cities.cities,
  //           precountrystates: states,
  //           precities: cities.cities,
  //           present_state_id: this.state.personalDetails.present_state_id,
  //           present_city_id: this.state.personalDetails.present_city_id
  //         });
  //       } else {
  //         this.updateEmployeeTabs({
  //           countrystates: states,
  //           precountrystates: states,
  //           present_state_id: this.state.personalDetails.present_state_id
  //         });
  //       }
  //     }
  //   }
  // }

  $this.setState({
    [name]: _value,
    permanent_address: permanent_address,
    permanent_country_id: permanent_country_id,
    permanent_state_id: permanent_state_id,
    permanent_city_id: permanent_city_id,
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [name]: _value,
    permanent_address: permanent_address,
    permanent_country_id: permanent_country_id,
    permanent_state_id: permanent_state_id,
    permanent_city_id: permanent_city_id,
  });
};

const isDoctorChange = ($this, e) => {
  let name = e.target.name;
  let _value = e.target.checked ? "Y" : "N";
  $this.setState({
    [name]: _value,
    license_number: null,
  });
  $this.props.EmpMasterIOputs.updateEmployeeTabs({
    [name]: _value,
    license_number: null,
  });
};

export {
  texthandle,
  // titlehandle,
  // numberSet,
  // onDrop,
  countryStatehandle,
  datehandle,
  isDoctorChange,
  sameAsPresent,
};
