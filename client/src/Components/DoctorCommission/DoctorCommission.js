import React, { useState } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import Enumerable from "linq";
import {
  //   AlagehFormGroup,
  //   AlgaehDataGrid,
  AlgaehLabel,
  //   AlagehAutoComplete,
  //   AlgaehDateHandler,
} from "../Wrapper/algaehWrapper";
import {
  // AlgaehLabel,
  Spin,
  AlgaehDataGrid,
  // AlgaehDateHandler,
  AlgaehAutoComplete,
  // AlgaehLabel,
  AlgaehDateHandler,
  AlgaehFormGroup,
  // AlgaehMessagePop,
  // AlgaehSearch,
  // algaehAxios,
  AlgaehMessagePop,
  // // DatePicker,
  // AlgaehModal,
  // AlgaehHijriDatePicker,
  // // AlgaehTreeSearch,
  // AlgaehSecurityComponent,

  //   AlgaehButton,
} from "algaeh-react-components";
import { Controller, useForm } from "react-hook-form";

import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
// import {
//   // changeTexts,
//   // LoadBills,
//   // datehandle,
//   // ClearData,
//   // CalculateCommission,
//   // AdjustAmountCalculate,
//   dateValidate,
// } from "./DoctorCommissionEvents";
import "./DoctorCommission.scss";
import "../../styles/site.scss";
// import { AlgaehActions } from "../../actions/algaehActions";
import { newAlgaehApi } from "../../hooks";
import GlobalVariables from "../../utils/GlobalVariables.json";
import moment from "moment";
import Options from "../../Options.json";
import { useQuery, useMutation } from "react-query";
import { GetAmountFormart } from "../../utils/GlobalFunctions";
// import { initial } from "lodash";
const getProviderDetails = async () => {
  const res = await newAlgaehApi({
    uri: "/employee/get",
    module: "hrManagement",
    method: "GET",
  });
  return res.data?.records;
};
const getServiceTypes = async () => {
  const res = await newAlgaehApi({
    uri: "/serviceType",
    module: "masterSettings",
    method: "GET",
  });
  return res.data?.records;
};
const getServices = async () => {
  const res = await newAlgaehApi({
    uri: "/serviceType/getService",
    module: "masterSettings",
    method: "GET",
  });
  return res.data?.records;
};
const getLoadBills = async (key, { data }) => {
  let inpObj = {
    incharge_or_provider: data.doctor_id,
    from_date: moment(data.from_date).format(Options.dateFormatYear),
    to_date: moment(data.to_date).format(Options.dateFormatYear),
    select_type: data.select_type,
    service_type_id: data.select_service,
  };
  const res = await newAlgaehApi({
    uri: "/doctorsCommissionNew/getDoctorsCommission",
    method: "GET",
    data: inpObj,
  });
  return res.data?.records;
};
const CalculateCommission = async (data) => {
  const res = await newAlgaehApi({
    uri: "/doctorsCommissionNew/doctorsCommissionCal",
    method: "POST",
    data: data,
  });
  return res.data?.records;
};

const AdjustAmountCalculateGet = async (data) => {
  const res = await newAlgaehApi({
    uri: "/doctorsCommissionNew/commissionCalculations",
    method: "POST",
    data: {
      adjust_amount: data.adjust_amount,
      gross_comission: data.gross_comission,
    },
  });
  return res.data?.records;
};
const addDoctorsCommission = async (data) => {
  const res = await newAlgaehApi({
    uri: "/doctorsCommissionNew/addDoctorsCommission",
    method: "POST",
    data: data,
  });
  return res.data?.records;
};

const commissionCalculations = async (data) => {
  const res = await newAlgaehApi({
    uri: "/doctorsCommissionNew/commissionCalculations",
    method: "POST",
    data: data,
  });
  return res.data?.records;
};
const getGeneratedCommission = async (data) => {
  const res = await newAlgaehApi({
    uri: "/doctorsCommissionNew/getGeneratedCommission",
    method: "GET",
    data: { comission_code: data },
  });
  return res.data?.records;
};
// class DoctorCommission extends Component {
// constructor(props) {
//   super(props);

