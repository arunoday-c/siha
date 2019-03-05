const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      getHospotalServices($this);
    }
  );
};

const getHospotalServices = $this => {
  let inputObj = {};

  if ($this.state.service_name !== null) {
    inputObj = { hims_d_services_id: $this.state.service_name };
  }
  if ($this.state.sub_department_id !== null) {
    inputObj = { sub_department_id: $this.state.sub_department_id };
  }
  if ($this.state.hospital_id !== null) {
    inputObj = { hospital_id: $this.state.hospital_id };
  }

  if ($this.state.service_type_id !== null) {
    inputObj = { service_type_id: $this.state.service_type_id };
  }

  $this.props.getServices({
    uri: "/serviceType/getService",
    module: "masterSettings",
    method: "GET",
    data: inputObj,
    redux: {
      type: "SERVICES_GET_DATA",
      mappingName: "hospitalservices"
    }
  });
};

export { texthandle, getHospotalServices };
