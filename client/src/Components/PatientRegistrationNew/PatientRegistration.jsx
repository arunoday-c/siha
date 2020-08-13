import React, { useContext } from "react";
import { useQuery, useMutation } from "react-query";
import { useForm } from "react-hook-form";
import moment from "moment";
import { useLocation, useHistory } from "react-router-dom";
import { FrontdeskContext } from "./FrontdeskContext";
import {
  MainContext,
  AlgaehLabel,
  Spin,
  AlgaehMessagePop,
} from "algaeh-react-components";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import { useQueryParams, newAlgaehApi } from "../../hooks";
import { Demographics } from "./Demographics";
import { InsuranceDetails } from "./InsuranceDetails";
import { VisitDetails } from "./VisitDetail";
import { BillDetails } from "./BillDetails";

const getPatient = async (key, { patient_code }) => {
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
  const result = await newAlgaehApi({
    uri: "/frontDesk/add",
    module: "frontDesk",
    data,
    method: "POST",
  });
  return result.data?.records;
};

export function PatientRegistration() {
  const { userLanguage, userToken } = useContext(MainContext);
  const [save, { isLoading: saveLoading }] = useMutation(savePatient, {
    onSuccess: (data) => {
      setSavedPatient(data);
      setDisable(true);
      AlgaehMessagePop({
        display: "Patient Saved Successfully",
        type: "success",
      });
    },
  });
  const location = useLocation();
  const history = useHistory();
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    errors,
    reset,
    formState,
    clearErrors,
  } = useForm({
    reValidateMode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      nationality_id: userToken?.default_nationality,
      country_id: userToken?.default_country,
      patient_type: userToken?.default_patient_type,
    },
  });

  const {
    sub_department_id,
    services_id,
    doctor_id,
    department_type,
    billInfo,
    disabled,
    consultationInfo,
    setDisable,
    setSavedPatient,
    clearState,
  } = useContext(FrontdeskContext);
  const isEmpIdRequired = userToken?.requied_emp_id === "Y";
  const queryParams = useQueryParams();
  const patient_code = queryParams.get("patient_code");
  console.log(formState, "form");
  const appointment_id = queryParams.get("appointment_id");

  const { isLoading, data: patientData } = useQuery(
    ["patient", { patient_code }],
    getPatient,
    {
      enabled: !!patient_code,
      refetchOnWindowFocus: false,
      initialData: {
        bill_criedt: [],
        patientRegistration: null,
        identities: [],
      },
      retry: 0,
      initialStale: true,
      onSuccess: (data) => {
        if (data?.patientRegistration) {
          reset(data?.patientRegistration);
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

  const { isLoading: appLoading } = useQuery(
    ["appointment-patient", { appointment_id }],
    getPatientFromAppointment,
    {
      enabled: !!appointment_id,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        debugger;
        if (!patient_code) {
          reset({
            ...data,
            consultation: "Y",
            visit_type: 10,
            full_name: data?.patient_name,
            doctor_id: data?.provider_id,
          });
        }
      },
    }
  );

  const { data: packages, isLoading: packLoading } = useQuery(
    [
      "patient-package",
      { patient_id: patientData?.patientRegistration?.hims_d_patient_id },
    ],
    getPatientPackage,
    {
      enabled: !!patientData?.patientRegistration,
      refetchOnWindowFocus: false,
      initialData: [],
      initialStale: true,
    }
  );

  const onSubmit = (input) => {
    save({
      ...input,
      sub_department_id: parseInt(sub_department_id, 10),
      services_id: parseInt(services_id, 10),
      service_type_id: parseInt(services_id, 10),
      doctor_id: parseInt(doctor_id, 10),
      department_type: parseInt(department_type, 10),
      ...billInfo,
      consultation: consultationInfo?.consultation,
      maternity_patient: "N",
      is_mlc: "N",
      existing_plan: "N",
      ...billInfo,
      receiptdetails: [
        {
          amount: billInfo?.receiveable_amount,
        },
      ],
    });
  };

  const onClear = () => {
    // reset({
    //   title_id: "",
    //   full_name: "",
    //   arabic_name: "",
    //   gender: "",
    //   date_of_birth: "",
    //   contact_number: "",
    //   doctor: "",
    //   patient_type: "",
    //   country_id: "",
    //   nationality_id: "",
    //   marital_status: "",
    //   religion_id: "",
    //   visa_type_id: "",
    //   state_id: "",
    //   city_id: "",
    //   address1: "",
    //   primary_identity_id: "",
    //   primary_id_no: "",
    // });
    reset({
      advance_adjust: 0,
      approval_amt: 0,
      arabic_name: "",
      card_amount: "",
      cash_amount: "",
      consultation: "",
      contact_number: "",
      country_id: "",
      date_of_birth: "",
      department_type: "",
      doctor: "",
      doctor_id: "",
      existing_plan: "",
      full_name: "",
      gender: "",
      is_mlc: "",
      maternity_patient: "",
      nationality_id: "",
      patient_type: "",
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
      services_id: "",
      sheet_discount_amount: 0,
      sheet_discount_percentage: 0,
      sub_department_id: "",
      title_id: "",
      visit_type: "",
    });
    clearState();
  };

  return (
    <Spin spinning={isLoading || packLoading || saveLoading || appLoading}>
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
            value: patient_code,
            selectValue: "patient_code",
            events: {
              onChange: (code) =>
                history.push(`${location.pathname}?patient_code=${code}`),
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
            </div>
          }
          editData={{
            events: {
              onClick: () => {},
            },
          }}
          printArea={
            patient_code
              ? {
                  menuitems: [
                    {
                      label: "ID Card",
                      events: {
                        onClick: () => {},
                      },
                    },
                    {
                      label: "Advance/Refund Receipt",
                      events: {
                        onClick: () => {},
                      },
                    },
                  ],
                }
              : ""
          }
          selectedLang={userLanguage}
        />
        <div className="spacing-push">
          <form>
            <div className="row">
              <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-8">
                <Demographics
                  control={control}
                  setValue={setValue}
                  errors={errors}
                  clearErrors={clearErrors}
                />
                <InsuranceDetails
                  control={control}
                  trigger={trigger}
                  errors={errors}
                  clearErrors={clearErrors}
                  setValue={setValue}
                />
                <VisitDetails
                  control={control}
                  trigger={trigger}
                  setValue={setValue}
                  visits={patientData?.visitDetails}
                  packages={packages}
                />
              </div>
              <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-4">
                <BillDetails
                  control={control}
                  trigger={trigger}
                  setValue={setValue}
                  patient={patientData?.patientRegistration}
                />
              </div>
            </div>
            <div className="hptl-phase1-footer">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmit(onSubmit)}
                    disabled={disabled}
                  >
                    <AlgaehLabel
                      label={{ fieldName: "btn_save", returnText: true }}
                    />
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={onClear}
                    disabled={!disabled}
                  >
                    <AlgaehLabel
                      label={{ fieldName: "btn_clear", returnText: true }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Spin>
  );
}
