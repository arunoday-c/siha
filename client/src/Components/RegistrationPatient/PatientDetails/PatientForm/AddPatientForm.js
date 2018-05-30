import React, { Component } from "react";
import SelectFieldDrop from "../../../common/Inputs/SelectField.js";
import TextField from "material-ui/TextField";
import  "./PatientForm.css";
import Dropzone from "react-dropzone";
import { getTitles } from "../../../../actions/Masters/Title.js";
import { getCountries } from "../../../../actions/Masters/Country.js";
import { getNationalities } from "../../../../actions/Masters/Nationality.js";
import { getIDTypes } from "../../../../actions/CommonSetup/IDType.js";
import { getRelegion } from "../../../../actions/Masters/Relegion.js";
import { getCities } from "../../../../actions/Masters/City.js";
import { getStates } from "../../../../actions/Masters/State.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SelectFiledData } from "../../../../utils/algaehApiCall.js";
import extend from "extend";
import { AddPatientHandlers } from "./AddPatientDetails.js";
import { createStore } from "redux";
import { postPatientDetails } from "../../../../actions/RegistrationPatient/Registrationactions.js";
import Button from "material-ui/Button";
import MyContext from "../../../../utils/MyContext.js";
import frontLanguage from "../../Language.json";
import PatRegIOputs from "../../../../Models/RegistrationPatient.js";
import AHSnackbar from "../../../common/Inputs/AHSnackbar.js";

const FORMAT_MARTIALSTS = [
  { name: "Married", value: "Married" },
  { name: "Single", value: "Single" },
  { name: "Divorced", value: "Divorced" },
  { name: "Widowed", value: "Widowed" }
];

const FORMAT_GENDER = [
  { name: "Male", value: "Male" },
  { name: "Female", value: "Female" },
  { name: "Others", value: "Others" }
];

class AddPatientForm extends Component {
  constructor(props) {
    super(props);   
    // debugger; 
    let InputOutput = this.props.PatRegIOputs;

		if(this.props.patients.length > 0){
			InputOutput = PatRegIOputs.inputParam(this.props.patients[0]);
    }
    
    this.state = extend({
        value: "",
        file: {
          filePreview: null,
          filePrimaryPreview: null,
          fileSecPreview: null
        },
        filePreview: null,
        AGEMM: 0,
        AGEDD: 0,
        DOBErrorMsg: "",
        DOBError: false,
        DOB: 0,
        targetLanguage: "English",
      },
      InputOutput
    );
    this.widthImg = "";
    this.widthDate = "";
    this.innerContext = {};    
  }

  componentWillUpdate(nextProps, nextState) {
    var width = document.getElementById("attach-width").offsetWidth;
    this.widthImg = width + 1;
    var widthDate = document.getElementById("widthDate").offsetWidth;
    this.widthDate = widthDate;	
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
    if (this.props.cities.length === 0) {
      this.props.getCities();
    }
    if (this.props.countries.length === 0) {
      this.props.getCountries();
    }
    if (this.props.countrystates.length === 0) {
      this.props.getStates();
    }
    // debugger;
    // if(this.props.patients.length > 0){
		// 	this.setState(PatRegIOputs.inputParam(this.props.patients[0]));
    // }
  }

  componentWillReceiveProps(nextProps){    
    if(nextProps.patients.length >0 )
    {
      this.setState(PatRegIOputs.inputParam(nextProps.patients[0]));
    }		  
  }
  
