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
  //   AlgaehDataGrid,
  //   AlgaehHijriDatePicker,
  Spin,
} from "algaeh-react-components";
import { useLangFieldName } from "./patientHooks";
import { newAlgaehApi } from "../../hooks/";
import { FrontdeskContext } from "./FrontdeskContext";
import { BillDetailModal } from "./BillDetailModal";
// import GenericData from "../../utils/GlobalVariables.json";

const getBillDetails = async (
  key,
  {
    services_id,
    nationality_id,
    default_nationality_id,
    local_vat_applicable,
    primary_insurance_provider_id,
    primary_network_id,
    primary_network_office_id,
    prevVisits
  }
) => {
  const details = await newAlgaehApi({
    uri: "/billing/getBillDetails",
    module: "billing",
    method: "POST",
    data: [
      {
        hims_d_services_id: parseInt(services_id, 10),
        zeroBill: !!prevVisits.length,
        FollowUp: !!prevVisits.length,
        insured: primary_insurance_provider_id ? "Y" : "N",
        primary_insurance_provider_id,
        primary_network_id,
        primary_network_office_id,
        vat_applicable:
          default_nationality_id == nationality_id ? local_vat_applicable : "Y",
      },
    ],
  });

  return details?.data?.records;
};

// const getBillCalculations = async (key, { billInfo }) => {
//   const res = await newAlgaehApi({
//     uri: "/billing/billingCalculations",
//     data: { ...billInfo, existing_treat: false, follow_up: false },
//     method: "POST",
//     module: "billing",
//   });
//   return res?.data?.records;
// };

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
    method: "get",
    data: { sub_department_id, doctor_id, patient_id },
  });
  return res.data?.records;
};

