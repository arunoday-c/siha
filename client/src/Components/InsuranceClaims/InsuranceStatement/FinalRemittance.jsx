import {
  AlgaehFormGroup,
  AlgaehLabel,
  AlgaehMessagePop,
  AlgaehModal,
  Spin,
} from "algaeh-react-components";
import React, { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { newAlgaehApi } from "../../../hooks";

const closeStatement = async ({
  total_remittance_amount,
  total_denial_amount,
  writeoff_amount,
  insurance_status,
  hims_f_insurance_statement_id,
}) => {
  const res = await newAlgaehApi({
    uri: "/insurance/closeStatement",
    module: "insurance",
    data: {
      total_remittance_amount,
      total_denial_amount,
      writeoff_amount,
      insurance_status,
      hims_f_insurance_statement_id,
    },
    method: "PUT",
  });
  return res?.data?.records;
};

export function FinalRemittance({ data, refetch }) {
  const [visible, setVisible] = useState(false);
  const baseState = {
    total_remittance_amount: 0,
    total_denial_amount: 0,
    writeoff_amount: 0,
    insurance_status: "C",
  };
  const [input, setInput] = useState({ ...baseState });
  const [errorMsg, setErrorMsg] = useState(null);

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

  useEffect(() => {
    if (data) {
      debugger;
      setInput((state) => ({
        ...state,
        total_remittance_amount: data?.total_remittance_amount,
        total_denial_amount: data?.total_denial_amount,
      }));
    }
  }, [data]);

  const onSubmit = (e) => {
    closeStat({
      ...e,
      hims_f_insurance_statement_id: data?.hims_f_insurance_statement_id,
    });
  };

  const claim_amount = data?.total_company_payable;

  //   const onChange = (e) => {
  //     const { name, value } = e.target;

  //     switch (name) {
  //       case "total_remittance_amount":
  //         if (value <= claim_amount) {
  //           const denial = claim_amount - value;
  //           setInput((state) => ({
  //             ...state,
  //             total_remittance_amount: value,
  //             total_denial_amount: denial,
  //           }));
  //         }
  //         break;
  //       case "total_denial_amount":
  //           if(value + input?.total_remittance_amount < claim_amount)
  //     }
  //   };

  return (
    <>
      <button className="btn btn-default" onClick={() => setVisible(true)}>
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
            const {
              total_denial_amount,
              total_remittance_amount,
              writeoff_amount,
            } = input;
            const sum =
              parseFloat(total_denial_amount || 0) +
              parseFloat(total_remittance_amount || 0) +
              parseFloat(writeoff_amount || 0);
            debugger;
            if (parseFloat(claim_amount) === sum) {
              onSubmit(input);
            } else {
              AlgaehMessagePop({
                type: "Error",
                display:
                  "Sum of all the entered amount must be equal to Claim amount",
              });
              setErrorMsg(
                "Sum of all the entered amount must be equal to Claim amount"
              );
            }
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
              <AlgaehFormGroup
                div={{ className: "col-6 mandatory" }}
                label={{
                  forceLabel: "Remittance Amount",
                  isImp: true,
                }}
                textBox={{
                  value: input?.total_remittance_amount,
                  onChange: (e) => {
                    let { value } = e.target;
                    const denial = claim_amount - value;
                    setInput((state) => ({
                      ...state,
                      total_remittance_amount: value,
                      total_denial_amount: denial
                        ? parseFloat(denial.toFixed(2))
                        : 0,
                      writeoff_amount: 0,
                    }));
                  },
                  className: "txt-fld",
                  name: "total_remittance_amount",
                  placeholder: "0.00",
                  tabIndex: "2",
                }}
              />
              <AlgaehFormGroup
                div={{ className: "col-6 mandatory" }}
                label={{
                  forceLabel: "Denial Amount",
                  isImp: true,
                }}
                textBox={{
                  value: input?.total_denial_amount,
                  onChange: (e) => {
                    let { value } = e.target;
                    // const remit = claim_amount - value;
                    setInput((state) => ({
                      ...state,
                      total_denial_amount: value,
                      //   total_remittance_amount: remit
                      //     ? parseFloat(remit.toFixed(2))
                      //     : 0,
                      //   writeoff_amount: 0,
                    }));
                  },
                  className: "txt-fld",
                  name: "total_denial_amount",
                  placeholder: "0.00",
                  tabIndex: "2",
                }}
              />
              <AlgaehFormGroup
                div={{ className: "col-6 mandatory" }}
                label={{
                  forceLabel: "Write-Off Amount",
                  isImp: false,
                }}
                textBox={{
                  value: input?.writeoff_amount,
                  onChange: (e) => {
                    let { value } = e.target;
                    setInput((state) => ({
                      ...state,
                      writeoff_amount: value,
                    }));
                  },
                  className: "txt-fld",
                  name: "writeoff_amount",
                  placeholder: "0.00",
                  tabIndex: "2",
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col offset-1 mt-2">
              <h6 color="red">{errorMsg}</h6>
            </div>
          </div>
        </AlgaehModal>
      </Spin>
    </>
  );
}
