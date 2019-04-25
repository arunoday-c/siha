import React, { Component } from "react";
import "./subjective.css";
// import Allergies from "../Allergies/Allergies";
// import ReviewofSystems from "../ReviewofSystems/ReviewofSystems";
// import ChiefComplaints from "../ChiefComplaints/ChiefComplaints.js";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup,
  AlgaehDateHandler,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import Vitals from "../Vitals/Vitals";
class BasicSubjective extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="subjective">
        <div className="row margin-top-15">
          <div className="col-lg-3">
            <Vitals />
          </div>
          <div className="col-9">
            <div className="row">
              <div className="col-6">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          {" "}
                          <AlagehFormGroup
                            div={{ className: "col form-group" }}
                            label={{
                              forceLabel: "Enter Chief Complaint",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "",
                              value: "",
                              events: {},
                              option: {
                                type: "textarea"
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row">
                          <AlagehAutoComplete
                            div={{ className: "col-4 form-group" }}
                            label={{ forceLabel: "Pain Level", isImp: false }}
                            selector={{
                              name: "",
                              className: "select-fld",
                              dataSource: {},
                              others: {}
                            }}
                          />
                          <AlagehAutoComplete
                            div={{ className: "col-4 form-group" }}
                            label={{
                              forceLabel: "Severity Level",
                              isImp: false
                            }}
                            selector={{
                              name: "",
                              className: "select-fld",
                              dataSource: {},
                              others: {}
                            }}
                          />
                          <AlgaehDateHandler
                            div={{ className: "col-4" }}
                            label={{ forceLabel: "Onset Date", isImp: false }}
                            textBox={{
                              className: "txt-fld",
                              name: ""
                            }}
                            maxDate={new Date()}
                            events={{}}
                          />
                          <AlagehFormGroup
                            div={{ className: "col-4 form-group" }}
                            label={{
                              forceLabel: "Duration",
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
                          <AlagehAutoComplete
                            div={{ className: "col-4 form-group" }}
                            label={{ forceLabel: "Interval", isImp: false }}
                            selector={{
                              name: "",
                              className: "select-fld",
                              dataSource: {},
                              others: {}
                            }}
                          />
                          <AlagehAutoComplete
                            div={{ className: "col-4 form-group" }}
                            label={{ forceLabel: "Chronic", isImp: false }}
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
                </div>
              </div>
              <div className="col-6">
                <div className="portlet portlet-bordered margin-bottom-15">
                  {" "}
                  {/* <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Order Service</h3>
                    </div>
                  </div> */}
                  <div className="portlet-body">Final Diag.</div>
                </div>
              </div>
              <div className="col-6">
                <div className="portlet portlet-bordered margin-bottom-15">
                  {/* <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Significant Signs</h3>
                    </div>
                  </div> */}
                  <div className="portlet-body">
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col form-group" }}
                        label={{
                          forceLabel: "Enter Significant Signs",
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
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className="col-6">
                <div className="portlet portlet-bordered margin-bottom-15">
                  {" "}
                  {/* <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Order Service</h3>
                    </div>
                  </div> */}
                  <div className="portlet-body">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col form-group" }}
                        label={{ forceLabel: "Enter Service", isImp: false }}
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          others: {}
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-3 form-group" }}
                        label={{
                          forceLabel: "Enter Qty",
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
                      <div className="col-2">
                        <button
                          className="btn btn-primary"
                          style={{ marginTop: 19 }}
                        >
                          Add
                        </button>
                      </div>
                      <div className="col-12" id="basicServiceTyeGrid_Cntr">
                        <AlgaehDataGrid
                          id="basicServiceTyeGrid"
                          datavalidate="basicServiceTyeGrid"
                          columns={[
                            {
                              fieldName: "actionCol",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Action" }} />
                              )
                            },
                            {
                              fieldName: "ServiceCode",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Service Code" }}
                                />
                              )
                            },
                            {
                              fieldName: "ServiceName",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Service Name" }}
                                />
                              )
                            },
                            {
                              fieldName: "qtyService",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Qty" }} />
                              )
                            }
                          ]}
                          keyId=""
                          dataSource={{ data: [] }}
                          isEditable={false}
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
          {/* 
          <div className="col-lg-9">
            <ChiefComplaints />
            <div className="row">
              <div className="col-lg-6">
                <Allergies />
              </div>
              <div className="col-lg-6">
                <ReviewofSystems />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default BasicSubjective;
