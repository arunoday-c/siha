import React from "react";

import {
  AlgaehFormGroup,
  AlgaehDateHandler,
  AlgaehAutoComplete,
  AlgaehDataGrid
} from "algaeh-react-components";
import { incomeSource, incomeDestination } from "../../../data/dropdownList";
export default function Income() {
  return (
    <>
      <div className="col-4 IncomeTransactionScreen">
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Add New Income</h3>
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
                  forceLabel: "Income Description",
                  isImp: true
                }}
                textBox={{
                  type: "text",
                  className: "form-control",
                  id: "name",
                  placeholder: "Enter Income Description"
                  // autocomplete: false
                }}
              />{" "}
              <AlgaehDateHandler
                div={{
                  className: "form-group algaeh-email-fld col-4"
                }}
                label={{
                  forceLabel: "Income Date",
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
                    div={{ className: "col-6 form-group" }}
                    label={{
                      forceLabel: "branch",
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
                      type: "text",
                      value: "",
                      className: "form-control",
                      id: "name",
                      placeholder: "Income Amount"
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
                    label={{ forceLabel: "ABC" }}
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
                  {/* <AlgaehDropDown
                    div={{
                      className: "form-group algaeh-select-fld col-5"
                    }}
                    label={{
                      forceLabel: "Select Account",
                      isImp: true
                    }}
                    selector={{
                      className: "form-control",
                      name: "country",
                      onChange: "value"
                    }}
                    dataSource={{
                      textField: "name",
                      valueField: "value",
                      data: incomeDestination
                    }}
                  />{" "} */}
                  <AlgaehFormGroup
                    div={{
                      className: "form-group algaeh-text-fld col-4"
                    }}
                    label={{
                      forceLabel: "Enter Amount",
                      isImp: true
                    }}
                    textBox={{
                      type: "text",
                      value: "",
                      className: "form-control",
                      id: "name",
                      placeholder: "Income Amount"
                      // autocomplete: false
                    }}
                  />{" "}
                  <div className="col-3">
                    {" "}
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
              </div>
            </div>
            <div className="portlet-footer">
              <button className="btn btn-default">Clear</button>
              <button className="btn btn-primary">Save Income</button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-8">
        <div className="portlet portlet-bordered margin-bottom-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">
                All Incomes between October 1, 2019 and October 31, 2019
              </h3>
            </div>{" "}
            <div className="actions">
              {" "}
              <a className="btn btn-primary btn-circle active">
                <i className="fas fa-plus" />
              </a>
            </div>
          </div>
          <div className="portlet-body">
            <AlgaehDataGrid
              columns={[
                {
                  key: "id",
                  title: "ID",
                  sortable: true,
                  filtered: false
                },
                {
                  key: "title",
                  title: "Title",
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
