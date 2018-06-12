import React, { PureComponent } from "react";
import "./PatientForm.css";
import Dropzone from "react-dropzone";
import {
  getTitles,
  getCountries,
  getNationalities,
  getIDTypes,
  getRelegion,
  getCities,
  getStates,
  getVisatypes
} from "../../../../actions/masterActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import extend from "extend";
import {
  texthandle,
  titlehandle,
  calculateAge,
  setAge,
  numberSet,
  onDrop
} from "./AddPatientDetails.js";
import { createStore } from "redux";
import { postPatientDetails } from "../../../../actions/RegistrationPatient/Registrationactions.js";
import MyContext from "../../../../utils/MyContext.js";
import PatRegIOputs from "../../../../Models/RegistrationPatient.js";
import AHSnackbar from "../../../common/Inputs/AHSnackbar.js";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehSelector,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import {
  FORMAT_MARTIALSTS,
  FORMAT_GENDER
} from "../../../../utils/GlobalFunctions";

const MobileFormat = "+91 (###)-## #####";

class AddPatientForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      file: {
        filePreview: null,
        filePrimaryPreview: null
        // fileSecPreview: null
      },
      filePreview: null,
      DOBErrorMsg: "",
      DOBError: false,
      DOB: 0,
      CurrentDate: new Date()
    };
    this.widthImg = "";
    this.widthDate = "";
    this.innerContext = {};
  }

  componentWillUpdate(nextProps, nextState) {
    debugger;
    var width = document.getElementById("attach-width").offsetWidth;
    this.widthImg = width + 1;
    // var widthDate = document.getElementById("widthDate").offsetWidth;
    // this.widthDate = widthDate;
  }
  componentWillMount() {
    let InputOutput;

    if (this.props.patients.length > 0) {
      InputOutput = this.props.patients[0];
    } else {
      InputOutput = this.props.PatRegIOputs;
    }
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (this.props.titles.length === 0) {
      this.props.getTitles();
    }
    if (this.props.nationalities.length === 0) {
      this.props.getNationalities();
    }
    if (this.props.idtypes.length === 0) {
      this.props.getIDTypes();
    }

    if (this.props.relegions.length === 0) {
      this.props.getRelegion();
    }

    if (this.props.countries.length === 0) {
      this.props.getCountries();
    }
    if (this.props.countrystates.length === 0) {
      this.props.getStates();
    }
    if (this.props.cities.length === 0) {
      this.props.getCities();
    }
    if (this.props.visatypes.length === 0) {
      this.props.getVisatypes();
    }
  }

  componentWillReceiveProps(nextProps) {
    debugger;
    this.setState(nextProps.PatRegIOputs);

    if (nextProps.patients != null) {
      if (nextProps.patients.length > 0) {
        this.setState(PatRegIOputs.inputParam(nextProps.patients[0]));
      }
    }
  }

  numInput(e) {
    var inputKeyCode = e.keyCode ? e.keyCode : e.which;

    if (inputKeyCode !== null) {
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
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 primary-details">
                    <div className="row primary-box-container">
                      {/* <AlagehAutoComplete classes="" other="" /> */}
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "title_id",
                          isImp: true
                        }}
                        selector={{
                          name: "title_id",
                          className: "select-fld",
                          value: this.state.title_id,
                          dataSource: {
                            textField: "title",
                            valueField: "his_d_title_id",
                            data: this.props.titles
                          },
                          onChange: titlehandle.bind(this, this, context)
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-3" }}
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
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-3" }}
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
                          }
                        }}
                      />

                      {/* <AlagehFormGroup
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "last_name",
                          isImp: true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "last_name",
                          value: this.state.last_name,
                          events: {
                            onChange: texthandle.bind(this, this, context)
                          }
                        }}
                      /> */}
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "gender",
                          isImp: true
                        }}
                        selector={{
                          name: "gender",
                          className: "select-fld",
                          value: this.state.gender,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: FORMAT_GENDER
                          },
                          onChange: texthandle.bind(this, this, context)
                        }}
                      />
                    </div>
                    <div className="row primary-box-container">
                      <AlagehFormGroup
                        div={{ className: "col-lg-1" }}
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
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-1" }}
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
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-1" }}
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
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{
                          className:
                            "col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
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
                            textField: "name",
                            valueField: "value",
                            data: FORMAT_MARTIALSTS
                          },
                          onChange: texthandle.bind(this, this, context)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "religion_id",
                          isImp: false
                        }}
                        selector={{
                          name: "religion_id",
                          className: "select-fld",
                          value: this.state.religion_id,
                          dataSource: {
                            textField: "religion_name",
                            valueField: "hims_d_religion_id",
                            data: this.props.relegions
                          },
                          onChange: texthandle.bind(this, this, context)
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
                            textField: "visa_type",
                            valueField: "hims_d_visa_type_id",
                            data: this.props.visatypes
                          },
                          onChange: texthandle.bind(this, this, context)
                        }}
                      />
                    </div>

                    <div className="row primary-box-container">
                      <AlagehFormGroup
                        div={{ className: "col-lg-3", id: "widthDate" }}
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
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "nationality_id",
                          isImp: true
                        }}
                        selector={{
                          name: "nationality_id",
                          className: "select-fld",
                          value: this.state.nationality_id,
                          dataSource: {
                            textField: "nationality",
                            valueField: "hims_d_nationality_id",
                            data: this.props.nationalities
                          },
                          onChange: texthandle.bind(this, this, context)
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "address1"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "address1",
                          value: this.state.address1,
                          events: {
                            onChange: texthandle.bind(this, this, context)
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "address2"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "address2",
                          value: this.state.address2,
                          events: {
                            onChange: texthandle.bind(this, this, context)
                          }
                        }}
                      />
                    </div>
                    <div className="row primary-box-container">
                      <AlagehFormGroup
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "postal_code"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "postal_code",
                          value: this.state.postal_code,
                          events: {
                            onChange: texthandle.bind(this, this, context)
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "country_id",
                          isImp: true
                        }}
                        selector={{
                          name: "country_id",
                          className: "select-fld",
                          value: this.state.country_id,
                          dataSource: {
                            textField: "country_name",
                            valueField: "hims_d_country_id",
                            data: this.props.countries
                          },
                          onChange: texthandle.bind(this, this, context)
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
                            textField: "state_name",
                            valueField: "hims_d_state_id",
                            data: this.props.countrystates
                          },
                          onChange: texthandle.bind(this, this, context)
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
                            textField: "city_name",
                            valueField: "hims_d_city_id",
                            data: this.props.cities
                          },
                          onChange: texthandle.bind(this, this, context)
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 secondary-details">
                    <div className="row secondary-box-container">
                      <AlgaehDateHandler
                        style={{ borderBottom: "1px solid #2020" }}
                        div={{ className: "col-lg-6" }}
                        label={{ fieldName: "date_of_birth", isImp: true }}
                        textBox={{ className: "txt-fld" }}
                        maxDate={new Date()}
                        events={{
                          onChange: calculateAge.bind(this, this, context)
                        }}
                        value={this.state.date_of_birth}
                      />

                      <AlgaehDateHandler
                        div={{ className: "col-lg-6" }}
                        label={{ fieldName: "hijiri_date", isImp: true }}
                        textBox={{ className: "txt-fld" }}
                        maxDate={this.state.CurrentDate}
                        // events={{onChange: AddPatientHandlers(this,context).CalculateAge.bind(this)}}
                        value={this.state.hijiri_date}
                      />
                      {/* <div className="col-xs-6 col-sm-6 col-AddPatientHandlersmd-6 col-lg-6 col-xl-6">
                        <AlgaehLabelAddPatientHandlers
                          label={{AddPatientHandlers
                            fieldName: "hijiri_date",AddPatientHandlers
                            isImp: false,                            
                          }}
                        />
                        <br />
                        <TextField
                          id="date"
                          type="date"
                          onChange={AddPatientHandlers(this,context).CalculateAge.bind(this)}
                          className="text_field"
                          value={this.state.date_of_birth}
                        />
                      </div> */}
                    </div>

                    <div className="row secondary-box-container">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-6" }}
                        label={{
                          fieldName: "primary_identity_id",
                          isImp: true
                        }}
                        selector={{
                          name: "primary_identity_id",
                          className: "select-fld",
                          value: this.state.primary_identity_id,
                          dataSource: {
                            textField: "identity_document_name",
                            valueField: "hims_d_identity_document_id",
                            data: this.props.idtypes
                          },
                          onChange: texthandle.bind(this, this, context)
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-6" }}
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
                          }
                        }}
                      />
                    </div>
                    {/* <div className="row secondary-box-container">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-6" }}
                        label={{
                          fieldName: "secondary_identity_id",
                          isImp: false
                        }}
                        selector={{
                          name: "secondary_identity_id",
                          className: "select-fld",
                          value: this.state.secondary_identity_id,
                          dataSource: {
                            textField: "identity_document_name",
                            valueField: "hims_d_identity_document_id",
                            data: this.props.idtypes
                          },
                          onChange: texthandle.bind(this, this, context)
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-6" }}
                        label={{
                          fieldName: "secondary_id_no"
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "secondary_id_no",
                          value: this.state.secondary_id_no,
                          events: {
                            onChange: texthandle.bind(this, this, context)
                          }
                        }}
                      />
                    </div> */}
                    <div className="row secondary-box-container">
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
                            <div
                              className="attach-design text-center"
                              id="attach-width"
                            >
                              <AlgaehLabel
                                label={{
                                  fieldName: "attach_photo"
                                }}
                              />
                            </div>
                          </Dropzone>
                        </div>
                        <div>
                          <img
                            className="preview-image"
                            src={this.state.file["filePreview"]}
                            style={{ width: this.widthImg }}
                          />
                        </div>
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
                            <div
                              className="attach-design text-center"
                              id="attach-primary-id"
                            >
                              <AlgaehLabel
                                label={{
                                  fieldName: "attach_idcard"
                                }}
                              />
                            </div>
                          </Dropzone>
                        </div>
                        <div>
                          <img
                            className="preview-image"
                            src={this.state.file["filePrimaryPreview"]}
                            style={{ width: this.widthImg }}
                          />
                        </div>
                      </div>
                      {/* <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                        <div className="image-drop-area">
                          <Dropzone
                            className="dropzone"
                            onDrop={onDrop.bind(this, "fileSecPreview")}
                            id="attach-sec-id"
                            accept="image/*"
                            multiple={false}
                            name="image"
                          >
                            <div
                              className="attach-design text-center"
                              id="attach-sec-id"
                            >
                              ATTACH SEC. ID
                            </div>
                          </Dropzone>
                        </div>
                        <div>
                          <img
                            className="preview-image"
                            src={this.state.file["fileSecPreview"]}
                            style={{ width: this.widthImg, height: "107px" }}
                          />
                        </div>
                      </div> */}
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
    titles: state.titles.titles,
    nationalities: state.nationalities.nationalities,
    idtypes: state.idtypes.idtypes,
    relegions: state.relegions.relegions,
    cities: state.cities.cities,
    countries: state.countries.countries,
    countrystates: state.countrystates.countrystates,
    patients: state.patients.patients,
    visatypes: state.visatypes.visatypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTitles: getTitles,
      getNationalities: getNationalities,
      getIDTypes: getIDTypes,
      getRelegion: getRelegion,
      getCities: getCities,
      getCountries: getCountries,
      getStates: getStates,
      postPatientDetails: postPatientDetails,
      getVisatypes: getVisatypes
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
