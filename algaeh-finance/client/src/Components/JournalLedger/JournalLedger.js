import React from "react";
import "./JournalLedger.scss";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid
} from "algaeh-react-components";

export default function JournalLedger() {
  return (
    <div className="journalLedgerScreen">
      <div
        className="row inner-top-search margin-bottom-15"
        style={{ paddingBottom: "10px" }}
      >
        <AlgaehDateHandler
          div={{
            className: "col-2 form-group algaeh-date-fld"
          }}
          label={{
            forceLabel: "Voucher Date",
            isImp: true
          }}
          textBox={{
            name: "enter_date",
            className: "form-control"
          }}
          events={{
            onChange: e => console.log(e.target)
          }}
          value={new Date()}
          maxDate={new Date()}
          minDate={new Date()}
        />{" "}
        <AlgaehFormGroup
          div={{
            className: "col-2 form-group algaeh-text-fld"
          }}
          label={{
            forceLabel: "Voucher No.",
            isImp: true
          }}
          textBox={{
            type: "text",
            className: "form-control",
            id: "name",
            placeholder: "eg:- RCT7654"
            // autocomplete: false
          }}
        />{" "}
        <AlgaehAutoComplete
          div={{ className: "col-2 form-group " }}
          label={{
            forceLabel: "Voucher Type",
            isImp: true
          }}
          selector={{
            name: "",
            placeholder: "",
            value: "",
            dataSource: {
              data: [],
              valueField: "",
              textField: ""
            }
          }}
        />{" "}
        <AlgaehAutoComplete
          div={{ className: "col-3 form-group" }}
          label={{
            forceLabel: "Debit Account",
            isImp: true
          }}
          selector={{
            name: "",
            placeholder: "",
            value: "",
            dataSource: {
              data: [],
              valueField: "",
              textField: ""
            }
          }}
        />{" "}
        <AlgaehAutoComplete
          div={{ className: "col-3 form-group " }}
          label={{
            forceLabel: "Credit Account",
            isImp: true
          }}
          selector={{
            name: "",
            placeholder: "",
            value: "",
            dataSource: {
              data: [],
              valueField: "",
              textField: ""
            }
          }}
        />{" "}
        <AlgaehFormGroup
          div={{
            className: "col-1 form-group algaeh-text-fld"
          }}
          label={{
            forceLabel: "Amount",
            isImp: true
          }}
          textBox={{
            type: "text",
            className: "form-control",
            id: "name",
            placeholder: "0.00"
            // autocomplete: false
          }}
        />{" "}
        <AlgaehFormGroup
          div={{
            className: "col-3 form-group algaeh-text-fld"
          }}
          label={{
            forceLabel: "Narration",
            isImp: false
          }}
          textBox={{
            type: "text",
            className: "form-control",
            id: "name",
            placeholder: "Electricity Bill"
            // autocomplete: false
          }}
        />{" "}
        <div className="col">
          {" "}
          {/* <button className="btn btn-default" style={{ marginTop: 19 }}>
            Clear
          </button>{" "} */}
          <button className="btn  btn-default" style={{ marginTop: 17 }}>
            Add to List
          </button>{" "}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Journal Ledger List </h3>
              </div>{" "}
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <AlgaehDataGrid
                columns={[
                  {
                    key: "id",
                    title: "Sl No.",
                    sortable: true,
                    filtered: false
                  },
                  {
                    key: "voucherDate",
                    title: "Voucher Date",
                    filtered: true,
                    align: "left"
                  },
                  {
                    key: "voucherNo",
                    title: "Voucher No.",
                    filtered: true,
                    align: "left"
                  },
                  {
                    key: "voucherType",
                    title: "Voucher Type",
                    filtered: true,
                    align: "left"
                  },
                  {
                    key: "debitAmt",
                    title: "Debited",
                    filtered: true,
                    align: "left"
                  },
                  {
                    key: "creditAmt",
                    title: "Credited",
                    filtered: true,
                    align: "left"
                  },
                  {
                    key: "narration",
                    title: "Narration",
                    filtered: true,
                    align: "left"
                  },
                  {
                    key: "count",
                    title: "Count" //, sortable: true
                  }
                ]}
                loading={false}
                isEditable={false}
                filter={true}
                dataSource={{
                  data: []
                }}
                rowUnique="id"
                xaxis={1500}
                //showCheckBox={{}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
