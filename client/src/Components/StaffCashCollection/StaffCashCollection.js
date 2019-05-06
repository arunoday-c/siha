import React, { Component } from "react";
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
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import { AlgaehValidation } from "../../utils/GlobalFunctions";
import moment from "moment";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import Enumerable from "linq";
import GlobalVariables from "../../utils/GlobalVariables.json";

class StaffCashCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shifts: [],
      shift_open_date: "DD-MM-YYYY",
      shift_open_time: "--:-- --",
      shift_close_date: "DD-MM-YYYY",
      shift_close_time: "--:-- --",
      difference_cash: 0,
      difference_card: 0,
      difference_cheque: 0,
      cash_collection: [],
      previous_opend_shift: [],
      cashHandoverDetails: []
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
      difference_cash: 0,
      difference_card: 0,
      difference_cheque: 0,
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

  loadDetails(value) {
    debugger;
    this.setState({
      cashHandoverDetails: value.cashiers
    });
    // console.log("cashHandoverDetails:", this.state.cashHandoverDetails);
  }

  authAndCloseShift(status, e) {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        AlgaehLoader({ show: true });

        let send_data = {
          shift_status: status,
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
          module: "frontDesk",
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
              this.setState({
                cashHandoverDetails: []
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
      shift_status: data.shift_status,
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
    this.resetSaveState();
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/frontDesk/getCashHandoverDetails",
          module: "frontDesk",
          method: "GET",
          data: {
            daily_handover_date: this.state.daily_handover_date
          },
          onSuccess: response => {
            AlgaehLoader({ show: false });
            if (response.data.success) {
              this.setState({
                cash_collection: response.data.records.cash_collection,
                previous_opend_shift: response.data.records.previous_opend_shift
              });

              console.log("cash_collection:", this.state.cash_collection);
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
      module: "masterSettings",
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
    const _cash =
      this.state.difference_cash !== undefined &&
      this.state.difference_cash !== ""
        ? parseFloat(this.state.difference_cash)
        : 0;
    const _card =
      this.state.difference_card !== undefined &&
      this.state.difference_card !== ""
        ? parseFloat(this.state.difference_card)
        : 0;
    const _cheque =
      this.state.difference_cheque !== undefined &&
      this.state.difference_cheque !== ""
        ? parseFloat(this.state.difference_cheque)
        : 0;

    return (
      <div className="staffCashCollection">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ fieldName: "staff_cash_collection", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "front_desk",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ fieldName: "staff_cash_collection", align: "ltr" }}
                />
              )
            }
          ]}
        />
        <div className="row" style={{ marginTop: 90 }}>
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col-12" }}
                    label={{
                      fieldName: "shift_date",
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
                  {/* <AlagehAutoComplete
                    div={{ className: "col-12" }}
                    label={{
                      fieldName: "shift_type",
                      isImp: false
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
                      onChange: this.dropDownHandle.bind(this),
                      onClear: () => {
                        this.setState({
                          hims_d_shift_id: null
                        });
                      }
                    }}
                  /> */}
                  <div className="col-12">
                    <button
                      onClick={this.getCashHandoverDetails.bind(this)}
                      className="btn btn-default margin-bottom-15 margin-top-15"
                    >
                      Apply
                    </button>
                  </div>

                  <div className="col-12" id="">
                    <ul className="ulShiftList">
                      {/* <li>
                        <span>
                          Shift Name 1 <small>1</small>
                        </span>
                      </li>
                      <li>
                        <span>
                          Shift Name 2 <small>2</small>
                        </span>
                      </li> */}

                      {this.state.cash_collection.length !== 0 ? (
                        this.state.cash_collection.map((data, index) => (
                          <li
                            description={data.shift_description}
                            shift_id={data.shift_id}
                            key={index}
                            onClick={this.loadDetails.bind(this, data)}
                          >
                            <span>
                              {data.shift_description}{" "}
                              <small>
                                {data.cashiers.length > 0
                                  ? data.cashiers.length
                                  : 0}
                              </small>
                            </span>
                          </li>
                        ))
                      ) : (
                        <span className="noDataStyle">Select Shift Date</span>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="">
                    <h5>All the open shift</h5>
                    <ul className="ulShiftList">
                      {this.state.previous_opend_shift.length !== 0 ? (
                        this.state.previous_opend_shift.map((data, index) => (
                          <li
                            prv_description={data.shift_description}
                            prv_shift_id={data.shift_id}
                            key={index}
                            onClick={this.loadDetails.bind(this, data)}
                          >
                            <span>
                              {data.shift_description}{" "}
                              <small>
                                {data.cashiers.length > 0
                                  ? data.cashiers.length
                                  : 0}
                              </small>
                            </span>
                          </li>
                        ))
                      ) : (
                        <span className="noDataStyle">
                          No Previos Opened Shifts
                        </span>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="portlet portlet-bordered margin-bottom-15">
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
                            <AlgaehLabel
                              label={{ fieldName: "employee_name" }}
                            />
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
                          fieldName: "shift_status",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Shift Status" }}
                            />
                          ),
                          displayTemplate: row => {
                            return row.shift_status === "O" ? (
                              <span className="badge badge-danger">Opened</span>
                            ) : row.shift_status === "C" ? (
                              <span className="badge badge-warning">
                                Closed
                              </span>
                            ) : row.shift_status === "A" ? (
                              <span className="badge badge-success">
                                Authorized
                              </span>
                            ) : (
                              "------"
                            );
                          }
                        },
                        {
                          fieldName: "shift_id",
                          label: (
                            <AlgaehLabel label={{ fieldName: "shift_type" }} />
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
                            <AlgaehLabel
                              label={{ fieldName: "expected_cash" }}
                            />
                          ),
                          others: {
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "actual_cash",
                          label: (
                            <AlgaehLabel label={{ fieldName: "actual_cash" }} />
                          ),
                          others: {
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "difference_cash",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "difference_cash" }}
                            />
                          ),
                          others: {
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "cash_status",
                          label: (
                            <AlgaehLabel label={{ fieldName: "cash_status" }} />
                          ),
                          displayTemplate: row => {
                            return row.cash_status === "T" ? (
                              <span className="badge badge-success">
                                Tallied
                              </span>
                            ) : row.cash_status === "E" ? (
                              <span className="badge badge-warning">
                                Excess
                              </span>
                            ) : row.cash_status === "S" ? (
                              <span className="badge badge-danger">
                                Shortage
                              </span>
                            ) : (
                              "------"
                            );
                          },
                          others: {
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "expected_card",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "expected_card" }}
                            />
                          )
                        },
                        {
                          fieldName: "actual_card",
                          label: (
                            <AlgaehLabel label={{ fieldName: "actual_card" }} />
                          ),
                          others: {
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "difference_card",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "difference_card" }}
                            />
                          ),
                          others: {
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "card_status",
                          label: (
                            <AlgaehLabel label={{ fieldName: "card_status" }} />
                          ),
                          displayTemplate: row => {
                            return row.card_status === "T" ? (
                              <span className="badge badge-success">
                                Tallied
                              </span>
                            ) : row.card_status === "E" ? (
                              <span className="badge badge-warning">
                                Excess
                              </span>
                            ) : row.card_status === "S" ? (
                              <span className="badge badge-danger">
                                Shortage
                              </span>
                            ) : (
                              "------"
                            );
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
                              label={{ fieldName: "expected_cheque" }}
                            />
                          )
                        },
                        {
                          fieldName: "actual_cheque",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "actual_cheque" }}
                            />
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
                              label={{ fieldName: "difference_cheque" }}
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
                            <AlgaehLabel
                              label={{ fieldName: "cheque_status" }}
                            />
                          ),
                          displayTemplate: row => {
                            return row.cheque_status === "T" ? (
                              <span className="badge badge-success">
                                Tallied
                              </span>
                            ) : row.cheque_status === "E" ? (
                              <span className="badge badge-warning">
                                Excess
                              </span>
                            ) : row.cheque_status === "S" ? (
                              <span className="badge badge-danger">
                                Shortage
                              </span>
                            ) : (
                              "------"
                            );
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
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered margin-bottom-15">
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
                            fieldName: "shift_open_date"
                          }}
                        />
                        <h6>{this.state.shift_open_date}</h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "shift_open_time"
                          }}
                        />
                        <h6>{this.state.shift_open_time}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "shift_close_date"
                          }}
                        />
                        <h6>{this.state.shift_close_date}</h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "shift_close_time"
                          }}
                        />
                        <h6>{this.state.shift_close_time}</h6>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12">
                        <AlgaehLabel
                          label={{
                            fieldName: "closed_by"
                          }}
                        />
                        <h6>Head of Department</h6>
                      </div>
                      <AlagehFormGroup
                        div={{ className: "col-lg-12" }}
                        label={{
                          fieldName: "remarks",
                          isImp: false
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "remarks",
                          value: this.state.remarks,
                          disabled: this.state.shift_status === "A",
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
                                  fieldName: "&nbsp;",
                                  isImp: false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "actual_cash",
                                  value: this.state.actual_cash,
                                  disabled: this.state.shift_status === "A",
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
                                  fieldName: "&nbsp;",
                                  isImp: false
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "actual_card",
                                  value: this.state.actual_card,
                                  disabled: this.state.shift_status === "A",
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
                                  disabled: this.state.shift_status === "A",
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
                          <td>{Math.abs(_cash)}</td>
                          <td>{Math.abs(_card)}</td>
                          <td>{Math.abs(_cheque)}</td>
                        </tr>
                        <tr>
                          <td> Status</td>
                          <td>
                            {this.state.cash_status === "T" ? (
                              <span className="badge badge-success">
                                Tallied
                              </span>
                            ) : this.state.cash_status === "E" ? (
                              <span className="badge badge-warning">
                                Excess
                              </span>
                            ) : this.state.cash_status === "S" ? (
                              <span className="badge badge-danger">
                                Shortage
                              </span>
                            ) : (
                              "------"
                            )}
                          </td>
                          <td>
                            {this.state.card_status === "T" ? (
                              <span className="badge badge-success">
                                Tallied
                              </span>
                            ) : this.state.card_status === "E" ? (
                              <span className="badge badge-warning">
                                Excess
                              </span>
                            ) : this.state.card_status === "S" ? (
                              <span className="badge badge-danger">
                                Shortage
                              </span>
                            ) : (
                              "------"
                            )}
                          </td>
                          <td>
                            {this.state.cheque_status === "T" ? (
                              <span className="badge badge-success">
                                Tallied
                              </span>
                            ) : this.state.cheque_status === "E" ? (
                              <span className="badge badge-warning">
                                Excess
                              </span>
                            ) : this.state.cheque_status === "S" ? (
                              <span className="badge badge-danger">
                                Shortage
                              </span>
                            ) : (
                              "------"
                            )}
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
                          disabled={
                            this.state.shift_status === "C" ||
                            this.state.shift_status === "A"
                          }
                          onClick={this.authAndCloseShift.bind(this, "C")}
                          className="btn btn-primary"
                          style={{ marginLeft: 10, float: "right" }}
                        >
                          Close Shift
                        </button>
                        <button
                          disabled={this.state.shift_status === "A"}
                          onClick={this.authAndCloseShift.bind(this, "A")}
                          className="btn btn-primary"
                          style={{ marginLeft: 10, float: "right" }}
                        >
                          Authorize Shift
                        </button>
                      </div>
                    </div>
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

export default StaffCashCollection;
