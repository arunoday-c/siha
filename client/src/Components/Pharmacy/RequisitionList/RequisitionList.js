import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "linq";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import { setGlobal } from "../../../utils/GlobalFunctions";
import "./RequisitionList.css";
import "./../../../styles/site.css";

import { LocationchangeTexts, dateFormater } from "./RequisitionListEvent";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";

class RequisitionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      from_location_id: null,
      to_location_id: null,
      requisition_list: []
    };
  }

  componentDidMount() {
    this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      method: "GET",
      redux: {
        type: "LOCATIOS_GET_DATA",
        mappingName: "locations"
      }
    });
  }

  render() {
    debugger;
    return (
      <React.Fragment>
        <div className="hptl-phase1-requisition-list-form">
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Requisition List", align: "ltr" }}
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
                    label={{ forceLabel: "Requisition List", align: "ltr" }}
                  />
                )
              }
            ]}
          />
          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-4" }}
                  label={{ forceLabel: "Location" }}
                  selector={{
                    name: "from_location_id",
                    className: "select-fld",
                    value: this.state.from_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations
                    },
                    onChange: LocationchangeTexts.bind(this, this, "From"),
                    onClear: LocationchangeTexts.bind(this, this, "From")
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-4" }}
                  label={{ forceLabel: "Requested Location" }}
                  selector={{
                    name: "to_location_id",
                    className: "select-fld",
                    value: this.state.to_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations
                    },
                    onChange: LocationchangeTexts.bind(this, this, "To"),
                    onClear: LocationchangeTexts.bind(this, this, "From")
                  }}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                <div className="portlet-body">
                  <AlgaehDataGrid
                    id="RequisitionList_grid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                className="fas fa-flask"
                                onClick={() => {
                                  setGlobal({
                                    "RQ-STD": "RequisitionEntry",
                                    material_requisition_number:
                                      row.material_requisition_number
                                  });
                                  document.getElementById("rq-router").click();
                                }}
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 100,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "material_requisition_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requisition Number" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "requistion_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requistion Date" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {dateFormater(this, row.requistion_date)}
                            </span>
                          );
                        },

                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "left" }
                        }
                      },
                      {
                        fieldName: "from_location_id",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "From Location" }}
                          />
                        ),
                        //created by Adnan
                        displayTemplate: row => {
                          let x;
                          if (
                            this.props.locations !== undefined &&
                            this.props.locations.length !== 0
                          ) {
                            x = Enumerable.from(this.props.locations)
                              .where(
                                w =>
                                  w.hims_d_pharmacy_location_id ===
                                  row.from_location_id
                              )
                              .firstOrDefault();
                          }
                          return (
                            <span>
                              {x !== undefined ? x.location_description : ""}
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                        //created by Adnan
                      },
                      {
                        fieldName: "to_location_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "To Location" }} />
                        ),
                        //created by Adnan
                        displayTemplate: row => {
                          let x;
                          if (
                            this.props.locations !== undefined &&
                            this.props.locations.length !== 0
                          ) {
                            x = Enumerable.from(this.props.locations)
                              .where(
                                w =>
                                  w.hims_d_pharmacy_location_id ===
                                  row.to_location_id
                              )
                              .firstOrDefault();
                          }
                          return (
                            <span>
                              {x !== undefined ? x.location_description : ""}
                            </span>
                          );
                          //created by Adnan
                        },
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      }
                    ]}
                    keyId="material_requisition_number"
                    dataSource={{
                      data: this.state.requisition_list
                    }}
                    noDataText="No data available for location"
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
    locations: state.locations,
    requisitionlist: state.requisitionlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions,
      getRequisitionList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RequisitionList)
);
