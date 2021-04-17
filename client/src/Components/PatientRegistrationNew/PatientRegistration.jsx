import React, { useContext, useState, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import { useForm } from "react-hook-form";
import moment from "moment";
import { useLocation, useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FrontdeskContext } from "./FrontdeskContext";
import PackageUtilize from "../PatientProfile/PackageUtilize/PackageUtilize";
import AdvanceRefundListModal from "../AdvanceRefundList/AdvanceRefundListModal";
import { PatientAttachments } from "./PatientAttachment";
import { PricingModals } from "./PricingModal";
import { UpdatePatient } from "./UpdatePatient";
// import Enumerable from "linq";
import {
  MainContext,
  AlgaehLabel,
  Spin,
  AlgaehMessagePop,
  AlgaehSecurityComponent,
} from "algaeh-react-components";

import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import { useQueryParams, newAlgaehApi } from "../../hooks";
import { Demographics } from "./Demographics";
import { InsuranceDetails } from "./InsuranceDetails";
import { VisitDetails } from "./VisitDetail";
import { BillDetails } from "./BillDetails";
import { AdvanceModal } from "./AdvanceRefundModal";
import { algaehApiCall } from "../../utils/algaehApiCall";
import axios from "axios";
import sockets from "../../sockets";
// import _ from "lodash";
export const getPatient = async (key, { patient_code }) => {
  const result = await newAlgaehApi({
    uri: "/frontDesk/get",
    module: "frontDesk",
    method: "GET",
    data: { patient_code },
  });
  return result?.data?.records;
};

const getPatientFromAppointment = async (key, { appointment_id }) => {
  const result = await newAlgaehApi({
    uri: "/appointment/getPatientDetilsByAppId",
    module: "frontDesk",
    method: "GET",
    data: { application_id: appointment_id },
  });
  return result?.data?.records;
};

const getIncomeFromPatient = async (key, { patient_id }) => {
  const result = await newAlgaehApi({
    uri: "/appointment/getIncomeFromPatient",
    module: "frontDesk",
    method: "GET",
    data: { patient_id: patient_id },
  });
  return result?.data?.records;
};

const getPatientPackage = async (key, { patient_id }) => {
  const res = await newAlgaehApi({
    uri: "/orderAndPreApproval/getPatientPackage",
    method: "GET",
    data: {
      patient_id,
      package_visit_type: "M",
      closed: "N",
    },
  });
  return res?.data.records;
};

const savePatient = async (data) => {
  data.ScreenCode = "BL0002";
  const result = await newAlgaehApi({
    uri: "/frontDesk/add",
    module: "frontDesk",
    data,
    method: "POST",
  });
  return result.data?.records;
};

const updatePatient = async (data) => {
  data.ScreenCode = "BL0001";
  const result = await newAlgaehApi({
    uri: "/frontDesk/update",
    module: "frontDesk",
    data,
    method: "POST",
  });
  return result.data?.records;
};

const updateAppointmentStatus = async (data) => {
  try {
    const result = await newAlgaehApi({
      uri: "/appointment/updateCheckIn",
      method: "PUT",
      module: "frontDesk",
      data,
    });
    return result?.data?.records;
  } catch (error) {
    console.error(error?.message);
  }
};

const generateIdCard = (data) => {
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
        reportName: "patientIDCard",
        reportParams: [
          {
            name: "hims_d_patient_id",
            value: data?.hims_d_patient_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data?.patient_code}-ID Card`;
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${reportName}`;
      window.open(origin);
    },
  });
};

const generateIdCardBig = (data) => {
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
        others: {
          width: "90mm",
          height: "50mm",
          showHeaderFooter: false,
        },
        reportName: "patientCardBig",
        reportParams: [
          {
            name: "visit_id",
            value: data?.patient_visit_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const reportName = `${data?.patient_code}-${data.full_name}-ID Card`;
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=${reportName}`;
      window.open(origin);
    },
  });
};

const generateReceipt = (data) => {
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
        reportName: "cashReceipt",
        reportParams: [
          {
            name: "hims_f_billing_header_id",
            value: data?.hims_f_billing_header_id,
          },
        ],
        outputFileType: "PDF",
      },
    },
    onSuccess: (res) => {
      const urlBlob = URL.createObjectURL(res.data);
      const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}`;
      window.open(origin);
    },
  });
};

