import React, { Component } from "react";
import "./AppSetup.css";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
  // AlgaehDateHandler
} from "../Wrapper/algaehWrapper";
export default class AppSetup extends Component {
  render() {
    return (
      <div className="AppSetupScreen">
        <div className="row">
          <div className="col-8">
            <div className="portlet portlet-bordered margin-bottom-15 margin-top-15 ">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Company Setup</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Company Name",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "text"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Contact Number",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "number"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Email Address",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "email"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Website Address",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "text"
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-9 form-group" }}
                    label={{
                      forceLabel: "Company Address",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld textArea",
                      name: "",
                      value: "",
                      option: {
                        //type: "email"
                      },
                      events: {}
                    }}
                  />
                  <div
                    className="col-3"
                    style={{
                      float: "right",
                      marginTop: 21
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginRight: 10 }}
                    >
                      Add
                    </button>
                    <button type="button" className="btn btn-default">
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="portlet portlet-bordered margin-bottom-15 margin-top-15 ">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Application Default Setup</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Default Country", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Default Nationality", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group" }}
                    label={{ forceLabel: "Default Currency", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-8">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Company/ Branch List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="branchCompanyListGrid_Cntr">
                    <AlgaehDataGrid
                      id="branchCompanyListGrid"
                      datavalidate="branchCompanyListGrid"
                      columns={[
                        {
                          fieldName: "CompanyName",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Company Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "contactNo",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Contact Number" }}
                            />
                          )
                        },
                        {
                          fieldName: "emailID",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Email Address" }}
                            />
                          )
                        },
                        {
                          fieldName: "websiteAdd",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Website Address" }}
                            />
                          )
                        },
                        {
                          fieldName: "companyAddress",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Company Address" }}
                            />
                          )
                        }
                      ]}
                      keyId=""
                      dataSource={{ data: [] }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 5 }}
                      events={{}}
                      others={{}}
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
}
