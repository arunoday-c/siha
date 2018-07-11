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

  handleChange(row, e) {
    let x = Enumerable.from(this.state.visitDetails)
      .where(w => w.radioselect == 1)
      .toArray();
    var index;

    if (x != null && x.length > 0) {
      index = this.state.visitDetails.indexOf(x[0]);
      if (index > -1) {
        this.state.visitDetails[index]["radioselect"] = 0;
      }
    }
    index = this.state.visitDetails.indexOf(row);
    this.state.visitDetails[index]["radioselect"] = 1;

    this.setState({
      visitDetails: this.state.visitDetails,
      visit_id: row.visit_id
    });
  }

  render() {
    const vstDeatils =
      this.state.visitDetails === null ? [{}] : this.state.visitDetails;
    return (
      <div className="hptl-display-active-visit-form">
        <div className="container-fluid">
          <div className="row form-details">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <AlgaehDataGrid
                columns={[
                  {
                    fieldName: "radioselect",
                    displayTemplate: row => {
                      return (
                        <Radio
                          style={{ maxHeight: "10px" }}
                          name="select"
                          onChange={this.handleChange.bind(this, row)}
                          checked={row.radioselect == 1 ? true : false}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "visit_code",
                    label: <AlgaehLabel label={{ fieldName: "visit_code" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "visit_date",
                    label: <AlgaehLabel label={{ fieldName: "visit_date" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "visit_type",
                    label: <AlgaehLabel label={{ fieldName: "visit_type" }} />,
                    displayTemplate: row => {
                      let display =
                        this.props.visittypes === undefined
                          ? []
                          : this.props.visittypes.filter(
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
                      let display = [];
                      this.props.deptanddoctors != 0
                        ? (display =
                            this.props.deptanddoctors === undefined
                              ? []
                              : this.props.deptanddoctors.departmets.filter(
                                  f =>
                                    f.sub_department_id == row.sub_department_id
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    visittypes: state.visittypes,
    deptanddoctors: state.deptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisittypes: AlgaehActions,
      getDepartmentsandDoctors: AlgaehActions
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
