import React, { Component } from "react";
import SelectFieldDrop from "../../../common/Inputs/SelectField.js";
import TextField from "material-ui/TextField";
import "./ConsultationForm.css";
import "./../../../../styles/site.css";
import extend from "extend";
import { getSubDepartments } from "../../../../actions/CommonSetup/Department.js";
import { getVisittypes } from "../../../../actions/CommonSetup/VisitTypeactions.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SelectFiledData } from "../../../../utils/algaehApiCall.js";
import MyContext from "../../../../utils/MyContext.js";

import {
  AlgaehLabel,
  AlgaehSelector,
  AlagehAutoComplete
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
    debugger;
    if (this.props.subdepartments.length === 0) {
      this.props.getSubDepartments();
    }
    if (this.props.visittypes.length === 0) {
      this.props.getVisittypes();
    }
  }

  componentWillReceiveProps(nextProps) {
    debugger;
    console.log("Visit Details", this.state);
    this.setState(nextProps.PatRegIOputs);
  }

  render() {
    const vstDeatils =
      this.state.visitDetails === null
        ? [
            {
              visit_code: "",
              visit_date: "",
              visit_type: "",
              department_id: "",
              doctor_id: ""
            }
          ]
        : this.state.visitDetails;
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
                          textField: "visit_type",
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
                          textField: "sub_department_name",
                          valueField: "hims_d_sub_department_id",
                          data: this.props.subdepartments
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
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: FORMAT_DEFAULT
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
                  <table className="table table-striped table-details table-hover">
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
                        debugger;
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.visit_code}</td>
                            <td>{row.visit_date}</td>
                            <td>
                              <AlagehAutoComplete
                                div={{ className: "col-lg-6" }}
                                selector={{
                                  name: "visit_type",
                                  className: "select-fld",
                                  value: row.visit_type,
                                  others: {
                                    style: { width: "150px" },
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
                                    style: { width: "150px" },
                                    disabled: true
                                  },
                                  dataSource: {
                                    textField: "sub_department_name",
                                    valueField: "hims_d_sub_department_id",
                                    data: this.props.subdepartments
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
                                    style: { width: "150px" },
                                    disabled: true
                                  },
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: FORMAT_DEFAULT
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
      debugger;
      state.setState({
        [e.name]: e.value,
        department_id: e.selected.department_id
      });
      if (context != null) {
        context.updateState({ [e.name]: e.value });
      }
    },

    selectedHandeler: e => {
      debugger;
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
    subdepartments: state.subdepartments.subdepartments,
    visittypes: state.visittypes.visittypes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getSubDepartments: getSubDepartments, getVisittypes: getVisittypes },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddConsultationForm)
);
