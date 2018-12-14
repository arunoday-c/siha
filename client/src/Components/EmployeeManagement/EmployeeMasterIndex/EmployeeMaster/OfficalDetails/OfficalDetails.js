import React, { PureComponent } from "react";
import "./OfficalDetails.css";

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
} from "./OfficalDetailsEvent.js";
class OfficalDetails extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-employee-form popRightDiv">
          <div className="row">
            <div className="col-lg-8 primary-details">
              <h6>
                <span>Joining Details</span>
              </h6>
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
                      tabIndex: "6"
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
                    forceLabel: "Employee Type",
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

              <h6>
                <span>Relieving Details</span>
              </h6>

              <div className="row paddin-bottom-5">
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ fieldName: "date_of_leaving" }}
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
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ forceLabel: "Relieving Date" }}
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
                  div={{ className: "col-4" }}
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
              </div>
              <h6>
                <span>Accomodation Details</span>
              </h6>
              <div className="row paddin-bottom-5" />
            </div>
            <div className="col-lg-4 secondary-details">
              <h6>
                <span>Employee Bank Details</span>
              </h6>
              <div className="row paddin-bottom-5" />
              <h6>
                <span>Company Bank Details</span>
              </h6>
              <div className="row paddin-bottom-5" />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default OfficalDetails;
