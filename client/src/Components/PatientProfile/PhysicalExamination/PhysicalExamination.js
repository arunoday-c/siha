import React, { Component } from "react";
import "./physical_examination.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";

const AllergyData = [
  { food: "grapes/citrus", active: "Yes" },
  { food: "Pollen", active: "Yes" },
  { food: "Iodine", active: "Yes" }
];

class PhysicalExamination extends Component {
  render() {
    return (
      <div className="physical_examination">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-8">
              {/* Physical Examination Section Start */}
              <div className="portlet portlet-bordered box-shadow-normal margin-top-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Physical Examination</h3>
                  </div>
                </div>

                <div className="portlet-body">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Search"
                    }}
                    selector={{
                      name: "search",
                      className: "select-fld",
                      // value: this.state.pay_cash,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.PAIN_DURATION
                      }

                      // onChange: texthandle.bind(this, this)
                    }}
                  />

                  <AlgaehDataGrid
                    id="patient_chart_grd"
                    columns={[
                      {
                        fieldName: "food",
                        label: "Food",
                        disabled: true
                      },
                      {
                        fieldName: "date",
                        label: "On Set Date"
                      },
                      {
                        fieldName: "first_name",
                        label: "Comment"
                      },
                      {
                        fieldName: "active",
                        label: "Active"
                      }
                    ]}
                    keyId="code"
                    dataSource={{
                      data: AllergyData
                    }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 3 }}
                    events={
                      {
                        // onDelete: this.deleteVisaType.bind(this),
                        // onEdit: row => {},
                        // onDone: row => {
                        //   alert(JSON.stringify(row));
                        // }
                        // onDone: this.updateVisaTypes.bind(this)
                      }
                    }
                  />
                </div>
              </div>
              {/* Physical Examination Section End */}

              {/* Vitals Section Start */}
              <div className="portlet portlet-bordered box-shadow-normal margin-top-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Vitals</h3>
                  </div>

                  <div className="actions">
                    <a
                      href="javascript:;"
                      className="btn btn-primary btn-circle active"
                    >
                      <i className="fas fa-history" />
                    </a>
                  </div>
                </div>

                <div className="portlet-body">
                  <div className="col-lg-12">
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col-lg-2" }}
                        label={{
                          forceLabel: "Weight(Kg)",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "weight",
                          others: {
                            type: "number"
                          },
                          //value: this.state.department_name,
                          events: {
                            //  onChange: this.changeDeptName.bind(this)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-2" }}
                        label={{
                          forceLabel: "Height(Cms)",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "weight",
                          others: {
                            type: "number"
                          },
                          //value: this.state.department_name,
                          events: {
                            //  onChange: this.changeDeptName.bind(this)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-2" }}
                        label={{
                          forceLabel: "O2 Respiration(%)",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "weight",
                          others: {
                            type: "number"
                          },
                          //value: this.state.department_name,
                          events: {
                            //  onChange: this.changeDeptName.bind(this)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-2" }}
                        label={{
                          forceLabel: "Heart Rate(bpm)",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "weight",
                          others: {
                            type: "number"
                          },
                          //value: this.state.department_name,
                          events: {
                            //  onChange: this.changeDeptName.bind(this)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-3" }}
                        label={{
                          forceLabel: "Respiratory Rate(min)",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "weight",
                          others: {
                            type: "number"
                          },
                          //value: this.state.department_name,
                          events: {
                            //  onChange: this.changeDeptName.bind(this)
                          }
                        }}
                      />
                    </div>
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Oral Temperature(C)"
                        }}
                        selector={{
                          name: "oral_temp",
                          className: "select-fld",
                          // value: this.state.pay_cash,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.PAIN_DURATION
                          }

                          // onChange: texthandle.bind(this, this)
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "abcd_xyz",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "weight",
                          others: {
                            type: "number"
                          },
                          //value: this.state.department_name,
                          events: {
                            //  onChange: this.changeDeptName.bind(this)
                          }
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Blood Pressure"
                        }}
                        selector={{
                          name: "search",
                          className: "select-fld",
                          // value: this.state.pay_cash,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.PAIN_DURATION
                          }

                          // onChange: texthandle.bind(this, this)
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "abcd_xyz",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "weight",
                          others: {
                            type: "number"
                          },
                          //value: this.state.department_name,
                          events: {
                            //  onChange: this.changeDeptName.bind(this)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Vitals Section End */}
            </div>
            <div className="col-lg-4 margin-top-15">
              {/* Chart Goes Here */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhysicalExamination;
