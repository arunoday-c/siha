import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";

import "./OPBillPendingList.css";
import "./../../styles/site.css";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler
} from "../Wrapper/algaehWrapper";

import {
  getBillPatientList,
  PatientSearch,
  Refresh,
  datehandle
} from "./OPBillPendingListEvents";

import { AlgaehActions } from "../../actions/algaehActions";
// import moment from "moment";
// import Options from "../../../Options.json";

class OPBillPendingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      today_date: new Date(),
      patient_list: [],
      patient_id: null
    };
  }

  componentDidMount() {
    getBillPatientList(this, this);
  }

  //   changeDateFormat({ value }) {
  //     if (value !== null) {
  //       return moment(value).format(Options.dateFormat);
  //     }
  //   }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-prescription-list-form">
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "OP-Bill Pending List", align: "ltr" }}
              />
            }
            breadStyle={this.props.breadStyle}
            pageNavPath={[
              {
                pageName: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Home",
                      align: "ltr"
                    }}
                  />
                )
              },
              {
                pageName: (
                  <AlgaehLabel
                    label={{ forceLabel: "OP-Bill Pending List", align: "ltr" }}
                  />
                )
              }
            ]}
          />

          <div className="row inner-top-search" style={{ marginTop: 78 }}>
            <div className="col-lg-3">
              <div
                className="row"
                style={{
                  border: " 1px solid #ced4d9",
                  borderRadius: 5,
                  marginLeft: 0
                }}
              >
                <div className="col-lg-9">
                  {" "}
                  <AlgaehLabel label={{ forceLabel: "Patient Code" }} />
                  <h6>
                    {this.state.patient_code
                      ? this.state.patient_code
                      : "------"}
                  </h6>
                </div>
                <div
                  className="col"
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

            <AlgaehDateHandler
              div={{ className: "col-lg-3" }}
              label={{ forceLabel: "Select Date" }}
              textBox={{ className: "txt-fld", name: "today_date" }}
              events={{
                onChange: datehandle.bind(this, this)
              }}
              value={this.state.today_date}
            />

            <div className="col" style={{ paddingTop: 21, paddingBottom: 10 }}>
              <button
                className="btn btn-default btn-sm"
                type="button"
                onClick={getBillPatientList.bind(this, this)}
              >
                Load Data
              </button>
            </div>

            <div className="col" style={{ paddingTop: 21, paddingBottom: 10 }}>
              <button
                className="btn btn-default btn-sm"
                type="button"
                onClick={Refresh.bind(this, this)}
              >
                Refresh Data
              </button>
            </div>
          </div>

          <div className="portlet portlet-bordered ">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">OP-Bill Pending List</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-lg-12">
                  <AlgaehDataGrid
                    id="precription_list"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              {/* <IconButton
                                color="primary"
                                title="Collection"
                                style={{ maxHeight: "4vh" }}
                              >
                                <Collections
                                // onClick={ListOfItems.bind(this, this, row)}
                                />
                              </IconButton> */}
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 70,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "patient_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Patient Code" }} />
                        ),
                        disabled: false,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "full_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                        ),
                        disabled: true
                      }
                    ]}
                    keyId="patient_code"
                    dataSource={{
                      data: this.state.patient_list
                    }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    patientlist: state.patientlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBillPatientList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OPBillPendingList)
);
