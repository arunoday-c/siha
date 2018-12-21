import React, { PureComponent } from "react";
import "./OfficalDetails.css";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../../../Wrapper/algaehWrapper";
import MyContext from "../../../../../utils/MyContext.js";
import variableJson from "../../../../../utils/GlobalVariables.json";
import {
  texthandle,
  titlehandle,
  onDrop,
  countryStatehandle,
  datehandle,
  isDoctorChange,
  accomodationProvided
} from "./OfficalDetailsEvent.js";

class OfficalDetails extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-employee-form popRightDiv">
              <div className="row">
                <div className="col-lg-8 primary-details">
                  <h5>
                    <span>Joining Details</span>
                  </h5>
                  <div className="row paddin-bottom-5">
                    <AlgaehDateHandler
                      div={{ className: "col" }}
                      label={{
                        fieldName: "date_of_joining",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "date_of_joining",
                        others: {
                          tabIndex: "1"
                        }
                      }}
                      maxDate={new Date()}
                      events={{
                        onChange: datehandle.bind(this, this)
                      }}
                      value={this.state.date_of_joining}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Appointemt Type",
                        isImp: true
                      }}
                      selector={{
                        name: "appointment_type",
                        className: "select-fld",
                        value: this.state.appointment_type,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: variableJson.EMP_APPT_TYPE
                        },
                        onChange: texthandle.bind(this, this, context),
                        others: {
                          tabIndex: "2"
                        }
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Employee Type",
                        isImp: true
                      }}
                      selector={{
                        name: "employee_type",
                        className: "select-fld",
                        value: this.state.employee_type,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: variableJson.EMPLOYEE_TYPE
                        },
                        onChange: texthandle.bind(this, this, context),
                        others: {
                          tabIndex: "3"
                        }
                      }}
                    />
                  </div>

                  <h5>
                    <span>Relieving Details</span>
                  </h5>
                  <div className="row paddin-bottom-5">
                    <AlgaehDateHandler
                      div={{ className: "col" }}
                      label={{ forceLabel: "Date of Resignation" }}
                      textBox={{
                        className: "txt-fld",
                        name: "date_of_leaving"
                      }}
                      maxDate={new Date()}
                      events={{
                        onChange: datehandle.bind(this, this)
                      }}
                      value={this.state.date_of_leaving}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Notice Period",
                        isImp: false
                      }}
                      textBox={{
                        value: this.state.primary_contact_no,
                        className: "txt-fld",
                        name: "primary_contact_no",

                        events: {
                          onChange: null
                        },
                        others: {
                          tabIndex: "7",
                          type: "number"
                        }
                      }}
                    />
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Relieving Date"
                        }}
                      />
                      <h6>DD/MM/YYYY</h6>
                    </div>{" "}
                    <AlgaehDateHandler
                      div={{ className: "col" }}
                      label={{ forceLabel: "Date of Exit" }}
                      textBox={{
                        className: "txt-fld",
                        name: "date_of_leaving"
                      }}
                      maxDate={new Date()}
                      events={{
                        onChange: datehandle.bind(this, this)
                      }}
                      value={this.state.date_of_leaving}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Employee Status",
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
                  </div>
                  <h5>
                    <span>Accomodation Details</span>
                  </h5>
                  <div className="row paddin-bottom-5">
                    <div
                      className="col customCheckbox"
                      style={{ border: "none" }}
                    >
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          name="accomadation_provided"
                          value="Y"
                          checked={this.state.accomodation_provided}
                          onChange={accomodationProvided.bind(
                            this,
                            this,
                            context
                          )}
                        />
                        <span>
                          <AlgaehLabel
                            label={{ forceLabel: "Accomodation Provided" }}
                          />
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 secondary-details">
                  <h5>
                    <span>Employee Bank Details</span>
                  </h5>
                  <div className="row paddin-bottom-5">
                    <AlagehFormGroup
                      div={{ className: "col-6" }}
                      label={{
                        forceLabel: "Bank Name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "employee_bank_name",
                        value: this.state.employee_bank_name,
                        events: {
                          onChange: texthandle.bind(this, this, context)
                        },
                        others: {
                          tabIndex: "2"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-6" }}
                      label={{
                        forceLabel: "SWIFT Code",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.employee_bank_ifsc_code,
                        className: "txt-fld",
                        name: "employee_bank_ifsc_code",
                        events: {
                          onChange: texthandle.bind(this, this, context)
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-12" }}
                      label={{
                        forceLabel: "Account No.",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.employee_account_number,
                        className: "txt-fld",
                        name: "employee_account_number",

                        events: {
                          onChange: texthandle.bind(this, this, context)
                        },
                        others: {
                          type: "number"
                        }
                      }}
                    />
                  </div>
                  <h5>
                    <span>Company Bank Details</span>
                  </h5>
                  <div className="row paddin-bottom-5">
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Select a Bank",
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

                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Mode of Payment",
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

export default OfficalDetails;
