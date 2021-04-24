import moment from "moment";
import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall";
import { removeGlobal } from "../../../../utils/GlobalFunctions";
import Enumerable from "linq";
import Options from "../../../../Options.json";
import _ from "lodash";
// import {
//   PRESCRIPTION_FREQ_PERIOD,
//   PRESCRIPTION_FREQ_TIME,
//   PRESCRIPTION_FREQ_DURATION,
//   PRESCRIPTION_FREQ_ROUTE,
// } from "../../../../utils/GlobalVariables.json";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import axios from "axios";
const PORTAL_HOST = process.env.REACT_APP_PORTAL_HOST;
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
      calcuateDispense($this, e);
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
        calcuateDispense($this, e);
      }
    );
  }
};

//Save Order
const SaveMedication = ($this, context, e) => {
  if ($this.state.medicationitems.length > 0) {
    let dosage_enterted = Enumerable.from($this.state.medicationitems).any(
      (w) => parseFloat(w.dosage) === 0 || w.dosage === null || w.dosage === ""
    );

    let no_of_days_ent = Enumerable.from($this.state.medicationitems).any(
      (w) =>
        parseFloat(w.no_of_days) === 0 ||
        w.no_of_days === null ||
        w.no_of_days === ""
    );

    let instructions_enterted = Enumerable.from(
      $this.state.medicationitems
    ).any(
      (w) =>
        parseFloat(w.instructions) === 0 ||
        w.instructions === null ||
        w.instructions === ""
    );

    if (dosage_enterted === true) {
      swalMessage({
        title: "Please enter Dosage.",
        type: "warning",
      });
      return;
    }

    if (no_of_days_ent === true) {
      swalMessage({
        title: "Please enter Duration.",
        type: "warning",
      });
      return;
    }

    if (instructions_enterted === true) {
      swalMessage({
        title: "Please enter Instructions.",
        type: "warning",
      });
      return;
    }

    let chronicMedications = $this.state.medicationitems.filter((item) => {
      return item.chronic_inactive === "Y";
    });
    let isFavMedications = $this.state.medicationitems.filter((item) => {
      return item.isFavMedcine === "Y";
    });

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
      sub_insurance_id: $this.state.sub_insurance_provider_id,

      medicationitems: $this.state.medicationitems,
      chronicMedicationsItems: chronicMedications,
      isFavMedicationsItems: isFavMedications,
    };
    debugger;
    let portal_data = {};
    if ($this.state.portal_exists === "Y") {
      portal_data = $this.state.medicationitems.map((m) => {
        return {
          patient_identity: $this.props.primary_id_no,
          visit_code: $this.props.visit_code,
          visit_date: $this.props.Encounter_Date,
          generic_name: m.generic_name,
          item_name: m.item_description,
          no_of_days: m.no_of_days,
          dosage: m.dosage,
          frequency:
            m.frequency === "0"
              ? "1-0-1"
              : m.frequency === "1"
              ? "1-0-0"
              : m.frequency === "2"
              ? "0-0-1"
              : m.frequency === "3"
              ? "0-1-0"
              : m.frequency === "4"
              ? "1-1-0"
              : m.frequency === "5"
              ? "0-1-1"
              : m.frequency === "6"
              ? "1-1-1"
              : m.frequency === "7"
              ? "Once only"
              : m.frequency === "8"
              ? "Once daily (q24h)"
              : m.frequency === "9"
              ? "Twice daily (Bid)"
              : m.frequency === "10"
              ? "Three times daily (tid)"
              : m.frequency === "11"
              ? "Five times daily"
              : m.frequency === "12"
              ? "Every two hours (q2h)"
              : m.frequency === "13"
              ? "Every three hours (q3h)"
              : m.frequency === "14"
              ? "Every four hours (q4h)"
              : m.frequency === "15"
              ? "Every six hours (q6h)"
              : m.frequency === "16"
              ? "Every eight hours (q8h)"
              : m.frequency === "17"
              ? "Every twelve hours (q12h)"
              : m.frequency === "18"
              ? "Four times daily (qid)"
              : m.frequency === "19"
              ? "Other (As per need)"
              : null,
          frequency_type:
            m.frequency_type === "PD"
              ? "Per Day"
              : m.frequency_type === "PH"
              ? "Per Hour"
              : m.frequency_type === "PW"
              ? "Per Week"
              : m.frequency_type === "PM"
              ? "Per Month"
              : m.frequency_type === "AD"
              ? "Alternate Day"
              : m.frequency_type === "2W"
              ? "Every 2 weeks"
              : m.frequency_type === "2M"
              ? "Every 2 months"
              : m.frequency_type === "3M"
              ? "Every 3 months"
              : m.frequency_type === "4M"
              ? "Every 4 months"
              : m.frequency_type === "6M"
              ? "Every 6 months"
              : null,
          frequency_time:
            m.frequency_time === "BM"
              ? "Before Meals"
              : m.frequency_time === "AM"
              ? "After Meals"
              : m.frequency_time === "WF"
              ? "With Food"
              : m.frequency_time === "EM"
              ? "Early Morning"
              : m.frequency_time === "BB"
              ? "Before Bed Time"
              : m.frequency_time === "AB"
              ? "At Bed Time"
              : m.frequency_time === "NN"
              ? "None"
              : null,
          frequency_route:
            m.frequency_route === "BL"
              ? "Buccal"
              : m.frequency_route === "EL"
              ? "Enteral"
              : m.frequency_route === "IL"
              ? "Inhalation"
              : m.frequency_route === "IF"
              ? "Infusion"
              : m.frequency_route === "IM"
              ? "Intramuscular Inj"
              : m.frequency_route === "IT"
              ? "Intrathecal Inj"
              : m.frequency_route === "IV"
              ? "Intravenous Inj"
              : m.frequency_route === "NL"
              ? "Nasal"
              : m.frequency_route === "OP"
              ? "Ophthalmic"
              : m.frequency_route === "OR"
              ? "Oral"
              : m.frequency_route === "OE"
              ? "Otic (ear)"
              : m.frequency_route === "RL"
              ? "Rectal"
              : m.frequency_route === "ST"
              ? "Subcutaneous"
              : m.frequency_route === "SL"
              ? "Sublingual"
              : m.frequency_route === "TL"
              ? "Topical"
              : m.frequency_route === "TD"
              ? "Transdermal"
              : m.frequency_route === "VL"
              ? "Vaginal"
              : m.frequency_route === "IN"
              ? "Intravitreal"
              : m.frequency_route === "VR"
              ? "Various"
              : m.frequency_route === "IP"
              ? "Intraperitoneal"
              : m.frequency_route === "ID"
              ? "Intradermal"
              : m.frequency_route === "INV"
              ? "Intravesical"
              : m.frequency_route === "EP"
              ? "Epilesional"
              : null,
          med_units: m.med_units,
          instructions: m.instructions,
          hospital_id: $this.state.hospital_id,
        };
      });
    }

    AlgaehLoader({ show: true });
    algaehApiCall({
      uri: "/orderMedication/addPatientPrescription",
      data: inputObj,
      method: "POST",
      onSuccess: (response) => {
        if (response.data.success) {
          swalMessage({
            title: "Ordered Successfully.",
            type: "success",
          });
          if ($this.state.portal_exists === "Y") {
            // portal_data = JSON.stringify(portal_data);
            axios
              .post(`${PORTAL_HOST}/info/patientMedication`, portal_data)
              .then(function (response) {
                //handle success
                console.log(response);
              })
              .catch(function (response) {
                //handle error
                console.log(response);
              });
          }
          if (Window.global["orderMedicationState"] !== null)
            removeGlobal("orderMedicationState");
          context.updateState({
            updateChronic: true,
            // AdvanceOpen: false,
            // RefundOpen: false
          });
          $this.setState(
            {
              saveMedicationEnable: true,
              medicationitems: [],
            },
            () => {
              $this.props.refreshState.getPatientMedications();
              $this.props.onclosePopup && $this.props.onclosePopup(e);
            }
          );
        }
        AlgaehLoader({ show: false });
      },
      onFailure: (error) => {
        AlgaehLoader({ show: false });
      },
    });
  } else {
    swalMessage({
      title: "Please enter the items",
      type: "success",
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
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "prescription",
        reportParams: [
          {
            name: "hims_d_patient_id",
            value: _patient,
          },
          {
            name: "visit_id",
            value: _visit,
          },
          {
            name: "visit_code",
            value: null,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Prescription`;
      window.open(origin);
    },
  });
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

// const itemhandle = ($this, ctrl, e) => {
//   e = e || ctrl;
//   if (e.value === undefined) {
//     $this.setState({
//       [e]: null,
//       generic_id: null,
//       service_id: null,
//       uom_id: null,
//       item_category_id: null,
//       item_group_id: null,
//       addItemEnable: true,
//       total_quantity: 0
//     });
//   } else {
//     let name = e.name || e.target.name;
//     let value = e.value || e.target.value;
//     if (e.selected.service_id === null) {
//       swalMessage({
//         title: "Service not setup to the selected Item.",
//         type: "error"
//       });
//       $this.setState({
//         [name]: null,
//         total_quantity: 0,
//         generic_id: null
//       });
//     } else {
//       $this.setState(
//         {
//           [name]: value,
//           generic_id: e.selected.generic_id,
//           service_id: e.selected.service_id,
//           uom_id: e.selected.sales_uom_id,
//           item_category_id: e.selected.category_id,
//           item_group_id: e.selected.group_id,
//           addItemEnable: false,
//           total_quantity: 0
//         },
//         () => {
//           getItemStock($this);
//         }
//       );
//     }
//   }
// };

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
        item_id: item.hims_d_item_master_id
          ? item.hims_d_item_master_id
          : item.item_id,
        generic_id: item.generic_id,
        service_id: item.service_id,
        uom_id: item.sales_uom_id ? item.sales_uom_id : item.uom_id,
        item_category_id: item.category_id
          ? item.category_id
          : item.item_category_id,
        item_group_id: item.group_id ? item.group_id : item.item_group_id,
        addItemEnable: false,
        total_quantity: 0,
        frequency_route: item.item_route ? item.item_route : "OR",
      },
      () => {
        getItemStock($this);
      }
    );
  }

  // let name = e.name || e.target.name;
  // let value = e.value || e.target.value;
  // if (e.selected.service_id === null) {
  //   swalMessage({
  //     title: "Service not setup to the selected Item.",
  //     type: "error"
  //   });
  //   $this.setState({
  //     [name]: null,
  //     total_quantity: 0,
  //     generic_id: null
  //   });
  // } else {
  //   $this.setState(
  //     {
  //       [name]: value,
  //       generic_id: e.selected.generic_id,
  //       service_id: e.selected.service_id,
  //       uom_id: e.selected.sales_uom_id,
  //       item_category_id: e.selected.category_id,
  //       item_group_id: e.selected.group_id,
  //       addItemEnable: false,
  //       total_quantity: 0
  //     },
  //     () => {
  //       getItemStock($this);
  //     }
  //   );
  // }
};
const clearInputState = ($this) => {
  $this.setState({
    generic_name_item_description: "",
    saveMedicationEnable: false,
    addItemEnable: true,
    item_id: null,
    generic_id: null,
    dosage: 1,
    med_units: "",
    frequency: "0",
    no_of_days: 0,
    dispense: null,
    frequency_type: "PD",
    chronic_inactive: "N",
    isFavMedcine: "N",
    frequency_time: "AM",
    frequency_route: "OR",
    uom_id: null,
    service_id: null,
    item_category_id: null,
    item_group_id: null,
    pre_approval: null,
    generic_name: "",
    item_description: "",
    instructions: "",
    start_date: moment().format("YYYY-MM-DD"),
    total_quantity: 0,
  });
};
const AddItemsOrUpdate = ($this) => {
  let medicationitems = $this.state.medicationitems;
  let medicationobj = {
    item_id: $this.state.item_id,
    generic_id: $this.state.generic_id,
    dosage: $this.state.dosage,
    med_units: $this.state.med_units,
    frequency: $this.state.frequency,
    no_of_days: $this.state.no_of_days,
    frequency_type: $this.state.frequency_type,
    frequency_time: $this.state.frequency_time,
    frequency_route: $this.state.frequency_route,
    start_date: $this.state.start_date,
    uom_id: $this.state.uom_id,
    service_id: $this.state.service_id,
    item_category_id: $this.state.item_category_id,
    item_group_id: $this.state.item_group_id,
    instructions: $this.state.instructions,
    dispense: $this.state.dispense,
    requested_quantity: $this.state.dispense,
    approved_qty: $this.state.dispense,
    insured: $this.state.insured,
    item_status: "A",
    chronic_inactive: $this.state.chronic_inactive,
    isFavMedcine: $this.state.isFavMedcine,
  };

  let serviceInput = [
    {
      insured: $this.state.insured,
      vat_applicable: $this.state.vat_applicable,
      hims_d_services_id: $this.state.service_id,
      primary_insurance_provider_id: $this.state.insurance_provider_id,
      primary_network_office_id: $this.state.hims_d_insurance_network_office_id,
      primary_network_id: $this.state.network_id,
      sec_insured: $this.state.sec_insured,
      secondary_insurance_provider_id:
        $this.state.secondary_insurance_provider_id,
      secondary_network_id: $this.state.secondary_network_id,
      secondary_network_office_id: $this.state.secondary_network_office_id,
    },
  ];
  const rIndex = medicationitems.length;

  algaehApiCall({
    uri: "/billing/getBillDetails",
    module: "billing",
    method: "POST",
    data: serviceInput,
    onSuccess: (response) => {
      if (response.data.success) {
        let data = response.data.records;

        medicationobj.pre_approval =
          data.billdetails[0].pre_approval === undefined
            ? "N"
            : data.billdetails[0].pre_approval;
        medicationobj.insured = data.billdetails[0].insurance_yesno;
        medicationobj.gross_amt =
          parseFloat(data.billdetails[0].gross_amount) *
          parseFloat($this.state.dispense);
        medicationobj.net_amount =
          parseFloat(data.billdetails[0].net_amout) *
          parseFloat($this.state.dispense);
        medicationobj["generic_name"] = $this.state.generic_name;
        medicationobj["item_description"] = $this.state.item_description;
        medicationobj["insurance_service_name"] = $this.state.item_description;

        medicationobj["doctor_id"] = $this.state.provider_id;
        if (medicationobj.pre_approval === "Y") {
          swalMessage({
            title: "Selected Item is Pre Approval",
            type: "warning",
          });
        }
        medicationobj["rIndex"] = rIndex;
        medicationitems.push(medicationobj);
        $this.setState(
          {
            medicationitems: medicationitems,
            updateButton: false,
            rowDetails: [],
          },
          () => {
            clearInputState($this);
          }
        );
      }
    },
    onFailure: (error) => {
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
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

  let item_exists = $this.state.medicationitems.find(
    (f) => f.item_id === $this.state.item_id
  );
  if ($this.state.updateButton && validate) {
    // deleteItems($this, $this.state.rowDetails);
    updateItems($this, $this.state.rowDetails);
  } else if (!$this.state.updateButton && validate) {
    if (item_exists === undefined) {
      AddItemsOrUpdate($this);
    } else {
      swalMessage({
        title: "Selected Item Already Exists.",
        type: "error",
      });
    }
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
  // medicationitems.splice(row.rowIdx, 1);
  let saveMedicationEnable = medicationitems.length > 0 ? false : true;
  const details = medicationitems
    .filter((f) => f.rIndex !== row.rIndex)
    .map((item, index) => {
      return { ...item, rIndex: index };
    });
  $this.setState(
    {
      medicationitems: details,
      saveMedicationEnable: saveMedicationEnable,
    }
    // () => {
    //   AddItemsOrUpdate($this);
    // }
  );
};

const updateItems = ($this, row) => {
  let medicationitems = $this.state.medicationitems;
  const { dosage, no_of_days, instructions } = row;
  if (!dosage || !no_of_days || !instructions) {
    swalMessage({
      title: "Please Enter Correct Values",
      type: "error",
    });
  } else {
    let udateObj = {
      item_id: $this.state.item_id,
      generic_id: $this.state.generic_id,
      dosage: $this.state.dosage,
      med_units: $this.state.med_units,
      frequency: $this.state.frequency,
      no_of_days: $this.state.no_of_days,
      frequency_type: $this.state.frequency_type,
      frequency_time: $this.state.frequency_time,
      frequency_route: $this.state.frequency_route,
      start_date: $this.state.start_date,
      uom_id: $this.state.uom_id,
      service_id: $this.state.service_id,
      item_category_id: $this.state.item_category_id,
      item_group_id: $this.state.item_group_id,
      instructions: $this.state.instructions,
      dispense: $this.state.dispense,
      requested_quantity: $this.state.dispense,
      approved_qty: $this.state.dispense,
      // insured: $this.state.insured,
      // item_status: "A",
      chronic_inactive: $this.state.chronic_inactive,
      isFavMedcine: $this.state.isFavMedcine,
    };

    let indexOfRow = row.rIndex;

    // medicationitems[].indexOf(row);
    medicationitems[indexOfRow] = { ...row, ...udateObj };
    $this.setState(
      {
        // saveMedicationEnable: false,
        medicationitems: medicationitems,
        updateButton: false,
      },
      () => {
        clearInputState($this);
      }
    );
  }
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
      dispense: dispense,
    });
  }
  // }
};

const getItemStock = ($this) => {
  $this.props.getItemStock({
    uri: "/pharmacyGlobal/getItemandLocationStock",
    module: "pharmacy",
    method: "GET",
    data: { item_id: $this.state.item_id },
    redux: {
      type: "ITEMS_STOCK_GET_DATA",
      mappingName: "itemStock",
    },
    afterSuccess: (data) => {
      let total_quantity = 0;
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          let qtyhand = data[i].qtyhand;
          total_quantity = parseFloat(total_quantity) + parseFloat(qtyhand);
        }
        $this.setState({
          total_quantity: total_quantity,
        });
      } else {
        $this.setState({
          total_quantity: total_quantity,
        });
      }
    },
  });
};

// const onchangegridcol = ($this, row, e) => {
//   let name = e.name || e.target.name;
//   let value = e.value || e.target.value;
//   let medicationitems = $this.state.medicationitems;
//   let _index = medicationitems.indexOf(row);
//   if (name !== "instructions") {
//     value = value && value > 0 ? value : "";

//     const frequency = _.find(
//       PRESCRIPTION_FREQ_PERIOD,
//       (f) => f.value === row.frequency
//     );
//     const frequencyType = _.find(
//       PRESCRIPTION_FREQ_TIME,
//       (f) => f.value === row.frequency_type
//     );
//     const consume = _.find(
//       PRESCRIPTION_FREQ_DURATION,
//       (f) => f.value === row.frequency_time
//     );
//     const route = _.find(
//       PRESCRIPTION_FREQ_ROUTE,
//       (f) => f.value === $this.state.frequency_route
//     );
//     if (frequency !== undefined && frequencyType !== undefined) {
//       if (name === "dosage") {
//         row["instructions"] = `${$this.state.dosage} ${
//           $this.state.med_units
//         }, ${frequency.name}, ${frequencyType.name}, ${
//           consume !== undefined ? consume.name : ""
//         }, ${route !== undefined ? route.name : ""} for ${
//           $this.state.no_of_days
//         } day(s)`;
//       } else if (name === "no_of_days") {
//         row["instructions"] = `${$this.state.dosage}${$this.state.med_units}, ${
//           frequency.name
//         }, ${frequencyType.name}, ${
//           consume !== undefined ? consume.name : ""
//         }, ${route !== undefined ? route.name : ""} for ${
//           $this.state.no_of_days
//         } day(s)`;
//       }
//     }
//   }
//   row[name] = value;
//   medicationitems[_index] = row;

//   $this.setState({
//     medicationitems: medicationitems,
//   });
// };

// const EditGrid = ($this, cancelRow) => {
//   let _medicationitems = $this.state.medicationitems;
//   if (cancelRow !== undefined) {
//     _medicationitems[cancelRow.rowIdx] = cancelRow;
//   }
//   $this.setState({
//     saveMedicationEnable: true,
//     medicationitems: _medicationitems,
//   });
// };

// const CancelGrid = ($this, cancelRow) => {
//   let _medicationitems = $this.state.medicationitems;
//   if (cancelRow !== undefined) {
//     _medicationitems[cancelRow.rowIdx] = cancelRow;
//   }
//   $this.setState({
//     saveMedicationEnable: false,
//     medicationitems: _medicationitems,
//   });
// };

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
  AddItemsOrUpdate,
  printPrescription,
  clearInputState,
  // updateItems,
  // onchangegridcol,
  // EditGrid,
  // CancelGrid,
};