export function BillDetails({ control, trigger, setValue, patient = null }) {
  const [visible, setVisible] = useState(false);
  const { default_nationality_id, local_vat_applicable, service_dis_percentage } = useContext(
    MainContext
  );
  const {
    services_id,
    sub_department_id,
    doctor_id,
    primary_network_office_id,
    setBillInfo,
    disabled,
    savedPatient,
  } = useContext(FrontdeskContext);
  // const disabled = !!bill_number && !!receipt_number;
  const { fieldNameFn } = useLangFieldName();
  const {
    nationality_id,
    primary_insurance_provider_id,
    primary_network_id,
    cash_amount,
    credit_amount,
    card_amount,
    advance_adjust,
    sheet_discount_amount,
    sheet_discount_percentage,
  } = useWatch({
    control,
    name: [
      "nationality_id",
      "primary_insurance_provider_id",
      "primary_network_id",
      "primary_network_office_id",
    ],
  });

  
  const { isLoading: visitLoading, data: prevVisits } = useQuery(
    [
      "checkVisits",
      { sub_department_id, doctor_id, patient_id: patient?.hims_d_patient_id },
    ],
    checkVisits,
    {
      refetchOnWindowFocus: false,
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
        nationality_id,
        primary_insurance_provider_id,
        primary_network_id,
        primary_network_office_id,
        default_nationality_id,
        local_vat_applicable,
        prevVisits,
      },
    ],
    getBillDetails,
    {
      enabled: !!services_id && !!prevVisits,
      retry: 3,
      refetchOnWindowFocus: false,

      onSuccess: (data) => {
        setBillInfo(data);
        calculateBillDetails(data?.billdetails[0]);
      },
    }
  );

  const [billData, setBillData] = useState(null);

  useEffect(() => {
    if(billData){
      setBillData(null)
    }
  }, [services_id])

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
    sendingObject.gross_total = sendingObject.net_amount;

    sendingObject.unbalanced_amount = 0;
    sendingObject.card_amount = 0;

    sendingObject.patient_payable = sendingObject.patient_payable.toFixed(2);
    sendingObject.total_tax = sendingObject.total_tax.toFixed(2);
    sendingObject.patient_tax = sendingObject.patient_tax.toFixed(2);
    sendingObject.company_tax = sendingObject.company_tax.toFixed(2);
    sendingObject.sec_company_tax = sendingObject.sec_company_tax.toFixed(2);

    setBillData(sendingObject);
    setValue("advance_adjust", sendingObject?.advance_adjust);
    setValue(
      "sheet_discount_percentage",
      sendingObject?.sheet_discount_percentage
    );
    setValue("sheet_discount_amount", sendingObject?.sheet_discount_amount);
    setValue(
      "sheet_discount_percentage",
      sendingObject?.sheet_discount_percentage
    );
    setValue("credit_amount", sendingObject?.credit_amount);
    setValue("cash_amount", sendingObject?.cash_amount);
    setValue("card_amount", sendingObject?.card_amount);
    setValue("card_number", sendingObject?.card_number);
    setValue("card_date", sendingObject?.card_date);
  }

  useEffect(() => {
    const sendingObject = {...billData}
    console.log(sendingObject)
    
  }, [cash_amount, card_amount, credit_amount,sheet_discount_percentage, sheet_discount_amount, advance_adjust ])
    // else {
    //   //Reciept

    //   if (inputParam.isReceipt == false) {
    //     // Sheet Level Discount Nullify
    //     sendingObject.sheet_discount_percentage = 0;
    //     sendingObject.sheet_discount_amount = 0;

    //     if (inputParam.sheet_discount_amount > 0) {
    //       sendingObject.sheet_discount_percentage =
    //         (inputParam.sheet_discount_amount / inputParam.gross_total) * 100;

    //       sendingObject.sheet_discount_amount =
    //         inputParam.sheet_discount_amount;
    //     } else if (inputParam.sheet_discount_percentage > 0) {
    //       sendingObject.sheet_discount_percentage =
    //         inputParam.sheet_discount_percentage;
    //       sendingObject.sheet_discount_amount =
    //         (inputParam.gross_total * inputParam.sheet_discount_percentage) /
    //         100;
    //     }

    //     sendingObject.sheet_discount_amount = sendingObject.sheet_discount_amount.toFixed(
    //       2
    //     );
    //     sendingObject.sheet_discount_percentage = sendingObject.sheet_discount_percentage.toFixed(
    //       2
    //     );

    //     sendingObject.net_amount =
    //       inputParam.gross_total - sendingObject.sheet_discount_amount;

    //     if (inputParam.credit_amount > 0) {
    //       sendingObject.receiveable_amount =
    //         sendingObject.net_amount -
    //         inputParam.advance_adjust -
    //         inputParam.credit_amount;
    //     } else {
    //       sendingObject.receiveable_amount =
    //         sendingObject.net_amount - inputParam.advance_adjust;
    //     }

    //     sendingObject.cash_amount = sendingObject.receiveable_amount;
    //     sendingObject.card_amount = 0;
    //     sendingObject.cheque_amount = 0;
    //   } else {
    //     sendingObject.card_amount = inputParam.card_amount;
    //     sendingObject.cheque_amount = inputParam.cheque_amount;
    //     sendingObject.cash_amount = inputParam.cash_amount;
    //     sendingObject.receiveable_amount = inputParam.receiveable_amount;
    //   }

    //   sendingObject.total_amount =
    //     sendingObject.cash_amount +
    //     sendingObject.card_amount +
    //     sendingObject.cheque_amount;

    //   sendingObject.unbalanced_amount =
    //     sendingObject.receiveable_amount - sendingObject.total_amount;
    // }
  

  // const { isLoading: calcLoading, data: billData } = useQuery(
  //   ["billCalculations", { billInfo }],
  //   getBillCalculations,
  //   {
  //     refetchOnWindowFocus: false,
  //     enabled: !!billInfo,
  //     retry: 3,
  //     onSuccess: (data) => {
  //       setValue("advance_adjust", data?.advance_adjust);
  //       setValue("sheet_discount_percentage", data?.sheet_discount_percentage);
  //       setValue("sheet_discount_amount", data?.sheet_discount_amount);
  //       setValue("credit_amount", data?.credit_amount);
  //       setValue("cash_amount", data?.receiveable_amount);
  //       setValue("card_amount", data?.card_amount);
  //       setValue("card_number", data?.card_number);
  //       setValue("card_date", data?.card_date);
  //     },
  //     onError: (err) => {
  //       console.log(err);
  //     },
  //     initialData: {
  //       advance_adjust: 0,
  //       card_amount: 0,
  //       cash_amount: 0,
  //       cheque_amount: 0,
  //       company_payble: 0,
  //       company_res: 0,
  //       company_tax: 0,
  //       copay_amount: 0,
  //       deductable_amount: 0,
  //       discount_amount: 0,
  //       gross_total: 0,
  //       net_amount: 0,
  //       net_total: 0,
  //       patient_payable: 0,
  //       patient_res: 0,
  //       patient_tax: 0,
  //       receiveable_amount: 0,
  //       s_patient_tax: 0,
  //       sec_company_paybale: 0,
  //       sec_company_res: 0,
  //       sec_company_tax: 0,
  //       sec_copay_amount: 0,
  //       sec_deductable_amount: 0,
  //       sheet_discount_amount: 0,
  //       sheet_discount_percentage: 0,
  //       sub_total_amount: 0,
  //       total_amount: 0,
  //       total_tax: 0,
  //       unbalanced_amount: 0,
  //     },
  //     initialStale: true,
  //   }
  // );

  // const unbalanced_amount = billData?re

  const { isLoading: shiftLoading, data: shiftMappings } = useQuery(
    "userMappings",
    getShiftMappings,
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: 3,
      onSuccess: (data) => {
        setValue("shift_id", data[0]?.shift_id);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );


  const follow_up = !!prevVisits?.length;

  return (
    <Spin spinning={infoLoading || shiftLoading || visitLoading}>
      <BillDetailModal
        visible={visible}
        onClose={() => setVisible(false)}
        billData={billInfo}
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
                  <h6>{billData?.gross_total}</h6>
                </div>

                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "patient_payable",
                    }}
                  />
                  <h6>{billData?.patient_payable}</h6>
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
                    {fieldNameFn("Not Generated", "غير مولدة")}
                    {/* {this.state.bill_number
                            ? this.state.bill_number
                            : fieldNameFn("Not Generated", "غير مولدة") */}
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
                        disabled,
                        className: "txt-fld",
                        name: "advance_adjust",
                        ...props,
                        placeholder: "0.00",
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="sheet_discount_percentage"
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col-6" }}
                      label={{
                        fieldName: "sheet_discount",
                      }}
                      textBox={{
                        // defaultValue: billData?.sheet_discount_percentage,
                        className: "txt-fld",
                        disabled: !parseInt(service_dis_percentage, 10) || disabled,
                        name: "sheet_discount_percentage",
                        ...props,
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
                        disabled: !parseInt(service_dis_percentage, 10) || disabled,
                        name: "sheet_discount_amount",
                        ...props,
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
                  <h6>{0.0}</h6>
                </div>

                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "net_amount",
                    }}
                  />
                  {/* <h6>{GetAmountFormart(this.state.net_amount)}</h6> */}
                  <h6>{billData?.net_amount}</h6>
                </div>
                <Controller
                  control={control}
                  name="credit_amount"
                  render={(props) => (
                    <AlgaehFormGroup
                      div={{ className: "col" }}
                      label={{
                        fieldName: "credit_amount",
                      }}
                      textBox={{
                        className: "txt-fld",
                        disabled,
                        name: "credit_amount",
                        placeholder: "0.00",
                        ...props,
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
                  <h4>
                    {/* {GetAmountFormart(this.state.receiveable_amount)} */}
                    {billData?.receiveable_amount}
                  </h4>
                </div>
                <div className="col highlightGrey">
                  <AlgaehLabel
                    label={{
                      fieldName: "balance_due",
                    }}
                  />
                  {/* <h6>{GetAmountFormart(this.state.balance_credit)}</h6> */}
                  <h6>{0.0}</h6>
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
                    render={({ onBlur, onChange, value }) => (
                      <AlgaehAutoComplete
                        div={{ className: "col-3  mandatory" }}
                        label={{
                          fieldName: "shift_id",
                          isImp: true,
                        }}
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
                    className="customCheckbox col-lg-2"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="Pay by Cash"
                        checked={true}
                      />

                      <span style={{ fontSize: "0.8rem" }}>Pay by Cash</span>
                    </label>
                  </div>
                  <Controller
                    control={control}
                    name="cash_amount"
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col-2 mandatory" }}
                        label={{
                          fieldName: "amount",
                          isImp: true,
                        }}
                        textBox={{
                          ...props,
                          disabled,
                          className: "txt-fld",
                          name: "cash_amount",
                          placeholder: "0.00",
                        }}
                      />
                    )}
                  />
                </div>
                {/* Card */}
                <div className="row secondary-box-container">
                  <div
                    className="customCheckbox col-lg-2"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="Pay by Card"
                        disabled={disabled}
                        //   checked={this.state.Cardchecked}
                        //   onChange={checkcardhandler.bind(
                        //     this,
                        //     this,
                        //     context
                        //   )}
                        //   disabled={this.state.savedData}
                      />
                      <span style={{ fontSize: "0.8rem" }}>Pay by Card</span>
                    </label>
                  </div>

                  <Controller
                    control={control}
                    name="card_amount"
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col-2  mandatory" }}
                        label={{
                          fieldName: "amount",
                          isImp: true,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "card_amount",
                          disabled: true,
                          ...props,
                          placeholder: "0.00",
                        }}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="card_number"
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{
                          className: "col no-padding-left-right  mandatory",
                        }}
                        label={{
                          fieldName: "card_check_number",
                        }}
                        textBox={{
                          disabled: true,
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
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "card_date",
                          disabled: true,
                        }}
                        minDate={new Date()}
                        events={{
                          onChange: (mdate) => onChange(mdate._d),
                          onClear: () => onChange(undefined),
                        }}
                        value={value}
                      />
                    )}
                  />
                </div>

                <hr style={{ margin: "0.3rem 0rem" }} />
                <div className="row secondary-box-container">
                  <div className="col-lg-3" />
                  <div className="col-lg-5">
                    <AlgaehLabel
                      label={{
                        fieldName: "unbalanced_amount",
                      }}
                    />
                    <h6>
                      {billData?.unbalanced_amount}
                      {/* {GetAmountFormart(this.state.unbalanced_amount)} */}
                    </h6>
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
