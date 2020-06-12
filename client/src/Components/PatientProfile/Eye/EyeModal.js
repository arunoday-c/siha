import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import GlobalVariables from "../../../utils/GlobalVariables.json";
import "./Eye.scss";
import {
  AlgaehDateHandler,
  AlagehAutoComplete,
  // AlagehFormGroup,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import EyeModalEvent from "./EyeModalEvent";
import OptometricIOputs from "../../../Models/Optometric";

class EyeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let IOputs = OptometricIOputs.inputParam();
    this.setState(IOputs);
  }

  onClose(e) {
    this.props.onClose && this.props.onClose(e);
  }

  ChangeEventHandler(e) {
    EyeModalEvent().ChangeEventHandler(this, e);
  }

  radioChange(e) {
    EyeModalEvent().radioChange(this, e);
  }

  render() {
    return (
      <React.Fragment>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openRefraction}
        >
          <div className="popupInner">
            <div className="popRightDiv table-responsive">
              <table className="table table-bordered table-sm">
                <tbody>
                  <tr>
                    <td rowspan="3">Subjective Correction</td>
                    <td />
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>VN</td>
                    <td>ADD</td>
                    <td>NV</td>
                  </tr>
                  <tr>
                    <td>OD</td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>OS</td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={this.SaveAdvance.bind(this, context)}
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

        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openCyclo}
        >
          <div className="popupInner">
            <div className="popRightDiv table-responsive">
              <table className="table table-bordered table-sm">
                <tbody>
                  <tr>
                    <td rowspan="3">Subjective Correction</td>
                    <td />
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>VN</td>
                    <td>ADD</td>
                    <td>NV</td>
                  </tr>
                  <tr>
                    <td>OD</td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>OS</td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={this.SaveAdvance.bind(this, context)}
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

        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openPMT}
        >
          <div className="popupInner">
            <div className="popRightDiv table-responsive">
              <table className="table table-bordered table-sm">
                <tbody>
                  <tr>
                    <td rowspan="3">Subjective Correction</td>
                    <td />
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>VN</td>
                    <td>ADD</td>
                    <td>NV</td>
                  </tr>
                  <tr>
                    <td>OD</td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>OS</td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={this.SaveAdvance.bind(this, context)}
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

        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openAddVision}
        >
          <div className="popupInner">
            <div className="popRightDiv table-responsive">
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th colspan="2" />
                    <th colspan="4">Right Eye</th>
                    <th colspan="4">Left Eye</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowspan="2">Pinhole Vision</td>
                    <td>OD</td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td colspan="4" />
                  </tr>
                  <tr>
                    <td>OS</td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td colspan="4" />
                  </tr>
                  <tr>
                    <td rowspan="2">UCVA</td>
                    <td>DV</td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>NV</td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={this.SaveAdvance.bind(this, context)}
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

        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openAddIOP}
        >
          <div className="popupInner">
            <div className="popRightDiv table-responsive">
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th />
                    <th>Right Eye</th>
                    <th colspan="4">Right Eye</th>
                    <th>Methods</th>
                    <th colspan="4">Methods</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>IOP</td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlgaehDateHandler
                        textBox={{
                          className: "txt-fld",
                          name: ""
                        }}
                        maxDate={new Date()}
                        events={{}}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={this.SaveAdvance.bind(this, context)}
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
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    allallergies: state.allallergies,
    patient_allergies: state.patient_allergies
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllAllergies: AlgaehActions,
      getPatientAllergies: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EyeModal)
);
