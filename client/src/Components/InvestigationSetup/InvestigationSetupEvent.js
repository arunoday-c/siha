import Enumerable from "linq";

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
  let inputObj = {};
  let Obj = {};

  if ($this.state.category_id !== null) {
    Obj = { category_id: $this.state.category_id };
  }
  if ($this.state.lab_section_id !== null) {
    Obj = { lab_section_id: $this.state.lab_section_id };
  }
  if ($this.state.specimen_id !== null) {
    Obj = { specimen_id: $this.state.specimen_id };
  }

  if ($this.state.investigation_type !== null) {
    Obj = { investigation_type: $this.state.investigation_type };
  }
  if ($this.state.test_id !== null) {
    Obj = { hims_d_investigation_test_id: $this.state.test_id };
  }
  inputObj = Obj;
  debugger;
  $this.props.getInvestigationDetails({
    uri: "/investigation/getInvestigTestList",
    method: "GET",
    data: inputObj,
    redux: {
      type: "INSURANCE_PROVIDER_GET_DATA",
      mappingName: "investigationdetails"
    },
    afterSuccess: data => {
      debugger;

      let Investigations = Enumerable.from(data)
        .groupBy("$.hims_d_investigation_test_id", null, (k, g) => {
          let firstRecordSet = Enumerable.from(g).firstOrDefault();
          return {
            available_in_house: firstRecordSet.available_in_house,
            category_id: firstRecordSet.category_id,
            cpt_id: firstRecordSet.cpt_id,
            description: firstRecordSet.description,
            external_facility_required:
              firstRecordSet.external_facility_required,
            facility_description: firstRecordSet.facility_description,
            film_category: firstRecordSet.film_category,
            film_used: firstRecordSet.film_used,
            hims_d_investigation_test_id:
              firstRecordSet.hims_d_investigation_test_id,
            investigation_type: firstRecordSet.investigation_type,
            lab_section_id: firstRecordSet.lab_section_id,
            priority: firstRecordSet.priority,
            restrict_by: firstRecordSet.restrict_by,
            restrict_order: firstRecordSet.restrict_order,
            screening_test: firstRecordSet.screening_test,
            send_out_test: firstRecordSet.send_out_test,
            short_description: firstRecordSet.short_description,
            specimen_id: firstRecordSet.specimen_id,
            services_id: firstRecordSet.services_id,

            analytes: g.getSource()
          };
        })
        .toArray();
      // for (let i = 0; i < x.length; i++) {}
      // let analytes = Enumerable.from(Investigations.analytes)
      //   .groupBy("$.analyte_id", null, (k, g) => {})
      //   .toArray();
      // debugger;
      $this.setState({ Investigations: Investigations });
    }
  });
};

const EditInvestigationTest = ($this, row) => {
  debugger;
  $this.setState({
    hims_d_investigation_test_id: row.hims_d_investigation_test_id,
    isOpen: !$this.state.isOpen,
    InvestigationPop: row
  });
};

export { texthandle, getInvestigations, EditInvestigationTest };
