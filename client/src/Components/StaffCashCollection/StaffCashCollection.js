import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
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

let records = [
  {
    employee_name: "Zareena",
    shift_type: "Night",
    counter: "Counter 1",
    expected_cash: 5000,
    actual_cash: 5000,
    cash_difference: 0,
    cash_status: "Closed",
    expected_credit: 5000,
    actual_credit: 5000,
    credit_difference: 0,
    credit_status: "Closed",
    expected_cheque: 5000,
    actual_cheque: 5000,
    cheque_difference: 0,
    cheque_status: "Closed"
  },
  {
    employee_name: "Khaleel",
    shift_type: "Night",
    counter: "Counter 1",
    expected_cash: 5000,
    actual_cash: 5000,
    cash_difference: 0,
    cash_status: "Closed",
    expected_credit: 5000,
    actual_credit: 5000,
    credit_difference: 0,
    credit_status: "Closed",
    expected_cheque: 5000,
    actual_cheque: 5000,
    cheque_difference: 0,
    cheque_status: "Closed"
  },
  {
    employee_name: "Shakeel",
    shift_type: "Night",
    counter: "Counter 1",
    expected_cash: 5000,
    actual_cash: 5000,
    cash_difference: 0,
    cash_status: "Closed",
    expected_credit: 5000,
    actual_credit: 5000,
    credit_difference: 0,
    credit_status: "Closed",
    expected_cheque: 5000,
    actual_cheque: 5000,
    cheque_difference: 0,
    cheque_status: "Closed"
  }
];

class InvestigationSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shifts: []
    };
    this.getShifts();
  }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value });
  }

  getShifts() {
    algaehApiCall({
      uri: "/shiftAndCounter/getShiftMaster",
      data: { shift_status: "A" },
      cancelRequestId: "getShiftMaster",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            shifts: response.data.records
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
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
                  name: "hims_d_shift_id",
                  className: "select-fld",
                  value: this.state.hims_d_shift_id,
                  dataSource: {
                    textField: "shift_description",
                    valueField: "hims_d_shift_id",
                    data: this.state.shifts
                  },
                  onChange: this.dropDownHandle.bind(this)
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
                      fieldName: "employee_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "shift_type",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Shift Type" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "counter",
                      label: <AlgaehLabel label={{ forceLabel: "Counter" }} />,
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "expected_cash",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Expected Cash" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "actual_cash",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Actual Cash" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "cash_difference",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Cash Diffrence" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "cash_status",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Cash Status" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "expected_credit",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Expected Credit" }}
                        />
                      )
                    },
                    {
                      fieldName: "actual_credit",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Actual Credit" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "credit_difference",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Credit Diffrence" }}
                        />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "credit_status",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },

                    {
                      fieldName: "expected_cheque",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Expected Cheque" }}
                        />
                      )
                    },
                    {
                      fieldName: "actual_cheque",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Actual Cheque" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "cheque_difference",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Cheque Diffrence" }}
                        />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "cheque_status",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Cheque Status" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    }
                  ]}
                  keyId="hims_f_cash_handover_detail_id"
                  dataSource={{
                    data: records
                  }}
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
                      Authorize
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
