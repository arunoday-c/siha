import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
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



  algaehApiCall({
    uri: "/investigation/getInvestigTestList",
    module: "laboratory",
    method: "GET",
    data: Obj,
    onSuccess: response => {
      // console.log("from update", response.data);

      if (response.data.success === true) {
        let _Investigations = Enumerable.from(response.data.records)
          .groupBy("$.hims_d_investigation_test_id", null, (k, g) => {
            let firstRecordSet = Enumerable.from(g).firstOrDefault();
            return {
              test_code: firstRecordSet.test_code,
              available_in_house: firstRecordSet.available_in_house,
              category_id: firstRecordSet.category_id,
              cpt_id: firstRecordSet.cpt_id,
              description: firstRecordSet.description,
              external_facility_required: firstRecordSet.external_facility_required,
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
              hims_m_lab_specimen_id: firstRecordSet.hims_m_lab_specimen_id,
              analytes_required: firstRecordSet.test_section === "M" ? false : true,
              container_id: firstRecordSet.container_id,
              analytes: firstRecordSet.hims_m_lab_analyte_id === null ? [] : g.getSource(),
              RadTemplate: firstRecordSet.hims_d_rad_template_detail_id === null ? [] : g.getSource()
            };
          })
          .toArray();
        $this.setState({ investigations_data: _Investigations })

      }
    }
  });

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
