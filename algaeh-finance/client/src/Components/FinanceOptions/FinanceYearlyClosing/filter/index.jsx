import React, { useState, useRef, useEffect } from "react";
// import _, { debounce } from "lodash";
import {
  AlgaehDateHandler,
  // AlgaehAutoComplete,
  DatePicker,
  AlgaehTreeSearch,
  AlgaehMessagePop,
  AlgaehButton,
} from "algaeh-react-components";
import moment from "moment";
import {
  getAccountsForYearEnd,
  getSelectedAccountDetails,
  processYearEnd,
} from "../events";
export default function Filters({ activeTransaction }) {
  const [state, setState] = useState({});
  const [dateRange, setDateRange] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  // const deBounce = useRef(
  //   _.debounce((e) => pushToState({ [e.target.name]: e.target.value }), 500)
  // ).current;
  useEffect(() => {
    if (Object.keys(activeTransaction).length > 0) {
      pushToState({
        ...activeTransaction,
        current_year: moment(
          activeTransaction.year_start_date,
          "YYYY-MM-DD HH:mm:ss"
        ),
        selectRange: [
          moment(activeTransaction.year_start_date, "YYYY-MM-DD HH:mm:ss"),
          moment(activeTransaction.year_end_date, "YYYY-MM-DD HH:mm:ss"),
        ],
      });
      setDateRange([
        activeTransaction.year_start_date,
        activeTransaction.year_end_date,
      ]);
    }
  }, [activeTransaction]);
  useEffect(() => {
    (async () => {
      try {
        const { records } = await getAccountsForYearEnd();
        setAccounts(records);
      } catch (error) {
        AlgaehMessagePop({ type: "error", display: error.message });
      }
    })();

    // eslint-disable-next-line
  }, []);
  function pushToState(newObject) {
    setState((internal) => {
      return { ...internal, ...newObject };
    });
  }
  function OnChangeTreeValue(value) {
    if (value === undefined) {
      pushToState({ account: "" });
      return;
    }

    if (state.current_year && state.selectRange) {
      pushToState({ account: value });
      const delta = value.split("-");
      if (isNaN(delta[0]) || isNaN(delta[1])) {
        AlgaehMessagePop({
          type: "warning",
          display: "It is not an Child Node please add before selecting.",
        });
        pushToState({ account: "" });
        return;
      }
      getSelectedAccountDetails({
        head_id: delta[0],
        child_id: delta[1],
      })
        .then((records) => {
          pushToState({
            current_account: records.credit_minus_debit,
            new_amount:
              parseFloat(records.credit_minus_debit) +
              parseFloat(state.credit_minus_debit),
          });
        })
        .catch((error) => {
          AlgaehMessagePop({
            type: "error",
            display: error.message,
          });
        });
    } else {
      AlgaehMessagePop({
        type: "info",
        display: "Year and date range can not blank",
      });
      pushToState({ account: "" });
    }
  }
  async function onProcessHandler() {
    setLoading(true);
    if (state.account === undefined || state.account === "") {
      setLoading(false);
      AlgaehMessagePop({ type: "error", display: "Please select Account" });
      return;
    }

    const delta = state.account.split("-");
    const data = {
      year_end_id: state.year_end_id,
      updated_amount: state.new_amount,
      voucher_type: "year_end",
      from_screen: "YEAR_END",
      transaction_date: moment(dateRange[1]).format("YYYY-MM-DD 23:00:00"),
      cost_center_id: null,
      details: [
        {
          child_id: delta[1],
          head_id: delta[0],
          payment_mode: "CA",
          payment_type: "CR",
          slno: 1,
          sourceName: state.account,
          cost_center_id: null,
          amount: state.credit_minus_debit,
        },
        {
          child_id: "1",
          head_id: "3",
          payment_mode: "CA",
          payment_type: "DR",
          slno: 2,
          sourceName: "3-1",
          cost_center_id: null,
          amount: state.credit_minus_debit,
        },
      ],
    };
    const result = await processYearEnd(data).catch((error) => {
      setLoading(false);
      AlgaehMessagePop({ type: "error", display: error.message });
    });
    AlgaehMessagePop({ type: "success", display: result.message });
    setLoading(false);
  }
  return (
    <div className="row inner-top-search">
      <div className="col-1 form-group ">
        <label className="style_Label">Select Year</label>
        <DatePicker
          value={state.current_year}
          onChange={(mDate) => {
            pushToState({ current_year: mDate });
          }}
          picker="year"
        />
      </div>
      <AlgaehDateHandler
        type="range"
        div={{
          className: "col-3 form-group",
        }}
        label={{
          forceLabel: "Selected Date",
        }}
        textBox={{
          name: "selectRange",
          value: state.selectRange,
          disabled: true,
        }}
        others={{
          disabled: true,
        }}
        events={{
          onChange: (e) => {
            pushToState({ current_year: e });
          },
        }}
      />
      <AlgaehTreeSearch
        div={{ className: "col-3" }}
        label={{
          forceLabel: "Select Account",
          isImp: true,
        }}
        tree={{
          treeDefaultExpandAll: true,
          // updateInternally: true,
          data: accounts,
          disableHeader: true,
          textField: "full_name",
          disabled: false,
          valueField: (node) => {
            if (node?.finance_account_child_id) {
              return `${node?.head_id}-${node?.finance_account_child_id}-${node?.account_code}`;
            } else {
              return `${node?.finance_account_head_id}`; //-${node?.account_code}
            }
          },

          value: state.account,
          onChange: OnChangeTreeValue,
        }}
      />
      <div className="col">
        <label>Year End Total</label>
        <h6>{state.credit_minus_debit ?? "0.00"}</h6>
      </div>
      <div className="col">
        <label>Current Amount</label>
        <h6>{state.current_account ?? "0.00"}</h6>
      </div>
      <div className="col">
        <label>New Amount</label>
        <h6>{state.new_amount ?? "0.00"}</h6>
      </div>
      <div className="col" style={{ marginTop: 21 }}>
        <AlgaehButton
          className="btn btn-primary btn-small"
          onClick={onProcessHandler}
          loading={loading}
        >
          Process Year Ending
        </AlgaehButton>
      </div>
    </div>
  );
}
