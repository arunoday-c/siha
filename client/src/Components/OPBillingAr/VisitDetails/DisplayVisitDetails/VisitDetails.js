import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Radio from "@material-ui/core/Radio";

import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import "./DisplayVisitDetails.css";
import "./../../../../styles/site.css";
import Enumerable from "linq";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext.js";
import { successfulMessage } from "../../../../utils/GlobalFunctions";

class DisplayVisitDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: 0
    };
  }

  componentWillMount() {
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
        method: "GET",
        redux: {
          type: "VISITTYPE_GET_DATA",
          mappingName: "visittypes"
        }
      });
    }

    if (
      this.props.deptanddoctors === undefined ||
      this.props.deptanddoctors.length === 0
    ) {
      this.props.getDepartmentsandDoctors({
        uri: "/department/get/get_All_Doctors_DepartmentWise",
        method: "GET",
        redux: {
          type: "DEPT_DOCTOR_GET_DATA",
          mappingName: "deptanddoctors"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.BillingIOputs);
  }

  handleChange(row, context, e) {
    let $this = this;
    let mode_of_pay = "Self";
    let x = Enumerable.from(this.state.visitDetails)
      .where(w => w.radioselect == 1)
      .toArray();
    var index;

    let doctor_name = "";

    let employee_list = Enumerable.from(this.props.deptanddoctors.doctors)
      .where(w => w.employee_id == row.doctor_id)
      .toArray();
    if (employee_list !== null && employee_list.length > 0) {
      doctor_name = employee_list[0].full_name;
    }

    if (x != null && x.length > 0) {
      index = this.state.visitDetails.indexOf(x[0]);
      if (index > -1) {
        this.state.visitDetails[index]["radioselect"] = 0;
      }
    }
    index = this.state.visitDetails.indexOf(row);
    this.state.visitDetails[index]["radioselect"] = 1;
    if (row.insured === "Y") {
      mode_of_pay = "Insurance";
    }
    this.setState(
      {
        incharge_or_provider: row.doctor_id,
        visit_id: row.hims_f_patient_visit_id,
        insured: row.insured,
        sec_insured: row.sec_insured,
        mode_of_pay: mode_of_pay,
        doctor_name: doctor_name
      },
      () => {
        
        if (this.state.insured === "Y") {
          this.props.getPatientInsurance({
            uri: "/insurance/getPatientInsurance",
            method: "GET",
            data: {
              patient_id: this.state.hims_d_patient_id,
              patient_visit_id: this.state.visit_id
            },
            redux: {
              type: "EXIT_INSURANCE_GET_DATA",
              mappingName: "existinsurance"
            }
          });
        }

        this.props.getOrderList({
          uri: "/orderAndPreApproval/selectOrderServices",
          method: "GET",
          data: {
            visit_id: this.state.visit_id
          },
          redux: {
            type: "ORDER_SERVICES_GET_DATA",
            mappingName: "orderlist"
          },
          afterSuccess: data => {
            let pre_approval_Required = Enumerable.from(data)
              .where(w => w.pre_approval === "Y" && w.apprv_status === "NR")
              .toArray();
            for (let i = 0; i < data.length; i++) {
              data[i].ordered_date = data[i].created_date;
            }

            if (pre_approval_Required.length > 0) {
              successfulMessage({
                message:
                  "Invalid Input. Some of the service is Pre-Approval required, Please wait for Approval.",
                title: "Warning",
                icon: "warning"
              });
            } else {
              if (context != null) {
                context.updateState({ billdetails: data });
              }

              $this.props.billingCalculations({
                uri: "/billing/billingCalculations",
                method: "POST",
                data: { billdetails: data },
                redux: {
                  type: "BILL_HEADER_GEN_GET_DATA",
                  mappingName: "genbill"
                }
              });
            }
          }
        });
      }
    );

    if (context != null) {
      context.updateState({
        incharge_or_provider: row.doctor_id,
        visit_id: row.hims_f_patient_visit_id,
        insured: row.insured,
        sec_insured: row.sec_insured,
        mode_of_pay: mode_of_pay,
        doctor_name: doctor_name
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-display-active-visit-form">
              <div className="container-fluid">
                <div className="row form-details">
                  <div className="col-lg-12 gridWithRadio">
                    <AlgaehDataGrid
                      columns={[
                        {
                          fieldName: "radioselect",
                          displayTemplate: row => {
                            return (
                              <Radio
                                style={{ maxHeight: "10px", maxWidth: "30px" }}
                                name="select"
                                color="primary"
                                onChange={this.handleChange.bind(
                                  this,
                                  row,
                                  context
                                )}
                                checked={row.radioselect == 1 ? true : false}
                                disabled={this.state.Billexists}
                              />
                            );
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
                                      f.hims_d_visit_type_id == row.visit_type
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
                            <AlgaehLabel
                              label={{ fieldName: "department_id" }}
                            />
                          ),
                          displayTemplate: row => {
                            let display = [];
                            this.props.deptanddoctors != 0
                              ? (display =
                                  this.props.deptanddoctors === undefined
                                    ? []
                                    : this.props.deptanddoctors.departmets.filter(
                                        f =>
                                          f.sub_department_id ==
                                          row.sub_department_id
                                      ))
                              : [];

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
                            <AlgaehLabel
                              label={{ fieldName: "incharge_or_provider" }}
                            />
                          ),
                          displayTemplate: row => {
                            let display;
                            this.props.deptanddoctors != 0
                              ? (display =
                                  this.props.deptanddoctors === undefined
                                    ? []
                                    : this.props.deptanddoctors.doctors.filter(
                                        f => f.employee_id == row.doctor_id
                                      ))
                              : [];

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
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    visittypes: state.visittypes,
    deptanddoctors: state.deptanddoctors,
    existinsurance: state.existinsurance,
    genbill: state.genbill,
    orderlist: state.orderlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisittypes: AlgaehActions,
      getDepartmentsandDoctors: AlgaehActions,
      getPatientInsurance: AlgaehActions,
      billingCalculations: AlgaehActions,
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
