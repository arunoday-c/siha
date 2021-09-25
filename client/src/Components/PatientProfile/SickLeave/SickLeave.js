import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";

import moment from "moment";
import {
  AlgaehDateHandler,
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import "./SickLeave.scss";
import "../../../styles/site.scss";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
// import { Checkbox } from "antd";

class SickLeave extends Component {
  constructor(props) {
    super(props);

    this.state = {
      from_date: null,
      to_date: null,
      no_of_days: 0,
      remarks: "",
      diagnosis_data: "",
      reported_sick: false,
      accompanying_patient: false,
      patient_unfit: false,
      patient_fit: false,
      advice_light_duty: false,
      pat_need_emp_care: false,
      episode_id: Window?.global?.episode_id,
      patient_id: Window?.global?.current_patient,
      visit_id: Window?.global?.visit_id,
      ip_id: Window?.global?.ip_id,
      disableEdit: false,
      hims_f_patient_sick_leave_id: null,
    };
    this.getSickLeave();
    this.canUpdate = true;
  }
  componentDidMount() {
    if (this.props.patientData) {
      this.setState(
        {
          episode_id: this.props.patientData.episode_id,
          patient_id: this.props.patientData.patient_id,
          visit_id: this.props.patientData.visit_id,
          ip_id: this.props.patientData.ip_id,
        },
        () => {
          this.getSickLeave();
        }
      );
    }
    // if (this.state.diagnosis_data === "" && this.canUpdate === true) {
    const primaryExists = this.props.patient_diagnosis
      .filter((f) => f.diagnosis_type === "P")
      .map((item) => {
        return item.icd_description;
      })
      .join(",");
    if (primaryExists !== this.state.diagnosis_data) {
      this.setState({
        diagnosis_data: primaryExists,
      });
      // this.canUpdate = false;
    }
    // }
  }
  // componentDidUpdate() {
  //   if (this.state.diagnosis_data === "" && this.canUpdate === true) {
  //     const primaryExists = this.props.patient_diagnosis
  //       .filter((f) => f.diagnosis_type === "P")
  //       .map((item) => {
  //         return item.icd_description;
  //       })
  //       .join(",");
  //     if (primaryExists !== this.state.diagnosis_data) {
  //       this.setState({
  //         diagnosis_data: primaryExists,
  //       });
  //       this.canUpdate = false;
  //     }
  //   }
  // }
  getSickLeave() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getSickLeave",
      method: "GET",
      data: {
        patient_id: this.state.patient_id,
        visit_id: this.state.visit_id,
        ip_id: this.state.ip_id,
      },
      onSuccess: (response) => {
        let data = response.data.records[0];
        if (response.data.success) {
          this.setState({
            ...data,
            reported_sick: data.reported_sick === "Y" ? true : false,
            accompanying_patient:
              data.accompanying_patient === "Y" ? true : false,
            patient_unfit: data.patient_unfit === "Y" ? true : false,
            patient_fit: data.patient_fit === "Y" ? true : false,
            advice_light_duty: data.advice_light_duty === "Y" ? true : false,
            pat_need_emp_care: data.pat_need_emp_care === "Y" ? true : false,
            disableEdit: response.data.records.length > 0 ? true : false,
            // diagnosis_data: primaryExists,
            hims_f_patient_sick_leave_id: data.hims_f_patient_sick_leave_id,
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  datehandle(ctrl, e) {
    let days = 0;
    let fromDate = null;
    let toDate = null;
    let inRange = false;

    if (e === "from_date" && this.state.to_date !== null) {
      inRange = moment(e).isAfter(
        moment(this.state.to_date).format("YYYY-MM-DD")
      );

      if (inRange === false) {
        fromDate = moment(ctrl);
        toDate = moment(this.state.to_date);
        days = toDate.diff(fromDate, "days");
        days = days + 1;
      }
    } else if (e === "to_date" && this.state.from_date !== null) {
      inRange = moment(e).isBefore(
        moment(this.state.from_date).format("YYYY-MM-DD")
      );
      if (inRange === false) {
        fromDate = moment(this.state.from_date);
        toDate = moment(ctrl);
        days = toDate.diff(fromDate, "days");
        days = days + 1;
      }
    }

    this.setState({
      [e]: moment(ctrl)._d,
      no_of_days: days,
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  textAreaEvent(e) {
    this.canUpdate = false;
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onClose = (e) => {
    this.setState({}, () => {
      this.props.onClose && this.props.onClose(e);
    });
  };

  printSickleaveAfterUpadteAndAdd() {
    let episode_id;
    let current_patient;
    let visit_id;
    let ip_id;
    if (this.props.patientData) {
      episode_id = this.props.patientData.episode_id;
      current_patient = this.props.patientData.patient_id;
      visit_id = this.props.patientData.visit_id;
      ip_id = this.props.patientData.ip_id;
    } else {
      episode_id = Window.global.episode_id;
      current_patient = Window.global.current_patient;
      visit_id = Window.global.visit_id;
      ip_id = Window.global.ip_id;
    }

    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob",
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "sickLeave",
          reportParams: [
            {
              name: "patient_id",
              value: current_patient, //Window.global["current_patient"]
            },
            {
              name: "visit_id",
              value: visit_id, //Window.global["visit_id"]
            },
            {
              name: "episode_id",
              value: episode_id, // Window.global["episode_id"]
            },
            {
              name: "episode_id",
              value: episode_id, // Window.global["episode_id"]
            },
            {
              name: "ip_id",
              value: ip_id,
            },
          ],
          outputFileType: "PDF",
        },
      },
      onSuccess: (res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Sick Leave`;
        window.open(origin);
        // window.document.title = "";
      },

      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  printUpdatedSickLeave() {
    if (this.state.from_date === null) {
      swalMessage({
        title: "From date cannot be blank",
        type: "warning",
      });
      return;
    } else if (this.state.to_date === null) {
      swalMessage({
        title: "To date cannot be blank",
        type: "warning",
      });
      return;
    } else if (this.state.remarks.length === 0) {
      swalMessage({
        title: "Remarks cannot be blank",
        type: "warning",
      });
      return;
    } else if (this.state.diagnosis_data.length === 0) {
      swalMessage({
        title: "Diagnosis cannot be blank",
        type: "warning",
      });
      return;
    }

    algaehApiCall({
      uri: "/doctorsWorkBench/updateSickLeave",
      data: this.state,
      method: "PUT",
      onSuccess: (response) => {
        if (response.data.success) {
          this.printSickleaveAfterUpadteAndAdd();
        }
      },
    });
  }
  PrintSickLeave() {
    if (this.state.from_date === null) {
      swalMessage({
        title: "From date cannot be blank",
        type: "warning",
      });
      return;
    } else if (this.state.to_date === null) {
      swalMessage({
        title: "To date cannot be blank",
        type: "warning",
      });
      return;
    } else if (this.state.remarks.length === 0) {
      swalMessage({
        title: "Remarks cannot be blank",
        type: "warning",
      });
      return;
    } else if (this.state.diagnosis_data.length === 0) {
      swalMessage({
        title: "Diagnosis cannot be blank",
        type: "warning",
      });
      return;
    }

    algaehApiCall({
      uri: "/doctorsWorkBench/addSickLeave",
      data: this.state,
      method: "POST",
      onSuccess: (response) => {
        if (response.data.success) {
          this.printSickleaveAfterUpadteAndAdd();
        }
      },
    });
  }
  changeCheck(e) {
    const { name, checked } = e.target;
    this.setState({
      [name]: checked,
    });
  }

  dateValidate(value, e) {
    let inRange = false;
    if (e.target.name === "from_date") {
      inRange = moment(value).isAfter(
        moment(this.state.to_date).format("YYYY-MM-DD")
      );
      if (inRange) {
        swalMessage({
          title: "From Date cannot be grater than To Date.",
          type: "warning",
        });
        e.target.focus();
        this.setState({
          [e.target.name]: null,
          no_of_days: 0,
        });
      }
    } else if (e.target.name === "to_date") {
      inRange = moment(value).isBefore(
        moment(this.state.from_date).format("YYYY-MM-DD")
      );
      if (inRange) {
        swalMessage({
          title: "To Date cannot be less than From Date.",
          type: "warning",
        });
        e.target.focus();
        this.setState({
          [e.target.name]: null,
          no_of_days: 0,
        });
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            class="sickPopupWidth"
            events={{
              onClose: this.onClose.bind(this),
            }}
            title="Sick Leave"
            openPopup={this.props.openSickLeave}
          >
            <div className="popupInner">
              <div className="popRightDiv">
                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col-4 form-group mandatory" }}
                    label={{ fieldName: "from_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "from_date",
                      others: {
                        // disabled: this.state.disableEdit,
                      },
                    }}
                    // minDate={new Date()}
                    events={{
                      onChange: this.datehandle.bind(this),
                      onBlur: this.dateValidate.bind(this),
                    }}
                    value={this.state.from_date}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-4 form-group mandatory" }}
                    label={{ fieldName: "to_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "to_date",
                      others: {
                        // disabled: this.state.disableEdit,
                      },
                    }}
                    minDate={new Date()}
                    events={{
                      onChange: this.datehandle.bind(this),
                      onBlur: this.dateValidate.bind(this),
                    }}
                    value={this.state.to_date}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-4 form-group" }}
                    label={{
                      forceLabel: "No. Of Days",
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "no_of_days",
                      value: this.state.no_of_days,
                      events: {
                        onChange: this.changeTexts.bind(this),
                      },
                      others: {
                        type: "number",
                        disabled: true,
                      },
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-3">
                    <label>Reported as Sick</label>
                    <div className="customCheckbox">
                      <label className="checkbox block">
                        <input
                          type="checkbox"
                          value={this.state.reported_sick ? "Y" : "N"}
                          name="reported_sick"
                          // disabled={this.state.disableEdit}
                          checked={this.state.reported_sick}
                          onChange={this.changeCheck.bind(this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-3">
                    <label>Accompanying Patient</label>
                    <div className="customCheckbox">
                      <label className="checkbox block">
                        <input
                          type="checkbox"
                          name="accompanying_patient"
                          value={this.state.accompanying_patient ? "Y" : "N"}
                          checked={this.state.accompanying_patient}
                          // disabled={this.state.disableEdit}
                          onChange={this.changeCheck.bind(this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-3">
                    <label>Patient UNfit for duty</label>
                    <div className="customCheckbox">
                      <label className="checkbox block">
                        <input
                          type="checkbox"
                          name="patient_unfit"
                          value={this.state.patient_unfit ? "Y" : "N"}
                          checked={this.state.patient_unfit}
                          // disabled={this.state.disableEdit}
                          onChange={this.changeCheck.bind(this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-3">
                    <label>Patient fit for duty</label>
                    <div className="customCheckbox">
                      <label className="checkbox block">
                        <input
                          type="checkbox"
                          name="patient_fit"
                          value={this.state.patient_fit ? "Y" : "N"}
                          checked={this.state.patient_fit}
                          // disabled={this.state.disableEdit}
                          onChange={this.changeCheck.bind(this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-3">
                    <label>Advice Light Duty</label>
                    <div className="customCheckbox">
                      <label className="checkbox block">
                        <input
                          type="checkbox"
                          name="advice_light_duty"
                          value={this.state.advice_light_duty ? "Y" : "N"}
                          checked={this.state.advice_light_duty}
                          // disabled={this.state.disableEdit}
                          onChange={this.changeCheck.bind(this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                  <div className="col">
                    <label>Patient needs employees care</label>
                    <div className="customCheckbox">
                      <label className="checkbox block">
                        <input
                          type="checkbox"
                          name="pat_need_emp_care"
                          value={this.state.pat_need_emp_care ? "Y" : "N"}
                          checked={this.state.pat_need_emp_care}
                          // disabled={this.state.disableEdit}
                          onChange={this.changeCheck.bind(this)}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {" "}
                  <div className="col-12 form-group  mandatory">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Diagnosis",
                        isImp: true,
                      }}
                    />
                    <textarea
                      value={this.state.diagnosis_data}
                      name="diagnosis_data"
                      onChange={this.textAreaEvent.bind(this)}
                      // disabled={this.state.disableEdit}
                    />
                  </div>
                  <div className="col-12 form-group  mandatory">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Remarks",
                        isImp: true,
                      }}
                    />
                    <textarea
                      value={this.state.remarks}
                      name="remarks"
                      onChange={this.textAreaEvent.bind(this)}
                      // disabled={this.state.disableEdit}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className=" popupFooter">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={
                        this.state.hims_f_patient_sick_leave_id
                          ? this.printUpdatedSickLeave.bind(this)
                          : this.PrintSickLeave.bind(this)
                      }
                    >
                      {this.state.hims_f_patient_sick_leave_id
                        ? " Update & Print"
                        : "save & print"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={(e) => {
                        this.onClose(e);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    dietmaster: state.dietmaster,
    dietList: state.dietList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDietMaster: AlgaehActions,
      getDietList: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SickLeave)
);
