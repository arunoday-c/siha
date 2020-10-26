import moment from "moment";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import Enumerable from "linq";
import Options from "../../../../Options.json";
import _ from "lodash";
import extend from "extend";

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
    $this.setState(
      {
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
          getPastMedication($this, $this.state.patient_id)
          swalMessage({
            title: "Added Successfully.",
            type: "success",
          });
        }
      }
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
  let medicationitems = $this.state.medicationitems;
  medicationitems.splice(row.rowIdx, 1);
  let saveMedicationEnable = medicationitems.length > 0 ? false : true;

  $this.setState({
    medicationitems: medicationitems,
    saveMedicationEnable: saveMedicationEnable,
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
          medicationitems: response.data.records
        });
      }
    }
  });
}

export {
  texthandle,
  genericnamehandle,
  itemhandle,
  AddItems,
  datehandle,
  deleteItems,
  dateFormater,
  numberhandle,
  getPastMedication
};
