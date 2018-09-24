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
      to_date: new Date()
    };
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
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
                    </div>
                    <div className="col-lg-4">
                      <div className="weekDays-selector">
                        <input
                          type="checkbox"
                          id="weekday-all"
                          className="weekday"
                        />
                        <label htmlFor="weekday-all">All Days</label>
                        <input
                          type="checkbox"
                          id="weekday-sun"
                          className="weekday"
                        />
                        <label htmlFor="weekday-sun">Sunday</label>
                        <input
                          type="checkbox"
                          id="weekday-mon"
                          className="weekday"
                        />
                        <label htmlFor="weekday-mon">Monday</label>
                        <input
                          type="checkbox"
                          id="weekday-tue"
                          className="weekday"
                        />
                        <label htmlFor="weekday-tue">Tuesday</label>
                        <input
                          type="checkbox"
                          id="weekday-wed"
                          className="weekday"
                        />
                        <label htmlFor="weekday-wed">Wednesday</label>
                        <input
                          type="checkbox"
                          id="weekday-thu"
                          className="weekday"
                        />
                        <label htmlFor="weekday-thu">Thursday</label>
                        <input
                          type="checkbox"
                          id="weekday-fri"
                          className="weekday"
                        />
                        <label htmlFor="weekday-fri">Friday</label>
                        <input
                          type="checkbox"
                          id="weekday-sat"
                          className="weekday"
                        />
                        <label htmlFor="weekday-sat">Saturday</label>
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
