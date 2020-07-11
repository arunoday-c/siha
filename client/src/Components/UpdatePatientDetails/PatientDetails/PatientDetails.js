import React, { Component } from "react";
import "./PatientDetails.scss";

import { AlgaehActions } from "../../../actions/algaehActions";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  texthandle,
  titlehandle,
  calculateAge,
  setAge,
  countryStatehandle,
  hijriOnChange,
  companyHandle,
} from "./UpdatePatientEvent.js";
import MyContext from "../../../utils/MyContext.js";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
} from "../../Wrapper/algaehWrapper";
import AlgaehHijriDatePicker from "algaeh-react-components/components/datehandler";

import variableJson from "../../../utils/GlobalVariables.json";
import AlgaehFileUploader from "../../Wrapper/algaehFileUpload";
import Enumerable from "linq";
import { MainContext } from "algaeh-react-components/context";

class UpdatePatientForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      DOBErrorMsg: "",
      DOBError: false,
      DOB: 0,
      CurrentDate: new Date(),
      requied_emp_id: null,
      // patientImage: undefined
    };
    this.widthImg = "";
    this.widthDate = "";
    this.innerContext = {};
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.PatRegIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.setState({
      requied_emp_id: userToken.requied_emp_id,
    });

    if (this.props.titles === undefined || this.props.titles.length === 0) {
      this.props.getTitles({
        uri: "/masters/get/title",
        method: "GET",
        redux: {
          type: "TITLE_GET_DATA",
          mappingName: "titles",
        },
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
          mappingName: "nationalities",
        },
      });
    }
    if (this.props.idtypes === undefined || this.props.idtypes.length === 0) {
      this.props.getIDTypes({
        uri: "/identity/get",
        module: "masterSettings",
        data: { identity_status: "A" },
        method: "GET",
        redux: {
          type: "IDTYPE_GET_DATA",
          mappingName: "idtypes",
        },
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
          mappingName: "relegions",
        },
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
          mappingName: "countries",
        },
      });
    }
    if (
      this.props.visatypes === undefined ||
      this.props.visatypes.length === 0
    ) {
      this.props.getVisatypes({
        uri: "/visaType/getVisaMaster",
        module: "masterSettings",
        data: { visa_status: "A" },
        method: "GET",
        redux: {
          type: "VISA_GET_DATA",
          mappingName: "visatypes",
        },
      });
    }

    if (
      this.props.patienttype === undefined ||
      this.props.patienttype.length === 0
    ) {
      this.props.getPatientType({
        uri: "/patientType/getPatientType",
        module: "masterSettings",
        data: { patient_status: "A" },
        method: "GET",
        redux: {
          type: "PATIENT_TYPE_GET_DATA",
          mappingName: "patienttype",
        },
      });
    }

    this.props.getInsuranceProviders({
      uri: "/insurance/getListOfInsuranceProvider",
      module: "insurance",
      method: "GET",
      redux: {
        type: "INSURANCE_PROVIDER_GET_DATA",
        mappingName: "insurarProviders",
      },
    });

    this.getStateCity(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.PatRegIOputs, () => {
      if (this.state.country_id === null) return;
      if (this.state.country_id !== nextProps.country_id) {
        let country = Enumerable.from(this.props.countries)
          .where((w) => w.hims_d_country_id === this.state.country_id)
          .firstOrDefault();
        let states = country !== undefined ? country.states : [];
        if (this.props.countries !== undefined && states.length !== 0) {
          if (nextProps.state_id !== this.state.state_id) {
            let cities = Enumerable.from(states)
              .where((w) => w.hims_d_state_id === this.state.state_id)
              .firstOrDefault();
            if (cities !== undefined) {
              this.setState({
                countrystates: states,
                cities: cities.cities,
                state_id: this.state.state_id,
                city_id: this.state.city_id,
              });
            } else {
              this.setState({
                countrystates: states,
                state_id: this.state.state_id,
              });
            }
          }
        }
      }
    });
  }

  getStateCity(e) {
    if (this.state.country_id === null) return;

    let country = Enumerable.from(this.props.countries)
      .where((w) => w.hims_d_country_id === parseInt(this.state.country_id, 10))
      .firstOrDefault();
    let states = country !== undefined ? country.states : [];
    if (this.props.countries !== undefined && states.length !== 0) {
      let cities = Enumerable.from(states)
        .where((w) => w.hims_d_state_id === parseInt(this.state.state_id, 10))
        .firstOrDefault();
      if (cities !== undefined) {
        this.setState({
          countrystates: states,
          cities: cities.cities,
          state_id: this.state.state_id,
          city_id: this.state.city_id,
        });
      } else {
        this.setState({
          countrystates: states,
          state_id: this.state.state_id,
        });
      }
    }
  }
  imageDetails(context, type) {
    this.setState({ [type]: this[type] });
    if (context !== undefined) {
      context.updateState({ ...this.state, [type]: this[type] });
    }
  }
  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {(context) => (
            <div
              className="hptl-phase1-add-patient-form margin-top-15"
              data-validate="demographicDetails"
            >
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-8 primary-details">
                    <div className="row paddin-bottom-5">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-2 mandatory" }}
                        label={{
                          fieldName: "title_id",
                          isImp: true,
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
                            data: this.props.titles,
                          },
                          onChange: titlehandle.bind(this, this),
                          onClear: () => {
                            this.setState({
                              gender: null,
                              title_id: null,
                              saveEnable: true,
                            });
                          },
                          others: {
                            tabIndex: "1",
                          },
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-4 mandatory" }}
                        label={{
                          fieldName: "full_name",
                          isImp: true,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "full_name",
                          value: this.state.full_name,
                          // events: {
                          //   onChange: texthandle.bind(this, this, context)
                          // },
                          others: {
                            onBlur: texthandle.bind(this, this),
                            tabIndex: "2",
                            placeholder: "Enter Full Name",
                          },
                        }}
                      />

                      <AlagehFormGroup
                        div={{
                          className: "col-lg-4 mandatory arabic-txt-fld",
                        }}
                        label={{
                          fieldName: "arabic_name",
                          isImp: true,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "arabic_name",
                          value: this.state.arabic_name,
                          // events: {
                          //   onChange: texthandle.bind(this, this, context)
                          // },
                          others: {
                            onBlur: texthandle.bind(this, this),
                            tabIndex: "3",
                            placeholder: "أدخل الاسم العربي",
                            id: "arabicName",
                          },
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-2 mandatory" }}
                        label={{
                          fieldName: "gender",
                          isImp: true,
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
                            data: variableJson.FORMAT_GENDER,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            tabIndex: "4",
                          },
                        }}
                      />
                    </div>
                    <div className="row paddin-bottom-5">
                      <AlgaehDateHandler
                        div={{
                          className: "col-lg-3 mandatory",
                          tabIndex: "5",
                        }}
                        label={{ fieldName: "date_of_birth", isImp: true }}
                        textBox={{
                          className: "txt-fld",
                          name: "date_of_birth",
                        }}
                        maxDate={new Date()}
                        events={{
                          onChange: calculateAge.bind(this, this),
                        }}
                        disabled={this.state.existingPatient}
                        value={
                          this.state.date_of_birth !== undefined
                            ? this.state.date_of_birth
                            : null
                        }
                      />

                      <AlgaehHijriDatePicker
                        div={{
                          className: "col-lg-3",
                          tabIndex: "6",
                        }}
                        label={{ forceLabel: "Hijiri Date" }}
                        textBox={{ className: "txt-fld" }}
                        type="hijri"
                        gregorianDate={this.state.date_of_birth}
                        events={{
                          onChange: hijriOnChange.bind(this, this),
                        }}
                      ></AlgaehHijriDatePicker>
                      <AlagehFormGroup
                        div={{
                          className: "col mandatory ageYear",
                          others: {
                            style: { paddingRight: 0 },
                          },
                        }}
                        label={{
                          fieldName: "age",
                          isImp: true,
                        }}
                        textBox={{
                          value: this.state.age,
                          className: "txt-fld",
                          name: "age",
                          number: {
                            thousandSeparator: ",",
                          },
                          dontAllowKeys: ["-", "e", "."],
                          events: {
                            onChange: setAge.bind(this, this),
                          },
                          others: {
                            tabIndex: "7",
                          },
                        }}
                      />

                      <AlagehFormGroup
                        div={{
                          className: "col mandatory  ageMonth",
                          others: {
                            style: { paddingLeft: 5, paddingRight: 5 },
                          },
                        }}
                        label={{
                          forceLabel: ".",
                          // isImp: true,
                        }}
                        textBox={{
                          value: this.state.AGEMM,
                          className: "txt-fld",
                          name: "AGEMM",
                          number: {
                            thousandSeparator: ",",
                          },
                          dontAllowKeys: ["-", "e", "."],
                          events: {
                            onChange: setAge.bind(this, this),
                          },
                          others: {
                            tabIndex: "8",
                          },
                        }}
                      />

                      <AlagehFormGroup
                        div={{
                          className: "col mandatory   ageDay",
                          others: {
                            style: { paddingLeft: 0 },
                          },
                        }}
                        label={{
                          forceLabel: ".",
                          // isImp: true,
                        }}
                        textBox={{
                          value: this.state.AGEDD,
                          className: "txt-fld",
                          name: "AGEDD",
                          number: {
                            thousandSeparator: ",",
                          },
                          dontAllowKeys: ["-", "e", "."],
                          events: {
                            onChange: setAge.bind(this, this),
                          },
                          others: {
                            tabIndex: "9",
                          },
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-3 mandatory" }}
                        label={{
                          fieldName: "contact_number",
                          isImp: true,
                        }}
                        textBox={{
                          value: this.state.contact_number,
                          className: "txt-fld",
                          name: "contact_number",
                          number: {
                            allowNegative: false,
                          },
                          events: {
                            onChange: texthandle.bind(this, this),
                          },
                          dontAllowKeys: ["-", "e", "."],
                          others: {
                            onBlur: texthandle.bind(this, this),
                            tabIndex: "10",
                            placeholder: "(+01)123-456-7890",
                            type: "number",
                          },
                        }}
                      />
                    </div>
                    <div className="row paddin-bottom-5">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3 mandatory" }}
                        label={{
                          fieldName: "patient_type",
                          isImp: true,
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
                            data: this.props.patienttype,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            tabIndex: "11",
                          },
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3 mandatory" }}
                        label={{
                          fieldName: "country_id",
                          isImp: true,
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
                            data: this.props.countries,
                          },
                          onChange: countryStatehandle.bind(this, this),
                          others: {
                            tabIndex: "12",
                          },
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3 mandatory" }}
                        label={{
                          fieldName: "nationality_id",
                          isImp: true,
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
                            data: this.props.nationalities,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            tabIndex: "13",
                          },
                        }}
                      />
                      {this.state.requied_emp_id === "Y" ? (
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group mandatory" }}
                          label={{
                            fieldName: "employee_id",
                            isImp: true,
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "employee_id",
                            value: this.state.employee_id,
                            events: {
                              onChange: texthandle.bind(this, this),
                            },
                            others: {
                              type: "text",
                              tabIndex: "14",
                            },
                          }}
                        />
                      ) : null}
                    </div>
                    <div className="row paddin-bottom-5">
                      <AlagehAutoComplete
                        div={{
                          className: "col-lg-3",
                        }}
                        label={{
                          fieldName: "marital_status",
                          isImp: false,
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
                            data: variableJson.FORMAT_MARTIALSTS,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            tabIndex: "17",
                          },
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "religion_id",
                          isImp: false,
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
                            data: this.props.relegions,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            tabIndex: "18",
                          },
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "visa_type_id",
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
                            data: this.props.visatypes,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            tabIndex: "19",
                          },
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "state_id",
                          isImp: false,
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
                            data: this.state.countrystates,
                          },
                          onChange: countryStatehandle.bind(this, this),
                          others: {
                            tabIndex: "20",
                          },
                        }}
                      />
                    </div>

                    <div className="row paddin-bottom-5">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "city_id",
                          isImp: false,
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
                            data: this.state.cities,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            tabIndex: "21",
                          },
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-lg-6" }}
                        label={{
                          fieldName: "address1",
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "address1",
                          value: this.state.address1,
                          events: {
                            onChange: texthandle.bind(this, this),
                          },
                          others: {
                            onBlur: texthandle.bind(this, this),
                            placeholder: "Enter Full Address 1",
                            tabIndex: "22",
                          },
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{ isImp: false, forceLabel: "Company Name" }}
                        selector={{
                          name: "hims_d_insurance_provider_id",
                          className: "select-fld",
                          value: this.state.hims_d_insurance_provider_id,
                          dataSource: {
                            textField: "insurance_provider_name",
                            valueField: "hims_d_insurance_provider_id",
                            data: this.props.insurarProviders,
                          },
                          onChange: companyHandle.bind(this, this, context),
                          onClear: () => {
                            this.setState({
                              hims_d_insurance_provider_id: null,
                            });
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 secondary-details">
                    <div
                      className="row secondary-box-container"
                      style={{ paddingTop: "5px" }}
                    >
                      <div className="col-lg-5 patientRegImg">
                        <AlgaehFileUploader
                          ref={(patientImage) => {
                            this.patientImage = patientImage;
                          }}
                          name="patientImage"
                          accept="image/*"
                          textAltMessage="Patient Image"
                          serviceParameters={{
                            uniqueID: this.state.patient_code,
                            //   destinationName: this.state.patient_code,
                            fileType: "Patients",
                            processDelay: this.imageDetails.bind(
                              this,
                              context,
                              "patientImage"
                            ),
                          }}
                          renderPrevState={this.state.patientImage}
                          forceRefresh={this.state.forceRefresh}
                        />
                      </div>
                      <div className="col-lg-7 patientRegId">
                        <AlgaehFileUploader
                          ref={(patientIdCard) => {
                            this.patientIdCard = patientIdCard;
                          }}
                          noImage="ID-card"
                          name="patientIdCard"
                          accept="image/*"
                          textAltMessage="ID Card"
                          serviceParameters={{
                            uniqueID: this.state.primary_id_no,
                            //   destinationName: this.state.patient_code,
                            fileType: "Patients",
                            processDelay: this.imageDetails.bind(
                              this,
                              context,
                              "patientIdCard"
                            ),
                          }}
                          renderPrevState={this.state.patientIdCard}
                          forceRefresh={this.state.forceRefresh}
                        />

                        <div />
                      </div>
                    </div>

                    <div
                      className="row secondary-box-container"
                      style={{ paddingTop: "10px" }}
                    >
                      <AlagehAutoComplete
                        div={{ className: "col-lg-5 mandatory" }}
                        label={{
                          fieldName: "primary_identity_id",
                          isImp: true,
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
                            data: this.props.idtypes,
                          },
                          onChange: texthandle.bind(this, this),
                          others: {
                            tabIndex: "15",
                          },
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-7 mandatory" }}
                        label={{
                          fieldName: "primary_id_no",
                          isImp: true,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "primary_id_no",
                          value: this.state.primary_id_no,
                          events: {
                            onChange: texthandle.bind(this, this),
                          },
                          others: {
                            onBlur: texthandle.bind(this, this),
                            tabIndex: "16",
                            placeholder: "Enter ID Number",
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="row" style={{ paddingBottom: "10px" }}>
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "secondary_contact_number",
                    }}
                    textBox={{
                      value: this.state.secondary_contact_number,
                      className: "txt-fld",
                      name: "secondary_contact_number",
                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        placeholder: "(+01)123-456-7890",
                        type: "number",
                      },
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "emergency_contact_number",
                    }}
                    textBox={{
                      value: this.state.emergency_contact_number,
                      className: "txt-fld",
                      name: "emergency_contact_number",
                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        placeholder: "(+01)123-456-7890",
                        type: "number",
                      },
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "emergency_contact_name",
                    }}
                    textBox={{
                      value: this.state.emergency_contact_name,
                      className: "txt-fld",
                      name: "emergency_contact_name",
                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        disabled: this.state.existingPatient,
                      },
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "relationship_with_patient",
                    }}
                    textBox={{
                      value: this.state.relationship_with_patient,
                      className: "txt-fld",
                      name: "relationship_with_patient",
                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        disabled: this.state.existingPatient,
                      },
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "email",
                    }}
                    textBox={{
                      value: this.state.email,
                      className: "txt-fld",
                      name: "email",
                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        placeholder: "Enter Email Address",
                        type: "email",
                      },
                    }}
                  />
                </div>
                <div className="row" style={{ paddingBottom: "10px" }}>
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "postal_code",
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "postal_code",
                      value: this.state.postal_code,
                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "address2",
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "address2",
                      value: this.state.address2,
                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        placeholder: "Enter Full Address 2",
                      },
                    }}
                  />
                </div>
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
    nationalities: state.nationalities,
    idtypes: state.idtypes,
    relegions: state.relegions,
    cities: state.cities,
    countries: state.countries,
    countrystates: state.countrystates,
    patients: state.patients,
    visatypes: state.visatypes,
    patienttype: state.patienttype,
    hospitaldetails: state.hospitaldetails,
    insurarProviders: state.insurarProviders,
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
      getPatientType: AlgaehActions,
      getHospitalDetails: AlgaehActions,
      getInsuranceProviders: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UpdatePatientForm)
);
