import React, { PureComponent } from "react";
import "./PatientForm.css";
import Dropzone from "react-dropzone";

import { AlgaehActions } from "../../../../actions/algaehActions";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  texthandle,
  titlehandle,
  calculateAge,
  setAge,
  onDrop,
  countryStatehandle
} from "./AddPatientDetails.js";
import MyContext from "../../../../utils/MyContext.js";
import AHSnackbar from "../../../common/Inputs/AHSnackbar.js";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import variableJson from "../../../../utils/GlobalVariables.json";
import Enumerable from "linq";

class AddPatientForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      // file: {
      //   filePreview: null,
      //   filePrimaryPreview: null
      // },
      filePreview: null,
      filePrimaryPreview: null,

      DOBErrorMsg: "",
      DOBError: false,
      DOB: 0,
      CurrentDate: new Date()
    };
    this.widthImg = "";
    this.widthDate = "";
    this.innerContext = {};
  }

  // componentWillUpdate(nextProps, nextState) {
  //   var width = document.getElementById("attach-width").offsetWidth;
  //   this.widthImg = width + 1;
  // }
  componentWillMount() {
    let InputOutput = this.props.PatRegIOputs;
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
    if (this.props.idtypes === undefined || this.props.idtypes.length === 0) {
      this.props.getIDTypes({
        uri: "/identity/get",
        method: "GET",
        redux: {
          type: "IDTYPE_GET_DATA",
          mappingName: "idtypes"
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
      this.props.visatypes === undefined ||
      this.props.visatypes.length === 0
    ) {
      this.props.getVisatypes({
        uri: "/masters/get/visa",
        method: "GET",
        redux: {
          type: "VISA_GET_DATA",
          mappingName: "visatypes"
        }
      });
    }

    if (
      this.props.patienttype === undefined ||
      this.props.patienttype.length === 0
    ) {
      this.props.getPatientType({
        uri: "/patientType/getPatientType",
        method: "GET",
        redux: {
          type: "PATIENT_TYPE_GET_DATA",
          mappingName: "patienttype"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.PatRegIOputs, () => {
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
              this.setState({
                state_id: this.state.state_id
              });
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

  numInput(e) {
    var inputKeyCode = e.keyCode ? e.keyCode : e.which;

    if (inputKeyCode !== undefined) {
      if (inputKeyCode >= 48 && inputKeyCode <= 57) {
      } else {
        e.preventDefault();
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-patient-form">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-8 primary-details">
                    <div className="row" style={{ paddingBottom: "10px" }}>
                      <AlagehAutoComplete
                        div={{ className: "col-lg-2 mandatory" }}
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
                              this.state.selectedLang == "en"
                                ? "title"
                                : "arabic_title",
                            valueField: "his_d_title_id",
                            data: this.props.titles
                          },
                          onChange: titlehandle.bind(this, this, context),
                          others: {
                            disabled: this.state.existingPatient,
                            tabIndex: "1"
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-4 mandatory" }}
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
                            disabled: this.state.existingPatient,
                            tabIndex: "2"
                          }
                          // error: this.state.open
                          // helperText: this.state.MandatoryMsg
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-4 mandatory" }}
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
                            disabled: this.state.existingPatient,
                            tabIndex: "3"
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-2 mandatory" }}
                        label={{
                          fieldName: "gender",
                          isImp: true
                        }}
                        selector={{
                          name: "gender",
                          className: "select-fld",
                          value: this.state.gender,
                          dataSource: {
                            textField:
                              this.state.selectedLang === "en"
                                ? "name"
                                : "arabic_name",
                            valueField: "value",
                            data: variableJson.FORMAT_GENDER
                          },
                          onChange: texthandle.bind(this, this, context),
                          others: {
                            disabled: this.state.existingPatient,
                            tabIndex: "4"
                          }
                        }}
                      />
                    </div>
                    <div className="row" style={{ paddingBottom: "10px" }}>
                      <AlgaehDateHandler
                        div={{ className: "col-lg-3 mandatory", tabIndex: "5" }}
                        label={{ fieldName: "date_of_birth", isImp: true }}
                        textBox={{ className: "txt-fld" }}
                        maxDate={new Date()}
                        events={{
                          onChange: calculateAge.bind(this, this, context)
                        }}
                        disabled={this.state.existingPatient}
                        value={
                          this.state.date_of_birth !== undefined
                            ? this.state.date_of_birth
                            : null
                        }
                      />

                      <AlgaehDateHandler
                        div={{ className: "col-lg-3 mandatory", tabIndex: "6" }}
                        label={{ fieldName: "hijiri_date", isImp: true }}
                        textBox={{ className: "txt-fld" }}
                        //maxDate={this.state.CurrentDate}
                        disabled={this.state.existingPatient}
                        // events={{onChange: AddPatientHandlers(this,context).CalculateAge.bind(this)}}
                        value={this.state.hijiri_date}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-1 mandatory" }}
                        label={{
                          fieldName: "age",
                          isImp: true
                        }}
                        textBox={{
                          value: this.state.age,
                          className: "txt-fld",
                          name: "age",
                          number: {
                            thousandSeparator: ","
                          },
                          events: {
                            onChange: setAge.bind(this, this, context)
                          },
                          others: {
                            disabled: this.state.existingPatient,
                            tabIndex: "7"
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-1 mandatory" }}
                        label={{
                          fieldName: "AGEMM",
                          forceLabel: "&nbsp;",
                          isImp: false
                        }}
                        textBox={{
                          value: this.state.AGEMM,
                          className: "txt-fld",
                          name: "AGEMM",
                          number: {
                            thousandSeparator: ","
                          },
                          events: {
                            onChange: setAge.bind(this, this, context)
                          },
                          others: {
                            disabled: this.state.existingPatient,
                            tabIndex: "8"
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-1 mandatory" }}
                        label={{
                          fieldName: "AGEDD",
                          forceLabel: "&nbsp;",
                          isImp: false
                        }}
                        textBox={{
                          value: this.state.AGEDD,
                          className: "txt-fld",
                          name: "AGEDD",
                          number: {
                            thousandSeparator: ","
                          },
                          events: {
                            onChange: setAge.bind(this, this, context)
                          },
                          others: {
                            disabled: this.state.existingPatient,
                            tabIndex: "9"
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-3 mandatory" }}
                        label={{
                          fieldName: "contact_number",
                          isImp: true
                        }}
                        textBox={{
                          value: this.state.contact_number,
                          className: "txt-fld",
                          name: "contact_number",

                          events: {
                            onChange: texthandle.bind(this, this, context)
                          },
                          others: {
                            disabled: this.state.existingPatient,
                            tabIndex: "10"
                          }
                        }}
                      />
                    </div>
                    <div className="row" style={{ paddingBottom: "10px" }}>
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3 mandatory" }}
                        label={{
                          fieldName: "nationality_id",
                          isImp: true
                        }}
                        selector={{
                          name: "nationality_id",
                          className: "select-fld",
                          value: this.state.nationality_id,
                          dataSource: {
                            textField:
                              this.state.selectedLang === "en"
                                ? "nationality"
                                : "arabic_nationality",
                            valueField: "hims_d_nationality_id",
                            data: this.props.nationalities
                          },
                          onChange: texthandle.bind(this, this, context),
                          others: {
                            disabled: this.state.existingPatient,
                            tabIndex: "11"
                          }
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3 mandatory" }}
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
                            disabled: this.state.existingPatient,
                            tabIndex: "12"
                          }
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
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
                        div={{ className: "col-lg-3" }}
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

                    <div className="row" style={{ paddingBottom: "10px" }}>
                      <AlagehFormGroup
                        div={{ className: "col-lg-6" }}
                        label={{
                          fieldName: "address1"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "address1",
                          value: this.state.address1,
                          events: {
                            onChange: texthandle.bind(this, this, context)
                          },
                          others: {
                            disabled: this.state.existingPatient
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "patient_type"
                        }}
                        selector={{
                          name: "patient_type",
                          className: "select-fld",
                          value: this.state.patient_type,

                          dataSource: {
                            textField:
                              this.state.selectedLang === "en"
                                ? "patitent_type_desc"
                                : "arabic_patitent_type_desc",
                            valueField: "hims_d_patient_type_id",
                            data: this.props.patienttype
                          },
                          onChange: texthandle.bind(this, this, context),
                          others: {
                            disabled: this.state.existingPatient
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "visa_type_id"
                        }}
                        selector={{
                          name: "visa_type_id",
                          className: "select-fld",
                          value: this.state.visa_type_id,

                          dataSource: {
                            textField:
                              this.state.selectedLang === "en"
                                ? "visa_type"
                                : "arabic_visa_type",
                            valueField: "hims_d_visa_type_id",
                            data: this.props.visatypes
                          },
                          onChange: texthandle.bind(this, this, context),
                          others: {
                            disabled: this.state.existingPatient
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 secondary-details">
                    <div className="row secondary-box-container">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-6 mandatory" }}
                        label={{
                          fieldName: "primary_identity_id",
                          isImp: true
                        }}
                        selector={{
                          name: "primary_identity_id",
                          className: "select-fld",
                          value: this.state.primary_identity_id,
                          dataSource: {
                            textField:
                              this.state.selectedLang === "en"
                                ? "identity_document_name"
                                : "arabic_identity_document_name",
                            valueField: "hims_d_identity_document_id",
                            data: this.props.idtypes
                          },
                          onChange: texthandle.bind(this, this, context),
                          others: {
                            disabled: this.state.existingPatient,
                            tabIndex: "14"
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-6 mandatory" }}
                        label={{
                          fieldName: "primary_id_no",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "primary_id_no",
                          value: this.state.primary_id_no,
                          events: {
                            onChange: texthandle.bind(this, this, context)
                          },
                          others: {
                            disabled: this.state.existingPatient,
                            tabIndex: "15"
                          }
                        }}
                      />
                    </div>
                    <div
                      className="row secondary-box-container"
                      style={{ paddingTop: "5px" }}
                    >
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="image-drop-area">
                          <Dropzone
                            onDrop={onDrop.bind(this, this, "filePreview")}
                            id="attach-width"
                            className="dropzone"
                            accept="image/*"
                            multiple={false}
                            name="image"
                          >
                            <img
                              // className="preview-image"
                              src={this.state.filePreview}
                              style={{ width: "100%", height: "108px" }}
                            />

                            <div className="attach-design text-center">
                              <AlgaehLabel
                                label={{
                                  fieldName: "attach_photo",
                                  align: ""
                                }}
                              />
                            </div>
                          </Dropzone>
                        </div>
                        {/* <div>
                        
                        </div> */}
                      </div>
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="image-drop-area">
                          <Dropzone
                            className="dropzone"
                            onDrop={onDrop.bind(
                              this,
                              this,
                              "filePrimaryPreview"
                            )}
                            id="attach-primary-id"
                            accept="image/*"
                            multiple={false}
                            name="image"
                          >
                            <img
                              //className="preview-image"
                              src={this.state.filePrimaryPreview}
                              style={{ width: "100%", height: "108px" }}
                            />
                            <div className="attach-design text-center">
                              <AlgaehLabel
                                label={{
                                  fieldName: "attach_idcard",
                                  align: ""
                                }}
                              />
                            </div>
                          </Dropzone>
                        </div>
                        <div />
                      </div>
                    </div>

                    <div
                      className="row secondary-box-container"
                      style={{ paddingTop: "10px" }}
                    >
                      <AlagehAutoComplete
                        div={{
                          className: "col-lg-6"
                        }}
                        label={{
                          fieldName: "marital_status",
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
                            data: variableJson.FORMAT_MARTIALSTS
                          },
                          onChange: texthandle.bind(this, this, context),
                          others: {
                            disabled: this.state.existingPatient
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-6" }}
                        label={{
                          fieldName: "religion_id",
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
                          onChange: texthandle.bind(this, this, context),
                          others: {
                            disabled: this.state.existingPatient
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <AHSnackbar
                open={this.state.DOBError}
                // handleClose={this.handleClose}
                MandatoryMsg={this.state.DOBErrorMsg}
              />
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
    nationalities: state.nationalities,
    idtypes: state.idtypes,
    relegions: state.relegions,
    cities: state.cities,
    countries: state.countries,
    countrystates: state.countrystates,
    patients: state.patients,
    visatypes: state.visatypes,
    patienttype: state.patienttype
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTitles: AlgaehActions,
      getNationalities: AlgaehActions,
      getIDTypes: AlgaehActions,
      getRelegion: AlgaehActions,
      getCities: AlgaehActions,
      getCountries: AlgaehActions,
      getStates: AlgaehActions,
      getVisatypes: AlgaehActions,
      getPatientType: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddPatientForm)
);
