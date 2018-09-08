import React, { Component } from "react";
import "./physical_examination.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import Modal from "@material-ui/core/Modal";
import { getVitalHistory } from "./PhysicalExaminationHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";

const AllergyData = [
  { food: "grapes/citrus", active: "Yes" },
  { food: "Pollen", active: "Yes" },
  { food: "Iodine", active: "Yes" }
];

class PhysicalExamination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openVitalModal: false
    };
    this.handleClose = this.handleClose.bind(this);
  }

  addVitals() {
    this.setState({ openVitalModal: true });
  }

  handleClose() {
    this.setState({ openVitalModal: false });
  }

  componentDidMount() {
    getVitalHistory(this);
  }

  render() {
    return (
      <div className="physical_examination">
        <Modal open={this.state.openVitalModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Patient Vitals</h4>
            </div>
            <div className="col-lg-12 popupInner">
              <div className="row">
                <div className="col-lg-3 popLeftDiv">
                  <h5>Vital Timeline</h5>
                  <hr />
                  <div className="timeline">
                    {this.props.allvitals !== undefined
                      ? this.props.allvitals.map((data, index) => (
                          <div key={index} className="timelineContainer right">
                            <div className="content">
                              <p className="dateStamp">
                                {data.visit_date} - {data.visit_time}
                              </p>
                              <div className="vitalsCntr">
                                <ul className="vitals-box">
                                  <li className="each-vitals-box">
                                    <p>Weight</p>
                                    <span>{data.weight}</span>
                                    <span>Kg</span>
                                  </li>
                                  <li className="each-vitals-box">
                                    <p>Height</p>
                                    <span>{data.height}</span>
                                    <span>Cms</span>
                                  </li>
                                  <li className="each-vitals-box">
                                    <p>BMI</p>
                                    <span>{data.bmi}</span>
                                    <span>Kg/m2</span>
                                  </li>
                                  <li className="each-vitals-box">
                                    <p>Blood Pressure</p>
                                    <span>
                                      {data.systolic}/ {data.diastolic}
                                    </span>
                                    <span>mmHg</span>
                                  </li>
                                  <li className="each-vitals-box">
                                    <p>
                                      Temperature(
                                      {data.temperature_from})
                                    </p>
                                    <span>{data.temperature_celsisus}</span>
                                    <span> &deg;C</span>
                                  </li>
                                  <li className="each-vitals-box">
                                    <p>Oxystat</p>
                                    <span>
                                      {data.oxystat
                                        ? data.oxystat
                                        : "Not Recorded"}
                                    </span>
                                    <span>%</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))
                      : null}
                  </div>
                </div>

                <div className="col-lg-9 popRightDiv">
                  <h5>Vital Charts</h5>
                  <hr />
                </div>
              </div>
            </div>
            <div className="popupFooter">
              <button className="btn btn-default" onClick={this.handleClose}>
                Close
              </button>
            </div>
          </div>
        </Modal>

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
                      <i
                        onClick={this.addVitals.bind(this)}
                        className="fas fa-history"
                      />
                    </a>
                  </div>
                </div>

                <div className="portlet-body">
                  <div className="col-lg-12">
                    <div className="row margin-bottom-15">
                      <AlagehFormGroup
                        div={{ className: "col" }}
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

function mapStateToProps(state) {
  return {
    allvitals: state.allvitals
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVitalHistory: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PhysicalExamination)
);
