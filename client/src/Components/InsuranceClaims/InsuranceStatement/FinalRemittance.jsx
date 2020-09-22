import {
  AlgaehLabel,
  AlgaehMessagePop,
  AlgaehModal,
  Spin,
} from "algaeh-react-components";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { newAlgaehApi } from "../../../hooks";

const closeStatement = async ({
  total_remittance_amount,
  total_denial_amount,
  writeoff_amount,
  insurance_status,
  hims_f_insurance_statement_id,
  total_company_payable,
  insurance_statement_number,
}) => {
  const res = await newAlgaehApi({
    uri: "/resubmission/closeClaim",
    module: "insurance",
    data: {
      total_remittance_amount,
      total_denial_amount,
      writeoff_amount,
      insurance_status,
      hims_f_insurance_statement_id,
      total_company_payable,
      insurance_statement_number,
    },
    method: "POST",
  });
  return res?.data?.records;
};

export function FinalRemittance({ data, refetch }) {
  const [visible, setVisible] = useState(false);

  const [closeStat, { isLoading: mutLoading }] = useMutation(closeStatement, {
    onSuccess: (data) => {
      setVisible(false);
      refetch();
      AlgaehMessagePop({
        type: "success",
        display: "Updated Successfully",
      });
    },
  });

  const onSubmit = () => {
    closeStat({
      total_denial_amount:
        data?.calc_denial_amount ?? data?.total_denial_amount,
      total_remittance_amount:
        data?.calc_remittance_amount ?? data?.total_remittance_amount,
      writeoff_amount: data?.calc_denial_amount ?? data?.total_denial_amount,
      hims_f_insurance_statement_id: data?.hims_f_insurance_statement_id,
      total_company_payable: data?.total_company_payable,
      insurance_statement_number: data?.insurance_statement_number,
      insurance_status: "C",
    });
  };

  const claim_amount = data?.total_company_payable;

  return (
    <>
      <button
        className="btn btn-default"
        onClick={() => setVisible(true)}
        disabled={!data}
      >
        Final Remittance
      </button>
      <Spin spinning={mutLoading}>
        <AlgaehModal
          title="Update Service"
          visible={visible}
          maskClosable={false}
          width={540}
          closable={true}
          okButtonProps={{
            loading: mutLoading,
            className: "btn btn-primary",
          }}
          cancelButtonProps={{
            loading: mutLoading,
            className: "btn btn-default",
          }}
          // onOk={handleSubmit(onUpdate)}
          onCancel={() => setVisible(false)}
          onOk={() => {
            onSubmit();
          }}
        >
          <div className="col-12 popupInner margin-top-15">
            <div className="row">
              <div className="col-6">
                <AlgaehLabel
                  label={{
                    forceLabel: "Claim Amount",
                  }}
                />
                <h6>{claim_amount}</h6>
              </div>
              <div className="col-6">
                <AlgaehLabel
                  label={{
                    forceLabel: "Remittance Amount",
                  }}
                />
                <h6>
                  {data?.calc_remittance_amount ??
                    data?.total_remittance_amount}
                </h6>
              </div>
              <div className="col-6">
                <AlgaehLabel
                  label={{
                    forceLabel: "Denial Amount",
                  }}
                />
                <h6>{data?.calc_denial_amount ?? data?.total_denial_amount}</h6>
              </div>
            </div>
          </div>
        </AlgaehModal>
      </Spin>
    </>
  );
}
