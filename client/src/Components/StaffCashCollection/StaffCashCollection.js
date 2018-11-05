import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Enumerable from "linq";
import "./StaffCashCollection.css";
import "../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDateHandler
} from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";

import BreadCrumb from "../common/BreadCrumb/BreadCrumb";

class InvestigationSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      Investigations: [],
      InvestigationName: [],
      test_id: null,
      investigation_type: null,
      category_id: null,
      lab_section_id: null,
      specimen_id: null,
      hims_d_investigation_test_id: null,
      InvestigationPop: {}
    };
  }

  render() {
    return (
      <div className="staffCashCollection">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Staff Cash Collection", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Front Desk",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ forceLabel: "Staff Cash Collection", align: "ltr" }}
                />
              )
            }
          ]}
        />

        <div
          className="row inner-top-search"
          style={{ marginTop: 77, paddingBottom: 10 }}
        >
          <div className="col-lg-12">
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Shift Type"
                }}
                selector={{
                  name: "shift_type",
                  className: "select-fld",
                  value: "",
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: ""
                  },
                  onChange: null
                }}
              />
              <AlgaehDateHandler
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Shift Date"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "shift_date"
                }}
                maxDate={new Date()}
                events={{
                  onChange: null
                }}
                value=""
              />
              <div className="col-lg-3">
                <button className="btn btn-default" style={{ marginTop: 21 }}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Investigation Lists</h3>
            </div>
            <div className="actions" />
          </div> */}
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="staffCashCollectionGrid_Cntr">
                <AlgaehDataGrid
                  id="staffCashCollection_grid"
                  columns={[
                    {
                      fieldName: "Employee Name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "Shift Type",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Shift Type" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "Counter",
                      label: <AlgaehLabel label={{ forceLabel: "Counter" }} />,
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "Expected",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Total Expected" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "Collected",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Total Collected" }}
                        />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "Difference",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Total Diffrence" }}
                        />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "Status",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    }
                  ]}
                  keyId=""
                  dataSource={{}}
                  // isEditable={true}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Shift Details</h3>
            </div>
            <div className="actions" />
          </div> */}
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-4">
                <div className="row">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Shift Open Date"
                      }}
                    />
                    <h6>11/112018</h6>
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Shift Open Time"
                      }}
                    />
                    <h6>08:00 AM</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Shift Close Date"
                      }}
                    />
                    <h6>11/112018</h6>
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Shift Close Time"
                      }}
                    />
                    <h6>08:00 AM</h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Closed By"
                      }}
                    />
                    <h6>Head of Department</h6>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-12" }}
                    label={{
                      forceLabel: "Remarks",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      others: {
                        multiline: true,
                        rows: "3"
                      },
                      events: {
                        onChange: null
                      }
                    }}
                  />
                </div>
              </div>
              <div
                className="col-lg-8"
                style={{ borderLeft: " 1px solid #e5e5e5" }}
              >
                <table className="table table-responsive  table-sm table-bordered">
                  <tbody>
                    <tr>
                      <td />
                      <td>Cash</td>
                      <td>Credit/Debit Card</td>
                      <td>Cheque</td>
                    </tr>
                    <tr>
                      <td>Expected</td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                    </tr>
                    <tr>
                      <td>Collected</td>
                      <td>
                        <span className="row">
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              fieldName: "",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "",
                              value: "",
                              events: {
                                onChange: null
                              }
                            }}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="row">
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              fieldName: "",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "",
                              value: "",
                              events: {
                                onChange: null
                              }
                            }}
                          />
                        </span>
                      </td>
                      <td>
                        <span className="row">
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              fieldName: "",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "",
                              value: "",
                              events: {
                                onChange: null
                              }
                            }}
                          />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Difference</td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                    </tr>
                    <tr>
                      <td />
                      <td>Tallied</td>
                      <td>Tallied</td>
                      <td>Tallied</td>
                    </tr>
                    <tr>
                      <td />
                      <td />
                      <td style={{ textAlign: "right" }}>Company</td>
                      <td>0.00</td>
                    </tr>
                  </tbody>
                </table>
                <div className="col-lg-12">
                  <div className="row">
                    <button
                      className="btn btn-primary"
                      style={{ marginLeft: 10, float: "right" }}
                    >
                      Authorize Cash Collection
                    </button>
                    <button
                      className="btn btn-default"
                      style={{ float: "right" }}
                    >
                      Close Shift
                    </button>
                  </div>
                </div>
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
    investigationdetails: state.investigationdetails,
    testcategory: state.testcategory,
    labspecimen: state.labspecimen,
    labsection: state.labsection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getInvestigationDetails: AlgaehActions,
      getTestCategory: AlgaehActions,
      getLabSpecimen: AlgaehActions,
      getLabsection: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvestigationSetup)
);
