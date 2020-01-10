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
  paymentType,
  ref_no,
  cheque_date,
  handleChange,
  handleDrop
}) {
  if (show) {
    return (
      <div className="col-6">
        <div className="row">
          <AlgaehAutoComplete
            div={{ className: "col-4" }}
            label={{
              forceLabel: "Payment Type",
              isImp: true
            }}
            selector={{
              name: "paymentType",
              value: paymentType,
              dataSource: {
                data: PAYMENT_METHODS,
                valueField: "value",
                textField: "name"
              },
              onChange: handleDrop,
              onClear: () => null
            }}
          />
          {paymentType !== "CASH" ? (
            <AlgaehFormGroup
              div={{
                className: "col-4 algaeh-text-fld"
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
          {paymentType === "CHEQUE" ? (
            <AlgaehDateHandler
              div={{
                className: "col-4 algaeh-date-fld"
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
        </div>
      </div>
    );
  }
  return null;
}
