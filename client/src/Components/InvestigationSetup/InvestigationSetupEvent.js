const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      getInvestigations($this, $this);
    }
  );
};

const getInvestigations = $this => {
  let Obj = {};

  if ($this.state.category_id !== null) {
    Obj = { ...Obj, ...{ category_id: $this.state.category_id } };
  }
  if ($this.state.lab_section_id !== null) {
    Obj = { ...Obj, ...{ lab_section_id: $this.state.lab_section_id } };
  }
  if ($this.state.specimen_id !== null) {
    Obj = { ...Obj, ...{ specimen_id: $this.state.specimen_id } };
  }

  if ($this.state.investigation_type !== null) {
    Obj = { ...Obj, ...{ investigation_type: $this.state.investigation_type } };
  }
  if ($this.state.test_id !== null) {
    Obj = { ...Obj, ...{ hims_d_investigation_test_id: $this.state.test_id } };
  }

  $this.props.getInvestigationDetails({
    uri: "/investigation/getInvestigTestList",
    module: "laboratory",
    method: "GET",
    data: Obj,
    redux: {
      type: "INSURANCE_PROVIDER_GET_DATA",
      mappingName: "investigationdetails"
    }
  });
};

const EditInvestigationTest = ($this, row) => {
  $this.setState({
    hims_d_investigation_test_id: row.hims_d_investigation_test_id,
    isOpen: !$this.state.isOpen,
    InvestigationPop: row
  });

  $this.props.getTestCategory({
    uri: "/labmasters/selectTestCategory",
    module: "laboratory",
    method: "GET",
    data: { investigation_type: row.investigation_type },
    redux: {
      type: "TESTCATEGORY_GET_DATA",
      mappingName: "testcategory"
    }
  });
};

export { texthandle, getInvestigations, EditInvestigationTest };
