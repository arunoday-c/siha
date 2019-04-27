import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import moment from "moment";
import "./OrderProcedureItems.css";
import "../../../../styles/site.css";
import {
  AlgaehLabel,
  //   AlagehFormGroup,
  //   AlagehAutoComplete,
  //   AlgaehDateHandler,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";

// import { getLabelFromLanguage } from "../../utils/GlobalFunctions";

// import {
//   texthandle,
//   datehandle,
//   cashtexthandle,
//   cardtexthandle,
//   chequetexthandle,
//   checkcashhandaler,
//   checkcardhandaler,
//   checkcheckhandaler,
//   Validations,
//   countertexthandle,
//   getCashiersAndShiftMAP
// } from "./AdvanceModalHandaler";

// import AlgaehLoader from "../Wrapper/fullPageLoader";
// import { getAmountFormart } from "../../utils/GlobalFunctions";
// import {
//   algaehApiCall,
//   swalMessage,
//   getCookie
// } from "../../utils/algaehApiCall.js";
import { AlgaehActions } from "../../../../actions/algaehActions";

class OrderProcedureItems extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title="Procedure Items"
            openPopup={this.props.show}
          >
            <div className="col-lg-12 popupInner">
              <div className="row">
                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Patient Code"
                    }}
                  />
                  <h6>
                    {this.props.inputsparameters.patient_code
                      ? this.props.inputsparameters.patient_code
                      : "Patient Code"}
                  </h6>
                </div>
                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Patient Name"
                    }}
                  />
                  <h6>
                    {this.props.inputsparameters.full_name
                      ? this.props.inputsparameters.full_name
                      : "Patient Name"}
                  </h6>
                </div>

                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Procedure Name"
                    }}
                  />
                  <h6>
                    {this.props.inputsparameters.full_name
                      ? this.props.inputsparameters.full_name
                      : "Procedure Name"}
                  </h6>
                </div>
              </div>
              <hr style={{ margin: "0rem" }} />
            </div>
            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
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
    patient_profile: state.patient_profile
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getShifts: AlgaehActions,
      getCounters: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderProcedureItems)
);
