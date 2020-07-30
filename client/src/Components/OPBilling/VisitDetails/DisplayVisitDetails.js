import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehDataGrid, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import "./DisplayVisitDetails.scss";
import "./../../../styles/site.scss";

import { AlgaehActions } from "../../../actions/algaehActions";
import MyContext from "../../../utils/MyContext.js";

import { handleChange } from "./VisitdetailEvent";
class DisplayVisitDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: 0
    };
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.BillingIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (
      this.props.visittypes === undefined ||
      this.props.visittypes.length === 0
    ) {
      this.props.getVisittypes({
        uri: "/visitType/get",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "VISITTYPE_GET_DATA",
          mappingName: "visittypes"
        }
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.BillingIOputs);
  }

  render() {
    return (
      <div className="hptl-display-visit-details">
        <React.Fragment>
          <MyContext.Consumer>
            {context => (
              <div className="container-fluid">
                <div className="row form-details">
                  <div
                    className="col-lg-12 gridWithRadio"
                    id="opVisitGrid_Cntr"
                  >
                    <AlgaehDataGrid
                      columns={[
                        {
                          fieldName: "radioselect",
                          displayTemplate: row => {
                            return (
                              <div className="customRadio">
                                <label className="radio inline">
                                  <input
                                    type="radio"
                                    checked={
                                      row.radioselect === 1 ? true : false
                                    }
                                    disabled={this.state.Billexists}
                                    onChange={handleChange.bind(
                                      this,
                                      this,
                                      row,
                                      context
                                    )}
                                  />
                                  <span />
                                </label>
                              </div>
                            );
                          },
                          others: {
                            maxWidth: 50,
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "visit_code",
                          label: (
                            <AlgaehLabel label={{ fieldName: "visit_code" }} />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "visit_date",
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
                            let display =
                              this.props.visittypes === undefined
                                ? []
                                : this.props.visittypes.filter(
                                  f =>
                                    f.hims_d_visit_type_id === row.visit_type
                                );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? this.state.selectedLang === "en"
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
                            <AlgaehLabel
                              label={{ fieldName: "department_id" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "doctor_id",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "incharge_or_provider" }}
                            />
                          ),
                          disabled: true
                        }
                      ]}
                      keyId="visit_code"
                      dataSource={{
                        data: this.state.visitDetails
                      }}
                      // isEditable={true}
                      paging={{ page: 0, rowsPerPage: 5 }}
                      events={{
                        onDone: row => {
                          alert("done is raisedd");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </MyContext.Consumer>
        </React.Fragment>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    visittypes: state.visittypes,
    existinsurance: state.existinsurance,
    orderlist: state.orderlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisittypes: AlgaehActions,
      getPatientInsurance: AlgaehActions,
      getOrderList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DisplayVisitDetails)
);
