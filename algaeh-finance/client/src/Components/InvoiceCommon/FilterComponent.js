import React, { useState } from "react";
import {
  AlgaehButton,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehDateHandler
} from "algaeh-react-components";

export default function FilterComponent(props) {
  const [level, setLevel] = useState(undefined);
  const [status, setStatus] = useState("");
  const [dates, setDates] = useState(undefined);
  return (
    <div className="row inner-top-search" style={{ paddingBottom: 10 }}>
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
              { text: "Transaction No.", value: "1" },
              { text: "Transaction Date", value: "2" },
              { text: "Line Amount", value: "3" },
              { text: "Line Description", value: "4" }
            ],
            valueField: "value",
            textField: "text"
          },
          value: level,
          onChange: selected => {
            setLevel(selected.value);
          },
          onClear: () => {
            setLevel(undefined);
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
              { text: "Contains", value: "1" },
              { text: "Equals", value: "2" },
              { text: "Greater than", value: "3" },
              { text: "Less than", value: "4" }
            ],
            valueField: "value",
            textField: "text"
          },
          value: status,
          onChange: selected => {
            setStatus(selected.value);
          },
          onClear: () => {
            setStatus(undefined);
          }
        }}
      />
      {level !== 3 ? (
        <AlgaehFormGroup
          div={{
            className: "col form-group"
          }}
          label={{
            forceLabel: "",
            isImp: true
          }}
          textBox={{
            type: "text",
            value: "",
            className: "form-control",
            id: "name",
            placeholder: "",
            autoComplete: false
          }}
        />
      ) : (
        <AlgaehDateHandler
          div={{ className: "col-3" }}
          label={{ forceLabel: "Transaction Date" }}
          //type="date"
          textBox={{
            value: dates
          }}
          events={{
            onChange: selected => {
              setDates(selected);
            }
          }}
        />
      )}

      <div className="col-2">
        {" "}
        <AlgaehButton
          type="primary"
          loading={props.loading}
          // onClick={loadData}
          style={{ marginTop: 15 }}
        >
          Search
        </AlgaehButton>
      </div>
    </div>
  );
}
