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

const numberhandle = ($this, ctrl, e) => {
  
  e = e || ctrl;

  let name = e.name;
  let value = parseFloat(e.value);
  if (typeof value === "number" && value < 0) {
    swalMessage({
      title: "Cannot be lessthan Zero.",
      type: "warning"
    });
  } else {
    $this.setState({
      [name]: value
    });
  }
};

//Save Order
const SaveMedication = ($this, e) => {
  if ($this.state.medicationitems.length > 0) {
    
    let inputObj = {
      patient_id: $this.state.patient_id,
      encounter_id: $this.state.encounter_id,
      provider_id: $this.state.provider_id,
      episode_id: $this.state.episode_id,
      visit_id: $this.state.visit_id,

      insurance_provider_id: $this.state.insurance_provider_id,
      insurance_network_office_id:
        $this.state.hims_d_insurance_network_office_id,
      network_id: $this.state.network_id,
      sub_insurance_provider_id: $this.state.sub_insurance_provider_id,

      medicationitems: $this.state.medicationitems
    };
    algaehApiCall({
      uri: "/orderMedication/addPatientPrescription",
      data: inputObj,
      method: "POST",
      onSuccess: response => {
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
      title: "Please enter the items",
      type: "success"
    });
  }
};
const printPrescription = (that, e) => {
  
  const _patient = Window.global["current_patient"];
  const _visit = Window.global["visit_id"];
  algaehApiCall({
    uri: "/report",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob"
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "prescription",
        reportParams: [
          {
            name: "hims_d_patient_id",
            value: _patient
          },
          {
            name: "visit_id",
            value: _visit
          },
          {
            name: "visit_code",
            value: null
          }
        ],
        outputFileType: "PDF"
      }
    },
    onSuccess: res => {
      const url = URL.createObjectURL(res.data);
      let myWindow = window.open(
        "{{ product.metafields.google.custom_label_0 }}",
        "_blank"
      );

      myWindow.document.write(
        "<iframe src= '" + url + "' width='100%' height='100%' />"
      );
      myWindow.document.title = "Prescription";
    }
  });
};
const genericnamehandle = ($this, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let items = Enumerable.from($this.props.itemlist)
    .where(w => w.generic_id === value)
    .toArray();
  $this.setState({
    [name]: value,
    itemlist: items
  });
};

const itemhandle = ($this, ctrl, e) => {
  e = e || ctrl;
  if (e.value === undefined) {
    $this.setState({
      [e]: null,
      generic_id: null,
      service_id: null,
      uom_id: null,
      item_category_id: null,
      item_group_id: null,
      addItemEnable: true,
      total_quantity: 0
    });
  } else {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    if (e.selected.service_id === null) {
      swalMessage({
        title: "Service not setup to the selected Item.",
        type: "error"
      });
      $this.setState({
        [name]: null,
        total_quantity: 0,
        generic_id: null
      });
    } else {
      $this.setState(
        {
          [name]: value,
          generic_id: e.selected.generic_id,
          service_id: e.selected.service_id,
          uom_id: e.selected.sales_uom_id,
          item_category_id: e.selected.category_id,
          item_group_id: e.selected.group_id,
          addItemEnable: false,
          total_quantity: 0
        },
        () => {
          getItemStock($this);
        }
      );
    }
  }
};

