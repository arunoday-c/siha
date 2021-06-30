import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "linq";

import "./PortalLabList.scss";
import "./../../../styles/site.scss";

import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";

import sockets from "../../../sockets";
import {
  AlgaehDateHandler,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehAutoComplete,
} from "algaeh-react-components";
class PortalLabList extends Component {
  constructor(props) {
    super(props);
    this.socket = sockets;
    this.state = {
      to_date: new Date(),
      from_date: new Date(),
      patient_code: null,
      patient_name: null,
      patient_id: null,
      sample_collection: [],
      selected_patient: null,
      isOpen: false,
      proiorty: null,
      status: null,
      isMicroOpen: false,
      comments_data: [],
      attached_files: [],
      attached_docs: [],
      saveEnable: true,
      lab_id_number: "",
      investigation_test_id: null,
    };
  }

  changeDateFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.datetimeFormat);
    }
  };

  changeTimeFormat = (date) => {
    if (date != null) {
      return moment(date).format(Options.timeFormat);
    }
  };

  render() {
    return (
      <>
        <div className="hptl-phase1-result-entry-form">
          <div
            className="row inner-top-search"
            style={{ paddingBottom: "10px" }}
          >
            <AlgaehDateHandler
              div={{ className: "col-2" }}
              label={{ fieldName: "from_date", isImp: true }}
              textBox={{ className: "txt-fld", name: "from_date" }}
              events={{}}
              value={this.state.from_date}
            />
            <AlgaehDateHandler
              div={{ className: "col-2" }}
              label={{ fieldName: "to_date", isImp: true }}
              textBox={{ className: "txt-fld", name: "to_date" }}
              events={
                {
                  // onChange: datehandle.bind(this, this),
                }
              }
              value={this.state.to_date}
            />
            <AlgaehAutoComplete
              div={{ className: "col-2" }}
              label={{
                forceLabel: "Filter by Company",
              }}
              selector={{
                dataSource: {
                  textField: "text",
                  valueField: "value",
                  data: [
                    { text: "Company 1", value: "" },
                    { text: "Company 2", value: "" },
                    // { text: "Unsent", value: "US" },
                  ],
                },
              }}
            />
            <div className="col" style={{ marginTop: "21px" }}>
              <button className="btn btn-default btn-sm" type="button">
                Clear
              </button>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginLeft: "10px" }}
                type="button"
              >
                Load
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Portal Lab List</h3>
                  </div>
                </div>

                <div className="portlet-body" id="resultListEntryCntr">
                  <AlgaehDataGrid
                    id="samplecollection_grid"
                    columns={[
                      {
                        label: <input type="checkbox" />,
                        fieldName: "select",

                        others: {
                          width: 30,
                          filterable: false,
                          sortable: false,
                        },
                      },
                      {
                        fieldName: "run_types",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Company Name" }} />
                        ),

                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "full_name",
                        label: (
                          <AlgaehLabel label={{ fieldName: "patient_name" }} />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "left" },
                        },
                      },
                      {
                        fieldName: "service_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "No. of Tests" }} />
                        ),

                        disabled: true,
                        others: {
                          width: 110,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "primary_id_no",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Primary ID Type" }}
                          />
                        ),
                        disabled: false,
                        others: {
                          width: 150,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      {
                        fieldName: "primary_id_no",
                        label: (
                          <AlgaehLabel label={{ fieldName: "primary_id_no" }} />
                        ),
                        disabled: false,
                        others: {
                          width: 150,
                          resizable: false,
                          style: { textAlign: "center" },
                        },
                      },
                      // {
                      //   fieldName: "patient_code",
                      //   label: (
                      //     <AlgaehLabel label={{ fieldName: "patient_code" }} />
                      //   ),
                      //   disabled: false,
                      //   others: {
                      //     maxWidth: 150,
                      //     resizable: false,
                      //     style: { textAlign: "center" },
                      //   },
                      // },

                      {
                        fieldName: "full_name",
                        label: (
                          <AlgaehLabel label={{ fieldName: "nationality" }} />
                        ),
                        disabled: true,
                        others: {
                          width: 150,
                          resizable: false,
                          style: { textAlign: "left" },
                        },
                      },
                      {
                        fieldName: "full_name",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "contact_number" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          width: 150,
                          resizable: false,
                          style: { textAlign: "left" },
                        },
                      },
                      // {
                      //   fieldName: "full_name",
                      //   label: <AlgaehLabel label={{ fieldName: "email" }} />,
                      //   disabled: true,
                      //   others: {
                      //     resizable: false,
                      //     style: { textAlign: "left" },
                      //   },
                      // },
                    ]}
                    keyId="patient_code"
                    data={Enumerable.from(this.state.sample_collection)
                      .where((w) => w.sample_status === "A")
                      .toArray()}
                    pagination={true}
                    // editable
                    // actionsStyle={{width:100}}
                    pageOptions={{ rows: 20, page: 1 }}
                    isFilterable={true}
                    noDataText="No data available for selected period"

                    // keyId="patient_code"
                    // dataSource={{
                    //   data: Enumerable.from(this.state.sample_collection)
                    //     .where((w) => w.sample_status === "A")
                    //     .toArray(),
                    // }}
                    // filter={true}
                    // noDataText="No data available for selected period"
                    // paging={{ page: 0, rowsPerPage: 20 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                className="btn btn-primary"

                // onClick={}
              >
                Bulk Process
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    samplecollection: state.samplecollection,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSampleCollection: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PortalLabList)
);
