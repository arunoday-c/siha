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
import DeptUserDetails from "../DeptUserDetails/DeptUserDetails";
import noImage from "../../../../../assets/images/images.webp";
import { displayFileFromServer } from "../../../../../utils/GlobalFunctions";

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
    this.getImage(this);
  }

  getImage($this, context) {
    displayFileFromServer({
      uri: "/masters/getFile",
      fileType: "Employees",
      destinationName: $this.state.employee_code,
      fileName: $this.state.employee_code,
      resize: { width: 100, height: 100 },
      onFileSuccess: data => {
        $this.setState({ filePreview: data });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.EmpMasterIOputs, () => {
      if (this.state.country_id === null) return;
      if (this.state.country_id !== nextProps.country_id) {
        let country = Enumerable.from(this.props.countries)
          .where(w => w.hims_d_country_id === this.state.country_id)
          .firstOrDefault();
        let states = country !== undefined ? country.states : [];
        if (nextProps.state_id !== this.state.state_id) {
          let cities = Enumerable.from(states)
            .where(w => w.hims_d_state_id === this.state.state_id)
            .firstOrDefault();

          this.props.getStates({
            redux: {
              data: states,
              type: "STATE_GET_DATA",
              mappingName: "countrystates"
            },
            afterSuccess: callback => {
              // this.setState({
              //   state_id: this.state.state_id
              // });
            }
          });
          if (cities !== undefined) {
            this.props.getCities({
              redux: {
                data: cities.cities,
                type: "CITY_GET_DATA",
                mappingName: "cities"
              }
            });
          }
        }
      }
    });
  }

  render() {
    debugger;
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-patient-form">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-10 primary-details">
                    <div className="row paddin-bottom-5">
                      <AlagehFormGroup
                        div={{ className: "col " }}
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
                      <AlagehAutoComplete
                        div={{ className: "col-2 " }}
                        label={{
                          fieldName: "title_id",
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
                          onChange: titlehandle.bind(this, this, context),
                          others: {
                            tabIndex: "2"
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col " }}
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
                            tabIndex: "3"
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col  arabic-txt-fld" }}
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
                            tabIndex: "4"
                          }
                        }}
                      />
                    </div>
                    <div className="row paddin-bottom-5">
                      <AlgaehDateHandler
                        div={{ className: "col-3 ", tabIndex: "5" }}
                        label={{ fieldName: "date_of_birth", isImp: true }}
                        textBox={{
                          className: "txt-fld",
                          name: "date_of_birth"
                        }}
                        maxDate={new Date()}
                        events={{
                          onChange: datehandle.bind(this, this, context)
                        }}
                        value={this.state.date_of_birth}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-2 " }}
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

                      <AlagehFormGroup
                        div={{ className: "col " }}
                        label={{
                          fieldName: "email",
                          isImp: true
                        }}
                        textBox={{
                          value: this.state.email,
                          className: "txt-fld",
                          name: "email",

                          events: {
                            onChange: texthandle.bind(this, this, context)
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col " }}
                        label={{
                          fieldName: "contact_no",
                          isImp: true
                        }}
                        textBox={{
                          value: this.state.primary_contact_no,
                          className: "txt-fld",
                          name: "primary_contact_no",

                          events: {
                            onChange: texthandle.bind(this, this, context)
                          },
                          others: {
                            tabIndex: "7"
                          }
                        }}
                      />
                    </div>
                    <div className="row paddin-bottom-5">
                      <AlagehAutoComplete
                        div={{ className: "col " }}
                        label={{
                          fieldName: "employee_designation_id",
                          isImp: true
                        }}
                        selector={{
                          name: "employee_designation_id",
                          className: "select-fld",
                          value: this.state.employee_designation_id,
                          dataSource: {
                            textField: "designation",
                            // this.state.selectedLang === "en"
                            //   ? "designation"
                            //   : "arabic_country_name",
                            valueField: "hims_d_designation_id",
                            data: this.props.designations
                          },
                          onChange: texthandle.bind(this, this, context),
                          others: {
                            tabIndex: "8"
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col " }}
                        label={{
                          fieldName: "country_id",
                          isImp: true
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
                            tabIndex: "9"
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col" }}
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
                            disabled: this.state.existingPatient
                          }
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col" }}
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
                            disabled: this.state.existingPatient
                          }
                        }}
                      />
                    </div>

                    <div className="row paddin-bottom-5">
                      <AlagehAutoComplete
                        div={{ className: "col" }}
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
                          onChange: texthandle.bind(this, this, context)
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-6" }}
                        label={{
                          fieldName: "address"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "address",
                          value: this.state.address,
                          events: {
                            onChange: texthandle.bind(this, this, context)
                          }
                        }}
                      />
                      <AlgaehDateHandler
                        div={{ className: "col" }}
                        label={{ fieldName: "date_of_leaving" }}
                        textBox={{
                          className: "txt-fld",
                          name: "date_of_leaving"
                        }}
                        maxDate={new Date()}
                        events={{
                          onChange: datehandle.bind(this, this, context)
                        }}
                        value={this.state.date_of_leaving}
                      />
                    </div>
                  </div>

                  <div className="col-lg-2 secondary-details">
                    <div className="row secondary-box-container">
                      <div className="col-12">
                        <div className="row">
                          <AlgaehDateHandler
                            div={{ className: "col" }}
                            label={{
                              fieldName: "date_of_joining",
                              isImp: true
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "date_of_joining"
                            }}
                            maxDate={new Date()}
                            events={{
                              onChange: datehandle.bind(this, this, context)
                            }}
                            value={this.state.date_of_joining}
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div
                          className="image-drop-area"
                          style={{ marginTop: 17, height: 150 }}
                        >
                          <Dropzone
                            onDrop={onDrop.bind(
                              this,
                              this,
                              "filePreview",
                              context
                            )}
                            id="attach-width"
                            className="dropzone"
                            accept="image/*"
                            multiple={false}
                            name="image"
                          >
                            {/* this.state.filePreview
                                  ? this.state.filePreview
                                  : noImage */}
                            <img
                              src={this.state.filePreview}
                              alt="Employee Profile Picture"
                              onError={e => {
                                e.target.src = noImage;
                              }}
                            />

                            <div className="attach-design text-center">
                              <AlgaehLabel
                                label={{
                                  fieldName: "attach_photo",
                                  align: ""
                                }}
                              />
                            </div>
                            <div
                              style={{
                                width: this.state.percent + "%",
                                height: 3,
                                backgroundColor: "#E1AE54"
                              }}
                            />
                            {/* <Line
                              percent={this.state.percent}
                              strokeWidth="1"
                              strokeColor="#2db7f5"
                              strokeLinecap="square"
                            /> */}
                          </Dropzone>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <hr />
                <h6>If user is a Doctor</h6>
                <div className="row secondary-box-container">
                  <div
                    className="col-2 customCheckbox"
                    style={{ marginTop: 23, border: "none" }}
                  >
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="isdoctor"
                        value="Y"
                        checked={this.state.Applicable}
                        onChange={isDoctorChange.bind(this, this, context)}
                      />
                      <span>
                        <AlgaehLabel label={{ fieldName: "isdoctor" }} />
                      </span>
                    </label>
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-3" }}
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
                        disabled: this.state.isdoctor === "Y" ? false : true,
                        tabIndex: "6"
                      }
                    }}
                  />
                </div>
              </div>
              <div className="col">
                <DeptUserDetails EmpMasterIOputs={this.state} />
              </div>
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
