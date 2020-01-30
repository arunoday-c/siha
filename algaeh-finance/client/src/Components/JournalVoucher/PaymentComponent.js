import React from "react";
import {
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehDateHandler
} from "algaeh-react-components";
import { PAYMENT_METHODS } from "../../data/dropdownList";
import moment from "moment";

export default function PaymentComponent({
  show = false,
  payment_mode,
  ref_no,
  cheque_date,
  handleChange,
  handleDrop
}) {
  if (show) {
    return (
      <>
        <AlgaehAutoComplete
          div={{ className: "col-2" }}
          label={{
            forceLabel: "Payment Mode",
            isImp: true
          }}
          selector={{
            name: "payment_mode",
            value: payment_mode,
            dataSource: {
              data: PAYMENT_METHODS,
              valueField: "value",
              textField: "name"
            },
            onChange: handleDrop,
            onClear: () => null
          }}
        />
        {payment_mode && payment_mode !== "CASH" ? (
          <AlgaehFormGroup
            div={{
              className: "col-2 algaeh-text-fld"
            }}
            label={{
              forceLabel: "Reference No.",
              isImp: true
            }}
            textBox={{
              type: "text",
              name: "ref_no",
              className: "form-control",
              value: ref_no,
              onChange: e => {
                const { value } = e.target;
                handleChange(state => ({ ...state, ref_no: value }));
              }
            }}
          />
        ) : null}
        {payment_mode === "CHEQUE" ? (
          <AlgaehDateHandler
            div={{
              className: "col-2 algaeh-date-fld"
            }}
            label={{
              forceLabel: "Cheque Date",
              isImp: true
            }}
            textBox={{
              name: "cheque_date",
              className: "form-control",
              value: cheque_date
            }}
            maxDate={moment().add(1, "days")}
            events={{
              onChange: selected => {
                handleChange(state => ({
                  ...state,
                  cheque_date: selected._d
                }));
              }
            }}
          />
        ) : null}
      </>
    );
  }
  return null;
}
