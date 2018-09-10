import React, { Component } from "react";
import "./physical_examination.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import Modal from "@material-ui/core/Modal";
import {
  getVitalHistory,
  getPhysicalExaminations,
  getPhysicalExaminationsDetails,
  getPhysicalExaminationsSubDetails
} from "./PhysicalExaminationHandlers";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import swal from "sweetalert";

const AllergyData = [
  { food: "grapes/citrus", active: "Yes" },
  { food: "Pollen", active: "Yes" },
  { food: "Iodine", active: "Yes" }
];

class PhysicalExamination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openVitalModal: false,
      openExamnModal: false
    };
    this.handleClose = this.handleClose.bind(this);
  }

  addVitals() {
    this.setState({ openVitalModal: true, open: false });
  }

  handleClose() {
    this.setState({ openVitalModal: false, openExamnModal: false });
  }
  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  openExaminationModal() {
    this.setState({ openExamnModal: true });
  }

  addPatientVitals(e) {
    algaehApiCall({
      uri: "/doctorsWorkBench/addPatientVitals",
      method: "POST",
      data: {
        patient_id: Window.global["current_patient"],
        visit_id: Window.global["visit_id"],
        visit_date: this.state.recorded_date,
        visit_time: this.state.recorded_time,
        case_type: "OP",
        height: this.state.height,
        weight: this.state.weight,
        bmi: this.state.bmi,
        oxysat: this.state.oxysat,
        temperature_from: this.state.temperature_from,
        temperature_celsisus: this.state.temperature_celsisus,
        systolic: this.state.systolic,
        diastolic: this.state.diastolic
      },
      onSuccess: response => {
        if (response.data.success) {
          swal("Vitals recorded successfully . .", {
            icon: "success",
            buttons: false,
            timer: 2000
          });
          getVitalHistory(this);
          this.setPatientVitals();
        }
      },
      onFailure: error => {}
    });
  }

  setPatientVitals() {
    this.props.allvitals !== undefined && this.props.allvitals.length !== 0
      ? this.setState({
          weight: this.props.allvitals[0].weight,
          height: this.props.allvitals[0].height,
          bmi: this.props.allvitals[0].bmi,
          temperature_from: this.props.allvitals[0].temperature_from,
          temperature_celsisus: this.props.allvitals[0].temperature_celsisus,
          systolic: this.props.allvitals[0].systolic,
          diastolic: this.props.allvitals[0].diastolic,
          recorded_time: this.props.allvitals[0].visit_time,
          recorded_date: this.props.allvitals[0].recorded_date
        })
      : null;
  }

  componentDidMount() {
    getVitalHistory(this);
    this.setPatientVitals();
    getPhysicalExaminations(this);
  }

  headerDropDownHandle(value) {
    this.setState(
      { [value.name]: value.value },
      getPhysicalExaminationsDetails(
        this,
        this.state.hims_d_physical_examination_header_id
      )
    );
  }

  detailDropDownHandle(value) {
    this.setState({ [value.name]: value.value }, () => {
      getPhysicalExaminationsSubDetails(
        this,
        this.state.hims_d_physical_examination_header_id,
        this.state.hims_d_physical_examination_details_id
      );
    });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  calculatebmi() {
    let w = this.state.weight;
    let h = this.state.height;

    if (w > 0 && h > 0) {
      this.setState({ bmi: w / (((h / 100) * h) / 100) });
    }
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
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
                                      {data.oxysat
                                        ? data.oxysat
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

        {/* Examination Modal Start*/}

        <Modal open={this.state.openExamnModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Add EXamination</h4>
            </div>
            <div className="popupInner">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4 popLeftDiv">
                    <div className="complain-box">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-12" }}
                        label={{
                          forceLabel: "Examination Type"
                        }}
                        selector={{
                          name: "hims_d_physical_examination_header_id",
                          className: "select-fld",
                          value: this.state
                            .hims_d_physical_examination_header_id,
                          dataSource: {
                            textField: "header_description",
                            valueField: "hims_d_physical_examination_header_id",
                            data: this.props.allexaminations
                          },
                          onChange: this.headerDropDownHandle.bind(this)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Examination Description"
                        }}
                        selector={{
                          name: "hims_d_physical_examination_details_id",
                          className: "select-fld",
                          value: this.state
                            .hims_d_physical_examination_details_id,
                          dataSource: {
                            textField: "detail_description",
                            valueField:
                              "hims_d_physical_examination_details_id",
                            data: this.props.allexaminationsdetails
                          },
                          onChange: this.detailDropDownHandle.bind(this)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          forceLabel: "Examination"
                        }}
                        selector={{
                          name: "hims_d_physical_examination_subdetails_id",
                          className: "select-fld",
                          value: this.state
                            .hims_d_physical_examination_subdetails_id,
                          dataSource: {
                            textField: "subdetail_description",
                            valueField:
                              "hims_d_physical_examination_subdetails_id",
                            data: this.props.allexaminationsubdetails
                          },
                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-12 margin-top-15" }}
                        label={{
                          fieldName: "comments",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "examination_comment",
                          others: {
                            multiline: true,
                            rows: "4"
                          },
                          value: this.state.examination_comment,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-lg-8 popRightDiv">
                    <h6> List of Examinations</h6>
                    <hr />
                    <AlgaehDataGrid
                      id="patient_chart_grd"
                      columns={[
                        {
                          fieldName: "date",
                          label: "Examination Type"
                        },
                        {
                          fieldName: "first_name",
                          label: "Examination Description"
                        },
                        {
                          fieldName: "",
                          label: "Examination"
                        },

                        {
                          fieldName: "active",
                          label: "Comments"
                        }
                      ]}
                      keyId="code"
                      dataSource={{
                        data: []
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 5 }}
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
              </div>
            </div>
            <div className="row popupFooter">
              <div className="col-lg-4">
                <button
                  // onClick={this.addAllergyToPatient.bind(this)}
                  type="button"
                  className="btn btn-primary"
                >
                  Add Examination
                </button>
                <button type="button" className="btn btn-other">
                  Clear
                </button>
              </div>
              <div className="col-lg-8">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={this.handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Examination Modal End */}

        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-8">
              {/* Physical Examination Section Start */}
              <div className="portlet portlet-bordered box-shadow-normal margin-top-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Physical Examination</h3>
                  </div>

                  <div className="actions">
                    <a className="btn btn-primary btn-circle active">
                      <i
                        onClick={this.openExaminationModal.bind(this)}
                        className="fas fa-plus"
                      />
                    </a>
                  </div>
                </div>

                <div className="portlet-body">
                  <div className="col-lg-12">
                    <div className="row" style={{ marginBottom: "10px" }}>
                      <div className="col-4">
                        {/* <div className="form-group">
                          <label>Search</label>
                          <div className="input-group">
                            <input type="text" className="form-control" />
                            <div className="input-group-append">
                              <span className="input-group-text">
                                <i className="fas fa-search" />
                              </span>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  <AlgaehDataGrid
                    id="patient_chart_grd"
                    columns={[
                      {
                        fieldName: "date",
                        label: "Examination Type"
                      },
                      {
                        fieldName: "first_name",
                        label: "Examination Description"
                      },
                      {
                        fieldName: "",
                        label: "Examination"
                      },

                      {
                        fieldName: "active",
                        label: "Comments"
                      }
                    ]}
                    keyId="code"
                    dataSource={{
                      data: []
                    }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 5 }}
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
                    <a className="btn btn-primary btn-circle active">
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
                          value: this.state.weight,
                          events: {
                            onChange: this.texthandle.bind(this)
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
                          name: "height",
                          others: {
                            type: "number"
                          },
                          value: this.state.height,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col vitalTopFld15" }}
                        label={{
                          forceLabel: "BMI (Kg/m2)",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "bmi",
                          others: {
                            type: "number"
                          },
                          value: this.state.bmi,
                          events: {
                            onChange: this.texthandle.bind(this)
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
                          name: "oxysat",
                          others: {
                            type: "number"
                          },
                          value: this.state.oxysat,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                      {/* <AlagehFormGroup
                        div={{ className: "col vitalTopFld20" }}
                        label={{
                          forceLabel: "Heart Rate(bpm)",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "hr",
                          others: {
                            type: "number"
                          },
                          value: this.state.department_name,
                          events: {
                              onChange: this.texthandle.bind(this)
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
                          name: "rr",
                          others: {
                            type: "number"
                          },
                          //value: this.state.department_name,
                          events: {
                            //  onChange: this.changeDeptName.bind(this)
                          }
                        }} 
                      />*/}
                    </div>
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Temperature From"
                        }}
                        selector={{
                          name: "temperature_from",
                          className: "select-fld",
                          value: this.state.temperature_from,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.TEMP_FROM
                          },

                          onChange: this.dropDownHandle.bind(this)
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "."
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "temperature_celsisus",
                          others: {
                            type: "number"
                          },
                          value: this.state.temperature_celsisus,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                      {/* <AlagehAutoComplete
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
                      /> */}
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Blood Pressure"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "systolic",
                          others: {
                            type: "number"
                          },
                          value: this.state.systolic,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                      <span className="margin-top-15">/</span>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "."
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "diastolic",
                          others: {
                            type: "number"
                          },
                          value: this.state.diastolic,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                    </div>
                    <div className="row">
                      <AlgaehDateHandler
                        div={{ className: "col" }}
                        label={{ forceLabel: "Recorded Date", isImp: true }}
                        textBox={{
                          className: "txt-fld",
                          name: "recorded_date"
                        }}
                        maxDate={new Date()}
                        events={{
                          onChange: selectedDate => {
                            this.setState({ recorded_date: selectedDate });
                          }
                        }}
                        value={this.state.recorded_date}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          isImp: true,
                          forceLabel: "Recorded Time"
                        }}
                        textBox={{
                          others: {
                            type: "time"
                          },
                          className: "txt-fld",
                          name: "recorded_time",
                          value: this.state.recorded_time,
                          events: {
                            onChange: this.texthandle.bind(this)
                          }
                        }}
                      />
                      <div className="col margin-top-15">
                        <button type="button" className="btn btn-default">
                          Cancel
                        </button>
                        <button
                          onClick={this.addPatientVitals.bind(this)}
                          type="button"
                          className="btn btn-primary"
                        >
                          Add new Vitals
                        </button>
                      </div>
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
    allvitals: state.allvitals,
    allexaminations: state.allexaminations,
    allexaminationsdetails: state.allexaminationsdetails,
    allexaminationsubdetails: state.allexaminationsubdetails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVitalHistory: AlgaehActions,
      getPhysicalExaminations: AlgaehActions,
      getPhysicalExaminationsDetails: AlgaehActions,
      getPhysicalExaminationsSubDetails: AlgaehActions
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
