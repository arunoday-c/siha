import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { queryCache } from "react-query";
import {
  AlgaehLabel,
  AlgaehFormGroup,
  AlgaehAutoComplete,
  AlgaehDateHandler,
  AlgaehModal,
  AlgaehMessagePop,
  MainContext,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../hooks";
import { useCurrency } from "./patientHooks";

export function AdvanceModal({
  // onClose,
  // title,
  patient,
}) {
  const { userLanguage } = useContext(MainContext);
  // const { fieldNameFn } = useLangFieldName();
  const { amountWithCur } = useCurrency();
  const [enableCash, setEnableCash] = useState(true);
  const [enableCard, setEnableCard] = useState(false);
  const shifts = queryCache.getQueryData("userMappings");
  const [visible, setVisible] = useState(false);
  const baseInput = {
    cash_amount: 0,
    card_amount: 0,
    card_number: "",
    card_date: null,
    shift_id: shifts ? shifts[0]?.shift_id : null,
  };
  const [inputs, setInputs] = useState(baseInput);
  const [title, setTitle] = useState("");
  const [data, setData] = useState(null);
  const onClose = () => {
    setVisible(false);
    setTitle("");
  };

  useEffect(() => {
    setInputs(baseInput);
    setData(null);
    setEnableCard(false);
    setEnableCash(true);
    // eslint-disable-next-line
  }, [title]);

  useEffect(() => {
    if (patient) {
      setInputs(baseInput);
      setData(null);
    }
    // eslint-disable-next-line
  }, [patient]);

  useEffect(() => {
    if (shifts) {
      setInputs((state) => ({ ...state, shift_id: shifts[0]?.shift_id }));
    }
  }, [shifts]);

  const onSave = async (data) => {
    data.ScreenCode === "AD0001"
    const res = await newAlgaehApi({
      uri: "/billing/patientAdvanceRefund",
      module: "billing",
      method: "POST",
      data,
    });
    if (res.data.success) {
      return res.data.records;
    } else {
      throw new Error(res.data?.message);
    }
  };

  const onSubmit = () => {
    const inputData = {};
    if (title === "Advance") {
      inputData.pay_type = "R";
      inputData.transaction_type = "AD";
    } else if (title === "Refund") {
      inputData.pay_type = "P";
      inputData.transaction_type = "RF";
    }
    inputData.total_amount = inputs?.card_amount + inputs?.cash_amount;
    inputData.advance_amount = inputs?.card_amount + inputs?.cash_amount;
    inputData.hims_f_patient_id = patient?.hims_d_patient_id;
    inputData.shift_id = inputs.shift_id;
    const receiptdetails = [];
    if (inputs?.cash_amount > 0) {
      receiptdetails.push({
        amount: inputs.cash_amount,
        card_check_number: null,
        card_type: null,
        expiry_date: null,
        hims_f_receipt_header_id: null,
        pay_type: "CA",
        updated_date: null,
      });
    }
    if (inputs?.card_amount > 0) {
      receiptdetails.push({
        amount: inputs.card_amount,
        card_check_number: inputs.card_number || null,
        card_type: null,
        expiry_date: inputs.card_date || null,
        hims_f_receipt_header_id: null,
        pay_type: "CD",
        updated_date: null,
      });
    }
    inputData.receiptdetails = receiptdetails;
    onSave(inputData)
      .then((res) => {
        setData(res);
        setVisible(false);
        queryCache.invalidateQueries([
          "patient",
          { patient_code: patient?.patient_code },
        ]);
        AlgaehMessagePop({
          display:
            title === "Advance"
              ? "Advance Collected Successfully"
              : "Refund paid Successfully",
          type: "success",
        });
      })
      .catch((e) => {
        AlgaehMessagePop({
          display: e.message,
          type: "error",
        });
      });
  };

  // const baseState = {
  //   advance_amount: 0,
  //   hims_f_patient_id: null,
  //   pay_type: "",
  //   transaction_type: "",
  //   total_amount: "",
  //   receiptdetails: [
  //     {
  //     amount: 0,
  // card_check_number: null,
  // card_type: null,
  // expiry_date: null,
  // hims_f_receipt_header_id: null,
  // pay_type: "CA",
  // updated_date: null,
  //   },
  //     {
  //     amount: 0,
  // card_check_number: null,
  // card_type: null,
  // expiry_date: null,
  // hims_f_receipt_header_id: null,
  // pay_type: "CD",
  // updated_date: null,
  //   },
  // ]
  // }

  return (
    <div>
      <button
        type="button"
        className="btn btn-other"
        onClick={() => {
          setTitle("Refund");
          setVisible(true);
        }}
        disabled={!patient || !patient?.advance_amount || !shifts.length}
      >
        <AlgaehLabel
          label={{
            fieldName: "btn_refund",
            returnText: true,
          }}
        />
      </button>
      <button
        type="button"
        className="btn btn-other"
        onClick={() => {
          setVisible(true);
          setTitle("Advance");
        }}
        disabled={!patient || !shifts.length}
      >
        <AlgaehLabel
          label={{
            fieldName: "btn_advance",
            returnText: true,
          }}
        />
      </button>
      <AlgaehModal
        title={title}
        visible={visible}
        mask={true}
        maskClosable={true}
        onCancel={onClose}
        footer={null}
        className={`${userLanguage}_comp row algaehNewModal advanceRefundModal`}
      >
        <div className="col-12 popupInner margin-top-15">
          <div className="row">
            <div className="col">
              <AlgaehLabel
                label={{
                  fieldName: "patient_code",
                }}
              />
              <h6>{patient?.patient_code ?? "Patient Code"}</h6>
            </div>
            <div className="col">
              <AlgaehLabel
                label={{
                  fieldName: "full_name",
                }}
              />
              <h6>{patient?.full_name ?? "Patient Name"}</h6>
            </div>
          </div>
          <hr style={{ margin: "0rem" }} />
          <div className="row secondary-box-container">
            {!!shifts?.length && (
              <AlgaehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "shift_id",
                  isImp: true,
                }}
                selector={{
                  name: "shift_id",
                  className: "select-fld",
                  value: inputs?.shift_id,
                  dataSource: {
                    textField: "shift_description",
                    valueField: "shift_id",
                    data: shifts ?? [],
                  },
                  onChange: (_, selected) => {
                    setInputs((state) => ({ ...state, shift_id: selected }));
                  },
                }}
              />
            )}
          </div>
          <hr />
          {/* Payment Type */}
          {/* Cash */}
          <div className="row secondary-box-container">
            <div
              className="customCheckbox col-lg-3"
              style={{ border: "none", marginTop: "28px" }}
            >
              <label className="checkbox" style={{ color: "#212529" }}>
                <input
                  type="checkbox"
                  name="Pay by Cash"
                  checked={enableCash}
                  onChange={() => setEnableCash((state) => !state)}
                  disabled={title === "Refund"}
                />

                <span style={{ fontSize: "0.8rem" }}>
                  <AlgaehLabel label={{ fieldName: "payby_cash" }} />
                </span>
              </label>
            </div>

            <AlgaehFormGroup
              div={{ className: "col-lg-2 mandatory" }}
              label={{
                fieldName: "amount",
                isImp: true,
              }}
              textBox={{
                disabled: !enableCash,
                className: "txt-fld",
                name: "cash_amount",
                type: "number",
                value: inputs.cash_amount,
                onChange: (e) => {
                  const { value } = e.target;
                  setInputs((state) => ({
                    ...state,
                    cash_amount: parseFloat(value) || value,
                  }));
                },

                // placeholder: "0.00",
              }}
            />
          </div>
          {title === "Advance" ? (
            <div className="">
              {/* Card */}
              <div className="row secondary-box-container">
                <div
                  className="customCheckbox col-lg-3"
                  style={{ border: "none", marginTop: "28px" }}
                >
                  <label className="checkbox" style={{ color: "#212529" }}>
                    <input
                      type="checkbox"
                      name="Pay by Card"
                      checked={enableCard}
                      onChange={() => setEnableCard((state) => !state)}
                    />
                    <span style={{ fontSize: "0.8rem" }}>
                      <AlgaehLabel label={{ fieldName: "payby_card" }} />
                    </span>
                  </label>
                </div>

                <AlgaehFormGroup
                  div={{ className: "col-lg-2" }}
                  label={{
                    fieldName: "amount",
                    isImp: true,
                  }}
                  textBox={{
                    disabled: !enableCard,
                    className: "txt-fld",
                    name: "card_amount",
                    value: inputs.card_amount,
                    onChange: (e) => {
                      const { value } = e.target;
                      setInputs((state) => ({
                        ...state,
                        card_amount: parseFloat(value) || value,
                      }));
                    },
                    placeholder: "0.00",
                  }}
                />
                <AlgaehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "card_check_number",
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "card_number",
                    value: inputs.card_number,

                    onChange: (e) => {
                      const { value } = e.target;
                      setInputs((state) => ({
                        ...state,
                        card_number: value,
                      }));
                    },

                    disabled: !enableCard,
                    placeholder: "0000-0000-0000-0000",
                  }}
                />

                <AlgaehDateHandler
                  div={{ className: "col-lg-2" }}
                  label={{
                    fieldName: "expiry_date",
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "card_date",
                  }}
                  disabled={!enableCard}
                  minDate={new Date()}
                  events={{
                    onChange: (mdate) =>
                      setInputs((state) => ({
                        ...state,
                        card_date: mdate?._d,
                      })),
                  }}
                  value={inputs.card_date}
                />
              </div>
            </div>
          ) : null}
          <hr />
          <div className="row secondary-box-container">
            <div className="col-lg-3">
              <AlgaehLabel
                label={{
                  fieldName: "advance_amount",
                }}
              />
              <h6>
                {amountWithCur(
                  data?.total_advance_amount || patient?.advance_amount
                )}
              </h6>
            </div>

            <div className="col-lg-3">
              <AlgaehLabel
                label={{
                  fieldName: "total_amount",
                }}
              />
              <h6>{amountWithCur(inputs.card_amount + inputs.cash_amount)}</h6>
            </div>
            <div className="col-lg-3">
              <AlgaehLabel
                label={{
                  fieldName: "receipt_number",
                }}
              />
              <h6>{data?.receipt_number || "Not Generated"}</h6>
            </div>
            <div className="col-lg-3">
              <AlgaehLabel
                label={{
                  fieldName: "receipt_date",
                }}
              />
              <h6>{moment().format("DD/MM/YYYY")}</h6>
            </div>
          </div>
        </div>
        <div className="popupFooter">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onSubmit}
                  disabled={!shifts?.length || !inputs?.cash_amount}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </AlgaehModal>
    </div>
  );
}
// class AddAdvanceModal extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }
//   static contextType = MainContext;

