import React, { Component } from "react";
import SelectFieldDrop from "../../../common/Inputs/SelectField.js";
import TextField from "material-ui/TextField";
import "./ConsultationForm.css";
import "./../../../../styles/site.css";
import extend from "extend";
import { getDepartmentsClinicalNon } from "../../../../actions/CommonSetup/Department.js";
import { getVisittypes } from "../../../../actions/CommonSetup/VisitTypeactions.js";
import { getProviderDetails } from "../../../../actions/serviceActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import moment from "moment";
import Options from "../../../../Options.json";

import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";

const FORMAT_DEFAULT = [
  { name: "Mohammed", value: 1 },
  { name: "Raheem", value: 2 },
  { name: "Rahaman", value: 3 }
];
const MATERNITY_PATIENT = [
  { label: "Yes", value: "Y" },
  { label: "No", value: "N" }
];

class AddConsultationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };
  }

  componentWillMount() {
    let InputOutput;

    InputOutput = this.props.PatRegIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (this.props.clndepartments.length === 0) {
      this.props.getDepartmentsClinicalNon("CLINICAL");
    }
    if (this.props.visittypes.length === 0) {
      this.props.getVisittypes();
    }
    debugger;
    if (this.props.providers.length === 0) {
      this.props.getProviderDetails();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("Visit Details", this.state);
    this.setState(nextProps.PatRegIOputs);
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
      // return moment(date).format(Options.dateFormat);
    }
  };

  render() {
    // debugger;
    const vstDeatils =
      this.state.visitDetails === null ? [{}] : this.state.visitDetails;
    return (
      <MyContext.Consumer>
        {context => (
          <div className="hptl-phase1-add-consultation-form">
            <div className="container-fluid">
              <div className="row">
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 primary-details">
                  <div className="row primary-box-container">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-6" }}
                      label={{
                        fieldName: "visit_type",
                        isImp: true
                      }}
                      selector={{
                        name: "visit_type",
                        className: "select-fld",
                        value: this.state.visit_type,
                        dataSource: {
                          textField:
                            this.state.selectedLang == "en"
                              ? "visit_type_desc"
                              : "arabic_visit_type_desc",
                          valueField: "hims_d_visit_type_id",
                          data: this.props.visittypes
                        },
                        onChange: AddVisitHandlers(
                          this,
                          context
                        ).selectedHandeler.bind(this)
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-lg-6" }}
                      label={{
                        fieldName: "department_id",
                        isImp: true
                      }}
                      selector={{
                        name: "sub_department_id",
                        className: "select-fld",
                        value: this.state.sub_department_id,
                        dataSource: {
                          // textField: "sub_department_name",
                          textField:
                            this.state.selectedLang == "en"
                              ? "sub_department_name"
                              : "arabic_sub_department_name",
                          valueField: "hims_d_sub_department_id",
                          data: this.props.clndepartments
                        },
                        onChange: AddVisitHandlers(
                          this,
                          context
                        ).DeptselectedHandeler.bind(this)
                      }}
                    />
                  </div>
                  <div className="row primary-box-container">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-6" }}
                      label={{
                        fieldName: "doctor_id",
                        isImp: true
                      }}
                      selector={{
                        name: "doctor_id",
                        className: "select-fld",
                        value: this.state.doctor_id,
                        // dataSource: {
                        //   textField: "name",
                        //   valueField: "value",
                        //   data: FORMAT_DEFAULT
                        // },
                        dataSource: {
                          textField:
                            this.state.selectedLang == "en"
                              ? "full_name"
                              : "arabic_name",
                          valueField: "hims_d_employee_id",
                          data: this.props.providers
                        },
                        onChange: AddVisitHandlers(
                          this,
                          context
                        ).selectedHandeler.bind(this)
                      }}
                    />

                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <AlgaehLabel
                        label={{
                          fieldName: "visit_date",
                          isImp: true
                        }}
                      />
                      <br />

                      <TextField
                        type="date"
                        disabled={true}
                        value={this.state.visit_date}
                      />
                    </div>
                  </div>
                  <div className="row primary-box-container">
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <AlgaehLabel
                        label={{
                          fieldName: "maternity_patient"
                        }}
                      />
                      <br />
                      <div className="row">
                        {MATERNITY_PATIENT.map((data, idx) => {
                          return (
                            <div
                              className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                              key={"index_value" + idx}
                            >
                              <input
                                type="radio"
                                name="MATERNITY_PATIENT"
                                className="htpl-phase1-radio-btn"
                                value={data.value}
                                defaultChecked={
                                  data.value === "N" ? true : false
                                }
                              />
                              <label className="radio-design">
                                {data.label}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 secondary-details">
                  <AlgaehDataGrid
                    columns={[
                      {
                        fieldName: "visit_code",
                        label: (
                          <AlgaehLabel label={{ fieldName: "visit_code" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "visit_date",
                        displayTemplate: row => {
                          return (
                            <span>{this.changeDateFormat(row.visit_date)}</span>
                          );
                        },
                        label: (
                          <AlgaehLabel label={{ fieldName: "visit_date" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "visit_type",
                        label: (
                          <AlgaehLabel label={{ fieldName: "visit_type" }} />
                        ),
                        displayTemplate: row => {
                          let display = this.props.visittypes.filter(
                            f => f.hims_d_visit_type_id == row.visit_type
                          );

                          return (
                            <span>
                              {display != null && display.length != 0
                                ? this.state.selectedLang == "en"
                                  ? display[0].visit_type_desc
                                  : display[0].arabic_visit_type_desc
                                : ""}
                            </span>
                          );
                        },
                        disabled: true
                      },
                      {
                        fieldName: "sub_department_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "department_id" }} />
                        ),
                        displayTemplate: row => {
                          let display = this.props.clndepartments.filter(
                            f =>
                              f.hims_d_sub_department_id ==
                              row.sub_department_id
                          );

                          return (
                            <span>
                              {display != null && display.length != 0
                                ? this.state.selectedLang == "en"
                                  ? display[0].sub_department_name
                                  : display[0].arabic_sub_department_name
                                : ""}
                            </span>
                          );
                        },
                        disabled: true
                      },
                      {
                        fieldName: "doctor_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "doctor_id" }} />
                        ),
                        displayTemplate: row => {
                          let display = this.props.providers.filter(
                            f => f.hims_d_employee_id == row.doctor_id
                          );

                          return (
                            <span>
                              {display != null && display.length != 0
                                ? this.state.selectedLang == "en"
                                  ? display[0].full_name
                                  : display[0].arabic_name
                                : ""}
                            </span>
                          );
                        },
                        disabled: true
                      }
                    ]}
                    keyId="visit_code"
                    dataSource={{
                      data: vstDeatils
                    }}
                    // isEditable={true}
                    paging={{ page: 0, rowsPerPage: 5 }}
                    events={{
                      onDone: row => {
                        alert("done is raisedd");
                      }
                    }}
                  />
                  {/* <table className="table table-striped table-details table-hover">
                    <thead style={{ background: "#B4E2DF" }}>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">
                          <AlgaehLabel label={{ fieldName: "visit_code" }} />
                        </th>
                        <th scope="col">
                          <AlgaehLabel label={{ fieldName: "visit_date" }} />
                        </th>
                        <th scope="col">
                          <AlgaehLabel label={{ fieldName: "visit_type" }} />
                        </th>
                        <th scope="col">
                          <AlgaehLabel label={{ fieldName: "department_id" }} />
                        </th>
                        <th scope="col">
                          <AlgaehLabel label={{ fieldName: "doctor_id" }} />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {vstDeatils.map((row, index) => {
                        let vistDate = "";
                        if (row.visit_date !== "" || row.visit_date !== null) {
                          vistDate = moment(String(row.visit_date)).format(
                            "YYYY-MM-DD"
                          );
                        }
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.visit_code}</td>
                            <td>{vistDate}</td>
                            <td>
                              <AlagehAutoComplete
                                div={{ className: "col-lg-6" }}
                                selector={{
                                  name: "visit_type",
                                  className: "select-fld",
                                  value: row.visit_type,
                                  others: {
                                    style: { width: "130px" },
                                    disabled: true
                                  },
                                  dataSource: {
                                    textField: "visit_type",
                                    valueField: "hims_d_visit_type_id",
                                    data: this.props.visittypes
                                  }
                                }}
                              />
                            </td>
                            <td>
                              <AlagehAutoComplete
                                div={{ className: "col-lg-6" }}
                                selector={{
                                  name: "sub_department_id",
                                  className: "select-fld",
                                  value: row.sub_department_id,
                                  others: {
                                    style: { width: "130px" },
                                    disabled: true
                                  },
                                  dataSource: {
                                    textField: "sub_department_name",
                                    valueField: "hims_d_sub_department_id",
                                    data: this.props.clndepartments
                                  }
                                }}
                              />
                            </td>
                            <td>
                              <AlagehAutoComplete
                                div={{ className: "col-lg-6" }}
                                selector={{
                                  name: "doctor_id",
                                  className: "select-fld",
                                  value: row.doctor_id,
                                  others: {
                                    style: { width: "130px" },
                                    disabled: true
                                  },
                                  dataSource: {
                                    textField: "full_name",
                                    valueField: "hims_d_employee_id",
                                    data: this.props.providers
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </MyContext.Consumer>
    );
  }
}

function AddVisitHandlers(state, context) {
  context = context || null;
  return {
    DeptselectedHandeler: e => {
      state.setState({
        [e.name]: e.value,
        department_id: e.selected.department_id
      });
      if (context != null) {
        context.updateState({
          [e.name]: e.value,
          department_id: e.selected.department_id
        });
      }
    },

    selectedHandeler: e => {
      state.setState({
        [e.name]: e.value
      });
      if (context != null) {
        context.updateState({ [e.name]: e.value });
      }
    }
  };
}

function mapStateToProps(state) {
  return {
    clndepartments: state.clndepartments.clndepartments,
    visittypes: state.visittypes.visittypes,
    providers: state.providers.providers
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsClinicalNon: getDepartmentsClinicalNon,
      getVisittypes: getVisittypes,
      getProviderDetails: getProviderDetails
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddConsultationForm)
);
