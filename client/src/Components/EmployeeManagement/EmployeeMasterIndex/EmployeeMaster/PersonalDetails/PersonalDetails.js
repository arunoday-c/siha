import React, { PureComponent } from "react";
import "./PersonalDetails.css";
import Dropzone from "react-dropzone";
import { AlgaehActions } from "../../../../../actions/algaehActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  texthandle,
  titlehandle,
  onDrop,
  countryStatehandle,
  datehandle,
  isDoctorChange
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
// import DeptUserDetails from "../DeptUserDetails/DeptUserDetails";
// import noImage from "../../../../../assets/images/images.webp";
// import { displayFileFromServer } from "../../../../../utils/GlobalFunctions";
import AlgaehFileUploader from "../../../../Wrapper/algaehFileUpload";
class PersonalDetails extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // Applicable: false,
      percent: 0
    };
  }

  componentWillMount() {
    let InputOutput = this.props.EmpMasterIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
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
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.EmpMasterIOputs, () => {
      if (this.state.country_id === null) return;
      if (this.state.country_id !== nextProps.country_id) {
        let country = Enumerable.from(this.props.countries)
          .where(w => w.hims_d_country_id === this.state.country_id)
          .firstOrDefault();
        let states = country !== undefined ? country.states : [];
        if (this.props.countries !== undefined && states.length !== 0) {
          if (nextProps.state_id !== this.state.state_id) {
            let cities = Enumerable.from(states)
              .where(w => w.hims_d_state_id === this.state.state_id)
              .firstOrDefault();
            if (cities !== undefined) {
              this.setState({
                countrystates: states,
                cities: cities.cities,
                state_id: this.state.state_id,
                city_id: this.state.city_id
              });
            } else {
              this.setState({
                countrystates: states,
                state_id: this.state.state_id
              });
            }
          }
        }
        // if (nextProps.state_id !== this.state.state_id) {
        //   let cities = Enumerable.from(states)
        //     .where(w => w.hims_d_state_id === this.state.state_id)
        //     .firstOrDefault();

        //   this.props.getStates({
        //     redux: {
        //       data: states,
        //       type: "STATE_GET_DATA",
        //       mappingName: "countrystates"
        //     }
        //   });
        //   if (cities !== undefined) {
        //     this.props.getCities({
        //       redux: {
        //         data: cities.cities,
        //         type: "CITY_GET_DATA",
        //         mappingName: "cities"
        //       }
        //     });
        //   }
        // }
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-employee-form popRightDiv">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-10 primary-details">
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
                              onChange: texthandle.bind(this, this, context)
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
                              onChange: texthandle.bind(this, this, context)
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
                              onChange: texthandle.bind(this, this, context)
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
                            onChange: datehandle.bind(this, this, context)
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
                            onChange: texthandle.bind(this, this, context),
                            others: {
                              tabIndex: "5"
                            }
                          }}
                        />
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <h5>
                            <span>Personal Info.</span>
                          </h5>
                          <div className="row paddin-bottom-5">
                            <AlagehFormGroup
                              div={{ className: "col-4" }}
                              label={{
                                fieldName: "contact_no",
                                isImp: false
                              }}
                              textBox={{
                                value: this.state.primary_contact_no,
                                className: "txt-fld",
                                name: "primary_contact_no",

                                events: {
                                  onChange: texthandle.bind(this, this, context)
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
                                  onChange: texthandle.bind(this, this, context)
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
                                onChange: texthandle.bind(this, this, context),
                                others: {
                                  tabIndex: "9"
                                }
                              }}
                            />
                            <AlagehAutoComplete
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "Religion",
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
                                onChange: countryStatehandle.bind(
                                  this,
                                  this,
                                  context
                                ),
                                others: {
                                  tabIndex: "10"
                                }
                              }}
                            />
                            <AlagehAutoComplete
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "Marital Status",
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
                                onChange: countryStatehandle.bind(
                                  this,
                                  this,
                                  context
                                ),
                                others: {
                                  tabIndex: "10"
                                }
                              }}
                            />
                            <AlagehAutoComplete
                              div={{ className: "col-4" }}
                              label={{
                                forceLabel: "Nationality",
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
                                onChange: countryStatehandle.bind(
                                  this,
                                  this,
                                  context
                                ),
                                others: {
                                  tabIndex: "10"
                                }
                              }}
                            />
                          </div>
                        </div>
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
                                onChange: countryStatehandle.bind(
                                  this,
                                  this,
                                  context
                                ),
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
                                  onChange: texthandle.bind(this, this, context)
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
                              events={{
                                onChange: null
                              }}
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
                              events={{
                                onChange: null
                              }}
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
                                onChange: countryStatehandle.bind(
                                  this,
                                  this,
                                  context
                                ),
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
                                onChange: countryStatehandle.bind(
                                  this,
                                  this,
                                  context
                                ),
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
                                onChange: countryStatehandle.bind(
                                  this,
                                  this,
                                  context
                                ),
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
                                  onChange: texthandle.bind(this, this, context)
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
                                name: "address",
                                value: this.state.address,
                                events: {
                                  onChange: texthandle.bind(
                                    this,
                                    this,
                                    context
                                  ),
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
                                onChange: countryStatehandle.bind(
                                  this,
                                  this,
                                  context
                                ),
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
                                name: "state_id",
                                className: "select-fld",
                                value: this.state.state_id,
                                dataSource: {
                                  textField:
                                    this.state.selectedLang === "en"
                                      ? "state_name"
                                      : "arabic_state_name",
                                  valueField: "hims_d_state_id",
                                  data: this.props.countrystates
                                },
                                onChange: countryStatehandle.bind(
                                  this,
                                  this,
                                  context
                                ),
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
                                name: "city_id",
                                className: "select-fld",
                                value: this.state.city_id,
                                dataSource: {
                                  textField:
                                    this.state.selectedLang === "en"
                                      ? "city_name"
                                      : "city_arabic_name",
                                  valueField: "hims_d_city_id",
                                  data: this.props.cities
                                },
                                onChange: texthandle.bind(this, this, context),
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
                                  name="isdoctor"
                                  value="Y"
                                  checked={this.state.Applicable}
                                  onChange={isDoctorChange.bind(
                                    this,
                                    this,
                                    context
                                  )}
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
                                name: "address",
                                value: this.state.address,
                                events: {
                                  onChange: texthandle.bind(
                                    this,
                                    this,
                                    context
                                  ),
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
                                onChange: countryStatehandle.bind(
                                  this,
                                  this,
                                  context
                                ),
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
                                name: "state_id",
                                className: "select-fld",
                                value: this.state.state_id,
                                dataSource: {
                                  textField:
                                    this.state.selectedLang === "en"
                                      ? "state_name"
                                      : "arabic_state_name",
                                  valueField: "hims_d_state_id",
                                  data: this.props.countrystates
                                },
                                onChange: countryStatehandle.bind(
                                  this,
                                  this,
                                  context
                                ),
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
                                name: "city_id",
                                className: "select-fld",
                                value: this.state.city_id,
                                dataSource: {
                                  textField:
                                    this.state.selectedLang === "en"
                                      ? "city_name"
                                      : "city_arabic_name",
                                  valueField: "hims_d_city_id",
                                  data: this.props.cities
                                },
                                onChange: texthandle.bind(this, this, context),
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
                            <AlgaehFileUploader
                              name="attach_photo"
                              accept="image/*"
                              textAltMessage="Empoyee Image"
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
                              value="Y"
                              checked={this.state.Applicable}
                              onChange={isDoctorChange.bind(
                                this,
                                this,
                                context
                              )}
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
                            isImp: true
                          }}
                          textBox={{
                            value: this.state.license_number,
                            className: "txt-fld",
                            name: "license_number",

                            events: {
                              onChange: texthandle.bind(this, this, context)
                            },
                            others: {
                              disabled:
                                this.state.isdoctor === "Y" ? false : true,
                              tabIndex: "6"
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
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    titles: state.titles,
    cities: state.cities,
    countries: state.countries,
    countrystates: state.countrystates,
    patients: state.patients,
    services: state.services,
    designations: state.designations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTitles: AlgaehActions,
      getCities: AlgaehActions,
      getCountries: AlgaehActions,
      getStates: AlgaehActions,
      getServices: AlgaehActions,
      getDesignations: AlgaehActions
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
