import React, { useState } from "react";
import {
  AlgaehButton,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehMessagePop
} from "algaeh-react-components";
import { newAlgaehApi } from "../../hooks";

export default function FilterComponent({ setData, loading, setLoading }) {
  const [voucher_type, setVoucherType] = useState("all");
  const [search_in, setSearchIn] = useState("invoice_no");
  const [search_type, setSearchType] = useState("C");
  const [value, setValue] = useState("");

  async function loadData() {
    try {
      const result = await newAlgaehApi({
        uri: "/quick_search/performSearch",
        data: {
          voucher_type,
          search_type,
          search_in,
          value
        },
        module: "finance",
        method: "GET"
      });
      if (result.data.success) {
        setData(result.data.result);
      }
    } catch (error) {
      console.warn(error.message);
      throw new Error(error.message);
    }
  }

  function search() {
    setLoading(true);
    loadData()
      .then(() => setLoading(false))
      .catch(e => {
        AlgaehMessagePop({
          type: "error",
          display: e.message
        });
        setLoading(false);
      });
  }

  return (
    <>
      <div className="row inner-top-search" style={{ paddingBottom: 10 }}>
        <AlgaehAutoComplete
          div={{
            className: "col-2"
          }}
          label={{
            forceLabel: "Voucher Type"
          }}
          selector={{
            dataSource: {
              data: [
                { text: "All", value: "all" },
                { text: "Debit Note", value: "debit_note" },
                { text: "Credit Note", value: "credit_note" },
                { text: "Purchase", value: "purchase" },
                { text: "Sales", value: "sales" },
                { text: "Payment", value: "payment" },
                { text: "Receipt", value: "receipt" },
                { text: "Contra", value: "contra" },
                { text: "Journal", value: "journal" }
              ],
              valueField: "value",
              textField: "text"
            },
            value: voucher_type,
            onChange: selected => {
              setVoucherType(selected.value);
            },
            onClear: () => {
              setVoucherType(undefined);
            }
          }}
        />

        <AlgaehAutoComplete
          div={{
            className: "col-2"
          }}
          label={{
            forceLabel: "Transaction Lines"
          }}
          selector={{
            dataSource: {
              data: [
                { text: "Invoice No.", value: "invoice_no" },
                { text: "Voucher No", value: "voucher_no" },
                { text: "Last Modified", value: "last_modified" },
                { text: "Line Description", value: "line_desc" },
                { text: "Line Amount", value: "line_amount" },
                { text: "Line Account", value: "line_account" }
              ],
              valueField: "value",
              textField: "text"
            },
            value: search_in,
            onChange: selected => {
              setSearchIn(selected.value);
            },
            onClear: () => {
              setSearchIn(undefined);
            }
          }}
        />
        <AlgaehAutoComplete
          div={{
            className: "col-2"
          }}
          label={{
            forceLabel: "Filter by"
          }}
          selector={{
            dataSource: {
              data: [
                { text: "Contains", value: "C" },
                { text: "Equals", value: "E" }
                // { text: "Greater than", value: "3" },
                // { text: "Less than", value: "4" }
              ],
              valueField: "value",
              textField: "text"
            },
            value: search_type,
            onChange: selected => {
              setSearchType(selected.value);
            },
            onClear: () => {
              setSearchType(undefined);
            }
          }}
        />

        <AlgaehFormGroup
          div={{
            className: "col"
          }}
          label={{
            forceLabel: "Search Term",
            isImp: true
          }}
          textBox={{
            type: "text",
            value: value,
            onChange: e => {
              const { value } = e.target;
              setValue(value);
            },
            className: "form-control",
            name: "value",
            placeholder: "Search Term",
            autocomplete: false
          }}
        />

        <div className="col-2">
          <AlgaehButton
            type="primary"
            loading={loading}
            onClick={search}
            style={{ marginTop: 15 }}
          >
            Search
          </AlgaehButton>
        </div>
      </div>
    </>
  );
}

// voucher_type = [
//   journal,
//   contra,
//   receipt,
//   payment,
//   sales,
//   purchase,
//   credit_note,
//   debit_note,
//   all
// ];
// search_in = [
//   line_account,
//   line_amount,
//   line_desc,
//   last_modified,
//   invoice_no,
//   voucher_no
// ];
// search_type = [C, E];
