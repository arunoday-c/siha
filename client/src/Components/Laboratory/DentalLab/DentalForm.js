import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./../../../styles/site.scss";
import {
  AlgaehDateHandler,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";

class DentalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient_id: null,
      provider_id: null,
      visit_id: null,
      episode: null,
      approved: "N",
      work_status: "PEN",
      due_date: null,
      bruxzir_anterior: false,
      ips_e_max: false,
      lava: false,
      lumineers: false,
      zirconia_e_max_layered: false,
      bruxzir: false,
      nobel: false,
      white_high_nobel: false,
      non_precious: false,
      pmma: false,
      titanium: false,
      zirconia_w_ti_base: false,
      biomet_3i_encode: false,
      screw_retained: false,
      flexi: false,
      analog: false,
      models: false,
      implant_parts: false,
      impression: false,
      bite: false,
      shade_tab: false,
      others: false,
      photos: false,
      bags: false,
      rx_forms: false
    };
  }

  changeChecks(e) {
    this.setState({
      [e.target.name]: e.target.checked
    });
  }

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
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="bruxzir_anterior"
                            checked={this.state.bruxzir_anterior}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>BruxZir - Anterior</span>
                        </label>

                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="ips_e_max"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>IPS E.max</span>
                        </label>

                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="lava"
                            checked={this.state.lava}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Lava</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="lumineers"
                            checked={this.state.lumineers}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Lumineers</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="zirconia_e_max_layered"
                            checked={this.state.zirconia_e_max_layered}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Zirconia E.Max Layered</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="bruxzir"
                            checked={this.state.bruxzir}
                            onChange={this.changeChecks.bind(this)}
                          />
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
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="nobel"
                            checked={this.state.nobel}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Noble</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>White High Noble</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
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
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
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
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Titanium</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Zirconia w/Ti-Base</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Biomet 3i Encode</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Screw Retained</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
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
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Analog</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Models</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Implant Parts</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Impression</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Bite</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Shade Tab</span>
                        </label>{" "}
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Others</span>
                        </label>{" "}
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
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
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
                          <span>Bags</span>
                        </label>
                        <label className="checkbox block">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.ips_e_max}
                            onChange={this.changeChecks.bind(this)}
                          />
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
