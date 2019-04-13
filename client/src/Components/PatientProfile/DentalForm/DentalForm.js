import React, { Component } from "react";
import "./DentalForm.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
export default class DentalForm extends Component {
  render() {
    return (
      <div className="dentalFormScreen">
        <div className="col-12 margin-top-15">
          <div className="row">
            <div className="portlet portlet-bordered margin-bottom-15">
              {/* <div className="portlet-title">
      <div className="caption">
       <h3 className="caption-subject">Enter Grid Name Here</h3>
       </div>
      <div className="actions">
      <a className="btn btn-primary btn-circle active">
      <i className="fas fa-pen" />
      </a>
      </div>
      </div> */}
              <div className="portlet-body">
                <div className="col">
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
                      <label className="algaehLabelGroup">
                        Custom Abutments
                      </label>
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
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <button
              className="btn btn-primary"
              style={{ marginLeft: 10, float: "right" }}
            >
              Save
            </button>
            <button className="btn btn-default" style={{ float: "right" }}>
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }
}
