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
  const [transation_type, setTransationType] = useState(null);
  const [transation_wise, setTransationWise] = useState("D");
  const [bill_number, setBillNumber] = useState(null);
  const previousMonthDate = [moment().startOf("month"), moment()];
  const [dateRange, setDateRange] = useState(previousMonthDate);
  const [loading, setLoading] = useState(false);

  function onClickSendSelected() {
    if (transation_type === null) {
      AlgaehMessagePop({
        type: "warning",
        display: "Select Transation",
      });
      return;
    }
    Modal.confirm({
      title: "Are you sure do you want to generate ?",
      okText: "Proceed",
      cancelText: "Cancel",
      onOk: () => {
        setLoading(true);
        ProcessAccountingEntrys({
          from_date: dateRange[0],
          to_date: dateRange[1],
          transation_type: transation_type,
          bill_number: bill_number,
        })
          .then(() => {
            setLoading(false);
            AlgaehMessagePop({
              type: "success",
              display: "Generated Successfully...",
            });
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
    <div className="counter">
      <div className="row inner-top-search">
        <AlgaehAutoComplete
          div={{
            className: "col-3 form-group mandatory",
          }}
          label={{
            forceLabel: "Select Transation",
            isImp: true,
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
              setDateRange(previousMonthDate);
              setBillNumber(null);
            },
            onClear: () => {
              setTransationType(null);
              setDateRange(previousMonthDate);
              setBillNumber(null);
            },
          }}
        />

        <div className="col-3">
          <label>Transation Type</label>
          <div className="customRadio">
            <label className="radio inline">
              <input
                type="radio"
                value="P"
                name="cost_center_type"
                onChange={(e) => {
                  setTransationWise("D");
                  setDateRange(previousMonthDate);
                  setBillNumber(null);
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
                  setTransationWise("T");
                  setDateRange(previousMonthDate);
                  setBillNumber(null);
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
              className: "col-3 form-group mandatory",
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
              className: "col-2 form-group  mandatory",
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
        )}

        <AlgaehButton
          className="btn btn-default"
          style={{ marginTop: 17 }}
          loading={loading}
          onClick={onClickSendSelected}
        >
          Generate
        </AlgaehButton>
      </div>
    </div>
  );
});
