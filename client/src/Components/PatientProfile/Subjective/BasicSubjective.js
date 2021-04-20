import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../utils/MyContext";
import "./subjective.scss";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import {
  PRESCRIPTION_FREQ_PERIOD,
  PRESCRIPTION_FREQ_TIME,
  PRESCRIPTION_FREQ_DURATION,
  PRESCRIPTION_FREQ_ROUTE,
} from "../../../utils/GlobalVariables.json";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlgaehDataGrid,
} from "../../Wrapper/algaehWrapper";
import Vitals from "../Vitals/Vitals";
import LabResults from "../Assessment/LabResult/LabResult";
import RadResults from "../Assessment/RadResult/RadResult";
import Delta from "../Delta";
import AllReports from "../AllReports";
import Enumerable from "linq";
import { AlgaehActions } from "../../../actions/algaehActions";
import OrderedList from "../Assessment/OrderedList/OrderedList";
import Plan from "../Plan/Plan";
import {
  algaehApiCall,
  swalMessage,
  maxCharactersLeft,
} from "../../../utils/algaehApiCall";
import SubjectiveHandler from "./SubjectiveHandler";
import PatientHistory from "../PatientHistory/PatientHistory";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import Allergies from "../Allergies/Allergies";
import Examination from "../Examination/Examination";
import { Validations } from "./Validation";
// import { setGlobal } from "../../../utils/GlobalFunctions";
import "./basicSubjective.scss";
import _ from "lodash";
import moment from "moment";
import { Dimmer, Loader } from "semantic-ui-react";
import { PatientAttachments } from "../../PatientRegistrationNew/PatientAttachment";
import { printPrescription } from "../PatientProfileHandlers";
import { AlgaehModal } from "algaeh-react-components";
// import { Button } from "antd";

