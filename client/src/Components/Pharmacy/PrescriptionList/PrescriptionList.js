import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import Collections from "@material-ui/icons/Collections";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";

import "./PrescriptionList.css";
import "./../../../styles/site.css";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import IconButton from "@material-ui/core/IconButton";
import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";

class PrescriptionList extends Component {
  constructor(props) {
    super(props);
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-prescription-list-form">
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Prescription List", align: "ltr" }}
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
                    label={{ forceLabel: "Prescription List", align: "ltr" }}
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
                textBox={{ className: "txt-fld", name: "to_date" }}
                events={{
                  onChange: null
                }}
                value={this.state.to_date}
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
                  //   onClick={PatientSearch.bind(this, this)}
                />
              </div>

              <div className="col-lg-1">
                <IconButton className="go-button" color="primary">
                  <PlayCircleFilled
                  // onClick={getSampleCollectionDetails.bind(this, this)}
                  />
                </IconButton>
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
                      fieldName: "ordered_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "ordered_date" }} />
                      ),
                      //   displayTemplate: row => {
                      //     return (
                      //       <span>{this.changeDateFormat(row.ordered_date)}</span>
                      //     );
                      //   },
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
                              // onClick={this.ShowCollectionModel.bind(
                              //   this,
                              //   row
                              // )}
                              />
                            </IconButton>
                          </span>
                        );
                      }
                    }
                  ]}
                  keyId="patient_code"
                  dataSource={{
                    data: this.state.sample_collection
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
    samplecollection: state.samplecollection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSampleCollection: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PrescriptionList)
);
