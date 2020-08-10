import React, { useContext } from "react";
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
  }
) => {
  const details = await newAlgaehApi({
    uri: "/billing/getBillDetails",
    module: "billing",
    method: "POST",
    data: [
      {
        hims_d_services_id: parseInt(services_id, 10),
        zeroBill: false,
        FollowUp: false,
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

const getBillCalculations = async (key, { billInfo }) => {
  const res = await newAlgaehApi({
    uri: "/billing/billingCalculations",
    data: { ...billInfo, existing_treat: false, follow_up: false },
    method: "POST",
    module: "billing",
  });
  return res?.data?.records;
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
    method: "get",
    data: { sub_department_id, doctor_id, patient_id },
  });
  return res.data?.records;
};

export function BillDetails({ control, trigger, setValue, patient = null }) {
  const { default_nationality_id, local_vat_applicable } = useContext(
    MainContext
  );
  const {
    services_id,
    sub_department_id,
    doctor_id,
    primary_network_office_id,
  } = useContext(FrontdeskContext);
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
      "primary_network_office_id",
    ],
  });

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
      },
    ],
    getBillDetails,
    {
      enabled: !!services_id,
      retry: 3,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  const { isLoading: calcLoading, data: billData } = useQuery(
    ["billCalculations", { billInfo }],
    getBillCalculations,
    {
      refetchOnWindowFocus: false,
      enabled: !!billInfo,
      retry: 3,
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const { isLoading: shiftLoading, data: shiftMappings } = useQuery(
    "userMappings",
    getShiftMappings,
    {
      refetchOnWindowFocus: false,
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
        debugger;
        console.log(data, "visit");
      },
    }
  );

  const follow_up = !!prevVisits?.length;

  return (
    <Spin spinning={infoLoading || calcLoading || shiftLoading || visitLoading}>
      <div className="hptl-phase1-fd-billing-form">
        <div className="row">
          <div className="algaeh-md-4 algaeh-lg-4 algaeh-xl-12  primary-details">
            <div className="Paper">
              <div className="row primary-box-container">
                <div className="col-6">
                  <button
                    className="btn btn-default btn-sm"
                    type="button"
                    //   onClick={this.ShowBillDetails.bind(this)}
                    //   disabled={this.state.billdetail}
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
                        value: billData?.advance_adjust,
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
                        defaultValue: billData?.sheet_discount_percentage,
                        className: "txt-fld",
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
                  render={({ onBlur, onChange, value }) => (
                    <AlgaehFormGroup
                      div={{ className: "col-3" }}
                      label={{
                        fieldName: "sheet_discount_amount",
                      }}
                      textBox={{
                        value: billData?.sheet_discount_amount,
                        className: "txt-fld",
                        name: "sheet_discount_amount",

                        //   events: {
                        //     onChange: discounthandle.bind(this, this, context)
                        //   },

                        placeholder: "0.00",
                        // onBlur: makeZero.bind(this, this, context),
                        // onFocus: e => {
                        //   e.target.oldvalue = e.target.value;
                        // },
                        // disabled: this.state.savedData,
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
                      {/* {this.state.receipt_number
                              ? this.state.receipt_number
                              : fieldNameFn("Not Generated", "غير مولدة") */}
                    </h6>
                  </div>
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "receipt_date",
                      }}
                    />
                    <h6>
                      {/* {this.state.receipt_date
                              ? moment(this.state.receipt_date).format(
                                "DD-MM-YYYY"
                              )
                              : "DD/MM/YYYY"} */}
                      dd/MM/YYYY
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
                          disabled: false,
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
                      <input type="checkbox" name="Pay by Cash" />

                      <span style={{ fontSize: "0.8rem" }}>Pay by Cash</span>
                    </label>
                  </div>
                  <Controller
                    control={control}
                    name="cash_amount"
                    defaultValue={billData?.cash_amount}
                    render={(props) => (
                      <AlgaehFormGroup
                        div={{ className: "col-2 mandatory" }}
                        label={{
                          fieldName: "amount",
                          isImp: true,
                        }}
                        textBox={{
                          ...props,
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
                          className: "txt-fld",
                          name: "card_number",
                          ...props,
                          disabled: false,
                        }}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name=""
                    render={({ onBlur, onChange, value }) => (
                      <AlgaehDateHandler
                        div={{ className: "col" }}
                        label={{
                          fieldName: "expiry_date",
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "card_date",
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
                      0.00
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
