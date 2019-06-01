import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import Enumerable from "linq";
import { SetBulkState } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";

const DeptselectedHandeler = ($this, context, e) => {
  let dept = Enumerable.from($this.props.deptanddoctors.departmets)
    .where(w => w.sub_department_id === e.value)
    .firstOrDefault();

  $this.setState({
    [e.name]: e.value,
    department_id: e.selected.department_id,
    department_type: e.selected.department_type,
    doctors: dept.doctors
  });
  if (context !== null) {
    context.updateState({
      [e.name]: e.value,
      department_id: e.selected.department_id,
      department_type: e.selected.department_type,
      doctors: dept.doctors
    });
  }
};

const selectedHandeler = ($this, context, e) => {
  debugger;
  let primary_policy_num = $this.state.primary_policy_num;
  SetBulkState({
    state: $this,
    callback: () => {
      AlgaehValidation({
        alertTypeIcon: "warning",
        querySelector: "data-validate='demographicDetails'",
        onSuccess: () => {
          if (
            $this.state.insured === "Y" &&
            ($this.state.primary_insurance_provider_id == null ||
              $this.state.primary_network_office_id == null ||
              $this.state.primary_network_id == null)
          ) {
            $this.setState(
              {
                [e.name]: null
              },
              () => {
                swalMessage({
                  title:
                    "Please select the primary insurance details properly.",
                  type: "error"
                });
              }
            );
          } else {
            $this.setState(
              {
                [e.name]: e.value,
                visittypeselect: false,
                consultation: e.selected.consultation,
                primary_policy_num: primary_policy_num
              },
              () => {
                debugger;
                if (context !== null) {
                  context.updateState({
                    ...$this.state,
                    primary_policy_num: primary_policy_num
                  });
                }

                $this.props.getDepartmentsandDoctors({
                  uri: "/department/get/get_All_Doctors_DepartmentWise",
                  module: "masterSettings",
                  method: "GET",
                  redux: {
                    type: "DEPT_DOCTOR_GET_DATA",
                    mappingName: "deptanddoctors"
                  }
                });
              }
            );
          }
        },
        onCatch: () => {
          debugger;
          $this.setState({
            [e.name]: null
          });
          if (context !== null) {
            context.updateState({
              ...$this.state,
              [e.name]: null,
              primary_policy_num: primary_policy_num
            });
          }
        }
      });
    }
  });
};

