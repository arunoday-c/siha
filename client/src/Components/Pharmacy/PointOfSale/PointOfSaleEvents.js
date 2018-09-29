import moment from "moment";
import Options from "../../../Options.json";
import AlgaehSearch from "../../Wrapper/globalSearch";
import FrontDesk from "../../../Search/FrontDesk.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import Enumerable from "linq";

const changeTexts = ($this, ctrl, e) => {
  debugger;
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const numberchangeTexts = ($this, ctrl, e) => {
  debugger;

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const itemchangeText = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({
    [name]: value,
    category_id: e.selected.category_id,
    group_id: e.selected.group_id,
    quantity: 1,
    unit_cost: "200.00"
  });
};

const AddItems = $this => {
  let ListItems = $this.state.ListItems;
  let itemObj = {
    location_id: $this.state.location_id,
    category_id: $this.state.category_id,
    group_id: $this.state.group_id,
    item_id: $this.state.item_id,
    batch_no: $this.state.batch_no,
    expirt_date: $this.state.expirt_date,
    quantity: $this.state.quantity,
    unit_cost: $this.state.unit_cost,
    quantity: $this.state.quantity
  };
  ListItems.push(itemObj);
  $this.setState({
    ListItems: ListItems
  });
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const dateFormater = ({ value }) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const getCtrlCode = ($this, docNumber) => {
  debugger;
};

const PatientSearch = ($this, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: FrontDesk
    },
    searchName: "patients",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState({ patient_code: row.patient_code }, () => {
        AlgaehLoader({ show: true });
        $this.props.getPatientDetails({
          uri: "/frontDesk/get",
          method: "GET",
          printInput: true,
          data: {
            patient_code: $this.state.patient_code
          },
          redux: {
            type: "PAT_GET_DATA",
            mappingName: "patients"
          },
          afterSuccess: data => {
            debugger;
            if ($this.state.visit_id !== null) {
              for (let i = 0; i < data.visitDetails.length; i++) {
                if (
                  data.visitDetails[i].hims_f_patient_visit_id ===
                  $this.state.visit_id
                ) {
                  data.visitDetails[i].radioselect = 1;
                }
              }
              AlgaehLoader({ show: false });
            }
            debugger;
            let x = Enumerable.from($this.props.patienttype)
              .where(
                w =>
                  w.hims_d_patient_type_id ==
                  data.patientRegistration.patient_type
              )
              .toArray();

            if (x != null && x.length > 0) {
              data.patientRegistration.patient_type = x[0].patitent_type_desc;
            } else {
              data.patientRegistration.patient_type = "Not Selected";
            }

            data.patientRegistration.visitDetails = data.visitDetails;
            data.patientRegistration.patient_id =
              data.patientRegistration.hims_d_patient_id;
            data.patientRegistration.mode_of_pay = "None";
            //Insurance
            data.patientRegistration.insurance_provider_name = null;
            data.patientRegistration.sub_insurance_provider_name = null;
            data.patientRegistration.network_type = null;
            data.patientRegistration.policy_number = null;
            data.patientRegistration.card_number = null;
            data.patientRegistration.effective_end_date = null;
            //Sec
            data.patientRegistration.secondary_insurance_provider_name = null;
            data.patientRegistration.secondary_sub_insurance_provider_name = null;
            data.patientRegistration.secondary_network_type = null;
            data.patientRegistration.secondary_policy_number = null;
            data.patientRegistration.card_number = null;
            data.patientRegistration.secondary_effective_end_date = null;

            $this.setState(data.patientRegistration);
            AlgaehLoader({ show: false });
          }
        });
      });
    }
  });
};

const processItems = $this => {
  debugger;
  $this.props.getMedicationList({
    uri: "/orderMedication/getPatientPrescription",
    method: "GET",
    data: { patient_id: $this.state.patient_id },
    redux: {
      type: "MEDICATION_LIST_GET_DATA",
      mappingName: "medicationlist"
    },
    afterSuccess: data => {
      let medication_list = Enumerable.from(data)
        .groupBy("$.patient_id", null, (k, g) => {
          let firstRecordSet = Enumerable.from(g).firstOrDefault();
          return {
            patient_code: firstRecordSet.patient_code,
            full_name: firstRecordSet.full_name,
            prescription_date: firstRecordSet.prescription_date,
            number_of_items: g.getSource().length,
            item_list: g.getSource(),
            provider_id: firstRecordSet.provider_id
          };
        })
        .toArray();

      $this.setState({ medication_list: medication_list });
    }
  });
};

export {
  changeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  dateFormater,
  getCtrlCode,
  PatientSearch,
  processItems
};
