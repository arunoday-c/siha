import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";

import moment from "moment";
import {
  // AlgaehDateHandler,
  // AlgaehLabel,
  AlagehFormGroup,
  AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import "./PatientAttendance.scss";
import "../../../styles/site.scss";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";

class PatientAttendance extends Component {
  constructor(props) {
    super(props);
    // const {
    //     episode_id,
    //     current_patient,
    //     visit_id
    // } = Window.global;
    this.state = {
      from_time: null,
      to_time: null,
    };
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onClose = (e) => {
    this.setState({ from_time: null, to_time: null }, () => {
      this.props.onClose && this.props.onClose(e);
    });
  };

  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  PrintPatientAttendance() {
    if (this.state.from_time === null) {
      swalMessage({
        title: "From time cannot be blank",
        type: "warning",
      });
      return;
    } else if (this.state.to_time === null) {
      swalMessage({
        title: "To time cannot be blank",
        type: "warning",
      });
      return;
    }
    const { episode_id, current_patient, visit_id } = Window.global;

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
          reportName: "patientAttendence",
          reportParams: [
            {
              name: "patient_id",
              value: current_patient,
            },
            {
              name: "visit_id",
              value: visit_id,
            },
            {
              name: "episode_id",
              value: episode_id,
            },
            {
              name: "from_time",
              value: this.state.from_time,
            },
            {
              name: "to_time",
              value: this.state.to_time,
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
            title="Patient Attendance"
            openPopup={this.props.openPatientAttendance}
          >
            <div className="popupInner">
              <div className="popRightDiv">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      isImp: true,
                      forceLabel: "From Time",
                    }}
                    textBox={{
                      others: {
                        type: "time",
                      },
                      className: "txt-fld",
                      name: "from_time",
                      value: this.state.from_time,
                      events: {
                        onChange: this.texthandle.bind(this),
                      },
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      isImp: true,
                      forceLabel: "To Time",
                    }}
                    textBox={{
                      others: {
                        type: "time",
                      },
                      className: "txt-fld",
                      name: "to_time",
                      value: this.state.to_time,
                      events: {
                        onChange: this.texthandle.bind(this),
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.PrintPatientAttendance.bind(this)}
                    >
                      Print
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
  connect(mapStateToProps, mapDispatchToProps)(PatientAttendance)
);
