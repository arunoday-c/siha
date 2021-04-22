import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./ResultEntry.scss";
import "./../../../styles/site.scss";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp,
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";
import { FORMAT_YESNO } from "../../../utils/GlobalVariables.json";
import {
  onchangegridcol,
  getAnalytes,
  onvalidate,
  onconfirm,
  confirmedgridcol,
  onReRun,
  resultEntryUpdate,
  onchangegridresult,
  onchangeAmend,
  generateLabResultReport,
  addComments,
  deleteComment,
  ongridEditRanges,
  eidtRanges,
  reloadAnalytesMaster,
} from "./ResultEntryEvents";
import { ResultInput } from "./ResultInput";
import AlgaehReport from "../../Wrapper/printReports";
import {
  // AlgaehSecurityElement,
  AlgaehSecurityComponent,
  AlgaehButton,
  MainContext,
} from "algaeh-react-components";

class ResultEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test_analytes: [],
      run_type: "N",
      comments: "",
      comments_data: [],
      test_comments_id: null,
      comment_list: [],
      selcted_comments: "",
      ordered_by_name: "",
      entered_by_name: "",
      confirm_by_name: "",
      validate_by_name: "",
      edit_range: false,
      records_test_formula: [],
      loading: false,
      portal_exists: "N",
    };
  }
  static contextType = MainContext;
  componentDidMount() {
    if (
      this.props.labiologyusers === undefined ||
      this.props.labiologyusers.length === 0
    ) {
      this.props.getUserDetails({
        uri: "/algaehappuser/selectAppUsers",
        method: "GET",
        redux: {
          type: "LAB_EMP_GET_DATA",
          mappingName: "labiologyusers",
        },
      });
    }
    if (
      this.props.providers === undefined ||
      this.props.providers.length === 0
    ) {
      this.props.getProviderDetails({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",
        redux: {
          type: "DOCTOR_GET_DATA",
          mappingName: "providers",
        },
      });
    }

    if (
      this.props.labanalytes === undefined ||
      this.props.labanalytes.length === 0
    ) {
      this.props.getLabAnalytes({
        uri: "/labmasters/selectAnalytes",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "ANALYTES_GET_DATA",
          mappingName: "labanalytes",
        },
      });
    }
    const { portal_exists } = this.context.userToken;
    this.setState({ portal_exists });
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.selectedPatient !== undefined && newProps.open === true) {
      this.setState({ ...newProps.selectedPatient }, () => {
        getAnalytes(this);
      });
    }
  }

  selectCommentEvent(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value,
      selcted_comments: e.selected.commet,
    });
  }

  textAreaEvent(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value,
    });
  }

  textAreaEventGrid(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    let test_analytes = this.state.test_analytes;
    const _index = test_analytes.indexOf(row);

    row[name] = value;
    test_analytes[_index] = row;
    this.setState({
      test_analytes: test_analytes,
    });
  }

  showReport(refBy) {
    // console.log("test_analytes:", this.state.test_analytes);

    AlgaehReport({
      report: {
        fileName: "haematologyReport",
      },
      data: {
        investigation_name: this.state.service_name,
        test_analytes: this.state.test_analytes,
        payment_type: "cash",
        patient_code: this.state.patient_code,
        full_name: this.state.full_name,
        advance_amount: "",
        receipt_number: "",
        receipt_date: this.state.ordered_date,
        doctor_name: refBy,
        test_name: this.state.service_name,
        specimen: this.state.specimen,
      },
    });
  }

  isCritical = () => {
    const { test_analytes } = this.state;
    let status = test_analytes.some((el) => el.critical_type !== "N");
    return status;
  };

  onClose = (e) => {
    this.setState(
      {
        test_analytes: [],
        comments_data: [],
        test_comments_id: null,
        comment_list: [],
        edit_range: false,
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  dateFormater({ value }) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }
  onClickPrintHandle() {
    debugger;
    this.setState({ loading: true });
    generateLabResultReport(this.state)
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }
  render() {
    // let display =
    //   this.props.providers === undefined
    //     ? []
    //     : this.props.providers.filter(
    //         (f) => f.hims_d_employee_id === this.state.provider_id
    //       );
    // let isCritical = this.isCritical();
    // let color_display =
    //   this.state.critical_status === "N"
    //     ? "badge badge-primary"
    //     : "badge badge-danger";
    return (
      <div>
        <AlgaehModalPopUp
          class="labResultModalPopup"
          events={{
            onClose: this.onClose.bind(this),
          }}
          title="Result Entry"
          openPopup={this.props.open}
        >
          <div className="popupInner">
            <div className="popRightDiv">
              <div className="row">
                <div className="col-12 topbarPatientDetails">
                  <div className="row">
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Patient Name",
                        }}
                      />

                      <h6>
                        {this.state.full_name ? this.state.full_name : "------"}
                        <small
                          style={{ display: "block", fontStyle: "italic" }}
                        >
                          {this.state.patient_code}
                        </small>
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Test Name",
                        }}
                      />

                      <h6>
                        {this.state.service_name
                          ? this.state.service_name
                          : "------"}
                        {/* <small style={{display:"table",fontStyle:"italic"}}
                          className={`badge ${
                            isCritical ? "badge-danger" : "badge-primary"
                          }`}
                        >
                          {" "}
                          {isCritical ? "Critical" : "Normal"}
                        </small> */}
                      </h6>
                    </div>

                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Ordered By",
                        }}
                      />
                      <h6>
                        {this.state.ordered_by_name
                          ? this.state.ordered_by_name
                          : "------"}

                        {this.state.ordered_by_name ? (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            On{" "}
                            {moment(this.state.ordered_date).format(
                              `${Options.dateFormat} ${Options.timeFormat}`
                            )}
                          </small>
                        ) : (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            -------
                          </small>
                        )}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Entered By",
                        }}
                      />

                      <h6>
                        {this.state.entered_by_name
                          ? this.state.entered_by_name
                          : "------"}

                        {this.state.entered_by_name ? (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            On{" "}
                            {moment(this.state.entered_date).format(
                              `${Options.dateFormat} ${Options.timeFormat}`
                            )}
                          </small>
                        ) : (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            -------
                          </small>
                        )}
                      </h6>
                    </div>

                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Confirmed By",
                        }}
                      />

                      <h6>
                        {this.state.confirm_by_name
                          ? this.state.confirm_by_name
                          : "------"}

                        {this.state.confirm_by_name ? (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            On{" "}
                            {moment(this.state.confirmed_date).format(
                              `${Options.dateFormat} ${Options.timeFormat}`
                            )}
                          </small>
                        ) : (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            -------
                          </small>
                        )}
                      </h6>
                    </div>

                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Validated By",
                        }}
                      />

                      <h6>
                        {this.state.validate_by_name
                          ? this.state.validate_by_name
                          : "------"}

                        {this.state.validate_by_name ? (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            On{" "}
                            {moment(this.state.validated_date).format(
                              `${Options.dateFormat} ${Options.timeFormat}`
                            )}
                          </small>
                        ) : (
                          <small
                            style={{ display: "block", fontStyle: "italic" }}
                          >
                            -------
                          </small>
                        )}
                      </h6>
                    </div>
                    {/* <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Critical Result",
                        }}
                      />

                      <h6>
                        <small
                          className={`badge ${
                            isCritical ? "badge-danger" : "badge-primary"
                          }`}
                        >
                          {" "}
                          {isCritical ? "Yes" : "No"}
                        </small>
                      </h6>
                    </div> */}
                  </div>
                </div>
                <hr />
                <div className="col-12">
                  <div className="row">
                    <div className="col-9" id="labResultGrid_Cntr">
                      <AlgaehDataGrid
                        id="labResult_list_grid"
                        columns={[
                          {
                            fieldName: "status",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Analyte Status" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return row.status === "E" ? (
                                <span className="badge badge-secondary">
                                  Result Entered
                                </span>
                              ) : row.status === "C" ? (
                                <span className="badge badge-primary">
                                  Confirmed
                                </span>
                              ) : row.status === "V" ? (
                                <span className="badge badge-success">
                                  Validated
                                </span>
                              ) : (
                                <span className="badge badge-light">
                                  Result Not Entered
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 150,
                              resizable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "description", //"analyte_id",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Analyte" }} />
                            ),
                            // displayTemplate: (row) => {
                            //   let display =
                            //     this.props.labanalytes === undefined
                            //       ? []
                            //       : this.props.labanalytes.filter(
                            //           (f) =>
                            //             f.hims_d_lab_analytes_id ===
                            //             row.analyte_id
                            //         );

                            //   return (
                            //     <span>
                            //       {display !== null && display.length !== 0
                            //         ? display[0].description
                            //         : ""}
                            //     </span>
                            //   );
                            // },
                            others: {
                              minWidth: 250,
                              resizable: false,
                              style: { textAlign: "left" },
                            },
                          },
                          {
                            fieldName: "analyte_type",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Analyte Type" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return row.analyte_type === "QU"
                                ? "Quality"
                                : row.analyte_type === "QN"
                                ? "Quantity"
                                : "Text";
                            },
                            others: {
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "result",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Result",
                                }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.validate === "N" ? (
                                    row.analyte_type === "QU" ? (
                                      <AlagehAutoComplete
                                        div={{ className: "noLabel" }}
                                        selector={{
                                          name: "result",
                                          className: "select-fld",
                                          value: row.result,
                                          dataSource: {
                                            textField: "name",
                                            valueField: "value",
                                            data: [
                                              {
                                                name: "Positive",
                                                value: "Positive",
                                              },
                                              {
                                                name: "Negative",
                                                value: "Negative",
                                              },
                                              {
                                                name: "Not Seen",
                                                value: "Not Seen",
                                              },
                                              {
                                                name: "Reactive",
                                                value: "Reactive",
                                              },
                                              {
                                                name: "Non-Reactive",
                                                value: "Non-Reactive",
                                              },
                                            ],
                                          },
                                          onChange: onchangegridresult.bind(
                                            this,
                                            this,
                                            row
                                          ),
                                        }}
                                      />
                                    ) : (
                                      <ResultInput
                                        row={row}
                                        onChange={(e) =>
                                          onchangegridresult(this, row, e)
                                        }
                                      />
                                    )
                                  ) : (
                                    row.result
                                  )}
                                </span>
                              );
                            },
                            others: {
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },

                          {
                            fieldName: "result_unit",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Units" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.result_unit !== "NULL"
                                    ? row.result_unit
                                    : "--"}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "run1",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Run 1",
                                }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.run1 !== "null" ? row.run1 : "----"}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },

                          {
                            fieldName: "run2",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Run 2" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.run2 !== "null" ? row.run2 : "----"}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "run3",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Run 3" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.run3 !== "null" ? row.run3 : "----"}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "critical_type",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Critical Type" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return !row.critical_type ? null : row.critical_type ===
                                "N" ? (
                                <span className="badge badge-success">
                                  Normal
                                </span>
                              ) : row.critical_type === "L" ? (
                                <span className="badge badge-warning">Low</span>
                              ) : (
                                row.critical_type === "H" && (
                                  <span className="badge badge-danger">
                                    High
                                  </span>
                                )
                              );
                            },
                          },
                          {
                            fieldName: "normal_low",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Normal Low" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return this.state.edit_range === true &&
                                row.analyte_type === "QN" ? (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.normal_low,
                                    className: "txt-fld",
                                    name: "normal_low",
                                    events: {
                                      onChange: ongridEditRanges.bind(
                                        this,
                                        this,
                                        row
                                      ),
                                    },
                                  }}
                                />
                              ) : (
                                row.normal_low
                              );
                            },
                            others: {
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "normal_high",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Normal High" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return this.state.edit_range === true &&
                                row.analyte_type === "QN" ? (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.normal_high,
                                    className: "txt-fld",
                                    name: "normal_high",
                                    events: {
                                      onChange: ongridEditRanges.bind(
                                        this,
                                        this,
                                        row
                                      ),
                                    },
                                  }}
                                />
                              ) : (
                                row.normal_high
                              );
                            },
                            others: {
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "dis_text_value",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Default Value" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return (
                                // normal_qualitative_value
                                row.normal_qualitative_value === "QU" ? (
                                  row.normal_qualitative_value
                                ) : this.state.edit_range === true &&
                                  row.analyte_type === "T" ? (
                                  <textarea
                                    value={row.text_value}
                                    name="text_value"
                                    onChange={(e) =>
                                      this.textAreaEventGrid(row, e)
                                    }
                                  />
                                ) : (
                                  <ul className="analyteTxtUL">
                                    {row.dis_text_value.length > 0
                                      ? row.dis_text_value.map((row) => {
                                          return <li>{row}</li>;
                                        })
                                      : "-"}
                                  </ul>
                                )
                              );
                            },
                            others: {
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                              minWidth: 200,
                            },
                          },
                          {
                            fieldName: "confirm",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Confirm" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.validate === "N" ? (
                                    <AlagehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "confirm",
                                        className: "select-fld",
                                        value: row.confirm,
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: FORMAT_YESNO,
                                        },
                                        onChange: confirmedgridcol.bind(
                                          this,
                                          this,
                                          row
                                        ),
                                      }}
                                    />
                                  ) : row.confirm === "N" ? (
                                    "No"
                                  ) : (
                                    "Yes"
                                  )}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "validate",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Validate" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.validate === "N" ? (
                                    <AlagehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "validate",
                                        className: "select-fld",
                                        value: row.validate,
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: FORMAT_YESNO,
                                        },
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        ),
                                      }}
                                    />
                                  ) : row.confirm === "N" ? (
                                    "No"
                                  ) : (
                                    "Yes"
                                  )}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          //TODO
                          {
                            fieldName: "amended",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Amend" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.amended === "N" ? (
                                    <AlagehAutoComplete
                                      div={{ className: "noLabel" }}
                                      selector={{
                                        name: "amended",
                                        className: "select-fld",
                                        value: row.amended,
                                        dataSource: {
                                          textField: "name",
                                          valueField: "value",
                                          data: FORMAT_YESNO,
                                        },
                                        onChange: onchangeAmend.bind(
                                          this,
                                          this,
                                          row
                                        ),
                                      }}
                                    />
                                  ) : row.amended === "N" ? (
                                    "No"
                                  ) : (
                                    "Yes"
                                  )}
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 70,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" },
                            },
                          },
                          {
                            fieldName: "remarks",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Remarks",
                                }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.validate === "N" ? (
                                    <AlagehFormGroup
                                      div={{ className: "noLabel" }}
                                      textBox={{
                                        value: row.remarks,
                                        className: "txt-fld",
                                        name: "remarks",
                                        events: {
                                          onChange: onchangegridcol.bind(
                                            this,
                                            this,
                                            row
                                          ),
                                        },
                                      }}
                                    />
                                  ) : row.remarks !== "null" ? (
                                    row.remarks
                                  ) : (
                                    ""
                                  )}
                                </span>
                              );
                            },
                            others: {
                              filterable: false,
                              minWidth: 250,
                              resizable: false,
                            },
                          },
                        ]}
                        keyId="patient_code"
                        filter={true}
                        dataSource={{
                          data: this.state.test_analytes,
                        }}
                        paging={{ page: 0, rowsPerPage: 30 }}
                      />
                    </div>
                    <div className="col-3">
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col-12  form-group" }}
                          label={{
                            forceLabel: "Select Comment",
                          }}
                          selector={{
                            name: "test_comments_id",
                            className: "select-fld",
                            value: this.state.test_comments_id,
                            dataSource: {
                              textField: "commnet_name",
                              valueField:
                                "hims_d_investigation_test_comments_id",
                              data: this.state.comments_data,
                            },
                            onChange: this.selectCommentEvent.bind(this),
                            onClear: () => {
                              this.setState({
                                test_comments_id: null,
                                selcted_comments: "",
                              });
                            },
                          }}
                        />
                        <div className="col-12">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Enter Comment",
                            }}
                          />

                          <textarea
                            value={this.state.selcted_comments}
                            name="selcted_comments"
                            onChange={this.textAreaEvent.bind(this)}
                          />
                        </div>

                        <div className="col-12" style={{ textAlign: "right" }}>
                          <button
                            onClick={addComments.bind(this, this)}
                            className="btn btn-default"
                            style={{ marginBottom: 15 }}
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="row finalCommentsSection">
                          <h6>View Final Comments</h6>
                          <ol>
                            {this.state.comment_list.length > 0
                              ? this.state.comment_list.map((row, index) => {
                                  return (
                                    <React.Fragment key={index}>
                                      <li key={index}>
                                        <span>{row}</span>
                                        <i
                                          className="fas fa-times"
                                          onClick={deleteComment.bind(
                                            this,
                                            this,
                                            row
                                          )}
                                        ></i>
                                      </li>
                                    </React.Fragment>
                                  );
                                })
                              : null}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="popupFooter">
            <div className="col-12 ">
              <div className="row">
                <div className="col-lg-6 leftBtnGroup">
                  {" "}
                  <AlgaehSecurityComponent componentCode="PRI_LAB_RES">
                    <AlgaehButton
                      className="btn btn-default"
                      loading={this.state.loading}
                      onClick={this.onClickPrintHandle.bind(this)}
                      disabled={this.state.status === "V" ? false : true}
                    >
                      Print
                    </AlgaehButton>
                    {/* <button
                      className="btn btn-default"
                      onClick={this.onClickPrintHandle.bind(this)}
                      disabled={this.state.status === "V" ? false : true}
                    >
                      Print
                    </button> */}
                  </AlgaehSecurityComponent>
                  <AlgaehSecurityComponent componentCode="EDIT_RANGE_LAB_RES">
                    <button
                      type="button"
                      className="btn btn-default"
                      disabled={this.state.status === "V" ? true : false}
                      onClick={eidtRanges.bind(this, this)}
                    >
                      Edit Ranges
                    </button>
                  </AlgaehSecurityComponent>
                  <AlgaehSecurityComponent componentCode="RELOAD_ANALYTES_MAS">
                    <button
                      type="button"
                      className="btn btn-default"
                      // disabled={this.state.status === "V" ? true : false}
                      onClick={reloadAnalytesMaster.bind(this, this)}
                    >
                      Reload Analytes
                    </button>
                  </AlgaehSecurityComponent>
                </div>
                <div className="col-lg-6">
                  {/* <button
                className="btn btn-primary"
                onClick={this.showReport.bind(
                  this,
                  display !== null && display.length !== 0
                    ? display[0].full_name
                    : ""
                )}
                disabled={this.state.status === "V" ? false : true}
              >
                Print
              </button> */}

                  <AlgaehSecurityComponent componentCode="VAL_LAB_RES">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={onvalidate.bind(this, this)}
                      disabled={
                        this.state.status === "V" ||
                        this.state.entered_by_name === "" ||
                        this.state.confirm_by_name === ""
                          ? true
                          : false
                      }
                    >
                      Validate All
                    </button>
                  </AlgaehSecurityComponent>

                  <AlgaehSecurityComponent componentCode="CONF_LAB_RES">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={onconfirm.bind(this, this)}
                      disabled={
                        this.state.status === "C" ||
                        this.state.entered_by_name === ""
                          ? true
                          : this.state.status === "V"
                          ? true
                          : false
                      }
                    >
                      Confirm All
                    </button>
                  </AlgaehSecurityComponent>
                  <AlgaehSecurityComponent componentCode="SAVE_LAB_RES">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={resultEntryUpdate.bind(this, this)}
                      disabled={this.state.status === "V" ? true : false}
                    >
                      Save
                    </button>
                  </AlgaehSecurityComponent>

                  <AlgaehSecurityComponent componentCode="RE_RUN_LAB_RES">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={onReRun.bind(this, this)}
                      disabled={
                        this.state.entered_by !== null
                          ? this.state.run_type === 3
                            ? true
                            : false
                          : true
                      }
                    >
                      Re-Run
                    </button>
                  </AlgaehSecurityComponent>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={(e) => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    labiologyusers: state.labiologyusers,
    providers: state.providers,
    testanalytes: state.testanalytes,
    labanalytes: state.labanalytes,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserDetails: AlgaehActions,
      getProviderDetails: AlgaehActions,
      getTestAnalytes: AlgaehActions,
      getLabAnalytes: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ResultEntry)
);

// {
//   fieldName: "critical_low",
//   label: (
//     <AlgaehLabel
//       label={{
//         forceLabel: "Critical Low"
//       }}
//     />
//   ),
//   others: {
//     resizable: false,
//     filterable: false,
//     style: { textAlign: "center" }
//   }
// },

// {
//   fieldName: "critical_high",
//   label: (
//     <AlgaehLabel
//       label={{ forceLabel: "Critical High" }}
//     />
//   ),
//   others: {
//     resizable: false,
//     filterable: false,
//     style: { textAlign: "center" }
//   }
// },

// displayTemplate: row => {
//   return !row.critical_type ? null : row.critical_type ===
//     "N" ? (
//       <span className="badge badge-success">
//         Normal
//     </span>
//     ) : row.critical_type === "CL" ? (
//       <span className="badge badge-danger">
//         Critical Low
//     </span>
//     ) : row.critical_type === "CH" ? (
//       <span className="badge badge-danger">
//         Critical High
//     </span>
//     ) : row.critical_type === "L" || row.critical_type === "CL" ? (
//       <span className="badge badge-warning">Low</span>
//     ) : (
//             row.critical_type === "H" && (
//               <span className="badge badge-warning">
//                 High
//       </span>
//             )
//           );
// }
