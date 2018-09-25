import React, { Component } from "react";
import {
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";

class Scheduler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      from_date: new Date(),
      to_date: new Date(),
      all: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    };
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  changeChecks(e) {
    debugger;
    if (e.target.name === "All") {
      this.setState({
        all: !this.state.all,
        monday: !this.state.monday,
        tuesday: !this.state.tuesday,
        wednesday: !this.state.wednesday,
        thursday: !this.state.thursday,
        friday: !this.state.friday,
        saturday: !this.state.saturday,
        sunday: !this.state.sunday
      });
    } else {
      this.setState({ [e.target.name]: e.target.checked });
    }
  }

  render() {
    return (
      <div className="scheduler">
        <div className="col-lg-12">
          <div className="row">
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Selected Doctors</h3>
                  {/* <h3 className="caption-helper">All Doctors</h3> */}
                </div>
              </div>

              <div className="portlet-body">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-4">
                      <label>Date Range</label>
                      <div className="row">
                        <AlgaehDateHandler
                          div={{ className: "col" }}
                          label={{ forceLabel: "From Date", isImp: true }}
                          textBox={{
                            className: "txt-fld",
                            name: "from_date"
                          }}
                          maxDate={new Date()}
                          events={{
                            onChange: selectedDate => {
                              this.setState({ from_date: selectedDate });
                            }
                          }}
                          value={this.state.from_date}
                        />
                        <AlgaehDateHandler
                          div={{ className: "col" }}
                          label={{ forceLabel: "To Date", isImp: true }}
                          textBox={{
                            className: "txt-fld",
                            name: "to_date"
                          }}
                          maxDate={new Date()}
                          events={{
                            onChange: selectedDate => {
                              this.setState({ to_date: selectedDate });
                            }
                          }}
                          value={this.state.to_date}
                        />
                      </div>
                      <label className="margin-top-15">Day Break 1</label>
                      <div className="row">
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "From Time",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "from_break_hr1",
                            value: this.state.from_break_hr1,
                            events: {
                              onChange: this.changeTexts.bind(this)
                            },
                            others: {
                              type: "time"
                            }
                            // error: this.state.description_error,
                            // helperText: this.state.description_error_text
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "To Time",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "to_break_hr1",
                            value: this.state.to_break_hr1,
                            events: {
                              onChange: this.changeTexts.bind(this)
                            },
                            others: {
                              type: "time"
                            }

                            // error: this.state.description_error,
                            // helperText: this.state.description_error_text
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <label>Working Hours</label>
                      <div className="row">
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "From Time",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "from_time",
                            value: this.state.from_time,
                            events: {
                              onChange: this.changeTexts.bind(this)
                            },
                            others: {
                              type: "time"
                            }

                            // error: this.state.description_error,
                            // helperText: this.state.description_error_text
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "To Time",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "to_time",
                            value: this.state.to_time,
                            events: {
                              onChange: this.changeTexts.bind(this)
                            },
                            others: {
                              type: "time"
                            }

                            // error: this.state.description_error,
                            // helperText: this.state.description_error_text
                          }}
                        />
                      </div>

                      <label className="margin-top-15">Day Break 2</label>
                      <div className="row">
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "From Time",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "from_break_hr2",
                            value: this.state.from_break_hr2,
                            events: {
                              onChange: this.changeTexts.bind(this)
                            },
                            others: {
                              type: "time"
                            }
                            // error: this.state.description_error,
                            // helperText: this.state.description_error_text
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "To Time",
                            isImp: true
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "to_break_hr2",
                            value: this.state.to_break_hr2,
                            events: {
                              onChange: this.changeTexts.bind(this)
                            },
                            others: {
                              type: "time"
                            }
                            // error: this.state.description_error,
                            // helperText: this.state.description_error_text
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <label>Working Days</label>
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="All"
                            checked={this.state.all}
                            onClick={this.changeChecks.bind(this)}
                          />
                          <span>All</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="sunday"
                            checked={this.state.sunday}
                            onClick={this.changeChecks.bind(this)}
                          />
                          <span>Sunday</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="monday"
                            checked={this.state.monday}
                            onClick={this.changeChecks.bind(this)}
                          />
                          <span>Monday</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="tuesday"
                            checked={this.state.tuesday}
                            onClick={this.changeChecks.bind(this)}
                          />
                          <span>Tuesday</span>
                        </label>
                      </div>
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="wednesday"
                            checked={this.state.wednesday}
                            onClick={this.changeChecks.bind(this)}
                          />
                          <span>Wednesday</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="thursday"
                            checked={this.state.thursday}
                            onClick={this.changeChecks.bind(this)}
                          />
                          <span>Thursday</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="friday"
                            checked={this.state.friday}
                            onClick={this.changeChecks.bind(this)}
                          />
                          <span>Friday</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            name="saturday"
                            checked={this.state.saturday}
                            onClick={this.changeChecks.bind(this)}
                          />
                          <span>Saturday</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Scheduler;
