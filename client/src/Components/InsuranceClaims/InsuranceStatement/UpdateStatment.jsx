import React, { useEffect, useContext } from "react";
import "./InsuranceStatement.scss";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "react-query";
import {
  AlgaehLabel,
  AlgaehModal,
  AlgaehFormGroup,
  MainContext,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";

const updateStatement = async (data) => {
  const res = await newAlgaehApi({
    uri: "/insurance/updateInsuranceStatement",
    module: "insurance",
    data,
    method: "PUT",
  });
  return res.data;
};

export function UpdateStatement({
  show = false,
  data = {},
  onClose = () => {},
}) {
  const { control, handleSubmit, reset, errors, setError } = useForm();
  const { userLanguage } = useContext(MainContext);

  const [update, { isLoading }] = useMutation(updateStatement, {
    onSuccess: (data) => {
      if (data?.success) {
        onClose();
      }
    },
  });

  useEffect(() => {
    if (!show) {
      reset({
        remittance_ammount: "",
        denial_ammount: "",
      });
    }
    // eslint-disable-next-line
  }, [show]);

  const onSubmit = (e) => {
    const total =
      parseFloat(e.remittance_ammount) + parseFloat(e.denial_ammount);
    if (total <= parseFloat(data?.company_payable)) {
      update({
        ...e,
        hims_f_invoice_header_id: data?.hims_f_invoice_header_id,
        insurance_statement_id: data?.insurance_statement_id,
      });
    } else {
      setError("remittance_ammount", {
        type: "manual",
        message: "Entered amounts should be less than net payable",
      });
      setError("denial_ammount", {
        type: "manual",
        message: "Entered amounts should be less than net payable",
      });
      // AlgaehMessagePop({
      //   display: "Entered amounts should be less than net payable",
      //   type: "success",
      // });
    }
  };

  return (
    <AlgaehModal
      title="Update Statment"
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
      className={`${userLanguage}_comp row algaehNewModal UpdateStatementModal`}
    >
      <div className="col-12 popupInner margin-top-15">
        <div className="row">
          <div className="col-12">
            <AlgaehLabel
              label={{
                forceLabel: "Patient Name",
              }}
            />
            <h6>{data?.pat_name}</h6>
          </div>
          <div className="col-6">
            <AlgaehLabel
              label={{
                forceLabel: "Patient Code",
              }}
            />
            <h6>{data?.patient_code}</h6>
          </div>
          <div className="col-6">
            <AlgaehLabel
              label={{
                forceLabel: "Invoice Number",
              }}
            />
            <h6>{data?.invoice_number}</h6>
          </div>

          <div className="col-6">
            <AlgaehLabel
              label={{
                forceLabel: "Invoice Date",
              }}
            />
            <h6>{data?.invoice_date}</h6>
          </div>

          <div className="col-6">
            <AlgaehLabel
              label={{
                forceLabel: "Net Company Payable",
              }}
            />
            <h6>{data?.company_payable}</h6>
          </div>
        </div>
        <hr></hr>
        <div className="row">
          <Controller
            control={control}
            name="remittance_ammount"
            rules={{
              required: {
                message: "Field is Required",
                value: true,
              },
            }}
            render={(props) => (
              <AlgaehFormGroup
                div={{
                  className: "col-6 form-group  mandatory",
                }}
                error={errors}
                label={{
                  forceLabel: "Remittance Amount",
                  isImp: true,
                }}
                textBox={{
                  name: "remittance_ammount",
                  type: "number",
                  className: "form-control",
                  ...props,
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="denial_ammount"
            rules={{
              required: {
                message: "Field is Required",
                value: true,
              },
            }}
            render={(props) => (
              <AlgaehFormGroup
                div={{
                  className: "col-6 form-group  mandatory",
                }}
                label={{
                  forceLabel: "Denial Amount",
                  isImp: true,
                }}
                error={errors}
                textBox={{
                  name: "denial_ammount",
                  type: "number",
                  className: "form-control",
                  ...props,
                }}
              />
            )}
          />
        </div>
      </div>
    </AlgaehModal>
  );
}