const AddItems = $this => {
  if (
    $this.state.item_id !== null &&
    $this.state.generic_id !== null &&
    $this.state.dosage !== null &&
    $this.state.frequency !== null &&
    $this.state.no_of_days !== null &&
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
      frequency_type: $this.state.frequency_type,
      frequency_time: $this.state.frequency_time,
      start_date: $this.state.start_date,
      uom_id: $this.state.uom_id,
      service_id: $this.state.service_id,
      item_category_id: $this.state.item_category_id,
      item_group_id: $this.state.item_group_id,
      instructions: $this.state.instructions,
      insured: $this.state.insured,
      item_status: "A"
    };

    let serviceInput = [
      {
        insured: $this.state.insured,
        vat_applicable: $this.state.vat_applicable,
        hims_d_services_id: $this.state.service_id,
        primary_insurance_provider_id: $this.state.insurance_provider_id,
        primary_network_office_id:
          $this.state.hims_d_insurance_network_office_id,
        primary_network_id: $this.state.network_id,
        sec_insured: $this.state.sec_insured,
        secondary_insurance_provider_id:
          $this.state.secondary_insurance_provider_id,
        secondary_network_id: $this.state.secondary_network_id,
        secondary_network_office_id: $this.state.secondary_network_office_id
      }
    ];

    algaehApiCall({
      uri: "/billing/getBillDetails",
      module: "billing",
      method: "POST",
      data: serviceInput,
      onSuccess: response => {
        if (response.data.success) {
          let data = response.data.records;

          medicationobj.pre_approval =
            data.billdetails[0].pre_approval === undefined
              ? "N"
              : data.billdetails[0].pre_approval;
          medicationobj.insured = data.billdetails[0].insurance_yesno;
          medicationobj.gross_amt = data.billdetails[0].gross_amount;
          medicationobj.net_amount = data.billdetails[0].net_amout;

          if (medicationobj.pre_approval === "Y") {
            swalMessage({
              title: "Selected Item is Pre Approval",
              type: "warning"
            });
          }

          medicationitems.push(medicationobj);
          $this.setState({
            medicationitems: medicationitems,
            saveMedicationEnable: false,
            addItemEnable: true,
            item_id: null,
            generic_id: null,
            dosage: 1,
            frequency: null,
            no_of_days: null,
            dispense: null,
            frequency_type: null,
            frequency_time: null,
            uom_id: null,
            service_id: null,
            item_category_id: null,
            item_group_id: null,
            pre_approval: null,
            instructions: null
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  } else {
    swalMessage({
      title: "Please enter all detils of prescription",
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

const deleteItems = ($this, row) => {
  
  let medicationitems = $this.state.medicationitems;
  medicationitems.splice(row.rowIdx, 1);
  let saveMedicationEnable = medicationitems.length > 0 ? false : true;

  $this.setState({
    medicationitems: medicationitems,
    saveMedicationEnable: saveMedicationEnable
  });
};

const updateItems = ($this, row) => {
  
  let medicationitems = $this.state.medicationitems;
  medicationitems[row.rowId] = row;

  $this.setState({
    saveMedicationEnable: false,
    medicationitems: medicationitems
  });
};

const calcuateDispense = ($this, e) => {
  // if (e.target === null || e.target.value !== e.target.oldvalue) {
  let frequency = 0;
  let frequency_type = 0;
  let dispense = 0;
  if ($this.state.no_of_days !== 0) {
    //Frequency
    if (
      $this.state.frequency === "0" ||
      $this.state.frequency === "4" ||
      $this.state.frequency === "5"
    ) {
      frequency = 2;
    } else if (
      $this.state.frequency === "1" ||
      $this.state.frequency === "2" ||
      $this.state.frequency === "3"
    ) {
      frequency = 1;
    } else if ($this.state.frequency === "6") {
      frequency = 3;
    }

    //Frequency Type
    if ($this.state.frequency_type === "PD" && frequency === 2) {
      frequency_type = 2;
    } else if ($this.state.frequency_type === "PD" && frequency === 1) {
      frequency_type = 1;
    } else if ($this.state.frequency_type === "PD" && frequency === 3) {
      frequency_type = 3;
    } else if ($this.state.frequency_type === "PH" && frequency === 2) {
      frequency_type = 2 * 24;
    } else if ($this.state.frequency_type === "PH" && frequency === 1) {
      frequency_type = 1 * 24;
    } else if ($this.state.frequency_type === "PH" && frequency === 3) {
      frequency_type = 3 * 24;
    } else if ($this.state.frequency_type === "PW" && frequency === 2) {
      frequency_type = 2;
    } else if ($this.state.frequency_type === "PW" && frequency === 1) {
      frequency_type = 1;
    } else if ($this.state.frequency_type === "PW" && frequency === 3) {
      frequency_type = 3;
    } else if ($this.state.frequency_type === "PM" && frequency === 2) {
      frequency_type = 2;
    } else if ($this.state.frequency_type === "PM" && frequency === 1) {
      frequency_type = 1;
    } else if ($this.state.frequency_type === "PM" && frequency === 3) {
      frequency_type = 3;
    } else if ($this.state.frequency_type === "AD" && frequency === 2) {
      frequency_type = 2;
    } else if ($this.state.frequency_type === "AD" && frequency === 1) {
      frequency_type = 1;
    } else if ($this.state.frequency_type === "AD" && frequency === 3) {
      frequency_type = 3;
    }

    dispense = $this.state.no_of_days * $this.state.dosage * frequency_type;

    $this.setState({
      dispense: dispense
    });
  }
  // }
};

const getItemStock = $this => {
  $this.props.getItemStock({
    uri: "/pharmacyGlobal/getItemandLocationStock",
    module: "pharmacy",
    method: "GET",
    data: { item_id: $this.state.item_id },
    redux: {
      type: "ITEMS_STOCK_GET_DATA",
      mappingName: "itemStock"
    },
    afterSuccess: data => {
      let total_quantity = 0;
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          let qtyhand = data[i].qtyhand;
          total_quantity = parseFloat(total_quantity) + parseFloat(qtyhand);
        }
        $this.setState({
          total_quantity: total_quantity
        });
      } else {
        $this.setState({
          total_quantity: total_quantity
        });
      }
    }
  });
};

const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

const EditGrid = ($this, cancelRow) => {
  
  let _medicationitems = $this.state.medicationitems;
  if (cancelRow !== undefined) {
    _medicationitems[cancelRow.rowIdx] = cancelRow;
  }
  $this.setState({
    saveMedicationEnable: true,
    medicationitems: _medicationitems
  });
};

const CancelGrid = ($this, cancelRow) => {
  
  let _medicationitems = $this.state.medicationitems;
  if (cancelRow !== undefined) {
    _medicationitems[cancelRow.rowIdx] = cancelRow;
  }
  $this.setState({
    saveMedicationEnable: false,
    medicationitems: _medicationitems
  });
};

export {
  texthandle,
  SaveMedication,
  genericnamehandle,
  itemhandle,
  AddItems,
  datehandle,
  deleteItems,
  dateFormater,
  numberhandle,
  calcuateDispense,
  getItemStock,
  printPrescription,
  updateItems,
  onchangegridcol,
  EditGrid,
  CancelGrid
};
