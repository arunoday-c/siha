import React from "react";
import "./ReportMaster.scss";
import {
  AlgaehLabel,
  AlgaehAutoComplete,
  AlgaehFormGroup,
  AlgaehDataGrid,
} from "algaeh-react-components";
export default function ReportMaster() {
  return (
    <div className="ReportMaster">
      <div className="row inner-top-search margin-bottom-15">
        {" "}
        <AlgaehAutoComplete
          div={{ className: "col-2 form-group mandatory" }}
          label={{
            forceLabel: "Report Category",
            isImp: true,
          }}
          selector={{
            name: "",
            value: "",
            dataSource: {
              data: "",
              valueField: "",
              textField: "",
            },
            // onChange: '',
          }}
        />
        <AlgaehFormGroup
          div={{ className: "col-2 form-group mandatory" }}
          label={{
            forceLabel: "Report Name",
            isImp: true,
          }}
          textBox={{
            className: "txt-fld",
            name: "",
            value: "",
            events: {
              // onChange: this.changeTexts.bind(this),
            },
          }}
        />
        <AlgaehFormGroup
          div={{ className: "col-2 form-group mandatory" }}
          label={{
            forceLabel: "Report File Name (Js)",
            isImp: true,
          }}
          textBox={{
            className: "txt-fld",
            name: "",
            value: "",
            events: {
              // onChange: this.changeTexts.bind(this),
            },
          }}
        />{" "}
        <AlgaehFormGroup
          div={{ className: "col-2 form-group mandatory" }}
          label={{
            forceLabel: "Report Header Name (Hbs)",
            isImp: true,
          }}
          textBox={{
            className: "txt-fld",
            name: "",
            value: "",
            events: {
              // onChange: this.changeTexts.bind(this),
            },
          }}
        />{" "}
        <AlgaehFormGroup
          div={{ className: "col-2 form-group mandatory" }}
          label={{
            forceLabel: "Report Footer Name (Hbs)",
            isImp: true,
          }}
          textBox={{
            className: "txt-fld",
            name: "",
            value: "",
            events: {
              // onChange: this.changeTexts.bind(this),
            },
          }}
        />{" "}
        <AlgaehAutoComplete
          div={{ className: "col-2 form-group mandatory" }}
          label={{
            forceLabel: "Report Status",
            isImp: true,
          }}
          selector={{
            name: "",
            value: "",
            dataSource: {
              data: "",
              valueField: "",
              textField: "",
            },
            // onChange: '',
          }}
        />
        <div
          className="col algaehLabelFormGroup"
          style={{ margin: "0px 15px 15px" }}
        >
          <label className="algaehLabelGroup">Report Properties</label>
          <div className="row">
            <AlgaehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Page Size",
                isImp: true,
              }}
              selector={{
                name: "",
                value: "",
                dataSource: {
                  data: "",
                  valueField: "",
                  textField: "",
                },
                // onChange: '',
              }}
            />{" "}
            <AlgaehAutoComplete
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Page Layout",
                isImp: true,
              }}
              selector={{
                name: "",
                value: "",
                dataSource: {
                  data: "",
                  valueField: "",
                  textField: "",
                },
                // onChange: '',
              }}
            />{" "}
            <div className="col">
              <label>Termal Print</label>
              <div className="customRadio">
                <label className="radio inline">
                  <input
                    type="radio"
                    value="Y"
                    name=""
                    // checked={
                    //   this.state.termalYN === "O"
                    //     ? true
                    //     : false
                    // }
                    // onChange={this.textHandler.bind(this)}
                  />
                  <span>Yes</span>
                </label>
                <label className="radio inline">
                  <input
                    type="radio"
                    value="N"
                    name=""
                    // checked={
                    //   this.state.termalYN === "O"
                    //     ? true
                    //     : false
                    // }
                    // onChange={this.textHandler.bind(this)}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col algaehLabelFormGroup"
          style={{ margin: "0px 15px 15px" }}
        >
          <label className="algaehLabelGroup">Header Margin</label>
          <div className="row">
            <AlgaehFormGroup
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Top",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "",
                value: "",
                type: "number",
                events: {
                  // onChange: this.changeTexts.bind(this),
                },
              }}
            />{" "}
            <AlgaehFormGroup
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Right",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "",
                value: "",
                type: "number",
                events: {
                  // onChange: this.changeTexts.bind(this),
                },
              }}
            />{" "}
            <AlgaehFormGroup
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Bottom",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "",
                value: "",
                type: "number",
                events: {
                  // onChange: this.changeTexts.bind(this),
                },
              }}
            />{" "}
            <AlgaehFormGroup
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Left",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "",
                value: "",
                type: "number",
                events: {
                  // onChange: this.changeTexts.bind(this),
                },
              }}
            />
          </div>
        </div>
        <div
          className="col algaehLabelFormGroup"
          style={{ margin: "0px 15px 15px" }}
        >
          <label className="algaehLabelGroup">Footer Margin</label>
          <div className="row">
            <AlgaehFormGroup
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Top",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "",
                value: "",
                type: "number",
                events: {
                  // onChange: this.changeTexts.bind(this),
                },
              }}
            />{" "}
            <AlgaehFormGroup
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Right",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "",
                value: "",
                type: "number",
                events: {
                  // onChange: this.changeTexts.bind(this),
                },
              }}
            />{" "}
            <AlgaehFormGroup
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Bottom",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "",
                value: "",
                type: "number",
                events: {
                  // onChange: this.changeTexts.bind(this),
                },
              }}
            />{" "}
            <AlgaehFormGroup
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Left",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "",
                value: "",
                type: "number",
                events: {
                  // onChange: this.changeTexts.bind(this),
                },
              }}
            />
          </div>
        </div>
        <div className="col-12" style={{ textAlign: "right" }}>
          <button
            type="button"
            style={{ marginBottom: 15 }}
            className="btn btn-primary"
          >
            Add to List
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">List of Reports</h3>
              </div>
              <div className="actions"></div>
            </div>

            <div className="portlet-body">
              <div className="row">
                <div className="col-12">
                  <AlgaehDataGrid
                    id=""
                    columns={[
                      {
                        fieldName: "",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Category" }} />
                        ),
                        filterable: true,
                      },
                      {
                        fieldName: "",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Report Name" }} />
                        ),
                        filterable: true,
                      },
                      {
                        fieldName: "",
                        label: (
                          <AlgaehLabel label={{ fieldName: "File Name" }} />
                        ),
                        filterable: true,
                      },
                      {
                        fieldName: "",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Header Name" }} />
                        ),
                        filterable: true,
                      },
                      {
                        fieldName: "",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Footer Name" }} />
                        ),
                        filterable: true,
                      },
                      {
                        fieldName: "",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Termal Print" }} />
                        ),
                        filterable: true,
                      },
                      {
                        fieldName: "",
                        label: (
                          <AlgaehLabel label={{ fieldName: "Page Size" }} />
                        ),
                        filterable: true,
                      },
                      {
                        fieldName: "",
                        label: <AlgaehLabel label={{ fieldName: "Layout" }} />,
                        filterable: true,
                      },
                      {
                        fieldName: "",
                        label: <AlgaehLabel label={{ fieldName: "Status" }} />,
                        filterable: true,
                      },
                    ]}
                    keyId="index"
                    data=""
                    isFilterable={true}
                    pagination={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