class BasicSubjective extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageDisplay: "Orders",
      openMedication: false,
      openMedicaldata: false,
      openDiet: false,
      openVital: false,
      openAlergy: false,
      openExamnModal: null,
      chief_complaint: "",
      duration: null,
      significant_signs: "",
      other_signs: "",
      interval: null,
      onset_date: null,
      pain: null,
      severity: null,
      chronic: null,
      complaint_type: null,
      isPregnancy: false,
      hims_f_episode_chief_complaint_id: null,
      recent_mediction: [],
      all_mediction: [],
      active_medication: [],
      loadingUnderMedication: true,
      deltaOpen: false,
      allReportOpen: false,
      editPrescriptionModal: false,
      no_of_days: 0,
      dosage: 1,
      med_units: "",
    };
    this.isMale = Window?.global?.gender === "Male" ? true : false; // String(Window["global"]["gender"]) === "Male" ? true : false;
    this.chiefComplaintMaxLength = 1500;
    this.significantSignsLength = 500;
    this.otherConditionMaxLength = 500;
    this.getPatientEncounterDetails();
    this.complaintType = [];
    SubjectiveHandler().getPatientChiefComplaints(this);
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
    });

    value.value === "PREGNANCY"
      ? this.setState({
          isPregnancy: true,
        })
      : this.setState({
          isPregnancy: false,
          lmp_days: "",
        });
  }
  datehandle(e) {
    SubjectiveHandler().datehandle(this, e);
  }
  ChangeEventHandler(e) {
    SubjectiveHandler().ChangeEventHandler(this, e);
  }

  onchangegridcol(row, from, e) {
    SubjectiveHandler().onchangegridcol(this, row, from, e);
  }

  deleteFinalDiagnosis(row) {
    SubjectiveHandler().deleteFinalDiagnosis(this, row);
  }
  updateDiagnosis(row) {
    SubjectiveHandler().updateDiagnosis(this, row);
  }
  IcdsSearch(diagType) {
    SubjectiveHandler().IcdsSearch(this, diagType);
  }
  dataLevelUpdate(e) {
    SubjectiveHandler().dataLevelUpdate(this, e);
  }

  deletePrecription(medicine, context) {
    SubjectiveHandler().deletePrecription(this, medicine, context);
  }

  openTab(e) {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      var element = document.querySelectorAll("[algaehtabs]");
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove("active");
      }
      e.currentTarget.classList.add("active");
      var specified = e.currentTarget.getAttribute("algaehtabs");
      this.setState({
        pageDisplay: specified,
      });
    }
  }

  instructionItems() {
    const frequency = _.find(
      PRESCRIPTION_FREQ_PERIOD,
      (f) => f.value === this.state.frequency
    );
    const frequencyType = _.find(
      PRESCRIPTION_FREQ_TIME,
      (f) => f.value === this.state.frequency_type
    );
    const consume = _.find(
      PRESCRIPTION_FREQ_DURATION,
      (f) => f.value === this.state.frequency_time
    );
    const route = _.find(
      PRESCRIPTION_FREQ_ROUTE,
      (f) => f.value === this.state.frequency_route
    );
    if (frequency !== undefined && frequencyType !== undefined) {
      this.setState({
        instructions: `${this.state.dosage}-${this.state.med_units}, ${
          frequency.name
        }, ${frequencyType.name}, ${
          consume !== undefined ? consume.name : ""
        }, ${route !== undefined ? route.name : ""} for ${
          this.state.no_of_days
        } day(s)`,
      });
    }
  }
  onInstructionsTextHandler(e) {
    this.setState({
      instructions: e.currentTarget.value,
    });
  }
  texthandle = (e) => {
    let name = e.name || e.target.name;
    let value = e.value === "" ? null : e.value || e.target.value;
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.instructionItems();
        this.calcuateDispense(e);
      }
    );
  };
  calcuateDispense = (e) => {
    // if (e.target === null || e.target.value !== e.target.oldvalue) {

    let frequency = 0;
    let frequency_type = 0;
    let dispense = 0;
    if (this.state.no_of_days !== 0) {
      //Frequency
      if (
        this.state.frequency === "0" ||
        this.state.frequency === "4" ||
        this.state.frequency === "5"
      ) {
        frequency = 2;
      } else if (
        this.state.frequency === "1" ||
        this.state.frequency === "2" ||
        this.state.frequency === "3"
      ) {
        frequency = 1;
      } else if (this.state.frequency === "6") {
        frequency = 3;
      }

      //Frequency Type
      if (this.state.frequency_type === "PD" && frequency === 2) {
        frequency_type = 2;
      } else if (this.state.frequency_type === "PD" && frequency === 1) {
        frequency_type = 1;
      } else if (this.state.frequency_type === "PD" && frequency === 3) {
        frequency_type = 3;
      } else if (this.state.frequency_type === "PH" && frequency === 2) {
        frequency_type = 2 * 24;
      } else if (this.state.frequency_type === "PH" && frequency === 1) {
        frequency_type = 1 * 24;
      } else if (this.state.frequency_type === "PH" && frequency === 3) {
        frequency_type = 3 * 24;
      } else if (this.state.frequency_type === "PW" && frequency === 2) {
        frequency_type = 2;
      } else if (this.state.frequency_type === "PW" && frequency === 1) {
        frequency_type = 1;
      } else if (this.state.frequency_type === "PW" && frequency === 3) {
        frequency_type = 3;
      } else if (this.state.frequency_type === "PM" && frequency === 2) {
        frequency_type = 2;
      } else if (this.state.frequency_type === "PM" && frequency === 1) {
        frequency_type = 1;
      } else if (this.state.frequency_type === "PM" && frequency === 3) {
        frequency_type = 3;
      } else if (this.state.frequency_type === "AD" && frequency === 2) {
        frequency_type = 2;
      } else if (this.state.frequency_type === "AD" && frequency === 1) {
        frequency_type = 1;
      } else if (this.state.frequency_type === "AD" && frequency === 3) {
        frequency_type = 3;
      }

      dispense = this.state.no_of_days * this.state.dosage * frequency_type;

      this.setState({
        dispense: dispense,
      });
    }
    // }
  };
  getPatientMedications() {
    const { current_patient } = Window.global;
    this.setState(
      {
        loadingUnderMedication: true,
      },
      () => {
        algaehApiCall({
          uri: "/orderMedication/getPatientMedications",
          data: { patient_id: current_patient }, //Window.global["current_patient"] },
          method: "GET",
          onSuccess: (response) => {
            const data = { loadingUnderMedication: false };
            if (response.data.success) {
              data["recent_mediction"] = response.data.records.latest_mediction;
              data["all_mediction"] = response.data.records.all_mediction;
              data["active_medication"] =
                response.data.records.active_medication;
            }
            this.setState({
              ...data,
            });
          },
          onFailure: (error) => {
            swalMessage({
              title: error.message,
              type: "error",
            });
          },
        });
      }
    );
  }

  getPatientEncounterDetails() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientEncounter",
      method: "GET",
      data: {
        encounter_id: Window?.global?.encounter_id, //Window.global.encounter_id
      },
      onSuccess: (response) => {
        let data = response.data.records[0];
        if (response.data.success) {
          this.setState(
            {
              significant_signs: data.significant_signs,
              other_signs: data.other_signs,
            },
            () => {
              Window.global["significant_signs"] = this.state.significant_signs;
              Window.global["other_signs"] = this.state.other_signs;
            }
          );

          // setGlobal({
          //   significant_signs: data.significant_signs
          // });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  componentWillUnmount() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
    }
  }

  showAllergies() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      this.setState({
        openAlergy: !this.state.openAlergy,
      });
    }
  }
  showMedication() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      this.setState({
        openMedication: !this.state.openMedication,
      });
    }
  }

  showMedicalData() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      this.setState({
        openMedicaldata: !this.state.openMedicaldata,
      });
    }
  }

  showDelta() {
    this.setState({
      deltaOpen: !this.state.deltaOpen,
    });
  }
  showAllReport() {
    this.setState({
      allReportOpen: !this.state.allReportOpen,
    });
  }

  showAttachments() {
    this.setState({
      attachmentOpen: !this.state.attachmentOpen,
    });
  }

  showPatientHistory() {
    this.setState({
      openAddModal: !this.state.openAddModal,
    });
  }

  showDietPlan() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      this.setState({
        openDiet: !this.state.openDiet,
      });
    }
  }

  closeDietPlan() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      const { current_patient, episode_id } = Window.global;
      this.setState(
        {
          openDiet: !this.state.openDiet,
        },
        () => {
          this.props.getPatientDiet({
            uri: "/doctorsWorkBench/getPatientDiet",
            method: "GET",
            data: {
              patient_id: current_patient, //Window.global["current_patient"],
              episode_id: episode_id, //Window.global["episode_id"]
            },
            cancelRequestId: "getPatientDiet",
            redux: {
              type: "PATIENT_DIET",
              mappingName: "patient_diet",
            },
          });
        }
      );
    }
  }

  showVitals() {
    const err = Validations(this);
    if (!err) {
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
      this.setState({
        openVital: !this.state.openVital,
      });
    }
  }

  closeVitals() {
    this.setState({
      openVital: !this.state.openVital,
    });
  }

  showPhysicalExamination() {
    this.setState({
      openExamnModal: !this.state.openExamnModal,
    });
  }

  textAreaEvent(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value,
    });
    Window.global[name] = value;
    // if (name === "chief_complaint") {

    // setGlobal({
    //   chief_complaint: value
    // });
    //  }
    // if (name === "significant_signs") {
    //   setGlobal({
    //     significant_signs: value
    //   });
    // }
  }
  clearItemCodeHandler() {
    this.setState({
      generic_name_item_description: "",
      service_id: null,
      uom_id: null,
      item_category_id: null,
      item_group_id: null,
      addItemEnable: true,
      instructions: "",
      total_quantity: 0,
      frequency_route: "OR",
    });
  }
  // favMedData() {
  //   algaehApiCall({
  //     uri: "/orderMedication/getFavMedication",

  //     method: "GET",
  //     data: {
  //       added_provider_id: this.state.provider_id,
  //     },

  //     onSuccess: (data) => {
  //       this.setState({
  //         favMedData: data.data.records,
  //         favMedPop: true,
  //       });
  //     },
  //     onCatch: (error) => {
  //       console.log("error", error);
  //     },
  //   });
  // }
  numberhandle = (ctrl, e) => {
    e = e || ctrl;

    let name = e.name;
    if (e.value === "") {
      this.setState({
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
      this.setState(
        {
          [name]: value,
        },
        () => {
          this.instructionItems();
          this.calcuateDispense(e);
        }
      );
    }
  };
  onEditRow(row, context) {
    this.setState({
      // rowDetails: row,
      // generic_name_item_description: row.generic_name,
      editPrescriptionModal: true,
      // addItemEnable: false,
      hims_f_prescription_detail_id: row.hims_f_prescription_detail_id,
      frequency: row.frequency,
      dispense: row.dispense,

      pre_approval: row.pre_approval,
      frequency_type: row.frequency_type,
      frequency_time: row.frequency_time,
      frequency_route: row.frequency_route,
      dosage: row.dosage,

      // total_quantity:row.
      updateButton: true,

      med_units: row.med_units,
      no_of_days: row.no_of_days,
      start_date: row.start_date,
      instructions: row.instructions,
      generic_name_item_description: row.item_description.replace(
        /\w+/g,
        _.capitalize
      ),
      generic_name: row.generic_name,
      item_description: row.item_description,
      item_id: row.item_id,
      generic_id: row.generic_id,
      service_id: row.service_id,
      uom_id: row.uom_id,
      item_category_id: row.item_category_id,
      item_group_id: row.item_group_id,
    });
  }
  itemHandle(item) {
    if (item.service_id === null || item.service_id === undefined) {
      swalMessage({
        title: "Service not setup to the selected Item.",
        type: "error",
      });
      this.setState({
        total_quantity: 0,
        generic_id: null,
      });
    } else {
      this.setState(
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
        }
        // () => {
        //   getItemStock(this);
        // }
      );
    }
  }

  updatePrescription() {
    let medicationobj = {
      item_id: this.state.item_id,
      generic_id: this.state.generic_id,
      dosage: this.state.dosage,
      med_units: this.state.med_units,
      frequency: this.state.frequency,
      no_of_days: this.state.no_of_days,
      frequency_type: this.state.frequency_type,
      frequency_time: this.state.frequency_time,
      frequency_route: this.state.frequency_route,
      start_date: this.state.start_date,
      uom_id: this.state.uom_id,
      service_id: this.state.service_id,
      item_category_id: this.state.item_category_id,
      item_group_id: this.state.item_group_id,
      instructions: this.state.instructions,
      insured: this.state.insured,
      hims_f_prescription_detail_id: this.state.hims_f_prescription_detail_id,
    };

    let Validation =
      this.state.item_id &&
      this.state.generic_id &&
      this.state.dosage &&
      this.state.med_units &&
      this.state.frequency &&
      this.state.no_of_days &&
      this.state.frequency_type &&
      this.state.frequency_time &&
      this.state.frequency_route &&
      this.state.start_date &&
      this.state.uom_id &&
      this.state.service_id &&
      this.state.item_category_id &&
      this.state.item_group_id &&
      this.state.instructions &&
      this.state.generic_name_item_description
        ? true
        : false;
    if (Validation === true) {
      algaehApiCall({
        uri: "/orderMedication/updatePatientPrescription",
        method: "PUT",
        data: { medicationobj },
        onSuccess: (response) => {
          swalMessage({
            title: "Prescription Updated Successful ...",
            type: "success",
          });
          this.setState({ editPrescriptionModal: false });
          this.getPatientMedications();
        },
        onFailure: (error) => {
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });
    } else {
      swalMessage({
        title: "Please Fill The Mandatory Fields",
        type: "error",
      });
      return;
    }
  }
  componentDidMount() {
    this.getPatientMedications();
    if (this.isMale) {
      this.complaintType = Enumerable.from(GlobalVariables.COMPLAINT_TYPE)
        .where((w) => w["value"] !== "PREGNANCY")
        .toArray();
    } else {
      this.complaintType = GlobalVariables.COMPLAINT_TYPE;
    }
  }
  render() {
    const _diagnosis =
      this.props.patient_diagnosis !== undefined
        ? this.props.patient_diagnosis
        : [];
    const _finalDiagnosis = Enumerable.from(_diagnosis)
      .where((w) => w.final_daignosis === "Y")
      .toArray();
    const recentMediction = _.chain(this.state.active_medication)
      .groupBy((g) => moment(g.prescription_date).format("YYYYMMDD"))
      .map((details, key) => {
        const month = moment(key, "YYYYMMDD").format("MMM");
        const day = moment(key, "YYYYMMDD").format("DD");
        const year = moment(key, "YYYYMMDD").format("YYYY");
        return {
          date: key,
          month: month,
          day: day,
          year: year,
          details: details,
        };
      })
      .value();

    return (
      <MyContext.Consumer>
        {(context) => (
          // <div>
          //   <AlgaehModal
          //     wrapClassName="FavMedicationModal"
          //     title="Select Favourite Medication "
          //     visible={this.state.favMedPop}
          //     // okButtonProps={{
          //     //   loading: lodingAddtoList,
          //     // }}
          //     // okText={}
          //     maskClosable={false}
          //     // cancelButtonProps={{ disabled: lodingAddtoList }}
          //     closable={true}
          //     onCancel={() => {
          //       this.setState({
          //         favMedPop: false,
          //       });
          //     }}
          //     className={`row algaehNewModal`}
          //     // onOk={onOK}
          //   >
          //     <div className="col-12" id="FavMedGrid_Cntr">
          //       <AlgaehDataGrid
          //         id="hims_f_favourite_icd_med_id"
          //         columns={[
          //           {
          //             fieldName: "generic_name",
          //             label: (
          //               <AlgaehLabel label={{ forceLabel: "Generic Name" }} />
          //             ),
          //           },
          //           {
          //             fieldName: "item_description",
          //             label: (
          //               <AlgaehLabel label={{ forceLabel: "Item Name" }} />
          //             ),
          //             displayTemplate: (row) => {
          //               return (
          //                 <span
          //                   onClick={this.setItemName.bind(this, row)}
          //                   className="item_description"
          //                 >
          //                   {row.item_description}
          //                 </span>
          //               );
          //             },
          //             others: {
          //               resizable: false,
          //               style: { textAlign: "center" },
          //             },
          //             className: (drow) => {
          //               return "greenCell";
          //             },
          //           },
          //         ]}
          //         keyId="item_id"
          //         dataSource={{
          //           data: this.state.favMedData,
          //         }}
          //         // actions={{
          //         //   allowEdit: false,
          //         // }}
          //         // isEditable={true}
          //         filter={true}
          //         paging={{ page: 0, rowsPerPage: 10 }}
          //         byForceEvents={true}
          //         events={
          //           {
          //             // onDelete: deleteItems.bind(this, this),
          //             // onEdit: this.onEditRow.bind(this, row),
          //             // onCancel: CancelGrid.bind(this, this),
          //             // onDone: updateItems.bind(this, this),
          //           }
          //         }
          //       />
          //     </div>
          //   </AlgaehModal>
          <div className="subjective basicSubjective">
            <div className="row margin-top-15">
              <div className="algaeh-fixed-right-menu">
                <ul className="rightActionIcon">
                  <li>
                    <span className="animated slideInLeft faster">Vitals</span>
                    <i
                      className="fas fa-heartbeat"
                      onClick={this.showVitals.bind(this)}
                    />
                  </li>
                  <Vitals
                    openVital={this.state.openVital}
                    primary_id_no={this.props.pat_profile.primary_id_no}
                    visit_code={this.props.pat_profile.visit_code}
                    onClose={this.closeVitals.bind(this)}
                  />
                  <li>
                    <span className="animated slideInLeft faster">
                      Allergies
                    </span>
                    <i
                      className="fas fa-allergies"
                      onClick={this.showAllergies.bind(this)}
                    />
                  </li>
                  <Allergies
                    openAllergyModal={this.state.openAlergy}
                    primary_id_no={this.props.pat_profile.primary_id_no}
                    visit_code={this.props.pat_profile.visit_code}
                    onClose={this.showAllergies.bind(this)}
                  />
                  <li>
                    <span className="animated slideInLeft faster">History</span>
                    <i
                      className="fas fa-hourglass-half"
                      onClick={this.showPatientHistory.bind(this)}
                    />
                  </li>
                  <PatientHistory
                    openAddModal={this.state.openAddModal}
                    onClose={this.showPatientHistory.bind(this)}
                  />
                  <li>
                    <span className="animated slideInLeft faster">
                      Examination
                    </span>
                    <i
                      className="fas fa-clipboard"
                      onClick={this.showPhysicalExamination.bind(this)}
                    />
                  </li>
                  <Examination
                    openExamnModal={this.state.openExamnModal}
                    onClose={this.showPhysicalExamination.bind(this)}
                  />
                  <li>
                    <span className="animated slideInLeft faster">
                      Medication
                    </span>
                    <i
                      className="fas fa-pills"
                      onClick={this.showMedication.bind(this)}
                    />
                  </li>

                  <Plan
                    mainState={this}
                    openMedication={this.state.openMedication}
                    onClose={this.showMedication.bind(this)}
                    vat_applicable={this.props.vat_applicable}
                    primary_id_no={this.props.pat_profile.primary_id_no}
                    visit_code={this.props.pat_profile.visit_code}
                    Encounter_Date={this.props.pat_profile.Encounter_Date}
                  />

                  <li>
                    <span className="animated slideInLeft faster">
                      Diet Plan
                    </span>
                    <i
                      className="fas fa-utensils"
                      onClick={this.showDietPlan.bind(this)}
                    />
                  </li>
                  <Plan
                    mainState={this}
                    openDiet={this.state.openDiet}
                    onClose={this.closeDietPlan.bind(this)}
                  />
                  <li>
                    <span className="animated slideInLeft faster">
                      Other Details
                    </span>
                    <i
                      className="fas fa-notes-medical"
                      onClick={this.showMedicalData.bind(this)}
                    />
                  </li>
                  <Plan
                    mainState={this}
                    openMedicaldata={this.state.openMedicaldata}
                    onClose={this.showMedicalData.bind(this)}
                  />
                  <li>
                    <span className="animated slideInLeft faster">Delta</span>
                    <i
                      className="fas fa-chart-line"
                      onClick={this.showDelta.bind(this)}
                    />
                  </li>
                  <Delta
                    state={this.state}
                    visible={this.state.deltaOpen}
                    onCancel={this.showDelta.bind(this)}
                  />
                  <li>
                    <span className="animated slideInLeft faster">
                      Attachments
                    </span>
                    <i
                      className="fas fa-paperclip"
                      onClick={this.showAttachments.bind(this)}
                    />
                  </li>
                  <PatientAttachments
                    visible={this.state.attachmentOpen}
                    onClose={this.showAttachments.bind(this)}
                    patientData={{
                      hims_d_patient_id: Window?.global?.current_patient,
                      patient_code: this.props.pat_profile?.patient_code,
                    }}
                    onlyShow={true}
                  />

                  <li>
                    <span className="animated slideInLeft faster">
                      All Reports
                    </span>
                    <i
                      className="fas fa-file-medical-alt"
                      onClick={this.showAllReport.bind(this)}
                    />
                  </li>

                  <AllReports
                    // state={this.state}
                    visible={this.state.allReportOpen}
                    this={this}
                    onCancel={this.showAllReport.bind(this)}
                  />
                </ul>
              </div>
              <div className="algaeh-col-3">
                <div className="row">
                  <div className="col-12">
                    <div className="portlet portlet-bordered margin-bottom-15 mandatoryBox">
                      <div className="portlet-title">
                        <div className="caption">
                          <h3 className="caption-subject">
                            Chief Complaints & Main Symptoms
                          </h3>
                        </div>
                      </div>
                      <div className="portlet-body">
                        <div className="row">
                          <div className="col-12">
                            <div className="row">
                              <div className="col-12">
                                <textarea
                                  className="chiefComplaintFld"
                                  value={
                                    this.state.chief_complaint === null ||
                                    this.state.chief_complaint === undefined
                                      ? ""
                                      : this.state.chief_complaint
                                  }
                                  name="chief_complaint"
                                  onChange={this.textAreaEvent.bind(this)}
                                  maxLength={this.chiefComplaintMaxLength}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="row">
                              <AlgaehDateHandler
                                div={{ className: "col" }}
                                label={{
                                  forceLabel: "Onset Date",
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "onset_date",
                                }}
                                maxDate={new Date()}
                                events={{
                                  onChange: this.datehandle.bind(this),
                                }}
                                dontAllow={"future"}
                                value={this.state.onset_date}
                              />

                              <AlagehAutoComplete
                                div={{ className: "col paddingLeft-0" }}
                                label={{
                                  forceLabel: "Interval",
                                  isImp: false,
                                }}
                                selector={{
                                  name: "interval",
                                  className: "select-fld",
                                  value: this.state.interval,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.PAIN_DURATION,
                                  },
                                  onChange: this.dataLevelUpdate.bind(this),
                                }}
                              />

                              <AlagehFormGroup
                                div={{ className: "col paddingLeft-0" }}
                                label={{
                                  forceLabel: "Duration",
                                  isImp: false,
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "duration",
                                  number: true,
                                  value: this.state.duration,
                                  events: {
                                    onChange: this.dataLevelUpdate.bind(this),
                                  },
                                  others: {
                                    min: 0,
                                  },
                                }}
                              />
                              <AlagehAutoComplete
                                div={{ className: "col paddingLeft-0" }}
                                label={{
                                  forceLabel: "Comp. Type",
                                  isImp: false,
                                }}
                                selector={{
                                  name: "complaint_type",
                                  className: "select-fld",
                                  value: this.state.complaint_type,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: this.complaintType,
                                  },
                                  onChange: this.dropDownHandler.bind(this),
                                }}
                              />

                              {this.isMale ? null : (
                                <AlagehFormGroup
                                  div={{ className: "col paddingLeft-0" }}
                                  label={{
                                    forceLabel: "LMP (Days)",
                                    isImp: false,
                                  }}
                                  textBox={{
                                    className: "txt-fld",
                                    name: "lmp_days",
                                    number: { allowNegative: false },
                                    value: this.state.lmp_days,
                                    disabled: !this.state.isPregnancy,
                                    events: {
                                      onChange: this.ChangeEventHandler.bind(
                                        this
                                      ),
                                    },
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-12" style={{ marginTop: 10 }}>
                            <small className="float-left">
                              Max Char.
                              {maxCharactersLeft(
                                this.chiefComplaintMaxLength,
                                this.state.chief_complaint
                              )}
                              /{this.chiefComplaintMaxLength}
                            </small>
                            <button
                              className="btn btn-default float-right"
                              onClick={() => {
                                const err = Validations(this);
                                if (!err) {
                                  if (
                                    this.state
                                      .hims_f_episode_chief_complaint_id ===
                                    null
                                  ) {
                                    SubjectiveHandler().addChiefComplainToPatient(
                                      this,
                                      "forceSave"
                                    );
                                  } else {
                                    SubjectiveHandler().updatePatientChiefComplaints(
                                      this,
                                      "forceSave"
                                    );
                                  }
                                }
                              }}
                            >
                              {this.state.hims_f_episode_chief_complaint_id ===
                              null
                                ? "Save"
                                : "Update"}{" "}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="portlet portlet-bordered margin-bottom-15 mandatoryBox">
                      <div className="portlet-title">
                        <div className="caption">
                          <h3 className="caption-subject">Significant Signs</h3>
                        </div>
                      </div>
                      <div className="portlet-body">
                        <div className="row">
                          <div className="col-12">
                            <textarea
                              value={
                                this.state.significant_signs === null ||
                                this.state.significant_signs === undefined
                                  ? ""
                                  : this.state.significant_signs
                              }
                              name="significant_signs"
                              onChange={this.textAreaEvent.bind(this)}
                              maxLength={this.significantSignsLength}
                            />
                          </div>
                          <div className="col-12">
                            <small className="float-left">
                              Max Char.
                              {maxCharactersLeft(
                                this.significantSignsLength,
                                this.state.significant_signs
                              )}
                              /{this.significantSignsLength}
                            </small>
                            <button
                              className="btn btn-default float-right"
                              style={{ marginTop: 5 }}
                              onClick={() => {
                                const err = Validations(this);
                                if (!err) {
                                  if (
                                    this.state
                                      .hims_f_episode_chief_complaint_id ===
                                    null
                                  ) {
                                    SubjectiveHandler().addChiefComplainToPatient(
                                      this,
                                      "forceSave"
                                    );
                                  } else {
                                    SubjectiveHandler().updatePatientChiefComplaints(
                                      this,
                                      "forceSave"
                                    );
                                  }
                                }
                              }}
                            >
                              {this.state.hims_f_episode_chief_complaint_id ===
                              null
                                ? "Save"
                                : "Update"}{" "}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="portlet portlet-bordered margin-bottom-15">
                      <div className="portlet-title">
                        <div className="caption">
                          <h3 className="caption-subject">Other Conditions</h3>
                        </div>
                      </div>
                      <div className="portlet-body">
                        <div className="row">
                          <div className="col-12">
                            <textarea
                              value={
                                this.state.other_signs === null ||
                                this.state.other_signs === undefined
                                  ? ""
                                  : this.state.other_signs
                              }
                              name="other_signs"
                              onChange={this.textAreaEvent.bind(this)}
                              maxLength={this.otherConditionMaxLength}
                            />
                          </div>{" "}
                          <div className="col-12">
                            {" "}
                            <small className="float-left">
                              Max Char.
                              {maxCharactersLeft(
                                this.otherConditionMaxLength,
                                this.state.other_signs
                              )}
                              / {this.otherConditionMaxLength}
                            </small>
                            <button
                              className="btn btn-default float-right"
                              style={{ marginTop: 5 }}
                              onClick={() => {
                                const err = Validations(this);
                                if (!err) {
                                  if (
                                    this.state
                                      .hims_f_episode_chief_complaint_id ===
                                    null
                                  ) {
                                    SubjectiveHandler().addChiefComplainToPatient(
                                      this,
                                      "forceSave"
                                    );
                                  } else {
                                    SubjectiveHandler().updatePatientChiefComplaints(
                                      this,
                                      "forceSave"
                                    );
                                  }
                                }
                              }}
                            >
                              {this.state.hims_f_episode_chief_complaint_id ===
                              null
                                ? "Save"
                                : "Update"}{" "}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="algaeh-col-8">
                <div className="row">
                  <div className="col-7">
                    <div className="portlet portlet-bordered margin-bottom-15">
                      <div className="portlet-title">
                        <div className="caption">
                          <h3 className="caption-subject">Diagnosis</h3>
                        </div>
                        <div className="actions">
                          <button
                            className="btn btn-primary btn-circle active"
                            onClick={this.IcdsSearch.bind(this, "Final")}
                          >
                            <i className="fas fa-plus" />
                          </button>
                        </div>
                      </div>

                      <div className="portlet-body">
                        <div id="finalDioGrid" className="row">
                          <div className="col-lg-12">
                            <AlgaehDataGrid
                              id="Finalintial_icd"
                              columns={[
                                {
                                  fieldName: "diagnosis_type",
                                  label: (
                                    <AlgaehLabel
                                      label={{
                                        forceLabel: "Type",
                                      }}
                                    />
                                  ),
                                  displayTemplate: (row) => {
                                    return row.diagnosis_type === "P"
                                      ? "Primary"
                                      : "Secondary";
                                  },
                                  editorTemplate: (row) => {
                                    return (
                                      <AlagehAutoComplete
                                        div={{}}
                                        selector={{
                                          name: "diagnosis_type",
                                          className: "select-fld",
                                          value: row.diagnosis_type,
                                          dataSource: {
                                            textField: "name",
                                            valueField: "value",
                                            data: GlobalVariables.DIAG_TYPE,
                                          },
                                          onChange: this.onchangegridcol.bind(
                                            this,
                                            row,
                                            "Final"
                                          ),
                                        }}
                                      />
                                    );
                                  },
                                  others: { maxWidth: 70, align: "center" },
                                },
                                {
                                  fieldName: "icd_code",
                                  label: (
                                    <AlgaehLabel
                                      label={{
                                        forceLabel: "ICD Code",
                                      }}
                                    />
                                  ),
                                  others: {
                                    disabled: true,
                                    maxWidth: 70,
                                    align: "center",
                                  },
                                },
                                {
                                  fieldName: "icd_description",
                                  label: (
                                    <AlgaehLabel
                                      label={{
                                        forceLabel: "Description",
                                      }}
                                    />
                                  ),
                                  others: { disabled: true },
                                },
                              ]}
                              keyId="code"
                              dataSource={{
                                // data: _finalDiagnosis
                                data: _finalDiagnosis,
                              }}
                              isEditable={true}
                              paging={{ page: 0, rowsPerPage: 5 }}
                              events={{
                                onDelete: this.deleteFinalDiagnosis.bind(this),
                                onEdit: (row) => {},

                                onDone: this.updateDiagnosis.bind(this),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <AlgaehModal
                    title={"Update Prescription "}
                    visible={this.state.editPrescriptionModal}
                    mask={true}
                    maskClosable={true}
                    onCancel={() => {
                      this.setState({ editPrescriptionModal: false });
                    }}
                    className={`row algaehNewModal updatePresModal`}
                    footer={false}
                  >
                    <div className="col popupInner">
                      <div className="row medicationSearchCntr">
                        <AlgaehAutoSearch
                          div={{
                            className:
                              "col-12 mandatory form-group AlgaehAutoSearch",
                          }}
                          label={{
                            forceLabel: "Generic Name / Item Name",
                            isImp: true,
                          }}
                          title="Search by generic name / item name"
                          name="generic_name_item_description"
                          columns={[
                            { fieldName: "item_description" },
                            { fieldName: "item_code" },
                            { fieldName: "sfda_code" },
                            {
                              fieldName: "generic_name",
                            },
                          ]}
                          displayField="generic_name_item_description"
                          value={this.state.generic_name_item_description}
                          searchName="ItemMasterOrderMedication"
                          template={({
                            item_code,
                            item_description,
                            sfda_code,
                            storage_description,
                            sales_price,
                            generic_name,
                          }) => {
                            return (
                              <div className="medicationSearchList">
                                <h6>
                                  {item_description
                                    .split(" ")
                                    .map(_.capitalize)
                                    .join(" ")}{" "}
                                  <small>
                                    {_.startCase(_.toLower(generic_name))}
                                  </small>
                                </h6>
                                {storage_description !== null &&
                                storage_description !== "" ? (
                                  <small>
                                    Storage :{" "}
                                    {_.startCase(
                                      _.toLower(storage_description)
                                    )}
                                  </small>
                                ) : null}
                              </div>
                            );
                          }}
                          onClear={this.clearItemCodeHandler.bind(this)}
                          onClick={this.itemHandle.bind(this)}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-3  mandatory form-group" }}
                          label={{ forceLabel: "Frequency", isImp: true }}
                          selector={{
                            sort: "off",
                            name: "frequency",
                            className: "select-fld",
                            value: this.state.frequency,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: PRESCRIPTION_FREQ_PERIOD,
                            },
                            onChange: this.texthandle,
                            autoComplete: "off",
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-3  mandatory form-group" }}
                          label={{ forceLabel: "Freq. Type", isImp: true }}
                          selector={{
                            sort: "off",
                            name: "frequency_type",
                            className: "select-fld",
                            value: this.state.frequency_type,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: PRESCRIPTION_FREQ_TIME,
                            },
                            onChange: this.texthandle,
                            autoComplete: "off",
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-3 mandatory form-group" }}
                          label={{ forceLabel: "Consume", isImp: true }}
                          selector={{
                            sort: "off",
                            name: "frequency_time",
                            className: "select-fld",
                            value: this.state.frequency_time,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: PRESCRIPTION_FREQ_DURATION,
                            },
                            onChange: this.texthandle,
                            autoComplete: "off",
                          }}
                        />{" "}
                        <AlagehAutoComplete
                          div={{ className: "col-3 mandatory form-group" }}
                          label={{ forceLabel: "Route", isImp: true }}
                          selector={{
                            sort: "off",
                            name: "frequency_route",
                            className: "select-fld",
                            value: this.state.frequency_route,
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: PRESCRIPTION_FREQ_ROUTE,
                            },
                            onChange: this.texthandle,
                            autoComplete: "off",
                          }}
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col  mandatory form-group" }}
                          label={{
                            forceLabel: "Dosage",
                            isImp: true,
                          }}
                          textBox={{
                            number: true,
                            className: "txt-fld",
                            name: "dosage",
                            value: this.state.dosage,
                            events: {
                              onChange: this.numberhandle,
                            },
                            others: {
                              min: 1,
                              onFocus: (e) => {
                                e.target.oldvalue = e.target.value;
                              },
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col mandatory form-group" }}
                          label={{
                            forceLabel: "Units",
                            isImp: true,
                          }}
                          textBox={{
                            // number: text,
                            className: "txt-fld",
                            name: "med_units",
                            value: this.state.med_units,
                            events: {
                              onChange: this.texthandle,
                            },
                            others: {
                              maxLength: 10,
                              onFocus: (e) => {
                                e.target.oldvalue = e.target.value;
                              },
                            },
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col  mandatory form-group" }}
                          label={{
                            forceLabel: "Duration (Days)",
                            isImp: true,
                          }}
                          textBox={{
                            number: { allowNegative: false },
                            className: "txt-fld",
                            name: "no_of_days",
                            value: this.state.no_of_days,
                            events: {
                              onChange: this.numberhandle,
                            },
                            others: {
                              onFocus: (e) => {
                                e.target.oldvalue = e.target.value;
                              },
                            },
                          }}
                        />
                        <AlgaehDateHandler
                          div={{ className: "col mandatory form-group" }}
                          label={{ forceLabel: "Start Date", isImp: true }}
                          textBox={{
                            className: "txt-fld",
                            name: "start_date",
                          }}
                          minDate={new Date()}
                          events={{
                            onChange: this.datehandle,
                          }}
                          value={this.state.start_date}
                        />
                        <div className="col-12">
                          <label className="style_Label ">Instruction</label>
                          <textarea
                            name="instructions"
                            className="txt-fld"
                            rows="4"
                            onChange={this.onInstructionsTextHandler.bind(this)}
                            value={this.state.instructions}
                          />
                        </div>{" "}
                        <div
                          className="col-12"
                          style={{ paddingTop: 9, textAlign: "right" }}
                        >
                          <span style={{ float: "left" }}>
                            Pharmacy Stock: <b>{this.state.total_quantity}</b>
                          </span>
                        </div>
                        <div
                          className="col-12 margin-bottom-15"
                          style={{ textAlign: "right" }}
                        >
                          <button
                            className="btn btn-primary btn-sm"
                            type="button"
                            onClick={this.updatePrescription.bind(this)}
                            // disabled={this.state.addItemEnable}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </AlgaehModal>
                  <div className="col-5" style={{ paddingLeft: 0 }}>
                    <div className="portlet portlet-bordered margin-bottom-15">
                      <div className="portlet-title">
                        <div className="caption">
                          <h3 className="caption-subject">
                            Prescription & Medication
                          </h3>
                        </div>

                        <div className="actions">
                          <button
                            className="btn btn-circle"
                            onClick={printPrescription.bind(this, this)}
                            style={{ marginRight: 5 }}
                          >
                            <i className="fas fa-print" />
                            {/* <i className="fas fa-retweet" /> */}
                          </button>
                          <button
                            className="btn btn-primary btn-circle active"
                            onClick={this.showMedication.bind(this)}
                          >
                            <i className="fas fa-plus" />
                            {/* <i className="fas fa-retweet" /> */}
                          </button>
                        </div>
                      </div>

                      <div className="portlet-body">
                        <div className="activeMedication">
                          {this.state.loadingUnderMedication ? (
                            <Dimmer active>
                              <Loader inline="centered">Loading</Loader>
                            </Dimmer>
                          ) : (
                            <React.Fragment>
                              {recentMediction.map((item, index) => (
                                <div key={index} className="activeMedDateList">
                                  <div className="medcineDate">
                                    <span>{item.month}</span>
                                    <h3>{item.day}</h3>
                                    <span>{item.year}</span>

                                    {/* <div className="printOnHover">
                                    <i className="fas fa-trash-alt" />
                                  </div> */}
                                  </div>
                                  <div className="medcineList">
                                    <ul>
                                      {item.details.map((medicine, indexD) => (
                                        <li key={indexD}>
                                          <b>
                                            {medicine.item_description !==
                                            undefined
                                              ? medicine.item_description.replace(
                                                  /\w+/g,
                                                  _.capitalize
                                                )
                                              : medicine.item_description}
                                          </b>
                                          {/* <small><span>4 ml</span> - <span>12 hourly (1-1-1)</span> * <span>5 days</span></small>*/}
                                          <small>{medicine.instructions}</small>
                                          <small>
                                            Medicine end date :
                                            {moment(medicine.enddate).format(
                                              "DD dddd MMMM YYYY"
                                            )}
                                          </small>
                                          <div className="medAction deletePresItem">
                                            <i
                                              onClick={this.deletePrecription.bind(
                                                this,
                                                medicine,
                                                context
                                              )}
                                              className="fas fa-trash"
                                            />
                                          </div>
                                          <div className="medAction reOrderOnHover">
                                            <i
                                              onClick={this.onEditRow.bind(
                                                this,
                                                medicine,
                                                context
                                              )}
                                              className="fas fa-pen"
                                            />
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="tab-container toggle-section">
                      <ul className="nav">
                        <li
                          algaehtabs={"Orders"}
                          className={"nav-item tab-button active"}
                          onClick={this.openTab.bind(this)}
                        >
                          {
                            <AlgaehLabel
                              label={{
                                forceLabel: "Order Services",
                              }}
                            />
                          }
                        </li>

                        <li
                          algaehtabs={"OrderConsumable"}
                          className={"nav-item tab-button"}
                          onClick={this.openTab.bind(this)}
                        >
                          {
                            <AlgaehLabel
                              label={{
                                forceLabel: "Order Consumable",
                              }}
                            />
                          }
                        </li>

                        <li
                          algaehtabs={"OrderPackage"}
                          className={"nav-item tab-button"}
                          onClick={this.openTab.bind(this)}
                        >
                          {
                            <AlgaehLabel
                              label={{
                                forceLabel: "Order Package",
                              }}
                            />
                          }
                        </li>

                        <li
                          algaehtabs={"LabResults"}
                          className={"nav-item tab-button"}
                          onClick={this.openTab.bind(this)}
                        >
                          {
                            <AlgaehLabel
                              label={{
                                forceLabel: "Lab Results",
                              }}
                            />
                          }
                        </li>
                        <li
                          algaehtabs={"RisResults"}
                          className={"nav-item tab-button"}
                          onClick={this.openTab.bind(this)}
                        >
                          {
                            <AlgaehLabel
                              label={{
                                forceLabel: "RIS Results",
                              }}
                            />
                          }
                        </li>
                      </ul>
                    </div>

                    <div className="grid-section">
                      {this.state.pageDisplay === "Orders" ? (
                        <OrderedList
                          vat_applicable={this.props.vat_applicable}
                          date_of_birth={this.props.date_of_birth}
                          gender={this.props.gender}
                          openData="Investigation"
                          chief_complaint={
                            this.state.chief_complaint === null ||
                            this.state.chief_complaint.length < 4
                              ? true
                              : false
                          }
                          significant_signs={
                            this.state.significant_signs === null ||
                            this.state.significant_signs.length < 4
                              ? true
                              : false
                          }
                        />
                      ) : this.state.pageDisplay === "OrderConsumable" ? (
                        <OrderedList
                          vat_applicable={this.props.vat_applicable}
                          openData="Consumable"
                        />
                      ) : this.state.pageDisplay === "OrderPackage" ? (
                        <OrderedList
                          vat_applicable={this.props.vat_applicable}
                          openData="Package"
                        />
                      ) : this.state.pageDisplay === "LabResults" ? (
                        <LabResults />
                      ) : this.state.pageDisplay === "RisResults" ? (
                        <RadResults />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          // </div>
        )}
      </MyContext.Consumer>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_diagnosis: state.patient_diagnosis,
    patient_diet: state.patient_diet,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientDiagnosis: AlgaehActions,
      getPatientDiet: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BasicSubjective)
);
