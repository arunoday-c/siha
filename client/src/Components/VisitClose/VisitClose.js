import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./VisitClose.scss";
import "../../styles/site.scss";
import { AlgaehLabel, AlgaehDataGrid } from "../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../actions/algaehActions";
import {
  PatientSearch,
  SelectVisitToClose,
  ClearData,
  CloseVisits
} from "./VisitCloseEvent";
import moment from "moment";
import Options from "../../Options.json";

class VisitClose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitDetails: [],
      saveEnable: true
    };
  }

  componentDidMount() {
    if (
      this.props.viewproviders === undefined ||
      this.props.viewproviders.length === 0
    ) {
      this.props.getProviderDetails({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",
        redux: {
          type: "DOCTOR_GET_DATA",
          mappingName: "viewproviders"
        }
      });
    }

    if (
      this.props.subDepartments === undefined ||
      this.props.subDepartments.length === 0
    ) {
      this.props.getSubDepartment({
        uri: "/department/get/subdepartment",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "DOCTOR_GET_DATA",
          mappingName: "subDepartments"
        }
      });
    }
  }

  DisplayDateFormat = date => {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  render() {
    return (
      <div className="hims_visit_close">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="col-lg-3">
              <div
                className="row"
                style={{
                  border: " 1px solid #ced4d9",
                  borderRadius: 5,
                  marginLeft: 0
                }}
              >
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Patient Code" }} />
                  <h6>
                    {this.state.patient_code
                      ? this.state.patient_code
                      : "----------"}
                  </h6>
                </div>
                <div
                  className="col-lg-3"
                  style={{ borderLeft: "1px solid #ced4d8" }}
                >
                  <i
                    className="fas fa-search fa-lg"
                    style={{
                      paddingTop: 17,
                      paddingLeft: 3,
                      cursor: "pointer"
                    }}
                    onClick={PatientSearch.bind(this, this)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="VisitCloseGrid">
                <AlgaehDataGrid
                  id="item_grid"
                  columns={[
                    {
                      fieldName: "close",
                      label: <AlgaehLabel label={{ forceLabel: "Close" }} />,
                      displayTemplate: row => {
                        return (
                          <input
                            type="checkbox"
                            name="select"
                            onChange={SelectVisitToClose.bind(this, this, row)}
                          />
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
                        <AlgaehLabel label={{ forceLabel: "Visit Code" }} />
                      )
                    },
                    {
                      fieldName: "visit_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Visit Date" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>{this.DisplayDateFormat(row.visit_date)}</span>
                        );
                      }
                    },
                    {
                      fieldName: "sub_department_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Department" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.subDepartments === undefined
                            ? []
                            : (display = this.props.subDepartments.filter(
                                f =>
                                  f.hims_d_sub_department_id ===
                                  row.sub_department_id
                              ));

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].sub_department_name
                              : ""}
                          </span>
                        );
                      },
                      disabled: true
                    },
                    {
                      fieldName: "doctor_id",
                      label: <AlgaehLabel label={{ forceLabel: "Doctor" }} />,
                      displayTemplate: row => {
                        let display =
                          this.props.viewproviders === undefined
                            ? []
                            : (display = this.props.viewproviders.filter(
                                f => f.hims_d_employee_id === row.doctor_id
                              ));

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].full_name
                              : ""}
                          </span>
                        );
                      },
                      disabled: true
                    }
                  ]}
                  keyId="hims_f_patient_visit_id"
                  dataSource={{
                    data: this.state.visitDetails
                  }}
                  // filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={CloseVisits.bind(this, this)}
                disabled={this.state.saveEnable}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Close Visits", returnText: true }}
                />
              </button>

              <button
                type="button"
                className="btn btn-default"
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    subDepartments: state.subDepartments,
    viewproviders: state.viewproviders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getProviderDetails: AlgaehActions,
      getSubDepartment: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VisitClose)
);
