import moment from "moment";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";
import Options from "../../../../Options.json";
import _ from "lodash";
import extend from "extend";
import swal from "sweetalert2";

//Text Handaler Change

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value === "" ? null : e.value || e.target.value;
  $this.setState(
    {
      [name]: value,
    },
    () => {
      $this.instructionItems();
    }
  );
};

const numberhandle = ($this, ctrl, e) => {
  e = e || ctrl;

  let name = e.name;
  if (e.value === "") {
    $this.setState({
      [name]: "",
    });
    return;
  }
  let value = parseFloat(e.value, 10);
  if (typeof value === "number" && value < 0) {
    swalMessage({
      title: "Cannot be lessthan Zero.",
      type: "warning",
    });
  } else {
    $this.setState(
      {
        [name]: value,
      },
      () => {
        $this.instructionItems();
      }
    );
  }
};

const genericnamehandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let items = Enumerable.from($this.props.itemlist)
    .where((w) => w.generic_id === value)
    .toArray();
  $this.setState({
    [name]: value,
    itemlist: items,
  });
};
const clearInputState = ($this) => {
  const {
    current_patient,
    encounter_id,
    visit_id,
    provider_id,
    episode_id,
  } = Window.global;
  $this.setState({
    patient_id: current_patient,
    encounter_id: encounter_id,
    visit_id: visit_id,
    provider_id: provider_id,
    episode_id: episode_id,
    // vat_applicable: $this.props.vat_applicable,
    instructions: "",

    start_date: moment(new Date())._d,
    saveMedicationEnable: true,
    uom_id: null,
    item_category_id: null,
    item_group_id: null,
    // addItemEnable: true,
    item_id: null,
    generic_id: null,
    dosage: 1,
    med_units: null,
    frequency: null,
    no_of_days: 0,
    dispense: 0,
    generic_name_item_description: "",
    service_id: null,
    total_quantity: 0,
    frequency_type: null,
    frequency_time: null,
    frequency_route: null,
    generic_name: "",
    item_description: "",
  });
};
const itemhandle = ($this, item) => {
  if (item.service_id === null || item.service_id === undefined) {
    swalMessage({
      title: "Service not setup to the selected Item.",
      type: "error",
    });
    $this.setState({
      total_quantity: 0,
      generic_id: null,
    });
  } else {
    $this.setState({
      generic_name_item_description:
        item.generic_name_item_description !== undefined
          ? item.generic_name_item_description.replace(/\w+/g, _.capitalize)
          : item.generic_name_item_description,
      generic_name:
        item.generic_name !== undefined
          ? item.generic_name.replace(/\w+/g, _.capitalize)
          : item.generic_name,
      item_description:
        item.item_description !== undefined
          ? item.item_description.replace(/\w+/g, _.capitalize)
          : item.item_description,
      item_id: item.hims_d_item_master_id,
      generic_id: item.generic_id,
      service_id: item.service_id,
      uom_id: item.sales_uom_id,
      item_category_id: item.category_id,
      item_group_id: item.group_id,
      addItemEnable: false,
      total_quantity: 0,
    });
  }
};
// const AddItemsOrUpdate = ($this) => {

// };

const AddItems = ($this) => {
  if (
    $this.state.no_of_days === "" ||
    parseInt($this.state.no_of_days, 10) < 1
  ) {
    swalMessage({
      title: "Duration can't be zero",
      type: "info",
    });
    return;
  }

  if (
    !$this.state.start_date ||
    moment($this.state.start_date).isBefore(moment(), "day")
  ) {
    $this.setState(
      {
        start_date: moment().format("YYYY-MM-DD"),
      },
      () => {
        swalMessage({
          title: "Start date must not in the past",
          type: "error",
        });
      }
    );
    return;
  }

  let validate =
    $this.state.item_id !== null &&
    $this.state.generic_id !== null &&
    $this.state.dosage !== null &&
    $this.state.med_units !== null &&
    $this.state.frequency !== null &&
    $this.state.no_of_days !== null &&
    $this.state.frequency_type !== null &&
    $this.state.frequency_time !== null &&
    $this.state.frequency_route !== null &&
    $this.state.uom_id !== null &&
    $this.state.service_id !== null &&
    $this.state.item_category_id !== null &&
    $this.state.item_group_id !== null
      ? true
      : false;
  if (validate) {
    const inputObj = extend({}, $this.state);
    algaehApiCall({
      uri: "/orderMedication/addPastMedication",
      data: inputObj,
      method: "POST",
      onSuccess: (response) => {
        if (response.data.success) {
          getPastMedication($this, $this.state.patient_id);
          clearInputState($this);
          swalMessage({
            title: "Added Successfully.",
            type: "success",
          });
        }
      },
    });
  } else {
    swalMessage({
      title: "Please enter all detils of prescription",
      type: "error",
    });
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d,
  });
};

const dateFormater = (value) => {
  if (value !== null) {
    return String(moment(value).format(Options.dateFormat));
  }
};

const deleteItems = ($this, row) => {
  swal({
    title: "Are you sure you want to delete past medication of The patient?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#44b8bd",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  }).then((willDelete) => {
    if (willDelete.value) {
      let data = {
        hims_f_past_medication_id: row.hims_f_past_medication_id,
      };
      algaehApiCall({
        uri: "/orderMedication/deletePastMedication",

        data: data,
        method: "DELETE",
        onSuccess: (response) => {
          if (response.data.success) {
            swalMessage({
              title: "Record deleted successfully . ",
              type: "success",
            });
            getPastMedication($this, $this.state.patient_id);
          }
        },
        onFailure: (error) => {},
      });
    }
  });
};

const getPastMedication = ($this, patient_id) => {
  algaehApiCall({
    uri: "/orderMedication/getPastMedication",
    data: { patient_id: patient_id },
    method: "GET",
    onSuccess: (response) => {
      if (response.data.success) {
        $this.setState({
          medicationitems: response.data.records,
        });
      }
    },
  });
};

export {
  texthandle,
  genericnamehandle,
  itemhandle,
  AddItems,
  datehandle,
  deleteItems,
  dateFormater,
  numberhandle,
  getPastMedication,
};