//   this.state = {
//     providers: [],
//     select_type: "AS",
//     doctor_id: null,
//     from_date: null,
//     to_date: null,
//     select_service: null,
//     case_type: "OP",
//     adjust_amount: 0,
//     billscommission: [],
//     op_commision: 0,
//     op_credit_comission: 0,
//     gross_comission: 0,
//     comission_payable: 0,
//   };
// }

// componentDidMount() {
//   this.props.getProviderDetails({
//     uri: "/employee/get",
//     module: "hrManagement",
//     method: "GET",
//     redux: {
//       type: "DOCTOR_GET_DATA",
//       mappingName: "providers",
//     },
//     afterSuccess: (data) => {
//       let providers = Enumerable.from(data)
//         .where((w) => w.isdoctor === "Y")
//         .toArray();
//       this.setState({ providers: providers });
//     },
//   });

//   this.props.getServiceTypes({
//     uri: "/serviceType",
//     module: "masterSettings",
//     method: "GET",
//     redux: {
//       type: "SERVIES_TYPES_GET_DATA",
//       mappingName: "servicetype",
//     },
//   });

//   this.props.getServices({
//     uri: "/serviceType/getService",
//     module: "masterSettings",
//     method: "GET",
//     redux: {
//       type: "SERVICES_GET_DATA",
//       mappingName: "services",
//     },
//   });

// }