//   UNSAFE_componentWillMount() {
//     let IOputs = AdvRefunIOputs.inputParam();

//     const userToken = this.context.userToken;

//     IOputs.Cashchecked = userToken.default_pay_type === "CH" ? true : false;
//     IOputs.Cardchecked = userToken.default_pay_type === "CD" ? true : false;
//     IOputs.default_pay_type = userToken.default_pay_type;

//     this.setState(IOputs);
//   }

//   UNSAFE_componentWillReceiveProps(newProps) {
//     if (newProps.PackageAdvance === undefined) {
//       let Cashchecked = false;
//       let Cardchecked = false;
//       let cash_amount = 0;
//       if (newProps.inputsparameters.transaction_type === "RF") {
//         Cashchecked = true;
//         Cardchecked = false;
//         cash_amount = newProps.inputsparameters.advance_amount;
//       } else {
//         Cashchecked = this.state.default_pay_type === "CH" ? true : false;
//         Cardchecked = this.state.default_pay_type === "CD" ? true : false;
//       }
//       let lang_sets = "en_comp";
//       if (Window.global.selectedLang === "ar") {
//         lang_sets = "ar_comp";
//       }
//       this.setState({
//         selectedLang: Window.global.selectedLang,
//         lang_sets: lang_sets,
//         Cashchecked: Cashchecked,
//         Cardchecked: Cardchecked,
//         cash_amount: cash_amount,
//         total_amount: cash_amount,
//       });
//     }
//     getCashiersAndShiftMAP(this, this);
//   }

