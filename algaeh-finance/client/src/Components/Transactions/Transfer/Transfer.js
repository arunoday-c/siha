import React from "react";

import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid,
} from "algaeh-react-components";

export default function Transfer() {
  return (
    <>
      <div className="col-3 TransferTransactionScreen">
        <div className="portlet portlet-bordered margin-bottom-15">
          {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Add New Expense</h3>
            </div>
            <div className="actions"></div>
          </div> */}
          <div className="portlet-body">
            <div className="row">
              {" "}
              <AlgaehAutoComplete
                div={{ className: "col-6 form-group" }}
                label={{
                  forceLabel: "Voucher Type",
                  isImp: true,
                }}
                selector={{
                  name: "",
                  placeholder: "",
                  value: "",
                  dataSource: {
                    data: [],
                    valueField: "",
                    textField: "",
                  },
                }}
              />
            </div>
            <div className="row">
              <AlgaehDateHandler
                div={{
                  className: "form-group algaeh-text-fld col-6",
                }}
                label={{
                  forceLabel: "Voucher Date",
                  isImp: true,
                }}
                textBox={{
                  name: "enter_date",
                  className: "form-control",
                }}
                events={{
                  onChange: (e) => console.log(e.target),
                }}
                value={new Date()}
                maxDate={new Date()}
                minDate={new Date()}
              />{" "}
              <AlgaehFormGroup
                div={{
                  className: "form-group algaeh-text-fld col-6",
                }}
                label={{
                  forceLabel: "Voucher No.",
                  isImp: true,
                }}
                textBox={{
                  type: "number",
                  value: "",
                  className: "form-control",
                  id: "name",
                  placeholder: "0.00",
                  //autocomplete: false
                }}
              />{" "}
            </div>
            <hr></hr>
            <div className="row">
              <AlgaehAutoComplete
                div={{ className: "col-6 form-group" }}
                label={{
                  forceLabel: "Payment Type",
                  isImp: true,
                }}
                selector={{
                  name: "",
                  placeholder: "",
                  value: "",
                  dataSource: {
                    data: [],
                    valueField: "",
                    textField: "",
                  },
                }}
              />{" "}
              <AlgaehAutoComplete
                div={{ className: "col-6 form-group" }}
                label={{
                  forceLabel: "Payment Mode",
                  isImp: true,
                }}
                selector={{
                  name: "",
                  placeholder: "",
                  value: "",
                  dataSource: {
                    data: [],
                    valueField: "",
                    textField: "",
                  },
                }}
              />{" "}
              <AlgaehAutoComplete
                div={{ className: "col-12 form-group" }}
                label={{
                  forceLabel: "Select Account",
                  isImp: true,
                }}
                selector={{
                  name: "",
                  placeholder: "",
                  value: "",
                  dataSource: {
                    data: [],
                    valueField: "",
                    textField: "",
                  },
                }}
              />
              <AlgaehFormGroup
                div={{
                  className: "form-group algaeh-text-fld col-12",
                }}
                label={{
                  forceLabel: "Narration",
                  isImp: true,
                }}
                textBox={{
                  type: "text",
                  value: "",
                  className: "form-control",
                  id: "name",
                  placeholder: "",
                  //autocomplete: false
                }}
              />{" "}
              <div className="portlet-footer">
                <button className="btn btn-default">Clear</button>
                <button className="btn btn-primary">Save Expense</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-9">
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Voucher List</h3>
            </div>{" "}
            <div className="actions">
              {" "}
              <button className="btn btn-primary btn-circle active">
                <i className="fas fa-plus" />
              </button>
            </div>
          </div>
          <div className="portlet-body">
            <AlgaehDataGrid
              columns={[
                {
                  key: "id",
                  title: "Sl No.",
                  sortable: true,
                  filtered: false,
                },
                {
                  key: "id",
                  title: "Account ID",
                  filtered: true,
                  align: "left",
                  editorTemplate: (text, records) => {
                    return (
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => {
                          console.log("text", text);
                          console.log("records", records);
                          records["title"] = "Hello";
                        }}
                      />
                    );
                  },
                },
                {
                  key: "desc",
                  title: "Account Description",
                  filtered: true,
                  align: "left",
                  editorTemplate: (text, records) => {
                    return (
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => {
                          console.log("text", text);
                          console.log("records", records);
                          records["title"] = "Hello";
                        }}
                      />
                    );
                  },
                },
                {
                  key: "debitAmt",
                  title: "Debit Amount",
                  filtered: true,
                  align: "left",
                  editorTemplate: (text, records) => {
                    return (
                      <input
                        type="number"
                        value={text}
                        onChange={(e) => {
                          console.log("text", text);
                          console.log("records", records);
                          records["title"] = "Hello";
                        }}
                      />
                    );
                  },
                },
                {
                  key: "creditAmt",
                  title: "Credit Amount",
                  filtered: true,
                  align: "left",
                  editorTemplate: (text, records) => {
                    return (
                      <input
                        type="number"
                        value={text}
                        onChange={(e) => {
                          console.log("text", text);
                          console.log("records", records);
                          records["title"] = "Hello";
                        }}
                      />
                    );
                  },
                },
                {
                  key: "narration",
                  title: "Narration",
                  filtered: true,
                  align: "left",
                  editorTemplate: (text, records) => {
                    return (
                      <input
                        type="number"
                        value={text}
                        onChange={(e) => {
                          console.log("text", text);
                          console.log("records", records);
                          records["title"] = "Hello";
                        }}
                      />
                    );
                  },
                },
                {
                  key: "count",
                  title: "Count", //, sortable: true
                },
              ]}
              loading={false}
              isEditable={true}
              filter={true}
              dataSource={{
                data: [],
              }}
              rowUnique="id"
              xaxis={1500}
              showCheckBox={{}}
            />
          </div>
        </div>
      </div>
    </>
  );
}
