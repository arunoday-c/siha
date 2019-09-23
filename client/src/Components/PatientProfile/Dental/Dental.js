import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./Dental.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  AlgaehValidation,
  getAmountFormart
} from "../../../utils/GlobalFunctions";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehModalPopUp,
  AlgaehDateHandler,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import Enumerable from "linq";
import moment from "moment";
import swal from "sweetalert2";
import ButtonType from "../../Wrapper/algaehButton";
let teeth = [];
let my_send_obj = {};
class Dental extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDentalModal: false,
      openDentalModalChild: false,
      standard_fee: 0,
      procedures: [],
      consult_date: new Date(),
      treatements: [],
      dentalTreatments: [],
      openBillingModal: false,
      treatment_gridUpdate: true,
      billDetails: {},
      surface: {},
      scheduled_date: new Date(),
      selected_plan: "------",
      hims_d_services_id: "",
      discount_percentage: 0,
      dental_form_loading: false,
      teeth_type: "P"
    };
    this.getProcedures();
    this.getTreatementPlans();
    // this.deleteDentalPlan = this.deleteDentalPlan.bind(this);
    this.updateDentalTreatmentStatus = this.updateDentalTreatmentStatus.bind(
      this
    );
    this.loadDentalTreatment = this.loadDentalTreatment.bind(this);
  }

  clearSaveState() {
    this.setState({
      plan_name: "",
      remarks: "",
      consult_date: new Date()
    });
  }

  getProcedures() {
    algaehApiCall({
      uri: "/serviceType/getService",
      module: "masterSettings",
      data: {
        procedure_type: "DN"
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            procedures: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  radioChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
      standard_fee: value.selected.standard_fee
    });
  }

  textHandle(e) {
    switch (e.target.name) {
      case "quantity":
        this.setState({
          [e.target.name]: e.target.value,
          total_price: e.target.value * this.state.standard_fee
        });
        break;

      default:
        this.setState({
          [e.target.name]: e.target.value
        });
        break;
    }
  }

  calculateDiscount(e) {
    let discount_percentage = 0;
    if (parseFloat(e.target.value) > 100) {
      this.setState({
        [e.target.name]: 0
      });
      swalMessage({
        title: "Discount % cannot be greater than 100.",
        type: "warning"
      });
    } else {
      discount_percentage = e.target.value;
      this.setState({
        [e.target.name]: e.target.value
      });
    }
    let bill_dtls = { ...this.state.billDetails, ...this.state.ins_details };

    let inputParam = [
      {
        hims_d_services_id: bill_dtls.services_id,
        quantity: bill_dtls.quantity,
        discount_amout: 0,
        discount_percentage: discount_percentage,
        insured: this.state.ins_details !== null ? "Y" : "N",
        vat_applicable: this.props.vat_applicable,
        primary_insurance_provider_id: bill_dtls.insurance_provider_id
          ? bill_dtls.insurance_provider_id
          : null,
        primary_network_office_id: bill_dtls.hims_d_insurance_network_office_id
          ? bill_dtls.hims_d_insurance_network_office_id
          : null,
        primary_network_id: bill_dtls.network_id ? bill_dtls.network_id : null,
        sec_insured: bill_dtls.sec_insured ? bill_dtls.sec_insured : null,
        secondary_insurance_provider_id: bill_dtls.secondary_insurance_provider_id
          ? bill_dtls.secondary_insurance_provider_id
          : null,
        secondary_network_id: bill_dtls.secondary_network_id
          ? bill_dtls.secondary_network_id
          : null,
        secondary_network_office_id: bill_dtls.secondary_network_office_id
          ? bill_dtls.secondary_network_office_id
          : null,
        approval_amt: bill_dtls.approval_amt ? bill_dtls.approval_amt : null,
        approval_limit_yesno: bill_dtls.approval_limit_yesno
          ? bill_dtls.approval_limit_yesno
          : null,
        preapp_limit_amount: bill_dtls.preapp_limit_amount
          ? bill_dtls.preapp_limit_amount
          : null
      }
    ];

    algaehApiCall({
      uri: "/billing/getBillDetails",
      module: "billing",
      method: "POST",
      data: inputParam,
      onSuccess: res => {
        if (res.data.success) {
          res.data.records.billdetails[0].teeth_number = bill_dtls.teeth_number;
          this.setState({
            billDetails: res.data.records.billdetails[0]
          });
        }
      }
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  markAllSurface(e) {
    if (this.state.hims_d_services_id.length !== 0) {
      for (var i = 0; i < e.target.nextSibling.childElementCount; i++) {
        e.target.nextSibling.children[i].click();
      }
    } else {
      swalMessage({
        title: "Please Select a service first",
        type: "warning"
      });
    }
  }

  saveBill() {
    debugger;
    let inputObj = {
      visit_id: Window.global["visit_is"],
      patient_id: Window.global["current_patient"],
      incharge_or_provider: Window.global["provider_id"],
      billed: "N",
      billdetails: [
        {
          ...this.state.billDetails,
          ...{
            d_treatment_id: this.state.hims_f_dental_treatment_id,
            visit_id: Window.global["visit_id"],
            patient_id: Window.global["current_patient"],
            // pre_approval: "N",
            doctor_id: Window.global["provider_id"]
            // teeth_number: teeth_number
          }
        }
      ]
    };

    algaehApiCall({
      uri: "/orderAndPreApproval/insertOrderedServices",
      data: inputObj,
      method: "POST",
      onSuccess: response => {
        if (response.data.success) {
          algaehApiCall({
            uri: "/dental/updateDentalTreatmentBilledStatus",
            method: "PUT",
            data: {
              hims_f_dental_treatment_id: this.state.d_id,
              billed: "SB"
            },
            onSuccess: res => {
              if (res.data.success) {
                this.setState(
                  {
                    openBillingModal: false,
                    discount_amout: 0,
                    discount_percentage: 0
                  },
                  () => {
                    let inputData = {
                      hims_f_treatment_plan_id: this.state
                        .hims_f_treatment_plan_id,
                      approve_status: this.state.approval_status,
                      plan_name: this.state.selected_plan
                    };
                    this.loadDentalTreatment(inputData);
                  }
                );
              }
            },
            onError: error => {
              swalMessage({
                title: error.message,
                type: "error"
              });
            }
          });

          swalMessage({
            title: "Ordered Successfully.",
            type: "success"
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "error"
        });
      }
    });
  }

  addToBill(row) {
    debugger;
    if (this.state.approval_status !== "Y") {
      swalMessage({
        title: "Please Approve the plan",
        type: "warning"
      });
      return;
    }
    algaehApiCall({
      // uri: "/insurance/getPatientInsurance",
      uri: "/patientRegistration/getPatientInsurance",
      module: "frontDesk",
      method: "GET",
      data: {
        patient_id: Window.global["current_patient"],
        patient_visit_id: Window.global["visit_id"]
      },
      onSuccess: res => {
        if (res.data.success) {
          let ins = res.data.records.length > 0 ? res.data.records[0] : null;

          this.setState({
            ins_details: ins
          });

          algaehApiCall({
            uri: "/billing/getBillDetails",
            module: "billing",
            method: "POST",
            cancelRequestId: "getBillDetails4",
            data: [
              {
                insured: res.data.records.length > 0 ? "Y" : "N",
                vat_applicable: this.props.vat_applicable,
                hims_d_services_id: row.service_id,
                primary_insurance_provider_id:
                  ins !== null ? ins.insurance_provider_id : null,
                primary_network_office_id:
                  ins !== null ? ins.hims_d_insurance_network_office_id : null,
                primary_network_id: ins !== null ? ins.network_id : null,
                sec_insured: ins !== null ? ins.sec_insured : null,
                secondary_insurance_provider_id:
                  ins !== null ? ins.secondary_insurance_provider_id : null,
                secondary_network_id:
                  ins !== null ? ins.secondary_network_id : null,
                secondary_network_office_id:
                  ins !== null ? ins.secondary_network_office_id : null,
                approval_amt: ins !== null ? ins.approval_amt : null,
                approval_limit_yesno:
                  ins !== null ? ins.approval_limit_yesno : null,
                preapp_limit_amount:
                  ins !== null ? ins.preapp_limit_amount : null
              }
            ],
            onSuccess: res => {
              debugger;
              if (res.data.success) {
                let dataOutput = res.data.records.billdetails[0];
                if (dataOutput.pre_approval === "Y") {
                  swalMessage({
                    title: "Selected Service is Pre-Approval required.",
                    type: "warning"
                  });
                }
                dataOutput.teeth_number = row.teeth_number;

                dataOutput.insurance_provider_id = this.state.ins_details.insurance_provider_id;
                dataOutput.insurance_sub_id = this.state.ins_details.sub_insurance_provider_id;
                dataOutput.network_id = this.state.ins_details.network_id;
                dataOutput.insurance_network_office_id = this.state.ins_details.hims_d_insurance_network_office_id;
                dataOutput.policy_number = this.state.ins_details.policy_number;
                dataOutput.requested_quantity = dataOutput.quantity;
                dataOutput.insurance_service_name = dataOutput.service_name;

                this.setState({
                  discount_percentage: 0,
                  billDetails: dataOutput,

                  hims_f_dental_treatment_id: row.hims_f_dental_treatment_id
                });
              }
            }
          });
        }
      },
      onError: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });

    this.setState({
      openBillingModal: true,
      treatment_gridUpdate: false,
      d_id: row.hims_f_dental_treatment_id,
      hims_f_treatment_plan_id: row.treatment_plan_id
    });
  }

  getTreatementPlans() {
    algaehApiCall({
      uri: "/dental/getTreatmentPlan",
      method: "GET",
      data: {
        episode_id: Window.global["episode_id"]
      },
      onSuccess: response => {
        if (response.data.records) {
          this.setState({
            treatements: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  markTeethSurface(e) {
    if (
      this.state.hims_d_services_id !== null &&
      this.state.hims_d_services_id.length !== 0
    ) {
      const toothNumber = parseInt(
        e.currentTarget.parentElement.previousElementSibling.innerText,
        10
      );
      const readyToBill = Enumerable.from(this.state.dentalTreatments)
        .where(w => w.teeth_number === toothNumber)
        .toArray();
      const isMarked = e.currentTarget.classList.contains("mark-active");
      const surface = e.currentTarget.innerText.toString();
      const surfaceType = e.currentTarget
        .querySelector("span")
        .getAttribute("surface");
      let returnfunction = false;
      if (isMarked) {
        for (let i = 0; i < readyToBill.length; i++) {
          if (readyToBill[i][surfaceType] === "Y") {
            swalMessage({
              title:
                String(surfaceType).toUpperCase() +
                " - already added you con't add or remove from here need to delete first",
              type: "warning"
            });
            returnfunction = true;
            break;
          }
        }
        if (returnfunction) {
          return;
        }
      }
      e.currentTarget.classList.contains("mark-active")
        ? e.currentTarget.classList.remove("mark-active")
        : e.currentTarget.classList.add("mark-active");

      let my_obj = {
        teeth_number: toothNumber,
        surface: surface
      };

      let my_item = Enumerable.from(teeth)
        .where(
          w =>
            w.teeth_number === my_obj.teeth_number &&
            w.surface === my_obj.surface
        )
        .firstOrDefault();

      if (my_item !== undefined) {
        teeth.splice(teeth.indexOf(my_item), 1);
      } else {
        teeth.push(my_obj);
      }

      let send_teeth = Enumerable.from(teeth)
        .groupBy("$.teeth_number", null, (k, g) => {
          let teeth = Enumerable.from(g.getSource()).firstOrDefault()
            .teeth_number;
          return {
            teeth_number: teeth,
            details: g.getSource()
          };
        })
        .toArray();

      my_send_obj = {
        patient_id: Window.global["current_patient"],
        episode_id: Window.global["episode_id"],
        treatment_plan_id: this.state.hims_f_treatment_plan_id,
        service_id: this.state.hims_d_services_id,
        scheduled_date: this.state.scheduled_date
      };

      my_send_obj.send_teeth = send_teeth;

      this.setState(
        {
          quantity: send_teeth.length
        },
        () => {
          this.setState({
            total_price: this.state.quantity * this.state.standard_fee
          });
        }
      );
    } else {
      swalMessage({
        title: "Please Select a service first",
        type: "warning"
      });
    }
  }

  addDentalPlan(source, e, loader) {
    if (
      my_send_obj.send_teeth === undefined ||
      my_send_obj.send_teeth.length === 0
    ) {
      loader.setState({
        loading: false
      });
      swalMessage({
        title: "No surface selected ..",
        type: "info"
      });
      return;
    }

    AlgaehValidation({
      querySelector: "data-validate='addDentalPlanDiv'",
      alertTypeIcon: "warning",
      onFailure: () => {
        loader.setState({
          loading: false
        });
      },
      onSuccess: () => {
        algaehApiCall({
          uri: "/dental/addDentalTreatment",
          method: "POST",
          data: my_send_obj,
          onSuccess: response => {
            loader.setState({
              loading: false
            });
            if (response.data.success) {
              swalMessage({
                title: "Added Successfully",
                type: "success"
              });
              debugger;
              let inputData = {
                hims_f_treatment_plan_id: this.state.hims_f_treatment_plan_id,
                approve_status: this.state.approval_status,
                plan_name: this.state.selected_plan
              };
              this.loadDentalTreatment(inputData);

              teeth = [];
              my_send_obj = {};
              this.setState({
                treatment_gridUpdate: true,
                openDentalModal: false,
                openDentalModalChild: false,
                hims_d_services_id: null,
                quantity: 0,
                standard_fee: 0,
                total_price: 0
              });
            }
          },
          onError: error => {
            loader.setState({
              loading: false
            });
            swalMessage({
              title: error.message,
              type: "success"
            });
          }
        });
      }
    });
  }

  addTreatementPlan(source, e, loader) {
    AlgaehValidation({
      querySelector: "data-validate='addTreatementDiv'",
      alertTypeIcon: "warning",
      onCatch: () => {
        loader.setState({
          loading: false
        });
      },
      onSuccess: () => {
        algaehApiCall({
          uri: "/dental/addTreatmentPlan",
          method: "POST",
          data: {
            plan_name: this.state.plan_name,
            patient_id: Window.global["current_patient"],
            episode_id: Window.global["episode_id"],
            visit_id: Window.global["visit_id"],
            remarks: this.state.remarks,
            consult_date: this.state.consult_date
          },
          onSuccess: response => {
            loader.setState({
              loading: false
            });
            if (response.data.success) {
              swalMessage({
                title: "Added Successfully",
                type: "success"
              });
              this.clearSaveState();
              this.getTreatementPlans();
            }
          },
          onError: error => {
            loader.setState({
              loading: false
            });
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  approveTreatementPlan(data, type) {
    swal({
      title:
        type === "Y"
          ? "Approve plan?"
          : type === "C"
          ? "Cancel Plan?"
          : "Update?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/dental/approveTreatmentPlan",
          method: "PUT",
          data: {
            hims_f_treatment_plan_id: data.hims_f_treatment_plan_id,
            approve_status: type
          },
          onSuccess: response => {
            if (response.data.success) {
              debugger;
              this.setState({ approval_status: type }, () => {});

              this.getTreatementPlans();
              swalMessage({
                title:
                  type === "Y"
                    ? "Plan Approved"
                    : type === "C"
                    ? "Plan Cancelled"
                    : "Done",
                type: "success"
              });
            }
          },
          onError: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Request Cancelled",
          type: "error"
        });
      }
    });
  }

  generateToothUpperRight(teeth) {
    let plot = [];
    if (this.state.teeth_type === "D") {
      for (let i = 1; i < 6; i++) {
        const tooth =
          i === 5
            ? 51
            : i === 4
            ? 52
            : i === 3
            ? 53
            : i === 2
            ? 54
            : i === 1
            ? 55
            : null;
        let _marking = undefined;
        if (teeth !== undefined) {
          const selectedTooth = Enumerable.from(teeth)
            .where(w => w.teeth_number === tooth)
            .toArray();
          for (let i = 0; i < selectedTooth.length; i++) {
            if (_marking === undefined) {
              _marking = { ...selectedTooth[i] };
            } else {
              _marking["distal"] =
                _marking["distal"] === "N"
                  ? selectedTooth[i]["distal"]
                  : _marking["distal"];
              _marking["labial"] =
                _marking["labial"] === "N"
                  ? selectedTooth[i]["labial"]
                  : _marking["labial"];
              _marking["incisal"] =
                _marking["incisal"] === "N"
                  ? selectedTooth[i]["incisal"]
                  : _marking["incisal"];
              _marking["palatal"] =
                _marking["palatal"] === "N"
                  ? selectedTooth[i]["palatal"]
                  : _marking["palatal"];
              _marking["mesial"] =
                _marking["mesial"] === "N"
                  ? selectedTooth[i]["mesial"]
                  : _marking["mesial"];
            }
          }
        }

        plot.push(
          <div
            key={i}
            className={
              "col tooth-sec up-side " +
              (i <= 3
                ? "molar-up-"
                : i <= 5
                ? "premolar-up-"
                : i === 6
                ? "canine-up-"
                : "incisors-up-up-") +
              i
            }
          >
            <span onClick={this.markAllSurface.bind(this)}>{tooth}</span>
            <div className="surface-Marking">
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "top-surface " +
                  (_marking !== undefined
                    ? _marking.distal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="distal">D</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "right-surface " +
                  (_marking !== undefined
                    ? _marking.labial === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="labial">L</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "bottom-surface " +
                  (_marking !== undefined
                    ? _marking.incisal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="incisal">I</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "left-surface " +
                  (_marking !== undefined
                    ? _marking.palatal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="palatal">P</span>
              </div>
              {i >= 6 ? null : (
                <div
                  onClick={this.markTeethSurface.bind(this)}
                  className={
                    "middle-surface " +
                    (_marking !== undefined
                      ? _marking.mesial === "Y" &&
                        _marking.service_id === this.state.hims_d_services_id
                        ? " mark-active"
                        : ""
                      : "")
                  }
                >
                  <span surface="mesial">M</span>
                </div>
              )}
            </div>
          </div>
        );
      }
    } else
      for (let i = 1; i < 9; i++) {
        {
          const tooth =
            i === 8
              ? 11
              : i === 7
              ? 12
              : i === 6
              ? 13
              : i === 5
              ? 14
              : i === 4
              ? 15
              : i === 3
              ? 16
              : i === 2
              ? 17
              : i === 1
              ? 18
              : null;
          let _marking = undefined;
          if (teeth !== undefined) {
            const selectedTooth = Enumerable.from(teeth)
              .where(w => w.teeth_number === tooth)
              .toArray();
            for (let i = 0; i < selectedTooth.length; i++) {
              if (_marking === undefined) {
                _marking = { ...selectedTooth[i] };
              } else {
                _marking["distal"] =
                  _marking["distal"] === "N"
                    ? selectedTooth[i]["distal"]
                    : _marking["distal"];
                _marking["labial"] =
                  _marking["labial"] === "N"
                    ? selectedTooth[i]["labial"]
                    : _marking["labial"];
                _marking["incisal"] =
                  _marking["incisal"] === "N"
                    ? selectedTooth[i]["incisal"]
                    : _marking["incisal"];
                _marking["palatal"] =
                  _marking["palatal"] === "N"
                    ? selectedTooth[i]["palatal"]
                    : _marking["palatal"];
                _marking["mesial"] =
                  _marking["mesial"] === "N"
                    ? selectedTooth[i]["mesial"]
                    : _marking["mesial"];
              }
            }
          }

          plot.push(
            <div
              key={i}
              className={
                "col tooth-sec up-side " +
                (i <= 3
                  ? "molar-up-"
                  : i <= 5
                  ? "premolar-up-"
                  : i === 6
                  ? "canine-up-"
                  : "incisors-up-up-") +
                i
              }
            >
              <span onClick={this.markAllSurface.bind(this)}>{tooth}</span>
              <div className="surface-Marking">
                <div
                  onClick={this.markTeethSurface.bind(this)}
                  className={
                    "top-surface " +
                    (_marking !== undefined
                      ? _marking.distal === "Y" &&
                        _marking.service_id === this.state.hims_d_services_id
                        ? " mark-active"
                        : ""
                      : "")
                  }
                >
                  <span surface="distal">D</span>
                </div>
                <div
                  onClick={this.markTeethSurface.bind(this)}
                  className={
                    "right-surface " +
                    (_marking !== undefined
                      ? _marking.labial === "Y" &&
                        _marking.service_id === this.state.hims_d_services_id
                        ? " mark-active"
                        : ""
                      : "")
                  }
                >
                  <span surface="labial">L</span>
                </div>
                <div
                  onClick={this.markTeethSurface.bind(this)}
                  className={
                    "bottom-surface " +
                    (_marking !== undefined
                      ? _marking.incisal === "Y" &&
                        _marking.service_id === this.state.hims_d_services_id
                        ? " mark-active"
                        : ""
                      : "")
                  }
                >
                  <span surface="incisal">I</span>
                </div>
                <div
                  onClick={this.markTeethSurface.bind(this)}
                  className={
                    "left-surface " +
                    (_marking !== undefined
                      ? _marking.palatal === "Y" &&
                        _marking.service_id === this.state.hims_d_services_id
                        ? " mark-active"
                        : ""
                      : "")
                  }
                >
                  <span surface="palatal">P</span>
                </div>
                {i >= 6 ? null : (
                  <div
                    onClick={this.markTeethSurface.bind(this)}
                    className={
                      "middle-surface " +
                      (_marking !== undefined
                        ? _marking.mesial === "Y" &&
                          _marking.service_id === this.state.hims_d_services_id
                          ? " mark-active"
                          : ""
                        : "")
                    }
                  >
                    <span surface="mesial">M</span>
                  </div>
                )}
              </div>
            </div>
          );
        }
      }
    return plot;
  }

  generateToothUpperLeft(teeth) {
    let plot = [];
    if (this.state.teeth_type === "D") {
      for (let i = 9; i < 14; i++) {
        const tooth =
          i === 9
            ? 61
            : i === 10
            ? 62
            : i === 11
            ? 63
            : i === 12
            ? 64
            : i === 13
            ? 65
            : null;
        let _marking = undefined;
        if (teeth !== undefined) {
          const selectedTooth = Enumerable.from(teeth)
            .where(w => w.teeth_number === tooth)
            .toArray();
          for (let i = 0; i < selectedTooth.length; i++) {
            if (_marking === undefined) {
              _marking = { ...selectedTooth[i] };
            } else {
              _marking["distal"] =
                _marking["distal"] === "N"
                  ? selectedTooth[i]["distal"]
                  : _marking["distal"];
              _marking["labial"] =
                _marking["labial"] === "N"
                  ? selectedTooth[i]["labial"]
                  : _marking["labial"];
              _marking["incisal"] =
                _marking["incisal"] === "N"
                  ? selectedTooth[i]["incisal"]
                  : _marking["incisal"];
              _marking["palatal"] =
                _marking["palatal"] === "N"
                  ? selectedTooth[i]["palatal"]
                  : _marking["palatal"];
              _marking["mesial"] =
                _marking["mesial"] === "N"
                  ? selectedTooth[i]["mesial"]
                  : _marking["mesial"];
            }
          }
        }
        // const _marking =
        //   teeth !== undefined
        //     ? Enumerable.from(teeth)
        //         .where(w => w.teeth_number === tooth)
        //         .firstOrDefault()
        //     : undefined;
        plot.push(
          <div
            key={i}
            className={
              "col tooth-sec up-side " +
              (i <= 10
                ? "incisors-up-up-"
                : i === 11
                ? "canine-up-"
                : i <= 13
                ? "premolar-up-"
                : "i molar-up-") +
              i
            }
          >
            <span onClick={this.markAllSurface.bind(this)}>{tooth}</span>
            <div className="surface-Marking">
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "top-surface " +
                  (_marking !== undefined
                    ? _marking.distal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="distal">D</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "right-surface" +
                  (_marking !== undefined
                    ? _marking.labial === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="labial">L</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "bottom-surface" +
                  (_marking !== undefined
                    ? _marking.incisal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="incisal">I</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "left-surface" +
                  (_marking !== undefined
                    ? _marking.palatal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="palatal">P</span>
              </div>
              {i >= 12 ? (
                <div
                  onClick={this.markTeethSurface.bind(this)}
                  className={
                    "middle-surface" +
                    (_marking !== undefined
                      ? _marking.mesial === "Y" &&
                        _marking.service_id === this.state.hims_d_services_id
                        ? " mark-active"
                        : ""
                      : "")
                  }
                >
                  <span surface="mesial">M</span>
                </div>
              ) : null}
            </div>
          </div>
        );
      }
    } else {
      for (let i = 9; i < 17; i++) {
        const tooth =
          i === 9
            ? 21
            : i === 10
            ? 22
            : i === 11
            ? 23
            : i === 12
            ? 24
            : i === 13
            ? 25
            : i === 14
            ? 26
            : i === 15
            ? 27
            : i === 16
            ? 28
            : null;
        let _marking = undefined;
        if (teeth !== undefined) {
          const selectedTooth = Enumerable.from(teeth)
            .where(w => w.teeth_number === tooth)
            .toArray();
          for (let i = 0; i < selectedTooth.length; i++) {
            if (_marking === undefined) {
              _marking = { ...selectedTooth[i] };
            } else {
              _marking["distal"] =
                _marking["distal"] === "N"
                  ? selectedTooth[i]["distal"]
                  : _marking["distal"];
              _marking["labial"] =
                _marking["labial"] === "N"
                  ? selectedTooth[i]["labial"]
                  : _marking["labial"];
              _marking["incisal"] =
                _marking["incisal"] === "N"
                  ? selectedTooth[i]["incisal"]
                  : _marking["incisal"];
              _marking["palatal"] =
                _marking["palatal"] === "N"
                  ? selectedTooth[i]["palatal"]
                  : _marking["palatal"];
              _marking["mesial"] =
                _marking["mesial"] === "N"
                  ? selectedTooth[i]["mesial"]
                  : _marking["mesial"];
            }
          }
        }
        // const _marking =
        //   teeth !== undefined
        //     ? Enumerable.from(teeth)
        //         .where(w => w.teeth_number === tooth)
        //         .firstOrDefault()
        //     : undefined;
        plot.push(
          <div
            key={i}
            className={
              "col tooth-sec up-side " +
              (i <= 10
                ? "incisors-up-up-"
                : i === 11
                ? "canine-up-"
                : i <= 13
                ? "premolar-up-"
                : "i molar-up-") +
              i
            }
          >
            <span onClick={this.markAllSurface.bind(this)}>{tooth}</span>
            <div className="surface-Marking">
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "top-surface " +
                  (_marking !== undefined
                    ? _marking.distal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="distal">D</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "right-surface" +
                  (_marking !== undefined
                    ? _marking.labial === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="labial">L</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "bottom-surface" +
                  (_marking !== undefined
                    ? _marking.incisal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="incisal">I</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "left-surface" +
                  (_marking !== undefined
                    ? _marking.palatal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="palatal">P</span>
              </div>
              {i >= 12 ? (
                <div
                  onClick={this.markTeethSurface.bind(this)}
                  className={
                    "middle-surface" +
                    (_marking !== undefined
                      ? _marking.mesial === "Y" &&
                        _marking.service_id === this.state.hims_d_services_id
                        ? " mark-active"
                        : ""
                      : "")
                  }
                >
                  <span surface="mesial">M</span>
                </div>
              ) : null}
            </div>
          </div>
        );
      }
    }
    return plot;
  }

  generateToothLowerRight(teeth) {
    let plot = [];
    let counter = 1;
    if (this.state.teeth_type === "D") {
      for (let i = 32; i >= 28; i--) {
        const tooth =
          i === 28
            ? 81
            : i === 29
            ? 82
            : i === 30
            ? 83
            : i === 31
            ? 84
            : i === 32
            ? 85
            : null;
        let _marking = undefined;
        if (teeth !== undefined) {
          const selectedTooth = Enumerable.from(teeth)
            .where(w => w.teeth_number === tooth)
            .toArray();
          for (let i = 0; i < selectedTooth.length; i++) {
            if (_marking === undefined) {
              _marking = { ...selectedTooth[i] };
            } else {
              _marking["distal"] =
                _marking["distal"] === "N"
                  ? selectedTooth[i]["distal"]
                  : _marking["distal"];
              _marking["labial"] =
                _marking["labial"] === "N"
                  ? selectedTooth[i]["labial"]
                  : _marking["labial"];
              _marking["incisal"] =
                _marking["incisal"] === "N"
                  ? selectedTooth[i]["incisal"]
                  : _marking["incisal"];
              _marking["palatal"] =
                _marking["palatal"] === "N"
                  ? selectedTooth[i]["palatal"]
                  : _marking["palatal"];
              _marking["mesial"] =
                _marking["mesial"] === "N"
                  ? selectedTooth[i]["mesial"]
                  : _marking["mesial"];
            }
          }
        }
        // const _marking =
        //   teeth !== undefined
        //     ? Enumerable.from(teeth)
        //         .where(w => w.teeth_number === i)
        //         .firstOrDefault()
        //     : undefined;

        plot.push(
          <div
            key={i}
            className={
              "col tooth-sec down-side " +
              (counter <= 3
                ? "molar-down-"
                : counter <= 5
                ? "premolar-down-"
                : counter === 6
                ? "canine-down-"
                : "incisors-down-") +
              counter
            }
          >
            <span onClick={this.markAllSurface.bind(this)}>{tooth}</span>
            <div className="surface-Marking">
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "top-surface " +
                  (_marking !== undefined
                    ? _marking.distal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="distal">D</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "right-surface" +
                  (_marking !== undefined
                    ? _marking.labial === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="labial">L</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "bottom-surface" +
                  (_marking !== undefined
                    ? _marking.incisal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="incisal">I</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "left-surface" +
                  (_marking !== undefined
                    ? _marking.palatal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="palatal">P</span>
              </div>
              {counter >= 6 ? null : (
                <div
                  onClick={this.markTeethSurface.bind(this)}
                  className={
                    "middle-surface" +
                    (_marking !== undefined
                      ? _marking.mesial === "Y" &&
                        _marking.service_id === this.state.hims_d_services_id
                        ? " mark-active"
                        : ""
                      : "")
                  }
                >
                  <span surface="mesial">M</span>
                </div>
              )}
            </div>
          </div>
        );
        counter++;
      }
    } else {
      for (let i = 32; i >= 25; i--) {
        const tooth =
          i === 25
            ? 41
            : i === 26
            ? 42
            : i === 27
            ? 43
            : i === 28
            ? 44
            : i === 29
            ? 45
            : i === 30
            ? 46
            : i === 31
            ? 47
            : i === 32
            ? 48
            : null;
        let _marking = undefined;
        if (teeth !== undefined) {
          const selectedTooth = Enumerable.from(teeth)
            .where(w => w.teeth_number === tooth)
            .toArray();
          for (let i = 0; i < selectedTooth.length; i++) {
            if (_marking === undefined) {
              _marking = { ...selectedTooth[i] };
            } else {
              _marking["distal"] =
                _marking["distal"] === "N"
                  ? selectedTooth[i]["distal"]
                  : _marking["distal"];
              _marking["labial"] =
                _marking["labial"] === "N"
                  ? selectedTooth[i]["labial"]
                  : _marking["labial"];
              _marking["incisal"] =
                _marking["incisal"] === "N"
                  ? selectedTooth[i]["incisal"]
                  : _marking["incisal"];
              _marking["palatal"] =
                _marking["palatal"] === "N"
                  ? selectedTooth[i]["palatal"]
                  : _marking["palatal"];
              _marking["mesial"] =
                _marking["mesial"] === "N"
                  ? selectedTooth[i]["mesial"]
                  : _marking["mesial"];
            }
          }
        }
        // const _marking =
        //   teeth !== undefined
        //     ? Enumerable.from(teeth)
        //         .where(w => w.teeth_number === i)
        //         .firstOrDefault()
        //     : undefined;

        plot.push(
          <div
            key={i}
            className={
              "col tooth-sec down-side " +
              (counter <= 3
                ? "molar-down-"
                : counter <= 5
                ? "premolar-down-"
                : counter === 6
                ? "canine-down-"
                : "incisors-down-") +
              counter
            }
          >
            <span onClick={this.markAllSurface.bind(this)}>{tooth}</span>
            <div className="surface-Marking">
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "top-surface " +
                  (_marking !== undefined
                    ? _marking.distal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="distal">D</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "right-surface" +
                  (_marking !== undefined
                    ? _marking.labial === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="labial">L</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "bottom-surface" +
                  (_marking !== undefined
                    ? _marking.incisal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="incisal">I</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "left-surface" +
                  (_marking !== undefined
                    ? _marking.palatal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="palatal">P</span>
              </div>
              {counter >= 6 ? null : (
                <div
                  onClick={this.markTeethSurface.bind(this)}
                  className={
                    "middle-surface" +
                    (_marking !== undefined
                      ? _marking.mesial === "Y" &&
                        _marking.service_id === this.state.hims_d_services_id
                        ? " mark-active"
                        : ""
                      : "")
                  }
                >
                  <span surface="mesial">M</span>
                </div>
              )}
            </div>
          </div>
        );
        counter++;
      }
    }
    return plot;
  }

  generateToothLowerLeft(teeth) {
    let plot = [];
    let counter = 9;
    if (this.state.teeth_type === "D") {
      for (let i = 24; i >= 20; i--) {
        const tooth =
          i === 24
            ? 71
            : i === 23
            ? 72
            : i === 22
            ? 73
            : i === 21
            ? 74
            : i === 20
            ? 75
            : null;
        let _marking = undefined;
        if (teeth !== undefined) {
          const selectedTooth = Enumerable.from(teeth)
            .where(w => w.teeth_number === tooth)
            .toArray();
          for (let i = 0; i < selectedTooth.length; i++) {
            if (_marking === undefined) {
              _marking = { ...selectedTooth[i] };
            } else {
              _marking["distal"] =
                _marking["distal"] === "N"
                  ? selectedTooth[i]["distal"]
                  : _marking["distal"];
              _marking["labial"] =
                _marking["labial"] === "N"
                  ? selectedTooth[i]["labial"]
                  : _marking["labial"];
              _marking["incisal"] =
                _marking["incisal"] === "N"
                  ? selectedTooth[i]["incisal"]
                  : _marking["incisal"];
              _marking["palatal"] =
                _marking["palatal"] === "N"
                  ? selectedTooth[i]["palatal"]
                  : _marking["palatal"];
              _marking["mesial"] =
                _marking["mesial"] === "N"
                  ? selectedTooth[i]["mesial"]
                  : _marking["mesial"];
            }
          }
        }
        // const _marking =
        //   teeth !== undefined
        //     ? Enumerable.from(teeth)
        //         .where(w => w.teeth_number === i)
        //         .firstOrDefault()
        //     : undefined;

        plot.push(
          <div
            key={i}
            className={
              "col tooth-sec down-side " +
              (counter <= 10
                ? "incisors-down-"
                : counter === 11
                ? "canine-down-"
                : counter < 14
                ? "premolar-down-"
                : "i molar-down-") +
              counter
            }
          >
            <span onClick={this.markAllSurface.bind(this)}>{tooth}</span>
            <div className="surface-Marking">
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "top-surface" +
                  (_marking !== undefined
                    ? _marking.distal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="distal">D</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "right-surface " +
                  (_marking !== undefined
                    ? _marking.labial === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="labial">L</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "bottom-surface " +
                  (_marking !== undefined
                    ? _marking.incisal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="incisal">I</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "left-surface " +
                  (_marking !== undefined
                    ? _marking.palatal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="palatal">P</span>
              </div>
              {i <= 21 ? (
                <div
                  onClick={this.markTeethSurface.bind(this)}
                  className={
                    "middle-surface " +
                    (_marking !== undefined
                      ? _marking.mesial === "Y" &&
                        _marking.service_id === this.state.hims_d_services_id
                        ? " mark-active"
                        : ""
                      : "")
                  }
                >
                  <span surface="mesial">M</span>
                </div>
              ) : null}
            </div>
          </div>
        );
        counter++;
      }
    } else {
      for (let i = 24; i >= 17; i--) {
        const tooth =
          i === 24
            ? 31
            : i === 23
            ? 32
            : i === 22
            ? 33
            : i === 21
            ? 34
            : i === 20
            ? 35
            : i === 19
            ? 36
            : i === 18
            ? 37
            : i === 17
            ? 38
            : null;
        let _marking = undefined;
        if (teeth !== undefined) {
          const selectedTooth = Enumerable.from(teeth)
            .where(w => w.teeth_number === tooth)
            .toArray();
          for (let i = 0; i < selectedTooth.length; i++) {
            if (_marking === undefined) {
              _marking = { ...selectedTooth[i] };
            } else {
              _marking["distal"] =
                _marking["distal"] === "N"
                  ? selectedTooth[i]["distal"]
                  : _marking["distal"];
              _marking["labial"] =
                _marking["labial"] === "N"
                  ? selectedTooth[i]["labial"]
                  : _marking["labial"];
              _marking["incisal"] =
                _marking["incisal"] === "N"
                  ? selectedTooth[i]["incisal"]
                  : _marking["incisal"];
              _marking["palatal"] =
                _marking["palatal"] === "N"
                  ? selectedTooth[i]["palatal"]
                  : _marking["palatal"];
              _marking["mesial"] =
                _marking["mesial"] === "N"
                  ? selectedTooth[i]["mesial"]
                  : _marking["mesial"];
            }
          }
        }
        // const _marking =
        //   teeth !== undefined
        //     ? Enumerable.from(teeth)
        //         .where(w => w.teeth_number === i)
        //         .firstOrDefault()
        //     : undefined;

        plot.push(
          <div
            key={i}
            className={
              "col tooth-sec down-side " +
              (counter <= 10
                ? "incisors-down-"
                : counter === 11
                ? "canine-down-"
                : counter < 14
                ? "premolar-down-"
                : "i molar-down-") +
              counter
            }
          >
            <span onClick={this.markAllSurface.bind(this)}>{tooth}</span>
            <div className="surface-Marking">
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "top-surface" +
                  (_marking !== undefined
                    ? _marking.distal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="distal">D</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "right-surface " +
                  (_marking !== undefined
                    ? _marking.labial === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="labial">L</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "bottom-surface " +
                  (_marking !== undefined
                    ? _marking.incisal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="incisal">I</span>
              </div>
              <div
                onClick={this.markTeethSurface.bind(this)}
                className={
                  "left-surface " +
                  (_marking !== undefined
                    ? _marking.palatal === "Y" &&
                      _marking.service_id === this.state.hims_d_services_id
                      ? " mark-active"
                      : ""
                    : "")
                }
              >
                <span surface="palatal">P</span>
              </div>
              {i <= 21 ? (
                <div
                  onClick={this.markTeethSurface.bind(this)}
                  className={
                    "middle-surface " +
                    (_marking !== undefined
                      ? _marking.mesial === "Y" &&
                        _marking.service_id === this.state.hims_d_services_id
                        ? " mark-active"
                        : ""
                      : "")
                  }
                >
                  <span surface="mesial">M</span>
                </div>
              ) : null}
            </div>
          </div>
        );
        counter++;
      }
    }
    return plot;
  }

  deleteDentalPlan(data) {
    swal({
      title: "Delete Plan ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        debugger;
        algaehApiCall({
          uri: "/dental/deleteDentalPlan",
          data: {
            hims_f_dental_treatment_id: data.hims_f_dental_treatment_id
          },
          method: "DELETE",
          onSuccess: res => {
            if (res.data.success) {
              debugger;

              let inputData = {
                hims_f_treatment_plan_id: this.state.hims_f_treatment_plan_id,
                approve_status: this.state.approval_status,
                plan_name: this.state.selected_plan
              };
              this.loadDentalTreatment(inputData);
              swalMessage({
                title: "Record Deleted",
                type: "success"
              });
            }
          },
          onError: err => {
            swalMessage({
              title: err.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Request Cancelled",
          type: "error"
        });
      }
    });
  }

  updateDentalTreatmentStatus(data) {
    algaehApiCall({
      uri: "/dental/updateDentalTreatmentStatus",
      method: "PUT",
      data: {
        hims_f_dental_treatment_id: data.hims_f_dental_treatment_id,
        treatment_status: data.treatment_status,
        treatment_plan_id: data.treatment_plan_id
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record Updated",
            type: "success"
          });
          let inputData = {
            hims_f_treatment_plan_id: this.state.hims_f_treatment_plan_id,
            approve_status: this.state.approval_status,
            plan_name: this.state.selected_plan
          };
          this.loadDentalTreatment(inputData);
          this.getTreatementPlans();
        }
      },
      onError: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  getTreatementsGrid(data) {
    return (
      <div className="col-lg-12" data-validate="denGrid">
        <AlgaehDataGrid
          id="grid_dental_treatment"
          datavalidate="data-validate='denGrid'"
          columns={[
            {
              fieldName: "teeth_number",
              label: "Tooth",
              disabled: true
            },
            {
              fieldName: "distal",
              label: "Surfaces",
              displayTemplate: row => {
                return (
                  <span>
                    {row.distal === "Y" ? "D " : ""}
                    {row.incisal === "Y" ? "I " : ""}
                    {row.mesial === "Y" ? "M " : ""}
                    {row.palatal === "Y" ? "P " : ""}
                    {row.labial === "Y" ? "L " : ""}
                  </span>
                );
              },
              editorTemplate: row => {
                return (
                  <span>
                    {row.distal === "Y" ? "D " : ""}
                    {row.incisal === "Y" ? "I " : ""}
                    {row.mesial === "Y" ? "M " : ""}
                    {row.palatal === "Y" ? "P " : ""}
                    {row.labial === "Y" ? "L " : ""}
                  </span>
                );
              }
            },
            {
              fieldName: "service_id",
              label: "Procedure",
              displayTemplate: row => {
                let x = Enumerable.from(this.state.procedures)
                  .where(w => w.hims_d_services_id === row.service_id)
                  .firstOrDefault();
                return (
                  <span>{x !== undefined ? x.service_name : "----------"}</span>
                );
              },
              editorTemplate: row => {
                let x = Enumerable.from(this.state.procedures)
                  .where(w => w.hims_d_services_id === row.service_id)
                  .firstOrDefault();
                return (
                  <span>{x !== undefined ? x.service_name : "----------"}</span>
                );
              }
            },
            {
              fieldName: "scheduled_date",
              label: "Date",
              displayTemplate: row => {
                return (
                  <span>{moment(row.scheduled_date).format("DD-MM-YYYY")}</span>
                );
              },
              editorTemplate: row => {
                return (
                  <span>{moment(row.scheduled_date).format("DD-MM-YYYY")}</span>
                );
              }
            },
            {
              fieldName: "treatment_status",
              label: "Status",
              displayTemplate: row => {
                return (
                  <span>
                    {row.treatment_status === "PL"
                      ? "Planned"
                      : row.treatment_status === "WIP"
                      ? "Work in Progress"
                      : row.treatment_status === "CP"
                      ? "Completed"
                      : null}
                  </span>
                );
              },
              editorTemplate: row => {
                return (
                  <AlagehAutoComplete
                    selector={{
                      name: "treatment_status",
                      className: "select-fld",
                      value: row.treatment_status,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.DENTAL_TREATMENT_STATUS
                      },
                      others: {
                        errormessage: "Status - cannot be blank",
                        required: true
                      },
                      onChange: this.changeGridEditors.bind(this, row)
                    }}
                  />
                );
              }
            },
            {
              fieldName: "billed",
              label: "Add To Bill",
              displayTemplate: row => {
                return row.billed === "N" ? (
                  <button
                    onClick={this.addToBill.bind(this, row)}
                    className="btn btn-primary"
                  >
                    Add To Bill
                  </button>
                ) : row.billed === "SB" ? (
                  <span>Sent to Billing</span>
                ) : row.billed === "Y" ? (
                  <span>Paid</span>
                ) : null;
              },
              editorTemplate: row => {
                return row.billed === "N" ? (
                  <button
                    onClick={this.addToBill.bind(this, row)}
                    className="btn btn-primary"
                  >
                    Add To Bill
                  </button>
                ) : row.billed === "SB" ? (
                  <span>Sent to Billing</span>
                ) : row.billed === "Y" ? (
                  <span>Paid</span>
                ) : null;
              }
            }
          ]}
          keyId="algaeh_app_screens_id"
          uiUpdate={this.state.treatment_gridUpdate}
          dataSource={{
            pageInputExclude: true,
            uri: "/dental/getDentalTreatment",
            inputParam: { treatment_plan_id: data.hims_f_treatment_plan_id },
            method: "GET",
            responseSchema: { data: "records" }
            // data: [] //this.state.dentalTreatments
          }}
          paging={{ page: 0, rowsPerPage: 5 }}
          isEditable={true}
          events={{
            onEdit: () => {},
            onDelete: this.deleteDentalPlan,
            onDone: this.updateDentalTreatmentStatus
          }}
        />
      </div>
    );
  }

  loadDentalTreatment(data) {
    debugger;
    data !== undefined
      ? this.setState(
          {
            hims_f_treatment_plan_id: data.hims_f_treatment_plan_id
          },
          () => {
            algaehApiCall({
              uri: "/dental/getDentalTreatment",
              method: "GET",
              data: {
                treatment_plan_id: this.state.hims_f_treatment_plan_id
              },
              onSuccess: response => {
                if (response.data.success) {
                  debugger;
                  this.setState({
                    dentalTreatments: response.data.records,
                    selected_plan: data.plan_name,
                    approval_status: data.approve_status
                  });
                }
              },
              onError: error => {}
            });
          }
        )
      : algaehApiCall({
          uri: "/dental/getDentalTreatment",
          method: "GET",
          data: {
            treatment_plan_id: this.state.hims_f_treatment_plan_id
          },
          onSuccess: response => {
            if (response.data.success) {
              this.setState({
                dentalTreatments: response.data.records,
                approval_status: data.approve_status
              });
            }
          },
          onError: error => {}
        });
  }

  openAddModal(data) {
    this.setState(
      {
        openDentalModal: true,
        selected_treatement_plan: data.plan_name,
        hims_f_treatment_plan_id: data.hims_f_treatment_plan_id,
        treatment_gridUpdate: false
      },
      () => {
        algaehApiCall({
          uri: "/dental/getDentalTreatment",
          method: "GET",
          data: { treatment_plan_id: this.state.hims_f_treatment_plan_id },
          onSuccess: response => {
            if (response.data.success) {
              this.setState({
                highlightTeeth: response.data.records
              });
            }
          },
          onError: error => {}
        });
      }
    );
  }
  onClose = e => {
    this.setState({ openBillingModal: false });
  };
  onClickSaveDentalForm(e) {
    const patientDetails = Window.global;
    let dentalFormObject = {
      patient_id: patientDetails.current_patient,
      visit_id: patientDetails.visit_id,
      provider_id: patientDetails.provider_id,
      episode: patientDetails.episode_id,
      due_date: this.state.due_date
    };
    const allCheckList = this.checList.querySelectorAll("[type='checkbox']");
    for (let i = 0; i < allCheckList.length; i++) {
      const element = allCheckList[i];
      dentalFormObject[element["name"]] =
        element["checked"] === true ? "Y" : "N";
    }
    const that = this;
    this.setState(
      {
        dental_form_loading: true
      },
      () => {
        algaehApiCall({
          uri: "/dentalForm/addDentalForm",
          method: "POST",
          data: dentalFormObject,
          onSuccess: response => {
            if (response.data.success) {
              that.setState({
                dental_form_loading: false
              });
              swalMessage({
                title: "Updated successfully",
                type: "success"
              });
            } else {
              that.setState({
                dental_form_loading: false
              });
              swalMessage({
                title: response.data.message,
                type: "error"
              });
            }
          },
          onCatch: err => {
            that.setState({
              dental_form_loading: false
            });
          }
        });
      }
    );
  }
  render() {
    let billDetails = this.state.billDetails;
    let child_dental_chart = this.state.teeth_type === "D" ? "childchart" : "";
    return (
      <div id="dentalTreatment">
        <AlgaehModalPopUp
          openPopup={this.state.openBillingModal}
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Bill Service"
        >
          <div
            className="col-lg-12 margin-bottom-15 popupInner"
            data-validate="billDentalPlan"
          >
            <div className="row margin-top-15">
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "service_type_id",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "treatement_plan",
                  value: billDetails.service_name,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  others: {
                    disabled: true,
                    placeholder: "Enter Treatment Name"
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Select Procedure",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "treatement_plan",
                  value: billDetails.service_name,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  others: {
                    disabled: true,
                    placeholder: "Enter Treatment Name"
                  }
                }}
              />
            </div>
            <hr />
            {/* Amount Details */}
            <div className="row">
              <div className="col-lg-2">
                <AlgaehLabel
                  label={{
                    fieldName: "quantity"
                  }}
                />
                <h6>1</h6>
              </div>

              <div className="col-lg-2">
                <AlgaehLabel
                  label={{
                    fieldName: "unit_cost"
                  }}
                />
                <h6>{getAmountFormart(billDetails.unit_cost)}</h6>
              </div>

              <div className="col-lg-2">
                <AlgaehLabel
                  label={{
                    fieldName: "gross_amount"
                  }}
                />
                <h6>{getAmountFormart(billDetails.gross_amount)}</h6>
              </div>

              <div className="col-lg-2">
                <AlgaehLabel
                  label={{
                    fieldName: "discount_percentage"
                  }}
                />
                {/* <h6>
                  {billDetails.discount_percentage
                    ? billDetails.discount_percentage + "%"
                    : "0.00%"}
                </h6> */}

                <AlagehFormGroup
                  // div={{ className: "col" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    className: "txt-fld",
                    name: "discount_percentage",
                    value: this.state.discount_percentage,
                    events: {
                      onChange: this.calculateDiscount.bind(this)
                    },
                    others: {
                      placeholder: "0.00"
                    }
                  }}
                />
              </div>

              <div className="col-lg-2">
                <AlgaehLabel
                  label={{
                    fieldName: "discount_amout"
                  }}
                />
                <h6>{getAmountFormart(billDetails.discount_amout)}</h6>
              </div>

              <div className="col-lg-2">
                <AlgaehLabel
                  label={{
                    fieldName: "net_amout"
                  }}
                />
                <h6>{getAmountFormart(billDetails.net_amout)}</h6>
              </div>
            </div>
            <hr />
            {/* Insurance Details */}
            <div className="row">
              <div className="col-4">
                <b>
                  <u>
                    <AlgaehLabel
                      label={{
                        forceLabel: "Insurance Detailed Breakup",
                        returnText: true
                      }}
                    />
                  </u>
                </b>
                <div className="Paper">
                  <div className="row insurance-details">
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          fieldName: "copay_percentage"
                        }}
                      />
                      <h6>
                        {billDetails.copay_percentage
                          ? billDetails.copay_percentage + "%"
                          : "0.00%"}
                      </h6>
                    </div>

                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          fieldName: "copay_amount"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.copay_amount)}</h6>
                    </div>

                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          fieldName: "deductable_percentage"
                        }}
                      />
                      <h6>
                        {billDetails.deductable_percentage
                          ? billDetails.deductable_percentage + "%"
                          : "0.00%"}
                      </h6>
                    </div>

                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          fieldName: "deductable_amount"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.deductable_amount)}</h6>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-4"
                style={{
                  borderLeft: "1px solid #ccc",
                  borderRight: "1px solid #ccc"
                }}
              >
                <b>
                  <u>
                    <AlgaehLabel
                      label={{
                        forceLabel: "Patient Responsibility",
                        returnText: true
                      }}
                    />
                  </u>
                </b>
                <div className="Paper">
                  <div className="row insurance-details">
                    <div className="col-7">
                      <AlgaehLabel
                        label={{
                          fieldName: "gross_amount"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.patient_resp)}</h6>
                    </div>

                    <div className="col-5">
                      <AlgaehLabel
                        label={{
                          fieldName: "tax_lbl"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.patient_tax)}</h6>
                    </div>

                    <div className="col-12">
                      <AlgaehLabel
                        label={{
                          fieldName: "payable_lbl"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.patient_payable)}</h6>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-4">
                <b>
                  <u>
                    <AlgaehLabel
                      label={{
                        forceLabel: "Company Responsibility",
                        returnText: true
                      }}
                    />
                  </u>
                </b>
                <div className="Paper">
                  <div className="row insurance-details">
                    <div className="col-7">
                      <AlgaehLabel
                        label={{
                          fieldName: "gross_amount"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.comapany_resp)}</h6>
                    </div>

                    <div className="col-5">
                      <AlgaehLabel
                        label={{
                          fieldName: "tax_lbl"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.company_tax)}</h6>
                    </div>

                    <div className="col-12">
                      <AlgaehLabel
                        label={{
                          fieldName: "payable_lbl"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.company_payble)}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4"> &nbsp;</div>
                <div className="col-lg-8">
                  <button
                    onClick={this.saveBill.bind(this)}
                    className="btn btn-primary"
                  >
                    Send for Billing
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
        {/* For Adult */}
        <AlgaehModalPopUp
          events={{
            onClose: () => {
              teeth = [];
              my_send_obj = {};
              this.setState({
                treatment_gridUpdate: true,
                openDentalModal: false,
                hims_d_services_id: null,
                quantity: 0,
                standard_fee: 0,
                total_price: 0,
                approval_status: "N"
              });
            }
          }}
          openPopup={this.state.openDentalModal}
          title="Dental Plan"
        >
          <div className="popupInner" data-validate="addDentalPlanDiv">
            <div className="col-12">
              <div className="row">
                <div className="col-12 popRightDiv">
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-3" }}
                      label={{
                        fieldName: "treatment_plan",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "treatement_plan",
                        value: this.state.selected_treatement_plan,
                        events: {
                          onChange: this.textHandle.bind(this)
                        },
                        others: {
                          disabled: true,
                          placeholder: "Enter Treatment Name"
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-2" }}
                      label={{
                        fieldName: "sel_a_proc",
                        isImp: true
                      }}
                      selector={{
                        name: "hims_d_services_id",
                        className: "select-fld",
                        value: this.state.hims_d_services_id,
                        dataSource: {
                          textField: "service_name",
                          valueField: "hims_d_services_id",
                          data: this.state.procedures
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            hims_d_services_id: "",
                            standard_fee: 0
                          });
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        fieldName: "unit_cost",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "standard_fee",
                        value: this.state.standard_fee,
                        events: {
                          onChange: this.textHandle.bind(this)
                        },
                        others: {
                          disabled: true,
                          min: 0,
                          type: "number"
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        fieldName: "quantity",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "quantity",
                        value: this.state.quantity,
                        events: {
                          onChange: this.textHandle.bind(this)
                        },
                        others: {
                          disabled: true,
                          min: 0,
                          type: "number"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        fieldName: "total_price",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "total_price",
                        value: this.state.total_price,
                        events: {
                          onChange: this.textHandle.bind(this)
                        },
                        others: {
                          disabled: true,
                          min: 0,
                          type: "number"
                        }
                      }}
                    />

                    <AlgaehDateHandler
                      div={{ className: "col" }}
                      label={{ fieldName: "schld_date", isImp: false }}
                      textBox={{
                        className: "txt-fld",
                        name: "scheduled_date"
                      }}
                      minDate={new Date()}
                      events={{
                        onChange: selectedDate => {
                          this.setState({
                            scheduled_date: selectedDate
                          });
                        }
                      }}
                      value={this.state.scheduled_date}
                    />
                  </div>
                  <div
                    className="col-6 customRadio"
                    style={{ paddingTop: 24, borderBottom: "none" }}
                  >
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="teeth_type"
                        value="P"
                        checked={this.state.teeth_type === "P" ? true : false}
                        onChange={this.radioChange.bind(this)}
                      />
                      <span>Permanent</span>
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="teeth_type"
                        value="D"
                        checked={this.state.teeth_type === "D" ? true : false}
                        onChange={this.radioChange.bind(this)}
                      />
                      <span>Deciduous</span>
                    </label>
                  </div>
                  <hr />
                  <div
                    className={"col-lg-12 " + child_dental_chart}
                    id="dentalTreatment"
                  >
                    <div className="row top-teeth-sec">
                      <div className="col-lg-6 teeth-sec">
                        <h6>Upper Right</h6>
                        <div className="row">
                          {this.generateToothUpperRight(
                            this.state.highlightTeeth
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 teeth-sec">
                        <h6>Upper Left</h6>
                        <div className="row">
                          {this.generateToothUpperLeft(
                            this.state.highlightTeeth
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row bottom-teeth-sec">
                      <div className="col-lg-6 teeth-sec">
                        <div className="row">
                          {this.generateToothLowerRight(
                            this.state.highlightTeeth
                          )}
                        </div>
                        <h6>Lower Right</h6>
                      </div>
                      <div className="col-lg-6 teeth-sec">
                        <div className="row">
                          {this.generateToothLowerLeft(
                            this.state.highlightTeeth
                          )}
                        </div>
                        <h6>Lower Left</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="popupFooter">
            <div className="col-lg-12 margin-bottom-15">
              <ButtonType
                others={{ style: { float: "right" } }}
                classname="btn-primary"
                onClick={this.addDentalPlan.bind(this, this)}
                label={{
                  forceLabel: "Add to List",
                  returnText: true
                }}
              />
            </div>
          </div>
        </AlgaehModalPopUp>

        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title" data-validate="addTreatementDiv">
            <div className="row margin-bottom-15">
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "treatment_plan",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "plan_name",
                  value: this.state.plan_name,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  others: {
                    placeholder: "Enter Treatment Name"
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-4" }}
                label={{
                  fieldName: "remarks",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "remarks",
                  value: this.state.remarks,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  others: {
                    placeholder: "Enter Remarks"
                  }
                }}
              />

              {/* <AlgaehDateHandler
                  div={{ className: "col-lg-2" }}
                  label={{ fieldName: "Consult Date", isImp: false }}
                  textBox={{
                    className: "txt-fld",
                    name: "consult_date"
                  }}
                  minDate={new Date()}
                  events={{
                    onChange: selectedDate => {
                      this.setState({
                        consult_date: selectedDate
                      });
                    }
                  }}
                  value={this.state.consult_date}
                /> */}

              <div className="col-lg-2" style={{ marginTop: 19 }}>
                <ButtonType
                  classname="btn-primary"
                  onClick={this.addTreatementPlan.bind(this, this)}
                  label={{
                    forceLabel: "Add Plan",
                    returnText: true
                  }}
                />
                {/*<button
                  onClick={this.addTreatementPlan.bind(this)}
                  className="btn btn-primary"
                >
                  Add Plan
                </button>*/}
              </div>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-12">
                <h6 style={{ marginBottom: 0 }}>Treatment Plan</h6>
              </div>
              <div
                className="col-12"
                data-validate="treatmentDiv"
                id="treatmentGridCntr"
              >
                <AlgaehDataGrid
                  id="treatment-grid"
                  datavalidate="data-validate='treatmentDiv'"
                  columns={[
                    {
                      fieldName: "actions",
                      label: <AlgaehLabel label={{ forceLabel: "Actions" }} />,
                      displayTemplate: row => {
                        const isDisable =
                          this.state.hims_f_treatment_plan_id ===
                          row.hims_f_treatment_plan_id
                            ? false
                            : true;
                        return (
                          <div className="row">
                            <span className="col">
                              <i
                                onClick={this.approveTreatementPlan.bind(
                                  this,
                                  row,
                                  "Y"
                                )}
                                className="fas fa-check"
                                style={{
                                  pointerEvents:
                                    row.approve_status === "Y" || isDisable
                                      ? " none"
                                      : null,
                                  opacity:
                                    row.approve_status === "Y" ? "0.1" : null
                                }}
                              />

                              <i
                                onClick={this.approveTreatementPlan.bind(
                                  this,
                                  row,
                                  "C"
                                )}
                                style={{
                                  pointerEvents:
                                    row.approve_status === "Y" || isDisable
                                      ? " none"
                                      : null,
                                  opacity:
                                    row.approve_status === "Y" ? "0.1" : null
                                }}
                                className="fas fa-times"
                              />

                              <i
                                onClick={this.openAddModal.bind(this, row)}
                                className="fas fa-plus"
                              />
                            </span>
                          </div>
                        );
                      },
                      others: {
                        width: 130
                      }
                    },
                    {
                      fieldName: "plan_name",

                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Treatement Plan" }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span
                            className="pat-code"
                            onClick={() => {
                              this.loadDentalTreatment(row);
                            }}
                          >
                            {row.plan_name}
                          </span>
                        );
                      },
                      className: row => {
                        return "greenCell";
                      },
                      others: {
                        width: 150
                      }
                    },
                    {
                      fieldName: "remarks",

                      label: <AlgaehLabel label={{ forceLabel: "Remarks" }} />,

                      disabled: true,
                      others: {
                        width: 250
                      }
                    },
                    {
                      fieldName: "approve_status",

                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Approval Status" }}
                        />
                      ),

                      displayTemplate: row => {
                        return (
                          <span>
                            {row.approve_status === "Y"
                              ? "Plan Approved"
                              : "Plan Not Approved"}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "plan_status",

                      label: (
                        <AlgaehLabel label={{ forceLabel: "Plan Status" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {row.plan_status === "O"
                              ? "Open"
                              : row.plan_status === "C"
                              ? "Closed"
                              : null}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "consult_date",

                      label: <AlgaehLabel label={{ forceLabel: "Date" }} />
                    }
                  ]}
                  keyId="algaeh_app_screens_id"
                  dataSource={{
                    data: this.state.treatements
                  }}
                  filter={false}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  // expanded={{
                  //   detailTemplate: row => {
                  //     return <div>{this.getTreatementsGrid(row)}</div>;
                  //   }
                  // }}
                  events={{
                    onEdit: () => {},
                    onDelete: () => {},
                    onDone: () => {}
                  }}
                />
              </div>
              <div className="col-12 margin-top-15">
                <h6 style={{ marginBottom: 0 }}>
                  Selected Treatement: {this.state.selected_plan}
                </h6>
              </div>

              <div
                className="col-12"
                data-validate="denGrid"
                id="toothGridCntr"
              >
                <AlgaehDataGrid
                  id="grid_dental_treatment"
                  datavalidate="data-validate='denGrid'"
                  columns={[
                    {
                      fieldName: "teeth_number",
                      label: "Tooth",
                      disabled: true
                    },
                    {
                      fieldName: "distal",
                      label: "Surfaces",
                      displayTemplate: row => {
                        return (
                          <span>
                            {row.distal === "Y" ? "D " : ""}
                            {row.incisal === "Y" ? "I " : ""}
                            {row.mesial === "Y" ? "M " : ""}
                            {row.palatal === "Y" ? "P " : ""}
                            {row.labial === "Y" ? "L " : ""}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>
                            {row.distal === "Y" ? "D " : ""}
                            {row.incisal === "Y" ? "I " : ""}
                            {row.mesial === "Y" ? "M " : ""}
                            {row.palatal === "Y" ? "P " : ""}
                            {row.labial === "Y" ? "L " : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "service_id",
                      label: "Procedure",
                      displayTemplate: row => {
                        let x = Enumerable.from(this.state.procedures)
                          .where(w => w.hims_d_services_id === row.service_id)
                          .firstOrDefault();
                        return (
                          <span>
                            {x !== undefined ? x.service_name : "----------"}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        let x = Enumerable.from(this.state.procedures)
                          .where(w => w.hims_d_services_id === row.service_id)
                          .firstOrDefault();
                        return (
                          <span>
                            {x !== undefined ? x.service_name : "----------"}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "scheduled_date",
                      label: "Date",
                      displayTemplate: row => {
                        return (
                          <span>
                            {moment(row.scheduled_date).format("DD-MM-YYYY")}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>
                            {moment(row.scheduled_date).format("DD-MM-YYYY")}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "treatment_status",
                      label: "Status",
                      displayTemplate: row => {
                        return (
                          <span>
                            {row.treatment_status === "PL"
                              ? "Planned"
                              : row.treatment_status === "WIP"
                              ? "Work in Progress"
                              : row.treatment_status === "CP"
                              ? "Completed"
                              : null}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehAutoComplete
                            selector={{
                              name: "treatment_status",
                              className: "select-fld",
                              value: row.treatment_status,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.DENTAL_TREATMENT_STATUS
                              },
                              others: {
                                errormessage: "Status - cannot be blank",
                                required: true
                              },
                              onChange: this.changeGridEditors.bind(this, row)
                            }}
                          />
                        );
                      }
                    },
                    {
                      fieldName: "billed",
                      label: "Billing",
                      displayTemplate: row => {
                        return row.billed === "N" ? (
                          <button
                            onClick={this.addToBill.bind(this, row)}
                            className="btn btn-primary"
                          >
                            View Bill &amp; Send
                          </button>
                        ) : row.billed === "SB" ? (
                          <span>Billing in Progress</span>
                        ) : row.billed === "Y" ? (
                          <span>Billed</span>
                        ) : null;
                      },
                      editorTemplate: row => {
                        return row.billed === "N" ? (
                          <button
                            onClick={this.addToBill.bind(this, row)}
                            className="btn btn-primary"
                          >
                            View Bill &amp; Send
                          </button>
                        ) : row.billed === "SB" ? (
                          <span>Billing in Progress</span>
                        ) : row.billed === "Y" ? (
                          <span>Billed</span>
                        ) : null;
                      }
                    }
                  ]}
                  keyId="algaeh_app_screens_id"
                  dataSource={{
                    data: this.state.dentalTreatments
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  isEditable={true}
                  events={{
                    onEdit: () => {},
                    onDelete: row => {
                      const status =
                        row.treatment_status === "PL"
                          ? "Planned"
                          : row.treatment_status === "WIP"
                          ? "Work in Progress"
                          : row.treatment_status === "CP"
                          ? "Completed"
                          : "";
                      row.billed === "SB" || row.billed === "Y"
                        ? swalMessage({
                            title: `Treatment is in ${status}, cannot delete`,
                            type: "warning"
                          })
                        : this.deleteDentalPlan(row);
                    },
                    onDone: this.updateDentalTreatmentStatus
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 margin-top-15">
          <div
            className="row"
            ref={c => {
              this.checList = c;
            }}
          >
            <div className="col portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="col">
                  <div className="row">
                    <div className="col algaehLabelFormGroup">
                      <label className="algaehLabelGroup">All Ceramic</label>
                      <div className="row">
                        <div className="col">
                          {/* <label>Working Days</label> */}
                          <div className="customCheckbox">
                            <label className="checkbox block">
                              <input type="checkbox" name="bruxzir_anterior" />
                              <span>BruxZir - Anterior</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="ips_e_max" />
                              <span>IPS E.max</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="lava" />
                              <span>Lava</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="lumineers" />
                              <span>Lumineers</span>
                            </label>
                            <label className="checkbox block">
                              <input
                                type="checkbox"
                                name="zirconia_e_max_layered"
                              />
                              <span>Zirconia E.Max Layered</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="bruxzir" />
                              <span>BruxZir</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col algaehLabelFormGroup">
                      <label className="algaehLabelGroup">PFM</label>
                      <div className="row">
                        <div className="col">
                          {/* <label>Working Days</label> */}
                          <div className="customCheckbox">
                            <label className="checkbox block">
                              <input type="checkbox" name="nobel" />
                              <span>Noble</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="white_high_nobel" />
                              <span>White High Noble</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="non_precious" />
                              <span>Non- Precious</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col algaehLabelFormGroup">
                      <label className="algaehLabelGroup">Partial</label>
                      <div className="row">
                        <div className="col">
                          {/* <label>Working Days</label> */}
                          <div className="customCheckbox">
                            <label className="checkbox block">
                              <input type="checkbox" name="titanium" />
                              <span>Titanium</span>
                            </label>
                            <label className="checkbox block">
                              <input
                                type="checkbox"
                                name="zirconia_w_ti_base"
                              />
                              <span>Zirconia w/Ti-Base</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="biomet_3i_encode" />
                              <span>Biomet 3i Encode</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="screw_retained" />
                              <span>Screw Retained</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="flexi" />
                              <span>Felxi</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col algaehLabelFormGroup">
                      <label className="algaehLabelGroup">
                        Custom Abutments
                      </label>
                      <div className="row">
                        <div className="col">
                          {/* <label>Working Days</label> */}
                          <div className="customCheckbox">
                            <label className="checkbox block">
                              <input type="checkbox" name="analog" />
                              <span>Analog</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="models" />
                              <span>Models</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="implant_parts" />
                              <span>Implant Parts</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="impression" />
                              <span>Impression</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="bite" />
                              <span>Bite</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="shade_tab" />
                              <span>Shade Tab</span>
                            </label>{" "}
                            <label className="checkbox block">
                              <input type="checkbox" name="others" />
                              <span>Others</span>
                            </label>{" "}
                            <label className="checkbox block">
                              <input type="checkbox" name="photos" />
                              <span>Photos</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col algaehLabelFormGroup">
                      <label className="algaehLabelGroup">Temp</label>
                      <div className="row">
                        <div className="col">
                          {/* <label>Working Days</label> */}
                          <div className="customCheckbox">
                            <label className="checkbox block">
                              <input type="checkbox" name="pmma" />
                              <span>PMMA</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col algaehLabelFormGroup">
                      <label className="algaehLabelGroup">
                        Enclosure (Lab Use Only)
                      </label>
                      <div className="row">
                        <div className="col">
                          {/* <label>Working Days</label> */}
                          <div className="customCheckbox">
                            <label className="checkbox block">
                              <input type="checkbox" name="bags" />
                              <span>Bags</span>
                            </label>
                            <label className="checkbox block">
                              <input type="checkbox" name="rx_forms" />
                              <span>RX Forms</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col algaehLabelFormGroup">
                      <label className="algaehLabelGroup">Due Date</label>
                      <div className="row">
                        <AlgaehDateHandler
                          div={{ className: "col form-group" }}
                          label={{ forceLabel: "Due Date", isImp: false }}
                          textBox={{
                            className: "txt-fld",
                            name: "due_date"
                          }}
                          value={this.state.due_date}
                          minDate={new Date()}
                          events={{
                            onChange: selectedDate => {
                              this.setState({
                                due_date: selectedDate
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-12 algaehLabelFormGroup">
                      <label className="algaehLabelGroup">Dental Diagram</label>
                      <div className="row">
                        <img src="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <ButtonType
              label={{
                forceLabel: "Save",
                returnText: true
              }}
              className="btn-primary"
              onClick={this.onClickSaveDentalForm.bind(this)}
              others={{ style: { marginLeft: 10, float: "right" } }}
              loading={this.state.dental_form_loading}
            />

            <button className="btn btn-default" style={{ float: "right" }}>
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_summary: state.patient_summary,
    patient_profile: state.patient_profile
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientSummary: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dental)
);
