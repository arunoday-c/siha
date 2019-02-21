import React, { Component } from "react";
import "./PersonalDetails.css";
import { AlgaehActions } from "../../../../../actions/algaehActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  texthandle,
  countryStatehandle,
  datehandle,
  isDoctorChange,
  sameAsPresent
} from "./PersonalDetailsEvents.js";
import MyContext from "../../../../../utils/MyContext.js";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../../../Wrapper/algaehWrapper";
import variableJson from "../../../../../utils/GlobalVariables.json";
import Enumerable from "linq";
import AlgaehFile from "../../../../Wrapper/algaehFileUpload";
import { getCookie } from "../../../../../utils/algaehApiCall";
class PersonalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      samechecked: "N",
      selectedLang: getCookie("Language")
    };
  }

  componentDidMount() {
    let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
    this.setState({ ...this.state, ...InputOutput });
    if (this.props.titles === undefined || this.props.titles.length === 0) {
      this.props.getTitles({
        uri: "/masters/get/title",
        method: "GET",
        redux: {
          type: "TITLE_GET_DATA",
          mappingName: "titles"
        }
      });
    }

    if (
      this.props.countries === undefined ||
      this.props.countries.length === 0
    ) {
      this.props.getCountries({
        uri: "/masters/get/countryStateCity",
        method: "GET",
        redux: {
          type: "CTRY_GET_DATA",
          mappingName: "countries"
        }
      });
    }

    if (
      this.props.relegions === undefined ||
      this.props.relegions.length === 0
    ) {
      this.props.getRelegion({
        uri: "/masters/get/relegion",
        method: "GET",
        redux: {
          type: "RELGE_GET_DATA",
          mappingName: "relegions"
        }
      });
    }

    if (
      this.props.nationalities === undefined ||
      this.props.nationalities.length === 0
    ) {
      this.props.getNationalities({
        uri: "/masters/get/nationality",
        method: "GET",
        redux: {
          type: "NAT_GET_DATA",
          mappingName: "nationalities"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.EmpMasterIOputs.state.personalDetails, () => {});
  }

  render() {
    debugger;
    return (
      <React.Fragment>
        {/* <MyContext.Consumer>
          {context => ( */}
        <div
          className="hptl-phase1-add-employee-form popRightDiv"
          data-validate="empPersonal"
        >
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div
                  className="col-lg-10 primary-details"
                  style={{ height: "70vh" }}
                >
                  <h5>
                    <span>Basic Info.</span>
                  </h5>
                  <div className="row paddin-bottom-5">
                    <AlagehFormGroup
                      div={{ className: "col-2 mandatory" }}
                      label={{
                        fieldName: "employee_code",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "employee_code",
                        value: this.state.employee_code,
                        events: {
                          onChange: texthandle.bind(this, this)
                        },
                        others: {
                          tabIndex: "1"
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col mandatory" }}
                      label={{
                        fieldName: "full_name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "full_name",
                        value: this.state.full_name,
                        events: {
                          onChange: texthandle.bind(this, this)
                        },
                        others: {
                          tabIndex: "2"
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col  arabic-txt-fld mandatory" }}
                      label={{
                        fieldName: "arabic_name",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "arabic_name",
                        value: this.state.arabic_name,
                        events: {
                          onChange: texthandle.bind(this, this)
                        },
                        others: {
                          tabIndex: "3"
                        }
                      }}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col-2 mandatory" }}
                      label={{ fieldName: "date_of_birth", isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "date_of_birth",
                        others: {
                          tabIndex: "4"
                        }
                      }}
                      maxDate={new Date()}
                      events={{
                        onChange: datehandle.bind(this, this)
                      }}
                      value={this.state.date_of_birth}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-2 mandatory" }}
                      label={{
                        fieldName: "gender",
                        isImp: true
                      }}
                      selector={{
                        name: "sex",
                        className: "select-fld",
                        value: this.state.sex,
                        dataSource: {
                          textField:
                            this.state.selectedLang === "en"
                              ? "name"
                              : "arabic_name",
                          valueField: "value",
                          data: variableJson.EMP_FORMAT_GENDER
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          tabIndex: "5"
                        }
                      }}
                    />
                  </div>
                  <h5>
                    <span>Personal Info.</span>
                  </h5>
                  <div className="row paddin-bottom-5">
                    <AlagehFormGroup
                      div={{ className: "col-4 mandatory" }}
                      label={{
                        fieldName: "contact_no",
                        isImp: true
                      }}
                      textBox={{
                        value: this.state.primary_contact_no,
                        className: "txt-fld",
                        name: "primary_contact_no",

                        events: {
                          onChange: texthandle.bind(this, this)
                        },
                        others: {
                          tabIndex: "7",
                          placeholder: "(+01)123-456-7890",
                          type: "number"
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-5" }}
                      label={{
                        fieldName: "email",
                        isImp: false
                      }}
                      textBox={{
                        value: this.state.email,
                        className: "txt-fld",
                        name: "email",

                        events: {
                          onChange: texthandle.bind(this, this)
                        },
                        others: {
                          tabIndex: "8",
                          placeholder: "Enter Email Address",
                          type: "email"
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-3" }}
                      label={{
                        fieldName: "blood_group"
                      }}
                      selector={{
                        name: "blood_group",
                        className: "select-fld",
                        value: this.state.blood_group,

                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: variableJson.FORMAT_BLOOD_GROUP
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          tabIndex: "9"
                        }
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-4 mandatory" }}
                      label={{
                        forceLabel: "Religion",
                        isImp: false
                      }}
                      selector={{
                        name: "religion_id",
                        className: "select-fld",
                        value: this.state.religion_id,
                        dataSource: {
                          textField:
                            this.state.selectedLang === "en"
                              ? "religion_name"
                              : "arabic_religion_name",
                          valueField: "hims_d_religion_id",
                          data: this.props.relegions
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          tabIndex: "10"
                        }
                      }}
                    />
                    <AlagehAutoComplete
                      div={{
                        className: "col-lg-4"
                      }}
                      label={{
                        forceLabel: "Marital Status",
                        isImp: false
                      }}
                      selector={{
                        name: "marital_status",
                        className: "select-fld",
                        value: this.state.marital_status,
                        dataSource: {
                          textField:
                            this.state.selectedLang === "en"
                              ? "name"
                              : "arabic_name",
                          valueField: "value",
                          data: variableJson.FORMAT_MARTIALSTS_EMP
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-lg-3" }}
                      label={{
                        forceLabel: "Nationality",
                        isImp: false
                      }}
                      selector={{
                        name: "nationality",
                        className: "select-fld",
                        value: this.state.nationality,
                        dataSource: {
                          textField:
                            this.state.selectedLang === "en"
                              ? "nationality"
                              : "arabic_nationality",
                          valueField: "hims_d_nationality_id",
                          data: this.props.nationalities
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          //disabled: this.state.existingPatient,
                          //tabIndex: "13"
                        }
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <h5>
                        <span>Present Address</span>
                      </h5>
                      <div className="row paddin-bottom-5">
                        <AlagehFormGroup
                          div={{ className: "col-12" }}
                          label={{
                            fieldName: "address"
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "present_address",
                            value: this.state.present_address,
                            events: {
                              onChange: texthandle.bind(this, this),
                              others: {
                                tabIndex: "11"
                              }
                            }
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-4" }}
                          label={{
                            fieldName: "country_id",
                            isImp: false
                          }}
                          selector={{
                            name: "present_country_id",
                            className: "select-fld",
                            value: this.state.present_country_id,
                            dataSource: {
                              textField:
                                this.state.selectedLang === "en"
                                  ? "country_name"
                                  : "arabic_country_name",
                              valueField: "hims_d_country_id",
                              data: this.props.countries
                            },
                            onChange: countryStatehandle.bind(this, this),
                            others: {
                              tabIndex: "10"
                            }
                          }}
                        />

                        <AlagehAutoComplete
                          div={{ className: "col-4" }}
                          label={{
                            fieldName: "state_id",
                            isImp: false
                          }}
                          selector={{
                            name: "present_state_id",
                            className: "select-fld",
                            value: this.state.present_state_id,
                            dataSource: {
                              textField:
                                this.state.selectedLang === "en"
                                  ? "state_name"
                                  : "arabic_state_name",
                              valueField: "hims_d_state_id",
                              data: this.state.countrystates
                            },
                            onChange: countryStatehandle.bind(this, this),
                            others: {
                              tabIndex: "11",
                              disabled: this.state.existingPatient
                            }
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-4" }}
                          label={{
                            fieldName: "city_id",
                            isImp: false
                          }}
                          selector={{
                            name: "present_city_id",
                            className: "select-fld",
                            value: this.state.present_city_id,
                            dataSource: {
                              textField:
                                this.state.selectedLang === "en"
                                  ? "city_name"
                                  : "city_arabic_name",
                              valueField: "hims_d_city_id",
                              data: this.state.present_cities
                            },
                            onChange: texthandle.bind(this, this),
                            others: {
                              tabIndex: "12",
                              disabled: this.state.existingPatient
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <h5>
                        <span>Permanent Address</span>
                      </h5>
                      <div className="row paddin-bottom-5">
                        <div
                          className="col-4 customCheckbox"
                          style={{ marginTop: 23, border: "none" }}
                        >
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="samechecked"
                              value={this.state.samechecked}
                              checked={
                                this.state.samechecked === "Y" ? true : false
                              }
                              onChange={sameAsPresent.bind(this, this)}
                            />
                            <span>
                              <AlgaehLabel
                                label={{ forceLabel: "Same as Present" }}
                              />
                            </span>
                          </label>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-8" }}
                          label={{
                            fieldName: "address"
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "permanent_address",
                            value:
                              this.state.samechecked === "Y"
                                ? this.state.present_address
                                : this.state.permanent_address,
                            events: {
                              onChange: texthandle.bind(this, this),
                              others: {
                                tabIndex: "11"
                              }
                            }
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-4" }}
                          label={{
                            fieldName: "country_id",
                            isImp: false
                          }}
                          selector={{
                            name: "permanent_country_id",
                            className: "select-fld",
                            value:
                              this.state.samechecked === "Y"
                                ? this.state.present_country_id
                                : this.state.permanent_country_id,
                            dataSource: {
                              textField:
                                this.state.selectedLang === "en"
                                  ? "country_name"
                                  : "arabic_country_name",
                              valueField: "hims_d_country_id",
                              data: this.props.countries
                            },
                            onChange: countryStatehandle.bind(this, this),
                            others: {
                              tabIndex: "10"
                            }
                          }}
                        />

                        <AlagehAutoComplete
                          div={{ className: "col-4" }}
                          label={{
                            fieldName: "state_id",
                            isImp: false
                          }}
                          selector={{
                            name: "permanent_state_id",
                            className: "select-fld",
                            value:
                              this.state.samechecked === "Y"
                                ? this.state.present_state_id
                                : this.state.permanent_state_id,
                            dataSource: {
                              textField:
                                this.state.selectedLang === "en"
                                  ? "state_name"
                                  : "arabic_state_name",
                              valueField: "hims_d_state_id",
                              data:
                                this.state.samechecked === "Y"
                                  ? this.state.countrystates
                                  : this.state.precountrystates
                            },
                            onChange: countryStatehandle.bind(this, this),
                            others: {
                              tabIndex: "11"
                            }
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-4" }}
                          label={{
                            fieldName: "city_id",
                            isImp: false
                          }}
                          selector={{
                            name: "permanent_city_id",
                            className: "select-fld",
                            value:
                              this.state.samechecked === "Y"
                                ? this.state.present_city_id
                                : this.state.permanent_city_id,
                            dataSource: {
                              textField:
                                this.state.selectedLang === "en"
                                  ? "city_name"
                                  : "city_arabic_name",
                              valueField: "hims_d_city_id",
                              data:
                                this.state.samechecked === "Y"
                                  ? this.state.present_cities
                                  : this.state.precities
                            },
                            onChange: texthandle.bind(this, this),
                            others: {
                              tabIndex: "12",
                              disabled: this.state.existingPatient
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-2 secondary-details">
                  <h5>
                    <span>Profile Image</span>
                  </h5>
                  <div className="row secondary-box-container">
                    <div className="col">
                      <div>
                        <AlgaehFile
                          name="attach_photo"
                          accept="image/*"
                          textAltMessage="Empoyee Image"
                          validateBeforeCall={() => {
                            return this.props.EmpMasterIOputs.props
                              .editEmployee;
                          }}
                          serviceParameters={{
                            uniqueID: this.state.employee_code,
                            destinationName: this.state.employee_code,
                            fileType: "Employees"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <h5 style={{ marginTop: 20 }}>
                    <span>If its a Doctor</span>
                  </h5>
                  <div className="row secondary-box-container">
                    <div
                      className="col-12 customCheckbox"
                      style={{ border: "none" }}
                    >
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          name="isdoctor"
                          value={this.state.isdoctor}
                          checked={this.state.isdoctor === "Y" ? true : false}
                          onChange={isDoctorChange.bind(this, this)}
                        />
                        <span>
                          <AlgaehLabel label={{ fieldName: "isdoctor" }} />
                        </span>
                      </label>
                    </div>

                    <AlagehFormGroup
                      div={{ className: "col-12" }}
                      label={{
                        fieldName: "license_number",
                        isImp: this.state.isdoctor === "Y" ? true : false
                      }}
                      textBox={{
                        value: this.state.license_number,
                        className: "txt-fld",
                        name: "license_number",

                        events: {
                          onChange: texthandle.bind(this, this)
                        },
                        others: {
                          disabled: this.state.isdoctor === "Y" ? false : true
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col">
                <DeptUserDetails EmpMasterIOputs={this.state} />
              </div> */}
        </div>
        {/* )}
        </MyContext.Consumer> */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    titles: state.titles,
    cities: state.cities,
    nationalities: state.nationalities,
    countries: state.countries,
    countrystates: state.countrystates,
    present_countrystates: state.present_countrystates,
    present_cities: state.present_cities,
    relegions: state.relegions,
    patients: state.patients,
    services: state.services
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTitles: AlgaehActions,
      getCities: AlgaehActions,
      getCountries: AlgaehActions,
      getNationalities: AlgaehActions,
      getStates: AlgaehActions,
      getServices: AlgaehActions,
      getRelegion: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PersonalDetails)
);
