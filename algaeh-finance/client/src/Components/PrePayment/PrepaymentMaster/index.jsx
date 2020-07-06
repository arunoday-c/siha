import React from "react";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  AlgaehTreeSearch,
  AlgaehMessagePop,
  AlgaehFormGroupGrid,
  AlgaehButton,
} from "algaeh-react-components";
export function PrepaymentMaster() {
  return (
    <div>
      <div className="row inner-top-search">
        {/* <AlgaehFormGroup
          div={{
            className: "col form-group",
          }}
          label={{
            forceLabel: "Prepayment Code",
            isImp: true,
          }}
          textBox={{
            type: "text",
            className: "form-control",
            placeholder: "",
            value: "",
          }}
        />{" "} */}
        <AlgaehFormGroup
          div={{
            className: "col-3 form-group",
          }}
          label={{
            forceLabel: "Prepayment Desc.",
            isImp: true,
          }}
          textBox={{
            type: "text",
            className: "form-control",
            placeholder: "",
            value: "",
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col form-group" }}
          label={{
            forceLabel: "Duration (Month)",
            isImp: true,
          }}
          selector={{
            value: "",
            dataSource: {},
          }}
        />{" "}
        <AlgaehAutoComplete
          div={{ className: "col form-group" }}
          label={{
            forceLabel: "Prepayment GL",
            isImp: true,
          }}
          selector={{
            value: "",
            dataSource: {},
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col form-group" }}
          label={{
            forceLabel: "Expense GL",
            isImp: true,
          }}
          selector={{
            value: "",
            dataSource: {},
          }}
        />
        <div className="col">
          <button className="btn btn-primary bttn-sm" style={{ marginTop: 17 }}>
            Add to list
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Prepayment Master List</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <AlgaehDataGrid
                columns={[
                  {
                    key: "prePayDesc",
                    title: "Prepayment Desc.",
                    sortable: true,
                  },
                  {
                    key: "prePayDur",
                    title: "Duration (Month)",
                    sortable: true,
                  },
                  {
                    key: "prePayCreditGL",
                    title: "Prepayment Credit GL",
                    sortable: true,
                  },
                  {
                    key: "prePayDebitGL",
                    title: "Prepayment Debit GL",
                    sortable: true,
                  },
                ]}
                loading={false}
                isEditable="onlyDelete"
                height="34vh"
                dataSource={{
                  data: [],
                }}
                rowUnique="prePayDesc"
                events={{}}
                others={{}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
