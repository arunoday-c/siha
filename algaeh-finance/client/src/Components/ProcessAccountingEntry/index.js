import React, { memo, useState } from "react";
import {
  // AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehDateHandler,
  AlgaehFormGroup,
  AlgaehButton,
  AlgaehMessagePop,
} from "algaeh-react-components";
import moment from "moment";
import { Modal } from "antd";
import { ProcessAccountingEntrys } from "./events";

// import { useHistory } from "react-router-dom";
// import { AlgaehTable } from "algaeh-react-components";
// import { getAmountFormart } from "../../utils/GlobalFunctions";

export default memo(function ProcessAccountingEntry(props) {
  debugger;

  const [transation_type, setTransationType] = useState(null);
  const [transation_wise, setTransationWise] = useState("D");
  const [bill_number, setBillNumber] = useState(null);
  const previousMonthDate = [moment().startOf("month"), moment()];
  const [dateRange, setDateRange] = useState(previousMonthDate);
  const [loading, setLoading] = useState(false);
  //   const history = useHistory();
  //   const [info, setInfo] = useState({
  //     over_due: "",
  //     total_receivable: "",
  //     day_end_pending: "",
  //   });

  function onClickSendSelected() {
    Modal.confirm({
      title: "Are you sure do you want to process ?",
      okText: "Proceed",
      cancelText: "Cancel",
      onOk: () => {
        setLoading(true);
        debugger;
        ProcessAccountingEntrys({
          from_date: dateRange[0],
          to_date: dateRange[1],
          transation_type: transation_type,
          bill_number: bill_number,
        })
          .then(() => {
            debugger;
            setLoading(false);
            AlgaehMessagePop({
              type: "success",
              display: "Processed Successfully...",
            });
            // history.push("/JournalVoucher", {
            //   data: { ...row, disabled: true },
            //   type: "supplier",
            // });
          })
          .catch((error) => {
            setLoading(false);
            AlgaehMessagePop({
              type: "Error",
              display: error,
            });
          });
      },
    });
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <AlgaehAutoComplete
              div={{
                className: "col",
              }}
              label={{
                forceLabel: "Select Transation",
              }}
              selector={{
                dataSource: {
                  data: [
                    { text: "Billing", value: "1" },
                    { text: "Bill Cancellation", value: "2" },
                  ],
                  valueField: "value",
                  textField: "text",
                },
                value: transation_type,

                onChange: (selected) => {
                  setTransationType(selected.value);
                },
                onClear: () => {
                  setTransationType(null);
                },
              }}
            />

            <div className="col">
              <label>Transation Type</label>
              <div className="customRadio">
                <label className="radio inline">
                  <input
                    type="radio"
                    value="P"
                    name="cost_center_type"
                    onChange={(e) => {
                      setTransationWise("D");
                    }}
                    checked={transation_wise === "D"}
                  />
                  <span>Date Wise</span>
                </label>

                <label className="radio inline">
                  <input
                    type="radio"
                    value="SD"
                    onChange={(e) => {
                      debugger;
                      setTransationWise("T");
                    }}
                    name="cost_center_type"
                    checked={transation_wise === "T"}
                  />
                  <span>Transation Wise</span>
                </label>
              </div>
            </div>

            {transation_wise === "D" ? (
              <AlgaehDateHandler
                type={"range"}
                div={{
                  className: "col form-group",
                }}
                label={{
                  forceLabel: "Select Date Range",
                }}
                textBox={{
                  name: "selectRange",
                  value: dateRange,
                }}
                maxDate={moment().add(1, "days")}
                events={{
                  onChange: (dateSelected) => {
                    setDateRange(dateSelected);
                  },
                }}
              />
            ) : (
              <AlgaehFormGroup
                div={{
                  className: "col form-group  mandatory",
                }}
                label={{
                  forceLabel: "Bill Number",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  value: bill_number,
                  className: "form-control",
                  id: "name",
                  onChange: (e) => {
                    setBillNumber(e.target.value);
                  },
                  autoComplete: false,
                }}
              />

              // <div
              //   className="col-2 globalSearchCntr"
              //   style={{
              //     cursor: "pointer",
              //     pointerEvents:
              //       this.state.Billexists === true
              //         ? "none"
              //         : this.state.patient_code
              //         ? "none"
              //         : "",
              //   }}
              // >
              //   <AlgaehLabel label={{ fieldName: "s_patient_code" }} />
              //   <h6 onClick={PatientSearch.bind(this, this, context)}>
              //   <h6>
              //     {this.state.patient_code ? (
              //   this.state.patient_code
              // ) : (
              //   <AlgaehLabel label={{ fieldName: "patient_code" }} />
              // )}
              //     <i className="fas fa-search fa-lg"></i>
              //   </h6>
              // </div>
            )}

            <AlgaehButton
              className="btn btn-primary"
              // disabled={!processList.length}
              loading={loading}
              onClick={onClickSendSelected}
            >
              Process
            </AlgaehButton>
          </div>
        </div>
      </div>
    </div>
  );
});
