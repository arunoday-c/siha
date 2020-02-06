import AlgaehLoader from "../Wrapper/fullPageLoader";
import PatRegIOputs from "../../Models/RegistrationPatient";
import BillingIOputs from "../../Models/Billing";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../utils/algaehApiCall.js";
import extend from "extend";
import moment from "moment";
import { AlgaehOpenContainer } from "../../utils/GlobalFunctions";
import _ from "lodash";
import Enumerable from "linq";

const emptyObject = extend(
  PatRegIOputs.inputParam(),
  BillingIOputs.inputParam()
);

const generateBillDetails = $this => {
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
    ($this.state.department_type === "D" &&
      $this.state.existing_plan === "Y") ||
    $this.state.from_package === true
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
      service_type_id: $this.state.service_type_id,
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
        response.data.records.follow_up = FollowUp;
        response.data.records.existing_treat = zeroBill;
        $this.setState({ ...response.data.records });

        algaehApiCall({
          uri: "/billing/billingCalculations",
          module: "billing",
          method: "POST",
          data: response.data.records,
          onSuccess: response => {
            if (response.data.success) {
              // if (context !==null) {
              //   context.updateState({ ...response.data.records });
              // }
              $this.setState({ ...response.data.records });
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

const ShowRefundScreen = ($this, e) => {
  if (
    $this.state.patient_code !== undefined &&
    $this.state.patient_code !== ""
  ) {
    $this.setState({
      ...$this.state,
      RefundOpen: !$this.state.RefundOpen
    });
  } else {
    swalMessage({
      title: "Select Patient",
      type: "error"
    });
  }
};

const ClearData = ($this, from, patcode) => {
  AlgaehLoader({ show: true });
  let IOputs = emptyObject;
  let counter_id = null;
  IOputs.visittypeselect = true;
  IOputs.age = 0;
  IOputs.AGEMM = 0;
  IOputs.AGEDD = 0;

  // let prevLang = getCookie("Language");

  IOputs.selectedLang = getCookie("Language");

  let _screenName = getCookie("ScreenName").replace("/", "");
  algaehApiCall({
    uri: "/userPreferences/get",
    data: {
      screenName: _screenName,
      identifier: "Counter"
    },
    method: "GET",
    onSuccess: response => {
      counter_id = response.data.records.selectedValue;

      if (
        $this.props.hospitaldetails !== undefined ||
        $this.props.hospitaldetails.length !== 0
      ) {
        IOputs.vat_applicable =
          $this.props.hospitaldetails[0].local_vat_applicable;
        IOputs.nationality_id =
          $this.props.hospitaldetails[0].default_nationality;
        IOputs.country_id = $this.props.hospitaldetails[0].default_country;
        IOputs.patient_type =
          $this.props.hospitaldetails[0].default_patient_type;
      }

      if (counter_id !== null) {
        IOputs.counter_id = counter_id;
      }

      IOputs.forceRefresh = true;
      IOputs.doctors = $this.props.frontproviders;
      $this.setState(IOputs, () => {
        $this.props.setSelectedInsurance({
          redux: {
            type: "PRIMARY_INSURANCE_DATA",
            mappingName: "primaryinsurance",
            data: []
          }
        });
        $this.props.setSelectedInsurance({
          redux: {
            type: "Package_GET_DATA",
            mappingName: "PatientPackageList",
            data: []
          }
        });

        $this.props.setSelectedInsurance({
          redux: {
            type: "PRIMARY_INSURANCE_DATA",
            mappingName: "existinsurance",
            data: []
          }
        });

        $this.props.setSelectedInsurance({
          redux: {
            type: "SECONDARY_INSURANCE_DATA",
            mappingName: "secondaryinsurance",
            data: []
          }
        });
        AlgaehLoader({ show: true });
        getCashiersAndShiftMAP($this, "NA");
        if (from === "pat_code") {
          getCtrlCode($this, patcode);
        } else {
          AlgaehLoader({ show: false });
        }
      });
    }
  });
};

const getHospitalDetails = $this => {
  $this.props.getHospitalDetails({
    uri: "/organization/getOrganization",
    method: "GET",
    data: {
      hims_d_hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id
    },
    redux: {
      type: "HOSPITAL_DETAILS_GET_DATA",
      mappingName: "hospitaldetails"
    },
    afterSuccess: data => {
      $this.setState({
        vat_applicable: data[0].local_vat_applicable,
        nationality_id: data[0].default_nationality,
        country_id: data[0].default_country,
        patient_type: data[0].default_patient_type
      });
    }
  });
};

const getCashiersAndShiftMAP = ($this, type) => {
  // AlgaehLoader({ show: true });
  let year = moment().format("YYYY");
  let month = moment().format("M");
  let visit_type = _.find($this.props.visittypes, f => f.consultation === "Y");
  algaehApiCall({
    uri: "/shiftAndCounter/getCashiersAndShiftMAP",
    module: "masterSettings",
    method: "GET",
    data: { for: "T" },
    onSuccess: response => {
      if (response.data.success) {
        if (response.data.records.length > 0) {
          $this.setState(
            {
              shift_assinged: response.data.records
            },
            () => {
              $this.setState({
                shift_id: response.data.records[0].shift_id
              });
            }
          );
        }

        if ($this.props.fromAppoinment === true && type === "A") {
          const { patient_details } = $this.props;
          if (patient_details) {
            $this.setState(
              {
                full_name: patient_details.patient_name,
                arabic_name: patient_details.arabic_patient_name,
                gender: patient_details.patient_gender,
                age: patient_details.patient_age,
                contact_number: patient_details.patient_phone,
                title_id: patient_details.title_id,
                date_of_birth: patient_details.date_of_birth,
                sub_department_id: $this.props.sub_department_id,
                department_id: $this.props.department_id,
                provider_id: $this.props.provider_id,
                doctor_id: $this.props.provider_id,
                visit_type: visit_type.hims_d_visit_type_id,
                hims_d_services_id: $this.props.hims_d_services_id,
                saveEnable: false,
                clearEnable: true,
                consultation: "Y",
                appointment_patient: "Y",
                billdetail: false,
                appointment_id: $this.state.hims_f_patient_appointment_id
              },
              () => {
                AlgaehLoader({ show: false });
                if ($this.props.fromAppoinment === true) {
                  generateBillDetails($this);
                }
              }
            );
          }
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
};
const ShowAdvanceScreen = ($this, e) => {
  if (
    $this.state.patient_code !== undefined &&
    $this.state.patient_code !== ""
  ) {
    $this.setState({
      ...$this.state,
      AdvanceOpen: !$this.state.AdvanceOpen
    });
  } else {
    swalMessage({
      title: "Please select a patient to add advance for",
      type: "warning"
    });
  }
};

const showAdvanceRefundList = ($this, e) => {
  if (
    $this.state.patient_code !== undefined &&
    $this.state.patient_code !== ""
  ) {
    $this.setState({
      ...$this.state,
      AdvanceRefundOpen: !$this.state.AdvanceRefundOpen
    });
  } else {
    swalMessage({
      title: "Please select a patient to view advance for",
      type: "warning"
    });
  }
};

const closePopup = $this => {
  $this.setState({ popUpGenereted: false });
};

const generateIdCard = $this => {
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
        reportName: "patientIDCard",
        reportParams: [
          {
            name: "hims_d_patient_id",
            value: $this.state.hims_d_patient_id
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
      myWindow.document.title = "ID Card";
    }
  });
};

const generateReceipt = $this => {
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
        reportName: "cashReceipt",
        reportParams: [
          {
            name: "hims_f_billing_header_id",
            value: $this.state.hims_f_billing_header_id
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
      myWindow.document.title = "Receipt";
    }
  });
};

const getCtrlCode = ($this, patcode, row) => {
  // AlgaehLoader({ show: true });
  let visit_type = _.find($this.props.visittypes, f => f.consultation === "Y");
  let provider_id = $this.props.provider_id || null;
  let sub_department_id = $this.props.sub_department_id || null;
  // let visit_type = $this.props.visit_type || null;
  let hims_d_services_id = $this.props.hims_d_services_id || null;
  let fromAppoinment =
    $this.props.fromAppoinment === undefined
      ? false
      : $this.props.fromAppoinment;

  let department_id = $this.props.department_id || null;
  let appointment_id = $this.props.hims_f_patient_appointment_id || null;
  let title_id =
    $this.props.patient_details !== undefined
      ? $this.props.patient_details.title_id || null
      : null;

  algaehApiCall({
    uri: "/frontDesk/get",
    module: "frontDesk",
    method: "GET",
    data: { patient_code: patcode },
    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;

        let hospital_id = JSON.parse(
          AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
        ).hims_d_hospital_id;
        // let hospitaldetails = Enumerable.from($this.props.hospitaldetails)
        //   .where(w => w.hims_d_hospital_id === hospital_id)
        //   .firstOrDefault();

        let hospitaldetails = _.find(
          $this.props.hospitaldetails,
          f => f.hims_d_hospital_id === hospital_id
        );

        data.patientRegistration.vat_applicable = "Y";

        if (
          hospitaldetails.local_vat_applicable === "N" &&
          hospitaldetails.default_nationality ===
            data.patientRegistration.nationality_id
        ) {
          data.patientRegistration.vat_applicable = "N";
        }

        data.patientRegistration.visitDetails = data.visitDetails;
        data.patientRegistration.patient_id =
          data.patientRegistration.hims_d_patient_id;
        data.patientRegistration.existingPatient = true;

        //Appoinment Start
        if (fromAppoinment === true) {
          data.patientRegistration.provider_id = provider_id;
          data.patientRegistration.doctor_id = provider_id;
          data.patientRegistration.sub_department_id = sub_department_id;

          data.patientRegistration.visit_type = visit_type.hims_d_visit_type_id;
          data.patientRegistration.saveEnable = false;
          data.patientRegistration.clearEnable = true;
          data.patientRegistration.hims_d_services_id = hims_d_services_id;
          data.patientRegistration.department_id = department_id;
          data.patientRegistration.billdetail = false;
          data.patientRegistration.consultation = "Y";
          data.patientRegistration.appointment_patient = "Y";
          data.patientRegistration.appointment_id = appointment_id;
          data.patientRegistration.title_id = title_id;
        }
        //Appoinment End

        data.patientRegistration.filePreview =
          "data:image/png;base64, " + data.patient_Image;
        data.patientRegistration.arabic_name =
          data.patientRegistration.arabic_name || "No Name";

        data.patientRegistration.date_of_birth = moment(
          data.patientRegistration.date_of_birth
        )._d;

        data.patientRegistration.advanceEnable = false;

        if (data.bill_criedt.length > 0) {
          data.patientRegistration.due_amount = _.sumBy(data.bill_criedt, s =>
            parseFloat(s.balance_credit)
          );
        } else {
          data.patientRegistration.due_amount = 0;
        }

        $this.setState(data.patientRegistration, () => {
          AlgaehLoader({ show: false });
          if (fromAppoinment === true) {
            generateBillDetails($this);
          }
        });

        $this.props.getPatientInsurance({
          // uri: "/insurance/getPatientInsurance",
          uri: "/patientRegistration/getPatientInsurance",
          module: "frontDesk",
          method: "GET",
          data: {
            patient_id: data.patientRegistration.hims_d_patient_id
          },
          redux: {
            type: "EXIT_INSURANCE_GET_DATA",
            mappingName: "existinsurance"
          }
        });

        $this.props.getPatientPackage({
          uri: "/orderAndPreApproval/getPatientPackage",
          method: "GET",
          data: {
            patient_id: data.patientRegistration.hims_d_patient_id,
            package_visit_type: "M",
            closed: "N"
          },
          redux: {
            type: "ORDER_SERVICES_GET_DATA",
            mappingName: "PatientPackageList"
          },
          afterSuccess: data => {
            if (data.length !== 0 || data.length === undefined) {
              $this.setState({
                pack_balance_amount: data[0].balance_amount
              });
            }
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

const ShowPackageUtilize = $this => {
  $this.setState({
    isPackUtOpen: !$this.state.isPackUtOpen,
    package_detail: $this.props.PatientPackageList
  });
};
const UpdatePatientDetail = $this => {
  if ($this.state.patient_code === null || $this.state.patient_code === "") {
    swalMessage({
      title: "Please Select the patient.",
      type: "warning"
    });
  } else {
    $this.setState({
      UpdatepatientDetail: !$this.state.UpdatepatientDetail
    });
  }
};

const ClosePackageUtilize = ($this, e) => {
  if (e === undefined || e.services_id === undefined) {
    $this.setState(
      {
        isPackUtOpen: !$this.state.isPackUtOpen
      },
      () => {
        $this.props.getPatientPackage({
          uri: "/orderAndPreApproval/getPatientPackage",
          method: "GET",
          data: {
            patient_id: $this.state.hims_d_patient_id,
            package_visit_type: "M",
            closed: "N"
          },
          redux: {
            type: "ORDER_SERVICES_GET_DATA",
            mappingName: "PatientPackageList"
          },
          afterSuccess: data => {
            if (data.length !== 0 || data.length === undefined) {
              $this.setState({
                primary_policy_num: $this.state.primary_policy_num,
                pack_balance_amount: data[0].balance_amount
              });
            }
          }
        });
      }
    );
    return;
  }
  let visit_type = _.find($this.props.visittypes, f => f.consultation === "Y");
  $this.setState(
    {
      isPackUtOpen: !$this.state.isPackUtOpen,
      hims_d_services_id: e.services_id,
      service_type_id: e.service_type_id,
      incharge_or_provider: e.doctor_id,
      provider_id: e.doctor_id,
      doctor_id: e.doctor_id,
      sub_department_id: e.sub_department_id,
      visit_type: visit_type.hims_d_visit_type_id,
      package_details: e.package_details,
      from_package: e.package_utilize === true ? false : true,
      visittypeselect: true,
      utilize_amount: e.utilize_amount,
      balance_amount: e.balance_amount,
      actual_utilize_amount: e.actual_utilize_amount,
      consultation: "Y",
      hims_f_package_header_id: e.hims_f_package_header_id,
      saveEnable: false,
      billdetail: false,
      new_visit_patient: "P"
    },
    () => {
      generateBillDetails($this);
      $this.props.getPatientPackage({
        uri: "/orderAndPreApproval/getPatientPackage",
        method: "GET",
        data: {
          patient_id: $this.state.hims_d_patient_id,
          package_visit_type: "M",
          closed: "N"
        },
        redux: {
          type: "ORDER_SERVICES_GET_DATA",
          mappingName: "PatientPackageList"
        },
        afterSuccess: data => {
          if (data.length !== 0 || data.length === undefined) {
            $this.setState({
              pack_balance_amount: data[0].balance_amount
            });
          }
        }
      });
    }
  );
};

export {
  generateBillDetails,
  ShowRefundScreen,
  ClearData,
  ShowAdvanceScreen,
  getHospitalDetails,
  getCashiersAndShiftMAP,
  closePopup,
  generateIdCard,
  generateReceipt,
  getCtrlCode,
  ShowPackageUtilize,
  ClosePackageUtilize,
  UpdatePatientDetail,
  showAdvanceRefundList
};
