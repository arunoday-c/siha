import React from "react";

import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid
} from "algaeh-react-components";
// import { incomeSource, incomeDestination } from "../../../data/dropdownList";
export default function Expense() {
  return (
    <>
      <div className="col-4 IncomeTransactionScreen">
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Add New Expense</h3>
            </div>
            <div className="actions"></div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <AlgaehFormGroup
                div={{
                  className: "form-group algaeh-text-fld col-8"
                }}
                label={{
                  forceLabel: "Expense Description",
                  isImp: true
                }}
                textBox={{
                  type: "text",
                  className: "form-control",
                  id: "name",
                  placeholder: "Enter Expense Description"
                  // autocomplete: false
                }}
              />{" "}
              <AlgaehDateHandler
                div={{
                  className: "form-group algaeh-email-fld col-4"
                }}
                label={{
                  forceLabel: "Expense Date",
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
            </div>
            <hr></hr>
            <div
              className="row"
              style={{
                maxHeight: "50vh",
                overflowX: "hidden",
                overflowY: "auto"
              }}
            >
              <div className="col-12">
                <h6>Source Account</h6>
                <div className="row">
                  <AlgaehAutoComplete
                    div={{ className: "col-5 form-group" }}
                    label={{
                      forceLabel: "Source Account 1",
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
                  />
                  <AlgaehFormGroup
                    div={{
                      className: "form-group algaeh-text-fld col-4"
                    }}
                    label={{
                      forceLabel: "Enter Amount",
                      isImp: true
                    }}
                    textBox={{
                      type: "number",
                      value: "",
                      className: "form-control",
                      id: "name",
                      placeholder: "0.00"
                      //autocomplete: false
                    }}
                  />{" "}
                  <div className="col-3">
                    <button
                      className="btn  btn-default"
                      style={{ marginTop: 21 }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>{" "}
                    <button
                      className="btn  btn-default"
                      style={{ marginTop: 21, marginLeft: 5 }}
                    >
                      <i className="fas fa-plus"></i>
                    </button>{" "}
                  </div>
                </div>
              </div>{" "}
              <div className="col-12">
                <h6>Destination Account</h6>
                <div className="row">
                  <AlgaehAutoComplete
                    div={{ className: "col-5 form-group" }}
                    label={{
                      forceLabel: "Destination Account 1",
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
                  />
                  <AlgaehFormGroup
                    div={{
                      className: "form-group algaeh-text-fld col-4"
                    }}
                    label={{
                      forceLabel: "Enter Amount",
                      isImp: true
                    }}
                    textBox={{
                      type: "number",
                      value: "",
                      className: "form-control",
                      id: "name",
                      placeholder: "0.00"
                      //autocomplete: false
                    }}
                  />{" "}
                  <div className="col-3">
                    <button
                      className="btn  btn-default"
                      style={{ marginTop: 21 }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>{" "}
                    <button
                      className="btn  btn-default"
                      style={{ marginTop: 21, marginLeft: 5 }}
                    >
                      <i className="fas fa-plus"></i>
                    </button>{" "}
                  </div>
                </div>
              </div>{" "}
            </div>
            <div className="portlet-footer">
              <button className="btn btn-default">Clear</button>
              <button className="btn btn-primary">Save Expense</button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-8">
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Expense by MTD</h3>
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
                  align: "left"
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
                        onChange={e => {
                          console.log("text", text);
                          console.log("records", records);
                          records["title"] = "Hello";
                        }}
                      />
                    );
                  }
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
                        onChange={e => {
                          console.log("text", text);
                          console.log("records", records);
                          records["title"] = "Hello";
                        }}
                      />
                    );
                  }
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
                        onChange={e => {
                          console.log("text", text);
                          console.log("records", records);
                          records["title"] = "Hello";
                        }}
                      />
                    );
                  }
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
                        onChange={e => {
                          console.log("text", text);
                          console.log("records", records);
                          records["title"] = "Hello";
                        }}
                      />
                    );
                  }
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
                        onChange={e => {
                          console.log("text", text);
                          console.log("records", records);
                          records["title"] = "Hello";
                        }}
                      />
                    );
                  }
                },
                {
                  key: "count",
                  title: "Count" //, sortable: true
                }
              ]}
              loading={false}
              isEditable={true}
              filter={true}
              dataSource={{
                data: []
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
