import React, { Component } from "react";
import "./PersonalDetails.scss";
import { AlgaehActions } from "../../../../../actions/algaehActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  texthandle,
  countryStatehandle,
  datehandle,
  isDoctorChange,
  sameAsPresent,
} from "./PersonalDetailsEvents.js";
// import MyContext from "../../../../../utils/MyContext.js";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
} from "../../../../Wrapper/algaehWrapper";
import variableJson from "../../../../../utils/GlobalVariables.json";
import AlgaehFile from "../../../../Wrapper/algaehFileUpload";
import { getCookie } from "../../../../../utils/algaehApiCall";
import { MainContext } from "algaeh-react-components/context";
import { algaehApiCall } from "../../../../../utils/algaehApiCall";
import { AlgaehFormGroup } from "algaeh-react-components";
// import Enumerable from "linq";

class PersonalDetails extends Component {
  constructor(props) {
    super(props);
    this.initCall();

    this.state = {
      samechecked: "N",
      selectedLang: getCookie("Language"),
      HIMS_Active: false,
    };
  }

  initCall() {
    let that = this;
    algaehApiCall({
      uri: "/init/",
      method: "GET",
      data: {
        fields: "employee_code",
        tableName: "hims_d_employee",
        keyFieldName: "hims_d_employee_id",
      },
      onSuccess: (response) => {
        if (response.data.success === true) {
          const placeHolder =
            response.data.records.length > 0 ? response.data.records[0] : {};
          that.setState({
            employee_code_placeHolder: placeHolder.employee_code,
          });
        }
      },
    });
  }
  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    const HIMS_Active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HIMS_CLINICAL" ||
      userToken.product_type === "NO_FINANCE"
        ? true
        : false;