const doctorselectedHandeler = ($this, context, e) => {
  debugger;
  if ($this.state.sub_department_id !== null) {
    debugger;
    let doctor_name = e.selected.full_name;

    if ($this.state.hims_d_patient_id != null) {
      if (e.selected.services_id !== null) {
        let intputObj = {
          sub_department_id: $this.state.sub_department_id,
          doctor_id: e.value,
          patient_id: $this.state.patient_id
        };
        algaehApiCall({
          uri: "/visit/checkVisitExists",
          module: "frontDesk",
          method: "get",
          data: intputObj,
          onSuccess: response => {
            if (response.data.success === true) {
              if (response.data.records.length > 0) {
                swalMessage({
                  title: "Visit already exists for select Doctor",
                  type: "warning"
                });
              } else {
                if (
                  $this.state.insured === "Y" &&
                  ($this.state.primary_insurance_provider_id == null ||
                    $this.state.primary_network_office_id == null ||
                    $this.state.primary_network_id == null)
                ) {
                  $this.setState(
                    {
                      [e.name]: null
                    },
                    () => {
                      swalMessage({
                        title:
                          "Please select the primary insurance details properly.",
                        type: "error"
                      });
                    }
                  );
                } else {
                  $this.setState(
                    {
                      [e.name]: e.value,
                      visittypeselect: false,
                      hims_d_services_id: e.selected.services_id,
                      incharge_or_provider: e.value,
                      provider_id: e.value,
                      doctor_name: doctor_name,
                      saveEnable: false,
                      billdetail: false
                    },
                    () => {
                      if ($this.state.existing_plan !== "Y") {
                        generateBillDetails($this, context);
                      }
                    }
                  );
                  if (context !== null) {
                    context.updateState({
                      [e.name]: e.value,
                      hims_d_services_id: e.selected.services_id,
                      incharge_or_provider: e.value,
                      provider_id: e.value,
                      doctor_name: doctor_name,
                      saveEnable: false,
                      billdetail: false
                    });
                  }
                }
              }
            } else {
              $this.setState(
                {
                  [e.name]: null
                },
                () => {
                  swalMessage({
                    title: response.data.message,
                    type: "warning"
                  });
                }
              );
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
        $this.setState({
          [e.name]: null
        });
        swalMessage({
          title: "No Service defined for the selected doctor.",
          type: "warning"
        });
      }
    } else {
      if (e.selected.services_id !== null) {
        $this.setState(
          {
            [e.name]: e.value,
            visittypeselect: false,
            hims_d_services_id: e.selected.services_id,
            incharge_or_provider: e.value,
            provider_id: e.value,
            doctor_name: doctor_name,
            saveEnable: false,
            billdetail: false
          },
          () => {
            generateBillDetails($this, context);
          }
        );
        if (context !== null) {
          context.updateState({
            [e.name]: e.value,
            hims_d_services_id: e.selected.services_id,
            incharge_or_provider: e.value,
            provider_id: e.value,
            doctor_name: doctor_name,
            saveEnable: false,
            billdetail: false
          });
        }
      } else {
        $this.setState({
          [e.name]: null
        });
        if (context !== null) {
          context.updateState({
            [e.name]: e.value
          });
        }
        swalMessage({
          title: "No Service defined for the selected doctor.",
          type: "warning"
        });
      }
    }
  } else {
    $this.setState({
      [e.name]: null
    });
    if (context !== null) {
      context.updateState({
        [e.name]: e.value
      });
    }
    swalMessage({
      title: "Please select department.",
      type: "warning"
    });
  }
};

const generateBillDetails = ($this, context) => {
  let zeroBill = false;
  let DoctorVisits = Enumerable.from($this.state.visitDetails)
    .where(w => w.doctor_id === $this.state.doctor_id)
    .toArray();

  let FollowUp = false;
  let currentDate = moment(new Date()).format("YYYY-MM-DD");
  let expiryDate = 0;
  if (DoctorVisits.length > 0) {
    expiryDate = Enumerable.from(DoctorVisits).max(s => s.visit_expiery_date);
  }
  if (
    $this.state.department_type === "D" &&
    $this.state.existing_plan === "Y"
  ) {
    zeroBill = true;
  } else {
    if (expiryDate > currentDate) {
      FollowUp = true;
    }
  }

  let serviceInput = [
    {
      zeroBill: zeroBill,
      FollowUp: FollowUp,
      insured: $this.state.insured,
      vat_applicable: $this.state.vat_applicable,
      hims_d_services_id: $this.state.hims_d_services_id,
      primary_insurance_provider_id: $this.state.primary_insurance_provider_id,
      primary_network_office_id: $this.state.primary_network_office_id,
      primary_network_id: $this.state.primary_network_id,
      sec_insured: $this.state.sec_insured,
      secondary_insurance_provider_id:
        $this.state.secondary_insurance_provider_id,
      secondary_network_id: $this.state.secondary_network_id,
      secondary_network_office_id: $this.state.secondary_network_office_id
    }
  ];
  AlgaehLoader({ show: true });

  algaehApiCall({
    uri: "/billing/getBillDetails",
    module: "billing",
    method: "POST",
    data: serviceInput,
    onSuccess: response => {
      if (response.data.success) {
        if (context !== null) {
          context.updateState({ ...response.data.records });
        }

        algaehApiCall({
          uri: "/billing/billingCalculations",
          module: "billing",
          method: "POST",
          data: response.data.records,
          onSuccess: response => {
            if (response.data.success) {
              if (context !== null) {
                context.updateState({ ...response.data.records });
              }
            }
            AlgaehLoader({ show: false });
          },
          onFailure: error => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    },
    onFailure: error => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const radioChange = ($this, context, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  if (name === "maternity_patient_yes") {
    $this.setState({
      maternity_patient: value,
      checked_maternity_patient: !$this.state.checked_maternity_patient
    });
    if (context !== null) {
      context.updateState({
        maternity_patient: value,
        checked_maternity_patient: !$this.state.checked_maternity_patient
      });
    }
  } else if (name === "existing_plan") {
    $this.setState(
      {
        [name]: value,
        checked_existing_plan: !$this.state.checked_existing_plan
      },
      () => {
        getTreatementPlans($this);
        if ($this.state.doctor_id !== null) {
          generateBillDetails($this, context);
        }
      }
    );
    if (context !== null) {
      context.updateState({
        [name]: value,
        checked_existing_plan: !$this.state.checked_existing_plan
      });
    }
  }

  // $this.setState(
  //   {
  //     maternity_patient: value
  //   },
  //   () => {
  //     if (name === "existing_plan" && value === "Y") {
  //       getTreatementPlans($this);
  //       if ($this.state.doctor_id !== null) {
  //         generateBillDetails($this, context);
  //       }
  //     }
  //     if (
  //       name === "existing_plan" &&
  //       value === "N" &&
  //       $this.state.doctor_id !== null
  //     ) {
  //       generateBillDetails($this, context);
  //     }
  //   }
  // );
};

const getTreatementPlans = $this => {
  $this.props.getTreatmentPlan({
    uri: "/dental/getTreatmentPlan",
    method: "GET",
    data: {
      patient_id: $this.state.hims_d_patient_id,
      plan_status: "O"
    },
    redux: {
      type: "DENTAL_PLAN_DATA",
      mappingName: "dentalplans"
    }
  });
};

const texthandle = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });

  if (context !== null) {
    context.updateState({
      [name]: value
    });
  }
};

export {
  DeptselectedHandeler,
  selectedHandeler,
  doctorselectedHandeler,
  radioChange,
  texthandle
};