// render() {
function DoctorCommission() {
  const [providers, setProviders] = useState([]);
  const [billscommission, setBillscommission] = useState([]);
  const [op_commision, setOp_commision] = useState(0.0);
  const [op_credit_comission, setOp_credit_comission] = useState(0.0);
  const [loadBillData, setLoadBillData] = useState(false);
  const [gross_comission, setGross_comission] = useState(0.0);
  const [comission_payable, setComission_payable] = useState(0.0);
  const [adjust_amount, setAdjust_amount] = useState(null);
  const [commission_number, setCommission_number] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [disableAdjust, setDisableAdjust] = useState(true);
  const {
    control,
    errors,
    reset,
    getValues,
    watch,
    setValue,
    handleSubmit,
  } = useForm({
    shouldFocusError: true,
    defaultValues: {
      select_type: "AS",
      case_type: "OP",
    },
  });
  const select_type = watch("select_type");

  const { data: providers1 } = useQuery(
    ["get-providerDetails"],
    getProviderDetails,
    {
      onSuccess: (data) => {
        let providers12 = data.filter((f) => f.isdoctor === "Y");
        console.log("providers", providers1, providers);
        setProviders(providers12);
      },
    }
  );

  const { data: servicetype } = useQuery("get-servicesType", getServiceTypes, {
    onSuccess: (data) => {},
  });
  const { data: services } = useQuery("get-services", getServices, {
    onSuccess: (data) => {},
  });
  const onError = (err) => {
    AlgaehMessagePop({
      type: "error",
      display: err?.message,
    });
  };
  const [getCommissionCalculation] = useMutation(commissionCalculations, {
    onSuccess: (data) => {
      setGross_comission(data.gross_comission);
      setComission_payable(data.comission_payable);
      setOp_commision(data.op_commision);
      setOp_credit_comission(data.op_credit_comission);
    },
    onError,
  });
  const [AdjustAmountCalculate] = useMutation(AdjustAmountCalculateGet, {
    onSuccess: (data) => {
      setComission_payable(data.comission_payable);
    },
    onError,
  });
  const { isLoading: loadingBills } = useQuery(
    ["bill-data", { data: getValues() }],

    getLoadBills,

    {
      initialStale: true,
      enabled: loadBillData,
      onSuccess: (data) => {
        setBillscommission(data);
        setLoadBillData(false);
      },
    }
  );

  const [getCalculatedCommission] = useMutation(CalculateCommission, {
    onSuccess: (data) => {
      setBillscommission(data);
      setDisableAdjust(false);
      getCommissionCalculation(data);
    },
    onError,
  });
  const [addCommission, { isLoading: loadingAdd }] = useMutation(
    addDoctorsCommission,
    {
      onSuccess: (data) => {
        setDisabled(true);
      },
      onError,
    }
  );
  const [getCommission] = useMutation(getGeneratedCommission, {
    onSuccess: (data) => {
      reset({ ...data });

      setValue("doctor_id", data.provider_id);
      setValue("select_type", data.selected_service_type);
      setGross_comission(data.gross_comission);
      setComission_payable(data.comission_payable);
      setOp_commision(data.op_commision);
      setAdjust_amount(data.adjust_amount);
      setBillscommission(data.detailResult);
      setOp_credit_comission(data.op_credit_comission);
      setDisabled(true);
    },
    onError,
  });
  const submit = (data) => {
    setLoadBillData(true);
  };

  const ClearData = () => {
    reset({
      select_type: "AS",
      doctor_id: null,
      from_date: null,
      to_date: null,
      select_service: null,
      case_type: "OP",
    });
    setBillscommission([]);
    setOp_commision(0.0);
    setOp_credit_comission(0.0);
    setGross_comission(0.0);
    setComission_payable(0.0);
    setAdjust_amount(0.0);
    setCommission_number(null);
    setDisabled(false);
    setDisableAdjust(true);
  };
  const dateFormater = (value) => {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  };
  return (
    <>
      <div>
        <Spin spinning={loadingBills || loadingAdd}>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Doctor's Commission", align: "ltr" }}
              />
            }
            // breadStyle={this.props.breadStyle}
            //breadWidth={this.props.breadWidth}
            // pageNavPath={[
            //   {
            //     pageName: (
            //       <AlgaehLabel
            //         label={{
            //           forceLabel: "Home",
            //           align: "ltr"
            //         }}
            //       />
            //     )
            //   },
            //   {
            //     pageName: (
            //       <AlgaehLabel
            //         label={{ forceLabel: "Doctor's Commission", align: "ltr" }}
            //       />
            //     )
            //   }
            // ]}

            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{ forceLabel: "Commission Number", returnText: true }}
                />
              ),
              value: commission_number,
              selectValue: "comission_code",
              events: {
                onChange: (row) => {
                  setCommission_number(row);

                  getCommission(row);
                },
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "DoctorCommission.doccpmmission",
              },
              searchName: "DoctorCommission",
            }}
            userArea={
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{
                  forceLabel: "Commision Date",
                  isImp: true,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "bread_registration_date",
                }}
                disabled={true}
                events={{
                  onChange: null,
                }}
                // value={this.state.doctoCommGrid_date}
              />
            }
            // selectedLang={this.state.selectedLang}
          />

          <div className="hptl-phase1-doctor-commission-form"> <form onSubmit={handleSubmit(submit)}>
            <div
              className="row inner-top-search margin-bottom-15"
              style={{ marginTop: 76, paddingBottom: 10 }}
              data-validate="DoctorData"
            >
             
                <Controller
                  name="doctor_id"
                  control={control}
                  rules={{ required: "Select a Doctor" }}
                  render={({ value, onChange }) => (
                    <AlgaehAutoComplete
                      div={{ className: "col form-group mandatory" }}
                      label={{
                        forceLabel: "Select a Doctor",
                        isImp: true,
                      }}
                      error={errors}
                      selector={{
                        className: "form-control",
                        name: "doctor_id",
                        value,
                        onChange: (_, selected) => {
                          onChange(selected);

                          // setValue("service_amount", _.standard_fee);
                        },

                        dataSource: {
                          textField: "full_name",
                          valueField: "hims_d_employee_id",
                          data: providers,
                        },
                        others: {
                          disabled: disabled,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Doctor",
                  isImp: true,
                }}
                selector={{
                  name: "doctor_id",
                  className: "select-fld",
                  value: this.state.doctor_id,
                  dataSource: {
                    textField: "full_name",
                    valueField: "hims_d_employee_id",
                    data: this.state.providers,
                  },

                  onChange: changeTexts.bind(this, this),
                }}
              /> */}
                <Controller
                  name="from_date"
                  control={control}
                  rules={{
                    required: "Please enter  from Date",
                  }}
                  render={({ value, onChange }) => (
                    <AlgaehDateHandler
                      div={{
                        className: "col form-group mandatory",
                      }}
                      error={errors}
                      label={{
                        forceLabel: "From Date",
                        isImp: true,
                      }}
                      textBox={{
                        className: "form-control",
                        name: "from_date",
                        value,
                      }}
                      events={{
                        onChange: (mdate) => {
                          if (mdate) {
                            onChange(mdate._d);
                            // getReceiptEntryList(getValues());
                          } else {
                            onChange(undefined);
                          }
                        },
                        onClear: () => {
                          onChange(undefined);
                        },
                        // onBlur: () => dateValidate(),
                      }}
                      others={{ disabled: disabled }}
                      maxDate={new Date()}
                    />
                  )}
                />
                {/* <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "Form Date", isImp: true }}
                textBox={{ className: "txt-fld", name: "from_date" }}
                maxDate={new Date()}
                events={{
                  onChange: datehandle.bind(this, this),
                  onBlur: dateValidate.bind(this, this),
                }}
                value={this.state.from_date}
              /> */}
                <Controller
                  name="to_date"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Please enter  from Date",
                    },
                  }}
                  render={({ value, onChange }) => (
                    <AlgaehDateHandler
                      div={{
                        className: "col form-group mandatory",
                      }}
                      error={errors}
                      label={{
                        forceLabel: "To Date",
                        isImp: true,
                      }}
                      textBox={{
                        className: "form-control",
                        name: "to_date",
                        value,
                      }}
                      events={{
                        onChange: (mdate) => {
                          if (mdate) {
                            onChange(mdate._d);
                            // getReceiptEntryList(getValues());
                          } else {
                            onChange(undefined);
                          }
                        },
                        onClear: () => {
                          onChange(undefined);
                        },
                        // onBlur: () => dateValidate(),
                      }}
                      others={{ disabled: disabled }}
                      maxDate={new Date()}
                    />
                  )}
                />
                {/* <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ fieldName: "to_date", isImp: true }}
                textBox={{ className: "txt-fld", name: "to_date" }}
                maxDate={new Date()}
                events={{
                  onChange: datehandle.bind(this, this),
                  onBlur: dateValidate.bind(this, this),
                }}
                value={this.state.to_date}
              /> */}

                <Controller
                  name="select_type"
                  control={control}
                  rules={{ required: "Select bed" }}
                  render={({ value, onChange }) => (
                    <AlgaehAutoComplete
                      div={{ className: "col form-group mandatory" }}
                      label={{
                        forceLabel: "Select Type",
                        isImp: true,
                      }}
                      error={errors}
                      selector={{
                        className: "form-control",
                        name: "select_type",
                        value,
                        onChange: (_, selected) => {
                          onChange(selected);

                          // setValue("service_amount", _.standard_fee);
                        },

                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.SERVICE_COMMISSION,
                        },
                        others: {
                          disabled: disabled,
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Select Type",
                  isImp: true,
                }}
                selector={{
                  name: "select_type",
                  className: "select-fld",
                  value: this.state.select_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.SERVICE_COMMISSION,
                  },

                  onChange: changeTexts.bind(this, this),
                }}
              /> */}
                <Controller
                  name="select_service"
                  control={control}
                  // rules={{ required: "Select bed" }}
                  render={({ value, onChange }) => (
                    <AlgaehAutoComplete
                      div={{ className: "col form-group mandatory" }}
                      label={{
                        forceLabel: "Select Type",
                        // isImp: true,
                      }}
                      // error={errors}
                      selector={{
                        className: "form-control",
                        name: "select_service",
                        value,
                        onChange: (_, selected) => {
                          onChange(selected);

                          // setValue("service_amount", _.standard_fee);
                        },

                        dataSource: {
                          textField: "service_type",
                          valueField: "hims_d_service_type_id",
                          data: servicetype,
                        },
                        others: {
                          disabled:
                            disabled || select_type === "AS" ? true : false,
                          tabIndex: "4",
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Service Type",
                }}
                selector={{
                  name: "select_service",
                  className: "select-fld",
                  value: this.state.select_service,
                  dataSource: {
                    textField: "service_type",
                    valueField: "hims_d_service_type_id",
                    data: this.props.servicetype,
                  },
                  others: {
                    disabled: this.state.select_type === "AS" ? true : false,
                  },
                  onChange: changeTexts.bind(this, this),
                }}
              /> */}
                <Controller
                  name="case_type"
                  control={control}
                  // rules={{ required: "Select bed" }}
                  render={({ value, onChange }) => (
                    <AlgaehAutoComplete
                      div={{ className: "col form-group mandatory" }}
                      label={{
                        forceLabel: "Case Type",
                        // isImp: true,
                      }}
                      // error={errors}
                      selector={{
                        className: "form-control",
                        name: "case_type",
                        value,
                        onChange: (_, selected) => {
                          onChange(selected);

                          // setValue("service_amount", _.standard_fee);
                        },

                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.CASE_TYPE,
                        },
                        others: {
                          disabled: true,
                          tabIndex: "4",
                        },
                      }}
                    />
                  )}
                />
                {/* <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Case Type",
                }}
                selector={{
                  name: "case_type",
                  className: "select-fld",
                  value: this.state.case_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.CASE_TYPE,
                  },
                  others: {
                    disabled: true,
                  },
                  onChange: changeTexts.bind(this, this),
                }}
              /> */}

                <div className="col">
                  <button
                    disabled={disabled}
                    className="btn btn-primary"
                    type="submit"
                    style={{ marginTop: "24px" }}
                    // onClick={LoadBills.bind(this, this)}
                  >
                    Load Bills
                  </button>
                </div>
             
            </div> </form>

            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Bill Lists</h3>
                </div>
                <div className="actions">
                  <button
                    className="btn btn-primary btn-circle active"
                    disabled={disabled}
                    onClick={() => {
                      getCalculatedCommission(billscommission);
                      // CalculateCommission.bind(this, this)
                    }}
                  >
                    <i className="fas fa-calculator" />
                  </button>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12" id="doc_comission_grid_cntr">
                    <AlgaehDataGrid
                      columns={[
                        {
                          fieldName: "bill_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Bill Number" }}
                            />
                          ),
                        },
                        {
                          fieldName: "bill_date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Bill Date" }} />
                          ),
                          displayTemplate: (row) => {
                            return <span>{dateFormater(row.bill_date)}</span>;
                          },
                        },
                        {
                          fieldName: "servtype_id",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Service Type" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            let display =
                              servicetype === undefined
                                ? []
                                : servicetype.filter(
                                    (f) =>
                                      f.hims_d_service_type_id ===
                                      row.servtype_id
                                  );

                            return (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? display[0].service_type
                                  : ""}
                              </span>
                            );
                          },
                        },
                        {
                          fieldName: "service_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Service" }} />
                          ),
                          displayTemplate: (row) => {
                            let display =
                              services === undefined
                                ? []
                                : services.filter(
                                    (f) =>
                                      f.hims_d_services_id === row.service_id
                                  );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].service_name
                                  : ""}
                              </span>
                            );
                          },
                        },
                        {
                          fieldName: "quantity",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                          ),
                        },
                        {
                          fieldName: "unit_cost",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                          ),
                        },
                        {
                          fieldName: "extended_cost",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Extended Cost" }}
                            />
                          ),
                        },
                        {
                          fieldName: "discount_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Discount Amount" }}
                            />
                          ),
                        },

                        {
                          fieldName: "patient_share",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Patient Share" }}
                            />
                          ),
                        },
                        {
                          fieldName: "company_share",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Co. Share" }} />
                          ),
                        },
                        {
                          fieldName: "net_amount",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Net Amount" }} />
                          ),
                        },
                        {
                          fieldName: "service_cost",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Service Cost" }}
                            />
                          ),
                        },
                        // {
                        //   fieldName: "op_cash_comission_type",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "OP Cash Comm. Type" }}
                        //     />
                        //   )
                        // },
                        {
                          fieldName: "op_cash_comission_percentage",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "OP Cash Comm. %" }}
                            />
                          ),
                        },

                        {
                          fieldName: "op_cash_comission_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "OP Cash Comm. Amount" }}
                            />
                          ),
                        },
                        {
                          fieldName: "op_cash_comission",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "OP Cash Comm." }}
                            />
                          ),
                        },
                        // {
                        //   fieldName: "op_crd_comission_type",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "OP Criedt Comm. Type" }}
                        //     />
                        //   )
                        // },
                        {
                          fieldName: "op_crd_comission_percentage",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "OP Criedt Comm. %" }}
                            />
                          ),
                        },
                        {
                          fieldName: "op_crd_comission_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "OP Criedt Comm. Amount" }}
                            />
                          ),
                        },
                        {
                          fieldName: "op_crd_comission",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "OP Criedt Comm." }}
                            />
                          ),
                        },
                      ]}
                      keyId="item_id"
                      // dataSource={{
                      data={billscommission?.length > 0 ? billscommission : []}
                      // }}
                      pagination={true}
                      // paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        //   onDelete: deleteServices.bind(this, this),
                        onEdit: (row) => {},
                        // onDone: this.updateBillDetail.bind(this)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "OP Commision",
                  }}
                />
                <h6>{GetAmountFormart(op_commision)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "OP Credit Comission",
                  }}
                />
                <h6>{GetAmountFormart(op_credit_comission)}</h6>
              </div>

              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Gross Comission",
                  }}
                />
                <h6>{GetAmountFormart(gross_comission)}</h6>

                {/* adjust_amount */}
              </div>
              {/* <Controller
              name="adjust_amount"
              control={control2}
              // rules={{ required: "Required" }}
              render={(props) => (
                // <AlgaehFormGroup
                <input
                  // className="col-3 form-group mandatory"
                  // error={errors}
                  // label="Adjust Amount"
                  // textBox={{
                  type="text"
                  // ...props,
                  // className: "form-control",
                  name="adjust_amount"
                  // }}
                  onChange={(e) =>
                    props.onChange(
                      e.target.value > 0
                        ? AdjustAmountCalculate({
                            gross_comission: gross_comission,
                            adjust_amount: e.target.value,
                          })
                        : null
                    )
                  }
                />
              )}
            /> */}

              <AlgaehFormGroup
                div={{ className: "col-3 form-group mandatory" }}
                textBox={{
                  className: "txt-fld",
                  name: "adjust_amount",
                  value: adjust_amount,
                  disabled: disableAdjust,
                  // updateInternally: true,
                  onChange: (e) => {
                    setAdjust_amount(e.target.value);
                    if (e.target.value > 0) {
                      AdjustAmountCalculate({
                        gross_comission: gross_comission,
                        adjust_amount: e.target.value,
                      });
                    }
                  },
                  // others: {

                  // },
                }}
              />
              {/* <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  forceLabel: "Adjust Amount",
                }}
                textBox={{
                  decimal: { allowNegative: false },
                  value: this.state.adjust_amount,
                  className: "txt-fld",
                  name: "adjust_amount",

                  events: {
                    onChange: AdjustAmountCalculate.bind(this, this),
                  },
                  others: {
                    placeholder: "0.00",
                  },
                }}
              /> */}

              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Comission Payable",
                  }}
                />
                <h6>{GetAmountFormart(comission_payable)}</h6>
              </div>
            </div>

            <div className="hptl-phase1-footer">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      let data = getValues();

                      addCommission({
                        commissionDetails: billscommission,
                        ...data,
                        provider_id: data.doctor_id,
                        selected_service_type: data.service_type,
                        op_commision: op_commision,
                        op_credit_comission: op_credit_comission,
                        gross_comission: gross_comission,
                        adjust_amount: adjust_amount,
                        comission_payable: comission_payable,
                      });
                    }}
                    disabled={disabled}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Save", returnText: true }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={ClearData.bind(this, this)}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Clear", returnText: true }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-other"
                    //   onClick={PostDoctorCommission.bind(this, this)}
                    // disabled={this.state.postEnable}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Generate Payment",
                        returnText: true,
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </div>
    </>
  );
}
// }

// function mapStateToProps(state) {
//   return {
//     providers: state.providers,
//     servicetype: state.servicetype,
//     doctorcommission: state.doctorcommission,
//     billscommission: state.billscommission,
//     services: state.services,
//     headercommission: state.headercommission,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getProviderDetails: AlgaehActions,
//       getServiceTypes: AlgaehActions,
//       getDoctorCommission: AlgaehActions,
//       getDoctorsCommission: AlgaehActions,
//       getServices: AlgaehActions,
//       CalculateCommission: AlgaehActions,
//       calculateCommission: AlgaehActions,
//     },
//     dispatch
//   );
// }
export default DoctorCommission;
// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(DoctorCommission)
// );
