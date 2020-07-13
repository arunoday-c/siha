import React from "react";
import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
  AlgaehTreeSearch,
  AlgaehMessagePop,
  AlgaehButton,
} from "algaeh-react-components";
export function PrepaymentRequest() {
  return (
    <div>
      {" "}
      <div className="row inner-top-search">
        <AlgaehAutoComplete
          div={{ className: "col-2 form-group" }}
          label={{
            forceLabel: "Branch",
            isImp: true,
          }}
          selector={{
            value: "",
            dataSource: {},
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-2 form-group" }}
          label={{
            forceLabel: "Cost Center",
            isImp: true,
          }}
          selector={{
            value: "",
            dataSource: {},
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-2 form-group" }}
          label={{
            forceLabel: "Prepayment Type",
            isImp: true,
          }}
          selector={{
            value: "",
            dataSource: {},
          }}
        />
        <AlgaehAutoComplete
          div={{ className: "col-2 form-group" }}
          label={{
            forceLabel: " Employee",
            isImp: true,
          }}
          selector={{
            value: "",
            dataSource: {},
          }}
        />
        <AlgaehFormGroup
          div={{
            className: "col-2 form-group",
          }}
          label={{
            forceLabel: "Prepayment Amt.",
            isImp: true,
          }}
          textBox={{
            type: "text",
            className: "form-control",
            placeholder: "",
            value: "",
          }}
        />{" "}
        <AlgaehDateHandler
          div={{
            className: "col-2 algaeh-date-fld",
          }}
          label={{
            forceLabel: "Start Date",
            isImp: true,
          }}
          textBox={{
            name: "",
            className: "form-control",
            value: "",
          }}
          // maxDate={moment().add(1, "days")}
        />{" "}
        <AlgaehDateHandler
          div={{
            className: "col-2 algaeh-date-fld form-group",
          }}
          label={{
            forceLabel: "End Date",
            isImp: true,
          }}
          textBox={{
            name: "",
            className: "form-control",
            value: "",
          }}
          others={{ disabled: true }}
          // maxDate={moment().add(1, "days")}
        />
        <div className="col">
          <button className="btn btn-primary bttn-sm" style={{ marginTop: 19 }}>
            Add to list
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Prepayment Request List</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <AlgaehDataGrid
                columns={[
                  {
                    key: "preEmpCode",
                    title: "Employee Code",
                    sortable: true,
                  },
                  {
                    key: "preEmpName",
                    title: "Employee Name",
                    sortable: true,
                  },
                  {
                    key: "preAmt",
                    title: "Prepayment Amt.",
                    sortable: true,
                  },
                  {
                    key: "preStartDate",
                    title: "Prepayment Start date",
                    sortable: true,
                  },
                  {
                    key: "preEndDate",
                    title: "Prepayment End date",
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
