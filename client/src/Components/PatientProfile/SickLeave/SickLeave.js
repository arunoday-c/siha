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
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import "./SickLeave.scss";
import "../../../styles/site.scss";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";

class SickLeave extends Component {
  constructor(props) {
    super(props);
    const {
      episode_id,
      current_patient,
      visit_id
    } = Window.global;
    this.state = {
      from_date: null,
      to_date: null,
      no_of_days: 0,
      remarks: "",
      episode_id: episode_id, //Window.global["episode_id"],
      patient_id: current_patient, //Window.global["current_patient"],
      visit_id: visit_id, // Window.global["visit_id"],
      disableEdit: false
    };
    this.getSickLeave();
  }

  getSickLeave() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getSickLeave",
      method: "GET",
      data: {
        patient_id: this.state.patient_id,
        visit_id: this.state.visit_id
      },
      onSuccess: response => {
        let data = response.data.records[0];
        if (response.data.success) {
          this.setState({
            ...data,
            disableEdit: response.data.records.length > 0 ? true : false
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
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
      no_of_days: days
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  textAreaEvent(e) {
    // significant_signs
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value
    });
  }

  onClose = e => {
    this.setState(
      { from_date: null, to_date: null, no_of_days: 0, remarks: "" },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  PrintSickLeave() {
    if (this.state.from_date === null) {
      swalMessage({
        title: "From date cannot be blank",
        type: "warning"
      });
      return;
    } else if (this.state.to_date === null) {
      swalMessage({
        title: "To date cannot be blank",
        type: "warning"
      });
      return;
    } else if (this.state.remarks.length === 0) {
      swalMessage({
        title: "Remarks cannot be blank",
        type: "warning"
      });
      return;
    }
    const {
      episode_id,
      current_patient,
      visit_id
    } = Window.global;
    algaehApiCall({
      uri: "/doctorsWorkBench/addSickLeave",
      data: this.state,
      method: "POST",
      onSuccess: response => {
        if (response.data.success) {
          algaehApiCall({
            uri: "/report",
            method: "GET",
            module: "reports",
            headers: {
              Accept: "blob"
            },
            others: { responseType: "blob" },
            data: {
              report: {
                reportName: "sickLeave",
                reportParams: [
                  {
                    name: "patient_id",
                    value: current_patient //Window.global["current_patient"]
                  },
                  {
                    name: "visit_id",
                    value: visit_id //Window.global["visit_id"]
                  },
                  {
                    name: "episode_id",
                    value: episode_id // Window.global["episode_id"]
                  }
                ],
                outputFileType: "PDF"
              }
            },
            onSuccess: res => {
              const url = URL.createObjectURL(res.data);
              let myWindow = window.open(
                "{{ product.metafields.google.custom_label_0 }}",
                "_blank"
              );

              myWindow.document.write(
                "<iframe src= '" + url + "' width='100%' height='100%' />"
              );
              myWindow.document.title = "Sick Leave";
            }
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
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
          type: "warning"
        });
        e.target.focus();
        this.setState({
          [e.target.name]: null,
          no_of_days: 0
        });
      }
    } else if (e.target.name === "to_date") {
      inRange = moment(value).isBefore(
        moment(this.state.from_date).format("YYYY-MM-DD")
      );
      if (inRange) {
        swalMessage({
          title: "To Date cannot be less than From Date.",
          type: "warning"
        });
        e.target.focus();
        this.setState({
          [e.target.name]: null,
          no_of_days: 0
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
              onClose: this.onClose.bind(this)
            }}
            title="Sick Leave"
            openPopup={this.props.openSickLeave}
          >
            <div className="popupInner">
              <div className="popRightDiv">
                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col-4 form-group" }}
                    label={{ forceLabel: "From Date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "from_date",
                      others: {
                        disabled: this.state.disableEdit
                      }
                    }}
                    minDate={new Date()}
                    events={{
                      onChange: this.datehandle.bind(this),
                      onBlur: this.dateValidate.bind(this)
                    }}
                    value={this.state.from_date}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-4 form-group" }}
                    label={{ forceLabel: "To Date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "to_date",
                      others: {
                        disabled: this.state.disableEdit
                      }
                    }}
                    minDate={new Date()}
                    events={{
                      onChange: this.datehandle.bind(this),
                      onBlur: this.dateValidate.bind(this)
                    }}
                    value={this.state.to_date}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-4 form-group" }}
                    label={{
                      forceLabel: "No. Of Days"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "no_of_days",
                      value: this.state.no_of_days,
                      events: {
                        onChange: this.changeTexts.bind(this)
                      },
                      others: {
                        type: "number",
                        disabled: true
                      }
                    }}
                  />
                  <div className="col form-group">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Remarks",
                        isImp: true
                      }}
                    />
                    <textarea
                      value={this.state.remarks}
                      name="remarks"
                      onChange={this.textAreaEvent.bind(this)}
                      disabled={this.state.disableEdit}
                    />
                  </div>
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
                      onClick={this.PrintSickLeave.bind(this)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={e => {
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
    dietList: state.dietList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDietMaster: AlgaehActions,
      getDietList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SickLeave)
);
