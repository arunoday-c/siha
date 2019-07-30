import React from "react";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehModalPopUp
} from "../Wrapper/algaehWrapper";
import GlobalVariables from "../../utils/GlobalVariables.json";

export default function ScheduleModal(props) {
  return (
    <AlgaehModalPopUp
      events={{
        onClose: props.handleClose
      }}
      title={props.title}
      openPopup={props.state.openEdit || props.state.openScheduler}
    >
      <div className="popupInner">
        <div className="col-lg-12 divInner">
          <div className="row">
            <div className="col divInnerLeft">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Select Dept.",
                    isImp: true
                  }}
                  selector={{
                    name: "sub_department_id",
                    className: "select-fld",
                    value: props.state.sub_department_id,
                    dataSource: {
                      textField: "sub_department_name",
                      valueField: "sub_dept_id",
                      data: props.state.departments
                    },
                    onChange: props.deptDropDownHandler,
                    others: {
                      disabled: props.state.openEdit
                    }
                  }}
                  error={props.state.department_error}
                  helperText={props.state.department_error_text}
                />
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "sch_desc",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "description",
                    value: props.state.description,
                    events: {
                      onChange: props.changeTexts
                    },
                    error: props.state.description_error,
                    helperText: props.state.description_error_text
                  }}
                />
                {/* <div className="col">
              <input type="checkbox" id="default_slot" />
              <span>Set Default Slot</span>
            </div> */}
              </div>
              <div className="row">
                <div className="col-6">
                  <label className="margin-top-15 bold-text">
                    Scheduled Date
                  </label>
                  <div className="row">
                    <AlgaehDateHandler
                      div={{ className: "col-6" }}
                      label={{ forceLabel: "From Date", isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "from_date"
                      }}
                      events={{
                        onChange: props.changeDate
                      }}
                      value={props.state.from_date}
                      minDate={new Date()}
                      disabled={props.state.openEdit}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col-6" }}
                      label={{ forceLabel: "To Date", isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "to_date"
                      }}
                      events={{
                        onChange: props.changeDate
                      }}
                      value={props.state.to_date}
                      disabled={props.state.openEdit}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label className="margin-top-15 bold-text">
                    Scheduled Time
                  </label>
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "From Time",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "from_work_hr",
                        value: props.state.from_work_hr,
                        events: {
                          onChange: props.changeTexts
                        },
                        others: {
                          type: "time"
                        }
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
                        name: "to_work_hr",
                        value: props.state.to_work_hr,
                        events: {
                          onChange: props.changeTexts
                        },
                        others: {
                          type: "time"
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <label className="margin-top-15 bold-text">Day Break 1</label>
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "From Time"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "from_break_hr1",
                        value: props.state.from_break_hr1,
                        events: {
                          onChange: props.changeTexts
                        },
                        others: {
                          type: "time"
                        }
                        // error: props.state.description_error,
                        // helperText: props.state.description_error_text
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "To Time"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "to_break_hr1",
                        value: props.state.to_break_hr1,
                        events: {
                          onChange: props.changeTexts
                        },
                        others: {
                          type: "time"
                        }

                        // error: props.state.description_error,
                        // helperText: props.state.description_error_text
                      }}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label className="margin-top-15 bold-text">Day Break 2</label>
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "From Time"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "from_break_hr2",
                        value: props.state.from_break_hr2,
                        events: {
                          onChange: props.changeTexts
                        },
                        others: {
                          type: "time"
                        }
                        // error: props.state.description_error,
                        // helperText: props.state.description_error_text
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "To Time"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "to_break_hr2",
                        value: props.state.to_break_hr2,
                        events: {
                          onChange: props.changeTexts
                        },
                        others: {
                          type: "time"
                        }
                        // error: props.state.description_error,
                        // helperText: props.state.description_error_text
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row margin-top-15">
                <div className="col-lg-12">
                  <label className="bold-text">Working Days</label>
                  <div className="customCheckbox">
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="All"
                        checked={props.state.all}
                        onChange={props.changeChecks}
                      />
                      <span>All</span>
                    </label>
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="sunday"
                        checked={props.state.sunday}
                        onChange={props.changeChecks}
                      />
                      <span>Sunday</span>
                    </label>
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="monday"
                        checked={props.state.monday}
                        onChange={props.changeChecks}
                      />
                      <span>Monday</span>
                    </label>
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="tuesday"
                        checked={props.state.tuesday}
                        onChange={props.changeChecks}
                      />
                      <span>Tuesday</span>
                    </label>

                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="wednesday"
                        checked={props.state.wednesday}
                        onChange={props.changeChecks}
                      />
                      <span>Wednesday</span>
                    </label>
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="thursday"
                        checked={props.state.thursday}
                        onChange={props.changeChecks}
                      />
                      <span>Thursday</span>
                    </label>
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="friday"
                        checked={props.state.friday}
                        onChange={props.changeChecks}
                      />
                      <span>Friday</span>
                    </label>
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="saturday"
                        checked={props.state.saturday}
                        onChange={props.changeChecks}
                      />
                      <span>Saturday</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {props.state.openEdit ? null : (
              <div className="col-4 divInnerRight">
                <div className="row">
                  {" "}
                  <AlagehAutoComplete
                    div={{ className: "col-12" }}
                    label={{
                      fieldName: "sel_slot_time",
                      isImp: true
                    }}
                    selector={{
                      name: "slot",
                      className: "select-fld",
                      value: props.state.slot,

                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.SLOTS
                      },
                      onChange: props.dropDownHandler
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col">
                    <label>Doctors</label>
                    <div className="physicianList">
                      <ul>
                        {props.state.doctors.map((data, index) => {
                          return (
                            <li
                              key={index}
                              onClick={e =>
                                e.currentTarget.firstElementChild.firstElementChild.click()
                              }
                            >
                              <span className="checkBoxPhy">
                                <input
                                  checked={data.isDocChecked || false}
                                  value={data.isDocChecked || false}
                                  onChange={() =>
                                    props.checkHandle(data, index)
                                  }
                                  type="checkbox"
                                />
                                <i className="fas fa-check" />
                              </span>
                              <span className="physicianListName">
                                {data.full_name}
                              </span>
                              <span className="physicianListSlot">
                                {/* <AlagehAutoComplete
                                  div={{ className: "col-12" }}
                                  selector={{
                                    name: "slot",
                                    className: "select-fld",
                                    value: "",
                                    dataSource: {
                                      textField: "name",
                                      valueField: "value",
                                      data: ""
                                    },
                                    onChange: ""
                                  }}
                                /> */}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-12 popupFooter">
        <button
          type="button"
          className="btn btn-primary"
          onClick={props.saveApptSchedule}
        >
          {props.state.openEdit ? "UPDATE" : "SAVE"}
        </button>
        <button
          type="button"
          className="btn btn-default"
          onClick={props.handleClose}
        >
          Close
        </button>
      </div>
    </AlgaehModalPopUp>
  );
}
