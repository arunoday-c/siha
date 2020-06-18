import React, { Component } from "react";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";
import "./StaffCashCollection.scss";
import "../../styles/site.scss";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup,
  AlgaehDateHandler,
} from "../Wrapper/algaehWrapper";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import { AlgaehValidation } from "../../utils/GlobalFunctions";
import moment from "moment";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import Enumerable from "linq";

class StaffCashCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      daily_handover_date: new Date(),
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
      cashHandoverDetails: [],
    };
    this.getShifts();
    this.getCashHandoverDetails();
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
      remarks: "",
    });
  }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value });
  }

  loadDetails(value) {
    this.setState({
      cashHandoverDetails: value.cashiers,
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
            .hims_f_cash_handover_detail_id,
        };

        algaehApiCall({
          uri: "/frontDesk/updateCashHandoverDetails",
          module: "frontDesk",
          method: "PUT",
          data: send_data,
          onSuccess: (response) => {
            AlgaehLoader({ show: false });
            if (response.data.success) {
              swalMessage({
                title: "Shift Closed",
                type: "success",
              });

              this.getCashHandoverDetails();
              this.setState({
                cashHandoverDetails: [],
              });
            }
          },
          onFailure: (error) => {
            AlgaehLoader({ show: false });
            let message = error.message;
            if (error.message.startsWith("Incorrect decimal value")) {
              message = "Please enter proper amount";
            }
            swalMessage({
              title: message,
              type: "error",
            });
          },
        });
      },
    });
  }

  handleCollection(e) {
    const { name, value } = e.target;

    let diff_prefix = "difference_";
    let exp_prefix = "expected_";
    let status_suffix = "_status";

    //getting the payment mode
    const [_, mode] = name.split("_");

    if (value && value > 0) {
      let diff = this.state[exp_prefix + mode] - value;
      let status = this.checkStatus(diff);
      this.setState({
        [name]: value,
        [diff_prefix + mode]: diff,
        [mode + status_suffix]: status,
      });
    } else {
      this.setState({
        [name]: "",
        [diff_prefix + mode]: 0,
        [mode + status_suffix]: null,
      });
    }
  }

  checkStatus(diff) {
    if (diff) {
      return diff < 0 ? "E" : diff > 0 ? "S" : diff === 0 ? "T" : null;
    }
  }

  selectCashier(data, e) {
    const {
      actual_card,
      actual_cash,
      actual_cheque,
      expected_card,
      expected_cash,
      expected_cheque,
    } = data;
    this.setState(
      {
        hims_f_cash_handover_detail_id: data.hims_f_cash_handover_detail_id,
        actual_cash,
        actual_card,
        actual_cheque,
        expected_cash,
        expected_card,
        expected_cheque,
        difference_cash: expected_cash - actual_cash,
        difference_card: expected_card - actual_card,
        difference_cheque: expected_cheque - actual_cheque,
        shift_status: data.shift_status,
        collected_cash: data.collected_cash,
        refunded_cash: data.refunded_cash,
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
        remarks: data.remarks,
      },
      () =>
        this.setState({
          cash_status: this.checkStatus(this.state.difference_cash),
          card_status: this.checkStatus(this.state.difference_card),
          cheque_status: this.checkStatus(this.state.difference_cheque),
        })
    );
  }

  disableBtn = (btn) => {
    const { shift_status, hims_f_cash_handover_detail_id } = this.state;
    let status;
    if (btn === "C") {
      status = shift_status === "C" || shift_status === "A";
    } else if (btn === "A") {
      status = shift_status === "A";
    }
    return status || hims_f_cash_handover_detail_id === "";
  };

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
            daily_handover_date: this.state.daily_handover_date,
          },
          onSuccess: (response) => {
            AlgaehLoader({ show: false });
            if (response.data.success) {
              this.setState({
                cash_collection: response.data.records.cash_collection,
                previous_opend_shift:
                  response.data.records.previous_opend_shift,
              });
            }
          },
          onFailure: (error) => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.message,
              type: "error",
            });
          },
        });
      },
    });
  }

  getShifts() {
    algaehApiCall({
      uri: "/shiftAndCounter/getShiftMaster",
      module: "masterSettings",
      data: { shift_status: "A" },
      cancelRequestId: "getShiftMaster1",
      method: "GET",
      onSuccess: (response) => {
        if (response.data.success) {
          this.setState({
            shifts: response.data.records,
          });
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }

  changeTexts(e) {
    const { name, value } = e.target;
    this.setState(
      {
        [name]: value,
      },
      () => console.log(this.state, "state from handle")
    );
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
                    align: "ltr",
                  }}
                />
              ),
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ fieldName: "staff_cash_collection", align: "ltr" }}
                />
              ),
            },
          ]}
        />
        <div className="row" style={{ marginTop: 90 }}>
          <div className="col-3">
            <div
              className="portlet portlet-bordered margin-bottom-15"
              style={{ paddingBottom: 0 }}
            >
              <div className="portlet-body">
                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col-8 form-group" }}
                    label={{
                      fieldName: "shift_date",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "daily_handover_date",
                      // value: new Date()
                    }}
                    maxDate={new Date()}
                    events={{
                      onChange: (selDate) => {
                        this.setState({
                          daily_handover_date: selDate,
                        });
                      },
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
                  <div className="col-4">
                    <button
                      onClick={this.getCashHandoverDetails.bind(this)}
                      className="btn btn-primary float-right"
                      style={{ marginTop: 19 }}
                    >
                      Apply
                    </button>
                  </div>

                  <div className="col-12 ulShiftList" id="">
                    {this.state.cash_collection.length !== 0 ? (
                      this.state.cash_collection.map((data, index) => (
                        <div
                          description={data.shift_description}
                          shift_id={data.shift_id}
                          key={index}
                          onClick={this.loadDetails.bind(this, data)}
                          className="row eachShift"
                        >
                          {/* <small>Shift Name</small>
                            <p> {data.shift_description}</p>
                            <small>Shift Date</small>
                            <p> {data.daily_handover_date}</p>
                            <small>Staff Count</small>
                            <p>{data.cashiers.length > 0 ? data.cashiers.length : 0}</p> */}

                          <div className="col-10" style={{ paddingRight: 0 }}>
                            <h5 style={{ marginBottom: 0 }}>
                              {data.shift_description}
                            </h5>
                            <p>{data.daily_handover_date}</p>
                          </div>
                          <div className="col-2" style={{ paddingLeft: 0 }}>
                            <span className="staffCount">
                              {data.cashiers.length > 0
                                ? data.cashiers.length
                                : 0}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="noDataStyle">Select Shift Date</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="portlet portlet-bordered margin-bottom-15"
              style={{ paddingBottom: 0 }}
            >
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12">
                    <h5 style={{ marginBottom: 15 }}>All the open shift</h5>
                  </div>
                  <div className="col-12 ulShiftList" id="">
                    {this.state.previous_opend_shift.length !== 0 ? (
                      this.state.previous_opend_shift.map((data, index) => (
                        <div
                          prv_description={data.shift_description}
                          prv_shift_id={data.shift_id}
                          key={index}
                          onClick={this.loadDetails.bind(this, data)}
                          className="row eachShift"
                        >
                          <div className="col-10" style={{ paddingRight: 0 }}>
                            <h5 style={{ marginBottom: 0 }}>
                              {data.shift_description}
                            </h5>
                            <p>{data.daily_handover_date}</p>
                          </div>
                          <div className="col-2" style={{ paddingLeft: 0 }}>
                            <span className="staffCount">
                              {data.cashiers.length > 0
                                ? data.cashiers.length
                                : 0}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="noDataStyle">
                        Relax! No more Open Shift Available.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div
              className="portlet portlet-bordered margin-bottom-15"
              style={{ paddingBottom: 0 }}
            >
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
                          fieldName: "employee_code",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Emp. Code" }} />
                          ),
                          others: {
                            maxWidth: 130,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "employee_name",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Emp. Name" }} />
                          ),
                          displayTemplate: (data) => {
                            return (
                              <span
                                className="pat-code"
                                onClick={this.selectCashier.bind(this, data)}
                              >
                                {data.employee_name}
                              </span>
                            );
                          },
                          className: (row) => {
                            return "greenCell";
                          },
                          others: {
                            minWidth: 200,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "shift_status",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Shift Status" }}
                            />
                          ),
                          displayTemplate: (row) => {
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
                          },
                          others: {
                            maxWidth: 100,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "shift_id",
                          label: (
                            <AlgaehLabel label={{ fieldName: "shift_type" }} />
                          ),
                          displayTemplate: (row) => {
                            let x = Enumerable.from(this.state.shifts)
                              .where((w) => w.hims_d_shift_id === row.shift_id)
                              .firstOrDefault();
                            return <span>{x.shift_description}</span>;
                          },
                          others: {
                            maxWidth: 100,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "expected_cash",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Exp. Cash" }} />
                          ),
                          others: {
                            maxWidth: 100,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        // {
                        //   fieldName: "actual_cash",
                        //   label: (
                        //     <AlgaehLabel label={{ fieldName: "actual_cash" }} />
                        //   ),
                        //   others: {
                        //     resizable: false,
                        //     style: { textAlign: "center" }
                        //   }
                        // },
                        {
                          fieldName: "difference_cash",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Cash Diff." }} />
                          ),
                          others: {
                            maxWidth: 100,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "cash_status",
                          label: (
                            <AlgaehLabel label={{ fieldName: "cash_status" }} />
                          ),
                          displayTemplate: (row) => {
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
                            maxWidth: 100,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "expected_card",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Exp. Card" }} />
                          ),
                        },
                        // {
                        //   fieldName: "actual_card",
                        //   label: (
                        //     <AlgaehLabel label={{ fieldName: "actual_card" }} />
                        //   ),
                        //   others: {
                        //     resizable: false,
                        //     style: { textAlign: "center" }
                        //   }
                        // },
                        {
                          fieldName: "difference_card",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Card Diff." }} />
                          ),
                          others: {
                            maxWidth: 100,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "card_status",
                          label: (
                            <AlgaehLabel label={{ fieldName: "card_status" }} />
                          ),
                          displayTemplate: (row) => {
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
                            maxWidth: 100,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },

                        {
                          fieldName: "expected_cheque",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Exp. Cheque" }}
                            />
                          ),
                          others: {
                            maxWidth: 100,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        // {
                        //   fieldName: "actual_cheque",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ fieldName: "actual_cheque" }}
                        //     />
                        //   ),
                        //   others: {
                        //     resizable: false,
                        //     style: { textAlign: "center" }
                        //   }
                        // },
                        {
                          fieldName: "difference_cheque",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Cheque Diff." }}
                            />
                          ),
                          others: {
                            maxWidth: 100,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "cheque_status",
                          label: (
                            <AlgaehLabel
                              label={{ fieldName: "cheque_status" }}
                            />
                          ),
                          displayTemplate: (row) => {
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
                            maxWidth: 105,
                            resizable: false,
                            style: { textAlign: "center" },
                          },
                        },
                      ]}
                      keyId="hims_f_cash_handover_detail_id"
                      dataSource={{
                        data: this.state.cashHandoverDetails,
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
                            fieldName: "shift_open_date",
                          }}
                        />
                        <h6>{this.state.shift_open_date}</h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "shift_open_time",
                          }}
                        />
                        <h6>{this.state.shift_open_time}</h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "shift_close_date",
                          }}
                        />
                        <h6>{this.state.shift_close_date}</h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "shift_close_time",
                          }}
                        />
                        <h6>{this.state.shift_close_time}</h6>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12">
                        <AlgaehLabel
                          label={{
                            fieldName: "closed_by",
                          }}
                        />
                        <h6>Head of Department</h6>
                      </div>
                      <AlagehFormGroup
                        div={{ className: "col-lg-12" }}
                        label={{
                          fieldName: "remarks",
                          isImp: false,
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "remarks",
                          value: this.state.remarks,
                          disabled: this.state.shift_status === "A",
                          others: {
                            multiline: true,
                            rows: "3",
                          },
                          events: {
                            onChange: this.changeTexts.bind(this),
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="col-lg-8"
                    style={{ borderLeft: "1px solid #e5e5e5" }}
                  >
                    <div className="row">
                      {" "}
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Amount Received",
                          }}
                        />
                        <h6>{this.state.collected_cash}</h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Amount Refunded",
                          }}
                        />
                        <h6>{this.state.refunded_cash}</h6>
                      </div>
                      <div className="col-12">
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
                                    textBox={{
                                      className: "txt-fld",
                                      name: "actual_cash",
                                      value: this.state.actual_cash,
                                      disabled:
                                        this.state.shift_status === "A" ||
                                        !this.state.expected_cash,
                                      events: {
                                        onChange: this.handleCollection.bind(
                                          this
                                        ),
                                      },
                                      others: {
                                        type: "number",
                                        min: 0,
                                      },
                                    }}
                                  />
                                </span>
                              </td>
                              <td>
                                <span className="row">
                                  <AlagehFormGroup
                                    div={{ className: "col" }}
                                    textBox={{
                                      className: "txt-fld",
                                      name: "actual_card",
                                      value: this.state.actual_card,
                                      disabled:
                                        this.state.shift_status === "A" ||
                                        !this.state.expected_card,
                                      events: {
                                        onChange: this.handleCollection.bind(
                                          this
                                        ),
                                      },
                                      others: {
                                        type: "number",
                                        min: 0,
                                      },
                                    }}
                                  />
                                </span>
                              </td>
                              <td>
                                <span className="row">
                                  <AlagehFormGroup
                                    div={{ className: "col" }}
                                    textBox={{
                                      className: "txt-fld",
                                      name: "actual_cheque",
                                      value: this.state.actual_cheque,
                                      disabled:
                                        this.state.shift_status === "A" ||
                                        !this.state.expected_cheque,
                                      events: {
                                        onChange: this.handleCollection.bind(
                                          this
                                        ),
                                      },
                                      others: {
                                        type: "number",
                                        min: 0,
                                      },
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
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="row">
                        <button
                          disabled={this.disableBtn("C")}
                          onClick={this.authAndCloseShift.bind(this, "C")}
                          className="btn btn-primary"
                          style={{ marginLeft: 10, float: "right" }}
                        >
                          Close Shift
                        </button>
                        <button
                          disabled={this.disableBtn("A")}
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
