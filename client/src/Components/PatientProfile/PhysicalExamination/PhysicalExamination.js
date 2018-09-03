import React, { Component } from "react";
import "./physical_examination.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import search from "../../../assets/svg/search.svg";

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
                  <div className="col-lg-12">
                    <div className="row" style={{ marginBottom: "10px" }}>
                      {/* <AlagehFormGroup
                        div={{ className: "col-lg-4" }}
                        label={{
                          forceLabel: "Search",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "search",

                          //value: this.state.department_name,
                          events: {
                            //  onChange: this.changeDeptName.bind(this)
                          }
                        }}
                      /> */}
                      <div className="col-4">
                        <div className="form-group">
                          <label>Search</label>
                          <div className="input-group">
                            <input type="text" className="form-control" />
                            <div className="input-group-append">
                              <span className="input-group-text">
                                <i className="fas fa-search" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <AlgaehDataGrid
                    id="patient_chart_grd"
                    columns={[
                      {
                        fieldName: "date",
                        label: "Item Code"
                      },
                      {
                        fieldName: "first_name",
                        label: "Item Name"
                      },
                      {
                        fieldName: "",
                        label: "Frequency"
                      },

                      {
                        fieldName: "active",
                        label: "No. of Days"
                      },
                      {
                        fieldName: "active",
                        label: "Dispense"
                      },
                      {
                        fieldName: "active",
                        label: "Start Date"
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
              <div className="portlet portlet-bordered box-shadow-normal margin-top-15 margin-bottom-15">
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
                    <div className="row margin-bottom-15">
                      <AlagehFormGroup
                        div={{ className: "col vitalTopFld15" }}
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
                        div={{ className: "col vitalTopFld15" }}
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
                        div={{ className: "col vitalTopFld20" }}
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
                        div={{ className: "col vitalTopFld20" }}
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
                        div={{ className: "col vitalTopFld25" }}
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
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "."
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
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "."
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
