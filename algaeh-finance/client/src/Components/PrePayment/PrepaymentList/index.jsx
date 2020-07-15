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
export function PrepaymentList() {
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
            forceLabel: "Prepayment Type",
            isImp: true,
          }}
          selector={{
            value: "",
            dataSource: {},
          }}
        />
        <AlgaehDateHandler
          div={{
            className: "col-2 algaeh-date-fld  form-group",
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
            className: "col-2 algaeh-date-fld",
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
          // others={{ disabled: true }}
          // maxDate={moment().add(1, "days")}
        />
        <div className="col">
          <button
            className="btn btn-primary bttn-sm"
            style={{ marginBottom: 10 }}
          >
            Load
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Prepayment Auth List</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <AlgaehDataGrid
                columns={[
                  {
                    fieldName: "preEmpCode",
                    label: "Employee Code",
                    sortable: true,
                  },
                  {
                    fieldName: "preEmpName",
                    label: "Employee Name",
                    sortable: true,
                  },
                  {
                    fieldName: "preAmt",
                    label: "Prepayment Amt.",
                    sortable: true,
                  },
                  {
                    fieldName: "preStartDate",
                    label: "Prepayment Start date",
                    sortable: true,
                  },
                  {
                    fieldName: "preEndDate",
                    label: "Prepayment End date",
                    sortable: true,
                  },
                ]}
                loading={false}
                isEditable="onlyDelete"
                height="34vh"
                data={[]}
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
