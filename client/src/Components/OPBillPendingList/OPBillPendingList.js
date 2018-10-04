import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Collections from "@material-ui/icons/Collections";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";

import "./OPBillPendingList.css";
import "./../../styles/site.css";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler,
  Tooltip
} from "../Wrapper/algaehWrapper";

import {
  getBillPatientList,
  PatientSearch,
  Refresh,
  datehandle
} from "./OPBillPendingListEvents";

import IconButton from "@material-ui/core/IconButton";
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
          <div
            className="container-fluid"
            style={{ marginTop: "85px", minHeight: "80vh" }}
          >
            <div className="row">
              <AlgaehDateHandler
                div={{ className: "col-lg-2" }}
                label={{ forceLabel: "Select Date" }}
                textBox={{ className: "txt-fld", name: "today_date" }}
                events={{
                  onChange: datehandle.bind(this, this)
                }}
                value={this.state.today_date}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-2" }}
                label={{
                  forceLabel: "Patient Code"
                }}
                textBox={{
                  value: this.state.patient_code,
                  className: "txt-fld",
                  name: "patient_code",

                  events: {
                    onChange: null
                  },
                  others: {
                    disabled: true
                  }
                }}
              />
              <div className="col-lg-1 form-group">
                <span
                  className="fas fa-search fa-2x"
                  onClick={PatientSearch.bind(this, this)}
                />
              </div>

              <div className="col-lg-4"> &nbsp; </div>

              <div className="col-lg-1" style={{ paddingTop: "4vh" }}>
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  onClick={getBillPatientList.bind(this, this)}
                >
                  Load Data
                </button>
              </div>

              <div className="col-lg-1"> &nbsp; </div>

              <div className="col-lg-1">
                <Tooltip id="tooltip-icon" title="Refresh">
                  <IconButton className="go-button" color="primary">
                    <i
                      className="fas fa-sync-alt"
                      aria-hidden="true"
                      onClick={Refresh.bind(this, this)}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            <div className="row form-details">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="precription_list"
                  columns={[
                    {
                      fieldName: "patient_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient Code" }} />
                      ),
                      disabled: false
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                      ),
                      disabled: true
                    },

                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <IconButton
                              color="primary"
                              title="Collection"
                              style={{ maxHeight: "4vh" }}
                            >
                              <Collections
                              // onClick={ListOfItems.bind(this, this, row)}
                              />
                            </IconButton>
                          </span>
                        );
                      }
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
