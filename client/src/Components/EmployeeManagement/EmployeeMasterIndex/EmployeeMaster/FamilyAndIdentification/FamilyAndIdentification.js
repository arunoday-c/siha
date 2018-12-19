import React, { PureComponent } from "react";
import "./FamilyAndIdentification.css";

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
} from "./FamilyAndIdentificationEvent.js";
class FamilyAndIdentification extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-employee-form popRightDiv">
          <div className="row">
            <div className="col-12">
              <h5>
                <span>Identification Details</span>
              </h5>
              <div className="row paddin-bottom-5">
                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Id Type",
                    isImp: false
                  }}
                  selector={{
                    name: "country_id",
                    className: "select-fld",
                    value: this.state.country_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "country_name"
                          : "arabic_country_name",
                      valueField: "hims_d_country_id",
                      data: this.props.countries
                    },
                    //onChange: countryStatehandle.bind(this, this, context),
                    others: {
                      // tabIndex: "10"
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Id Number",
                    isImp: false
                  }}
                  textBox={{
                    value: this.state.primary_contact_no,
                    className: "txt-fld",
                    name: "primary_contact_no",

                    events: {
                      //onChange: texthandle.bind(this, this, context)
                    },
                    others: {
                      //   tabIndex: "7",
                      placeholder: "(+01)123-456-7890",
                      type: "number"
                    }
                  }}
                />
                <AlgaehDateHandler
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Issue Date",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "date_of_joining",
                    others: {
                      //  tabIndex: "6"
                    }
                  }}
                  maxDate={new Date()}
                  events={
                    {
                      //onChange: null
                    }
                  }
                  value=""
                />
                <AlgaehDateHandler
                  div={{ className: "col-3" }}
                  label={{
                    forceLabel: "Expiry Date",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "date_of_joining",
                    others: {
                      //  tabIndex: "6"
                    }
                  }}
                  maxDate={new Date()}
                  events={
                    {
                      //onChange: null
                    }
                  }
                  value=""
                />
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: 21 }}
                  >
                    Add
                  </button>
                </div>
                <div className="col-12">Table Comes Here</div>
              </div>
            </div>

            <div className="col-12">
              <h5>
                <span>Family Details</span>
              </h5>
              <div className="row paddin-bottom-5">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Depedent Type",
                    isImp: false
                  }}
                  selector={{
                    name: "country_id",
                    className: "select-fld",
                    value: this.state.country_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "country_name"
                          : "arabic_country_name",
                      valueField: "hims_d_country_id",
                      data: this.props.countries
                    },
                    //onChange: countryStatehandle.bind(this, this, context),
                    others: {
                      // tabIndex: "10"
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Depedent Name",
                    isImp: false
                  }}
                  selector={{
                    name: "country_id",
                    className: "select-fld",
                    value: this.state.country_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "country_name"
                          : "arabic_country_name",
                      valueField: "hims_d_country_id",
                      data: this.props.countries
                    },
                    //onChange: countryStatehandle.bind(this, this, context),
                    others: {
                      // tabIndex: "10"
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "ID Card Type",
                    isImp: false
                  }}
                  selector={{
                    name: "country_id",
                    className: "select-fld",
                    value: this.state.country_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "country_name"
                          : "arabic_country_name",
                      valueField: "hims_d_country_id",
                      data: this.props.countries
                    },
                    //onChange: countryStatehandle.bind(this, this, context),
                    others: {
                      // tabIndex: "10"
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Id Number",
                    isImp: false
                  }}
                  textBox={{
                    value: this.state.primary_contact_no,
                    className: "txt-fld",
                    name: "primary_contact_no",

                    events: {
                      //onChange: texthandle.bind(this, this, context)
                    },
                    others: {
                      //   tabIndex: "7",
                      placeholder: "(+01)123-456-7890",
                      type: "number"
                    }
                  }}
                />
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: 21 }}
                  >
                    Add
                  </button>
                </div>
                <div className="col-12">Table Comes Here</div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default FamilyAndIdentification;
