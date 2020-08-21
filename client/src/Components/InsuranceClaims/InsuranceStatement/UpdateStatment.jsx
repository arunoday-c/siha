import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "react-query";
import {
  AlgaehModal,
  AlgaehFormGroup,
  // AlgaehMessagePop,
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
    >
      <div>
        <div className="row">
          <div className="col-6">
            <h5>Invoice Number</h5>
            <p>{data?.invoice_number}</p>
          </div>
        </div>
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
