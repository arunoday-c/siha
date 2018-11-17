import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import Enumerable from "linq";

const DeptselectedHandeler = ($this, context, e) => {
  let dept = Enumerable.from($this.props.deptanddoctors.departmets)
    .where(w => w.sub_department_id === e.value)
    .firstOrDefault();

  $this.setState({
    [e.name]: e.value,
    department_id: e.selected.department_id,
    doctors: dept.doctors
  });
  if (context != null) {
    context.updateState({
      [e.name]: e.value,
      department_id: e.selected.department_id
    });
  }
};

const selectedHandeler = ($this, context, e) => {
  if (
    $this.state.full_name !== "" &&
    $this.state.title_id !== null &&
    $this.state.arabic_name !== "" &&
    $this.state.gender !== null &&
    $this.state.date_of_birth !== null &&
    $this.state.age !== 0 &&
    $this.state.contact_number !== 0 &&
    $this.state.patient_type !== null &&
    $this.state.nationality_id !== null &&
    $this.state.country_id !== null &&
    $this.state.primary_identity_id !== null &&
    $this.state.primary_id_no !== ""
  ) {
    $this.props.getDepartmentsandDoctors({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      method: "GET",
      redux: {
        type: "DEPT_DOCTOR_GET_DATA",
        mappingName: "deptanddoctors"
      },
      afterSuccess: data => {
        $this.setState({
          [e.name]: e.value,
          visittypeselect: false
        });

        if (context != null) {
          context.updateState({
            [e.name]: e.value,
            consultation: e.selected.consultation,
            visittypeselect: false
          });
        }
      }
    });
  } else {
    $this.setState({
      [e.name]: null
    });
    swalMessage({
      title: "Invalid Input. Please fill Patient demographic details",
      type: "warning"
    });
  }
};

const unsuccessfulSignIn = (message, title) => {
  swalMessage({
    title: message,
    type: "error"
  });
};

const doctorselectedHandeler = ($this, context, e) => {
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
                  unsuccessfulSignIn(response.data.message, "Warning");
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
  $this.props.generateBill({
    uri: "/billing/getBillDetails",
    method: "POST",
    data: serviceInput,
    redux: {
      type: "BILL_GEN_GET_DATA",
      mappingName: "xxx"
    },
    afterSuccess: data => {
      if (context != null) {
        context.updateState({ ...data });
      }

      $this.props.billingCalculations({
        uri: "/billing/billingCalculations",
        method: "POST",
        data: data,
        redux: {
          type: "BILL_HEADER_GEN_GET_DATA",
          mappingName: "genbill"
        },
        afterSuccess: data => {
          AlgaehLoader({ show: false });
        }
      });
    }
  });
};

export {
  DeptselectedHandeler,
  selectedHandeler,
  doctorselectedHandeler,
  unsuccessfulSignIn
};
