import { successfulMessage } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
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
  debugger;
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
        if (response.data.success) {
          this.setState({ savebutton: true });
          successfulMessage({
            message: "Ordered Successfully...",
            title: "Success",
            icon: "success"
          });
        }
      },
      onFailure: error => {}
    });
  } else {
    successfulMessage({
      message: "Invalid Input. Please enter the items",
      title: "Success",
      icon: "success"
    });
  }
};

const genericnamehandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  debugger;
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
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({
    [name]: value,
    generic_id: e.selected.generic_id,
    service_id: e.selected.service_id,
    uom_id: e.selected.sales_uom_id,
    item_category_id: e.selected.category_id,
    item_group_id: e.selected.group_id
  });
};

const AddItems = $this => {
  debugger;
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
    savebutton: false
  });
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