//   componentDidMount() {

//     // if (this.props.counters === undefined || this.props.counters.length === 0) {
//     //   this.props.getCounters({
//     //     uri: "/shiftAndCounter/getCounterMaster",
//     //     module: "masterSettings",
//     //     method: "GET",
//     //     redux: {
//     //       type: "CTRY_GET_DATA",
//     //       mappingName: "counters"
//     //     }
//     //   });
//     // }
//     getCashiersAndShiftMAP(this, this);

//     let _screenName = getCookie("ScreenName").replace("/", "");

//   }

//   onClose = (e) => {
//     let IOputs = AdvRefunIOputs.inputParam();
//     this.setState(IOputs, () => {
//       this.props.onClose && this.props.onClose(e);
//     });
//   };

//   GenerateReciept(callback) {
//     if (this.state.total_amount > 0) {
//       let obj = [];

//       if (this.state.cash_amount > 0) {
//         obj.push({
//           hims_f_receipt_header_id: null,
//           card_check_number: null,
//           expiry_date: null,
//           pay_type: this.state.pay_cash,
//           amount: this.state.cash_amount,
//           updated_date: null,
//           card_type: null,
//         });
//       }
//       if (this.state.card_amount > 0) {
//         obj.push({
//           hims_f_receipt_header_id: null,
//           card_check_number: this.state.card_number,
//           expiry_date: this.state.card_date,
//           pay_type: this.state.pay_card,
//           amount: this.state.card_amount,
//           updated_date: null,
//           card_type: null,
//         });
//       }
//       if (this.state.cheque_amount > 0) {
//         obj.push({
//           hims_f_receipt_header_id: null,
//           card_check_number: this.state.cheque_number,
//           expiry_date: this.state.cheque_date,
//           pay_type: this.state.pay_cheque,
//           amount: this.state.cheque_amount,
//           updated_date: null,
//           card_type: null,
//         });
//       }
//       let package_id = null;
//       if (this.props.PackageAdvance === true) {
//         package_id = this.props.inputsparameters.package_id;
//       }

