//eslint-disable
import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useWatch, Controller } from "react-hook-form";
import moment from "moment";
import {
  MainContext,
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehDateHandler,
  Spin,
  AlgaehMessagePop,
} from "algaeh-react-components";
import { useLangFieldName, useCurrency } from "./patientHooks";
import { newAlgaehApi } from "../../hooks/";
import { FrontdeskContext } from "./FrontdeskContext";
import { BillDetailModal } from "./BillDetailModal";

const getBillDetails = async (
  key,
  {
    services_id,
    service_type_id,
    nationality_id,
    default_nationality,
    local_vat_applicable,
    primary_insurance_provider_id,
    primary_network_id,
    primary_network_office_id,
    prevVisits,
    consultation,
  }
) => {
  let zeroBill = false,
    FollowUp = false;

  if (consultation !== "Y") {
    zeroBill = true;
  }

  if (!!prevVisits && prevVisits.length) {
    zeroBill = true;
    FollowUp = false;
  }

  const details = await newAlgaehApi({
    uri: "/billing/getBillDetails",
    module: "billing",
    method: "POST",
    data: [
      {
        hims_d_services_id: parseInt(services_id, 10),
        service_type_id: parseInt(service_type_id, 10),
        zeroBill,
        FollowUp,
        insured: primary_insurance_provider_id ? "Y" : "N",
        primary_insurance_provider_id,
        primary_network_id,
        primary_network_office_id,
        vat_applicable:
          default_nationality == nationality_id ? local_vat_applicable : "Y",
      },
    ],
  });
  return details?.data?.records;
};

const getShiftMappings = async () => {
  const res = await newAlgaehApi({
    uri: "/shiftAndCounter/getCashiersAndShiftMAP",
    module: "masterSettings",
    method: "GET",
    data: { for: "T" },
  });
  return res.data?.records;
};

const checkVisits = async (
  key,
  { sub_department_id, doctor_id, patient_id }
) => {
  const res = await newAlgaehApi({
    uri: "/visit/checkVisitExists",
    module: "frontDesk",
    method: "GET",
    data: { sub_department_id, doctor_id, patient_id },
  });
  return res.data?.records;
};

