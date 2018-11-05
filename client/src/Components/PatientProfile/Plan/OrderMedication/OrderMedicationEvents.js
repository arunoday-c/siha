import moment from "moment";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";
import Options from "../../../../Options.json";

//Text Handaler Change
const texthandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({
    [name]: value
  });
};

//Save Order
const SaveMedication = ($this, e) => {
  if ($this.state.medicationitems.length > 0) {
    let inputObj = {
      patient_id: $this.state.patient_id,
      encounter_id: $this.state.encounter_id,
      provider_id: $this.state.provider_id,
      episode_id: $this.state.episode_id,
      medicationitems: $this.state.medicationitems
    };
    algaehApiCall({
      uri: "/orderMedication/addPatientPrescription",
      data: inputObj,
      method: "POST",
      onSuccess: response => {
        debugger;
        if (response.data.success) {
          swalMessage({
            title: "Ordered Successfully...",
            type: "success"
          });
          $this.setState({
            saveMedicationEnable: true,
            medicationitems: []
          });
        }
      },
      onFailure: error => {}
    });
  } else {
    swalMessage({
      title: "Invalid Input. Please enter the items",
      type: "success"
    });
  }
};

const genericnamehandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let items = Enumerable.from($this.props.itemlist)
    .where(w => w.generic_id == value)
    .toArray();
  $this.setState({
    [name]: value,
    itemlist: items
  });
};

const itemhandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (e.selected.service_id === null) {
    swalMessage({
      title: "Invalid Input. Service not setup to the selected Item.",
      type: "error"
    });
    $this.setState({
      [name]: null
    });
  } else {
    $this.setState({
      [name]: value,
      generic_id: e.selected.generic_id,
      service_id: e.selected.service_id,
      uom_id: e.selected.sales_uom_id,
      item_category_id: e.selected.category_id,
      item_group_id: e.selected.group_id,
      addItemEnable: false
    });
  }
};

const AddItems = $this => {
  debugger;
  if (
    $this.state.item_id !== null &&
    $this.state.generic_id !== null &&
    $this.state.dosage !== null &&
    $this.state.frequency !== null &&
    $this.state.no_of_days !== null &&
    $this.state.dispense !== null &&
    $this.state.frequency_type !== null &&
    $this.state.frequency_time !== null &&
    $this.state.uom_id !== null &&
    $this.state.service_id !== null &&
    $this.state.item_category_id !== null &&
    $this.state.item_group_id !== null
  ) {
    let medicationitems = $this.state.medicationitems;
    let medicationobj = {
      item_id: $this.state.item_id,
      generic_id: $this.state.generic_id,
      dosage: $this.state.dosage,
      frequency: $this.state.frequency,
      no_of_days: $this.state.no_of_days,
      dispense: $this.state.dispense,
      frequency_type: $this.state.frequency_type,
      frequency_time: $this.state.frequency_time,
      start_date: $this.state.start_date,
      uom_id: $this.state.uom_id,
      service_id: $this.state.service_id,
      item_category_id: $this.state.item_category_id,
      item_group_id: $this.state.item_group_id,
      item_status: "A"
    };
    medicationitems.push(medicationobj);
    $this.setState({
      medicationitems: medicationitems,
      saveMedicationEnable: false,
      addItemEnable: true,
      item_id: null,
      generic_id: null,
      dosage: null,
      frequency: null,
      no_of_days: null,
      dispense: null,
      frequency_type: null,
      frequency_time: null,
      uom_id: null,
      service_id: null,
      item_category_id: null,
      item_group_id: null
    });
  } else {
    swalMessage({
      title: "Invalid Input. Please enter all detils of prescription",
      type: "error"
    });
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};

const dateFormater = value => {
  if (value !== null) {
    return String(moment(value).format(Options.dateFormat));
  }
};

const deleteItems = $this => {};

const calcuateQuantity = $this => {
  let frequency = 0;
  let frequency_type = 0;
  if (
    $this.state.frequency === "0" ||
    $this.state.frequency === "4" ||
    $this.state.frequency === "5"
  ) {
    frequency = 2;
  } else if ($this.state.frequency === "0") {
    frequency = 1;
  } else if (
    $this.state.frequency === "1" ||
    $this.state.frequency === "2" ||
    $this.state.frequency === "3"
  ) {
    frequency = 1;
  } else if ($this.state.frequency === "6") {
    frequency = 3;
  }

  if ($this.state.frequency_type === "PD") {
    frequency_type = 2;
  } else if ($this.state.frequency_type === "PH") {
    frequency_type = 1;
  } else if ($this.state.frequency_type === "PW") {
    frequency_type = 1;
  } else if ($this.state.frequency_type === "PM") {
    frequency_type = 3;
  } else if ($this.state.frequency_type === "AD") {
    frequency_type = 3;
  }
};
export {
  texthandle,
  SaveMedication,
  genericnamehandle,
  itemhandle,
  AddItems,
  datehandle,
  deleteItems,
  dateFormater
};
