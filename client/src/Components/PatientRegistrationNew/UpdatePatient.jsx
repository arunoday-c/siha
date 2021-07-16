import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Demographics } from "./Demographics";
import { useForm } from "react-hook-form";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";

// import { useHistory, useLocation } from "react-router-dom";
import {
  AlgaehModal,
  AlgaehMessagePop,
  MainContext,
  AlgaehLabel,
  Spin,
} from "algaeh-react-components";

import { swalMessage } from "../../utils/algaehApiCall.js";
import { newAlgaehApi } from "../../hooks";
import { getPatient } from "./PatientRegistration";
// import axios from "axios";

const updatePatient = async (data) => {
  const res = await newAlgaehApi({
    uri: "/patientRegistration/updatePatientData",
    method: "PUT",
    module: "frontDesk",
    data,
  });
  console.log("res.data", res.data);
  return res.data?.records;
};

export function UpdatePatient({
  show,
  onClose,
  patient_code,
  identity_type,
  component = false,
}) {
  // const PORTAL_HOST = process.env.REACT_APP_PORTAL_HOST;
  const { userToken, userLanguage } = useContext(MainContext);
  const [patientCode, setPatientCode] = useState(null);

  // const patientData = queryCache.getQueryData(["patient", { patient_code }]);
  const { isLoading, data: patientData } = useQuery(
    ["patient", { patient_code: patientCode }],
    getPatient,
    {
      enabled: !!patientCode,
      initialStale: true,
      initialData: {
        bill_criedt: [],
        patientRegistration: null,
        identities: [],
      },
      onSuccess: (data) => {
        reset(data?.patientRegistration);
      },
    }
  );

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    errors,
    reset,
    clearErrors,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      nationality_id: userToken?.default_nationality,
      country_id: userToken?.default_country,
      patient_type: userToken?.default_patient_type,
    },
  });

  const patientImage = useRef(null);
  const patientIdCard = useRef(null);
  const isEmpIdRequired = userToken?.requied_emp_id === "Y";

  useEffect(() => {
    if (show) {
      setPatientCode(patient_code);
    }
    if (!show) {
      reset();
      patientIdCard.current = null;
      patientImage.current = null;
    }
    //eslint-disable-next-line
  }, [patient_code, show]);

  // useEffect(() => {
  //   if ((component || show) && !!patientData) {
  //     reset(patientData?.patientRegistration);
  //   }
  //   if (!show && !component) {
  //     reset();
  //     patientIdCard.current = null;
  //     patientImage.current = null;
  //   }
  //   // eslint-disable-next-line
  // }, [patientData, show, component]);

  const [update, { isLoading: mutationLoading }] = useMutation(updatePatient, {
    onSuccess: (data) => {
      if (!component) {
        onClose(true);
      }
    },
    onError: (err) => {
      if (err.message?.includes("hims_f_patient.primary_id_no_UNIQUE")) {
        swalMessage({
          title: "Duplicate primary id number, Please provide a new ID number",
          type: "error",
        });
      }
    },
  });

  const onSubmit = (e) => {
    debugger;
    update({
      ...e,
      hims_d_patient_id: patientData?.patientRegistration?.hims_d_patient_id,
      portal_exists: userToken?.portal_exists,
      identity_type: identity_type,
      patient_code: patient_code,
    }).then(async (data) => {
      if (data === undefined) {
        return;
      }

      const images = [];

      // if (userToken?.portal_exists === "Y") {
      //   const portal_data = {
      //     patient_identity: e.primary_id_no,
      //     patient_code: patient_code,
      //     identity_type: identity_type,
      //     patient_name: e.full_name,
      //     patient_dob: e.date_of_birth,
      //     patient_gender: e.gender,
      //     mobile_no: `${e.tel_code}${e.contact_number}`,
      //     email_id: e.email,
      //   };
      //   try {
      //     axios
      //       .post(`${PORTAL_HOST}/info/updatepatientRegistration`, portal_data)
      //       .then(function (response) {
      //         //handle success
      //         console.log(response);
      //       })
      //       .catch(function (response) {
      //         //handle error
      //         console.log(response);
      //       });
      //   } catch (error) {
      //     AlgaehMessagePop({
      //       display: error,
      //       type: "error",
      //     });
      //   }
      // }
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
      const result = await Promise.all(images);
      AlgaehMessagePop({
        display: "Patient details updated successfully",
        type: "success",
      });
      return result;
    });
  };

  const InputForm = (
    <Demographics
      control={control}
      setValue={setValue}
      getValues={getValues}
      errors={errors}
      clearErrors={clearErrors}
      patientImage={patientImage}
      patientIdCard={patientIdCard}
      inModal={true}
      isEmpIdRequired={isEmpIdRequired}
    />
  );

  if (!component) {
    return (
      <AlgaehModal
        title="Update Patient"
        visible={show}
        okButtonProps={{
          loading: isLoading,
          className: "btn btn-primary",
        }}
        okText={"Update"}
        maskClosable={false}
        cancelButtonProps={{
          disabled: isLoading,
          className: "btn btn-default",
        }}
        closable={true}
        onCancel={() => onClose(false)}
        onOk={handleSubmit(onSubmit)}
        //btn btn-primary
        // btn btn-default
        width={1080}
        className={`${userLanguage}_comp row algaehNewModal patientUpdateModal`}
      >
        <Spin spinning={isLoading || mutationLoading}>{InputForm}</Spin>
      </AlgaehModal>
    );
  } else {
    return (
      <>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Update Patient Details", align: "ltr" }}
            />
          }
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ fieldName: "patient_code", returnText: true }}
              />
            ),
            value: patientCode,
            selectValue: "patient_code",
            events: {
              onChange: (code) => setPatientCode(code),
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "frontDesk.patients",
            },
            searchName: "patients",
          }}
          printArea={{
            menuitems: [
              {
                label: "ID Card",
                events: {
                  onClick: () => {},
                },
              },
            ],
          }}
          selectedLang={userToken?.userLanguage}
        />
        <div style={{ marginTop: "6rem" }}>{InputForm}</div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading || mutationLoading || !patientCode}
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_save", returnText: true }}
                />
              </button>

              <button
                type="button"
                className="btn btn-default"
                disabled={isLoading || mutationLoading}
                onClick={() => {
                  reset({
                    address1: "",
                    address2: null,
                    advance_amount: null,
                    age: null,
                    arabic_name: "",
                    city_id: null,
                    contact_number: "",
                    country_id: "",
                    date_of_birth: "",
                    email: null,
                    emergency_contact_name: null,
                    emergency_contact_number: null,
                    employee_id: null,
                    first_name: "",
                    full_name: "",
                    gender: "",
                    hims_d_patient_id: null,
                    last_name: "",
                    marital_status: "",
                    middle_name: "",
                    nationality_id: "",
                    patient_code: "",
                    patient_type: "",
                    photo_file: null,
                    postal_code: null,
                    primary_id_file: null,
                    primary_id_no: "",
                    primary_identity_id: "",
                    registration_date: "",
                    relationship_with_patient: "",
                    religion_id: "",
                    secondary_contact_number: "",
                    secondary_id_file: "",
                    secondary_id_no: "",
                    secondary_identity_id: "",
                    state_id: null,
                    title_id: "",
                    visa_type_id: "",
                  });
                  setPatientCode(null);
                  patientIdCard.current = null;
                  patientImage.current = null;
                }}
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_clear", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