export function PatientRegistration() {
  const {
    userLanguage,
    userToken,
    default_visit_type,
    countries = [],
  } = useContext(MainContext);
  const [openPopup, setOpenPopup] = useState(false);
  const [attachmentVisible, setAttachmentVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [showPackage, setShowPackage] = useState(false);
  const [showUpdateModal, setUpdateModal] = useState(false);
  const [showAdvModal, setShowAdvModal] = useState(false);
  const [isInsurance, setIsInsurance] = useState(false);
  const [incomeByOp, setIncomeByOp] = useState("");
  const [incomeByPoint, setIncomeByPoint] = useState("");
  const [loadFromReader, setLoadFromReader] = useState(false);
  const location = useLocation();
  const history = useHistory();

  const patientImage = useRef(null);
  const patientIdCard = useRef(null);
  const insuranceImgFront = useRef(null);
  const insuranceImgBack = useRef(null);

  const isEmpIdRequired = userToken?.requied_emp_id === "Y";
  const queryParams = useQueryParams();
  const patient_code = queryParams.get("patient_code");
  const appointment_id = queryParams.get("appointment_id");
  const status_id = queryParams.get("status_id");

  const {
    department_id,
    sub_department_id,
    services_id,
    doctor_id,
    department_type,
    service_type_id,
    billInfo,
    billData,
    disabled,
    consultationInfo,
    setConsultationInfo,
    setDisable,
    setSavedPatient,
    savedPatient,
    clearState,
    setServiceInfo,
    cardData,
    setFromPackage,
    setPackageDetail,
    from_package,
    package_details,
  } = useContext(FrontdeskContext);
  // console.log(cardData, "cardData");
  const [currentCountry] = countries?.filter(
    (item) => item.hims_d_country_id === userToken?.default_country
  );

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    errors,
    reset,
    setError,
    clearErrors,
    getValues,
    formState,
  } = useForm({
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      nationality_id: userToken?.default_nationality,
      country_id: userToken?.default_country,
      patient_type: userToken?.default_patient_type,
      visit_type: default_visit_type?.hims_d_visit_type_id,
      tel_code: currentCountry?.tel_code,
    },
  });

  const { isLoading, data: patientData, refetch } = useQuery(
    ["patient", { patient_code }],
    getPatient,
    {
      enabled: !!patient_code,
      initialData: {
        bill_criedt: [],
        patientRegistration: null,
        identities: [],
      },
      retry: 0,
      initialStale: true,
      onSuccess: (data) => {
        if (data?.patientRegistration) {
          let patientRegistration = data?.patientRegistration;
          reset({
            ...patientRegistration,
            // consultation: "Y",
            visit_type: default_visit_type?.hims_d_visit_type_id,
          });
        }
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
        history.push(location.pathname);
      },
    }
  );

  const [save, { isLoading: saveLoading }] = useMutation(savePatient, {
    onSuccess: (data) => {
      setSavedPatient(data);
      setDisable(true);
      setOpenPopup(true);

      if (!!appointment_id && !!status_id) {
        const patData = getValues();
        updateAppointmentStatus({
          application_id: appointment_id,
          appointment_status_id: status_id,
          patient_id: data?.hims_d_patient_id,
          patient_code: data?.patient_code,
          tel_code: patData.tel_code,
          contact_number: patData.contact_number,
        }).then(() => {
          AlgaehMessagePop({
            display: "Patient Updated Successfully",
            type: "success",
          });
        });
      } else {
        AlgaehMessagePop({
          display: "Patient Updated Successfully",
          type: "success",
        });
      }
    },
    onError: (err) => {
      if (err.message?.includes("hims_f_patient.primary_id_no_UNIQUE")) {
        AlgaehMessagePop({
          display:
            "Duplicate primary id number, Please provide a new ID number",
          type: "error",
        });
      }
    },
  });

  const [update, { isLoading: updateLoading }] = useMutation(updatePatient, {
    onSuccess: (data) => {
      setSavedPatient(data);
      setDisable(true);
      setOpenPopup(true);
      if (!!appointment_id && !!status_id) {
        const patData = getValues();

        updateAppointmentStatus({
          application_id: appointment_id,
          appointment_status_id: status_id,
          patient_id: data?.hims_d_patient_id,
          patient_code: data?.patient_code,
          tel_code: patData.tel_code,
          contact_number: patData.contact_number,
        }).then(() => {
          AlgaehMessagePop({
            display: "Patient Updated Successfully",
            type: "success",
          });
        });
      } else {
        AlgaehMessagePop({
          display: "Patient Updated Successfully",
          type: "success",
        });
      }
    },
  });

  const { isLoading: appLoading } = useQuery(
    ["appointment-patient", { appointment_id }],
    getPatientFromAppointment,
    {
      enabled: !!appointment_id,
      onSuccess: (data) => {
        const doctor = `${data?.sub_department_id}-${data?.services_id}-${data?.provider_id}-${data?.department_type}-${data?.department_id}-${data?.service_type_id}`;

        if (!patient_code) {
          reset({
            ...data,
            consultation: "Y",
            visit_type: default_visit_type?.hims_d_visit_type_id,
            full_name: data?.patient_name,
            doctor_id: data?.provider_id,
            doctor,
          });
          setServiceInfo(doctor);
        } else {
          setValue("consultation", "Y");
          setValue("doctor", doctor);

          setValue("doctor_id", data?.provider_id);
          setValue("visit_type", 10);
          setServiceInfo(doctor);
        }
      },
    }
  );

  const { isLoading: incomeLoading } = useQuery(
    [
      "income-by-patient",
      { patient_id: patientData?.patientRegistration?.hims_d_patient_id },
    ],
    getIncomeFromPatient,
    {
      onSuccess: (data) => {
        if (data[0].length > 0) {
          setIncomeByOp(data[0][0].op_pat_income);
        }
        if (data[1].length > 0) {
          setIncomeByPoint(data[1][0].pos_pat_income);
          return;
        }
      },
      onError: (err) => {
        AlgaehMessagePop({
          display: err?.message,
          type: "error",
        });
      },
    }
  );

  const {
    data: packages,
    isLoading: packLoading,
    refetch: packRefetch,
  } = useQuery(
    [
      "patient-package",
      { patient_id: patientData?.patientRegistration?.hims_d_patient_id },
    ],
    getPatientPackage,
    {
      enabled: !!patientData?.patientRegistration,
      initialData: [],
      initialStale: true,
    }
  );

  const uploadAfterSubmit = async (data) => {
    const images = [];

    if (
      patientImage?.current !== null &&
      patientImage.current?.state?.fileExtention
    ) {
      images.push(
        new Promise((resolve, reject) => {
          patientImage.current.SavingImageOnServer(
            undefined,
            undefined,
            undefined,
            data?.patient_code,
            () => {
              resolve();
            }
          );
        })
      );
    }
    if (
      patientIdCard.current !== null &&
      patientIdCard.current?.state?.fileExtention
    ) {
      images.push(
        new Promise((resolve, reject) => {
          patientIdCard.current.SavingImageOnServer(
            undefined,
            undefined,
            undefined,
            data?.primary_id_no,
            () => {
              resolve();
            }
          );
        })
      );
    }
    if (data?.primary_insurance_provider_id) {
      if (
        insuranceImgBack.current !== null &&
        insuranceImgBack.current?.state?.fileExtention
      ) {
        images.push(
          new Promise((resolve, reject) => {
            insuranceImgBack.current.SavingImageOnServer(
              undefined,
              undefined,
              undefined,
              data?.primary_id_no,
              () => {
                resolve();
              }
            );
          })
        );
      }
      if (
        insuranceImgFront.current !== null &&
        insuranceImgFront.current?.state?.fileExtention
      ) {
        images.push(
          new Promise((resolve, reject) => {
            insuranceImgFront.current.SavingImageOnServer(
              undefined,
              undefined,
              undefined,
              data?.primary_id_no,
              () => {
                resolve();
              }
            );
          })
        );
      }
    }
    const result = await Promise.all(images);
    return result;
  };

  const insertPatientPortal = (data) => {
    // const result = await newAlgaehApi({
    //   uri: "/appointment/getPatientDetilsByAppId",
    //   module: "frontDesk",
    //   method: "GET",
    //   data: { application_id: appointment_id },
    // });
    // return result?.data?.records;
    debugger;

    data.patient_identity = data.primary_id_no;
    data.patient_name = data.full_name;
    data.patient_dob = data.date_of_birth;
    data.patient_gender = data.gender;
    data.identity_type = data.primary_id_no;
    data.mobile_no = data.contact_number;
    data.email_id = data.email;
    data.hospital_id = data.hospital_id;
    data.age = data.age;
    data.doctor_id = data.ins_doctor_id;
    data.visit_code = data.visit_code;
    data.visit_date = data.visit_date;
    try {
      axios
        .post("http://localhost:4402/api/v1/info/patientRegistration", data)
        .then(function (response) {
          //handle success
          console.log(response);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });
    } catch (error) {
      AlgaehMessagePop({
        display: error,
        type: "error",
      });
    }
  };

  const onSubmit = (input) => {
    let inputData;
    const receiptdetails = [];

    receiptdetails.push({
      amount: input.cash_amount,
      card_check_number: null,
      card_type: null,
      expiry_date: null,
      hims_f_receipt_header_id: null,
      pay_type: "CA",
      updated_date: null,
    });

    if (input?.card_amount > 0) {
      receiptdetails.push({
        amount: input.card_amount,
        card_check_number: cardData.card_number || null,
        bank_card_id: cardData.hims_d_bank_card_id,
        card_type: null,
        expiry_date:
          moment(input.card_date).format("YYYY-MM-DD hh:mm:ss") || null,
        hims_f_receipt_header_id: null,
        pay_type: "CD",
        updated_date: null,
      });
    }
    if (!patient_code) {
      save({
        ...input,
        ...billInfo,
        ...billData,
        age: moment().diff(moment(input?.date_of_birth), "year"),
        department_id: parseInt(department_id, 10),
        sub_department_id: parseInt(sub_department_id, 10),
        services_id: parseInt(services_id, 10),
        service_type_id: parseInt(service_type_id, 10),
        doctor_id: parseInt(doctor_id, 10),
        department_type: parseInt(department_type, 10),
        consultation: consultationInfo?.consultation,
        insured: input?.primary_insurance_provider_id ? "Y" : "N",
        maternity_patient: "N",
        is_mlc: "N",
        existing_plan: "N",
        incharge_or_provider: parseInt(doctor_id, 10),
        receiptdetails,
      }).then(async (data) => {
        await uploadAfterSubmit({ ...data, ...input });
        if (userToken?.portal_exists === "Y") {
          insertPatientPortal({ ...data, ...input });
        }
        if (sockets.connected) {
          sockets.emit("patient_checked", {
            ...data,
            provider_id: doctor_id,
            visit_date: new Date(),
            full_name: input?.full_name,
          });
        }
      });
    } else {
      const {
        advance_adjust,
        sheet_discount_percentage,
        sheet_discount_amount,
        credit_amount,
        cash_amount,
        card_amount,
        card_number,
        card_date,
      } = input;
      inputData = {
        patient_code,
        visit_type: input?.visit_type,
        shift_id: input?.shift_id,
        hims_d_patient_id: patientData?.patientRegistration?.hims_d_patient_id,
        hims_f_patient_id: patientData?.patientRegistration?.hims_d_patient_id,
        patient_id: patientData?.patientRegistration?.hims_d_patient_id,
        data_of_birth: patientData?.patientRegistration?.date_of_birth,
        date_of_birth: patientData?.patientRegistration?.date_of_birth,
        primary_insurance_provider_id: input?.primary_insurance_provider_id,
        primary_sub_id: input?.primary_sub_id,
        primary_network_id: input?.primary_network_id,
        primary_network_office_id: input?.primary_network_office_id,
        primary_policy_num: input?.primary_policy_num,
        primary_card_number: input?.primary_card_number,
        primary_effective_start_date: input?.primary_effective_start_date,
        primary_effective_end_date: input?.primary_effective_end_date,
        insured: input?.primary_insurance_provider_id ? "Y" : "N",
        advance_adjust,
        sheet_discount_percentage,
        sheet_discount_amount,
        credit_amount,
        cash_amount,
        card_amount,
        card_number,
        card_date,
        from_package,
        package_details,
      };
      update({
        ...inputData,
        ...billInfo,
        ...billData,
        advance_amount: patientData?.patientRegistration?.advance_amount,
        department_id: parseInt(department_id, 10),
        sub_department_id: parseInt(sub_department_id, 10),
        services_id: parseInt(services_id, 10),
        service_type_id: parseInt(service_type_id, 10),
        doctor_id: parseInt(doctor_id, 10),
        department_type: parseInt(department_type, 10),
        consultation: consultationInfo?.consultation,
        maternity_patient: "N",
        is_mlc: "N",
        existing_plan: "N",
        incharge_or_provider: parseInt(doctor_id, 10),
        receiptdetails,
      }).then(async (data) => {
        // console.log("In update", data);
        await uploadAfterSubmit({ ...data, ...input });
        if (userToken?.portal_exists === "Y") {
          insertPatientPortal({ ...data, ...input });
        }
        if (sockets.connected) {
          sockets.emit("patient_checked", {
            ...data,
            provider_id: doctor_id,
            visit_date: new Date(),
            full_name: input?.full_name,
          });
        }
      });
    }
  };

  const onClear = (withoutNav) => {
    reset({
      advance_adjust: 0,
      approval_amt: 0,
      arabic_name: "",
      card_amount: "",
      cash_amount: "",
      consultation: "",
      contact_number: "",

      date_of_birth: "",
      department_type: "",
      doctor: "",
      doctor_id: "",
      existing_plan: "",
      full_name: "",
      gender: "",
      is_mlc: "",
      maternity_patient: "",
      primary_card_number: "",
      primary_effective_end_date: "",
      primary_effective_start_date: "",
      primary_id_no: "",
      primary_identity_id: "",
      primary_insurance_provider_id: "",
      primary_network_id: "",
      primary_policy_num: "",
      primary_sub_id: "",
      service_type_id: "",
      address1: "",
      services_id: "",
      sheet_discount_amount: 0,
      sheet_discount_percentage: 0,
      sub_department_id: "",
      title_id: "",
      state_id: null,
      martial_status: null,
      city_id: null,
      religion_id: null,
      visa_type_id: null,
      nationality_id: userToken?.default_nationality,
      country_id: userToken?.default_country,
      patient_type: userToken?.default_patient_type,
      visit_type: default_visit_type?.hims_d_visit_type_id,
      tel_code: currentCountry?.tel_code,
      promo_code: "",
      discount_percentage: 0,
      discount_amount: 0,
    });
    clearState();
    setConsultationInfo(default_visit_type);
    setIsInsurance(false);
    if (patientImage.current) {
      patientImage.current.updateImageInside("", null);
    }
    patientIdCard.current = null;
    // patientImage.current = null;
    insuranceImgBack.current = null;
    insuranceImgFront.current = null;

    if (!withoutNav) {
      history.replace(location.pathname);
    }
  };
  const getFromSmartCard = async () => {
    const res = await axios.get("http://localhost:1212/smartCardReading");

    const {
      AddressEnglish,
      ArabicFullName,
      BirthDate,
      Gender,
      CardexpiryDate,
      EnglishFullName,
      Photo,
      IdNumber,
      ContactNo,
    } = res.data;
    const expDate = parseInt(
      moment(CardexpiryDate, "DD/MM/YYYY").format("YYYYMMDD")
    );
    const todayDate = parseInt(moment().format("YYYYMMDD"));
    if (expDate < todayDate) {
      AlgaehMessagePop({
        display: "Card is expire",
        type: "error",
      });
      return;
    }

    if (patientImage.current) {
      patientImage.current.updateImageInside(
        `data:image/jpeg;base64,${Photo}`,
        "jpeg"
      );
    }
    setLoadFromReader(!loadFromReader);
    reset({
      full_name: EnglishFullName,
      arabic_name: ArabicFullName,
      date_of_birth: moment(BirthDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      address1: AddressEnglish,
      gender: Gender === "M" ? "Male" : Gender === "F" ? "Female" : "Others",
      primary_id_no: IdNumber,
      nationality_id: userToken?.default_nationality,
      country_id: userToken?.default_country,
      patient_type: userToken?.default_patient_type,
      visit_type: default_visit_type?.hims_d_visit_type_id,
      tel_code: currentCountry?.tel_code,
      title_id: Gender === "M" ? 1 : 2,
      contact_number: ContactNo,
    });
  };
  const ClosePackageUtilize = (e) => {
    if (e === undefined || e.services_id === undefined) {
      return;
    }
    // let visit_type = _.find(
    //   $this.props.visittypes,
    //   (f) => f.consultation === "Y"
    // );
    // $this.setState(
    //   {
    //     isPackUtOpen: !input.isPackUtOpen,
    //     hims_d_services_id: e.services_id,
    //     service_type_id: e.service_type_id,
    //     incharge_or_provider: e.doctor_id,
    //     provider_id: e.doctor_id,
    //     doctor_id: e.doctor_id,
    //     sub_department_id: e.sub_department_id,
    //     visit_type: visit_type.hims_d_visit_type_id,
    //     package_details: e.package_details,
    //     from_package: ,
    //     visittypeselect: true,
    //     utilize_amount: e.utilize_amount,
    //     balance_amount: e.balance_amount,
    //     actual_utilize_amount: e.actual_utilize_amount,
    //     consultation: "Y",
    //     hims_f_package_header_id: e.hims_f_package_header_id,
    //     saveEnable: false,
    //     billdetail: false,
    //     new_visit_patient: "P"
    //   },
    //   () => {
    // generateBillDetails($this);

    // }
    // );

    // let input = getValues();
    // let zeroBill = false;
    // let DoctorVisits = Enumerable.from(patientData?.visitDetails)
    //   .where((w) => w.doctor_id === e.doctor_id)
    //   .toArray();

    // let FollowUp = false;
    // let currentDate = moment(new Date()).format("YYYY-MM-DD");
    // let expiryDate = 0;
    // if (DoctorVisits.length > 0) {
    //   expiryDate = Enumerable.from(DoctorVisits).max(
    //     (s) => s.visit_expiery_date
    //   );
    // }
    // let from_package = e.package_utilize === true ? false : true;
    // if (
    //   (e.department_type === "D" && input.existing_plan === "Y") ||
    //   from_package === true
    // ) {
    //   zeroBill = true;
    // } else {
    //   if (expiryDate > currentDate) {
    //     FollowUp = true;
    //   }
    // }

    // let serviceInput = [
    //   {
    //     zeroBill: zeroBill,
    //     FollowUp: FollowUp,
    //     insured: input.insured ? input.insured : "N",
    //     vat_applicable: input.vat_applicable ? input.vat_applicable : "N",
    //     service_type_id: e.service_type_id,
    //     hims_d_services_id: e.services_id,
    //     primary_insurance_provider_id: input.primary_insurance_provider_id,
    //     primary_network_office_id: input.primary_network_office_id,
    //     primary_network_id: input.primary_network_id,
    //     sec_insured: input.sec_insured ? input.sec_insured : "N",
    //     secondary_insurance_provider_id: input.secondary_insurance_provider_id,
    //     secondary_network_id: input.secondary_network_id,
    //     secondary_network_office_id: input.secondary_network_office_id,
    //   },
    // ];

    // AlgaehLoader({ show: true });
    const doctor = `${e.sub_department_id}-${e.services_id}-${e.doctor_id}-${
      e.department_type
    }-${e?.department_id}-${"1"}`;
    const service = `${e.sub_department_id}-${e.services_id}-${e.doctor_id}-${e.department_type}-${e?.department_id}-${e.service_type_id}`;

    setValue("doctor", doctor);
    setValue("doctor_id", e.doctor_id);
    setFromPackage(!e.package_utilize);
    setPackageDetail(e.package_details);

    setServiceInfo(service);
    // algaehApiCall({
    //   uri: "/billing/getBillDetails",
    //   module: "billing",
    //   method: "POST",
    //   data: serviceInput,
    //   onSuccess: (response) => {
    //     if (response.data.success) {
    //       response.data.records.follow_up = FollowUp;
    //       response.data.records.existing_treat = zeroBill;
    //       // reset({ ...response.data.records });

    //       algaehApiCall({
    //         uri: "/billing/billingCalculations",
    //         module: "billing",
    //         method: "POST",
    //         data: response.data.records,
    //         onSuccess: (response) => {
    //           if (response.data.success) {
    //             // if (context !==null) {
    //             //   context.updateState({ ...response.data.records });
    //             // }
    //             // if (input.default_pay_type === "CD") {
    //             //   response.data.records.card_amount =
    //             //     response.data.records.receiveable_amount;
    //             //   response.data.records.cash_amount = 0;
    //             // }

    //             // reset({ ...response.data.records });
    //           }
    //           // AlgaehLoader({ show: false });
    //         },
    //         onFailure: (error) => {
    //           // AlgaehLoader({ show: false });
    //           AlgaehMessagePop({
    //             display: error.message,
    //             type: "error",
    //           });
    //         },
    //       });
    //     }
    //   },
    //   onFailure: (error) => {
    //     // AlgaehLoader({ show:  false });
    //     AlgaehMessagePop({
    //       display: error.message,
    //       type: "error",
    //     });
    //   },
    // });
  };
  return (
    <Spin
      spinning={
        isLoading ||
        packLoading ||
        saveLoading ||
        appLoading ||
        updateLoading ||
        incomeLoading
      }
    >
      <div id="attach">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ fieldName: "form_patregister", align: "ltr" }}
            />
          }
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ fieldName: "patient_code", returnText: true }}
              />
            ),
            value: patient_code || savedPatient?.patient_code,
            selectValue: "patient_code",
            events: {
              onChange: (code) => {
                onClear(true);
                history.push(`${location.pathname}?patient_code=${code}`);
              },
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: isEmpIdRequired
                ? "frontDesk.emp_id_patients"
                : "frontDesk.patients",
            },
            searchName: "patients",
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    fieldName: "registered_date",
                  }}
                />
                <h6>{moment().format("DD-MM-YYYY")}</h6>
              </div>

              <AlgaehSecurityComponent componentCode="PAT_SMT_CRD">
                <div className="col">
                  {/* PAT_SMT_CRD */}
                  <button
                    style={{ marginTop: 5 }}
                    className="btn btn-default btn-small"
                    onClick={getFromSmartCard}
                  >
                    <AlgaehLabel
                      label={{
                        fieldName: "smart_card",
                        align: "ltr",
                      }}
                    />
                  </button>
                </div>
              </AlgaehSecurityComponent>
            </div>
          }
          editData={{
            events: {
              onClick: () => {
                if (!!patient_code || !!savedPatient?.patient_code) {
                  setUpdateModal(true);
                }
              },
            },
          }}
          attachments={{
            onClick: () => {
              if (!!patient_code || !!savedPatient?.patient_code) {
                setAttachmentVisible(true);
              }
            },
          }}
          printArea={
            !!savedPatient?.patient_visit_id
              ? {
                  menuitems: [
                    {
                      label: "ID Card",
                      events: {
                        onClick: () => {
                          generateIdCard(
                            patientData?.patientRegistration || savedPatient
                          );
                        },
                      },
                    },
                    {
                      label: "Advance/Refund Receipt",
                      events: {
                        onClick: () => {
                          setShowAdvModal(true);
                        },
                      },
                    },
                    // Suhail Print Sticker

                    {
                      label: "Patient Info Card",
                      events: {
                        onClick: () => {
                          generateIdCardBig({
                            ...savedPatient,
                            ...patientData?.patientRegistration,
                          });
                        },
                      },
                    },
                  ],
                }
              : {
                  menuitems: [
                    {
                      label: "ID Card",
                      events: {
                        onClick: () => {
                          generateIdCard(
                            patientData?.patientRegistration || savedPatient
                          );
                        },
                      },
                    },
                    {
                      label: "Advance/Refund Receipt",
                      events: {
                        onClick: () => {
                          setShowAdvModal(true);
                        },
                      },
                    },
                  ],
                }
          }
          selectedLang={userLanguage}
        />
        <div className="spacing-push" style={{ marginBottom: "3rem" }}>
          <form>
            <div className="row">
              <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-8">
                <Demographics
                  control={control}
                  setValue={setValue}
                  errors={errors}
                  clearErrors={clearErrors}
                  patientImage={patientImage}
                  patientIdCard={patientIdCard}
                  incomeByOp={incomeByOp}
                  incomeByPoint={incomeByPoint ? incomeByPoint : "0"}
                  isEmpIdRequired={isEmpIdRequired}
                  loadFromReader={loadFromReader}
                />
                <InsuranceDetails
                  isInsurance={isInsurance}
                  setIsInsurance={setIsInsurance}
                  control={control}
                  trigger={trigger}
                  errors={errors}
                  clearErrors={clearErrors}
                  setValue={setValue}
                  insuranceImgFront={insuranceImgFront}
                  insuranceImgBack={insuranceImgBack}
                />
                <VisitDetails
                  control={control}
                  trigger={trigger}
                  setValue={setValue}
                  visits={patientData?.visitDetails}
                  patientData={patientData}
                  packages={packages}
                  errors={errors}
                />
              </div>
              <PricingModals
                onClose={() => {
                  setPriceModalVisible(false);
                }}
                visible={priceModalVisible}
              />
              <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-4">
                <BillDetails
                  control={control}
                  setError={setError}
                  trigger={trigger}
                  setValue={setValue}
                  clearErrors={clearErrors}
                  errors={errors}
                  patient={patientData?.patientRegistration}
                />
              </div>
            </div>
            <div className="hptl-phase1-footer">
              <div className="row">
                <div className="col-4 leftBtnGroup">
                  <AlgaehSecurityComponent componentCode="VEW_PRS_LST">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => {
                        setPriceModalVisible(true);
                      }}
                    >
                      <AlgaehLabel
                        label={{
                          fieldName: "btnViewPriceList",
                          returnText: true,
                        }}
                      />
                    </button>
                  </AlgaehSecurityComponent>
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.persist();
                      e.preventDefault();
                      trigger().then(() => {
                        if (errors?.unbalanced) {
                          AlgaehMessagePop({
                            type: "Warning",
                            display: errors?.unbalanced?.message,
                          });
                          return null;
                        } else if (Object.keys(errors).length) {
                          AlgaehMessagePop({
                            type: "Warning",
                            display: "Please fill all the mandatory field.",
                          });
                          return null;
                        }
                        handleSubmit(onSubmit)(e);
                      });
                    }}
                    disabled={disabled}
                  >
                    <AlgaehLabel
                      label={{ fieldName: "btn_save", returnText: true }}
                    />
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => onClear(false)}
                    disabled={
                      !disabled &&
                      !appointment_id &&
                      !patient_code &&
                      !formState.isDirty
                    }
                  >
                    <AlgaehLabel
                      label={{ fieldName: "btn_clear", returnText: true }}
                    />
                  </button>

                  <AdvanceModal patient={patientData?.patientRegistration} />
                  {!!savedPatient && ( // eslint-disable-line
                    <>
                      <button
                        type="button"
                        className="btn btn-other"
                        onClick={() => {
                          onClear(true);
                          history.replace(location.pathname);
                          history.push(
                            `/OPBilling?patient_code=${
                              patient_code || savedPatient?.patient_code
                            }`
                          );
                        }}
                      >
                        <AlgaehLabel
                          label={{
                            forceLabel: "Go to Billing",
                          }}
                        />
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => generateReceipt(savedPatient)}
                      >
                        Print Receipt
                      </button>
                    </>
                  )}

                  {!!patientData && packages?.length > 0 ? (
                    <div className="col">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowPackage(true)}
                      >
                        View Package
                      </button>
                      <PackageUtilize
                        open={showPackage}
                        onClose={(e) => {
                          packRefetch(e).then(
                            () => ClosePackageUtilize(e),
                            setShowPackage(false)
                          );
                        }}
                        package_detail={packages}
                        from="frontDesk"
                        from_billing={true}
                        patient_id={
                          patientData?.patientRegistration?.hims_d_patient_id
                        }
                      />
                    </div>
                  ) : null}
                </div>
                {!!savedPatient && consultationInfo?.consultation === "Y" ? (
                  <CSSTransition
                    in={openPopup}
                    classNames={{
                      enterActive: "editFloatCntr animated slideInUp faster",
                      enterDone: "editFloatCntr",
                      exitActive: "editFloatCntr animated slideOutDown faster",
                      exitDone: "editFloatCntr",
                    }}
                    unmountOnExit
                    appear={false}
                    timeout={500}
                    mountOnEnter
                  >
                    <div className={"col-12"}>
                      {/* <h5>Edit Basic Details</h5> */}
                      <div className="row">
                        <div className="col-3">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Patient Code",
                            }}
                          />
                          <h6>{savedPatient?.patient_code}</h6>
                        </div>

                        <div className="col-3">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Bill Number",
                            }}
                          />
                          <h6>{savedPatient?.bill_number}</h6>
                        </div>

                        <div className="col-3">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Receipt Number",
                            }}
                          />
                          <h6>{savedPatient?.receipt_number}</h6>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => generateReceipt(savedPatient)}
                          >
                            Print Receipt
                          </button>
                          <button
                            type="button"
                            className="btn btn-default"
                            onClick={() => setOpenPopup(false)}
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn btn-default"
                            onClick={() => generateIdCard(savedPatient)}
                          >
                            Print Card
                          </button>
                        </div>
                      </div>
                    </div>
                  </CSSTransition>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </div>
      {(!!patient_code || !!savedPatient?.patient_code) && (
        <>
          <UpdatePatient
            onClose={(isUpdated) => {
              if (isUpdated) {
                refetch();
              }
              setUpdateModal(false);
            }}
            patient_code={patient_code || savedPatient?.patient_code}
            show={showUpdateModal}
          />
          <PatientAttachments
            onClose={() => {
              setAttachmentVisible(false);
            }}
            patientData={patientData?.patientRegistration}
            visible={attachmentVisible}
          />
          <AdvanceRefundListModal
            show={showAdvModal}
            onClose={() => setShowAdvModal(false)}
            selectedLang={userLanguage}
            HeaderCaption={
              <AlgaehLabel
                label={{
                  // fieldName: "advance_caption",
                  forceLabel: "Advance/Refund List",
                  align: "ltr",
                }}
              />
            }
            Advance={true}
            NumberLabel="receipt_number"
            DateLabel="receipt_date"
            inputsparameters={
              patient_code
                ? {
                    patient_code: patient_code,
                    full_name: patientData?.patientRegistration?.full_name,
                    hims_f_patient_id:
                      patientData?.patientRegistration?.hims_d_patient_id,
                  }
                : !!savedPatient
                ? {
                    patient_code: savedPatient?.patient_code,
                    full_name: savedPatient?.full_name,
                    hims_f_patient_id: savedPatient?.hims_d_patient_id,
                  }
                : {}
            }
          />
        </>
      )}
    </Spin>
  );
}
