import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Modal from '@material-ui/core/Modal'

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

class RadResultEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (

        <div>
          
        <Modal
        open= {true}
        >
        <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Add / Edit History of Patient Illness</h4>
            </div>
            <div className="popupInner">
            <div className="patientInfo-Top box-shadow-normal">
          <div className="patientName">
            <h6>Amina Nazir Hussain</h6>
            <p>Male, 43Y 7M 10D</p>
          </div>
          <div className="patientDemographic">
            <span>
              DOB: <b>31/12/1947</b>
            </span>
            <span>
              Mobile:  <b>6756754544
              </b>
            </span>
            <span>
              MRN: <b>745632675873</b>
            </span>
          </div>
          <div className="patientDemographic">
            <span>
              Visit ID: <b>VST646465</b>
            </span>
            <span>
              Visit Date: <b>08/10/2018, 11:45 AM</b>
            </span>
            <span>
              Payment: <b>National Insurance Damam</b>
            </span>
          </div>
          <div className="patientDemographic">
            <span>
              Ref by: <b>Dr. Bushra Raheem</b>
            </span>
            <span>
              Scheduled Date: <b>08/10/2018, 11:45 AM</b>
            </span>
          </div>
        </div>
        <div className="col-12">
        <div className="row">
        <div className="col-3 popLeftDiv">
        <p>jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg jfhkjdfhgkdhfgkdhfgkdfg </p>
        </div>
        <div className="col-9 popRightDiv">
        
        <h5>shfgdjhfgjdfgjgkj jkg</h5>
        <hr/>
        <h5>shfgdjhfgjdfgjgkj jkg</h5>
        <hr/>
        <h5>shfgdjhfgjdfgjgkj jkg</h5>
        <hr/>
        <h5>shfgdjhfgjdfgjgkj jkg</h5>
        <hr/>
        <h5>shfgdjhfgjdfgjgkj jkg</h5>
        <hr/>
        <h5>shfgdjhfgjdfgjgkj jkg</h5>
        <hr/>
        <h5>shfgdjhfgjdfgjgkj jkg</h5>
        <hr/>
        <h5>shfgdjhfgjdfgjgkj jkg</h5>
        <hr/>
        </div></div>
        </div>
            </div>
             <div className="popupFooter">             
<button type="button" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-default">Cancel</button>
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
