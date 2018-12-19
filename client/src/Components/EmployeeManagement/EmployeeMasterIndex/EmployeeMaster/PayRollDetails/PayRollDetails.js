import React, { PureComponent } from "react";
import "./PayRollDetails.css";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../../../Wrapper/algaehWrapper";
import variableJson from "../../../../../utils/GlobalVariables.json";
import {
  texthandle,
  titlehandle,
  onDrop,
  countryStatehandle,
  datehandle,
  isDoctorChange
} from "./PayRollDetailsEvent.js";
class PayRollDetails extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-employee-form popRightDiv">
          <div className="row">
            <div className="col-lg-6 primary-details">
              <h5>
                <span>Salary Earnings Breakup</span>
              </h5>
              <div className="row">
                <div
                  className="col-2 customCheckbox"
                  style={{ border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="isdoctor"
                      value="Y"
                      checked={this.state.Applicable}
                    />
                    <span>
                      <AlgaehLabel label={{ forceLabel: "Allocation" }} />
                    </span>
                  </label>
                </div>
              </div>
              <div className="row paddin-bottom-5">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Earnings Type",
                    isImp: true
                  }}
                  selector={{
                    name: "title_id",
                    className: "select-fld",
                    value: this.state.title_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "title"
                          : "arabic_title",
                      valueField: "his_d_title_id",
                      data: this.props.titles
                    },
                    onChange: null,
                    others: {
                      tabIndex: "2"
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Amount",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "full_name",
                    value: this.state.full_name,
                    events: {
                      onChange: null
                    },
                    others: {
                      tabIndex: "2"
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Allocate to",
                    isImp: true
                  }}
                  selector={{
                    name: "title_id",
                    className: "select-fld",
                    value: this.state.title_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "title"
                          : "arabic_title",
                      valueField: "his_d_title_id",
                      data: this.props.titles
                    },
                    onChange: null,
                    others: {
                      tabIndex: "2"
                    }
                  }}
                />
              </div>{" "}
              <hr />
              <div className="row paddin-bottom-5">
                <div className="col">Tables Come Here</div>
              </div>
            </div>
            <div className="col-lg-6 secondary-details">
              <h5>
                <span>Salary Dedection Breakup</span>
              </h5>
              <div className="row paddin-bottom-5">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Deduction Type",
                    isImp: true
                  }}
                  selector={{
                    name: "title_id",
                    className: "select-fld",
                    value: this.state.title_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "title"
                          : "arabic_title",
                      valueField: "his_d_title_id",
                      data: this.props.titles
                    },
                    onChange: null,
                    others: {
                      tabIndex: "2"
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Amount",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "full_name",
                    value: this.state.full_name,
                    events: {
                      onChange: null
                    },
                    others: {
                      tabIndex: "2"
                    }
                  }}
                />
              </div>
              <div className="row paddin-bottom-5">
                <div className="col">Tables Come Here</div>
              </div>
              <h5>
                <span>Employee Contribution Breakup</span>
              </h5>
              <div className="row paddin-bottom-5">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Contribution Type",
                    isImp: true
                  }}
                  selector={{
                    name: "title_id",
                    className: "select-fld",
                    value: this.state.title_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "title"
                          : "arabic_title",
                      valueField: "his_d_title_id",
                      data: this.props.titles
                    },
                    onChange: null,
                    others: {
                      tabIndex: "2"
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Amount",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "full_name",
                    value: this.state.full_name,
                    events: {
                      onChange: null
                    },
                    others: {
                      tabIndex: "2"
                    }
                  }}
                />
              </div>
              <div className="row paddin-bottom-5">
                <div className="col">Tables Come Here</div>
              </div>
            </div>
            <div className="col-lg-12 secondary-details">
              <hr />
              <div className="row paddin-bottom-5">
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Gross Salary"
                    }}
                  />
                  <h6>0.00</h6>
                </div>{" "}
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Earning"
                    }}
                  />
                  <h6>0.00</h6>
                </div>{" "}
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Deduction"
                    }}
                  />
                  <h6>0.00</h6>
                </div>{" "}
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Emp. Contribution"
                    }}
                  />
                  <h6>0.00</h6>
                </div>{" "}
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Net Salary"
                    }}
                  />
                  <h6>0.00</h6>
                </div>
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Perks"
                    }}
                  />
                  <h6>0.00</h6>
                </div>{" "}
              </div>
              <div className="row paddin-bottom-5">
                <div className="col-10" />
                <div className="col-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Cost to Company"
                    }}
                  />
                  <h6>0.00</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PayRollDetails;
