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
import { AlgaehValidation } from "../../utils/GlobalFunctions";
import moment from "moment";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import Enumerable from "linq";

class InvestigationSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shifts: [],
      shift_open_date: "DD-MM-YYYY",
      shift_open_time: "--:-- --",
      shift_close_date: "DD-MM-YYYY",
      shift_close_time: "--:-- --"
    };
    this.getShifts();
  }

  resetSaveState() {
    this.setState({
      hims_f_cash_handover_detail_id: "",
      actual_cash: "",
      actual_card: "",
      actual_cheque: "",
      expected_cash: "",
      expected_card: "",
      expected_cheque: "",
      difference_cash: "",
      difference_card: "",
      difference_cheque: "",
      cash_status: "",
      card_status: "",
      cheque_status: "",
      shift_open_date: "DD-MM-YYYY",
      shift_open_time: "--:-- --",
      shift_close_date: "DD-MM-YYYY",
      shift_close_time: "--:-- --",
      remarks: ""
    });
  }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value });
  }

  authAndCloseShift(e) {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        AlgaehLoader({ show: true });

        let send_data = {
          shift_status: "A",
          close_date: new Date(),
          close_by: 1,
          actual_cash: this.state.actual_cash,
          difference_cash: this.state.difference_cash,
          cash_status: this.state.cash_status,
          actual_card: this.state.actual_card,
          difference_card: this.state.difference_card,
          card_status: this.state.card_status,
          actual_cheque: this.state.actual_cheque,
          difference_cheque: this.state.difference_cheque,
          cheque_status: this.state.cheque_status,
          remarks: this.state.remarks,
          hims_f_cash_handover_detail_id: this.state
            .hims_f_cash_handover_detail_id
        };

        algaehApiCall({
          uri: "/frontDesk/updateCashHandoverDetails",
          method: "PUT",
          data: send_data,
          onSuccess: response => {
            AlgaehLoader({ show: false });
            if (response.data.success) {
              swalMessage({
                title: "Shift Closed",
                type: "success"
              });

              this.getCashHandoverDetails();
            }
          },
          onFailure: error => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  changeTexts(e) {
    switch (e.target.name) {
      case "actual_cash":
        this.setState(
          {
            [e.target.name]: e.target.value,
            difference_cash: this.state.expected_cash - e.target.value
          },
          () => {
            this.setState({
              cash_status:
                this.state.difference_cash < 0
                  ? "E"
                  : this.state.difference_cash > 0
                  ? "S"
                  : this.state.difference_cash === 0
                  ? "T"
                  : null
            });
          }
        );

        break;
      case "actual_card":
        this.setState(
          {
            [e.target.name]: e.target.value,
            difference_card: this.state.expected_card - e.target.value
          },
          () => {
            this.setState({
              card_status:
                this.state.difference_card < 0
                  ? "E"
                  : this.state.difference_card > 0
                  ? "S"
                  : this.state.difference_card === 0
                  ? "T"
                  : null
            });
          }
        );
        break;
      case "actual_cheque":
        this.setState(
          {
            [e.target.name]: e.target.value,
            difference_cheque: this.state.expected_cheque - e.target.value
          },
          () => {
            this.setState({
              cheque_status:
                this.state.difference_cheque < 0
                  ? "E"
                  : this.state.difference_cheque > 0
                  ? "S"
                  : this.state.difference_cheque === 0
                  ? "T"
                  : null
            });
          }
        );

        break;
      default:
        this.setState({
          [e.target.name]: e.target.value
        });
        break;
    }
  }

  selectCashier(data, e) {
    debugger;

    this.setState({
      hims_f_cash_handover_detail_id: data.hims_f_cash_handover_detail_id,
      actual_cash: data.actual_cash,
      actual_card: data.actual_card,
      actual_cheque: data.actual_cheque,
      expected_cash: data.expected_cash,
      expected_card: data.expected_card,
      expected_cheque: data.expected_cheque,
      difference_cash: data.difference_cash,
      difference_card: data.difference_card,
      difference_cheque: data.difference_cheque,
      cash_status: data.cash_status,
      card_status: data.card_status,
      cheque_status: data.cheque_status,
      shift_open_date: moment(data.open_date).isValid()
        ? moment(data.open_date).format("DD-MM-YYYY")
        : "DD-MM-YYYY",
      shift_open_time: moment(data.open_date).isValid()
        ? moment(data.open_date).format("hh:mm A")
        : "--:-- --",
      shift_close_date: moment(data.close_date).isValid()
        ? moment(data.close_date).format("DD-MM-YYYY")
        : "DD-MM-YYYY",
      shift_close_time: moment(data.close_date).isValid()
        ? moment(data.close_date).format("hh:mm A")
        : "--:-- --",
      remarks: data.remarks
    });
  }

  getCashHandoverDetails(e) {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/frontDesk/getCashHandoverDetails",
          method: "GET",
          data: {
            shift_id: this.state.hims_d_shift_id,
            daily_handover_date: this.state.daily_handover_date
          },
          onSuccess: response => {
            AlgaehLoader({ show: false });
            if (response.data.success) {
              this.setState({
                cashHandoverDetails: response.data.records
              });
            }
          },
          onFailure: error => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  getShifts() {
    algaehApiCall({
      uri: "/shiftAndCounter/getShiftMaster",
      data: { shift_status: "A" },
      cancelRequestId: "getShiftMaster1",
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
                  forceLabel: "Shift Type",
                  isImp: true
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
                  forceLabel: "Shift Date",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "daily_handover_date"
                }}
                maxDate={new Date()}
                events={{
                  onChange: selDate => {
                    this.setState({
                      daily_handover_date: selDate
                    });
                  }
                }}
                value={this.state.daily_handover_date}
              />
              <div className="col-lg-3">
                <button
                  onClick={this.getCashHandoverDetails.bind(this)}
                  className="btn btn-default"
                  style={{ marginTop: 21 }}
                >
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
                      },
                      displayTemplate: data => {
                        return (
                          <span
                            className="pat-code"
                            onClick={this.selectCashier.bind(this, data)}
                          >
                            {data.employee_name}
                          </span>
                        );
                      },
                      className: row => {
                        return "greenCell";
                      }
                    },
                    {
                      fieldName: "shift_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Shift Type" }} />
                      ),
                      displayTemplate: row => {
                        let x = Enumerable.from(this.state.shifts)
                          .where(w => w.hims_d_shift_id === row.shift_id)
                          .firstOrDefault();
                        return <span>{x.shift_description}</span>;
                      },
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
                      fieldName: "difference_cash",
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
                      displayTemplate: row => {
                        return row.cash_status === "T"
                          ? "Tallied"
                          : row.cash_status === "E"
                          ? "Excess"
                          : row.cash_status === "S"
                          ? "Shortage"
                          : "------";
                      },
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "expected_card",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Expected Card" }} />
                      )
                    },
                    {
                      fieldName: "actual_card",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Actual Card" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "difference_card",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Card Diffrence" }} />
                      ),
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "card_status",
                      label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                      displayTemplate: row => {
                        return row.card_status === "T"
                          ? "Tallied"
                          : row.card_status === "E"
                          ? "Excess"
                          : row.card_status === "S"
                          ? "Shortage"
                          : "------";
                      },
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
                      fieldName: "difference_cheque",
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
                      displayTemplate: row => {
                        return row.cheque_status === "T"
                          ? "Tallied"
                          : row.cheque_status === "E"
                          ? "Excess"
                          : row.cheque_status === "S"
                          ? "Shortage"
                          : "------";
                      },
                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    }
                  ]}
                  keyId="hims_f_cash_handover_detail_id"
                  dataSource={{
                    data: this.state.cashHandoverDetails
                  }}
                  //filter={true}
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
                    <h6>{this.state.shift_open_date}</h6>
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Shift Open Time"
                      }}
                    />
                    <h6>{this.state.shift_open_time}</h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Shift Close Date"
                      }}
                    />
                    <h6>{this.state.shift_close_date}</h6>
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Shift Close Time"
                      }}
                    />
                    <h6>{this.state.shift_close_time}</h6>
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
                      name: "remarks",
                      value: this.state.remarks,
                      others: {
                        multiline: true,
                        rows: "3"
                      },
                      events: {
                        onChange: this.changeTexts.bind(this)
                      }
                    }}
                  />
                </div>
              </div>
              <div
                className="col-lg-8"
                style={{ borderLeft: "1px solid #e5e5e5" }}
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
                      <td>{this.state.expected_cash}</td>
                      <td>{this.state.expected_card}</td>
                      <td>{this.state.expected_cheque}</td>
                    </tr>
                    <tr>
                      <td>Collected</td>
                      <td>
                        <span className="row">
                          <AlagehFormGroup
                            div={{ className: "col" }}
                            label={{
                              fieldName: "asdfasdf",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "actual_cash",
                              value: this.state.actual_cash,
                              events: {
                                onChange: this.changeTexts.bind(this)
                              },
                              others: {
                                type: "number",
                                min: 0
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
                              fieldName: "asdfasdf",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "actual_card",
                              value: this.state.actual_card,
                              events: {
                                onChange: this.changeTexts.bind(this)
                              },
                              others: {
                                type: "number",
                                min: 0
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
                              fieldName: "asdasdf",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "actual_cheque",
                              value: this.state.actual_cheque,
                              events: {
                                onChange: this.changeTexts.bind(this)
                              }
                            }}
                          />
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Difference</td>
                      <td>{this.state.difference_cash}</td>
                      <td>{this.state.difference_card}</td>
                      <td>{this.state.difference_cheque}</td>
                    </tr>
                    <tr>
                      <td> Status</td>
                      <td>
                        {this.state.cash_status === "T"
                          ? "Tallied"
                          : this.state.cash_status === "E"
                          ? "Excess"
                          : this.state.cash_status === "S"
                          ? "Shortage"
                          : "------"}
                      </td>
                      <td>
                        {this.state.card_status === "T"
                          ? "Tallied"
                          : this.state.card_status === "E"
                          ? "Excess"
                          : this.state.card_status === "S"
                          ? "Shortage"
                          : "------"}
                      </td>
                      <td>
                        {this.state.cheque_status === "T"
                          ? "Tallied"
                          : this.state.cheque_status === "E"
                          ? "Excess"
                          : this.state.cheque_status === "S"
                          ? "Shortage"
                          : "------"}
                      </td>
                    </tr>
                    {/* <tr>
                      <td />
                      <td />
                      <td style={{ textAlign: "right" }}>Company</td>
                      <td>0.00</td>
                    </tr> */}
                  </tbody>
                </table>
                <div className="col-lg-12">
                  <div className="row">
                    <button
                      onClick={this.authAndCloseShift.bind(this)}
                      className="btn btn-primary"
                      style={{ marginLeft: 10, float: "right" }}
                    >
                      Authorize and Close Shift
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
