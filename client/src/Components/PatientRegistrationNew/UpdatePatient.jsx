import React, { useContext, useEffect, useRef } from "react";
import { queryCache, useMutation } from "react-query";
import { Demographics } from "./Demographics";
import { useForm } from "react-hook-form";
import {
  AlgaehModal,
  AlgaehMessagePop,
  MainContext,
  Spin,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../hooks";

const updatePatient = async (data) => {
  const res = await newAlgaehApi({
    uri: "/patientRegistration/updatePatientData",
    method: "PUT",
    module: "frontDesk",
    data,
  });
  return res.data?.records;
};

export function UpdatePatient({ show, onClose, patient_code }) {
  const { userToken } = useContext(MainContext);
  const patientData = queryCache.getQueryData(["patient", { patient_code }]);
  const {
    control,
    handleSubmit,
    setValue,
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

  useEffect(() => {
    if (show && !!patientData) {
      reset(patientData?.patientRegistration);
    }
    if (!show) {
      reset();
      patientIdCard.current = null;
      patientImage.current = null;
    }
  }, [patientData, show]);

  const [update, { isLoading }] = useMutation(updatePatient);

  const onSubmit = (e) => {
    debugger;
    update({
      ...e,
      hims_d_patient_id: patientData?.patientRegistration?.hims_d_patient_id,
    }).then(async (data) => {
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
      const result = await Promise.all(images);
      AlgaehMessagePop({
        display: "Patient details updated successfully",
        type: "success",
      });
      return result;
    });
  };

  return (
    <AlgaehModal
      title="Update Patient"
      visible={show}
      okButtonProps={{
        loading: isLoading,
      }}
      okText={"Update"}
      maskClosable={false}
      cancelButtonProps={{ disabled: isLoading }}
      closable={false}
      onCancel={onClose}
      onOk={handleSubmit(onSubmit)}
      width={1080}
    >
      <Spin spinning={isLoading}>
        <Demographics
          control={control}
          setValue={setValue}
          errors={errors}
          clearErrors={clearErrors}
          patientImage={patientImage}
          patientIdCard={patientIdCard}
          inModal={true}
        />
      </Spin>
    </AlgaehModal>
  );
}
