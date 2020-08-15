import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useForm } from "react-hook-form";
import moment from "moment";
import { useLocation, useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
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
import { AdvanceModal } from "./AdvanceRefundModal";

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

const updatePatient = async (data) => {
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
      uri: "/appointment​/updateCheckIn",
      method: "PUT",
      module: "frontDesk",
      data,
    });
    return result?.data?.records;
  } catch (error) {
    console.error(error?.message);
  }
};

export function PatientRegistration() {
  const { userLanguage, userToken } = useContext(MainContext);
  const [openPopup, setOpenPopup] = useState(false);
  const [save, { isLoading: saveLoading }] = useMutation(savePatient, {
    onSuccess: (data) => {
      setSavedPatient(data);
      setDisable(true);
      setOpenPopup(true);
      AlgaehMessagePop({
        display: "Patient Saved Successfully",
        type: "success",
      });
    },
  });
  const [update, { isLoading: updateLoading }] = useMutation(updatePatient, {
    onSuccess: (data) => {
      setSavedPatient(data);
      setDisable(true);
      setOpenPopup(true);
      if (!!appointment_id && !!status_id) {
        updateAppointmentStatus({
          application_id: appointment_id,
          appointment_status_id: status_id,
          patient_id: data?.hims_d_patient_id,
          patient_code: data?.patient_code,
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
  const location = useLocation();
  const history = useHistory();
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    errors,
    reset,
    setError,
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
    savedPatient,
    clearState,
    setServiceInfo,
  } = useContext(FrontdeskContext);
  const isEmpIdRequired = userToken?.requied_emp_id === "Y";
  const queryParams = useQueryParams();
  const patient_code = queryParams.get("patient_code");
  const appointment_id = queryParams.get("appointment_id");
  const status_id = queryParams.get("status_id");

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
        const doctor = `${data?.sub_department_id}-${data?.services_id}-${data?.provider_id}-${data?.department_type}`;
        if (!patient_code) {
          reset({
            ...data,
            consultation: "Y",
            visit_type: 10,
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
        card_check_number: input.card_number || null,
        card_type: null,
        expiry_date: input.card_date || null,
        hims_f_receipt_header_id: null,
        pay_type: "CD",
        updated_date: null,
      });
    }
    if (!patient_code) {
      inputData = { ...input };
      save({
        ...inputData,
        ...billInfo,
        sub_department_id: parseInt(sub_department_id, 10),
        services_id: parseInt(services_id, 10),
        service_type_id: parseInt(services_id, 10),
        doctor_id: parseInt(doctor_id, 10),
        department_type: parseInt(department_type, 10),
        consultation: consultationInfo?.consultation,
        maternity_patient: "N",
        is_mlc: "N",
        existing_plan: "N",
        receiptdetails,
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
        primary_insurance_provider_id: input?.primary_insurance_provider_id,
        primary_sub_id: input?.primary_sub_id,
        primary_network_id: input?.primary_network_id,
        primary_network_office_id: input?.primary_network_office_id,
        primary_policy_num: input?.primary_policy_num,
        primary_card_number: input?.primary_card_number,
        primary_effective_start_date: input?.primary_effective_start_date,
        primary_effective_end_date: input?.primary_effective_end_date,
        advance_adjust,
        sheet_discount_percentage,
        sheet_discount_amount,
        credit_amount,
        cash_amount,
        card_amount,
        card_number,
        card_date,
      };
      update({
        ...inputData,
        ...billInfo,
        advance_amount: patientData?.patientRegistration?.advance_amount,
        sub_department_id: parseInt(sub_department_id, 10),
        services_id: parseInt(services_id, 10),
        service_type_id: parseInt(services_id, 10),
        doctor_id: parseInt(doctor_id, 10),
        department_type: parseInt(department_type, 10),
        consultation: consultationInfo?.consultation,
        maternity_patient: "N",
        is_mlc: "N",
        existing_plan: "N",
        receiptdetails,
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
      date_of_birth: null,
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
      services_id: "",
      sheet_discount_amount: 0,
      sheet_discount_percentage: 0,
      sub_department_id: "",
      title_id: "",
      visit_type: "",
      nationality_id: userToken?.default_nationality,
      country_id: userToken?.default_country,
      patient_type: userToken?.default_patient_type,
    });
    clearState();
    if (!withoutNav) {
      history.push("/PatientRegistration");
    }
  };

  return (
    <Spin
      spinning={
        isLoading || packLoading || saveLoading || appLoading || updateLoading
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
            value: patient_code,
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
        <div className="spacing-push" style={{ marginBottom: "3rem" }}>
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
                  errors={errors}
                />
              </div>
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
                <div className="col-lg-12">
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
                            display:
                              "Please fix all the errors before submitting again",
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
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => onClear(false)}
                    disabled={!disabled && !appointment_id && !patient_code}
                  >
                    <AlgaehLabel
                      label={{ fieldName: "btn_clear", returnText: true }}
                    />
                  </button>
                  <AdvanceModal patient={patientData?.patientRegistration} />
                </div>
                {consultationInfo?.consultation === "Y" ? (
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
                          <button type="button" className="btn btn-primary">
                            Print Receipt
                          </button>
                          <button
                            type="button"
                            className="btn btn-default"
                            onClick={() => setOpenPopup(false)}
                          >
                            Close
                          </button>
                          <button className="btn btn-default">
                            Print Card
                          </button>
                          {consultationInfo.consultation == "Y" && ( // eslint-disable-line
                            <button
                              type="button"
                              className="btn btn-other"
                              onClick={() =>
                                this.props.history.push(
                                  `/OPBilling?bill_code=${savedPatient?.bill_number}`
                                )
                              }
                            >
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Go to Billing",
                                }}
                              />
                            </button>
                          )}
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
    </Spin>
  );
}
