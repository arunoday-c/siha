import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";

class DentalForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <div>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.show}
        >
          <div className="col-lg-12 popupInner">
            <div className="col margin-top-15">
              <div className="row">
                <div className="col algaehLabelFormGroup">
                  <label className="algaehLabelGroup">All Ceramic</label>
                  <div className="row">
                    <div className="col">
                      {/* <label>Working Days</label> */}
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input type="checkbox" name="All" />
                          <span>BruxZir - Anterior</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>IPS E.max</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="monday" />
                          <span>Lava</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="tuesday" />
                          <span>Lumineers</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="wednesday" />
                          <span>Zirconia E.Max Layered</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="thursday" />
                          <span>BruxZir</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col algaehLabelFormGroup">
                  <label className="algaehLabelGroup">PFM</label>
                  <div className="row">
                    <div className="col">
                      {/* <label>Working Days</label> */}
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input type="checkbox" name="All" />
                          <span>Noble</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>White High Noble</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="monday" />
                          <span>Non- Precious</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col algaehLabelFormGroup">
                  <label className="algaehLabelGroup">Temp</label>
                  <div className="row">
                    <div className="col">
                      {/* <label>Working Days</label> */}
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input type="checkbox" name="All" />
                          <span>PMMA</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col algaehLabelFormGroup">
                  <label className="algaehLabelGroup">Partial</label>
                  <div className="row">
                    <div className="col">
                      {/* <label>Working Days</label> */}
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input type="checkbox" name="All" />
                          <span>Titanium</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>Zirconia w/Ti-Base</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="monday" />
                          <span>Biomet 3i Encode</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="tuesday" />
                          <span>Screw Retained</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="wednesday" />
                          <span>Felxi</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col algaehLabelFormGroup">
                  <label className="algaehLabelGroup">Custom Abutments</label>
                  <div className="row">
                    <div className="col">
                      {/* <label>Working Days</label> */}
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input type="checkbox" name="All" />
                          <span>Analog</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>Models</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="monday" />
                          <span>Implant Parts</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="tuesday" />
                          <span>Impression</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="wednesday" />
                          <span>Bite</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="thursday" />
                          <span>Shade Tab</span>
                        </label>{" "}
                        <label className="checkbox inline">
                          <input type="checkbox" name="thursday" />
                          <span>Others</span>
                        </label>{" "}
                        <label className="checkbox inline">
                          <input type="checkbox" name="thursday" />
                          <span>Photos</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col algaehLabelFormGroup">
                  <label className="algaehLabelGroup">
                    Enclosure (Lab Use Only)
                  </label>
                  <div className="row">
                    <div className="col">
                      {/* <label>Working Days</label> */}
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input type="checkbox" name="All" />
                          <span>Bags</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>RX Forms</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col algaehLabelFormGroup">
                  <label className="algaehLabelGroup">Due Date</label>
                  <div className="row">
                    <AlgaehDateHandler
                      div={{ className: "col form-group" }}
                      label={{ forceLabel: "Due Date", isImp: false }}
                      textBox={{
                        className: "txt-fld",
                        name: ""
                      }}
                      maxDate={new Date()}
                      events={{}}
                    />
                  </div>
                </div>
                <div className="col-12 algaehLabelFormGroup">
                  <label className="algaehLabelGroup">Dental Diagram</label>
                  <div className="row">image comes here</div>
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
                    // onClick={this.SaveAdvance.bind(this, context)}
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
          {/* </div> */}
        </AlgaehModalPopUp>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    shifts: state.shifts,
    counters: state.counters
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
  )(DentalForm)
);