export function BillDetails({
  control,
  trigger,
  setValue,
  patient = null,
  setError,
  clearErrors,
  errors,
}) {
  const { amountWithCur } = useCurrency();
  const [enableCash, setEnableCash] = useState(true);
  const [enableCard, setEnableCard] = useState(false);
  const [visible, setVisible] = useState(false);
  const { userToken } = useContext(MainContext);
  const {
    default_nationality,
    local_vat_applicable,
    service_dis_percentage,
  } = userToken;
  const {
    services_id,
    service_type_id,
    sub_department_id,
    doctor_id,
    primary_network_office_id,
    setBillInfo,
    setBillData: setGlobalBillData,
    disabled: globalDisable,
    savedPatient,
    consultationInfo,
  } = useContext(FrontdeskContext);
  // const disabled = !!bill_number && !!receipt_number;
  const { fieldNameFn } = useLangFieldName();
  const {
    nationality_id,
    primary_insurance_provider_id,
    primary_network_id,
  } = useWatch({
    control,
    name: [
      "nationality_id",
      "primary_insurance_provider_id",
      "primary_network_id",
    ],
  });

  const { isLoading: visitLoading, data: prevVisits } = useQuery(
    [
      "checkVisits",
      { sub_department_id, doctor_id, patient_id: patient?.hims_d_patient_id },
    ],
    checkVisits,
    {
      enabled: !!patient && !!doctor_id,
      onSuccess: (data) => {
        console.log(data, "visit");
      },
    }
  );

  const { isLoading: infoLoading, data: billInfo } = useQuery(
    [
      "billdetails",
      {
        services_id,
        service_type_id,
        nationality_id,
        primary_insurance_provider_id,
        primary_network_id,
        primary_network_office_id,
        default_nationality,
        local_vat_applicable,
        prevVisits,
        consultation: consultationInfo?.consultation,
      },
    ],
    getBillDetails,
    {
      enabled: !!services_id,
      retry: 3,
      onSuccess: (data) => {
        setGlobalBillData(data);
        calculateBillDetails(data?.billdetails[0]);
      },
    }
  );

  const [billData, setBillData] = useState(null);

  const disabled = globalDisable || !billData;

  useEffect(() => {
    if (billData) {
      setBillData(null);
    }
    //eslint-disable-next-line
  }, [services_id]);

  function calculateBillDetails(billData = {}) {
    const sendingObject = { ...billData };

    // Sheet Level Discount Nullify
    sendingObject.sheet_discount_amount = 0;
    sendingObject.sheet_discount_percentage = 0;
    sendingObject.advance_adjust = 0;
    sendingObject.net_amount = billData?.patient_payable;
    sendingObject.receiveable_amount = billData?.patient_payable;

    //Reciept
    sendingObject.cash_amount = sendingObject.net_amount;
    sendingObject.total_amount = sendingObject.net_amount;
    sendingObject.sub_total_amount = sendingObject.net_amount;
    sendingObject.gross_total = sendingObject.net_amount;

    sendingObject.unbalanced_amount = 0;
    sendingObject.card_amount = 0;

    sendingObject.balance_credit = 0;
    sendingObject.patient_payable = sendingObject.patient_payable.toFixed(2);
    sendingObject.total_tax = sendingObject.total_tax.toFixed(2);
    sendingObject.patient_tax = sendingObject.patient_tax.toFixed(2);
    sendingObject.company_tax = sendingObject.company_tax.toFixed(2);
    sendingObject.net_tax =
      parseFloat(sendingObject.patient_tax) +
      parseFloat(sendingObject.company_tax);
    sendingObject.company_payable = sendingObject.company_payble;
    sendingObject.sec_company_tax = sendingObject.sec_company_tax.toFixed(2);
    sendingObject.patient_res = sendingObject.patient_resp;
    sendingObject.company_res = sendingObject.company_resp;
    setBillInfo(billData);
    setBillData(sendingObject);
  }

  useEffect(() => {
    if (billData) {
      setValue("advance_adjust", billData?.advance_adjust);
      setValue(
        "sheet_discount_percentage",
        billData?.sheet_discount_percentage
      );
      setValue("sheet_discount_amount", billData?.sheet_discount_amount);
      setValue("credit_amount", billData?.credit_amount);
      setValue("cash_amount", billData?.cash_amount);
      setValue("card_amount", billData?.card_amount);
      setValue("card_number", billData?.card_number);
      setValue("card_date", billData?.card_date);
      setBillInfo(billData);
      if (billData?.unbalanced_amount !== 0) {
        setError("unbalanced", {
          type: "manual",
          message: "Unbalanced Amount should be zero",
        });
      } else {
        clearErrors("unbalanced");
      }
    }
    //eslint-disable-next-line
  }, [billData]);

  const { isLoading: shiftLoading, data: shiftMappings } = useQuery(
    "userMappings",
    getShiftMappings,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: 3,
      onError: (err) => {
        console.log(err);
      },
    }
  );

  useEffect(() => {
    if (shiftMappings?.length) {
      setValue("shift_id", shiftMappings[0]?.shift_id);
    }
    //eslint-disable-next-line
  }, [shiftMappings, billInfo]);

  useEffect(() => {
    if (billData) {
      if (!enableCash) {
        setBillData((state) => {
          state.cash_amount = 0;
          state.unbalanced_amount =
            state?.receiveable_amount - state?.cash_amount - state?.card_amount;
          return { ...state };
        });
      }
    }
    //eslint-disable-next-line
  }, [enableCash]);

  useEffect(() => {
    if (billData) {
      if (!enableCard) {
        setBillData((state) => {
          state.card_amount = 0;
          state.unbalanced_amount =
            state.receiveable_amount - state.cash_amount - state.card_amount;
          return { ...state };
        });
      }
    }
    //eslint-disable-next-line
  }, [enableCard]);

  const follow_up = !!prevVisits?.length;

  return (
    <Spin spinning={infoLoading || shiftLoading || visitLoading}>
      <BillDetailModal
        visible={visible}
        onClose={() => setVisible(false)}
        billData={billData}
        title={
          <AlgaehLabel
            label={{
              fieldName: "bill_details",
              align: "ltr",
            }}
          />
        }
      />
      <div className="hptl-phase1-fd-billing-form">
        <div className="row">
          <div className="algaeh-md-4 algaeh-lg-4 algaeh-xl-12  primary-details">
            <div className="Paper">
              <div className="row primary-box-container">
                <div className="col-6">
                  <button
                    className="btn btn-default btn-sm"
                    type="button"
                    onClick={() => setVisible(true)}
                    disabled={!billInfo}
                  >
                    <AlgaehLabel
                      label={{
                        fieldName: "bill_details",
                      }}
                    />
                    {/* Bill Details */}
                  </button>
                </div>
                <div
                  className="col-6"
                  style={{
                    textAlign: "right",
                    paddingTop: 4,
                  }}
                >
                  {/* {this.state.from_package === true ? (
                  <span
                    className="alert alert-warning animated flash slow infinite utalizeStatus"
                    role="alert"
                  >
                    Utilized From Package
                  </span> 
                   ) : null} */}
                  {follow_up ? (
                    <span
                      className="alert alert-warning animated flash slow infinite utalizeStatus"
                      role="alert"
                    >
                      Follow Up Visit
                    </span>
                  ) : null}
                  {/* {this.state.existing_treat === true ? ( 
                  <span className="alert alert-warning animated flash slow infinite utalizeStatus">
                    Utilized From Existing Treatment
                  </span>
                   ) : null} */}
                </div>
                {/* {this.state.due_amount > 0 ? ( 
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Due Amount" }} />
                  <h6 style={{ color: "red" }}>
                    {billData?.}
                  </h6>
                </div>
                ) : null}  */}
              </div>
              <hr style={{ margin: "0.3rem 0rem" }} />
              <div className="row primary-box-container">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "gross_total",
                    }}
                  />
                  <h6>{amountWithCur(billData?.gross_total)}</h6>
                </div>

                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "patient_payable",
                    }}
                  />
                  <h6>{amountWithCur(billData?.patient_payable)}</h6>
                </div>
              </div>
              <hr style={{ margin: "0.3rem 0rem" }} />
              <div className="row primary-box-container">
                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      fieldName: "bill",
                    }}
                  />
                  <h6>
                    {/* {fieldNameFn("Not Generated", "غير مولدة")} */}
                    {savedPatient?.bill_number ??
                      fieldNameFn("Not Generated", "غير مولدة")}
                  </h6>
                </div>

                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      fieldName: "bill_date",
                    }}
                  />
                  <h6>
                    {moment().format("DD-MM-YYYY")}
                    {/* {this.state.bill_date
                            ? moment(this.state.bill_date).format("DD-MM-YYYY")
                            : "DD/MM/YYYY"} */}
                  </h6>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
          <div className="algaeh-md-8 algaeh-lg-8 algaeh-xl-12  secondary-details">
            <div className="Paper">
              <div className="row">
                <Controller
                  control={control}
                  name="advance_adjust"
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col-3" }}
                      label={{
                        fieldName: "advance_adjust",
                      }}
                      textBox={{
                        disabled: disabled || !patient?.advance_amount,
                        className: "txt-fld",
                        name: "advance_adjust",
                        type: "number",
                        ...props,
                        onChange: (e) => {
                          const amount =
                            parseFloat(e.target.value) || e.target.value;
                          if (amount > parseFloat(patient?.advance_amount)) {
                            AlgaehMessagePop({
                              display:
                                "Adjust must be less than Advance amount",
                              type: "warning",
                            });
                            return null;
                          }
                          setBillData((state) => {
                            state.advance_adjust = amount;
                            state.receiveable_amount =
                              state.net_amount - amount;
                            state.cash_amount = 0;
                            state.card_amount = 0;
                            state.unbalanced_amount = state.receiveable_amount;
                            return { ...state };
                          });
                        },
                        placeholder: "0.00",
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="sheet_discount_percentage"
                  render={({ onChange, ...props }) => (
                    <AlgaehFormGroup
                      div={{ className: "col-6" }}
                      label={{
                        fieldName: "sheet_discount",
                      }}
                      textBox={{
                        // defaultValue: billData?.sheet_discount_percentage,
                        className: "txt-fld",
                        disabled:
                          !parseInt(service_dis_percentage, 10) || disabled,
                        name: "sheet_discount_percentage",
                        type: "number",
                        ...props,
                        value: billData?.sheet_discount_percentage,
                        onChange: (e) => {
                          let perc = parseFloat(e.target.value);
                          if (perc > 100) {
                            perc = 99;
                          }
                          if (perc > 0) {
                            setBillData((sendingObject) => {
                              sendingObject.sheet_discount_percentage = perc;
                              sendingObject.sheet_discount_amount =
                                (sendingObject.gross_total * perc) / 100;
                              sendingObject.net_amount =
                                sendingObject.gross_total -
                                sendingObject.sheet_discount_amount;
                              sendingObject.discount_amount =
                                sendingObject.sheet_discount_amount;
                              return { ...sendingObject };
                            });
                          } else {
                            setBillData((state) => {
                              state.sheet_discount_percentage = 0;
                              state.sheet_discount_amount = 0;
                              state.discount_amount =
                                state.sheet_discount_amount;
                              state.net_amount =
                                state.gross_total - state.sheet_discount_amount;
                              return { ...state };
                            });
                          }
                        },
                        placeholder: "0.00",
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="sheet_discount_amount"
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col-3" }}
                      label={{
                        fieldName: "sheet_discount_amount",
                      }}
                      textBox={{
                        className: "txt-fld",
                        disabled:
                          !parseInt(service_dis_percentage, 10) || disabled,
                        name: "sheet_discount_amount",
                        type: "number",
                        ...props,
                        onChange: (e) => {
                          const amount = parseFloat(e.target.value);
                          if (amount > 0) {
                            setBillData((sendingObject) => {
                              sendingObject.sheet_discount_percentage =
                                (amount / sendingObject.gross_total) * 100;

                              sendingObject.sheet_discount_amount = amount;
                              sendingObject.discount_amount =
                                sendingObject.sheet_discount_amount;
                              sendingObject.net_amount =
                                sendingObject.gross_total -
                                sendingObject.sheet_discount_amount;
                              return { ...sendingObject };
                            });
                          } else {
                            setBillData((state) => {
                              state.sheet_discount_percentage = 0;
                              state.sheet_discount_amount = 0;
                              state.net_amount =
                                state.gross_total - state.sheet_discount_amount;
                              state.discount_amount =
                                state.sheet_discount_amount;
                              return { ...state };
                            });
                          }
                        },
                        placeholder: "0.00",
                      }}
                    />
                  )}
                />
              </div>

              <hr />
              <div
                className="row"
                style={{
                  marginBottom: 10,
                }}
              >
                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "advance",
                    }}
                  />
                  {/* <h6>{GetAmountFormart(this.state.advance_amount)}</h6> */}
                  <h6>{amountWithCur(patient?.advance_amount)}</h6>
                </div>

                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "net_amount",
                    }}
                  />

                  <h6>{amountWithCur(billData?.net_amount)}</h6>
                </div>
                <Controller
                  control={control}
                  name="credit_amount"
                  render={() => (
                    <AlgaehFormGroup
                      div={{ className: "col" }}
                      label={{
                        fieldName: "credit_amount",
                      }}
                      textBox={{
                        className: "txt-fld",
                        disabled,
                        name: "credit_amount",
                        type: "number",
                        placeholder: "0.00",
                        value: billData?.credit_amount,
                        onChange: (e) => {
                          const credit = e.target.value
                            ? parseFloat(e.target.value)
                            : 0;
                          setBillData((sendingObject) => {
                            sendingObject.credit_amount = credit;
                            sendingObject.balance_credit = credit;
                            sendingObject.receiveable_amount =
                              sendingObject.net_amount -
                              sendingObject?.advance_adjust -
                              credit;
                            sendingObject.cash_amount = 0;
                            sendingObject.card_amount = 0;
                            sendingObject.unbalanced_amount =
                              sendingObject.receiveable_amount;
                            return { ...sendingObject };
                          });
                        },
                      }}
                    />
                  )}
                />

                <div className="col highlightGreen">
                  <AlgaehLabel
                    label={{
                      fieldName: "receiveable_amount",
                    }}
                  />
                  <h4>{amountWithCur(billData?.receiveable_amount)}</h4>
                </div>
                <div className="col highlightGrey">
                  <AlgaehLabel
                    label={{
                      fieldName: "balance_due",
                    }}
                  />
                  <h6>{amountWithCur(billData?.balance_credit)}</h6>
                </div>
              </div>
              {/* <div className="container-fluid"> */}
              <div
                className="Paper"
                style={{
                  background: " #e9feff",
                  border: " 1px solid #44b8bd",
                  borderRadius: 5,
                }}
              >
                <div className="row secondary-box-container">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "receipt_number",
                      }}
                    />
                    <h6>
                      {savedPatient?.receipt_number ??
                        fieldNameFn("Not Generated", "غير مولدة")}
                    </h6>
                  </div>
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "receipt_date",
                      }}
                    />
                    <h6>
                      {savedPatient?.receipt_number
                        ? moment().format("DD-MM-YYYY")
                        : "DD/MM/YYYY"}
                    </h6>
                  </div>

                  <Controller
                    control={control}
                    name="shift_id"
                    rules={{
                      required: {
                        value: true,
                        message: "Please Select Shift",
                      },
                    }}
                    render={({ onBlur, onChange, value }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-3  mandatory" }}
                        label={{
                          fieldName: "shift_id",
                          isImp: true,
                        }}
                        error={errors}
                        selector={{
                          name: "shift_id",
                          className: "select-fld",
                          value,
                          others: {
                            disabled,
                          },
                          dataSource: {
                            textField: fieldNameFn(
                              "shift_description",
                              "arabic_name"
                            ),
                            valueField: "shift_id",
                            data: shiftMappings ?? [],
                          },
                          onChange: (_, selected) => onChange(selected),
                          onClear: () => onChange(""),
                        }}
                      />
                    )}
                  />
                </div>
                <hr style={{ margin: "0.3rem 0rem" }} />

                {/* Payment Type */}
                {/* Cash */}
                <div className="row secondary-box-container">
                  <div
                    className="customCheckbox col"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="Pay by Cash"
                        checked={enableCash}
                        disabled={disabled}
                        onChange={() => setEnableCash((state) => !state)}
                      />

                      <span style={{ fontSize: "0.8rem" }}>Pay by Cash</span>
                    </label>
                  </div>
                  <Controller
                    control={control}
                    name="cash_amount"
                    rules={{ required: "Please Enter Cash" }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col-3 mandatory form-group" }}
                        label={{
                          fieldName: "amount",
                          isImp: true,
                        }}
                        error={errors}
                        textBox={{
                          ...props,
                          disabled: disabled || !enableCash,
                          onChange: (e) => {
                            const amount = e.target.value
                              ? parseFloat(e.target.value)
                              : 0;
                            setBillData((state) => {
                              state.cash_amount = amount;
                              state.unbalanced_amount =
                                state?.receiveable_amount -
                                amount -
                                state?.card_amount;
                              return { ...state };
                            });
                          },
                          className: "txt-fld",
                          name: "cash_amount",
                          type: "number",
                          placeholder: "0.00",
                        }}
                      />
                    )}
                  />
                </div>
                {/* Card */}
                <div className="row secondary-box-container">
                  <div
                    className="customCheckbox col"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="Pay by Card"
                        checked={enableCard}
                        onChange={() => setEnableCard((state) => !state)}
                        disabled={disabled}
                      />
                      <span style={{ fontSize: "0.8rem" }}>Pay by Card</span>
                    </label>
                  </div>
                  <Controller
                    control={control}
                    name="card_number"
                    rules={{
                      required: {
                        value: enableCard,
                        message: "Required",
                      },
                    }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className: "col no-padding-left-right  mandatory",
                        }}
                        label={{
                          fieldName: "card_check_number",
                          isImp: enableCard,
                        }}
                        textBox={{
                          disabled: disabled || !enableCard,
                          className: "txt-fld",
                          name: "card_number",
                          ...props,
                        }}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="card_date"
                    render={({ onBlur, onChange, value }) => (
                      <AlgaehDateHandler
                        div={{ className: "col" }}
                        label={{
                          fieldName: "expiry_date",
                          isImp: enableCard,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "card_date",
                        }}
                        others={{
                          disabled: disabled || !enableCard,
                        }}
                        minDate={new Date()}
                        events={{
                          onChange: (mdate) => {
                            if (mdate) {
                              onChange(mdate._d);
                            } else {
                              onChange(undefined);
                            }
                          },
                          onClear: () => onChange(undefined),
                        }}
                        value={value}
                      />
                    )}
                  />{" "}
                  <Controller
                    control={control}
                    name="card_amount"
                    rules={{
                      required: {
                        value: enableCard,
                        message: "Required",
                      },
                    }}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col-3  mandatory" }}
                        label={{
                          fieldName: "amount",
                          isImp: enableCard,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "card_amount",
                          disabled: disabled || !enableCard,
                          type: "number",
                          ...props,
                          onChange: (e) => {
                            const amount = e.target.value
                              ? parseFloat(e.target.value)
                              : 0;
                            setBillData((state) => {
                              state.card_amount = amount;
                              state.unbalanced_amount =
                                state?.receiveable_amount -
                                amount -
                                state?.cash_amount;
                              return { ...state };
                            });
                          },
                          placeholder: "0.00",
                        }}
                      />
                    )}
                  />
                </div>

                <hr style={{ margin: "0.3rem 0rem" }} />
                <div
                  className="row secondary-box-container"
                  style={{ textAlign: "right" }}
                >
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        fieldName: "unbalanced_amount",
                      }}
                    />
                    <h6>{amountWithCur(billData?.unbalanced_amount)}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
