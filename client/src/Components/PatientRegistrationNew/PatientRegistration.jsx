import React, { useContext, useState, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import { useForm } from "react-hook-form";
import moment from "moment";
import { useLocation, useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FrontdeskContext } from "./FrontdeskContext";
import PackageUtilize from "../PatientProfile/PackageUtilize/PackageUtilize";
import AdvanceRefundListModal from "../AdvanceRefundList/AdvanceRefundListModal";

import { UpdatePatient } from "./UpdatePatient";
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
import { algaehApiCall } from "../../utils/algaehApiCall";

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
  const { userLanguage, userToken, default_visit_type } = useContext(
    MainContext
  );
  const [openPopup, setOpenPopup] = useState(false);
  const [showPackage, setShowPackage] = useState(false);
  const [showUpdateModal, setUpdateModal] = useState(false);
  const [showAdvModal, setShowAdvModal] = useState(false);
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
    billInfo,
    disabled,
    consultationInfo,
    setConsultationInfo,
    setDisable,
    setSavedPatient,
    savedPatient,
    clearState,
    setServiceInfo,
  } = useContext(FrontdeskContext);

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    errors,
    reset,
    setError,
    clearErrors,
    formState,
  } = useForm({
    reValidateMode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      nationality_id: userToken?.default_nationality,
      country_id: userToken?.default_country,
      patient_type: userToken?.default_patient_type,
      visit_type: default_visit_type?.hims_d_visit_type_id,
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

  const [save, { isLoading: saveLoading }] = useMutation(savePatient, {
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

  const { isLoading: appLoading } = useQuery(
    ["appointment-patient", { appointment_id }],
    getPatientFromAppointment,
    {
      enabled: !!appointment_id,
      onSuccess: (data) => {
        const doctor = `${data?.sub_department_id}-${data?.services_id}-${data?.provider_id}-${data?.department_type}-${data?.department_id}`;
        if (!patient_code) {
          reset({
            ...data,
            consultation: "Y",
            visit_type: default_visit_type,
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
      patientImage.current?.state?.fileExtention
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
        patientImage.current?.state?.fileExtention
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
        patientImage.current?.state?.fileExtention
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
        expiry_date:
          moment(input.card_date).format("YYYY-MM-DD hh:mm:ss") || null,
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
        department_id: parseInt(department_id, 10),
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
      }).then(async (data) => await uploadAfterSubmit({ ...data, ...input }));
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
        department_id: parseInt(department_id, 10),
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
      }).then(async (data) => await uploadAfterSubmit({ ...data, ...input }));
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
      nationality_id: userToken?.default_nationality,
      country_id: userToken?.default_country,
      patient_type: userToken?.default_patient_type,
      visit_type: default_visit_type?.hims_d_visit_type_id,
    });
    clearState();
    setConsultationInfo(default_visit_type);
    patientIdCard.current = null;
    patientImage.current = null;
    insuranceImgBack.current = null;
    insuranceImgFront.current = null;

    if (!withoutNav) {
      history.replace("/PatientRegistration");
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
          printArea={
            !!patient_code || !!savedPatient
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
                  patientImage={patientImage}
                  patientIdCard={patientIdCard}
                />
                <InsuranceDetails
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
                    className="btn btn-primary"
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
                        onClose={() => {
                          packRefetch().then(() => setShowPackage(false));
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
