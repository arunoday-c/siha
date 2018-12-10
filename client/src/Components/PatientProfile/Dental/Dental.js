import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./Dental.css";
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

let teeth = [];
let my_send_obj = {};
class Dental extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDentalModal: false,
      standard_fee: 0,
      procedures: [],
      consult_date: new Date(),
      treatements: [],
      dentalTreatments: [],
      openBillingModal: false,
      treatment_gridUpdate: true,
      billDetails: {}
    };
    this.getProcedures();
    this.getTreatementPlans();
    this.deleteDentalPlan = this.deleteDentalPlan.bind(this);
    this.updateDentalTreatmentStatus = this.updateDentalTreatmentStatus.bind(
      this
    );
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
    let bill_dtls = { ...this.state.billDetails, ...this.state.ins_details };
    this.setState({
      [e.target.name]: e.target.value
    });

    // hims_d_services_id: 10851
    // insured: "Y"
    // primary_insurance_provider_id: 167
    // primary_network_id: 2751
    // primary_network_office_id: 59547
    // secondary_insurance_provider_id: null
    // secondary_network_id: null
    // secondary_network_office_id: null
    // vat_applicable: "Y"

    let inputParam = [
      {
        hims_d_services_id: bill_dtls.services_id,
        quantity: bill_dtls.quantity,
        discount_amout: bill_dtls.discount_amout,
        discount_percentage: e.target.value,
        insured: this.state.ins_details !== null ? "Y" : "N",
        vat_applicable: "Y",
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
      method: "POST",
      cancelRequestId: "getBillDetails8",
      data: inputParam,
      onSuccess: res => {
        if (res.data.success) {
          //console.log("Billing Response for getBillDetails:", res.data.records);
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
    debugger;
  }

  saveBill() {
    let inputObj = {
      visit_id: Window.global["visit_is"],
      patient_id: Window.global["current_patient"],
      incharge_or_provider: Window.global["provider_id"],
      billed: "N",
      billdetails: [
        {
          ...this.state.billDetails,
          ...{
            visit_id: Window.global["visit_id"],
            patient_id: Window.global["current_patient"],
            pre_approval: "N",
            doctor_id: Window.global["provider_id"]
          }
        }
      ]
    };

    //console.log("inputObj", JSON.stringify(inputObj));

    algaehApiCall({
      uri: "/orderAndPreApproval/insertOrderedServices",
      data: inputObj,
      method: "POST",
      onSuccess: response => {
        if (response.data.success) {
          algaehApiCall({
            uri: "/denta;/updateDentalTreatmentBilledStatus",
            data: {
              hims_f_dental_treatment_id: this.state.d_id,
              billed: "Y"
            },
            onSuccess: res => {
              if (res.data.success) {
                console.log("Billed");
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
            title: "Ordered Successfully...",
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
    algaehApiCall({
      uri: "/insurance/getPatientInsurance",
      method: "GET",
      data: {
        patient_id: Window.global["current_patient"],
        patient_visit_id: Window.global["visit_id"]
      },
      onSuccess: res => {
        if (res.data.success) {
          console.log("Insurance Details", res.data.records);

          let ins = res.data.records.length > 0 ? res.data.records[0] : null;

          this.setState({
            ins_details: ins
          });

          algaehApiCall({
            uri: "/billing/getBillDetails",
            method: "POST",
            cancelRequestId: "getBillDetails4",
            data: [
              {
                insured: res.data.records.length > 0 ? "Y" : "N",
                vat_applicable: "Y",
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
              if (res.data.success) {
                console.log("Billing Response:", res.data.records);
                this.setState({
                  billDetails: res.data.records.billdetails[0]
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
      d_id: row.hims_f_dental_treatment_id
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
    e.currentTarget.classList.contains("mark-active")
      ? e.currentTarget.classList.remove("mark-active")
      : e.currentTarget.classList.add("mark-active");

    let my_obj = {
      teeth_number: parseInt(
        e.currentTarget.parentElement.previousElementSibling.innerText,
        10
      ),
      surface: e.currentTarget.innerText.toString()
    };

    let my_item = Enumerable.from(teeth)
      .where(
        w =>
          w.teeth_number === my_obj.teeth_number && w.surface === my_obj.surface
      )
      .firstOrDefault();

    if (my_item !== undefined) {
      teeth.splice(teeth.indexOf(my_item), 1);
      // console.log("Teeth Selected", teeth);
    } else {
      teeth.push(my_obj);
      // console.log("Teeth Selected", teeth);
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
    //console.log("Send Teeth", JSON.stringify(my_send_obj));

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
  }

  addDentalPlan() {
    AlgaehValidation({
      querySelector: "data-validate='addDentalPlanDiv'",
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/dental/addDentalTreatment",
          method: "POST",
          data: my_send_obj,
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Added Successfully",
                type: "success"
              });
            }
          },
          onError: error => {
            swalMessage({
              title: error.message,
              type: "success"
            });
          }
        });
      }
    });
  }

  addTreatementPlan() {
    AlgaehValidation({
      querySelector: "data-validate='addTreatementDiv'",
      alertTypeIcon: "warning",
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
      confirmButtonText: "Yes!",
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

  generateToothUpperLeftSet() {
    let plot = [];
    for (let i = 1; i < 9; i++) {
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
          <span>{i}</span>
          <div className="surface-Marking">
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="top-surface"
            >
              <span>D</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="right-surface"
            >
              <span>L</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="bottom-surface"
            >
              <span>I</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="left-surface"
            >
              <span>P</span>
            </div>
            {i >= 6 ? null : (
              <div
                onClick={this.markTeethSurface.bind(this)}
                className="middle-surface"
              >
                <span>M</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return plot;
  }
  generateToothUpperRightSet() {
    let plot = [];
    for (let i = 9; i < 17; i++) {
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
          <span>{i}</span>
          <div className="surface-Marking">
            <div
              surface="distal='Y'"
              onClick={this.markTeethSurface.bind(this)}
              className="top-surface"
            >
              <span>D</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="right-surface"
            >
              <span>L</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="bottom-surface"
            >
              <span>I</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="left-surface"
            >
              <span>P</span>
            </div>
            {i >= 12 ? (
              <div
                onClick={this.markTeethSurface.bind(this)}
                className="middle-surface"
              >
                <span>M</span>
              </div>
            ) : null}
          </div>
        </div>
      );
    }
    return plot;
  }

  generateToothLowerLeftSet() {
    let plot = [];
    let counter = 1;

    for (let i = 32; i >= 25; i--) {
      plot.push(
        <div
          onClick={this.markAllSurface.bind(this)}
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
          <span>{i}</span>
          <div className="surface-Marking">
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="top-surface"
            >
              <span>D</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="right-surface"
            >
              <span>L</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="bottom-surface"
            >
              <span>I</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="left-surface"
            >
              <span>P</span>
            </div>
            {counter >= 6 ? null : (
              <div
                onClick={this.markTeethSurface.bind(this)}
                className="middle-surface"
              >
                <span>M</span>
              </div>
            )}
          </div>
        </div>
      );
      counter++;
    }
    return plot;
  }

  deleteDentalPlan(data) {
    swal({
      title: "Delete Plan ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/dental/deleteDentalPlan",
          data: {
            hims_f_dental_treatment_id: data.hims_f_dental_treatment_id
          },
          method: "DELETE",
          onSuccess: res => {
            if (res.data.success) {
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
        treatment_status: data.treatment_status
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record Updated",
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

  generateToothLowerRightSet() {
    let plot = [];
    let counter = 9;

    for (let i = 24; i >= 17; i--) {
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
          <span>{i}</span>
          <div className="surface-Marking">
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="top-surface"
            >
              <span>D</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="right-surface"
            >
              <span>L</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="bottom-surface"
            >
              <span>I</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="left-surface"
            >
              <span>P</span>
            </div>
            {counter >= 21 ? (
              <div
                onClick={this.markTeethSurface.bind(this)}
                className="middle-surface"
              >
                <span>M</span>
              </div>
            ) : null}
          </div>
        </div>
      );
      counter++;
    }
    return plot;
  }

  openAddModal(data) {
    this.setState({
      openDentalModal: true,
      selected_treatement_plan: data.plan_name,
      hims_f_treatment_plan_id: data.hims_f_treatment_plan_id,
      treatment_gridUpdate: false
    });
  }

  render() {
    let billDetails = this.state.billDetails;
    return (
      <div id="dentalTreatment">
        <AlgaehModalPopUp
          openPopup={this.state.openBillingModal}
          title="Bill Service"
        >
          <div
            className="col-lg-12 margin-bottom-15 popupInner"
            data-validate="billDentalPlan"
          >
            <div className="row form-details" style={{ paddingBottom: 0 }}>
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
                  fieldName: "procedure",
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
                    className: "txt-fld",
                    name: "discount_percentage",
                    value: this.state.discount_percentage,
                    events: {
                      onChange: this.calculateDiscount.bind(this)
                    },
                    others: {
                      min: 0,
                      type: "number"
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
              <div className="col-lg-6">
                <AlgaehLabel
                  label={{
                    fieldName: "prim-insurance"
                  }}
                />
                <div className="Paper">
                  <div className="row insurance-details">
                    <div className="col">
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

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "copay_amount"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.copay_amount)}</h6>
                    </div>

                    <div className="col-3">
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

                    <div className="col-4">
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

              <div className="col-lg-6">
                <AlgaehLabel
                  label={{
                    fieldName: "sec_company"
                  }}
                />
                <div className="Paper">
                  <div className="row insurance-details">
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "sec_copay_percntage"
                        }}
                      />
                      <h6>
                        {billDetails.sec_copay_percntage
                          ? billDetails.sec_copay_percntage + "%"
                          : "0.00%"}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "sec_copay_amount"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.sec_copay_amount)}</h6>
                    </div>

                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "sec_deductable_percentage"
                        }}
                      />
                      <h6>
                        {billDetails.sec_deductable_percentage
                          ? billDetails.sec_deductable_percentage + "%"
                          : "0.00%"}
                      </h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "sec_deductable_amount"
                        }}
                      />
                      <h6>
                        {getAmountFormart(billDetails.sec_deductable_amount)}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            {/* Payables */}
            <div className="row ">
              <div className="col-lg-4">
                <AlgaehLabel
                  label={{
                    fieldName: "patient_lbl"
                  }}
                />
                <div className="Paper">
                  <div className="row insurance-details">
                    <div className="col-5">
                      <AlgaehLabel
                        label={{
                          fieldName: "responsibility_lbl"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.patient_resp)}</h6>
                    </div>

                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "tax_lbl"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.patient_tax)}</h6>
                    </div>

                    <div className="col-4">
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
              {/* <div className="col-lg-1"> &nbsp; </div> */}

              <div className="col-lg-4">
                <AlgaehLabel
                  label={{
                    fieldName: "company_lbl"
                  }}
                />
                <div className="Paper">
                  <div className="row insurance-details">
                    <div className="col-5">
                      <AlgaehLabel
                        label={{
                          fieldName: "responsibility_lbl"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.comapany_resp)}</h6>
                    </div>

                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "tax_lbl"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.company_tax)}</h6>
                    </div>

                    <div className="col-4">
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

              {/* <div className="col-lg-1"> &nbsp; </div> */}

              <div className="col-lg-4">
                <AlgaehLabel
                  label={{
                    fieldName: "sec_comp_lbl"
                  }}
                />
                <div className="Paper">
                  <div className="row insurance-details">
                    <div className="col-5">
                      <AlgaehLabel
                        label={{
                          fieldName: "responsibility_lbl"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.sec_company_res)}</h6>
                    </div>

                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "tax_lbl"
                        }}
                      />
                      <h6>{getAmountFormart(billDetails.sec_company_tax)}</h6>
                    </div>

                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "payable_lbl"
                        }}
                      />
                      <h6>
                        {getAmountFormart(billDetails.sec_company_paybale)}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="popupFooter">
            <div className="col-lg-12 margin-bottom-15">
              <button
                onClick={this.saveBill.bind(this)}
                className="btn btn-primary"
                style={{ float: "right" }}
              >
                Save
              </button>
            </div>
          </div>
        </AlgaehModalPopUp>

        <AlgaehModalPopUp
          events={{
            onClose: () => {
              teeth = [];
              this.setState({
                treatment_gridUpdate: true,
                openDentalModal: false,
                hims_d_services_id: null,
                quantity: 0,
                standard_fee: 0,
                total_price: 0,
                hims_f_treatment_plan_id: null
              });
            }
          }}
          openPopup={this.state.openDentalModal}
          title="Dental Plan"
        >
          <div
            className="col-lg-12 margin-bottom-15 popupInner"
            data-validate="addDentalPlanDiv"
          >
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
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
                div={{ className: "col-lg-3" }}
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
                  onChange: this.dropDownHandler.bind(this)
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-1" }}
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
                div={{ className: "col-lg-1" }}
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
                    min: 0,
                    type: "number"
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-1" }}
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
                div={{ className: "col-lg-2" }}
                label={{ fieldName: "schld_date", isImp: true }}
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
          </div>

          <div className="col-lg-12" id="dentalTreatment">
            <div className="row top-teeth-sec">
              <div className="col-lg-6 teeth-sec">
                <h6>Upper Left</h6>
                <div className="row">{this.generateToothUpperLeftSet()}</div>
              </div>
              <div className="col-lg-6 teeth-sec">
                <h6>Upper Right</h6>
                <div className="row">{this.generateToothUpperRightSet()}</div>
              </div>
            </div>

            <div className="row bottom-teeth-sec">
              <div className="col-lg-6 teeth-sec">
                <div className="row">{this.generateToothLowerLeftSet()}</div>
                <h6>Lower Left</h6>
              </div>
              <div className="col-lg-6 teeth-sec">
                <div className="row">{this.generateToothLowerRightSet()}</div>
                <h6>Lower Right</h6>
              </div>
            </div>
          </div>
          <div className="popupFooter">
            <div className="col-lg-12 margin-bottom-15">
              <button
                onClick={this.addDentalPlan.bind(this)}
                className="btn btn-primary"
                style={{ float: "right" }}
              >
                Add to List
              </button>
            </div>
          </div>
        </AlgaehModalPopUp>

        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title" data-validate="addTreatementDiv">
            <div className="col-lg-12 margin-bottom-15">
              <div className="row">
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

                <div className="col-lg-2 margin-top-15">
                  <button
                    onClick={this.addTreatementPlan.bind(this)}
                    className="btn btn-primary"
                  >
                    Add Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="portlet-body" data-validate="treatmentDiv">
            <AlgaehDataGrid
              id="treatment-grid"
              datavalidate="data-validate='treatmentDiv'"
              columns={[
                {
                  fieldName: "actions",
                  label: "Actions",
                  displayTemplate: row => {
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
                                row.approve_status === "Y" ? " none" : null,
                              opacity: row.approve_status === "Y" ? "0.1" : null
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
                                row.approve_status === "Y" ? " none" : null,
                              opacity: row.approve_status === "Y" ? "0.1" : null
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
                  }
                },
                {
                  fieldName: "consult_date",
                  label: "Date"
                },
                {
                  fieldName: "plan_name",
                  label: "Treatement Plan"
                },
                {
                  fieldName: "remarks",
                  label: "Remarks",
                  disabled: true
                },
                {
                  fieldName: "approve_status",
                  label: "Approval Status",
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
                  label: "Plan Status",
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
                }
              ]}
              keyId="algaeh_app_screens_id"
              dataSource={{
                data: this.state.treatements
              }}
              filter={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              expanded={{
                detailTemplate: row => {
                  return <div>{this.getTreatementsGrid(row)}</div>;
                }
              }}
              events={{
                onEdit: () => {},
                onDelete: () => {},
                onDone: () => {}
              }}
            />
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