    let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
    InputOutput.HIMS_Active = HIMS_Active;
    this.setState({ ...this.state, ...InputOutput });
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
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.EmpMasterIOputs.state.personalDetails);
    // this.setState(, () => {});
  }

  imageDetails(type) {
    this.setState({ [type]: this[type] });

    this.props.EmpMasterIOputs.updateEmployeeTabs({
      [type]: this[type],
    });
  }

  render() {
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
                  className="col-lg-10 col-md-10 col-sm-12primary-details"
                  style={{ height: "70vh" }}
                >
                  <h5>
                    <span>Basic Info.</span>
                  </h5>
                  <div className="row paddin-bottom-5">
                    <AlagehFormGroup
                      div={{
                        className: "col-lg-2 col-md-2 col-sm-12 mandatory",
                      }}
                      label={{
                        forceLabel: "Emp. Code",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "employee_code",
                        value: this.state.employee_code,
                        events: {
                          onChange: texthandle.bind(this, this),
                        },

                        others: {
                          tabIndex: "1",
                          placeholder: this.state.employee_code_placeHolder,
                          disabled:
                            this.state.hims_d_employee_id === null
                              ? false
                              : true,
                        },
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-lg-3 col-sm-12 mandatory" }}
                      label={{
                        fieldName: "full_name",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "full_name",
                        value: this.state.full_name,
                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "2",
                        },
                      }}
                      // target={{
                      //   tElement: (text) => {
                      //     const arabic =
                      //       this.state.arabic_name !== undefined
                      //         ? this.state.arabic_name + " " + text
                      //         : text;
                      //     this.setState({ arabic_name: arabic });
                      //   },
                      // }}
                    />

                    <AlagehFormGroup
                      div={{
                        className:
                          "col-lg-3 col-sm-12 arabic-txt-fld mandatory",
                      }}
                      label={{
                        fieldName: "arabic_name",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "arabic_name",
                        value: this.state.arabic_name,
                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "3",
                        },
                      }}
                    />
                    <AlgaehDateHandler
                      div={{
                        className: "col-lg-2 col-md-2 col-sm-12 mandatory",
                      }}
                      label={{ fieldName: "date_of_birth", isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "date_of_birth",
                        others: {
                          tabIndex: "4",
                        },
                      }}
                      maxDate={new Date()}
                      events={{
                        onChange: datehandle.bind(this, this),
                      }}
                      value={this.state.date_of_birth}
                    />
                    <AlagehAutoComplete
                      div={{
                        className: "col-lg-2 col-md-2 col-sm-12 mandatory",
                      }}
                      label={{
                        fieldName: "gender",
                        isImp: true,
                      }}
                      selector={{
                        name: "sex",
                        className: "select-fld",
                        value: this.state.sex,
                        dataSource: {
                          textField: "name",

                          valueField: "value",
                          data: variableJson.EMP_FORMAT_GENDER,
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          tabIndex: "5",
                        },
                        onClear: () => {
                          this.setState({
                            sex: null,
                          });
                          this.props.EmpMasterIOputs.updateEmployeeTabs({
                            sex: null,
                          });
                        },
                      }}
                    />
                  </div>
                  <h5>
                    <span>Personal Info.</span>
                  </h5>
                  <div className="row paddin-bottom-5">
                    <AlagehAutoComplete
                      div={{
                        className:
                          "col-lg-2 col-md-2 col-sm-12 form-group mandatory",
                      }}
                      label={{
                        forceLabel: "Nationality",
                        isImp: true,
                      }}
                      selector={{
                        name: "nationality",
                        className: "select-fld",
                        value: this.state.nationality,
                        dataSource: {
                          textField: "nationality",
                          valueField: "hims_d_nationality_id",
                          data: this.props.nationalities,
                        },
                        onChange: texthandle.bind(this, this),
                        onClear: () => {
                          this.setState({
                            nationality: null,
                          });
                          this.props.EmpMasterIOputs.updateEmployeeTabs({
                            nationality: null,
                          });
                        },
                      }}
                    />
                    <AlagehAutoComplete
                      div={{
                        className:
                          "col-lg-2 col-md-2 col-sm-12 mandatory form-group",
                      }}
                      label={{
                        forceLabel: "Religion",
                        isImp: true,
                      }}
                      selector={{
                        name: "religion_id",
                        className: "select-fld",
                        value: this.state.religion_id,
                        dataSource: {
                          textField: "religion_name",
                          valueField: "hims_d_religion_id",
                          data: this.props.relegions,
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          tabIndex: "10",
                        },
                        onClear: () => {
                          this.setState({
                            religion_id: null,
                          });
                          this.props.EmpMasterIOputs.updateEmployeeTabs({
                            religion_id: null,
                          });
                        },
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                      label={{
                        forceLabel: "Personal Contact No.",
                        isImp: false,
                      }}
                      textBox={{
                        value: this.state.primary_contact_no,
                        className: "txt-fld",
                        name: "primary_contact_no",

                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "7",
                          placeholder: "(+968)123-456-78)",
                          type: "number",
                        },
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                      label={{
                        forceLabel: "Work Contact No.",
                        isImp: false,
                      }}
                      textBox={{
                        value: this.state.secondary_contact_no,
                        className: "txt-fld",
                        name: "secondary_contact_no",

                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "7",
                          placeholder: "(+968)123-456-78",
                          type: "number",
                        },
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                      label={{
                        forceLabel: "Primary ID",
                      }}
                      selector={{
                        name: "identity_type_id",
                        className: "select-fld",
                        value: this.state.identity_type_id,
                        dataSource: {
                          textField: "identity_document_name",
                          valueField: "hims_d_identity_document_id",
                          data: this.props.idtypes,
                        },
                        onChange: texthandle.bind(this, this),
                        onClear: () => {
                          this.setState({
                            identity_type_id: null,
                          });
                        },
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                      label={{
                        forceLabel: "Number",
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "identity_no",
                        value: this.state.identity_no,
                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          placeholder: "Enter ID Number",
                        },
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-lg-3 col-sm-12  " }}
                      label={{
                        forceLabel: "Personal Email Id",
                        isImp: false,
                      }}
                      textBox={{
                        value: this.state.email,
                        className: "txt-fld",
                        name: "email",

                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "8",
                          placeholder: "Enter Personal Email Address",
                          type: "email",
                        },
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-3 col-sm-12  " }}
                      label={{
                        forceLabel: "Work Email Id",
                        isImp: false,
                      }}
                      textBox={{
                        value: this.state.work_email,
                        className: "txt-fld",
                        name: "work_email",

                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "8",
                          placeholder: "Enter Work Email Address",
                          type: "email",
                        },
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-lg-2 col-md-2 col-sm-12" }}
                      label={{
                        fieldName: "blood_group",
                      }}
                      selector={{
                        name: "blood_group",
                        className: "select-fld",
                        value: this.state.blood_group,

                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: variableJson.FORMAT_BLOOD_GROUP,
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          tabIndex: "9",
                        },
                        onClear: () => {
                          this.setState({
                            blood_group: null,
                          });
                          this.props.EmpMasterIOputs.updateEmployeeTabs({
                            blood_group: null,
                          });
                        },
                      }}
                    />
                    <AlagehAutoComplete
                      div={{
                        className: "col-lg-2 col-md-2 col-sm-12",
                      }}
                      label={{
                        forceLabel: "Marital Status",
                        isImp: false,
                      }}
                      selector={{
                        name: "marital_status",
                        className: "select-fld",
                        value: this.state.marital_status,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: variableJson.FORMAT_MARTIALSTS_EMP,
                        },
                        onChange: texthandle.bind(this, this),
                        onClear: () => {
                          this.setState({
                            marital_status: null,
                          });
                          this.props.EmpMasterIOputs.updateEmployeeTabs({
                            marital_status: null,
                          });
                        },
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="col-lg-6 col-sm-12">
                      <h5>
                        <span>Present Address</span>
                      </h5>
                      <div className="row paddin-bottom-5">
                        <AlagehFormGroup
                          div={{ className: "col-lg-12 col-sm-12 form-group" }}
                          label={{
                            fieldName: "address",
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "present_address",
                            value: this.state.present_address,
                            events: {
                              onChange: texthandle.bind(this, this),
                              others: {
                                tabIndex: "11",
                              },
                            },
                          }}
                        />
                        <AlagehAutoComplete
                          div={{
                            className:
                              "col-lg-4 col-sm-12 form-group form-group",
                          }}
                          label={{
                            fieldName: "country_id",
                            isImp: false,
                          }}
                          selector={{
                            name: "present_country_id",
                            className: "select-fld",
                            value: this.state.present_country_id,
                            dataSource: {
                              textField: "country_name",
                              valueField: "hims_d_country_id",
                              data: this.props.countries,
                            },
                            onChange: countryStatehandle.bind(this, this),
                            others: {
                              tabIndex: "10",
                            },
                            onClear: () => {
                              this.setState({
                                present_country_id: null,
                              });
                              this.props.EmpMasterIOputs.updateEmployeeTabs({
                                present_country_id: null,
                              });
                            },
                          }}
                        />

                        <AlagehAutoComplete
                          div={{
                            className:
                              "col-lg-4 col-sm-12 form-group form-group",
                          }}
                          label={{
                            fieldName: "state_id",
                            isImp: false,
                          }}
                          selector={{
                            name: "present_state_id",
                            className: "select-fld",
                            value: this.state.present_state_id,
                            dataSource: {
                              textField: "state_name",
                              valueField: "hims_d_state_id",
                              data: this.state.countrystates,
                            },
                            onChange: countryStatehandle.bind(this, this),
                            others: {
                              tabIndex: "11",
                              disabled: this.state.existingPatient,
                            },
                            onClear: () => {
                              this.setState({
                                present_state_id: null,
                              });
                              this.props.EmpMasterIOputs.updateEmployeeTabs({
                                present_state_id: null,
                              });
                            },
                          }}
                        />
                        <AlagehAutoComplete
                          div={{
                            className:
                              "col-lg-4 col-sm-12 form-group form-group",
                          }}
                          label={{
                            fieldName: "city_id",
                            isImp: false,
                          }}
                          selector={{
                            name: "present_city_id",
                            className: "select-fld",
                            value: this.state.present_city_id,
                            dataSource: {
                              textField: "city_name",
                              valueField: "hims_d_city_id",
                              data: this.state.present_cities,
                            },
                            onChange: texthandle.bind(this, this),
                            others: {
                              tabIndex: "12",
                              disabled: this.state.existingPatient,
                            },
                            onClear: () => {
                              this.setState({
                                present_city_id: null,
                              });
                              this.props.EmpMasterIOputs.updateEmployeeTabs({
                                present_city_id: null,
                              });
                            },
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12">
                      <h5>
                        <span>Permanent Address</span>
                      </h5>
                      <div className="row paddin-bottom-5">
                        <div
                          className="col-lg-4 col-sm-12 customCheckbox form-group"
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
                          div={{ className: "col-lg-8 col-sm-12 form-group" }}
                          label={{
                            fieldName: "address",
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
                                tabIndex: "11",
                              },
                            },
                          }}
                        />
                        <AlagehAutoComplete
                          div={{
                            className:
                              "col-lg-4 col-sm-12 form-group form-group",
                          }}
                          label={{
                            fieldName: "country_id",
                            isImp: false,
                          }}
                          selector={{
                            name: "permanent_country_id",
                            className: "select-fld",
                            value:
                              this.state.samechecked === "Y"
                                ? this.state.present_country_id
                                : this.state.permanent_country_id,
                            dataSource: {
                              textField: "country_name",
                              valueField: "hims_d_country_id",
                              data: this.props.countries,
                            },
                            onChange: countryStatehandle.bind(this, this),
                            others: {
                              tabIndex: "10",
                            },
                            onClear: () => {
                              this.setState({
                                permanent_country_id: null,
                              });
                              this.props.EmpMasterIOputs.updateEmployeeTabs({
                                permanent_country_id: null,
                              });
                            },
                          }}
                        />

                        <AlagehAutoComplete
                          div={{
                            className:
                              "col-lg-4 col-sm-12 form-group form-group",
                          }}
                          label={{
                            fieldName: "state_id",
                            isImp: false,
                          }}
                          selector={{
                            name: "permanent_state_id",
                            className: "select-fld",
                            value:
                              this.state.samechecked === "Y"
                                ? this.state.present_state_id
                                : this.state.permanent_state_id,
                            dataSource: {
                              textField: "state_name",
                              valueField: "hims_d_state_id",
                              data:
                                this.state.samechecked === "Y"
                                  ? this.state.countrystates
                                  : this.state.precountrystates,
                            },
                            onChange: countryStatehandle.bind(this, this),
                            others: {
                              tabIndex: "11",
                            },
                            onClear: () => {
                              this.setState({
                                permanent_state_id: null,
                              });
                              this.props.EmpMasterIOputs.updateEmployeeTabs({
                                permanent_state_id: null,
                              });
                            },
                          }}
                        />
                        <AlagehAutoComplete
                          div={{
                            className:
                              "col-lg-4 col-sm-12 form-group form-group",
                          }}
                          label={{
                            fieldName: "city_id",
                            isImp: false,
                          }}
                          selector={{
                            name: "permanent_city_id",
                            className: "select-fld",
                            value:
                              this.state.samechecked === "Y"
                                ? this.state.present_city_id
                                : this.state.permanent_city_id,
                            dataSource: {
                              textField: "city_name",
                              valueField: "hims_d_city_id",
                              data:
                                this.state.samechecked === "Y"
                                  ? this.state.present_cities
                                  : this.state.precities,
                            },
                            onChange: texthandle.bind(this, this),
                            others: {
                              tabIndex: "12",
                              disabled: this.state.existingPatient,
                            },
                            onClear: () => {
                              this.setState({
                                permanent_city_id: null,
                              });
                              this.props.EmpMasterIOputs.updateEmployeeTabs({
                                permanent_city_id: null,
                              });
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-2 col-sm-12 secondary-details">
                  <h5>
                    <span>Profile Image</span>
                  </h5>
                  <div className="row secondary-box-container">
                    <div className="col">
                      <div>
                        <AlgaehFile
                          ref={(employeeImage) => {
                            this.employeeImage = employeeImage;
                          }}
                          name="employeeImage"
                          accept="image/*"
                          showActions={
                            this.state.employee_status === "I"
                              ? false
                              : this.state.employee_code === null ||
                                this.state.employee_code === ""
                              ? false
                              : true
                          }
                          textAltMessage="Employee Image"
                          serviceParameters={{
                            uniqueID: this.state.employee_code,
                            fileType: "Employees",
                            processDelay: this.imageDetails.bind(
                              this,
                              "employeeImage"
                            ),
                          }}
                          renderPrevState={this.state.employeeImage}
                          forceRefresh={this.state.forceRefresh}
                        />
                      </div>
                    </div>
                  </div>
                  {this.state.HIMS_Active === true ? (
                    <div>
                      <h5 style={{ marginTop: 20 }}>
                        <span>If its a Doctor</span>
                      </h5>
                      <div className="row secondary-box-container">
                        <div
                          className="col-lg-12 col-sm-12 customCheckbox"
                          style={{ border: "none" }}
                        >
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              name="isdoctor"
                              value={this.state.isdoctor}
                              checked={
                                this.state.isdoctor === "Y" ? true : false
                              }
                              onChange={isDoctorChange.bind(this, this)}
                            />
                            <span>
                              <AlgaehLabel label={{ fieldName: "isdoctor" }} />
                            </span>
                          </label>
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-lg-12 col-sm-12 mandatory" }}
                          label={{
                            fieldName: "license_number",
                            isImp: this.state.isdoctor === "Y" ? true : false,
                          }}
                          textBox={{
                            value: this.state.license_number,
                            className: "txt-fld",
                            name: "license_number",

                            events: {
                              onChange: texthandle.bind(this, this),
                            },
                            others: {
                              disabled:
                                this.state.isdoctor === "Y" ? false : true,
                            },
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
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
    idtypes: state.idtypes,
    titles: state.titles,
    cities: state.cities,
    nationalities: state.nationalities,
    countries: state.countries,
    countrystates: state.countrystates,
    present_countrystates: state.present_countrystates,
    present_cities: state.present_cities,
    relegions: state.relegions,
    patients: state.patients,
    services: state.services,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getIDTypes: AlgaehActions,
      getTitles: AlgaehActions,
      getCities: AlgaehActions,
      getCountries: AlgaehActions,
      getNationalities: AlgaehActions,
      getStates: AlgaehActions,
      getServices: AlgaehActions,
      getRelegion: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PersonalDetails)
);
