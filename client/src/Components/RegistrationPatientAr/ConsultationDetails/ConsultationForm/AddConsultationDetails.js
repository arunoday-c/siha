import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import Enumerable from "linq";
import { SetBulkState } from "../../../../utils/GlobalFunctions";

const DeptselectedHandeler = ($this, context, e) => {
  debugger;
  let dept = Enumerable.from($this.props.deptanddoctors.departmets)
    .where(w => w.sub_department_id === e.value)
    .firstOrDefault();

  $this.setState(
    {
      [e.name]: e.value,
      department_id: e.selected.department_id,
      doctors: dept.doctors
    },
    () => {
      debugger;
    }
  );
  if (context != null) {
    context.updateState({
      [e.name]: e.value,
      department_id: e.selected.department_id,
      doctors: dept.doctors
    });
  }
};

const selectedHandeler = ($this, context, e) => {
  //debugger;
  SetBulkState({
    state: $this,
    callback: () => {
      debugger;
      if (
        $this.state.full_name !== "" &&
        ($this.state.title_id !== null && $this.state.title_id !== "") &&
        $this.state.arabic_name !== "" &&
        ($this.state.gender !== null && $this.state.gender !== "") &&
        ($this.state.date_of_birth !== null &&
          $this.state.date_of_birth !== "") &&
        $this.state.age !== 0 &&
        ($this.state.contact_number !== null &&
          $this.state.contact_number !== "") &&
        ($this.state.patient_type !== null &&
          $this.state.patient_type !== "") &&
        ($this.state.nationality_id !== null &&
          $this.state.nationality_id !== "") &&
        ($this.state.country_id !== null && $this.state.country_id !== "") &&
        ($this.state.primary_identity_id !== null &&
          $this.state.primary_identity_id !== "") &&
        ($this.state.primary_id_no !== "" && $this.state.primary_id_no !== null)
      ) {
        $this.setState(
          {
            [e.name]: e.value,
            visittypeselect: false,
            consultation: e.selected.consultation
          },
          () => {
            if (context != null) {
              context.updateState({
                ...$this.state
              });
            }

            $this.props.getDepartmentsandDoctors({
              uri: "/department/get/get_All_Doctors_DepartmentWise",
              method: "GET",
              redux: {
                type: "DEPT_DOCTOR_GET_DATA",
                mappingName: "deptanddoctors"
              }
            });
          }
        );
      } else {
        $this.setState({
          [e.name]: null
        });
        swalMessage({
          title: "Invalid Input. Please fill Patient demographic details",
          type: "warning"
        });
      }
    }
  });
};

const doctorselectedHandeler = ($this, context, e) => {
  debugger;
  if ($this.state.sub_department_id !== null) {
    let employee_list = Enumerable.from($this.props.providers)
      .where(w => w.hims_d_employee_id === e.value)
      .toArray();
    let doctor_name = "";
    if (employee_list !== null && employee_list.length > 0) {
      doctor_name = employee_list[0].full_name;
    }
    if ($this.state.hims_d_patient_id != null) {
      if (e.selected.services_id !== null) {
        algaehApiCall({
          uri: "/visit/checkVisitExists",
          data: $this.state,
          onSuccess: response => {
            if (response.data.success === true) {
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
              if (context != null) {
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
          }
        });
      } else {
        $this.setState({
          [e.name]: null
        });
        swalMessage({
          title: "Invalid Input. No Service defined for the selected doctor.",
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
        if (context != null) {
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
        swalMessage({
          title: "Invalid Input. No Service defined for the selected doctor.",
          type: "warning"
        });
      }
    }
  } else {
    $this.setState({
      [e.name]: null
    });
    swalMessage({
      title: "Invalid Input. Please select department.",
      type: "warning"
    });
  }
};

const generateBillDetails = ($this, context) => {
  let serviceInput = [
    {
      insured: $this.state.insured,
      //TODO change middle ware to promisify function --added by Nowshad
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

  debugger;
  algaehApiCall({
    uri: "/billing/getBillDetails",
    method: "POST",
    data: serviceInput,
    onSuccess: response => {
      if (response.data.success) {
        if (context != null) {
          context.updateState({ ...response.data.records });
        }

        algaehApiCall({
          uri: "/billing/billingCalculations",
          method: "POST",
          data: response.data.records,
          onSuccess: response => {
            if (response.data.success) {
              if (context != null) {
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

export { DeptselectedHandeler, selectedHandeler, doctorselectedHandeler };
