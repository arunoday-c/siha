import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Modal from "@material-ui/core/Modal";

import "./RadResultEntry.css";
import "./../../../styles/site.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";

class RadResultEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(newProps) {
    debugger;
    if (newProps.selectedPatient !== undefined) {
      this.setState({ ...this.state, ...newProps.selectedPatient });
    }
  }
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  dateFormater({ value }) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }
  render() {
    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <div>
        <Modal open={this.props.open}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Result Entry</h4>
            </div>
            <div className="popupInner">
              <div className="patientInfo-Top box-shadow-normal">
                <div className="patientName">
                  <h6>{this.state.full_name}</h6>
                  <p>{this.state.gender}</p>
                </div>
                <div className="patientDemographic">
                  <span>
                    DOB:
                    <b>
                      {moment(this.state.date_of_birth).format(
                        Options.dateFormat
                      )}
                    </b>
                  </span>
                  <span>
                    MRN: <b>{this.state.patient_code}</b>
                  </span>
                </div>
                <div className="patientDemographic">
                  <span>
                    Ref by: <b>{this.state.ordered_by}</b>
                  </span>
                  <span>
                    Scheduled Date:
                    <b>
                      {moment(this.state.scheduled_date_time).format(
                        Options.dateFormat
                      )}
                    </b>
                  </span>
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-3 popLeftDiv">
                    <p>
                      jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg
                      jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg
                      jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg
                      jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg
                      jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg
                      jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg
                      jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg
                      jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg
                      jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg{" "}
                    </p>
                  </div>
                  <div className="col-9 popRightDiv">
                    <h5>shfgdjhfgjdfgjgkj jkg</h5>
                    <hr />
                    <h5>shfgdjhfgjdfgjgkj jkg</h5>
                    <hr />
                    <h5>shfgdjhfgjdfgjgkj jkg</h5>
                    <hr />
                    <h5>shfgdjhfgjdfgjgkj jkg</h5>
                    <hr />
                    <h5>shfgdjhfgjdfgjgkj jkg</h5>
                    <hr />
                    <h5>shfgdjhfgjdfgjgkj jkg</h5>
                    <hr />
                    <h5>shfgdjhfgjdfgjgkj jkg</h5>
                    <hr />
                    <h5>shfgdjhfgjdfgjgkj jkg</h5>
                    <hr />
                  </div>
                </div>
              </div>
            </div>
            <div className="popupFooter">
              <button type="button" className="btn btn-primary">
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
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    radtestlist: state.radtestlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRadiologyTestList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RadResultEntry)
);
