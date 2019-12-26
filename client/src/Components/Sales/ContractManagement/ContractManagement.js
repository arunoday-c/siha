import React from "react";
import "./ContractManagement.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
export default function ContractManagement() {
  return (
    <div>
      {" "}
      <BreadCrumb
        title={
          <AlgaehLabel
            label={{ forceLabel: "Contract Management", align: "ltr" }}
          />
        }
        //breadStyle={this.props.breadStyle}
        pageNavPath={[
          {
            pageName: (
              <AlgaehLabel
                label={{
                  forceLabel: "Home",
                  align: "ltr"
                }}
              />
            )
          },
          {
            pageName: (
              <AlgaehLabel
                label={{ forceLabel: "Contract Note", align: "ltr" }}
              />
            )
          }
        ]}
        soptlightSearch={{
          label: (
            <AlgaehLabel
              label={{ forceLabel: "Contract Number", returnText: true }}
            />
          ),
          value: "",
          // selectValue: "Contract_note_number",
          // events: {
          //     onChange: getCtrlCode.bind(this, this)
          // },
          // jsonFile: {
          //     fileName: "spotlightSearch",
          //     fieldName: "Sales.ContractNote"
          // },
          searchName: "ContractNote"
        }}
        userArea={
          <div className="row">
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Contract Date"
                }}
              />
              <h6>25-12-2019</h6>
            </div>
          </div>
        }
        // printArea={
        //   this.state.hims_f_procurement_po_header_id !== null
        //     ? {
        //         menuitems: [
        //           {
        //             label: "Receipt for Internal",
        //             events: {
        //               //   onClick: () => {
        //               //     generatePOReceipt(this.state);
        //               //   }
        //             }
        //           },
        //           {
        //             label: "Receipt for Vendor",
        //             events: {
        //               //   onClick: () => {
        //               //     generatePOReceiptNoPrice(this.state);
        //               //   }
        //             }
        //           }
        //         ]
        //       }
        //     : ""
        // }
        //selectedLang={this.state.selectedLang}
      />
      <div
        className="row  inner-top-search"
        style={{ marginTop: 76, paddingBottom: 10 }}
      >
        {/* Patient code */}
        <div className="col-lg-12">
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col-3 form-group mandatory" }}
              label={{ forceLabel: "Select Customer", isImp: true }}
              selector={{
                name: "",
                className: "select-fld",
                value: "",
                dataSource: {
                  textField: "customer_name",
                  valueField: "",
                  data: []
                },
                autoComplete: "off"
              }}
            />{" "}
            <AlagehFormGroup
              div={{ className: "col-3 mandatory" }}
              label={{
                forceLabel: "Enter Contract Code",
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "sales_man",
                value: ""
              }}
            />
            <AlgaehDateHandler
              div={{ className: "col-2 mandatory" }}
              label={{ forceLabel: "Contract Start Date", isImp: true }}
              textBox={{
                className: "txt-fld",
                name: ""
              }}
              minDate={new Date()}
              value=""
            />{" "}
            <AlgaehDateHandler
              div={{ className: "col-2 mandatory" }}
              label={{ forceLabel: "Contract End Date", isImp: true }}
              textBox={{
                className: "txt-fld",
                name: ""
              }}
              minDate={new Date()}
              value=""
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Contract Items</h3>
              </div>
            </div>
            <div className="portlet-body">
              {" "}
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group mandatory" }}
                  label={{ forceLabel: "Select Service", isImp: true }}
                  selector={{
                    name: "",
                    className: "select-fld",
                    value: "",
                    dataSource: {
                      textField: "customer_name",
                      valueField: "",
                      data: []
                    },
                    autoComplete: "off"
                  }}
                />{" "}
                <AlagehFormGroup
                  div={{ className: "col-3 mandatory" }}
                  label={{
                    forceLabel: "Enter Service Price",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "sales_man",
                    value: ""
                  }}
                />{" "}
                <AlagehFormGroup
                  div={{ className: "col-3 mandatory" }}
                  label={{
                    forceLabel: "Enter Qty",
                    isImp: false
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "sales_man",
                    value: ""
                  }}
                />
                <div className="col" style={{ textAlign: "right" }}>
                  <button
                    className="btn btn-default"
                    style={{ marginTop: 19, marginRight: 10 }}
                  >
                    Clear
                  </button>
                  <button className="btn btn-primary" style={{ marginTop: 19 }}>
                    Add
                  </button>
                </div>
                <div className="col-12">
                  <AlgaehDataGrid
                    id="contractMhmntGrid"
                    datavalidate="contractMhmntGrid"
                    columns={[
                      {
                        fieldName: "service",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Service Name" }} />
                        )
                      },
                      {
                        fieldName: "serviceUOM",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Qty"
                            }}
                          />
                        )
                      },
                      {
                        fieldName: "servicePrice",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Service Price" }}
                          />
                        )
                        //   displayTemplate: row => {
                        //       return (
                        //           <span>
                        //               {dateFormater(this, row.expiry_date)}
                        //           </span>
                        //       );
                        //   }
                      }
                    ]}
                    keyId=""
                    dataSource={{
                      data: []
                    }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    others={{}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Contract Terms & Conditions</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                {" "}
                <div className="col">
                  {" "}
                  <textarea
                    className="termsCondTextArea"
                    value=""
                    name="social_history"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              type="button"
              className="btn btn-primary"
              //   onClick={SaveDispatchNote.bind(this, this)}
              //   disabled={this.state.saveEnable}
            >
              <AlgaehLabel
                label={{
                  forceLabel: "Save Contract",
                  returnText: true
                }}
              />
            </button>

            <button
              type="button"
              className="btn btn-default"
              //   disabled={this.state.ClearDisable}
              //   onClick={ClearData.bind(this, this)}
            >
              <AlgaehLabel label={{ forceLabel: "Clear", returnText: true }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
