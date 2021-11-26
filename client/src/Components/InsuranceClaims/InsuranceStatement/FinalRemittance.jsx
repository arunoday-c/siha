import {
  AlgaehLabel,
  AlgaehMessagePop,
  AlgaehModal,
  Spin,
  AlgaehFormGroup,
  MainContext,
  AlgaehDateHandler,
} from "algaeh-react-components";
import React, { useEffect, useState, useContext } from "react";
import { useMutation } from "react-query";
import { newAlgaehApi } from "../../../hooks";
import { useForm, Controller } from "react-hook-form";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";

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
  debugger;
  const [visible, setVisible] = useState(false);
  const [post_visible, setPostVisible] = useState(false);
  const [payment_date, setPaymentDate] = useState(new Date());
  const [posted, setPosted] = useState(data?.posted === "N" ? false : true);

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
      total_denial_amount: denial_amount,
      total_remittance_amount: remittance_amount,
      writeoff_amount: denial_amount,
      hims_f_insurance_statement_id: data?.hims_f_insurance_statement_id,
      total_company_payable: data?.total_company_payable,
      insurance_statement_number: data?.insurance_statement_number,
      insurance_status: "C",
    });
  };

  const claim_amount = data?.total_company_payable;
  const { userToken } = useContext(MainContext);
  const {
    reset,
    setValue,
    control,
    errors,
    watch,
    setError,
    clearErrors,
    register,
  } = useForm({
    defaultValues: {
      remittance_amount: data?.calc_remittance_amount,
      denial_amount: data?.calc_remittance_amount,
    },
  });

  const { remittance_amount, denial_amount } = watch();

  useEffect(() => {
    reset({
      remittance_amount: parseFloat(data?.calc_remittance_amount),
      denial_amount: parseFloat(data?.calc_denial_amount),
    });
    //eslint-disable-next-line
  }, [data]);
  function onClickGenerateStatement() {
    algaehApiCall({
      uri: "/insurance/generateInsuranceStatement",
      module: "insurance",
      data: {
        insurance_statement_id: data?.hims_f_insurance_statement_id,
      },
      method: "GET",
      extraHeaders: {
        headers: {
          Accept: "blob",
        },
      },
      others: {
        responseType: "blob",
      },
      onSuccess: (response) => {
        let blob = new Blob([response.data], {
          type: "application/octet-stream",
        });
        var objectUrl = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.setAttribute("href", objectUrl);
        link.setAttribute(
          "download",
          `${data?.insurance_statement_number}.xlsx`
        );
        link.click();
      },
      onCatch: (error) => {
        AlgaehMessagePop({
          type: "error",
          display: error,
        });
      },
    });
  }
  function postTrasaction() {
    debugger;
    algaehApiCall({
      uri: "/insurance/postTrasaction",
      module: "insurance",
      method: "POST",
      data: {
        insurance_statement_id: data?.hims_f_insurance_statement_id,
        payment_date: payment_date,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          swalMessage({
            type: "success",
            title: "Posted Successfully...",
          });
          setPostVisible(false);
          setPosted(true);
        }
      },
    });
  }
  return (
    <>
      <button
        style={{ float: "right" }}
        className="btn btn-primary"
        onClick={() => {
          setPostVisible(true);
        }}
        disabled={data?.posted === "N" ? false : posted}
      >
        Post to Finance
      </button>
      <button
        style={{ float: "right" }}
        className="btn btn-default"
        onClick={onClickGenerateStatement}
        disabled={!data}
      >
        Download Statement
      </button>

      <button
        style={{ float: "right" }}
        className="btn btn-default"
        onClick={() => setVisible(true)}
        disabled={!data}
      >
        Final Remittance
      </button>

      {post_visible ? (
        <AlgaehModal
          className="algaehStatementStyle"
          title={"Confirm Transaction Date"}
          visible={post_visible}
          maskClosable={false}
          closable={false}
          destroyOnClose={true}
          afterClose={() => {
            setPostVisible(false);
          }}
          footer={
            <div>
              <button
                onClick={() => {
                  setPostVisible(false);
                }}
                className="btn btn-default btn-small"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (payment_date) {
                    postTrasaction();
                  } else {
                    swalMessage({
                      type: "warning",
                      title: "please select payment Date first",
                    });
                    return;
                  }
                }}
                className="btn btn-primary btn-small"
                style={{ marginLeft: 5 }}
              >
                Submit Claims
              </button>
            </div>
          }
        >
          <AlgaehDateHandler
            div={{ className: "col-6 algaeh-date-fld" }}
            label={{
              forceLabel: "Transaction Date",
              isImp: true,
            }}
            textBox={{
              name: "payment_date",
              className: "form-control",
              value: payment_date,
            }}
            maxDate={moment().add(1, "days")}
            // others={{
            //   disabled: !enableOP && accountName,
            // }}
            events={{
              onChange: (momentDate) => {
                setPaymentDate(momentDate?.format("YYYY-MM-DD"));
              },
            }}
          />
        </AlgaehModal>
      ) : null}
      <Spin spinning={mutLoading}>
        <AlgaehModal
          title="Final Remittance"
          visible={visible}
          maskClosable={false}
          width={540}
          closable={true}
          cancelButtonProps={{
            loading: mutLoading,
            className: "btn btn-default",
          }}
          okButtonProps={{
            loading: mutLoading,
            className: "btn btn-primary",
          }}
          // onOk={handleSubmit(onUpdate)}
          onCancel={() => setVisible(false)}
          onOk={() => {
            onSubmit();
          }}
          className={`row algaehNewModal finalRemittanceModal`}
        >
          <div className="col-12 popupInner margin-top-15">
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Claim Amount",
                  }}
                />
                <h6>{claim_amount}</h6>
              </div>
              <i className="fas fa-minus calcSybmbol"></i>
              <Controller
                control={control}
                name="remittance_amount"
                rules={{ required: true }}
                render={({ value, onChange }) => (
                  <AlgaehFormGroup
                    div={{ className: "col-6 mandatory" }}
                    label={{
                      forceLabel: "Remittance Amount",
                      isImp: true,
                    }}
                    error={errors}
                    textBox={{
                      value,
                      onChange: (e) => {
                        let { value } = e.target;

                        if (value) {
                          if (parseFloat(value) <= claim_amount) {
                            onChange(value);
                            let denial_amount =
                              claim_amount - parseFloat(value);
                            denial_amount = denial_amount
                              ? denial_amount.toFixed(userToken.decimal_places)
                              : 0;
                            setValue("denial_amount", denial_amount, {
                              shouldValidate: true,
                            });
                            clearErrors();
                          } else {
                            setError("remittance_amount", {
                              type: "manual",
                              message:
                                "Remittance Should be less than or equal to claim amount",
                            });
                          }
                        } else {
                          onChange("");
                          setValue("denial_amount", "");
                        }
                      },
                      className: "txt-fld",
                      name: "remittance_amount",
                      placeholder: "0.00",
                      tabIndex: "2",
                    }}
                  />
                )}
              />
              <i className="fas fa-equals calcSybmbol"></i>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Denial Amount",
                  }}
                />
                <h6 ref={register({ name: "denial_amount" })}>
                  {denial_amount}
                </h6>
              </div>

              {/* <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Remittance Amount",
                  }}
                />
                <h6>
                  {data?.calc_remittance_amount ??
                    data?.total_remittance_amount}
                </h6>
              </div> */}
            </div>
          </div>
        </AlgaehModal>
      </Spin>
    </>
  );
}