//       this.setState(
//         {
//           receiptdetails: obj,
//           hims_f_patient_id: this.props.inputsparameters.hims_f_patient_id,
//           transaction_type: this.props.inputsparameters.transaction_type,
//           pay_type: this.props.inputsparameters.pay_type,
//           advance_amount: this.state.total_amount,
//           package_id: package_id,
//         },
//         () => {
//           callback(this);
//         }
//       );
//     }
//   }

//   SaveAdvance(context, e) {
//     const err = Validations(this, this);

//     let advance_amt =
//       parseFloat(this.props.inputsparameters.advance_amount) +
//       parseFloat(this.state.total_amount);
//     if (advance_amt < parseFloat(this.props.inputsparameters.collect_advance)) {
//       swalMessage({
//         title:
//           "Collecting Amount Cannot be less than mini. package advance amount",
//         type: "warning",
//       });
//       return;
//     }
//     if (!err) {
//       this.GenerateReciept(($this) => {
//         AlgaehLoader({ show: true });

//         if ($this.props.PackageAdvance === true) {
//           algaehApiCall({
//             uri: "/billing/patientPackageAdvanceRefund",
//             module: "billing",
//             method: "POST",
//             data: $this.state,
//             onSuccess: (response) => {
//               AlgaehLoader({ show: false });
//               if (response.data.success) {
//                 let data = response.data.records;
//                 // let IOputs = AdvRefunIOputs.inputParam();
//                 // IOputs.receipt_number = data.receipt_number;
//                 // $this.setState(IOputs, () => {
//                 //   this.props.onClose && this.props.onClose(e);
//                 // });
//                 $this.setState({
//                   receipt_number: data.receipt_number,
//                 });

//                 swalMessage({
//                   title: "Advance Collected Successfully.",
//                   type: "success",
//                 });

//                 context.updateState({
//                   advance_amount: data.total_advance_amount,
//                   // AdvanceOpen: false,
//                   // RefundOpen: false
//                 });
//               }
//             },
//             onFailure: (error) => {
//               AlgaehLoader({ show: false });
//               swalMessage({
//                 title: error.message,
//                 type: "error",
//               });
//             },
//           });
//         } else {
//           $this.state.ScreenCode = getCookie("ScreenCode");
//           algaehApiCall({
//             uri: "/billing/patientAdvanceRefund",
//             module: "billing",
//             method: "POST",
//             data: $this.state,
//             onSuccess: (response) => {
//               AlgaehLoader({ show: false });
//               if (response.data.success) {
//                 let data = response.data.records;
//                 $this.setState({
//                   receipt_number: data.receipt_number,
//                 });

//                 if (this.props.Advance === true) {
//                   swalMessage({
//                     title: "Advance Collected Successfully.",
//                     type: "success",
//                   });
//                 } else {
//                   swalMessage({
//                     title: "Refunded Successfully.",
//                     type: "success",
//                   });
//                 }
//               } else {
//                 swalMessage({
//                   title: response.data.records.message,
//                   type: "error",
//                 });
//               }
//             },
//             onFailure: (error) => {
//               AlgaehLoader({ show: false });
//               swalMessage({
//                 title: error.message,
//                 type: "error",
//               });
//             },
//           });
//         }
//       });
//     }
//   }

//   render() {
//     let Advance =
//       this.props.Advance === true ? true : this.props.PackageAdvance;
//     return (

//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     shifts: state.shifts,
//     bankscards: state.bankscards,
//     // counters: state.counters
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getShifts: AlgaehActions,
//       // getCounters: AlgaehActions
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(AddAdvanceModal)
// );