  numInput(e) {
    // debugger;     
    var inputKeyCode = e.keyCode ? e.keyCode : e.which;
    console.log("Show my data-", inputKeyCode);
    if (inputKeyCode !== null) {
        if (inputKeyCode >= 48 && inputKeyCode <= 57)
        {
          
        }
        else{
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
                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          {this.state.targetLanguage == "English"
                          ? frontLanguage.title_id.english
                          : frontLanguage.title_id.target}<mark>*</mark>
                        </label>
                        <br />
                        <SelectFieldDrop
                          children={SelectFiledData({
                            textField: "title",
                            valueField: "his_d_title_id",
                            payload: this.props.titles
                          })}
                          selected={AddPatientHandlers(this, context).titlehandle.bind(this)}
                          displayValue={this.state.title_id}
                          width="100%"
                        />
                      </div>
                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          {this.state.targetLanguage == "English"
                          ? frontLanguage.first_name.english
                          : frontLanguage.first_name.target}<mark>*</mark>
                        </label>
                        <br />
                        <TextField
                          className="text_field"
                          name="first_name"
                          onChange={AddPatientHandlers(this, context).texthandle.bind(this) }						  
                          value={this.state.first_name}
                          ref = {(value)=>{this.first_name=value}}                          
                        />
                      </div>
                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          MIDDLE NAME<mark>*</mark>
                        </label>
                        <br />
                        <TextField
                          className="text_field"
                          name="middle_name"
                          onChange={AddPatientHandlers(this, context).texthandle.bind(
                            this
                          )}
                          value={this.state.middle_name}
                        />
                      </div>
                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          LAST NAME<mark>*</mark>
                        </label>
                        <br />
                        <TextField
                          className="text_field"
                          name="last_name"
                          onChange={AddPatientHandlers(this, context).texthandle.bind(
                            this
                          )}
                          value={this.state.last_name}
                        />
                      </div>
                    </div>
                    <div className="row primary-box-container">
                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          GENDER<mark>*</mark>
                        </label>
                        <br />
                        <SelectFieldDrop
                          children={FORMAT_GENDER}
                          selected={AddPatientHandlers(this, context).genderhandle.bind(
                            this
                          )}
                          displayValue={this.state.gender}
                          width="180px"
                        />
                      </div>

                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 row">
                        <div
                          className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                          id="widthDate"
                        >
                          <label>
                            AGE<mark>*</mark>
                          </label>
                          <br />
                          <TextField
                            className="text_field centerAlign"
                            placeholder="YYYY"
                            value={this.state.age}
                            style={{ width: "100%" }}
                            name="age"
                            onChange={AddPatientHandlers(this, context).SetAge.bind(
                              this
                            )}
                            onKeyPress={this.numInput.bind(this)}
                            // type="number"
                          />
                        </div>
                        <div
                          className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                          id="widthDate"
                          style={{ position: "relative", top: "29px" }}
                        >
                          <TextField
                            className="text_field centerAlign"
                            placeholder="MM"
                            value={this.state.AGEMM}
                            style={{ width: "100%" }}
                            name="AGEMM"
                            onChange={AddPatientHandlers(this, context).SetAge.bind(
                              this
                            )}
                            onKeyPress={this.numInput.bind(this)}
                            // type="number"
                          />
                        </div>
                        <div
                          className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                          id="widthDate"
                          style={{ position: "relative", top: "29px" }}
                        >
                          <TextField
                            className="text_field centerAlign"
                            placeholder="DD"
                            value={this.state.AGEDD}
                            style={{ width: "100%" }}
                            name="AGEDD"
                            onChange={AddPatientHandlers(this, context).SetAge.bind(
                              this
                            )}
                            onKeyPress={this.numInput.bind(this)}
                            // type="number"
                          />
                        </div>
                      </div>

                      <div
                        className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        style={{ position: "relative", left: "29px" }}
                      >
                        <label>
                          MARTIAL STATUS<mark>*</mark>
                        </label>
                        <br />
                        <SelectFieldDrop
                          children={FORMAT_MARTIALSTS}
                          selected={AddPatientHandlers(this, context).martialhandle.bind(
                            this
                          )}
                          displayValue={this.state.marital_status}
                          width="180px"
                        />
                      </div>

                      <div
                        className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3"
                        style={{ position: "relative", left: "29px" }}
                      >
                        <label>
                          RELIGION<mark>*</mark>
                        </label>
                        <br />
                        <SelectFieldDrop
                          children={SelectFiledData({
                            textField: "religion_name",
                            valueField: "hims_d_religion_id",
                            payload: this.props.relegions
                          })}
                          selected={AddPatientHandlers(this, context).relegionshandle.bind(this)}
                          displayValue={this.state.religion_id}
                          width="180px"
                        />
                      </div>
                    </div>
                    <div className="row primary-box-container">
                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          MOBILE NUMBER<mark>*</mark>
                        </label>
                        <br />
                        <TextField
                          className="text_field"
                          name="contact_number"
                          onChange={AddPatientHandlers(this, context).texthandle.bind(
                            this
                          )}
                          value={this.state.contact_number}
                          onKeyPress={this.numInput.bind(this)}                          
                        />
                      </div>
                      
                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          NATIONALITY<mark>*</mark>
                        </label>
                        <br />
                        <SelectFieldDrop
                          children={SelectFiledData({
                            textField: "nationality",
                            valueField: "hims_d_nationality_id",
                            payload: this.props.nationalities
                          })}
                          selected={AddPatientHandlers(this, context).nationalityhandle.bind(this)}
                          displayValue={this.state.nationality_id}
                          width="180px"
                        />
                      </div>

                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          ADDRESS1<mark>*</mark>
                        </label>
                        <br />
                        <TextField
                          className="text_field"
                          name="address1"
                          onChange={AddPatientHandlers(this, context).texthandle.bind(
                            this
                          )}
                          value={this.state.address1}
                        />
                      </div>

                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          ADDRESS2<mark>*</mark>
                        </label>
                        <br />
                        <TextField
                          className="text_field"
                          name="address2"
                          onChange={AddPatientHandlers(this, context).texthandle.bind(
                            this
                          )}
                          value={this.state.address2}
                        />
                      </div>
                    </div>
                    <div className="row primary-box-container">                    
                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          POSTAL CODE<mark>*</mark>
                        </label>
                        <br />
                        <TextField
                          className="text_field"
                          name="postal_code"
                          onChange={AddPatientHandlers(this, context).texthandle.bind(
                            this
                          )}
                          value={this.state.postal_code}
                        />
                      </div>
                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          COUNTRY<mark>*</mark>
                        </label>
                        <br />
                        <SelectFieldDrop
                          children={SelectFiledData({
                            textField: "country_name",
                            valueField: "hims_d_country_id",
                            payload: this.props.countries,
                            selectedFiled: this.state.titlelist
                          })}
                          selected={AddPatientHandlers(this, context).countrieshandle.bind(this)}
                          displayValue={this.state.country_id}
                          width="100%"
                        />
                      </div>

                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          STATE<mark>*</mark>
                        </label>
                        <br />
                        <SelectFieldDrop
                          children={SelectFiledData({
                            textField: "state_name",
                            valueField: "hims_d_state_id",
                            payload: this.props.countrystates,
                            selectedFiled: this.state.titlelist
                          })}
                          selected={AddPatientHandlers(this, context).statehandle.bind(
                            this
                          )}
                          displayValue={this.state.state_id}
                          width="100%"
                        />
                      </div>

                      <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                        <label>
                          CITY<mark>*</mark>
                        </label>
                        <br />
                        <SelectFieldDrop
                          children={SelectFiledData({
                            textField: "city_name",
                            valueField: "hims_d_city_id",
                            payload: this.props.cities,
                            selectedFiled: this.state.titlelist
                          })}
                          selected={AddPatientHandlers(this, context).cityhandle.bind(
                            this
                          )}
                          displayValue={this.state.city_id}
                          width="100%"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 secondary-details">
                    <div className="row secondary-box-container">
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <label>
                          DATE OF BIRTH<mark>*</mark>
                        </label>
                        <br />
                        <TextField
                          id="date"
                          type="date"
                          onChange={AddPatientHandlers(this, context).CalculateAge.bind(
                            this
                          )}
                          className="text_field"
                          value={this.state.date_of_birth}                          
                        />
                      </div>

                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <label>
                          HIJIRI DATE<mark>*</mark>
                        </label>
                        <br />
                        <TextField
                          id="date"
                          type="date"
                          onChange={AddPatientHandlers(this, context).CalculateAge.bind(
                            this
                          )}
                          className="text_field"
                          value={this.state.date_of_birth}
                          // error={this.state.DOBError}
                          // helperText={this.state.DOBErrorMsg}
                        />
                      </div>
                    </div>

                    <div className="row secondary-box-container">
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <label>
                          PRIMARY ID TYPE<mark>*</mark>
                        </label>
                        <br />
                        <SelectFieldDrop
                          children={SelectFiledData({
                            textField: "identity_document_name",
                            valueField: "hims_d_identity_document_id",
                            payload: this.props.idtypes
                          })}
                          selected={AddPatientHandlers(this, context).primaryidhandle.bind(this)}
                          displayValue={this.state.primary_identity_id}
                          width="180px"
                        />
                      </div>
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <label>
                          PRIMARY ID NO<mark>*</mark>
                        </label>
                        <br />
                        <TextField
                          className="text_field"
                          name="primary_id_no"
                          onChange={AddPatientHandlers(this, context).texthandle.bind(
                            this
                          )}
                          value={this.state.primary_id_no}
                        />
                      </div>
                    </div>
                    <div className="row secondary-box-container">
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <label>
                          SEC. ID TYPE<mark>*</mark>
                        </label>
                        <br />
                        <SelectFieldDrop
                          children={SelectFiledData({
                            textField: "identity_document_name",
                            valueField: "hims_d_identity_document_id",
                            payload: this.props.idtypes
                          })}
                          selected={AddPatientHandlers(
                            this
                          ).secondryidhandle.bind(this)}
                          displayValue={this.state.secondary_identity_id}
                          width="180px"
                        />
                      </div>
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <label>
                          SEC. ID NO<mark>*</mark>
                        </label>
                        <br />
                        <TextField
                          className="text_field"
                          name="secondary_id_no"
                          onChange={AddPatientHandlers(this, context).texthandle.bind(
                            this
                          )}
                          value={this.state.secondary_id_no}
                        />
                      </div>
                    </div>
                    <div className="row secondary-box-container">
                      <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                        <div className="image-drop-area">
                          <Dropzone
                            onDrop={AddPatientHandlers(this, context).onDrop.bind(
                              this,
                              "filePreview"
                            )}
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
                              ATTACH PHOTO
                            </div>
                          </Dropzone>
                        </div>
                        <div>
                          <img
                            className="preview-image"
                            src={this.state.file["filePreview"]}
                            style={{ width: this.widthImg, height: "107px" }}
                          />
                        </div>
                      </div>
                      <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                        <div className="image-drop-area">
                          <Dropzone
                            className="dropzone"
                            onDrop={AddPatientHandlers(this, context).onDrop.bind(
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
                              ATTACH PRIM. ID
                            </div>
                          </Dropzone>
                        </div>
                        <div>
                          <img
                            className="preview-image"
                            src={this.state.file["filePrimaryPreview"]}
                            style={{ width: this.widthImg, height: "107px" }}
                          />
                        </div>
                      </div>
                      <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                        <div className="image-drop-area">
                          <Dropzone
                            className="dropzone"
                            onDrop={AddPatientHandlers(this, context).onDrop.bind(
                              this,
                              "fileSecPreview"
                            )}
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <AHSnackbar                
                open={this.state.DOBError}
                handleClose={this.handleClose}
                MandatoryMsg= {this.state.DOBErrorMsg}
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
    patients: state.patients.patients
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
      postPatientDetails: postPatientDetails
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddPatientForm)
);
