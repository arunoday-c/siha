import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./TermsConditions.scss";
import moment from "moment";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../../utils/algaehApiCall";
import { setGlobal, AlgaehValidation } from "../../../utils/GlobalFunctions";
import Options from "../../../Options.json";
import _ from "lodash";

class TermsConditions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_f_terms_condition_id: null,
      short_name: null,
      terms_cond_status: "A",
      terms_cond_description: null,


      buttonText: <span>Add to List</span>
    };

    this.baseState = this.state;
  }


  changeTexts(e) {
    debugger
    // e = e || ctrl
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({ [name]: value });
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    setGlobal({ selectedLang: prevLang });
    this.setState({
      selectedLang: prevLang
    });
    if (
      this.props.terms_conditions === undefined ||
      this.props.terms_conditions.length === 0
    ) {
      this.props.getTermsConditions({
        uri: "/salseSetup/getTermsConditions",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "TERMS_COND_GET_DATA",
          mappingName: "terms_conditions"
        }
      });
    }
  }

  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  resetState() {
    this.setState(this.baseState);
  }

  addTermsConditions(e) {
    e.preventDefault();



    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        if (this.state.hims_f_terms_condition_id === null) {
          algaehApiCall({
            uri: "/salseSetup/addTermsConditions",
            module: "masterSettings",
            data: this.state,
            onSuccess: response => {
              if (response.data.success === true) {
                this.resetState();
                //Handle Successful Add here
                this.props.getTermsConditions({
                  uri: "/salseSetup/getTermsConditions",
                  module: "masterSettings",
                  method: "GET",
                  redux: {
                    type: "TERMS_COND_GET_DATA",
                    mappingName: "terms_conditions"
                  }
                });
                swalMessage({
                  title: "Added successfully",
                  type: "success"
                });
              }
            }
          });
        } else {
          algaehApiCall({
            uri: "/salseSetup/updateTermsConditions",
            module: "masterSettings",
            method: "PUT",
            data: this.state,
            onSuccess: response => {
              if (response.data.success === true) {
                this.resetState();
                //Handle Successful Add here
                this.props.getTermsConditions({
                  uri: "/salseSetup/getTermsConditions",
                  module: "masterSettings",
                  method: "GET",
                  redux: {
                    type: "TERMS_COND_GET_DATA",
                    mappingName: "terms_conditions"
                  }
                });
                swalMessage({
                  title: "Updated successfully",
                  type: "success"
                });
              }
            }
          });
        }

      }
    });
  }

  EditTermsandConditions(row) {
    this.setState({
      hims_f_terms_condition_id: row.hims_f_terms_condition_id,
      short_name: row.short_name,
      terms_cond_status: row.terms_cond_status,
      terms_cond_description: row.terms_cond_description,
      buttonText: <span>Update</span>
    })
  }

  render() {
    return (
      <div>
        <div className="visit_type">
          <div className="container-fluid">
            <form>
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col mandatory" }}
                  label={{
                    fieldName: "short_name",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "short_name",
                    value: this.state.short_name,
                    events: {
                      onChange: this.changeTexts.bind(this)
                    },
                    others: {
                      tabIndex: "1"
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col mandatory" }}
                  label={{
                    fieldName: "terms_cond_description",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "terms_cond_description",
                    value: this.state.terms_cond_description,

                    events: {
                      onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                <div className="col">
                  <AlgaehLabel
                    label={{
                      fieldName: "status"
                    }}
                  />
                  <div className="customRadio" style={{ borderBottom: 0 }}>
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="A"
                        name="terms_cond_status"
                        checked={this.state.terms_cond_status === "A" ? true : false}
                        onChange={this.changeTexts.bind(this)}
                      />
                      <span>
                        <AlgaehLabel
                          label={{
                            fieldName: "active"
                          }}
                        />
                      </span>
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="I"
                        name="terms_cond_status"
                        checked={this.state.terms_cond_status === "I" ? true : false}
                        onChange={this.changeTexts.bind(this)}
                      />
                      <span>
                        <AlgaehLabel
                          label={{
                            fieldName: "inactive"
                          }}
                        />
                      </span>
                    </label>
                  </div>
                </div>


                <div
                  className="col-lg-2 align-middle"
                  style={{ paddingTop: 19 }}
                >
                  <button
                    onClick={this.addTermsConditions.bind(this)}
                    className="btn btn-primary"
                  >
                    {this.state.buttonText}
                  </button>
                </div>
              </div>
            </form>
            <div className="row form-details" data-validate="visitDiv">
              <div className="col">
                <AlgaehDataGrid
                  datavalidate="data-validate='visitDiv'"
                  id="terms_cond_grd"
                  columns={[
                    {
                      fieldName: "action",
                      label: (
                        <AlgaehLabel label={{ fieldName: "action" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            <i
                              className="fas fa-pen"
                              onClick={this.EditTermsandConditions.bind(this, row)}
                            />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 90,
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "short_name",
                      label: <AlgaehLabel label={{ fieldName: "short_name" }} />,
                      disabled: true
                    },
                    {
                      fieldName: "terms_cond_description",
                      label: <AlgaehLabel label={{ fieldName: "terms_cond_description" }} />,
                    },
                    {
                      fieldName: "created_by",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_by" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.userdrtails === undefined
                            ? []
                            : this.props.userdrtails.filter(
                              f => f.algaeh_d_app_user_id === row.created_by
                            );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].username
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "created_date",
                      label: (
                        <AlgaehLabel label={{ fieldName: "created_date" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>{this.dateFormater(row.created_date)}</span>
                        );
                      }
                    },
                    {
                      fieldName: "terms_cond_status",
                      label: <AlgaehLabel label={{ fieldName: "status" }} />,
                      displayTemplate: row => {
                        return row.terms_cond_status === "A" ? "Active" : "Inactive";
                      }
                    }
                  ]}
                  keyId="terms_cond_description"
                  dataSource={{
                    data:
                      this.props.terms_conditions === undefined
                        ? []
                        : this.props.terms_conditions
                  }}
                  filter={true}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    terms_conditions: state.terms_conditions,
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTermsConditions: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TermsConditions)
);
