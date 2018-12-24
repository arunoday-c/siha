import React, { Component } from "react";
import "./overtime_groups.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";

class OvertimeGroups extends Component {
  render() {
    return (
      <div className="overtime_groups">
        <div className="row">
          <div className="col-4">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Define Group</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="col-12">
                  <div className="row">
                    <div className="col slctYearBranchSec">
                      <div className="row">
                        <AlagehFormGroup
                          div={{ className: "col-4" }}
                          label={{
                            forceLabel: "Group Code",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "earning_deduction_code",
                            value: "",
                            events: {
                              //onChange: this.changeTexts.bind(this)
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-8" }}
                          label={{
                            forceLabel: "Group Description",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "earning_deduction_code",
                            value: "",
                            events: {
                              //onChange: this.changeTexts.bind(this)
                            }
                          }}
                        />
                      </div>
                    </div>
                    <hr />
                    <div
                      className="col-12 algaehLabelFormGroup"
                      style={{ marginBottom: 15, paddingBottom: 15 }}
                    >
                      <label className="algaehLabelGroup">Payment Type</label>
                      <div className="row">
                        <div className="col-12">
                          {/* <label>Calculation Method</label> */}
                          <div className="customRadio">
                            <label className="radio inline">
                              <input
                                type="radio"
                                value="% of Components"
                                name="paymentType"
                                checked
                              />
                              <span>% of Components</span>
                            </label>
                            <label className="radio inline">
                              <input
                                type="radio"
                                value="Rate of Components"
                                name="paymentType"
                                checked
                              />
                              <span>Rate of Components</span>
                            </label>
                          </div>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-4" }}
                          label={{
                            forceLabel: "Working Day",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "earning_deduction_code",
                            value: "",
                            events: {
                              //onChange: this.changeTexts.bind(this)
                            }
                          }}
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col-4" }}
                          label={{
                            forceLabel: "Week Off",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "earning_deduction_code",
                            value: "",
                            events: {
                              //onChange: this.changeTexts.bind(this)
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-4" }}
                          label={{
                            forceLabel: "Holiday",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "earning_deduction_code",
                            value: "",
                            events: {
                              //onChange: this.changeTexts.bind(this)
                            }
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-12" }}
                          label={{
                            forceLabel: "Calculation Type",
                            isImp: false
                          }}
                          selector={{
                            name: "provider_id",
                            className: "select-fld",
                            value: "",
                            dataSource: {
                              textField: "full_name",
                              valueField: "employee_id",
                              data: ""
                            }
                            //onChange: this.dropDownHandle.bind(this)
                          }}
                        />
                      </div>
                    </div>{" "}
                    <div className="col-12">
                      <button
                        style={{
                          float: "right",
                          marginRight: -15
                        }}
                        // onClick={this.loadPatients.bind(this)}
                        className="btn btn-primary"
                      >
                        {" "}
                        Add
                      </button>
                    </div>
                  </div>
                </div>{" "}
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Group List</h3>
                </div>
              </div>
              <div className="portlet-body">
                {/* <div id="GroupListGrid_Cntr">
                  <AlgaehDataGrid
                    columns={[
                      {
                        fieldName: "ComponentCode",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Component Code" }}
                          />
                        )
                        // others: {
                        //   filterable: true
                        // }
                      },
                      {
                        fieldName: "code_description",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Code Description" }}
                          />
                        )
                      },
                      {
                        fieldName: "calc_type",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Calculation Type" }}
                          />
                        )
                      }
                    ]}
                    keyId="hims_d_employee_group_id"
                    dataSource={{
                      data: ""
                    }}
                    isEditable={false}
                    filterable
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {}
                    }}
                  /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OvertimeGroups;
